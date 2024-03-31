---
title: 페이지와 레이아웃
description:
date: 2024-02-02
modified: 2024-03-26
tags: [route, page, layout, root_layout]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts',
    },
  ]
---

Next.js 13 버전의 앱 라우터에는 페이지, 공유 레이아웃 및 템플릿을 쉽게 만들 수 있는 새로운 파일 규칙이 도입되었다. 여기서는 Next.js 에서 이러한 특수 파일을 사용하는 방법을 알아본다.

## 페이지 {#pages}

**페이지는 라우트의 고유한 UI다.** `page.js` 파일에서 컴포넌트를 export하여 정의할 수 있다. 중첩 폴더를 사용하여 경로를 정의하고 `page.js` 파일을 사용하여 라우트에 공개적으로 액세스할 수 있다.

`app` 디렉토리에 `page.js` 파일을 추가하여 첫 번째 페이지를 만든다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-pages-and-layouts/1.png)

```tsx
// app/page.tsx => '/' URL
export default function Page() {
  return <h1>Hello, Home page!</h1>;
}
```

```tsx
// app/dashboard/page.tsx => 'app/dashboard/page.tsx' URL
export default function Page() {
  return <h1>Hello, Dashboard Page!</h1>;
}
```

:::tip

- 페이지는 언제나 라우트 서브트리의 리프다.
- `.js` , `.jsx` , `.tsx` 확장자만 사용할 수 있다.
- 라우트 세그먼트에 공개적으로 접근하기 위해선 `page.js` 파일이 필요하다.
- 페이지는 기본적으로 Server Component이지만 Client Component로 전환할 수 있다.
- 페이지는 데이터를 fetch 할 수 있다.

:::

## 레이아웃 {#layouts}

**레이아웃은 여러 페이지에서 공유되는 UI다.** 이동 시 레이아웃은 상태를 보존하고 상호 작용이 유지되며 리렌더링되지 않는다. 또한 레이아웃을 중첩할 수도 있다.

레이아웃은 일반적으로 `layout.js` 파일에서 컴포넌트를 `default` 로 export 하여 정의할 수 있다. 레이아웃 컴포넌트는 `children` props를 받아야 한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-pages-and-layouts/2.png)

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children, // 페이지 또는 중첩 레이아웃이다.
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* 헤더 또는 사이드바 등 공유 UI는 여기에. */}
      <nav></nav>

      {children}
    </section>
  );
}
```

:::tip

- 가장 위에 있는 레이아웃을 **루트 레이아웃**이라고 한다. 이 필수 레이아웃은 애플리케이션의 모든 페이지에서 공유된다. **루트 레이아웃에는 `html` 및 `body` 태그가 포함되어야 한다.**
- 모든 라우트 세그먼트는 선택적으로 자체 레이아웃을 정의할 수 있다. 이러한 레이아웃은 해당 세그먼트의 모든 페이지에서 공유된다.
- 라우트의 레이아웃은 기본적으로 중첩된다. 각 부모 레이아웃은 React `children` props를 사용하여 그 아래의 자식 레이아웃을 래핑한다.
- 공유 레이아웃에서 특정 라우트 세그먼트를 선택적으로 포함하거나 제외하려면 **라우트 그룹**을 사용한다.
- **기본적으로 레이아웃은 Server Component 이지만 Client Component 로 전환할 수 있다.**
- **레이아웃은 데이터를 fetch 할 수 있다.**
- **부모 레이아웃과 그 자식 간에 데이터를 전달하는 것은 불가능하다. 그러나 라우트에서 동일한 데이터를 여러 번 fetch 할 수 있으며 React는 자동으로 중복된 요청을 제거하기 때문에 성능에 영향을 미치지 않는다.**
- 레이아웃은 하위 라우트 세그먼트에 액세스할 수 없다. 모든 라우트 세그먼트에 액세스하려면 클라이언트 컴포넌트에서 `useSelectedLayoutSegment` 또는 `useSelectedLayoutSegments` 를 사용한다.
- `.js` , `.jsx` , `.tsx` 확장자만 사용할 수 있다.
- `layout.js` 및 `page.js` 파일을 동일한 폴더에 정의할 수 있다. **레이아웃은 페이지를 래핑한다.**

:::

### 루트 레이아웃 (필수) {#root-layout}

루트 레이아웃은 `app` 디렉토리의 최상위 레벨에 정의되며 모든 라우트에 적용된다. 이 레이아웃을 사용하면 서버에서 리턴하는 초기 HTML을 수정할 수 있다.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

:::tip

- `app` 디렉토리에는 반드시 루트 레이아웃을 포함해야 한다.
- 루트 레이아웃은 `<html>` 및 `<body>` 태그를 포함해야 한다. Next.js는 이를 자동으로 생성하지 않는다.
- [빌트인 SEO 지원](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)을 사용하여 `<head>` 엘리먼트를 관리할 수 있다. 예를 들어 `<title>` 엘리먼트를 관리할 수 있다.
- 라우트 그룹을 사용하여 여러 루트 레이아웃을 생성할 수 있다.

:::

### 중첩 레이아웃 {#nesting-layouts}

폴더 내에 정의된 레이아웃(예: `app/dashboard/layout.js` )은 특정 라우트 세그먼트(예: `acme.com/dashboard` )에 적용되며 해당 세그먼트가 활성화될 때 렌더링된다. 파일 계층 구조에서 레이아웃은 기본적으로 중첩되어 있어 자식 레이아웃을 `children` props를 통해 래핑한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-pages-and-layouts/3.png)

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
```

:::tip
**루트 레이아웃에만 `<html>` 및 `<body>` 태그를 포함할 수 있다.**
:::

위의 두 레이아웃을 결합한다면, 루트 레이아웃( `app/layout.js` )은 대시보드 레이아웃( `app/dashboard/layout.js` )을 래핑하게 되며, 대시보드 레이아웃은 `app/dashboard/*` 내의 라우트 세그먼트를 래핑한다.

이 두 레이아웃은 다음과 같이 중첩된다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-pages-and-layouts/4.png)

라우트 그룹을 사용하여 특정 라우트 세그먼트를 레이아웃에 포함하거나 제외할 수 있다.

## 템플릿 {#templates}

템플릿은 자식 레이아웃이나 페이지를 래핑한다는 점에서 레이아웃과 유사하다. 레이아웃은 라우트 간에 지속되고 상태를 유지하는 반면, 템플릿은 내비게이션시 각각의 자식에 대해 새로운 인스턴스를 생성한다. **사용자가 템플릿을 공유하는 라우트간에 이동할 때마다 컴포넌트의 새로운 인스턴스가 마운트되고 DOM 요소가 다시 생성되며 상태가 유지되지 않으며 Effect가 다시 동기화된다.**

특정 동작이 필요한 경우, 레이아웃보다는 템플릿이 더 적합한 옵션이 될 수 있다. 예를 들어:

- `useEffect` (예: 페이지 조회수) 와 `useState` (예: 페이지별 피드백 폼)에 의존하는 기능들.
- 기본 프레임워크 동작을 변경해야 하는 경우. 예를 들어, 레이아웃 내의 서스펜스 바운더리는 레이아웃이 처음 로드될 때만 폴백 내용을 표시하고 페이지 전환 시에는 표시하지 않는다. 반면에 템플릿의 경우 각 내비게이션 시에 폴백이 표시된다.

템플릿은 `template.js` 파일에서 `default` 로 컴포넌트를 export하여 정의할 수 있다. 이 컴포넌트는 `children` props를 받는다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-pages-and-layouts/5.png)

```tsx
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

중첩의 관점에서 `template.js` 는 레이아웃과 그 자식 사이에 렌더링된다.

```tsx
<Layout>
  {/* 템플릿에는 고유 키가 부여된다. */}
  <Template key={routeParam}>{children}</Template>
</Layout>
```

## \<head> 수정하기 {#modifying-head}

`app` 디렉토리에서 내장된 SEO 지원을 사용하여 `title` 및 `meta` 와 같은 `<head>` HTML 엘리먼트를 수정할 수 있다.

메타데이터는 `layout.js` 또는 `page.js` 파일에서 `metadata` 객체를 export 하거나 `generateMetadata` 함수를 사용하여 정의할 수 있다.

```tsx
// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js',
};

export default function Page() {
  return '...';
}
```

:::tip
**루트 레이아웃에 수동으로 `<title>` 및 `<meta>` 와 같은 `<head>` 태그를 추가해서는 안 된다.** 대신 Metadata API를 사용해야 한다. Metadata API는 `<head>` 엘리먼트를 스트리밍하고 중복을 처리하는 등의 고급 요구 사항을 자동으로 처리한다.
:::
