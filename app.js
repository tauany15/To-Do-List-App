const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoRoutes = require("./routes/todoRoutes");
const errorHandler = require("./middleware/errorHandler");


// Load environment variables
dotenv.config();

const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const MONGODB_URI = `mongodb+srv://${process.env.KEY}:${process.env.PASSWORD}@to-do-list-cluster.cqsieqc.mongodb.net/?appName=To-Do-List-Cluster`;

// View engine setup
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Database connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✓ Database connected successfully"))
.catch(err => {
  console.error("✗ Database connection error:", err);
  process.exit(1);
});

// Routes
app.use("/", todoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", { 
    errorCode: 404, 
    message: "Page not found" 
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("\nDatabase connection closed");
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});

module.exports = app;