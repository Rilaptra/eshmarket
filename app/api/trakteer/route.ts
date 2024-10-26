import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import Donation from "@/lib/models/Donation";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { decrypt } from "@/lib/utils";

export async function GET(request: NextRequest) {
  await dbConnect();

  const cookieStore = cookies();
  const discordId = decrypt(cookieStore.get("discord_id")?.value || "");

  if (!discordId) {
    return NextResponse.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }

  const productId = request.nextUrl.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { success: false, message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ discord_id: discordId });
    const product = await Product.findById(productId);

    if (!user || !product) {
      return NextResponse.json(
        { success: false, message: "User or product not found" },
        { status: 404 }
      );
    }

    // Check if the user has enough balance
    if (user.balance.money < product.price.money) {
      // Check if there's a recent donation matching the product price
      const recentDonation = await Donation.findOne({
        supporterName: user.username,
        amount: product.price.money,
        createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 10) }, // Within the last 10 minutes
      })
        .sort({ createdAt: -1 })
        .limit(1);

      if (!recentDonation) {
        return NextResponse.json(
          { success: false, message: "No matching recent donation found" },
          { status: 400 }
        );
      }
    }

    // Update user's balance and purchased scripts
    await User.findOneAndUpdate(
      { discordId },
      {
        $inc: { "balance.money": -product.price.money },
        $addToSet: { scriptBuyed: product.title },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying Trakteer payment:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    // Pastikan request berasal dari Trakteer.id
    const trakteerToken = request.headers.get("x-webhook-token");
    if (trakteerToken !== "trhook-9CVDaOEsSPIjJd6B8Hsdke8V") {
      return NextResponse.json(
        { error: "Unauthorized origin" },
        { status: 401 }
      );
    }

    // Ambil body dari request
    const body = await request.json();

    // Validasi dan proses data dari Trakteer.id
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Proses data dari Trakteer.id
    const { supporter_message, quantity, price } = body;

    const supporterName = await User.findOne({ discord_id: supporter_message })
      .lean()
      .exec();

    // Hitung jumlah donasi
    const donationAmount = quantity * price;

    // Simpan informasi donasi ke database
    const donation = await Donation.create({
      transactionId: new Date().getTime(),
      supporterName: supporterName || "Anonymous",
      amount: donationAmount,
    });

    // Update balance user (asumsikan supporter_message adalah username)
    await User.findOneAndUpdate(
      { username: supporterName },
      { $inc: { "balance.money": donationAmount } },
      { new: true }
    );

    // Kirim respons sukses
    return NextResponse.json(
      {
        message: "Donation received and processed successfully",
        savedData: donation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing Trakteer.id webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
