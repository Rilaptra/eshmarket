import { NextResponse } from "next/server";

import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  await dbConnect();

  const users = await User.find({}).select(
    "username profileImage role isAdmin discord_id balance"
  );
  return NextResponse.json({ status: 200, data: users });
}
