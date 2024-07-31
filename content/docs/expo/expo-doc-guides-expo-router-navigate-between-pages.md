---
title: 페이지 이동하기
description: 페이지 간 이동을 위한 링크 생성 방법을 알아본다.
date: 2024-07-31
tags: [expo_router, navigation]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/router/navigating-pages/',
    },
  ]
---

Expo Router는 앱 내에서 페이지 간 이동을 위해 <u>링크</u>를 사용한다.

```text
app
 ├── index.tsx
 ├── about.tsx
 └── user
     └── [id].tsx
```

다음 예시에서는 서로 다른 경로로 이동하는 두 개의 `<Link />` 컴포넌트를 보여준다.

```jsx
// app/index.tsx
import { View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Link href="/about">소개</Link>
      {/* ...다른 링크들 */}
      <Link href="/user/bacon">사용자 보기</Link>
    </View>
  );
}
```

## 버튼

Link 컴포넌트는 기본적으로 자식 요소를 `<Text>` 컴포넌트로 래핑한다. 이는 편의성의 측면에서 유용하다.

반면 `asChild` prop을 전달하면 컴포넌트를 커스터마징할 수 있다. 이렇게 하면 모든 prop이 Link 컴포넌트의 첫 번째 자식 요소에게 전달된다.

자식 컴포넌트는 반드시 `onPress` 와 `onClick` prop을 지원해야 하며, `href` 와 `role` 도 전달된다.

```jsx
import { Pressable, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <Link href="/other" asChild>
      <Pressable>
        <Text>홈</Text>
      </Pressable>
    </Link>
  );
}
```

## 네이티브 내비게이션 이해하기

Expo Router는 스택 기반 내비게이션 방식을 사용한다.

새로운 경로로 이동할 때마다 스택에 추가된다. 이미 스택에 있는 경로로 이동하면, 스택은 해당 경로까지 되돌아간다.

예를 들어, `/feed` 에서 `/profile` 로 이동하면 스택에는 `/feed` 와 `/profile` 이 포함된다.

그 다음 `/settings` 로 이동하면 스택에는 `/feed`, `/profile`, `/settings` 가 포함된다. 이후 `/feed` 로 다시 이동하면 스택은 `/feed` 까지 되돌아간다.

스택을 되돌리지 않고 경로로 이동하려면 `<Link>` 컴포넌트의 `push` prop을 사용할 수 있다. 이렇게 하면 경로가 이미 존재하더라도 항상 스택에 추가된다.

반면, `replace` 메서드는 내비게이션 스택의 현재 경로를 새 경로로 대체한다. 이는 스택에 추가하지 않고 현재 화면을 새 화면으로 대체한다.

이동하려면 전체 경로(`/profile/settings`), 상대 경로(`../settings`) 또는 객체(`{ pathname: 'profile', params: { id: '123' } }`)를 제공할 수 있다.

| 이름       | 설명                                                                                                                                                                                                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigate` | 내비게이션 스택에서 가장 가까운 경로로 이동한다. `navigate` 는 새 경로가 다른 경우에만 (검색 매개변수나 해시를 제외하고) 새 화면을 추가한다. 그렇지 않으면 현재 화면이 새 매개변수로 다시 렌더링된다. 스택에 있는 경로로 이동하면 스택은 해당 경로까지 화면을 제거한다. |
| `push`     | 항상 새 경로를 추가하며, 기존 경로를 제거하거나 대체하지 않는다. 현재 경로를 여러 번 또는 새 매개변수로 추가할 수 있다.                                                                                                                                                 |
| `replace`  | 기록에서 현재 경로를 제거하고 지정된 URL로 대체한다. 이는 리다이렉트에 유용하다.                                                                                                                                                                                        |

## 동적 경로로 링크하기

동적 경로와 쿼리 매개변수는 정적으로 제공하거나 **Href** 객체를 사용하여 제공할 수 있다.

```jsx
{% raw %}import { Link } from 'expo-router';
import { View } from 'react-native';

export default function Page() {
  return (
    <View>
      <Link
        href={{
          pathname: '/user/[id]',
          params: { id: 'bacon' },
        }}
      >
        사용자 보기
      </Link>
    </View>
  );
}{% endraw %}
```

## 화면 추가하기

기본적으로 링크는 내비게이션 스택에서 가장 가까운 경로로 이동하며, 새 경로를 추가하거나 기존 경로로 되돌아간다.

`push` prop을 사용하면 항상 새 경로를 스택에 추가한다.

```jsx
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Link push href="/feed">
        로그인
      </Link>
    </View>
  );
}
```

## 화면 대체하기

기본적으로 링크는 경로를 내비게이션 스택에 <u>추가</u>한다. 즉, `navigation.navigate()` 와 동일한 규칙을 따른다.

이때 사용자는 뒤로 이동하여 이전 화면을 사용할 수 있다.

반면 `replace` prop을 사용하면 새 화면을 추가하는 대신 현재 화면을 대체한다.

```jsx
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Link replace href="/feed">
        로그인
      </Link>
    </View>
  );
}
```

`router.replace()` 를 사용하여 명령적으로 현재 화면을 대체할 수 있다.

네이티브 앱에서는 replace 기능이 항상 단순하지만은 않다. 특히 탭 기반 구조를 가진 앱에서는 더욱 그렇다.

예를 들어, X(트위터)에서 사용자가 프로필 탭에서 특정 트윗으로 이동하려 할 때, 단순히 현재 화면을 트윗 화면으로 대체하면 앱의 자연스러운 흐름이 깨질 수 있다.

Expo Router는 이런 상황을 더 똑똑하게 처리한다.

프로필에서 트윗으로 '대체'하려 할 때, Expo Router는 먼저 홈 탭(보통 피드 화면)으로 이동한 다음 그 위에 트윗 화면을 띄운다. 또는 이미 피드에서 다른 트윗을 보고 있었다면, 현재 트윗을 새 트윗으로 자연스럽게 교체한다.

이렇게 하면 사용자가 뒤로 가기 버튼을 눌렀을 때 예상대로 홈 탭이나 이전 화면으로 돌아갈 수 있어 더 직관적인 사용자 경험을 제공한다.

Expo Router의 [`unstable_settings`](https://docs.expo.dev/router/advanced/router-settings) 기능을 사용하면 개발자가 이러한 복잡한 내비게이션 시나리오를 더 세밀하게 제어할 수 있어, 앱의 사용성을 한층 높일 수 있다.

## 명령적 내비게이션

router 객체를 사용하여 명령적으로 내비게이션할 수도 있다.

이는 이벤트 핸들러나 유틸리티 함수와 같이 React 컴포넌트 외부에서 내비게이션 작업을 수행해야 할 때 유용하다.

```javascript
import { router } from 'expo-router';

export function logout() {
  router.replace('/login');
}
```

router 객체는 불변이며 다음 함수들을 포함한다:

- `navigate` : `(href: Href) => void`. 내비게이트 작업을 수행한다.
- `push` : `(href: Href) => void`. 푸시 작업을 수행한다.
- `replace` : `(href: Href) => void`. 대체 작업을 수행한다.
- `back` : `() => void`. 이전 경로로 돌아간다.
- `canGoBack` : `() => boolean` 유효한 히스토리 스택이 존재하고 `back()` 함수가 뒤로 갈 수 있으면 true를 반환한다.
- `setParams` : `(params: Record<string, string>) => void` 현재 선택된 경로의 쿼리 매개변수를 업데이트한다.

## 자동 완성

Expo Router는 앱의 모든 경로에 대해 자동으로 정적 TypeScript 타입을 생성할 수 있다.

이를 통해 `href` 에 대한 자동 완성을 사용하고 잘못된 링크가 사용될 때 경고를 받을 수 있다.

:::note
자세한 내용은 [정적 타입 경로](https://docs.expo.dev/router/reference/typed-routes)를 참조한다.
:::

## 웹 동작

Expo Router는 웹 환경에서도 효과적으로 작동한다.

일반적인 HTML `<a>` 요소를 사용할 수 있지만, Expo Router의 `<Link>` 컴포넌트를 활용하면 훨씬 더 나은 사용자 경험을 제공할 수 있다.

기존의 HTML 링크는 페이지 전체를 다시 불러오기 때문에 속도가 느리고 React의 장점을 제대로 살리지 못한다.

반면 Expo Router의 `<Link>`는 페이지를 새로 고치지 않고 내용만 바꾸는 방식으로 작동해 훨씬 빠르고 부드러운 전환을 가능하게 한다. 또한 현재 페이지의 상태도 그대로 유지할 수 있다.

웹 개발자들에게 친숙한 `target`, `rel`, `download` 같은 속성들도 그대로 사용할 수 있다.

이런 속성들은 웹에서 실행될 때 자동으로 HTML `<a>` 태그에 적용되므로, 웹의 기본 기능을 그대로 활용하면서도 Expo Router의 이점을 누릴 수 있다.

또한 Expo Router는 단일 페이지 앱이든 여러 페이지로 구성된 정적 웹사이트든 상관없이 잘 작동한다.

이를 통해 개발자는 다양한 유형의 웹 프로젝트에서 일관된 방식으로 내비게이션을 구현할 수 있다.

## 시뮬레이터에서의 사용

Android 에뮬레이터와 iOS 시뮬레이터에서 딥 링크를 에뮬레이트하는 방법을 알아보려면 [URL 테스트](https://docs.expo.dev/guides/linking#testing-urls) 가이드를 참조한다.
