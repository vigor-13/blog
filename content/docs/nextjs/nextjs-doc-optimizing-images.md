---
title: 이미지 최적화
description:
date: 2024-05-13
tags: ['optimization', 'image']
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/optimizing/images',
    },
  ]
---

웹사이트를 만들 때 이미지는 페이지 로딩 속도에 큰 영향을 줄 수 있다. 웹 사이트의 이미지 용량이 크면 페이지 로딩 시간이 길어져 사용자 경험이 나빠질 수 있다.

Next.js는 이런 문제를 해결하기 위해 Image 컴포넌트를 제공한다. 이 컴포넌트는 HTML의 `<img>` 태그를 확장한 것으로, 이미지를 자동으로 최적화해준다.

Image 컴포넌트의 주요 기능은 다음과 같다:

| 기능                   | 설명                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **크기 최적화**        | WebP나 AVIF와 같은 최신 이미지 포맷을 사용하여 각 디바이스에 맞는 크기의 이미지를 자동으로 제공한다.                            |
| **화면 깜빡임 방지**   | 이미지 로딩 중에 레이아웃 이동을 자동으로 방지한다.                                                                             |
| **빠른 페이지 로딩**   | 이미지는 뷰포트에 진입할 때만 네이티브 브라우저 지연 로딩을 사용하여 로드되며, 선택적으로 흐릿한 플레이스홀더를 사용할 수 있다. |
| **유연한 이미지 처리** | 원격 서버에 저장된 이미지도 필요에 따라 크기를 조절할 수 있다.                                                                  |

## 사용법 {#usage}

```javascript
import Image from 'next/image';
```

### 로컬 이미지 {#local-images}

로컬에 있는 이미지를 사용하고 싶다면, 이미지 파일( `.jpg` , `.png` , `.webp` 등)을 `import` 해야 한다.

```jsx
// app/page.js
import Image from 'next/image';
import profilePic from './me.png';

export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="Picture of the author"
      // width={500} 자동으로 제공됨
      // height={500} 자동으로 제공됨
      // blurDataURL="data:..." 자동으로 제공됨
      // placeholder="blur" // 로딩 중 흐림 효과 옵션
    />
  );
}
```

Next.js는 가져온 파일을 기반으로 이미지의 `width` 와 `height` 를 자동으로 결정한다. 이러한 값은 이미지가 로드되는 동안 누적 레이아웃 이동을 방지하는 데 사용된다.

추가로 Next.js는 로딩 중에 blur 이미지를 보여주는 `placeholder` 옵션도 제공한다.

```jsx
<Image
// (...)
// placeholder="blur" // 로딩 중 흐림 효과 옵션
/>
```

:::warning

주의할 점은 `import` 가 항상 정적(static)이어야 한다는 것이다. 동적인 `await import()` 또는 `require()`는 지원되지 않는다.

```jsx
// 🚫 동작하지 않는다.
const profilePic = await import('./me.png');
```

빌드 시 분석할 수 있도록 `import` 는 정적이어야 한다.

:::

### 원격 이미지 {#remote-images}

웹에 있는 이미지를 사용하려면 `src` 속성에 이미지 URL을 넣어주면 된다.

```jsx
<Image
  src="https://s3.amazonaws.com/my-bucket/profile.png"
  // ...
/>
```

그런데 Next.js는 빌드 과정에서 원격 이미지 파일에 접근할 수 없기 때문에, 이미지의 [`width`](https://nextjs.org/docs/app/api-reference/components/image#width) 와 [`height`](https://nextjs.org/docs/app/api-reference/components/image#height) 값을 직접 명시해 주어야 한다. [`blurDataURL`](https://nextjs.org/docs/app/api-reference/components/image#blurdataurl) 속성은 선택 사항이다.

```jsx
<Image
  src="https://s3.amazonaws.com/my-bucket/profile.png"
  width={500}
  height={500}
  // ...
/>
```

`width` 와 `height` 값은 이미지의 가로세로 비율을 결정하고, 이미지 로딩 중에 레이아웃 이동을 방지하는 데 사용된다. 하지만 _실제 렌더링되는 이미지의 크기를 결정하는 것은 아니다._ 자세한 내용은 [문서](https://nextjs.org/docs/app/building-your-application/optimizing/images#image-sizing)를 참조한다.

이미지 최적화를 안전하게 사용하려면 `next.config.js` 파일에서 허용되는 URL 패턴을 정의해야 한다. 악의적인 사용을 방지하기 위해 가능한 한 구체적으로 작성하는 것이 좋다.

```js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
};
```

위의 예시는 특정 AWS S3 버킷의 이미지만 허용한다.

`remotePatterns` 설정에 대해 더 자세한 내용은 [문서](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns)를 참조한다.

만약 이미지 `src` 에 상대 경로 URL을 사용하고 싶다면 [`loader`](https://nextjs.org/docs/app/api-reference/components/image#loader) 를 사용하면 된다.

### 도메인 {#domains}

Next.js는 기본적으로 자체 이미지 최적화 API를 사용한다. 이 API는 이미지 크기를 조정하고, 품질을 최적화하며, WebP나 AVIF 같은 최신 포맷으로 변환해준다. 그런데 이 API를 사용하려면 이미지가 같은 도메인에 있어야 한다.

하지만 가끔은 다른 도메인(원격)에 있는 이미지를 최적화하고 싶은 경우가 있다. 이럴 때는 `next.config.js` 파일에서 `remotePatterns` 를 설정해서 허용할 도메인을 지정해야 한다.

```js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/assets/**',
      },
    ],
  },
};
```

위 코드는 `https://example.com/assets/` 경로의 이미지를 허용한다.

이렇게 설정하면 Next.js 이미지 최적화 API를 사용하면서도 원격 이미지를 사용할 수 있다.

```jsx
<Image
  src="https://example.com/assets/profile.png"
  width={500}
  height={500}
  // ...
/>
```

`remotePatterns` 를 설정하는 건 보안에도 중요하다. 만약 아무 도메인이나 허용하면 악의적인 사용자가 우리 애플리케이션을 통해 이미지를 최적화하는 데 악용할 수 있다. 그래서 신뢰할 수 있는 도메인만 허용하는 게 좋다.

`loader` 속성은 기본값 그대로 두면 된다. 그러면 Next.js가 자동으로 내장 이미지 최적화 API를 사용한다.

:::note
`remotePatterns` 에 대한 자세한 내용은 [문서](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns)를 참조한다.
:::

### 로더

<!-- 앞의 예제에서는 로컬 이미지에 부분 URL(`"/me.png"`)이 제공된 것에 주목하세요. 이는 로더 아키텍처 덕분에 가능합니다.

로더는 이미지의 URL을 생성하는 함수입니다. 제공된 `src`를 수정하고 다양한 크기로 이미지를 요청하는 여러 URL을 생성합니다. 이러한 여러 URL은 자동 srcset 생성에 사용되므로 사이트 방문자에게 뷰포트에 맞는 크기의 이미지가 제공됩니다.

Next.js 애플리케이션의 기본 로더는 내장 이미지 최적화 API를 사용하여 웹의 어디에서나 이미지를 최적화한 다음 Next.js 웹 서버에서 직접 제공합니다. CDN 또는 이미지 서버에서 직접 이미지를 제공하려면 몇 줄의 JavaScript로 자신만의 로더 함수를 작성할 수 있습니다.

`loader` 속성으로 이미지별 로더를 정의하거나 `loaderFile` 구성으로 애플리케이션 수준에서 정의할 수 있습니다. -->

로더(loader)는 Next.js의 이미지 최적화 시스템에서 중요한 역할을 한다.

먼저, 로컬 이미지를 사용할 때 `/me.png` 같은 부분 URL을 사용할 수 있었던 것은 로더 덕분이다.

```jsx
<Image src="/me.png" ... />
```

로더는 이 `/me.png` 경로를 받아서, 실제로는 여러 버전의 이미지 URL을 생성한다. 예를 들면 다음과 같다:

- `/me.png?w=480&q=75`
- `/me.png?w=960&q=75`
- `/me.png?w=1920&q=75`

이렇게 생성된 URL들은 각각 다른 크기와 품질의 이미지를 가리킨다. 그리고 이 URL들은 `<Image>` 컴포넌트가 자동으로 생성하는 `srcset` 속성에 사용된다.

```html
<img
  srcset="
    /me.png?w=480&q=75   480w,
    /me.png?w=960&q=75   960w,
    /me.png?w=1920&q=75 1920w
  "
  ...
/>
```

`srcset` 은 브라우저에게 각 이미지의 크기를 알려주고, 브라우저는 사용자의 화면 크기(뷰포트)에 가장 적합한 이미지를 선택한다. 이게 바로 반응형 이미지(responsive image)의 원리다.

Next.js의 기본 로더는 이런 일을 자동으로 처리하면서, 동시에 이미지 최적화도 수행한다. 최적화된 이미지는 Next.js 서버에서 직접 제공된다.

하지만 CDN이나 별도의 이미지 서버를 사용하고 싶다면, 직접 로더 함수를 만들어서 사용할 수도 있다. 로더 함수는 `src` 를 받아서 실제 이미지 URL을 반환하는 간단한 자바스크립트 함수다.

```js
// 커스텀 로더 함수
function myLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`;
}
```

이 함수를 `next.config.js` 에서 `loader` 옵션으로 지정하면, Next.js는 내장 로더 대신 이 함수를 사용한다.

```js
// next.config.js
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my-loader.js',
  },
};
```

또는 [`loader` 속성](https://nextjs.org/docs/app/api-reference/components/image#loader)을 사용해서 개별 이미지마다 다른 로더를 지정할 수도 있다.

```jsx
<Image
  src="/me.png"
  loader={myLoader}
  // ...
/>
```

## 우선순위 {#priority}

웹페이지가 로딩될 때, 가장 큰 이미지나 텍스트 블록이 화면에 보이는 시점을 [LCP(Largest Contentful Paint)](https://web.dev/lcp/#what-elements-are-considered)라고 한다.

LCP는 사용자가 페이지를 사용할 수 있게 되는 중요한 시점 중 하나다.

각 페이지에서 가장 큰 콘텐츠풀 페인트(Largest Contentful Paint, LCP) 요소가 될 이미지에는 `priority` 속성을 추가해야 한다.

```jsx
// app/page.js
import Image from 'next/image';
import profilePic from '../public/me.png';

export default function Page() {
  return <Image src={profilePic} alt="Picture of the author" priority />;
}
```

위 코드에서 처럼, 이미지에 `priority` 가 붙으면 Next.js가 해당 이미지를 우선적으로 로딩한다.

:::note
HTML에서 우선순위를 지정하는 방법으로는 두 가지가 있다:

1. `preload` 사용
   - preload는 HTML의 기능이다. `<link rel="preload">` 와 같이 사용하면 브라우저에게 특정 리소스(이미지, 스타일시트, 자바스크립트 등)를 미리 로딩하라고 지시할 수 있다.
2. 우선순위 힌트(priority hint)를 사용
   - 우선순위 힌트(Priority Hints)는 브라우저에게 리소스의 상대적인 중요도를 알려주는 방법이다. 이를 통해 브라우저는 중요한 리소스를 더 빨리 가져와서 페이지 로딩 성능을 향상시킬 수 있다.
   - HTML에서는 `fetchpriority` 속성을 사용해서 우선순위 힌트를 제공할 수 있다.
     ```html
     <img src="example.jpg" fetchpriority="high" alt="중요한 이미지" />
     ```

Next.js에서는 `priority` 속성을 사용하면 이런 복잡한 내용을 신경쓰지 않아도 된다. Next.js가 내부적으로 가장 적합한 방법을 사용해서 이미지의 우선순위를 조정한다.
:::

`priority` 를 쓰면 LCP에 해당하는 이미지가 더 빨리 로딩돼서, 사용자가 페이지를 더 빨리 사용할 수 있게 된다.

개발 중에 `next dev` 명령어로 서버를 실행하면, Next.js는 LCP 이미지에 `priority` 가 없으면 경고 메시지를 보여준다. 그래서 LCP 이미지를 찾아서 `priority` 를 추가해주는 게 좋다.

:::note priority
자세한 내용은 [문서](https://nextjs.org/docs/app/api-reference/components/image#priority)를 참조한다.
:::

## 이미지 크기 조정 {#image-sizing}

웹 페이지에서 이미지를 사용할 때 가장 흔한 문제 중 하나는 이미지가 로드되는 동안 페이지의 레이아웃이 갑자기 변하는 것이다. 이를 레이아웃 이동(layout shift)이라고 한다.

예를 들어, 텍스트 위에 이미지를 표시한다고 해보자. 이미지 크기를 지정하지 않으면, 브라우저는 초기에 이미지의 높이를 `0` 으로 가정한다. 그래서 텍스트는 페이지 맨 위에 표시된다. 그런데 이미지가 로드되면서 텍스트는 아래로 밀려나게 된다. 이런 갑작스러운 레이아웃 변화는 사용자 경험을 해친다.

이 문제는 너무 중요해서 구글에서는 이를 측정하는 별도의 지표까지 만들었다. 바로 CLS(Cumulative Layout Shift)인데, Core Web Vitals 중 하나다.

이런 레이아웃 이동을 피하려면 항상 이미지의 크기를 지정해야 한다. 이미지 크기를 알려주면 브라우저는 이미지가 로드되기 전에 해당 공간을 미리 확보해 둘 수 있다.

Next.js의 `Image` 컴포넌트는 항상 좋은 성능을 보장하도록 설계되었기 때문에, 레이아웃 이동을 일으킬 수 있는 방식으로는 사용할 수 없다. 따라서 다음 세 가지 방법 중 하나로 반드시 크기를 지정해야 한다.

1. **이미지를 `import` 해서 사용하면 Next.js가 자동으로 크기를 알아낸다.**

   ```jsx
   {% raw %}import profilePic from './profile.jpg';

   function Home() {
     return <Image src={profilePic} alt="Profile Picture" />;
   }{% endraw %}
   ```

2. **`width` 와 `height` 속성을 직접 지정할 수 있다.**
   ```jsx
   {% raw %}function Home() {
     return (
       <Image
         src="/profile.jpg"
         width={500}
         height={500}
         alt="Profile Picture"
       />
     );
   }{% endraw %}
   ```
3. **`fill` 속성을 사용하면 이미지가 부모 요소의 크기에 맞춰진다.**
   ```jsx
   {% raw %}function Home() {
     return (
       <div style={{ width: '500px', height: '500px', position: 'relative' }}>
         <Image src="/profile.jpg" fill alt="Profile Picture" />
       </div>
     );
   }{% endraw %}
   ```

하지만 외부 소스에서 가져오는 이미지처럼, 이미지 크기를 모르는 경우도 있습니다. 이런 경우에는 다음과 같은 방법을 사용할 수 있다:

- `fill` 속성을 사용하고, CSS로 부모 요소의 크기를 지정한다.
- 이미지 서버에서 모든 이미지를 특정 크기로 정규화한다.
- API 응답에 이미지 URL과 함께 이미지 크기도 포함시킨다.

:::note fill 속성

`fill` 속성은 이미지가 부모 요소의 크기에 맞게 자동으로 조정되도록 해준다.

```jsx
{% raw %}function Home() {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Image src="/background.jpg" fill alt="Background Image" />
    </div>
  );
}{% endraw %}
```

위 코드에서는 `div` 요소가 이미지의 부모가 되고, 이 `div` 의 크기에 맞춰 이미지가 채워진다. 부모 `div` 는 `position: relative` 여야 하고, 이미지에는 `fill` 속성이 주어진다.

그런데 이렇게 하면 이미지가 부모 요소의 크기에 맞게 늘어나거나 줄어들어 원본 이미지의 비율과 달라질 수 있다. 이때 `object-fit` 속성을 사용하면 이미지가 어떻게 조정될지를 지정할 수 있다.

- `object-fit: fill`: 이미지가 부모 요소를 완전히 채운다. 이미지가 늘어나거나 줄어들 수 있다.
- `object-fit: contain`: 이미지의 비율을 유지하면서, 부모 요소 안에 완전히 들어가도록 조정된다.
- `object-fit: cover`: 이미지의 비율을 유지하면서, 부모 요소를 완전히 덮도록 조정된다. 이미지 일부가 잘릴 수 있다.

```jsx
{% raw %}<Image
  src="/background.jpg"
  fill
  style={{ objectFit: 'cover' }}
  alt="Background Image"
/>{% endraw %}
```

또한 `object-position` 속성을 사용하면 이미지가 부모 요소 내에서 어떻게 위치할지를 지정할 수 있다.

```jsx
{% raw %}<Image
  src="/background.jpg"
  fill
  style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
  alt="Background Image"
/>{% endraw %}
```

한편, `sizes` 속성을 사용하면 미디어 쿼리에 따라 이미지 크기를 다르게 지정할 수 있다.

```jsx
{% raw %}<Image
  src="/background.jpg"
  fill
  sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         33vw"
  alt="Background Image"
/>{% endraw %}
```

위 코드는 화면 너비가 768px 이하면 이미지 너비를 뷰포트 너비의 100%로, 1200px 이하면 50%로, 그 이상이면 33%로 설정한다.

이렇게 `fill`, `object-fit`, `object-position`, `sizes` 등을 조합하면 다양한 상황에서 유연하게 이미지를 표시할 수 있다.

:::

만약 어떤 방법으로도 이미지 크기를 알 수 없다면, `next/image` 컴포넌트를 포기하고 그냥 일반적인 `<img>` 태그를 쓰는 것이 좋다.

```jsx
function Home() {
  return (
    <>
      {/* 크기를 알 수 있는 이미지는 next/image를 사용 */}
      <Image
        src="/profile.jpg"
        width={500}
        height={500}
        alt="Profile Picture"
      />

      {/* 크기를 알 수 없는 이미지는 그냥 <img> 태그 사용 */}
      <img src="https://example.com/external-image.jpg" alt="External Image" />
    </>
  );
}
```

이런 식으로, 같은 페이지 내에서 `next/image` 와 `<img>` 를 함께 사용할 수 있다.

## 스타일링 {#styling}

### className과 style 사용하기 {#styling-classname-and-style}

Image 컴포넌트에 스타일을 적용할 때는 `className` 또는 `style` 속성을 사용해야 한다.

`className` 은 CSS 클래스를 적용하는 데 사용된다. 이 클래스는 CSS 모듈에서 가져오거나, 전역 스타일시트에 정의할 수 있다.

하지만 `styled-jsx` 는 사용할 수 없다. `styled-jsx` 는 현재 컴포넌트에 한정되는 스타일을 생성하는데, Image 컴포넌트는 이를 지원하지 않는다. 스타일을 `global` 로 표시하면 사용할 수는 있지만, 이는 권장되지 않는다.

### fill 모드에서의 부모 요소 스타일링 {#styling-fill-mode}

`fill` 속성을 사용할 때는 이미지의 부모 요소에 특정 스타일이 필요하다.

우선, 부모 요소는 `position: relative` 속성을 가져야 한다. 이는 `fill` 모드에서 이미지가 부모 요소를 기준으로 위치를 잡기 때문이다.

또한, 부모 요소는 `display: block` 속성을 가져야 한다. 이는 `<div>` 요소의 기본값이지만, 다른 요소를 사용한다면 명시적으로 지정해야 한다.

이러한 스타일 지침을 따르면 Image 컴포넌트를 더욱 효과적으로 스타일링할 수 있다. `className` 과 `style`을 활용하여 다양한 스타일을 적용할 수 있고, `fill` 모드에서는 부모 요소에 적절한 스타일을 지정하여 이미지가 올바르게 렌더링되도록 할 수 있다.

## 예제 {#examples}

### 반응형 {#responsive}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-optimizing-images/1.png)

```tsx
{% raw %}import Image from 'next/image';
import mountains from '../public/mountains.jpg';

export default function Responsive() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Image
        alt="Mountains"
        // 가져온 이미지의 넓이, 높이 값이 자동으로 설정된다.
        src={mountains}
        sizes="100vw"
        // 이미지를 전체 넓이로 표시한다.
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
}{% endraw %}
```

### 컨테이너 채우기 {#fill-container}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-optimizing-images/2.png)

```tsx
{% raw %}import Image from 'next/image';
import mountains from '../public/mountains.jpg';

export default function Fill() {
  return (
    <div
      style={{
        display: 'grid',
        gridGap: '8px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, auto))',
      }}
    >
      <div style={{ position: 'relative', height: '400px' }}>
        <Image
          alt="Mountains"
          src={mountains}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: 'cover', // cover, contain, none
          }}
        />
      </div>
      {/* 다른 이미지들... */}
    </div>
  );
}{% endraw %}
```

### 백그라운드 이미지 {#background-image}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-optimizing-images/3.png)

```tsx
{% raw %}import Image from 'next/image';
import mountains from '../public/mountains.jpg';

export default function Background() {
  return (
    <Image
      alt="Mountains"
      src={mountains}
      placeholder="blur"
      quality={100}
      fill
      sizes="100vw"
      style={{
        objectFit: 'cover',
      }}
    />
  );
}{% endraw %}
```

:::note
다른 예제는 [여기](https://image-component.nextjs.gallery/)를 참조한다.
:::

## 기타 속성 {#other-props}

:::note
자세한 내용은 `next/image` 컴포넌트 [문서](https://nextjs.org/docs/app/api-reference/components/image)를 확인한다.
:::

## 설정 {#configuration}

외부 이미지 최적화를 허용, 반응형 이미지를 위한 커스텀 중단점을 정의, 이미지 캐싱 시간을 조정 등, `next.config.js` 파일에서 이미지 최적화 관련 설정을 할 수 있다.

:::note
자세한 내용은 [문서](https://nextjs.org/docs/app/api-reference/components/image#configuration-options)를 참조한다.
:::
