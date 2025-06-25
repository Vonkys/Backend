const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.PI_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/verify", async (req, res) => {
  const accessToken = req.body.accessToken;

  if (!accessToken) {
    return res.status(400).json({ error: "Missing access token" });
  }

  try {
    const response = await fetch("https://api.minepi.com/v2/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-API-Key": API_KEY,
      },
    });

    const data = await response.json();

    if (data && data.username) {
      res.json({ success: true, username: data.username });
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
