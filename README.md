# File Share (60MB) — Next.js + Web3.Storage

This small app lets users upload a file (max 60 MB) directly from the browser to a server-side proxy which stores files on the server and returns a public URL. It can be hosted on Vercel for the frontend; the proxy server should be hosted on a platform that accepts file uploads (Cloud Run, Render, DigitalOcean, a VM, etc.).

Quick start (local):

1. Install deps

```bash
cd file-share-nextjs
npm install
```

3. Run locally (frontend)

```bash
npm run dev
# open http://localhost:3000
```

Proxy server (stores files locally)

The repository includes a small Express proxy server (`/server`) that stores uploaded files locally and serves them under `/uploads`.

Start the proxy server (separate terminal):

```bash
cd server
npm install
node index.js
# server listens on http://localhost:4000 by default
```

Client usage with proxy

Start the frontend with the proxy URL environment var:

```bash
NEXT_PUBLIC_UPLOAD_SERVER_URL=http://localhost:4000 npm run dev
```

Notes
- This setup stores files on the server's filesystem. It's simple and free but not distributed like IPFS. Ensure you have storage and backups.
- For production, host the proxy on a server with sufficient disk and configure backups or use object storage (S3, R2) if you need persistence and scalability.
- Vercel serverless functions are not appropriate for large uploads; use a platform that accepts large multipart uploads for the proxy.

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

