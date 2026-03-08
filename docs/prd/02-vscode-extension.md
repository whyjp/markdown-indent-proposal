# PRD: VSCode Markdown Extension (.> indent)

VSCode 기본 마크다운 미리보기에 `.>` 들여쓰기 문법 지원을 추가하는 확장.

## Overview

| Item | Value |
|------|-------|
| Extension ID | `whyjp.markdown-dot-indent` (가칭) |
| Type | markdown-it plugin wrapper |
| Dependency | markdown-it-dot-indent (npm) |
| Precedent | [markdown-emoji](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-emoji) |

## Goal

- VSCode 마크다운 미리보기에서 `.>` 문법 렌더링
- `markdown.markdownItPlugins` Contribution Point 사용
- 별도 파서 없이 기존 markdown-it 인스턴스에 플러그인만 등록

## Architecture

```text
VSCode Markdown Preview
  └─ markdown-it (내장)
       └─ extendMarkdownIt(md)  ← 확장이 주입
            └─ md.use(markdown-it-dot-indent)
```

### package.json contributes

```json
{
  "contributes": {
    "markdown.markdownItPlugins": true,
    "markdown.previewStyles": ["./style.css"]
  }
}
```

### activation

```javascript
// extendMarkdownIt는 동기 반환 필요
export function activate(context) {
  return {
    extendMarkdownIt(md) {
      return md.use(require('markdown-it-dot-indent'));
    }
  };
}
```

## Prerequisite: CJS 지원

VSCode 확장은 CommonJS(`require`) 환경. `markdown-it-dot-indent`는 현재 ESM 전용.

**선택지:**

1. **markdown-it-dot-indent에 CJS 빌드 추가** (권장)
   - `exports.require` → `./index.cjs.js`
   - 또는 `main`을 CJS로, `module`/`exports.import`로 ESM 유지

2. **확장 내 번들**
   - 플러그인 로직을 확장에 포함 (유지보수 부담)

## Tasks

- [ ] 1. yeoman / `code --install-extension` 템플릿으로 확장 스캐폴딩
- [ ] 2. `markdown.markdownItPlugins`, `markdown.previewStyles` 등록
- [ ] 3. `extendMarkdownIt`에서 markdown-it-dot-indent 로드
- [ ] 4. `.md-indent` 스타일 CSS (padding-left, border-left)
- [ ] 5. CJS 이슈 해결 (markdown-it-dot-indent 또는 확장 내 처리)
- [ ] 6. 로컬 테스트 (`F5` → Extension Development Host)
- [ ] 7. vsce publish / marketplace 배포

## References

- [VSCode Markdown Extension API](https://code.visualstudio.com/api/extension-guides/markdown-extension)
- [markdown-it-emoji 소스](https://github.com/mjbvz/vscode-markdown-emoji)
