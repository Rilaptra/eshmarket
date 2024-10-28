import { NextRequest, NextResponse } from "next/server";

import Product from "@/lib/models/Product";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
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
  await dbConnect();

  const id = params.id;
  const headers = request.headers;
  const userId = headers.get("user-id");
  if (!id) return NextResponse.json({ error: "Invalid ID!" }, { status: 403 });
  if (!userId)
    return NextResponse.json({ error: "Invalid User!" }, { status: 403 });
  const user = await User.findById(userId);
  if (!user)
    return NextResponse.json({ error: "User Not Found!" }, { status: 404 });

  const query = request.nextUrl.searchParams;
  if (query.get("getAll") === "true") {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ status: 404, message: "Product not found" });
    }

    if (
      !user.isAdmin ||
      user.role !== "Admin" ||
      !user.scriptBuyed.find((script) => script === product.title)
    ) {
      return NextResponse.json(
        { error: "You don't have permission" },
        { status: 401 }
      );
    }

    return NextResponse.json(product);
  }

  try {
    const product = await Product.findOne({ _id: id });

    if (!product) {
      return NextResponse.json({ status: 404, message: "Product not found" });
    }

    return NextResponse.json({
      title: product.title,
      price: product.price,
      _id: product._id,
      description: product.description,
      showcaseLink: product.showcaseLink,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch product",
    });
  }
}
