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
    ngoStatus: "unverified",
    ngoVerificationDocuments: [],
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
  const [itemCategory, setItemCategory] = useState("");
  const [ngoDocuments, setNgoDocuments] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState("not_started");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("circleUser")) || { credits: 0 };
    setUser(userData);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoordinates([pos.coords.longitude, pos.coords.latitude]),
        (err) => console.error("Geolocation error:", err)
      );
    }

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
    
    if (name === "isNGO" && checked) {
      setVerificationStatus("pending_documents");
    }
    
    if (name === "item") {
      const itemValue = value.toLowerCase();
      let detectedCategory = "";
      
      if (itemValue.includes("book") || itemValue.includes("notebook") || itemValue.includes("textbook")) {
        detectedCategory = "books";
      } else if (itemValue.includes("cloth") || itemValue.includes("dress") || itemValue.includes("shirt") || 
                 itemValue.includes("pant") || itemValue.includes("garment")) {
        detectedCategory = "clothes";
      } else if (itemValue.includes("food") || itemValue.includes("grocery") || itemValue.includes("rice") || 
                 itemValue.includes("wheat") || itemValue.includes("vegetable") || itemValue.includes("fruit")) {
        detectedCategory = "food";
      }
      
      setItemCategory(detectedCategory);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNgoDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const newDocuments = files.map(file => ({
        file,
        type: documentTypeFromName(file.name),
        uploaded: new Date(),
        status: "pending_review"
      }));
      
      setNgoDocuments([...ngoDocuments, ...newDocuments]);
      setVerificationStatus("documents_uploaded");
    }
  };

  const documentTypeFromName = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes("certificate") || name.includes("registration")) return "registration_certificate";
    if (name.includes("pan") || name.includes("tax")) return "pan_card";
    if (name.includes("bank") || name.includes("account")) return "bank_account_proof";
    if (name.includes("director") || name.includes("trustee")) return "leadership_proof";
    if (name.includes("activity") || name.includes("report")) return "activity_report";
    return "other";
  };

  const removeNgoDocument = (index) => {
    const updatedDocuments = [...ngoDocuments];
    updatedDocuments.splice(index, 1);
    setNgoDocuments(updatedDocuments);
    
    if (updatedDocuments.length === 0) {
      setVerificationStatus("pending_documents");
    }
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const calculateRequiredCredits = () => {
    if (formData.requestType !== "item" || !formData.quantity) return 0;
    
    const quantity = parseInt(formData.quantity) || 1;
    
    switch(itemCategory) {
      case "books":
        return Math.min(quantity*5, 1000); 
      case "clothes":
        return Math.min(quantity*5, 1000); 
      case "food":
        return Math.min(quantity * 5, 1000); 
      default:
        return 35;
    }
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
        itemCategory: formData.requestType === "item" ? itemCategory : undefined,
        ngoStatus: formData.isNGO ? verificationStatus : "not_applicable",
      };

      if (paymentData) {
        payload.razorpayPaymentId = paymentData.razorpay_payment_id;
        payload.razorpayOrderId = paymentData.razorpay_order_id;
        payload.razorpaySignature = paymentData.razorpay_signature;
      }

      if (formData.requestType === "money") {
        delete payload.deliveryPreference;
        delete payload.paymentMode;
        delete payload.useCredits;
      }

      const formDataToSend = new FormData();
      for (const key in payload) formDataToSend.append(key, payload[key]);
      if (attachment) formDataToSend.append("attachment", attachment);
      
      ngoDocuments.forEach((doc, index) => {
        formDataToSend.append(`ngoDocument_${index}`, doc.file);
        formDataToSend.append(`ngoDocumentType_${index}`, doc.type);
      });

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
      const orderRes = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create payment order");
      }

      const order = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Help Circle",
        description: "Request Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
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
    
    if (formData.isNGO && verificationStatus === "pending_documents") {
      alert("⚠️ Please upload NGO verification documents before submitting");
      return;
    }
    
    setIsProcessingPayment(true);

    if (formData.requestType === "money") {
      if (!formData.accountNumber || !formData.accountHolderName || !formData.ifscCode || !formData.bankName) {
        alert("⚠️ Please fill all bank account details for money transfer");
        setIsProcessingPayment(false);
        return;
      }
    }

    let requiredCredits = 0;
    let amountToPay = 0;

    if (formData.requestType === "money") {
      amountToPay = 0;
    } else if (formData.requestType === "item") {
      if (formData.isNGO || formData.urgency === "High") {
        requiredCredits = 0;
      } else if (formData.paymentMode === "credits") {
        requiredCredits = calculateRequiredCredits();
      } else if (formData.paymentMode === "hybrid") {
        requiredCredits = Number(formData.useCredits) || 0;
        const totalRequired = calculateRequiredCredits();
        amountToPay = Math.max(0, totalRequired - requiredCredits);
      } else if (formData.paymentMode === "money") {
        requiredCredits = 0;
        amountToPay = calculateRequiredCredits();
      }
    } else if (formData.requestType === "blood") {
      requiredCredits = 0;
      amountToPay = 0;
    }

    if (user.credits < requiredCredits) {
      alert(`⚠️ You need at least ${requiredCredits} credits to submit this request. Your balance: ${user.credits} credits`);
      setIsProcessingPayment(false);
      return;
    }

    try {
      if (amountToPay > 0) {
        await initiateRazorpayPayment(amountToPay);
      } else {
        await submitRequest();
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setIsProcessingPayment(false);
    }
  };

  const getButtonText = () => {
    if (isProcessingPayment) {
      return "Processing...";
    }
    
    if (formData.requestType === "money") {
      return "Submit Request";
    }
    
    if (formData.requestType === "item" && 
        (formData.paymentMode === "money" || formData.paymentMode === "hybrid") &&
        calculateRequiredCredits() > 0) {
      return "Proceed to Payment";
    }
    
    return "Submit Request";
  };

  const renderCostInfo = () => {
    if (formData.requestType !== "item") return null;
    
    const requiredCredits = calculateRequiredCredits();
    
    if (formData.isNGO || formData.urgency === "High") {
      return <p className="text-success">✅ This request is free for NGOs and high urgency cases</p>;
    }
    
    if (formData.paymentMode === "credits") {
      return <p className="text-muted">⚡ You need <b>{requiredCredits} credits</b> to submit this request. Balance: <b>{user.credits}</b></p>;
    }
    
    if (formData.paymentMode === "hybrid") {
      const creditsToUse = Number(formData.useCredits) || 0;
      const remainingPayment = Math.max(0, requiredCredits - creditsToUse);
      
      return (
        <>
          <div className="mb-3">
            <label className="form-label">Credits to Use (max {requiredCredits})</label>
            <input 
              type="number" 
              name="useCredits" 
              className="form-control" 
              value={formData.useCredits} 
              onChange={handleChange} 
              min="0" 
              max={Math.min(user.credits, requiredCredits)} 
            />
          </div>
          <p className="text-muted">
            Balance: <b>{user.credits}</b> credits <br />
            Remaining Payment (Money): ₹{remainingPayment}
          </p>
        </>
      );
    }
    
    if (formData.paymentMode === "money") {
      return <p className="text-muted">💰 You need to pay <b>₹{requiredCredits}</b> to submit this request</p>;
    }
    
    return null;
  };

  const renderNgoVerificationSection = () => {
    if (!formData.isNGO) return null;
    
    return (
      <div className="ngo-verification-section mt-4 p-3 border rounded">
        <h5 className="mb-3">NGO Verification</h5>
        
        {verificationStatus === "pending_documents" && (
          <>
            <p className="text-info">
              🔍 To qualify for NGO benefits, please upload verification documents:
            </p>
            <ul className="text-muted small">
              <li>Registration Certificate</li>
              <li>PAN Card</li>
              <li>Bank Account Proof</li>
              <li>Leadership/Trustee Details</li>
              <li>Recent Activity Report (optional)</li>
            </ul>
          </>
        )}
        
        {verificationStatus === "documents_uploaded" && (
          <p className="text-success">
            ✅ Documents uploaded! Your request will be processed after verification.
          </p>
        )}
        
        <div className="mb-3">
          <label className="form-label">Upload NGO Verification Documents</label>
          <input 
            type="file" 
            className="form-control" 
            onChange={handleNgoDocumentUpload} 
            accept=".jpg,.jpeg,.png,.pdf" 
            multiple 
          />
          <div className="form-text">You can select multiple files</div>
        </div>
        
        {ngoDocuments.length > 0 && (
          <div className="uploaded-documents">
            <h6>Uploaded Documents:</h6>
            <ul className="list-group">
              {ngoDocuments.map((doc, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{doc.file.name} <small className="text-muted">({doc.type.replace('_', ' ')})</small></span>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeNgoDocument(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
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
                  {itemCategory && (
                    <div className="form-text">
                      Detected category: {itemCategory}
                    </div>
                  )}
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

            {renderNgoVerificationSection()}

            <div className="mb-3">
              <label className="form-label">Upload Additional Document (optional)</label>
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

                {renderCostInfo()}
              </>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-100 mt-3"
              disabled={isProcessingPayment || (formData.isNGO && verificationStatus === "pending_documents")}
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