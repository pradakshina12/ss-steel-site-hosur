const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
  res.json([
    { name: 'Steel Pipe', price: 120 },
    { name: 'Structural Material', price: 200 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
