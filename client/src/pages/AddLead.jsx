// client/src/pages/AddLead.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const AddLead = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "website",
    status: "new",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/leads", formData);
      toast.success("Lead created successfully");
      navigate("/leads");
    } catch (error) {
      console.error("Failed to create lead:", error);
      toast.error("Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="stack page-with-bg">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Lead</h1>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            <label className="field">
              <span>Name *</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
              />
            </label>

            <label className="field">
              <span>Email *</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
              />
            </label>

            <label className="field">
              <span>Phone</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
              />
            </label>

            <label className="field">
              <span>Source</span>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="input"
              >
                <option value="website">Website</option>
                <option value="social">Social Media</option>
                <option value="referral">Referral</option>
              </select>
            </label>

            <label className="field">
              <span>Status</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
            </label>
          </div>

          <div className="actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => navigate("/leads")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLead;
