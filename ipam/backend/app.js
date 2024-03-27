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

app.get("/fetch-emails", async (req, res) => {
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
      openInbox(imap, function (err, box) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        let messageCount = box.messages.total;

        let f;
        if (messageCount > 0) {
          let fetchRange = messageCount > 1 ? "1:*" : "1:1";
          f = imap.seq.fetch(fetchRange, {
            bodies: "",
            struct: true,
          });
        } else {
          console.log("No messages to fetch");
          res.status(200).json({ message: "No messages to fetch" });
          return;
        }

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
                      parsed.from.value[0].name || parsed.from.value[0].address,
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

            msg.once("end", function () {});
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
});

function openInbox(imap, cb) {
  imap.openBox("INBOX", true, cb);
}

app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text, attachments } = req.body;
    const token = req.headers.authorization;
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { email, password } = decoded;

    const transporter = nodemailer.createTransport({
      host: "premium257.web-hosting.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

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

    console.log("Message sent: %s", info.messageId);
    res
      .status(200)
      .json({ message: "Email sent successfully", messageId: info.messageId });
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

    const imap = new Imap({
      user: email,
      password: password,
      host: "premium257.web-hosting.com",
      port: 993,
      tls: true,
    });

    imap.once("ready", function () {
      openInbox(imap, function (err, box) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        imap.addFlags(uid, ["\\Seen"], function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(200).json({ message: "Email marked as seen" });
          }
          imap.end();
        });
      });
    });

    imap.once("error", function (err) {
      console.log("IMAP error:", err);
      res.status(500).json({ error: err.message });
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
