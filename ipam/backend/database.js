const mongodb = require("mongodb");

const updateDatabase = async (email, password) => {
  const client = new mongodb.MongoClient(process.env.MongoURL);
  try {
    await client.connect();
    const db = client.db("dmail");
    const users = db.collection("users");

    await users.insertOne({ email, password });
  } catch (error) {
    throw new Error("Error updating database: " + error);
  } finally {
    await client.close();
  }
};
const checkUserExists = async (email, password) => {
  const client = new mongodb.MongoClient(process.env.MongoURL);
  try {
    await client.connect();
    const db = client.db("dmail");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Compare plain text passwords
    if (user.password == password) {
      return user; // Passwords match, return user object
    } else {
      throw new Error("Passwords do not match");
    }
  } catch (error) {
    throw new Error(error);
  } finally {
    await client.close();
  }
};

module.exports = { checkUserExists, updateDatabase };
