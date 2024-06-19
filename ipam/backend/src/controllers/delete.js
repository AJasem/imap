const Imap = require("imap");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { deleteEmail } = require("../db/database.js");

dotenv.config();

secretKey = process.env.secretKey;
const deleteMessage = async (req, res) => {
  // app.delete("/delete-message/:ENDPOINT/:uid", async (req, res) => {
  try {
    const token = req.headers.authorization;
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { email, password } = decoded;
    const uid = req.params.uid;
    const ENDPOINT = req.params.ENDPOINT;
    const imapConfig = {
      user: email,
      password: password,
      host: "premium257.web-hosting.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    };
    await deleteEmail(email);
    const imap = new Imap(imapConfig);
    const fullMailboxName = ENDPOINT === "sent" ? "INBOX.Sent" : "INBOX";
    imap.once("ready", () => {
      imap.openBox(fullMailboxName, false, () => {
        imap.addFlags(uid, ["\\Deleted"], (err) => {
          if (err) {
            console.error("Error marking email as deleted:", err);
            res.status(500).json({ error: err.message });
            imap.end();
            return;
          }

          imap.expunge(uid, (expungeErr) => {
            if (expungeErr) {
              console.error("Error expunging mailbox:", expungeErr);
              res.status(500).json({ error: expungeErr.message });
            } else {
              console.log("Email permanently deleted successfully");
              res.status(200).json({ message: "Email permanently deleted" });
            }
            imap.end();
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.error("IMAP error:", err);
      res.status(500).json({ error: err.message });
    });

    imap.once("end", () => {
      console.log("Connection ended");
    });

    imap.connect();
  } catch (error) {
    console.error("Error marking email as deleted:", error);
    res.status(500).json({
      error: "An error occurred while marking email as deleted",
      message: error.message,
    });
  }
};

module.exports = deleteMessage;
