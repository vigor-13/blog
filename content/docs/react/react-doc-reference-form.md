---
title: <form>
description:
date: 2024-04-25
tags: [form]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react-dom/components/form',
    },
  ]
---

:::note Canary
React의 `<form>` 확장 기능은 현재 React의 canary 및 실험 채널에서만 사용할 수 있다. React의 안정 버전에서 `<form>` 은 [내장 브라우저 HTML 컴포넌트](https://react.dev/reference/react-dom/components#all-html-components)로만 작동한다. 자세한 내용은 [여기](https://react.dev/community/versioning-policy#all-release-channels)에서 확인할 수 있다.
:::

브라우저에 내장된 `<form>` 컴포넌트를 사용하면 정보 제출을 위한 대화형 컨트롤을 만들 수 있다.

```jsx
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

## 레퍼런스 {#reference}

### \<form> {#form}

정보 제출을 위한 인터랙티브한 컨트롤을 생성하려면 [브라우저 내장 `<form>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)를 사용한다.

```tsx
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

### props {#props}

`<form>` 은 모든 [일반적인 엘리먼트 props](https://react.dev/reference/react-dom/components/common#props)를 지원한다.

`action` prop은 폼 제출 시 어떤 동작을 취할지 결정하는 중요한 역할을 한다.

1. **`action`에 URL이 전달되는 경우:**
   - 폼은 전통적인 HTML 폼과 같이 동작한다.
   - 폼 제출 시 지정된 URL로 데이터가 전송된다.
   - 서버에서는 해당 URL에 대한 요청을 처리하고 응답을 반환한다.
   - 이 경우 폼 제출은 페이지 전환을 발생시키며, 서버에서 응답으로 새로운 페이지를 반환한다.
2. **`action`에 함수가 전달되는 경우:**
   - 폼 제출 시 해당 함수가 호출되어 폼 제출을 처리한다.
   - 함수는 폼 데이터를 인수로 받아 원하는 동작을 수행할 수 있다.
   - 예를 들어, 함수 내에서 폼 데이터를 검증하고, 서버 API를 호출하거나, 상태를 업데이트할 수 있다.
   - 함수는 비동기로 작성될 수 있으므로, 비동기 작업을 처리할 수 있다.
   - 이 경우 폼 제출은 페이지 전환을 발생시키지 않고, 함수 내에서 직접 처리된다.
3. **`action` prop의 오버라이드:**
   - `<button>`, `<input type="submit">`, `<input type="image">` 컴포넌트에 `formAction` 속성을 사용하면 해당 컴포넌트를 클릭했을 때 `action` prop을 오버라이드할 수 있다.
   - 이를 통해 폼 내의 특정 버튼이나 제출 컨트롤에 대해 다른 동작을 지정할 수 있다.
   - 예를 들어, 한 폼 내에서 "저장" 버튼은 데이터를 저장하는 URL로, "제출" 버튼은 데이터를 제출하는 URL로 지정할 수 있다.

`action` prop은 폼 제출 시 수행할 동작을 유연하게 제어할 수 있도록 해준다. URL을 사용하여 전통적인 폼 제출 방식을 사용할 수도 있고, 함수를 사용하여 폼 제출을 직접 처리할 수도 있다. 또한 `formAction` 속성을 사용하여 특정 컨트롤에 대한 동작을 개별적으로 지정할 수 있다. 이를 통해 다양한 폼 제출 시나리오에 맞게 동작을 커스터마이징할 수 있다.

### 주의사항 {#caveats}

`action` 또는 `formAction` 에 함수가 전달되면 `method` prop의 값과 관계없이 HTTP 메서드는 **POST**가 된다.

## 사용법 {#usage}

### 클라이언트에서 폼 제출 처리하기 {#handle-form-submission-on-the-client}

폼의 `action` prop에 함수를 전달하여 폼이 제출될 때 해당 함수를 실행한다. 폼에서 제출된 데이터에 접근할 수 있도록 [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 가 함수의 인수로 전달된다. 이는 URL만 받아들이는 기존의 [HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action)과 다르다.

```tsx
export default function Search() {
  function search(formData) {
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

### Server Action으로 폼 제출 처리하기 {#handle-form-submission-with-a-server-action}

입력 필드와 제출 버튼이 있는 `<form>` 을 렌더링한다. 폼의 `action` prop에 Server Action(즉, `'use server'` 로 표시된 함수)을 전달하여 폼이 제출될 때 해당 함수를 실행한다.

**`<form action>`에 Server Action을 전달하면 사용자가 JavaScript를 활성화하지 않았거나 코드가 로드되기 전에 폼을 제출할 수 있다.** 이는 느린 연결, 장치를 사용하거나 JavaScript를 비활성화한 사용자에게 유용하며, `action` prop에 URL이 전달될 때와 유사한 방식으로 폼이 동작한다.

`hidden` 폼 필드를 사용하여 `<form>` 의 action에 데이터를 제공할 수 있다. Server Action은 숨겨진 폼 필드 데이터를 `FormData` 의 인스턴스로 받아 호출된다.

```tsx
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    'use server';
    const productId = formData.get('productId');
    await updateCart(productId);
  }
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

`hidden` 폼 필드를 사용하여 `<form>` 의 `action` 에 데이터를 제공하는 대신, `bind` 메서드를 호출하여 추가 인수를 제공할 수 있다. 이렇게 하면 함수에 `formData` 외에 새로운 인수(`productId`)가 바인딩된다.

```tsx
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(productId, formData) {
    'use server';
    await updateCart(productId);
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

`<form>` 이 Server Component에 의해 렌더링되고, Server Action이 `<form>` 의 `action` prop에 전달되면 폼은 점진적으로 향상된다.

:::note 점진적 향상

- `<form>` 이 Server Component에 의해 렌더링되고 Server Action이 action prop에 전달되면 폼은 점진적으로 향상된다.
- **점진적 향상이란 JavaScript가 비활성화된 환경에서도 기본적인 기능이 동작하고, JavaScript가 활성화된 환경에서는 향상된 기능을 제공하는 것을 의미한다.**
- Server Action을 사용하면 JavaScript가 비활성화된 환경에서도 폼 제출이 가능하며, JavaScript가 활성화된 환경에서는 추가적인 기능을 제공할 수 있다.

:::

### 폼 제출 중 보류 상태 표시하기 {#display-a-pending-state-during-form-submission}

폼이 제출되는 동안 보류(Pending) 상태를 표시하려면 `<form>` 내에서 렌더링된 컴포넌트에서 `useFormStatus` Hook을 호출하고 반환된 `pending` 속성을 읽을 수 있다.

여기서는 `pending` 속성을 사용하여 폼이 제출 중임을 알 수 있다.

```tsx
import { useFormStatus } from 'react-dom';
import { submitForm } from './actions.js';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

`useFormStatus` Hook에 대한 자세한 내용은 [참조 문서](https://react.dev/reference/react-dom/hooks/useFormStatus)를 확인한다.

### 낙관적으로 폼 데이터 업데이트하기 {#optimistically-updating-form-data}

`useOptimistic` Hook은 네트워크 요청과 같은 백그라운드 작업이 완료되기 전에 사용자 인터페이스를 낙관적으로 업데이트하는 방법을 제공한다. 폼의 맥락에서 이 기술은 앱의 반응성을 향상시키는 데 도움이 된다. 사용자가 폼을 제출할 때, 서버의 응답을 기다려 변경 사항을 반영하는 대신 기대되는 결과로 인터페이스가 즉시 업데이트된다.

예를 들어, 사용자가 폼에 메시지를 입력하고 "보내기" 버튼을 누르면 `useOptimistic` Hook을 사용하여 메시지가 실제로 서버로 전송되기 전에 "전송 중..." 레이블과 함께 메시지가 즉시 목록에 나타나도록 할 수 있다. 이러한 "낙관적" 접근 방식은 속도와 반응성에 대한 인상을 준다. 그런 다음 폼은 백그라운드에서 실제로 메시지를 전송하려고 시도한다. 서버가 메시지 수신을 확인하면 "전송 중..." 레이블이 제거된다.

:::tabs

@tab:active App.js#app

```tsx
import { useOptimistic, useState, useRef } from 'react';
import { deliverMessage } from './actions.js';

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get('message'));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true,
      },
    ],
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: 'Hello there!', sending: false, key: 1 },
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get('message'));
    setMessages([...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

@tab actions.js#action

```tsx
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

:::

### 폼 제출 오류 처리하기 {#handling-form-submission-errors}

경우에 따라 `<form>` 의 `action` prop에 의해 호출되는 함수가 오류를 throw할 수 있다. 이러한 오류는 `<form>` 을 Error Boundary로 감싸서 처리할 수 있다. `<form>` 의 `action` prop에 의해 호출되는 함수가 오류를 throw하면 Error Boundary의 fallback이 표시된다.

```tsx
import { ErrorBoundary } from 'react-error-boundary';

export default function Search() {
  function search() {
    throw new Error('search error');
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}
```

### JavaScript 없이 폼 제출 오류 표시하기 {#display-a-form-submission-error-without-javascript}

점진적 개선을 위해 JavaScript 번들이 로드되기 전에 폼 제출 오류 메시지를 표시하려면 다음 조건이 필요하다:

1. `<form>` 이 [Server Component](https://react.dev/reference/react/use-client)에 의해 렌더링되어야 한다.
2. `<form>` 의 `action` prop에 전달된 함수는 [Server Action](https://react.dev/reference/react/use-server)이어야 한다.
3. 오류 메시지를 표시하기 위해 `useFormState` Hook을 사용해야 한다.

`useFormState` 는 폼의 상태를 관리하고 Server Action과 상호작용하는 데 사용되는 React Hook이다. 이 Hook은 폼의 상태와 액션을 반환하여 폼의 동작을 제어할 수 있도록 해준다.

1. `useFormState` 의 매개변수:
   - 첫 번째 매개변수로 Server Action 함수를 전달한다. 이 함수는 폼 제출 시 실행되며, 폼 데이터를 처리하고 상태를 업데이트하는 역할을 한다.
   - 두 번째 매개변수로 초기 상태 값을 전달한다. 이 값은 폼의 초기 상태를 나타내며, 주로 `null` 또는 빈 객체를 사용한다.
2. `useFormState` 의 반환값:
   - `useFormState` 는 두 개의 값을 배열 형태로 반환한다.
   - 첫 번째 값은 상태 변수다. 이 변수는 폼의 현재 상태를 나타내며, Server Action에 의해 업데이트될 수 있다.
   - 두 번째 값은 폼의 액션 함수다. 이 함수는 폼의 `action` prop에 전달되어야 한다.
3. 상태 변수의 사용:
   - `useFormState` 에서 반환된 상태 변수는 폼의 상태를 나타낸다.
   - 상태 변수는 주로 오류 메시지를 표시하는 데 사용된다. Server Action에서 오류가 발생한 경우 상태 변수에 오류 메시지를 할당하고, 이를 폼에 렌더링할 수 있다.
   - 상태 변수는 폼의 다른 부분에서도 활용될 수 있다. 예를 들어, 폼의 초기 값을 설정하거나 폼의 제출 상태에 따라 UI를 업데이트할 수 있다.
4. Server Action과의 상호작용:
   - `useFormState` 에 전달된 Server Action 함수는 폼 제출 시 실행된다.
   - Server Action 함수는 두 개의 매개변수를 받는다: 이전 상태(prevState)와 폼 데이터(formData)다.
   - Server Action 함수 내에서 폼 데이터를 처리하고, 필요한 작업을 수행한다. 예를 들어, 데이터를 검증하고, 서버에 요청을 보내고, 상태를 업데이트할 수 있다.
   - Server Action 함수에서 반환된 값은 상태 변수를 업데이트하는 데 사용된다. 예를 들어, 오류가 발생한 경우 오류 메시지를 반환하여 상태 변수에 할당할 수 있다.
5. 폼 액션 함수의 사용:
   - `useFormState`에서 반환된 폼 액션 함수는 폼의 `action` prop에 전달되어야 한다.
   - 폼 액션 함수는 폼 제출 시 트리거되며, Server Action 함수를 호출하여 폼 데이터를 처리한다.
   - 폼 액션 함수는 자동으로 생성되며, `useFormState` Hook에 의해 내부적으로 관리된다.

`useFormState`를 사용하면 폼의 상태 관리와 Server Action 호출을 간편하게 처리할 수 있다. 상태 변수를 통해 오류 메시지를 표시하고, Server Action 함수에서 폼 데이터를 처리하며, 폼 액션 함수를 통해 폼 제출을 트리거할 수 있다. 이를 통해 폼의 동작을 제어하고 점진적 개선을 위한 기반을 마련할 수 있다.

```tsx
import { useFormState } from 'react-dom';
import { signUpNewUser } from './api';

export default function Page() {
  async function signup(prevState, formData) {
    'use server';
    const email = formData.get('email');
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, formAction] = useFormState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={formAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

폼 액션에서 상태를 업데이트하는 방법에 대해 자세히 알아보려면 [`useFormState`](https://react.dev/reference/react-dom/hooks/useFormState) 문서를 참조한다.

### 여러 제출 유형 처리하기 {#handling-multiple-submission-types}

폼은 사용자가 누른 버튼에 따라 여러 제출 액션을 처리하도록 설계할 수 있다. 폼 내부의 각 버튼은 `formAction` prop을 설정하여 고유한 액션 또는 동작과 연결될 수 있다.

사용자가 특정 버튼을 누르면 폼이 제출되고 해당 버튼의 속성과 액션에 의해 정의된 해당 액션이 실행된다.

예를 들어, 아래의 코드와 같이 폼은 기본적으로 작성된 아티클을 제출할 수 있지만 `formAction` 을 사용하여 아티클의 초안을 저장하도록 설정된 별도의 버튼을 만들 수 있다.

```tsx
export default function Search() {
  function publish(formData) {
    const content = formData.get('content');
    const button = formData.get('button');
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get('content');
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">
        Publish
      </button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```
