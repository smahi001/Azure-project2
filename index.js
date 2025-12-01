<<<<<<< HEAD
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

// Root / Dashboard
app.get(["/", "/dashboard"], (req, res) => {
  res.send({ status: "ok", page: "dashboard" });
});
=======
// app.js — simple perf-test app (merged & fixed)
const express = require('express');
const app = express();

app.use(express.json());

// Dashboard / root
app.get(['/', '/dashboard'], (req, res) => {
  res.json({ status: 'ok', page: 'dashboard' });
});

// Health
app.get('/health', (req, res) => res.send('OK'));

// Login - returns a fake token (used by JMeter)
app.post('/login', (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username required' });
  const fakeToken = Buffer.from(username + ':' + Date.now()).toString('base64');
  res.json({ token: fakeToken });
});

// Products - simulate DB read latency (non-blocking)
app.get(['/products', '/browse'], async (req, res) => {
  await new Promise(r => setTimeout(r, Math.floor(Math.random() * 100) + 20));
  const items = Array.from({ length: 10 }, (_, i) => ({ sku: `coffee${100 + i}`, name: `Coffee ${i}`, price: (3 + i * 0.5).toFixed(2) }));
  res.json(items);
});

// Submit-order - simulate DB write latency, returns 201
app.post('/submit-order', async (req, res) => {
  const order = req.body;
  if (!order || !order.userId) return res.status(400).json({ error: 'invalid order' });
  await new Promise(r => setTimeout(r, Math.floor(Math.random() * 200) + 50));
  res.status(201).json({ orderId: 'ORD-' + Date.now(), received: order });
});

// Legacy checkout route kept (non-blocking) — optional
app.post('/checkout', async (req, res) => {
  await new Promise(r => setTimeout(r, 200)); // non-blocking equivalent to your busy loop
  res.json({ status: 'ok', orderId: Math.floor(Math.random() * 100000) });
});
>>>>>>> 63efbd1959e19509252a11c2edad81f87b687354

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

module.exports = app;
