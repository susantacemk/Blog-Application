const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes.js");
// creating a app
const app = express();

const PORT = 8000;

//  Connect mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/BlogTech").then(e => {
  console.log("MongoDb Connected");
});
// View Engine set
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middleware
app.use(express.urlencoded({ extended: false }));

// HomePage Route
app.get("/", (req, res) => {
  return res.render("home");
});

app.use("/user", userRoutes);
// Listining the app in port 8000
app.listen(PORT, () => {
  console.log(`Server Started at PORT : ${PORT}`);
});
