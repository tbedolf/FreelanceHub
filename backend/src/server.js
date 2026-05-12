require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes.js");
const projectRoutes = require("./routes/project.routes.js");
const bidRoutes = require("./routes/bid.routes.js");
const milestoneRoutes = require("./routes/milestone.routes.js");
const reviewRoutes = require("./routes/review.routes.js");

console.log("AUTH ROUTES:", authRoutes);

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "FreelanceHub API is running",
  });
});

/*
========================================
ROUTES
========================================
*/
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});