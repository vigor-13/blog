---
title: 지시어
description:
date: 2024-02-04
tags: [directive]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react/directives',
    },
  ]
---

:::note Canary
지시어는 React 서버 컴포넌트를 사용하거나 이와 호환되는 라이브러리를 빌드하는 경우에만 필요하다.
:::

지시어는 React 서버 컴포넌트를 지원하는 번들러에 대한 지침을 제공한다.

## 소스 코드 지시어

| 지시어         | 설명                                                       |
| -------------- | ---------------------------------------------------------- |
| `'use client'` | 클라이언트에서 실행되는 코드라는 표시다.                   |
| `'use server'` | 클라이언트에서 호출할 수 있는 서버 사이드 함수라는 표시다. |
