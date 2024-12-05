const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/transcribe', (req, res) => {
  console.log(req.body);
  return res.json({ message: 'Transcription received' });
})

app.get('/api/summary/:id', (req, res) => {
  console.log(req.params.id);
  //fetch summary from database
})

app.listen(port)