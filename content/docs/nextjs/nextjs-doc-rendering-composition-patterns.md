---
title: 컴포지션 패턴
description:
date: 2024-03-25
tags: ['rendering', 'client_component', 'server_component']
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns',
    },
  ]
---

React 애플리케이션을 구축할 때는 애플리케이션의 어떤 부분을 서버에서 렌더링해야 하고 어떤 부분을 클라이언트에서 렌더링해야 하는지 고려해야 한다. 이 페이지에서는 서버 컴포넌트와 클라이언트 컴포넌트를 사용할 때 권장되는 컴포지션 패턴에 대해 다룬다.

## 서버 컴포넌트와 클라이언트 컴포넌트는 언제 사용해야 할까? {#when-to-use-server-and-client-component}

서버 컴포넌트와 클라이언트 컴포넌트의 다양한 사용 사례를 간단히 요약해보면 다음과 같다:

| 사용사례                                                                | 서버 컴포넌트 | 클라이언트 컴포넌트 |
| ----------------------------------------------------------------------- | ------------- | ------------------- |
| 데이터 fetch                                                            | ✅            | ❌                  |
| 백엔드 리소스에 직접 접근                                               | ✅            | ❌                  |
| 민감한 데이터 서버에 보관(access token, API keys 등...)                 | ✅            | ❌                  |
| 서버에 대규모 종속성 유지 / 클라이언트 측 자바스크립트 감소             | ✅            | ❌                  |
| 상호작용 및 이벤트 리스너 추가(`onClick()`, `onChange()` 등...)         | ❌            | ✅                  |
| state와 effect 사용 (`useState()`, `useReducer()`, `useEffect()` 등...) | ❌            | ✅                  |
| 브라우저 전용 API 사용                                                  | ❌            | ✅                  |
| state, effects 또는 브라우저 전용 API에 의존하는 커스텀 훅              | ❌            | ✅                  |
| React 클래스 컴포넌트                                                   | ❌            | ✅                  |

## 서버 컴포넌트 패턴 {#server-component-patterns}

클라이언트 사이드 렌더링을 선택하기 전에 데이터 fetch, 데이터베이스 또는 백엔드 서비스 액세스와 같은 작업을 서버에서 수행하고 싶을 수 있다.

서버 컴포넌트로 작업할 때 일반적인 패턴은 다음과 같다:

### 컴포넌트 간 데이터 공유 {#sharing-data-between-components}

서버에서 데이터를 fetch할 때 여러 컴포넌트에서 데이터를 공유해야 하는 경우가 있다. 예를 들어, 레이아웃과 페이지가 동일한 데이터에 의존할 수 있다.

React Context(서버에서 사용할 수 없음)를 사용하거나 데이터를 props로 전달하는 대신, 데이터를 필요로 하는 컴포넌트에서 `fetch` 또는 React의 `cache` 함수를 사용하여 동일한 데이터를 가져올 수 있다. 이때 동일한 데이터에 대한 중복 요청을 걱정할 필요가 없다. 그 이유는 React가 `fetch` 를 확장하여 데이터 요청을 자동으로 메모이제이션하고, `fetch` 를 사용할 수 없는 경우 `cache` 함수를 사용할 수 있기 때문이다.

React의 [메모이제이션](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)에 대해 자세히 알아본다.

### 서버 전용 코드를 클라이언트 환경에서 분리하기 {#keeping-server-only-code-out-of-the-client-environment}

JavaScript 모듈은 서버 컴포넌트 모듈과 클라이언트 컴포넌트 모듈 모두에서 공유될 수 있으므로, 서버에서만 실행되도록 의도된 코드가 클라이언트로 유출될 수 있다.

예를 들어, 다음과 같은 데이터 fetch 함수를 살펴보자:

```ts
// lib/data.ts
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  });

  return res.json();
}
```

처음 보면 `getData` 가 서버와 클라이언트 모두에서 작동할 것처럼 보인다. 그러나 이 함수는 서버에서만 실행되도록 의도하여 작성된 `API_KEY` 를 포함하고 있다.

환경 변수 `API_KEY` 가 `NEXT_PUBLIC` 으로 시작하지 않으므로 서버에서만 접근할 수 있는 비공개 변수다. 환경 변수가 클라이언트로 유출되는 것을 방지하기 위해 Next.js는 비공개 환경 변수를 빈 문자열로 대체한다.

그 결과, `getData()` 를 클라이언트에서 가져와서 실행할 수 있지만 예상대로 작동하지 않는다. 변수를 공개로 만들면 함수가 클라이언트에서 작동하겠지만, 민감한 정보를 클라이언트에 노출하고 싶지 않을 수 있다.

이러한 서버 코드의 의도하지 않은 클라이언트 사용을 방지하기 위해 `server-only` 패키지를 사용하여 다른 개발자가 이러한 모듈을 실수로 클라이언트 컴포넌트로 import하는 경우 빌드 시 오류를 제공할 수 있다.

`server-only` 를 사용하려면 먼저 패키지를 설치한다:

```bash
npm install server-only
```

그런 다음 서버 전용 코드가 포함된 모든 모듈에 패키지를 import 한다:

```javascript
// lib/data.js
import 'server-only';

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  });

  return res.json();
}
```

이제 `getData()` 를 import하는 모든 클라이언트 컴포넌트는 이 모듈이 서버에서만 사용할 수 있다는 내용의 빌드 오류를 받게 된다.

`client-only` 라는 해당 패키지를 사용하여 `window` 객체에 접근하는 코드와 같이 클라이언트 전용 코드가 포함된 모듈을 표시할 수도 있다.

### 써드파티 패키지 및 프로바이더 사용하기 {#using-third-party-packages-and-providers}

서버 컴포넌트는 새로운 React 기능이기 때문에 써드파티 패키지와 제공자들은 `useState`, `useEffect`, `createContext` 와 같은 클라이언트 전용 기능을 사용하는 컴포넌트에 `"use client"` 지시문을 추가하기 시작했다.

오늘날 클라이언트 전용 기능을 사용하는 `npm` 패키지의 많은 컴포넌트에는 아직 지시문이 추가되지 않은 상태다. 이러한 써드파티 컴포넌트는 `"use client"` 지시문이 있는 클라이언트 컴포넌트 내에서는 예상대로 작동하지만 서버 컴포넌트 내에서는 작동하지 않는다.

예를 들어, 가상의 `acme-carousel` 패키지를 설치했고 이 패키지에는 `<Carousel />` 컴포넌트가 있다고 가정해 보자. 이 컴포넌트는 `useState` 를 사용하지만 아직 `"use client"` 지시문이 없다.

클라이언트 컴포넌트 내에서 `<Carousel />` 을 사용하면 예상대로 작동한다:

```tsx
// app/gallery.tsx
'use client';

import { useState } from 'react';
import { Carousel } from 'acme-carousel';

export default function Gallery() {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>

      {/* Carousel이 Client Component내에서 사용되었기 때문에 정상 작동한다. */}
      {isOpen && <Carousel />}
    </div>
  );
}
```

그러나 서버 컴포넌트 내에서 직접 사용하려고 하면 오류가 발생한다:

```tsx
// app/page.tsx
import { Carousel } from 'acme-carousel';

export default function Page() {
  return (
    <div>
      <p>View pictures</p>

      {/* Error: `useState` can not be used within Server Components */}
      <Carousel />
    </div>
  );
}
```

이는 Next.js가 `<Carousel />` 이 클라이언트 전용 기능을 사용하고 있는지 아닌지 판단할 수 없기 때문이다.

이를 해결하려면 클라이언트 전용 기능에 의존하는 써드파티 컴포넌트를 자신만의 클라이언트 컴포넌트로 래핑하면 된다:

```tsx
// app/carousel.tsx
'use client';

import { Carousel } from 'acme-carousel';

export default Carousel;
```

이제 `<Carousel />`을 서버 컴포넌트 내에서 직접 사용할 수 있다:

```tsx
// app/page.tsx
import Carousel from './carousel';

export default function Page() {
  return (
    <div>
      <p>View pictures</p>

      {/*  이제 Carousel은 클라이언트 컴포넌트이기 때문에 정상 작동한다. */}
      <Carousel />
    </div>
  );
}
```

대부분의 써드파티 컴포넌트는 클라이언트 컴포넌트 내에서 사용할 가능성이 높기 때문에 래핑할 필요는 없을 것으로 예상된다. 그러나 프로바이더는 예외다. 프로바이더는 React 상태와 컨텍스트에 의존하며 일반적으로 애플리케이션의 루트에서 필요하기 때문이다.

#### 컨텍스트 프로바이더 사용하기 {#using-context-providers}

컨텍스트 프로바이더는 일반적으로 현재 테마와 같은 전역적인 관심사를 공유하기 위해 애플리케이션의 루트 근처에 렌더링된다. React 컨텍스트는 서버 컴포넌트에서 지원되지 않기 때문에 애플리케이션의 루트에서 컨텍스트를 생성하려고 하면 오류가 발생한다:

```tsx
// app/layout.tsx
import { createContext } from 'react';

// createContext는 서버 컴포넌트에서 지원되지 않는다.
export const ThemeContext = createContext({});

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      </body>
    </html>
  );
}
```

이를 해결하기 위해서 클라이언트 컴포넌트 내에서 컨텍스트를 생성하고 프로바이더를 렌더링 한다:

```tsx
// app/theme-provider.tsx
'use client';

import { createContext } from 'react';

export const ThemeContext = createContext({});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}
```

이제 서버 컴포넌트는 프로바이더가 클라이언트 컴포넌트로 표시되었기 때문에 프로바이더를 직접 렌더링할 수 있다:

```tsx
// app/layout.tsx
import ThemeProvider from './theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

루트에 프로바이더가 렌더링되면 앱 전체의 다른 모든 클라이언트 컴포넌트가 해당 컨텍스트를 사용할 수 있다.

:::tip
프로바이더는 트리에서 가능한 한 깊이 렌더링해야 한다. `ThemeProvider` 가 전체 `<html>` 문서 대신 `{children}` 만 감싸는 것에 유의한다. 이렇게 하면 Next.js가 서버 컴포넌트의 정적 부분을 최적화하기 쉬워진다.
:::

#### 라이브러리 작성자를 위한 조언 {#advice-for-library-authors}

비슷한 방식으로 다른 개발자가 사용할 패키지를 만드는 라이브러리 작성자는 `"use client"` 지시문을 사용하여 패키지의 클라이언트 진입점을 표시할 수 있다. 이렇게 하면 패키지 사용자가 래퍼를 만들 필요 없이 서버 컴포넌트에 패키지 컴포넌트를 직접 import할 수 있다.

트리의 더 깊은 곳에서 `'use client'` 를 사용하여 패키지를 최적화할 수 있으며, 이를 통해 모듈이 서버 컴포넌트 모듈 그래프의 일부가 될 수 있다.

일부 번들러는 `"use client"` 지시문을 제거할 수 있다. [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13)와 [Vercel Analytics](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30) 리포지토리에서 `"use client"` 지시문을 포함하도록 esbuild를 구성하는 방법의 예를 찾을 수 있다.

## 클라이언트 컴포넌트 {#client-components}

### 클라이언트 컴포넌트를 트리 아래로 이동하기 {#moving-client-components-down-the-tree}

클라이언트 JavaScript 번들 크기를 줄이기 위해 클라이언트 컴포넌트를 컴포넌트 트리 아래로 이동하는 것을 권장한다.

예를 들어, 정적 요소(로고, 링크 등)와 상태를 사용하는 대화형 검색 창이 있는 경우, 전체 레이아웃을 클라이언트 컴포넌트로 만드는 대신, 대화형 로직을 클라이언트 컴포넌트(예: `<SearchBar />`)로 이동하고 레이아웃은 서버 컴포넌트로 유지한다. 이는 레이아웃의 모든 컴포넌트 JavaScript를 클라이언트로 보낼 필요가 없기 때문이다.

```tsx
// app/layout.tsx

// SearchBar는 클라이언트 컴포넌트다.
import SearchBar from './searchbar';
// Logo는 서버 컴포넌트다.
import Logo from './logo';

// Layout은 기본적으로 서버 컴포넌트다.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  );
}
```

### 서버에서 클라이언트 컴포넌트로 props 전달하기 (직렬화) {#passing-props-from-server-to-client-components}

서버 컴포넌트에서 데이터를 fetch하는 경우, 데이터를 props로 클라이언트 컴포넌트에 전달하고 싶을 수 있다. 서버에서 클라이언트 컴포넌트로 전달되는 props는 React에 의해 직렬화 가능해야 한다.

클라이언트 컴포넌트가 직렬화할 수 없는 데이터에 의존하는 경우, [써드파티 라이브러리를 사용하여 클라이언트에서 데이터를 fetch](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-client-with-third-party-libraries) 하거나 [Route Handler](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-route-handlers/)를 통해 서버에서 데이터를 fetch할 수 있다.

## 서버 컴포넌트에 클라이언트 컴포넌트 끼워넣기 {#interleaving-server-and-client-component}

서버 컴포넌트에 클라이언트 컴포넌트를 끼워넣을 때는 UI를 컴포넌트 트리로 시각화하는 것이 도움이 된다. 서버 컴포넌트인 루트 레이아웃에서 시작하여 `"use client"` 지시문을 추가하여 특정 컴포넌트 하위 트리를 클라이언트에서 렌더링할 수 있다.

클라이언트 하위 트리 내에서는 여전히 서버 컴포넌트를 중첩하거나 서버 액션을 호출할 수 있지만, 다음과 같은 사항을 염두에 두어야 한다:

- 요청-응답 생명 주기 동안 코드는 서버에서 클라이언트로 이동한다. 클라이언트에 있는 동안 서버의 데이터나 리소스에 접근해야 하는 경우, 서버로 **새로운** 요청을 보내야 한다. 앞뒤로 전환하는 것이 아니다.

- 서버에 새로운 요청이 이루어지면 클라이언트 컴포넌트 내부에 중첩된 컴포넌트를 포함하여 모든 서버 컴포넌트가 먼저 렌더링된다. 렌더링된 결과(RSC 페이로드)에는 클라이언트 컴포넌트의 위치에 대한 참조가 포함된다. 그런 다음 클라이언트에서 React는 RSC 페이로드를 사용하여 서버 컴포넌트와 클라이언트 컴포넌트를 단일 트리로 조정한다.

- 클라이언트 컴포넌트는 서버 컴포넌트 후에 렌더링되므로 클라이언트 컴포넌트 모듈에 서버 컴포넌트를 import할 수 없다(서버로 새로운 요청이 필요하기 때문). 대신 서버 컴포넌트를 `props` 로 클라이언트 컴포넌트에 전달할 수 있다.

### 지원되지 않는 패턴: 클라이언트 컴포넌트에 서버 컴포넌트 import 하기 {#unsupported-pattern-importing-server-components-into-client-component}

클라이언트 컴포넌트에 서버 컴포넌트를 import할 수 없다:

```tsx
// app/client-component.tsx
'use client';

// 클라이언트 컴포넌트로 서버 컴포넌트를 가져올 수 없다.
import ServerComponent from './Server-Component';

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>

      <ServerComponent />
    </>
  );
}
```

위 코드에서는 `ClientComponent` 내부에서 `ServerComponent` 를 import하고 있다. 그러나 이는 지원되지 않는 패턴이다.

클라이언트 컴포넌트는 서버 컴포넌트 후에 렌더링되므로, 클라이언트 컴포넌트 모듈에서 서버 컴포넌트를 import하려면 서버로 새로 요청을 해야한다. 이는 클라이언트와 서버 간의 상호작용 방식과 일치하지 않는다.

대신 서버 컴포넌트를 `props` 로 클라이언트 컴포넌트에 전달하는 방식을 사용해야 한다.

### 지원되는 패턴: 서버 컴포넌트를 클라이언트 컴포넌트에 props로 전달하기 {#supported-pattern-passing-server-components-to-client-components-as-props}

서버 컴포넌트를 클라이언트 컴포넌트에 props로 전달할 수 있다.

일반적인 패턴은 React의 `children` prop을 사용하여 클라이언트 컴포넌트에 _"슬롯"_ 을 만드는 것이다.

아래 예시에서 `<ClientComponent>` 는 `children` prop을 받는다:

```tsx
// app/client-component.tsx
'use client';

import { useState } from 'react';

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {children}
    </>
  );
}
```

`<ClientComponent>` 는 `children` 이 최종적으로 서버 컴포넌트로 채워질 것이라는 사실을 알지 못한다. `<ClientComponent>` 의 유일한 책임은 `children` 이 최종적으로 어디에 위치할 지 결정하는 것 뿐이다.

부모 서버 컴포넌트에서는 `<ClientComponent>` 와 `<ServerComponent>` 를 모두 import 하여 `<ServerComponent>` 를 `<ClientComponent>` 의 자식으로 전달할 수 있다:

```tsx
// app/page.tsx

// 서버 컴포넌트를 클라이언트 컴포넌트의 자식이나 prop으로 전달할 수 있다.
import ClientComponent from './client-component';
import ServerComponent from './server-component';

// Next.js의 페이지는 기본적으로 서버 컴포넌트다.
export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  );
}
```

이 접근 방식에서는 `<ClientComponent>` 와 `<ServerComponent>` 가 분리되어 독립적으로 렌더링될 수 있다. 이 경우 자식 `<ServerComponent>` 는 `<ClientComponent>` 가 클라이언트에서 렌더링되기 훨씬 전에 서버에서 렌더링될 수 있다.

:::tip

- "컨텐츠 끌어올리기(lifting content up)" 패턴은 부모 컴포넌트가 다시 렌더링될 때 중첩된 자식 컴포넌트의 리렌더링을 피하기 위해 사용되었다.
- 슬롯은 `children` prop으로 국한되지 않는다. 어떤 prop이라도 JSX를 전달하는 데 사용할 수 있다.

:::

:::note 컨텐츠 끌어올리기(lifting content up)

"컨텐츠 끌어올리기(lifting content up)" 패턴은 React에서 성능 최적화를 위한 패턴이다. 이 패턴의 주요 목적은 불필요한 리렌더링을 방지하여 앱의 성능을 향상시키는 것이다.

부모 컴포넌트가 리렌더링될 때마다 자식 컴포넌트도 리렌더링된다. 그런데 자식 컴포넌트에 상태가 있는 경우, 부모의 재렌더링으로 인해 자식의 상태가 초기화되어 버린다. 이는 성능 저하와 원치 않는 부작용을 초래할 수 있다.

이 문제를 해결하기 위해 "컨텐츠 끌어올리기" 패턴을 사용한다. 이 패턴의 핵심 아이디어는 자식 컴포넌트의 상태를 부모 컴포넌트로 옮기는 것이다. 그러면 부모가 리렌더링되더라도 자식의 상태는 유지된다.

구체적인 예를 살펴보자:

```jsx
// 부모 컴포넌트
function Parent() {
  const [childData, setChildData] = useState('');

  const handleChildDataChange = (data) => {
    setChildData(data);
  };

  return (
    <div>
      <Child data={childData} onDataChange={handleChildDataChange} />
    </div>
  );
}

// 자식 컴포넌트
function Child({ data, onDataChange }) {
  const handleInputChange = (e) => {
    onDataChange(e.target.value);
  };

  return <input value={data} onChange={handleInputChange} />;
}
```

위 예시에서 `Child` 컴포넌트의 상태인 `data` 는 부모 컴포넌트 `Parent` 로 이동했다. `Parent` 가 리렌더링되더라도 `childData` 상태는 유지되므로 `Child` 는 불필요한 리렌더링을 피할 수 있다.

이 패턴은 상태가 복잡해질수록 더 유용해진다. 상태 관리를 위해 Context API나 Redux 같은 상태 관리 라이브러리를 사용하는 것도 좋은 대안이다.
:::
