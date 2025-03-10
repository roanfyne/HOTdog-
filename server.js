const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(fileUpload());

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ success: false, message: 'No files were uploaded.' });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, 'public', 'files', file.name);

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: err });
        }

        res.json({ success: true, message: 'File uploaded successfully!' });
    });
});

app.get('/files', (req, res) => {
    const filesPath = path.join(__dirname, 'public', 'files');
    fs.readdir(filesPath, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: err });
        }

        res.json(files);
    });
});

app.get('/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const filesPath = path.join(__dirname, 'public', 'files');
    fs.readdir(filesPath, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: err });
        }

        const result = files.filter(file => file.toLowerCase().includes(query));
        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});