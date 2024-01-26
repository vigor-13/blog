---
title: 이스케이프 해치
description:
date: 2024-01-27
tags: []
references:
  [{ key: 'React 공식 문서', value: 'https://react.dev/learn/escape-hatches' }]
---

일부 컴포넌트는 React 외부의 시스템을 제어하고 동기화해야 할 수 있다. 예를 들어 브라우저 API를 사용해 인풋에 포커스를 맞추거나, React 없이 구현된 비디오 플레이어를 재생 및 일시 정지하거나, 원격 서버에 연결하여 메시지를 수신해야 할 수 있다. 이 장에서는 React를 외부 시스템에 연결할 수 있는 이스케이프 해치를 배우게 된다. 대부분의 애플리케이션 로직과 데이터 흐름은 이러한 기능에 의존하지 않아야 한다.

## refs로 값 참조하기 {#referencing-values-with-refs}

컴포넌트가 특정 정보를 '기억'하도록 하고 싶지만 해당 정보가 새 렌더링을 트리거하지 않도록 하려면 ref를 사용하면 된다:

```jsx
const ref = useRef(0);
```

상태와 마찬가지로 ref는 리렌더링 사이에 React에 의해 유지된다. 하지만 상태를 설정하면 컴포넌트가 다시 렌더링된다. ref를 변경하면 그렇지 않다! `ref.current` 프로퍼티를 통해 해당 ref의 현재 값에 접근할 수 있다.

```jsx
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return <button onClick={handleClick}>Click me!</button>;
}
```

ref는 React가 추적하지 않는 컴포넌트의 비밀 주머니와 같다. 예를 들어, ref를 사용하여 컴포넌트의 렌더링 출력에 영향을 주지 않는 [타임아웃 ID](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM 엘리먼트](https://developer.mozilla.org/en-US/docs/Web/API/Element) 및 기타 객체를 저장할 수 있다.

## refs로 DOM 조작하기 {#mainpulating-dom-with-refs}

React는 렌더 결과와 일치하도록 DOM을 자동으로 업데이트하므로 컴포넌트가 이를 조작할 필요가 없는 경우가 많다. 그러나 때로는 노드에 포커스를 맞추거나, 스크롤하거나, 크기와 위치를 측정하는 등 React에서 관리하는 DOM 엘리먼트에 액세스해야 할 때가 있다. React에는 이러한 작업을 수행할 수 있는 내장된 방법이 없으므로 DOM 노드에 대한 ref가 필요하다. 예를 들어, 버튼을 클릭하면 ref를 사용하여 입력에 포커스를 맞춘다:

```jsx
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

## Effects로 동기화하기 {#synchronizing-with-effects}

일부 컴포넌트는 외부 시스템과 동기화해야 한다. 예를 들어, React 상태에 따라 비 React 컴포넌트를 제어하거나 서버 연결을 설정하거나 컴포넌트가 화면에 표시될 때 분석 로그를 보내야 할 수 있다. 특정 이벤트를 처리할 수 있는 이벤트 핸들러와 달리 Effect를 사용하면 렌더링 후 일부 코드를 실행할 수 있다. 컴포넌트를 React 외부의 시스템과 동기화하는 데 사용할 수 있다.

Play/Pause를 몇 번 누르고 비디오 플레이어가 `isPlaying` 프로퍼티 값에 어떻게 동기화되는지 확인해보자:

```jsx
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

많은 Effect는 스스로를 "정리(clean up)" 한다. 예를 들어, 채팅 서버에 대한 연결을 설정하는 Effect는 해당 서버에서 컴포넌트의 연결을 끊는 방법을 React에 알려주는 정리 함수를 반환해야 한다:

:::tabs

@tab:active App.js#app

```jsx
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

@tab chat.js#chat

```jsx
export function createConnection() {
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    },
  };
}
```

:::

개발 단계에서 React는 실행되고나서 Effect를 한 번 더 정리한다. 이것이 위의 코드에서 `"✅ Connecting..."` 이 두 번 프린트되는 이유다. 이렇게 하면 정리 기능을 구현하는 것을 잊지 않을 수 있다.

## Effect는 필요하지 않을 수도 있다 {#you-might-not-need-effect}

Effect는 React 패러다임에서 벗어날 수 있는 탈출구다. 이 기능을 사용하면 React에서 나가 컴포넌트를 외부 시스템과 동기화할 수 있다. 외부 시스템이 관여하지 않는 경우(예를 들어, 일부 프로퍼티나 상태가 변경될 때 컴포넌트의 상태를 업데이트하려는 경우)에는 Effect가 필요하지 않다. 불필요한 Effect를 제거하면 코드를 더 쉽게 따라갈 수 있고, 실행 속도가 빨라지며, 오류가 발생할 가능성이 줄어든다.

Effect가 필요하지 않은 일반적인 두 가지 경우가 있다:

- 렌더링을 위해 데이터를 변환하는 경우 Effects가 필요하지 않다.
- 사용자 이벤트를 처리하는 경우 Effect가 필요하지 않다.

예를 들어, 다른 상태에 따라 일부 상태를 조정하려면 Effect가 필요하지 않다:

```jsx
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: 불필요한 상태값 & Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

대신 렌더링하는 동안 가능한 한 많이 계산하라:

```jsx
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: 렌더링 과정에서 계산하여 처리할 수 있다.
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

하지만 외부 시스템과 동기화하려면 Effects가 필요하다.

## 반응형 Effects의 라이프사이클 {#lifecycle-of-reactive-effects}

Effect는 컴포넌트와 다른 라이프사이클을 갖는다. 컴포넌트는 마운트, 업데이트 또는 마운트 해제를 할 수 있다. Effect는 동기화를 시작하고 나중에 동기화를 중지하는 두 가지 작업만 할 수 있다. 이 사이클은 시간이 지남에 따라 변하는 프로퍼티와 상태에 의존하는 Effect의 경우 여러 번 발생할 수 있다.

다음의 예제에서 Effect는 `roomId` 프로퍼티의 값에 의존한다. 프로퍼티는 반응형 값이므로 렌더링할 때 변경될 수 있다. `roomId` 가 변경되면 Effect가 다시 동기화되고 서버에 다시 연결된다는 점에 유의하라:

:::tabs

@tab:active App.js#app

```jsx
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

@tab chat.js#chat

```jsx
export function createConnection(serverUrl, roomId) {
  return {
    connect() {
      console.log(
        '✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...',
      );
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
  };
}
```

:::

React는 Effect의 종속성을 올바르게 지정했는지 확인하는 린터 규칙을 제공한다. 위의 예제에서 종속성 목록에 `roomId` 를 지정하는 것을 잊어버린 경우 린터가 자동으로 해당 버그를 찾는다.

## Effects에서 이벤트 분리하기 {#separating-events-from-effects}

:::warning
이 섹션에서는 아직 안정된 버전의 React로 출시되지 않은 실험적인 API에 대해 설명한다.
:::

이벤트 핸들러는 동일한 인터랙션을 다시 수행할 때만 다시 실행된다. 이벤트 핸들러와 달리 Effect는 프로퍼티나 상태와 같이 읽은 값이 지난 렌더링 때와 다른 경우 다시 동기화한다. 때로는 두 가지 동작을 혼합하여 일부 값에는 반응하지만 다른 값에는 반응하지 않는 Effect를 원할 수도 있다.

Effects 내의 모든 코드는 반응형이다. 리렌더링하여 읽은 반응형 값이 변경된 경우 다시 실행된다. 예를 들어, 이 Effect는 `roomId` 또는 `theme` 가 변경된 경우 채팅에 다시 연결된다:

:::tabs

@tab:active App.js#app

```jsx
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={(e) => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom roomId={roomId} theme={isDark ? 'dark' : 'light'} />
    </>
  );
}
```

@tab chat.js#chat

```jsx
export function createConnection(serverUrl, roomId) {
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    },
  };
}
```

@tab notifications.js#notification

```jsx
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

:::

이것은 이상적이지 않다. `roomId` 가 변경된 경우에만 채팅에 다시 연결하고 싶다. `theme` 를 전환해도 채팅에 다시 연결되지 않아야 한다! `theme` 를 Effect에서 Effect Event로 옮기자:

:::tabs

@tab:active App.js#app

```jsx
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={(e) => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom roomId={roomId} theme={isDark ? 'dark' : 'light'} />
    </>
  );
}
```

@tab chat.js#chat

```jsx
export function createConnection(serverUrl, roomId) {
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    },
  };
}
```

:::

Effect Event 내부의 코드는 반응형 코드가 아니므로 `theme` 를 변경해도 더 이상 Effect가 다시 연결되지 않는다.

## Effect 의존성 제거하기 {#removing-effect-dependencies}

Effect를 작성할 때, 린터는 Effect의 종속성 목록에 Effect가 읽는 모든 반응형 값(예: 프로퍼티 및 상태)을 포함했는지 확인한다. 이렇게 하면 Effect가 컴포넌트의 최신 프로퍼티 및 상태와 동기화된 상태를 유지할 수 있다. 불필요한 종속성으로 인해 Effect가 너무 자주 실행되거나 무한 루프를 생성할 수도 있다. 종속성을 제거하는 방법은 경우에 따라 다르다.

예를 들어, 아래의 Effect는 입력창에 입력할 때마다 다시 생성되는 `options` 객체에 의존한다:

:::tabs

@tab:active App.js#app

```jsx
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId,
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

@tab chat.js#chat

```jsx
export function createConnection({ serverUrl, roomId }) {
  return {
    connect() {
      console.log(
        '✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...',
      );
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
  };
}
```

:::

해당 채팅에서 메시지를 입력하기 시작할 때마다 채팅이 다시 연결되는 것을 원하지 않을 것이다. 이 문제를 해결하려면 `options` 객체의 생성을 Effect 내부로 이동하여 Effect가 `roomId` 문자열에만 의존하도록 수정한다:

:::tabs

@tab:active App.js#app

```jsx
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId,
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

@tab chat.js#chat

```jsx
export function createConnection({ serverUrl, roomId }) {
  return {
    connect() {
      console.log(
        '✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...',
      );
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
  };
}
```

:::

주의해야 할 점은 `options` 종속성을 제거하기 위해서 종속성 목록을 편집하는 것으로 시작하지 않아야 한다는 것이다. 그렇게 하는 것은 잘못된 접근 방식이다. 대신 주변 코드를 변경하여 종속성이 불필요해지도록 했다. 종속성 목록은 Effect 코드에서 사용되는 모든 반응성 값들의 목록이다. 의도적으로 그 목록에 무엇을 넣을지 선택하지 않는다. 종속성 목록은 코드를 설명한다. 종속성 목록을 변경하려면 코드를 변경하라.

## 커스텀 Hooks로 로직 재사용하기 {#reusing-logic-with-custom-hooks}

React에는 `useState`, `useContext` 및 `useFfect` 와 같은 내장 Hook이 제공된다. 때로는 데이터를 불러오거나, 사용자가 온라인 상태인지 추적하거나, 채팅방에 연결하는 등 좀 더 구체적인 목적을 위한 Hook이 있었으면 좋겠다는 생각이 들 때가 있다. 이를 위해 애플리케이션의 필요에 맞는 고유한 Hook을 만들 수 있다.

다음의 예시에서 `usePointerPosition` 커스텀 Hook은 커서 위치를 추적하고, `useDelayedValue` 커스텀 Hook은 사용자가 전달한 값보다 특정 밀리초 뒤처진 값을 반환한다.

:::tabs

@tab:active App.js#app

```jsx
{% raw %}import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }}
    />
  );
}{% endraw %}
```

@tab usePointerPosition.js#use-pointer-position

```jsx
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

@tab useDelayedValue.js#use-delayed-value

```jsx
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

:::

커스텀 Hook을 생성하고, 함께 구성하고, Hook 간에 데이터를 전달하고, 컴포넌트 간에 재사용할 수 있다. 앱이 성장함에 따라 이미 작성한 커스텀 Hook을 재사용할 수 있기 때문에 직접 작성해야하는 Effect의 수는 줄어들 것이다. 또한 React 커뮤니티에서 관리하고 있는 훌륭한 커스텀 Hook이 많이 있다.
