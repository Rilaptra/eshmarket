import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IUser } from "@/lib/models/User";
import Image from "next/image";
import { User, Coins, FileCode, Server, Shield } from "lucide-react";
import { RpIcon } from "./pricedisplay";
import DiamondLock from "./diamond-lock";

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

  return (
    <Dialog open={isUserInfoOpen} onOpenChange={setIsUserInfoOpen}>
      <DialogContent className="bg-gradient-to-br from-blue-50 to-purple-50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            User Profile
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 py-4"
        >
          <div className="flex items-center gap-6">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Image
                src={
                  userInfo?.profileImage ||
                  "https://i.ibb.co/2dh4YL3/nulprofile.jpg"
                }
                alt="User Avatar"
                width={100}
                height={100}
                className="rounded-full border-4 border-blue-300 shadow-lg"
              />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-blue-700">
                {userInfo?.username}
              </h3>
              <p className="text-sm text-gray-500">{userInfo?.discord_id}</p>
              {userInfo?.isAdmin && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                  <Shield className="w-3 h-3 mr-1" /> Admin
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <TabButton
              icon={<User />}
              label="Info"
              active={activeTab === "info"}
              onClick={() => setActiveTab("info")}
            />
            <TabButton
              icon={<Coins />}
              label="Balance"
              active={activeTab === "balance"}
              onClick={() => setActiveTab("balance")}
            />
            <TabButton
              icon={<FileCode />}
              label="Scripts"
              active={activeTab === "scripts"}
              onClick={() => setActiveTab("scripts")}
            />
            <TabButton
              icon={<Server />}
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
                  <h4 className="font-semibold mb-2">Scripts Bought:</h4>
                  <div className="flex flex-wrap gap-2">
                    {userInfo?.scriptBuyed.map((script, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                      >
                        {script}
                      </span>
                    )) || "None"}
                  </div>
                </div>
              )}
              {activeTab === "servers" && (
                <div>
                  <h4 className="font-semibold mb-2">
                    Discord Servers Joined:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {userInfo?.guilds
                      ? userInfo?.guilds.map((guild, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="p-2 rounded-lg bg-purple-100 text-purple-800 text-sm flex items-center"
                          >
                            <Server className="w-4 h-4 mr-2" />
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
    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
      active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
    }`}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </motion.button>
);

const InfoItem: React.FC<{
  label: string;
  value: string | number | undefined;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm">
    <div className="flex items-center space-x-2">
      {icon && <div className="text-gray-500">{icon}</div>}{" "}
      {/* Menampilkan ikon jika ada */}
      <h4 className="text-sm font-semibold text-gray-500">{label}</h4>
    </div>
    <p className="text-lg font-medium text-gray-800">{value}</p>
  </div>
);
