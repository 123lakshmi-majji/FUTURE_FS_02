const express = require('express');
const app = express();
const PORT = 5002;

app.get('/test', (req, res) => {
  res.send('OK');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Minimal server running on port ' + PORT);
});
