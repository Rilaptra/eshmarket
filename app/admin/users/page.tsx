"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, UserCog, UserMinus } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/components/toast";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import DiamondLock from "@/components/diamond-lock";
import PriceDisplay from "@/components/pricedisplay";

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
}

export default function AdminUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAdminStatusChange = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      });
      if (!response.ok) throw new Error("Failed to update admin status");
      const updatedUser = await response.json();
      setIsLoading(true);
      setUsers(users.map((user) => (user._id === userId ? updatedUser : user)));
      setIsLoading(false);
      showToast(
        true,
        `User ${currentStatus ? "demoted" : "promoted"} successfully`
      );
    } catch (error) {
      console.error("Error updating admin status:", error);
      showToast(false, "Failed to update admin status");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-64 h-8 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-[100px] mb-2" />
                    <Skeleton className="h-4 w-[80px] mb-2" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  <Skeleton className="h-4 w-[60px] mb-2" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <Skeleton className="h-10 w-[100px]" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user._id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.username}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      handleAdminStatusChange(user._id, user.isAdmin)
                    }
                  >
                    {user.isAdmin ? (
                      <>
                        <UserMinus className="mr-2 h-4 w-4" />
                        <span className="text-red-500">Demote</span>
                      </>
                    ) : (
                      <>
                        <UserCog className="mr-2 h-4 w-4" />
                        <span className="text-red-500">Make Admin</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Image
                  src={user.profileImage}
                  alt={user.username}
                  className="rounded-full"
                  width={16}
                  height={16}
                />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Role: {user.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Admin: {user.isAdmin ? "Yes" : "No"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Discord ID: {user.discord_id}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="text-sm">
                <p>DL:</p>
                <div className="flex gap-2 justify-between items-center">
                  <DiamondLock
                    s={24}
                    className="items-center -mr-2 inline-flex "
                  />
                  <span className="text-lg">{user.balance?.dl || 0}</span>
                </div>
                <p>
                  Money: <PriceDisplay price={user.balance?.money || 0} />
                </p>
              </div>
              <Link href={`/admin/user/${user._id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
