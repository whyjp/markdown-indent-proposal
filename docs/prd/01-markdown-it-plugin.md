# PRD: markdown-it-dot-indent

markdown-it용 `.>` 들여쓰기 파서 플러그인.

## Overview

| Item | Value |
|------|-------|
| Package name | `markdown-it-dot-indent` |
| Registry | npm |
| Plugin type | block rule |
| Reference impl | blockquote rule (`rules_block/blockquote.mjs`) |
| Precedent | `markdown-it-container` (`::: name` block) |
| License | MIT |
| Repo | <https://github.com/whyjp/markdown-it-dot-indent> |

## Problem

마크다운에는 순수한 들여쓰기(시각적 깊이) 문법이 없다. 기존 우회법(`&nbsp;`
반복, `>` 남용, 4-space 코드 블록)은 소스 가독성을 해치거나 의미를 오염시킨다.

## Solution

`.>` container block을 markdown-it의 block rule로 등록한다.
`>` (blockquote)와 동일한 container block 모델을 따르되, 출력 태그를
`<div class="md-indent md-indent-{N}">`으로 분리하여 의미적 충돌을 피한다.

## Syntax spec

```text
RULE 1   .> 는 container block — > (blockquote)와 같은 모델
RULE 2   줄 시작이 /^\.{1,N}> / 이면 해당 depth의 indent container를 연다
RULE 3   점 개수 = indent depth (권장 최대: 4)
RULE 4   > 뒤 공백 1개 필수, 이후 콘텐츠
RULE 5   lazy continuation — 접두사 없는 줄은 현재 컨테이너 안
RULE 6   빈 줄이면 컨테이너 종료
RULE 7   더 깊은 depth(.> → ..>)는 중첩 — > > 와 같은 패턴
RULE 8   인라인 마크다운 + 안쪽 블록(blockquote, list, code) 모두 허용
RULE 9   HTML: <div class="md-indent md-indent-{N}">
RULE 10  [역방향 금지] 다른 블록 안에서 .> 사용 불가 — column 0에서만 동작
```

## Architecture

### markdown-it data flow

```text
core chain
  └─ block chain          ← .> rule 등록 위치
       ├─ blockquote
       ├─ fence
       ├─ ...
       └─ dot_indent      ← NEW: block rule
  └─ inline chain
       └─ (inline parsing of .> content)
  └─ renderer
       ├─ dot_indent_open  ← NEW: renderer rule
       └─ dot_indent_close ← NEW: renderer rule
```

### Token flow

`.> hello world` 입력 시 생성되는 토큰:

```text
Token { type: 'dot_indent_open',  tag: 'div', nesting: 1,  info: '1', markup: '.>' }
Token { type: 'inline',          content: 'hello world', children: [...] }
Token { type: 'dot_indent_close', tag: 'div', nesting: -1, info: '1', markup: '.>' }
```

중첩 시 (`..> nested`):

```text
dot_indent_open   (depth=1)
  paragraph_open
  inline "outer"
  paragraph_close
  dot_indent_open   (depth=2)
    paragraph_open
    inline "nested"
    paragraph_close
  dot_indent_close  (depth=2)
dot_indent_close  (depth=1)
```

### Block rule design

blockquote rule(`blockquote.mjs`)과 동일한 패턴:

```text
1. 첫 글자 검사: charCode === 0x2E (.)
2. 점 개수 카운트 후 > + space 확인
3. silent mode면 true 반환 (validation only)
4. 연속 줄 탐색:
   a. 빈 줄 → 컨테이너 종료
   b. 같은/더 깊은 .> prefix → 컨테이너 계속 (중첩 처리는 재귀 tokenize)
   c. prefix 없는 줄 → lazy continuation
   d. 다른 terminator rule → 종료
5. state 조작 (bMarks, tShift, sCount 임시 변경)
6. dot_indent_open / dot_indent_close 토큰 push
7. state.md.block.tokenize(state, startLine, nextLine) 재귀 호출
8. state 복원
```

### Sequence diagram

```text
User Input              markdown-it core           dot_indent rule         renderer
    │                        │                          │                     │
    │  ".> hello\nworld"     │                          │                     │
    │───────────────────────>│                          │                     │
    │                        │  block.tokenize()        │                     │
    │                        │─────────────────────────>│                     │
    │                        │                          │ charCode check (.)  │
    │                        │                          │ count dots → depth  │
    │                        │                          │ verify > + space    │
    │                        │                          │ scan continuation   │
    │                        │                          │ push open token     │
    │                        │                          │ recursive tokenize  │
    │                        │                          │ push close token    │
    │                        │  token stream            │                     │
    │                        │<─────────────────────────│                     │
    │                        │  render()                                      │
    │                        │──────────────────────────────────────────────>│
    │                        │                          dot_indent_open rule  │
    │                        │                          → <div class="...">   │
    │  HTML output           │<─────────────────────────────────────────────│
    │<───────────────────────│                                               │
```

## Module structure

```text
markdown-it-dot-indent/
├── index.mjs              # plugin entry (md.use() interface)
├── lib/
│   └── rules_block/
│       └── dot_indent.mjs # block rule implementation
├── test/
│   ├── fixtures/
│   │   ├── basic.txt      # commonmark-style test fixtures
│   │   ├── nesting.txt
│   │   ├── lazy.txt
│   │   ├── composition.txt
│   │   └── edge-cases.txt
│   └── test.mjs
├── package.json
├── LICENSE
└── README.md
```

## API design

### Plugin registration

```javascript
import markdownit from 'markdown-it'
import dotIndent from 'markdown-it-dot-indent'

const md = markdownit().use(dotIndent, {
  maxDepth: 4          // default: 4, max dot count allowed
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `4` | 허용할 최대 깊이 (점 개수) |

### HTML output

```html
<!-- .> hello -->
<div class="md-indent md-indent-1" role="group" aria-level="1">
<p>hello</p>
</div>

<!-- ..> nested -->
<div class="md-indent md-indent-1" role="group" aria-level="1">
<div class="md-indent md-indent-2" role="group" aria-level="2">
<p>nested</p>
</div>
</div>
```

### Default CSS (README에 포함)

```css
.md-indent {
  padding-left: 1.5em;
  border-left: 2px solid #e0e0e0;
}
```

## Test plan

markdown-it 생태계의 표준 테스트 포맷(`.txt` fixture)을 사용한다.
각 fixture는 `input → expected output` 쌍이며, 헤더 `.`으로 구분한다.

### Test categories

| Category | Fixture | Scenarios |
|----------|---------|-----------|
| Basic | `basic.txt` | 단일 `.>`, 콘텐츠 렌더링, 빈 줄 종료 |
| Nesting | `nesting.txt` | `..>` `...>` 중첩, depth 전환, 역순 종료 |
| Lazy continuation | `lazy.txt` | prefix 없는 줄 포함, 여러 줄 lazy |
| Composition | `composition.txt` | `.>` 안에 blockquote/list/code/heading |
| Reverse ban | `edge-cases.txt` | `> .>` `- .>` 등 역방향 차단 확인 |
| Inline | `basic.txt` | bold/italic/code/link inside `.>` |
| Max depth | `edge-cases.txt` | `maxDepth` 초과 시 일반 텍스트 처리 |
| Graceful degradation | `edge-cases.txt` | `.>` 뒤 공백 없음, 점만 있는 줄 등 |

### Fixture format (markdown-it 표준)

```text
.
.> hello world
.
<div class="md-indent md-indent-1" role="group" aria-level="1">
<p>hello world</p>
</div>
.
```

## Implementation tasks

```text
[ ] 1. 프로젝트 초기화
    - package.json (name, version, exports, peerDependencies)
    - ESM 구조 (type: "module")
    - markdown-it peerDependency 설정

[ ] 2. Block rule 구현 (lib/rules_block/dot_indent.mjs)
    - 첫 글자 0x2E (.) fast-check
    - 점 카운트 + > + space 검증
    - silent mode 분기
    - 연속 줄 스캔 (lazy continuation + 빈 줄 종료)
    - state 조작 (bMarks/tShift/sCount 임시 변경)
    - 재귀 tokenize 호출
    - state 복원

[ ] 3. Plugin entry (index.mjs)
    - md.block.ruler.before('blockquote', 'dot_indent', rule, { alt: [...] })
    - renderer rules 등록 (dot_indent_open, dot_indent_close)
    - options 처리 (maxDepth)

[ ] 4. Renderer rules
    - dot_indent_open: <div class="md-indent md-indent-{depth}" role="group" aria-level="{depth}">
    - dot_indent_close: </div>

[ ] 5. Test fixtures 작성
    - basic / nesting / lazy / composition / edge-cases

[ ] 6. README.md
    - 설치 / 사용법 / 옵션 / CSS / 예시

[ ] 7. npm publish 준비
    - .npmignore / LICENSE / keywords
    - npm pack 로컬 검증
```

## Dependencies

| Package | Role | Version |
|---------|------|---------|
| `markdown-it` | peerDependency | `>=14.0.0` |

devDependencies:

| Package | Role |
|---------|------|
| `markdown-it` | 테스트용 |
| `vitest` or `node:test` | 테스트 러너 |

## Success criteria

- [ ] 모든 `.txt` fixture 테스트 통과
- [ ] `markdown-it` 기본 규칙(blockquote, list, code 등)과 충돌 없음
- [ ] `.>` 미지원 파서에서 plain text로 graceful degradation
- [ ] npm publish 완료, `npx markdown-it-dot-indent` 또는 `require()`로 즉시 사용
- [ ] VSCode markdown extension에서 래핑 가능 (ESM export)

## Risk & mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| lazy continuation이 blockquote와 충돌 | `.> > quoted` 파싱 모호 | 정방향만 허용, `.>` 안의 `>`는 별도 blockquote |
| 깊은 중첩 시 성능 | 재귀 tokenize 호출 | maxDepth 제한 (기본 4) |
| 기존 `.`으로 시작하는 콘텐츠 오탐 | `.>`가 아닌 패턴 잘못 매칭 | 정확히 `.` + `>` + ` ` 세 글자 조합만 매칭 |
| CommonMark 스펙 미포함 상태 | 장기 호환성 불확실 | 플러그인 형태로 opt-in, 비활성화 용이 |
