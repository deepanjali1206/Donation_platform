import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CreditsDashboard() {
  const [earned, setEarned] = useState(0);
  const [pending, setPending] = useState(0);
  const [spent, setSpent] = useState(0);
  const [balance, setBalance] = useState(0);
  const [level, setLevel] = useState("Bronze");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/credits", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEarned(res.data.earned);
        setPending(res.data.pending);
        setSpent(res.data.spent);
        setBalance(res.data.balance);
        setLevel(res.data.level);
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("❌ Error fetching credits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  if (loading) {
    return <p className="text-center">Loading credits...</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Credits Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Earned</h3>
          <p className="text-xl">{earned}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Pending</h3>
          <p className="text-xl">{pending}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Spent</h3>
          <p className="text-xl">{spent}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Balance</h3>
          <p className="text-xl">{balance}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold">Level: {level}</h3>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">History</h3>
        {history.length === 0 ? (
          <p>No history yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((item, idx) => (
              <li
                key={idx}
                className="p-3 bg-gray-100 rounded-lg flex justify-between"
              >
                <span>{item.reason}</span>
                <span>
                  {item.type === "earn" && "+"}
                  {item.type === "spend" && "-"}
                  {item.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
