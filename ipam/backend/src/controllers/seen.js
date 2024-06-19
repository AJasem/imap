const jwt = require("jsonwebtoken");
const Imap = require("imap");

const seen = async (req, res) => {
  // app.post("/mark-as-seen", async (req, res) => {
  try {
    const token = req.headers.authorization;
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { email, password } = decoded;
    const { uid } = req.body;

    const imapConfig = {
      user: email,
      password: password,
      host: "premium257.web-hosting.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    };

    const imap = new Imap(imapConfig);

    imap.once("ready", () => {
      imap.openBox("INBOX", false, () => {
        imap.addFlags(uid, ["\\Seen"], (err) => {
          if (err) {
            console.error("Error marking email as seen:", err);
            res.status(500).json({ error: err.message });
          } else {
            console.log("Email marked as seen successfully");
            res.status(200).json({ message: "Email marked as seen" });
          }
          imap.end();
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
    console.error("Error marking email as seen:", error);
    res.status(500).json({
      error: "An error occurred while marking email as seen",
      message: error.message,
    });
  }
};

module.exports = seen;
