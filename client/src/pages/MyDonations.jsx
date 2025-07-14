import React, { useEffect, useState } from "react";
import axios from "axios";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // stored on login

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/donations/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDonations(response.data);
      } catch (error) {
        console.error("Failed to fetch donations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Donations</h2>

      {loading ? (
        <p>Loading...</p>
      ) : donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <h3 className="text-lg font-semibold">{donation.title}</h3>
              <p>{donation.description}</p>
              <p className="text-sm text-gray-500 mt-1">Category: {donation.category}</p>
              <p className="text-sm mt-1">
                Status:{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-white ${
                    donation.status === "Completed"
                      ? "bg-green-500"
                      : donation.status === "In Progress"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                >
                  {donation.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;