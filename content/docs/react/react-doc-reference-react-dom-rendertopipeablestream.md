---
title: renderToPipeableStream
description: renderToPipeableStream API 문서
date: 2024-01-31
tags: [react_dom, api, server]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react-dom/server/renderToPipeableStream',
    },
  ]
---

`renderToPipeableStream` 은 React 트리를 pipeable [Node.js Stream](https://nodejs.org/api/stream.html)으로 렌더링한다.

```jsx
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

:::note
이 API는 Node.js에만 해당된다. Deno 및 최신 엣지 런타임과 같은 [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)을 사용하는 환경에서는 `renderToPipeableStream` 대신 `renderToReadableStream` 을 사용해야 한다.
:::

## 레퍼런스 {#reference}

### renderToPipeableStream(reactNode, options?) {#rendertopipeablestream}

`renderToPipeableStream` 를 호출하여 React 트리를 HTML로 렌더링하여 Node.js 스트림으로 출력한다.

```jsx
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
});
```

클라이언트에서 `hydrateRoot` 를 호출하여 서버에서 생성된 HTML을 대화형으로 만든다.

#### 파라미터 {#parameters}

| 파라미터    | 설명                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reactNode` | HTML로 렌더링하려는 React 노드다. 예를 들어, `<App />` 과 같은 JSX 요소다. 이 요소는 전체 문서를 나타내야 하므로 `App` 컴포넌트는 `<html>` 태그를 렌더링해야 한다.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `options?`  | 스트리밍 옵션 객체다. <br/> - `bootstrapScriptContent?` : 지정된 경우 해당 문자열이 인라인 `<script>` 태그에 배치된다. <br/> - `bootstrapScripts?` : 페이지에서 실행할 `<script>` 태그의 문자열 URL 배열이다. 이를 사용하여 `hydrateRoot`를 호출하는 `<script>` 를 포함시킬 수 있다. 클라이언트에서 React를 실행하지 않으려면 이를 생략한다. <br/> - `bootstrapModules?` : `bootstrapScripts` 와 유사하지만 `<script type="module">` 을 사용한다. <br /> - `identifierPrefix?` : `useId` 에서 생성된 ID에 붙일 문자열 접두사다. 페이지에서 여러 루트를 사용할 때 충돌을 피하는 데 유용하다. `hydrateRoot` 에 전달한 것과 동일한 접두사여야 한다. <br /> - `namespaceURI?` : 스트림의 루트 [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris)를 나타내는 문자열이다. 기본값은 일반 HTML이다. SVG의 경우 `http://www.w3.org/2000/svg` 를 전달하고 MathML의 경우 `http://www.w3.org/1998/Math/MathML` 를 전달한다. <br /> - `nonce?` : [Content-Security-Policy: `script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) 정책에 따라 스크립트를 허용하기 위한 `nonce` 문자열이다. <br /> - `onAllReady?` : 렌더링이 완전히 완료되었을 때 호출되는 콜백으로, shell 및 모든 추가 콘텐츠를 포함한다. [크롤러 및 정적 생성(static generation)]()의 경우 `onShellReady` 를 대신 사용할 수 있다. 여기에서 스트리밍을 시작하면 점진적인 로딩을 얻을 수 없다. 스트림에는 최종 HTML이 포함된다. <br /> - `onError` : 서버 오류가 발생할 때 호출되는 콜백으로, 복구 가능 여부에 관계없이 기본적으로 `console.error` 만 호출한다. 충돌 보고서를 기록하기 위해 이를 덮어쓰려면 여전히 `console.error` 를 호출해야 한다. 또는 shell이 실행되기 전에 상태 코드를 조정하기 위해서 이를 사용할 수 있다. <br /> - `onShellReady` : 초기 셸 렌더링이 완료된 직후에 호출되는 콜백으로, 상태 코드를 설정하고 여기에서 파이프를 호출하여 스트리밍을 시작할 수 있다. React는 셸 이후에 추가 콘텐츠를 인라인 `<script>` 태그와 함께 스트리밍한다. 이는 HTML 로딩 폴백을 콘텐츠로 대체하는 데 사용된다. <br /> - `onShellError` : 초기 셸을 렌더링하는 동안 오류가 발생한 경우 호출되는 콜백으로, 에러를 인자로 받는다. 아직 스트림에서 바이트가 발행되지 않았으며, `onShellReady` 나 `onAllReady` 가 호출되지 않았다. 따라서 폴백 HTML 셸을 출력할 수 있다. <br /> - `progressiveChunkSize` : 청크의 바이트 사이즈다. 자세한 내용은 [문서](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)를 참조한다. |

#### 리턴 {#returns}

`renderToPipeableStream` 은 다음의 두 가지 메서드를 갖는 객체를 리턴한다.

- `pipe` 는 HTML을 제공된 Writable Node.js 스트림으로 출력한다. 스트리밍을 활성화하려면 `onShellReady` 에서 호출하거나 크롤러 및 정적 생성을 위해 `onAllReady` 에서 호출한다.
- `abort` 는 서버 렌더링을 중단하고 나머지를 클라이언트에서 렌더링하도록 한다.

## 사용법 {#usage}

### React 트리를 HTML로 렌더링하여 Node.js 스트림으로 출력하기 {#rendering-a-react-tree-as-html-to-a-noodejs-stream}

React 트리를 HTML로 렌더링하여 Node.js 스트림으로 출력하려면 `renderToPipeableStream` 을 사용한다.

```jsx
import { renderToPipeableStream } from 'react-dom/server';

// 라우트 핸들러 구문은 백엔드 프레임워크에 따라 달라진다.
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    },
  });
});
```

루트 컴포넌트와 함께 부트스트랩 `<script>` 경로 목록을 제공해야 한다. 루트 컴포넌트는 루트 `<html>` 태그를 포함한 전체 문서를 리턴해야 한다.

예를 들어 루트 컴포넌트는 다음과 같다:

```jsx
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React는 [doctype]() 과 부트스트랩 `<script>` 태그를 출력 HTML 스트림에 주입한다:

```html
<!doctype html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

클라이언트에서 부트스트랩 스크립트는 `hydrateRoot` 를 호출하여 전체 `document` 를 하이드레이트한다:

```jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

이렇게 하면 서버에서 생성된 HTML에 이벤트 리스너가 첨부되어 대화형으로 만들어진다.

:::important 빌드 출력에서 CSS 및 JS 에셋 경로 읽기
최종 에셋 URL(예: JavaScript 및 CSS 파일)은 빌드 후 해시 처리되는 경우가 많다. 예를 들어 `styles.css` 대신 `styles.123456.css` 의 형태가 되는 것이다. 정적 에셋 파일명을 해싱하면 동일한 에셋의 개별 빌드가 서로 다른 파일명을 갖게 한다. 특정 이름의 파일은 내용이 변경되지 않기 때문에 이렇게 하면 정적 에셋에 대한 장기 캐싱을 안전하게 보장해준다.

하지만 빌드가 끝날 때까지 에셋 URL을 모르는 경우 에셋을 소스 코드에 넣을 방법이 없습니다. 예를 들어, JSX에 `/styles.css` 를 하드코딩하면 작동하지 않는다. 소스 코드에서 이러한 정보를 유지하기 위해서 루트 컴포넌트는 프로퍼티로 전달된 map에서 실제 파일 이름을 읽을 수 있다:

```jsx
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

서버에서 `<App assetMap={assetMap} />` 를 렌더링하고 에셋 URL과 함께 `assetMap` 을 전달한다:

```jsx
// 이 JSON 데이터는 빌드 도구에서 가져와야 한다.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js',
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    },
  });
});
```

서버에서 `<App assetMap={assetMap} />` 를 렌더링하고 있으므로 클라이언트에서도 `assetMap` 을 사용하여 렌더링해야 하이드레이션 오류를 방지할 수 있다. 다음과 같이 `assetMap` 을 직렬화하여 클라이언트에 전달할 수 있다:

```jsx
// 이 JSON 데이터는 빌드 도구에서 가져와야 한다.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js',
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // 주의: 이 데이터는 개발자가 수동으로 생성한 것이 아니기 때문에 이를 `stringify()` 하는 것이 안전하다.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    },
  });
});
```

위의 예제에서 `bootstrapScriptContent` 옵션은 클라이언트에 전역 `window.assetMap` 변수를 설정하는 추가적인 인라인 `<script>` 태그를 추가한다. 이를 통해 클라이언트 코드가 동일한 `assetMap` 을 읽을 수 있다.

```jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

클라이언트와 서버 모두 동일한 `assetMap` 프로퍼티로 앱을 렌더링하므로 하이드레이션 오류가 발생하지 않는다.
:::

### 콘텐츠가 로드될 때 더 많은 콘텐츠 스트리밍 {#treaming-more-content-as-it-loads}

스트리밍을 사용하면 모든 데이터가 서버에 로드되기 전에도 사용자가 콘텐츠를 볼 수 있습니다. 예를 들어 표지, 친구 및 사진이 있는 사이드바, 게시물 목록이 표시되는 프로필 페이지를 생각해 보세요:

### 쉘에 들어갈 내용 지정하기 {#specifying-what-goes-into-the-shell}

`<Suspense>` 바운더리를 벗어난 앱의 일부를 셸(shell)이라고 한다:

```jsx
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

이것(shell)은 사용자가 볼 수 있는 가장 초기의 로딩 상태를 결정한다.

```jsx
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

전체 앱을 루트의 `<Suspense>` 바운더리로 감싸면 쉘에는 해당 스피너만 포함된다. 하지만 화면에 큰 스피너가 표시되고 조금 더 기다렸다가 실제 레이아웃을 보는 것은 느리고 성가시게 느껴질 수 있으므로 사용자 경험이 좋지 않다. 그렇기 때문에 일반적으로 `<Suspense>` 바운더리를 배치하여 쉘이 전체 페이지 레이아웃의 골격과 같이 최소한이지만 완성된 느낌을 주도록 하는 것이 좋다.

`onShellReady` 콜백은 전체 쉘이 렌더링된 후에 호출된다. 일반적으로 이때부터 스트리밍을 시작한다.

```jsx
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
});
```

`onShellReady` 가 실행될 때 중첩된 `<Suspense>` 바운더리에 있는 컴포넌트는 여전히 데이터를 로드하고 있을 수 있다.

### 서버에서 크래시 로깅하기 {#logging-crashes-on-the-server}

기본적으로 서버의 모든 오류는 콘솔에 기록된다. 이 오버라이드하여 크래시 보고서를 생성하도록 할 수 있다:

```js
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  },
});
```

`onError` 커스텀 구현체를 제공하는 경우 위와 같이 `console.error(error)` 를 기록하는 것도 잊으면 안된다.

### 쉘 내부의 오류 복구하기 {#recovering-from-errors-inside-the-shell}

아래 예시에서는 쉘에 `ProfileLayout` , `ProfileCover` 및 `PostsGlimmer` 가 포함된다:

```jsx
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

이러한 컴포넌트를 렌더링하는 동안 에러가 발생하면 React는 클라이언트에 보낼 의미 있는 HTML을 갖지 못한다. 마지막 수단으로 서버 렌더링에 의존하지 않는 폴백 HTML을 보내려면 `onShellError`를 오버라이드하면 된다:

```jsx
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  },
});
```

쉘을 생성하는 동안 오류가 발생하면 `onError` 와 `onShellError` 가 모두 실행된다. 오류 보고에는 `onError` 를 사용하고, 폴백 HTML 문서를 보내려면 `onShellError` 를 사용한다. 폴백 HTML이 오류 페이지일 필요는 없다. 대신 클라이언트에서만 앱을 렌더링하는 대체 쉘을 포함할 수 있다.

### 셸 외부의 오류 복구하기 {#recovering-from-errors-outside-the-shell}

다음 예제에서 `<Posts />` 컴포넌트는 `<Suspense>` 로 래핑되어 있으므로 쉘의 일부가 아니다:

```jsx
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`Posts` 컴포넌트 또는 그 내부 어딘가에서 오류가 발생하면 React가 복구를 시도한다:

1. 가장 가까운 `<Suspense>` 바운더리( `PostsGlimmer` ) 로딩 폴백을 HTML로 내보낸다.
2. 더 이상 서버에서 `Posts` 콘텐츠를 렌더링하는 시도를 "포기" 한다.
3. 자바스크립트 코드가 클라이언트에서 로드되면 React는 클라이언트에서 `Posts` 렌더링을 다시 시도한다.

만약 클라이언트에서 `Posts` 를 다시 렌더링하는 시도도 실패한다면, React는 해당 오류를 클라이언트에서 던진다. 렌더링 중에 던져진 모든 오류와 마찬가지로, 가장 가까운 부모 에러 바운더리가 사용자에게 오류를 어떻게 표시할지 결정한다. 실제로 이는 사용자가 오류가 복구 불가능하다는 것이 확실해질 때까지 로딩 표시기가 표시될 것을 의미한다.

만약 클라이언트에서 포스트를 다시 렌더링하는 시도가 성공한다면, 서버에서의 로딩 폴백이 클라이언트 렌더링 출력으로 대체된다. 사용자는 서버에서 오류가 발생했다는 사실을 알지 못할 것이다. 그러나 서버의 `onError` 콜백과 클라이언트의 `onRecoverableError` 콜백은 오류에 대한 알림을 받을 수 있도록 호출된다.

### 상태 코드 설정하기 {#setting-the-status-code}

스트리밍은 트레이드오프가 있다. 사용자가 내용을 빨리 볼 수 있도록 페이지를 가능한 빨리 스트리밍을 시작하고 싶지만, 일단 스트리밍을 시작하면 응답 상태 코드를 더 이상 설정할 수 없다.

앱을 쉘(즉, <Suspense> 바운더리 외부)과 나머지 콘텐츠로 나누면 이미 이 문제의 일부를 해결한 것이다. 쉘에서 오류가 발생하면 `onShellError` 콜백을 얻게 되어 오류 상태 코드를 설정할 수 있다. 그렇지 않으면 앱이 클라이언트에서 복구될 수 있음을 알기 때문에 "OK"를 보낼 수 있다.

```jsx
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  },
});
```

쉘 외부의 컴포넌트(즉, <Suspense> 바운더리 내부)에서 오류가 발생하면 React는 렌더링을 중단하지 않는다. `onError` 콜백이 호출되지만 `onShellError` 대신 `onShellReady` 가 호출된다. 이는 React가 클라이언트에서 해당 오류를 복구하려고 시도하기 때문이다.

그러나 원한다면, 오류가 발생한 사실을 사용하여 상태 코드를 설정할 수 있다.

```jsx
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  },
});
```

이 방법은 초기 쉘 콘텐츠를 생성하는 동안 발생한 쉘 외부의 에러만 포착하므로 완전한 것은 아니다. 일부 콘텐츠에서 오류가 발생했는지 여부를 파악하는 것이 중요한 경우 해당 콘텐츠를 쉘로 이동하면 된다.

### 다양한 방식으로 다양한 오류 처리하기 {#handling-different-errors-in-different-ways}

자체적으로 `Error` 하위 클래스를 생성하고 `instanceof` 연산자를 사용하여 어떤 에러가 발생했는지 확인할 수 있다. 예를 들어, 사용자 정의 `NotFoundError` 를 정의하고 컴포넌트에서 이를 throw 할 수 있다. 그런 다음 `onError`, `onShellReady` 및 `onShellError` 콜백은 에러 유형에 따라 다른 작업을 수행할 수 있다.

```jsx
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  },
});
```

쉘을 emit하고 스트리밍을 시작하면 상태 코드를 변경할 수 없다는 점에 유의해야 한다.

### 크롤러 및 정적 생성을 위해 모든 콘텐츠가 로드될 때까지 기다리기 {#waiting-for-all-content-to-load-for-crawlers-and-static-generation}

스트리밍은 사용자가 콘텐츠를 사용 가능한 대로 볼 수 있기 때문에 더 나은 사용자 경험을 제공한다.

그러나 크롤러가 페이지를 방문하는 경우 또는 페이지를 빌드 시간에 생성하는 경우에는 모든 콘텐츠가 먼저 로드된 후에 최종 HTML 출력을 생성하려고 할 수 있다. 콘텐츠가 모두 로드될 때까지 기다릴 수 있는 `onAllReady` 콜백을 사용할 수 있다.

```jsx
let didError = false;
let isCrawler = // ... 봇 탐지 전략에 따라 달라진다 ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

정기적인 방문자는 점진적으로 로드되는 콘텐츠의 스트림을 받게 된다. 크롤러는 모든 데이터가 로드된 후에 최종 HTML 출력을 받게 된다. 그러나 이는 또한 크롤러가 모든 데이터를 기다려야 하며 그 중 일부는 느리게 로드되거나 오류가 발생할 수 있다는 것을 의미한다. 앱에 따라 크롤러에게도 쉘을 전송할지 여부를 선택할 수 있다.

### 서버 렌더링 중단하기 {#aborting-server-rendering}

시간 초과 후 서버 렌더링을 강제로 '포기'할 수 있다:

```js
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React는 나머지 로딩 폴백을 HTML로 플러시하고 클라이언트에서 렌더링을 시도한다.
