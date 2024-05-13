---
title: 최적화
description:
date: 2024-05-13
tags: ['optimization']
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/optimizing',
    },
  ]
---

Next.js는 애플리케이션의 속도와 [코어 웹 바이탈(Core Web Vitals)](https://web.dev/vitals/) 향상을 위해 다양한 내장 최적화 기능을 제공한다.

이 가이드에서는 사용자 경험 개선을 위해 활용할 수 있는 최적화 방법들을 살펴본다.

## 내장 컴포넌트 {#built-in-components}

내장 컴포넌트는 일반적인 UI 최적화를 쉽게 구현할 수 있도록 도와준다. 주요 내장 컴포넌트는 다음과 같다:

| 컴포넌트   | 설명                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| **Image**  | HTML의 `<img>` 태그와 비슷하지만, 이미지 로딩을 지연시키고 화면 크기에 맞게 자동으로 크기를 조절하여 성능을 높인다. |
| **Link**   | HTML의 `<a>` 태그와 비슷하지만, 링크된 페이지를 프리페치하여 페이지 전환을 더 빠르고 부드럽게 만든다.               |
| **Script** | HTML의 `<script>` 태그와 비슷하지만, 외부 스크립트의 로딩과 실행을 더 잘 제어할 수 있게 해준다.                     |

이렇게 내장 컴포넌트를 사용하면 개발자가 직접 복잡한 최적화 기술을 구현하지 않아도 쉽게 애플리케이션의 성능을 향상시킬 수 있다.

## 메타데이터 {#metadata}

메타데이터는 웹사이트에 대한 추가 정보를 제공하여 검색 엔진이 콘텐츠를 더 잘 이해할 수 있도록 도와준다. 이를 통해 검색 엔진 최적화(SEO)를 향상시킬 수 있다. 또한 메타데이터를 통해 소셜 미디어에서 웹사이트의 콘텐츠가 어떻게 보여질지 설정할 수 있어, 다양한 플랫폼에서 일관되고 매력적인 사용자 경험을 제공할 수 있다.

Next.js에서는 메타데이터 API를 사용하여 웹 페이지의 `<head>` 를 쉽게 수정할 수 있다. 메타데이터를 설정하는 방법은 두 가지다:

1. **구성 기반 메타데이터**: `layout.js` 나 `page.js` 파일에서 [정적 `metadata` 객체](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-object)나 [`generateMetadata` 함수](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)를 내보내는 방식이다.
2. **파일 기반 메타데이터**: 특별한 파일을 페이지 경로에 추가하는 방식으로, 이 파일은 정적이거나 동적으로 생성될 수 있다.

이 외에도 JSX와 CSS를 활용하여 동적인 Open Graph 이미지를 만들 수 있다. Open Graph는 소셜 미디어에서 웹 콘텐츠를 공유할 때 사용되는 메타데이터 형식이다.

## 정적 에셋 {#static-assets}

Next.js에는 `/public` 폴더라는 특별한 디렉토리가 있다. 이 폴더는 이미지, 글꼴, 기타 파일과 같이 변경되지 않는 정적인 자원을 저장하는 데 사용된다.

`/public` 폴더에 파일을 저장하면 웹사이트에서 쉽게 접근할 수 있다. 예를 들어 `/public/logo.png` 파일은 웹사이트에서 `/logo.png` 경로로 접근할 수 있다.

이 폴더의 파일들은 CDN(Content Delivery Network) 서비스를 통해 전 세계 사용자들에게 빠르게 전달될 수 있다. CDN은 전 세계에 분산된 서버를 사용하여 사용자와 가까운 곳에서 파일을 제공하므로, 웹사이트의 로딩 속도를 향상시킬 수 있다.

따라서 `/public` 폴더를 활용하면 웹사이트의 성능을 쉽게 높일 수 있다.

## 분석 및 모니터링 {#analytics-and-monitoring}

큰 규모의 웹 애플리케이션을 만들 때는 애플리케이션이 얼마나 잘 작동하는지 파악하는 것이 중요하다. Next.js는 이를 위해 많은 사람들이 사용하는 분석 및 모니터링 도구들과 쉽게 통합할 수 있다.

- 분석 도구는 웹사이트 방문자 수, 이용 시간, 클릭한 링크 등 사용자 행동에 대한 정보를 수집하고 분석하여 웹사이트 개선에 활용할 수 있게 해준다.
- 모니터링 도구는 웹사이트의 성능, 에러 발생 여부, 서버 상태 등을 실시간으로 확인할 수 있게 해준다. 이를 통해 문제를 빠르게 발견하고 해결할 수 있다.

Next.js에서는 [OpenTelemetry](https://nextjs.org/docs/pages/building-your-application/optimizing/open-telemetry) 와 [Instrumentation](https://nextjs.org/docs/pages/building-your-application/optimizing/instrumentation)이라는 기술을 활용하여 이러한 도구들을 더 쉽게 사용할 수 있다.

| 주제                                                                                                       | 설명                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [이미지](https://nextjs.org/docs/app/building-your-application/optimizing/images)                          | 내장 `next/image` 컴포넌트로 이미지를 최적화한다.                                                                        |
| [비디오](https://nextjs.org/docs/app/building-your-application/optimizing/videos)                          | Next.js 애플리케이션에서 비디오를 최적화하기 위한 권장 사항과 모범 사례.                                                 |
| [글꼴](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)                             | 내장 `next/font` 로더로 애플리케이션의 웹 글꼴을 최적화한다.                                                             |
| [메타데이터](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)                    | 메타데이터 API를 사용하여 모든 레이아웃이나 페이지에서 메타데이터를 정의한다.                                            |
| [스크립트](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)                       | 내장 Script 컴포넌트로 제3자 스크립트를 최적화한다.                                                                      |
| [번들 분석기](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)            | `@next/bundle-analyzer` 플러그인을 사용하여 JavaScript 번들의 크기를 분석한다.                                           |
| [지연 로딩](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)                 | 라이브러리와 React 컴포넌트를 지연 로딩하여 애플리케이션의 로딩 성능을 개선한다.                                         |
| [분석](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)                         | Next.js Speed Insights를 사용하여 페이지 성능을 측정하고 추적한다.                                                       |
| [계측](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)                   | Next.js 앱에서 서버 시작 시 코드를 실행하기 위해 계측을 사용하는 방법을 알아본다.                                        |
| [OpenTelemetry](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)           | OpenTelemetry로 Next.js 앱을 계측하는 방법을 알아본다.                                                                   |
| [정적 에셋](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)                | Next.js를 사용하면 `public` 디렉터리에서 이미지와 같은 정적 파일을 제공할 수 있다. 그 작동 방식은 여기서 알아볼 수 있다. |
| [제3자 라이브러리](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries) | `@next/third-parties` 패키지로 애플리케이션에서 제3자 라이브러리의 성능을 최적화한다.                                    |
| [메모리 사용량](https://nextjs.org/docs/app/building-your-application/optimizing/memory-usage)             | 개발 및 프로덕션 환경에서 애플리케이션에서 사용되는 메모리를 최적화한다.                                                 |
