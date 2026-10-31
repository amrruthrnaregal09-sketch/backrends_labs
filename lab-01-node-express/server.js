const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// GET / - Welcome route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to my Node.js and Express server!");
});

// GET /about - Student details
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "Amrruth R Naregal",
    section: "CSE Gen AI 2A"
  });
});

// GET /time - Current date and time
app.get("/time", (req, res) => {
  res.status(200).json({
    currentDateTime: new Date().toString()
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).send("404 - Route not found");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
