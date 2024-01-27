---
title: useCallback
description: useCallback Hook 문서
date: 2024-01-27
tags: [hook]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react/useCallback',
    },
  ]
---

`useCallback` 은 리렌더링 중에 함수 정의(function definition)를 캐시할 수 있는 React Hook이다.

```jsx
const cachedFn = useCallback(fn, dependencies);
```

## 레퍼런스 {#reference}

### 기본 형태 {#basic}

컴포넌트의 최상위 레벨에서 `useCallback` 을 호출하여 리렌더링 중에 함수 정의를 캐시한다:

```jsx
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

### 파라미터 {#parameters}

| 파라미터       | 설명                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fn`           | _캐시하려는 함수 값이다._ 이 함수는 어떤 인수를 받아도 상관없고 어떤 값도 리턴할 수 있다. React는 초기 렌더 중에 함수를 호출하지 않고 해당 함수를 리턴한다. 다음 렌더링에서는 의존성이 변경되지 않았다면 동일한 함수를 다시 제공한다. 의존성이 변경되었다면 현재 함수를 제공하고, 나중에 재사용될 수 있도록 저장한다. React는 함수를 호출하지 않는다. 함수를 언제 호출할지 결정하는 것은 사용자다. |
| `dependencies` | _`fn` 코드 내에서 참조된 모든 반응형 값의 목록이다._ 반응형 값에는 props, state, 컴포넌트 본문에서 직접 선언한 모든 변수와 함수가 포함된다. 린터는 모든 반응형 값이 의존성 목록에 제대로 포함되었는지 확인한다. 의존성 목록에는 일정한 수의 항목이 있어야 하며 `[dep1, dep2, dep3]` 와 같이 인라인으로 작성해야 한다. React는 `Object.is` 비교 알고리즘을 사용하여 각 의존성을 이전 값과 비교한다. |

### 리턴 {#returns}

초기 렌더링에서 `useCallback` 은 사용자가 전달한 `fn` 함수를 리턴한다.

이후 렌더링 중에는 마지막 렌더링에서 저장된 `fn` 함수를 리턴하거나, 의존성이 변경된 경우에는 현재 렌더링 중에 전달한 `fn` 함수를 리턴한다.

### 주의사항 {#caveats}

- `useCallback`은 Hook이므로 컴포넌트의 최상위 수준이나 자체 Hook에서만 호출할 수 있다. 루프나 조건문 내부에서는 호출할 수 없다. 필요한 경우 새 컴포넌트를 추출하고 상태를 그 안으로 옮기도록 한다.
- React는 특별한 이유가 없는 한 캐시된 함수를 버리지 않는다. 예를 들어 개발 중에는 컴포넌트 파일을 편집할 때 React는 캐시를 버린다. 개발 및 프로덕션 모두에서 초기 마운트 중에 컴포넌트가 서스펜드(Suspend)되면 React는 캐시를 버린다. 미래에는 React가 캐시를 버리는 데 더 많은 기능을 추가할 수 있다.

## 사용법 {#usage}

### 컴포넌트 리렌더링 스킵하기 {#skipping-re-rendering-of-components}

*렌더링 성능을 최적화할 때 하위 컴포넌트에 전달하는 함수를 캐시해야 하는 경우*가 있다. 먼저 이를 수행하는 방법에 대한 구문을 살펴본 다음 어떤 경우에 유용한지 알아보자.

컴포넌트의 리렌더링 사이에 함수를 캐시하려면 해당 함수의 정의를 `useCallback` Hook으로 래핑한다:

```jsx
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

`useCallback` 을 사용하려면 다음의 두 가지를 전달해야 한다:

1. 캐시하려는 함수 정의.
2. 함수 내에서 사용되는 종속성 목록.

초기 렌더링에서 `useCallback` 은 전달한 함수를 그대로 리턴한다.

후속 렌더링에서 React는 종속성을 이전 렌더링 중에 전달한 종속성과 비교한다. 종속성이 변경되지 않은 경우(`Object.is` 로 비교), `useCallback` 은 이전과 동일한 함수를 리턴한다. 그렇지 않으면, `useCallback` 은 현재 렌더링에서 전달한 함수를 리턴한다.

즉, `useCallback` 은 종속성이 변경될 때까지 리렌더링 사이에 함수를 캐시한다.

이 기능이 언제 유용한지 예시를 통해 살펴보자.

`ProductPage` 에서 `ShippingForm` 컴포넌트로 `handleSubmit` 함수를 전달한다고 가정해보자:

```jsx
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

`theme` 프로퍼티를 전환하면 앱이 잠시 멈추는 것을 볼 수 있다. 그런데 JSX에서 `<ShippingForm />` 을 제거하면 멈춤 현상이 사라진다. 이는 `ShippingForm` 컴포넌트를 최적화해야 한다는 의미다.

_기본적으로 컴포넌트가 리렌더링될 때 React는 모든 자식 컴포넌트도 재귀적으로 리렌더링한다._ 그렇기 때문에 `ProductPage` 가 다른 `theme` 로 리렌더링될 때 `ShippingForm` 컴포넌트도 리렌더링된다. 리렌더링하는 데 많은 계산이 필요하지 않은 컴포넌트는 괜찮다. 하지만 리렌더링이 느리다는 것을 확인했다면 `ShippingForm` 을 `memo` 로 감싸서 프로퍼티가 마지막 렌더링과 동일한 경우 리렌더링을 건너뛰도록 할 수 있다:

```jsx
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

이 변경 사항으로 `ShippingForm` 은 모든 프로퍼티가 마지막 렌더링과 동일한 경우 리렌더링을 건너뛴다. 바로 이때 함수 캐싱이 중요하다! `useCallback` 없이 `handleSubmit` 을 정의했다고 가정해 보자:

```jsx
function ProductPage({ productId, referrer, theme }) {
  // theme가 변경될 때마다 이 함수는 다른 함수로 취급된다...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* 그러므로 ShippingForm의 프로퍼티는 절대로 같을 수가 없고, 매번 리렌더링 된다. */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

_JavaScript에서 `function () {}` 또는 `() => {}` 는 `{}` 객체 리터럴이 항상 새 객체를 생성하는 것과 유사하게 항상 다른 함수를 생성한다._ 일반적으로는 문제가 되지 않지만 `ShippingForm` 프로퍼티는 결코 동일하지 않으며 `memo` 최적화가 작동하지 않는다는 것을 의미한다. 바로 이 지점에서 `useCallback` 이 유용하다:

```jsx
function ProductPage({ productId, referrer, theme }) {
  // 리렌더링 사이에 함수를 캐시하라고 React에게 지시한다...
  const handleSubmit = useCallback(
    (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer],
  ); // ...그래서 의존성이 변경되지 않는한...

  return (
    <div className={theme}>
      {/* ...ShippingForm은 동일한 프로퍼티를 받는다. 그 결과 리렌더링을 스킵할 수 있다. */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

`handleSubmit` 을 `useCallback` 으로 감싸면 종속성이 변경될 때까지 리렌더링 간에 동일한 함수가 되도록 할 수 있다. 특별한 이유가 없는 한 함수를 `useCallback` 으로 래핑할 필요는 없다. 이 예제에서는 `memo` 로 감싸진 컴포넌트에 함수를 전달하면 리렌더링을 건너뛸 수 있기 때문이다. 이 페이지에서 자세히 설명하는 다른 이유로도 `useCallback` 이 필요할 수 있다.

:::tip
`useCallback` 은 성능 최적화를 위해서만 사용해야 한다. `useCallback` 을 사용하기 전에 이미 코드가 작동하지 않는다면 근본적인 문제를 찾아서 먼저 수정해야 한다. 그런 다음 `useCallback` 을 다시 추가하면 된다.
:::

:::important useCallback 과 useMemo의 관계는?

`useMemo` 와 `useCallback` 을 함께 사용할 수도 있다. 둘 다 자식 컴포넌트를 최적화하려고 할 때 유용하다.

```jsx
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => {
    // 함수를 호출하고 그 결과를 캐시한다.
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback(
    (orderDetails) => {
      // 함수 그 자체를 캐시한다.
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer],
  );

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

둘의 차이점은 캐시할 수 있는 대상에 있다:

- `useMemo` 는 함수 호출 결과를 캐시한다. 이 예제에서는 `product` 가 변경되지 않는 한 변경되지 않도록 `computeRequirements(product)` 를 호출한 결과를 캐시한다. 이를 통해 불필요하게 `ShippingForm` 을 리렌더링하지 않고도 `requirements` 객체를 전달할 수 있다. 필요한 경우 React는 렌더링 중에 전달한 함수를 호출하여 결과를 계산한다.
- `useCallback`은 함수 자체를 캐시한다. `useMemo` 와 달리 제공한 함수를 호출하지 않는다. 대신, 제공한 함수를 캐시하여 `productId` 또는 `referrer` 가 변경되지 않는 한 `handleSubmit` 자체가 변경되지 않도록 한다. 이렇게 하면 불필요하게 `ShippingForm` 을 리렌더링하지 않고도 `handleSubmit` 함수를 전달할 수 있다. 사용자가 form을 제출하기 전에는 코드가 실행되지 않는다.

`useMemo` 에 이미 익숙하다면 `useCallback` 을 다음과 같이 생각하면 도움이 될 수 있다:

```jsx
// (React 내부에서) 단순화한 구현체
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

:::

:::important 모든 곳에 useCallback을 사용하면 안될까?
이 사이트(React 공식문서)와 같이 대부분의 상호 작용이 페이지 이동 수준의 단순한 앱의 경우 일반적으로 메모가 필요하지 않다. 반면에 그림 편집기 앱과 같이 대부분의 상호 작용이 도형 이동과 같은 기능으로 세분화되어 있다면 메모가 매우 유용할 수 있다.

`useCallback` 으로 함수를 캐싱하는 것은 몇 가지 경우에만 유용하다:

- **`memo` 로 감싼 컴포넌트에 프로퍼티로 전달하는 경우.** 값이 변경되지 않았다면 리렌더링을 피하고 싶을 것이다. 메모화를 사용하면 종속성이 변경된 경우에만 컴포넌트를 리렌더링할 수 있다.
- **일부 Hook의 종속성으로 사용되는 경우.** 예를 들어, `useCallback` 으로 래핑된 다른 함수나 `useEffect` 와 같은 Hook의 종속성이 될 수 있다.

다른 경우에는 함수를 `useCallback` 으로 감싸는 것에 이득이 없다. 그렇게 한다고 해서 크게 해가 되는 것도 아니기 때문에 일부 팀에서는 개별 사례에 대해 생각하지 않고 가능한 한 많이 메모하는 방식을 택하기도 한다. 단점은 코드의 가독성이 떨어진다는 것이다. 또한 모든 메모화가 효과적인 것은 아니다. "항상 새로운" 단일 값만으로도 전체 컴포넌트의 메모화가 깨질 수 있다.

`useCallback` 은 함수 생성을 막지 않는다는 점에 유의하라. 여러분은 항상 함수를 생성하고 있지만, React는 이를 무시하고 변경된 사항이 없는 경우 캐시된 함수를 리턴한다.

실제로는 몇 가지 원칙을 따르면 많은 메모를 불필요하게 만들 수 있다:

1. **컴포넌트가 다른 컴포넌트를 시각적으로 래핑할 때 JSX를 자식으로 받아들이도록 하라.** 그러면 래퍼 컴포넌트가 자신의 상태를 업데이트할 때 React는 그 자식 컴포넌트를 다시 렌더링할 필요가 없다는 것을 알 수 있다.
2. **최대한 로컬 상태를 선호하고 필요 이상으로 상태를 끌어올리지 마라.** 폼과 아이템이 호버되었는지와 같은 일시적인 상태는 최상위 트리나 전역 상태 라이브러리에서 유지하지 마라.
3. **렌더링 로직을 순수하게 유지하라.** 컴포넌트를 리렌더링할 때 문제가 발생하거나 눈에 띄는 시각적 아티팩트가 생성된다면 컴포넌트에 버그가 있는 것이다! 메모를 추가하는 대신 버그를 수정하라.
4. **상태를 업데이트하는 불필요한 Effect는 피하라.** React 앱의 성능 문제는 대부분 컴포넌트를 반복해서 렌더링하게 만드는 Effect에서 비롯된 업데이트 연쇄로 인해 발생한다.
5. **Effect에서 불필요한 종속성을 제거하라.** 예를 들어, 메모화 대신 일부 객체나 함수를 Effect 내부 또는 컴포넌트 외부로 이동하는 것이 더 간단할 때가 많다.

특정 상호작용이 여전히 느리게 느껴진다면, React 개발자 도구 프로파일러를 사용해 어떤 컴포넌트가 메모화의 이점을 가장 많이 누리는지 확인하고 필요한 경우 메모화를 추가한다. 이러한 원칙은 컴포넌트를 더 쉽게 디버깅하고 이해할 수 있게 해주므로 어떤 경우든 이 원칙을 따르는 것이 좋다. 장기적으로는 이 문제를 완전히 해결하기 위해 메모화를 자동으로 수행하는 방법을 연구하고 있다.

:::

### 캐시된 콜백에서 상태 업데이트하기 {#updating-state-from-memoized-callback}

가끔씩, 캐시된 콜백에서 이전 상태를 기반으로 상태를 업데이트해야 할 수도 있다.

아래의 `handleAddTodo` 함수는 `todos` 를 종속성으로 지정하는데, 그 이유는 이 함수가 다음 `todos` 를 계산하기 때문이다:

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

일반적으로 캐시된 함수는 가능한 한 종속성이 적어야 한다. 다음 상태를 계산하기 위해 일부 상태만 읽어야 하는 경우, 대신 업데이터 함수를 전달하여 해당 종속성을 제거할 수 있다:

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ todos를 종속성으로 지정할 필요가 없다.
  // ...
```

여기서는 `todos` 를 종속성으로 만들고 내부에서 읽는 대신 상태를 업데이트하는 방법에 대한 지시(`todos => [...todos, newTodo]`)를 React에 전달한다.

### Effect가 자주 호출되지 않도록 예방하기 {#preventing-effect-from-firing-too-often}

때로는 Effect 내부에서 함수를 호출하고 싶을 때가 있다:

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

이로 인해 문제가 발생한다. 모든 반응형 값은 Effect의 종속성으로 선언해야 한다. 그러나 `createOptions` 을 종속성으로 선언하면 Effect가 채팅방에 계속 다시 연결하게 된다:

```jsx
useEffect(() => {
  const options = createOptions();
  const connection = createConnection();
  connection.connect();
  return () => connection.disconnect();
}, [createOptions]); // 🔴 문제점: 매 렌더링마다 의존성이 변경된다.
// ...
```

이 문제를 해결하려면 Effect에서 호출해야 하는 함수를 `useCallback` 으로 래핑하면 된다:

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ roomId가 변경된 경우에만 리렌더링 된다.

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ createOptions가 변경된 경우에만 변경된다.
  // ...
```

이렇게 하면 `roomId` 가 동일한 경우 리렌더링 간에 `createOptions` 함수가 동일하게 유지된다. 하지만 함수 종속성을 없애는 것이 더 좋은 방법이다. 함수를 Effect 내부로 이동하라:

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ useCallback 이나 함수 종속성이 필요하지 않다!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ roomId가 변경된 경우에만 변한다.
  // ...
```

이제 코드가 더 간단해졌으며 `useCallback` 이 필요하지 않다.

### 커스텀 Hook 최적화하기 {#optimizing-custom-hook}

커스텀 Hook을 작성하는 경우 리턴하는 모든 함수를 `useCallback` 으로 감싸는 것이 좋다:

```jsx
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback(
    (url) => {
      dispatch({ type: 'navigate', url });
    },
    [dispatch],
  );

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

이렇게 하면 Hook의 소비자가 필요할 때 자신의 코드를 최적화할 수 있다.

## 트러블슈팅 {#troubleshooting}

### 컴포넌트가 리렌더링될 때마다 useCallback이 다른 함수를 리턴하는 경우 {#trouble1}

두 번째 인자로 종속성 배열을 지정했는지 확인하라!

종속성 배열을 잊어버리면 `useCallback` 은 매번 새로운 함수를 반환한다:

```jsx
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ 불필요하게 새 함수를 리턴하지 않는다.
  // ...
```

그래도 문제가 해결되지 않는다면 종속성 중 하나 이상이 이전 렌더링과 다르기 때문일 수 있다. 종속성을 콘솔에 수동으로 로깅하여 이 문제를 디버깅할 수 있다:

```jsx
const handleSubmit = useCallback(
  (orderDetails) => {
    // ..
  },
  [productId, referrer],
);

console.log([productId, referrer]);
```

그런 다음 콘솔에서 서로 다른 리렌더의 배열을 마우스 오른쪽 버튼으로 클릭하고 두 배열 모두에 대해 "전역 변수로 저장"을 선택하면 된다. 첫 번째 배열이 `temp1` 로 저장되고 두 번째 배열이 `temp2` 로 저장되었다고 가정하면 브라우저 콘솔을 사용하여 두 배열의 각 종속성이 동일한지 확인할 수 있다:

```js
Object.is(temp1[0], temp2[0]);
Object.is(temp1[1], temp2[1]);
Object.is(temp1[2], temp2[2]);
```

캐시를 방해하는 종속성을 찾았다면 그 종속성을 제거할 방법을 찾거나 함께 캐시하라.

### 루프에서 각 항목에 대해 useCallback을 호출해야 하지만 허용되지 않는 경우 {#trouble2}

`Chart` 컴포넌트가 `memo` 로 감싸져 있다고 가정해 보자. `ReportList` 컴포넌트가 리렌더링할 때 목록의 모든 차트를 리렌더링하고 싶지 않을 것이다. 그러나 루프에서는 `useCallback` 을 호출할 수 없다:

```jsx
function ReportList({ items }) {
  return (
    <article>
      {items.map((item) => {
        // 🔴 루프에서는 다음과 같이 useCallback을 사용할 수 없다.
        const handleClick = useCallback(() => {
          sendReport(item);
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

대신 개별 항목을 컴포넌트로 추출하고 거기에 `useCallback`을 넣는다:

```jsx
function ReportList({ items }) {
  return (
    <article>
      {items.map((item) => (
        <Report key={item.id} item={item} />
      ))}
    </article>
  );
}

function Report({ item }) {
  // ✅ 최상위 수준에서 사용 콜백을 호출한다:
  const handleClick = useCallback(() => {
    sendReport(item);
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

또는 마지막 코드 조각에서 `useCallback` 을 제거하고 대신 `Report` 자체를 `memo` 로 래핑할 수 있다. `item` 프로퍼티가 변경되지 않으면 `Report` 는 리렌더링을 건너뛰므로 `Chart` 도 리렌더링을 건너뛴다:

```jsx
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
