import { DiscordEmbedMessage, sendDiscordWebhook } from "@/lib/discord";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  // Ambil data dari request formData
  const data = await request.formData();
  const productId = data.get("productId") as string;
  const userId = data.get("userId") as string;
  const screenrecord = data.get("screenrecord") as File; // File yang akan dikirim

  const product = await Product.findById(productId);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Gunakan FormData untuk mengirim file dan embed
  const formData = new FormData();

  // Tambahkan file ke formData
  formData.append(
    "file",
    screenrecord,
    !screenrecord.name.endsWith("mp4")
      ? `${screenrecord.name}.mp4`
      : screenrecord.name
  );

  // Buat embed untuk dimasukkan ke formData
  const embed: DiscordEmbedMessage = {
    title: "New Buy Request",
    color: 0x00ff00, // Warna hijau
    timestamp: new Date().toISOString(),
    thumbnail: {
      url: user.profileImage || "",
    },
    description: `# (Accept Buy Request)[https://eshmarket.vercel.app/api/dl/accept?id=${product._id}&user=${user._id}]`,
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

  // Tambahkan embed ke formData sebagai payload_json
  formData.append(
    "payload_json",
    JSON.stringify({
      embeds: [embed],
    })
  );
  // Kirim formData ke Discord webhook
  await sendDiscordWebhook(formData);

  user.scriptBuyed.push(product.title);
  user.save();
  return NextResponse.json({ message: "success" }, { status: 200 });
}
