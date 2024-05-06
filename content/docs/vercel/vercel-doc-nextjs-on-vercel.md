---
title: Vercel에서의 Next.js
description:
date: 2024-05-05
tags: []
references:
  [
    {
      key: 'Vecel 공식 문서',
      value: 'https://vercel.com/docs/frameworks/nextjs',
    },
  ]
---

Vercel은 Next.js 경험을 향상시키기 위해 설계된 네이티브 Next.js 플랫폼이다.

[Next.js](https://nextjs.org/)는 Vercel에서 유지 관리하는 웹용 풀스택 React 프레임워크다.

Next.js는 자체 호스팅 환경에서도 동작하지만, Vercel에 배포할 경우 별도의 구성 없이도 **전 세계적인 확장성, 가용성 및 성능 향상**의 이점을 누릴 수 있다.

## 시작하기 {#getting-started}

Vercel에서 Next.js를 시작하려면:

- 이미 Next.js 프로젝트가 있다면 [Vercel CLI](https://vercel.com/docs/cli)를 설치하고 프로젝트의 루트 디렉토리에서 `vercel` 명령을 실행한다.
- Next.js 예제 저장소 중 하나를 원하는 Git 프로바이더에 복제하고 Vercel에 배포한다.
- 또는 Vercel의 마켓플레이스에서 템플릿을 선택한다. ([링크](https://vercel.com/templates/next.js))

Vercel 배포는 [Git 프로바이더와 연동](https://vercel.com/docs/git)되어 Next.js 프로젝트의 각 풀 리퀘스트에 대해 [미리 보기 URL을 자동으로 생성](https://vercel.com/docs/deployments/preview-deployments)할 수 있다.

## Incremental Static Regeneration (ISR) {#isr}

**Incremental Static Regeneration(ISR)**은 사이트를 재배포하지 않고도 콘텐츠를 생성하거나 업데이트할 수 있게 해주는 Next.js의 기능이다. ISR은 개발자에게 다음과 같은 세 가지 주요 이점을 제공한다:

1. **더 나은 성능**: ISR을 사용하면 페이지를 정적으로 생성하여 캐싱할 수 있다. 이를 통해 매 요청마다 페이지를 동적으로 렌더링하는 것보다 더 빠른 응답 속도를 제공할 수 있다.
2. **향상된 보안**: 정적으로 생성된 페이지는 서버 측 로직이나 데이터베이스에 직접 접근하지 않기 때문에 보안 위험을 최소화할 수 있다.
3. **빠른 빌드 시간**: ISR을 사용하면 모든 페이지를 한 번에 생성하는 대신 필요할 때마다 증분적으로 생성할 수 있다. 이는 대규모 사이트의 빌드 시간을 크게 단축시킬 수 있다.

그러나 Next.js 애플리케이션을 자체 호스팅할 때는 ISR이 단일 지역 워크로드로 제한된다. 추가 구성이나 CDN 벤더링 없이는 정적으로 생성된 페이지가 방문자에게 더 가깝게 분산되지 않는다. 또한, 자체 호스팅 환경에서는 기본적으로 ISR이 생성된 페이지를 내구성 있는 스토리지에 유지하지 않고 만료되는 Next.js 캐시에 저장한다.

Next.js 13의 `app` 라우터에서 ISR을 활성화하려면 `fetch` 요청에 `revalidate` 속성이 포함된 옵션 객체를 추가해야 한다. 예를 들면 다음과 같다:

```ts
// apps/example/page.tsx
await fetch('https://api.vercel.app/blog', {
  next: { revalidate: 10 }, // 초 단위
});
```

위 코드는 블로그 데이터를 가져오는 API 요청에 대해 10초마다 ISR을 수행하도록 설정한다.

Vercel 플랫폼에서 Next.js와 함께 ISR을 사용하면 다음과 같은 추가적인 이점을 얻을 수 있다:

1. **글로벌 엣지 네트워크를 통한 더 나은 성능**: Vercel의 글로벌 [엣지 네트워크](https://vercel.com/docs/edge-network/overview)를 통해 정적 페이지를 전 세계 사용자에게 더 빠르게 전달할 수 있다.
2. **이전에 정적으로 생성된 페이지에 대한 무중단 롤아웃**: Vercel에서는 이전에 생성된 페이지를 seamlessly하게 업데이트할 수 있어 서비스 중단 없이 콘텐츠를 갱신할 수 있다.
3. **프레임워크 인식 인프라로 빠른 전 세계 콘텐츠 업데이트**: Vercel의 인프라는 Next.js에 최적화되어 있어 전 세계 엣지에서 300ms 내에 콘텐츠 업데이트를 반영할 수 있다.
4. **캐시와 내구성 있는 스토리지에 페이지 유지**: Vercel에서는 생성된 페이지를 캐시하고 내구성 있는 스토리지에 유지하므로 캐시 만료에 따른 성능 저하 없이 안정적으로 서비스할 수 있다.

:::important
ISR을 이해하는 데 혼동이 있을 수 있다. _ISR은 코드 변경이 아니라 데이터 변경과 관련된 개념이다._

전통적인 정적 사이트 생성(Static Site Generation, SSG)에서는 빌드 시점에 모든 페이지를 미리 렌더링한다. 따라서 콘텐츠를 업데이트하려면 전체 사이트를 다시 빌드하고 배포해야 한다. 반면에 ISR을 사용하면 초기 빌드 후에도 특정 페이지를 증분적으로 다시 생성할 수 있다.

예를 들어 블로그 웹사이트를 개발한다고 가정해 보면, 초기 빌드 시점에는 기존의 모든 블로그 게시물에 대한 정적 페이지를 생성한다. 그 후 새로운 블로그 게시물을 추가하거나 기존 게시물을 업데이트할 때, 해당 게시물의 페이지만 다시 생성하면 된다. 이때 전체 사이트를 재배포할 필요가 없다.

ISR은 이를 가능하게 해준다. 특정 페이지에 대해 재검증 주기(revalidation interval)를 설정하면, 해당 주기마다 페이지가 백그라운드에서 다시 생성된다. 이 과정에서 최신 데이터를 가져와 페이지를 업데이트하게 되는데, 이는 런타임에 이루어지므로 배포와는 무관하다.

예를 들어 블로그 게시물 페이지의 재검증 주기를 60초로 설정했다면, 60초마다 해당 페이지의 데이터를 최신화하여 다시 생성한다. 사용자는 항상 캐시된 페이지를 빠르게 받아볼 수 있고, 동시에 주기적으로 최신 콘텐츠로 업데이트되는 것이다.

중요한 점은 ISR이 코드의 변경이 아니라 데이터의 변경에 따라 페이지를 다시 생성한다는 것이다. 따라서 개발자는 코드 배포 없이도 콘텐츠를 지속적으로 갱신할 수 있게 된다.

물론 ISR을 활용하려면 초기 세팅이 필요하다. 즉, 어떤 페이지에 ISR을 적용할 것인지, 재검증 주기를 얼마로 할 것인지 등을 코드에 명시해야 한다. 하지만 일단 세팅이 끝나면 콘텐츠 변경이 있을 때마다 간편하게 페이지를 업데이트할 수 있다.

이렇게 ISR은 SSG의 장점(빠른 응답 속도, 캐싱 등)과 SSR의 장점(동적 콘텐츠 제공)을 결합한 혁신적인 기능이라고 할 수 있다.
:::

자세한 내용은 [문서](https://vercel.com/docs/incremental-static-regeneration)를 참조한다.

## Server-Side Rendering (SSR) {#server-side-rendering}

서버 사이드 렌더링(SSR)은 웹 페이지를 서버에서 동적으로 생성하는 기술이다. 클라이언트(브라우저)의 요청이 있을 때마다 서버에서 HTML을 생성하여 반환하는 방식으로 동작한다. 이는 각 요청마다 고유한 데이터를 렌더링해야 하는 경우에 특히 유용하다.

예를 들어 사용자 인증 상태에 따라 다른 콘텐츠를 보여주어야 하는 페이지를 생각해 보자. SSR을 사용하면 각 요청마다 사용자의 인증 상태를 확인하고, 그에 따라 맞춤화된 페이지를 동적으로 생성할 수 있다. 또 다른 예시로는 사용자의 지리적 위치에 기반한 콘텐츠 제공이 있다. 요청의 출처를 확인하여 해당 지역에 맞는 콘텐츠를 동적으로 렌더링할 수 있다.

Vercel 플랫폼에서는 Next.js 애플리케이션의 SSR을 위해 두 가지 런타임을 제공한다:

| 런타임                      | 설명                                                                                                                                                                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js 런타임 (기본값)** | [서버리스 함수](https://vercel.com/docs/functions/serverless-functions)를 사용하여 SSR을 수행한다. 서버리스 함수는 요청이 있을 때만 실행되고, 요청 처리가 완료되면 자동으로 종료된다. 이는 서버 관리 부담을 줄이면서도 확장성을 제공한다. |
| **Edge 런타임**             | [엣지 함수](https://vercel.com/docs/functions/edge-functions)를 사용하여 SSR을 수행한다. 엣지 함수는 Vercel의 글로벌 엣지 네트워크에서 실행되므로 지연 시간을 최소화하고 더 빠른 응답 속도를 제공할 수 있다.                              |

Vercel에서는 페이지별로 이 두 런타임 중 적합한 것을 선택할 수 있다. 예를 들어 인증이 필요한 페이지는 Node.js 런타임에서, 지리적 위치에 따른 콘텐츠 제공이 필요한 페이지는 Edge 런타임에서 렌더링할 수 있다.

Vercel에서 Next.js와 SSR을 사용하면 다음과 같은 이점이 있다:

1. **사용하지 않을 때는 제로 스케일링**: 서버리스 및 엣지 함수는 요청이 없을 때는 리소스를 소비하지 않습니다. 따라서 비용 효율적이다.
2. **트래픽 증가에 따른 자동 스케일링**: 요청량이 증가해도 Vercel이 자동으로 인스턴스를 확장하여 대응한다.
3. **캐시 제어 헤더에 대한 제로 구성 지원**: [`Cache-Control` 헤더](https://vercel.com/docs/edge-network/caching)를 자동으로 설정해주므로 별도의 설정이 필요 없다. `stale-while-revalidate` 와 같은 고급 캐싱 전략도 지원한다.
4. **프레임워크 인식 인프라**: Vercel의 인프라는 Next.js에 최적화되어 있어 Edge와 Node.js 런타임 간 전환이 seamless하다.

자세한 내용은 [문서](https://nextjs.org/docs/app/building-your-application/rendering#static-and-dynamic-rendering-on-the-server)를 참조한다.

## 스트리밍 {#streaming}

Vercel은 Next.js 프로젝트에서 세 가지 방법으로 스트리밍을 지원한다:

| 방법                                                                                           | 설명                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [라우트 핸들러](https://nextjs.org/docs/app/building-your-application/routing/router-handlers) | 라우트 핸들러는 Next.js 13에서 도입된 새로운 API로, `app` 디렉토리에서 사용된다. 이를 통해 파일 기반 라우팅 시스템을 사용하여 요청에 응답하는 동적 API 엔드포인트를 생성할 수 있다. 라우트 핸들러에서 스트리밍을 사용하면 데이터를 한 번에 전송하지 않고 청크 단위로 보낼 수 있어 응답 속도가 빨라진다. |
| **엣지 함수**                                                                                  | 엣지 함수는 Vercel의 글로벌 엣지 네트워크에서 실행되는 서버리스 함수다. 엣지 가까이에서 실행되므로 지연 시간이 낮아 실시간성을 요구하는 작업에 적합하다. 엣지 함수에서 스트리밍을 사용하면 대용량 데이터를 처리하고 전송하는 데 효과적이다.                                                             |
| **React 서버 컴포넌트**                                                                        | React 서버 컴포넌트는 서버에서 렌더링되는 React 컴포넌트다. 이를 통해 백엔드 리소스에 직접 접근하고 데이터를 동적으로 가져올 수 있다. 서버 컴포넌트에서 스트리밍을 사용하면 데이터를 점진적으로 가져와 클라이언트로 전송할 수 있다. 이는 초기 로딩 시간을 개선하고 사용자 경험을 향상시킨다.            |

데이터 스트리밍의 주요 장점은 다음과 같다:

1. **향상된 성능**: 데이터를 한 번에 가져오는 대신 청크 단위로 가져오므로 함수 응답 시간이 단축된다. 이는 앱의 사용자 경험을 개선한다.
2. **대용량 데이터 처리**: 스트리밍을 사용하면 엣지 및 서버리스 함수의 파일 크기 제한을 초과하지 않고도 대용량 데이터를 가져올 수 있다.
3. **점진적 로딩**: 스트리밍은 초기 로딩 UI를 표시하고 새로운 데이터를 사용할 수 있게 되면 서버에서 점진적으로 업데이트한다. 이렇게 하면 사용자가 콘텐츠를 더 빨리 볼 수 있다.

Vercel은 Next.js와 긴밀하게 통합되어 이러한 스트리밍 기능을 제공한다. Vercel의 플랫폼은 글로벌 엣지 네트워크, 자동 확장, 내장된 캐싱 등의 기능을 통해 Next.js 앱의 성능과 사용자 경험을 최적화한다.

자세한 내용은 [문서](https://vercel.com/docs/functions/streaming/quickstart)를 참조한다.

### `loading`과 `Suspense`를 사용한 스트리밍 {#streaming-with-loading-and-suspense}

Next.js 13에서는 `app` 디렉토리를 사용할 때, `loading` 파일과 `Suspense` 컴포넌트를 통해 스트리밍과 함께 로딩 상태를 처리할 수 있다.

`loading` 파일은 Next.js 13의 새로운 컨벤션으로, **라우트 세그먼트 레벨에서 로딩 상태를 정의하는 데 사용된다.**

`app` 디렉토리 내에서 라우트 세그먼트에 `loading.js` 또는 `loading.tsx` 파일을 추가하면, 해당 라우트 세그먼트의 데이터 가져오기가 완료될 때까지 `loading` 파일의 내용이 표시된다.

`loading` 파일은 해당 라우트 세그먼트의 모든 하위 요소, 즉 레이아웃과 페이지에 영향을 준다. 이를 통해 특정 경로나 라우트 세그먼트 전체에 대한 로딩 상태를 쉽게 정의할 수 있다.

예를 들어, `app/dashboard/loading.tsx` 와 같이 `loading` 파일을 정의하면, `/dashboard` 경로의 데이터 로딩이 완료될 때까지 해당 파일의 내용이 표시된다.

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <p>Loading dashboard...</p>;
}
```

반면 `Suspense` 컴포넌트는 React 18에서 도입된 기능으로, **컴포넌트 레벨에서 로딩 상태를 처리하는 데 사용된다.**

`Suspense` 로 감싼 컴포넌트는 내부의 모든 컴포넌트가 로드를 완료할 때까지 `fallback` prop으로 지정된 내용을 표시한다.

`Suspense` 는 `loading` 파일보다 더 세분화된 제어를 제공한다. 페이지의 특정 섹션에만 로딩 상태를 적용할 수 있어, 부분적인 로딩 상태 처리에 유용하다.

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { PostFeed, Weather } from './components';

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

위 예제에서는 `PostFeed` 와 `Weather` 컴포넌트를 `Suspense` 로 감싸고 있다. 각 컴포넌트의 로딩이 완료될 때까지 해당 `fallback` 의 내용이 표시된다.

이러한 방식으로 `loading` 파일과 `Suspense` 컴포넌트를 사용하면, 데이터 스트리밍과 함께 로딩 상태를 효과적으로 처리할 수 있다. 서버에서 새로운 데이터를 사용할 수 있게 되면 점진적으로 업데이트되므로, 사용자에게 즉각적인 피드백을 제공하고 전체적인 사용자 경험을 개선할 수 있다.

:::important
`Suspense` 컴포넌트를 사용한다고 해서 해당 컴포넌트가 무조건 스트리밍 처리되는 것은 아니다. `Suspense`는 로딩 상태를 처리하기 위한 범용적인 메커니즘을 제공할 뿐, 스트리밍 자체를 보장하지는 않는다.

`Suspense` 컴포넌트는 내부의 컴포넌트가 로딩 중일 때 폴백 UI를 표시하는 역할을 한다. 이는 동기적으로 로딩되는 컴포넌트에도 적용될 수 있다.

스트리밍은 `Suspense` 와는 별개의 개념으로, 데이터를 청크 단위로 점진적으로 가져오고 전송하는 것을 의미한다. React 서버 컴포넌트, Next.js의 라우트 핸들러나 엣지 함수에서 스트리밍을 구현할 수 있다.

예를 들어, React 서버 컴포넌트에서 `use` 훅을 사용하여 데이터를 가져올 때 `suspense: true` 옵션을 사용하면 해당 데이터 요청은 서스펜스 경계가 된다. 이 경우 `Suspense` 컴포넌트로 감싸면 데이터 로딩 중에 폴백 UI를 표시할 수 있다. 하지만 이것이 반드시 스트리밍을 의미하는 것은 아니다.

```jsx
// React 서버 컴포넌트
import { use } from 'react';

function Component() {
  // 서스펜스 경계가 되는 데이터 요청
  const data = use(fetchData(), { suspense: true });
  // ...
}

// 클라이언트 컴포넌트
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  );
}
```

위 예제에서 `Component` 는 서스펜스 경계가 되는 데이터 요청을 포함하고 있지만, 이 데이터 요청이 스트리밍으로 처리되는지 여부는 `fetchData` 함수의 구현에 따라 달라진다.

따라서 `Suspense` 컴포넌트를 사용한다고 해서 자동으로 스트리밍이 적용되는 것은 아니다. 스트리밍은 별도로 구현해야 하며, `Suspense`는 스트리밍 과정에서 로딩 상태를 처리하는 데 도움을 줄 수 있는 도구 중 하나다.
:::

자세한 내용은 [문서](https://vercel.com/docs/functions/streaming)를 참조한다.

## 부분적 사전 렌더링 {#partial-prerendering}

**부분적 사전 렌더링(Partial Prerendering, PPR)** 은 Next.js 14에서 도입된 실험적 기능으로, 페이지의 정적 부분과 동적 부분을 분리하여 렌더링하는 방식이다. 이를 통해 정적 콘텐츠는 미리 생성하여 캐시에서 빠르게 제공하고, 동적 콘텐츠는 클라이언트 측에서 스트리밍하여 로딩 속도를 개선할 수 있다.

현재 PPR은 실험 단계이므로 프로덕션 환경에서 사용하기에는 적합하지 않으며, 엣지 런타임과도 호환되지 않는다. 하지만 향후 안정화되면 특정 유형의 페이지에 효과적으로 적용할 수 있을 것이다.

PPR의 동작 방식은 다음과 같다:

1. 사용자가 페이지를 요청하면 서버는 미리 생성된 정적 라우트 셸(shell)을 즉시 반환한다. 이 셸에는 페이지의 정적 부분(예: 레이아웃, 사이드바 등)이 포함되어 있어 초기 로딩 속도가 빠르다.
2. 셸에는 동적 콘텐츠가 들어갈 자리를 비워두는 '구멍(hole)'이 있다. 이 구멍은 클라이언트 측에서 동적 콘텐츠를 스트리밍할 위치를 나타낸다.
3. 클라이언트는 셸을 받은 후 비동기적으로 구멍에 해당하는 동적 콘텐츠를 요청한다. 이때 각 구멍은 병렬로 로드되므로 전체 페이지 로딩 시간이 단축된다.
4. 동적 콘텐츠가 도착하면 클라이언트는 해당 콘텐츠를 셸의 구멍에 스트리밍하여 최종 페이지를 완성한다.

이러한 방식은 정적 요소와 동적 요소가 혼재되어 있는 페이지에 특히 유용하다. 대표적인 예로 대시보드를 들 수 있는데, 대시보드는 사이드바나 레이아웃 같은 정적 요소와 사용자별 데이터 같은 동적 요소로 구성된다.

기존의 Next.js 애플리케이션에서는 페이지 전체가 정적으로 생성되거나 동적으로 렌더링되었다. 하지만 PPR을 사용하면 정적 부분과 동적 부분을 분리하여 각각 최적의 방식으로 처리할 수 있게 된다.

PPR은 아직 실험 단계이므로 프로덕션 사용에 앞서 향후 업데이트와 안정화 과정을 지켜볼 필요가 있다.

자세한 내용은 [문서](https://nextjs.org/docs/app/api-reference/next-config-js/partial-prerendering)를 참조한다.

## 이미지 최적화 {#image-optimization}

[이미지 최적화](https://vercel.com/docs/image-optimization)는 웹 애플리케이션의 성능을 개선하는 데 중요한 역할을 한다. 이미지 파일은 웹페이지에서 상당한 용량을 차지하므로, 이미지 크기를 줄이고 효율적인 형식을 사용하면 페이지 로드 속도를 크게 높일 수 있다.

Next.js는 내장된 이미지 최적화 기능을 제공하며, Vercel 플랫폼과 함께 사용할 때 더욱 강력한 이점을 발휘한다.

Vercel에 Next.js 애플리케이션을 배포하면 이미지 최적화가 자동으로 수행됩니다. 개발자는 `next/image` 컴포넌트를 사용하기만 하면 되고, 이미지 최적화를 위한 별도의 구성이 필요하지 않다. Vercel은 이미지를 온디맨드로 최적화하므로 빌드 시간에 영향을 주지 않으면서도 페이지 로드 성능과 [Core Web Vitals](https://vercel.com/docs/speed-insights) 점수를 개선할 수 있다.

`next/image` 컴포넌트는 사용이 간편하다. 최적화할 이미지를 포함하는 컴포넌트에서 `next/image` 를 import하고, `src`, `alt`, `width`, `height` 등의 속성을 설정하면 된다.

```tsx
import Image from 'next/image';

const ExampleComponent = () => {
  return (
    <Image src="example.png" alt="Example picture" width={500} height={500} />
  );
};
```

위 코드에서 `example.png` 는 자동으로 최적화되어 제공된다.

반면 Next.js 애플리케이션을 자체 호스팅하는 경우에는 기본 제공되는 Next.js 서버가 이미지 최적화를 담당한다. 이 서버는 페이지 렌더링과 정적 파일 제공도 함께 처리한다.

Vercel에서 Next.js와 이미지 최적화를 사용하면 다음과 같은 이점이 있다:

1. **설정 없는 이미지 최적화**: `next/image`를 사용하는 것만으로 별도의 설정 없이 이미지가 최적화된다.
2. **우수한 성능 보장**: 이미지 최적화를 기본으로 제공하므로 팀 차원에서 성능을 보장할 수 있다.
3. **빠른 빌드 유지**: 이미지를 온디맨드로 최적화하므로 빌드 시간이 늘어나지 않다.
4. **추가 비용 없음**: 이미지 최적화를 위한 별도의 서비스를 구매하거나 설정할 필요가 없다.

이처럼 Next.js와 Vercel의 이미지 최적화 기능은 웹 애플리케이션의 성능을 손쉽게 개선할 수 있는 강력한 도구다. 개발자는 최소한의 노력으로 이미지 최적화의 이점을 누릴 수 있다.

자세한 내용은 [문서](https://vercel.com/docs/image-optimization)를 참조한다.

## 폰트 최적화 {#font-optimization}

font 최적화는 웹 애플리케이션의 성능과 사용자 경험을 개선하는 데 중요한 역할을 한다. Next.js는 `next/font` 모듈을 통해 폰트 최적화를 위한 기능을 제공하며, 특히 Vercel과 함께 사용할 때 더욱 강력한 이점을 얻을 수 있다.

`next/font` 의 주요 기능은 폰트 파일에 대한 자동 셀프 호스팅이다. 개발자는 폰트 파일을 프로젝트에 포함시키기만 하면 Next.js가 해당 폰트를 자동으로 최적화하고 애플리케이션과 함께 제공한다. 이는 외부 폰트 호스팅 서비스에 의존할 필요가 없음을 의미한다.

또한 `next/font` 는 CSS의 `size-adjust` 속성을 활용하여 웹 폰트를 최적으로 로드한다. 이 속성은 폰트 로딩 중에 텍스트 크기를 조정하여 [레이아웃 이동(layout shift)](https://vercel.com/docs/speed-insights#cumulative-layout-shift-cls)을 방지한다. 레이아웃 이동은 사용자 경험을 저해하는 요소 중 하나로, 폰트 로딩으로 인해 페이지의 콘텐츠가 갑자기 이동하는 현상을 말한다. `next/font` 를 사용하면 이러한 레이아웃 이동을 완전히 제거할 수 있다.

`next/font` 는 Google Fonts와 완벽하게 통합된다. 개발자는 `next/font/google` 에서 원하는 Google 폰트를 import하기만 하면 해당 폰트의 CSS와 폰트 파일이 빌드 시 자동으로 다운로드되고 애플리케이션에 포함된다. 이 과정에서 브라우저는 Google 서버에 어떠한 요청도 보내지 않는다. 이는 성능 향상과 함께 사용자의 개인정보 보호에도 도움이 된다.

다음은 `next/font` 를 사용하여 Google Fonts를 로드하는 예시 코드다:

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

위 코드에서는 Google의 'Inter' 폰트를 로드하고 있다. `subsets` 옵션으로 필요한 글자 집합을 지정할 수 있고, `display` 옵션으로 폰트 로딩 전략을 설정할 수 있다.

결과적으로 Next.js와 Vercel의 폰트 최적화 기능을 사용하면 다음과 같은 이점을 얻을 수 있다:

1. **자동 셀프 호스팅으로 외부 의존성 제거**
2. **레이아웃 이동 없는 웹 폰트 로딩으로 사용자 경험 개선**
3. **빌드 시 CSS와 폰트 파일을 번들링하여 성능 향상**
4. **Google Fonts를 브라우저 요청 없이 사용**

폰트 최적화는 웹 애플리케이션의 성능과 사용자 경험에 직접적인 영향을 미치는 요소다. Next.js와 Vercel이 제공하는 폰트 최적화 도구를 활용하면 개발자는 손쉽게 최적의 폰트 로딩 전략을 구현할 수 있다.

자세한 내용은 [문서](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)를 참조한다.

## Open Graph 이미지 {#open-graph-images}

동적 소셜 카드 이미지([Open Graph 프로토콜](https://vercel.com/docs/functions/edge-functions/og-image-generation) 사용)를 생성하면 사이트의 모든 페이지에 대해 고유한 이미지를 만들 수 있다.

동적 Open Graph(OG) 이미지는 웹사이트의 각 페이지에 대해 고유한 시각적 미리보기를 제공하므로 소셜 미디어나 메신저에서 링크를 공유할 때 매우 유용하다. 정적 이미지 대신 페이지 제목, 설명, 메타데이터등을 동적으로 렌더링하여 보다 관련성 높고 매력적인 미리보기를 생성할 수 있다.

[Vercel OG](https://vercel.com/docs/functions/edge-functions/og-image-generation)는 Next.js API 라우트를 활용하여 이러한 동적 OG 이미지를 쉽게 생성할 수 있는 라이브러리다. React 컴포넌트로 이미지를 렌더링하고, Vercel 플랫폼 최적화로 빠르고 효율적으로 운영할 수 있다.

1. Edge 퍼포먼스: Vercel OG API는 Vercel의 Edge Functions 와 WebAssembly로 구동되어 셀프 호스팅보다 훨씬 빠르고 저렴하며 높은 확장성을 제공한다.
2. 프론트엔드 통합: API 코드가 Next.js 애플리케이션 내에 있어 프론트엔드 코드베이스와 통합되므로 유지보수가 용이하다.
3. 자동 캐싱: Vercel Edge Network에서 생성된 이미지가 자동으로 캐싱되어 성능이 향상된다.

다음 예제 코드는 Next.js App Router와 Pages Router 모두에서 OG 이미지 생성 방법을 보여준다. `@vercel/og` 에서 `ImageResponse` 컴포넌트를 가져와 JSX로 이미지 내용을 렌더링하고 크기를 지정하면 된다.

```tsx
{% raw %}// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

// App router에서는 @vercel/og를 설치할 필요 없습니다.
export const runtime = 'edge';

export async function GET(request: Request) {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Hello world!
      </div>
    ),
    {
      width: 1200,
      height: 600,
    },
  );
}
{% endraw %}
```

생성된 이미지를 보려면 터미널에서 `npm run dev` 를 실행하고 브라우저에서 `/api/og` 경로(대개 `http://localhost:3000/api/og`)를 방문한다.

**요약하면, Vercel OG와 Next.js를 사용하면 다음과 같은 이점이 있다:**

- 헤드리스 브라우저 없이 즉시 동적 소셜 카드 이미지 생성 가능
- 생성된 이미지는 Vercel Edge Network에 자동 캐싱됨
- 이미지 생성이 프론트엔드 코드베이스와 동일한 위치에서 이루어짐

자세한 내용은 [문서](https://vercel.com/docs/functions/edge-functions/og-image-generation)를 참조한다.

## 미들웨어 {#middleware}

[미들웨어](https://vercel.com/docs/functions/edge-middleware)는 Next.js 애플리케이션에서 요청이 처리되기 전에 실행되는 코드다. 이를 통해 요청에 대한 사전 로직을 수행하고 응답을 수정할 수 있다. 주요 용도는 다음과 같다.

1. **개인화 컨텐츠 제공**: 정적으로 생성된 페이지라도 Middleware를 통해 사용자의 위치, 디바이스 등에 따라 컨텐츠를 동적으로 변경할 수 있다.
2. **라우팅 및 리디렉션**: 특정 경로에 대한 접근을 제어하거나 다른 URL로 리디렉트할 수 있다.
3. **HTTPS 적용**: 모든 요청에 HTTPS를 강제 적용할 수 있다.
4. **최적화 및 변환**: 캐시 제어, 이미지 최적화, 응답 헤더 수정 등을 수행할 수 있다.

미들웨어에 대한 자세한 내용은 [문서](https://vercel.com/docs/functions/edge-middleware/middleware-api#middleware-helper-methods)를 참조한다.

Next.js를 Vercel에 배포할 때, 각 요청의 지리적 위치 정보를 제공하는 헬퍼에 액세스할 수 있다. 또한 리라이트, 미들웨어 체인 계속하기 등을 가능케 하는 `NextRequest`와 `NextResponse` 객체에도 액세스할 수 있다.

Vercel에서 Next.js 프로젝트를 배포하면 [Edge Middleware](https://vercel.com/docs/functions/edge-middleware)라는 고도로 최적화된 미들웨어를 사용할 수 있다. 이는 다음과 같은 이점을 제공한다.

- 글로벌로 배포되는 **Edge Middleware**로 실행된다.
- 외부 서비스 없이 직접 Middleware 로직을 Next.js 애플리케이션에 통합할 수 있다.
- Edge Middleware는 Vercel의 전 세계 데이터 센터에 배포되어 낮은 지연시간으로 빠르게 작동한다.

자세한 내용은 [문서](https://vercel.com/docs/functions/edge-middleware)를 참조한다.

## 드래프트 모드 {#draft-mode}

[드래프트 모드](https://vercel.com/docs/workflow-collaboration/draft-mode)는 [헤드리스 CMS](https://vercel.com/docs/solutions/cms)의 드래프트 컨텐츠를 미리 확인할 수 있는 강력한 기능이다. 프로덕션 환경에서는 여전히 페이지를 정적으로 생성하지만, 개발 단계에서는 컨텐츠 변경사항을 실시간으로 반영하여 확인할 수 있다.

:::important 헤드리스 CMS란?
전통적인 CMS는 컨텐츠 생성, 관리뿐만 아니라 컨텐츠를 표시하는 프론트엔드 부분까지 모두 포함되어 있는 올인원 패키지와 같다. 예를 들어 워드프레스를 사용한다면, 워드프레스 관리자 페이지에서 컨텐츠를 작성하고, 워드프레스 테마/플러그인을 통해 웹사이트에 컨텐츠가 표시된다.

하지만 헤드리스 CMS는 이름 그대로 '헤드(프론트엔드 표현 부분)' 없이 '몸통(컨텐츠 관리)' 부분만 존재한다. 컨텐츠를 작성하고 관리하는 백엔드 시스템만 제공하고, 실제 컨텐츠 표현은 별도의 프론트엔드 앱에서 처리하도록 분리되어 있다.

예를 들어, Contentful이라는 헤드리스 CMS를 사용한다고 가정해보자. Contentful의 관리자 페이지에서 블로그 글을 작성하면, 작성된 컨텐츠는 Contentful API를 통해 JSON 형태로 제공된다. 그리고 Next.js와 같은 프론트엔드 프레임워크에서 해당 API를 호출하여 데이터를 가져와 렌더링하면 실제 웹사이트가 구축된다.

이렇게 컨텐츠와 표현 부분이 분리되어 있어 다양한 플랫폼(웹, 모바일앱, 웨어러블 등)에서 동일한 컨텐츠를 활용할 수 있고, 프론트엔드 기술 스택에 제약이 없다는 장점이 있다.
:::

:::important
일반적으로 웹사이트에 새로운 컨텐츠를 게시하려면 다음 과정을 거친다.

1. CMS에서 컨텐츠 작성
2. 작성한 컨텐츠 검토 및 승인
3. 승인된 컨텐츠로 웹사이트 빌드/배포

이때 2번 단계에서 실제 웹사이트가 아닌 별도의 환경에서 컨텐츠를 미리 확인하고 싶을 때가 있다. 바로 이런 상황에서 드래프트 모드가 사용된다.

드래프트 모드를 활성화하면 CMS의 미완성 드래프트 컨텐츠를 웹사이트에서 실시간으로 확인할 수 있다. 프로덕션 환경에서는 여전히 최종 승인된 컨텐츠로 정적 페이지를 생성하지만, 개발/스테이징 환경에서는 드래프트 컨텐츠로 페이지를 동적으로 렌더링해서 보여준다.

예를 들어, Contentful과 같은 헤드리스 CMS에서 블로그 글의 초안을 작성했다고 가정해보자. 드래프트 모드를 켜면 Next.js 애플리케이션에서 해당 초안 글의 실제 모습을 바로 확인할 수 있다. 이를 통해 컨텐츠 게시 전에 미리 레이아웃, 스타일 등을 검토할 수 있다.

따라서 드래프트 모드는 컨텐츠 생성 및 검토 프로세스를 간소화하고, 불필요한 반복 작업을 줄여주는 효과가 있다. 컨텐츠 제작자와 개발자 모두에게 유용한 기능이다.
:::

자세한 내용은 [문서](https://vercel.com/docs/workflow-collaboration/draft-mode#using-draft-mode-with-next.js)를 참조한다.

### 셀프 호스팅 환경의 드래프트 모드 {#self-hosting-draft-mode}

1. **서버 부하 증가**
   - 셀프 호스팅 시, 드래프트 모드를 활성화하면 모든 요청이 직접 Next.js 서버로 전달된다. 이는 정적 사이트였다면 CDN을 통해 처리되었을 요청들이 모두 서버로 들어오게 되어 서버 부하가 급격히 증가한다. 특히 트래픽이 많을수록 이 문제는 더 심각해진다.
2. **비용 증가**
   - 클라우드 환경에서 서버 리소스 사용량이 증가하면 비례하여 비용도 증가한다. 드래프트 모드 사용 시 추가 서버 인스턴스 확장이 필요할 수 있어 운영 비용이 많이 들 수 있다.
3. **보안 취약점**
   - 드래프트 모드는 일반적으로 인증된 사용자에게만 허용되지만, 쿠키 스푸핑과 같은 해킹 공격을 통해 권한 없는 사용자가 드래프트 모드에 접근할 수 있다. 기본 Next.js 서버로의 직접 요청도 이루어질 수 있어 보안 취약점이 발생한다.
4. **유지보수 어려움**
   - 요청 핸들링, 인증 등 드래프트 모드를 위한 추가 로직이 서버 코드에 직접 구현되어야 하므로 코드가 복잡해지고 유지보수가 어려워진다.

따라서 셀프 호스팅된 Next.js 앱에서 드래프트 모드 기능을 활용하기 위해서는 별도의 부하 분산, 인증, 보안 절차 등을 직접 관리해야 하는 overhead가 발생한다.

이에 비해 Vercel에 배포하면 이런 문제 없이 드래프트 모드를 안전하고 효율적으로 사용할 수 있다. Vercel의 Edge 네트워크와 자동 인증으로 손쉽게 드래프트 모드가 최적화되기 때문이다.

:::important
개발 환경에서는 트래픽이 많지 않기 때문에 드래프트 모드로 인한 서버 부하가 크지 않을 수 있다. 그러나 몇 가지 고려해야 할 점이 있다.

1. 동시 요청 수
   - 비록 개발 환경이라 해도, 여러 개발자가 동시에 드래프트 모드로 작업한다면 병렬 요청이 많아질 수 있다. 특히 대규모 프로젝트일수록 이 문제가 발생할 가능성이 높다.
2. 빌드 프로세스
   - Next.js 앱은 프로덕션 빌드 시에만 정적 렌더링이 이루어지고, 개발 모드에서는 매 요청마다 서버 렌더링이 수행된다. 드래프트 모드는 개발 환경에 가까운 동작을 하므로 정적 빌드보다 서버 부하가 높다.
3. 개발/스테이징 환경 규모
   - 프로젝트 규모가 크고 여러 단계의 개발/스테이징 환경을 운영한다면, 각 환경마다 드래프트 모드를 활성화할 경우 총 부하가 상당할 수 있다.

따라서 셀프 호스팅 환경에서는 프로젝트 규모와 개발/스테이징 환경 구조에 따라 드래프트 모드 사용 시 서버 부하가 무시할 수준이 아닐 수 있다. 특히 대규모 프로젝트에서는 이 부분을 반드시 고려해야 한다.
대신 Vercel과 같은 플랫폼 서비스를 사용하면 자동 스케일링과 고도의 최적화로 드래프트 모드로 인한 부하 우려 없이 편리하게 활용할 수 있다.
:::

:::important
웹 애플리케이션에서 일반적으로 인증 정보는 쿠키를 통해 전달된다. 로그인 후 서버로부터 받은 쿠키는 이후 요청마다 자동으로 함께 전송되어 사용자 인증 상태를 유지한다.

쿠키 스푸핑(Cookie Spoofing)이란 공격자가 다른 사용자의 유효한 쿠키 값을 가로채서, 그 쿠키를 자신의 브라우저에 설정하여 해당 사용자로 가장하는 해킹 기법이다.

예를 들어 드래프트 모드 접근 권한이 있는 관리자 계정의 쿠키 값을 공격자가 탈취했다고 가정해보자. 그렇게 되면 공격자는 자신의 브라우저에 그 쿠키를 설정하여 관리자 계정으로 위장할 수 있다. 결과적으로 권한이 없는 공격자가 드래프트 모드 기능을 악용할 수 있게 된다.

더 나아가 드래프트 모드 API가 직접 Next.js 서버를 호출하는 방식이라면, 공격자는 관리자 계정으로 위장하여 서버에 직접 접근하는 위험까지 있다. 이렇게 되면 서버 자체에 대한 공격이 가능해져 심각한 보안 취약점이 발생할 수 있다.

따라서 셀프 호스팅 환경에서 드래프트 모드를 안전하게 운영하려면 쿠키 스푸핑을 비롯한 다양한 해킹 위협에 대비한 보안 조치가 필수적이다. 하지만 Vercel과 같은 클라우드 서비스 환경에서는 이러한 보안 취약점에 대한 위험 없이 강력한 인증을 기반으로 드래프트 모드가 제공된다.
:::

### 드래프트 모드 보안 {#draft-mode-security}

1. **인증된 사용자만 접근 가능**
   - Vercel에서는 드래프트 모드 기능을 팀 멤버로 제한한다. 드래프트 모드를 켜거나 끄려면 먼저 Vercel 계정으로 로그인해야 한다. 외부 사용자는 액세스할 수 없다.
2. **자동 보안 인증**
   - 일반 방문자는 최종 배포된 컨텐츠만 볼 수 있다. 하지만 [팀](https://vercel.com/docs/teams-and-accounts) 멤버가 로그인하면 Vercel에서 자동으로 인증 절차를 거쳐 드래프트 컨텐츠에 접근할 수 있는 권한을 부여한다.
3. **ISR 캐시 우회**
   - 정상적인 경우 웹사이트는 미리 렌더링된 정적 페이지를 CDN 캐시에서 제공한다. 그러나 드래프트 모드에서는 Vercel의 Edge Network가 이 캐시를 우회하여 직접 서버로 요청을 전달한다.
4. **서버리스 함수 호출**
   - Vercel은 서버 대신 [서버리스 함수](https://vercel.com/docs/functions/serverless-functions)를 호출하여 드래프트 컨텐츠를 가져온다. 이 함수에서 헤드리스 CMS의 최신 드래프트 데이터를 실시간으로 가져와 렌더링한다.
5. **안전한 드래프트 모드 제공**
   - 이렇게 인증, ISR 캐시 우회, 서버리스 함수 호출이 자동화되어 있어 별도 보안 취약점 없이 안전한 드래프트 모드 환경을 제공한다.

요약하면 Vercel에서는 팀 멤버 인증과 Edge 네트워크의 지능적인 라우팅을 통해 드래프트 모드를 자동으로 활성화하고 실시간 미리보기를 제공한다. 별도 보안 설정 없이도 안전하고 편리하게 드래프트 컨텐츠를 확인할 수 있다.

### 프리뷰 배포에서 드래프트 모드 활성화 {#enabling-draft-mode-in-preview-deployments}

여러분과 팀 멤버는 Vercel Toolbar를 통해 [프로덕션](https://vercel.com/docs/workflow-collaboration/comments/in-production-and-localhost#using-@vercel/toolbar-in-production), [로컬호스트](https://vercel.com/docs/workflow-collaboration/comments/in-production-and-localhost#using-@vercel/toolbar-in-localhost), [프리뷰 배포](https://vercel.com/docs/deployments/preview-deployments#comments)에서 드래프트 모드를 토글할 수 있다. 활성화되면 툴바가 보라색으로 변해 Draft Mode가 활성화되었음을 나타낸다.

![Draft Mode가 활성화되었을 때의 Vercel 툴바 모습이다.](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/vercel-doc-nextjs-on-vercel/1.png)

Vercel 팀 외부 사용자는 Draft Mode를 토글할 수 없다.

요약하면, Vercel의 Next.js에서 Draft Mode를 사용하면 다음과 같은 이점이 있습니다:

- 정적 페이지의 프리뷰를 쉽게 서버 렌더링할 수 있다.
- 악용을 방지하기 위한 추가 보안 조치가 적용된다.
- 선택한 헤드리스 제공업체와 통합할 수 있다.
- **프리뷰 배포의 댓글 툴바**에서 Draft Mode를 활성화/비활성화할 수 있다.

자세한 내용은 [문서](https://vercel.com/docs/workflow-collaboration/draft-mode)를 참조한다.

## Web Analytics {#web-analytics}

Vercel의 Web Analytics 기능을 사용하면 애플리케이션의 성능을 시간 경과에 따라 시각화하고 모니터링할 수 있다. 프로젝트 대시보드의 Analytics 탭에서는 방문자 수, 상위 페이지, 상위 리퍼러, 사용자 인구통계 등 웹사이트 방문자에 대한 자세한 통계를 확인할 수 있다.

Web Analytics를 사용하려면 Vercel 프로젝트 대시보드의 Analytics 탭으로 이동하여 나타나는 모달 창에서 **활성화**를 선택한다.

방문자와 페이지 뷰를 추적하려면 Next.js 프로젝트 루트 디렉터리에서 아래 터미널 명령을 실행하여 `@vercel/analytics` 패키지를 설치한다.

```bash
pnpm i @vercel/analytics
```

그런 다음 아래 지침에 따라 `pages` 디렉터리나 `app` 디렉터리에 `Analytics` 컴포넌트를 추가한다.

`Analytics` 컴포넌트는 트래킹 스크립트를 래핑하여 Next.js와의 통합을 더 원활하게 해준다.

루트 레이아웃에 다음 컴포넌트를 추가한다.

```diff-tsx
+ import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
+        <Analytics />
      </body>
    </html>
  );
}
```

요약하면, Vercel의 Next.js에서 Web Analytics를 사용하면 다음과 같은 이점이 있습니다:

- 트래픽을 추적하고 상위 성과 페이지를 확인할 수 있다.
- 운영 체제, 브라우저, 지리적 위치 등 방문자 인구통계에 대한 자세한 데이터를 확인할 수 있다.

자세한 내용은 [문서](https://vercel.com/docs/analytics)를 참조한다.

## Speed Insights {#speed-insights}

Vercel 대시보드에서 프로젝트의 [Core Web Vitals](https://vercel.com/docs/speed-insights#core-web-vitals-explained) 성능 데이터를 확인할 수 있다. 이를 통해 웹 애플리케이션의 로딩 속도, 응답성, 시각적 안정성을 추적하여 전반적인 사용자 경험을 개선할 수 있다.

### reportWebVitals {#reportWebVitals}

앱을 셀프 호스팅하는 경우, `useWebVitals` 훅을 사용하여 메트릭을 분석 제공업체에 보낼 수 있다.

다음 예제는 앱의 루트 `layout` 파일에서 사용할 수 있는 커스텀 `WebVitals` 컴포넌트를 보여준다.

```tsx
// app/_components/web-vitals.tsx
'use client';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);
  });
}
```

그리고 이 커스텀 `WebVitals` 컴포넌트를 다음과 같이 참조할 수 있다.

```tsx
// app/layout.ts
import { WebVitals } from './_components/web-vitals';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
```

Next.js는 `reportWebVitals` 에서 사용 가능한 Web Vitals 메트릭을 측정하기 위해 [Google의 `web-vitals` 라이브러리](https://github.com/GoogleChrome/web-vitals#web-vitals)를 사용한다.

요약하면, Vercel의 Next.js에서 Web Vitals를 추적하면 다음과 같은 이점이 있다:

- [First Contentful Paint](https://vercel.com/docs/speed-insights#first-contentful-paint-fcp) 또는 [First Input Delay](https://vercel.com/docs/speed-insights#first-input-delay-fid) 등의 트래픽 성능 지표를 추적할 수 있다.
- 페이지 이름과 URL별로 성능 분석을 볼 수 있어 보다 세부적인 분석이 가능하다.
- 각 측정 지표에 대한 [앱 성능 점수](https://vercel.com/docs/speed-insights#how-the-scores-are-determined)를 확인할 수 있어 개선 또는 퇴행 상황을 추적할 수 있다.

자세한 내용은 [문서](https://vercel.com/docs/speed-insights)를 참조한다.

## Service integrations {#service-integrations}

Vercel은 MongoDB, Sanity 등 인기 서비스 공급업체와 파트너십을 맺어 Next.js에서 해당 서비스를 더 쉽게 사용할 수 있는 통합 기능을 제공한다. [Commerce](https://vercel.com/integrations#commerce), [Databases](https://vercel.com/integrations#databases), [Logging](https://vercel.com/integrations#logging) 등 다양한 범주에 걸쳐 많은 통합 기능이 있다.

요약하면, Vercel의 통합 기능은 다음과 같은 이점이 있습니다:

- 선호하는 서비스를 Vercel 프로젝트에 연결하는 프로세스를 단순화한다.
- 선호하는 서비스를 사용하여 Vercel 프로젝트의 최적 설정을 달성할 수 있도록 돕는다.
- 환경 변수를 자동으로 구성해 준다.

자세한 내용은 [문서](https://vercel.com/integrations)를 참조한다.

## More benefits {#more-benefits}

모든 프레임워크에서 Vercel에 배포할 때 사용할 수 있는 기능에 대해서는 [프레임워크 문서 페이지](https://vercel.com/docs/frameworks) 참조한다.

## More resources {#more-resources}

- [Build a fullstack Next.js app](https://vercel.com/guides/nextjs-prisma-postgres)
  - Next.js, Prisma, PostgreSQL로 풀스택 앱을 구축하는 방법을 배운다.
- [Build a multi-tenant Next.js app](https://vercel.com/guides/nextjs-multi-tenant-application)
  - Next.js로 커스텀 도메인을 사용한 멀티 테넌트 앱을 구축하는 방법을 배웁니다.
- [Next.js with Contenful](https://vercel.com/guides/integrating-next-js-and-contentful-for-your-headless-cms)
  - Next.js에서 Contentful을 헤드리스 CMS로 사용하는 방법을 배운다.
- [Next.js with Stripe Checkout and Typescript](https://vercel.com/guides/getting-started-with-nextjs-typescript-stripe)
  - Next.js, TypeScript, Stripe Checkout 시작하기를 배운다.
- [Next.js with Magic.link](https://vercel.com/guides/add-auth-to-nextjs-with-magic)
  - Next.js 사이트에 Magic.link으로 인증을 추가하는 방법을 배운다.
- [Generate a sitemap with Next.js](https://vercel.com/guides/how-do-i-generate-a-sitemap-for-my-nextjs-app-on-vercel)
  - Vercel에서 Next.js 앱의 "sitemap.xml"을 생성하는 방법을 배운다.
- [Next.js ecommerce with Shopify](https://vercel.com/guides/deploying-locally-built-nextjs)
  - Next.js와 Shopify로 이커머스 사이트를 구축하는 방법을 배운다.
- [Deploy a locally built Next.js app](https://vercel.com/guides/deploying-locally-built-nextjs)
  - 로컬에서 빌드한 Next.js 앱을 Vercel에 배포하는 방법을 배운다.
