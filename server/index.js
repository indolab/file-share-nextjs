require('dotenv').config()
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000

const UPLOAD_DIR = path.join(__dirname, 'uploads')
const TMP_DIR = path.join(__dirname, 'tmp')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true })

const storage = multer({ dest: TMP_DIR })

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOAD_DIR))

app.post('/upload', storage.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    // Create a unique filename to avoid collisions
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${req.file.originalname}`
    const destPath = path.join(UPLOAD_DIR, safeName)
    await fs.promises.rename(req.file.path, destPath)
    const url = `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(safeName)}`
    res.json({ url, filename: safeName })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'upload failed' })
  } finally {
    // ensure tmp file removal if it still exists
    fs.unlink(req.file.path, () => {})
  }
})

app.get('/', (req, res) => res.send('File-share proxy running'))

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
