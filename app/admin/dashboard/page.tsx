"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Users } from "lucide-react";
import { Header } from "@/components/header";
import { IUser } from "@/lib/models/User";
import AdminGreeting from "@/components/admin-greeting";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const cardVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.3 } },
  };
  const [userInfo, setUserInfo] = useState<IUser | null>(null);

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      setUserInfo(JSON.parse(userInfoString));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="my-3">
          <AdminGreeting userInfo={userInfo} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/admin/products" className="block">
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={cardVariants}
            >
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    Product Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-8">
                  <Package
                    size={80}
                    className="text-blue-500 dark:text-blue-300"
                  />
                </CardContent>
                <CardFooter className="text-center text-gray-600 dark:text-gray-300">
                  Manage your product inventory, add new items, update prices,
                  and more.
                </CardFooter>
              </Card>
            </motion.div>
          </Link>

          <Link href="/admin/users" className="block">
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={cardVariants}
            >
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-8">
                  <Users
                    size={80}
                    className="text-green-500 dark:text-green-300"
                  />
                </CardContent>
                <CardFooter className="text-center text-gray-600 dark:text-gray-300">
                  View and manage user accounts, permissions, and activities.
                </CardFooter>
              </Card>
            </motion.div>
          </Link>
        </div>
      </main>
    </div>
  );
}
