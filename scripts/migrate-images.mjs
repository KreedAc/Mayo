#!/usr/bin/env node
/**
 * Migra le immagini da jmenu.it → Supabase Storage
 *
 * Prerequisiti:
 *   1. Esegui supabase/migrations/003_storage.sql nel SQL Editor di Supabase
 *   2. Crea .env.local con NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
 *      (oppure SUPABASE_SERVICE_ROLE_KEY per bypassare l'RLS)
 *
 * Esecuzione:
 *   node --env-file=.env.local scripts/migrate-images.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌  Imposta NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (o SUPABASE_SERVICE_ROLE_KEY)')
  process.exit(1)
}

const sb = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
const BUCKET = 'product-images'
const OLD_BASE = 'https://www.jmenu.it/media/cache/mayo/item-menu/800x600/menu-digitale-jmenu-'

// Legge data.ts ed estrae tutti i nomi file unici
const dataPath = resolve(ROOT, 'lib/data.ts')
const src = readFileSync(dataPath, 'utf8')
const filenames = [...new Set([...src.matchAll(/J\s*\+\s*['"]([^'"]+)['"]/g)].map((m) => m[1]))]
console.log(`🔍  Trovate ${filenames.length} immagini uniche in data.ts\n`)

let uploaded = 0
let failed = 0

for (const filename of filenames) {
  process.stdout.write(`  ${filename} ... `)
  try {
    const res = await fetch(OLD_BASE + filename, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Referer': 'https://www.jmenu.it/',
        'Accept': 'image/webp,image/jpeg,image/*,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9',
      }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = await res.arrayBuffer()
    const { error } = await sb.storage
      .from(BUCKET)
      .upload(filename, buf, { contentType: 'image/jpeg', upsert: true })
    if (error) throw new Error(error.message)
    process.stdout.write('✓\n')
    uploaded++
  } catch (e) {
    process.stdout.write(`✗ (${e.message})\n`)
    failed++
  }
  // pausa cortese tra le richieste
  await new Promise((r) => setTimeout(r, 300))
}

console.log(`\n📦  ${uploaded} caricate, ${failed} fallite`)

if (uploaded === 0) {
  console.error('\n❌  Nessuna immagine caricata. Controlla credenziali e policy bucket.')
  process.exit(1)
}

// Calcola il nuovo base URL
const { data: { publicUrl } } = sb.storage.from(BUCKET).getPublicUrl('__placeholder__')
const NEW_BASE = publicUrl.replace('__placeholder__', '')

// Aggiorna la costante J in data.ts
const patched = src.replace(
  /const J = ['"]https:\/\/www\.jmenu\.it[^'"]+['"]/,
  `const J = '${NEW_BASE}'`
)
writeFileSync(dataPath, patched)
console.log(`\n✅  lib/data.ts aggiornato`)
console.log(`    J = '${NEW_BASE}'`)

// Stampa la query SQL per aggiornare il database
console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Esegui questa query nel SQL Editor di Supabase
 per aggiornare i prodotti già nel database:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPDATE products
SET image_url = REPLACE(image_url, '${OLD_BASE}', '${NEW_BASE}')
WHERE image_url LIKE '${OLD_BASE}%';

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Poi fai: git add lib/data.ts && git commit -m "chore: migrate images to Supabase Storage" && git push
`)
