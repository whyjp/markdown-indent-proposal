# Markdown Dot Indent (Sample)

VSCode 마크다운 미리보기에서 `.>` 들여쓰기 문법을 지원하는 **샘플 확장**.

> 다른 VSCode 확장 제작자나 Obsidian 플러그인 개발자에게 `.>` 문법 통합을 제안할 때 참고용으로 활용.

## 의존성

- [markdown-it-dot-indent](https://www.npmjs.com/package/markdown-it-dot-indent) (npm, 외부 프로젝트)

## 사용법

1. **vscode-markdown-dot-indent** 폴더를 VSCode에서 열기
2. `npm install` 후 `F5` → Extension Development Host 실행
3. 새 창에서 `test.md` 열기 → `Ctrl+Shift+V`로 미리보기
4. ⚠️ MPE 등 다른 마크다운 미리보기 확장이 있으면 `launch.json`의 "MPE 비활성화" 구성 사용

## 예시

````markdown
.> 1depth
lazy continuation
..> 2depth
....> 4depth
....> same container
.> ```
code block
```
````
