---
title: 링크 & 네비게이션
description:
date: 2024-02-02
modified: 2024-03-27
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating',
    },
  ]
---

Next.js에서 라우트를 네비게이션하는 네 가지 방법이 있다:

- `<Link>` 컴포넌트 사용하기
- `useRouter` Hook 사용하기 (클라이언트 컴포넌트)
- `redirect` 함수 사용하기 (서버 컴포넌트)
- 네이티브 History API 사용하기

이러한 각 옵션을 사용하는 방법을 살펴보고 네비게이션이 작동하는 방식에 대해 자세히 알아본다.

## \<Link> 컴포넌트 {#link-component}

`<Link>` 는 HTML `<a>` 태그를 확장하여 라우트 prefetch 및 클라이언트 사이드 네비게이션을 제공하는 빌트인 컴포넌트다. Next.js에서 라우트를 네비게이션하는 기본적이고 권장되는 방법이다.

`next/link` 에서 import하여 컴포넌트에 `href` props를 전달하면 사용할 수 있다:

```tsx
// app/page.tsx
import Link from 'next/link';

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>;
}
```

`<Link>` 에 대한 자세한 내용은 [API 레퍼런스](https://nextjs.org/docs/app/api-reference/components/link)를 참조한다.

### 예제 {#examples}

#### 동적 세그먼트 링크 {#linking-to-dynamic-segments}

동적 세그먼트에 링크할 때 [템플릿 리터럴 & 인터폴레이션](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals)을 사용하여 링크 리스트를 생성할 수 있다. 예를 들어 다음과 같이 블로그 글 목록을 생성할 수 있다:

```tsx
// app/blog/PostList.js

import Link from 'next/link';

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

#### 활성 링크 확인하기 {#checking-active-links}

`usePathname()` 을 사용하여 링크가 활성 상태인지 확인할 수 있다. 예를 들어 활성 링크에 클래스를 추가하기 위해 현재 `pathname` 이 링크의 `href` 와 일치하는지 확인할 수 있다:

```tsx
// app/components/links.tsx

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Links() {
  const pathname = usePathname();

  return (
    <nav>
      <ul>
        <li>
          <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === '/about' ? 'active' : ''}`}
            href="/about"
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
```

#### id로 스크롤링하기 {#scrolling-to-an-id}

Next.js 앱 라우터는 기본적으로 라우트를 이동할 때 새 라우트의 상단으로 스크롤 하거나 "뒤로 가기" 및 "앞으로 가기" 할 때 스크롤 위치를 유지한다.

특정 `id` 로 스크롤하려면 URL에 `#` 해시 링크를 추가하거나 `href` props에 해시 링크를 전달하면 된다. 이는 `<Link>` 가 `<a>` 태그로 렌더링되기에 가능하다.

```tsx
<Link href="/dashboard#settings">Settings</Link>

// Output
<a href="/dashboard#settings">Settings</a>
```

#### 스크롤 복원 비활성화하기 {#disabling-scroll-restoration}

Next.js 앱 라우터는 기본적으로 라우트를 이동할 때 새 라우트의 상단으로 스크롤 하거나 "뒤로 가기" 및 "앞으로 가기" 할 때 스크롤 위치를 유지한다.

이를 비활성화하려면 `<Link>` 컴포넌트에 `scroll={false}` 를 전달하거나, `router.push()` 또는 `router.replace()` 에 `scroll: false` 를 전달하면 된다.

```tsx
// next/link

<Link href="/dashboard" scroll={false}>
  Dashboard
</Link>
```

```tsx
// useRouter

import { useRouter } from 'next/navigation';

const router = useRouter();

router.push('/dashboard', { scroll: false });
```

## useRouter() Hook {#userouter-hook}

`useRouter` 훅을 사용하면 클라이언트 컴포넌트에서 프로그래밍 방식으로 라우트를 변경할 수 있다.

```tsx
// app/page.js

'use client';

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  );
}
```

`useRouter` 의 자세한 사용법은 [API 레퍼런스](https://nextjs.org/docs/app/api-reference/functions/use-router)를 참조한다.

:::tip
`useRouter` 를 사용해야하는 특별한 이유가 있는것이 아니라면 되도록 `<Link>` 컴포넌트를 사용한다.
:::

## redirect 함수 {#redirect-function}

Server Component의 경우 대신 `redirect` 함수를 사용할 수 있다.

```tsx
// app/team/[id]/page.tsx

import { redirect } from 'next/navigation'

async function fetchTeam(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }: : { params: { id: string }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    redirect('/login')
  }

  // ...
}
```

:::tip

- `redirect` 는 기본적으로 307(Temporary Redirect) 상태 코드를 반환한다. 서버 액션에서 사용하면 303(See Other)을 반환하며, 이는 일반적으로 POST 요청의 결과로 성공 페이지로 리디렉션하는 데 사용된다.
- `redirect` 는 내부적으로 에러를 발생시키므로 `try/catch` 블록 외부에서 호출해야 한다.
- `redirect` 는 클라이언트 컴포넌트의 렌더링 프로세스 중에 호출할 수 있지만 이벤트 핸들러에서는 호출할 수 없다. 대신 `useRouter` 훅을 사용한다.
- `redirect` 는 absolute URL도 허용하며 외부 링크로 리디렉션하는 데 사용할 수 있다.
- 렌더링 프로세스 전에 리디렉션하려면 `next.config.js` 또는 미들웨어를 사용한다.

:::

`redirect` 의 자세한 사용법은 [API 레퍼런스](https://nextjs.org/docs/app/api-reference/functions/redirect)를 참조한다.

## 네이티브 History API 사용하기 {#using-the-native-history-api}

Next.js를 사용하면 `window.history.pushState` 및 `window.history.replaceState` 메서드를 사용하여 페이지를 다시 로드하지 않고도 브라우저의 히스토리 스택을 업데이트할 수 있다.

`pushState` 및 `replaceState` 는 Next.js 라우터에 통합되어 `usePathname` 이름 및 `useSearchParams` 와 동기화할 수 있다.

### window.history.pushState {#window-history-pushstate}

`window.history.pushState` 를 사용하여 브라우저의 히스토리 스택에 새 항목을 추가할 수 있다. 사용자는 이전 상태로 돌아갈 수 있다. 예를 들어 다음과 같이 목록 정렬에 사용할 수 있다:

```tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function SortProducts() {
  const searchParams = useSearchParams();

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortOrder);
    window.history.pushState(null, '', `?${params.toString()}`);
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  );
}
```

### window.history.replaceState {#window-history-replacestate}

브라우저의 히스토리 스택에서 현재 항목을 바꾸려면 `window.history.replaceState` 를 사용한다. 사용자는 이전 상태로 돌아갈 수 없다. 예를 들어 애플리케이션의 [locale](https://www.44bits.io/ko/keyword/locale)을 전환할 수 있다:

```tsx
'use client';

import { usePathname } from 'next/navigation';

export function LocaleSwitcher() {
  const pathname = usePathname();

  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`;
    window.history.replaceState(null, '', newPath);
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  );
}
```

## 라우팅과 네비게이션 작동 원리 {#how-routing-and-navigation-works}

앱 라우터는 라우팅과 네비게이션에 하이브리드 방식을 사용한다. 서버에서는 애플리케이션 코드가 라우트 세그먼트별로 자동으로 code split 된다. 그리고 클라이언트에서는 Next.js가 라우트 세그먼트를 prefetch 하고 캐시한다. 즉, 사용자가 새 라우트로 이동할 때 브라우저가 페이지를 새로고침하지 않고 변경된 라우트 세그먼트만 다시 렌더링하여 네비게이션 환경과 성능을 개선한다.

### 1. Code Splitting {#code-splitting}

Code Split을 사용하면 애플리케이션 코드를 더 작은 번들로 분할하여 브라우저에서 다운로드하고 실행할 수 있다. 이렇게 하면 각 요청에 대해 전송되는 데이터의 양과 실행 시간이 줄어들어 성능이 향상된다.

Server Component는 애플리케이션 코드를 라우트 세그먼트별로 자동으로 코드 분할한다. 즉, 현재 라우트에 필요한 코드만 내비게이션에 로드된다.

### 2. Prefetching {#prefetching}

Prefetch는 사용자가 라우트에 방문하기 전에 백그라운드에서 라우트를 미리 로드하는 방법이다.

Next.js에서 라우트를 Prefetch 하는 방법에는 두 가지가 있다:

| 방법                | 설명                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<Link>`            | 라우트는 사용자의 뷰포트에 표시될 때 자동으로 Prefetch 된다. Prefetch는 페이지가 처음 로드될 때 또는 스크롤을 통해 페이지가 시야에 들어올 때 발생한다. |
| `router.prefetch()` | `useRouter` 훅은 프로그래밍 방식으로 경로를 Prefetch 하는 데 사용할 수 있다.                                                                           |

정적 라우트와 동적 라우트의 경우 `<Link>` 의 Prefetch 동작이 다르다:

| 라우트      | 설명                                                                                                                                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 정적 라우트 | `prefetch` 기본값은 `true` 다. 전체 라우트가 Prefetch 되고 캐시된다.                                                                                                                                                                     |
| 동적 라우트 | `prefetch` 기본값은 `auto` 다. 렌더링된 "트리"에서 공유 레이아웃까지만 Prefetch 되며 30초 동안 캐시된다. 이로써 전체 동적 라우트를 가져오는 비용이 감소하고 사용자에게 더 나은 시각적 피드백을 위해 즉각적인 로딩 상태를 표시할 수 있다. |

`prefetch` 프로퍼티를 `false` 로 설정하여 비활성화할 수 있다.

더 자세한 내용은 `<Link>` [API 레퍼런스](https://nextjs.org/docs/app/api-reference/components/link)를 참조한다.

:::tip
Prefetch는 개발 환경에서는 활성화되지 않으며 프로덕션 환경에서만 활성화된다.
:::

### 3. 캐싱 {#caching}

Next.js에는 **라우터 캐시**라는 인메모리 클라이언트 사이드 캐시가 있다. 사용자가 앱을 네비게이션할 때 _Prefetch한 라우트 세그먼트_ 와 *방문한 라우트의 서버 컴포넌트 페이로드*가 캐시에 저장된다.

즉, 네비게이션 시 서버에 새로운 요청을 하는 대신 캐시를 최대한 재사용하여 전송되는 요청과 데이터의 수를 줄여 성능을 개선한다.

라우터 캐시의 작동 방식과 구성 방법에 대해 [문서](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#caching-data)를 참조한다.

### 4. 부분 렌더링 {#partial-rendering}

부분 렌더링은 내비게이션에서 변경된 라우트 세그먼트만 클라이언트에서 다시 렌더링되고 공유 세그먼트은 그대로 유지되는 것을 의미한다.

예를 들어, 두 개의 형제 경로인 `/dashboard/settings` 과 `/dashboard/analytics` 사이를 네비게이션하는 경우 `settings` 및 `analytics` 페이지가 렌더링되고 공유 `dashboard` 레이아웃은 유지된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-linking-and-navigation/1.png)

부분 렌더링이 없으면 네비게이션할 때마다 클라이언트에서 전체 페이지가 다시 렌더링된다. 변경되는 부분만 렌더링하면 전송되는 데이터의 양과 실행 시간이 줄어들어 성능이 향상된다.

### 5. 소프트 네비게이션 {#soft-navigation}

브라우저는 페이지 사이를 이동할 때 '하드 네비게이션'을 수행한다. Next.js 앱 라우터는 페이지 간 "소프트 네비게이션"을 활성화하여 변경된 라우트 세그먼트만 다시 렌더링(부분 렌더링)하도록 한다. 이를 통해 네비게이션 중에 클라이언트 React 상태를 유지할 수 있다.

### 6. 뒤로 가기 & 앞으로 가기 {#back-and-forward-navigation}

기본적으로 Next.js는 "뒤로 가기" 및 "앞으로 가기" 를 할 때 스크롤 위치를 유지하며 "라우터 캐시"에서 라우트 세그먼트를 재사용한다.

### 7. pages/ 와 app/ 간의 라우팅 {#routing-between-pages-and-app}

`pages/` 에서 `app/` 으로 점진적으로 마이그레이션할 때 Next.js 라우터는 둘 사이의 하드 네비게이션을 자동으로 처리한다. `pages/` 에서 `app/` 으로의 전환을 감지하기 위해 클라이언트 라우터 필터가 있는데, 이 필터는 때때로 오탐을 발생시킬 수 있다. 기본적으로 오탐 가능성을 0.01%로 설정하기 때문에 이러한 경우는 매우 드물게 발생한다. 이 가능성은 `next.config.js` 의 `experimental.clientRouterFilterAllowedRate` 옵션을 통해 사용자 지정할 수 있다. 오탐률을 낮추면 클라이언트 번들에서 생성되는 필터의 크기가 커진다는 점에 유의해야 한다.

또는 이 처리를 완전히 비활성화하고 `pages/` 와 `app/` 간의 라우팅을 수동으로 관리하려면 `next.config.js` 에서 `experimental.clientRouterFilter` 를 `false` 로 설정하면 된다. 이 기능이 비활성화되면 앱 라우트와 겹치는 페이지의 모든 동적 라우트는 기본적으로 제대로 네비게이션되지 않는다.
