import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create a response that redirects to the home page
    const response = NextResponse.redirect(
      new URL("https://d401-47-252-47-61.ngrok-free.app")
    );

    // Clear the discord_id cookie
    response.cookies.delete("discord_id");

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to logout!" }, { status: 500 });
  }
}
