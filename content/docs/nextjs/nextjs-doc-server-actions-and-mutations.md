---
title: 서버 액션 & 뮤테이션
description:
date: 2024-02-03
tags: [fetch]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations',
    },
  ]
---

서버 액션은 서버에서 실행되는 비동기 함수다. 서버 및 클라이언트 컴포넌트에서 Next.js 애플리케이션의 폼 제출 및 데이터 뮤테이션을 처리하는 데 사용할 수 있다.

## 컨벤션 {#convention}

서버 액션은 [React `"use server"`](https://react.dev/reference/react/use-server) 지시문으로 정의할 수 있다. 지시문을 비동기 함수의 맨 위에 배치하여 해당 함수를 서버 액션으로 표시하거나, 별도의 파일 맨 위에 배치하여 해당 파일의 모든 내보내기를 서버 액션으로 표시할 수 있다.

### 서버 컴포넌트 {#server-components}

서버 컴포넌트는 함수 수준 또는 모듈 수준에서 `"use server"` 지시문을 인라인으로 사용할 수 있다. 서버 액션을 인라인하려면 함수 본문 상단에 `"use server"` 를 추가한다:

```tsx
// app/page.tsx

// 서버 컴포넌트
export default function Page() {
  // 서버 액션
  async function create() {
    'use server'

    // ...
  }

  return (
    // ...
  )
}
```

### 클라이언트 컴포넌트 {#client-components}

클라이언트 컴포넌트는 모듈 수준의 `"use server"` 지시문을 사용하는 액션만 가져올 수 있다.

클라이언트 컴포넌트에서 서버 액션을 호출하려면 새 파일을 만들고 그 파일 상단에 `"use server"` 지시문을 추가하면 된다. 파일 내의 모든 함수는 클라이언트 컴포넌트와 서버 컴포넌트 모두에서 재사용할 수 있는 서버 액션이 된다:

```ts
// app/actions.ts

'use server';

export async function create() {
  // ...
}
```

```tsx
// app/ui/button.tsx

import { create } from '@/app/actions'

export function Button() {
  return (
    // ...
  )
}
```

서버 액션을 클라이언트 컴포넌트에 프로퍼티로 전달할 수도 있다:

```tsx
<ClientComponent updateItem={updateItem} />
```

```tsx
// app/client-component.jsx

'use client';

export default function ClientComponent({ updateItem }) {
  return <form action={updateItem}>{/* ... */}</form>;
}
```

## 행동 {#behavior}

- 서버 액션은 `<form>` 엘리먼트의 `action` 속성을 사용하여 호출할 수 있다:
  - 서버 컴포넌트는 점진적으로 적용 가능하므로 JavaScript가 아직 로드되지 않았거나 비활성화되어 있어도 폼이 제출된다.
  - 클라이언트 컴포넌트에서 서버 액션을 호출하는 폼은 자바스크립트가 아직 로드되지 않은 경우 제출을 대기열에 추가하여 클라이언트 하이드레이션에 우선순위를 둔다.
  - 하이드레이션 후에 폼을 제출해도 브라우저가 새로고침되지 않는다.
- 서버 액션은 `<form>` 에 국한되지 않으며 이벤트 핸들러, `useEffect`, 써드파티 라이브러리 및 `<button>` 과 같은 기타 폼 엘리먼트에서 호출할 수 있다.
- 서버 액션은 Next.js 캐싱 및 재검증 아키텍처와 통합된다. 액션이 호출되면 Next.js는 한 번의 서버 왕복으로 업데이트된 UI와 새 데이터를 모두 리턴할 수 있다.
- 백그라운드에서 액션은 `POST` 메서드를 사용하며, 이 `POST` 메서드만이 액션을 호출할 수 있다.
- 서버 액션의 인자와 리턴 값은 React에서 직렬화할 수 있어야 한다. 직렬화 가능한 인자와 값의 목록은 React [문서](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values)를 참조한다.
- 서버 액션은 함수다. 즉, 애플리케이션의 어느 곳에서나 재사용할 수 있다.
- 서버 액션은 사용되는 페이지 또는 레이아웃에서 런타임을 상속받는다.
- 서버 액션은 `maxDuration` 과 같은 필드를 포함하여 사용되는 페이지 또는 레이아웃에서 라우트 세그먼트 구성을 상속한다.

## 예제 {#examples}

### 폼 {#forms}

React는 HTML `<form>` 엘리먼트를 확장하여 `action` 프로퍼티로 서버 액션을 호출한다.

폼에서 호출되면 액션은 자동으로 [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData) 객체를 수신한다. 필드를 관리하기 위해 React `useState` 를 사용할 필요가 없으며, 대신 네이티브 [`FormData` 메서드](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods)를 사용하여 데이터를 추출할 수 있다:

```tsx
// app/invoices/page.tsx

export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server';

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    };

    // mutate data
    // revalidate cache
  }

  return <form action={createInvoice}>...</form>;
}
```

:::tip

- 예시: [로딩 및 에러 상태와 폼](https://github.com/vercel/next.js/tree/canary/examples/next-forms)
- 필드가 많은 폼으로 작업할 때는 JavaScript의 `Object.fromEntries()` 와 함께 `entries()` 메서드를 사용하는 것을 고려할 수 있다. 예시: `const rawFormData = Object.fromEntries(formData.entries())`

자세한 내용은 [React `<form>` 문서](https://react.dev/reference/react-dom/components/form#handle-form-submission-with-a-server-action)를 참조한다.

:::

#### 추가 인자 전달하기 {#passing-additional-arguments}

JavaScript `bind` 메서드를 사용하여 서버 액션에 추가 인자를 전달할 수 있다.

```tsx
// app/client-component.tsx

'use client';

import { updateUser } from './actions';

export function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId);

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">Update User Name</button>
    </form>
  );
}
```

서버 액션은 폼 데이터와 함께 `userId` 인자를 받는다:

```js
// app/actions.js

'use server';

export async function updateUser(userId, formData) {
  // ...
}
```

:::tip

- 다른 방법은 폼에서 인자를 숨겨진 인풋 필드로 전달하는 것이다(예: `<input type="hidden" name="userId" value={userId} />`). 그러나 이 값은 렌더링된 HTML의 일부가 되며 인코딩되지 않는다.
- `.bind` 는 서버와 클라이언트 컴포넌트 모두에서 작동한다. 또한 점진적 향상도 지원한다.

:::

#### 보류 상태 {#pending-states}

React [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus) Hook을 사용하여 폼이 제출되는 동안 보류(pending) 중인 상태를 표시할 수 있다.

- `useFormStatus` 는 특정 `<form>` 의 상태를 반환하므로 `<form>` 엘리먼트의 자식에서 사용해야 한다.
- `useFormStatus` 는 React Hook이므로 클라이언트 컴포넌트에서 사용해야 한다.

```tsx
// app/submit-button.tsx

'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      Add
    </button>
  );
}
```

`<SubmitButton />` 은 어떤 폼에서도 중첩할 수 있다:

```tsx
// app/page.tsx

import { SubmitButton } from '@/app/submit-button';
import { createItem } from '@/app/actions';

// Server Component
export default async function Home() {
  return (
    <form action={createItem}>
      <input type="text" name="field-name" />
      <SubmitButton />
    </form>
  );
}
```

#### 서버 사이드 유효성 검사 & 에러 핸들링 {#server-side-validation-and-error-handling}

클라이언트 사이드 폼 유효성 검사를 위해서 `required` 및 `type="email"` 과 같은 HTML 유효성 검사를 사용하는 것이 좋다.

서버 사이드 유효성 검사의 경우, 데이터를 변경하기 전에 [`zod`](https://zod.dev/) 와 같은 라이브러리를 사용하여 폼 필드의 유효성을 검사할 수 있다:

```ts
// app/actions.ts

'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
});

export default async function createUser(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  });

  // 폼 데이터가 유효하지 않은 경우 조기 리턴
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Mutate data
}
```

서버에서 필드의 유효성을 검사하고 나면 액션에서 직렬화 가능한 객체를 반환하고 React `useFormState` Hook을 사용하여 사용자에게 메시지를 표시할 수 있다.

- 액션을 `useFormState` 에 전달하면 액션의 함수 시그니처가 변경되어 첫 번째 인자로 새로운 `prevState` 또는 `initialState` 매개변수를 받는다.
- `useFormState`는 React Hook이므로 클라이언트 컴포넌트에서 사용해야 한다.

```ts
// app/actions.ts

'use server';

export async function createUser(prevState: any, formData: FormData) {
  // ...
  return {
    message: 'Please enter a valid email',
  };
}
```

그런 다음 동작을 `useFormState` Hook에 전달하고 반환된 상태를 사용하여 오류 메시지를 표시할 수 있다.

```tsx
// app/ui/signup.tsx

'use client';

import { useFormState } from 'react-dom';
import { createUser } from '@/app/actions';

const initialState = {
  message: '',
};

export function Signup() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
      <button>Sign up</button>
    </form>
  );
}
```

:::tip
데이터를 수정하기 전에 항상 사용자에게 해당 작업을 수행할 수 있는 권한이 있는지 확인해야 한다.
:::

#### 낙관적 업데이트 {#optimistic-updates}

서버 액션이 완료될 때까지 응답을 기다리지 않고 React [`useOptimistic`](https://react.dev/reference/react/useOptimistic) Hook을 사용하여 UI를 낙관적 업데이트할 수 있다:

```tsx
// app/page.tsx

'use client';

import { useOptimistic } from 'react';
import { send } from './actions';

type Message = {
  message: string;
};

export function Thread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<Message[]>(
    messages,
    (state: Message[], newMessage: string) => [
      ...state,
      { message: newMessage },
    ],
  );

  return (
    <div>
      {optimisticMessages.map((m, k) => (
        <div key={k}>{m.message}</div>
      ))}
      <form
        action={async (formData: FormData) => {
          const message = formData.get('message');
          addOptimisticMessage(message);
          await send(message);
        }}
      >
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

#### 중첩된 엘리먼트 {#nested-elements}

`<button>`, `<input type="submit">`, `<input type="image">` 와 같이 `<form>` 안에 중첩된 요소에서 서버 액션을 호출할 수 있다. 이러한 요소는 `formAction` 프로퍼티 또는 이벤트 핸들러를 받는다.

이 기능은 폼 내에서 여러 서버 액션을 호출하려는 경우에 유용하다. 예를 들어, 글 초안을 게시하는 것 외에 임시 저장을 위한 특정 `<button>` 엘리먼트를 만들 수 있다.

#### 프로그래밍 방식으로 폼 제출하기 {#programmatic-form-submission}

`requestSubmit()` 메서드를 사용하여 폼 제출을 트리거할 수 있다. 예를 들어 사용자가 `⌘` + `Enter` 를 누르면 `onKeyDown` 이벤트를 수신할 수 있다:

```tsx
// app/entry.tsx

'use client';

export function Entry() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'Enter' || e.key === 'NumpadEnter')
    ) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div>
      <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
    </div>
  );
}
```

그러면 가장 가까운 `<form>` 의 제출이 트리거되어 서버 액션이 호출된다.

### 다른 엘리먼트들 {#non-form-elements}

`<form>` 엘리먼트 내에서 서버 액션을 사용하는 것이 일반적이지만, 이벤트 핸들러 및 `useEffect` 와 같은 코드의 다른 부분에서도 서버 액션을 호출할 수 있다.

#### 이벤트 핸들러 {#event-handlers}

`onClick` 과 같은 이벤트 핸들러에서 서버 액션을 호출할 수 있다.

예를 들어 다음과 같이 좋아요 수를 늘리는 코드를 작성할 수 있다:

```tsx
// app/like-button.tsx

'use client';

import { incrementLike } from './actions';
import { useState } from 'react';

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike();
          setLikes(updatedLikes);
        }}
      >
        Like
      </button>
    </>
  );
}
```

사용자 경험을 개선하려면 서버 액션이 서버에서 실행을 완료하기 전에 UI를 업데이트하거나 보류 중인 상태를 표시하기 위해 [`useOptimistic`](https://react.dev/reference/react/useOptimistic) 및 [`useTransition`](https://react.dev/reference/react/useTransition) 과 같은 다른 React API를 사용하면 좋다.

폼 엘리먼트에 이벤트 핸들러를 추가하여 필드를 저장할 수도 있다(예: `onChange`):

```tsx
// app/ui/edit-post.tsx

'use client';

import { publishPost, saveDraft } from './actions';

export default function EditPost() {
  return (
    <form action={publishPost}>
      <textarea
        name="content"
        onChange={async (e) => {
          await saveDraft(e.target.value);
        }}
      />
      <button type="submit">Publish</button>
    </form>
  );
}
```

이와 같이 여러 이벤트가 연속적으로 빠르게 실행될 수 있는 경우에는 **디바운싱(debouncing)** 을 통해 불필요한 서버 액션 호출을 방지하는 것이 좋다.

#### useEffect {#use-effect}

컴포넌트가 마운트되거나 종속성이 변경될 때 서버 액션을 호출하기 위해 React `useEffect` Hook을 사용할 수 있다. 이는 전역 이벤트에 의존하거나 자동으로 트리거되어야 하는 뮤테이션에 유용하다. 예를 들어, 단축키를 위한 `onKeyDown`, 무한 스크롤을 위한 옵저버 Hook, 또는 컴포넌트가 마운트되어 뷰 수를 업데이트할 때 등이 있다:

```tsx
// app/view-count.tsx

'use client';

import { incrementViews } from './actions';
import { useState, useEffect } from 'react';

export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const updateViews = async () => {
      const updatedViews = await incrementViews();
      setViews(updatedViews);
    };

    updateViews();
  }, []);

  return <p>Total Views: {views}</p>;
}
```

### 에러 핸들링 {#error-handling}

에러가 발생하면 클라이언트에서 가장 가까운 `error.js` 또는 `<Suspense>` 바운더리에서 포착된다. `try/catch` 를 사용하여 UI에서 처리할 에러를 리턴하는 것이 좋다.

예를 들어 서버 액션은 메시지를 반환하여 새 항목을 만들 때 발생하는 오류를 처리할 수 있다:

```ts
// app/action.ts

'use server';

export async function createTodo(prevState: any, formData: FormData) {
  try {
    // Mutate data
  } catch (e) {
    throw new Error('Failed to create task');
  }
}
```

:::tip

오류를 던지는 것 외에도 `useFormState` 에서 처리하도록 객체를 리턴할 수도 있다. [서버 사이드 유효성 검사 및 오류 처리](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-server-actions-and-mutations/#server-side-validation-and-error-handling) 항목을 참조한다.

:::

### 데이터 재검증 {#revalidating-data}

`revalidatePath` API를 사용하여 서버 액션 내에서 Next.js 캐시의 유효성을 재검증할 수 있다:

```ts
// app/actions.ts

'use server';

import { revalidatePath } from 'next/cache';

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidatePath('/posts');
}
```

또는 `revalidateTag` 를 사용하여 캐시 태그가 있는 특정 데이터 페치를 무효화한다:

```ts
// app/actions.ts

'use server';

import { revalidateTag } from 'next/cache';

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidateTag('posts');
}
```

### 리다이렉팅 {#redirecting}

서버 액션이 완료된 후 사용자를 다른 라우트로 리디렉션하려면 `redirect` API를 사용하면 된다. `redirect` 는 `try/catch` 블록 외부에서 호출해야 한다:

```ts
// app/actions.ts

'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

export async function createPost(id: string) {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidateTag('posts'); // `posts` 캐시 업데이트
  redirect(`/post/${id}`); // 새 포스트 페이지로 이동
}
```

### 쿠키 {#cookies}

`cookies` API를 사용하여 서버 액션 내에서 쿠키를 `get`, `set` , `delete` 할 수 있다:

```ts
// app/actions.ts

'use server';

import { cookies } from 'next/headers';

export async function exampleAction() {
  // Get cookie
  const value = cookies().get('name')?.value;

  // Set cookie
  cookies().set('name', 'Delba');

  // Delete cookie
  cookies().delete('name');
}
```

## 보안 {#security}

### 인증 & 인가 {#authentication-and-authorization}

서버 액션은 공개 API 엔드포인트로 취급해야 하며 사용자가 해당 작업을 수행할 권한이 있는지 확인해야 한다. 예를 들어:

```ts
// app/actions.ts

'use server';

import { auth } from './lib';

export function addItem() {
  const { user } = auth();
  if (!user) {
    throw new Error('You must be signed in to perform this action');
  }

  // ...
}
```

### 클로저 & 암호화 {#closure-and-encryption}

컴포넌트 내부에서 서버 액션을 정의하면 액션이 외부 함수의 스코프에 액세스할 수 있는 [클로저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)가 생성된다. 예를 들어, `publish` 액션은 `publishVersion` 변수에 액세스할 수 있다:

```tsx
// app/page.tsx

export default function Page() {
  const publishVersion = await getLatestVersion();

  async function publish(formData: FormData) {
    "use server";
    if (publishVersion !== await getLatestVersion()) {
      throw new Error('The version has changed since pressing publish');
    }
    ...
  }

  return <button action={publish}>Publish</button>;
}
```

클로저는 나중에 액션이 호출될 때 사용할 수 있도록 렌더링 시점에 데이터(예: `publishVersion`)의 스냅샷을 캡처해야 할 때 유용하다.

그러나 이를 위해 캡처된 변수는 액션이 호출될 때 클라이언트로 전송되고 다시 서버로 전송된다. 민감한 데이터가 클라이언트에 노출되는 것을 방지하기 위해 Next.js는 자동으로 클로저 변수를 암호화한다. Next.js 애플리케이션이 빌드될 때 각 액션마다 새로운 개인 키가 생성된다. 즉, 특정 빌드에 대해서만 액션을 호출할 수 있다.

:::tip
민감한 값이 클라이언트에 노출되는 것을 방지하기 위해 암호화에만 의존하는 것은 좋지 않다. 대신 [React taint API](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#preventing-sensitive-data-from-being-exposed-to-the-client)를 사용하여 특정 데이터가 클라이언트로 전송되는 것을 사전에 방지해야 한다.
:::

### 암호화 키 덮어쓰기 {#overwriting-encryption-keys}

여러 서버에서 Next.js 애플리케이션을 셀프 호스팅하는 경우 각 서버 인스턴스가 서로 다른 암호화 키를 사용하게 되어 잠재적인 불일치가 발생할 수 있다.

이 문제를 완화하려면 `process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` 환경 변수를 사용하여 암호화 키를 덮어쓰면 된다. 이 변수를 지정하면 암호화 키가 빌드 간에 영구적으로 유지되고 모든 서버 인스턴스가 동일한 키를 사용하게 된다.

이는 여러 배포 간에 일관된 암호화 동작이 필요한 애플리케이션에서 사용되는 고급 사용 사례다. 키 로테이션 및 서명과 같은 표준 보안 관행을 고려해야 한다.

### 허용된 origin {#allowed-origins}

서버 액션은 `<form>` 엘리먼트에서 호출할 수 있으므로 [CSRF 공격](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)에 노출될 수 있다.

이면에서 서버 액션은 `POST` 메서드를 사용하며, 오직 `POST` 메서드만 호출할 수 있다. 이렇게 하면 최신 브라우저, 특히 기본값으로 설정된 [SameSite 쿠키](https://web.dev/articles/samesite-cookies-explained)로 인한 대부분의 CSRF 취약점을 방지할 수 있다.

추가적인 보안을 위해 Next.js의 서버 액션은 [Origin 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin)와 [Host 헤더(또는 `X-Forwarded-Host`)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)도 비교한다. 두 헤더가 일치하지 않으면 요청이 중단된다. 즉, 서버 액션은 해당 액션을 호스팅하는 페이지와 동일한 호스트에서만 호출할 수 있다.

리버스 프록시 또는 다계층 백엔드 아키텍처(서버 API가 프로덕션 도메인과 다른 경우)를 사용하는 대규모 애플리케이션의 경우 구성 옵션 `serverActions.allowedOrigins` 옵션을 사용하여 안전한 오리진 목록을 지정하는 것이 좋다. 이 옵션은 문자열 배열을 허용한다.

```ts
// next.config.js

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
};
```
