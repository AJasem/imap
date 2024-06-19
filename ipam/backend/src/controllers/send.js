const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Imap = require("imap");

const send = async (req, res) => {
  // app.post("/send-email", async (req, res) => {
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
        const formattedDate = new Date().toUTCString();

        const attachmentHeaders = attachments.map((attachment) => {
          return `Content-Disposition: attachment; filename="${attachment.filename}"\r\nContent-Type: ${attachment.contentType}\r\n\r\n`;
        });

        const emailContent = `From: ${mailOptions.from}\r\nTo: ${
          mailOptions.to
        }\r\nSubject: ${mailOptions.subject}\r\nDate: ${formattedDate}\r\n\r\n${
          mailOptions.text || ""
        }\r\n\r\n${attachmentHeaders.join("\r\n")}`;

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
};

module.exports = send;
