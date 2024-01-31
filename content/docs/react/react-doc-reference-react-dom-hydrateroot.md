---
title: hydrateRoot
description: hydrateRoot API 문서
date: 2024-01-31
tags: [react_dom, api, server]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react-dom/client/hydrateRoot',
    },
  ]
---

`hydrateRoot` 를 사용하면 이전에 `react-dom/server` 에 의해 생성된 브라우저 DOM 노드 내에 React 컴포넌트를 렌더링할 수 있다.

```jsx
const root = hydrateRoot(domNode, reactNode, options?)
```

## 레퍼런스 {#reference}

### hydrateRoot(domNode, reactNode, options?) {#hydrateRoot}

서버 환경에서 React가 렌더링한 기존 HTML에 React를 추가 하려면 `hydrateRoot` 를 호출한다.

```jsx
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

:::tip vs createRoot(domNode, options?)

```jsx
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

:::

React는 `domNode` 내부에 존재하는 HTML에 첨부되어 그 안에 있는 DOM을 관리한다. 완전히 React로만 빌드된 앱에는 일반적으로 루트 컴포넌트와 함께 한 번만 `hydrateRoot` 를 호출한다.

#### 파라미터 {#parameters1}

| 파라미터    | 설명                                                                                                                                                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domNode`   | 루트 엘리먼트로 서버에서 렌더링된 DOM 엘리먼트다.                                                                                                                                                                                                                  |
| `reactNode` | "React node"는 기존 HTML을 렌더링하는 데 사용된다. 일반적으로 이는 `<App />` 과 같은 JSX 조각일 것이며, 이는 `renderToPipeableStream(<App />)` 과 같은 `ReactDOM Server` 메서드로 렌더링된 것이다.                                                                 |
| `options?`  | React 루트를 위한 옵션 객체다. <br/> - `onRecoverableError?`: React가 오류로부터 자동으로 복구할 때 호출되는 콜백. <br/> - `identifierPrefix` : useId 에 의해 생성된 ID에 사용할 문자열 접두사다. 같은 페이지에서 여러 루트를 사용할 때 충돌을 피하는 데 유용하다. |

#### 리턴 {#returns1}

`hydrateRoot` 는 `render` 와 `unmount` 두 가지 메서드가 있는 객체를 리턴한다.

#### 주의사항 {#caveats1}

- `hydrateRoot()` 는 렌더링된 콘텐츠가 서버에서 렌더링된 콘텐츠와 동일할 것으로 예상한다. 불일치는 버그로 간주하고 수정해야 한다.
- 개발 모드에서 React는 hydration 중 불일치에 대해 경고한다. 불일치하는 경우 속성 차이가 수정될 것이라는 보장이 없다. 이는 성능상의 이유로 중요한데, 대부분의 앱에서 불일치가 발생하는 경우는 드물기 때문에 모든 마크업의 유효성을 검사하는 것은 엄청나게 많은 비용이 들기 때문이다.
- 앱에 `hydrateRoot` 를 한 번만 호출할 가능성이 높다. 프레임워크를 사용하는 경우 프레임워크가 이 호출을 대신 수행할 수 있다.
- 앱이 사전 렌더링된 HTML 없이 클라이언트에서 렌더링되는 경우, `hydrateRoot()` 는 사용할 수 없다. 대신 `createRoot()` 를 사용해야 한다.

### root.render(reactNode) {#root-render}

`root.render` 를 호출하여 브라우저 DOM에 하이드레이션된 React 루트 내부에 React 컴포넌트를 업데이트한다.

```jsx
root.render(<App />);
```

React는 하이드레이션된 `root` 에 `<App />` 을 업데이트한다.

#### 파라미터 {#parameters2}

| 파라미터    | 설명                                                                                                                                                                               |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reactNode` | 업데이트하려는 "React 노드"다. 일반적으로 `<App />` 과 같은 JSX 조각이지만, `createElement()` 로 생성된 React 엘리먼트, 문자열, 숫자, `null` 또는 `undefined` 를 전달할 수도 있다. |

#### 리턴 {#returns2}

`root.render` 는 `undefined` 를 리턴한다.

#### 주의사항 {#caveats2}

- 루트의 하이드레이션이 완료되기 전에 `root.render` 를 호출하면 React는 기존 서버에서 렌더링된 HTML 콘텐츠를 지우고 전체 루트를 클라이언트 렌더링으로 전환한다.

### root.unmount() {#root-unmount}

`root.unmount` 를 호출하여 React 루트 내부에 렌더링된 트리를 파괴한다.

```jsx
root.unmount();
```

완전히 React로만 빌드된 앱에는 일반적으로 `root.unmount` 를 호출할 필요가 없다.

이 기능은 주로 다른 코드에 의해 React 루트의 DOM 노드(또는 그 조상 노드)가 DOM에서 제거될 수 있는 경우에 유용하다. 예를 들어, DOM에서 비활성 탭을 제거하는 jQuery 탭 패널을 상상해 보자. 탭이 제거되면 그 안에 있는 모든 것(내부의 React 루트를 포함)도 DOM에서 제거된다. 이 경우 `root.unmount` 를 호출하여 제거된 루트의 콘텐츠 관리를 "중지" 하라고 React에 알려야 한다. 그렇지 않으면 제거된 루트 내부의 컴포넌트가 사용하는 구독과 같은 전역 리소스를 정리할 수 없다.

`root.unmount` 를 호출하면 루트의 모든 컴포넌트가 마운트 해제되고 트리의 이벤트 핸들러나 상태를 제거하는 것을 포함하여 루트 DOM 노드에서 React가 "detach" 된다.

#### 파라미터 {#parameters3}

`root.unmount` 는 파라미터를 받지 않는다.

#### 리턴 {#returns3}

`root.unmount` 는 `undefined` 를 리턴한다.

#### 주의사항 {#caveats3}

- `root.unmount` 를 호출하면 트리의 모든 컴포넌트가 마운트 해제되고 루트 DOM 노드에서 React가 "detach" 된다.
- 한 번 `root.unmount` 를 호출하면 동일한 루트에서는 더 이상 `root.render` 를 호출할 수 없다. 언마운트된 루트에 대해 `root.render` 를 시도하면 "Cannot update an unmounted root" 오류가 발생한다.

## 사용법 {#usage}

### 서버에서 렌더링된 HTML 하이드레이션 하기 {#hydrating-server-rendered-html}

앱의 HTML이 `react-dom/server` 로 생성된 경우 클라이언트에서 이를 하이드레이션해야 한다.

```jsx
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

이렇게 하면 서버 HTML이 브라우저 DOM 노드 내부의 React 컴포넌트로 하이드레이션 된다. 일반적으로 이 작업은 시작 시 한 번 수행한다. 프레임워크를 사용하는 경우 프레임워크가 백그라운드에서 이 작업을 수행할 수 있다.

앱을 하이드레이션 하기 위해 React는 서버에서 생성된 초기 HTML에 컴포넌트의 로직을 "첨부" 한다. 하이드레이션은 서버의 초기 HTML 스냅샷을 브라우저에서 실행되는 완전한 인터랙티브 앱으로 전환한다.

:::tabs

@tab:active index.js#index-js

```jsx
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

@tab index.html#index-html

```html
<!--
  <div id="root">...</div> 내부의 react-dom/server로 생성된 HTML 콘텐츠
-->
<div id="root">
  <h1>Hello, world!</h1>
  <button>
    You clicked me
    <!-- -->0<!-- -->
    times
  </button>
</div>
```

@tab App.js#app

```jsx
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

:::

`hydrateRoot` 를 더 이상 호출할 필요가 없다. 이 시점부터 React는 애플리케이션의 DOM을 관리하게 된다. UI를 업데이트하기 위해 컴포넌트는 상태를 대신 사용한다.

:::warning
`hydrateRoot` 에 전달하는 React 트리는 서버 렌더링과 동일한 출력을 생성해야 한다.

이는 사용자 경험에 중요하다. 사용자는 자바스크립트 코드가 로드되기 전에 서버에서 생성된 HTML을 보게 된다. 서버 렌더링은 HTML 스냅샷을 보여줌으로써 앱이 더 빨리 로드되는 것처럼 착각을 불러일으킨다. 갑자기 다른 콘텐츠를 표시하면 이러한 흐름이 깨진다. 그렇기 때문에 서버 렌더링의 출력물은 클라이언트의 초기 렌더링의 출력물과 일치해야 한다.

하이드레이션 오류를 일으키는 가장 일반적인 원인은 다음과 같다:

- 루트 노드 내부의 HTML 주변에 추가 공백(예: 개행)이 있는 경우.
- 렌더링 로직에서 `typeof window !== 'undefined'` 와 같은 조건을 사용하는 경우.
- 렌더링 로직에서 `window.matchMedia` 와 같은 브라우저 전용 API를 사용하는 경우.
- 서버 와 클라이언트에서 서로 다른 데이터를 렌더링하는 경우.

React는 일부 하이드레이션 오류를 복구할 수 있지만 다른 버그와 마찬가지로 수정은 해야 한다. 작게는 속도 저하로 이어지지만, 최악의 경우에는 이벤트 핸들러가 잘못된 엘리먼트에 연결될 수 있다.
:::

### 전체 문서 하이드레이션 {#hydrating-an-entire-document}

완전히 React만으로 빌드된 앱은 `<html>` 태그를 포함하여 전체 문서를 JSX로 렌더링할 수 있다:

```jsx
function App() {
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

문서 전체를 하이드레이션하려면 `hydrateRoot` 에 첫 번째 인자로 전역 `document` 를 전달한다:

```jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

### 피할 수 없는 하이드레이션 불일치 오류 무시하기 {#suppressing-unavoidable-hydration-mismatch-errors}

단일 엘리먼트의 속성이나 텍스트 콘텐츠가 서버와 클라이언트 간에 어쩔 수 없이 차이가 발생하는 경우 (예: 타임스탬프), 하이드레이션 불일치 경고를 무시할 수 있다.

엘리먼트에대한 하이드레이션 경고를 무시하려면 해당 엘리먼트에 `suppressHydrationWarning={true}` 를 추가하면 된다.

:::tabs

@tab:active index.js#index-js

```jsx
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

@tab index.html#index-html

```html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root">
  <h1>
    Current Date:
    <!-- -->01/01/2020
  </h1>
</div>
```

@tab App.js#app

```jsx
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

:::

이는 첫 번째 레벨에만 작동하며 (즉 이후 중첩 레벨에는 적용되지 않는다) 탈출구로 사용하기 위한 것이다. 남용하지 않아야 한다.

```jsx
<div suppressHydrationWarning={true}>
  <span>Text content</span>
  <div>{/* 이 부분에는 적용되지 않는다. */}</div>
</div>
```

텍스트 콘텐츠가 아닌 경우 React는 여전히 그것을 수정하려고 시도하지 않으므로 향후 업데이트까지 불일치 상태가 유지될 수 있다.

### 서로 다른 클라이언트 및 서버 콘텐츠 처리하기 {#handling-different-client-and-server-content}

서버 및 클라이언트에서 의도적으로 다른 내용을 렌더링해야 하는 경우 two-pass 렌더링을 수행하면 된다. 클라이언트에서 다른 내용을 렌더링하는 컴포넌트는 `isClient` 와 같은 상태 변수를 사용할 수 있다. 이 변수는 Effect 내에서 `true` 로 설정한다.

:::tabs

@tab:active index.js#index-js

```jsx
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

@tab index.html#index-html

```html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

@tab App.js#app

```jsx
import { useState, useEffect } from 'react';

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <h1>{isClient ? 'Is Client' : 'Is Server'}</h1>;
}
```

:::

이렇게 하면 초기 렌더링 단계에서는 서버와 동일한 내용을 렌더링하여 불일치를 피할 수 있지만, 하이드레이션 직후에 동기적으로 추가적인 pass가 발생한다.

:::warning
이 방식은 컴포넌트를 두 번 렌더링해야 하기 때문에 하이드레이션을 느리게 만들 수 있다. 느린 네트워크 환경에서 사용자 경험에 유의해야 한다. 자바스크립트 코드가 초기 HTML 렌더링보다 상당히 늦게 로드될 수 있으므로 하이드레이션 직후에 즉시 다른 UI를 렌더링하는 것은 사용자에게 부자연스러운 느낌을 줄 수 있다.
:::

### 하이드레이션된 루트 컴포넌트 업데이트하기 {#updating-a-hydrated-root-component}

루트가 하이드레이션을 완료한 후에는 `root.render` 를 호출하여 루트 React 컴포넌트를 업데이트할 수 있다. `createRoot` 와 달리 초기 콘텐츠가 이미 HTML로 렌더링되었기 때문에 이를 일반적으로 수행할 필요는 없다.

만약 하이드레이션 이후에 어느 시점에서 `root.render` 를 호출하고 컴포넌트 트리 구조가 이전에 렌더링된 것과 일치한다면, React는 상태를 보존한다. 이 예제에서 1초마다 반복된 렌더링 호출에서 업데이트가 파괴적이지 않다는 것을 확인할 수 있다. 입력란에 텍스트를 입력할 수 있다는 것을 주목해보자.

:::tabs#

@tab:active index.js#index-js

```jsx
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(document.getElementById('root'), <App counter={0} />);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

@tab index.html#index-html

```html
<!--
  All HTML content inside <div id="root">...</div> was
  generated by rendering <App /> with react-dom/server.
-->
<div id="root">
  <h1>
    Hello, world!
    <!-- -->0
  </h1>
  <input placeholder="Type something here" />
</div>
```

@tab App.js#app

```jsx
export default function App({ counter }) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

:::

하이드레이션된 루트에서 `root.render` 를 호출하는 경우는 흔하지 않다. 보통은 컴포넌트 내부에서 상태를 업데이트한다.
