"use client";
import { IProduct } from "@/lib/models/Product";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDown, ChevronRightIcon } from "lucide-react";
import { Header } from "@/components/header"; // Import the new Header component

export function HomePageComponent() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const { data } = await response.json();
        const sortedProducts = data
          .sort((a: IProduct, b: IProduct) => a.price.money - b.price.money)
          .map((product: IProduct) => ({
            ...product,
            description:
              product.description.length > 100
                ? product.description.slice(0, 97) + "…"
                : product.description,
          }));
        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main className="flex-1 h-screen">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-normal sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900 dark:text-white">
                  Welcome to Erzy.sh Market
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
                  Discover amazing products at unbeatable prices.
                </p>
              </div>
              <Button
                className="inline-flex items-center rounded-md text-sm font-medium bg-black transition-colors duration-300 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-black"
                onClick={() => {
                  const productsSection = document.getElementById("products");
                  productsSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View Products
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-gray-900 dark:text-white">
              Our Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Card
                  key={index}
                  className="flex flex-col justify-between bg-white dark:bg-gray-800"
                >
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">
                      {product.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      Rp{product.price.money / 1000}k / {product.price.dl} DL
                    </span>
                    <Button
                      asChild
                      className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      <Link href={`/product/buy/${product._id}`}>
                        Learn More{" "}
                        <ChevronRightIcon className="ml-2 scale-75" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            &copy; 2024 Erzy.sh Market. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-300">
            &quot;The best way to predict the future is to create it.&quot; -
            Peter Drucker
          </p>
        </div>
      </footer>
    </div>
  );
}
