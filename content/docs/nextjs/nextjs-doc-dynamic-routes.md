---
title: 동적 라우트
description:
date: 2024-03-04
tags: [route]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes',
    },
  ]
---

정확한 세그먼트 이름을 미리 알 수 없고 동적 데이터로 경로를 생성하려는 경우 요청 시 결정되거나 빌드 시 미리 렌더링되는 동적 세그먼트를 사용한다.

## 컨벤션 {#convention}

동적 세그먼트는 폴더의 이름을 대괄호로 묶어 만들 수 있다: `[folderName]`. 예: `[id]` 또는 `[slug]`.

동적 세그먼트는 `layout`, `page`, `route` 및 `generateMetadata` 함수에 매개변수로 전달된다.

## 예시 {#example}

예를 들어 블로그에는 다음과 같은 경로 `app/blog/[slug]/page.js` 가 포함될 수 있으며, 여기서 `[slug]`는 블로그 게시글의 동적 세그먼트다.

```tsx
// app/blog/[slug]/page.tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <div>My Post: {params.slug}</div>;
}
```

| 라우트                    | 예시 URL  | 파라미터        |
| ------------------------- | --------- | --------------- |
| `app/blog/[slug]/page.js` | `/blog/a` | `{ slug: 'a' }` |
| `app/blog/[slug]/page.js` | `/blog/b` | `{ slug: 'b' }` |
| `app/blog/[slug]/page.js` | `/blog/c` | `{ slug: 'c' }` |

:::tip
동적 세그먼트는 `pages` 디렉토리의 [동적 라우트](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)와 동일하다.
:::

## 정적 파라미터 생성하기 {#generating-static-params}

`generateStaticParams` 함수는 동적 라우트 세그먼트와 함께 사용하여 요청 시점의 온디맨드가 아닌 빌드 시점에 정적으로 경로를 생성할 수 있다.

```tsx
//  app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

`generateStaticParams` 함수의 가장 큰 장점은 데이터를 스마트하게 검색할 수 있다는 점이다. `fetch` 요청을 사용하여 `generateStaticParams` 함수 내에서 콘텐츠를 가져오면 요청이 자동으로 캐시된다. 즉, 여러 `generateStaticParams`, 레이아웃 및 페이지에 걸쳐 동일한 인자를 사용하는 `fetch` 요청은 한 번만 수행되므로 빌드 시간이 단축된다.

자세한 내용 및 고급 사용 사례는 [`generateStaticParams` 서버 함수 문서](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)를 참조한다.

## Catch-all 세그먼트 {#catch-all-segments}

동적 세그먼트는 괄호 안에 `[...folderName]` 줄임표를 추가하여 모든 후속 세그먼트를 포함하도록 확장할 수 있다.

예를 들어 `app/shop/[...slug]/page.js` 는 `/shop/clothes` 뿐만 아니라 `/shop/clothes/tops` , `/shop/clothes/tops/t-shirts` 등과도 일치한다.

| 라우트                       | 예시 URL      | 파라미터                    |
| ---------------------------- | ------------- | --------------------------- |
| `app/shop/[...slug]/page.js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `app/shop/[...slug]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[...slug]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

## 선택적 Catch-all 세그먼트 {#optional-catch-all-segments}

캐치올 세그먼트는 파라미터를 이중 대괄호 안에 포함하여 선택 사항으로 만들 수 있다: `[[...folderName]]`.

예를 들어 `app/shop/[[...slug]]/page.js` 는 `/shop/clothes` , `/shop/clothes/tops` , `/shop/clothes/tops/t-shirts` 외에도 `/shop` 과도 일치한다.

캐치올 세그먼트와 선택적 캐치올 세그먼트의 차이점은 후자의 경우 파라미터가 없는 경로도 일치한다는 것이다(위 예제에서는 `/shop`).

| 라우트                         | 예시 URL      | 파라미터                    |
| ------------------------------ | ------------- | --------------------------- |
| `app/shop/[[...slug]]/page.js` | `/shop`       | `{}`                        |
| `app/shop/[[...slug]]/page.js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

## 타입스크립트 {#typescript}

타입스크립트를 사용하는 경우, 구성된 라우트 세그먼트에 따라 `params` 타입을 추가할 수 있다.

```tsx
// app/blog/[slug]/page.tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>My Page</h1>;
}
```

| 라우트                              | 파라미터                                 |
| ----------------------------------- | ---------------------------------------- |
| `app/blog/[slug]/page.js`           | `{ slug: string }`                       |
| `app/shop/[...slug]/page.js`        | `{ slug: string[] }`                     |
| `app/shop/[[slug]]/page.js`         | `{ slug?: string[] }`                    |
| `app/[categoryId]/[itemId]/page.js` | `{ categoryId: string, itemId: string }` |

:::tip
이 작업은 향후 [TypeScript 플러그인](https://nextjs.org/docs/app/building-your-application/configuring/typescript#typescript-plugin)에 의해 자동으로 수행될 수 있다.
:::
