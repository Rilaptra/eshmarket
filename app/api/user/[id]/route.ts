import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import { decrypt } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) return NextResponse.json({ error: "Invalid ID!" }, { status: 403 });

  try {
    const discord_id = decrypt(id);

    const user = await User.findOne({ discord_id }).lean().exec();
    if (!user) {
      return NextResponse.json({ status: 404, message: "User not found" });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ status: 500, message: "Internal server error" });
  }
}
