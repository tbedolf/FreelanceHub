import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import Profile from "./pages/Profile";
import MyBids from "./pages/MyBids";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function Home() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">
            <span aria-hidden="true" />
            The focused freelance marketplace
          </p>
          <h1>
            Bring great ideas to life with
            <span> people who get it.</span>
          </h1>
          <p className="landing-intro">
            Find the right talent, win meaningful work, and keep every project
            moving—from the first bid to the final milestone.
          </p>

          <div className="landing-actions">
            <Link className="landing-primary-action" to="/register">
              Get started free <span aria-hidden="true">→</span>
            </Link>
            <Link className="landing-secondary-action" to="/projects">
              Explore projects
            </Link>
          </div>

          <div className="landing-trust">
            <div>
              <strong>One workspace</strong>
              <span>Projects, bids, and milestones</span>
            </div>
            <div>
              <strong>Two ways to grow</strong>
              <span>Hire talent or find your next project</span>
            </div>
          </div>
        </div>

        <div className="landing-hero-visual" aria-label="FreelanceHub project overview">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

          <article className="project-preview">
            <div className="preview-header">
              <div>
                <span className="preview-label">Featured project</span>
                <h2>Product dashboard redesign</h2>
              </div>
              <span className="preview-status">Open</span>
            </div>
            <p>
              Create a focused, accessible dashboard for a growing SaaS team.
            </p>
            <div className="preview-skills">
              <span>UI/UX</span>
              <span>React</span>
              <span>Design systems</span>
            </div>
            <div className="preview-footer">
              <div>
                <small>Project budget</small>
                <strong>$4,800</strong>
              </div>
              <div className="preview-avatars" aria-label="Three freelancers interested">
                <span>AM</span>
                <span>JL</span>
                <span>+8</span>
              </div>
            </div>
          </article>

          <div className="landing-float-card float-bid">
            <span className="float-icon">↗</span>
            <div>
              <small>New bid received</small>
              <strong>Perfect match · 96%</strong>
            </div>
          </div>

          <div className="landing-float-card float-milestone">
            <span className="float-icon">✓</span>
            <div>
              <small>Milestone complete</small>
              <strong>Design system approved</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-audience" aria-labelledby="audience-title">
        <div className="landing-section-heading">
          <p>Built for both sides of great work</p>
          <h2 id="audience-title">Choose how you want to grow.</h2>
        </div>

        <div className="audience-grid">
          <article className="audience-card audience-client">
            <span className="audience-number">01</span>
            <div>
              <p>For clients</p>
              <h3>Turn your next idea into real progress.</h3>
              <span>
                Post a clear brief, compare bids, manage milestones, and keep
                the best people close.
              </span>
              <Link to="/register">
                Start hiring <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>

          <article className="audience-card audience-freelancer">
            <span className="audience-number">02</span>
            <div>
              <p>For freelancers</p>
              <h3>Find work worthy of your best skills.</h3>
              <span>
                Discover open projects, submit focused bids, and build a track
                record clients can trust.
              </span>
              <Link to="/projects">
                Find projects <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="app-shell">
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-project"
          element={
            <ProtectedRoute>
              <NewProject />
            </ProtectedRoute>
          }
        />

        <Route path="/projects/:id/edit" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-bids" element={<ProtectedRoute><MyBids /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
