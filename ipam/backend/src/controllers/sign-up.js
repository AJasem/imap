const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const { updateDatabase, deleteEmail } = require("../db/database.js");

dotenv.config();

const secretKey = process.env.secretKey;

const signUp = async (req, res) => {
  const deleteAccountAfterTime = (deleteTime, email) => {
    setTimeout(async () => {
      try {
        const response = await axios.post(
          `https://premium257.web-hosting.com:2083/execute/Email/delete_pop`,
          { email: email, domain: "ahmads.dev" },
          {
            headers: {
              Authorization: process.env.authToken,
            },
          }
        );

        if (response.data.errors) {
          console.error("Error deleting email address:", response.data.errors);
        } else {
          await deleteEmail(email);
          console.log("Email address deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting email address:", error);
      }
    }, Number(deleteTime) * 24 * 60 * 60 * 1000);
  };

  try {
    const { email, password, deletionTime } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      email: email,
      password: hashedPassword,
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

    const token = jwt.sign({ email, password: hashedPassword }, secretKey);

    deleteAccountAfterTime(deletionTime, email);

    const deleteTimeStamp =
      new Date().getTime() + Number(deletionTime) * 24 * 60 * 60 * 1000;

    await updateDatabase(email, deleteTimeStamp , hashedPassword);

    res.json({ token, deleteTimeStamp });
  } catch (error) {
    console.error("Error creating email address:", error);
    res.status(500).json({
      error: "An error occurred while creating the email address",
      message: error.message,
    });
  }
};

module.exports = signUp;
