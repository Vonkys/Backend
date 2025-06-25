// server.js

const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // workaround pro ESM

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "8srbeawwdm8fdtkvowe82karrmvq1wmga5obshqn6qgwdxsom5l3tmxjebiugh6b"; // sem si dal svůj API klíč napevno

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
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server běží na portu ${PORT}`);
});
