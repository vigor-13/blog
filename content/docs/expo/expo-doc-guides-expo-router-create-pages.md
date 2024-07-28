---
title: Expo Router로 페이지 생성하기
description: Expo Router의 파일 기반 라우팅 규칙에 대해 알아본다.
date: 2024-07-28
tags: [expo_router]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/router/create-pages/',
    },
  ]
---

`app` 디렉토리에 파일을 생성하면 자동으로 앱의 라우트가 된다. 예를 들어, 다음과 같다:

| 디렉토리                 | 라우트                      |
| ------------------------ | --------------------------- |
| `app/index.tsx`          | `/`                         |
| `app/home.tsx`           | `/home`                     |
| `app/[user].tsx`         | `/expo`, `/evanbacon` 등... |
| `app/settings/index.tsx` | `/settings`                 |

## 페이지

페이지는 `app` 디렉토리의 파일에서 React 컴포넌트를 default로 export하여 정의한다.

파일 확장자는 `.js`, `.jsx`, `.tsx`, `.ts` 중 하나를 사용해야 한다.

예를 들어:

:::tabs

@tab:active Universal#universal

React Native의 `<Text>` 컴포넌트를 플랫폼에 관계없이 렌더링할 수 있다.

```ts
// **app/index.tsx**
import { Text } from 'react-native';

export default function Page() {
  return <Text>최상위 페이지</Text>;
}
```

@tab Web-only#web

`<div>` , `<p>` 등의 웹 전용 React Component는 네이티브 플렛폼에서는 사용할 수 없다.

```ts
// **app/index.tsx**
export default function Page() {
  return <p>Top-level page</p>;
}
```

:::

위의 예제는 앱과 브라우저에서 `/` 경로에 매칭된다.

`index` 파일은 부모 디렉토리와 매칭되며 라우트 세그먼트를 추가하지 않는다.

예를 들어, `app/settings/index.tsx` 는 앱에서 `/settings` 와 매칭된다.

## 플랫폼별 확장자

:::warning
플랫폼별 확장자는 Expo Router `3.5.x` 에서 추가되었다.

이전 버전의 라이브러리를 사용 중이라면 [플랫폼별 모듈 지침](https://docs.expo.dev/router/advanced/platform-specific-modules/)을 참조한다.
:::

:::note 플랫폼별 확장자

- `.ios.tsx` : iOS 전용
- `.android.tsx` : Android 전용
- `.native.tsx` : 모바일 플랫폼(iOS와 Android) 전용
- `.web.tsx` : 웹 전용

:::

Metro 번들러의 **플랫폼별 확장자**는 **비플랫폼 버전**이 존재하는 경우에만 사용할 수 있다.

:::note 비플랫폼 버전
Expo Router는 모든 플랫폼에서 동작할 수 있는 기본 버전의 파일이 필요하다. 이를 **비플랫폼 버전**이라고 한다. 예를 들어, `about.tsx` 파일이 이에 해당한다.
:::

이는 **딥 링킹**을 위한 것으로 <u>모든 플랫폼에서 라우트가 보편적으로 사용될 수 있도록 보장한다.</u>

- 딥 링킹: 앱의 특정 페이지로 직접 연결할 때, 모든 플랫폼에서 해당 페이지가 존재해야 한다.
- 일관성: 기본 구현을 제공함으로써 모든 플랫폼에서 최소한의 기능을 보장한다.
- 유연성: 필요한 경우 특정 플랫폼에 맞춤화된 버전을 제공할 수 있다.

예를 들면 다음과 같다:

```text
app
 ├── _layout.tsx
 ├── _layout.web.tsx
 ├── index.tsx
 ├── about.tsx
 └── about.web.tsx
```

위의 파일 구조에서:

- `_layout.web.tsx` 파일은 웹에서 레이아웃으로 사용되고 `_layout.tsx`는 다른 모든 플랫폼에서 사용된다.
- `index.tsx` 파일은 모든 플랫폼의 홈 페이지로 사용된다.
- `about.web.tsx` 파일은 웹의 `about` 페이지로 사용되고, `about.tsx` 파일은 다른 모든 플랫폼에서 사용된다.

:::note
모든 플랫폼에 기본 구현이 있음을 보장하기 위해 플랫폼별 확장자가 없는 라우트 파일을 제공해야 한다.
:::

## 동적 라우트

동적 라우트는 URL의 특정 부분이 변할 수 있도록 만든 경로다. 이는 하나의 파일로 여러 가지 비슷한 페이지를 처리할 수 있게 해준다.

즉 URL의 특정 위치에서 고정된 이름의 파일이 없을 때, 동적 라우트 파일이 사용된다.

| 라우트                   | 매칭된 URL           |
| ------------------------ | -------------------- |
| `app/blog/[slug].tsx`    | `/blog/123`          |
| `app/blog/[...rest].tsx` | `/blog/123/settings` |

- 더 구체적인 라우트가 동적 라우트보다 먼저 매칭된다.
  - 예를 들어, `/blog/bacon`은`blog/[id].tsx` 보다 `blog/bacon.tsx` 와 먼저 매칭된다.
- rest 구문( `...` )을 사용하여 단일 라우트에서 여러 슬러그를 매칭할 수 있다.
  - 예를 들어, `app/blog/[...id].tsx` 는 `/blog/123/settings` 와 매칭된다.

동적 세그먼트는 페이지 컴포넌트에서 [라우트 파라미터](https://docs.expo.dev/router/reference/url-parameters/)로 접근할 수 있다.

```typescript
// app/blog/[slug].tsx
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function Page() {
  const { slug } = useLocalSearchParams();

  return <Text>블로그 포스트: {slug}</Text>;
}
```
