const express = require("express");
const axios = require("axios");
const { simpleParser } = require("mailparser");
const cors = require("cors");
const dotenv = require("dotenv");
const Imap = require("node-imap");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { checkUserExists, updateDatabase } = require("./database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cors());

const authToken = process.env.authToken;
const secretKey = process.env.secretKey;

function authenticateToken(req, res, next) {
  const token = process.env.authToken;

  if (token === authToken) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

app.use(authenticateToken);

app.post("/sign-up", async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
      domain: "ahmads.dev",
    };

    const response = await axios.post(
      `https://premium257.web-hosting.com:2083/execute/Email/add_pop`,
      data,
      {
        headers: {
          Authorization: process.env.authToken,
        },
      }
    );

    if (response.data.errors) {
      return res.status(400).json({ error: response.data.errors });
    }

    updateDatabase(req.body.email, req.body.password);

    const token = jwt.sign(
      { email: req.body.email, password: req.body.password },
      secretKey,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error creating email address:", error);
    res.status(500).json({
      error: "An error occurred while creating the email address",
      message: error.message,
    });
  }
});

// Fetch emails from INBOX
app.get("/fetch-emails", async (req, res) => {
  fetchEmailsFromMailbox("INBOX", req, res);
});

// Fetch emails from Sent mailbox
app.get("/sent", async (req, res) => {
  fetchEmailsFromMailbox("Sent", req, res);
});

// Fetch emails from Spam mailbox
app.get("/spam", async (req, res) => {
  fetchEmailsFromMailbox("Spam", req, res);
});

async function fetchEmailsFromMailbox(mailboxName, req, res) {
  const fullMailboxName = `INBOX.${mailboxName}`;
  try {
    const token = req.headers.authorization;
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { email, password } = decoded;

    const imap = new Imap({
      user: email,
      password: password,
      host: "premium257.web-hosting.com",
      port: 993,
      tls: true,
    });

    imap.once("ready", function () {
      openMailbox(imap, fullMailboxName, function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        imap.search(["ALL"], function (err, results) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          const f = imap.fetch(results, {
            bodies: "",
            struct: true,
          });

          const htmlBodies = [];
          f.on("message", function (msg, seqno) {
            const promise = new Promise((resolve, reject) => {
              let emailData = {};
              let uid;
              let seen;
              msg.once("attributes", function (attrs) {
                uid = attrs.uid;
                seen = attrs.flags.includes("\\Seen");
              });
              msg.once("body", function (stream, info) {
                simpleParser(stream)
                  .then((parsed) => {
                    emailData = {
                      uid: uid,
                      seen: seen,
                      from:
                        parsed.from.value[0].name ||
                        parsed.from.value[0].address,
                      subject: parsed.subject,
                      date:
                        parsed.date.getHours() +
                        ":" +
                        parsed.date.getMinutes() +
                        " " +
                        parsed.date.toDateString(),
                      html: parsed.html || parsed.textAsHtml,
                    };
                    resolve(emailData);
                  })
                  .catch(reject);
              });
            });

            htmlBodies.unshift(promise);
          });

          f.once("end", function () {
            imap.end();
            Promise.all(htmlBodies)
              .then((bodies) => {
                res.send(bodies);
              })
              .catch((error) => {
                console.error("Error parsing emails:", error);
                res.status(500).json({
                  error: "An error occurred while parsing emails",
                  message: error.message,
                });
              });
          });
        });
      });
    });

    imap.once("error", function (err) {
      console.log("IMAP error:", err);
      res.status(500).json({ error: err.message });
    });

    imap.once("end", function () {});

    imap.connect();
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({
      error: "An error occurred while fetching emails",
      message: error.message,
    });
  }
}

function openMailbox(imap, fullMailboxName, cb) {
  imap.openBox(fullMailboxName, true, cb);
}

app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text, attachments } = req.body;
    const token = req.headers.authorization;

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { email, password } = decoded;

    // Create SMTP transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: "premium257.web-hosting.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    // Send email
    const mailOptions = {
      from: email,
      to: to,
      subject: subject,
      text: text,
      attachments: attachments.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
      })),
    };

    const info = await transporter.sendMail(mailOptions);

    const imapConfig = {
      user: email,
      password: password,
      host: "premium257.web-hosting.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    };

    const imap = new Imap(imapConfig);

    imap.once("ready", function () {
      imap.openBox("INBOX.Sent", true, function (err, box) {
        if (err) {
          console.error("Error opening Sent folder:", err);
          return res.status(500).json({ error: err.message });
        }
        const formattedDate = new Date().toUTCString(); // Format the current date

        // Prepare the attachment headers
        const attachmentHeaders = attachments.map((attachment) => {
          return `Content-Disposition: attachment; filename="${attachment.filename}"\r\nContent-Type: ${attachment.contentType}\r\n\r\n`;
        });

        // Concatenate all parts: headers, email text, and attachments
        const emailContent = `From: ${mailOptions.from}\r\nTo: ${
          mailOptions.to
        }\r\nSubject: ${mailOptions.subject}\r\nDate: ${formattedDate}\r\n\r\n${
          mailOptions.text || ""
        }\r\n\r\n${attachmentHeaders.join("\r\n")}`;

        // Append sent email to "Sent" folder
        imap.append(emailContent, { mailbox: "INBOX.Sent" }, function (err) {
          if (err) {
            console.error("Error appending email to Sent folder:", err);
            res.status(500).json({ error: err.message });
          } else {
            console.log("Email appended to Sent folder successfully");
            res.status(200).json({
              message: "Email sent successfully",
              messageId: info.messageId,
            });
          }
          imap.end();
        });
      });
    });

    imap.once("error", function (err) {
      console.error("IMAP error:", err);
      res.status(500).json({ error: err.message });
    });

    imap.connect();
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: "An error occurred while sending the email",
      message: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await checkUserExists(email, password);

    if (userExists) {
      const token = jwt.sign({ email: email, password: password }, secretKey, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/mark-as-seen", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
