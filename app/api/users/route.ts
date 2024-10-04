import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  await dbConnect();

  const users = await User.find({}).select(
    "username profileImage role isAdmin discord_id balance"
  );
  return NextResponse.json({ status: 200, data: users });
}
