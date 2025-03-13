"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex justify-center items-center  h-screen">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-blue-600 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2, 
            }}
          />
        ))}
      </div>
    </div>
  );
}
