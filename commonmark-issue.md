# Markdown has no indent. Here's my attempt to fix it.

Markdown has quietly gone mainstream — Obsidian, Notion, GitHub, wikis, chat tools. Millions of people use it without ever choosing it. They expect basic formatting to just work.

For the most part, it does. Except one thing: **there is no way to simply indent text.**

Not quote it. Not list it. Just _push it to the right._ Markdown has no syntax for that.

---

## Every workaround is a compromise

| Method | What goes wrong |
|--------|----------------|
| `&nbsp;&nbsp;&nbsp;&nbsp;` repetition | Depth 3 = 12 entities. Source becomes unreadable. |
| `>` blockquote nesting | Screen readers say "blockquote" — but it isn't one. Semantic pollution. |
| 4 spaces / tab | CommonMark turns this into `<pre><code>`. Already taken. |
| Empty list item trick | Most parsers correct it to a proper list. Doesn't work. |

Every option either destroys the source, lies about semantics, or simply fails.

---

## The proposal: `.>`

```markdown
.> This starts an indent at depth 1.
No prefix needed — still inside until an empty line.

..> Depth 2, nested inside depth 1.
...> Depth 3.

Outside again.
```

**Dot count = depth.** Same container block model as `>` — lazy continuation, empty line to close. No new mental model needed.

Works today as plain text on unsupported parsers. Nothing breaks.

---

## Why not just use HTML?

Because `<div style="padding-left:2em">` is not Markdown. It can't be read in a terminal, diffed cleanly, or processed by Markdown-aware tools. It requires closing tags and grows more complex with each level of nesting.

Markdown's promise is a source you can read without rendering it. HTML fallback breaks that promise. `.>` keeps it.

---

## Try it

**[→ Interactive demo with full spec](https://whyjp.github.io/markdown-indent-proposal/)**

I'd genuinely like to know:

- Have you hit this limitation in real use?
- Is `.>` the right shape, or would you design it differently?

This may not end up in any spec. But the problem is real, and the workarounds aren't good enough.
