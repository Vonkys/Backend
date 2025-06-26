const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "8srbeawwdm8fdtkvowe82karrmvq1wmga5obshqn6qgwdxsom5l3tmxjebiugh6b";

app.use(cors());
app.use(express.json());

// Přihlášení – ověření accessTokenu
app.post("/verify", async function (req, res) {
  const accessToken = req.body.accessToken;

  if (!accessToken) {
    return res.status(400).json({ error: "Missing access token" });
  }

  try {
    const response = await fetch("https://api.minepi.com/v2/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
        "X-API-Key": API_KEY
      }
    });

    const text = await response.text(); // přečteme odpověď jako text
    let data = null;

    try {
      data = JSON.parse(text); // pokus o převod na JSON
    } catch (e) {
      console.error("⚠ Neplatná JSON odpověď z Pi API:", text);
      return res.status(502).json({ error: "Invalid response from Pi API" });
    }

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

// Platba – schválení platby
app.post("/approve", async function (req, res) {
  const paymentId = req.body.paymentId;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing paymentId" });
  }

  console.log("✅ Platba připravena ke schválení: " + paymentId);

  res.json({ success: true });
});

// Platba – finální potvrzení platby
app.post("/complete", async function (req, res) {
  const paymentId = req.body.paymentId;
  const txid = req.body.txid;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: "Missing paymentId or txid" });
  }

  console.log("✅ Platba potvrzena: paymentId=" + paymentId + ", txid=" + txid);

  res.json({ success: true });
});

app.listen(PORT, function () {
  console.log("✅ Server běží na portu " + PORT);
});
