// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import { useLocation } from "react-router-dom";
>>>>>>> d3ab97e8891c666a504d446ea37d797649124915
import api from "../../lib/api";

export default function AdminDashboard() {
  const location = useLocation();
  const initialSection = location.state?.section || "overview";
  const [section, setSection] = useState(initialSection);

  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/donations");
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/users");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
<<<<<<< HEAD
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
=======
      await api.put(`/api/donations/${id}/status`, { status });
>>>>>>> d3ab97e8891c666a504d446ea37d797649124915
      fetchDonations();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDonations();
    if (section === "donations") fetchDonations();
    if (section === "users") fetchUsers();
  }, [section]);

  if (loading)
    return (
      <p className="text-center mt-5 text-indigo-600 font-semibold animate-pulse">
        Loading {section}...
      </p>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 tracking-wide drop-shadow-md">
        Admin Dashboard
      </h2>

<<<<<<< HEAD
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
=======
      {/* ---- Tabs ---- */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {["overview", "users", "donations", "ngos", "requests", "reports"].map(
          (s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm hover:scale-105 ${
                section === s
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          )
        )}
      </div>

      {/* -------- Overview -------- */}
      {section === "overview" && (
        <div className="space-y-8">
          <p className="text-center text-gray-600 text-lg">
            Welcome to the Admin Dashboard. Explore quick stats below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Users"
              value={users.length || "—"}
              subtitle="Registered users"
              color="indigo"
              link={{ section: "users", text: "Manage Users" }}
              setSection={setSection}
            />
            <DashboardCard
              title="NGOs"
              value="—"
              subtitle="Connected NGOs"
              color="green"
              link={{ section: "ngos", text: "Manage NGOs" }}
              setSection={setSection}
            />
            <DashboardCard
              title="Donations"
              value={donations.length || "—"}
              subtitle="Processed donations"
              color="pink"
              link={{ section: "donations", text: "Manage Donations" }}
              setSection={setSection}
            />
            <DashboardCard
              title="Requests"
              value="—"
              subtitle="Pending requests"
              color="yellow"
              link={{ section: "requests", text: "View Requests" }}
              setSection={setSection}
            />
            <DashboardCard
              title="Reports"
              value="—"
              subtitle="Generated reports"
              color="red"
              link={{ section: "reports", text: "View Reports" }}
              setSection={setSection}
            />
          </div>
        </div>
      )}

      {/* -------- Users -------- */}
      {section === "users" && (
        <SectionTable
          title="Manage Users"
          columns={["Name", "Email", "Role"]}
          data={users.map((u) => [u.name, u.email, u.role])}
        />
      )}

      {/* -------- Donations -------- */}
      {section === "donations" && (
        <>
          <h3 className="text-2xl font-bold mb-5 text-center text-indigo-500 drop-shadow-sm">
            Manage Donations
          </h3>
          {donations.length === 0 ? (
            <p className="text-center text-gray-500">No donations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg">
                <thead>
                  <tr className="bg-indigo-100 text-indigo-700">
                    <th className="border p-3">Donor</th>
                    <th className="border p-3">Type</th>
                    <th className="border p-3">Amount/Qty</th>
                    <th className="border p-3">Status</th>
                    <th className="border p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr
                      key={d._id}
                      className="hover:bg-indigo-50 transition-colors"
                    >
                      <td className="border p-3">
                        {d.donorName}
                        <br />
                        <small className="text-gray-500">{d.donorEmail}</small>
                      </td>
                      <td className="border p-3">{d.donationType}</td>
                      <td className="border p-3">
                        {d.donationType === "money"
                          ? `₹${d.amount} (Txn: ${d.transactionId})`
                          : d.donationType === "item"
                          ? `${d.quantity} items`
                          : `${d.bloodGroup} on ${d.date}`}
                      </td>
                      <td className="border p-3 font-medium">{d.status}</td>
                      <td className="border p-3 space-x-2">
                        <ActionButton
                          label="Processing"
                          color="yellow"
                          onClick={() => updateStatus(d._id, "Processing")}
                        />
                        <ActionButton
                          label="Delivered"
                          color="green"
                          onClick={() => updateStatus(d._id, "Delivered")}
                        />
                        <ActionButton
                          label="Reset"
                          color="gray"
                          onClick={() => updateStatus(d._id, "Pending")}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Placeholder Sections */}
      {section === "ngos" && (
        <PlaceholderSection text="NGOs section will come here." />
      )}
      {section === "requests" && (
        <PlaceholderSection text="Requests section will come here." />
      )}
      {section === "reports" && (
        <PlaceholderSection text="Reports section will come here." />
>>>>>>> d3ab97e8891c666a504d446ea37d797649124915
      )}
    </div>
  );
}

function DashboardCard({ title, value, subtitle, color, link, setSection }) {
  const colors = {
    indigo: "from-indigo-500 to-indigo-600",
    green: "from-green-500 to-green-600",
    pink: "from-pink-500 to-pink-600",
    yellow: "from-yellow-400 to-yellow-500",
    red: "from-red-500 to-red-600",
  };
  return (
    <div className="rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 p-6 bg-white relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-10`}
      ></div>
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-4xl font-bold mt-2 mb-1 text-gray-900">{value}</p>
      <p className="text-gray-500 text-sm mb-4">{subtitle}</p>
      <button
        onClick={() => setSection(link.section)}
        className="text-indigo-600 font-medium hover:underline text-sm relative z-10"
      >
        {link.text} →
      </button>
    </div>
  );
}

function SectionTable({ title, columns, data }) {
  return (
    <>
      <h3 className="text-2xl font-bold mb-5 text-center text-indigo-500">
        {title}
      </h3>
      {data.length === 0 ? (
        <p className="text-center text-gray-500">No data found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 rounded-xl overflow-hidden bg-white shadow-md">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700">
                {columns.map((c) => (
                  <th key={c} className="border p-3">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-indigo-50 transition">
                  {row.map((cell, j) => (
                    <td key={j} className="border p-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function ActionButton({ label, color, onClick }) {
  const colors = {
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    green: "bg-green-600 hover:bg-green-700",
    gray: "bg-gray-500 hover:bg-gray-600",
  };
  return (
    <button
      onClick={onClick}
      className={`${colors[color]} text-white px-3 py-1 rounded shadow hover:shadow-md transition`}
    >
      {label}
    </button>
  );
}

function PlaceholderSection({ text }) {
  return (
    <p className="text-center text-gray-600 mt-10 text-lg font-medium">
      {text}
    </p>
  );
}
