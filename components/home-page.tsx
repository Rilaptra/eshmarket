"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useInView } from "react-intersection-observer";
import {
  ArrowRight,
  ChevronDown,
  Search,
  Star,
  ShoppingCart,
  Heart,
} from "lucide-react";
import PriceDisplay from "../components/pricedisplay";

// Import Google Fonts
import "@fontsource/poppins";
import "@fontsource/playfair-display";
import { Button } from "./ui/button";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const ProductCard = ({
    product,
    index,
  }: {
    product: IProduct;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="h-full flex flex-col justify-between bg-white dark:bg-gray-800 overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white font-playfair">
            {product.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3 font-poppins">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center mt-auto">
          <PriceDisplay price={product.price.money} dl={product.price.dl} />
          <Button asChild variant="outline" className="group dark:text-white">
            <Link href={`/product/buy/${product._id}`}>
              <span className="flex items-center">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900 transition-colors duration-300">
      <header className="w-full py-4 px-6 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-playfair">
            Erzy.sh Market
          </h1>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center space-y-8 text-center"
            >
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 font-playfair">
                Welcome to Erzy.sh Market
              </h1>
              <p className="mx-auto max-w-[700px] text-xl text-gray-600 dark:text-gray-300 md:text-2xl font-poppins">
                Discover amazing products at unbeatable prices.
              </p>
              <Button
                size="lg"
                className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 dark:from-purple-400 dark:to-pink-400 dark:text-gray-900 dark:hover:from-purple-500 dark:hover:to-pink-500 transition-all duration-300 font-poppins"
                onClick={() => {
                  const productsSection = document.getElementById("products");
                  productsSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Products
                <ChevronDown className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="w-full py-20" ref={ref}>
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-4xl font-bold tracking-tight mb-8 text-center text-gray-900 dark:text-white font-playfair">
              Our Products
            </h2>
            <div className="mb-8 max-w-md mx-auto relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-purple-300 dark:border-purple-600 rounded-full focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-poppins"
              />
              <Search
                className="text-purple-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                size={18}
              />
            </div>
            <AnimatePresence>
              {inView && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      index={index}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-600 dark:text-gray-400 mt-8 font-poppins">
                No products found. Try adjusting your search.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-white dark:bg-gray-800 shadow-inner">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-4">
              <Star className="text-yellow-400" />
              <ShoppingCart className="text-purple-500" />
              <Heart className="text-pink-500" />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 font-poppins">
              &copy; 2024 Erzy.sh Market. All rights reserved.
            </p>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 italic font-playfair">
              &quot;The best way to predict the future is to create it.&quot; -
              Peter Drucker
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
