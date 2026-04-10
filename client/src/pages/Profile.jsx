// client/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    company: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        company: user.company || "",
        location: user.location || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="stack page-with-bg">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Keep your details up to date</p>
        </div>
      </div>

      <div className="card profile-card">
        {!user ? (
          <div className="muted">No user data available.</div>
        ) : (
          <form onSubmit={handleSubmit} className="form">
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
              <span>Role</span>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              />
            </label>

            <label className="field">
              <span>Company</span>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="input"
              />
            </label>

            <label className="field">
              <span>Location</span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
              />
            </label>

            <label className="field">
              <span>Bio</span>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input"
                rows={4}
              />
            </label>

            <div className="actions">
              <button type="submit" className="btn">
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
