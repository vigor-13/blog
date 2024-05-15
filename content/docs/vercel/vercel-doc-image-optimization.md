---
title: Vercel을 사용한 이미지 최적화
description:
date: 2024-05-15
tags: []
references:
  [
    {
      key: 'Vecel 공식 문서',
      value: 'https://vercel.com/docs/image-optimization',
    },
  ]
---

Vercel은 내장된 이미지 최적화 기능을 통해 방문자에게 자동으로 최적의 이미지를 제공한다.

:::note
[모든 플랜](https://vercel.com/docs/accounts/plans)에서 이미지 최적화를 사용할 수 있다.
:::

Vercel은 개발자가 이미지 최적화를 쉽게 처리할 수 있도록 도와준다. 개발자는 이미지를 업로드하기만 하면 되고, 나머지는 Vercel이 알아서 처리한다.

Vercel은 사용자의 기기 화면 크기, 해상도 등을 고려해서 이미지의 크기와 품질을 자동으로 조절한다. 예를 들어 고해상도 휴대폰에서는 선명한 고화질 이미지를, 저사양 노트북에서는 로딩 속도를 위해 상대적으로 낮은 화질의 이미지를 제공하는 식이다.

이렇게 최적화된 이미지는 Vercel의 전 세계 서버에 저장되어 사용자의 요청에 빠르게 응답할 수 있다. 한 번 생성된 이미지는 재사용되므로 로딩 속도가 매우 빨라진다.

그리고 Next.js, Astro, Nuxt 같은 유명한 웹 프레임워크를 사용한다면 이미지 최적화 기능을 더 쉽게 사용할 수 있다. 이 프레임워크들은 Vercel과의 연동을 위한 전용 컴포넌트를 제공하기 때문이다. 개발자는 이 컴포넌트에 이미지만 전달하면 최적화는 자동으로 이루어진다.

`next/image` 컴포넌트 사용 예시는 [이미지 최적화 데모](https://image-component.nextjs.gallery/)를 참조한다.

## 시작하기 {#get-started}

Next.js, Astro 또는 Nuxt에서 이미지 최적화를 시작하려면 [퀵스타트 가이드](https://vercel.com/docs/image-optimization/quickstart)를 참조한다.

### 빌드 출력 API 사용하기

커스텀 웹 프레임워크를 구축하는 경우, [빌드 출력 API](https://vercel.com/docs/build-output-api/v3/configuration#images)를 사용해 이미지 최적화를 구현할 수 있다. 이에 대한 방법은 [Build your own web framework](https://vercel.com/blog/build-your-own-web-framework#automatic-image-optimization) 블로그 게시물을 참조한다.

### 최적화된 URL 형식

일반적인 프레임워크에서 이미지 컴포넌트를 사용하고 Vercel에 프로젝트를 배포하면, 이미지 최적화 기능이 자동으로 다양한 기기 화면 크기에 맞게 이미지를 조정한다. 코드에서 제공한 `src` prop은 최적화된 이미지 URL로 동적으로 대체된다. 예를 들면:

| 환경               | 결과                                                |
| ------------------ | --------------------------------------------------- |
| Next.js            | `/_next/image?url={link/to/my/image}&w=3840&q=75`   |
| Nuxt.js 또는 Astro | `/_vercel/image?url={link/to/my/image}&w=3840&q=75` |
| 빌드 출력 API      | `/_vercel/image?url={link/to/my/image}&w=3840&q=75` |

## 캐싱

최적화된 이미지는 [Vercel 엣지 네트워크](https://vercel.com/docs/edge-network/overview)에 자동으로 캐시되며, 동일한 이미지에 대한 후속 요청은 캐시에서 제공된다.

로컬 이미지와 원격 이미지의 캐싱 동작은 다르다:

### 로컬 이미지

로컬 이미지는 파일 시스템에서 가져와 빌드 시간에 분석된다. 가져오기는 src prop에 추가됩니다: src={myImage}

- **캐시 키**:
  - 쿼리 문자열 매개변수:
    - `q` : 최적화된 이미지의 품질로 1(최저 품질)에서 100(최고 품질) 사이의 값
    - `w` : 최적화된 이미지의 너비(픽셀 단위)
    - `url` : 최적화된 이미지의 URL은 콘텐츠 해시로 키가 지정됨. 예: /assets/me.png는 3399d02f49253deb9f5b5d1159292099로 변환됨
  - `Accept` HTTP 헤더(정규화됨)
- **로컬 이미지 캐시 무효화**: 앱을 재배포해도 이미지 캐시가 무효화되지 않음. 무효화하려면 같은 이름의 이미지를 다른 내용으로 바꾼 다음 재배포해야 함. 이렇게 하면 콘텐츠 해시가 변경됨.
- **로컬 이미지 캐시 만료**: 엣지 네트워크에서 최대 31일간 캐시됨.

### 원격 이미지

원격 이미지는 src 속성이 상대 또는 절대 경로의 URL 문자열이어야 함. Next.js는 빌드 프로세스 중 원격 파일에 액세스할 수 없으므로 width와 height prop이 필요함.

- **캐시 키**:
  - 쿼리 문자열 매개변수:
    - `q` : 최적화된 이미지의 품질로 1(최저 품질)에서 100(최고 품질) 사이의 값
    - `w` : 최적화된 이미지의 너비(픽셀 단위)
    - `url` : 최적화된 이미지의 URL. 예: `https://example.com/assets/me.png`
  - `Accept` HTTP 헤더(정규화됨)
- **원격 이미지 캐시 무효화**: 이미지 URL에 쿼리 문자열(?new 또는 ?v=2 등)을 추가하면 방문자에게 새 이미지가 제공됨. 또는 새 이미지를 더 자주 제공하기 위해 캐시 만료 시간을 줄일 수 있음.
- **원격 이미지 캐시 만료**: minimumCacheTTL(기본값: 60초) 또는 업스트림 이미지의 Cache-Control max-age 헤더 중 더 큰 값으로 결정됨. 이미지 내용이 자주 변경되는 경우 이 값을 낮게 유지하는 것이 좋음.

## 제한, 가격 책정 및 성능 측정 {#limits-pricing-and-performance-measurement}

자세한 내용은 [제한 및 가격](https://vercel.com/docs/image-optimization/limits-and-pricing) 페이지를 참조한다. 이미지 최적화를 적용하기 전후에 [Speed Insights](https://vercel.com/docs/speed-insights)를 사용해 실제 성능을 측정한다.

## Vercel에서 이미지를 최적화해야 하는 이유는 무엇인가? {#why-should-i-optimize-my-images-on-vercel}

Vercel에서 이미지를 최적화하면 애플리케이션에 다음과 같은 여러 이점이 있다:

- 웹사이트 성능, 사용자 경험 및 빠른 데이터 전송 비용 절감 향상
- 핵심 웹 바이탈 개선, 반송률 감소, 더 빠른 페이지 로드
- 다양한 기기에 맞게 적절한 크기로 조정된 이미지 및 WebP, AVIF 같은 최신 형식 지원
- 소스 이미지를 최적화할 수 없는 경우 Vercel은 원본 이미지 제공으로 대체함
- Vercel은 최적화된 이미지를 엣지에서 생성 및 캐싱하여 신속하게 응답할 수 있는 인프라를 관리함
