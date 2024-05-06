---
title: 프로덕션 체크리스트
description:
date: 2024-05-05
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/deploying/production-checklist',
    },
  ]
---

Next.js 애플리케이션을 프로덕션 환경에 배포하기 전에 최상의 사용자 경험, 성능 및 보안을 위해 고려해야 할 최적화와 패턴이 있다.

이 페이지에서는 애플리케이션을 구축할 때, 프로덕션에 배포하기 전, 그리고 배포 후에 참조할 수 있는 모범 사례와 인지해야 할 자동 Next.js 최적화에 대해 설명한다.

## 자동 최적화 {#automatic-optimization}

다음은 따로 설정할 필요 없이 기본적으로 활성화되어 있는 Next.js 최적화 기능이다:

- **서버 컴포넌트**: Next.js는 기본적으로 서버 컴포넌트를 사용한다. 서버 컴포넌트는 서버에서 실행되며 클라이언트에서 렌더링하기 위해 JavaScript가 필요하지 않다. 따라서 클라이언트 측 JavaScript 번들 크기에 영향을 주지 않는다. 그런 다음 필요에 따라 클라이언트 컴포넌트를 사용하여 상호 작용할 수 있다.
- **코드 분할**: 서버 컴포넌트는 라우트 세그먼트별 자동 코드 분할을 가능하게 한다. 적절한 경우 클라이언트 컴포넌트와 써드파티 라이브러리를 지연 로딩하는 것도 고려할 수 있다.
- **프리페칭**: 새 경로에 대한 링크가 사용자의 뷰포트에 들어오면 Next.js는 백그라운드에서 해당 경로를 프리페치한다. 이를 통해 새 경로로의 탐색이 거의 즉각적으로 이루어진다. 경우에 따라 프리페칭을 해제할 수 있다.
- **정적 렌더링**: Next.js는 빌드 시점에 서버에서 서버 및 클라이언트 컴포넌트를 정적으로 렌더링하고 렌더링된 결과를 캐시하여 애플리케이션의 성능을 향상시킨다. 필요에 따라 특정 경로에 대해 동적 렌더링을 선택할 수 있다.
- **캐싱**: Next.js는 데이터 요청, 서버 및 클라이언트 컴포넌트의 렌더링 결과, 정적 에셋 등을 캐시하여 서버, 데이터베이스 및 백엔드 서비스에 대한 네트워크 요청 수를 줄인다. 필요에 따라 캐싱을 해제할 수 있다.

이러한 기본값은 애플리케이션의 성능을 향상시키고 각 네트워크 요청에서 전송되는 데이터의 비용과 양을 줄이는 것을 목표로 합니다.

## 개발 중 {#during-development}

애플리케이션을 개발하는 동안 최상의 성능과 사용자 경험을 보장하기 위해 다음 기능을 사용하는 것이 좋다:

### 라우팅 및 렌더링 {#routing-and-rendering}

- [레이아웃](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#layouts): 레이아웃을 사용하여 페이지 간에 UI를 공유하고 탐색 시 [부분 렌더링](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)을 활성화한다.
- [\<Link> 컴포넌트](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#link-component): `<Link>` 컴포넌트를 사용하여 [클라이언트 측 탐색 및 프리페칭](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)을 수행한다.
- [오류 처리](https://nextjs.org/docs/app/building-your-application/routing/error-handling): 커스텀 오류 페이지를 생성하여 프로덕션 환경에서 [catch-all 오류](https://nextjs.org/docs/app/building-your-application/routing/error-handling)와 [404 오류](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)를 우아하게 처리한다.
- [컴포지션 패턴](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns): 서버 및 클라이언트 컴포넌트에 권장되는 컴포지션 패턴을 따르고 ["use client" 경계](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#moving-client-components-down-the-tree)의 배치를 확인하여 불필요하게 클라이언트 측 JavaScript 번들을 증가시키지 않도록 한다.
- [동적 함수](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-functions): [cookies()](https://nextjs.org/docs/app/api-reference/functions/cookies)와 같은 동적 함수와 [`searchParams`](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) prop은 전체 경로를 [동적 렌더링](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)으로 옵트인시킨다는 점에 유의한다([루트 레이아웃](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#root-layout-required)에서 사용되는 경우 전체 애플리케이션에 적용됨). 동적 함수 사용이 의도적인지 확인하고 적절한 경우 `<Suspense>` 경계로 감싸야 한다.

:::tip
[부분 프리렌더링(실험적)](https://nextjs.org/blog/next-14#partial-prerendering-preview)은 전체 경로를 동적 렌더링으로 옵트인하지 않고도 경로의 일부를 동적으로 만들 수 있게 해준다.
:::

### 데이터 가져오기 및 캐싱 {#data-fetching-and-caching}

- [서버 컴포넌트](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#fetching-data-on-the-server): 서버 컴포넌트를 사용하여 서버에서 데이터를 가져오는 이점을 활용한다.
- [라우트 핸들러](https://nextjs.org/docs/app/building-your-application/routing/route-handlers): 클라이언트 컴포넌트에서 백엔드 리소스에 액세스하기 위해 라우트 핸들러를 사용한다. 그러나 추가 서버 요청을 피하기 위해 서버 컴포넌트에서 라우트 핸들러를 호출하지 않아야 한다.
- [스트리밍](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming): 로딩 UI와 React Suspense를 사용하여 UI를 서버에서 클라이언트로 점진적으로 전송하고 데이터를 가져오는 동안 전체 경로가 차단되는 것을 방지한다.
- [병렬 데이터 가져오기](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#parallel-and-sequential-data-fetching): 데이터를 병렬로 가져와 네트워크 워터폴을 줄일 수 있다. 또한 필요한 경우 [데이터 프리로딩](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#preloading-data)을 고려한다.
- [데이터 캐싱](https://nextjs.org/docs/app/building-your-application/caching#data-cache): 데이터 요청이 캐시되는지 여부를 확인하고 적절한 경우 캐싱을 옵트인한다. `fetch` 를 사용하지 않는 요청이 캐시되는지 확인한다.
- [정적 이미지](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets): `public` 디렉토리를 사용하여 애플리케이션의 정적 에셋(예: 이미지)을 자동으로 캐시한다.

### UI 및 접근성 {#ui-and-accessiblility}

- [폼과 유효성 검사](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms): 서버 액션을 사용하여 폼 제출, 서버 측 유효성 검사를 처리하고 오류를 처리한다.
- [폰트 모듈](https://nextjs.org/docs/app/building-your-application/optimizing/fonts): 폰트 모듈을 사용하여 폰트를 최적화한다. 폰트 파일을 다른 정적 에셋과 함께 자동으로 호스팅하고 외부 네트워크 요청을 제거하며 [레이아웃 시프트](https://web.dev/articles/cls)를 줄인다.
- [\<Image> 컴포넌트](https://nextjs.org/docs/app/building-your-application/optimizing/images): 이미지 컴포넌트를 사용하여 이미지를 최적화한다. 자동으로 이미지를 최적화하고 레이아웃 시프트를 방지하며 WebP 또는 AVIF와 같은 최신 형식으로 제공한다.
- [\<Script> 컴포넌트](https://nextjs.org/docs/app/building-your-application/optimizing/scripts): 스크립트 컴포넌트를 사용하여 써드파티 스크립트를 최적화한다. 스크립트를 자동으로 지연시키고 메인 스레드를 차단하지 않도록 한다.
- [ESLint](https://nextjs.org/docs/architecture/accessibility#linting): 내장된 `eslint-plugin-jsx-a11y` 플러그인을 사용하여 접근성 문제를 조기에 발견한다.

### 보안 {#security}

- [테인팅(Tainting)](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#preventing-sensitive-data-from-being-exposed-to-the-client): 데이터 객체 및/또는 특정 값을 테인팅하여 클라이언트에 민감한 데이터가 노출되는 것을 방지한다.
- [서버 액션](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization): 사용자가 서버 액션을 호출할 수 있는 권한이 있는지 확인한다. 권장되는 [보안 관행](https://nextjs.org/blog/security-nextjs-server-components-actions)을 검토한다.
- [환경 변수](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables): `.env.*` 파일이 `.gitignore` 에 추가되었는지 확인하고 공개 변수만 `NEXT_PUBLIC_` 접두사를 붙인다.
- [콘텐츠 보안 정책](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy): 크로스 사이트 스크립팅, 클릭재킹 및 기타 코드 주입 공격과 같은 다양한 보안 위협으로부터 애플리케이션을 보호하기 위해 콘텐츠 보안 정책을 추가하는 것을 고려한다.

### 메타데이터 및 SEO {#metadata-and-seo}

- [메타데이터 API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata): 메타데이터 API를 사용하여 페이지 제목, 설명 등을 추가하여 애플리케이션의 검색 엔진 최적화(SEO)를 개선한다.
- [오픈 그래프(OG) 이미지](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image): 소셜 공유를 위해 애플리케이션을 준비하기 위해 OG 이미지를 생성한다.
- [사이트맵](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps)과 [로봇](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots): 사이트맵과 로봇 파일을 생성하여 검색 엔진이 페이지를 크롤링하고 인덱싱할 수 있도록 한다.

### 타입 안전성 {#type-safety}

- TypeScript 및 [TS 플러그인](https://nextjs.org/docs/app/building-your-application/configuring/typescript): TypeScript와 TypeScript 플러그인을 사용하여 더 나은 타입 안전성을 확보하고 오류를 조기에 발견할 수 있도록 한다.

## 프로덕션에 배포하기 전에 {#before-going-to-production}

프로덕션에 배포하기 전에 `next build` 를 실행하여 애플리케이션을 로컬로 빌드하고 빌드 오류를 잡을 수 있다. 그런 다음 `next start` 를 실행하여 프로덕션과 유사한 환경에서 애플리케이션의 성능을 측정할 수 있다.

### Core Web Vitals {#core-web-vitals}

프로덕션 환경에서 애플리케이션의 성능을 평가하고 개선하기 위해 Lighthouse와 Core Web Vitals를 활용하는 것이 중요하다.

Lighthouse는 Google에서 제공하는 오픈소스 자동화 도구로, 웹 페이지의 품질을 평가하고 개선 방안을 제안한다. 다음과 같은 영역에 대한 평가를 수행한다:

1. **성능**: 페이지 로딩 속도, 상호 작용성, 시각적 안정성 등을 측정한다.
2. **접근성**: 웹 콘텐츠 접근성 지침(WCAG)을 기반으로 접근성 문제를 식별한다.
3. **모범 사례**: 웹 개발 모범 사례 준수 여부를 평가한다.
4. **SEO**: 검색 엔진 최적화에 도움이 되는 요소를 확인한다.

Lighthouse를 시크릿 모드(시크릿 창, 익명 모드)에서 실행하는 이유는 브라우저 확장 프로그램, 캐시된 데이터 등의 영향을 받지 않고 사용자가 사이트를 처음 경험할 때의 상태를 시뮬레이션하기 위해서다. 이를 통해 실제 사용자 경험에 더 가까운 결과를 얻을 수 있다.

Lighthouse 테스트는 시뮬레이션된 환경에서 이루어지므로, 실제 사용자 데이터와 함께 분석해야 한다. 이때 중요한 것이 Core Web Vitals이다.

Core Web Vitals는 Google에서 정의한 웹 페이지 성능 지표로, 사용자 경험을 측정하는 핵심 요소다. 다음 세 가지 지표로 구성된다:

1. **Largest Contentful Paint (LCP)**: 페이지의 주요 콘텐츠가 로드되는 데 걸리는 시간을 측정한다.
2. **First Input Delay (FID)**: 사용자가 페이지와 처음 상호 작용할 때 브라우저가 응답하기까지의 지연 시간을 측정한다.
3. **Cumulative Layout Shift (CLS)**: 페이지 로딩 중에 발생하는 예기치 않은 레이아웃 이동의 정도를 측정한다.

Next.js에서는 `useReportWebVitals` 훅을 제공하여 Core Web Vitals 데이터를 분석 도구로 쉽게 전송할 수 있다. 이 훅을 사용하면 Google Analytics, Vercel Analytics 등의 분석 도구에 성능 데이터를 전송할 수 있다.

예를 들어, 다음과 같이 useReportWebVitals 훅을 사용할 수 있다:

```jsx
import { useReportWebVitals } from 'next/vitals';

function App() {
  useReportWebVitals((metrics) => {
    console.log(metrics);
    // 분석 도구로 데이터 전송
  });

  // ...
}

export default App;
```

위 코드에서는 `useReportWebVitals` 훅을 사용하여 Core Web Vitals 데이터를 수집하고, 콘솔에 출력하거나 분석 도구로 전송할 수 있다.

Lighthouse와 Core Web Vitals를 함께 활용하면 애플리케이션의 성능을 종합적으로 평가하고 개선할 수 있다. Lighthouse는 시뮬레이션된 환경에서 페이지 품질을 평가하고 개선 방안을 제안하는 반면, Core Web Vitals는 실제 사용자 경험을 측정하는 데 도움이 된다. 이 두 가지 도구를 함께 사용하여 사용자에게 최적의 경험을 제공할 수 있다.

### 번들 분석 {#analyzing-bundles}

<!-- - @next/bundle-analyzer 플러그인을 사용하여 JavaScript 번들의 크기를 분석하고 애플리케이션 성능에 영향을 미칠 수 있는 대형 모듈과 종속성을 식별하세요.

또한 다음 도구를 사용하면 애플리케이션에 새로운 종속성을 추가할 때의 영향을 이해할 수 있습니다:

- Import Cost
- Package Phobia
- Bundle Phobia
- bundlejs -->

번들 분석은 애플리케이션 성능 최적화에 있어 중요한 단계다. 번들 크기가 클수록 로딩 시간이 길어지고 사용자 경험에 부정적인 영향을 미칠 수 있기 때문이다. Next.js에서는 [`@next/bundle-analyzer` 플러그인](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)을 사용하여 번들 분석을 수행할 수 있다.

`@next/bundle-analyzer` 플러그인은 웹팩 번들 분석기를 Next.js에 통합하여 번들 크기와 구성을 시각화해준다. 이 플러그인을 사용하면 다음과 같은 작업을 수행할 수 있다:

1. **번들 크기 확인**: 각 번들의 크기를 확인하여 애플리케이션의 전체 크기를 파악할 수 있다.
2. **대형 모듈 식별**: 번들 내에서 크기가 큰 모듈을 식별하여 최적화 대상을 찾을 수 있다.
3. **중복 코드 발견**: 여러 번들에서 중복되는 코드를 찾아 제거할 수 있다.
4. **사용하지 않는 코드 제거**: 번들에 포함되었지만 실제로 사용되지 않는 코드를 식별하여 제거할 수 있다.

`@next/bundle-analyzer` 플러그인을 사용하려면 먼저 설치해야 한다:

```bash
npm install --dev @next/bundle-analyzer
```

그런 다음 `next.config.js` 파일에서 플러그인을 설정다:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // 다른 Next.js 구성 옵션
});
```

위 코드에서는 ANALYZE 환경 변수가 'true'로 설정된 경우에만 번들 분석기가 활성화된다.

이제 다음 명령을 실행하여 번들 분석을 수행할 수 있다:

```bash
ANALYZE=true npm run build
```

위 명령을 실행하면 Next.js 애플리케이션이 빌드되고, 번들 분석 결과가 웹 브라우저에 표시된다. 이를 통해 번들 크기와 구성을 시각적으로 확인할 수 있다.

번들 분석 외에도 애플리케이션에 새로운 종속성을 추가할 때 미치는 영향을 이해하는 것이 중요하다. 다음 도구들은 이러한 분석에 도움이 될 수 있다:

1. [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost): VS Code 확장 프로그램으로, 코드 편집기에서 직접 가져오기 문 옆에 번들 크기를 표시해준다.
2. [Package Phobia](https://packagephobia.com/): npm 패키지의 크기와 종속성을 분석하는 웹 도구다.
3. [Bundle Phobia](https://bundlephobia.com/): npm 패키지를 번들링했을 때의 크기를 보여주는 웹 도구다.
4. [bundlejs](https://bundlejs.com/): 웹 애플리케이션의 번들을 분석하고 최적화하는 데 도움이 되는 CLI 도구다.

이러한 도구를 활용하면 종속성 추가로 인한 번들 크기 증가를 사전에 파악하고, 대안을 모색할 수 있다. 예를 들어, 유사한 기능을 제공하는 더 가벼운 라이브러리로 교체하거나, 불필요한 종속성을 제거할 수 있다.

번들 분석과 종속성 영향 분석을 통해 애플리케이션의 성능을 지속적으로 모니터링하고 개선할 수 있다. 이는 사용자 경험 향상과 직결되므로 프로덕션 배포 전후로 수행하는 것이 좋다.

## 배포 후 {#after-deployment}

애플리케이션을 프로덕션 환경에 배포한 후에는 지속적인 모니터링과 개선이 필요하다. 배포 플랫폼마다 제공하는 도구와 통합 기능이 다르므로, 해당 플랫폼에서 제공하는 기능을 적극 활용하는 것이 좋다.

Vercel은 Next.js 애플리케이션 배포에 최적화된 플랫폼으로, 다양한 모니터링 및 분석 도구를 제공한다. Vercel에서 제공하는 주요 기능은 다음과 같다:

1. [분석(Analytics)](https://vercel.com/analytics?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs):
   - Vercel의 내장 분석 대시보드는 애플리케이션의 트래픽과 사용자 행동에 대한 인사이트를 제공한다.
   - 방문자 수, 페이지 조회수, 참조 소스, 지리적 위치 등 다양한 메트릭을 확인할 수 있다.
   - 이를 통해 사용자 경험을 이해하고 개선 영역을 파악할 수 있다.
2. [속도 인사이트(Speed Insights)](https://vercel.com/docs/speed-insights?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs):
   - 속도 인사이트는 실제 사용자 데이터를 기반으로 웹사이트의 성능을 분석한다.
   - 페이지 로딩 속도, 상호 작용 시간 등 핵심 성능 지표를 제공하여 사용자 경험을 평가할 수 있다.
   - 문제가 되는 영역을 식별하고 최적화 작업을 수행할 수 있다.
3. [로깅(Logging)](https://vercel.com/docs/observability/runtime-logs?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs):
   - Vercel은 애플리케이션의 런타임 로그와 활동 로그를 제공한다.
   - 런타임 로그를 통해 애플리케이션에서 발생하는 오류와 경고를 확인하고 문제를 신속하게 해결할 수 있다.
   - 활동 로그는 배포, 빌드, 설정 변경 등 주요 이벤트를 기록하여 변경 사항을 추적할 수 있다.

Vercel 외에도 다양한 타사 도구와 서비스를 활용하여 애플리케이션 모니터링 및 분석을 수행할 수 있다. 예를 들어, Sentry는 실시간 오류 추적 및 모니터링 도구로 널리 사용되며, Google Analytics는 웹 트래픽 분석에 사용된다. Vercel 통합 페이지에서는 다양한 타사 서비스와의 연동 방법을 확인할 수 있다.

프로덕션 배포를 위한 모범 사례를 숙지하고 따르는 것도 중요하다. Vercel은 [프로덕션 체크리스트](https://vercel.com/docs/production-checklist?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs)를 제공하여 배포 전후로 고려해야 할 사항을 안내한다. 체크리스트에는 성능 최적화, 보안, 모니터링 등 다양한 주제가 포함되어 있다.

주요 내용은 다음과 같다:

- 코드 최적화: 번들 크기 최소화, 코드 분할, 캐싱 등을 통해 성능을 최적화한다.
- 데이터베이스 최적화: 인덱싱, 쿼리 최적화, 커넥션 풀링 등을 적용한다.
- 캐싱 전략: CDN, 서버 사이드 캐싱, 클라이언트 사이드 캐싱 등을 활용한다.
- 보안 강화: HTTPS 사용, 환경 변수 관리, 취약점 점검 등을 수행한다.
- 모니터링 및 알람: 애플리케이션 상태를 모니터링하고 이상 징후 발생 시 알람을 설정한다.

Vercel 프로덕션 체크리스트를 참조하여 배포 과정에서 중요한 사항을 누락하지 않도록 주의해야 한다.

이러한 도구와 모범 사례를 활용하면 Next.js 애플리케이션을 안정적이고 효과적으로 모니터링하고 개선할 수 있다. 사용자에게 최상의 경험을 제공하기 위해서는 배포 이후에도 지속적인 관찰과 최적화가 필요하다.
