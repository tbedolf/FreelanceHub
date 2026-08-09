import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useFeedback } from "../context/FeedbackContext";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const navigate = useNavigate();
  const { notify } = useFeedback();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      await API.post("/auth/register", form);
      notify("Registration successful. You can now log in.");
      navigate("/login");
    } catch (error) {
      notify(error.response?.data?.message || "Registration failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Join FreelanceHub"
      title="Create your account"
      description="Choose how you want to work, then start building something great."
    >
      <form className="auth-form auth-form-register" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            type="text"
            name="name"
            placeholder="Your full name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="register-password">
            Password <span>8 characters minimum</span>
          </label>
          <input
            id="register-password"
            type="password"
            name="password"
            placeholder="Create a secure password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>

        <fieldset className="role-picker">
          <legend>I want to join as</legend>
          <label className={form.role === "CLIENT" ? "selected" : undefined}>
            <input
              type="radio"
              name="role"
              value="CLIENT"
              checked={form.role === "CLIENT"}
              onChange={handleChange}
            />
            <span>
              <strong>Client</strong>
              <small>Hire talent and manage projects</small>
            </span>
          </label>
          <label className={form.role === "FREELANCER" ? "selected" : undefined}>
            <input
              type="radio"
              name="role"
              value="FREELANCER"
              checked={form.role === "FREELANCER"}
              onChange={handleChange}
            />
            <span>
              <strong>Freelancer</strong>
              <small>Find projects and submit bids</small>
            </span>
          </label>
        </fieldset>

        <button className="auth-submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
