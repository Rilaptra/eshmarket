import {
  DiscordEmbedMessage,
  createDM,
  getWebhook,
  sendDiscordWebhook,
  sendMessageWithFileAndEmbed,
} from "@/lib/discord";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import DiscordWebhook from "@/lib/models/Webhook";
import dbConnect from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  const data = await request.formData();
  const productId = data.get("productId") as string;
  const userId = data.get("userId") as string;
  const screenrecord = data.get("screenrecord") as File;

  const product = await Product.findById(productId);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const formData = new FormData();
  formData.append(
    "file",
    screenrecord,
    !screenrecord.name.endsWith("mp4")
      ? `${screenrecord.name}.mp4`
      : screenrecord.name
  );

  const acceptUrl = `https://${request.headers.get("host")}/api/dl?id=${
    product._id
  }&user=${user._id}`;

  const embed: DiscordEmbedMessage = {
    title: "New Buy Request",
    color: 0x00ff00,
    timestamp: new Date().toISOString(),
    thumbnail: {
      url: user.profileImage || "",
    },
    description: `# [Accept Request](${acceptUrl})`,
    fields: [
      {
        name: "User Info:",
        value: `- Username: ${user.username}\n- Discord ID: \`${user.discord_id}\` | <@${user.discord_id}>\n- User ID: \`${user._id}\``,
        inline: true,
      },
      {
        name: "Product Info:",
        value: `- Product Name: ${product.title}\n- Product ID: \`${
          product._id
        }\`\n- Product Price: \n - ${
          product.price.dl
        } <:dl_erzy:1234126544801239040> \n - Rp ${product.price.money.toLocaleString(
          "id-ID",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}`,
        inline: true,
      },
    ],
  };

  formData.append(
    "payload_json",
    JSON.stringify({
      embeds: [embed],
    })
  );

  const webhookResponse = await sendDiscordWebhook(formData);
  await DiscordWebhook.create({
    userId: user._id,
    timestamp: webhookResponse.timestamp,
    origin: request.headers.get("host") || "localhost",
    messageid: webhookResponse.id,
  });

  const newEmbed: DiscordEmbedMessage = {
    ...embed,
    description: `# [Accept Request](${acceptUrl}&webhook=${webhookResponse.id})`,
  };
  await (await getWebhook(webhookResponse.id)).edit({ embeds: [newEmbed] });

  user.scriptBuyed.push(product.title);
  await user.save();

  return NextResponse.json({ message: "success" }, { status: 200 });
}

export async function GET(request: NextRequest) {
  await dbConnect();
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get("id");
  const userId = searchParams.get("user");
  const webhookId = searchParams.get("webhook");

  if (!productId || !userId || !webhookId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const product = await Product.findById(productId);
  const user = await User.findById(userId);

  if (!product || !user) {
    return NextResponse.json(
      { error: "Product or user not found" },
      { status: 404 }
    );
  }

  const webhook = await DiscordWebhook.findOneAndDelete({
    messageid: webhookId,
  });
  if (!webhook) {
    return NextResponse.json(
      { error: "No webhook found for this user" },
      { status: 404 }
    );
  }

  const dmChannelId = await createDM(
    user.discord_id,
    process.env.DISCORD_TOKEN!
  );
  const file = new File([product.content], `${product.title}.lua`, {
    type: "text/lua",
  });
  await sendMessageWithFileAndEmbed(
    dmChannelId,
    process.env.DISCORD_TOKEN!,
    file
  );

  const updatedEmbed: DiscordEmbedMessage = {
    title: "Buy Request Accepted",
    description: `> Buy request with product ${product.title} has been accepted.
- Buyer: ${user.username} | <@${user.discord_id}> | ${user.discord_id}
- Product: ${product.title}, ${
      product.price.dl
    } <:dl_erzy:1234126544801239040> | Rp ${product.price.money.toLocaleString(
      "id-ID",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}
- Accepted date: ${new Date().toLocaleString("id-ID")} | <t:${Math.floor(
      Date.now() / 1000
    )}:R>`,
    color: "WHITE",
    timestamp: new Date().toISOString(),
  };

  await (
    await getWebhook(webhook.messageid)
  ).edit({
    embeds: [updatedEmbed],
  });

  return NextResponse.json({ message: "Accept buy request successful" });
}
