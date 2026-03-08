/**
 * npm 패키지 markdown-it-dot-indent 사용 검증 및 시연
 * npm install 후 node test/demo-npm.mjs 실행
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import MarkdownIt from 'markdown-it'
import dotIndent from 'markdown-it-dot-indent'

const __dirname = dirname(fileURLToPath(import.meta.url))

const md = new MarkdownIt().use(dotIndent)

console.log('=== markdown-it-dot-indent npm 패키지 시연 ===\n')

// 1. fixture.md 렌더링
const fixturePath = join(__dirname, 'fixture.md')
const input = readFileSync(fixturePath, 'utf8')
const html = md.render(input)

// 2. 검증
const checks = [
  ['단일 .>', html.includes('md-indent-1')],
  ['lazy continuation', html.includes('lazy continuation')],
  ['중첩 ..>', html.includes('md-indent-2')],
  ['3depth', html.includes('md-indent-3')],
  ['4depth', html.includes('md-indent-4')],
  ['blockquote 유지', html.includes('blockquote')],
  ['list 유지', html.includes('<ul>') || html.includes('<li>')]
]

let passed = 0
for (const [name, ok] of checks) {
  if (ok) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    console.log(`  ✗ ${name}`)
  }
}

// 3. demo-output.html 저장 (수동 확인용)
const outPath = join(__dirname, '..', 'demo-output.html')
const fullHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>.> Demo</title>
<style>.md-indent{padding-left:1.5em;border-left:2px solid #888;margin:.3em 0}</style>
</head><body><div class="markdown-body">${html}</div></body></html>`
writeFileSync(outPath, fullHtml, 'utf8')

console.log(`\n${passed}/${checks.length} 검증 통과`)
console.log(`출력: demo-output.html (브라우저에서 확인)\n`)

process.exit(passed === checks.length ? 0 : 1)
