import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import Donation from "@/lib/models/Donation";
import { cookies } from "next/headers";
import Product from "@/lib/models/Product";

export async function GET(request: NextRequest) {
  await dbConnect();

  const cookieStore = cookies();
  const discordId = cookieStore.get("discord_id")?.value;

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
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Check if there's a recent donation matching the product price
    const recentDonation = await Donation.findOne({
      supporterName: user.username,
      amount: product.price.money,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Within the last day
    });

    if (!recentDonation) {
      return NextResponse.json(
        { success: false, message: "No matching recent donation found" },
        { status: 400 }
      );
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
    const { supporter_message, quantity, price, transaction_id } = body;

    // Hitung jumlah donasi
    const donationAmount = quantity * price;

    // Simpan informasi donasi ke database
    const donation = Donation.create({
      transactionId: transaction_id,
      supporterName: supporter_message,
      amount: donationAmount,
    });

    // Update balance user (asumsikan supporter_message adalah username)
    await User.findOneAndUpdate(
      { username: supporter_message },
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
