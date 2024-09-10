const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/Books");

const app = express();

mongoose
  .connect("mongodb+srv://noa:2607@cluster0.c5zvh.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(express.json());

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


// app.post("/api/books", (req, res, next) => {});
app.get("/api/books", (req, res, next) => {
  Book.find()
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
