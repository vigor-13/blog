---
title: 서버 컴포넌트
description:
date: 2024-03-25
tags: ['rendering', 'server_component']
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components',
    },
  ]
---

React Server Components를 사용하면 UI를 서버에서 렌더링하고 선택적으로 캐시할 수 있다. Next.js에서는 렌더링 작업을 추가적으로 라우트 세그먼트별로 분할하여 스트리밍과 부분 렌더링이 가능하며, 세 가지 다른 서버 렌더링 전략이 있다:

- 정적 렌더링 (Static Rendering)
- 동적 렌더링 (Dynamic Rendering)
- 스트리밍 (Streaming)

이 페이지에서는 Server Components가 어떻게 작동하는지, 언제 사용하는 것이 좋은지, 그리고 다양한 서버 렌더링 전략에 대해 살펴본다.

## 서버 렌더링의 이점 {#benefits-of-server-rendering}

서버에서 렌더링 작업을 수행하는 것에는 다음과 같은 몇 가지 이점이 있다:

- **데이터 fetch**: Server Components를 사용하면 데이터 fetch를 서버로 옮겨 데이터 소스에 더 가깝게 할 수 있다. 이를 통해 렌더링에 필요한 데이터를 fetch하는 데 걸리는 시간과 클라이언트가 요청해야 하는 횟수를 줄임으로써 성능을 향상시킬 수 있다.

- **보안**: Server Components를 사용하면 토큰이나 API 키와 같은 민감한 데이터와 로직을 클라이언트에 노출할 위험 없이 서버에 보관할 수 있다.

- **캐싱**: 서버에서 렌더링함으로써 결과를 캐시하고 후속 요청 및 사용자 간에 재사용할 수 있다. 이를 통해 각 요청마다 수행되는 렌더링 및 데이터 fetch의 양을 줄여 성능을 향상시키고 비용을 절감할 수 있다.

- **성능**: Server Components는 성능을 최적화할 수 있는 추가 도구를 제공한다. 예를 들어, 전적으로 Client Components로 구성된 앱에서 시작하는 경우, UI의 비대화형 부분을 Server Components로 전환하면 필요한 클라이언트 측 JavaScript의 양을 줄일 수 있다. 이는 브라우저가 다운로드, 구문 분석 및 실행해야 하는 클라이언트 측 JavaScript가 적어지므로 인터넷 속도가 느리거나 성능이 낮은 기기를 사용하는 사용자에게 유리하다.

- **초기 페이지 로드 및 [First Contentful Paint (FCP)](https://web.dev/fcp/)**: 서버에서는 클라이언트가 페이지 렌더링에 필요한 JavaScript를 다운로드, 구문 분석 및 실행하기를 기다리지 않고도 사용자가 즉시 페이지를 볼 수 있도록 HTML을 생성할 수 있다.

- **검색 엔진 최적화 및 소셜 네트워크 공유 가능성**: 렌더링된 HTML은 검색 엔진 봇이 페이지를 인덱싱하고 소셜 네트워크 봇이 페이지에 대한 소셜 카드 미리보기를 생성하는 데 사용될 수 있다.

- **스트리밍**: Server Components를 사용하면 렌더링 작업을 청크로 분할하고 준비되는 대로 클라이언트로 스트리밍할 수 있다. 이를 통해 사용자는 전체 페이지가 서버에서 렌더링될 때까지 기다리지 않고도 페이지의 일부를 더 빨리 볼 수 있다.

## Next.js에서 Server Components 사용하기 {#using-server-components-in-nextjs}

Next.js는 기본적으로 Server Components를 사용한다. 이를 통해 추가 구성 없이 서버 렌더링을 자동으로 구현할 수 있으며, 필요한 경우 Client Components를 선택적으로 사용할 수 있다. Client Components에 대한 자세한 내용은 [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components) 문서를 참조한다.

## 서버 컴포넌트는 어떻게 렌더링될까? {#how-are-server-components-rendered}

Next.js는 렌더링을 조율하기 위해 React의 API를 사용한다. 렌더링 작업은 개별 라우트 세그먼트와 [Suspense Boundary](https://react.dev/reference/react/Suspense)에 의해 청크로 분할된다.

먼저 서버에서 각 청크는 두 단계로 렌더링 된다:

1. React는 Server Components를 **React Server Component Payload (RSC Payload)** 라는 특수한 데이터 형식으로 렌더링한다.
2. Next.js는 RSC Payload와 Client Component JavaScript 명령을 사용하여 서버에서 **HTML**을 렌더링한다.

:::note

- Next.js는 React의 `renderToPipeableStream` 또는 `renderToReadableStream` API를 사용하여 Server Components를 렌더링한다.
- 각 라우트 세그먼트와 Suspense Boundary는 개별적인 청크로 분할된다.
- 각 청크는 두 단계로 렌더링된다:
  - React는 Server Components를 React Server Component Payload (RSC Payload)라는 특수한 데이터 형식으로 렌더링한다. **RSC Payload는 Server Components의 렌더링 결과를 나타내는 중간 표현이다.**
  - Next.js는 RSC Payload와 Client Component에 대한 JavaScript 명령을 사용하여 서버에서 HTML을 생성한다. 이 과정에서 RSC Payload는 HTML로 변환되고, Client Component에 필요한 JavaScript 코드도 함께 생성된다.
- 생성된 HTML과 RSC Payload, 그리고 Client Component에 대한 JavaScript 코드는 클라이언트로 전송된다.

:::

그런 다음 클라이언트에서:

1. HTML은 초기 페이지 로드에만 사용되며, 빠르게 비대화형 미리보기를 보여주는 데 사용된다.
2. React Server Components Payload는 Client 및 Server Component 트리를 조정하고 DOM을 업데이트하는 데 사용된다.
3. JavaScript 명령은 Client Components를 하이드레이션하고 애플리케이션을 대화형으로 만드는 데 사용된다.

:::note

- 초기 페이지 로드 시, 서버에서 생성된 HTML이 즉시 사용자에게 표시된다. 이를 통해 사용자는 대화형이 아닌 빠른 미리보기를 볼 수 있다.
- React는 RSC Payload를 사용하여 클라이언트에서 Server Components를 재구성하고, Client Components와 함께 전체 컴포넌트 트리를 구성한다. 이 과정에서 서버에서 렌더링된 내용과 클라이언트에서 렌더링될 내용을 일치시킨다.
- 클라이언트에서 JavaScript 코드를 실행하여 Client Components를 하이드레이션한다. 하이드레이션 과정에서 이벤트 핸들러 등의 인터랙티브한 기능이 연결되어 애플리케이션이 완전히 대화형으로 동작할 수 있게 된다.

:::

:::tip React Server Component Payload (RSC)란 무엇인가?
RSC Payload는 렌더링된 React Server Components 트리의 컴팩트한 바이너리 표현이다. 클라이언트에서 React가 브라우저의 DOM을 업데이트하는 데 사용된다. RSC Payload에는 다음이 포함된다:

- Server Components의 렌더링 결과
- Client Components가 렌더링되어야 할 위치의 플레이스홀더와 해당 JavaScript 파일에 대한 참조
- Server Component에서 Client Component로 전달된 모든 props

RSC Payload는 서버에서 렌더링된 컴포넌트의 결과를 나타내는 경량화된 표현이다. 이를 통해 클라이언트에서 Server Components의 렌더링 결과를 효율적으로 전송하고 활용할 수 있다.

클라이언트에서 React는 RSC Payload를 사용하여 Server Components의 렌더링 결과를 재구성하고, Client Components의 플레이스홀더를 실제 컴포넌트로 대체한다. 이 과정에서 Server Component에서 전달된 props도 Client Component에 전달된다.

RSC Payload는 바이너리 형식으로 인코딩되어 전송되므로 텍스트 기반의 HTML에 비해 더 컴팩트하고 효율적이다. 이는 네트워크 대역폭을 절약하고 전송 시간을 단축시키는 데 도움이 된다.

또한 RSC Payload는 서버에서 렌더링된 컴포넌트 트리의 구조와 데이터를 포함하고 있어 클라이언트에서 이를 활용하여 효율적으로 DOM을 업데이트할 수 있다. 이는 클라이언트 측에서 불필요한 렌더링을 최소화하고 성능을 향상시키는 데 기여한다.
:::

## 서버 렌더링 전략 {#server-rendering-strategies}

서버 렌더링에는 정적(Static), 동적(Dynamic), 스트리밍(Streaming)의 세 가지 하위 범주가 있다.

### 정적 렌더링 (기본값) {#static-rendering}

정적 렌더링에서는 라우트가 **빌드 시점**에 렌더링되거나 데이터 재검증 후 백그라운드에서 렌더링된다. 렌더링 결과는 캐시되어 Content Delivery Network (CDN)로 전달될 수 있다. 이 최적화를 통해 렌더링 결과를 사용자와 서버 요청 간에 공유할 수 있다.

정적 렌더링은 정적 블로그 게시물이나 제품 페이지와 같이 사용자에게 개인화되지 않고 빌드 시점에 정확히 알 수 있는 데이터를 가진 라우트에 유용하다.

### 동적 렌더링 {#dynamic-rendering}

동적 렌더링에서는 라우트가 **요청 시점**에 각 사용자에 대해 렌더링된다.

동적 렌더링은 사용자에 개인화된 데이터를 가지고 있거나 쿠키 또는 URL의 검색 파라미터와 같이 요청 시점에만 알 수 있는 정보를 가진 라우트에 유용하다.

:::tip 캐시된 데이터가 있는 동적 라우트
대부분의 웹사이트에서 라우트는 완전히 정적이거나 완전히 동적인 것이 아니라 다양한 스펙트럼을 가지고 있다. 예를 들어, 주기적으로 재검증되는 캐시된 제품 데이터를 사용하지만 캐시되지 않는 개인화된 고객 데이터도 포함하는 이커머스 페이지가 있을 수 있다.

Next.js에서는 캐시된 데이터와 캐시되지 않은 데이터가 모두 포함된 동적으로 렌더링된 라우트를 가질 수 있다. 이는 **RSC Payload와 데이터가 별도로 캐시되기 때문이다.** 따라서 요청 시 모든 데이터를 fetch할 때 성능에 미치는 영향에 대해 걱정하지 않고 동적 렌더링을 선택할 수 있다.
:::

#### 동적 렌더링으로 전환하기 {#switching-to-dynamic-rendering}

렌더링 중에 동적 함수나 캐시되지 않은 데이터 요청이 발견되면 Next.js는 전체 라우트를 동적으로 렌더링하도록 전환한다. 다음 표는 동적 함수와 데이터 캐싱이 라우트가 정적으로 렌더링되는지 동적으로 렌더링되는지에 어떻게 영향을 미치는지 요약하여 보여준다:

| 동적 함수 | 데이터        | 라우트          |
| --------- | ------------- | --------------- |
| ❌        | 캐시됨        | 정적으로 렌더링 |
| ✅        | 캐시됨        | 동적으로 렌더링 |
| ❌        | 캐시되지 않음 | 동적으로 렌더링 |
| ✅        | 캐시되지 않음 | 동적으로 렌더링 |

위의 표를 보면 라우트가 완전히 정적이 되려면 모든 데이터가 캐시되어야 한다는 것을 알 수 있다. 그러나 캐시된 데이터 fetch와 캐시되지 않은 데이터 fetch를 모두 사용하는 동적으로 렌더링된 라우트를 가질 수도 있다.

개발자는 정적 렌더링과 동적 렌더링 중에서 선택할 필요가 없다. Next.js는 사용된 기능과 API에 따라 각 라우트에 대해 최상의 렌더링 전략을 자동으로 선택한다. 대신 특정 데이터를 캐시하거나 재검증할 시기를 선택하고, UI의 일부를 스트리밍하도록 선택할 수 있다.

#### 동적 함수 {#dynamic-functions}

동적 함수는 사용자의 쿠키, 현재 요청 헤더 또는 URL의 검색 파라미터와 같이 요청 시점에만 알 수 있는 정보에 의존하는 함수다. Next.js에서 이러한 동적 함수는 다음과 같다:

- `cookies()` 및 `headers()`: Server Component에서 이들을 사용하면 전체 라우트가 요청 시점에 동적 렌더링으로 전환된다.
- `searchParams`: [Pages](https://nextjs.org/docs/app/api-reference/file-conventions/page) 프로퍼티를 사용하면 페이지가 요청 시점에 동적 렌더링으로 전환된다.

이러한 함수 중 하나라도 사용하면 전체 라우트가 요청 시점에 동적 렌더링으로 전환된다.

### 스트리밍 {#streaming}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-rendering-server-components/1.png)

스트리밍은 서버에서 UI를 점진적으로 렌더링할 수 있게 해준다. 작업은 청크로 분할되어 준비되는 대로 클라이언트로 전송된다. 이를 통해 사용자는 전체 콘텐츠 렌더링이 완료되기 전에 페이지의 일부를 즉시 볼 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-rendering-server-components/2.png)

스트리밍은 기본적으로 Next.js 앱 라우터에 내장되어 있다. 이는 초기 페이지 로딩 성능을 향상시키는 데 도움이 되며, 전체 라우트 렌더링을 차단할 수 있는 느린 데이터 fetch에 의존하는 UI에도 도움이 된다. 예를 들어, 제품 페이지의 리뷰가 이에 해당한다.

`loading.js` 와 [React Suspense](http://localhost:8081/docs/nextjs/nextjs-doc-loading-ui-and-streaming/)를 사용하여 라우트 세그먼트와 UI 컴포넌트의 스트리밍을 시작할 수 있다. 자세한 내용은 [로딩 UI 및 스트리밍](http://localhost:8081/docs/nextjs/nextjs-doc-loading-ui-and-streaming/) 섹션을 참조한다.
