const express = require("express");

const axios = require("axios"); // To fetch data from the external API

const app = express();
const port = 4024;
const path = require("path");

const cors = require("cors");

const corsOptions = {
  origin: [
    `http://<your-local-ip>:${port}`, // Replace with your local IP address
    `http://localhost:${port}`,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));
// Middleware

app.use(express.json());

// Fetch data from the external API
const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://ledger.amanluthra.com/api/tasks/d"
    );
    return response.data.tasks;
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    return [];
  }
};

// API endpoint to get tasks
app.get("/api/tasks", async (req, res) => {
  const { name } = req.query;

  // Fetch data from the external API
  const data = await fetchData();

  if (name) {
    const filteredData = data.filter(
      (item) => item.name && item.name.toLowerCase() === name.toLowerCase()
    );
    return res.json(filteredData);
  }

  res.json(data);
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://<your-local-ip>:${port}`);
});
