# File Share (60MB) — Next.js + Web3.Storage

This small app lets users upload a file (max 60 MB) directly from the browser to Web3.Storage (IPFS). It can be hosted on Vercel as a static/Next.js site.

Quick start (local):

1. Install deps

```bash
cd file-share-nextjs
npm install
```

2. Create a Web3.Storage API key

- Sign up at https://web3.storage and create an API token.
- In local development create a `.env.local` with:

```
NEXT_PUBLIC_WEB3STORAGE_TOKEN=YOUR_TOKEN_HERE
```

3. Run locally

```bash
npm run dev
# open http://localhost:3000
```

Deploy to Vercel

- Push repository to GitHub.
- In the Vercel dashboard create a new project from the repo.
- Add environment variable in Vercel Project Settings: `NEXT_PUBLIC_WEB3STORAGE_TOKEN` with the token from Web3.Storage.
- Deploy. The site will let users upload files directly to Web3.Storage.

Notes
- The upload is done from the user's browser to Web3.Storage — the server (Vercel) does not proxy the file, avoiding server upload size limits.
- The shareable link uses a public IPFS gateway: `https://dweb.link/ipfs/<CID>/<filename>`.
- If you want files to remain private or be managed differently, consider adding server-side signed uploads or another storage provider (S3, R2, etc.).

Server-side proxy option (safer token handling)

If you don't want to embed `NEXT_PUBLIC_WEB3STORAGE_TOKEN` in the client, you can run the provided proxy server which keeps the token on the server and uploads on behalf of clients. This avoids storing the token in your repository and centralizes quota management, but requires a host that accepts large uploads (Vercel serverless functions are not suitable for large multipart uploads).

Quick start for proxy server:

```bash
cd server
npm install
WEB3STORAGE_API_TOKEN=your_server_token node index.js
# server listens on http://localhost:4000 by default
```

Client usage

Set these env vars for the Next.js app when you want to use the proxy server:

```
NEXT_PUBLIC_USE_SERVER=true
NEXT_PUBLIC_UPLOAD_SERVER_URL=http://your-server-host:4000
```

The client will POST the file to `/upload` on the proxy server and receive back a CID and gateway URL.

Deployment notes

- Deploy the proxy to a platform that can accept large file uploads (Cloud Run, Render, DigitalOcean App Platform, self-hosted VM, etc.).
- Do NOT expose `WEB3STORAGE_API_TOKEN` publicly.

