import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <main className="auth-shell">
      <section className="auth-brand" aria-label="FreelanceHub">
        <Link to="/" className="auth-logo" aria-label="FreelanceHub home">
          <span className="auth-logo-mark">FH</span>
          <span>FreelanceHub</span>
        </Link>

        <div className="auth-brand-copy">
          <span className="auth-accent" aria-hidden="true" />
          <p className="auth-kicker">Work without limits</p>
          <h1>
            Great work starts
            <span>with the right people.</span>
          </h1>
          <p>
            Connect with trusted talent, bring ambitious ideas to life, and
            manage every milestone in one focused workspace.
          </p>
        </div>

        <div className="auth-proof" aria-label="FreelanceHub benefits">
          <span>Verified talent</span>
          <span>Clear milestones</span>
          <span>Secure collaboration</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-inner">
          <nav className="auth-tabs" aria-label="Account access">
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Register
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Sign in
            </NavLink>
          </nav>

          <div className="auth-heading">
            <p>{eyebrow}</p>
            <h2>{title}</h2>
            <span>{description}</span>
          </div>

          {children}

          <p className="auth-terms">
            By continuing, you agree to use FreelanceHub responsibly and keep
            your account information secure.
          </p>
        </div>
      </section>
    </main>
  );
}
