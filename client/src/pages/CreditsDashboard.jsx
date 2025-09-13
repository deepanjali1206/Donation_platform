import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Define gamified levels
const LEVELS = [
  { name: "Bronze", min: 0, max: 100, color: "from-orange-400 to-yellow-500", benefits: ["Basic recognition", "Access to donation history"] },
  { name: "Silver", min: 101, max: 300, color: "from-gray-400 to-gray-600", benefits: ["Silver badge", "Priority support", "Early access to campaigns"] },
  { name: "Gold", min: 301, max: 600, color: "from-yellow-400 to-yellow-600", benefits: ["Gold badge", "Profile highlight", "Special donor leaderboard"] },
  { name: "Platinum", min: 601, max: 1000, color: "from-blue-400 to-blue-600", benefits: ["Platinum badge", "Exclusive events", "VIP recognition"] },
  { name: "Diamond", min: 1001, max: Infinity, color: "from-purple-500 to-pink-600", benefits: ["Diamond badge", "Lifetime recognition", "Featured supporter"] },
];

export default function CreditsDashboard() {
  const [credits, setCredits] = useState({
    earned: 0,
    pending: 0,
    history: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Bronze");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchCredits = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/api/users/me/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { earned, pending, history } = res.data || {};

      setCredits({
        earned: earned || 0,
        pending: pending || 0,
        history: Array.isArray(history) ? history : [],
      });
    } catch (err) {
      console.error("❌ Error fetching credits:", err);
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE]);

  useEffect(() => {
    fetchCredits();
    const interval = setInterval(fetchCredits, 30_000);
    return () => clearInterval(interval);
  }, [fetchCredits]);

  if (loading) return <p className="text-center text-lg">Loading credits...</p>;

  // Determine current level
  const currentLevel =
    LEVELS.find((lvl) => credits.earned >= lvl.min && credits.earned <= lvl.max) ||
    LEVELS[LEVELS.length - 1];

  const nextLevel = LEVELS.find((lvl) => credits.earned < lvl.min);

  // Progress percentage
  const progress =
    ((credits.earned - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-10">
      <h2 className="text-4xl font-extrabold mb-8 text-center">💰 Credits Dashboard</h2>

      {/* Current Level Badge */}
      <div
        className={`p-8 rounded-2xl shadow-lg mb-10 bg-gradient-to-r ${currentLevel.color} text-white`}
      >
        <h3 className="text-3xl font-bold text-center">🏅 {currentLevel.name} Level</h3>
        <p className="text-center mt-2 text-lg">
          {credits.earned} credits{" "}
          {nextLevel && ` • Next: ${nextLevel.name} at ${nextLevel.min} credits`}
        </p>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-white/30 h-5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-5 bg-green-400 rounded-full"
          />
        </div>
      </div>

      {/* Credits summary */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="p-6 bg-green-100 text-center rounded-xl shadow-md">
          <p className="text-xl font-semibold">Earned Credits</p>
          <p className="text-4xl text-green-700 font-bold">{credits.earned}</p>
        </div>
        <div className="p-6 bg-yellow-100 text-center rounded-xl shadow-md">
          <p className="text-xl font-semibold">Pending Credits</p>
          <p className="text-4xl text-yellow-700 font-bold">{credits.pending}</p>
        </div>
      </div>

      {/* Gamified Levels Tabs */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h3 className="text-2xl font-bold mb-6 text-center">🎮 Gamified Levels</h3>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.name}
              onClick={() => setActiveTab(lvl.name)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === lvl.name
                  ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {lvl.name}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h4 className="text-xl font-bold mb-4">🏅 {activeTab} Benefits</h4>
          <ul className="list-disc pl-6 space-y-2 text-left max-w-md mx-auto">
            {LEVELS.find((lvl) => lvl.name === activeTab)?.benefits.map((benefit, i) => (
              <li key={i} className="text-lg">{benefit}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Credit history */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold mb-4">📜 Credit History</h3>
        {credits.history.length > 0 ? (
          <ul className="space-y-3">
            {credits.history
              .slice()
              .reverse()
              .map((entry, idx) => {
                const isPending = entry.status === "pending";
                return (
                  <li
                    key={idx}
                    className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <span>
                      {entry.type === "earn"
                        ? "➕ Earned"
                        : entry.type === "spend"
                        ? "➖ Spent"
                        : "⏳ Pending"}{" "}
                      <strong>{entry.amount || 0}</strong> –{" "}
                      {entry.reason || "No details"}
                    </span>
                    <span
                      className={`font-bold ${
                        isPending ? "text-yellow-600" : "text-green-600"
                      }`}
                    >
                      {isPending ? "pending" : "earned"}
                    </span>
                  </li>
                );
              })}
          </ul>
        ) : (
          <p className="text-gray-500">No credit history yet.</p>
        )}
      </div>
    </div>
  );
}
