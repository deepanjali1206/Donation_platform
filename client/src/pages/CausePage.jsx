import React from "react";
import { Link } from "react-router-dom";
import "./CausePage.css";

const campaigns = [
  {
    id: 1,
    title: "Books for Rural Schools",
    description: "Help children in remote areas access education by donating books.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
  },
  {
    id: 2,
    title: "Clothes for Winter",
    description: "Provide warm clothes for families struggling during winter.",
    image: "https://images.unsplash.com/photo-1520975922071-a5afec7eae67?w=600",
  },
  {
    id: 3,
    title: "Blood Donation Drive",
    description: "Every drop counts. Join our blood donation campaign.",
    image: "https://images.unsplash.com/photo-1635776062879-3a71db0ed690?w=600",
  },
  {
    id: 4,
    title: "Support for Orphanages",
    description: "Donate essential items and support children in need.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600",
  },
];

function CausesPage() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Active Campaigns</h2>
      <div className="row">
        {campaigns.map((cause) => (
          <div key={cause.id} className="col-md-6 col-lg-3 mb-4">
            <div className="card shadow-sm h-100 cause-card">
              <img
                src={cause.image}
                alt={cause.title}
                className="card-img-top"
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{cause.title}</h5>
                <p className="card-text text-muted">{cause.description}</p>
                <Link
                  to={`/donate/${cause.id}`}
                  className="btn btn-gradient mt-auto"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CausesPage;
