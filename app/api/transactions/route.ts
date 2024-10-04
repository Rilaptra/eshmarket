import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/lib/models/Donation";

export async function GET() {
  await dbConnect();

  const transactions = await Donation.find({}).sort({ createdAt: -1 });
  return NextResponse.json(transactions);
}
