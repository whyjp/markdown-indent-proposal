# Markdown has no indent. Here's my attempt to fix it.

Markdown has quietly crossed over. It started with developers on GitHub, then spread to note-taking apps like Obsidian and Notion, knowledge bases, wikis, and chat tools. Today, a lot of people writing Markdown never chose it consciously — it's just what their tool uses.

That shift matters, because these new users bring a different expectation: that basic formatting should just work. And for the most part, it does. Headings, bold, lists, code — these feel natural. But the moment someone tries to visually indent a block of text — not quote it, not list it, just _push it to the right_ — Markdown has nothing to offer.

There's no syntax for it. None.

People who hit this wall tend to fall into one of two groups: those who work around it badly, and those who quietly stop using Markdown altogether. This post is about both groups.

---

## The workarounds no one should have to use

Every approach that exists today abuses something else.

### `&nbsp;` repetition

```markdown
&nbsp;&nbsp;&nbsp;&nbsp;detail
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;deeper
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;level 3
```

Depth 3 requires 12 `&nbsp;` entities. The source becomes unreadable — defeating the entire point of writing in Markdown in the first place.

### Blockquote `>` abuse

```markdown
> overview
> > detail
> > > deeper
```

Screen readers announce _"blockquote… nested blockquote… nested blockquote"_ — when none was intended. The rendered output lies about what the content means. That's not a cosmetic problem; it's a semantic one.

### 4 spaces / tab

```markdown
    this looks like it should be indented
    but it isn't
```

In CommonMark, 4 spaces = `<pre><code>`. The most intuitive indentation gesture is already taken — by code blocks.

### The empty list item trick

```markdown
-
  indented text here
```

Most parsers correct this into a proper list. Behavior varies across renderers. The trick never worked reliably, and most people give up after the first failed attempt.

---

## One proposal: `.>`

What if indentation had its own syntax?

```markdown
.> This line starts an indent container.
Continuation without a prefix still belongs inside.
Until an empty line closes it.

..> Depth 2 — nested inside depth 1.
...> Depth 3.

Back outside — the empty line closed all containers.
```

The rule is simple: **dot count = depth**. `.>` is level 1, `..>` is level 2, up to `....>`.

It follows the same container block model as `>` — lazy continuation is supported, and an empty line terminates the container. This matches how people actually think about indentation: as an _area_, not a per-line declaration.

**HTML output:**

```html
<div class="md-indent md-indent-1">
  <p>indented content</p>
  <div class="md-indent md-indent-2">
    <p>deeper</p>
  </div>
</div>
```

Suggested CSS: `padding-left: calc(N × 1.5em)`
Accessibility: `role="group" aria-level="{N}"`

---

## Why not just write HTML?

Markdown already allows inline HTML. So why not `<div style="padding-left:2em">`?

```markdown
<div style="padding-left:2em">
  detail
  <div style="padding-left:2em">
    deeper
  </div>
</div>
```

Because that's not Markdown anymore.

The source is no longer human-readable in plain form. It can't be read cleanly in a terminal, diffed meaningfully, or processed by tools that expect Markdown. It requires closing tags, inline styles, and nesting that compounds with every level of depth.

The whole point of Markdown is that the source _is_ the document — readable without rendering. HTML fallback breaks that promise for the person writing it, the person reading the raw file, and any tool in between.

`.>` keeps that promise.

---

## Design decisions

**No conflict with existing syntax.**
`.>` at line start has no special meaning in any current CommonMark or GFM parser. It's genuinely unclaimed.

**Graceful degradation.**
Unsupported parsers render `.>` as plain text. The content stays readable; only the visual indent is lost. You can write it today and it won't break anything.

**Typing ergonomics.**
`.` and `>` share the same physical key sequence (`.` → `Shift+.`). Deeper indent = one more `.` press. Your hand never leaves the key.

**Reverse nesting is not allowed.**
`.>` only opens containers at column 0. It cannot be used inside `>`, `-`, table cells, or code fences. This keeps parsing unambiguous and predictable.

**Max depth 4, recommended.**
Beyond `....>` is almost certainly a content design problem, not a syntax problem.

---

## Spec draft

1. A line matching `/^\.{1,N}> /` opens an indent container at depth N
2. Lazy continuation: subsequent non-empty lines without a prefix belong to the current container
3. An empty line closes the container
4. A deeper `.>` (e.g. `.>` → `..>`) opens a nested container
5. All inline markdown works inside
6. Inner blocks (blockquote, list, fenced code) are allowed — forward composition only
7. `.>` inside other blocks (`>`, `-`, table cells, code fences) is not recognized — column 0 only
8. HTML output: `<div class="md-indent md-indent-{N}">` with `role="group" aria-level="{N}"`

---

## Have you felt this too?

I built an interactive demo where you can try the syntax live:

**[→ Try the live renderer](https://whyjp.github.io/markdown-indent-proposal/)**

I'd genuinely like to know:

- Is indentation something you've run into as a real limitation in Markdown?
- Is `.>` the right shape for this, or would you design it differently?
- What would it take for you to actually use this?

This may never end up in any official spec. But the problem is real, the existing workarounds are inadequate, and someone had to write it down.
