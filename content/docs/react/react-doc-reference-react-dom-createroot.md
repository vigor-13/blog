---
title: createRoot
description: createRoot API 문서
date: 2024-01-30
tags: [react_dom, api]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react-dom/client/createRoot',
    },
  ]
---

`createRoot` 를 사용하면 브라우저 DOM 노드 안에 React 컴포넌트를 렌더링하는 루트를 만들 수 있다.

```jsx
const root = createRoot(domNode, options?)
```

## 레퍼런스 {#reference}

### createRoot(domNode, options?) {#reference1}

`createRoot` 를 호출하여 브라우저 DOM 요소 안에 콘텐츠를 표시하기 위한 React 루트를 생성한다.

```jsx
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React는 `domNode` 에 루트를 생성하고 그 안에 있는 DOM을 관리한다. 루트를 생성한 후에는 `root.render` 를 호출하여 그 안에 React 컴포넌트를 렌더링한다:

```jsx
root.render(<App />);
```

완전히 React로 구축된 앱은 일반적으로 루트 컴포넌트에 대해 한번의 `createRoot` 호출만 필요하다. 다만 페이지 일부에 React를 "sprinkle"하는 경우 필요한만큼 많은 별도의 루트를 가질 수 있다.

#### 파라미터 {#parameters1}

| 파라미터   | 설명                                                                                                                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domNode`  | DOM 엘리먼트다. React는 이 DOM 엘리먼트에 루트를 생성하고 React 콘텐츠를 렌더링하기 위해 `render` 함수를 루트에서 호출할 수 있게 해준다.                                                                                                                                 |
| `options?` | React 루트를 위한 옵션 객체다. <br/> - `onRecoverableError` : React가 오류로부터 자동으로 복구할 때 호출되는 콜백이다. <br/> - `identifierPrefix` : `useId` 에 의해 생성된 ID에 사용할 문자열 접두사다. 같은 페이지에서 여러 루트를 사용할 때 충돌을 피하는 데 유용하다. |

#### 리턴 {#returns1}

`createRoot` 는 `render` 와 `unmount` 두 가지 메서드가 있는 객체를 리턴한다.

#### 주의사항 {#caveats1}

- 앱이 서버 렌더링되는 경우 `createRoot()` 는 사용할 수 없다. 대신 `hydrateRoot()` 를 사용한다.
- 앱에 `createRoot` 호출이 하나만 있을 수 있다. 프레임워크를 사용하는 경우 프레임워크가 이 호출을 대신 수행할 수 있다.
- 컴포넌트 트리의 자식이 아닌 DOM 트리의 다른 부분(예: 모달 또는 툴팁)에 JSX 조각을 렌더링하려는 경우 `createRoot` 대신 `createPortal` 을 사용한다.

### root.render(reactNode) {#reference2}

`root.render` 를 호출하여 React 노드를 React 루트에 렌더링한다.

```jsx
root.render(<App />);
```

React는 `root` 에 `<App />` 을 표시하고 그 안에 있는 DOM을 관리한다.

#### 파라미터 {#parameters2}

| 파라미터    | 설명                                                                                                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reactNode` | 표시하려는 React 노드다. 일반적으로 `<App />` 과 같은 JSX 조각이지만, `createElement()` 로 생성된 React 엘리먼트, 문자열, 숫자, `null` 또는 `undefined` 를 전달할 수도 있다. |

#### 리턴 {#returns2}

`root.render` 는 `undefined` 를 리턴한다.

#### 주의사항 {#caveats2}

- `root.render` 를 처음 호출하면 React는 React 컴포넌트를 렌더링하기 전에 React 루트 내부의 모든 기존 HTML 콘텐츠를 지운다.
- 루트의 DOM 노드에 서버에서 또는 빌드 중에 React로 생성된 HTML이 포함되어 있다면, 대신 `hydrateRoot()`를 사용해야 한다.
- 동일한 루트에서 `render` 를 두 번 이상 호출하면 React는 전달한 최신 JSX를 반영하기 위해 필요에 따라 DOM을 업데이트한다. React는 이전에 렌더링된 트리와 "일치"시켜서 재사용할 수 있는 부분과 다시 만들어야 하는 부분을 결정한다. 동일한 루트에서 렌더링을 다시 호출하는 것은 루트 컴포넌트에서 `set` 함수를 호출하는 것과 유사하다: React는 불필요한 DOM 업데이트를 피한다.

### root.unmount() {#reference3}

`root.unmount` 를 호출하여 React 루트 내부에서 렌더링된 트리를 파괴한다.

```jsx
root.unmount();
```

React로 완전히 빌드된 앱에는 일반적으로 `root.unmount` 를 호출할 일이 없다.

이 기능은 주로 다른 코드에 의해 React 루트의 DOM 노드(또는 그 조상 노드)가 DOM에서 제거될 수 있는 경우에 유용하다. 예를 들어, DOM에서 비활성 탭을 제거하는 jQuery 탭 패널을 상상해 보자. 탭이 제거되면 그 안에 있는 모든 것(내부의 React 루트를 포함)도 DOM에서 제거된다. 이 경우 `root.unmount` 를 호출하여 제거된 루트의 콘텐츠 관리를 "중지"하라고 React에 알려야 한다. 그렇지 않으면 제거된 루트 내부의 컴포넌트가 사용하는 구독과 같은 전역 리소스를 정리할 수 없다.

`root.unmount` 를 호출하면 루트의 모든 컴포넌트가 마운트 해제되고 트리의 이벤트 핸들러나 상태를 제거하는 것을 포함하여 루트 DOM 노드에서 React가 "detach" 된다.

#### 파라미터 {#parameters3}

`root.unmount` 는 파라미터를 받지 않는다.

#### 리턴 {#returns3}

`root.unmount` 는 `undefined` 를 리턴한다.

#### 주의사항 {#caveats3}

- `root.unmount` 를 호출하면 트리의 모든 컴포넌트가 마운트 해제되고 루트 DOM 노드에서 React가 "detach" 된다.
- 한 번 `root.unmount` 를 호출하면 동일한 루트에서는 더 이상 `root.render`를 호출할 수 없다. 언마운트된 루트에 대해 `root.render` 를 시도하면 "Cannot update an unmounted root" 오류가 발생한다. 그러나 동일한 DOM 노드에 대해 이전 루트가 언마운트된 후에는 해당 노드에 새로운 루트를 생성할 수 있다.

## 사용법 {#usage}

### React로 완전히 빌드된 앱 렌더링하기 {#rendering-an-app-fully-built-with-react}

앱이 React로 완전히 빌드된 경우 전체 앱에 대해 단일 루트를 생성한다.

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

일반적으로 이 코드는 시작할 때 한 번만 실행하면 된다. 그러면 다음과 같은 작업이 실행된다:

1. HTML에 정의된 브라우저 DOM 노드( `root` )를 찾는다.
2. 그 안에 앱의 React 컴포넌트를 렌더링한다.

:::tabs

@tab:active index.js#index-js

```jsx
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

@tab index.html#index-html

```jsx
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- This is the DOM node -->
    <div id="root"></div>
  </body>
</html>
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

앱이 React로 완전히 빌드된 경우, 더 이상 루트를 만들거나 `root.render` 를 다시 호출할 필요가 없다.

이 시점부터 React는 전체 앱의 DOM을 관리한다. 컴포넌트를 더 추가하려면 App 컴포넌트 안에 중첩하면 된다. UI를 업데이트해야 할 때 각 컴포넌트는 상태를 사용하여 이를 수행할 수 있다. 모달이나 툴팁과 같은 추가 콘텐츠를 DOM 노드 외부에 표시해야 하는 경우 포털(portal)을 사용하여 렌더링한다.

:::note
HTML이 비어 있으면 앱의 자바스크립트 코드가 로드되고 실행될 때까지 사용자에게 빈 페이지가 표시된다:

```html
<div id="root"></div>
```

이것은 매우 느리게 느껴질 수 있다! 이 문제를 해결하기 위해 서버의 컴포넌트에서 또는 빌드 중에 초기 HTML을 생성할 수 있다. 그러면 방문자는 자바스크립트 코드가 로드되기 전에 텍스트를 읽고, 이미지를 보고, 링크를 클릭할 수 있다. 이 최적화를 기본적으로 수행하는 프레임워크를 사용하는 것이 좋다. 실행 시점에 따라 이를 서버 사이드 렌더링(SSR) 또는 정적 사이트 생성(SSG)이라고 한다.
:::

:::warning
서버 렌더링 또는 정적 생성을 사용하는 앱은 `createRoot` 대신 `hydrateRoot` 를 호출해야 한다. 그러면 React는 DOM 노드를 파괴하고 다시 생성하는 대신 HTML에서 하이드레이트(재사용) 한다.
:::

### React를 사용하여 부분적으로 빌드된 페이지 렌더링하기 {#rendering-a-page-partially-built-with-react}

페이지가 React로 완전히 빌드되지 않은 경우, `createRoot` 를 여러 번 호출하여 React가 관리하는 각 최상위 UI에 대한 루트를 생성할 수 있다. `root.render` 를 호출하여 각 루트에 다른 콘텐츠를 표시할 수 있다.

다음의 예제에서 서로 다른 두 개의 React 컴포넌트가 `index.html` 파일에 정의된 두 개의 DOM 노드에 렌더링된다:

:::tabs

@tab:active index.js#index-js

```jsx
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode);
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode);
commentRoot.render(<Comments />);
```

@tab index.html#index-html

```jsx
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

@tab components.js#components

```jsx
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>
      {text} — <i>{author}</i>
    </p>
  );
}
```

:::

`document.createElement()` 를 사용하여 새 DOM 노드를 생성하고 문서에 수동으로 추가할 수도 있다.

```jsx
const domNode = document.createElement('div');
const root = createRoot(domNode);
root.render(<Comment />);
document.body.appendChild(domNode); // 문서의 어느 곳에나 추가할 수 있다.
```

DOM 노드에서 React 트리를 제거하고 이 트리가 사용하는 모든 리소스를 정리하려면 `root.unmount` 를 호출하면 된다.

```jsx
root.unmount();
```

이 기능은 주로 다른 프레임워크로 작성된 앱 내부에 React 컴포넌트가 있는 경우에 유용하다.

### 루트 컴포넌트 업데이트하기 {#updating-a-root-component}

같은 루트에서 렌더링을 여러 번 호출할 수 있다. 이전 렌더링과 컴포넌트 트리 구조가 일치하는 한, React는 상태를 보존한다. 이 예제에서 1초마다 반복된 `render` 호출로 인한 업데이트가 파괴적이지 않다는 것을 확인할 수 있다. 입력란에 텍스트를 입력할 수 있다!.

:::tabs

@tab:active index.js#index

```jsx
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
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

렌더링을 여러 번 호출하는 경우는 드물다. 일반적으로 컴포넌트가 대신 상태를 업데이트한다.

## 트러블슈팅 {#troubleshooting}

### 루트를 만들었지만 아무것도 표시되지 않는 경우 {#trouble1}

앱을 실제로 루트에 렌더링하는 것을 잊지 않았는지 확인한다:

```jsx
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

그렇게 할 때까지는 아무것도 렌더링 되지 않는다.

### 다음과 같은 오류가 발생하는 경우: "Target container is not a DOM element" {#trouble2}

이 오류는 `createRoot` 에 전달한 것이 DOM 노드가 아님을 의미한다.

무슨 일이 발생했는지 확실하지 않다면 로깅을 해본다:

```jsx
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

예를 들어 `domNode` 가 `null` 이면 `getElementById` 가 `null` 을 반환했다는 뜻이다. 이는 호출 시점에 문서에 지정된 ID를 가진 노드가 없는 경우에 발생한다. 몇 가지 이유가 있을 수 있다:

1. 찾고 있는 ID가 HTML 파일에서 사용한 아이디와 다를 수 있다. 오타가 있는지 확인해보자!
2. 번들의 `<script>` 태그는 HTML에서 그 뒤에 나타나는 DOM 노드를 인식할 수 없다.

이 오류가 발생하는 또 다른 일반적인 상황은 `createRoot(domNode)` 대신 `createRoot(<App />)` 를 사용한 경우다.

### 다음과 같은 오류가 발생하는 경우: "Functions are not valid as a React child" {#trouble3}

이 오류는 `root.render` 에 전달한 것이 React 컴포넌트가 아님을 의미한다.

이 오류는 `root.render` 에 `<Component />` 대신 `Component` 를 제공했을 때 발생한다:

```jsx
// 🚩 Wrong: App은 컴포넌트가 아니라 함수다.
root.render(App);

// ✅ Correct: <App />은 컴포넌트다.
root.render(<App />);
```

또는 함수를 호출한 결과 대신 `root.render` 에 함수를 전달할 수도 있다:

```jsx
// 🚩 Wrong: createApp은 컴포넌트가 아니라 함수다.
root.render(createApp);

// ✅ Correct: 컴포넌트를 리턴하는 createApp 함수를 호출한다.
root.render(createApp());
```

### 서버에서 렌더링된 HTML이 처음부터 다시 생성되는 경우. {#trouble4}

만약 앱이 서버에서 렌더링되고 React에 의해 생성된 초기 HTML이 포함된 경우, 루트를 생성하고 `root.render` 를 호출하면 모든 해당 HTML이 삭제되고 그런 다음 모든 DOM 노드가 처음부터 다시 생성될 것이다. 이렇게 되면 속도가 저하되고 포커스, 스크롤 위치, 사용자 입력 등을 잃어버리게 된다.

서버 렌더링 앱은 `createRoot` 대신 `hydrateRoot` 를 사용해야 한다:

```jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

API가 다르다는 점에 유의해야 한다. 특히 일반적으로 `root.render` 를 추가적으로 호출해야 하는 상황은 드물다.
