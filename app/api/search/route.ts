import { NextRequest, NextResponse } from "next/server";

import Product from "@/lib/models/Product";
import dbConnect from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const searchQuery = request.nextUrl.searchParams.get("q");

  if (!searchQuery) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  console.log(searchQuery);

  try {
    await dbConnect();
    const products = await searchProducts(searchQuery);
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while searching" },
      { status: 500 }
    );
  }
}

async function searchProducts(query: string) {
  const searchRegex = new RegExp(query, "i");
  return Product.find({
    $or: [{ title: searchRegex }, { description: searchRegex }],
  }).limit(10);
}
