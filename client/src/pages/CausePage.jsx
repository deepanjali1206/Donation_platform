import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CausePage.css";

function CausesPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/campaigns"); // backend route
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Active Campaigns</h2>
      <div className="row">
        {campaigns.length > 0 ? (
          campaigns.map((cause) => (
            <div key={cause._id} className="col-md-6 col-lg-3 mb-4">
              <div className="card shadow-sm h-100 cause-card">
                <img
                  src={`http://localhost:5000${cause.image}`}
                  alt={cause.title}
                  className="card-img-top"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{cause.title}</h5>
                  <p className="card-text text-muted">{cause.description}</p>
                  <Link
                    to={`/donate/${cause._id}`}
                    className="btn btn-gradient mt-auto"
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Loading campaigns...</p>
        )}
      </div>
    </div>
  );
}

export default CausesPage;
