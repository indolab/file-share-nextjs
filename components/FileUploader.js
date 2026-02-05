import { useState } from 'react'
import { Web3Storage } from 'web3.storage'

const MAX_BYTES = 60 * 1024 * 1024 // 60 MB

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function FileUploader() {
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN || ''

  async function handleUpload(e) {
    e.preventDefault()
    setResult(null)
    if (!selected) return setStatus('Pick a file first')
    if (selected.size > MAX_BYTES) return setStatus('File exceeds 60 MB limit')
    if (!token) return setStatus('Missing Web3.Storage token. See README.')

    try {
      setStatus('Uploading...')
      const client = new Web3Storage({ token })
      const onStoredChunk = (size) => {
        // web3.storage reports chunk size uploaded; approximate progress
        setProgress((p) => Math.min(100, p + (size / selected.size) * 100))
      }

      const cid = await client.put([selected], {  onStoredChunk })
      const url = `https://dweb.link/ipfs/${cid}/${encodeURIComponent(selected.name)}`
      setResult({ cid, url })
      setStatus('Upload complete')
      setProgress(100)
    } catch (err) {
      console.error(err)
      setStatus('Upload failed: ' + (err.message || err.toString()))
    }
  }

  return (
    <div style={{border:'1px solid #eee',padding:20,borderRadius:8}}>
      <form onSubmit={handleUpload}>
        <div style={{marginBottom:12}}>
          <input type="file" onChange={(e)=>setSelected(e.target.files[0]||null)} />
        </div>
        {selected && (
          <div style={{marginBottom:12}}>
            <strong>{selected.name}</strong> — {formatBytes(selected.size)}
          </div>
        )}
        <div style={{display:'flex',gap:8}}>
          <button type="submit">Upload to Web3.Storage</button>
        </div>
      </form>
      <div style={{marginTop:12}}>
        {status && <div><strong>Status:</strong> {status}</div>}
        {progress>0 && <div style={{marginTop:8}}><progress value={progress} max={100} style={{width:'100%'}} /></div>}
        {result && (
          <div style={{marginTop:12}}>
            <div><strong>CID:</strong> {result.cid}</div>
            <div><a href={result.url} target="_blank" rel="noreferrer">Open file</a></div>
            <div style={{marginTop:8,fontSize:13}}>Shareable link: <input style={{width:'100%'}} readOnly value={result.url} onFocus={(e)=>e.target.select()} /></div>
          </div>
        )}
      </div>
    </div>
  )
}
