const express = require("express");
const cors = require("cors");
const emailRoutes = require("./src/routes/users.js");

// Create an express server
const app = express();

// Tell express to use the json middleware
app.use(express.json());
// Allow everyone to access our API. In a real application, we would need to restrict this!
app.use(cors());

app.use(emailRoutes);

module.exports = app;
