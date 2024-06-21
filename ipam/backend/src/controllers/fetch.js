const jwt = require("jsonwebtoken");
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.secretKey;

const fetch = async (req, res) => {
  // Determine the mailbox based on the endpoint
  const mailboxName = req.path.includes("sent") ? "Sent" : "INBOX";
  fetchEmailsFromMailbox(mailboxName, req, res);
};

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
      openMailbox(imap, fullMailboxName, async function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        imap.search(["ALL"], function (err, results) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (results.length === 0) {
            // No emails to fetch
            res.send([]);
            imap.end();
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
                      from: {
                        name: parsed.from.value[0].name,
                        address: parsed.from.value[0].address,
                      },
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
      if (!res.headersSent) {
        res.status(500).json({ error: err.message });
      }
    });

    imap.once("end", function () {
      console.log("Connection ended");
    });

    imap.connect();
  } catch (error) {
    console.error("Error fetching emails:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "An error occurred while fetching emails",
        message: error.message,
      });
    }
  }
}

function openMailbox(imap, fullMailboxName, cb) {
  imap.openBox(fullMailboxName, true, cb);
}

module.exports = fetch;
