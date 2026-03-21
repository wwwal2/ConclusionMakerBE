const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const EasyDocx = require('node-easy-docx');
const officeParser = require('officeparser');

const app = express();
const PORT = 4000;

const FILES_DIR = path.join(__dirname, '../../data/files');
const TEMPLATE_DIR = path.join(__dirname, '../../data/template');
const STATIC_PART_DATA_DIR = path.join(__dirname, '../../data/staticPart');

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

// app.get('/api/files/:filename', (req, res) => {
//   const filename = req.params.filename
//   const filePath = path.join(FILES_DIR, filename)

//   if (!filePath.startsWith(FILES_DIR)) {
//     return res.status(400).send('Invalid filename')
//   }

//   try {
//     const docx = new EasyDocx({ path: filePath })
//     docx.parseDocx()
//       .then(data => res.json(data))
//       .catch(err => {
//         console.error('Error parsing file:', err.message)
//         res.status(500).send('Failed to parse file')
//       })
//   } catch (err) {
//     console.error('Error loading file:', err.message)
//     res.status(404).send('File not found')
//   }
// });

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

// app.get('/api/files/:filename', (req, res) => {
//   const filename = req.params.filename
//   const filePath = path.join(FILES_DIR, filename)

//   if (!filePath.startsWith(FILES_DIR)) {
//     return res.status(400).send('Invalid filename')
//   }

//   officeParser.parseOffice(filePath)
//     .then(data => res.json(data))
//     .catch(err => {
//       console.error('Error parsing file:', err.message)
//       res.status(500).send('Failed to parse file')
//     })
// });

app.listen(PORT, () => {
  console.log(`Excel dataSource server listening on http://localhost:${PORT}`)
});

