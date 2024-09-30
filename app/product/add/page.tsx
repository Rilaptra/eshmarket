"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CircleDollarSign, Gem, Link2, PlusCircle } from "lucide-react";
import { showToast } from "@/components/toast";

interface IProduct {
  title: string;
  description: string;
  price: {
    dl: number;
    money: number;
  };
  showcaseLink: string;
  content: string;
}

export default function AddProductPage() {
  const [product, setProduct] = useState<IProduct>({
    title: "",
    description: "",
    price: {
      dl: 0,
      money: 0,
    },
    showcaseLink: "",
    content: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "dl" || name === "money") {
      setProduct((prev) => ({
        ...prev,
        price: { ...prev.price, [name]: parseFloat(value) },
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setProduct((prev) => ({ ...prev, content }));
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform any validation
    if (
      !product.title ||
      !product.description ||
      !product.price.dl ||
      !product.price.money
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    console.log(JSON.stringify(product));
    // Send the data to /api/products with POST method
    fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) {
          showToast(false, `Error: ${response.status}; ${response.statusText}`);
          throw new Error("Failed to add product");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log("Product added successfully:", data);
          showToast(true, "Product added successfully!");
          setProduct({
            title: "",
            description: "",
            price: { dl: 0, money: 0 },
            showcaseLink: "",
            content: "",
          });
        } else {
          console.error("Error adding product:", data.error);
        }
      });

    console.log("Product to add:", product);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-12 text-center text-gray-800 dark:text-gray-100">
          Add New Product
        </h1>
        <Card className="max-w-3xl mx-auto shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg">
                  Product Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={product.title}
                  onChange={handleInputChange}
                  required
                  className="text-lg"
                  placeholder="Enter product title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="resize-none text-lg"
                  rows={4}
                  placeholder="Describe your product"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dl" className="text-lg">
                    Price (DL)
                  </Label>
                  <div className="relative">
                    <Input
                      id="dl"
                      name="dl"
                      type="number"
                      step="1"
                      value={product.price.dl}
                      onChange={handleInputChange}
                      required
                      className="text-lg pl-8"
                    />
                    <Gem className="absolute left-3 size-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="money" className="text-lg">
                    Price (Money)
                  </Label>
                  <div className="relative">
                    <Input
                      id="money"
                      name="money"
                      type="number"
                      step="1000"
                      value={product.price.money}
                      onChange={handleInputChange}
                      required
                      className="text-lg pl-8"
                    />
                    <CircleDollarSign className="absolute left-3 size-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="showcaseLink" className="text-lg">
                  Showcase Link
                </Label>
                <div className="relative">
                  <Input
                    id="showcaseLink"
                    name="showcaseLink"
                    value={product.showcaseLink}
                    onChange={handleInputChange}
                    className="text-lg pl-10"
                    placeholder="https://"
                  />
                  <Link2 className="absolute left-3 size-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-lg">
                  Content
                </Label>
                <Input
                  id="content"
                  name="content"
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="text-lg"
                />
              </div>
              {product.content && (
                <div className="space-y-2">
                  <Label className="text-lg">File Content Preview</Label>
                  <div className="relative">
                    <Textarea
                      value={product.content}
                      readOnly
                      rows={5}
                      placeholder="Product details will appear here..."
                      className="w-full text-lg resize-none bg-gray-50 dark:bg-gray-700"
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                      {(product.content.length / 1024).toFixed(2)} Kb
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full text-lg py-6">
                <PlusCircle className="mr-2" />
                Add Product
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        {/* ... Footer content ... */}
      </footer>
    </div>
  );
}
