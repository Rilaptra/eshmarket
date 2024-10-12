"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductDownload {
  title: string;
  description: string;
  content: string;
}

export default function ProductDownloadPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDownload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
        } else {
          console.error("Failed to fetch product:", data.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return (
      <div>
        Product not found or you don&apos;t have permission to access it.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{product.description}</p>
          <h3 className="text-lg font-semibold mb-2">Script Preview:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {product.content.slice(0, 512)}{" "}
            {`(... ${((product.content.length - 512) / 1024).toFixed(2)} KB)`}
          </pre>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => navigator.clipboard.writeText(product.content)}
          >
            Download File
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
