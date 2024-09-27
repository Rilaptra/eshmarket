"use client";
import { Product } from "@/lib/interfaces";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import {
  ChevronDown,
  ChevronRightIcon,
  Menu,
  Search,
  ShoppingCart,
} from "lucide-react";
import { IUser } from "@/lib/models/User";
import { Input } from "./ui/input";

export function HomePageComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const { data } = await response.json();
        const sortedProducts = data
          .sort((a: Product, b: Product) => a.price.money - b.price.money)
          .map((product: Product) => ({
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

    async function fetchUser() {
      try {
        const response = await fetch(`/api/me`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const { data } = await response.json();
        setUserInfo(data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      }
    }

    fetchProducts();
    fetchUser();
  }, []);

  const handleLogin = () => {
    window.location.href =
      "https://discord.com/oauth2/authorize?client_id=1238151974382338118&response_type=code&redirect_uri=https%3A%2F%2Fd401-47-252-47-61.ngrok-free.app%2Fapi%2Flogin&scope=identify+guilds";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="Esh Market Logo"
                width={40}
                height={40}
              />
              <span className="hidden text-xl font-bold text-primary md:inline-block">
                Esh Market
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden flex-1 max-w-md mx-4 lg:flex">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <ShoppingCart size={20} />
              </Button>

              {userInfo && isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <span className="hidden md:inline text-sm font-medium">
                    {userInfo.username}
                  </span>
                  <Image
                    src={
                      userInfo.profileImage ||
                      "https://i.ibb.co/2dh4YL3/nulprofile.jpg"
                    }
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-primary"
                  />
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                >
                  <DiscordLogoIcon className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Login</span>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={20} />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Erzy.sh Market
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover amazing products at unbeatable prices.
                </p>
              </div>
              <Button
                className="inline-flex items-center rounded-md text-sm font-medium"
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Our Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Card key={index} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-2xl font-bold">
                      Rp{product.price.money / 1000}k / {product.price.dl} DL
                    </span>
                    <Button asChild>
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
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; 2024 Erzy.sh Market. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            &quot;The best way to predict the future is to create it.&quot; -
            Peter Drucker
          </p>
        </div>
      </footer>
    </div>
  );
}
