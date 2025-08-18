import { useEffect, useState } from "react";
import axios from "axios";

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT stored at login
        const { data } = await axios.get("http://localhost:5000/api/donations/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonations(data);
      } catch (error) {
        console.error("Error fetching my donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <p className="text-center text-lg font-medium">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        My Donations
      </h2>

      {donations.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t donated anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {donations.map((d) => (
            <div
              key={d._id}
              className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-xl transition-shadow"
            >
              {d.image ? (
                <img
                  src={`http://localhost:5000/uploads/${d.image}`}
                  alt={d.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{d.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{d.description}</p>
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-600 font-medium">
                    {d.category}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      d.status === "Available"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  📍 {d.address || "No Address"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyDonations;
