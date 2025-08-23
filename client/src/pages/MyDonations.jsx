import { useEffect, useState } from "react";
import axios from "axios";

function imgUrl(image) {
  if (!image) return "";
  if (!image.startsWith("http") && !image.startsWith("/uploads/")) {
    return `http://localhost:5000/uploads/${image}`;
  }
  if (image.startsWith("/uploads/")) {
    return `http://localhost:5000${image}`;
  }
  return image;
}

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must log in first to see your donations.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          "http://localhost:5000/api/donations/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDonations(data);
      } catch (err) {
        console.error("Error fetching my donations:", err);
        setError("Something went wrong while fetching donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        My Donations
      </h2>

      {donations.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven’t donated anything yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {donations.map((d) => (
            <div
              key={d._id}
              className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-xl transition-shadow"
            >
              {d.image ? (
                <img
                  src={imgUrl(d.image)}
                  alt={d.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {d.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {d.category}
                </p>

                {d.donationType === "money" ? (
                  <p className="text-sm text-green-600 font-medium">
                    💵 Donated ${d.amount}
                  </p>
                ) : (
                  <p className="text-sm text-blue-600 font-medium">
                    🎁 Donated {d.quantity} item(s) {d.notes && `– ${d.notes}`}
                  </p>
                )}

                <div className="mt-3 flex justify-between items-center">
                  <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-600 font-medium">
                    {d.donationType}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      d.status === "Delivered"
                        ? "bg-green-100 text-green-600"
                        : d.status === "Processing"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  {new Date(d.createdAt).toLocaleString()}
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
