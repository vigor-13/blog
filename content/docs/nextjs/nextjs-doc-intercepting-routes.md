---
title: 라우트 인터셉트
description:
date: 2024-03-05
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes',
    },
  ]
---

라우트를 가로채면 현재 레이아웃 내에서 애플리케이션의 다른 라우트를 로드할 수 있다. 이 라우팅 패러다임은 사용자가 다른 컨텍스트로 전환하지 않고도 라우트의 콘텐츠를 렌더링하려는 경우에 유용하다.

예를 들어 피드에서 사진을 클릭하면 사진을 모달에 표시하여 피드 위에 오버레이할 수 있다. 이 경우 Next.js는 `/photo/123` 라우트를 가로채서 URL을 마스킹한 후 `/feed` 위에 오버레이한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-intercepting-routes/1.png)

그러나 공유 가능한 URL을 클릭하거나 페이지를 새로 고침하여 사진으로 이동하는 경우 라우트를 인터셉트하지 않고 모달 대신 전체 사진 페이지가 렌더링되어야 한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-intercepting-routes/2.png)

## 컨벤션 {#convention}

세그먼트를 대상으로 하는 상대 경로 컨벤션 `../` 과 유사한 `(..)` 컨벤션으로 인터셉트 라우트를 정의할 수 있다.

다음과 같이 사용할 수 있다:

- `(.)` 를 사용하여 같은 레벨의 세그먼트와 일치시킨다.
- `(..)` 를 사용하여 한 수준 위의 세그먼트와 일치시킨다.
- `(..)(..)` 는 두 수준 위의 세그먼트와 일치시킨다.
- `(...)` 는 루트 `app` 디렉터리에서 세그먼트를 일치시킨다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-intercepting-routes/3.png)

:::note
`(..)` 컨벤션은 파일 시스템이 아닌 라우트 세그먼트를 기준으로 한다는 점에 유의한다.
:::

## 예제 {#examples}

### 모달 {#modals}

인터셉트 라우트를 [병렬 라우트](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-parallel-routes/)와 함께 사용하여 모달을 만들 수 있다. 이를 통해 모달을 만들 때 다음과 같은 일반적인 문제를 해결할 수 있다:

- URL을 통해 모달 콘텐츠를 공유할 수 있도록 만들기.
- 페이지를 새로 고칠 때 모달을 닫는 대신 컨텍스트를 유지한다.
- 뒤로 가기에서 이전 경로로 이동하지 않고 모달을 닫는다.
- 앞으로 가기에서 모달을 다시 열기.

사용자가 클라이언트 사이드 네비게이션을 사용하여 갤러리에서 사진 모달을 열거나 공유 가능한 URL에서 직접 사진 페이지로 이동할 수 있는 다음 UI 패턴을 구현할 수 있다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-intercepting-routes/4.png)

위의 예에서 `@modal` 은 세그먼트가 아니라 슬롯이므로 `photo` 세그먼트 경로에 `(..)` 를 사용할 수 있다. 즉, `photo` 경로는 파일 시스템에서는 레벨이 두 단계 더 높지만 세그먼트 레벨에서는 한 단계 더 높다.

:::tip
다른 예로는 상단 네비게이션바에 로그인 모달을 열면서 전용 `/login` 페이지가 있거나 사이드 모달에서 쇼핑 카트를 여는 것 등이 있다.
:::
