require('dotenv').config();
const express = require('express');

const app = express();

app.get('/health', (req, res) => {
  res.type('text/plain').send('ok');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
