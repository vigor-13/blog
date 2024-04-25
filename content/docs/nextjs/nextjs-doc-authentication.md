---
title: 인증
description:
date: 2024-04-24
tags: ['authentication']
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/authentication',
    },
  ]
---

이 페이지에서는 인증(Authentication)을 구현할때 React와 Next.js의 어떤 기능을 사용해야 하는지 알아본다.

시작하기 전에 프로세스를 다음 세 가지 개념으로 나누어 볼 수 있다.

1. [인증](https://nextjs.org/docs/app/building-your-application/authentication#authentication): 사용자의 아이디, 비밀번호들을 사용하여 신원을 확인한다.
2. [세션 관리](https://nextjs.org/docs/app/building-your-application/authentication#session-management): 요청에 걸쳐 사용자의 인증 상태를 추적한다.
3. [권한 부여](https://nextjs.org/docs/app/building-your-application/authentication#authorization): 사용자가 액세스할 수 있는 경로와 데이터를 결정한다.

다음 다이어그램은 React와 Next.js 기능을 사용한 **인증 플로우**를 보여준다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-authentication/1.png)

이 페이지의 예제에서는 교육 목적으로 기본적인 사용자 이름과 비밀번호 인증을 안내한다. 커스텀 인증 솔루션을 구현할 수 있지만, _보안과 단순성을 높이기 위해 인증 라이브러리 사용을 권장한다._ 이러한 라이브러리는 인증, 세션 관리 및 권한 부여를 위한 기본 제공 솔루션과 소셜 로그인, 다단계 인증 및 역할 기반 액세스 제어와 같은 추가 기능을 제공한다. [Auth Libraries](https://nextjs.org/docs/app/building-your-application/authentication#auth-libraries) 섹션에서 목록을 찾을 수 있다.

## 인증 {#authentication}

### 회원가입 및 로그인 기능 {#sign-up-and-login-functionality}

React의 [Server Actions](https://nextjs.org/docs/app/building-your-application/rendering/server-components), [`useFormStatus()`](https://react.dev/reference/react-dom/hooks/useFormStatus) 및 [`useFormState()`](https://react.dev/reference/react-dom/hooks/useFormState) 와 함께 [`<form>`](https://react.dev/reference/react-dom/components/form) 요소를 사용하여 사용자 자격 증명을 캡처하고 폼 필드의 유효성을 검사하며 Authentication Provider의 API 또는 데이터베이스를 호출할 수 있다.

:::note

- **\<form> 요소**:
  - `<form>` 요소는 사용자로부터 입력을 받기 위한 HTML 요소다.
  - `<form>` 요소의 action 프로퍼티는 폼 제출 시 호출될 Server Action을 지정한다.
- **Server Actions**:
  - Server Actions은 React에서 폼 제출을 처리하기 위한 메커니즘이다.
  - 폼 데이터를 서버로 전송하고 서버에서 해당 데이터를 처리할 수 있다.
  - Server Actions은 항상 서버에서 실행되므로 보안상 민감한 로직을 안전하게 처리할 수 있다.
  - 예를 들어, 사용자 인증, 데이터베이스 쿼리, 이메일 전송 등의 작업을 수행할 수 있다.
- **useFormStatus()**:
  - `useFormStatus()` 훅은 폼의 상태를 추적하는 데 사용된다.
  - 폼의 제출 상태(보류 중, 완료, 실패)를 확인할 수 있다.
  - 폼 제출 버튼의 활성화/비활성화 상태를 제어하거나 제출 중에 로딩 표시기를 표시하는 데 유용하다.
- **useFormState()**:
  - `useFormState()` 훅은 Server Action의 상태와 폼 데이터에 접근할 수 있게 해준다.
  - Server Action에서 반환된 상태(예: 유효성 검사 오류)를 가져와서 사용자에게 표시할 수 있다.
  - 사용자가 입력한 폼 데이터에 접근하여 필요에 따라 조작할 수 있다.

:::

Server Actions은 항상 서버에서 실행되므로 인증 로직을 처리하기 위한 안전한 환경을 제공한다.

가입/로그인 기능을 구현하는 단계는 다음과 같다:

#### 1. 사용자 자격 증명 캡처 {#capture-user-credentials}

사용자 자격 증명을 캡처하기 위해서 제출 시 Server Action을 호출하는 폼을 만든다.

예를 들어, 다음과 같이 사용자의 이름, 이메일 및 비밀번호를 받는 폼을 만들 수 있다:

```tsx
// app/ui/signup-form.tsx
import { signup } from '@/app/actions/auth';

export function SignupForm() {
  return (
    <form action={signup}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

```ts
// app/actions/auth.tsx
export async function signup(formData: FormData) {}
```

#### 2. 서버에서 폼 필드 유효성 검사 {#validate-form-fields-on-the-server}

Server Action을 사용하여 서버에서 폼 필드의 유효성을 검사한다. 인증 프로바이더가 폼 유효성 검사를 제공하지 않는 경우 [`Zod`](https://zod.dev/) 또는 [`Yup`](https://github.com/jquense/yup) 과 같은 스키마 유효성 검사 라이브러리를 사용할 수 있다.

Zod를 예로 들면, 적절한 오류 메시지와 함께 폼 스키마를 정의할 수 있다:

```ts
// app/lib/definitions.ts
import { z } from 'zod';

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
```

인증 프로바이더의 API 또는 데이터베이스에 대한 불필요한 호출을 방지하기 위해 정의된 스키마와 일치하지 않는 폼 필드가 있는 경우 Server Action에서 조기에 리턴할 수 있다.

```ts
// app/actions/auth.ts
import { SignupFormSchema, FormState } from '@/app/lib/definitions';

export async function signup(state: FormState, formData) {
  // 폼 필드 검증
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // 폼 필드에 문제가 있다면 조기에 리턴할 수 있다.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 유저를 생성하기 위해서 프로바이더나 데이터베이스를 호출...
}
```

`<SignupForm />` 으로 돌아가서 React의 `useFormState()` 훅을 사용하여 유효성 검사 오류를 사용자에게 표시할 수 있다:

```tsx
// app/ui/signup-form.tsx
'use client';

import { useFormState } from 'react-dom';
import { signup } from '@/app/actions/auth';

export function SignupForm() {
  const [state, action] = useFormState(signup, undefined);

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <SignupButton />
    </form>
  );
}
```

또한 `useFormStatus()` 훅을 사용하여 폼 제출 시 보류 상태를 처리할 수 있다:

```tsx
// app/ui/signup-form.tsx
'use client';

import { useFormStatus, useFormState } from 'react-dom';

export function SignupButton() {
  const { pending } = useFormStatus();

  return (
    <button aria-disabled={pending} type="submit">
      {pending ? 'Submitting...' : 'Sign up'}
    </button>
  );
}
```

:::note
`useFormStatus()` 는 `<form>` 내에서 렌더링되는 컴포넌트에서 호출되어야 한다. 자세한 내용은 [React 문서](https://react.dev/reference/react-dom/hooks/useFormStatus#usage)를 참조한다.
:::

#### 3. 사용자 생성 또는 사용자 자격 증명 확인

폼 필드의 유효성을 검사한 후 인증 프로바이더의 API 또는 데이터베이스를 호출하여 새 사용자 계정을 만들거나 사용자가 존재하는지 확인할 수 있다.

이전 예제에서 계속:

```tsx
// app/actions/auth.tsx
export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data;
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Library's API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id });

  const user = data[0];

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    };
  }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}
```

사용자 계정을 성공적으로 생성하거나 사용자 자격 증명을 확인한 후에는 세션을 만들어 사용자의 인증 상태를 관리할 수 있다. 세션 관리 전략에 따라 세션을 쿠키 또는 데이터베이스에 저장하거나 둘 다 저장할 수 있다. 자세한 내용은 [세션 관리](https://nextjs.org/docs/app/building-your-application/authentication#session-management) 섹션을 참조한다.

:::tip

- 위의 예제는 인증 단계를 세분화하여 설명하므로 자세히 설명되어 있다. 위와 같이 자체적으로 솔루션을 구현하는 경우 프로젝트의 복잡도를 빠르게 증가시킨다. 프로세스를 단순화하려면 [인증 라이브러리](https://nextjs.org/docs/app/building-your-application/authentication#auth-libraries)를 사용하는 것이 좋다.
- 사용자 경험을 개선하기 위해 이메일 또는 사용자 이름 중복 여부를 초기에 확인하는 것이 좋다. 예를 들어, 사용자가 사용자 이름을 입력하거나 입력 필드의 포커스가 해제될 때다. 이는 불필요한 폼 제출을 방지하고 사용자에게 즉각적인 피드백을 제공하는 데 도움이 될 수 있다. [`use-debounce`](https://www.npmjs.com/package/use-debounce) 와 같은 라이브러리를 사용하여 이러한 확인의 빈도를 관리하면서 요청을 디바운스할 수 있다.

:::

## 세션 관리 {#session-management}

세션 관리를 통해 사용자의 인증 상태를 유지할 수 있다. 여기에는 _세션_ 또는 _토큰_ 을 생성, 저장, 갱신 및 삭제하는 작업이 포함된다.

세션에는 두 가지 유형이 있다:

- [상태 비저장(Stateless) 세션](https://nextjs.org/docs/app/building-your-application/authentication#stateless-sessions): 세션 데이터(또는 토큰)가 브라우저의 쿠키에 저장된다. 쿠키는 각 요청과 함께 전송되어 서버에서 세션을 검증할 수 있다. 이 방법은 더 간단하지만, 올바르게 구현되지 않으면 보안성이 낮다.
- [데이터베이스](https://nextjs.org/docs/app/building-your-application/authentication#database-sessions): 세션 데이터는 데이터베이스에 저장되며, 사용자의 브라우저는 암호화된 세션 ID만 받는다. 이 방법은 더 안전하지만, 복잡할 수 있고 더 많은 서버 리소스를 사용한다.

:::tip
두 가지 방법 중 하나 또는 둘 다 사용할 수 있지만, [iron-session](https://github.com/vvo/iron-session)이나 [Jose](https://github.com/panva/jose)와 같은 세션 관리 라이브러리를 사용하는 것이 좋다.
:::

### 상태 비저장 세션 {#stateless-sessions}

상태 비저장 세션을 생성하고 관리하려면 몇 가지 단계를 따라야 한다:

1. 세션에 서명하는 데 사용할 비밀 키를 생성하고 [환경 변수](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)로 저장한다.
2. 세션 관리 라이브러리를 사용하여 세션 데이터를 암호화/복호화하는 로직을 작성한다.
3. Next.js의 [`cookies()`](https://nextjs.org/docs/app/api-reference/functions/cookies) API를 사용하여 쿠키를 관리한다.

위의 사항 외에도, 사용자의 세션을 [업데이트(또는 갱신)](https://nextjs.org/docs/app/building-your-application/authentication#updating-or-refreshing-sessions)하고, 사용자가 로그아웃할 때 세션을 [삭제](https://nextjs.org/docs/app/building-your-application/authentication#deleting-the-session)하는 기능까지도 고려해야 한다.

:::tip
[인증 라이브러리](https://nextjs.org/docs/app/building-your-application/authentication#auth-libraries)에 세션 관리가 포함되어 있는지 확인하는 것이 좋다.
:::

#### 1. 비밀 키 생성하기 {#generating-a-secret-key}

:::important
세션에 서명한다는 개념은 세션 데이터의 무결성을 보장하기 위해 사용되는 기술이다.

**서명은 세션 데이터가 서버에서 생성되었으며 클라이언트에 의해 변조되지 않았음을 증명하는 역할을 한다.**

세션에 서명하는 과정은 다음과 같다:

1. **서버에서 세션 데이터를 생성한다.** 세션 데이터에는 사용자의 인증 정보, 권한, 기타 관련 정보 등이 포함된다.
2. **서버는 비밀 키를 사용하여 세션 데이터에 대한 서명을 생성한다.** 서명은 일반적으로 해시 함수와 암호화 알고리즘을 사용하여 생성된다. 서버는 세션 데이터와 비밀 키를 함께 사용하여 고유한 서명 값을 계산한다.
3. **서버는 세션 데이터와 함께 서명을 클라이언트에게 전송한다.** 이때 세션 데이터와 서명은 쿠키에 저장되거나 다른 방식으로 클라이언트에게 전달된다.
4. **클라이언트는 서버로부터 받은 세션 데이터와 서명을 저장한다.**
5. **클라이언트가 서버에 요청을 보낼 때마다 저장된 세션 데이터와 서명을 함께 전송한다.**
6. **서버는 클라이언트로부터 받은 세션 데이터와 서명을 검증한다.** 서버는 동일한 비밀 키를 사용하여 받은 세션 데이터에 대한 서명을 다시 계산하고, 클라이언트로부터 받은 서명과 비교한다. 두 서명이 일치하면 세션 데이터가 변조되지 않았음을 확인할 수 있다.
7. **서명 검증이 성공하면 서버는 세션 데이터를 신뢰할 수 있으며, 해당 데이터를 사용하여 사용자의 인증 상태를 확인하고 요청을 처리한다.**

세션에 서명을 사용하면 다음과 같은 이점이 있다:

- 세션 데이터의 무결성 보장: 서명을 통해 세션 데이터가 서버에서 생성되었으며 클라이언트에 의해 변조되지 않았음을 확인할 수 있다.
- 세션 하이재킹 방지: 공격자가 세션 데이터를 가로채더라도 유효한 서명을 생성할 수 없으므로 세션 하이재킹을 방지할 수 있다.
- 안전한 세션 관리: 서명을 사용하여 세션의 유효성을 검사함으로써 안전한 세션 관리를 할 수 있다.

비밀 키는 서명을 생성하고 검증하는 데 사용되는 중요한 요소다. 비밀 키는 서버에서만 알고 있어야 하며, 클라이언트에게 노출되어서는 안 된다. openssl 명령을 사용하여 안전한 비밀 키를 생성할 수 있으며, 이 비밀 키를 사용하여 세션에 서명할 수 있다.
:::

세션에 서명할 비밀 키를 생성하는 몇 가지 방법이 있다. 예를 들어, 터미널에서 `openssl` 명령을 사용할 수 있다:

```bash
openssl rand -base64 32
```

이 명령은 비밀 키로 사용할 수 있는 32자의 임의 문자열을 생성하며, 이를 환경 변수 파일에 저장한다:

```.env
SESSION_SECRET=your_secret_key
```

그런 다음 세션 관리 로직에서 이 키를 참조한다:

```ts
// app/lib/session.ts
const secretKey = process.env.SESSION_SECRET;
```

#### 2. 세션 암호화 및 복호화 {#encrypting-and-decrypting-sessions}

다음으로, 선호하는 [세션 관리 라이브러리](https://nextjs.org/docs/app/building-your-application/authentication#session-management-libraries)를 사용하여 세션을 암호화하고 복호화할 수 있다.

[`Jose`](https://www.npmjs.com/package/jose)(Edge Runtime과 호환됨)와 React의 [`server-only`](https://www.npmjs.com/package/server-only) 패키지를 사용하여 세션 관리 로직이 서버에서만 실행되도록 보장할 수 있다.

```ts
// app/lib/session.ts
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/app/lib/definitions';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}
```

:::tip
페이로드에는 후속 요청에서 사용할 최소한의 고유한 사용자 데이터(예: 사용자 ID, 역할 등)가 포함되어야 한다. 전화번호, 이메일 주소, 신용카드 정보 등의 개인 식별 정보나 비밀번호와 같은 민감한 데이터는 포함하지 않아야 한다.
:::

#### 3. 쿠키 설정(권장 옵션) {#setting-cookies}

세션을 쿠키에 저장하려면 Next.js의 [`cookies()`](https://nextjs.org/docs/app/api-reference/functions/cookies) API를 사용한다.

쿠키는 서버에서 설정해야 하며, 다음과 같은 권장 옵션을 포함해야 한다:

- **HttpOnly** : 클라이언트 측 JavaScript가 쿠키에 접근하는 것을 방지한다.
- **Secure** : 쿠키를 전송할 때 https를 사용한다.
- **SameSite** : 쿠키가 cross-site 요청과 함께 전송될 수 있는지 여부를 지정한다.
- **Max-Age** 또는 **Expires** : 일정 기간 후에 쿠키를 삭제한다.
- **Path** : 쿠키의 URL 경로를 정의한다.

각 옵션에 대한 자세한 내용은 [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)을 참조한다.

```ts
// app/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}
```

Server Action에서 `createSession()` 함수를 호출하고, [`redirect()`](https://nextjs.org/docs/app/building-your-application/routing/redirecting) API를 사용하여 사용자를 적절한 페이지로 리디렉션할 수 있다:

```ts
// app/actions/auth.ts
import { createSession } from '@/app/lib/session';

export async function signup(state: FormState, formData: FormData) {
  // 이전 단계:
  // 1. 폼 필드 유효성 검사
  // 2. 데이터베이스에 삽입할 데이터 준비
  // 3. 사용자를 데이터베이스에 삽입하거나 Library API 호출

  // 현재 단계:
  // 4. 사용자 세션 생성
  await createSession(user.id);
  // 5. 사용자 리디렉션
  redirect('/profile');
}
```

:::tip

- 쿠키는 클라이언트 측 변조를 방지하기 위해 서버에서 설정해야 한다.
- 🎥 시청: Next.js를 사용한 상태 비저장 세션 및 인증에 대해 자세히 알아보기 → [YouTube (11분)](https://www.youtube.com/watch?v=DJvM2lSPn6w).

:::

#### 세션 업데이트(또는 갱신) {#updating-sessions}

세션의 만료 시간을 연장할 수 있다. 이는 사용자가 애플리케이션에 다시 액세스한 후에도 로그인 상태를 유지하는 데 유용하다.

```ts
// app/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';

export async function updateSession() {
  const session = cookies().get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}
```

:::tip
인증 라이브러리에서 사용자의 세션을 연장하는 데 사용할 수 있는 리프레시 토큰을 지원하는지 확인한다.
:::

#### 세션 삭제 {#deleting-the-session}

세션을 삭제하려면 쿠키를 삭제하면 된다:

```ts
// app/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';

export function deleteSession() {
  cookies().delete('session');
}
```

그런 다음 애플리케이션에서 `deleteSession()` 함수를 재사용할 수 있다. 예를 들어, 로그아웃 시:

```ts
// app/actions/auth.ts
import { cookies } from 'next/headers';
import { deleteSession } from '@/app/lib/session';

export async function logout() {
  deleteSession();
  redirect('/login');
}
```

### 데이터베이스 세션 {#database-sessions}

데이터베이스 세션을 생성하고 관리하려면 다음 단계를 수행해야 한다:

1. 세션 및 데이터를 저장할 테이블을 데이터베이스에 생성한다(또는 Auth Library에서 이를 처리하는지 확인).
2. 세션을 삽입, 업데이트 및 삭제하는 기능을 구현한다.
3. 사용자의 브라우저에 저장하기 전에 세션 ID를 암호화하고, 데이터베이스와 쿠키가 동기화되도록 보장한다(이는 선택 사항이지만 Middleware에서 낙관적 인증 확인을 위해 권장됨).

```ts
// app/lib/session.ts
import cookies from 'next/headers';
import { db } from '@/app/lib/db';

export async function createSession(id: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 1. 데이터베이스에 세션 생성
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // 세션 ID 반환
    .returning({ id: sessions.id });

  const sessionId = data[0].id;

  // 2. 세션 ID 암호화
  const session = await encrypt({ sessionId, expiresAt });

  // 3. 낙관적 인증 확인을 위해 세션을 쿠키에 저장
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}
```

:::tip

- 더 빠른 데이터 검색을 위해 [Vercel Redis](https://vercel.com/docs/storage/vercel-kv)와 같은 데이터베이스를 사용할 수 있다. 그러나 기본 데이터베이스에 세션 데이터를 유지하고 데이터 요청을 결합하여 쿼리 수를 줄일 수도 있다.
- 사용자가 마지막으로 로그인한 시간이나 활성 디바이스 수를 추적하거나 사용자가 모든 디바이스에서 로그아웃할 수 있도록 하는 등의 고급 사용 사례를 위해 데이터베이스 세션을 사용하도록 선택할 수 있다.

:::

세션 관리를 구현한 후에는 사용자가 애플리케이션 내에서 무엇에 접근하고 수행할 수 있는지 제어하기 위해 권한 부여 로직을 추가해야 한다.

## 권한 부여 {#authorization}

사용자가 인증되고 세션이 생성되면 권한 부여를 구현하여 사용자가 애플리케이션 내에서 접근할 수 있는 항목과 수행할 수 있는 작업을 제어할 수 있다.

권한 부여 검사에는 두 가지 주요 유형이 있다:

1. **낙관적 검사**: 쿠키에 저장된 세션 데이터를 사용하여 사용자가 경로에 접근하거나 작업을 수행할 수 있는 권한이 있는지 확인한다. 이러한 검사는 UI 요소 표시/숨김 또는 권한이나 역할에 따라 사용자를 리디렉션하는 등의 빠른 작업에 유용하다.
2. **안전한 검사**: 데이터베이스에 저장된 세션 데이터를 사용하여 사용자가 경로에 접근하거나 작업을 수행할 수 있는 권한이 있는지 확인한다. 이러한 검사는 더 안전하며 민감한 데이터나 작업에 대한 접근이 필요한 작업에 사용된다.

두 경우 모두 다음을 권장한다:

- 권한 부여 로직을 중앙 집중화하기 위해 [데이터 접근 계층(Data Access Layer)](https://nextjs.org/docs/app/building-your-application/authentication#creating-a-data-access-layer-dal) 생성
- 필요한 데이터만 반환하기 위해 [데이터 전송 객체(Data Transfer Objects, DTO)](https://nextjs.org/docs/app/building-your-application/authentication#using-data-transfer-objects-dto) 사용
- 선택적으로 [미들웨어](https://nextjs.org/docs/app/building-your-application/authentication#optimistic-checks-with-middleware-optional)를 사용하여 낙관적 검사 수행

### 미들웨어를 사용한 낙관적 검사(선택 사항) {#optimistic-checks-with-middleware}

미들웨어는 Next.js 애플리케이션의 모든 경로에서 실행되는 코드 레이어다. 사용자 요청이 실제로 페이지 컴포넌트에 도달하기 전에 미들웨어에서 요청을 가로채고 추가적인 처리를 수행할 수 있다. 이러한 특성으로 인해 미들웨어는 권한 부여와 사용자 리디렉션에 유용하게 사용될 수 있다.

1. **낙관적 검사를 위한 미들웨어 사용**:
   - 낙관적 검사는 사용자의 권한을 빠르게 확인하기 위해 쿠키에 저장된 세션 데이터를 사용한다.
   - 미들웨어는 모든 경로에서 실행되므로 사용자의 권한을 확인하고 리디렉션 로직을 중앙 집중화하는 데 적합하다.
   - 미들웨어에서는 쿠키에서 세션 데이터를 읽어 사용자의 권한을 확인할 수 있다.
   - 권한이 없는 사용자는 미들웨어에서 미리 필터링하여 리디렉션할 수 있다.
   - 예를 들어, 인증되지 않은 사용자가 보호된 경로에 접근하려고 하면 미들웨어에서 로그인 페이지로 리디렉션할 수 있다.
   - 이렇게 하면 권한 없는 사용자의 요청을 사전에 차단하고 페이지 컴포넌트에 도달하기 전에 처리할 수 있다.
2. **정적 경로 보호를 위한 미들웨어 사용**:
   - 사용자 간에 데이터를 공유하는 정적 경로의 경우, 데이터는 빌드 시점에 생성되므로 요청 시점에 데이터를 보호하기 어려울 수 있다.
   - 미들웨어는 이러한 정적 경로에 대한 접근을 제어하는 데 사용할 수 있다.
   - 미들웨어에서는 사용자의 권한을 확인하고, 권한이 없는 사용자의 접근을 차단할 수 있다.
   - 예를 들어, 결제벽 뒤에 있는 콘텐츠의 경우, 미들웨어에서 사용자의 구독 상태를 확인하고 구독하지 않은 사용자를 다른 페이지로 리디렉션할 수 있다.
   - 이렇게 하면 정적 경로에 대한 접근 제어를 미들웨어 레벨에서 처리할 수 있다.
3. **데이터베이스 검사 피하기**:
   - 미들웨어는 모든 경로에서 실행되므로 데이터베이스 검사를 수행하면 성능 문제가 발생할 수 있다.
   - 특히 프리페치된 경로의 경우, 미들웨어가 실행될 때마다 데이터베이스 검사가 수행되어 불필요한 오버헤드가 발생할 수 있다.
   - 따라서 미들웨어에서는 쿠키에 저장된 세션 데이터를 사용하여 낙관적 검사를 수행하는 것이 좋다.
   - 쿠키에서 세션 데이터를 읽는 것은 빠르고 효율적이며, 데이터베이스 검사에 비해 성능 오버헤드가 적다.
   - 미들웨어에서는 쿠키의 세션 데이터를 기반으로 사용자의 권한을 확인하고 리디렉션을 수행할 수 있다.
   - 보안이 중요한 경우에는 미들웨어 이후의 레이어(예: API 라우트 핸들러 또는 데이터 접근 계층)에서 추가적인 데이터베이스 검사를 수행할 수 있다.

미들웨어를 사용하여 낙관적 검사와 정적 경로 보호를 수행하면 사용자 권한에 따른 리디렉션과 접근 제어를 효과적으로 처리할 수 있다. 이를 통해 권한이 없는 사용자의 요청을 사전에 차단하고 애플리케이션의 보안을 강화할 수 있다.

그러나 미들웨어에서는 성능 문제를 고려하여 데이터베이스 검사를 최소화하고, 쿠키에 저장된 세션 데이터를 기반으로 낙관적 검사를 수행하는 것이 좋다. 보안이 중요한 경우에는 미들웨어 이후의 레이어에서 추가적인 데이터베이스 검사를 수행하여 안전성을 보장할 수 있다.

예를 들면:

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';

// 1. 보호된 경로와 공개 경로 지정
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/signup', '/'];

export default async function middleware(req: NextRequest) {
  // 2. 현재 경로가 보호되는지 또는 공개되는지 확인
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. 쿠키에서 세션 복호화
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  // 5. 사용자가 인증되지 않은 경우 /login으로 리디렉션
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // 6. 사용자가 인증된 경우 /dashboard로 리디렉션
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

// 미들웨어가 실행되지 않아야 하는 경로
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
```

미들웨어는 초기 검사에 유용할 수 있지만, 데이터를 보호하는 유일한 방어선이 되어서는 안 된다. 대부분의 보안 검사는 데이터 소스와 가능한 한 가까운 곳에서 수행되어야 한다. 자세한 내용은 [데이터 접근 계층](https://nextjs.org/docs/app/building-your-application/authentication#creating-a-data-access-layer-dal)을 참조한다.

:::tip

- 미들웨어에서는 `req.cookies.get('session).value` 를 사용하여 쿠키를 읽을 수 있다.
- 미들웨어는 [Edge 런타임](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)을 사용한다. 인증 라이브러리와 세션 관리 라이브러리가 호환되는지 확인해야 한다.
- 미들웨어의 `matcher` 속성을 사용하여 미들웨어가 실행되어야 하는 경로를 지정할 수 있다. 그러나 인증의 경우 미들웨어가 모든 경로에서 실행되는 것이 좋다.

:::

### 데이터 접근 계층(DAL) 생성 {#creating-a-data-access-layer}

데이터 요청과 권한 부여 로직을 중앙 집중화하기 위해 DAL을 생성하는 것이 좋다.

DAL에는 사용자가 애플리케이션과 상호 작용할 때 사용자의 세션을 검증하는 함수가 포함되어야 한다. 최소한 이 함수는 세션이 유효한지 확인한 다음 사용자 정보를 리디렉션하거나 반환하여 추가 요청을 수행해야 한다.

예를 들어 DAL용 별도 파일을 만들고 `verifySession()` 함수를 포함시킨다. 그런 다음 React의 [cache](https://react.dev/reference/react/cache) API를 사용하여 React 렌더링 패스 동안 함수의 반환 값을 메모이제이션한다:

```ts
// app/lib/dal.ts
import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';

export const verifySession = cache(async () => {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect('/login');
  }

  return { isAuth: true, userId: session.userId };
});
```

그런 다음 데이터 요청, 서버 액션, 라우트 핸들러에서 `verifySession()` 함수를 호출할 수 있다:

```ts
// app/lib/dal.ts
export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // 전체 사용자 객체가 아닌 필요한 열만 명시적으로 반환
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });

    const user = data[0];

    return user;
  } catch (error) {
    console.log('Failed to fetch user');
    return null;
  }
});
```

:::tip

1. **DAL과 정적 경로 보호**:
   - 데이터 접근 계층(DAL)은 데이터베이스와 상호 작용하는 코드를 모아놓은 곳이다. 사용자의 요청이 들어오면 DAL에서 데이터를 가져와 권한을 확인한 후 데이터를 반환한다.
   - 하지만 Next.js에서 정적 경로를 사용하면, 빌드 시점에 미리 데이터를 가져와 HTML 파일을 생성한다. 이 경우 사용자의 요청 시점에는 이미 생성된 HTML 파일을 그대로 반환하므로, DAL에서 권한을 확인할 수 없게 된다.
   - 따라서 **정적 경로에서 공유되는 데이터를 보호하기 위해서는 미들웨어를 사용해야 한다.** 미들웨어에서 사용자의 권한을 확인하고, 접근을 제어할 수 있다.
2. **안전한 세션 검사와 캐싱**:
   - 세션 데이터의 유효성을 안전하게 검사하기 위해서는 데이터베이스에 저장된 세션 ID와 비교해야 한다.
   - 하지만 매번 데이터베이스에 요청을 보내면 성능 문제가 발생할 수 있다. 특히 렌더링 과정에서 여러 번 세션을 확인해야 하는 경우, 불필요한 중복 요청이 발생한다.
   - 이를 방지하기 위해 React의 `cache` 함수를 사용할 수 있다. `cache` 함수로 감싼 코드는 한 번 실행된 후 결과를 캐시에 저장하고, 동일한 입력에 대해서는 캐시된 결과를 반환한다.
   - 따라서 `verifySession` 함수를 `cache` 함수로 감싸면, 렌더링 과정에서 중복 호출되더라도 실제로는 한 번만 데이터베이스에 요청을 보내고, 이후에는 캐시된 결과를 사용하게 된다.
3. **데이터 요청 통합**:
   - `verifySession` 함수는 사용자의 세션을 확인하고 권한을 검사하는 중요한 역할을 한다.
   - 따라서 `verifySession` 함수를 호출하기 전에 필요한 데이터를 미리 가져오는 것이 좋다.
   - 예를 들어, 사용자 정보를 가져오는 `getUser` 함수에서 `verifySession` 을 호출하여 세션을 확인한 후 사용자 정보를 반환할 수 있다.
   - 이렇게 관련된 데이터 요청을 한 곳에서 처리하면 코드의 간결성과 유지보수성이 향상된다.
   - 추가로, JavaScript 클래스를 사용하여 관련 데이터 요청과 세션 검사를 캡슐화할 수도 있다.

:::

### 데이터 전송 객체(DTO) 사용 {#using-data-transfer-objects}

데이터를 검색할 때는 전체 객체가 아닌 애플리케이션에서 사용될 필요한 데이터만 반환하는 것이 좋다. 예를 들어, 사용자 데이터를 가져올 때 전체 사용자 객체(비밀번호, 전화번호 등이 포함될 수 있음)가 아닌 사용자의 ID와 이름만 반환할 수 있다.

그러나 반환되는 데이터 구조를 제어할 수 없거나 클라이언트에 노출해도 안전한 필드를 지정하는 것과 같은 전략을 사용하여 전체 객체가 클라이언트에 전달되는 것을 방지하려는 팀에서 작업하는 경우 다음과 같은 전략을 사용할 수 있다.

```ts
// app/lib/dto.ts
import 'server-only';
import { getUser } from '@/app/lib/dal';

function canSeeUsername(viewer: User) {
  return true;
}

function canSeePhoneNumber(viewer: User, team: string) {
  return viewer.isAdmin || team === viewer.team;
}

export async function getProfileDTO(slug: string) {
  const data = await db.query.users.findMany({
    where: eq(users.slug, slug),
    // 여기에 특정 열 반환
  });
  const user = data[0];

  const currentUser = await getUser(user.id);

  // 또는 쿼리에 특정한 내용만 여기에 반환
  return {
    username: canSeeUsername(currentUser) ? user.username : null,
    phonenumber: canSeePhoneNumber(currentUser, user.team)
      ? user.phonenumber
      : null,
  };
}
```

DAL에서 데이터 요청과 권한 부여 로직을 중앙 집중화하고 DTO를 사용하면 모든 데이터 요청이 안전하고 일관되게 처리되도록 할 수 있으며, 애플리케이션이 확장됨에 따라 유지 관리, 감사 및 디버깅이 더 쉬워진다.

:::tip

- DTO를 정의하는 방법에는 `toJSON()` 사용부터 위의 예제와 같은 개별 함수 또는 JS 클래스까지 몇 가지 다른 방법이 있다. 이러한 패턴은 React나 Next.js의 기능이 아니라 JavaScript 패턴이므로 애플리케이션에 가장 적합한 패턴을 찾기 위해 약간의 연구를 하는 것이 좋다.
- [Next.js의 보안 문서](https://nextjs.org/blog/security-nextjs-server-components-actions)에서 보안 모범 사례에 대해 자세히 알아볼 수 있다.
  :::

### 서버 컴포넌트 {#server-components}

[서버 컴포넌트](https://nextjs.org/docs/app/building-your-application/rendering/server-components) 의 인증 검사는 역할 기반 접근에 유용하다.

예를 들어, 사용자의 역할에 따라 조건부로 컴포넌트를 렌더링하는 경우:

```tsx
// app/dashboard/page.tsx
import { verifySession } from '@/app/lib/dal';

export default function Dashboard() {
  const session = await verifySession();
  const userRole = session?.user?.role; // 'role'이 세션 객체의 일부라고 가정

  if (userRole === 'admin') {
    return <AdminDashboard />;
  } else if (userRole === 'user') {
    return <UserDashboard />;
  } else {
    redirect('/login');
  }
}
```

위의 예제에서는 DAL의 `verifySession()` 함수를 사용하여 'admin', 'user' 및 인증되지 않은 역할을 확인한다. 이 패턴은 각 사용자가 해당 역할에 적합한 컴포넌트와만 상호 작용하도록 보장한다.

### 레이아웃과 인증 검사 {#layouts-and-auth-checks}

Next.js에서 레이아웃은 여러 페이지에서 공유되는 UI 컴포넌트다. 일반적으로 레이아웃은 내비게이션, 푸터 등 모든 페이지에 공통적으로 표시되는 요소를 포함한다. 그러나 Next.js의 부분 렌더링 기능으로 인해 레이아웃에서 인증 검사를 수행하는 것은 주의가 필요하다.

[부분 렌더링](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)은 Next.js에서 페이지 간 이동 시 변경된 부분만 다시 렌더링하는 기능이다. 이를 통해 페이지 전환이 빠르게 이루어진다. 그러나 이는 레이아웃이 페이지 이동 시 다시 렌더링되지 않는다는 것을 의미한다. 즉, 레이아웃에서 인증 검사를 수행하면 사용자가 페이지를 이동할 때마다 인증 상태가 검증되지 않는다.

이 문제를 해결하기 위해서는 인증 검사를 데이터 소스나 조건부로 렌더링되는 컴포넌트 근처에서 수행해야 한다. 데이터 소스는 일반적으로 데이터베이스나 API 호출을 통해 데이터를 가져오는 부분을 의미한다. 조건부로 렌더링되는 컴포넌트는 인증 상태에 따라 표시 여부가 결정되는 컴포넌트다.

예제에서 설명한 공유 레이아웃의 경우, 레이아웃에서 사용자 데이터를 가져오는 `getUser()` 함수를 호출한다. 이 함수는 데이터 접근 계층(DAL)에 정의되어 있다. DAL은 데이터베이스나 API와 상호작용하는 로직을 캡슐화한 계층이다.

레이아웃에서 `getUser()` 함수를 호출하여 사용자 데이터를 가져오지만, 인증 검사는 DAL 내부의 `getUser()` 함수에서 수행한다. 이 함수 내부에서는 `verifySession()` 함수를 호출하여 사용자의 세션이 유효한지 확인한다. 세션이 유효하지 않으면 `null` 을 반환하고, 유효한 경우에는 사용자 데이터를 반환한다.

이렇게 함으로써 애플리케이션 내에서 `getUser()` 함수가 호출되는 모든 곳에서 인증 검사가 수행된다. 개발자가 실수로 인증 검사를 빠뜨리는 것을 방지할 수 있다. 또한 레이아웃에서는 인증 검사를 직접 수행하지 않고, DAL에 위임함으로써 관심사의 분리(Separation of Concerns)를 달성할 수 있다.

이 패턴을 사용하면 인증 검사를 한 곳에서 관리할 수 있으며, 레이아웃과 페이지 컴포넌트에서는 인증 로직을 신경 쓰지 않아도 된다. 이는 코드의 유지보수성과 확장성을 높이는 데 도움이 된다.

```tsx
// app/layout.tsx
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    // ...
  )
}
```

```ts
// app/lib/dal.ts
export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  // 세션에서 사용자 ID를 가져와 데이터 가져오기
});
```

:::tip
SPA에서 일반적인 패턴은 사용자가 권한이 없는 경우 레이아웃이나 최상위 컴포넌트에서 null을 반환하는 것이다. 그러나 Next.js 애플리케이션에는 여러 진입점이 있으므로 중첩된 경로 세그먼트와 서버 액션에 접근하는 것을 막을 수 없기 때문에 이 패턴은 권장되지 않는다.
:::

### 서버 액션 {#server-actions}

서버 액션은 공개 API 엔드포인트와 동일한 보안 고려사항으로 취급하고, 사용자가 변경을 수행할 수 있는 권한이 있는지 확인해야 한다.

아래 예제에서는 액션을 진행하기 전에 사용자의 역할을 확인한다:

```ts
// app/lib/actions.ts
'use server';
import { verifySession } from '@/app/lib/dal';

export async function serverAction(formData: FormData) {
  const session = await verifySession();
  const userRole = session?.user?.role;

  // 사용자가 액션을 수행할 권한이 없는 경우 일찍 반환
  if (userRole !== 'admin') {
    return null;
  }

  // 권한이 있는 사용자에 대해 액션 진행
}
```

### 라우트 핸들러 {#route-handler}

[라우트 핸들러](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)는 공개 API 엔드포인트와 동일한 보안 고려사항으로 취급하고, 사용자가 라우트 핸들러에 접근할 수 있는 권한이 있는지 확인해야 한다.

예를 들면:

```ts
// app/api/route.ts
import { verifySession } from '@/app/lib/dal';

export async function GET() {
  // 사용자 인증 및 역할 확인
  const session = await verifySession();

  // 사용자가 인증되었는지 확인
  if (!session) {
    // 사용자가 인증되지 않음
    return new Response(null, { status: 401 });
  }

  // 사용자가 'admin' 역할을 가지고 있는지 확인
  if (session.user.role !== 'admin') {
    // 사용자는 인증되었지만 올바른 권한이 없음
    return new Response(null, { status: 403 });
  }

  // 권한이 있는 사용자에 대해 계속 진행
}
```

위의 예제는 두 단계의 보안 검사가 있는 라우트 핸들러를 보여준다. 먼저 활성 세션을 확인한 다음, 로그인한 사용자가 'admin'인지 확인한다.

## 컨텍스트 프로바이더 {#context-provider}

<!-- 인증에 컨텍스트 제공자를 사용하는 것은 인터리빙(interleaving) 때문에 작동합니다. 그러나 React 컨텍스트는 서버 컴포넌트에서 지원되지 않으므로 클라이언트 컴포넌트에만 적용할 수 있습니다.

이는 작동하지만, 모든 자식 서버 컴포넌트는 먼저 서버에서 렌더링되므로 컨텍스트 제공자의 세션 데이터에 접근할 수 없습니다: -->

React에서 컨텍스트는 컴포넌트 트리를 통해 데이터를 전달하는 메커니즘이다. 컨텍스트 제공자(Context Provider)는 컨텍스트를 생성하고 자식 컴포넌트에게 컨텍스트 값을 제공하는 역할을 한다. 인증 정보를 컨텍스트를 통해 전달하면 자식 컴포넌트에서 인증 상태에 접근할 수 있다.

Next.js에서는 서버 컴포넌트와 클라이언트 컴포넌트를 혼합하여 사용할 수 있다. 서버 컴포넌트는 서버 측에서 렌더링되며, 클라이언트 컴포넌트는 클라이언트 측에서 렌더링된다. 이 두 종류의 컴포넌트는 인터리빙(Interleaving)되어 함께 작동한다.

그러나 React 컨텍스트는 클라이언트 컴포넌트에서만 지원된다. 서버 컴포넌트에서는 컨텍스트를 사용할 수 없다. 이는 Next.js에서 컨텍스트 프로바이더를 사용할 때 주의해야 할 점이다.

컨텍스트 프로바이더를 루트 레이아웃에서 사용하면 자식 컴포넌트들이 컨텍스트 값에 접근할 수 있다. 하지만 자식 컴포넌트 중에 서버 컴포넌트가 있다면, 해당 서버 컴포넌트는 컨텍스트 제공자의 값에 접근할 수 없다. 서버 컴포넌트는 서버 측에서 먼저 렌더링되기 때문이다.

예를 들어, 루트 레이아웃에서 `ContextProvider` 를 사용하여 인증 정보를 제공한다고 가정해보자. 그리고 자식 컴포넌트 중 하나인 `Profile` 컴포넌트가 서버 컴포넌트라면, `Profile` 컴포넌트는 서버 측에서 렌더링될 때 컨텍스트 프로바이더의 인증 정보에 접근할 수 없다. 서버 컴포넌트는 클라이언트 측에서 사용되는 컨텍스트를 인식하지 못하기 때문이다.

이러한 제한 사항을 해결하기 위해서는 클라이언트 컴포넌트에서만 컨텍스트를 사용하고, 서버 컴포넌트에서는 다른 방법으로 인증 정보를 전달해야 한다. 예를 들어, 서버 컴포넌트에서는 `getUser()` 함수를 호출하여 직접 인증 정보를 가져오거나, props를 통해 인증 정보를 전달받을 수 있다.

```tsx
// app/layout.tsx
import { ContextProvider } from 'auth-lib';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
```

```tsx
// app/layout.tsx;
import { ContextProvider } from 'auth-lib';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
```

```tsx
"use client";

import { useSession } from "auth-lib";

export default function Profile() {
  const { userId } = useSession();
  const { data } = useSWR(`/api/user/${userId}`, fetcher)

  return (
    // ...
  );
}
```

또한 클라이언트 컴포넌트에서 세션 데이터가 필요한 경우, React의 [`taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue) API를 사용하여 민감한 세션 데이터가 클라이언트에 노출되지 않도록 해야 한다. `taintUniqueValue` 는 서버 측에서 생성된 고유한 값을 클라이언트 측으로 전달하는 역할을 한다. 이를 통해 클라이언트 컴포넌트에서는 세션 데이터를 직접 사용하지 않고, 안전한 방식으로 인증 상태를 확인할 수 있다.

컨텍스트 프로바이더를 사용할 때는 서버 컴포넌트와 클라이언트 컴포넌트의 차이를 고려하고, 적절한 방식으로 인증 정보를 전달해야 한다. 서버 컴포넌트에서는 직접 인증 정보를 가져오거나 props를 통해 전달받고, 클라이언트 컴포넌트에서는 컨텍스트와 taintUniqueValue를 사용하여 안전하게 인증 상태를 확인할 수 있다.
