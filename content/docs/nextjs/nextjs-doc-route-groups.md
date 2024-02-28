---
title: 라우트 그룹
description:
date: 2024-02-27
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/route-groups',
    },
  ]
---

`app` 디렉토리에서 중첩된 폴더는 일반적으로 URL 경로에 매핑된다. 그러나 Route Group을 사용하면 폴더가 경로의 URL에 포함되지 않도록 할 수 있다.

이를 통해 URL 경로 구조에 영향을 주지 않고 라우트 세그먼트와 프로젝트 파일을 논리적 그룹으로 구성할 수 있다.

라우트 그룹은 다음과 같은 용도로 유용하다:

- 사이트 섹션, 의도 또는 팀별로 라우트를 그룹으로 구성한다.
- 동일한 라우트 세그먼트 수준에서 중첩 레이아웃 사용 가능:
  - 여러 루트 레이아웃을 포함하여 동일한 세그먼트에 여러 개의 중첩된 레이아웃 만들기
  - 공통 세그먼트의 라우트 하위 집합에 레이아웃 추가하기

## 컨벤션 {#convention}

폴더 이름을 괄호로 묶어 라우트 그룹을 만들 수 있다: `(folderName)`

## 예제 {#example}

### URL 경로에 영향을 주지 않는 라우트 구성하기 {#organize-routes-without-affecting-the-url-path}

URL에 영향을 주지 않고 라우트를 정리하려면 그룹을 만들어 관련 라우트를 함께 보관한다. 괄호 안의 폴더는 URL에서 생략된다(예: `(marketing)` 또는 `(shop)`).

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-route-groups/1.png)

`(marketing)` 및 `(shop)` 내부의 라우트가 동일한 URL 계층 구조를 공유하더라도 해당 폴더에 `layout.js` 파일을 추가하여 각 그룹에 대해 다른 레이아웃을 만들 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-route-groups/2.png)

### 특정 세그먼트를 레이아웃으로 사용하기 {#opting-specific-segments-into-a-layout}

특정 라우트를 레이아웃에 포함하려면 새 라우트 그룹(예: `(shop)`)을 생성하고 동일한 레이아웃을 공유하는 라우트(예: `account` 및 `cart`)를 그룹으로 이동한다. 그룹 외부의 경로는 레이아웃을 공유하지 않는다(예: `checkout`).

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-route-groups/3.png)

### 다중 루트 레이아웃 만들기 {#creating-multiple-root-layouts}

루트 레이아웃을 여러 개 만들려면 최상위 `layout.js` 파일을 제거하고 각 라우트 그룹 안에 `layout.js` 파일을 추가한다. 이는 애플리케이션을 완전히 다른 UI 또는 경험을 가진 섹션으로 분할하는 데 유용하다. 각 루트 레이아웃에 `<html>` 및 `<body>` 태그를 추가해야 한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-route-groups/4.png)

위의 예에서 `(marketing)` 과 `(shop)` 은 모두 자체 루트 레이아웃을 갖는다.

:::tip

- 라우트 그룹의 이름은 정리를 위한 것 외에는 다른 의미가 없다. URL 경로에는 영향을 미치지 않는다.
- 라우트 그룹을 포함하는 라우트는 다른 경로와 동일한 URL 경로로 리졸브해서는 안 된다. 예를 들어 라우트 그룹은 URL 구조에 영향을 주지 않으므로 `(marketing)/about/page.js` 와 `(shop)/about/page.js` 는 모두 `/about` 으로 리졸브 되어 오류가 발생할 수 있다.
- 최상위 `layout.js` 파일 없이 여러 루트 레이아웃을 사용하는 경우 홈 `page.js` 파일은 라우트 그룹 중 하나에 정의해야 한다(예: `app/(marketing)/page.js`).
- 다중 루트 레이아웃을 네비게이션 하면 클라이언트 사이드 네비게이션과 달리 전체 페이지가 로드된다. 예를 들어 `app/(shop)/layout.js` 를 사용하는 `/cart` 에서 `app/(marketing)/layout.js` 를 사용하는 `/blog` 로 이동하면 전체 페이지가 로드된다. 이는 다중 루트 레이아웃에만 적용된다.
  :::
