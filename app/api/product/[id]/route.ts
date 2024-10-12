import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  if (!body.title || !body.description || !body.price.dl || !body.price.money) {
    return NextResponse.json({
      status: 400,
      message: "Missing required fields",
    });
  }

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: body._id },
      body,
      { new: true, upsert: true }
    );
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error adding/updating product:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to add/update product",
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ status: 404, message: "Product not found" });
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to delete product",
    });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const product = await Product.findOne({ _id: id });

    if (!product) {
      return NextResponse.json({ status: 404, message: "Product not found" });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch product",
    });
  }
}
