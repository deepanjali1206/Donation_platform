
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import BronzeWelcome from "../components/BronzeWelcome";

const LEVELS = [
  {
    name: "Bronze",
    min: 0,
    max: 100,
    color: "from-[#cd7f32] to-[#a0522d]",
    benefits: ["Basic recognition", "Access to donation history"],
  },
  {
    name: "Silver",
    min: 101,
    max: 300,
    color: "from-[#c0c0c0] to-[#808080]",
    benefits: ["Silver badge", "Priority support", "Early access to campaigns"],
  },
  {
    name: "Gold",
    min: 301,
    max: 600,
    color: "from-[#FFD700] to-[#FFA500]",
    benefits: ["Gold badge", "Profile highlight", "Special donor leaderboard"],
  },
  {
    name: "Platinum",
    min: 601,
    max: 1000,
    color: "from-[#e5e4e2] to-[#b0c4de]",
    benefits: ["Platinum badge", "Exclusive events", "VIP recognition"],
  },
  {
    name: "Diamond",
    min: 1001,
    max: Infinity,
    color: "from-[#8e2de2] to-[#4a00e0]",
    benefits: ["Diamond badge", "Lifetime recognition", "Featured supporter"],
  },
];

const Badge = ({ level }) => {
  const badges = {
    Bronze: { emoji: "🥉", color: "#cd7f32" },
    Silver: { emoji: "🥈", color: "#C0C0C0" },
    Gold: { emoji: "🥇", color: "#FFD700" },
    Platinum: { emoji: "🏆", color: "#0066cc" },
    Diamond: { emoji: "💎", color: "#8e2de2" },
  };
  const badge = badges[level] || { emoji: "🎖", color: "#000" };
  return (
    <span
      style={{
        fontSize: "1.5rem",
        marginLeft: "0.5rem",
        color: badge.color,
      }}
      title={`${level} Donor`}
    >
      {badge.emoji}
    </span>
  );
};

export default function CreditsDashboard() {
  const [credits, setCredits] = useState({
    earned: 0,
    pending: 0,
    history: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Bronze");
  const [topDonors, setTopDonors] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
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

  const fetchTopDonors = useCallback(async () => {
    try {
      setLeaderboardLoading(true);
      const res = await axios.get(`${API_BASE}/api/users/top-donors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopDonors(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching top donors:", err);
    } finally {
      setLeaderboardLoading(false);
    }
  }, [token, API_BASE]);

  useEffect(() => {
    fetchCredits();
    fetchTopDonors();

    const interval = setInterval(() => {
      fetchCredits();
      fetchTopDonors();
    }, 30_000);

    return () => clearInterval(interval);
  }, [fetchCredits, fetchTopDonors]);

  if (loading)
    return <p className="text-center text-lg">Loading credits...</p>;

  const currentLevel =
    LEVELS.find(
      (lvl) => credits.earned >= lvl.min && credits.earned <= lvl.max
    ) || LEVELS[LEVELS.length - 1];

  const nextLevel = LEVELS.find((lvl) => credits.earned < lvl.min);

  const progress =
    ((credits.earned - currentLevel.min) / (currentLevel.max - currentLevel.min)) *
    100;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-10">
  
      <BronzeWelcome credits={credits} currentLevel={currentLevel} />

      <h2 className="text-4xl font-extrabold mb-8 text-center">
        💰 Credits Dashboard
      </h2>

      {["Gold", "Platinum", "Diamond"].includes(currentLevel.name) && (
        <div
          className={`p-4 mb-6 rounded-xl shadow-lg text-center border-4`}
          style={{
            borderColor: currentLevel.color.split("to")[1],
            backgroundColor: "#fff7e6",
          }}
        >
          🌟 You are a <strong>{currentLevel.name}</strong> donor! Your profile
          is highlighted.
        </div>
      )}

      <div
        className={`p-8 rounded-2xl shadow-lg mb-10 bg-gradient-to-r ${currentLevel.color} text-white`}
      >
        <h3 className="text-3xl font-bold text-center flex justify-center items-center gap-2">
          🏅 {currentLevel.name} Level <Badge level={currentLevel.name} />
        </h3>
        <p className="text-center mt-2 text-lg">
          {credits.earned} credits{" "}
          {nextLevel && ` • Next: ${nextLevel.name} at ${nextLevel.min} credits`}
        </p>
        <div className="mt-6 w-full bg-white/30 h-5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-5 bg-green-400 rounded-full"
          />
        </div>
      </div>

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

      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h3 className="text-2xl font-bold mb-6 text-center">
          🎮 Gamified Levels
        </h3>
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
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h4 className="text-xl font-bold mb-4">🏅 {activeTab} Benefits</h4>
          <ul className="list-disc pl-6 space-y-2 text-left max-w-md mx-auto">
            {LEVELS.find((lvl) => lvl.name === activeTab)?.benefits.map(
              (benefit, i) => (
                <li key={i} className="text-lg">
                  {benefit}
                </li>
              )
            )}
          </ul>
        </motion.div>
      </div>

      {["Gold", "Platinum", "Diamond"].includes(currentLevel.name) && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-10">
          <h3 className="text-2xl font-bold mb-4 text-center">
            🏆 Special Donor Leaderboard
          </h3>
          {leaderboardLoading ? (
            <p className="text-center text-gray-500">Loading leaderboard...</p>
          ) : topDonors.length > 0 ? (
            <ul className="max-w-md mx-auto space-y-2">
              {topDonors.map((donor, idx) => (
                <li
                  key={idx}
                  className="p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span>
                    {idx + 1}. {donor.name || "Anonymous"}
                  </span>
                  <span className="font-bold text-green-600">
                    {donor.credits} credits
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No top donors available yet.
            </p>
          )}
        </div>
      )}

      {["Platinum", "Diamond"].includes(currentLevel.name) && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-10">
          <h3 className="text-2xl font-bold mb-4 text-center">
            🎉 Exclusive Events & VIP Recognition
          </h3>
          <ul className="list-disc pl-6 space-y-2 max-w-md mx-auto text-left">
            <li className="text-lg">
              🎫 Access to exclusive events and workshops
            </li>
            <li className="text-lg">💎 VIP recognition on donor wall</li>
            <li className="text-lg">✨ Early invites to special campaigns</li>
          </ul>
        </div>
      )}

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
