---
title: 라우팅 기초
description:
date: 2024-02-01
modified: 2024-03-26
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing',
    },
  ]
---

모든 애플리케이션의 뼈대는 라우팅이다. 이 페이지에서는 **웹 라우팅의 기본 개념**과 Next.js에서 **라우팅을 처리하는 방법**을 소개한다.

## 용어 {#terminology}

먼저, 문서 전체에서 다음과 같은 용어가 사용된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-routing-fundamentals/1.png)

| 용어                  | 설명                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **트리(Tree)**        | 계층 구조를 시각화하기 위한 컨벤션이다. (예를 들어 컴포넌트 트리, 폴더 구조 등을 말한다.) |
| **서브트리(Subtree)** | 루트에서 시작하여 리프로 끝나는 트리의 한 부분을 말한다.                                  |
| **루트(Root)**        | 트리 또는 서브트리의 첫 번째 노드를 말한다.                                               |
| **리프(Leaf)**        | 서브트리의 자식이 없는 마지막 노드를 말한다.                                              |

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-routing-fundamentals/2.png)

| 용어                      | 설명                                                |
| ------------------------- | --------------------------------------------------- |
| **URL 세그먼트(Segment)** | 슬래시( `/` )로 구분된 URL 경로의 한 부분을 말한다. |
| **URL 경로(Path)**        | URL에서 도메인 뒷 부분을 말한다.                    |

## 앱 라우터(App Router) {#the-app-router}

Next.js 13 버전 부터 [React Server Component](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-rendering-server-components/)에 기반한 새로운 **앱 라우터**가 도입되었다.

앱 라우터는 `app` 이라는 새 디렉토리에서 작동한다. `app` 은 `pages` 디렉토리와 함께 작동하여 점진적으로 적용할 수 있다. 따라서 기존 `pages` 디렉토리로 유지하는 동시에 일부 경로를 `app` 디렉토리로 구현할 수 있다.

:::tip
**앱 라우터는 페이지 라우터보다 우선한다.** `app` 과 `pages` 에는 동일한 URL 경로가 있으면 안 되며 충돌을 방지하기 위해 빌드 타임 오류가 발생한다.
:::

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-routing-fundamentals/3.png)

**기본적으로 `app` 내부의 컴포넌트는 React Server Component다.** 이는 성능 최적화를 위한 것으로 쉽게 적용할 수 있으며, 클라이언트 컴포넌트를 사용할 수도 있다.

## 폴더와 파일의 역할 {#roles-of-folders-and-files}

**Next.js는 파일 시스템 기반 라우터를 사용한다**:

- **폴더**는 라우트를 정의하는 데 사용된다. ([참조](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-defining-routes/))
- **파일**은 라우트 세그먼트에 대응하는 UI를 만드는 데 사용된다. ([참조](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-routing-fundamentals/#file-conventions))

## 라우트 세그먼트(Route Segment) {#route-segments}

라우트의 각 폴더는 **라우트 세그먼트**를 나타낸다. 각 라우트 세그먼트는 **URL 경로**의 해당 **세그먼트**에 매핑된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-routing-fundamentals/4.png)

## 중첩 라우트(Nested Route) {#nested-routes}

중첩된 라우트를 만들려면 폴더를 중첩하면 된다. 예를 들어, `app` 디렉토리에 두 개의 폴더를 중첩하여 새로운 `/dashboard/settings` 라우트를 만들 수 있다.

`/dashboard/settings` 라우트는 세 개의 세그먼트로 구성된다:

- `/` (루트 세그먼트)
- `dashboard` (세그먼트)
- `settings` (리프 세그먼트)

## 파일 컨벤션 {#file-conventions}

Next.js는 중첩된 라우트에서 특정 동작을 하는 UI를 만들기 위한 특수 파일 세트를 제공한다:

| 파일           | 설명                                              |
| -------------- | ------------------------------------------------- |
| `layout`       | 세그먼트 및 해당 하위 세그먼트의 공유 레이아웃 UI |
| `page`         | 공개적으로 액세스할 수 있는 페이지 UI             |
| `loading`      | 세그먼트와 하위 세그먼트를 위한 로딩 UI           |
| `not-found`    | 세그먼트와 하위 세그먼트를 위한 Not found UI      |
| `error`        | 세그먼트와 하위 세그먼트를 위한 에러 UI           |
| `global-error` | 전역 에러 UI                                      |
| `route`        | 서버 사이드 API 엔드포인트                        |
| `template`     | 재사용되는 레이아웃 UI                            |
| `default`      | 병렬 라우트를 위한 폴백 UI                        |

:::note
위의 파일들은 `.js` , `.jsx` 또는 `.tsx` 확장자만 사용가능하다.
:::

## 컴포넌트 계층 {#component-hierarchy}

라우트 세그먼트의 특수 파일에 정의된 React 컴포넌트는 특정 계층 구조로 렌더링된다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-routing-fundamentals/5.png)

- `layout.js`
- `template.js`
- `error.js` (React error boundary)
- `loading.js` (React suspense boundary)
- `not-found.js` (React error boundary)
- `page.js` 또는 중첩된 `layout.js`

중첩된 라우트에서 세그먼트의 컴포넌트는 상위 세그먼트의 컴포넌트 안에 중첩된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-routing-fundamentals/6.png)

## 코로케이션(Colocation) {#colocation}

특수 파일 외에도 컴포넌트, 스타일, 테스트 등 고유한 파일을 `app` 디렉터리의 폴더에 배치할 수 있다.

폴더는 라우트를 정의하지만 `page.js` 또는 `route.js` 가 리턴하는 콘텐츠만 공개적으로 주소 지정이 가능하기 때문이다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-routing-fundamentals/7.png)

## 고급 라우팅 패턴 {#advanced-routing-patterns}

또한 앱 라우터는 고급 라우팅 패턴을 구현하는 데 도움이 되는 일련의 규칙을 제공한다. 여기에는 다음이 포함된다:

- [**병렬 라우트**](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-parallel-routes/) : 한 뷰에서 동시에 두 개 이상의 페이지를 동시에 표시하고 독립적으로 탐색할 수 있도록 하는 기능을 제공한다. 이를 사용하여 자체 하위 네비게이션을 갖는 분할된 UI를 구현할 수 있다. (예: 대시보드)
- [**라우트 인터셉트**](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-intercepting-routes/) : 라우트를 가로채서 다른 라우트의 컨텍스트에 표시할 수 있다. 현재 페이지의 컨텍스트를 유지하는 것이 중요한 경우에 사용할 수 있다. 예를 들어, 하나의 작업을 편집하는 동안 모든 작업을 보거나 피드에서 사진을 확대하는 경우가 있다.

이러한 패턴을 사용하면 더 풍부하고 복잡한 UI를 구축할 수 있으므로 소규모 팀이나 개별 개발자가 구현하기에는 복잡했던 기능을 대중화할 수 있다.
