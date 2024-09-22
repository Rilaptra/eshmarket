import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const client = await clientPromise;
  const db = client.db("eshmarket");
  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(id) });
  if (!product) {
    return NextResponse.json({ status: 404, message: "Product not found" });
  }
  return NextResponse.json(product);
}
