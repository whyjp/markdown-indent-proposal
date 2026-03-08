# [Feature Request] Support `.>` indent syntax in preview

MPE has a wide user base and has long led the way in extended syntax and user-friendly preview. If this feature were included in MPE, it would bring the ecosystem a step closer to broader adoption and standardization.

## Is your feature request related to a problem? Please describe.

Markdown has no syntax for plain indentation. Common workarounds each have issues:

| Method | Problem |
|--------|---------|
| 4 spaces / Tab | CommonMark treats this as a code block. Not indented prose. |
| `>` blockquote nesting | Screen readers announce "blockquote." Semantic mismatch when it's not a quote. |
| `&nbsp;` repetition | Source becomes unreadable at depth 3+. |
| Bullets + CSS to hide | Fragile, theme-dependent. |

MPE already excels at extended syntax (footnotes, math, mermaid, code chunks, etc.) and user-friendly preview. Adding a portable indent syntax would fill a real gap — *flowing prose with visual subordination* that isn't a list, quote, or heading — and would further strengthen MPE's role in the markdown ecosystem.

## Describe the solution you'd like

Add native support for the `.>` indent syntax in MPE preview (Crossnote's markdown-it pipeline).

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
- Renders as `<div class="md-indent md-indent-N">` — easy to style with MPE's Customize CSS.
- On parsers that don't support it: shows as plain text. No breakage.

### Rendered preview

| Source | Rendered |
|--------|----------|
| `Normal text.` | Normal text. |
| `.> Indented once.` | Indented once. |
| `Continuation line.` | Indented continuation. |
| `..> Depth 2.` | Indented twice. |
| `Back outside.` | Back outside. |

## Additional context

- **Implementation path**: [markdown-it-dot-indent](https://www.npmjs.com/package/markdown-it-dot-indent) (npm) is a ready-to-use markdown-it plugin. Crossnote uses markdown-it; integrating this plugin would align with MPE's extensible design.
- **Spec discussion**: [commonmark/commonmark-spec#825](https://github.com/commonmark/commonmark-spec/issues/825)
- **Interactive demo + full spec**: [markdown-indent-proposal](https://whyjp.github.io/markdown-indent-proposal/)

Thank you for building and maintaining MPE — your work has made markdown preview more powerful and accessible for countless users.
