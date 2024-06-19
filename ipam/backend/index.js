// Load our .env variables
const dotenv = require("dotenv");
const { createServer } = require("http");
const app = require("./app");
dotenv.config();

// Create a server
const startServer = () => {
  const server = createServer(app);

  const PORT = process.env.PORT || 3001;

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

// Start the server
startServer();
