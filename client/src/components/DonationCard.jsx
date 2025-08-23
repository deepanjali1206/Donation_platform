import React from "react";

function getImageUrl(imageUrl) {
  if (!imageUrl) return "/placeholder.png";

  if (imageUrl.startsWith("uploads")) {
    return `http://localhost:5000/${imageUrl.replace(/\\/g, "/")}`;
  }
  return imageUrl; 
}

export default function DonationCard({ d }) {
  return (
    <article className="donation-card">
      <div className="thumb">
        <img src={getImageUrl(d.imageUrl)} alt={d.title} loading="lazy" />
      </div>
      <div className="content">
        <div className="chip">{d.category || "General"}</div>
        <h3 title={d.title}>{d.title}</h3>
        <p className="desc">{d.description || "—"}</p>
        <div className="meta">
          <span>{new Date(d.createdAt || d.date).toLocaleDateString()}</span>
          <span className={`status ${d.status?.toLowerCase() || "active"}`}>
            {d.status || "Active"}
          </span>
        </div>
        {d.address && <div className="address">📍 {d.address}</div>}
      </div>
    </article>
  );
}
