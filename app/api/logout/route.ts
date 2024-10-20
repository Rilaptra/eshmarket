import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Create a response that redirects to the home page
    const response = NextResponse.redirect(
      new URL(`https://${req.headers.get("host")}/`)
    );

    // Clear the discord_id cookie
    response.cookies.delete("discord_id");

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to logout!" }, { status: 500 });
  }
}
