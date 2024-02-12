---
title: "'use client'"
description:
date: 2024-02-04
tags: [directive, server_component]
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/reference/react/use-client',
    },
  ]
---

:::note Canary
`'use client'` 는 React 서버 컴포넌트를 지원하는 라이브러리를 사용하는 경우에만 필요하다.
:::

`'use client'` 는 코드가 클라이언트에서 실행된다는 것을 표시(mark)한다.

## 레퍼런스 {#reference}

### 'use client' {#use-client}

파일 상단에 `'use client'` 를 추가하여 해당 모듈과 종속성을 클라이언트 코드로 표시한다.

```jsx
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

`'use client'` 로 마크된 파일을 서버 컴포넌트에 임포트 하면 번들러는 해당 모듈 임포트를 서버 코드와 클라이언트 코드 간의 바운더리로 처리한다.

`RichTextEditor` 의 종속성인 `formatDate` 및 `Button` 은 `'use client'` 지시문이 포함되어 있든 없든 클라이언트에서 실행된다. 즉 단일 모듈은 서버 코드에 임포트 될 때는 서버에서 실행되고 클라이언트 코드에 임포트 될 때는 클라이언트에서 실행된다.

#### 주의사항 {#caveats}

- `'use client'` 는 파일의 맨 처음에 있어야 하며, 임포트나 다른 코드보다 위에 있어야 한다 (주석은 괜찮다). 작은따옴표나 큰따옴표 중 하나를 사용할 수 있지만 백틱은 사용할 수 없다.
- `'use client'` 모듈이 다른 클라이언트 모듈에 임포트 되면 해당 지시문은 아무런 영향을 주지 않는다.
- 컴포넌트 모듈이 `'use client'` 지시문을 포함하면 해당 컴포넌트는 클라이언트 컴포넌트임이 보장된다. 그러나 `'use client'` 지시문이 없더라도 컴포넌트가 클라이언트 컴포넌트로 간주될 수 있다.
  - 모듈에 `'use client'` 지시문이 있거나 `'use client'` 지시문을 포함하는 다른 컴포넌트의 종속성인 컴포넌트는 클라이언트 컴포넌트로 간주된다. 그렇지 않은 경우에는 서버 컴포넌트다.
- `'use client'` 마크는 컴포넌트에만 적용되는 것은 아니다. 클라이언트 모듈 하위 트리의 모든 코드는 클라이언트에서 실행된다.
- 서버 컴포넌트가 `'use client'` 모듈에서 값을 가져올 때 해당 값은 React 컴포넌트이거나 클라이언트 컴포넌트에 전달 할 수 있는 직렬화 가능한 프로퍼티 값이어야 한다. 다른 경우에는 에러가 발생한다.

### 'use client' 지시어 작동 방식 {#how-use-client-marks-client-code}

React 앱에서 컴포넌트는 종종 별도의 파일 또는 모듈로 분할된다.

React 서버 컴포넌트를 사용하는 앱의 경우, 앱은 기본적으로 서버에서 렌더링 된다. _`'use client'` 는 모듈 종속성 트리에 서버-클라이언트 바운더리를 도입하여 효과적으로 클라이언트 모듈의 하위 트리를 생성한다._

이를 더 잘 이해하기 위해 다음 React 서버 컴포넌트 앱을 살펴보자:

```jsx
// App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}
```

위의 앱 모듈 종속성 트리에서 `InspirationGenerator.js` 의 `'use client'` 지시문은 해당 모듈과 해당 모듈의 모든 종속성을 클라이언트 모듈로 표시한다. 이제 `InspirationGenerator.js` 에서 시작하는 하위 트리가 클라이언트 모듈로 표시된다.

!['use client'는 앱의 모듈 종속성 트리를 분할하여 `InspirationGenerator.js` 와 그 모든 종속성을 클라이언트 렌더링으로 표시한다.](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-doc-reference-useclient/1.png)

렌더링하는 동안 프레임워크는 루트 컴포넌트를 서버에서 렌더링하고 렌더 트리를 계속 진행하면서 클라이언트 마크가 있는 코드는 렌더링에서 제외한다.

그런 다음 서버에서 렌더링된 렌더 트리의 일부가 클라이언트로 전송된다. 그러면 클라이언트 코드가 앞서 다운로드된 트리의 나머지 렌더링을 완료한다.

![앱의 렌더 트리다. `InspirationGenerator` 와 그 자식 컴포넌트인 `FancyText` 는 클라이언트 표시 코드에서 내보낸 컴포넌트이며 클라이언트 컴포넌트로 간주된다.](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-doc-reference-useclient/2.png)

정의를 내려보면 다음과 같다:

- **클라이언트 컴포넌트**는 클라이언트에서 렌더링되는 렌더 트리의 컴포넌트다.
- **서버 컴포넌트**는 서버에서 렌더링되는 렌더 트리의 컴포넌트다.

예제 앱을 살펴보면 `App`, `FancyText` 및 `Copyright` 는 모두 서버에서 렌더링되며 서버 컴포넌트로 간주된다. `InspirationGenerator.js` 와 그 종속성은 클라이언트 코드로 표시되므로, 컴포넌트 `InspirationGenerator` 와 그 하위 컴포넌트 `FancyText` 는 클라이언트 컴포넌트다.

:::important FancyText가 클라이언트 컴포넌트이자 서버 컴포넌트인 이유
위의 정의에 따르면 `FancyText` 는 서버 컴포넌트이자 클라이언트 컴포넌트인데, 어떻게 그럴 수 있을까?

먼저 "컴포넌트"라는 용어가 그다지 정확하지 않다는 점을 알아야한다. 다음은 "컴포넌트"를 이해할 수 있는 두 가지 방법이다:

1. "컴포넌트"는 **컴포넌트의 정의**를 말한다. 그리고 대부분의 경우 함수다.

```jsx
// 컴포넌트 정의
function MyComponent() {
  return <p>My Component</p>;
}
```

2. '컴포넌트'는 해당 **컴포넌트의 사용**을 지칭하기도 한다.

```jsx
import MyComponent from './MyComponent';

function App() {
  // 컴포넌트 사용
  return <MyComponent />;
}
```

어떤 개념을 설명할 때 정확성은 중요하지 않은 경우가 많지만, 여기서는 중요다.

_서버 컴포넌트나 클라이언트 컴포넌트에 대해 이야기할 때는 **컴포넌트의 사용**을 언급하는 것이다._

- 컴포넌트가 모듈 내에서 `'use client'` 지시어를 사용하여 정의되었거나 다른 클라이언트 컴포넌트에서 호출되는 경우, "컴포넌트 사용"은 클라이언트 컴포넌트다.
- 그렇지 않으면 "컴포넌트 사용"은 서버 컴포넌트다.

!["컴포넌트 사용"을 나타내는 렌더 트리다.](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-doc-reference-useclient/2.png)

`FancyText` 에 대한 질문으로 돌아가서, 컴포넌트 정의에 `'use client'` 지시어가 없고 두 가지 용도가 있다는 것을 알 수 있다.

`App` 의 자식으로 `FancyText` 를 사용하면 해당 사용은 서버 컴포넌트로 표시된다. `FancyText` 를 가져와서 `InspirationGenerator` 에서 호출하는 경우, `InspirationGenerator` 에 `'use client'` 지시문이 포함되어 있으므로 해당 사용은 클라이언트 컴포넌트다.

즉, `FancyText` 에 대한 "컴포넌트 정의"는 서버에서 평가되고 클라이언트에서 다운로드하여 클라이언트 "컴포넌트 사용"을 렌더링한다.

:::

:::important Copyright가 서버 컴포넌트인 이유

`Copyright` 는 클라이언트 컴포넌트인 `InspirationGenerator` 의 하위 컴포넌트로 렌더링되기 때문에 서버 컴포넌트라는 사실에 놀랄 수도 있다.

_`'use client'` 는 렌더 트리가 아닌 모듈 종속성 트리에서 서버와 클라이언트 코드 사이의 바운더리를 정의한다는 점을 기억해야 한다._

![`'use client'` 모듈 종속성 트리에서 서버 컴포넌트와 클라이언트 컴포넌트의 바운더리를 정의한다.](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-doc-reference-useclient/1.png)

모듈 종속성 트리에서 `App.js` 가 `Copyright.js` 모듈에서 `Copyright` 컴포넌트를 가져와 호출하는 것을 볼 수 있다. `Copyright.js` 에는 `'use client'` 지시어가 포함되어 있지 않으므로 컴포넌트 사용은 서버에서 렌더링 된다. `App`은 루트 컴포넌트이므로 서버에서 렌더링 된다.

클라이언트 컴포넌트는 JSX를 프로퍼티로 전달할 수 있으므로 서버 컴포넌트를 렌더링할 수 있다. 이 경우 `InspirationGenerator` 는 `Copyright` 를 자식으로 받는다. 그러나 `InspirationGenerator` 모듈은 `Copyright` 모듈을 직접 임포트하거나 컴포넌트를 호출하지 않으며, 이 모든 작업은 `App` 에서 수행된다. 실제로 `Copyright` 컴포넌트는 `InspirationGenerator` 가 렌더링을 시작하기 전에 완전히 실행된다.

_요점은 컴포넌트 간의 부모-자식 렌더링 관계가 동일한 렌더링 환경을 보장하지 않는다는 것이다._
:::

### 'use client'를 사용해야 하는 경우

`'use client'` 를 사용하면 컴포넌트가 클라이언트 컴포넌트인 경우를 결정할 수 있다. 서버 컴포넌트가 기본값이므로 클라이언트 렌더로 표시해야 하는 시점을 결정하기 위해 서버 컴포넌트의 장점과 한계를 간략하게 살펴본다.

간단하게 설명하기 위해 서버 컴포넌트에 대해 이야기하지만, 서버에서 실행되는 앱의 모든 코드에도 동일한 원칙이 적용된다.

#### 서버 컴포넌트의 장점 {#advantages-of-server-components}

- 서버 컴포넌트는 클라이언트에서 전송하고 실행하는 코드의 양을 줄일 수 있다. 클라이언트 모듈만 번들로 제공되며 클라이언트에서 평가한다.
- 서버 컴포넌트를 서버에서 실행하면 이점이 있다. 로컬 파일시스템에 액세스할 수 있으며 데이터 페치 및 네트워크 요청에 대한 지연 시간이 짧아질 수 있다.

#### 서버 컴포넌트의 한계 {#limitations-of-server-components}

- 사용자 상호작용은 이벤트 핸들러를 등록하고 클라이언트에서 트리거되어야 하므로 서버 컴포넌트는 상호작용을 지원할 수 없다.
  - 예를 들어, `onClick` 과 같은 이벤트 핸들러는 클라이언트 컴포넌트에서만 정의할 수 있다.
- 서버 컴포넌트는 대부분의 Hook을 사용할 수 없다.
  - 서버 컴포넌트가 렌더링될 때 출력은 기본적으로 클라이언트가 렌더링할 컴포넌트의 목록이다. 서버 컴포넌트는 렌더링 후 메모리에 유지되지 않으며 자체 상태를 가질 수 없다.

### 서버 컴포넌트가 리턴하는 직렬화 가능 유형

다른 React 앱과 마찬가지로 부모 컴포넌트는 데이터를 자식 컴포넌트에 전달한다. 서로 다른 환경에서 렌더링되기 때문에 서버 컴포넌트에서 클라이언트 컴포넌트로 데이터를 전달할 때는 추가적인 고려가 필요하다.

서버 컴포넌트에서 클라이언트 컴포넌트로 전달되는 프로퍼티 값은 직렬화가 가능해야 한다.

연재 가능한 프로퍼티는 다음과 같다:

- 원시값
  - string
  - number
  - bigint
  - boolean
  - undefined
  - null
  - symbol (`Symbol.for` 를 통해 글로벌 심볼 레지스트리에 등록된 심볼만 사용할 수 있다.)
- 직렬화 가능한 값을 포함하는 이터러블
  - String
  - Array
  - Map
  - Set
  - [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) & [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- Date
- Plain objects: 직렬화 가능한 속성을 가진 [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)로 생성된 객체다.
- 서버 액션인 Function
- JSX
- Promises

특히, 다음과 같은 기능은 지원되지 않는다:

- 클라이언트가 표시된 모듈에서 내보내지 않거나 `'use server'` 로 표시된 함수
- Classes
- 클래스의 인스턴스인 객체 또는 [null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects) 객체
- 전역으로 등록되지 않은 `Symbol`, 예: `Symbol('my new symbol')`

## 사용법 {#usage}

### 상호 작용 및 상태가 있는 빌드

```jsx
// App.js

'use client';

import { useState } from 'react';

export default function Counter({ initialValue = 0 }) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

`Counter` 는 값을 증가시키거나 감소시키기 위해 `useState` Hook과 이벤트 핸들러가 모두 필요하므로, 이 컴포넌트는 클라이언트 컴포넌트여야 하며 상단에 `'use client'` 지시어가 있어야 한다.

반대로 상호작용이 없는 UI 컴포넌트는 클라이언트 컴포넌트일 필요가 없다.

```jsx
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />;
}
```

예를 들어, `Counter` 의 부모 컴포넌트인 `CounterContainer` 는 인터랙티브하지 않고 상태를 사용하지 않으므로 `'use client'` 가 필요하지 않다. 또한 `CounterContainer` 는 서버의 로컬 파일 시스템에서 데이터를 읽기 때문에 서버 컴포넌트여야 하며, 이는 서버 컴포넌트에서만 가능하다.

서버 또는 클라이언트 전용 기능을 사용하지 않고 렌더링 위치에 구애받지 않는 컴포넌트도 있다. 앞선 예시에서 `FancyText` 는 이러한 컴포넌트 중 하나다.

```jsx
export default function FancyText({ title, text }) {
  return title ? (
    <h1 className="fancy title">{text}</h1>
  ) : (
    <h3 className="fancy cursive">{text}</h3>
  );
}
```

이 경우 `'use client'` 지시문을 추가하지 않으므로 서버 컴포넌트에서 참조할 때 소스 코드가 아닌 `FancyText` 의 출력이 브라우저로 전송된다. 앞의 `Inspirations` 앱 예시에서 설명한 것처럼 `FancyText` 는 가져와서 사용하는 위치에 따라 서버 또는 클라이언트 컴포넌트로 사용된다.

그러나 `FancyText` 의 HTML 출력이 소스 코드(종속성 포함)에 비해 큰 경우, 항상 클라이언트 컴포넌트가 되도록 강제하는 것이 더 효율적일 수 있다. 예를 들어 긴 SVG 경로 문자열을 반환하는 컴포넌트는 컴포넌트를 클라이언트 컴포넌트로 강제 설정하는 것이 더 효율적일 수 있다.

### 클라이언트 API 사용하기

React 앱은 웹 저장소, 오디오 및 비디오 조작, 디바이스 하드웨어를 위한 브라우저의 API와 같은 클라이언트별 API를 사용할 수 있다.

이 예시에서 컴포넌트는 `canvas` 엘리먼트를 조작하기 위해 DOM API를 사용한다. 이러한 API는 브라우저에서만 사용할 수 있으므로 클라이언트 컴포넌트로 표시해야 한다.

```jsx
'use client';

import { useRef, useEffect } from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### 써드파티 라이브러리 사용하기

React 앱에서는 일반적인 UI 패턴이나 로직을 처리하기 위해 서드파티 라이브러리를 활용하는 경우가 많다.

이러한 라이브러리는 컴포넌트 Hook이나 클라이언트 API에 의존할 수 있다. 다음 React API 중 하나를 사용하는 서드파티 컴포넌트는 클라이언트에서 실행되어야 한다:

- createContext
- `use` 와 `useId` 를 제외한 `react` & `react-dom` Hooks
- forwardRef
- memo
- startTransition
- 클라이언트 API를 사용하는 경우

이러한 라이브러리가 React Server 컴포넌트와 호환되도록 업데이트된 경우, 이미 자체적으로 `'use client'` 지시어가 포함되어 있으므로 서버 컴포넌트에서 직접 사용할 수 있다. 라이브러리가 업데이트되지 않았거나 컴포넌트에 클라이언트에서만 지정할 수 있는 이벤트 핸들러와 같은 프로퍼티가 필요한 경우, 서드파티 클라이언트 컴포넌트와 사용하려는 서버 컴포넌트 사이에 자체 클라이언트 컴포넌트 파일을 추가해야 할 수 있다.
