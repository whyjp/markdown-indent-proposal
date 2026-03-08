# Markdown Indent Proposal

Markdown has no syntax for plain indentation. This project proposes `.>` — a
container block that provides visual depth without conflicting with existing
Markdown syntax.

```markdown
.> Indented at depth 1.
Lazy continuation — stays inside until a blank line.

..> Depth 2, nested.
...> Depth 3.

Back outside.
```

**Dot count = depth.** Same model as `>` (blockquote): lazy continuation, blank
line to close.

## Try it

[Interactive demo + full spec](https://whyjp.github.io/markdown-indent-proposal/)

## Why?

| Method | Problem |
|--------|---------|
| `&nbsp;` repetition | Source becomes unreadable at depth 3+. |
| `>` blockquote | Semantic mismatch — screen readers announce "blockquote." |
| 4 spaces / Tab | CommonMark treats this as `<pre><code>`. Already taken. |
| Empty list trick | Most parsers normalize it to a plain list. |

Every workaround either ruins the source, misrepresents semantics, or fails.
`.>` keeps Markdown's promise: source you can read without rendering.

## Implementation

[markdown-it-dot-indent](https://www.npmjs.com/package/markdown-it-dot-indent)
— npm package for the markdown-it parser. Currently used to validate real-world
effectiveness.

```bash
npm install markdown-it-dot-indent
```

```javascript
import MarkdownIt from 'markdown-it'
import dotIndent from 'markdown-it-dot-indent'

const md = new MarkdownIt().use(dotIndent)
md.render('.> hello')
// <div class="md-indent md-indent-1"><p>hello</p></div>
```

## Repository structure

```text
markdown-indent-proposal/
├── index.html                  Interactive demo (GitHub Pages)
├── commonmark-issue.md         CommonMark spec issue post (EN)
├── commonmark-issue-ko.md      CommonMark spec issue post (KO)
├── test/
│   ├── fixture.md              Test fixture
│   └── demo-npm.mjs            npm package demo script
├── vscode-markdown-dot-indent/ VSCode extension sample
└── docs/
    ├── prd/
    │   ├── README.md           Strategy & roadmap
    │   ├── 01-markdown-it-plugin.md
    │   └── 02-vscode-extension.md
    ├── obsidian-forum-feature-request.md
    └── mpe-github-issue.md
```

## Demo

```bash
npm install
npm run demo
```

Generates `demo-output.html` — open in browser to verify rendering.

## Discussions

- [commonmark/commonmark-spec#825](https://github.com/commonmark/commonmark-spec/issues/825) — Spec proposal
- [MPE #2223](https://github.com/shd101wyy/vscode-markdown-preview-enhanced/issues/2223) — Markdown Preview Enhanced feature request
- [Obsidian Forum](https://forum.obsidian.md) — Feature request posted

## Roadmap

| Phase | Status | Items |
|-------|--------|-------|
| Foundation | Done | Syntax spec, interactive demo, CommonMark issue, markdown-it plugin |
| Ecosystem | Done | npm publish, VSCode extension sample |
| Advocacy | In progress | Obsidian Forum, MPE issue, talk.commonmark.org, parser-specific issues |

See [docs/prd/README.md](docs/prd/README.md) for the full strategy and roadmap.

## License

MIT
