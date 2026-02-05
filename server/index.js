require('dotenv').config()
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { Web3Storage } = require('web3.storage')

const upload = multer({ dest: path.join(__dirname, 'tmp') })
const app = express()
const PORT = process.env.PORT || 4000

const token = process.env.WEB3STORAGE_API_TOKEN
if (!token) {
  console.warn('Warning: WEB3STORAGE_API_TOKEN is not set. Server will not function properly without it.')
}

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const client = new Web3Storage({ token })
    const filePath = req.file.path
    const fileStream = fs.createReadStream(filePath)
    // web3.storage client.put accepts iterable of File/Blob/Uint8Array/Stream
    const cid = await client.put([fileStream], { name: req.file.originalname })
    const url = `https://dweb.link/ipfs/${cid}/${encodeURIComponent(req.file.originalname)}`
    res.json({ cid, url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'upload failed' })
  } finally {
    // cleanup temp file
    fs.unlink(req.file.path, () => {})
  }
})

app.get('/', (req, res) => res.send('File-share proxy running'))

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
