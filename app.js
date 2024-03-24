const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Root Route: Sends the index.html file to the client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Guestbook Route: Displays guestbook entries in a table
app.get('/guestbook', (req, res) => {
  // Read guestbook data from guestbook.json file
  fs.readFile('guestbook.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading guestbook data');
      return;
    }

    // Parse JSON data into guestbookEntries array
    const guestbookEntries = JSON.parse(data);

    // Prepare HTML for displaying guestbook entries in a table
    let tableHtml = '<table class="table table-striped">';
    tableHtml += '<thead class="thead-dark">';
    tableHtml += '<tr><th>ID</th><th>Username</th><th>Country</th><th>Date</th><th>Message</th></tr>';
    tableHtml += '</thead>';
    tableHtml += '<tbody>';
    guestbookEntries.forEach(entry => {
      // Format the date if it's not undefined
      const formattedDate = entry.date ? new Date(entry.date).toLocaleString() : '';

      // Add a row for each guestbook entry
      tableHtml += `<tr><td>${entry.id}</td><td>${entry.username}</td><td>${entry.country}</td><td>${formattedDate}</td><td>${entry.message}</td></tr>`;
    });
    tableHtml += '</tbody>';
    tableHtml += '</table>';

    // Read guestbook.html template file
    fs.readFile('public/guestbook.html', 'utf8', (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading guestbook.html');
        return;
      }

      // Replace placeholder in guestbook.html with tableHtml
      const updatedHtml = html.replace('<!-- Dynamic content will be injected here -->', tableHtml);

      // Send the updated HTML with guestbook entries to the client
      res.send(updatedHtml);
    });
  });
});

// New Message Route: Displays a form for submitting new messages
app.get('/newmessage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newmessage.html'));
});

// Handler for submitting new messages via form POST request
app.post('/newmessage', (req, res) => {
  const { username, country, message } = req.body;

  // Validate that all form fields are filled
  if (!username || !country || !message) {
    res.status(400).send('All fields are required');
    return;
  }

  // Read existing guestbook data from guestbook.json file
  const guestbookData = JSON.parse(fs.readFileSync('guestbook.json'));

  // Determine the ID for the new message
  const newId = guestbookData.length + 1;

  // Create a new guestbook entry object
  const newEntry = { 
    id: newId,
    username, 
    country, 
    date: new Date().toISOString(), // Current date
    message 
  };

  // Add the new entry to the guestbook data
  guestbookData.push(newEntry);

  // Write the updated guestbook data back to the file
  fs.writeFileSync('guestbook.json', JSON.stringify(guestbookData));

  // Redirect to the guestbook page after submitting the new message
  res.redirect('/guestbook');
});

// Ajax Message Route: Displays a form for submitting new messages via AJAX
app.get('/ajaxmessage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ajaxmessage.html'));
});

// Start the server and listen on port 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



