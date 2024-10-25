"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function LoadingAnimation() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const circleVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="text-center">
        <motion.div
          className="relative w-32 h-32"
          initial="hidden"
          animate="visible"
          variants={circleVariants}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-300"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <motion.circle
              className="text-white"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              initial={{ strokeDasharray: "0 283" }}
              animate={{ strokeDasharray: `${progress * 2.83} 283` }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        </motion.div>
        <motion.p
          className="mt-4 text-2xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Loading...
        </motion.p>
        <motion.p
          className="mt-2 text-lg text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {progress}%
        </motion.p>
      </div>
    </div>
  );
}
