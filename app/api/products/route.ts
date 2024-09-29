import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; // adjust the import path as needed
import Product from "@/lib/models/Product";

export async function GET() {
  await dbConnect();

  const products = await Product.find({});
  return NextResponse.json({ status: 200, data: products });
}

export async function POST(request: Request) {
  await dbConnect();

  const bodyObject: {
    title: string;
    description: string;
    price: { dl: number; money: number };
    showcaseLink: string;
    content: string;
  } = await request.json();
  const newProduct = await Product.create({
    title: bodyObject.title,
    description: bodyObject.description,
    price: bodyObject.price,
    showcaseLink: bodyObject.showcaseLink,
    content: bodyObject.content,
  });
  return NextResponse.json(newProduct);
}
