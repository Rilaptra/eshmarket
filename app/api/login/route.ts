import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { URLSearchParams } from "url";
import { DiscordOAuthToken, DiscordUser } from "@/lib/interfaces";
import User from "@/lib/models/User";
import { encrypt } from "@/lib/utils";

export async function GET(request: NextRequest) {
  // Membaca parameter 'code' dari query
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Token required!" }, { status: 400 });
  }

  await dbConnect();

  const fetchAuthData = new URLSearchParams({
    client_id: process.env.ClientID.toString(),
    client_secret: process.env.ClientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: "https://d401-47-252-47-61.ngrok-free.app/api/login",
  });

  try {
    const tokenResponse = await fetch(
      "https://discord.com/api/v10/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: fetchAuthData.toString(),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to fetch OAuth token");
    }

    const oauthData: DiscordOAuthToken = await tokenResponse.json();

    const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${oauthData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData: DiscordUser = await userResponse.json();

    const guildsResponse = await fetch(
      "https://discord.com/api/v10/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${oauthData.access_token}`,
        },
      }
    );

    if (!guildsResponse.ok) {
      throw new Error("Failed to fetch user guilds");
    }

    const guildsData = await guildsResponse.json();

    // Menambahkan guilds ke userData
    userData.guilds = guildsData;

    // Check apakah user terdaftar di database MongoDB
    let user = await User.findOne({ discord_id: userData.id });

    if (user) {
      // Update data user jika diperlukan
      user.username = userData.username;
      user.profileImage = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`;
      user.guilds = userData.guilds;
      await user.save();
    } else {
      // Jika user belum terdaftar, simpan data tersebut ke MongoDB
      user = await User.create({
        discord_id: userData.id,
        username: userData.username,
        profileImage: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`,
        role: "User",
        isAdmin: false,
        guilds: userData.guilds,
        balance: {
          dl: 0,
          money: 0,
        },
        scriptBuyed: [],
        chart: [],
      });
    }

    // Simpan discordId ke cookie
    const discordId = encrypt(`${user.discord_id}`);

    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("discord_id", discordId, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to authenticate!" },
      { status: 403 }
    );
  }
}
