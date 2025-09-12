import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestForm.css";

const RequestForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    requestType: "",
    item: "",
    urgency: "Low",
    quantity: "",
    isNGO: false,
    amount: "",
    notes: "",
    bloodGroup: "",
    date: "",
    location: "",
    title: "",
    category: "",
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    deliveryPreference: "",
    paymentMode: "credits",
    useCredits: 0,
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    bankName: "",
  });

  const [coordinates, setCoordinates] = useState([0, 0]);
  const [attachment, setAttachment] = useState(null);
  const [user, setUser] = useState({ credits: 0 });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    // Load user data
    const userData = JSON.parse(localStorage.getItem("circleUser")) || { credits: 0 };
    setUser(userData);

    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoordinates([pos.coords.longitude, pos.coords.latitude]),
        (err) => console.error("Geolocation error:", err)
      );
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const submitRequest = async (paymentData = null) => {
    try {
      const payload = {
        ...formData,
        category: formData.requestType,
        title:
          formData.requestType === "money"
            ? "Financial Assistance"
            : formData.requestType === "blood"
            ? "Blood Requirement"
            : formData.item || "General Request",
        quantity: parseInt(formData.quantity) || 1,
        coordinates,
      };

      // Add payment data if available
      if (paymentData) {
        payload.razorpayPaymentId = paymentData.razorpay_payment_id;
        payload.razorpayOrderId = paymentData.razorpay_order_id;
        payload.razorpaySignature = paymentData.razorpay_signature;
      }

      // Remove delivery preference for money requests
      if (formData.requestType === "money") {
        delete payload.deliveryPreference;
        delete payload.paymentMode;
        delete payload.useCredits;
      }

      const formDataToSend = new FormData();
      for (const key in payload) formDataToSend.append(key, payload[key]);
      if (attachment) formDataToSend.append("attachment", attachment);

      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        if (data.updatedCredits !== undefined) {
          const updatedUser = { ...user, credits: data.updatedCredits };
          localStorage.setItem("circleUser", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        alert("✅ Request submitted successfully!");
        navigate("/my-requests");
      } else {
        alert(data.message || "❌ Failed to submit request");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Server error. Please try again later.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const initiateRazorpayPayment = async (amount) => {
    try {
      // Create order - use the same endpoint as DonationForm
      const orderRes = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }), // Convert to paise
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create payment order");
      }

      const order = await orderRes.json();

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Help Circle",
        description: "Request Payment",
        order_id: order.id,
        handler: async function (response) {
          // Verify payment first - use the same endpoint as DonationForm
          try {
            const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Submit request with payment details
              await submitRequest(response);
            } else {
              alert("❌ Payment verification failed");
              setIsProcessingPayment(false);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("❌ Payment verification failed");
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: formData.requesterName,
          email: formData.requesterEmail,
          contact: formData.requesterPhone,
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      alert("⚠️ Razorpay payment initialization failed. Please check your Razorpay API keys.");
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    // Validate bank details for money requests
    if (formData.requestType === "money") {
      if (!formData.accountNumber || !formData.accountHolderName || !formData.ifscCode || !formData.bankName) {
        alert("⚠️ Please fill all bank account details for money transfer");
        setIsProcessingPayment(false);
        return;
      }
    }

    let requiredCredits = 0;
    let amountToPay = 0;

    // Calculate required credits and payment amount
    if (formData.requestType === "money") {
      // Money requests don't require credits or payment from requester
      amountToPay = 0;
    } else {
      // For non-money requests, check if NGO or blood request (free)
      if (formData.isNGO || formData.requestType === "blood" || formData.urgency === "High") {
        requiredCredits = 0;
      } else if (formData.paymentMode === "credits") {
        requiredCredits = 5;
      } else if (formData.paymentMode === "hybrid") {
        requiredCredits = Number(formData.useCredits) || 0;
        amountToPay = Math.max(0, 5 - requiredCredits); // Fixed amount of 5 credits equivalent
      } else if (formData.paymentMode === "money") {
        amountToPay = 5; // Fixed amount of 5 credits equivalent
      }
    }

    // Check if user has enough credits
    if (user.credits < requiredCredits) {
      alert(`⚠️ You need at least ${requiredCredits} credits to submit this request. Your balance: ${user.credits} credits`);
      setIsProcessingPayment(false);
      return;
    }

    // Handle payment scenarios
    try {
      if (amountToPay > 0) {
        // Initiate Razorpay payment for money amount
        await initiateRazorpayPayment(amountToPay);
      } else {
        // Submit request directly if no payment needed
        await submitRequest();
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setIsProcessingPayment(false);
    }
  };

  // Determine button text based on request type and payment mode
  const getButtonText = () => {
    if (isProcessingPayment) {
      return "Processing...";
    }
    
    // Money requests should show "Submit Request"
    if (formData.requestType === "money") {
      return "Submit Request";
    }
    
    // For item requests, show "Proceed to Payment" only for money/hybrid payment modes
    if (formData.requestType === "item" && 
        (formData.paymentMode === "money" || formData.paymentMode === "hybrid")) {
      return "Proceed to Payment";
    }
    
    // Default to "Submit Request"
    return "Submit Request";
  };

  return (
    <div className="request-wrapper">
      <div className="request-container">
        <div className="request-card shadow">
          <h2 className="text-center mb-4">Submit Help Request</h2>
          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label className="form-label">Your Name</label>
              <input type="text" name="requesterName" className="form-control" value={formData.requesterName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Your Email</label>
              <input type="email" name="requesterEmail" className="form-control" value={formData.requesterEmail} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="requesterPhone" className="form-control" value={formData.requesterPhone} onChange={handleChange} placeholder="e.g., +91 9876543210" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Request Type</label>
              <select name="requestType" className="form-select" value={formData.requestType} onChange={handleChange} required>
                <option value="">Select Request Type</option>
                <option value="money">Money</option>
                <option value="item">Item</option>
                <option value="blood">Blood</option>
              </select>
            </div>

            {formData.requestType === "money" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Amount Needed (₹)</label>
                  <input type="number" name="amount" className="form-control" value={formData.amount} onChange={handleChange} min="1" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Purpose / Notes</label>
                  <textarea name="notes" className="form-control" value={formData.notes} onChange={handleChange} placeholder="Why do you need this support?" required></textarea>
                </div>
                
                <div className="account-details-section mt-4 p-3 border rounded">
                  <h5 className="mb-3">Bank Account Details for Transfer</h5>
                  <div className="mb-3">
                    <label className="form-label">Account Holder Name</label>
                    <input type="text" name="accountHolderName" className="form-control" value={formData.accountHolderName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Account Number</label>
                    <input type="text" name="accountNumber" className="form-control" value={formData.accountNumber} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">IFSC Code</label>
                    <input type="text" name="ifscCode" className="form-control" value={formData.ifscCode} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bank Name</label>
                    <input type="text" name="bankName" className="form-control" value={formData.bankName} onChange={handleChange} required />
                  </div>
                </div>
              </>
            )}

            {formData.requestType === "item" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Item Needed</label>
                  <input type="text" name="item" className="form-control" value={formData.item} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Urgency</label>
                  <select name="urgency" className="form-select" value={formData.urgency} onChange={handleChange} required>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <input type="number" name="quantity" className="form-control" value={formData.quantity} onChange={handleChange} min="1" required />
                </div>
              </>
            )}

            {formData.requestType === "blood" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Blood Group</label>
                  <select name="bloodGroup" className="form-select" value={formData.bloodGroup} onChange={handleChange} required>
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Preferred Date</label>
                  <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label">Location</label>
              <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
            </div>

            {formData.requestType !== "money" && formData.requestType !== "" && (
              <div className="mb-3">
                <label className="form-label">Delivery Preference</label>
                <select name="deliveryPreference" className="form-select" value={formData.deliveryPreference} onChange={handleChange} required>
                  <option value="">Select Preference</option>
                  <option value="pickup">I can pick up</option>
                  <option value="delivery">Need delivery</option>
                </select>
              </div>
            )}

            <div className="mb-3 form-check">
              <input type="checkbox" name="isNGO" className="form-check-input" checked={formData.isNGO} onChange={handleChange} />
              <label className="form-check-label">Requesting as an NGO</label>
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Document (optional)</label>
              <input type="file" className="form-control" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
            </div>

            {formData.requestType === "item" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Payment Mode</label>
                  <select name="paymentMode" className="form-select" value={formData.paymentMode} onChange={handleChange}>
                    <option value="credits">Use Credits</option>
                    <option value="money">Pure Money</option>
                    <option value="hybrid">Hybrid (Money + Credits)</option>
                  </select>
                </div>

                {formData.paymentMode === "credits" && (
                  <p className="text-muted">⚡ You need <b>5 credits</b> to submit this request. Balance: <b>{user.credits}</b></p>
                )}

                {formData.paymentMode === "hybrid" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Credits to Use (max 5)</label>
                      <input 
                        type="number" 
                        name="useCredits" 
                        className="form-control" 
                        value={formData.useCredits} 
                        onChange={handleChange} 
                        min="0" 
                        max={Math.min(user.credits, 5)} 
                      />
                    </div>
                    <p className="text-muted">
                      Balance: <b>{user.credits}</b> credits <br />
                      Remaining Payment (Money): ₹{Math.max(0, 5 - Number(formData.useCredits))}
                    </p>
                  </>
                )}

                {formData.paymentMode === "money" && (
                  <p className="text-muted">💰 You need to pay <b>₹5</b> to submit this request</p>
                )}
              </>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-100 mt-3"
              disabled={isProcessingPayment}
            >
              {getButtonText()}
            </button>
          </form>
        </div>
      </div> 
    </div>
  );
};

export default RequestForm;