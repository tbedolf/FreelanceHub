import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useFeedback } from "../context/FeedbackContext";
import PageHeader from "../components/PageHeader";

export default function Profile() {
  const { updateUser } = useAuth();
  const { notify } = useFeedback();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/users/me").then(({ data }) => {
      setForm({ name: data.name, email: data.email, password: "" });
    }).catch((requestError) => {
      setError(requestError.response?.data?.message || "Failed to load profile.");
    }).finally(() => setLoading(false));
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { data } = await API.put("/users/me", form);
      updateUser(data);
      setForm((current) => ({ ...current, password: "" }));
      notify("Profile updated successfully.");
    } catch (error) {
      notify(error.response?.data?.message || "Profile update failed.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="page"><div className="loading-state">Loading your profile…</div></main>;
  if (error) return <main className="page"><div className="error-message" role="alert">{error}</div></main>;

  return <main className="editor-page"><div className="editor-shell profile-shell">
    <PageHeader eyebrow="Account settings" title="My profile" description="Keep your identity and sign-in details up to date." />
    <form className="editor-form" onSubmit={submit}>
      <div className="profile-summary">
        <span>{form.name?.charAt(0).toUpperCase()}</span>
        <div><strong>{form.name}</strong><small>{form.email}</small></div>
      </div>
      <div className="editor-section">
        <div className="form-field"><label htmlFor="profile-name">Full name</label><input id="profile-name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div className="form-field"><label htmlFor="profile-email">Email address</label><input id="profile-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
        <div className="form-field"><label htmlFor="profile-password">New password <span className="optional-label">(optional)</span></label><input id="profile-password" type="password" autoComplete="new-password" minLength="8" placeholder="Leave blank to keep your current password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
      </div>
      <div className="editor-actions"><button disabled={submitting}>{submitting ? "Saving…" : "Save profile"}</button></div>
    </form>
  </div></main>;
}
