---
title: 병렬 라우트
description:
date: 2024-03-04
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/parallel-routes',
    },
  ]
---

_병렬 라우트를 사용하면 동일한 레이아웃 내에서 하나 이상의 페이지를 동시에 또는 조건부로 렌더링할 수 있다._ 대시보드나 소셜 사이트의 피드와 같이 앱의 매우 동적인 섹션에 유용하다.

예를 들어 대시보드를 고려할 때 병렬 라우트를 사용하여 `team` 페이지와 `analytics` 페이지를 동시에 렌더링할 수 있다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-parallel-routes/1.png)

## 슬롯 {#slots}

병렬 라우트는 명명된 슬롯(slot)을 사용하여 만들어진다. 슬롯은 `@folder` 규칙으로 정의된다. 예를 들어, 다음 파일 구조는 두 개의 슬롯을 정의한다: `@analytics` 및 `@team`

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-parallel-routes/2.png)

슬롯은 공통 부모의 레이아웃에 프로퍼티로 전달된다. 위의 예제에서 `app/layout.js` 의 컴포넌트는 이제 `@analytics` 및 `@team` 슬롯 프로퍼티를 허용하며, `children` 프로퍼티와 함께 병렬로 렌더링할 수 있다:

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  );
}
```

그러나 슬롯은 라우트 세그먼트가 아니며 URL 구조에 영향을 미치지 않는다. 예를 들어, `/dashboard/@analytics/views` 의 경우 `@analytics` 가 슬롯이므로 URL은 `/dashboard/views` 가 된다.

:::tip
`children` 프로퍼티는 폴더에 매핑할 필요가 없는 암시적 슬롯이다. 즉, `app/page.js` 는 `app/@children/page.js` 와 동일하다.
:::

## 활성 상태와 네비게이션 {#active-state-and-navigation}

기본적으로 Next.js는 각 슬롯의 활성 상태(또는 하위 페이지)를 추적한다. 그러나 슬롯 내에서 렌더링되는 콘텐츠는 네비게이션 유형에 따라 달라진다:

| 네비게이션 유형                                                                                                | 설명                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [소프트 네비게이션](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-linking-and-navigating/#soft-navigation) | 클라이언트 사이드 네비게이션 중에 Next.js는 [부분 렌더링](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-linking-and-navigating/#partial-rendering)을 수행하여 슬롯 내의 하위 페이지를 변경하는 동시에 다른 슬롯의 활성 하위 페이지가 현재 URL과 일치하지 않더라도 이를 유지한다. |
| 하드 네비게이션                                                                                                | 전체 페이지 로드(브라우저 새로 고침) 후 Next.js는 현재 URL과 일치하지 않는 슬롯의 활성 상태를 확인할 수 없다. 대신 일치하지 않는 슬롯에 대해 `default.js` 파일을 렌더링하거나 `default.js` 가 존재하지 않는 경우 `404` 를 렌더링한다.                                                |

:::tip
일치하지 않는 경로에 대한 `404` 는 의도하지 않은 페이지에 실수로 병렬 라우트를 렌더링하는 것을 방지하는 데 도움이 된다.
:::

### default.js {#default-js}

초기 로드 또는 전체 페이지 리로드 중에 일치하지 않는 슬롯에 대한 폴백으로 렌더링할 `default.js` 파일을 정의할 수 있다.

다음 폴더 구조를 살펴보면 `@team` 슬롯에는 `/settings` 페이지가 있지만 `@analytics` 에는 없다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-parallel-routes/3.png)

`/dashboard/settings` 으로 이동할 때 `@team` 슬롯은 `@analytics` 슬롯의 현재 활성 페이지를 유지하면서 `/settings` 페이지를 렌더링한다.

새로 고침 시 Next.js는 `@analytics` 에 대한 `default.js` 를 렌더링한다. `default.js` 가 존재하지 않으면 `404` 가 대신 렌더링된다.

또한 `children` 은 암시적 슬롯이므로 Next.js가 상위 페이지의 활성 상태를 복구할 수 없는 경우 하위 항목에 대한 폴백을 렌더링하기 위해 `default.js` 파일도 만들어야 한다.

### useSelectedLayoutSegments(s) {#use-selected-layout-segments}

`useSelectedLayoutSegment` 와 `useSelectedLayoutSegments` 는 모두 슬롯 내에서 활성 경로 세그먼트를 읽을 수 있는 `parallelRoutesKey` 파라미터를 받는다.

```tsx
// app/layout.tsx
'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

export default function Layout({ auth }: { auth: React.ReactNode }) {
  const loginSegments = useSelectedLayoutSegment('auth');
  // ...
}
```

사용자가 `app/@auth/login`(또는 URL 표시줄의 `/login`)으로 이동하면 `loginSegments` 는 `"login"` 문자열과 동일하다.

## 예제 {#examples}

### 조건부 라우트 {#conditional-routes}

병렬 라우트를 사용하여 사용자 롤(role)과 같은 특정 조건에 따라 조건부로 라우트를 렌더링할 수 있다. 예를 들어 `/admin` 또는 `/user` 롤에 대해 다른 대시보드 페이지를 렌더링할 수 있다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-parallel-routes/4.png)

```tsx
// app/dashboard/layout.tsx
import { checkUserRole } from '@/lib/auth';

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const role = checkUserRole();
  return <>{role === 'admin' ? admin : user}</>;
}
```

### 탭 그룹 {#tab-groups}

슬롯 안에 `layout` 을 추가하여 사용자가 슬롯을 독립적으로 네비게이션할 수 있도록 할 수 있다. 이 기능은 탭을 만들 때 유용하다.

예를 들어 `@analytics` 슬롯에는 두 개의 하위 페이지가 있다: `/page-views` 및 `/visitors`.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-parallel-routes/5.png)

`@analytics` 내에서 `layout` 파일을 만들어 두 페이지 간에 탭을 공유한다:

```tsx
// app/dashboard/@analytics/layout.tsx
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/dashboard/page-views">Page Views</Link>
        <Link href="/dashboard/visitors">Visitors</Link>
      </nav>
      <div>{children}</div>
    </>
  );
}
```

### 모달 {#modals}

병렬 라우트를 [인터셉트 라우트](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)와 함께 사용하여 모달을 만들 수 있다. 이를 통해 모달을 만들 때 다음과 같은 일반적인 문제를 해결할 수 있다:

- URL을 통해 모달 콘텐츠를 공유할 수 있도록 만들기.
- 페이지를 새로 고칠 때 모달을 닫는 대신 컨텍스트를 유지한다.
- 뒤로 가기에서 이전 경로로 이동하지 않고 모달을 닫는다.
- 앞으로 가기에서 모달을 다시 열기.

사용자가 클라이언트 사이드 네비게이션을 사용하여 레이아웃에서 로그인 모달을 열거나 별도의 `/login` 페이지에 액세스할 수 있는 다음 UI 패턴을 고려해보자:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-parallel-routes/6.png)

이 패턴을 구현하려면 먼저 기본 로그인 페이지를 렌더링하는 `/login` 라우트를 생성한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-parallel-routes/7.png)

```tsx
// app/login/page.tsx
import { Login } from '@/app/ui/login';

export default function Page() {
  return <Login />;
}
```

그런 다음 `@auth` 슬롯에 `null` 을 반환하는 `default.js` 파일을 추가한다. 이렇게 하면 모달이 활성화되어 있지 않을 때 렌더링되지 않는다.

```tsx
// app/@auth/default.tsx
export default function Default() {
  return null;
}
```

`@auth` 슬롯 내에서 `/(.)login` 폴더를 업데이트하여 `/login` 경로를 인터셉트한다. `<Modal>` 컴포넌트와 그 하위 컴포넌트를 `/(.)login/page.tsx` 파일로 가져온다:

```tsx
// app/@auth/(.)login/page.tsx
import { Modal } from '@/app/ui/modal';
import { Login } from '@/app/ui/login';

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  );
}
```

:::tip

- 라우트를 인터셉트하는데 사용되는 규칙(예: `(.)` )은 파일 시스템 구조에 따라 다르다. 관련 내용은 [라우트 인터셉트 규칙](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes#convention)을 참조한다.
- `<Modal>` 기능을 모달 콘텐츠( `<Login>` )에서 분리하면 모달 내부의 모든 콘텐츠(예: 폼)가 서버 컴포넌트인지 확인할 수 있다. 자세한 내용은 [클라이언트 및 서버 컴포넌트 인터리빙](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props) 문서를 참조한다.

:::

#### 모달 열기 {#opening-the-modal}

이제 Next.js 라우터를 활용하여 모달을 열고 닫을 수 있다. 이렇게 하면 모달이 열려 있을 때와 앞뒤로 네비게이션할 때 URL이 올바르게 업데이트된다.

모달을 열려면 `@auth` 슬롯을 부모 레이아웃에 프로퍼티로 전달하고 `children` 프로퍼티와 함께 렌더링한다.

```tsx
// app/layout.tsx
import Link from 'next/link';

export default function Layout({
  auth,
  children,
}: {
  auth: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <nav>
        <Link href="/login">Open modal</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  );
}
```

사용자가 `<Link>` 를 클릭하면 `/login` 페이지로 이동하는 대신 모달이 열린다. 그러나 `/login` 경로로 새로 고침 또는 최초 로드 할 때는 기본 로그인 페이지로 이동한다.

#### 모달 닫기 {#closing-the-modal}

`router.back()` 을 호출하거나 `Link` 컴포넌트를 사용하여 모달을 닫을 수 있다.

```tsx
// app/ui/modal.tsx
'use client';

import { useRouter } from 'next/navigation';

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => {
          router.back();
        }}
      >
        Close modal
      </button>
      <div>{children}</div>
    </>
  );
}
```

`@auth` 슬롯을 더 이상 렌더링하지 않아야 하는 페이지에서 `Link` 컴포넌트를 사용하여 페이지를 떠날 때, `null` 을 반환하는 캐치-올 라우트를 사용한다.

```tsx
// app/ui/modal.tsx
import Link from 'next/link';

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link href="/">Close modal</Link>
      <div>{children}</div>
    </>
  );
}
```

```tsx
// app/@auth/[...catchAll]/page.tsx
export default function CatchAll() {
  return null;
}
```

:::tip

- 앞서 설명한 동작("활성 상태와 네비게이션") 때문에 모달을 닫을 때 `@auth` 슬롯에 캐시-올 라우트를 사용한다. 더 이상 슬롯과 일치하지 않는 라우트에 대한 클라이언트 측 네비게이션이 계속 표시되므로 모달을 닫으려면 슬롯을 `null` 을 반환하는 라우트와 일치시켜야 한다.
- 다른 예로는 갤러리에서 사진 모달을 열면서 전용 `/photo/[id]` 페이지도 함께 열거나 사이드 모달에서 쇼핑 카트를 여는 것 등이 있다.
- [링크](https://github.com/vercel/nextgram)에서 예시를 확인한다.

:::

다른 예로는 갤러리에서 사진 모달을 열면서 동시에 별도의 /photo/[id] 페이지를 가지고 있거나, 쇼핑 카트를 측면 모달에서 열 때가 있을 수 있습니다. Intercepted and Parallel Routes에서 모달의 예시를 확인하세요.

### 로딩 및 에러 UI {#loading-and-error-ui}

병렬 라우트를 독립적으로 스트리밍할 수 있으므로 각 라우트에 대해 독립적인 에러 및 로딩 상태를 정의할 수 있다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-parallel-routes/8.png)

자세한 내용은 [로딩 UI](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-loading-ui-and-streaming/) 및 [에러 핸들링 문서](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-error-handling/)를 참조한다.
