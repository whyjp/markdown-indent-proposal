# Markdown has no indent. Here's my attempt to fix it.

Markdown has quietly gone mainstream — Obsidian, Notion, GitHub, wikis, chat tools.
Millions of people use it without ever choosing it. They expect basic formatting to
just work.

For the most part, it does. Except one thing: **there's no way to simply indent text.**

Visual depth may seem minor, but it makes a real difference in how a document reads.
Indented text naturally signals containment and hierarchy — readers perceive structure
at a glance. `>` and `-` already serve their own purposes (quoting and listing), and
neither is a clean substitute for indentation. Markdown simply has no syntax for it.

---

## Every workaround is a compromise

| Method | What goes wrong |
|--------|----------------|
| `&nbsp;&nbsp;&nbsp;&nbsp;` repetition | Depth 3 = 12 entities. Source becomes unreadable. |
| `>` blockquote nesting | Screen readers announce "blockquote" — it isn't one. Semantic pollution. |
| 4 spaces / tab | CommonMark renders this as `<pre><code>`. Already taken. |
| Empty list item trick | Most parsers normalize it to a plain list. Doesn't work. |

Every method either ruins the source, misrepresents semantics, or simply fails.

---

## The proposal: `.>`

```markdown
.> This starts an indent at depth 1.
No prefix needed — stays inside until a blank line.

..> Depth 2, nested inside depth 1.
...> Depth 3.

Back outside.
```

### What the rendered output would look like

| Source | Rendered |
|--------|----------|
| `Normal text.` | Normal text. |
| `.> Indented once.` | &emsp;Indented once. |
| `Continuation line.` | &emsp;Continuation line. |
| `..> Indented twice.` | &emsp;&emsp;Indented twice. |
| `...> Three levels deep.` | &emsp;&emsp;&emsp;Three levels deep. |
| `Back outside.` | Back outside. |

**Dot count = depth.** Same container-block model as `>` — lazy continuation, blank
line to close. Nothing new to learn.

And notice: `.>`, `..>`, `...>` — the growing dots create a visual sense of depth even
in raw text. The structure is readable before any rendering happens. That's Markdown's
original promise at work.

On parsers that don't support it yet, it just shows as plain text. Nothing breaks.

---

## Why not just use HTML?

`<div style="padding-left:2em">` stops being Markdown the moment you type it. You
can't read it in a terminal, diff it cleanly, or process it with Markdown tools. It
needs closing tags, and complexity compounds with each nesting level.

Markdown's promise is source you can read without rendering. HTML fallback breaks that
promise. `.>` keeps it.

---

## Try it

**[→ Interactive demo + full spec](https://whyjp.github.io/markdown-indent-proposal/)**

I'd genuinely like to know:

- Have you run into this limitation in practice?
- Is `.>` the right shape, or would you design it differently?

This may never make it into any spec. But the problem is real, and the workarounds
aren't cutting it.
