---
title: 클라이언트 컴포넌트
description:
date: 2024-03-25
tags: ['rendering', 'client_component', 'use_client']
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/rendering/client-components',
    },
  ]
---

Client Components를 사용하면 [서버에서 미리 렌더링](https://github.com/reactwg/server-components/discussions/4)되고 클라이언트 JavaScript를 사용하여 브라우저에서 실행할 수 있는 인터랙티브한 UI를 작성할 수 있다.

이 페이지에서는 Client Components의 작동 방식, 렌더링 방식 및 언제 사용하는 것이 좋은지 알아본다.

## 클라이언트 렌더링의 이점 {#benefits-of-client-rendering}

클라이언트에서 렌더링 작업을 수행하는 것에는 다음과 같은 몇 가지 이점이 있다:

- **상호작용성**: Client Components는 state, effects 및 event listener를 사용할 수 있으므로 사용자에게 즉각적인 피드백을 제공하고 UI를 업데이트할 수 있다.
- **브라우저 API**: Client Components는 [geolocation](https://developer.mozilla.org/docs/Web/API/Geolocation_API)이나 [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage)와 같은 브라우저 API에 접근할 수 있다.

## Next.js에서 Client Components 사용하기 {#using-client-components-in-nextjs}

Client Components를 사용하려면 파일 상단의 import문 위에 React [`"use client"`](https://www.vigorously.xyz/docs/react/react-doc-reference-useclient/) 지시어를 추가하면 된다.

`"use client"` 는 Server와 Client Component 모듈 간의 경계를 선언하는 데 사용된다. 즉, 파일에 `"use client"` 를 정의하면 해당 파일로 import되는 다른 모든 모듈(하위 컴포넌트 포함)이 클라이언트 번들의 일부로 간주된다.

```tsx
// app/counter.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

아래 다이어그램은 `"use client"` 지시어가 정의되지 않은 경우 중첩된 컴포넌트( `toggle.js` )에서 `onClick` 과 `useState` 를 사용하면 오류가 발생하는 것을 보여준다. 이는 기본적으로 App Router의 모든 컴포넌트가 Server Components이기 때문에 이러한 API를 사용할 수 없기 때문이다. `toggle.js` 에 `"use client"` 지시어를 추가하면 React에게 이러한 API를 사용할 수 있는 클라이언트 바운더리로 진입하도록 지시할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-rendering-client-components/1.png)

:::note 다수의 use client 엔트리포인트 정의하기
React Component 트리에서 여러 개의 `"use client"` 엔트리포인트를 정의할 수 있다. 이를 통해 애플리케이션을 여러 개의 클라이언트 번들로 분할할 수 있다.

그러나 클라이언트에서 렌더링되어야 하는 모든 컴포넌트에 `"use client"` 를 추가할 필요는 없다. 경계를 한 번 정의하면 해당 경계로 import되는 모든 하위 컴포넌트와 모듈이 클라이언트 번들의 일부로 간주된다.
:::

## 클라이언트 컴포넌트는 어떻게 렌더링될까? {#how-are-client-components-rendered}

Next.js에서 클라이언트 컴포넌트는 전체 페이지 로드(애플리케이션에 처음 방문하거나 브라우저 새로고침으로 인해 페이지가 다시 로드되는 경우)인지 아니면 후속 탐색인지에 따라 렌더링 방식이 달라진다.

### 전체 페이지 로드

초기 페이지 로드를 최적화하기 위해 Next.js는 React의 API를 사용하여 클라이언트 컴포넌트와 서버 컴포넌트 모두에 대해 서버에서 정적 HTML 미리보기를 렌더링한다. 즉, 사용자가 처음 애플리케이션을 방문할 때 클라이언트가 JavaScript 번들을 다운로드, 파싱 및 실행하기를 기다릴 필요 없이 페이지의 내용을 즉시 볼 수 있다.

서버에서:

1. React는 Server Components를 **React Server Component Payload (RSC Payload)** 라는 특수한 데이터 형식으로 렌더링한다.
2. Next.js는 RSC Payload와 Client Component JavaScript 명령을 사용하여 서버에서 **HTML**을 렌더링한다.

그런 다음 클라이언트에서:

1. HTML은 초기 페이지 로드에만 사용되며, 빠르게 비대화형 미리보기를 보여주는 데 사용된다.
2. React Server Components Payload는 Client 및 Server Component 트리를 조정하고 DOM을 업데이트하는 데 사용된다.
3. JavaScript 명령은 Client Components를 [hydrate](https://www.vigorously.xyz/docs/react/react-doc-reference-react-dom-hydrateroot/)하고 애플리케이션을 대화형으로 만드는 데 사용된다.

:::tip 하이드레이션(hydrate)이란?
하이드레이션은 정적 HTML을 대화형으로 만들기 위해 DOM에 이벤트 리스너를 연결하는 프로세스다. 내부적으로 하이드레이션은 React의 hydrateRoot API를 사용하여 수행된다.
:::

### 후속 탐색 {#subsequent-navigation}

후속 탐색에서 클라이언트 컴포넌트는 서버 렌더링된 HTML 없이 완전히 클라이언트에서 렌더링된다.

이는 클라이언트 컴포넌트 JavaScript 번들이 다운로드되고 파싱되었음을 의미한다. 번들이 준비되면 React는 RSC Payload를 사용하여 클라이언트 및 서버 컴포넌트 트리를 조정하고 DOM을 업데이트한다.

## 서버 환경으로 돌아가기 {#going-back-to-the-server-environment}

때로는 `"use client"` 경계를 선언한 후에 다시 서버 환경으로 돌아가고 싶을 때가 있다. 예를 들어 클라이언트 번들 크기를 줄이거나, 서버에서 데이터를 가져오거나, 서버에서만 사용할 수 있는 API를 사용하고 싶을 수 있다.

클라이언트 컴포넌트와 서버 컴포넌트 및 서버 액션을 서로 엮음으로써 이론적으로 클라이언트 컴포넌트 내부에 중첩되어 있더라도 코드를 서버에 유지할 수 있다. 자세한 내용은 조합 패턴 페이지를 참조한다.
