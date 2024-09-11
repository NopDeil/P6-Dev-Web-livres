const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect("mongodb+srv://noa:2607@cluster0.c5zvh.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

  
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });
  
  app.use(express.json());

  app.use("/api/auth", userRoutes);

module.exports = app;
