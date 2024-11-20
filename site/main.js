const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/api', (req, res) => {
  console.log(req.body);
})

app.listen(port)