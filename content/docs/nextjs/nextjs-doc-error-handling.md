---
title: 에러 핸들링
description:
date: 2024-02-23
tags: [route, error_handling]
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/routing/error-handling',
    },
  ]
---

`error.js` 파일을 사용하면 [중첩된 경로](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-routing-fundamentals/#nested-routes)에서 예기치 않은 런타임 오류를 처리할 수 있다.

- 라우트 세그먼트와 그 중첩된 자식을 [React 에러 바운더리](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)에 자동으로 래핑한다.
- 파일 시스템 계층 구조를 사용하여 특정 세그먼트에 맞춤 오류 UI를 생성하여 세부적으로 조정할 수 있다.
- 애플리케이션의 나머지 기능은 유지하면서 영향을 받는 세그먼트에 대한 오류를 격리한다.
- 전체 페이지를 다시 로드하지 않고 오류에서 복구를 시도하는 기능을 추가한다.

라우트 세그먼트 내에 `error.js` 파일을 추가하고 React 컴포넌트를 내보내서 오류 UI를 만든다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-error-handling/1.png)

```tsx
// app/dashboard/error.tsx

'use client'; // 에러 컴포넌트는 클라이언트 컴포넌트여야 한다.

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 리포팅 서비스에 오류를 기록한다.
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // 세그먼트를 다시 렌더링하여 복구를 시도한다.
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
```

## error.js 작동 방식 {#how-errorjs-works}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-error-handling/2.png)

- `error.js` 는 중첩된 자식 세그먼트 또는 `page.js` 컴포넌트를 감싸는 [React 에러 바운더리](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)를 자동으로 생성한다.
- `error.js` 파일에서 내보낸 React 컴포넌트가 폴백 컴포넌트로 사용된다.
- 에러 바운더리 내에서 에러가 발생하면 에러가 포함되고 폴백 컴포넌트가 렌더링된다.
- 폴백 에러 컴포넌트가 활성화되면 에러 바운더리 위의 레이아웃은 해당 상태를 유지하고 대화형 상태를 유지하며 에러 컴포넌트는 에러를 복구하는 기능을 표시할 수 있다.

## 에러 복구하기 {#recovering-from-erros}

에러의 원인은 일시적인 것일 수도 있다. 이러한 경우 다시 시도하기만 하면 문제가 해결될 수 있다.

에러 컴포넌트는 `reset()` 함수를 사용하여 사용자에게 에러 복구를 시도하라는 메시지를 표시할 수 있다. 이 함수가 실행되면 에러 바운더리의 내용을 다시 렌더링하려고 시도한다. 성공하면 폴백 에러 컴포넌트가 리렌더링한 결과로 대체된다.

```tsx
// app/dashboard/error.tsx

'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## 중첩된 라우트 {#nested-routes}

[특수 파일](https://www.vigorously.xyz/docs/nextjs/nextjs-doc-routing-fundamentals/#file-conventions)을 통해 생성된 React 컴포넌트는 특정 중첩 계층 구조로 렌더링된다.

예를 들어 `layout.js` 파일과 `error.js` 파일이 모두 포함된 두 개의 세그먼트가 있는 중첩된 라우트는 다음과 같은 단순화된 컴포넌트 계층 구조로 렌더링된다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-error-handling/3.png)

중첩된 컴포넌트 계층 구조는 중첩된 라우트에서 `error.js` 파일의 동작에 영향을 미친다:

- 에러는 가장 가까운 상위 에러 바운더리까지 버블로 표시된다. 즉, `error.js` 파일은 중첩된 모든 하위 세그먼트에 대한 오류를 처리한다. 라우트의 중첩된 폴더에서 `error.js` 파일을 서로 다른 수준에 배치하면 어느 정도 세분화된 에러 UI를 구현할 수 있다.
- 에러 바운더리가 해당 레이아웃의 컴포넌트 안에 중첩되어 있기 때문에 `error.js` 바운더리는 동일한 세그먼트의 `layout.js` 컴포넌트에서 발생한 오류를 처리하지 않는다.

## 레이아웃에서 에러 핸들링하기 {#handling-erros-in-layouts}

`error.js` 바운더리는 같은 세그먼트의 `layout.js` 또는 `template.js` 컴포넌트에서 발생한 오류를 포착할 수 없다. 이는 의도적인 계층 구조다. 에러가 발생했을 때 형제 라우트 간에 공유되는 중요한 UI(예: 네비게이션)가 계속 표시되고 작동하도록 한다.

특정 레이아웃 또는 템플릿 내에서 에러를 처리하려면 레이아웃의 상위 세그먼트에 `error.js` 파일을 배치한다.

루트 레이아웃 또는 템플릿 내에서 에러를 처리하려면 `global-error.js` 라는 `error.js` 의 변형을 사용한다.

## 루트 레이아웃에서 에러 핸들링하기 {#handling-errors-in-root-layouts}

루트 `app/error.js` 바운더리는 루트 `app/layout.js` 또는 `app/template.js` 컴포넌트에서 발생하는 에러를 포착하지 못한다.

이러한 루트 컴포넌트의 에러를 구체적으로 처리하려면 루트 `app` 디렉터리에 있는 `app/global-error.js` 라는 `error.js` 의 변형을 사용한다.

루트 `error.js` 와 달리 `global-error.js` 에러 바운더리는 전체 애플리케이션을 감싸며, 활성화되면 해당 폴백 컴포넌트가 루트 레이아웃을 대체한다. 따라서 `global-error.js` 는 자체 `<html>` 및 `<body>` 태그를 정의해야 한다는 점에 유의해야 한다.

`global-error.js` 는 가장 세분화된 에러 UI이며 전체 애플리케이션에 대한 "포괄적" 에러 처리로 간주할 수 있다. 루트 컴포넌트는 일반적으로 덜 동적이며 다른 `error.js` 바운더리가 대부분의 에러를 포착하므로 자주 트리거되지 않을 가능성이 높다.

`global-error.js` 가 정의되어 있더라도 전역적으로 공유되는 UI 및 브랜딩을 포함하는 루트 레이아웃 내에서 렌더링될 폴백 컴포넌트가 있는 루트 `error.js` 를 정의하는 것이 좋다.

```tsx
// app/global-error.tsx

'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

## 서버 에러 핸들링하기 {#handling-server-errors}

서버 컴포넌트 내에서 오류가 발생하면 Next.js는 프로덕션에서 민감한 정보를 제거한 `Error` 객체를 가장 가까운 `error.js` 파일에 `error` 프로퍼티로 전달한다.

### 민감한 에러 정보 보호 {#securing-sensitive-error-information}

프로덕션 중에 클라이언트에 전달되는 `Error` 객체에는 일반 `message` 와 `digest` 프로퍼티만 포함된다.

이는 에러에 포함된 잠재적으로 민감한 세부 정보가 클라이언트에 유출되지 않도록 하기 위한 보안 예방 조치다.

`message` 속성에는 에러에 대한 일반 메시지가 포함되며, `digest` 속성에는 서버 측 로그에서 해당 에러를 탐색하는 데 사용할 수 있는 자동으로 생성된 에러 해시가 포함된다.

개발 중에 클라이언트로 전달되는 `Error` 객체는 직렬화되며 디버깅을 쉽게 할 수 있도록 원본 에러 `message` 를 포함한다.
