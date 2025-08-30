import React, { useEffect, useState } from "react";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/requests/my-requests", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setRequests(data);
        } else {
          console.error("❌ Error fetching my requests:", data.message || data.error);
        }
      } catch (err) {
        console.error("❌ Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  if (loading) return <p>Loading your requests...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req._id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{req.title}</h3>
              <p>Category: {req.category}</p>
              <p>Item: {req.item}</p>
              <p>Urgency: {req.urgency}</p>
              <p>Quantity: {req.quantity}</p>
              <p>Amount: {req.amount}</p>
              <p>Location: {req.location}</p>
              <p>Date: {new Date(req.date).toLocaleDateString()}</p>
              <p>Notes: {req.notes}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRequests;
