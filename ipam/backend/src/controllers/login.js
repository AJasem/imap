const jwt = require("jsonwebtoken");
const Imap = require("imap");
const { checkTimeExists } = require("../db/database.js");

const login = async (req, res) => {
  // app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await checkUserExists(email, password);

    if (userExists) {
      const token = jwt.sign({ email: email, password: password }, secretKey);
      const deleteTimeStamp = await checkTimeExists(email);

      res.json({ token, deleteTimeStamp });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while checking user existence" });
  }
};

const checkUserExists = async (email, password) => {
  const imapConfig = {
    user: email,
    password: password,
    host: "premium257.web-hosting.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  };

  const imap = new Imap(imapConfig);

  return new Promise((resolve, reject) => {
    imap.once("ready", () => {
      imap.end();
      resolve(true);
    });

    imap.once("error", (err) => {
      imap.end();
      if (err.message.includes("Authentication failed")) {
        resolve(false);
      } else {
        reject(err);
      }
    });

    imap.connect();
  });
};

module.exports = login;
