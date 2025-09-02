import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CreditsDashboard() {
  const [credits, setCredits] = useState({
    earned: 0,
    pending: 0,
    level: "Bronze",
    history: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("/api/users/me/credits", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // expected API response:
        // { earned, pending, level, history: [{ type, amount, reason, date, status }] }
        setCredits({
          earned: res.data.earned || 0,
          pending: res.data.pending || 0,
          level: res.data.level || "Bronze",
          history: res.data.history || [],
        });
      } catch (err) {
        console.error("❌ Error fetching credits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCredits();
  }, []);

  if (loading) return <p className="text-center">Loading credits...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">💰 Credits Dashboard</h2>

      {/* Earned + Pending */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded-lg">
          <p className="text-lg font-semibold">Earned Credits</p>
          <p className="text-2xl text-green-700">{credits.earned}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg">
          <p className="text-lg font-semibold">Pending Credits</p>
          <p className="text-2xl text-yellow-700">{credits.pending}</p>
        </div>
      </div>

      {/* Level */}
      <div className="p-4 bg-blue-100 rounded-lg mb-6">
        <p className="text-lg font-semibold">
          🏆 Current Level:{" "}
          <span className="text-blue-700 font-bold">{credits.level}</span>
        </p>
      </div>

      {/* History */}
      <h3 className="text-xl font-semibold mb-2">📜 Credit History</h3>
      <ul className="space-y-2">
        {credits.history.length > 0 ? (
          credits.history
            .slice()
            .reverse()
            .map((entry, idx) => (
              <li key={idx} className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span>
                    {entry.type === "earn" ? "➕ Earned" : "➖ Spent"}{" "}
                    {entry.amount} – {entry.reason}
                  </span>
                  <span
                    className={`font-bold ${
                      entry.status === "pending"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {entry.status || "confirmed"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleString()}
                </p>
              </li>
            ))
        ) : (
          <p className="text-gray-500">No credit history yet.</p>
        )}
      </ul>
    </div>
  );
}
