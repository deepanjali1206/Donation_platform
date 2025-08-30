import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  Package,
  Gift,
  DollarSign,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";

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
          setError("⚠️ You must log in first to see your donations.");
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
        console.error("❌ Error fetching my donations:", err);
        setError("Something went wrong while fetching donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle className="w-4 h-4" /> Delivered
          </span>
        );
      case "Processing":
        return (
          <span className="flex items-center gap-1 text-yellow-600 font-medium">
            <Clock className="w-4 h-4" /> Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="flex items-center gap-1 text-blue-600 font-medium">
            <Truck className="w-4 h-4" /> Shipped
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-gray-500 font-medium">
            <XCircle className="w-4 h-4" /> Pending
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px] text-indigo-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading your donations...
      </div>
    );

  if (error)
    return <p className="text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        My Donations
      </h2>

      {donations.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven’t donated anything yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {donations.map((d) => (
            <div
              key={d._id}
              className="flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden border-l-4 border-indigo-600 hover:shadow-xl transition"
            >
              {d.image ? (
                <img
                  src={imgUrl(d.image)}
                  alt={d.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="flex flex-col flex-1 p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-indigo-600">
                    {d.title}
                  </h3>
                  {renderStatus(d.status)}
                </div>

                <p className="flex items-center gap-2 text-gray-700">
                  <Package className="w-4 h-4 text-gray-500" />
                  <strong>Category:</strong> {d.category}
                </p>

                {d.donationType === "money" ? (
                  <p className="flex items-center gap-2 text-green-600 font-medium mt-2">
                    <DollarSign className="w-4 h-4" /> Donated ₹{d.amount}
                  </p>
                ) : (
                  <p className="flex items-center gap-2 text-blue-600 font-medium mt-2">
                    <Gift className="w-4 h-4" /> Donated {d.quantity} item(s)
                  </p>
                )}

                {d.notes && (
                  <p className="flex items-center gap-2 text-gray-600 mt-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <strong>Notes:</strong> {d.notes}
                  </p>
                )}

                <p className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
                  <Calendar className="w-4 h-4 text-purple-500" />
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
