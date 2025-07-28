const express = require("express");
const request = require("request");
const cors = require("cors");
const app = express();

app.use(cors());

// Root route
app.get("/", (req, res) => {
  res.send("🧠 Frame Browser Proxy is running.");
});

// Proxy route
app.get("/proxy", (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("Missing 'url' query parameter.");
  }

  request(
    {
      url: targetUrl,
      headers: {
        "User-Agent": "Mozilla/5.0 (Wibkit Frame Browser Proxy)",
      },
    },
    (error, response, body) => {
      if (error) {
        return res.status(500).send("Error fetching target site.");
      }

      // Strip frame-blocking headers
      res.set("Content-Type", response.headers["content-type"] || "text/html");
      res.removeHeader("x-frame-options");
      res.removeHeader("content-security-policy");

      res.send(body);
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frame Browser Proxy running on port ${PORT}`);
});
