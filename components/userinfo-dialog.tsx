"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IUser } from "@/lib/models/User";
import Image from "next/image";
import { User, Coins, FileCode, Server, Shield, Sun, Moon } from "lucide-react";
import { RpIcon } from "./pricedisplay";
import DiamondLock from "./diamond-lock";
import { useTheme } from "next-themes";

// Import Google Fonts
import "@fontsource/poppins";
import "@fontsource/playfair-display";

interface UserInfoDialogProps {
  isUserInfoOpen: boolean;
  setIsUserInfoOpen: (open: boolean) => void;
  userInfo: IUser | null;
}

export const UserInfoDialog: React.FC<UserInfoDialogProps> = ({
  isUserInfoOpen,
  setIsUserInfoOpen,
  userInfo,
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Dialog open={isUserInfoOpen} onOpenChange={setIsUserInfoOpen}>
      <DialogContent className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 max-w-2xl w-full mx-auto sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 rounded-xl shadow-2xl backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 transition-all duration-300">
        <DialogHeader className="relative">
          <DialogTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-playfair mb-4">
            User Profile
          </DialogTitle>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute top-0 right-0 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 py-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <Image
                src={
                  userInfo?.profileImage ||
                  "https://i.ibb.co/2dh4YL3/nulprofile.jpg"
                }
                alt="User Avatar"
                width={100}
                height={100}
                className="rounded-full border-4 border-blue-300 dark:border-blue-600 shadow-lg w-24 h-24 sm:w-28 sm:h-28"
              />
              {userInfo?.isAdmin && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <Shield className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 font-playfair">
                {userInfo?.username}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-poppins">
                {userInfo?.discord_id}
              </p>
              {userInfo?.isAdmin && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mt-2">
                  <Shield className="w-3 h-3 mr-1" /> Admin
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <TabButton
              icon={<User className="w-4 h-4" />}
              label="Info"
              active={activeTab === "info"}
              onClick={() => setActiveTab("info")}
            />
            <TabButton
              icon={<Coins className="w-4 h-4" />}
              label="Balance"
              active={activeTab === "balance"}
              onClick={() => setActiveTab("balance")}
            />
            <TabButton
              icon={<FileCode className="w-4 h-4" />}
              label="Scripts"
              active={activeTab === "scripts"}
              onClick={() => setActiveTab("scripts")}
            />
            <TabButton
              icon={<Server className="w-4 h-4" />}
              label="Servers"
              active={activeTab === "servers"}
              onClick={() => setActiveTab("servers")}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {activeTab === "info" && (
                <div className="space-y-4">
                  <InfoItem label="User ID" value={userInfo?.discord_id} />
                  <InfoItem label="Role" value={userInfo?.role} />
                </div>
              )}
              {activeTab === "balance" && (
                <div className="space-y-4">
                  <InfoItem
                    label="DL Balance"
                    value={userInfo?.balance.dl}
                    icon={<DiamondLock s={24} />}
                  />
                  <InfoItem
                    label="Money Balance"
                    value={userInfo?.balance.money}
                    icon={<RpIcon />}
                  />
                </div>
              )}
              {activeTab === "scripts" && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    Scripts Bought:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userInfo?.scriptBuyed.map((script, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="px-2 sm:px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs sm:text-sm font-poppins"
                      >
                        {script}
                      </motion.span>
                    )) || "None"}
                  </div>
                </div>
              )}
              {activeTab === "servers" && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    Discord Servers Joined:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 sm:max-h-60 overflow-y-auto">
                    {userInfo?.guilds
                      ? userInfo?.guilds.map((guild, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="p-2 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs sm:text-sm flex items-center font-poppins"
                          >
                            <Server className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            {guild.name}
                          </motion.div>
                        ))
                      : "None"}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

const TabButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${
      active
        ? "bg-blue-500 text-white dark:bg-blue-600"
        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
    } transition-colors duration-200 font-poppins`}
  >
    {icon}
    <span className="ml-1 sm:ml-2">{label}</span>
  </motion.button>
);

const InfoItem: React.FC<{
  label: string;
  value: string | number | undefined;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-sm">
    <div className="flex items-center space-x-2">
      {icon && <div className="text-gray-500 dark:text-gray-400">{icon}</div>}
      <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 font-poppins">
        {label}
      </h4>
    </div>
    <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 font-poppins">
      {value}
    </p>
  </div>
);
