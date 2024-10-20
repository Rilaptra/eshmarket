"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Users, DollarSign } from "lucide-react";
import { IUser } from "@/lib/models/User";
import AdminGreeting from "@/components/admin-greeting";

export default function AdminDashboard() {
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      setUserInfo(JSON.parse(userInfoString));
    }
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <AdminGreeting userInfo={userInfo} />
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <Link href="/admin/products" passHref>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
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

          <Link href="/admin/users" passHref>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
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

          <Link href="/admin/transactions" passHref>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-8">
                  <DollarSign
                    size={80}
                    className="text-purple-500 dark:text-purple-300"
                  />
                </CardContent>
                <CardFooter className="text-center text-gray-600 dark:text-gray-300">
                  View and manage transactions, orders, and financial
                  activities.
                </CardFooter>
              </Card>
            </motion.div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
