'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import { ChevronDown } from 'lucide-react'

// Mock data for products
const products = [
  { id: 1, title: "Product 1", description: "This is a long description for product 1 that will be truncated.", price: 19.99 },
  { id: 2, title: "Product 2", description: "Another long description for product 2 that needs to be cut off.", price: 29.99 },
  { id: 3, title: "Product 3", description: "Yet another long description for product 3 that we'll shorten.", price: 39.99 },
]

export function HomePageComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    // Simulating login process
    setIsLoggedIn(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">WebStore</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center">
              {isLoggedIn ? (
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                >
                  <DiscordLogoIcon className="mr-2 h-4 w-4" />
                  Login with Discord
                </Button>
              )}
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
                  Welcome to WebStore
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover amazing products at unbeatable prices.
                </p>
              </div>
              <Button
                className="inline-flex items-center rounded-md text-sm font-medium"
                onClick={() => {
                  const productsSection = document.getElementById('products')
                  productsSection?.scrollIntoView({ behavior: 'smooth' })
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Our Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                    <Button asChild>
                      <Link href={`/product/buy/${product.id}`}>
                        Purchase
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
            © 2023 WebStore. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            "The best way to predict the future is to create it." - Peter Drucker
          </p>
        </div>
      </footer>
    </div>
  )
}