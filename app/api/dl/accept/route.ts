import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  const searchParams = request.nextUrl.searchParams;
  // [https://eshmarket.vercel.app/api/dl/accept?id=${product._id}&user=${user._id}]
  const productId = searchParams.get("id");
  const userId = searchParams.get("user");

  const product = await Product.findById(productId);
  const user = await User.findById(userId);

  if (!product || !user) {
    return NextResponse.json({ error: "Missing product or user id" });
  }

  const createDM = async (userId: string, token: string): Promise<string> => {
    const url = "https://discord.com/api/v10/users/@me/channels";
    const payload = {
      recipient_id: userId,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data.id; // Mengembalikan DM channel ID
  };

  const sendMessageWithFileAndEmbed = async (
    channelId: string,
    token: string,
    file: File
  ) => {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;

    const formData = new FormData();

    // Menambahkan file ke formData
    formData.append("file", file, file.name);

    // Menambahkan embed ke formData
    const payload = {
      embeds: [
        {
          title: "This is an embed",
          description: "Embed description goes here",
          color: 3447003,
        },
      ],
    };

    formData.append("payload_json", JSON.stringify(payload));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        // Jangan atur Content-Type karena fetch secara otomatis akan mengatur multipart boundary.
      },
      body: formData,
    });

    if (response.ok) {
      console.log("Message sent successfully with file and embed!");
    } else {
      console.error("Error sending message:", response.statusText);
    }
  };

  const dmChannelId = await createDM(
    user.discord_id,
    process.env.DISCORD_TOKEN
  );
  const file = new File([product.content], `${product.title}.lua`, {
    type: "text/lua",
  });
  await sendMessageWithFileAndEmbed(
    dmChannelId,
    process.env.DISCORD_TOKEN,
    file
  );
}
