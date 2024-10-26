"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ShowPopUp } from "@/components/showPopUp";

interface ProductDownload {
  title: string;
  description: string;
  content: string;
}

interface IUser {
  _id: string;
  username: string;
  profileImage: string;
  role: string;
  isAdmin: boolean;
  discord_id: string;
  balance: {
    dl: number;
    money: number;
  };
  scriptBuyed: Array<string>;
}

export default function ProductDownloadPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDownload | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("userInfo");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();

        if (res.ok) {
          if (user.isAdmin || user.scriptBuyed.includes(data.title)) {
            const fullProductRes = await fetch(
              `/api/product/${id}?getAll=true`,
              {
                headers: {
                  "user-id": user._id,
                },
              }
            );
            const fullProductData = await fullProductRes.json();
            setProduct(fullProductData);
          } else {
            setProduct(null);
          }
        } else {
          console.error("Failed to fetch product:", data.message);
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <ShowPopUp
        type="WARNING"
        title="Login Required"
        message="Please log in to make a purchase."
        action={
          <Button
            onClick={() => setIsLoginPopupOpen(false)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Close
          </Button>
        }
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
      />
    );
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
