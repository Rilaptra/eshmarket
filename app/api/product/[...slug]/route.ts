import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { decrypt } from "@/lib/utils";
import converter from "@/lib/converter";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const [id, method] = params.slug;
  if (!method) {
    const body = await request.json();
    if (
      !body.title ||
      !body.description ||
      !body.price.dl ||
      !body.price.money
    ) {
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

  switch (method) {
    case "dl":
      // Handle Diamond Lock purchase method
      const formData = await request.formData();
      const screenshot = formData.get("screenshot") as File;

      if (!screenshot) {
        return NextResponse.json({
          status: 400,
          message: "Screenshot is required",
        });
      }

      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json(
          { error: "Product Not Found" },
          { status: 404 }
        );
      }

      // take user cookie
      const userID = decrypt(request.cookies.get("discord_id")?.value || "");

      console.log(userID);

      if (!userID) {
        return NextResponse.json({ error: "Please Login!" }, { status: 401 });
      }

      const user = await User.findOne({ discord_id: userID }).lean().exec();

      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized, Please Login!" },
          { status: 401 }
        );
      }

      // check the screenshot content using tesseractjs
      try {
        const buffer = await screenshot.arrayBuffer();
        const imageData = new Uint8Array(buffer);

        // Convert Uint8Array to Blob
        const blob = new Blob([imageData], { type: screenshot.type });

        // Create a URL for the Blob
        const imageUrl = URL.createObjectURL(blob);

        console.log(imageUrl);

        // Recognize text from the image URL
        const text = await converter(imageUrl);

        // Remember to revoke the URL to free up memory
        URL.revokeObjectURL(imageUrl);

        const mediaContent = text.trim();
        console.log("Screenshot text:", mediaContent);

        if (
          mediaContent.includes("RAZUDEPO World Locked by XRZU") &&
          mediaContent.includes("places") &&
          mediaContent.includes("Diamond Lock into the Donation Box")
        ) {
          // Purchase successful, update the product's price
          // Add your logic here to update the product's price

          return NextResponse.json(
            { message: "Purchase successful" },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { message: "Invalid screenshot content" },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error("Error processing screenshot:", error);
        return NextResponse.json(
          { error: "Failed to process screenshot" },
          { status: 500 }
        );
      }

    case "trakteer":
      break;

    default:
      return NextResponse.json({ message: "Invalid method!" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const [id] = params.slug;

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
  { params }: { params: { slug: string[] } }
) {
  const [id] = params.slug;

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
