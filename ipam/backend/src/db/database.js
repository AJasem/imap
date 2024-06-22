const mongodb = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const updateDatabase = async (email, timeStamp, hashedPassword) => {
  const client = new mongodb.MongoClient(process.env.MongoURL);
  try {
    await client.connect();
    const db = client.db("dmail");
    const users = db.collection("users");

    await users.insertOne({ email, timeStamp, hashedPassword });
  } catch (error) {
    throw new Error("Error updating database: " + error);
  } finally {
    await client.close();
  }
};
const checkTimeExists = async (email) => {
  const client = new mongodb.MongoClient(process.env.MongoURL);
  try {
    await client.connect();
    const db = client.db("dmail");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error);
  } finally {
    await client.close();
  }
};
const deleteEmail = async (email) => {
  const client = new mongodb.MongoClient(process.env.MongoURL);
  try {
    await client.connect();
    const db = client.db("dmail");
    const users = db.collection("users");

    await users.deleteOne({ email });
  } catch (error) {
    throw new Error("Error deleting email: " + error);
  } finally {
    await client.close();
  }
};
module.exports = {
  checkTimeExists,
  updateDatabase,
  deleteEmail,
};
