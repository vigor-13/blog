---
title: "'use server'"
description:
date: 2024-02-04
tags: [directive, server_component]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react/use-server',
    },
  ]
---

:::note Canary
`'use server'` 는 React 서버 컴포넌트를 지원하는 라이브러리를 사용하는 경우에만 필요하다.
:::

`'use server'` 는 클라이언트 사이드 코드에서 호출할 수 있는 서버 사이드 함수를 표시한다.

## 레퍼런스 {#reference}

### 'use server'

비동기 함수 본문 상단에 `'use server'` 를 추가하여 함수를 클라이언트에서 호출 가능한 것으로 표시한다.

이러한 함수를 **서버 액션**이라고 부른다.

```js
async function addToCart(data) {
  'use server';
  // ...
}
```

클라이언트에서 서버 액션을 호출하면 서버 액션 함수에 전달한 인자를 직렬화하여 네트워크 요청을 서버에 보낸다. 서버 액션이 값을 반환하면 해당 값이 직렬화되어 클라이언트에 반환된다.

함수에 `'use server'` 를 개별적으로 표시하는 대신 파일 상단에 지시문을 추가하여 해당 파일 내의 모든 내보내기(export)를 클라이언트 코드에서 가져오는 것(import)을 포함하여 어디에서나 사용할 수 있는 서버 액션으로 표시할 수 있다.

#### 주의사항 {#caveats}

- `'use server'` 는 함수나 모듈의 맨 처음에 있어야 하며, 다른 코드 (가져오기를 포함한)보다 위에 있어야 한다 (지시문 위에 주석은 괜찮다). 작은따옴표나 큰따옴표 중 하나를 사용할 수 있지만 백틱은 사용할 수 없다.
- `'use server'` 는 서버 사이드 파일에서만 사용할 수 있다. 생성된 서버 액션은 직렬화를 통해 클라이언트 컴포넌트에 프로퍼티로 전달될 수 있다.
- 클라이언트 코드에서 서버 액션을 가져오려면 모듈 레벨의 지시어를 사용해야 한다.
- 기본 네트워크 호출이 항상 비동기적이기 때문에 `'use server'` 는 비동기 함수에서만 사용할 수 있다.
- 서버 액션에 대한 인자는 항상 신뢰할 수 없는 입력으로 취급하고 모든 뮤테이션을 검증해야 한다.
- 서버 액션은 [트랜지션](https://react.dev/reference/react/useTransition)에서 호출되어야 한다. [`<form action>`](https://react.dev/reference/react-dom/components/form#props) 또는 [`formAction`](https://react.dev/reference/react-dom/components/input#props) 으로 전달된 서버 액션은 자동으로 트랜지션에서 호출된다.
- 서버 액션은 서버 사이드 상태를 업데이트하는 뮤테이션을 위해 설계되었으므로 데이터 페치에는 권장되지 않는다. 따라서 서버 액션을 구현하는 프레임워크는 일반적으로 한 번에 하나의 액션을 처리하며 반환값을 캐시하는 방법이 없다.

### 보안 고려 사항 {#security-considerations}

서버 액션에 대한 인자는 완전히 클라이언트가 제어한다. 보안을 위해 항상 신뢰할 수 없는 입력으로 취급하고 인자의 유효성을 검사하고 적절하게 이스케이프 처리해야 한다.

모든 서버 액션에서 로그인한 사용자가 해당 작업을 수행할 수 있는지 확인해야 한다.

:::warning
서버 액션에서 민감한 데이터를 전송하는 것을 방지하기 위해 특정 값과 객체가 클라이언트 코드에 전달되지 않도록 하는 실험적인 테인트 API가 있다.

[experimental_taintUniqueValue](https://react.dev/reference/react/experimental_taintUniqueValue) 와 [experimental_taintObjectReference](https://react.dev/reference/react/experimental_taintObjectReference)를 살펴보도록 한다.
:::

### 직렬화 가능한 인자 및 리턴 값 {#serializable-arguments-and-return-values}

클라이언트 코드가 네트워크를 통해 서버 액션을 호출할 때 전달되는 모든 인자는 직렬화할 수 있어야 한다.

다음은 서버 액션 인자로 지원되는 유형이다:

- 원시값
  - string
  - number
  - bigint
  - boolean
  - undefined
  - null
  - symbol (`Symbol.for` 를 통해 글로벌 심볼 레지스트리에 등록된 심볼만 사용할 수 있다.)
- 직렬화 가능한 값을 포함하는 이터러블
  - String
  - Array
  - Map
  - Set
  - [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) & [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- Date
- FormData 인스턴스
- Plain objects: 직렬화 가능한 속성을 가진 [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)로 생성된 객체다.
- 서버 액션인 Function
- Promises

특히, 다음은 지원되지 않는다:

- JSX
- 클라이언트가 표시된 모듈에서 내보내지 않거나 `'use server'` 로 표시된 함수
- 컴포넌트 함수 또는 서버 액션이 아닌 기타 함수를 포함한 함수
- Classes
- 클래스의 인스턴스인 객체 또는 [null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects) 객체
- 전역으로 등록되지 않은 `Symbol`, 예: `Symbol('my new symbol')`

지원되는 직렬화 가능 반환 값은 바운더리 클라이언트 컴포넌트의 직렬화 가능 프로퍼티와 동일하다.

## 사용법 {#usage}

### 폼에서 서버 액션 {#server-actions-in-forms}

서버 액션의 가장 일반적인 사용 사례는 데이터를 변경하는 서버 함수를 호출하는 것이다. 브라우저에서 HTML 폼 엘리먼트는 사용자가 뮤테이션을 제출하는 전통적인 접근 방식이다. React 서버 컴포넌트를 통해 React는 폼에서 서버 액션에 대한 최고 수준의 지원을 도입했다.

다음은 사용자가 username을 입력할 수 있는 폼이다.

```jsx
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

이 예제에서 `requestUsername` 은 `<form>` 에 전달된 서버 액션이다. 사용자가 이 폼을 제출하면 서버 함수 `requestUsername` 에 대한 네트워크 요청이 이루어진다. 폼에서 서버 액션을 호출할 때, React는 폼의 `FormData` 를 서버 액션의 첫 번째 인자로 제공한다.

서버 액션을 폼 `action` 에 전달하면 React는 폼을 [점진적 향상](https://developer.mozilla.org/ko/docs/Glossary/Progressive_Enhancement)시킬 수 있다. 즉, 자바스크립트 번들이 로드되기 전에 폼을 제출할 수 있다.

#### 폼에서 리턴 값 처리하기

username 요청 폼에서는 사용 가능한 username이 없을 수 있다. `requestUsername` 은 실패 여부를 알려주어야 한다.

점진적 향상을 지원하면서 서버 액션의 결과에 따라 UI를 업데이트하려면 `useFormState` 를 사용한다.

```jsx
// requestUsername.js

'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```jsx
// UsernameForm.js

'use client';

import { useFormState } from 'react-dom';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [returnValue, action] = useFormState(requestUsername, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {returnValue}</p>
    </>
  );
}
```

대부분의 Hook과 마찬가지로, `useFormState` 는 클라이언트 코드에서만 호출할 수 있다.

### \<form> 외부에서 서버 액션 호출하기 {#calling-a-server-action-outside-of-form}

서버 액션은 노출된 서버 엔드포인트이며 클라이언트 코드의 어느 곳에서나 호출할 수 있다.

[폼](https://react.dev/reference/react-dom/components/form) 외부에서 서버 액션을 사용하는 경우 [트랜지션](https://react.dev/reference/react/useTransition)에서 서버 액션을 호출하면 로딩 표시기를 표시하고, [낙관적 상태 업데이트](https://react.dev/reference/react/useOptimistic)를 표시하고, 예기치 않은 오류를 처리할 수 있다. 폼은 트랜지션에서 서버 액션을 자동으로 래핑한다.

```jsx
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>
        Like
      </button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

서버 액션 리턴 값을 읽으려면 프로미스가 반환될 때까지 `await` 해야 한다.
