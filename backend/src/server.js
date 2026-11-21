const dotenv = require("dotenv");

// Load and injects environment variables in to Node.js's global environment object (process.env)
dotenv.config();
const app = require("./app");

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`My-store API is running on http://localhost:${PORT}`);
});
