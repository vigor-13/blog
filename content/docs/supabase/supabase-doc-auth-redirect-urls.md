---
title: Redirect URL
description: Supabase Auth에서 리디렉션 URL을 설정하는 방법을 알아본다.
date: 2024-04-26
tags: [auth, redirect_url]
references:
  [
    {
      key: 'Supabase 공식 문서',
      value: 'https://supabase.com/docs/guides/auth/concepts/redirect-urls',
    },
  ]
---

## 개요 {#overview}

Supabase의 클라이언트 라이브러리는 [비밀번호 없는 로그인](https://supabase.com/docs/reference/javascript/auth-signinwithotp)이나 [써드파티 프로바이더](https://supabase.com/docs/reference/javascript/auth-signinwithoauth#sign-in-using-a-third-party-provider-with-redirect)를 사용할 때 사용자 인증 후 리디렉션 URL을 지정할 수 있는 `redirectTo` 매개변수를 제공한다. 이를 통해 인증 후 사용자를 원하는 페이지로 유연하게 이동시킬 수 있다.

`redirectTo` 매개변수 사용 방법은 다음과 같다:

1. 프로젝트 설정에서 `SITE_URL` 을 기본 리디렉션 URL로 지정한다. 이는 `redirectTo` 가 명시되지 않았을 때 사용자가 리디렉션되는 기본 URL이다.
2. 필요한 경우 프로젝트 설정에서 `ADDITIONAL_REDIRECT_URLS` 에 [허용된 리디렉션 URL 목록](https://supabase.com/dashboard/project/_/auth/url-configuration)을 추가한다. 이는 보안상의 이유로 임의의 URL로 리디렉션되는 것을 방지하기 위함이다.
3. 클라이언트 라이브러리 메서드(예: `signIn()`, `signInWithOAuth()` 등)를 호출할 때 `redirectTo` 매개변수에 사용자를 리디렉션하고자 하는 URL을 지정한다. 이 URL은 `SITE_URL` 이나 `ADDITIONAL_REDIRECT_URLS` 에 명시된 URL 중 하나여야 한다.

예를 들어, 다음과 같이 `signIn()` 메서드를 호출할 때 `redirectTo` 를 지정할 수 있다:

```ts
const { user, error } = await supabase.auth.signIn(
  {
    email: 'example@email.com',
    password: 'password',
  },
  {
    redirectTo: 'https://example.com/welcome',
  },
);
```

이렇게 하면 사용자가 성공적으로 로그인한 후 `https://example.com/welcome` 페이지로 리디렉션된다.

`redirectTo` 를 사용하면 인증 플로우를 더욱 유연하게 제어할 수 있다. 예를 들어 로그인 후 사용자를 특정 대시보드 페이지로 보내거나, 로그인 전에 접속했던 페이지로 다시 돌려보낼 수 있다.

## 리디렉션 URL에 와일드카드 사용하기 {#use-wildcards-in-redirect-urls}

Supabase는 [허용 목록](https://supabase.com/dashboard/project/_/auth/url-configuration)에 리디렉션 URL을 추가할 때 와일드카드를 지정할 수 있다. 와일드카드 매치 패턴을 사용하여 Netlify 및 Vercel과 같은 공급자의 미리보기 URL을 지원할 수 있다.

| 와일드카드               | 설명                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `*`                      | 분리된 문자가 아닌 문자의 모든 시퀀스와 일치한다.                                                                    |
| `**`                     | 모든 문자 시퀀스(분리 문자 포함)와 일치한다.                                                                         |
| `?`                      | 분리 문자가 아닌 단일 문자와 일치한다.                                                                               |
| `c`                      | 문자 c와 일치한다 (c != `*`, `**`, `?`, `\`, `[`, `{`, `}` ).                                                        |
| `\c`                     | 문자 c와 일치한다.                                                                                                   |
| `[!{ character-range }]` | `{ character-range }` 에 없는 모든 문자 시퀀스와 일치한다. 예를 들어, `[!a-z]` 는 a-z 범위의 문자와 일치하지 않는다. |

URL에서 분리 문자는 `.` 과 `/` 로 정의된다. 패턴을 테스트하려면 이 [도구](https://www.digitalocean.com/community/tools/glob?comments=true&glob=http%3A%2F%2Flocalhost%3A3000%2F%2A%2A&matches=false&tests=http%3A%2F%2Flocalhost%3A3000&tests=http%3A%2F%2Flocalhost%3A3000%2F&tests=http%3A%2F%2Flocalhost%3A3000%2F%3Ftest%3Dtest&tests=http%3A%2F%2Flocalhost%3A3000%2Ftest-test%3Ftest%3Dtest&tests=http%3A%2F%2Flocalhost%3A3000%2Ftest%2Ftest%3Ftest%3Dtest)를 사용한다.

:::note 권장 사항
"globstar" (`**`)는 로컬 개발 및 미리보기 URL에 유용하지만, 프로덕션에서는 사이트 URL에 정확한 리디렉션 URL 경로를 설정하는 것이 좋다.
:::

### 와일드카드를 사용한 리디렉션 URL 예시 {#redirect-url-example-with-wildcards}

| 리디렉션 URL                     | 설명                                                                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `http://localhost:3000/*`        | `http://localhost:3000/foo`, `http://localhost:3000/bar`와 일치하지만 `http://localhost:3000/foo/bar` 또는 `http://localhost:3000/foo/`(후행 슬래시 참고)와는 일치하지 않는다. |
| `http://localhost:3000/**`       | `http://localhost:3000/foo`, `http://localhost:3000/bar`, `http://localhost:3000/foo/bar` 와 일치한다.                                                                         |
| `http://localhost:3000/?`        | `http://localhost:3000/a` 와 일치하지만 `http://localhost:3000/foo` 와는 일치하지 않는다.                                                                                      |
| `http://localhost:3000/\[!a-z\]` | `http://localhost:3000/1` 과 일치하지만 `http://localhost:3000/a` 와는 일치하지 않는다.                                                                                        |

## Netlify 미리보기 URL {#netlify-preview-urls}

Netlify로 배포하는 경우 `SITE_URL` 을 공식 사이트 URL로 설정한다. 로컬 개발 및 배포 미리보기를 위해 다음 추가 리디렉션 URL을 추가한다:

- `http://localhost:3000/**`
- `https://**--my_org.netlify.app/**`

## Vercel 미리보기 URL {#vercel-preview-urls}

Vercel로 배포하는 경우 `SITE_URL` 을 공식 사이트 URL로 설정한다. 로컬 개발 및 배포 미리보기를 위해 다음 추가 리디렉션 URL을 추가한다:

- `http://localhost:3000/**`
- `https://*-username.vercel.app/**`

Vercel은 배포 환경에 따라 자동으로 설정되는 환경 변수인 `NEXT_PUBLIC_VERCEL_URL` 을 제공한다. 이 변수는 현재 배포의 URL을 가리키며, 다음과 같이 사용할 수 있다:

1. 개발 환경에서는 `http://localhost:3000` 과 같은 로컬 개발 서버 URL이 된다.
2. 프리뷰 배포 환경(예: Pull Request를 통한 배포)에서는 `https://<project-name>-<branch-name>.<vercel-domain>` 와 같은 형식의 URL이 된다.
3. 프로덕션 환경에서는 `https://<your-domain>` 과 같이 실제 사이트의 URL이 된다.

이 변수를 사용하면 현재 배포 환경에 맞는 URL을 동적으로 사용할 수 있다. 예를 들어, OAuth 인증 후 리디렉션할 때 `redirectTo` 매개변수에 `NEXT_PUBLIC_VERCEL_URL` 을 사용하면 각 환경에 맞는 URL로 자동으로 리디렉션된다.

```js
const { user, error } = await supabase.auth.signIn(
  {
    provider: 'google',
  },
  {
    redirectTo: `${process.env.NEXT_PUBLIC_VERCEL_URL}/dashboard`,
  },
);
```

위 코드에서는 Google OAuth 로그인 후 `/dashboard` 경로로 리디렉션한다. 이때 `NEXT_PUBLIC_VERCEL_URL` 을 사용하므로 현재 배포 환경에 맞는 URL로 자동 리디렉션된다.

한편, `NEXT_PUBLIC_SITE_URL` 은 사용자가 직접 설정해야 하는 환경 변수다. 이 변수는 프로덕션 환경에서의 사이트 URL을 명시적으로 지정하는 데 사용된다. Vercel에서 프로젝트 설정의 Environment Variables에 이 변수를 추가하고 프로덕션 URL 값을 설정해야 한다.

`NEXT_PUBLIC_SITE_URL` 을 설정하면 프로덕션 배포에서 `NEXT_PUBLIC_VERCEL_URL` 대신 이 값을 사용할 수 있다. 이는 사용자가 직접 도메인을 설정하는 경우 등에 유용하다.

```js
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

// 프로덕션에서는 NEXT_PUBLIC_SITE_URL을,
// 개발 및 프리뷰 환경에서는 NEXT_PUBLIC_VERCEL_URL을 사용한다.
const redirectUrl = `${siteUrl}/dashboard`;
```

위와 같이 `NEXT_PUBLIC_SITE_URL` 과 `NEXT_PUBLIC_VERCEL_URL`을 함께 사용하면 모든 배포 환경에서 올바른 URL을 사용할 수 있다.

```ts
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // 프로덕션 환경에서 사이트 URL로 설정한다.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Vercel에 의해 자동으로 설정된다.
    'http://localhost:3000/';
  // localhost가 아닐 때 `https://`를 포함해야 한다.
  url = url.includes('http') ? url : `https://${url}`;
  // 마지막에 `/`를 포함해야 한다.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: getURL(),
  },
});
```

## redirectTo를 사용할 때의 이메일 템플릿 {#email-templates-when-using-redirectTo}

`redirectTo` 옵션을 사용할 때는 이메일 템플릿에서 `{ { .SiteURL } }` 을 `{ { .RedirectTo } }` 로 바꿔야 할 수 있다. 자세한 내용은 [이메일 템플릿 가이드](https://supabase.com/docs/guides/auth/auth-email-templates)를 참조한다.

예를 들어, 다음과 같이 변경한다:

```html
{% raw %}
<!-- 기존 -->
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup"
  >메일 확인</a
>

<!-- 새로운 -->
<a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup"
  >메일 확인</a
>
{% endraw %}
```

## 모바일 딥 링킹 URI {#mobild-deep-linking-urls}

<!-- 모바일 애플리케이션의 경우 딥 링킹 URI를 사용할 수 있다. 예를 들어, `SITE_URL` 에 `com.supabase://login-callback/` 과 같은 것을 지정하고, 필요한 경우 추가 리디렉션 URL에 `com.supabase.staging://login-callback/`과 같은 것을 지정할 수 있다. -->

모바일 애플리케이션에서는 웹과는 다른 방식으로 딥 링킹(Deep Linking)을 사용하여 인증 후 리디렉션을 처리할 수 있다. 딥 링킹은 모바일 앱의 특정 화면이나 기능으로 직접 이동할 수 있는 URI 체계를 의미한다.

Supabase 인증을 사용하는 모바일 앱에서 딥 링킹을 활용하는 방법은 다음과 같다:

1. 앱의 딥 링킹 URI 체계를 정의한다. 예를 들어, `com.supabase://` 와 같은 형식을 사용할 수 있다. 이 URI 체계는 앱에서 고유해야 하며, 다른 앱과 충돌하지 않도록 해야 한다.
2. Supabase 프로젝트 설정에서 `SITE_URL` 에 딥 링킹 URI를 지정한다. 예를 들어, `com.supabase://login-callback/` 과 같이 설정할 수 있다. 이렇게 하면 인증 후 앱의 특정 화면으로 리디렉션할 수 있다.
3. 필요한 경우 `ADDITIONAL_REDIRECT_URLS` 에도 딥 링킹 URI를 추가한다. 예를 들어, 스테이징 환경용 앱에서는 `com.supabase.staging://login-callback/` 과 같은 URI를 추가할 수 있다.
4. 앱에서 딥 링킹을 처리하는 코드를 작성한다. 딥 링크를 받으면 해당 URI를 파싱하여 적절한 화면으로 이동하는 로직을 구현해야 한다.

예를 들어, iOS 앱에서는 `AppDelegate` 의 `application(_:open:options:)` 메서드에서 딥 링크를 처리할 수 있다:

```swift
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    if url.scheme == "com.supabase" {
        if url.host == "login-callback" {
            // 로그인 콜백 처리
            // 필요한 화면으로 이동
        }
        return true
    }
    return false
}
```

Android 앱에서는 `AndroidManifest.xml` 에 딥 링크를 처리할 `Activity` 를 등록하고, 해당 `Activity` 에서 `Intent` 를 처리하여 딥 링크를 처리할 수 있다.

모바일 앱에서 딥 링킹을 사용하면 인증 후 사용자 경험을 향상시킬 수 있다. 웹 브라우저를 통한 리디렉션 대신 앱 내에서 직접 필요한 화면으로 이동할 수 있기 때문이다. 또한 딥 링킹을 활용하여 푸시 알림이나 이메일 등에서 앱의 특정 화면으로 직접 연결할 수도 있다.

딥 링킹에 대해 자세히 알아보고 다양한 프레임워크에 대한 코드 예제는 [여기](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)를 참조한다.

## 에러 처리 {#error-handling}

인증 과정에서 오류가 발생하면 Supabase는 사용자를 지정된 리디렉션 URL로 리디렉션한다. 그러나 이 경우에는 오류에 대한 세부 정보를 URL의 쿼리 매개변수로 전달한다. 이를 통해 프론트엔드에서 오류를 처리하고 사용자에게 적절한 메시지를 표시할 수 있다.

예를 들어, 인증에 실패한 경우 다음과 같은 URL로 리디렉션될 수 있다:

```text
https://example.com/auth/callback?error=access_denied&error_description=User+denied+access
```

위 URL에서 `error` 와 `error_description` 쿼리 매개변수가 오류 정보를 담고 있다.

- `error` : 오류 코드를 나타내는 짧은 문자열이다. 예를 들어, `access_denied` 는 사용자가 액세스를 거부했음을 의미한다.
- `error_description` : 오류에 대한 자세한 설명을 제공하는 사람이 읽을 수 있는 메시지다.

프론트엔드에서는 이러한 쿼리 매개변수를 파싱하여 오류를 처리할 수 있다.

```javascript
const params = new URLSearchParams(window.location.hash.slice());

if (params.get('error_code').startsWith('4')) {
  // 오류가 4xx 오류인 경우 오류 메시지 표시
  window.alert(params.get('error_description'));
}
```

예를 들어, Next.js에서는 다음과 같이 `useRouter` 훅을 사용하여 쿼리 매개변수에 접근할 수 있다:

```jsx
import { useRouter } from 'next/router';

const AuthCallback = () => {
  const router = useRouter();
  const { error, error_description } = router.query;

  if (error) {
    // 오류 처리 로직
    switch (error) {
      case 'access_denied':
        // 액세스 거부 오류 처리
        break;
      // 다른 오류 케이스 처리
      default:
      // 기본 오류 처리
    }

    return <div>Error: {error_description}</div>;
  }

  // 인증 성공 시 처리 로직
  return <div>Authentication successful!</div>;
};

export default AuthCallback;
```

위 코드에서는 `router.query` 를 사용하여 `error` 와 `error_description` 값을 추출한다. 그리고 `error` 가 존재하는 경우 오류 처리 로직을 수행한다. 오류 코드에 따라 다른 처리를 할 수 있으며, `error_description` 을 사용하여 사용자에게 표시할 오류 메시지를 생성할 수 있다.

이렇게 쿼리 매개변수를 활용하면 인증 오류를 프론트엔드에서 적절히 처리하고 사용자에게 알맞은 피드백을 제공할 수 있다. 이는 사용자 경험을 향상시키고 오류 상황에 대한 이해를 돕는 데 도움이 된다.
