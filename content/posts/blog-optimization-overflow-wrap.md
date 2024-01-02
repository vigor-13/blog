---
title: 블로그 최적화 - overflow-wrap
description: 부모 엘리먼트의 영역을 벗어나는 영단어 처리하기
tags: [css]
---

블로그에 새 포스트를 배포하고 나서 살펴보던 중 모바일 환경에서 화면 영역을 벗어나는 요소를 발견했다!

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-overflow-wrap/1.png)

스타일을 잘못 정의했나 싶었지만 딱히 문제는 없어 고민하던차 [관련 글](https://www.daleseo.com/css-long-words/)을 찾을 수 있었다.

## 원인 {#cause}

부모요소의 영역을 벗어나는 원인은 웹에서 영어를 처리하는 기본적인 특성에 있었다.

> 우선 영단어가 왜 부모 요소 밖으로 삐져나올 수에 있는지에 대해서 의외로 많은 분들이 모르시는 부분이라서 짚고 넘어가면 좋을 것 같아요. 아무 설정을 해주지 않으면 기본적으로 웹에서 한국어는 단어의 중간에서 줄바꿈이 되는 반면에 영어는 단어의 중간에서 줄바꿈이 되지 않습니다. ([https://www.daleseo.com/css-long-words/](https://www.daleseo.com/css-long-words/))

## 해결책 {#solutions}

여기에는 다양한 해결책이 있다.

- Shy 기호( `-` ) 사용
- `<wbr>` 요소 사용
- `overflow-wrap` 속성 사용
- `hyphens` 속성 사용
- `word-break` 속성 사용
- `text-overflow` 속성 사용

나는 `overflow-wrap`을 적용하여 문제를 해결했다. 자세한 내용은 [이 글](https://www.daleseo.com/css-long-words/)을 참조하는 것을 추천한다.
