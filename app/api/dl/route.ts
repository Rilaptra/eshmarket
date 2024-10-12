import { IProduct } from "@/lib/models/Product";
import { IUser } from "@/lib/models/User";
import { NextResponse, NextRequest } from "next/server";

export interface ProductBuyDL {
  product: IProduct | null | undefined;
  user: IUser | null | undefined;
  formData: FormData | null | undefined;
}
export async function POST(request: NextRequest) {
  const body = (await request.json()) as ProductBuyDL;
  if (!body.product || !body.user) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  console.log(body);
}
