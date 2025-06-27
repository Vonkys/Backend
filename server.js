const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;
// POZOR, ZDE DEJ SPRÁVNÝ KLÍČ!
const API_KEY = "ncch7lagkhrgquydyvv8g6wu70irf6xogg2vutxqhjawrjuld8y38h0cmdovrtoo";

app.use(cors());
app.use(express.json());

app.post("/verify", async (req, res) => {
  const accessToken = req.body.accessToken;
  if (!accessToken) {
    return res.status(400).json({ error: "Missing accessToken" });
  }

  try {
    const response = await fetch("https://api.minepi.com/v2/me", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      return res.status(400).json({ error: "Invalid Pi accessToken" });
    }

    const user = await response.json();
    if (user && user.username) {
      res.json({ username: user.username });
    } else {
      res.status(400).json({ error: "No username in Pi user data" });
    }
  } catch (err) {
    console.error("Pi /verify ERROR:", err);
    res.status(500).json({ error: "Pi verify failed", details: err.message });
  }
});

app.post("/approve", async (req, res) => {
  const paymentId = req.body.paymentId;
  if (!paymentId) return res.status(400).json({ error: "Missing paymentId" });

  try {
    const response = await fetch("https://api.minepi.com/v2/payments/" + paymentId + "/approve", {
      method: "POST",
      headers: {
        "Authorization": "Key " + API_KEY,
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    console.log("Pi /approve response:", data);
    res.json(data);
  } catch (err) {
    console.error("Pi /approve ERROR:", err);
    res.status(500).json({ error: "Pi approval failed", details: err.message });
  }
});

app.post("/complete", async (req, res) => {
  const paymentId = req.body.paymentId;
  const txid = req.body.txid;
  if (!paymentId || !txid) return res.status(400).json({ error: "Missing paymentId or txid" });

  try {
    const response = await fetch("https://api.minepi.com/v2/payments/" + paymentId + "/complete", {
      method: "POST",
      headers: {
        "Authorization": "Key " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid: txid })
    });
    const data = await response.json();
    console.log("Pi /complete response:", data);
    res.json(data);
  } catch (err) {
    console.error("Pi /complete ERROR:", err);
    res.status(500).json({ error: "Pi completion failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Backend běží na portu", PORT);
});
