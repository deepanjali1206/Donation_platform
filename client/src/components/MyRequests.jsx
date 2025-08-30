import React, { useEffect, useState } from "react";
import {
  Loader2,
  MapPin,
  Package,
  AlertTriangle,
  Calendar,
  FileText,
  BadgeCheck,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/requests/my-requests",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setRequests(data);
        } else {
          console.error(
            "❌ Error fetching my requests:",
            data.message || data.error
          );
        }
      } catch (err) {
        console.error("❌ Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-blue-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading your requests...
      </div>
    );
  }

  const renderStatus = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <BadgeCheck className="w-4 h-4" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-1 text-blue-600 font-medium">
            <CheckCircle className="w-4 h-4" /> Completed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-yellow-600 font-medium">
            <Clock className="w-4 h-4" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        My Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No requests found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="flex flex-col bg-white shadow-lg rounded-2xl p-5 border-l-4 border-blue-600 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-blue-600">
                  {req.title}
                </h3>
                {renderStatus(req.status)}
              </div>

              <div className="space-y-2 text-gray-700 flex-1">
                <p className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <strong>Category:</strong> {req.category}
                </p>
                {req.item && (
                  <p className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <strong>Item:</strong> {req.item}
                  </p>
                )}
                {req.urgency && (
                  <p className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <strong>Urgency:</strong> {req.urgency}
                  </p>
                )}
                {req.quantity && (
                  <p>
                    <strong>Quantity:</strong> {req.quantity}
                  </p>
                )}
                {req.amount && (
                  <p>
                    <strong>Amount:</strong> ₹{req.amount}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <strong>Location:</strong> {req.location}
                </p>
                {req.date && (
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <strong>Date:</strong>{" "}
                    {new Date(req.date).toLocaleDateString()}
                  </p>
                )}
                {req.notes && (
                  <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <strong>Notes:</strong> {req.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
