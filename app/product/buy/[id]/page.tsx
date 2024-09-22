'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
}

export default function ProductBuyPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const productId = params.id
    if (productId) {
      // Fetch product data based on id
      // This is a mock fetch, replace with actual API call
      setProduct({
        id: Number(productId),
        title: `Product ${productId}`,
        description: "This is a sample product description.",
        price: 99.99
      })
    }
  }, [params.id])

  if (!product) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{product.description}</p>
          <p className="text-2xl font-bold mt-4">${product.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => alert('Purchase completed!')}>
            Confirm Purchase
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}