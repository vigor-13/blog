---
title: <Suspense>
description: Suspense 컴포넌트 문서
date: 2024-01-29
tags: [component, suspense]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react/Suspense',
    },
  ]
---

`<Suspense>` 를 사용하면 자식 로딩이 완료될 때까지 폴백(fallback)을 표시할 수 있다.

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

## 레퍼런스 {#reference}

### \<Suspense> {#suspense}

`<Suspense>` 를 사용하면 자식 로딩이 완료될 때까지 폴백(fallback)을 표시할 수 있다.

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

### 프로퍼티 {#props}

| 프로퍼터   | 설명                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children` | 렌더링하려는 실제 UI다. 렌더링 도중 `children` 이 일시 중단되면 서스펜스 바운더리가 렌더링 `fallback` 으로 전환된다.                                                                                                                                                                                                                                                                                      |
| `fallback` | 로딩이 완료되지 않은 경우 실제 UI 대신 렌더링할 폴백 UI다. 유효한 모든 React 노드를 사용할 수 있지만, 실제로는 로딩 스피너나 스켈레톤과 같은 경량 플레이스홀더 뷰가 폴백으로 사용된다. 서스펜스는 `children` 이 일시 중단되면 자동으로 `fallback` 으로 전환되고 데이터가 준비되면 다시 `children` 으로 전환된다. 렌더링 중에 `fallback` 이 일시 중단되면 가장 가까운 상위 서스펜스 바운더리가 활성화된다. |

### 주의사항 {#caveats}

- React는 처음 마운트하기 전에 일시 중단된 렌더링의 상태를 보존하지 않는다. 컴포넌트가 로드되면 React는 일시 중단된 트리의 렌더링을 처음부터 다시 시도한다.
- 서스펜스가 트리의 콘텐츠를 표시하다가 다시 일시 중단된 경우, 그 원인이 `startTransition` 또는 `useDeferredValue` 로 인한 업데이트가 아닌 한 `fallback` 이 다시 표시된다.
- React가 다시 일시 중단되어 이미 표시된 콘텐츠를 숨겨야 하는 경우, 콘텐츠 트리에서 layout Effects를 정리(clean up)한다. 콘텐츠가 다시 표시될 준비가 되면 React는 layout Effects를 다시 실행한다. 이렇게 하면 콘텐츠가 숨겨져 있는 동안 DOM 레이아웃을 측정하는 Effects가 이 작업을 시도하지 않는다.
- React에는 스트리밍 서버 렌더링(Streaming Server Rendering) 및 선택적 하이드레이션(Selective Hydration)과 같은 내부 최적화가 포함되어 있으며, 이는 서스펜스와 통합되어 있다. [아키텍처 개요](https://github.com/reactwg/react-18/discussions/37)를 읽고 기술 [강연](https://www.youtube.com/watch?v=pj5N-Khihgc)을 시청하여 자세히 알아보라.

## 사용법 {#usage}

### 콘텐츠가 로딩중일 때 폴백 표시하기 {#displaying-a-fallback-while-content-is-loading}

애플리케이션의 모든 부분을 서스펜스 바운더리로 감쌀 수 있다:

```jsx
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React는 자식에게 필요한 모든 코드와 데이터가 로드될 때까지 로딩 폴백을 표시한다.

아래 예시에서는 앨범 목록을 가져오는 동안 `Albums` 컴포넌트가 일시 중단된다. 렌더링할 준비가 될 때까지 React는 가장 가까운 서스펜스 바운더리를 전환하여 폴백, 즉 `Loading` 컴포넌트를 표시한다. 그런 다음 데이터가 로드되면 React는 `Loading` 폴백을 숨기고 데이터와 함께 `Albums` 컴포넌트를 렌더링한다.

```jsx
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

:::note
세스펜스를 지원하는 데이터 소스만 서스펜스 컴포넌트를 활성화한다. 여기에는 다음이 포함된다:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 및 [Next.js](https://nextjs.org/docs/getting-started/react-essentials) 와 같은 서스페인스 지원 프레임워크를 사용한 데이터 fetch
- `lazy` 를 사용한 지연(lazy) 로딩 컴포넌트 코드
- `use` 를 사용한 프로미스의 값 읽기

서스펜스는 Effect 또는 이벤트 핸들러 내부에서 데이터 fetch를 감지하지 못한다.

위의 `Albums` 컴포넌트에서 데이터를 로드하는 정확한 방법은 프레임워크에 따라 다르다. 서스펜스 지원 프레임워크를 사용하는 경우 해당 프레임워크의 데이터 fetch 문서에서 자세한 내용을 확인할 수 있다.

서스펜스를 지원하는 프레임워크를 사용하지 않고 서스펜스 지원 데이터 fetch는 아직 지원되지 않는다. 서스펜스 지원 데이터 소스를 구현하기 위한 요구 사항은 불안정하고 문서화되어 있지 않다. 데이터 소스를 서스펜스와 통합하기 위한 공식 API는 향후 React 버전에서 출시될 예정이다.
:::

### 여러 컴포넌트가 하나의 서스펜스 바운더리를 공유하는 경우 {#revealing-content-together-at-once}

기본적으로 서스펜스 내부의 전체 트리는 하나의 단위로 취급된다. 예를 들어, 아래의 컴포넌트 중 하나만 일시 중단되더라도 모든 컴포넌트가 함께 `<Loading />` 으로 대체된다:

```jsx
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

그런 다음 모든 항목이 렌더링 될 준비가 되면 한 번에 모두 함께 렌더링 된다.

아래 예에서는 `Biography` 와 `Albums` 모두 일부 데이터를 fetch한다. 그러나 이 두 컴포넌트는 하나의 서스펜스 바운더리 아래에 그룹화되어 있기 때문에 항상 동시에 함께 렌더링 된다.

:::tabs

@tab:active ArtistPage.js#artist-page

```jsx
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

@tab Panel.js#panel

```jsx
export default function Panel({ children }) {
  return <section className="panel">{children}</section>;
}
```

:::

데이터를 로드하는 컴포넌트가 서스펜스 바운더리의 직접적인 자식일 필요는 없다. 예를 들어, `Biography` 및 `Albums` 을 `Details` 컴포넌트로 내부로 이동할 수 있다. 이렇게 해도 동작은 변경되지 않는다. `Biography` 와 `Albums` 은 가장 가까운 상위 서스펜스 바운더리를 공유하므로 함께 렌더링 된다.

```jsx
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>;

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

### 중첩된 서스펜스를 사용하는 경우 {#revealing-nested-content-as-it-loads}

컴포넌트가 일시 중단되면 가장 가까운 상위 서스펜스 컴포넌트가 폴백을 표시한다. 이를 통해 여러 서스펜스 컴포넌트를 중첩하여 로딩 시퀀스를 만들 수 있다. 각 서스펜스 바운더리의 폴백은 다음 단계의 콘텐츠를 사용할 수 있게 되면 채워진다. 예를 들어 앨범 목록에 자체 폴백을 지정할 수 있다:

```jsx
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

이 변경 사항으로 인해 `Biography` 를 렌더링 때 `Albums` 이 로드될 때까지 '기다릴' 필요가 없다.

다음과 같이 렌더링 순서가 바뀐다:

1. `Biography` 아직 로드되지 않은 경우 전체 콘텐츠 영역 대신 `BigSpinner` 가 표시된다.
2. `Biography` 로딩이 완료되면 `BigSpinner` 가 콘텐츠로 대체된다.
3. `Albums` 이 아직 로드되지 않은 경우 `Ablums` 과 그 상위 `Panel` 대신 `AlbumsGlammer` 가 표시된다.
4. 마지막으로 `Albums` 로딩이 완료되면 `AlbumsGlimmer` 로 대체된다.

:::tabs

@tab:active ArtistPage.js#artist-page

```jsx
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
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

@tab Panel.js#panel

```jsx
export default function Panel({ children }) {
  return <section className="panel">{children}</section>;
}
```

:::

서스펜스 바운더리를 사용하면 UI의 어느 부분이 항상 동시에 렌더링 되어야 하는지, 어느 부분이 로딩 상태의 시퀀스에서 점진적으로 더 많은 콘텐츠를 표시해야 하는지 조정할 수 있다. 서스펜스 바운더리를 트리의 어떤 위치에든 추가, 이동 또는 삭제할 수 있으며 이로 인해 앱의 나머지 동작에 영향을 미치지 않는다.

모든 컴포넌트 주위에 서스펜스 바운더리를 두지 않아야 한다. 서스펜스 바운더리는 사용자가 경험하게 될 로딩 시퀀스보다 더 세분화되어서는 안 된다. 디자이너와 함께 작업하는 경우 로딩 상태를 어디에 배치해야 하는지 디자이너에게 물어봐야 한다. 디자이너가 이미 디자인 와이어프레임에 포함시켰을 가능성이 높다.

### 새 콘텐츠가 로드되는 동안 이전 콘텐츠 표시하기 {#Showing stale content while fresh content is loading}

아래의 예에서는 검색 결과를 가져오는 동안 `SearchResults` 컴포넌트가 일시 중단된다. `"a"` 를 입력하고 결과를 기다린 다음 `"ab"` 로 수정한다. `"a"` 에 대한 결과는 로딩 폴백으로 대체된다.

```jsx
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

일반적인 대체 UI 패턴은 목록 업데이트를 지연하고 새 결과가 준비될 때까지 이전 결과를 계속 표시하는 것이다. `useDeferredValue` Hook을 사용하면 쿼리의 지연된 버전을 전달할 수 있다:

```jsx
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` 가 즉시 업데이트되므로 입력에 새 값이 표시된다. 하지만 데이터가 로드될 때까지 `deferredQuery` 는 이전 값을 유지하므로 `SearchResults` 는 잠시 동안 이전 결과를 표시한다.

사용자에게 더 명확하게 알리기 위해 이전 결과 목록이 표시될 때 시각적 표시를 추가할 수 있다:

```jsx
{% raw %}<div
  style={{
    opacity: query !== deferredQuery ? 0.5 : 1,
  }}
>
  <SearchResults query={deferredQuery} />
</div>{% endraw %}
```

아래 예에서 `"a"` 를 입력하고 결과가 로드될 때까지 기다린 다음 입력을 `"ab"` 로 수정한다. 이제 새 결과가 로드될 때까지 일시 중단 폴백 대신 이전 결과 목록이 희미하게 표시되는 것을 확인할 수 있다:

```jsx
{% raw %}import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}{% endraw %}
```

:::note
연기된 값(deferred values)과 전환(transitions)은 일반적으로 인라인 인디케이터를 사용하여 서스펜스 폴백을 표시하지 않도록 할 수 있다. 전환은 전체 업데이트를 non-urgent로 표시하므로 일반적으로 프레임워크 및 라우터 라이브러리에서 탐색에 사용된다. 반면에 연기된 값은 주로 응용 프로그램 코드에서 사용되며 UI 일부를 non-urgent로 표시하고 나머지 UI보다 "지연" 시키고 싶을 때 유용하다.
:::

### 이미 렌더링된 콘텐츠가 숨겨지지 않도록 방지하기 {#Preventing already revealed content from hiding}

컴포넌트가 일시 중단되면 가장 가까운 상위 서스펜스 바운더리가 폴백을 표시하도록 전환된다. 이미 어떤 내용을 표시하고 있었다면 이로 인해 사용자 경험이 불편해질 수 있다. 아래의 예제 버튼을 눌러 보자:

:::tabs

@tab:active App.js#app

```jsx
{% raw %}import { Suspense, useState } from 'react';
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

  function navigate(url) {
    setPage(url);
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
  return <Layout>{content}</Layout>;
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}{% endraw %}
```

@tab Layout.js#layout

```jsx
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">Music Browser</section>
      <main>{children}</main>
    </div>
  );
}
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

버튼을 누르자 `Router` 컴포넌트가 `IndexPage` 대신 `ArtistPage` 를 렌더링했다. `ArtistPage` 내부의 컴포넌트가 일시 중단되었기 때문에 가장 가까운 서스펜스 바운더리가 폴백을 표시한다. 가장 가까운 서스펜드 바운더리가 루트 근처에 있었기 때문에 전체 사이트 레이아웃이 `BigSpinner` 로 대체되었다.

이를 방지하기 위해 네비게이션 상태 업데이트를 transition으로 표시하려면 `startTransition` 을 사용할 수 있다:

```jsx
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

이는 상태 전환이 긴급하지 않으며 이미 공개된 콘텐츠를 숨기는 대신 이전 페이지를 계속 표시하는 것이 낫다는 것을 React에게 알려준다. 이제 버튼을 클릭하면 `Biography` 가 로드될 때까지 "대기" 한다:

:::tabs

@tab:active App.js#app

```jsx
{% raw %}import { Suspense, startTransition, useState } from 'react';
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

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
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
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}{% endraw %}
```

@tab Layout.js#layout

```jsx
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">Music Browser</section>
      <main>{children}</main>
    </div>
  );
}
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

transition은 모든 콘텐츠가 로드될 때까지 기다리지 않는다. 이미 표시된 콘텐츠를 숨기지 않을 만큼만 기다린다. 예를 들어 웹사이트 `Layout` 은 이미 공개되었으므로 로딩 스피너 뒤에 숨기는 것은 좋지 않다. 그러나 `Albums` 을 둘러싼 중첩된 `Suspense` 바운더리는 새로운 것이므로 transition이 기다리지 않는다.

:::note
서스펜스 지원 라우터는 기본적으로 탐색 업데이트를 transition으로 래핑할 것으로 예상된다.
:::

### transition이 진행 중임을 나타내기 {#Indicating that a transition is happening}

위의 예에서 버튼을 클릭하면 페이지 전환이 진행 중임을 시각적으로 표시하는 방법이 없다. 시각적 표시를 추가하려면 `startTransition` 을 `useTransition` 으로 대체할 수 있다. `useTransition` 은 `isPending` 라는 부울 값을 제공하며, 아래의 예제에서는 transition이 진행 중일 때 웹사이트 헤더 스타일을 변경하는 데 사용되었다:

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
    content = (
      <IndexPage navigate={navigate} />
    );
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
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
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

### 네비게이션에서 서스펜스 바운더리 재설정하기 {#Resetting Suspense boundaries on navigation}

transition하는 동안 React는 이미 노출된 콘텐츠를 숨기지 않는다. 그러나 다른 매개변수를 갖는 경로로 이동하는 경우 React에게 다른 콘텐츠라고 알려주고 싶을 수 있다. 이를 `key` 로 표현할 수 있다:

```jsx
<ProfilePage key={queryParams.id} />
```

사용자의 프로필 페이지 내에서 탐색 중인데 무언가가 일시 중단되었다고 가정해 보자. 해당 업데이트가 전환으로 래핑되면 이미 표시된 콘텐츠에는 폴백이 트리거되지 않는다. 이것이 바로 예상되는 동작이다.

하지만 이제 서로 다른 두 개의 사용자 프로필 사이를 탐색한다고 가정해 보자. 이 경우 폴백을 표시하는 것이 좋다. 예를 들어 한 사용자의 타임라인은 다른 사용자의 타임라인과 다른 콘텐츠다. `key` 를 지정하면 React가 서로 다른 사용자의 프로필을 서로 다른 컴포넌트로 취급하고 탐색 중에 서스펜스 바운더리를 재설정하도록 할 수 있다. 서스펜스 지원 라우터는 이 작업을 자동으로 수행해야 한다.

### 서버 오류 및 클라이언트 전용 콘텐츠에 대한 폴백 제공 {#Providing a fallback for server errors and client-only content}

[스트리밍 서버 렌더링 API]() 중 하나(또는 이에 의존하는 프레임워크)를 사용하는 경우, React는 서버에서 발생하는 오류를 처리하기 위해 `<Suspense>` 바운더리도 사용한다. 컴포넌트가 서버에서 에러를 발생시키면 React는 서버 렌더링을 중단하지 않는다. 대신, 그 위에 있는 가장 가까운 `<Suspense>` 컴포넌트를 찾아서 생성된 서버 HTML에 해당 폴백(예: 스피너)을 포함시킨다. 때문에 사용자는 처음에 스피너를 보게 된다.

클라이언트에서 React는 동일한 컴포넌트를 다시 렌더링하려고 시도한다. 클라이언트에서도 에러가 발생하면 React는 에러를 던지고 가장 가까운 에러 바운더리를 표시한다. 그러나 클라이언트에서 에러가 발생하지 않는다면 콘텐츠가 결국 성공적으로 표시되었기 때문에 React는 사용자에게 에러를 표시하지 않는다.

이를 사용하여 일부 컴포넌트를 서버에서 렌더링하지 않도록 선택할 수 있다. 이렇게 하려면 서버 환경에서 에러를 발생시킨 다음 `<Suspense>` 바운더리로 감싸서 해당 HTML을 폴백으로 대체하면 된다:

```jsx
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>;

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

서버 HTML에는 로딩 표시기(indicatgor) 포함된다. 이 표시기는 클라이언트의 `Chat` 컴포넌트로 대체된다.

## 트러블슈팅 {#troubleshooting}

### 업데이트 중에 UI가 폴백으로 대체되는 것을 방지하려면 어떻게 해야 할까? {#trouble1}

이미 화면에 렌더링된 UI를 폴백으로 대체하면 사용자 경험을 불편하게 만들 수 있다. 이는 업데이트로 인해 컴포넌트가 일시 중단되고 가장 가까운 서스펜스 바운더리에서 이미 사용자에게 콘텐츠를 표시하고 있을 때 발생한다.

이런 일이 발생하지 않도록 하려면 `startTransition` 을 사용하여 업데이트를 긴급하지 않은 것(non-urgent)으로 처리해야 한다. transition 진행되는 동안 React는 충분한 데이터가 로드될 때까지 원치 않는 폴백 콘텐츠가 나타나는 것을 방지한다:

```jsx
function handleNextPageClick() {
  // 이 업데이트가 일시 중단되면 이미 표시된 콘텐츠를 숨기지 않는다.
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

이렇게 하면 기존 콘텐츠가 폴백으로 대체되지 않는다. 그러나 새로 생성된 서스펜스 바운더리는 여전히 바로 폴백을 표시하여 UI를 차단하지 않고 사용자가 콘텐츠를 사용할 수 있게 되면 볼 수 있도록 한다.

React는 긴급하지 않은(non-urgent) 업데이트 중에만 원치 않는 폴백을 방지한다. 긴급한 업데이트의 결과인 경우 렌더링을 지연시키지 않는다. `startTransition` 이나 `useDeferredValue` 와 같은 API를 명시적으로 선택해야 한다.

라우터가 서스펜스를 지원하는 경우, 라우터는 업데이트를 `startTransition` 으로 래핑해야 한다.
