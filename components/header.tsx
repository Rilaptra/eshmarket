import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IUser } from "@/lib/models/User";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Home,
} from "lucide-react";

export function Header() {
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fungsi untuk mengambil data user
  const fetchUserData = async () => {
    const response = await fetch(`/api/me`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const { data } = await response.json();
    return data;
  };

  // Fungsi untuk memeriksa apakah data sudah kadaluarsa (lebih dari 5 menit)
  const isDataExpired = (timestamp: number) => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 menit dalam milidetik
    return now - timestamp > fiveMinutes;
  };

  useEffect(() => {
    async function getUserInfo() {
      try {
        // Cek localStorage
        const storedUserInfo = localStorage.getItem("userInfo");
        const storedTimestamp = localStorage.getItem("userInfoTimestamp");

        if (storedUserInfo && storedTimestamp) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          const timestamp = parseInt(storedTimestamp, 10);

          if (!isDataExpired(timestamp)) {
            // Gunakan data dari localStorage jika belum kadaluarsa
            setUserInfo(parsedUserInfo);
            setIsLoggedIn(true);
            return;
          }
        }

        // Jika tidak ada data di localStorage atau data sudah kadaluarsa, lakukan fetch
        const data = await fetchUserData();

        // Simpan data baru ke localStorage
        localStorage.setItem("userInfo", JSON.stringify(data));
        localStorage.setItem("userInfoTimestamp", Date.now().toString());

        setUserInfo(data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      }
    }

    getUserInfo();
  }, []);

  const handleLogin = () => {
    alert("p");
    window.location.href =
      "https://discord.com/oauth2/authorize?client_id=1238151974382338118&response_type=code&redirect_uri=https%3A%2F%2Fd401-47-252-47-61.ngrok-free.app%2Fapi%2Flogin&scope=identify+guilds";
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout");
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 w-full lg:w-auto justify-center lg:justify-start"
          >
            <Image
              src="https://i.ibb.co/zbqtFBQ/1727490493494.jpg"
              alt="Esh Market Logo"
              width={40}
              height={40}
              className="rounded-lg bg-cover size"
            />
            <span className="text-xl font-bold text-primary w-full text-center lg:text-left block lg:inline-block">
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
            {isLoggedIn && userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 sm:h-10 md:h-12 sm:w-10 md:w-12 rounded-full p-0 overflow-hidden"
                  >
                    <Image
                      src={
                        userInfo.profileImage ||
                        "https://i.ibb.co/2dh4YL3/nulprofile.jpg"
                      }
                      alt="User Avatar"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full border-2 border-primary"
                    />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {window.location.pathname !== "/" && (
                    <DropdownMenuItem asChild>
                      <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Home</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setIsUserInfoOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cart">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Shopping Cart</span>
                    </Link>
                  </DropdownMenuItem>
                  {userInfo.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  asChild
                ></Button>
                <Button
                  onClick={handleLogin}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                >
                  <DiscordLogoIcon className="md:mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Login</span>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* User Info Dialog */}
      <Dialog open={isUserInfoOpen} onOpenChange={setIsUserInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Image
                src={
                  userInfo?.profileImage ||
                  "https://i.ibb.co/2dh4YL3/nulprofile.jpg"
                }
                alt="User Avatar"
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">{userInfo?.username}</h3>
                <p className="text-sm text-gray-500">{userInfo?.discord_id}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">User ID:</h4>
              <p>{userInfo?.discord_id}</p>
            </div>
            <div>
              <h4 className="font-semibold">Role:</h4>
              <p>{userInfo?.isAdmin ? "Admin" : "User"}</p>
            </div>
            {/* Add more user information fields as needed */}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
