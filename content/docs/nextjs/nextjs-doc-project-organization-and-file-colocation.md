---
title: 프로젝트 구성과 파일 코로케이션
description:
date: 2024-03-02
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/colocation',
    },
  ]
---

라우팅 폴더 및 파일 컨벤션을 제외하고 Next.js는 프로젝트 파일을 구성하고 배치하는 방법에 대한 방법을 강제하지 않는다.

이 페이지에서는 프로젝트를 구성하는 데 사용할 수 있는 기본 동작과 기능을 섦명한다.

## 기본적으로 안전한 코로케이션 {#safe-colocation-by-default}

`app` 디렉토리에서 중첩된 폴더 계층 구조는 라우트 구조를 정의한다.

각 폴더는 URL 경로의 세그먼트에 매핑된 라우트 세그먼트를 나타낸다.

그러나 라우트 구조가 폴더를 통해 정의되어 있더라도 `page.js` 또는 `route.js` 파일이 라우트 세그먼트에 추가될 때까지는 라우트에 공개적으로 액세스할 수 없다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-project-organization-and-file-colocation/1.png)

또한 라우트가 공개적으로 액세스 가능하도록 설정된 경우에도 `page.js` 또는 `route.js` 에서 반환한 콘텐츠만 클라이언트로 전송된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-project-organization-and-file-colocation/2.png)

즉, 프로젝트 파일을 `app` 디렉터리의 라우트 세그먼트 내에 배치해도 라우팅에 영향을 미치지 않는다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-project-organization-and-file-colocation/3.png)

:::tip

- 이는 내부의 모든 파일이 라우트로 간주되는 `pages` 디렉토리와는 다르다.
- 프로젝트 파일을 `app` 에 배치할 수는 있지만 반드시 그럴 필요는 없다. 원하는 경우 `app` 디렉터리 외부에 보관할 수 있다.

:::

## 프로젝트 구성 기능 {#project-organization-features}

Next.js는 프로젝트를 구성하는 데 도움이 되는 몇 가지 기능을 제공한다.

### 프라이빗 폴더 {#private-folders}

프라이빗 폴더는 폴더 앞에 밑줄을 붙여 만들 수 있다: `__folderName`

이는 해당 폴더가 비공개 구현 세부 정보이며 라우팅 시스템에서 고려하지 않아야 함을 나타내므로 해당 폴더 및 모든 하위 폴더를 라우팅에서 제외한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-project-organization-and-file-colocation/4.png)

`app` 디렉터리의 파일은 기본적으로 안전하게 코로케이션할 수 있으므로 코로케이션에 프라이빗 폴더가 필요하지 않다. 하지만 다음과 같은 경우 유용할 수 있다:

- UI 로직과 라우팅 로직 분리.
- 프로젝트와 Next.js 에코시스템 전반에서 내부 파일을 일관되게 정리한다.
- 코드 편집기에서 파일 정렬 및 그룹화.
- 향후 Next.js 파일 규칙과 충돌할 수 있는 잠재적인 명명 충돌 방지.

:::tip

- 프레임워크 규칙은 아니지만 동일한 밑줄 패턴을 사용하여 비공개 폴더 외부의 파일을 "비공개"로 표시하는 것도 고려해 볼 수 있다.
- 폴더 이름 앞에 `%5F`(밑줄의 URL 인코딩 형식)를 붙여서 밑줄로 시작하는 URL 세그먼트를 만들 수 있다: `%5FfolderName`.
- 프라이빗 폴더를 사용하지 않는 경우 예기치 않은 이름 지정 충돌을 방지하기 위해 Next.js 특수 파일 규칙을 알아두면 도움이 된다.

:::

### 라우트 그룹 {#route-groups}

폴더를 괄호로 묶어 라우트 그룹을 만들 수 있다: `(folderName)`

이는 폴더가 조직 관리용이며 URL 경로에 포함되지 않아야 함을 나타낸다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-project-organization-and-file-colocation/5.png)

라우트 그룹은 다음과 같은 경우에 유용하다:

- 사이트 섹션, 의도 또는 팀별로 경로를 그룹으로 구성한다.
- 동일한 라우트 세그먼트 수준에서 중첩 레이아웃을 활성화한다:
  - 다중 루트 레이아웃을 포함하여 동일한 세그먼트에 여러 개의 중첩된 레이아웃 만들기
  - 공통 세그먼트의 경로 하위 집합에 레이아웃 추가하기

### src 경로 {#src-directory}

Next.js는 애플리케이션 코드(`app` 포함)를 `src` 디렉토리에 배치할 수 있다. 이렇게 하면 대부분 프로젝트의 루트에 있는 프로젝트 구성 파일에서 애플리케이션 코드를 분리할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-project-organization-and-file-colocation/6.png)

### 모듈 경로 별칭 {#module-path-aliase}

Next.js는 모듈 경로 별칭을 지원하므로 깊게 중첩된 프로젝트 파일에서 임포트를 쉽게 읽고 유지 관리할 수 있다.

```js
// app/dashboard/settings/analytics/page.js

// before
import { Button } from '../../../components/button';

// after
import { Button } from '@/components/button';
```

## 프로젝트 구성 전략 {#project-organization-strategies}

Next.js 프로젝트에서 파일과 폴더를 정리하는 데 있어 "옳고 그른" 방법은 없다.

이번 섹션에서는 일반적인 프로젝트 구성 전략에 대한 사례를 소개한다. 여기서 중요한 것은 여러분과 팀에 적합한 전략을 선택하고 프로젝트 전체에서 일관성을 유지하는 것이다.

:::note
아래 예제에서는 `components` 와 `lib` 폴더를 일반화된 플레이스홀더로 사용하고 있으며, 그 이름에는 특별한 프레임워크의 의미가 없으며 프로젝트에서 `ui`, `utils`, `hook`, `style` 등과 같은 다른 폴더를 사용할 수도 있다.
:::

### app 폴더 외부에 프로젝트 파일을 저장하기 {#store-project-files-outside-of-app}

이 전략은 모든 애플리케이션 코드를 프로젝트 루트의 공유 폴더에 저장하고 `app` 디렉터리는 순전히 라우팅 목적으로만 사용한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-project-organization-and-file-colocation/7.png)

### 프로젝트 파일을 app의 최상위에 폴더에 저장하기 {#store-project-files-in-top-level-folders-inside-of-app}

이 전략은 모든 애플리케이션 코드를 `app` 디렉터리의 루트에 있는 공유 폴더에 저장한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-project-organization-and-file-colocation/8.png)

### 프로젝트 파일을 기능 또는 라우트 단위로 분리한다 {#split-project-files-by-feature-or-route}

이 전략은 전역적으로 공유되는 애플리케이션 코드를 루트 앱 디렉토리에 저장하고 이를 사용하는 라우트 세그먼트로 보다 구체적인 애플리케이션 코드를 분할한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-project-organization-and-file-colocation/9.png)
