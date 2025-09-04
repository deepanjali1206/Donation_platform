import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    try {
      const { data } = await api.get("/api/donations");
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
      alert("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/api/donations/${id}/status`, { status });

      // ✅ If credits updated, show them in alert or console
      if (status === "Delivered") {
        alert(
          `✅ Donation delivered!\nEarned Credits: ${data.updatedEarned}\nPending Credits: ${data.updatedPending}`
        );
      } else {
        alert(`Status updated to ${status}`);
      }

      // Refresh donation list
      fetchDonations();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        Admin Dashboard - Manage Donations
      </h2>

      {donations.length === 0 ? (
        <p className="text-center text-gray-500">No donations found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Donor</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount/Qty</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d._id}>
                <td className="border p-2">
                  {d.donorName} <br />
                  <small>{d.donorEmail}</small>
                </td>
                <td className="border p-2">{d.donationType}</td>
                <td className="border p-2">
                  {d.donationType === "money"
                    ? `₹${d.amount} (Txn: ${d.transactionId})`
                    : d.donationType === "item"
                    ? `${d.quantity} items`
                    : `${d.bloodGroup} on ${new Date(d.date).toLocaleDateString()}`}
                </td>
                <td className="border p-2 font-medium">{d.status}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => updateStatus(d._id, "Processing")}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => updateStatus(d._id, "Delivered")}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => updateStatus(d._id, "Pending")}
                    className="px-3 py-1 bg-gray-500 text-white rounded"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
