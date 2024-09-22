"use client";
import { Product, User } from "@/lib/interfaces";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingAnimation } from "@/components/loading-animation";
import { PaymentMethods } from "@/components/payment-method";
import { ShoppingBasket } from "lucide-react";

export default function ProductBuyPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);

  function confirmPurchase() {}

  useEffect(() => {
    const productId = params.id;
    if (productId) {
      // Fetch product data based on id
      fetch(`/api/product/${productId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch product");
          }
          return response.json();
        })
        .then((data) => setProduct(data))
        .catch((error) => console.error(error));
    }
  }, [params.id]);

  useEffect(() => {
    // TODO: Fetch user data based on logged-in user
  }, []);

  if (!product) return <LoadingAnimation />;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{product.description}</p>
          <p
            className="text-2xl font-bold mt-4 mb-3
          "
          >
            Rp {product.price.money} or {product.price.dl} DLs
          </p>
          <PaymentMethods />
        </CardContent>
        <CardFooter>
          <Button onClick={() => alert("Purchase completed!")}>
            Confirm Purchase <ShoppingBasket className="scale-75 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
