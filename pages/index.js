import Head from 'next/head'
import FileUploader from '../components/FileUploader'

export default function Home() {
  return (
    <div style={{maxWidth:800,margin:'40px auto',fontFamily:'Inter, sans-serif'}}>
      <Head>
        <title>File Share (60MB)</title>
      </Head>
      <h1>Share files (≤ 60 MB) — Deployable on Vercel</h1>
      <p>Uploads go directly from your browser to Web3.Storage (IPFS). Get a shareable link after upload.</p>
      <FileUploader />
      <footer style={{marginTop:24,fontSize:12,color:'#666'}}>Remember: add <strong>NEXT_PUBLIC_WEB3STORAGE_TOKEN</strong> in Vercel env vars.</footer>
    </div>
  )
}
