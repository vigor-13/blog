---
title: 배포
description:
date: 2024-05-04
tags: ['deploying']
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/deploying',
    },
  ]
---

드디어 프로덕션 환경에 배포할 시간이 되었다.

[Vercel을 사용하여 관리형 Next.js](https://nextjs.org/docs/app/building-your-application/deploying#managed-nextjs-with-vercel)를 배포하거나, Node.js 서버, Docker 이미지 또는 정적 HTML 파일로 자체 호스팅할 수 있다.

`next start` 명령어를 사용하여 프로덕션 모드로 실행할 때, Next.js의 모든 기능이 완전히 지원된다.

## 프로덕션 빌드 {#production-builds}

`next build` 를 실행하면 프로덕션용으로 최적화된 애플리케이션 버전이 생성된다.

페이지를 기반으로 HTML, CSS, JavaScript 파일이 생성된다. JavaScript는 컴파일되고 브라우저 번들은 [Next.js 컴파일러](https://nextjs.org/docs/architecture/nextjs-compiler)를 사용하여 최소화되어 최상의 성능을 달성하고 모든 최신 브라우저를 지원한다.

Next.js는 관리형 및 자체 호스팅 환경에서 사용할 수 있는 표준화된 배포 출력을 생성한다. 이는 두 가지 배포 방식 모두에서 Next.js의 모든 기능을 지원한다. 향후 주요 버전에서는 이 배포 출력을 [Build Output API 명세](https://vercel.com/docs/build-output-api/v3?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)에 맞게 변경할 계획이다.

## Vercel을 사용한 관리형 Next.js {#managed-nextjs-with-vercel}

Next.js의 제작자이자 관리자인 Vercel은 Next.js 애플리케이션을 위한 관리형 인프라와 개발자 경험 플랫폼을 제공한다.

Vercel에 배포하는 것은 별도의 설정 없이 이루어지며 전 세계적으로 확장성, 가용성, 성능 향상을 제공한다. 다만 자체 호스팅 시에도 Next.js의 모든 기능은 여전히 지원된다.

[Vercel에서의 Next.js](https://vercel.com/docs/frameworks/nextjs?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)에 대해 자세히 알아보거나 [무료로 템플릿을 배포](https://vercel.com/templates/next.js?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)해 볼 수 있다.

## 자체 호스팅 {#self-hosting}

Next.js를 자체 호스팅하는 세 가지 방법은 다음과 같다:

- [Node.js 서버](https://nextjs.org/docs/app/building-your-application/deploying#nodejs-server)
- [Docker 컨테이너](https://nextjs.org/docs/app/building-your-application/deploying#docker-image)
- [정적 내보내기](https://nextjs.org/docs/app/building-your-application/deploying#static-html-export)

### Node.js 서버 {#nodejs-server}

Next.js는 Node.js를 지원하는 모든 호스팅 제공업체에 배포할 수 있다. `package.json` 에 `build` 및 `start` 스크립트가 있는지 확인한다:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

그런 다음 `npm run build` 를 실행하여 애플리케이션을 빌드한다. 마지막으로 `npm run start` 를 실행하여 Node.js 서버를 시작한다. 이 서버는 Next.js의 모든 기능을 지원한다.

### Docker 이미지 {#docker-image}

Next.js는 Docker 컨테이너를 지원하는 모든 호스팅 제공업체에 배포할 수 있다. 이 접근 방식은 Kubernetes와 같은 컨테이너 오케스트레이터에 배포하거나 클라우드 제공업체의 컨테이너 내에서 실행할 때 사용할 수 있다.

1. 머신에 Docker 설치
2. [예제 클론](https://github.com/vercel/next.js/tree/canary/examples/with-docker)(또는 [다중 환경 예제](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env))
3. 컨테이너 빌드: `docker build -t nextjs-docker .`
4. 컨테이너 실행: `docker run -p 3000:3000 nextjs-docker`

Docker를 통한 Next.js는 Next.js의 모든 기능을 지원한다.

### 정적 HTML 내보내기 {#static-html-export}

Next.js는 정적 사이트 또는 단일 페이지 애플리케이션(SPA)으로 시작한 다음, 나중에 서버를 필요로 하는 기능을 사용하도록 선택적으로 업그레이드할 수 있다.

Next.js가 이러한 [정적 내보내기](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)를 지원하기 때문에 HTML/CSS/JS 정적 에셋을 제공할 수 있는 모든 웹 서버에 배포하고 호스팅할 수 있다. 여기에는 AWS S3, Nginx, Apache와 같은 도구가 포함된다.

[정적 내보내기](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)로 실행하면 서버를 필요로 하는 Next.js 기능이 지원되지 않는다. 자세한 내용은 [문서](https://nextjs.org/docs/app/building-your-application/deploying/static-exports#unsupported-features)를 참조한다.

:::tip
정적 내보내기에서는 Server Components가 지원된다.
:::

## 기능 {#feature}

### 이미지 최적화 {#image-optimization}

`next start` 를 사용하여 배포할 때 별도의 설정 없이 `next/image` 를 통한 이미지 최적화가 자체 호스팅에서 작동한다. 이미지 최적화를 위해 별도의 서비스를 사용하려면 [이미지 로더를 설정](https://nextjs.org/docs/app/building-your-application/optimizing/images#loaders)해야 한다.

이미지 최적화는 `next.config.js` 에 커스텀 이미지 로더를 정의하여 [정적 내보내기](https://nextjs.org/docs/app/building-your-application/deploying/static-exports#image-optimization)와 함께 사용할 수 있다. 이미지는 빌드 중이 아니라 런타임에 최적화된다는 점에 유의한다.

:::tip

- 자체 호스팅할 때는 프로덕션 환경에서 더 성능 좋은 이미지 최적화를 위해 프로젝트 디렉토리에서 `npm install sharp` 를 실행하여 `sharp` 를 설치할 수 있다. Linux 플랫폼에서는 과도한 메모리 사용을 방지하기 위해 `sharp` 에 [추가 설정](https://sharp.pixelplumbing.com/install#linux-memory-allocator)이 필요할 수 있다.
- [최적화된 이미지의 캐싱 동작](https://nextjs.org/docs/app/api-reference/components/image#caching-behavior)과 TTL을 구성하는 방법에 대해 자세히 알아보세요.
- 원하는 경우 이미지 최적화를 비활성화한 상태에서 `next/image` 의 다른 이점은 유지할 수 있다. 예를 들어 별도로 이미지를 직접 최적화하는 경우가 있다.

:::

### 미들웨어 {#middleware}

`next start` 를 사용하여 배포할 때 별도의 설정 없이 자체 호스팅에서 [미들웨어](https://nextjs.org/docs/app/building-your-application/routing/middleware)가 작동한다. 들어오는 요청에 대한 액세스가 필요하므로 정적 내보내기에서는 지원되지 않는다.

미들웨어는 요청이 들어올 때마다 실행되는 코드로, 애플리케이션의 모든 경로나 에셋에 대한 요청을 가로챌 수 있다. 따라서 미들웨어는 지연 시간에 직접적인 영향을 미칠 수 있다. 이러한 이유로 Next.js 미들웨어는 모든 Node.js API 중 일부만 사용할 수 있는 제한된 런타임 환경에서 실행된다. 이는 미들웨어의 실행 시간을 최소화하여 애플리케이션의 성능을 향상시키기 위함이다.

Next.js 미들웨어는 반드시 "에지"에서 실행될 필요는 없으며, 단일 지역의 서버에서도 문제없이 동작한다. 하지만 미들웨어를 여러 지역에 분산 배포하여 실행하고자 한다면, 추가적인 설정과 인프라 설정이 필요할 수 있다.

만약 미들웨어에서 모든 Node.js API를 사용해야 하는 로직을 구현해야 한다면, 해당 로직을 미들웨어에서 분리하여 서버 컴포넌트로 옮기는 것이 좋다. 서버 컴포넌트는 레이아웃 내에서 실행되며, 모든 Node.js API를 사용할 수 있다. 예를 들어, 요청 헤더를 확인하고 그에 따라 리디렉션을 수행하는 로직은 서버 컴포넌트로 이동할 수 있다.

또한 `next.config.js` 파일에서 헤더, 쿠키, 쿼리 매개변수 등을 활용하여 리디렉션이나 URL 재작성을 설정할 수도 있다. 이러한 방법으로 해결되지 않는 경우에는 커스텀 서버를 구현하여 원하는 로직을 처리할 수 있다. 커스텀 서버는 Next.js 애플리케이션을 래핑하여 추가적인 기능을 제공할 수 있다.

### 환경 변수 {#evironment-variables}

Next.js에서는 빌드 타임과 런타임에 사용할 수 있는 환경 변수를 지원한다. 이를 통해 개발, 스테이징, 프로덕션 등 다양한 환경에 따라 애플리케이션의 동작을 조정할 수 있다.

기본적으로 환경 변수는 서버 측에서만 접근 가능한다. 클라이언트 측에서 환경 변수를 사용하려면 `NEXT_PUBLIC_` 접두사를 붙여야 한다. 이렇게 공개된 환경 변수는 `next build` 과정에서 번들링되어 클라이언트 측 JavaScript 코드에 포함된다. 따라서 공개 환경 변수는 민감한 정보를 포함해서는 안 된다.

런타임에 서버 측에서만 접근해야 하는 환경 변수를 사용하려면 `getServerSideProps` 나 App Router를 활용하는 것이 좋다.

`getServerSideProps` 는 페이지 컴포넌트에서 서버 사이드 렌더링을 위해 사용되는 함수로, 이 함수 내에서는 서버 환경 변수에 접근할 수 있다. 이를 통해 런타임에 동적으로 데이터를 가져오거나 환경 변수 값에 따라 페이지를 조건부로 렌더링할 수 있다.

App Router는 Next.js 13에서 도입된 새로운 라우팅 시스템으로, 레이아웃과 중첩 라우팅을 지원한다. App Router에서는 동적 렌더링 중에 서버 환경 변수를 안전하게 읽을 수 있다. 예를 들어, `noStore` 함수를 사용하여 캐싱을 비활성화하고 `cookies()`, `headers()` 등의 동적 함수를 사용하면 해당 컴포넌트는 동적 렌더링을 수행하게 된다. 이때 서버 환경 변수에 접근할 수 있다.

App Router를 활용하면 동일한 Docker 이미지를 사용하면서도 환경에 따라 다른 환경 변수 값을 적용할 수 있다. 이는 CI/CD 파이프라인에서 유용하게 활용될 수 있다.

추가로, `register` 함수를 사용하면 Next.js 애플리케이션 시작 시점에 서버 사이드 코드를 실행할 수 있다. 이를 통해 애플리케이션 시작 시 필요한 설정이나 초기화 작업을 수행할 수 있다.

한편, Next.js에서는 `runtimeConfig` 옵션을 제공하지만, 이는 독립 실행형 출력 모드에서는 작동하지 않는다. 따라서 `runtimeConfig` 옵션보다는 App Router를 점진적으로 도입하는 것이 권장된다.

```jsx
import { unstable_noStore as noStore } from 'next/cache';

export default function Component() {
  noStore();
  // cookies(), headers() 및 기타 동적 함수는 동적 렌더링을 선택하므로
  // 이 env 변수는 런타임에 평가됨
  const value = process.env.MY_VALUE
  ...
}
```

### 캐싱 및 ISR {#caching-and-isr}

Next.js는 다양한 유형의 콘텐츠를 효과적으로 캐싱할 수 있는 기능을 제공한다. 이는 응답 결과, 정적으로 생성된 페이지, 빌드 출력물, 그리고 이미지, 글꼴, 스크립트 등의 정적 에셋을 포함한다. 캐싱을 통해 애플리케이션의 성능을 향상시키고 응답 속도를 높일 수 있다.

특히 페이지 캐싱과 재검증은 Next.js의 핵심 기능 중 하나다. **Incremental Static Regeneration(ISR)** 은 페이지를 한 번 생성한 후, 지정된 시간 간격으로 페이지를 다시 생성하여 업데이트할 수 있도록 해준다. 이를 통해 정적 페이지의 이점과 동적 데이터의 최신성을 모두 유지할 수 있다.

App Router에서도 유사한 기능을 제공하며, 최신 함수를 사용하여 페이지 캐싱 및 재검증을 수행할 수 있다.

Next.js는 페이지 캐싱과 재검증을 위해 공유 캐시를 사용한다. 기본적으로 이 캐시는 Next.js 서버의 파일 시스템, 즉 디스크에 저장된다. 이는 페이지 라우터와 앱 라우터 모두에서 자체 호스팅 시 자동으로 동작한다.

하지만 캐시된 페이지와 데이터를 보다 내구성 있는 저장소에 유지하거나, 여러 Next.js 애플리케이션 인스턴스 간에 캐시를 공유하고자 하는 경우가 있다. 이를 위해 Next.js는 캐시 위치를 커스터마이징할 수 있는 옵션을 제공한다.

Next.js 캐시 위치를 설정하면 캐시된 데이터를 외부 저장소(예: Redis, Memcached 등)에 저장할 수 있다. 이는 캐시 데이터의 영속성을 높이고, 여러 서버 인스턴스 간에 캐시를 공유할 수 있게 해준다. 이를 통해 효과적인 캐시 활용과 일관된 응답 제공이 가능해진다.

캐시 위치 구성은 `next.config.js` 파일에서 설정할 수 있다. 커스텀 캐시 핸들러를 구현하여 캐시 데이터의 저장 위치와 동작을 제어할 수 있다. 이를 통해 애플리케이션의 요구사항에 맞게 캐싱 전략을 최적화할 수 있다.

Next.js의 캐싱 기능은 애플리케이션의 성능 향상에 큰 도움을 준다. 적절한 캐싱 전략을 사용하면 서버 부하를 줄이고 응답 속도를 높일 수 있다. 또한 캐시 위치 구성을 활용하여 캐시 데이터의 내구성과 확장성을 확보할 수 있다.

#### 자동 캐싱 {#automatic-caching}

<!-- - Next.js는 진정으로 불변하는 에셋에 대해 Cache-Control 헤더를 public, max-age=31536000, immutable로 설정합니다. 이는 재정의할 수 없습니다. 이러한 불변 파일에는 파일 이름에 SHA 해시가 포함되어 있으므로 안전하게 무기한 캐시할 수 있습니다. 예를 들면 정적 이미지 가져오기 등이 있습니다. 이미지에 대한 TTL을 구성할 수 있습니다.
- Incremental Static Regeneration (ISR)은 Cache-Control 헤더를 s-maxage: <revalidate in getStaticProps>, stale-while-revalidate로 설정합니다. 이 재검증 시간은 getStaticProps 함수에서 초 단위로 정의됩니다. revalidate: false로 설정하면 기본적으로 1년의 캐시 지속 시간이 설정됩니다.
- 동적으로 렌더링된 페이지는 Cache-Control 헤더를 private, no-cache, no-store, max-age=0, must-revalidate로 설정하여 사용자별 데이터가 캐시되지 않도록 합니다. 이는 앱 라우터와 페이지 라우터 모두에 적용됩니다. 여기에는 드래프트 모드도 포함됩니다. -->

Next.js는 다양한 유형의 콘텐츠에 대해 적절한 캐싱 설정을 자동으로 적용한다. 이를 통해 최적의 성능과 캐싱 효과를 얻을 수 있다.

1. **불변 에셋 (Immutable Assets)**:
   - Next.js는 변경되지 않는 정적 에셋에 대해 최대한의 캐싱을 적용한다.
   - 이러한 불변 파일에는 파일 이름에 SHA 해시가 포함되어 있으므로 안전하게 무기한 캐시할 수 있다.
   - 이러한 에셋에는 `Cache-Control` 헤더가 `public, max-age=31536000, immutable` 로 설정된다.
   - `max-age=31536000` 은 약 1년에 해당하는 시간으로, 해당 에셋이 오랜 기간 동안 캐시될 수 있음을 나타낸다.
   - `immutable` 설정은 에셋이 변경되지 않음을 나타내므로, 브라우저는 서버에 재검증 요청을 보내지 않고 캐시된 버전을 사용할 수 있다.
   - 정적 이미지 가져오기와 같은 경우, 이러한 불변 에셋에 해당한다.
   - 이미지의 TTL (Time-to-Live)은 별도로 구성 가능하다.
2. **Incremental Static Regeneration (ISR)**:
   - ISR은 정적 페이지를 주기적으로 재생성하여 업데이트할 수 있는 기능이다.
   - ISR을 사용하는 페이지에는 `Cache-Control` 헤더가 `s-maxage=<revalidate>, stale-while-revalidate` 로 설정된다.
   - `<revalidate>` 는 `getStaticProps` 함수에서 정의한 재검증 시간(초)으로 대체된다.
   - `s-maxage` 는 CDN 또는 프록시 서버에서 캐시 지속 시간을 설정한다.
   - `stale-while-revalidate` 는 캐시가 만료된 후에도 백그라운드에서 재검증을 수행하면서 캐시된 버전을 제공할 수 있도록 한다.
   - `revalidate` 를 `false`로 설정하면 기본적으로 1년의 캐시 지속 시간이 적용된다.
3. **동적으로 렌더링된 페이지**:
   - 사용자별 데이터를 포함하는 동적 페이지의 경우, 캐싱을 비활성화하여 각 사용자에게 고유한 응답을 제공한다.
   - 이러한 페이지에는 `Cache-Control` 헤더가 `private, no-cache, no-store, max-age=0, must-revalidate` 로 설정된다.
   - `private` 은 응답이 개별 사용자를 위한 것임을 나타낸다.
   - `no-cache` 와 `no-store` 는 응답을 캐시하지 않고 항상 서버에서 새로 가져와야 함을 나타낸다.
   - `max-age=0` 은 캐시 지속 시간을 0으로 설정하여 즉시 만료되도록 한다.
   - `must-revalidate`는 캐시를 사용하기 전에 항상 서버에서 재검증해야 함을 나타낸다.
   - 이러한 설정은 앱 라우터와 페이지 라우터 모두에 적용되며, 드래프트 모드에서도 동일하게 적용된다.

Next.js의 자동 캐싱 설정은 개발자가 별도의 구성 없이도 효과적인 캐싱 전략을 사용할 수 있도록 도와준다. 불변 에셋은 장기간 캐시되어 반복적인 요청을 줄일 수 있고, ISR은 정적 콘텐츠를 주기적으로 업데이트하면서 캐싱의 이점을 유지할 수 있다. 동적 페이지의 경우 사용자별 데이터를 보호하기 위해 캐싱이 비활성화된다.

이를 통해 Next.js는 개발자가 각 콘텐츠 유형에 맞는 최적의 캐싱 설정을 손쉽게 적용할 수 있도록 지원한다.

#### 정적 에셋 {#static-assests}

Next.js에서는 정적 에셋을 별도의 도메인이나 CDN(Content Delivery Network)에 호스팅할 수 있는 기능을 제공한다. 이를 위해 `next.config.js` 파일에서 `assetPrefix` 옵션을 사용할 수 있다.

`assetPrefix` 옵션을 사용하면 Next.js가 생성한 JavaScript, CSS 파일과 같은 정적 에셋의 URL 앞에 지정된 접두사가 추가된다. 이 접두사는 에셋이 호스팅되는 별도의 도메인이나 CDN의 URL을 나타낸다.

예를 들어, `next.config.js` 파일에 다음과 같이 `assetPrefix` 를 설정할 수 있다:

```javascript
module.exports = {
  assetPrefix: 'https://cdn.example.com',
};
```

위의 예시에서는 `assetPrefix` 를 `https://cdn.example.com` 으로 설정했다. 이렇게 설정하면 Next.js는 JavaScript와 CSS 파일의 URL 앞에 해당 접두사를 추가한다.

예를 들어, 원래 `/static/js/main.js` 경로의 JavaScript 파일은 `https://cdn.example.com/static/js/main.js` 로 변경됩니다. 마찬가지로 CSS 파일도 `assetPrefix` 가 적용된 URL로 변경된다.

이렇게 정적 에셋을 별도의 도메인이나 CDN에 호스팅하는 이유는 다음과 같은 이점이 있기 때문이다:

1. **로드 밸런싱 및 분산**: CDN은 전 세계 여러 지역에 서버를 분산 배치하여 사용자와 가까운 서버에서 에셋을 제공할 수 있다. 이를 통해 에셋 로딩 속도를 향상시킬 수 있다.
2. **캐싱 효율성**: CDN은 에셋을 캐싱하여 반복적인 요청에 대해 빠른 응답을 제공할 수 있다. 이는 서버 부하를 줄이고 사용자 경험을 향상시킨다.
3. **도메인 분리**: 에셋을 별도의 도메인에 호스팅하면 브라우저의 동시 연결 제한을 우회할 수 있다. 각 도메인마다 별도의 연결이 생성되므로 더 많은 에셋을 동시에 로드할 수 있다.

하지만 에셋을 별도의 도메인으로 분리하는 것은 단점도 있다. 가장 큰 단점은 추가적인 DNS 조회와 TLS 핸드셰이크가 필요하다는 점이다. 새로운 도메인을 사용할 때마다 DNS 조회와 TLS 연결 설정에 시간이 소요되므로, 초기 로딩 속도가 느려질 수 있다.

따라서 에셋을 별도의 도메인이나 CDN에 호스팅할 때는 trade-off를 고려해야 한다. 에셋의 크기, 사용 빈도, 사용자의 지리적 분포 등을 고려하여 결정할 수 있다. 작은 프로젝트에서는 에셋을 분리하지 않고 단일 도메인에서 제공하는 것이 더 나은 선택일 수 있다.

Next.js의 `assetPrefix` 옵션은 이러한 에셋 호스팅 전략을 쉽게 구현할 수 있도록 도와준다. 필요에 따라 `next.config.js` 에서 `assetPrefix` 를 설정하여 에셋 호스팅을 유연하게 제어할 수 있다.

[`assetPrefix`](https://nextjs.org/docs/app/api-reference/next-config-js/assetPrefix) 자세히 알아보기

#### 캐싱 설정 {#configuring-caching}

기본적으로 생성된 캐시 에셋은 메모리(기본값 50MB)와 디스크에 저장된다. Kubernetes와 같은 컨테이너 오케스트레이션 플랫폼을 사용하여 Next.js를 호스팅하는 경우, 각 Pod는 캐시의 복사본을 가지게 된다. 기본적으로 Pod 간에 캐시가 공유되지 않으므로 오래된 데이터가 표시되는 것을 방지하기 위해 Next.js 캐시를 설정하여 캐시 핸들러를 제공하고 인메모리 캐싱을 비활성화할 수 있다.

자체 호스팅 시 ISR/데이터 캐시 위치를 설정하려면 `next.config.js` 파일에서 커스텀 핸들러를 구성할 수 있다:

```javascript
// next.config.js
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // 기본 인메모리 캐싱 비활성화
};
```

그런 다음 프로젝트의 루트에 `cache-handler.js` 를 생성한다. 예를 들면:

```javascript
// cache-handler.js
const cache = new Map();

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    // 이는 내구성 있는 스토리지와 같이 어디에나 저장할 수 있다.
    return cache.get(key);
  }

  async set(key, data, ctx) {
    // 이는 내구성 있는 스토리지와 같이 어디에나 저장할 수 있다.
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
      tags: ctx.tags,
    });
  }

  async revalidateTag(tag) {
    // 캐시의 모든 항목을 순회한다.
    for (let [key, value] of cache) {
      // 값의 태그가 지정된 태그를 포함하면 해당 항목을 삭제한다.
      if (value.tags.includes(tag)) {
        cache.delete(key);
      }
    }
  }
};
```

커스텀 캐시 핸들러를 사용하면 Next.js 애플리케이션을 호스팅하는 모든 Pod에서 일관성을 보장할 수 있다. 예를 들어 Redis나 AWS S3와 같은 곳에 캐시된 값을 저장할 수 있다.

:::tip
`revalidatePath` 는 캐시 태그 위에 있는 편의 계층이다. `revalidatePath` 를 호출하면 제공된 페이지에 대한 특수한 기본 태그와 함께 `revalidateTag` 함수가 호출된다.
:::

### 빌드 캐시 {#build-cache}

Next.js에서는 `next build` 명령을 실행할 때 고유한 빌드 ID를 생성한다. 이 빌드 ID는 애플리케이션의 특정 버전을 식별하는 역할을 한다. 즉, 빌드 ID를 통해 현재 제공되고 있는 애플리케이션의 버전을 알 수 있다.

여러 컨테이너를 사용하여 Next.js 애플리케이션을 배포할 때는 모든 컨테이너가 동일한 빌드 버전을 사용해야 한다. 이를 위해 동일한 빌드 출력물을 사용하여 컨테이너를 부팅해야 한다. 이렇게 하면 모든 컨테이너에서 일관된 버전의 애플리케이션이 실행되도록 보장할 수 있다.

하지만 개발, 스테이징, 프로덕션 등 환경의 각 단계마다 애플리케이션을 재빌드하는 경우, 빌드 ID가 달라질 수 있다. 이는 각 환경에서 서로 다른 버전의 애플리케이션이 실행될 수 있음을 의미한다.

이러한 문제를 해결하기 위해 `next.config.js` 파일에서 `generateBuildId` 옵션을 사용할 수 있다. `generateBuildId` 는 빌드 ID를 생성하는 함수를 지정하는 옵션이다. 이 함수를 사용하여 모든 환경에서 일관된 빌드 ID를 생성할 수 있다.

예를 들어, `generateBuildId` 에서 Git의 최신 커밋 해시를 사용하도록 설정할 수 있다:

```javascript
module.exports = {
  generateBuildId: async () => {
    // 최신 Git 해시와 같이 무엇이든 사용할 수 있다.
    return process.env.GIT_HASH;
  },
};
```

위의 예시에서는 `process.env.GIT_HASH` 를 사용하여 최신 Git 커밋 해시를 빌드 ID로 사용하도록 설정했다. 이렇게 하면 모든 환경에서 동일한 Git 커밋 해시를 기반으로 빌드 ID가 생성되므로, 컨테이너 간에 일관된 빌드 ID를 사용할 수 있다.

`generateBuildId` 함수는 프로미스를 반환해야 하며, 반환된 값이 빌드 ID로 사용된다. 이를 통해 빌드 ID 생성 과정을 커스터마이즈할 수 있다.

일관된 빌드 ID를 사용하면 컨테이너 간에 동일한 빌드 버전을 사용할 수 있으므로, 버전 불일치로 인한 문제를 방지할 수 있다. 또한 배포 과정에서 예기치 않은 동작이나 버그를 최소화할 수 있다.

따라서 환경의 각 단계마다 재빌드하는 경우에는 `generateBuildId` 를 사용하여 일관된 빌드 ID를 생성하는 것이 좋다. 이를 통해 컨테이너 간에 동일한 빌드 버전을 사용할 수 있으며, 애플리케이션의 안정성과 일관성을 보장할 수 있다.

### 버전 불일치 {#version-skew}

Next.js는 애플리케이션의 버전 간 불일치를 자동으로 처리하고 완화하는 기능을 제공한다. 버전 불일치는 클라이언트와 서버 간에 다른 버전의 애플리케이션 코드나 에셋이 사용될 때 발생할 수 있다.

Next.js는 이러한 버전 불일치를 감지하면 자동으로 애플리케이션을 리로드하여 최신 버전의 에셋을 검색한다. 이는 사용자에게 항상 최신 버전의 애플리케이션을 제공하고, 버전 불일치로 인한 오류나 비정상적인 동작을 방지하기 위한 것이다.

한 가지 예로, `deploymentId` 에 불일치가 있는 경우를 들 수 있다. `deploymentId` 는 애플리케이션의 배포 버전을 식별하는 고유한 식별자다. 클라이언트와 서버 간에 `deploymentId` 가 일치하지 않으면 Next.js는 페이지 전환 시 프리패치된 데이터를 사용하는 대신 하드 네비게이션을 수행한다. 하드 네비게이션은 페이지를 완전히 새로 로드하는 것을 의미하며, 이를 통해 최신 버전의 에셋을 확실히 가져올 수 있다.

하지만 애플리케이션이 리로드되면 페이지 간 상태가 유지되지 않도록 설계되어 있다면 애플리케이션 상태가 손실될 수 있다. 예를 들어 URL 상태나 로컬 스토리지를 사용하여 상태를 저장하면 페이지가 새로 고침되어도 해당 상태는 유지된다. 반면에 `useState` 와 같은 React의 컴포넌트 상태는 페이지 리로드 시 초기화되어 손실된다.

이러한 상태 손실 문제를 해결하기 위해 애플리케이션 상태를 관리하는 방법을 신중히 고려해야 한다. 중요한 상태는 URL 매개변수, 로컬 스토리지, 쿠키 등과 같은 지속적인 저장소에 저장하는 것이 좋다. 또한 상태 관리 라이브러리를 사용하여 애플리케이션 상태를 체계적으로 관리하고 동기화할 수도 있다.

Vercel은 Next.js 애플리케이션을 위한 추가적인 버전 불일치 보호 기능을 제공한다. 새로운 버전이 배포된 후에도 이전 버전의 에셋과 함수를 계속 사용할 수 있도록 보장한다. 이를 통해 배포 과정에서 발생할 수 있는 잠재적인 문제를 최소화할 수 있다.

마지막으로, `next.config.js` 파일에서 `deploymentId` 속성을 수동으로 구성하여 각 요청에 `?dpl` 쿼리 문자열이나 `x-deployment-id` 헤더를 포함시킬 수 있다. 이를 통해 클라이언트와 서버 간에 배포 ID를 명시적으로 전달할 수 있으며, 버전 불일치를 보다 효과적으로 처리할 수 있다.

버전 불일치 문제는 복잡한 웹 애플리케이션에서 자주 발생할 수 있는 문제다. Next.js의 자동 버전 불일치 처리 기능과 Vercel의 추가적인 보호 기능을 활용하면 이러한 문제를 효과적으로 완화하고 사용자에게 일관된 경험을 제공할 수 있다.

:::note 예시

예를 들어, 애플리케이션의 첫 번째 버전(v1)을 배포했다고 가정해보자. 이 버전에는 다음과 같은 컴포넌트가 있다:

```jsx
// components/Header.js
import React from 'react';

const Header = () => {
  return <header>My App v1</header>;
};

export default Header;
```

이제 애플리케이션의 새로운 버전(v2)을 배포했다. 새 버전에서는 `Header` 컴포넌트가 업데이트되었다:

```jsx
// components/Header.js
import React from 'react';

const Header = () => {
  return <header>My App v2</header>;
};

export default Header;
```

문제는 일부 사용자는 여전히 이전 버전(v1)의 애플리케이션을 사용하고 있을 수 있다는 것이다. 이 경우 클라이언트 측에서는 v1의 `Header` 컴포넌트를 기대하지만, 서버에서는 v2의 `Header` 컴포넌트를 반환하게 된다. 이로 인해 버전 불일치가 발생하고 애플리케이션에서 오류가 발생할 수 있다.

Next.js는 이러한 상황을 자동으로 감지하고 처리한다. 버전 불일치가 감지되면 Next.js는 자동으로 페이지를 리로드하여 최신 버전의 에셋을 가져온다. 이 과정에서 클라이언트 측에서는 v2의 `Header` 컴포넌트를 받게 되고, 애플리케이션이 정상적으로 동작하게 된다.

그러나 애플리케이션 상태가 페이지 간에 유지되도록 설계되지 않은 경우, 리로드 과정에서 상태가 손실될 수 있다. 예를 들어 `useState` 를 사용하여 관리하는 상태는 리로드 시 초기화된다:

```jsx
const MyComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

위의 예시에서 `count` 상태는 버전 불일치로 인한 리로드 시 초기값인 0으로 초기화된다.

이러한 문제를 해결하기 위해서는 URL 상태, 로컬 스토리지, 쿠키 등을 사용하여 중요한 상태를 유지할 수 있다. 또한 Redux나 React Context와 같은 상태 관리 도구를 사용하여 애플리케이션 상태를 체계적으로 관리할 수 있다.

:::

### 스트리밍과 서스펜스 {#streaming-and-suspense}

Next.js 앱 라우터는 서버 측에서 클라이언트로 응답을 스트리밍할 수 있는 기능을 제공한다. 스트리밍 응답은 서버가 응답의 일부를 생성하는 즉시 클라이언트에게 전송하는 방식이다. 이를 통해 응답 시간을 줄이고 사용자 경험을 향상시킬 수 있다.

하지만 자체 호스팅 환경에서 Next.js 앱을 배포할 때, Nginx나 유사한 프록시 서버를 사용하는 경우에는 스트리밍 응답이 제대로 동작하지 않을 수 있다. 이는 프록시 서버의 기본 동작 때문이다.

많은 프록시 서버는 기본적으로 버퍼링을 사용하도록 구성되어 있다. 버퍼링은 서버로부터 받은 응답 데이터를 임시로 저장하고, 응답이 완전히 수신된 후에야 클라이언트에게 전송하는 방식이다. 이는 응답을 완전히 받은 후에 한 번에 전송함으로써 네트워크 효율성을 높이기 위한 목적으로 사용된다.

그러나 스트리밍 응답의 경우, 응답 데이터를 부분적으로 생성하고 즉시 클라이언트에게 전송하는 것이 중요하다. 버퍼링이 활성화되어 있으면 응답 데이터가 프록시 서버에 의해 버퍼에 저장되고, 완전히 수신된 후에야 클라이언트에게 전송되기 때문에 스트리밍의 이점을 살릴 수 없게 된다.

따라서 Next.js 앱 라우터에서 스트리밍 응답을 활용하려면 프록시 서버의 버퍼링을 비활성화해야 한다.

Nginx의 경우 `X-Accel-Buffering` 헤더를 `no`로 설정하여 버퍼링을 비활성화할 수 있다. 이는 `next.config.js` 파일에서 다음과 같이 설정할 수 있다:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ];
  },
};
```

위의 설정은 모든 경로( `/:path*{/}?` )에 대해 `X-Accel-Buffering` 헤더를 `no` 로 설정한다. 이렇게 하면 Nginx에서 해당 경로에 대한 응답을 버퍼링하지 않고 즉시 클라이언트에게 전송하게 된다.

다른 프록시 서버를 사용하는 경우에도 유사한 방식으로 버퍼링을 비활성화할 수 있다. 해당 프록시 서버의 설정 방법을 참조하여 버퍼링을 비활성화하는 것이 중요하다.

스트리밍 응답을 활용하면 응답 시간을 단축하고 사용자 경험을 향상시킬 수 있다. Next.js 앱 라우터는 이를 지원하며, 자체 호스팅 환경에서도 프록시 서버의 버퍼링을 비활성화함으로써 스트리밍 응답을 활용할 수 있다.
