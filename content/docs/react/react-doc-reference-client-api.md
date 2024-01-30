---
title: React DOM 클라이언트 APIs
description:
date: 2024-01-30
tags: [react_dom, api]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react-dom/client',
    },
  ]
---

`react-dom/client` API를 사용하면 클라이언트(브라우저에서)에서 React 컴포넌트를 렌더링할 수 있다. 이러한 API는 일반적으로 앱의 최상위 수준에서 React 트리를 초기화하는 데 사용된다. 프레임워크가 대신 호출할 수도 있다. 대부분의 컴포넌트에서는 이를 가져오거나 사용할 필요가 없다.

## 클라이언트 APIs

- `createRoot` 를 사용하면 브라우저 DOM 노드 안에 React 컴포넌트를 렌더링하는 루트를 만들 수 있다.
- `hydrateRoot` 를 사용하면 `react-dom/server` 에 의해 생성된 브라우저 DOM 노드 내에 React 컴포넌트를 렌더링할 수 있다.

## 브라우저 지원

React는 인터넷 익스플로러 9 이상을 포함한 모든 인기 브라우저를 지원한다. IE 9 및 IE 10과 같은 구형 브라우저에서는 일부 폴리필이 필요하다.
