---
title: <StrictMode>
description: StrictMode 컴포넌트 문서
date: 2024-01-29
tags: [component]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react/StrictMode',
    },
  ]
---

`<StrictMode>` 를 사용하면 컴포넌트에서 흔히 발생하는 버그를 개발 초기에 발견할 수 있다.

```jsx
<StrictMode>
  <App />
</StrictMode>
```

## 레퍼런스 {#reference}

### \<StrictMode> {#strictmode}

내부 컴포넌트 트리에 대한 추가 개발 동작 및 경고를 활성화하려면 `StrictMode` 를 사용한다:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

엄격 모드는 다음과 같은 개발 전용 동작을 활성화한다:

- 컴포넌트의 불완전한 렌더링으로 인한 버그를 찾기 위해 추가 시간을 들여 다시 렌더링한다.
- 컴포넌트의 Effect 정리가 누락되어 발생한 버그를 찾기 위해 한 번 더 Effect를 실행한다.
- 컴포넌트가 더 이상 사용되지 않는 API를 사용하는지 확인한다.

### 프로퍼티 {#props}

`StrictMode` 는 프로퍼티를 받지 않는다.

### 주의사항 {#caveats}

- `<StrictMode>` 로 래핑된 트리 내부에서는 엄격 모드를 해제할 방법이 없다. 이렇게 하면 `<StrictMode>` 내의 모든 컴포넌트가 검사된다는 확신을 가질 수 있다. 제품을 작업하는 두 팀이 검사의 가치에 대해 의견이 다를 경우, 합의를 도출하거나 `<StrictMode>` 를 트리에서 아래로 이동해야 한다.

## 사용법 {#usage}

### 앱 전체에 엄격 모드 적용하기 {#enabling-strict-mode-for-entire-app}

엄격 모드를 사용하면 `<StrictMode>` 컴포넌트 내부의 전체 컴포넌트 트리에 대해 개발 전용 검사를 추가로 수행할 수 있다. 이러한 검사를 통해 개발 프로세스 초기에 컴포넌트에서 흔히 발생하는 버그를 발견할 수 있다.

전체 앱에서 엄격 모드를 사용하려면 루트 컴포넌트를 렌더링할 때 `<StrictMode>` 로 감싸면 된다:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

특히 새로 만든 앱의 경우 전체 앱을 엄격한 모드로 래핑하는 것이 좋다. `createRoot` 를 대신 호출하는 프레임워크를 사용하는 경우 해당 프레임워크의 설명서를 참조하여 엄격 모드를 활성화하는 방법을 확인한다.

엄격 모드 검사는 개발 중에만 실행되지만, 코드에 이미 존재하지만 프로덕션 환경에서 안정적으로 재현하기 어려운 버그를 찾는 데 도움이 된다. 엄격 모드를 사용하면 사용자가 버그를 신고하기 전에 버그를 수정할 수 있다.

:::note
엄격 모드에서는 개발 단계에서 다음과 같은 것들을 점검할 수 있다:

- 컴포넌트의 불완전한 렌더링으로 인한 버그를 찾기 위해 추가 시간을 들여 다시 렌더링한다.
- 컴포넌트의 Effect 정리가 누락되어 발생한 버그를 찾기 위해 한 번 더 Effect를 실행한다.
- 컴포넌트가 더 이상 사용되지 않는 API를 사용하는지 확인한다.

이러한 모든 검사는 개발 전용이며 프로덕션 빌드에는 영향을 미치지 않는다.
:::

### 앱 일부분에 엄격 모드 적용하기 {#enabling-strict-mode-for-a-part-of-the-app}

애플리케이션의 일부에만 엄격 모드를 활성화할 수도 있다:

```jsx
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

이 예제에서는 `Header` 및 `Footer` 컴포넌트에 대해 엄격 모드 검사가 실행되지 않다. 그러나 `Sidebar` 및 `Content` 는 물론 그 안에 있는 모든 컴포넌트에는 엄격 모드가 실행된다.

### 개발 환경에서 이중 렌더링으로 발견한 버그 수정하기 {#fixing-bugs-found-by-double-rendering-in-development}

React는 모든 컴포넌트가 순수한 함수라고 가정한다. 즉, 작성하는 React 컴포넌트는 동일한 입력(props, state, context)이 주어지면 항상 동일한 JSX를 리턴해야 한다.

이 규칙을 위반하는 컴포넌트는 예측할 수 없는 동작을 하며 버그를 유발한다. 실수로 불순한 코드를 찾을 수 있도록 엄격 모드는 개발 과정에서 일부 함수(순수해야 하는 함수만)를 두 번 호출한다. 여기에는 다음이 포함된다:

- 컴포넌트 함수 본문(최상위 로직만 있으므로 이벤트 핸들러 내부의 코드는 포함되지 않음)
- `useState`, `set` 함수에 전달한 함수, `useMemo` 또는 `useReducer` 에 전달한 함수
- `constructor`, `render`, `shouldComponentUpdate` 와 같은 일부 클래스 컴포넌트 메서드

순수한 함수는 매번 동일한 결과를 생성하기 때문에 함수를 두 번 실행해도 동작이 변경되지 않는다. 그러나 함수가 불순한 경우(예: 수신하는 데이터를 변경하는 경우) 두 번 실행하면 눈에 띄는 경향이 있으므로(그래서 불순한 것이다!) 버그를 조기에 발견하고 수정하는 데 도움이 된다.

다음은 엄격 모드에서 이중 렌더링이 버그를 조기에 발견하는 데 어떻게 도움이 되는지 설명하는 예시다.

다음의 `StoryTray` 컴포넌트는 여러 개의 `stories` 배열을 가져와 마지막에 마지막 "Create Story" 항목을 추가한다:

:::tabs

@tab:active index.js#index

```jsx
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

@tab App.js#app

```jsx
{% raw %}import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  { id: 0, label: "Ankit's Story" },
  { id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}{% endraw %}
```

@tab StoryTray.js#story-tray

```jsx
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map((story) => (
        <li key={story.id}>{story.label}</li>
      ))}
    </ul>
  );
}
```

:::

위 코드에 실수가 있다. 그러나 초기 출력은 올바르게 보이기 때문에 놓치기 쉽다.

이 실수는 `StoryTray` 컴포넌트를 여러 번 다시 렌더링하면 더욱 눈에 띄게 된다. 예를 들어 `StoryTray` 를 마우스로 가리킬 때마다 다른 배경색으로 다시 렌더링하도록 해 보자:

:::tabs

@tab:active index.js#index

```jsx
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

@tab App.js#app

```jsx
{% raw %}import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}

}{% endraw %}
```

@tab StoryTray.js#story-tray

```jsx
{% raw %}import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff',
      }}
    >
      {items.map((story) => (
        <li key={story.id}>{story.label}</li>
      ))}
    </ul>
  );
}{% endraw %}
```

:::

`StoryTray` 컴포넌트 위로 마우스를 가져갈 때마다 'Create Story'가 목록에 다시 추가되는 것을 볼 수 있다. 이 코드의 의도는 마지막에 한 번 추가하는 것이었다. 하지만 `StoryTray` 는 프로퍼티에서 `stories` 배열을 직접 수정한다. `StoryTray` 는 렌더링할 때마다 동일한 배열의 끝에 "Create Story"를 다시 추가한다. 즉, 스토리트레이는 순수한 함수가 아니기 때문에 여러 번 실행하면 다른 결과가 생성된다.

이 문제를 해결하려면 배열의 복사본을 만든 다음 원본이 아닌 복사본을 수정하면 된다:

```jsx
export default function StoryTray({ stories }) {
  const items = stories.slice(); // 배열 복사
  // ✅ Good: 새 배열에 추가한다
  items.push({ id: 'create', label: 'Create Story' });
```

이렇게 하면 `StoryTray` 함수가 순수해진다. 이 함수가 호출될 때마다 배열의 새 복사본만 수정하고 외부 객체나 변수에 영향을 주지 않는다. 이렇게 하면 버그가 해결되지만, 컴포넌트의 동작에 문제가 있다는 것을 인지하기 전에 컴포넌트를 몇 번 더 렌더링 해야 했다.

원래 예제에서는 버그가 분명하지 않았다. 이제 원래의 (버그가 있는) 코드를 `<StrictMode>` 로 래핑해 보자:

:::tabs

@tab:active index.js#index

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

@tab App.js#app

```jsx
{% raw %}import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}{% endraw %}
```

@tab StoryTray.js#story-tray

```jsx
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map((story) => (
        <li key={story.id}>{story.label}</li>
      ))}
    </ul>
  );
}
```

:::

엄격 모드에서는 항상 렌더링 함수를 두 번 호출하므로 실수를 바로 확인할 수 있다("Create Story"가 두 번 표시됨). 따라서 프로세스 초기에 이러한 실수를 발견할 수 있다. 컴포넌트를 엄격 모드에서 렌더링하도록 수정하면 이전의 호버 기능과 같이 향후 제작 과정에서 발생할 수 있는 많은 버그도 수정할 수 있다.

엄격 모드가 없으면 리렌더를 더 추가하기 전까지는 버그를 놓치기 쉬웠다. 엄격 모드를 사용하면 동일한 버그를 바로 발견할 수 있다. 엄격 모드를 사용하면 버그를 팀과 사용자에게 푸시하기 전에 버그를 발견할 수 있다.

:::note
React DevTools를 설치한 경우 두 번째 렌더링 호출 중 모든 `console.log` 호출이 약간 흐리게 표시된다. React DevTools는 이를 완전히 억제하는 설정(기본값은 off)도 제공한다.
:::

### 개발 환경에서 Effect를 이중 실행하여 발견된 버그 수정하기 {#fixing-bugs-found-by-re-rendering-effects-in-development}

엄격 모드는 Effect의 버그를 찾는 데도 도움이 될 수 있다.

모든 Effect에는 몇 가지 설정 코드가 있고 정리 코드가 있을 수 있다. 일반적으로 React는 컴포넌트가 마운트될 때(화면에 추가될 때) 설정을 호출하고 컴포넌트가 마운트 해제될 때(화면에서 제거될 때) 정리를 호출한다. 그런 다음 React는 마지막 렌더링 이후 종속성이 변경된 경우 정리와 설정을 다시 호출한다.

Strict 모드가 켜져 있으면 React는 모든 Effect에 대해 개발 단계에서 설정+정리 사이클을 한 번 더 실행한다. 이는 의외로 느껴질 수 있지만 수동으로 잡기 어려운 미묘한 버그를 발견하는 데 도움이 된다.

다음은 엄격 모드에서 Effect를 다시 실행하는 것이 버그를 조기에 발견하는 데 어떻게 도움이 되는지 보여주는 예시다.

컴포넌트를 채팅에 연결하는 이 예시를 살펴보자:

:::tabs

@tab:active index.js#index

```jsx
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

@tab App.js#app

```jsx
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

@tab chat.js#chat

```jsx
let connections = 0;

export function createConnection(serverUrl, roomId) {
  return {
    connect() {
      console.log(
        '✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...',
      );
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    },
  };
}
```

:::

이 코드에는 문제가 있지만 즉시 명확하지 않을 수 있다.

문제를 더 명확하게 파악하기 위해 기능을 구현해 보자. 아래 예제에서는 `roomId` 가 하드코딩되어 있지 않다. 대신 사용자가 드롭다운에서 연결하려는 `roomId`를 선택할 수 있다. 'Open chat'을 클릭한 다음 다른 채팅방을 하나씩 선택한다. 콘솔에서 활성 연결 수를 추적한다:

:::tabs

@tab:active index.js#index

```jsx
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

@tab App.js#app

```jsx
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

@tab chat.js#chat

```jsx
let connections = 0;

export function createConnection(serverUrl, roomId) {
  return {
    connect() {
      console.log(
        '✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...',
      );
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    },
  };
}
```

:::

open connection 수가 항상 계속 증가하는 것을 알 수 있다. 실제 앱에서는 성능 및 네트워크 문제가 발생할 수 있다. 문제는 Effect에 정리 기능이 없다는 것이다:

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);
```

이제 Effect가 스스로 "정리"하고 오래된 연결을 삭제하므로 누수 문제가 해결되었다. 하지만 셀렉트 박스를 선택하기 전까지는 문제가 보이지 않았다.

원래 예제에서는 버그가 분명하지 않았다. 이제 원래의 (버그가 있는) 코드를 `<StrictMode>` 로 래핑해 보자:

:::tabs

@tab:active index.js#index

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

@tab App.js#app

```jsx
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

@tab chat.js#chat

```jsx
let connections = 0;

export function createConnection(serverUrl, roomId) {
  return {
    connect() {
      console.log(
        '✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...',
      );
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    },
  };
}
```

:::

엄격 모드를 사용하면 문제가 있음을 즉시 알 수 있다(open connection 수가 2로 증가). 엄격 모드는 모든 Effect를 한 번 더 실행한다. 이 Effect 에는 정리 로직이 없으므로 추가 연결을 생성하지만 제거하지는 않는다. 이것은 정리 기능이 누락되었다는 힌트다.

엄격 모드를 사용하면 이러한 실수를 프로세스 초기에 발견할 수 있다. 엄격 모드에서 정리 기능을 추가하여 Effect를 수정하면 이전의 셀렉트 박스와 같은 향후 발생할 수 있는 많은 프로덕션 버그도 수정할 수 있다.

콘솔의 open connection 수가 더 이상 증가하지 않는 것을 확인할 수 있다.

엄격 모드가 없으면 Effect에 정리가 필요하다는 사실을 놓치기 쉽다. 개발 단계에서 Effect를 설정만 하는 것이 아니라 설정 → 정리 → 설정을 사이클을 실행하기 때문에 엄격 모드에서는 누락된 정리 로직이 더 눈에 띄게 된다.

### 엄격 모드에서 deprecation 경고 사항 수정하기 {#trouble1}

React는 `<StrictMode>` 트리 내의 일부 컴포넌트가 더 이상 사용되지 않는 API 중 하나를 사용하는 경우 경고를 표시한다:

- `findDOMNode`. [대안]() 참조.
- `UNSAFE_componentWillMount` 와 같은 `UNSAFE_` 클래스 라이프 사이클 메서드. [대안]() 참조.
- 레거시 컨텍스트(`childContextTypes`, `contextTypes` 및 `getChildContext`). [대안]() 참조.
- 레거시 문자열 refs(`this.refs`). [대안]() 참조.

이러한 API는 주로 오래된 클래스 컴포넌트에서 사용되므로 최신 앱에는 거의 나타나지 않는다.
