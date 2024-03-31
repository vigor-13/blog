---
title: 라우트 정의하기
description:
date: 2024-02-02
modified: 2024-03-26
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/defining-routes',
    },
  ]
---

이 페이지에서는 Next.js 애플리케이션에서 라우트를 정의하고 구성하는 방법을 알아본다.

## 라우트 만들기 {#creating-routes}

**Next.js는 폴더를 사용하여 라우트를 정의하는 파일 시스템 기반 라우터를 사용한다.**

각 폴더는 URL 세그먼트에 매핑되는 라우트 세그먼트를 나타낸다. 중첩 라우트를 만들려면 폴더를 서로 안에 중첩하면 된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-defining-routes/1.png)

라우트 세그먼트에 공개적으로 액세스할 수 있도록 하기 위해 특별한 `page.js` 파일이 사용된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-defining-routes/2.png)

이 예에서는 `/dashboard/analytics` URL 경로에 해당하는 `page.js` 파일이 없기 때문에 공개적으로 액세스할 수 없다. 이 폴더는 컴포넌트, 스타일시트, 이미지 또는 기타 파일들을 저장하는 데 사용할 수 있다.

:::tip
특수 파일은 `.js` , `.jsx` 또는 `.tsx` 확장자만 사용가능하다.
:::

## UI 만들기 {#creating-ui}

각 라우트 세그먼트에 대한 UI를 만들기 위해 특별한 파일 규칙이 사용된다. 가장 일반적인 것은 라우트에 고유한 UI를 표시하는 [`page`](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-pages-and-layouts/) 와 여러 경로에서 공유되는 [`layout`](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-pages-and-layouts/) 이다.

예를 들어, 첫 번째 페이지를 만들려면 `app` 디렉토리에 `page.js` 파일을 추가하고 React 컴포넌트를 export하면 된다:

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```
