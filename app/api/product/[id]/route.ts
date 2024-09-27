import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const product = Product.findOne({ _id: id });
  if (!product) {
    return NextResponse.json({ status: 404, message: "Product not found" });
  }
  return NextResponse.json(product);
}
