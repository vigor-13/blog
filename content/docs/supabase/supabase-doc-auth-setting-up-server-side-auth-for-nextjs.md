---
title: Next.js 서버 사이드 Auth 설정
description:
date: 2024-04-26
tags: [ssr, nextjs]
references:
  [
    {
      key: 'Supabase 공식 문서',
      value: 'https://supabase.com/docs/guides/auth/server-side/nextjs',
    },
  ]
---

Next.js에는 [App Router]() 와 [Pages Router]() 두 가지 버전이 있다. 둘 다 서버 사이드 Auth를 설정할 수 있다. 한 애플리케이션에서 두 가지 전략을 모두 사용할 수도 있다.

다만, 여기서는 App Router 전략만 다룬다.

## 1. Supabase 패키지 설치 {#install-supabase-packages}

`@supabase/supabase-js` 패키지와 헬퍼 `@supabase/ssr` 패키지를 설치한다.

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. 환경 변수 설정 {#set-up-environment-variables}

프로젝트 루트 디렉터리에 `.env.local` 파일을 생성한다.

`NEXT_PUBLIC_SUPABASE_URL` 과 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 를 입력한다:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

프로젝트의 URL과 Anon Key는 Supabase 대시보드의 프로젝트 설정에서 확인할 수 있다.

## 3. Supabase 클라이언트를 생성할 유틸리티 함수 작성 {#write-utility-functions-to-create-supabase-clients}

Next.js 앱에서 Supabase에 접근하려면 2가지 유형의 Supabase 클라이언트가 필요하다:

1. **클라이언트 컴포넌트 클라이언트** - 브라우저에서 실행되는 클라이언트 컴포넌트에서 Supabase에 접근하기 위함이다.
2. **서버 컴포넌트 클라이언트** - 서버에서만 실행되는 서버 컴포넌트, 서버 액션 및 라우트 핸들러에서 Supabase에 접근하기 위함이다.

`utils/supabase` 폴더를 만들고 각 클라이언트 유형별로 파일을 생성한다. 그런 다음 각 클라이언트 유형에 대한 유틸리티 함수를 복사한다.

:::note `cookies` 객체는 어떤 기능을 할까?

`cookies` 객체는 Supabase 클라이언트가 쿠키에 접근할 수 있도록 해주는 역할을 한다. 이를 통해 클라이언트는 사용자 세션 데이터를 쿠키에서 읽고 쓸 수 있다. 세션 데이터는 일반적으로 인증 토큰이나 사용자 ID 등을 포함한다.

`@supabase/ssr` 패키지는 프레임워크에 종속되지 않도록 설계되었다. 이를 위해 쿠키 처리 메서드가 하드코딩되어 있지 않다. 대신, 개발자가 직접 프레임워크에 맞는 쿠키 처리 메서드를 제공해야 한다. 이것이 바로 유틸리티 함수가 하는 역할이다.

유틸리티 함수는 `@supabase/ssr` 의 쿠키 처리를 Next.js에 맞게 구현한다. 예를 들어, `cookies` 객체에는 다음과 같은 메서드가 있다:

- `get` - 쿠키에서 값을 읽는다.
- `set` - 쿠키에 값을 쓴다.
- `remove` - 쿠키를 삭제한다.

Next.js에서는 보안상의 이유로 서버 컴포넌트에서 직접 쿠키를 설정할 수 없다. 그래서 서버 클라이언트에서 `set` 및 `remove` 메서드에서 쿠키를 설정하려고 하면 Next.js에서 오류가 발생한다.

하지만 이 오류는 무시해도 된다. 왜냐하면 다음 단계에서 미들웨어를 설정하여 새로 고친 쿠키를 스토리지에 작성하기 때문이다. 미들웨어는 Next.js 앱의 모든 요청에 대해 실행되므로, 여기에서 쿠키를 설정하면 된다.

구체적으로 설명하면, 다음과 같은 과정을 거친다:

1. 서버 컴포넌트에서 Supabase 클라이언트를 사용하여 인증 작업을 수행한다(로그인, 로그아웃 등).
2. 인증 작업 후에는 Supabase 세션이 업데이트된다.
3. 서버 컴포넌트에서는 `cookies.set` 메서드를 호출하여 새로운 세션 데이터로 쿠키를 설정하려고 한다.
4. 하지만 Next.js에서는 서버 컴포넌트에서 직접 쿠키를 설정할 수 없으므로 오류가 발생한다.
5. 이 오류는 무시된다. 왜냐하면 다음에 설정할 미들웨어에서 새로운 쿠키를 적절히 설정할 것이기 때문이다.
6. 미들웨어는 요청 핸들러에서 실행되므로 여기에서 새로운 세션 데이터로 쿠키를 설정할 수 있다.

따라서 서버 컴포넌트에서 발생하는 쿠키 설정 오류는 무시해도 된다. 왜냐하면 미들웨어에서 새로운 세션 데이터로 쿠키를 올바르게 설정할 것이기 때문이다. 이렇게 함으로써 Next.js의 보안 모델을 준수하면서도 Supabase 인증을 적절히 처리할 수 있다.

기본적으로 Supabase는 `sb-<project_ref>-auth-token` 이라는 이름의 쿠키를 사용하여 인증 토큰을 저장한다. 여기서 `<project_ref>` 는 Supabase 프로젝트의 참조 ID다.

이렇게 `cookies` 객체와 유틸리티 함수를 사용하면 Supabase 클라이언트가 Next.js 환경에서 쿠키에 접근하여 사용자 세션을 관리할 수 있다.
:::

:::note 모든 라우트마다 클라이언트를 생성해야 할까?

**서버 측 라우트**

서버 측 라우트에서는 매 요청마다 새로운 Supabase 클라이언트를 생성해야 한다. 그 이유는 다음과 같다:

- 각 요청에는 고유한 쿠키가 포함되어 있다. 이 쿠키에는 사용자 세션 정보가 저장되어 있다.
- Supabase 클라이언트는 이 쿠키를 읽어 사용자를 인증하고 데이터에 접근할 수 있는 권한을 부여한다.
- 따라서 각 요청마다 새로운 클라이언트를 생성하여 해당 요청의 쿠키를 사용해야 한다.
- 만약 동일한 클라이언트를 재사용한다면, 잘못된 쿠키 정보를 사용하여 인증 문제가 발생할 수 있다.

**클라이언트 측 컴포넌트**

클라이언트 측 컴포넌트에서는 한 번만 Supabase 클라이언트를 생성하면 된다. 그 이유는 다음과 같다:

- 클라이언트 측에서는 브라우저 환경에서 실행되므로 요청 간에 쿠키 정보가 공유된다.
- `createBrowserClient` 함수는 싱글톤 패턴을 사용하여 단일 인스턴스를 생성하고 재사용한다.
- 따라서 여러 번 호출되더라도 동일한 클라이언트 인스턴스를 반환하므로 매번 새로운 인스턴스를 생성할 필요가 없다.

요약하면, 서버 측에서는 매 요청마다 고유한 쿠키 정보를 사용해야 하므로 새로운 클라이언트를 생성해야 한다. 반면 클라이언트 측에서는 브라우저 환경에서 실행되므로 단일 인스턴스를 재사용할 수 있다. 이렇게 함으로써 불필요한 자원 낭비를 방지하면서도 올바른 인증 처리를 보장할 수 있다.

:::

:::tabs

@tab:active utils/supabase/client.ts#client

```ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

@tab utils/supabase/server.ts#server

```ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
```

:::

## 4. 미들웨어 설정 {#hook-up-middleware}

프로젝트 루트에 `middleware.ts` 파일을 생성한다.

서버 컴포넌트에서는 쿠키를 작성할 수 없으므로, 만료된 인증 토큰을 새로 고치고 저장하기 위해 미들웨어가 필요하다.

미들웨어는 다음 역할을 한다:

1. 인증 토큰 새로고침 (리프레시 토큰 기능 내장)
   - 미들웨어는 `supabase.auth.getUser()` 를 호출하여 사용자의 인증 토큰을 새로고칩니다.
   - 토큰이 만료되었거나 유효하지 않은 경우, Supabase는 새로운 토큰을 발급한다.
   - 이를 통해 사용자가 항상 유효한 토큰을 가지고 있음을 보장할 수 있다.
2. 서버 컴포넌트에 새로고친 토큰 전달
   - 미들웨어는 request.cookies.set()을 사용하여 새로고친 인증 토큰을 쿠키에 저장합니다.
   - 이후 서버 컴포넌트에서 이 쿠키를 읽어 사용자 세션 정보에 접근할 수 있습니다.
   - 이렇게 함으로써 서버 컴포넌트에서 중복으로 토큰을 새로고치는 작업을 방지할 수 있습니다.
3. 브라우저에 새로고친 토큰 전달
   - 미들웨어는 response.cookies.set()을 사용하여 새로고친 인증 토큰을 브라우저에 전달합니다.
   - 이를 통해 브라우저에 저장된 이전 토큰을 새로운 유효한 토큰으로 대체할 수 있다.
   - 클라이언트 측에서도 항상 유효한 토큰을 사용하여 인증 문제를 방지할 수 있다.

:::note 리프레시 토큰
Supabase는 기본적으로 리프레시 토큰 메커니즘을 내장하고 있기 때문에 별도의 설정이 필요하지 않다.

Supabase 인증 시스템에서는 처음 로그인할 때 액세스 토큰과 리프레시 토큰이 자동으로 발급된다. 액세스 토큰은 짧은 유효기간을 가지고 있지만, 리프레시 토큰은 상대적으로 긴 유효기간을 가진다.

`supabase.auth.getUser()` 메서드를 호출하면 Supabase가 내부적으로 다음 작업을 수행한다:

- 제공된 액세스 토큰을 검증한다.
- 액세스 토큰이 만료된 경우, 저장된 리프레시 토큰을 사용하여 새로운 액세스 토큰과 리프레시 토큰 쌍을 발급받는다.
- 새로 발급받은 토큰으로 사용자 데이터를 반환한다.

즉, 개발자가 리프레시 토큰 로직을 직접 구현할 필요가 없다. Supabase 클라이언트 라이브러리가 내부적으로 리프레시 토큰 메커니즘을 처리해주기 때문이다.
따라서 단순히 `supabase.auth.getUser()` 를 호출하면 Supabase가 자동으로 액세스 토큰을 새로고치고 유효한 사용자 데이터를 반환해준다.

:::

미들웨어는 모든 요청에 대해 실행되므로, Supabase에 접근하지 않는 라우트에 대해서는 불필요한 작업이 된다. 따라서 [matcher](https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths)를 추가하여 Supabase에 접근하는 라우트에 대해서만 미들웨어가 실행되도록 설정할 수 있다.

:::warning
서버는 쿠키에서 사용자 세션 정보를 가져온다. 하지만 쿠키는 누구나 스푸핑할 수 있다. 따라서 페이지와 사용자 데이터를 보호하려면 항상 `supabase.auth.getUser()` 를 사용해야 한다. `getUser()` 는 Supabase 인증 서버에 직접 요청을 보내 토큰을 재검증하므로 안전하다. 반면 `getSession()` 은 토큰을 재검증하지 않으므로 서버 코드 내에서 신뢰할 수 없다.
:::

:::tabs

@tab:active middleware.ts#middleware

```ts
import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

@tab utils/supabase/middleware.ts#utils-middleware

```ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    },
  );

  await supabase.auth.getUser();

  return response;
}
```

:::

## 5. 로그인 페이지 생성 {#create-a-login-page}

앱에 로그인 페이지를 만든다. 서버 액션을 사용하여 Supabase 회원가입 함수를 호출한다.

Supabase가 액션에서 호출되므로 `@/utils/supabase/server.ts` 에 정의된 클라이언트를 사용한다.

:::important
Next.js에서는 기본적으로 데이터 요청을 캐싱하여 성능을 개선한다. 하지만 인증된 데이터의 경우에는 캐싱을 해서는 안 된다. 왜냐하면 각 사용자마다 접근 권한이 다르기 때문이다. 사용자 A의 데이터를 사용자 B가 볼 수 있게 되면 보안 문제가 발생한다.

이를 해결하기 위해 `cookies` 객체를 사용하여 fetch 요청을 Next.js 캐싱에서 제외시킨다. 구체적인 과정은 다음과 같다:

1. `cookies` 객체는 요청 헤더에 쿠키 정보를 추가한다.
2. Next.js는 캐싱 키를 생성할 때 요청 헤더도 고려한다.
3. 따라서 쿠키 정보가 다른 요청은 서로 다른 캐싱 키를 가지게 된다.
4. 이렇게 되면 각 사용자의 요청이 별도로 캐싱되어, 다른 사용자의 데이터에 접근할 수 없게 된다.

이 방식을 사용하면 Next.js가 여전히 정적 데이터는 캐싱하지만, 인증된 동적 데이터는 캐싱하지 않게 된다.

데이터 캐싱에서 제외하는 방법에 대한 자세한 내용은 [Next.js 문서](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching)를 참고한다.
:::

:::tabs

@tab:active app/login/page.tsx#login-page

```tsx
import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  );
}
```

@tab app/login/actions.ts#login-action

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
```

@tab app/error/page.tsx#error

```tsx
export default function ErrorPage() {
  return <p>Sorry, something went wrong</p>;
}
```

:::

## 6. 인증 확인 경로 변경 {#change-the-auth-confirmation-path}

이메일 확인이 활성화되어 있다면(기본값), 새 사용자는 회원가입 후 확인 메일을 받게 된다.

서버 사이드 인증 플로우를 지원하도록 이메일 템플릿을 변경한다.

대시보드의 [Auth 템플릿](https://supabase.com/dashboard/project/_/auth/templates) 페이지로 이동한다. `Confirm signup` 템플릿에서 `{ { .ConfirmationURL } }`을 `{ { .SiteURL } }/auth/confirm?token_hash={ { .TokenHash } }&type=signup`로 변경한다.

## 7. 인증 확인을 위한 라우트 핸들러 생성 {#create-a-route-handler-for-auth-confirmation}

`auth/confirm` 에 대한 라우트 핸들러를 생성한다. 사용자가 확인 이메일 링크를 클릭하면 secure code를 인증 토큰으로 교환한다.

라우터 핸들러이므로 `@/utils/supabase/server.ts` 에서 Supabase 클라이언트를 사용한다.

```ts
// app/auth/confirm/route.ts
import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      redirectTo.searchParams.delete('next');
      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/error';
  return NextResponse.redirect(redirectTo);
}
```

## 8. 서버 컴포넌트에서 사용자 정보 접근 {#access-user-info-from-server-component}

서버 컴포넌트는 쿠키를 읽을 수 있으므로 인증 상태와 사용자 정보를 가져올 수 있다.

서버 컴포넌트에서 Supabase를 호출하므로 `@/utils/supabase/server.ts` 에서 생성한 클라이언트를 사용한다.

로그인한 사용자만 접근할 수 있는 `private` 페이지를 만든다. 이 페이지에는 사용자의 이메일이 표시된다.

:::warning
서버는 쿠키에서 사용자 세션 정보를 가져온다. 하지만 쿠키는 누구나 스푸핑할 수 있다. 따라서 페이지와 사용자 데이터를 보호하려면 항상 `supabase.auth.getUser()` 를 사용해야 한다. `getUser()` 는 Supabase 인증 서버에 직접 요청을 보내 토큰을 재검증하므로 안전하다. 반면 `getSession()` 은 토큰을 재검증하지 않으므로 서버 코드 내에서 신뢰할 수 없다.
:::

```tsx
// app/private/page.tsx
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  return <p>Hello {data.user.email}</p>;
}
```
