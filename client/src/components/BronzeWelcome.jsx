import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BronzeWelcome({ credits, currentLevel }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (currentLevel.name === "Bronze") {
      const hasSeen = localStorage.getItem("bronze_welcome_seen");
      if (!hasSeen && credits.earned >= currentLevel.min) {
        setShow(true);
        localStorage.setItem("bronze_welcome_seen", "true");
      }
    }
  }, [credits, currentLevel]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
    >
      🎉 Congrats! You’ve reached <strong>Bronze Level</strong>.  
      Keep going to unlock Silver benefits!
      <button
        onClick={() => setShow(false)}
        className="ml-4 bg-white text-orange-600 px-3 py-1 rounded-lg"
      >
        Close
      </button>
    </motion.div>
  );
}
