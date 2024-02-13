---
title: useTransition
description: useTransition Hook 문서
date: 2024-02-12
tags: [hook]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react/useTransition',
    },
  ]
---

`useTransition` 은 UI를 차단(block)하지 않고 상태를 업데이트할 수 있는 React Hook 이다.

```jsx
const [isPending, startTransition] = useTransition();
```

## 레퍼런스 {#reference}

### useTransition() {#use-transition}

컴포넌트의 최상위 수준에서 `useTransition` 을 호출하여 일부 상태 업데이트를 트랜지션으로 표시한다.

```jsx
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

#### 파라미터 {#parameters1}

`useTransition` 은 파라미터를 받지 않는다.

#### 리턴 {#returns1}

`useTransition` 은 다음의 두 개의 아이템이 있는 배열을 리턴한다:

1. 보류 중인 트랜지션이 있는지 여부를 알려주는 `isPending` 플래그.
2. 상태 업데이트를 트랜지션으로 표시할 수 있는 `startTransition` 함수.

### startTransition 함수

`useTransition` 이 반환하는 `startTransition` 함수를 사용하면 상태 업데이트를 트랜지션으로 표시할 수 있다.

```jsx
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### 파라미터 {#parameters2}

| 파라미터 | 설명                                                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scope`  | 하나 이상의 `set` 함수를 호출하여 일부 상태를 업데이트하는 함수. React는 매개변수 없이 즉시 `scope` 를 호출하고 `scope` 함수 호출 중에 동기적으로 예약된 모든 상태 업데이트를 트랜지션으로 표시한다. 이 함수는 non-blocking 이며 원치 않는 로딩 표시기를 표시하지 않는다. |

#### 리턴 {#returns2}

`startTransition` 함수는 아무것도 리턴하지 않는다.

#### 주의사항 {#caveats2}

- `useTransition` 은 Hook이므로 컴포넌트나 커스텀 Hook 내부에서만 호출할 수 있다. 다른 곳(예: 데이터 라이브러리)에서 트랜지션을 시작해야 하는 경우, 독립형 [`startTransition`](https://react.dev/reference/react/startTransition) 을 대신 호출한다.
- 해당 상태의 `set` 함수에 액세스할 수 있는 경우에만 업데이트를 트랜지션으로 래핑할 수 있다. 일부 프로퍼티나 커스텀 Hook 값에 대한 응답으로 트랜지션을 시작하려면 대신 [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) 를 사용한다.
- `startTransition` 에 전달하는 함수는 동기식이어야 한다. React는 이 함수를 즉시 실행하여 실행되는 동안 발생하는 모든 상태 업데이트를 트랜지션으로 표시한다. 나중에 더 많은 상태 업데이트를 수행하려고 하면(예: timeout), 트랜지션으로 표시되지 않는다.
- 트랜지션으로 표시된 상태 업데이트는 다른 상태 업데이트에 의해 중단된다. 예를 들어, 트랜지션 내에서 차트 컴포넌트를 업데이트한 다음 차트가 다시 렌더링되는 도중에 입력을 시작하면 React는 입력 업데이트를 처리한 후 차트 컴포넌트에 대한 렌더링 작업을 다시 시작한다.
- 트랜지션 업데이트는 텍스트 입력을 제어하는 데 사용할 수 없다.
- 진행 중인 트랜지션이 여러 개 있는 경우, React는 현재 트랜지션을 일괄 처리한다. 이는 향후 릴리스에서 제거될 가능성이 높은 제한 사항이다.

## 사용법 {#usage}

### 상태 업데이트를 논 블로킹 트랜지션으로 표시하기 {#marking-a-state-update-as-a-non-blocking-transition}

컴포넌트의 최상위 수준에서 `useTransition` 을 호출하여 상태 업데이트를 논 블로킹 트랜지션으로 표시한다.

```jsx
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` 은 정확히 두 개의 아이템이 있는 배열을 리턴한다:

1. 보류 중인 트랜지션이 있는지 여부를 알려주는 `isPending` 플래그.
2. 상태 업데이트를 트랜지션으로 표시할 수 있는 `startTransition` 함수.

그런 다음 상태 업데이트를 다음과 같이 트랜지션으로 표시할 수 있다:

```jsx
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

트랜지션을 사용하면 느린 기기에서도 사용자 인터페이스 업데이트의 반응성을 유지할 수 있다.

_트랜지션을 사용하면 리렌더링 중에도 UI가 반응성을 유지한다._ 예를 들어 사용자가 탭을 클릭했다가 마음이 바뀌어 다른 탭을 클릭하면 첫 번째 리렌더링이 완료될 때까지 기다릴 필요 없이 다른 탭을 클릭할 수 있다.

### 트랜지션으로 부모 컴포넌트 업데이트하기 {#updating-the-parent-component-in-a-transition}

`useTransition` 으로 부모 컴포넌트의 상태를 업데이트할 수도 있다. 예를 들어, 다음의 `TabButton` 컴포넌트는 `onClick` 로직을 트랜지션으로 래핑한다:

```jsx
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>;
  }
  return (
    <button
      onClick={() => {
        startTransition(() => {
          onClick();
        });
      }}
    >
      {children}
    </button>
  );
}
```

부모 컴포넌트는 `onClick` 이벤트 핸들러 내에서 상태를 업데이트하므로 해당 상태 업데이트는 트랜지션으로 표시된다. 그렇기 때문에 앞의 예에서처럼 'Posts' 를 클릭한 다음 바로 'Contact' 를 클릭할 수 있다. 선택한 탭을 업데이트하는 것은 트랜지션으로 표시되므로 사용자 상호 작용을 차단하지 않는다.

```jsx
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>;
  }
  return (
    <button
      onClick={() => {
        startTransition(() => {
          onClick();
        });
      }}
    >
      {children}
    </button>
  );
}
```

### 트랜지션 중 펜딩 시각적 상태 표시하기 {#displaying-a-pending-visual-state-during-the-transition}

`useTransition` 이 리턴 하는 `isPending` 부울 값을 사용하여 트랜지션이 진행 중임을 사용자에게 표시할 수 있다. 예를 들어 탭 버튼은 'pending' 에 대한 특별한 시각적 상태를 가질 수 있다:

```jsx
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

이제 'Posts' 를 클릭하면 탭 버튼 자체가 바로 업데이트되므로 반응성이 향상된다:

```jsx
// TabButton.js

import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>;
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button
      onClick={() => {
        startTransition(() => {
          onClick();
        });
      }}
    >
      {children}
    </button>
  );
}
```

### 원치 않는 로딩 표시기 방지하기 {#preventing-unwanted-loading-indicators}

다음 예제에서 `PostsTab` 컴포넌트는 [서스펜스 가능한](https://www.vigorously.xyz/docs/react/react-doc-reference-suspense/) 데이터 소스를 사용하여 일부 데이터를 페치 한다. 'Posts' 탭을 클릭하면 `PostsTab` 컴포넌트가 일시 중단되어 가장 가까운 로딩 폴백이 표시된다:

:::tabs

@tab:active App.js#app

```jsx
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton isActive={tab === 'about'} onClick={() => setTab('about')}>
        About
      </TabButton>
      <TabButton isActive={tab === 'posts'} onClick={() => setTab('posts')}>
        Posts
      </TabButton>
      <TabButton isActive={tab === 'contact'} onClick={() => setTab('contact')}>
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

@tab TabButton#tab-button

```jsx
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>;
  }
  return (
    <button
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </button>
  );
}
```

:::

로딩 표시기를 표시하기 위해 전체 탭 컨테이너를 숨기면 사용자 환경이 불안정해진다. `TabButton` 에 `useTransition` 을 추가하면 대신 `TabButton` 에 펜딩 상태를 표시할 수 있다.

'Posts' 를 클릭하면 더 이상 전체 탭 컨테이너가 스피너로 대체되지 않는다:

:::tabs

@tab:active App.js#app

```jsx
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton isActive={tab === 'about'} onClick={() => setTab('about')}>
        About
      </TabButton>
      <TabButton isActive={tab === 'posts'} onClick={() => setTab('posts')}>
        Posts
      </TabButton>
      <TabButton isActive={tab === 'contact'} onClick={() => setTab('contact')}>
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

@tab TabButton#tab-button

```jsx
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>;
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button
      onClick={() => {
        startTransition(() => {
          onClick();
        });
      }}
    >
      {children}
    </button>
  );
}
```

:::

[서스펜스와 트랜지션 함께 사용하기 문서](https://www.vigorously.xyz/docs/react/react-doc-reference-suspense/#Preventing)를 참조한다.

:::note
트랜지션은 이미 표시된 콘텐츠(예: 탭 컨테이너)를 숨기지 않을 만큼만 '대기'한다. Posts 탭에 중첩된 `<Suspense>` 경계가 있는 경우 트랜지션은 이를 기다리지 않는다.
:::

### 서스펜스 지원 라우터 빌드하기 {#building-a-Suspense-enabled-router}

React 프레임워크나 라우터를 구축하는 경우 페이지 네비게이션을 트랜지션으로 표시하는 것이 좋다.

```jsx
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

두 가지 이유로 이 방법을 권장한다:

- 트랜지션은 중단할 수 있으므로 사용자가 리렌더링이 완료될 때까지 기다리지 않고 바로 클릭할 수 있다.
- 트랜지션은 원치 않는 로딩 표시기를 방지하여 사용자가 네비게이션에서 갑작스러운 점프를 피할 수 있다.

다음은 네비게이션에 트랜지션을 사용하는 간단한 라우터 예시다.

:::tabs

@tab:active App.js#app

```jsx
{% raw %}import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = <IndexPage navigate={navigate} />;
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return <Layout isPending={isPending}>{content}</Layout>;
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}{% endraw %}
```

@tab Layout.js#layout

```jsx
{% raw %}export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section
        className="header"
        style={{
          opacity: isPending ? 0.7 : 1,
        }}
      >
        Music Browser
      </section>
      <main>{children}</main>
    </div>
  );
}{% endraw %}
```

@tab IndexPage.js#index-page

```jsx
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

@tab ArtistPage.js#artist-page

```jsx
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

:::

:::note
서스펜스 지원 라우터는 기본적으로 네비게이션 업데이트를 트랜지션으로 래핑할 것으로 예상된다.
:::

### 에러 바운더리로 사용자에게 오류 표시하기 {#displaying-an-error-to-users-with-an-error-boundary}

:::warning Canary
`useTransition` 에러 바운더리는 현재 React의 카나리아 및 실험 채널에서만 사용할 수 있다. React의 릴리스 채널에 대한 자세한 내용은 [여기](https://react.dev/community/versioning-policy#all-release-channels)를 참조한다.
:::

`startTransition` 에 전달된 함수가 오류를 발생시키면 [에러 바운더리](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)를 사용하여 사용자에게 오류를 표시할 수 있다. 에러 바운더리를 사용하려면 `useTransition` 을 호출하는 컴포넌트를 에러 바운더리로 감싸면 된다. `startTransition` 에 전달된 함수가 에러를 발생시키면 에러 경계에 대한 폴백이 표시된다.

```jsx
import { useTransition } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error('Example Error: An error thrown to trigger error boundary');
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

## 트러블슈팅 {#troubleshooting}

### 트랜지션에서 입력 업데이트가 작동하지 않는 경우 {#updating-an-input-in-a-transition-doesnt-work}

입력을 제어하는 상태 변수에는 트랜지션을 사용할 수 없다:

```jsx
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ 입력 상태에 트랜지션을 사용할 수 없다.
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

이는 트랜지션이 논 블로킹 이지만 체인지 이벤트에 대한 응답으로 입력을 업데이트하는 것은 동기적으로 이루어져야 하기 때문이다. 입력에 대한 응답으로 트랜지션을 실행하려는 경우 두 가지 옵션이 있다:

1. 두 개의 상태 변수를 선언할 수 있다. 하나는 입력 상태(항상 동기적으로 업데이트됨)용이고 다른 하나는 트랜지션 시 업데이트할 상태 변수다. 이렇게 하면 동기 상태를 사용하여 입력을 제어하고, 나머지 렌더링 로직에 (입력보다 "지연"되는) 트랜지션 상태 변수를 전달할 수 있다.
2. 또는 상태 변수가 하나만 있고 실제 값보다 "지연"되는 [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) 를 추가할 수 있다. 그러면 논 블로킹 리렌더링이 새 값을 자동으로 '따라잡기' 위해 트리거 된다.

### React가 상태 업데이트를 트랜지션으로 취급하지 않는 경우 {#react-doesnt-treat-my-state-update-as-a-transition}

상태 업데이트를 트랜지션으로 래핑할 때는 `startTransition` 호출 중에 상태를 업데이트 해야 한다:

```jsx
startTransition(() => {
  // ✅ startTranstion 호출 "중에" 상태를 설정해야 한다.
  setPage('/about');
});
```

`startTransition` 에 전달하는 함수는 동기식이어야 한다.

다음과 같은 업데이트는 트랜지션으로 표시할 수 없다:

```jsx
startTransition(() => {
  // ❌ startTransition 호출 "후에" 성태를 설정하면 안된다.
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

대신 이렇게 할 수 있다:

```jsx
setTimeout(() => {
  startTransition(() => {
    // ✅ startTranstion 호출 "중에" 상태를 설정해야 한다.
    setPage('/about');
  });
}, 1000);
```

마찬가지의 이유로 다음과 같은 식으로 트랜지션을 사용할 수 없다:

```jsx
startTransition(async () => {
  await someAsyncFunction();
  // ❌ startTransition 호출 "후에" 성태를 설정하면 안된다.
  setPage('/about');
});
```

하지만 대신 아래의 방법으로 해결할 수 있다:

```jsx
await someAsyncFunction();
startTransition(() => {
  // ✅ startTranstion 호출 "중에" 상태를 설정해야 한다.
  setPage('/about');
});
```

### 컴포넌트 외부에서 useTransition을 호출하고 싶은 경우 {#i-want-to-call-useTransition-from-outside-a-component}

Hook이기 때문에 컴포넌트 외부에서는 `useTransition` 을 호출할 수 없다. 이 경우 대신 독립형 [`startTransition`](https://react.dev/reference/react/startTransition) 메서드를 사용한다. 같은 방식으로 작동하지만 `isPending` 표시기를 제공하지 않는다.

### startTransition에 전달한 함수가 즉시 실행되는 경우 {#the-function-i-pass-to-startTransition-executes-immediately}

아래의 코드를 실행하면 1, 2, 3이 프린트 된다:

```jsx
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

`startTransition` 에 전달한 함수는 지연되지 않는다. 브라우저 `setTimeout` 과 달리 나중에 콜백을 실행하지 않는다. React는 함수를 즉시 실행하지만 함수가 실행되는 동안 예약된 상태 업데이트는 트랜지션으로 표시된다. 이렇게 작동한다고 상상할 수 있다:

```jsx
// 단순화된 버전

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... 트랜지션 상태 업데이트 예약 ...
  } else {
    // ... 긴급 상태 업데이트 예약 ...
  }
}
```
