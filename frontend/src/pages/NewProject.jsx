import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NewProject() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const role = user?.role?.toUpperCase();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    category: "",
  });

  if (role !== "CLIENT" && role !== "ADMIN") {
    return (
      <div className="page">
        <div className="card">
          <p>Only clients can post projects.</p>
        </div>
      </div>
    );
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5001/api/projects",
        {
          ...form,
          budgetMin: Number(form.budgetMin),
          budgetMax: Number(form.budgetMax),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Project created successfully!");
      navigate("/projects");
    } catch (error) {
      alert(error.response?.data?.message || "Project creation failed");
    }
  }

  return (
    <div className="form-card">
      <h1>Post a New Project</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Project title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Project description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          name="budgetMin"
          type="number"
          placeholder="Minimum budget"
          value={form.budgetMin}
          onChange={handleChange}
          required
        />

        <input
          name="budgetMax"
          type="number"
          placeholder="Maximum budget"
          value={form.budgetMax}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <button>Create Project</button>
      </form>
    </div>
  );
}