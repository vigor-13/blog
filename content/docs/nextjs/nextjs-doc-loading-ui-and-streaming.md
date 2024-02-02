---
title: 로딩 UI & 스트리밍
description:
date: 2024-02-02
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming',
    },
  ]
---

특수 파일 `loading.js` 는 React 서스펜스로 의미 있는 로딩 UI를 만드는 데 도움이 된다. 이 규칙을 사용하면 라우트 세그먼트의 콘텐츠가 로드되는 동안 서버에서 인스턴트 로딩 상태를 표시할 수 있다. 렌더링이 완료되면 새 콘텐츠가 자동으로 교체된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-loading-ui-and-streaming/1.png)

## 인스턴트 로딩 상태 {#instant-loading-states}

인스턴트 로딩 상태는 네비게이션 시 즉시 표시되는 폴백 UI다. 스켈레톤, 스피너와 같은 로딩 표시기를 미리 렌더링하거나 표지 사진, 제목 등과 같이 작지만 의미 있는 부분을 향후 화면에 표시할 수 있다. 이를 통해 사용자가 앱이 응답하고 있음을 이해하고 더 나은 사용자 경험을 제공할 수 있다.

폴더 안에 `loading.js` 파일을 추가하여 로딩 상태를 만든다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-loading-ui-and-streaming/2.png)

```tsx
// app/dashboard/laoding.tsx

export default function Loading() {
  // 스켈레톤을 포함하여 모든 UI를 추가할 수 있다.
  return <LoadingSkeleton />;
}
```

같은 폴더에서 `loading.js` 는 `layout.js` 안에 중첩된다. `page.js` 파일과 그 아래의 모든 하위 파일은 자동으로 `<Suspense>` 바운더리로 래핑된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-loading-ui-and-streaming/3.png)

:::tip

- 서버 중심 라우팅을 사용하더라도 내비게이션이 즉시 실행된다.
- 라우트 네비게이션이 중단되지 않으므로 다른 라우트로 이동하기 전에 콘텐츠가 완전히 로드될 때까지 기다릴 필요가 없다.
- 새 라우트 세그먼트가 로드되는 동안 공유 레이아웃은 대화형 상태를 유지한다.

:::

:::tip
Next.js가 이 기능을 최적화하므로 라우트 세그먼트(레이아웃 및 페이지)에 대해 `loading.js` 를 사용하는 것이 좋다.
:::

## 서스펜스 스트리밍 {#streaming-with-suspense}

`loading.js` 외에도 자체 UI 컴포넌트에 대한 서스펜스 바운더리를 수동으로 생성할 수도 있다. 앱 라우터는 Node.js 및 Edge 런타임 모두에 대해 [서스펜스](https://www.vigorously.xyz/docs/react/react-doc-reference-suspense/) 스트리밍을 지원한다.

### 스트리밍이란? {#what-is-streaming}

React 와 Next.js에서 스트리밍이 어떻게 작동하는지 알아보려면 서버 사이드 렌더링(SSR)과 그 한계를 이해해야 한다.

SSR을 사용하면 사용자가 페이지를 보고 상호 작용하기 전에 완료해야 하는 일련의 단계가 있다:

1. 먼저 지정된 페이지의 모든 데이터를 서버에서 가져온다.
2. 그런 다음 서버에서 해당 페이지의 HTML을 렌더링한다.
3. 페이지의 HTML, CSS 및 JavaScript가 클라이언트로 전송된다.
4. 생성된 HTML과 CSS를 사용해 비대화형 사용자 인터페이스가 렌더링 된다.
5. 마지막으로 React는 사용자 인터페이스에 [하이드레이션](https://www.vigorously.xyz/docs/react/react-doc-reference-react-dom-hydrateroot/)하여 대화형 인터페이스로 만든다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-loading-ui-and-streaming/4.png)

이러한 단계는 순차적으로 진행되므로 서버는 모든 데이터를 가져온 후에야 페이지의 HTML을 렌더링할 수 있다. 그리고 클라이언트에서는 페이지의 모든 컴포넌트에 대한 코드가 다운로드된 후에만 React가 UI에 하이드레이션할 수 있다.

React 및 Next.js를 사용한 SSR은 사용자에게 가능한 한 빨리 비대화형 페이지를 표시하여 체감 로딩 성능을 개선하는 데 도움이 된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-loading-ui-and-streaming/5.png)

그러나 페이지가 사용자에게 표시되기 전에 서버에서 모든 데이터 페치를 완료해야 하므로 여전히 속도가 느릴 수 있다.

_스트리밍을 사용하면 페이지의 HTML을 더 작은 청크로 분할하여 서버에서 클라이언트로 점진적으로 전송할 수 있다._

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-loading-ui-and-streaming/6.png)

이렇게 하면 UI를 렌더링하기 전에 모든 데이터가 로드될 때까지 기다릴 필요 없이 페이지의 일부를 더 빨리 표시할 수 있다.

_스트리밍은 각 컴포넌트를 하나의 청크로 간주할 수 있기 때문에 React의 컴포넌트 모델에서 잘 작동한다._ 우선순위가 높거나(예: 제품 정보) 데이터에 의존하지 않는 컴포넌트(예: 레이아웃)를 먼저 전송할 수 있으며, React는 더 일찍 하이드레이션을 시작할 수 있다. 우선순위가 낮은 컴포넌트(예: 리뷰, 관련 제품)는 데이터를 가져온 후 동일한 서버 요청으로 페치할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-loading-ui-and-streaming/7.png)

스트리밍은 긴 데이터 요청으로 인해 페이지 렌더링이 차단되는 것을 방지할 때 특히 유용하다. 스트리밍은 [TTFB(Time To First Byte)](https://web.dev/ttfb/)와 [FCP(First Contentful Paint)](https://web.dev/first-contentful-paint/)를 줄일 수 있기 때문이다. 또한 특히 느린 디바이스에서 [Time to Interactive(TTI)](https://developer.chrome.com/en/docs/lighthouse/performance/interactive/)를 개선하는 데 도움이 된다.

### 예제 {#example}

`<Suspense>` 는 비동기 액션(예: 데이터 불러오기)을 수행하는 컴포넌트를 래핑하고, 액션이 진행되는 동안 대체 UI(예: 스켈레톤, 스피너)를 표시한 다음, 액션이 완료되면 컴포넌트를 교체하는 방식으로 작동한다.

```tsx
// app/dashboard/page.tsx

import { Suspense } from 'react';
import { PostFeed, Weather } from './Components';

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  );
}
```

서스펜스를 사용하면 다음과 같은 이점을 누릴 수 있다:

1. **스트리밍 서버 렌더링** - 서버에서 클라이언트로 HTML을 점진적으로 렌더링한다.
2. **선택적 하이드레이션** - React는 사용자 상호작용에 따라 어떤 컴포넌트를 먼저 인터랙티브하게 만들지 우선순위를 정한다.

더 많은 서스펜스 예시와 사용 사례는 관련 [문서](https://www.vigorously.xyz/docs/react/react-doc-reference-suspense/)를 참조한다.

### SEO {#seo}

- Next.js는 `generateMetadata` 내부의 데이터 페치가 완료될 때까지 기다렸다가 UI를 클라이언트로 스트리밍한다. 이렇게 하면 스트리밍된 응답의 첫 부분에 `<head>` 태그가 포함되도록 보장된다.
- 스트리밍은 서버에서 렌더링되므로 SEO에 영향을 미치지 않는다. Google의 [Mobile Friendly Test](https://search.google.com/test/mobile-friendly) 도구를 사용하여 페이지가 Google의 웹 크롤러에 어떻게 표시되는지 확인하고 직렬화된 HTML(소스)을 볼 수 있다.

### 상태 코드 {#status-codes}

스트리밍 시 요청이 성공했음을 알리는 `200` 상태 코드가 반환된다.

서버는 `redirect` 또는 `notFound` 와 같이 스트리밍된 콘텐츠 자체 내에서 오류를 클라이언트에 전달할 수 있다. 응답 헤더가 이미 클라이언트에 전송되었으므로 응답의 상태 코드는 업데이트할 수 없다. 이는 SEO에 영향을 미치지 않는다.
