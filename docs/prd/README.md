# Implementation & Distribution Strategy

`.>` 마크다운 들여쓰기 문법의 구현체 배포 및 표준화 전략.

## Goal

"구현체가 있고 사용자가 있다"는 사실 자체를 CommonMark 표준 논의의 근거로
만드는 것. 스펙 제안만으로는 채택이 어렵고, 실제 파서 구현과 사용자 피드백이
선행되어야 한다.

## Strategy overview

```text
markdown-it plugin (npm)
    ├─ wraps into → VSCode Extension (marketplace)
    └─ parallel  → Obsidian Plugin (community)
                       ↓
              실사용 데이터 + 커뮤니티 지지
                       ↓
              CommonMark / GFM 표준 논의
```

## Priority matrix

| Priority | Channel | Type | Impact |
|----------|---------|------|--------|
| P0 | markdown-it plugin (npm) | 구현체 배포 | 생태계 최대, VuePress/Docusaurus/HackMD 등 연쇄 채택 |
| P1 | VSCode Markdown Extension | 구현체 배포 | markdown-it 래핑, 개발자 직접 사용 |
| P1 | Obsidian community plugin | 구현체 배포 | 비기술 사용자 타겟, 수백만 명 |
| P2 | Obsidian Forum — Feature Requests | 피쳐 요청 | 팀이 직접 모니터링, 커뮤니티 투표 |
| P2 | talk.commonmark.org — Extensions | 표준 토론 | 장문 토론 적합, 기존 디렉티브 논의 연결 |
| P3 | Notion Feature Request | 피쳐 요청 | MD import/export 지원, indent 문법 요청 |
| P3 | GitHub Discussions — goldmark/comrak/marked | 피쳐 요청 | 각 파서별 구현 이슈 |

## Deliverables

각 구현체별 PRD는 하위 문서에서 관리한다.

| # | Deliverable | PRD | Status |
|---|------------|-----|--------|
| 1 | markdown-it-dot-indent (npm) | [01-markdown-it-plugin.md](01-markdown-it-plugin.md) | [Published](https://www.npmjs.com/package/markdown-it-dot-indent) |
| 2 | VSCode Extension (sample) | [02-vscode-extension.md](02-vscode-extension.md) | Sample |
| 3 | Obsidian Plugin | 03-obsidian-plugin.md | Planned |

## Demo — npm 패키지 시연

다음 단계(VSCode/Obsidian) 전에 npm 패키지 사용을 검증한다.

```bash
npm install
npm run demo
```

- `test/demo-npm.mjs`: npm에서 설치한 `markdown-it-dot-indent`로 `.>` 렌더링 검증
- `demo-output.html`: 생성된 HTML (브라우저에서 확인)
- `index.html`: 브라우저용 인터랙티브 데모 (자체 파서)

- `vscode-markdown-dot-indent/`: VSCode 확장 **샘플** — 다른 확장 제작자/Obsidian에 제안 시 참고용

**참고**: Crossnote(MPE) 확장 파서는 ESM/Electron 환경 이슈로 미동작.

## Repositories & links

### 구현체 배포 대상

| Target | Repo / Guide |
|--------|-------------|
| markdown-it | <https://github.com/markdown-it/markdown-it> |
| markdown-it architecture | <https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md> |
| markdown-it-container (선례) | <https://github.com/markdown-it/markdown-it-container> |
| Obsidian releases | <https://github.com/obsidianmd/obsidian-releases> |
| Obsidian plugin dev docs | <https://docs.obsidian.md/Plugins> |
| VSCode MD extension guide | <https://code.visualstudio.com/api/extension-guides/markdown-extension> |
| VSCode marketplace | <https://marketplace.visualstudio.com> |

### 피쳐 요청 / 토론 채널

| Channel | URL |
|---------|-----|
| Obsidian Forum — Feature Requests | <https://forum.obsidian.md/c/feature-requests> |
| Notion Feature Request | <https://www.notion.com/product/request-a-feature> |
| CommonMark Extensions Forum | <https://talk.commonmark.org/c/extensions/7> |
| goldmark (Go, Hugo) | <https://github.com/yuin/goldmark/issues> |
| comrak (Rust, GitLab) | <https://github.com/kivikakk/comrak/issues> |
| commonmark-java | <https://github.com/commonmark/commonmark-java/issues> |
| marked (JS) | <https://github.com/markedjs/marked/discussions> |

## Precedents

표준 편입 전 구현체가 선행된 사례:

- **GFM tables** — GitHub 자체 파서에서 먼저 구현, 이후 GFM 스펙 편입
- **GFM strikethrough** — `~~` 문법, 여러 파서에서 독립 구현 후 GFM 포함
- **footnotes** — PHP Markdown Extra에서 시작, pandoc/markdown-it 등으로 확산
- **markdown-it-container** — `:::` 커스텀 블록, npm 플러그인으로 시작해 VuePress
  기본 기능이 됨

## Roadmap

```text
Phase 1 — Foundation (done)
  ├─ [x] .> syntax spec draft
  ├─ [x] Interactive demo (index.html)
  ├─ [x] CommonMark issue post
  ├─ [x] markdown-it plugin PRD
  └─ [x] markdown-it plugin implementation

Phase 2 — Ecosystem (current)
  ├─ [x] npm publish (markdown-it-dot-indent)
  ├─ [x] VSCode extension sample (vscode-markdown-dot-indent, 제안용)
  └─ [ ] Obsidian community plugin

Phase 3 — Advocacy
  ├─ [ ] Obsidian Forum feature request
  ├─ [ ] talk.commonmark.org discussion post
  ├─ [ ] Parser-specific issues (goldmark, comrak, marked)
  └─ [ ] Usage metrics & community feedback collection
```

