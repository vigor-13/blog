---
title: useRef
description: useRef Hook 문서
date: 2024-01-28
tags: [hook]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react/useRef',
    },
  ]
---

`useRef` 는 렌더링에 필요하지 않은 값을 참조할 수 있는 React Hook 이다.

```jsx
const ref = useRef(initialValue);
```

## 레퍼런스 {#reference}

### useRef(initialValue) {#useRef}

컴포넌트의 최상위 레벨에서 `useRef` 를 호출하여 ref를 선언한다.

```jsx
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

### 파라미터 {#parameters}

| 파라미터       | 설명                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| `initialValue` | ref 객체의 `current` 프로퍼티의 초기 값이다. 모든 타입의 값이 될 수 있다. 이 인자는 초기 렌더링 이후에는 무시된다. |

### 리턴 {#returns}

`useRef` 는 단일 프로퍼티를 갖는 객체를 반환한다:

- `current` : 처음에는 전달한 초기값으로 설정된다. 나중에 다른 값으로 설정할 수 있다. ref 객체를 JSX 노드에 대한 `ref` 어트리뷰트로 React에 전달하면 React는 `current` 속성에 해당 노드를 설정한다.

다음 렌더링에서 `useRef` 는 동일한 객체를 반환한다.

### 주의사항 {#caveats}

- `ref.current` 프로퍼티는 상태와 달리 변경할 수 있다. 그러나 렌더링에 사용되는 객체(예: 상태의 일부)를 포함하는 경우 해당 객체를 변경해서는 안 된다.
- `ref.current` 프로퍼티를 변경하면 React는 컴포넌트를 다시 렌더링하지 않는다. 참조는 일반 자바스크립트 객체이기 때문에 React는 사용자가 언제 변경했는지 알지 못한다.
- 초기화를 제외하고는 렌더링 중에 `ref.current` 를 쓰거나 읽지 않아야 한다. 이렇게 하면 컴포넌트의 동작을 예측할 수 없게 된다.
- 엄격 모드에서 React는 실수를 방지하기 위해 컴포넌트 함수를 두 번 호출한다. 이는 개발 전용 동작이며 프로덕션에는 영향을 미치지 않는다. 각 ref 객체는 두 번 생성되지만 버전 중 하나는 버려진다. 컴포넌트 함수가 순수하다면 동작에 영향을 미치지 않는다.

## 사용법 {#usage}

### ref로 값 참조하기 {#referencing-a-value-with-a-ref}

컴포넌트의 최상위 레벨에서 `useRef` 를 호출하여 하나 이상의 ref를 선언한다.

```jsx
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` 는 초기 값으로 설정된 `current` 속성이 있는 ref 객체를 반환한다.

다음 렌더링에서 `useRef` 는 동일한 객체를 리턴한다. `current` 속성을 변경하여 정보를 저장하고 나중에 읽을 수 있다. 이것은 상태를 떠올리게 할 수 있지만 중요한 차이점이 있다.

ref를 변경해도 리렌더링을 트리거하지 않는다. 즉, ref는 컴포넌트의 시각적 출력에 영향을 주지 않는 정보를 저장하는 데 적합하다. 예를 들어 interval ID를 저장했다가 나중에 검색해야 하는 경우 이를 ref에 넣으면 된다. ref 내부의 값을 업데이트하려면 `current` 속성을 수동으로 변경해야 한다:

```jsx
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

나중에 ref 로부터 해당 interval ID를 읽어서 해당 interval을 clear 할 수 있다:

```jsx
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

`ref` 를 사용하면 다음을 보장할 수 있다:

- 렌더링할 때마다 재설정되는 일반 변수와 달리 리렌더링 사이에 정보를 저장할 수 있다.
- 상태 변수와 달리 변경해도 리렌더링 되지 않는다.
- 이 정보는 공유되는 외부 변수와 달리 컴포넌트의 각 복사본에 로컬로 저장된다.

ref를 변경해도 리렌더링 되지 않으므로 화면에 표시하려는 정보를 저장하는 데는 ref가 적합하지 않다. 대신 상태를 사용한다.

:::warning

렌더링 중에는 `ref.current` 를 쓰거나 읽지 않아야 한다.

React는 컴포넌트의 본문이 순수한 함수처럼 동작할 것으로 기대한다:

- 입력(프로퍼티, 상태, 컨텍스트)이 동일하다면 정확히 동일한 JSX를 리턴해야 한다.
- 다른 순서나 다른 인자를 사용하여 호출해도 다른 호출의 결과에 영향을 미치지 않아야 한다.

렌더링 중에 ref를 읽거나 쓰면 이러한 기대가 깨진다.

```jsx
function MyComponent() {
  // ...
  // 🚩 렌더링 중에 ref에 값을 입력하면 안된다.
  myRef.current = 123;
  // ...
  // 🚩 렌더링 중에 ref의 값을 읽으면 안된다.
  return <h1>{myOtherRef.current}</h1>;
}
```

대신 이벤트 핸들러나 Effect에서 ref를 읽거나 쓸 수 있다.

```jsx
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ Effects 에서 ref에 값을 쓰거나 읽을 수 있다.
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ 이벤트 핸들러에서 ref에 값을 쓰거나 읽을 수 있다.
    doSomething(myOtherRef.current);
  }
  // ...
}
```

렌더링 중에 무언가를 읽거나 써야 하는 경우 상태를 대신 사용한다.

이러한 규칙을 어겨도 컴포넌트는 여전히 작동할 수 있지만, React에 추가되는 대부분의 새로운 기능은 이러한 기대치에 의존한다.
:::

### ref로 DOM 조작하기 {#manipulating-the-dom-with-ref}

특히 ref를 사용하여 DOM을 조작하는 것이 일반적이다. React는 이를 기본적으로 지원한다.

먼저, 초기값이 `null` 인 ref 객체를 선언한다:

```jsx
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

그런 다음 ref 객체를 조작하려는 DOM 노드의 JSX에 `ref` 프로퍼티에 전달한다:

```jsx
// ...
return <input ref={inputRef} />;
```

React가 DOM 노드를 생성하고 화면에 배치하면 React는 ref 객체의 `current` 프로퍼티를 해당 DOM 노드로 설정한다. 이제 `<input>` 의 DOM 노드에 접근하여 `focus()` 와 같은 메서드를 호출할 수 있다:

```jsx
function handleClick() {
  inputRef.current.focus();
}
```

React는 노드가 화면에서 제거되면 `current` 프로퍼티를 다시 `null` 로 설정한다.

### ref를 여러번 초기화하지 않기 {#avoiding-recreating-the-ref-content}

React는 초기 ref 값을 한 번 저장하고 다음 렌더링에서 이를 무시한다.

```jsx
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

`new VideoPlayer()` 의 결과는 초기 렌더링에만 사용되지만, 여전히 모든 렌더링에서 이 함수를 호출하게 된다. 이는 값비싼 객체를 생성하는 경우 낭비가 될 수 있다.

이 문제를 해결하려면 대신 다음과 같이 ref를 초기화할 수 있다:

```jsx
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

일반적으로 렌더링 중에 `ref.current` 를 쓰거나 읽는 것은 허용되지 않는다. 하지만 이 경우에는 결과가 항상 동일하고 초기화 중에만 조건이 실행되므로 충분히 예측할 수 있으므로 괜찮다.

:::important 나중에 useRef를 초기화할 때 null 검사를 피하는 방법
타입 검사기를 사용하면서 항상 `null` 을 검사하고 싶지 않다면 다음과 같은 패턴을 대신 사용해 볼 수 있다:

```jsx
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

여기서 `playerRef` 자체는 `null` 값이 가능하다. 그러나 타입 검사기에 `getPlayer()` 가 `null` 을 리턴하는 경우가 없다는 것을 확신시킬 수 있어야 한다. 그런 다음 이벤트 핸들러에서 `getPlayer()` 를 사용한다.
:::

## 트러블슈팅 {#troubleshooting}

### 커스텀 컴포넌트에 대한 ref를 얻을 수 없는 경우 {#trouble1}

아래와 같이 자신의 컴포넌트에 `ref` 를 전달하려고 하면:

```jsx
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

콘솔에서 오류가 발생할 수 있다:

```text
Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

기본적으로 자체 컴포넌트는 내부의 DOM 노드에 대한 ref를 노출하지 않는다.

이 문제를 해결하려면 먼저 ref를 받으려는 컴포넌트를 찾는다:

```jsx
export default function MyInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}
```

그런 다음 다음과 같이 `forwardRef` 로 래핑한다:

```jsx
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return <input value={value} onChange={onChange} ref={ref} />;
});

export default MyInput;
```

그러면 부모 컴포넌트가 ref를 전달할 수 있다.
