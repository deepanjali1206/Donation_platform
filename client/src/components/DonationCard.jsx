import React from "react";

export default function DonationCard({ donation }) {
  return (
    <div className="card shadow-sm border-0 rounded-3 p-3 mb-3">
      {/* Title */}
      <h5 className="fw-bold text-primary">{donation.title}</h5>

      {/* Description */}
      <p className="text-muted">{donation.description}</p>

      {/* Donation Info */}
      <p className="mb-1">
        <strong>Type:</strong> {donation.type}
      </p>

      {/* If it's a money donation */}
      {donation.type === "money" && (
        <p className="mb-1">
          <strong>Amount:</strong> ₹{donation.amount}
        </p>
      )}

      {/* If it's an item donation */}
      {donation.type === "item" && (
        <p className="mb-1">
          <strong>Item:</strong> {donation.itemName} ({donation.quantity})
        </p>
      )}

      {/* Donation Status */}
      <p className="mb-0">
        <strong>Status:</strong>{" "}
        <span
          className={`badge ${
            donation.status === "Pending"
              ? "bg-warning text-dark"
              : donation.status === "Approved"
              ? "bg-info"
              : "bg-success"
          }`}
        >
          {donation.status}
        </span>
      </p>
    </div>
  );
}
