#!/usr/bin/env node
// Compares .env against .env.example and reports keys that are missing or empty.
// Run with: pnpm check-env

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Parse a dotenv file into a Map of key -> value, ignoring comments and blanks. */
function parseEnv(path) {
  const entries = new Map()
  if (!existsSync(path)) return entries
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    entries.set(key, value)
  }
  return entries
}

const example = parseEnv(join(root, '.env.example'))
const envPath = join(root, '.env')

if (!existsSync(envPath)) {
  console.error('No .env found. Run: cp .env.example .env')
  process.exit(1)
}

const actual = parseEnv(envPath)
const missing = [...example.keys()].filter((key) => !actual.has(key))
const empty = [...example.keys()].filter((key) => actual.has(key) && actual.get(key) === '')

if (missing.length) console.error(`Missing in .env: ${missing.join(', ')}`)
if (empty.length) console.warn(`Empty in .env: ${empty.join(', ')}`)

if (missing.length) process.exit(1)
console.log(`.env looks good — ${example.size} key(s) checked.`)
