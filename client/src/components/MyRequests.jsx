import React, { useState, useEffect } from "react";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Server returned non-JSON response:", text);
        throw new Error("Invalid server response");
      }

      if (res.ok) {
        setRequests(data);
      } else {
        alert(data.message || "Failed to fetch requests");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p>Loading your requests...</p>;

  if (requests.length === 0)
    return <p>You have not submitted any requests yet.</p>;

  return (
    <div className="my-requests-wrapper">
      <h2 className="mb-4">My Requests</h2>
      <div className="requests-list">
        {requests.map((req) => (
          <div key={req._id} className="request-card shadow mb-3 p-3">
            <h5>{req.item}</h5>
            <p>
              <strong>Urgency:</strong> {req.urgency}
            </p>
            <p>
              <strong>Quantity:</strong> {req.quantity}
            </p>
            <p>
              <strong>Coordinates:</strong> {req.coordinates.join(", ")}
            </p>
            <p>
              <strong>Requested as NGO:</strong> {req.isNGO ? "Yes" : "No"}
            </p>
            <p>
              <strong>Created at:</strong>{" "}
              {new Date(req.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
