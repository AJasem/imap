const express = require("express");
const deleteMessage = require("../controllers/delete.js");
const login = require("../controllers/login.js");
const fetch = require("../controllers/fetch.js");
const seen = require("../controllers/seen.js");
const send = require("../controllers/send.js");
const signUp = require("../controllers/sign-up.js");
const auth = require("./auth.js");

const emailRoutes = express.Router();
emailRoutes.delete("/delete-message/:ENDPOINT/:uid", auth, deleteMessage);
emailRoutes.post("/login", auth, login);
emailRoutes.get("/fetch-emails", auth, fetch);
emailRoutes.get("/sent", auth, fetch);
emailRoutes.post("/mark-as-seen", auth, seen);
emailRoutes.post("/send-email", auth, send);
emailRoutes.post("/sign-up", auth, signUp);

module.exports = emailRoutes;
