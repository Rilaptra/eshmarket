"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import DLIcon from "@/components/dl.svg";
import PriceDisplay from "./pricedisplay";
import Image from "next/image";

interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: {
    dl: number;
    money: number;
  };
  showcaseLink: string;
  content: string;
}

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

  const ProductCard = ({
    product,
    loading,
  }: {
    product: IProduct;
    loading: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="flex flex-col justify-between bg-white dark:bg-gray-800 overflow-hidden">
        <CardHeader>
          {loading ? (
            <Skeleton className="h-8 w-3/4 mb-2" />
          ) : (
            <CardTitle className="text-gray-900 dark:text-white">
              {product.title}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
              {product.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          {loading ? (
            <>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-28" />
            </>
          ) : (
            <>
              <span className="text-lg text-gray-900 dark:text-white flex items-center">
                <PriceDisplay price={product.price.money} /> /{" "}
                {product.price.dl}
                <Image
                  src={DLIcon}
                  alt="DL"
                  className="ml-2"
                  width={24}
                  height={24}
                />
              </span>
              <Button
                asChild
                className="bg-black text-white hover:bg-gray-700 dark:bg-black dark:hover:bg-gray-700"
              >
                <Link href={`/product/buy/${product._id}`}>
                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-white">
      <main className="flex-1 h-screen">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
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
              {products.length > 0
                ? products.map((product, index) => (
                    <ProductCard
                      key={index}
                      product={product}
                      loading={false}
                    />
                  ))
                : Array(6)
                    .fill(null)
                    .map((p, index) => (
                      <ProductCard key={index} product={p} loading={true} />
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
