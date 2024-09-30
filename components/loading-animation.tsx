"use client";

import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity">
      <motion.div
        className="bg-white rounded-lg p-8 shadow-lg"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <ArrowPathIcon className="w-12 h-12 text-blue-500" />
        </motion.div>
        <motion.p
          className="mt-4 text-gray-700 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}
