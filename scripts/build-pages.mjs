import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { build } from 'vite'

const sourceHtml = await readFile('index.dev.html', 'utf8')
await writeFile('index.html', sourceHtml)

await build()

await rm('assets', { recursive: true, force: true })
await mkdir('assets', { recursive: true })
await cp('dist/assets', 'assets', { recursive: true })
await cp('dist/index.html', 'index.html')
