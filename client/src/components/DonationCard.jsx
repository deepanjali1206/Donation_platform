import React from "react";

export default function DonationCard({ donation }) {
  return (
    <div className="card shadow-sm border-0 rounded-3 p-3 mb-3">
  
      <h5 className="fw-bold text-primary">{donation.title}</h5>

      <p className="text-muted">{donation.description}</p>

      <p className="mb-1">
        <strong>Type:</strong> {donation.type}
      </p>

      {donation.type === "money" && (
        <p className="mb-1">
          <strong>Amount:</strong> ₹{donation.amount}
        </p>
      )}

      {donation.type === "item" && (
        <p className="mb-1">
          <strong>Item:</strong> {donation.itemName} ({donation.quantity})
        </p>
      )}

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
