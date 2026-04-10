// client/src/pages/EditLead.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "website",
    status: "new",
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await api.get("/leads");
        const lead = (response.data.leads || []).find((l) => l._id === id);
        if (!lead) {
          toast.error("Lead not found");
          navigate("/leads");
          return;
        }
        setFormData({
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          source: lead.source || "website",
          status: lead.status || "new",
        });
      } catch (error) {
        console.error("Failed to load lead:", error);
        toast.error("Failed to load lead");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/leads/${id}`, formData);
      toast.success("Lead updated successfully");
      navigate("/leads");
    } catch (error) {
      console.error("Failed to update lead:", error);
      toast.error("Failed to update lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="stack page-with-bg">
        <div className="card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="stack page-with-bg">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Lead</h1>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLead;
