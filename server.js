const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4000;

const FILES_DIR = path.join(__dirname, '../../data/files');
const TEMPLATE_DIR = path.join(__dirname, '../../data/template');

app.use(cors({
  origin: 'http://localhost:5173',
}))

// app.get('/api/template1', (req, res) => {
//   const templatePath = path.join(TEMPLATES_DIR, 'templateDOCX.docx')

//     res.setHeader(
//     "Content-Type",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//   );
//   res.setHeader("Content-Disposition", "attachment; filename=template1.docx");

//     res.sendFile(templatePath, (err) => {
//     if (err) {
//       console.error("Error sending template:", err.message);
//       res.status(404).send("Template not found");
//     }
//   });
// })

// app.get('/api/data-source-excel', (req, res) => {
//   fs.readdir(DATA_SOURCE_DIR, (err, files) => {
//     if (err) {
//       return res.status(500).send('Cannot read dataSource folder')
//     }

//     const excelFile = files.find((f) => /\.(xls|xlsx|xlsm)$/i.test(f))

//     if (!excelFile) {
//       return res.status(404).send('No Excel file found in dataSource')
//     }

//     const fullPath = path.join(DATA_SOURCE_DIR, excelFile)
//     res.download(fullPath, excelFile)
//   })
// })

app.get('/api/template', (req, res) => {
  fs.readdir(TEMPLATE_DIR, (err, files) => {
    if (err) {
      return res.status(500).send('Cannot read files folder')
    }
    const docxFiles = files.filter((f) => /\.docx$/i.test(f))
    res.json(docxFiles)
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

