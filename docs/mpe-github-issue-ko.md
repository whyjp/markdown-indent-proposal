# [Feature Request] 미리보기에서 `.>` 들여쓰기 문법 지원

MPE는 확장 문법을 허용하고 사용자 친화적인 미리보기를 제공하는 저변이 넓은 확장입니다. 여기에 이 기능이 포함된다면, 여러 확장이나 표준으로 한 걸음 더 가까워질 수 있을 것 같습니다.

## Is your feature request related to a problem? Please describe.

마크다운에는 순수한 들여쓰기 문법이 없습니다. 흔한 우회법마다 문제가 있습니다:

| 방법 | 문제 |
|------|------|
| 스페이스 4칸 / 탭 | CommonMark에서 코드 블록으로 처리. 들여쓰기 아님. |
| `>` 인용 중첩 | 스크린 리더가 "인용"으로 읽음. 인용이 아닌데 의미 오염. |
| `&nbsp;` 반복 | 깊이 3 이상이면 소스가 엉망이 됨. |
| 불릿 + CSS로 숨기기 | 불안정하고 테마에 의존함. |

MPE는 이미 확장 문법(각주, 수식, mermaid, 코드 청크 등)과 사용자 친화적인 미리보기에서 뛰어납니다. 이식 가능한 들여쓰기 문법을 추가하면 실질적인 공백을 채울 수 있고 — 목록·인용·헤딩이 아닌 *시각적 종속만 있는 흐름형 문단* — 마크다운 생태계에서 MPE의 역할을 더욱 굳건히 할 수 있을 것 같습니다.

## Describe the solution you'd like

MPE 미리보기(Crossnote의 markdown-it 파이프라인)에서 `.>` 들여쓰기 문법을 네이티브로 지원해 주세요.

### 문법

```markdown
.> 1단계 들여쓰기.
접두사 없이 이어 쓰면 빈 줄이 나올 때까지 같은 깊이.

..> 2단계. 1단계 안에 중첩.
...> 3단계.

여기서부터 들여쓰기 밖.
```

### 규칙

- **점 개수 = 깊이.** `.>` = 1, `..>` = 2, `...>` = 3 등.
- `>`(인용)과 같은 방식: lazy continuation, 빈 줄로 종료.
- `<div class="md-indent md-indent-N">`로 렌더링 — MPE Customize CSS로 스타일링 용이.
- 미지원 파서에서는 일반 텍스트로 표시. 깨지지 않음.

### 렌더링 미리보기

| 소스 | 렌더링 |
|------|--------|
| `일반 텍스트.` | 일반 텍스트. |
| `.> 한 단계.` | 한 단계 들여쓰기. |
| `이어지는 줄.` | 들여쓰기 이어짐. |
| `..> 두 단계.` | 두 단계 들여쓰기. |
| `들여쓰기 밖.` | 들여쓰기 밖. |

## Additional context

- **구현 경로**: [markdown-it-dot-indent](https://www.npmjs.com/package/markdown-it-dot-indent)(npm)는 바로 사용 가능한 markdown-it 플러그인입니다. Crossnote가 markdown-it을 사용하므로, 이 플러그인을 통합하면 MPE의 확장 가능한 설계와 잘 맞습니다.
- **스펙 논의**: [commonmark/commonmark-spec#825](https://github.com/commonmark/commonmark-spec/issues/825)
- **인터랙티브 데모 + 전체 명세**: [markdown-indent-proposal](https://whyjp.github.io/markdown-indent-proposal/)

MPE를 만들고 유지해 주셔서 감사합니다. 수많은 사용자에게 마크다운 미리보기를 더욱 강력하고 접근하기 쉽게 만들어 주셨습니다.
