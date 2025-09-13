import React from "react";
import { Medal } from "lucide-react"; // optional: lucide-react icons

export default function Badge({ level }) {
  const badgeStyles = {
    Bronze: "bg-orange-400 text-white",
    Silver: "bg-gray-400 text-white",
    Gold: "bg-yellow-500 text-white",
    Platinum: "bg-blue-500 text-white",
    Diamond: "bg-purple-600 text-white",
  };

  return (
    <span
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold shadow-md ${badgeStyles[level] || "bg-gray-300"}`}
    >
      <Medal size={16} />
      {level}
    </span>
  );
}
