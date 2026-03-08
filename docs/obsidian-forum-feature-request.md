# Native indent syntax that doesn't conflict with CommonMark: `.>` proposal

---

## Use case or problem

Obsidian's Tab action and 4-space indent are **exactly what many users want** —
indent and layer grouping in Preview work great. The feature itself is awesome.

The problem: **4 spaces conflict with CommonMark.** In the spec, 4 spaces mean
*code block*. Obsidian interprets them as *indent*. So notes that rely on
Obsidian's indent break compatibility the moment they leave Obsidian.

| Context | 4 spaces / Tab mean |
|---------|---------------------|
| **CommonMark spec** | Code block (`<pre><code>`) |
| **Obsidian** | Indent, layer grouping |

What Obsidian built is awesome — but unfortunately, while it has widened
Markdown's reach, it has also diverged from the spec. That creates two issues:

1. **Different mental model** — "4 spaces = code block" is fundamental in the
   spec. Obsidian users who indent with Tab/4-space learn a different rule.
   When they share notes or switch tools, the mismatch surfaces.

2. **Compatibility is broken** — The same `.md` file, viewed in GitHub, VSCode
   preview, Obsidian Publish, or any CommonMark renderer, shows indented prose
   as code blocks. The note silently changes meaning outside Obsidian.

Obsidian vaults are plain `.md` files. Notes are shared via GitHub, GitLab,
VSCode preview, Obsidian Publish, and other renderers. Users who rely on
4-space indent get a great experience *inside* Obsidian, but their notes are
no longer portable. We're asking users to choose: either use indent (and break
portability), or follow the spec (and lose the indent UX).

**Use case: subordination without enumeration** — Sometimes a paragraph belongs
under another — contextually subordinate — but it's not a list item, not a
quote, and doesn't need its own heading. Headings and lists cover many cases.
They don't cover *flowing prose with visual subordination*.

---

## Proposed solution

Introduce `.>` as a native indent syntax — same indent + layer UX, but without
conflicting with CommonMark.

### Syntax

```markdown
.> This starts an indent at depth 1.
No prefix needed — stays inside until a blank line.

..> Depth 2, nested inside depth 1.
...> Depth 3.

Back outside.
```

### Rules

- **Dot count = depth.** `.>` = 1, `..>` = 2, `...>` = 3, etc.
- Same model as `>` (blockquote): lazy continuation, blank line to close.
- Renders as `<div class="md-indent md-indent-N">` — easy to style with CSS.
- On parsers that don't support it: shows as plain text. No breakage.

### Rendered preview

| Source | Rendered |
|--------|----------|
| `Normal text.` | Normal text. |
| `.> Indented once.` | Indented once. |
| `Continuation line.` | Indented continuation. |
| `..> Depth 2.` | Indented twice. |
| `Back outside.` | Back outside. |

### Why this fits Obsidian

1. **Same UX, no conflict** — Indent + layer grouping, but with syntax that
   CommonMark doesn't reserve. No need to override "4 spaces = code block."
2. **Portable** — Notes work in GitHub, VSCode, Publish, any renderer that
   adds support. No silent breakage.
3. **Spec-aligned** — No divergence from the spec. Users keep a single mental
   model across tools.
4. **Readable source** — `.>`, `..>`, `...>` show depth in raw text. No HTML.
5. **Foldable** — Indent blocks map naturally to fold regions (like list
   nesting).
6. **Shared spec, shared implementation** — markdown-it-dot-indent (npm) is being used to validate real-world effectiveness — npm publish, VSCode extension, and usage testing. If Obsidian adopts this rule, it can share the same package or spec, keeping updates and maintenance aligned across the ecosystem.
7. **Graceful fallback** — Unsupported parsers treat it as text. Notes stay
   valid.

**→ Interactive demo + full spec** (markdown-indent-proposal)

---

## Current workaround (optional)

- **Tab / 4-space indent** — Works in Obsidian (indent + layer grouping), but
  breaks portability. Same file shows as code blocks in GitHub, VSCode, etc.
- **`>` blockquote nesting** — Semantic mismatch (screen readers announce
  "blockquote"); not suitable for non-quoted content.
- **Bullets + CSS to hide** — Fragile, theme-dependent.

---

## Related feature requests (optional)

- CommonMark spec issue 825 — Proposal: Native Indent for Markdown (spec discussion)
- markdown-indent-proposal — Spec, demo, and implementation
