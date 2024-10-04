"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";
import PriceDisplay from "@/components/pricedisplay";
import BuyConfirmationDialog from "@/components/buy-confirmation-dialog";
import TrakteerModal from "@/components/TrakteerModal";
import DiamondLock from "@/components/diamond-lock";

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

export default function ProductBuyPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrakteerModal, setShowTrakteerModal] = useState(false);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Simulating API call with setTimeout
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();
        console.log(data);
        if (data.status != 404) {
          setProduct(data);
          setLoading(false);
        } else {
          setProduct(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle buying with method Trakteer
  const handleBuyWithTrakteer = () => {
    setShowTrakteerModal(true);
  };

  const SkeletonLoader = () => (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="h-9 w-3/4" />
        </CardHeader>
        <CardContent className="grid gap-6">
          <Skeleton className="aspect-video w-full" />
          <div className="grid gap-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-6 w-1/4" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-full mr-2" />
          <Skeleton className="h-10 w-full ml-2" />
        </CardFooter>
      </Card>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center"
        >
          <FaExclamationTriangle className="text-yellow-500 text-5xl mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            We&apos;re sorry, but the product you&apos;re looking for
            doesn&apos;t seem to exist.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => window.history.back()}
          >
            Go Back
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{product.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            {product.showcaseLink ? (
              <iframe
                src={product.showcaseLink}
                title={`${product.title} showcase`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <Image
                src="/placeholder.svg"
                alt={product.title}
                layout="fill"
                objectFit="cover"
              />
            )}
          </div>
          <div className="grid gap-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {product.description}
            </p>
          </div>
          <div className="grid gap-2">
            <h2 className="text-xl font-semibold">Pricing</h2>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <DiamondLock s={24} />
                <span className="text-lg font-medium">
                  {product.price.dl} DL
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PriceDisplay price={product.price.money} />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            className="w-full flex items-center justify-center text-center px-2 py-3 text-sm sm:text-base"
            onClick={() => setIsBuyDialogOpen(true)}
          >
            <ShoppingCart className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="whitespace-normal">Purchase (Diamond Lock)</span>
          </Button>

          <BuyConfirmationDialog
            product={product}
            isOpen={isBuyDialogOpen}
            onClose={() => setIsBuyDialogOpen(false)}
          />
          <Button
            variant="outline"
            className="w-full flex items-center justify-center text-center px-2 py-3 text-sm sm:text-base"
            onClick={handleBuyWithTrakteer}
          >
            <ShoppingCart className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="whitespace-normal">Purchase (Trakteer)</span>
          </Button>
        </CardFooter>
      </Card>
      {showTrakteerModal && (
        <TrakteerModal
          isOpen={showTrakteerModal}
          onClose={() => setShowTrakteerModal(false)}
          productId={product._id}
          productTitle={product.title}
          price={product.price.money}
        />
      )}
    </div>
  );
}
