---
title: useState
description: useState Hook 문서
date: 2024-01-28
tags: [hook]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react/useState',
    },
  ]
---

`useState` 는 컴포넌트에 상태 변수를 추가할 수 있는 React Hook이다.

```jsx
const [state, setState] = useState(initialState);
```

## 레퍼런스 {#reference}

### useState(initialState) {#usestate}

컴포넌트의 최상위 수준에서 `useState` 를 호출하여 상태 변수를 선언한다.

```jsx
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

배열 디스트럭처링(array destructuring)을 사용하여 `[something, setSomething]` 과 같은 상태 변수의 이름을 지정하는 것이 일반적이다.

#### 파라미터 {#parameters1}

| 파라미터       | 설명                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialState` | _상태로 만들고 싶은 초기 값이다._ 모든 타입의 값이 될 수 있지만 함수의 경우 조금 다르다. 이 인수는 초기 렌더링 이후에는 무시된다. <br/><br/> 함수를 `initialState` 로 전달하면 초기화 함수로 취급된다. 이 함수는 순수해야 하고, 인자를 받지 않아야 하며, 어떤 타입의 값도 리턴할 수 있어야 한다. React는 컴포넌트를 초기화할 때 초기화 함수를 호출하고 그 리턴 값을 초기 상태로 저장한다. |

#### 리턴 {#returns1}

`useState` 는 정확히 두 개의 값이 있는 배열을 리턴한다:

1. 현재 상태다. 첫 번째 렌더링 중에는 전달한 `initialState` 와 일치한다.
2. 상태를 다른 값으로 업데이트하고 다시 렌더링을 트리거할 수 있는 `set` 함수다.

#### 주의사항 {#caveats1}

- `useState` 는 Hook이므로 컴포넌트의 최상위 수준이나 자체 Hook에서만 호출할 수 있다. 루프나 조건 내부에서는 호출할 수 없다. 필요한 경우 새 컴포넌트로 추출하고 상태를 그 안으로 옮기도록 한다.
- 엄격 모드에서 React는 실수를 방지하기 위해 초기화 함수를 두 번 호출한다. 이는 개발 전용 동작이며 프로덕션에는 영향을 미치지 않는다. 초기화 함수가 순수하다 동작에 영향을 주지 않는다. 호출 중 하나의 결과는 무시된다.

### set 함수, setSometing(nextState) {#set-function}

`useState` 가 반환하는 `set` 함수를 사용하면 상태를 다른 값으로 업데이트하고 렌더링을 다시 트리거할 수 있다. 다음 상태를 직접 전달하거나 이전 상태에서 계산하는 함수를 전달할 수 있다:

```jsx
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### 파라미터 {#parameters2}

| 파라미터    | 설명                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nextState` | _새로운 상태가 되길 원하는 값이다._ 모든 타입의 값이 될 수 있지만 함수의 경우 조금 다르다. <br/><br/> 함수를 `nextState` 로 전달하면 업데이터 함수로 취급된다. 이 함수는 순수해야 하고, 보류(pending) 중인 상태를 유일한 인자로 사용해야 하며, 다음 상태를 리턴해야 한다. React는 업데이터 함수를 대기열에 넣고 컴포넌트를 다시 렌더링한다. 다음 렌더링 중에 React는 대기열에 있는 모든 업데이터를 이전 상태에 적용하여 다음 상태를 계산한다. |

#### 리턴 {#returns2}

`set` 함수는 리턴 값이 없다.

#### 주의사항 {#caveats2}

- `set` 함수는 다음 렌더링을 위한 상태 변수만 업데이트한다. `set` 함수를 호출한 후 상태 변수를 읽으면 호출 전 화면에 표시되었던 이전 값 그대로다.
- `Object.is` 비교를 통해 사용자가 제공한 새 값이 현재 상태와 동일하다면, React는 컴포넌트와 그 자식 컴포넌트를 리렌더링하지 않는다. 이것은 최적화다. 경우에 따라 React가 자식들을 건너뛰기 전에 컴포넌트를 호출해야 할 수도 있지만, 코드에는 영향을 미치지 않는다.
- React는 상태 업데이트를 일괄 처리한다. 모든 이벤트 핸들러가 실행되고 설정된 함수를 호출한 후에 화면을 업데이트한다. 이렇게 하면 단일 이벤트 중에 여러 번 렌더링되는 것을 방지할 수 있다. 드물지만 DOM에 액세스하기 위해 React가 화면을 더 일찍 업데이트하도록 해야 하는 경우, `flushSync` 를 사용할 수 있다.
- 렌더링 중 `set` 함수를 호출하는 것은 현재 렌더링 중인 컴포넌트 내에서만 허용된다. React는 해당 출력을 삭제하고 즉시 새로운 상태로 다시 렌더링을 시도한다. 이 패턴은 거의 필요하지 않지만 이전 렌더링의 정보를 저장하는 데 사용할 수 있다.
- 엄격 모드에서 React는 실수를 방지하기 위해 업데이터 함수를 두 번 호출한다. 이것은 개발 전용 동작이며 프로덕션에는 영향을 미치지 않는다. 만약 업데이터 함수가 순수하다면, 이것은 동작에 영향을 미치지 않을 것이다. 호출 중 하나의 결과는 무시된다.

## 사용법 {#usage}

### 컴포넌트에 상태 추가하기 {#adding-state-to-a-component}

컴포넌트의 최상위 수준에서 `useState` 를 호출하여 하나 이상의 상태 변수를 선언할 수 있다.

```jsx
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

배열 디스트럭처링를 사용하여 `[something, setSomething]` 과 같이 상태 변수의 이름을 지정하는 것이 일반적이다.

`useState` 는 정확히 두 개의 값이 있는 배열을 리턴한다:

1. 현재 상태다. 첫 번째 렌더링 중에는 전달한 `initialState` 와 일치한다.
2. 상태를 다른 값으로 업데이트하고 다시 렌더링을 트리거할 수 있는 `set` 함수다.

화면에 표시되는 내용을 업데이트하려면 다음과 같이 `set` 함수를 호출한다:

```jsx
function handleClick() {
  setName('Robin');
}
```

React는 다음 상태를 저장하고, 새로운 값으로 컴포넌트를 다시 렌더링한 후 UI를 업데이트한다.

:::warning
set 함수를 호출해도 이미 실행 중인 코드의 현재 상태는 변경되지 않는다:

```jsx
function handleClick() {
  setName('Robin');
  console.log(name); // 여전히 "Taylor" 다!
}
```

다음 렌더링부터 `useState` 가 리턴하는 것에만 영향을 미친다.
:::

### 이전 상태를 기준으로 상태 업데이트하기 {#updating-state-based-on-the-previous-state}

`age` 가 `42` 라고 가정해보자. 다음의 핸들러는 `setAge(age + 1)` 를 세 번 호출한다:

```jsx
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

그러나 한 번만 클릭하면 나이는 `45` 가 아니라 `43` 이 된다! 이는 `set` 함수를 호출해도 이미 실행 중인 코드에서 `age` 상태 변수가 업데이트되지 않기 때문이다. 따라서 각 `setAge(age + 1)` 호출은 `setAge(43)` 이 된다.

이 문제를 해결하려면 다음 상태 대신 `setAge` 에 업데이터 함수를 전달하면 된다:

```jsx
function handleClick() {
  setAge((a) => a + 1); // setAge(42 => 43)
  setAge((a) => a + 1); // setAge(43 => 44)
  setAge((a) => a + 1); // setAge(44 => 45)
}
```

여기서 `a => a + 1` 은 업데이터 함수다. 이 함수는 보류(pending) 중인 상태를 가져와서 다음 상태를 계산한다.

React는 업데이터 함수를 대기열에 넣는다. 그런 다음 다음 렌더링 중에 동일한 순서로 호출한다:

1. `a => a + 1` 은 보류 중인 상태로 `42` 를 수신하고 다음 상태로 `43` 을 리턴한다.
2. `a => a + 1` 은 `43` 을 보류 중인 상태로 받고 다음 상태로 `44` 를 리턴한다.
3. `a => a + 1` 은 보류 중인 상태로 `44` 를 수신하고 다음 상태로 `45` 를 리턴한다.

대기 중인 다른 업데이트가 없으므로 React는 결국 `45` 를 현재 상태로 저장한다.

일반적으로 보류 중인 상태 인자의 이름을 상태 변수 이름의 첫 글자로 지정하는 것이 일반적이다(예: `age` 의 경우 `a` ). 하지만 더 명확하다고 생각되는 `prevAge` 또는 다른 이름으로 부를 수도 있다.

React는 개발 환경에서 업데이트가 순수한지 확인하기 위해 업데이터를 두 번 호출한다.

:::important 업데이터를 항상 사용하는 것이 좋을까?
설정하려는 상태가 이전 상태에서 계산되는 경우 항상 `setAge(a => a + 1)` 와 같은 코드를 작성하라는 팁을 종종 들을 수 있다. 이 방법이 나쁘지는 않지만 항상 필요한 것은 아니다.

대부분의 경우 이 두 가지 접근법 사이에는 차이가 없다. React는 클릭과 같은 의도적인 사용자 행동에 대해 항상 다음 클릭 전에 `age` 상태 변수가 업데이트되도록 한다. 즉, 클릭 핸들러가 이벤트 핸들러를 시작할 때 "오래된" `age` 를 볼 위험은 없다.

그러나 동일한 이벤트 내에서 여러 개의 업데이트를 수행하는 경우 업데이터가 도움이 될 수 있다. 상태 변수 자체에 액세스하는 것이 불편한 경우에도 유용하다(리렌더링을 최적화할 때 이런 문제가 발생할 수 있다).

조금 더 장황한 구문보다 일관성을 선호하는 경우, 설정하려는 상태가 이전 상태에서 계산되는 경우 항상 업데이터를 작성하는 것이 좋다. 다른 상태 변수의 이전 상태를 사용하여 계산되는 경우, 이를 하나의 객체로 결합하고 reducer를 사용하는 것이 좋다.
:::

### 객체, 배열 상태 업데이트하기 {#updating-objects-and-arrays-in-state}

객체와 배열을 상태에 넣을 수 있다. React에서 상태는 읽기 전용으로 간주되므로 기존 객체를 변경하지 말고 대체해야 한다. 예를 들어, 상태에 `form` 객체가 있다면 변경하면 안된다:

```jsx
// 🚩 아래와 같이 form 객체를 직접 변경하면 안된다.
form.firstName = 'Taylor';
```

대신 새 객체를 생성하여 전체 객체를 교체한다:

```jsx
// ✅ 새 객체로 교체한다.
setForm({
  ...form,
  firstName: 'Taylor',
});
```

### 초기 상태값을 여러번 생성하지 않기 {#avoiding-recreating-the-initial-state}

React는 초기 상태를 한 번 저장하고 다음 렌더링에서 이를 무시한다.

```jsx
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

`createInitialTodos()` 의 결과는 초기 렌더링에만 사용되지만, 여전히 모든 렌더링에서 이 함수를 호출하게 된다. 이는 큰 배열을 만들거나 값비싼 계산을 수행하는 경우 낭비가 될 수 있다.

이 문제를 해결하려면 이 함수를 초기화 함수로 전달하여 대신 `useState` 에 전달할 수 있다:

```jsx
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

함수를 호출한 결과인 `createInitialTodos()` 가 아니라 함수 자체인 `createInitialTodos` 를 전달하고 있다는 것을 주목하라. 함수를 `useState` 에 전달하면 React는 초기화 중에만 함수를 호출한다.

React는 이니셜라이저가 순수한지 확인하기 위해 개발 과정에서 이니셜라이저를 두 번 호출한다.

### key로 상태 재설정하기 {#reseting-state-with-a-key}

목록을 렌더링할 때 `key` 속성을 자주 접하게 된다. 하지만 이 속성은 다른 용도로도 사용된다.

컴포넌트에 다른 `key` 를 전달하여 컴포넌트의 상태를 재설정할 수 있다. 이 예시에서는 Reset 버튼이 `version` 상태 변수를 변경하고, 이를 `Form` 에 `key` 로 전달핝다. `key` 가 변경되면 React는 `Form` 컴포넌트(및 그 모든 자식)를 처음부터 다시 생성하므로 상태가 초기화 된다.

```jsx
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Hello, {name}.</p>
    </>
  );
}
```

### 이전 렌더링의 정보 저장 {#storing-information-from-previous-renders}

일반적으로 이벤트 핸들러에서 상태를 업데이트한다. 하지만 프로퍼티가 변경될 때 상태 변수를 변경하려는 경우처럼 렌더링에 반응하여 상태를 조정해야 하는 경우가 드물게 있다.

대부분의 경우 이 기능은 필요하지 않다:

- 필요한 값을 현재 프로퍼티나 다른 상태에서 모두 계산할 수 있다면 중복되는 상태를 모두 제거하라. 너무 자주 재계산하는 것이 걱정된다면, `useMemo` Hook이 도움이 될 수 있다.
- 전체 컴포넌트 트리의 상태를 초기화하려면 컴포넌트에 다른 `key` 를 전달하라.
- 가능하다면 이벤트 핸들러에서 모든 관련 상태를 업데이트하라.

이 중 어느 것도 해당되지 않는 드문 경우, 컴포넌트가 렌더링되는 동안 `set` 함수를 호출하여 지금까지 렌더링된 값을 기반으로 상태를 업데이트하는 데 사용할 수 있는 패턴이 있다.

다음은 예시다. 이 `CountLabel` 컴포넌트는 전달된 `count` 를 표시한다:

```jsx
export default function CountLabel({ count }) {
  return <h1>{count}</h1>;
}
```

마지막 변경 이후 카운터가 증가했는지 감소했는지 표시하고 싶다고 가정해 보자. `count` 프로퍼티는 이를 알려주지 않으므로 이전 값을 추적해야 한다. 이를 추적하기 위해 `prevCount` 상태 변수를 추가한다. `trend` 라는 또 다른 상태 변수를 추가하여 카운트의 증가 또는 감소 여부를 유지한다. `prevCount` 와 `count` 를 비교하여 같지 않은 경우 `prevCount` 와 `trend` 를 모두 업데이트한다. 이제 현재 `count` 프로퍼티와 마지막 렌더링 이후 어떻게 변화했는지 모두 표시할 수 있다.

:::tabs

@tab:active App.js#app

```jsx
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <CountLabel count={count} />
    </>
  );
}
```

@tab CountLabel.js#count-label

```jsx
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

:::

렌더링 중에 `set` 함수를 호출하는 경우, 반드시 `prevCount !== count` 와 같은 조건문 내부에 있어야 하며, 조건문 내부에 `setPrevCount(count)` 와 같은 호출이 있어야 한다. 그렇지 않으면 컴포넌트가 계속해서 렌더링되어 앱이 충돌할 수 있다. 또한, 이렇게 현재 렌더링 중인 컴포넌트의 상태만 업데이트할 수 있다. 렌더링 중에 다른 컴포넌트의 `set` 함수를 호출하는 것은 오류다. 마지막으로, `set` 호출은 여전히 상태를 변이(mutation)시키지 않고 업데이트해야 한다. 즉 순수 함수의 다른 규칙을 어겨서는 안 된다는 의미다.

이 패턴은 이해하기 어려울 수 있고 일반적으로 피하는 것이 좋다. 그러나 이것은 Effect에서 상태를 업데이트하는 것보다는 나은 방법이다. 렌더링 중에 `set` 함수를 호출하면 React는 컴포넌트가 return 문으로 종료된 직후에 즉시 해당 컴포넌트를 다시 렌더링하고, 그 후에 자식들을 렌더링한다. 이렇게 하면 자식 컴포넌트가 두 번 렌더링 될 필요가 없다. 컴포넌트 함수의 나머지 부분은 여전히 실행되지만 결과는 버려진다, 조건이 모든 Hook 호출보다 아래에 있다면 조기에 `return;` 을 추가하여 렌더링을 더 일찍 다시 시작할 수 있다.

## 트러블슈팅 {#troubleshooting}

### 상태를 업데이트했지만 로깅을 하면 이전 값이 표시되는 경우 {#trouble1}

`set` 함수를 호출해도 실행 중인 코드의 상태는 변경되지 않는다:

```jsx
function handleClick() {
  console.log(count); // 0

  setCount(count + 1); // 1로 리렌더링 요청하기
  console.log(count); // 여전히 0!

  setTimeout(() => {
    console.log(count); // 이것 또한 0!
  }, 5000);
}
```

이는 상태가 스냅샷처럼 작동하기 때문이다. 상태를 업데이트하면 새 상태 값으로 리렌더링을 요청하지만 이미 실행 중인 이벤트 핸들러의 `count` 변수에는 영향을 미치지 않는다.

다음 상태를 사용해야 하는 경우 변수에 저장한 후 `set` 함수에 전달하면 된다:

```jsx
const nextCount = count + 1;
setCount(nextCount);

console.log(count); // 0
console.log(nextCount); // 1
```

### 상태를 업데이트했지만 화면이 업데이트되지 않는 경우 {#trouble2}

`Object.is` 비교에 의해 결정된 대로 다음 상태가 이전 상태와 같으면 React는 업데이트를 무시한다. 이는 보통 객체나 배열을 직접 변경할 때 발생한다:

```jsx
obj.x = 10; // 🚩 Wrong: 기존 객체 변경
setObj(obj); // 🚩 아무것도 변경되지 않는다.
```

기존 객체를 변경한 후 다시 `setObj` 로 전달했기 때문에 React가 업데이트를 무시했다. 이 문제를 해결하려면 객체와 배열을 변경하는 대신 항상 상태의 객체와 배열을 교체하도록 해야 한다:

```jsx
// ✅ Correct: 새 객체 생성
setObj({
  ...obj,
  x: 10,
});
```

### "Too many re-renders" 오류가 발생한 경우 {#trouble3}

다음과 같은 오류가 표시될 수 있다: `Too many re-renders. React limits the number of renders to prevent an infinite loop`. 일반적으로 이것은 렌더링 중에 unconditional 상태를 설정한다는 것을 의미하므로 컴포넌트는 렌더링 => 상태 설정(렌더링 발생) => 렌더링 => 상태 설정(렌더링 발생) 등의 루프에 빠진다. 이는 이벤트 핸들러를 지정할 때 실수로 인해 발생하는 경우가 많다:

```jsx
// 🚩 Wrong: 렌더링 중에 핸들러를 호출한다.
return <button onClick={handleClick()}>Click me</button>;

// ✅ Correct: 핸들러를 전달한다.
return <button onClick={handleClick}>Click me</button>;

// ✅ Correct: 인라인 함수를 전달한다.
return <button onClick={(e) => handleClick(e)}>Click me</button>;
```

이 오류의 원인을 찾을 수 없는 경우 콘솔에서 오류 옆의 화살표를 클릭하고 자바스크립트 스택을 살펴보고 오류의 원인이 되는 특정 `set` 함수 호출을 찾아보라.

### 이니셜라이저 또는 업데이터 함수가 두 번 호출되는 경우 {#trouble4}

엄격 모드에서 React는 일부 함수를 한 번이 아닌 두 번 호출한다:

```jsx
function TodoList() {
  // 이 컴포넌트 함수는 렌더링할 때마다 두 번 실행된다.

  const [todos, setTodos] = useState(() => {
    // 이 초기화 함수는 초기화 중에 두 번 실행된다.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // 이 업데이터 기능은 클릭할 때마다 두 번 실행된다.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

이는 예상되는 현상이며 코드를 손상시키지 않아야 한다.

이 개발 전용 동작은 컴포넌트를 순수하게 유지하는 데 도움이 됩니다. React는 호출 중 하나의 결과를 사용하고 다른 호출의 결과는 무시합니다. 컴포넌트, 이니셜라이저, 업데이터 함수가 순수하다면 로직에 영향을 미치지 않을 것입니다. 그러나 실수로 불순한 경우 실수를 알아차리는 데 도움이 됩니다.

예를 들어, 다음의 불순한(impure) 업데이터 함수는 상태 배열을 직접 변경한다:

```jsx
setTodos((prevTodos) => {
  // 🚩 Mistake: 상태 변경
  prevTodos.push(createTodo());
});
```

React는 업데이터 함수를 두 번 호출하기 때문에 할 일이 두 번 추가된 것을 볼 수 있으므로 실수가 있음을 알 수 있다. 이 예제에서는 배열을 변경하는 대신 배열을 교체하여 실수를 수정할 수 있다:

```jsx
setTodos((prevTodos) => {
  // ✅ Correct: 새 상태로 교체
  return [...prevTodos, createTodo()];
});
```

이제 이 업데이터 함수는 순수 함수이므로 한 번 더 호출해도 동작에 차이가 없다. 그렇기 때문에 React가 두 번 호출하면 실수를 찾는 데 도움이 된다. 컴포넌트, 이니셜라이저, 업데이터 함수는 순수해야 한다. 이벤트 핸들러는 순수할 필요가 없으므로 React는 이벤트 핸들러를 두 번 호출하지 않는다.

### 상태를 함수로 설정하려고 하는데 함수가 대신 호출되는 경우 {#trouble5}

다음과 같이 상태에 함수를 넣을 수 없다:

```jsx
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

함수를 전달하고 있기 때문에 React는 일부 함수가 초기화 함수이고 일부 다른 함수가 업데이터 함수라고 가정하여 함수를 호출하고 결과를 저장하려고 시도한다. 실제로 함수를 상태로 저장하려면 두 경우 모두 앞에 `() =>` 를 넣어야 한다. 그러면 React는 사용자가 전달한 함수를 저장한다.

```jsx
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
