import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import { decrypt } from "@/lib/utils";
import { cookies } from "next/headers";

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) return NextResponse.json({ error: "Invalid ID!" }, { status: 403 });

  const discord_id = decrypt(cookies().get("discord_id")?.value || "");
  if (!discord_id)
    return NextResponse.json({ error: "Unauthorized!" }, { status: 403 });

  // const isSenderAdmin = await User.findOne({ discord_id }).lean().exec();
  // if (!isSenderAdmin)
  //   return NextResponse.json({ error: "Unauthorized ID!" }, { status: 403 });
  // if (!isSenderAdmin.isAdmin)
  //   return NextResponse.json(
  //     { error: "Request blocked! You don't have any permissions" },
  //     { status: 403 }
  //   );

  const { isAdmin } = await request.json();

  const user = await User.findOneAndUpdate(
    { _id: id },
    { isAdmin, role: isAdmin ? "Admin" : "User" }
  )
    .lean()
    .exec();

  return NextResponse.json(user, { status: 200 });
}
