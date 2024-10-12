import { motion } from "framer-motion";
export default function LoadingBlue() {
  return (
    <div>
      <motion.div
        className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
