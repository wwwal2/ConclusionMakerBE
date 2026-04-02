const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const EasyDocx = require('node-easy-docx');
const officeParser = require('officeparser');
const AdmZip = require('adm-zip');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = 4000;

const FILES_DIR = path.join(__dirname, '../../data/files');
const TEMPLATE_DIR = path.join(__dirname, '../../data/template');
const STATIC_PART_DATA_DIR = path.join(__dirname, '../../data/staticPart');
const SAVED_TEXT_POINTSD_DIR = path.join(__dirname, '../../data/saved');

app.use(cors({
  origin: 'http://localhost:3000',
}))

app.get('/api/staticPart', (req, res) => {
  fs.readdir(STATIC_PART_DATA_DIR, (err, files) => {
    if (err) {
      return res.status(500).send('Cannot read files folder')
    }
    const docxFiles = files.filter((f) => /\.docx$/i.test(f));
    const filename = docxFiles[0];
    const filePath = path.join(STATIC_PART_DATA_DIR, filename);

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error sending file:', err.message)
        res.status(404).send('File not found')
      }
    })
  })
});

app.get('/api/defaultSavedTextpoints', (req, res) => {
  fs.readdir(SAVED_TEXT_POINTSD_DIR, (err, files) => {
    if (err) {
      return res.status(500).send('Cannot read files folder')
    }
    const jsonFiles = files.filter((f) => /\.json$/i.test(f));
    const filename = jsonFiles[0];
    if (!filename) {
      return res.status(404).send('No JSON file found')
    }
    const filePath = path.join(SAVED_TEXT_POINTSD_DIR, filename);

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err.message)
        return res.status(500).send('Failed to read file')
      }
      try {
        res.json(JSON.parse(data));
      } catch (e) {
        res.status(500).send('Failed to parse JSON')
      }
    });
  })
});

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

  const data = officeParser.parseOffice(filePath);
  data.then(data => res.json({
    plainText: data.toText(),
    paragraphs: data.content
  }))
    .catch(err => {
      console.error('Error parsing file:', err.message)
      res.status(500).send('Failed to parse file')
    });
});

app.listen(PORT, () => {
  console.log(`Excel dataSource server listening on http://localhost:${PORT}`)
});

