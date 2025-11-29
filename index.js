const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res)=> res.send('Hello — Perf Test App'));
app.get('/products', (req,res) => {
  const items = Array.from({length:50}, (_,i)=> ({id:i, name:`item-${i}`}));
  res.json(items);
});
app.post('/login', (req,res) => {
  setTimeout(()=> res.json({token: 'fake-token'}), 120);
});
app.post('/checkout', (req,res) => {
  const start = Date.now();
  while(Date.now()-start < 200) {} 
  res.json({status:'ok', orderId: Math.floor(Math.random()*100000)});
});
app.get('/health', (req,res)=> res.send('OK'));

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening ${port}`));

