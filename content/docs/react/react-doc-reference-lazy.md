---
title: lazy
description: lazy API 문서
date: 2024-01-30
tags: [api]
references:
  [{ key: 'React 공식 문서', value: 'https://react.dev/reference/react/lazy' }]
---

`lazy` 를 사용하면 컴포넌트의 코드가 처음 렌더링될 때까지 로딩을 지연시킬 수 있다.

```jsx
const SomeComponent = lazy(load);
```

## 레퍼런스 {#reference}

### lazy(load) {#lazy}

컴포넌트 외부에서 `lazy` 를 호출하여 지연 로드된 React 컴포넌트를 선언한다:

```jsx
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

#### 파라미터 {#parameters1}

| 파라미터 | 설명                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `load`   | Promise나 다른 `thenable` (then 메소드를 가진 Promise와 유사한 객체)을 반환하는 함수다. React는 컴포넌트가 처음 렌더링될 때까지 `load` 함수를 호출하지 않는다. React가 처음으로 `load`를 호출하면 해당 Promise가 리졸브될 때까지 기다린 다음, 리졸브된 값의 `.default` 를 React 컴포넌트로 렌더링한다. 리턴된 Promise과 Promise의 리졸브된 값은 모두 캐시되므로 React는 `load` 를 한 번 이상 호출하지 않는다. Promise가 거부되면 React는 거부된 이유를 처리할 가장 가까운 에러 바운더리에 전달한다. |

#### 리턴 {#returns1}

`lazy` 는 트리에서 렌더링할 수 있는 React 컴포넌트를 리턴한다. lazy 컴포넌트의 코드가 로딩되는 동안에는 렌더링을 시도하면 서스펜드된다. 그동안 로딩 표시기를 표시하려면 `<Suspense>` 를 사용한다.

### load 함수

#### 파라미터 {#parameters2}

`load` 함수는 파라미터를 받지 않는다.

#### 리턴 {#returns2}

Promise나 다른 `thenable` (`then` 메소드를 가진 Promise와 유사한 객체)를 반환해야 한다. 이는 최종적으로 `.default` 프로퍼티가 함수, `memo`, 또는 `forwardRef` 컴포넌트와 같은 유효한 React 컴포넌트 타입인 객체로 리졸브되어야 한다.

## 사용법 {#usage}

### 서스펜스를 사용한 지연 로딩 컴포넌트 {#lazy-loading-components-with-suspense}

일반적으로 정적 `import` 선언을 사용하여 컴포넌트를 가져온다:

```jsx
import MarkdownPreview from './MarkdownPreview.js';
```

`MarkdownPreview` 불러오기를 컴포넌트가 렌더링 될 때까지 연기하려면 `import` 를 다음과 같이 변경한다:

```jsx
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

이 코드는 [dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 를 기반으로 하며, 때문에 번들러나 프레임워크에서 지원이 필요할 수 있다. 이 패턴을 사용하려면 가져오는 `lazy` 컴포넌트가 `default` export를 사용해야 한다.

이제 컴포넌트의 코드가 온디맨드 방식으로 로드되므로 로드되는 동안 표시할 내용도 지정해야 한다. 지연 컴포넌트나 그 부모 컴포넌트를 `<Suspense>` 바운더리로 감싸면 된다:

```jsx
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
</Suspense>
```

이 예제에서는 렌더링 전까지는 `MarkdownPreview` 의 코드가 로드되지 는다. `MarkdownPreview` 가 아직 로드되지 않은 경우, 그 자리에 `Loading` 컴포넌트가 표시된다.

:::tabs

@tab:active App.js#app

```jsx
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() =>
  delayForDemo(import('./MarkdownPreview.js')),
);

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={showPreview}
          onChange={(e) => setShowPreview(e.target.checked)}
        />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// 로딩 상태를 확인할 수 있도록 2초간 지연을 추가한다.
function delayForDemo(promise) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

@tab Loading.js#loading

```jsx
export default function Loading() {
  return (
    <p>
      <i>Loading...</i>
    </p>
  );
}
```

@tab MarkdownPreview.js#markdown-preview

```jsx
{% raw %}import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{ __html: md.render(markdown) }}
    />
  );
}{% endraw %}
```

:::

위의 데모는 인위적인 지연되어 로드된다. 다음에 체크박스를 선택 해제했다가 다시 선택하면 `Preview` 가 캐시되므로 로딩 상태가 표시되지 않는다.

## 트러블슈팅 {#troubleshooting}

### lazy 컴포넌트의 상태가 예기치 않게 초기화되는 경우 {#trouble1}

다른 컴포넌트 안에 `lazy` 컴포넌트를 선언하지 않아야 한다:

```jsx
import { lazy } from 'react';

function Editor() {
  // 🔴 Bad: 이렇게 하면 리렌더링 시 모든 상태가 초기화된다.
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

대신 항상 모듈의 최상위 레벨에서 선언해야 한다:

```jsx
import { lazy } from 'react';

// ✅ Good: 컴포넌트 외부에 lazy 컴포넌트 선언하기
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
