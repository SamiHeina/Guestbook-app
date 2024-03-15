const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/guestbook', (req, res) => {
  const guestbookData = JSON.parse(fs.readFileSync('guestbook.json'));
  res.json(guestbookData);
});

app.get('/newmessage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newmessage.html'));
});

app.post('/newmessage', (req, res) => {
  const { username, country, message } = req.body;

  if (!username || !country || !message) {
    res.status(400).send('All fields are required');
    return;
  }

  const newEntry = { username, country, message };
  const guestbookData = JSON.parse(fs.readFileSync('guestbook.json'));
  guestbookData.push(newEntry);
  fs.writeFileSync('guestbook.json', JSON.stringify(guestbookData));

  res.redirect('/guestbook');
});

app.post('/ajaxmessage', (req, res) => {
  const { username, country, message } = req.body;

  if (!username || !country || !message) {
    res.status(400).send('All fields are required');
    return;
  }

  const newEntry = { username, country, message };
  const guestbookData = JSON.parse(fs.readFileSync('guestbook.json'));
  guestbookData.push(newEntry);
  fs.writeFileSync('guestbook.json', JSON.stringify(guestbookData));

  res.json(guestbookData);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
