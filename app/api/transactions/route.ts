import { NextResponse } from "next/server";

import Donation from "@/lib/models/Donation";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  await dbConnect();

  const transactions = await Donation.find({}).sort({ createdAt: -1 });
  return NextResponse.json(transactions);
}
