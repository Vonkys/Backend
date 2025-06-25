// === server.js === const express = require("express"); const fetch = require("node-fetch"); const cors = require("cors");

const app = express(); app.use(cors()); app.use(express.json());

const API_KEY = "8srbeawwdm8fdtkvowe82karrmvq1wmga5obshqn6qgwdxsom5l3tmxjebiugh6b";

app.post("/verify-user", async (req, res) => { const { accessToken } = req.body;

try { const response = await fetch("https://api.minepi.com/v2/me", { method: "GET", headers: { Authorization: Bearer ${accessToken}, "X-API-Key": API_KEY }, });

const data = await response.json();

if (data.username) {
  return res.json({ username: data.username });
} else {
  return res.status(400).json({ error: "Uživatel nenalezen" });
}

} catch (err) { console.error("Chyba pri overeni:", err); res.status(500).json({ error: "Serverová chyba pri ověření" }); } });

app.listen(3000, () => { console.log("✅ Backend bezi na http://localhost:3000"); });

