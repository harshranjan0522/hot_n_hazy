/**
 * Static file server for the POS — zero dependencies, so the counter machine
 * needs nothing but Node installed.
 *
 *   node serve.mjs            # http://localhost:8173
 *   node serve.mjs 9000       # pick a port
 *
 * ES modules will not load over file://, which is the only reason this exists.
 */

import { createServer } from 'node:http'
import { createReadStream, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)))
const PORT = Number(process.argv[2] || process.env.PORT || 8173)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
}

createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0])
  // normalize() collapses any ../ before it can climb out of ROOT.
  const path = join(ROOT, normalize(url === '/' ? '/index.html' : url))

  if (!path.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden')
    return
  }

  let stats
  try {
    stats = statSync(path)
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found')
    return
  }

  const file = stats.isDirectory() ? join(path, 'index.html') : path
  res.writeHead(200, {
    'content-type': TYPES[extname(file)] || 'application/octet-stream',
    'cache-control': 'no-cache',
  })
  createReadStream(file).pipe(res)
}).listen(PORT, () => {
  console.log(`Hot n' Hazy POS → http://localhost:${PORT}`)
})
