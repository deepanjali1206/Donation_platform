import React from "react";
import "./HowItWorks.css";

const steps = [
  {
    title: "CHOOSE A CAUSE",
    description: "Browse different campaigns and select a cause.",
    img: "/images/choose.png", 
  },
  {
    title: "SELECT PRODUCTS",
    description: "Select products and quantity you wish to donate.",
    img: "/images/select.png",
  },
  {
    title: "ORDER PROCESSING",
    description: "Checkout and pay for your contributions.",
    img: "/images/order.png",
  },
  {
    title: "DELIVERY REPORT",
    description: "We deliver the products and update on usage.",
    img: "/images/delivery.png",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works py-5">
      <div className="container text-center">
        <h2 className="mb-4">
          <span className="orange-bar" /> How It Works?
        </h2>
        <div className="row">
          {steps.map((step, idx) => (
            <div className="col-md-3 mb-4" key={idx}>
              <div className="step-box p-3">
                <img
                  src={step.img}
                  alt={step.title}
                  className="img-fluid mb-3"
                />
                <h5 className="fw-bold">{step.title}</h5>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
