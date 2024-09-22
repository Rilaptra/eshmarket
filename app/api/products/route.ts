import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'  // adjust the import path as needed

export async function GET() {
  const client = await clientPromise
  const db = client.db("eshmarket")
  
  const products = await db.collection("products").find({}).toArray()
  return NextResponse.json({ status: 200, data: products })
}

export async function POST(request: Request) {
  const client = await clientPromise
  const db = client.db("eshmarket")

  const bodyObject = await request.json()
  const newProduct = await db.collection("products").insertOne(bodyObject)
  return NextResponse.json(newProduct)
}