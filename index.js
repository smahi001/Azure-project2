const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

// Root / Dashboard
app.get(["/", "/dashboard"], (req, res) => {
  res.send({ status: "ok", page: "dashboard" });
});

// Login endpoint — returns token
app.post("/login", (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).send({ error: "username required" });
  const fakeToken = Buffer.from(username + ":" + Date.now()).toString("base64");
  res.send({ token: fakeToken });
});

// Products endpoint — simulate DB read
app.get(["/products", "/browse"], async (req, res) => {
  await new Promise(r => setTimeout(r, Math.floor(Math.random() * 100) + 20));
  res.send([
    { sku: "coffee123", name: "Coffee A", price: 3.5 },
    { sku: "coffee234", name: "Coffee B", price: 4.0 }
  ]);
});

// Submit Order endpoint
app.post("/submit-order", async (req, res) => {
  const order = req.body;
  if (!order || !order.userId) {
    return res.status(400).send({ error: "invalid order" });
  }
  await new Promise(r => setTimeout(r, Math.floor(Math.random() * 200) + 50));
  res.status(201).send({
    orderId: "ORD-" + Date.now(),
    received: order
  });
});

// Health check
app.get("/health", (req, res) => {
  res.send({ status: "healthy" });
});

// Run Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

