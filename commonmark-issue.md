# Proposal: `.>` — Native Indent Syntax for Markdown

## The gap

Markdown provides rich block-level constructs — blockquotes (`>`), code blocks (`` ` `` / 4-space), lists (`-`, `1.`), and headings (`#`). But there is no dedicated syntax for **visually indenting text without altering its semantic meaning**.

Today, authors who need hierarchical indentation resort to workarounds that each abuse something else:

- **`&nbsp;` repetition** — destroys source readability; 12 entities for depth 3
- **Blockquote `>` nesting** — screen readers announce "blockquote" when none is intended; semantic pollution
- **4-space / tab** — becomes `<pre><code>`, not indented text
- **Empty list item trick** — most parsers correct it into a proper list; the trick simply doesn't work reliably

These are not edge cases. They surface constantly in technical documentation, knowledge bases, AI-generated structured content, and everyday note-taking.

## The proposal

A minimal container block syntax using `.>`, where the number of dots represents depth:

```markdown
.> depth 1 — this starts an indent container
continuation line without prefix (lazy continuation)
still inside — until an empty line

..> depth 2 — nested inside depth 1
...> depth 3

outside — the empty line closed all containers
```

### Key design decisions

- **Container block, same model as `>`** — lazy continuation supported; empty line terminates. This matches how people think about indentation: as an *area*, not a per-line declaration.
- **Dot count = depth** — `.>` is level 1, `..>` is level 2, up to `....>` (recommended max 4).
- **Forward composition** — `.>` can wrap blockquotes, lists, and code blocks inside it. Reverse nesting (using `.>` inside `>` or `-`) is not allowed — `.>` only operates at column 0.
- **No conflict** — `.>` at line start has no special meaning in CommonMark or GFM today; unsupported parsers render it as plain text (graceful degradation).
- **Typing ergonomics** — `.` and `>` share the same physical key (`.` → Shift+`.`). Deeper indent is one more keystroke on the same key.

### HTML output

```html
<div class="md-indent md-indent-1">
  <p>indented content</p>
  <div class="md-indent md-indent-2">
    <p>deeper content</p>
  </div>
</div>
```

Suggested CSS: `padding-left: calc(N × 1.5em)`
Accessibility: `role="group" aria-level="{N}"`

### Spec rules (draft)

1. Line matching `/^\.{1,N}> /` opens an indent container at that depth
2. Lazy continuation: subsequent non-empty lines without prefix belong to the current container
3. Empty line closes the container
4. Deeper `.>` (e.g., `.>` → `..>`) creates a nested container
5. Inline markdown (bold, italic, code, links) works inside
6. Inner blocks (blockquote, list, fenced code) are allowed via forward composition
7. `.>` inside other blocks (`>`, `-`, `|`, `` ``` ``) is not recognized — column 0 only

## Why this matters now

Markdown has quietly become the universal interface between humans and machines. LLMs read it, write it, and structure knowledge with it. Agentic development pipelines, AI-assisted documentation, and accessibility-first content workflows all rely on Markdown as the common ground.

In this context, the inability to express simple hierarchical indentation is a real friction point — not a fatal flaw, but a persistent paper cut that leads to semantic workarounds at scale.

This proposal may not align with everyone's priorities, and I fully respect the conservative approach CommonMark takes toward extending the spec. But I believe `.>` represents the smallest possible addition that addresses a genuine, recurring need — for both human authors and the AI systems that increasingly work alongside them.

A detailed interactive write-up with live preview is available here:
**[→ Full proposal with live renderer](#)** *(link to hosted page)*

I would genuinely appreciate any feedback, pushback, or alternative approaches the community might suggest. Thank you for considering this.
