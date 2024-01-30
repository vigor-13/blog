---
title: React DOM 서버 APIs
description:
date: 2024-01-31
tags: [react_dom, api, server]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react-dom/server',
    },
  ]
---

`react-dom/server` API를 사용하면 서버에서 React 컴포넌트를 HTML로 렌더링할 수 있다. 이러한 API는 서버에서 앱의 초기 HTML을 생성하기 위해 앱의 최상위 레벨에서 사용된다. 프레임워크는 이를 자동으로 호출할 수 있다. 대부분의 컴포넌트에서는 이 API를 사용할 필요가 없다.

## Node.js Streams을 위한 서버 APIs {#server-apis-for-nodejs-streams}

다음의 메서드는 [Node.js Stream](https://nodejs.org/api/stream.html)을 지원하는 환경에서만 사용할 수 있다:

- `renderToPipeableStream` 은 React 트리를 pipeable [Node.js Stream](https://nodejs.org/api/stream.html)으로 렌더링 한다.
- `renderToStaticNodeStream` 은 non-interactive React 트리를 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)으로 렌더링한다.

## Web Streams을 위한 서버 APIs {#server-apis-for-web-streams}

다음의 메서드는 브라우저, Deno 및 일부 최신 엣지 런타임을 포함하는 [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)을 지원하는 환경에서만 사용할 수 있다:

- `renderToReadableStream` 은 React 트리를 [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)으로 렌더링한다.

## non-streaming 환경을 위한 서버 APIs {#server-apis-for-non-streaming-environments}

다음의 메서드는 스트림을 지원하지 않는 환경에서도 사용할 수 있다:

- `renderToString` 은 React 트리를 문자열로 렌더링한다.
- `renderToStaticMarkup` 은 non-interactive React 트리를 문자열로 렌더링한다.

위의 메서드들은 스트리밍 API에 비해 기능이 제한되어 있다.

## Deprecated 서버 APIs {#deprecated-server-apis}

:::warning
이 API는 향후 React의 주요 버전에서 제거될 예정이다.
:::

- `renderToNodeStream` 은 React 트리를 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) 으로 렌더링 한다. (Deprecated)
