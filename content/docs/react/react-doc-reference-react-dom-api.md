---
title: React DOM APIs
description:
date: 2024-01-31
tags: [react_dom, api]
references:
  [{ key: 'React 공식 문서', value: 'https://react.dev/reference/react-dom' }]
---

`react-dom` 패키지에는 웹 애플리케이션(브라우저 DOM 환경에서 실행되는)에 대해서만 지원되는 메서드가 포함되어 있다. 리액트 네이티브에서는 지원되지 않는다.

## APIs {#apis}

다음의 API는 컴포넌트에서 사용할 수 있지만 거의 사용되지진 않는다:

- `createPortal` 를 사용하면 DOM 트리의 다른 부분에 자식 컴포넌트를 렌더링할 수 있다.
- `flushSync` 를 사용하면 React가 상태 업데이트를 강제로 flush하고 DOM을 동기적으로 업데이트할 수 있다.

## 엔트리 포인트 {#entry-points}

`react-dom` 패키지는 두 가지 엔트리 포인트를 추가로 제공한다:

- `react-dom/client` 에는 클라이언트(브라우저에서)에서 React 컴포넌트를 렌더링하는 API가 포함되어 있다.
- `react-dom/server` 에는 서버에서 React 컴포넌트를 렌더링하는 API가 포함되어 있다.

## Deprecated APIs {#deprecated-apis}

```warning
다음의 API는 향후 React의 메이저 버전에서 제거될 예정이다.
```

- `findDOMNode` 는 클래스 컴포넌트 인스턴스에 해당하는 가장 가까운 DOM 노드를 찾는다.
- `hydrate` 는 서버에서 생성된 HTML을 DOM에 트리를 마운트한다. `hydrateRoot` 를 대신 사용한다.
- `render` 는 트리를 DOM에 마운트한다. `createRoot` 를 대신 사용한다.
- `unmountComponentAtNode` 는 DOM에서 트리를 마운트 해제한다. `root.unmount()` 를 대신 사용한다.
