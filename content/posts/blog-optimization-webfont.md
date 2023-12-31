---
title: 블로그 최적화 - 웹폰트
description: 빠르게 웹폰트 제공하기
tags: [font]
references:
  {
    '지연 시간 없이 웹폰트 서빙하기 - Feat. Safari & Edge functions': 'https://blog.banksalad.com/tech/font-preload-on-safari/',
  }
---

Eleventy로 블로그를 만들어 Netlify에 배포했다. 라이트하우스로 성능을 측정해 봤는데 웹폰트 로딩에서 문제가 있었다.

![라이트하우스 리포트](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-webfont/1.png)

문제를 요약해보면 다음과 같다.

- 웹폰트의 사이즈가 너무 크다.
- 웹폰트 로딩 전에 대체 폰트를 제공해야 한다.

이와 관련해서 검색을 해봤는데 [좋은 글](https://blog.banksalad.com/tech/font-preload-on-safari/)을 찾을 수 있었다. 이 글을 토대로 문제를 해결해 보자.

## 폰트 사이즈 줄이기 { #font-size }

원래는 구글 폰트에서 **Noto Sans Korean** 폰트를 다운받아 `.ttf` 포맷으로 Netlify에서 호스팅하고 있었다.

여기선 다음과 같은 두 가지 문제점이 있었다.

1. TTF 폰트의 용량 문제
2. 한글 폰트의 용량 문제

### WOFF/WOFF2 포맷 사용하기 { #use-woff-format }

폰트는 여러가지 형식이 있다. 하지만 모든 브라우저를 지원하는 형식은 없기 때문에 우리는 여러 형식의 폰트를 사용해야 한다.

![https://www.w3schools.com/css/css3_fonts.asp](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-webfont/2.png)

위의 표를 보면 알 수 있듯이 지원범위가 가장 넓은 것은 TTF/OTF이다 하지만 TTF/OTF에 비해서 WOFF/WOFF2는 폰트를 압축해서 제공하기 때문에 파일 사이즈가 더 작다는 이점이 있다.

WOFF2는 WOFF의 차세대 버전으로 30% 정도의 향상된 압축률을 보인다고 한다. 다만 지원 범위가 좁다.

:::note Can I use
[https://caniuse.com/?search=web%20fonts](https://caniuse.com/?search=web%20fonts)
:::

결론적으로 기본적으로 `woff2` 포맷을 제공하고 `woff`를 폴백 포맷으로 지정하면 된다.

```css
/* Pretendard */
@font-face {
  font-family: 'Pretendard';
  font-weight: 900;
  font-display: swap;
  src:
    local('Pretendard Black'),
    url(/fonts/woff2/Pretendard-Black.woff2) format('woff2'),
    url(/fonts/woff/Pretendard-Black.woff) format('woff');
}
```

:::note font-display: swap
`font-display: swap`을 사용하면 로컬 시스템 폰트를 웹폰트 로딩 전에 대체 폰트로 사용할 수 있다. ([https://stackoverflow.com/questions/55677376/what-is-font-display-css-feature](https://stackoverflow.com/questions/55677376/what-is-font-display-css-feature))
:::

### 서브셋 폰트 사용하기 { #use-subset-font }

폰트 포맷을 `woff2` 를 사용하더라도 한글 폰트는 기본적으로 영문 폰트에 비해서 사이즈가 크기 때문에 개선의 여지가 있다.

> 영문 폰트는 대소문자를 포함해 72개의 **Glyph**만 있으면 됩니다. 하지만 한글은 자모음의 조합으로 Glyph가 구성되기 때문에 가능한 모든 조합을 계산하면 11,172개의 Glyph가 필요합니다. 따라서 한글이 포함된 폰트는 용량이 커지게 됩니다.
> ([https://blog.banksalad.com/tech/font-preload-on-safari/](https://blog.banksalad.com/tech/font-preload-on-safari/))

:::note Glyph
자체(字體), 자형(字形)은 글자의 모양을 가리킨다. 자체는 하나 이상의 자소로 이루어진다. 글리프(glyph)라는 개념은 자체의 문자 코드에서 뜻과 소리를 지니지 않은 도형 기호(구두점, 괄호, 공백 등)의 추상화를 포함한다. (Wikipedia)
:::

필요하지 않은 글리프(Glyph)를 제거하여 좀 더 최적화가 가능하다. **Pretendard** 폰트는 미사용 글리프가 제거된 서브셋(subset) 폰트를 제공한다.

서브셋 폰트와 일반 폰트의 용량을 비교해보니 70% 가량 차이가 나는걸 확인할 수 있었다.

![일반 폰트와 서브셋 폰트의 용량 차이](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-webfont/3.png)

## 워터폴 개선하기 { #waterfall }

폰트의 사이즈를 줄이더라도 폰트를 가져오기 위해서 먼저 html, css파일이 로드 되어야 한다. (어떤 폰트를 사용할지는 css 파일에 정의되어 있기 때문이다)

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-webfont/4.png)

[preload link](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) 기능을 사용하면 이를 개선할 수 있다고 한다.

```html
<link
  rel="preload"
  as="font"
  type="font/woff2"
  crossorigin=""
  href="/fonts/woff2/Pretendard-Regular.woff2"
/>
```

html의 head 태그에 위와 같은 코드를 추가하면 원하는 리소스를 선별적으로 빠르게 가져올 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-webfont/5.png)
