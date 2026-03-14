const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4000;

const FILES_DIR = path.join(__dirname, '../../data/files');
const TEMPLATE_DIR = path.join(__dirname, '../../data/template');

app.use(cors({
  origin: 'http://localhost:3000',
}))

app.get('/api/template', (req, res) => {
  fs.readdir(TEMPLATE_DIR, (err, files) => {
    if (err) {
      return res.status(500).send('Cannot read files folder')
    }
    const docxFiles = files.filter((f) => /\.docx$/i.test(f));
    const filename = docxFiles[0];
    const filePath = path.join(TEMPLATE_DIR, filename);
    
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error sending file:', err.message)
        res.status(404).send('File not found')
      }
    })
  })
});

app.get('/api/files', (req, res) => {
  fs.readdir(FILES_DIR, (err, files) => {
    if (err) {
      return res.status(500).send('Cannot read files folder')
    }
    const docxFiles = files.filter((f) => /\.docx$/i.test(f))
    res.json(docxFiles)
  })
});

app.get('/api/files/:filename', (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(FILES_DIR, filename)

  if (!filePath.startsWith(FILES_DIR)) {
    return res.status(400).send('Invalid filename')
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Error sending file:', err.message)
      res.status(404).send('File not found')
    }
  })
});

app.listen(PORT, () => {
  console.log(`Excel dataSource server listening on http://localhost:${PORT}`)
});

