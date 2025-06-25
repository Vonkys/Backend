
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/verify", async (req, res) => {
  const accessToken = req.body.accessToken;
  const API_KEY = process.env.PI_API_KEY;

  try {
    const response = await fetch("https://api.minepi.com/v2/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-API-Key": API_KEY,
      },
    });

    const data = await response.json();
    console.log("✅ Server response:", data);
    res.json(data);
  } catch (error) {
    console.error("❌ Error verifying user:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
