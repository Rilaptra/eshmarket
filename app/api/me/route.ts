import { NextRequest, NextResponse } from "next/server";

import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb"; // adjust the import path as needed
import { decrypt } from "@/lib/utils";

export async function GET(request: NextRequest) {
  await dbConnect();

  const _id = request.cookies.get("discord_id")?.value || "";
  const discord_id = decrypt(_id);
  const users = await User.findOne({ discord_id }).lean().exec();
  return NextResponse.json({ status: 200, data: users });
}

export async function POST(request: Request) {
  await dbConnect();

  const bodyObject = await request.json();
  const newUser = await User.create(bodyObject);
  return NextResponse.json(newUser);
}
