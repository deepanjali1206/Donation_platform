import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function CreditsDashboard() {
  const [credits, setCredits] = useState({
    earned: 0,
    pending: 0,
    history: [],
  });
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Use API base URL from env or fallback
  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchCredits = useCallback(async () => {
    if (!token) {
      console.warn("⚠️ No token found in localStorage");
      setLoading(false);
      return;
    }

    try {
      console.log("🟡 Fetching credits from API:", `${API_BASE}/api/users/me/credits`);

      const res = await axios.get(`${API_BASE}/api/users/me/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ API Response received:", res.data);

      const { earned, pending, history } = res.data || {};

      // Debug: show parsed values
      console.log("📋 Parsed data:", {
        earned,
        pending,
        historyLength: history?.length || 0,
        historySample: history?.slice(0, 2),
      });

      setCredits({
        earned: earned || 0,
        pending: pending || 0,
        history: Array.isArray(history) ? history : [],
      });
    } catch (err) {
      console.error("❌ Error fetching credits:", err);
      if (err.response) {
        console.error("❌ Error response data:", err.response.data);
        console.error("❌ Error status:", err.response.status);
      } else {
        console.error("❌ No response from server");
      }
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE]);

  useEffect(() => {
    fetchCredits();

    // Refetch when window regains focus
    const onFocus = () => fetchCredits();
    window.addEventListener("focus", onFocus);

    // Poll every 30s
    const interval = setInterval(fetchCredits, 30_000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [fetchCredits]);

  if (loading) return <p className="text-center">Loading credits...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">💰 Credits Dashboard</h2>

      {/* Credits summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded-lg text-center">
          <p className="text-lg font-semibold">Earned Credits</p>
          <p className="text-2xl text-green-700">{credits.earned}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg text-center">
          <p className="text-lg font-semibold">Pending Credits</p>
          <p className="text-2xl text-yellow-700">{credits.pending}</p>
        </div>
      </div>

      {/* Credit history */}
      <h3 className="text-xl font-semibold mb-2">📜 Credit History</h3>
      {credits.history.length > 0 ? (
        <ul className="space-y-2">
          {credits.history
            .slice()
            .reverse()
            .map((entry, idx) => {
              const isPending = entry.status === "pending";
              const status = isPending ? "pending" : "earned";

              return (
                <li key={idx} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
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
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {entry.date
                      ? new Date(entry.date).toLocaleString()
                      : "Unknown date"}
                  </p>
                </li>
              );
            })}
        </ul>
      ) : (
        <p className="text-gray-500">No credit history yet.</p>
      )}
    </div>
  );
}
