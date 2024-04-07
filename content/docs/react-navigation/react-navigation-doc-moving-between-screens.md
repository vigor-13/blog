---
title: 화면간 이동하기
description:
date: 2024-04-04
tags: []
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/navigating',
    },
  ]
---

이전 가이드에서 두 개의 라우트(`Home` 과 `Details`)를 가진 스택 네비게이터를 정의했지만, 사용자가 `Home` 에서 `Details` 로 이동하는 방법은 배우지 않았다.

만약 웹 브라우저 환경 이었다면, 다음과 같이 작성할 수 있을 것이다:

```tsx
<a href="details.html">Go to Details</a>
```

또는 다음과 같이 작성할 수 있을 것이다.

```tsx
<a
  onClick={() => {
    window.location.href = 'details.html';
  }}
>
  Go to Details
</a>
```

우리는 후자와 유사한 작업을 수행할 것이다. 그러나 `window.location` 전역 변수를 사용하는 대신, 화면 컴포넌트로 전달되는 `navigation` prop을 사용할 것이다.

## 새 화면으로 이동하기 {#navigating-to-a-new-screen}

```tsx
{% raw %}import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

// ... other code from the previous section
{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-moving-between-screens/1.gif =40%x)

자세히 살펴보자:

- `navigation` - `navigation` prop은 네이티브 스택 네비게이터의 모든 **화면 컴포넌트**([정의](https://reactnavigation.org/docs/glossary-of-terms#screen-component))에 전달된다.
- `navigate('Details')` - `navigate` 함수를 호출할 때 사용자를 이동시키고자 하는 라우트의 이름을 전달한다. (자세한 내용은 [여기](https://reactnavigation.org/docs/navigation-prop)를 참조)

:::note
정의되지 않은 라우트 이름으로 `navigation.navigate` 를 호출하면 개발 빌드에서 오류가 출력되고 프로덕션 빌드에서는 아무 일도 일어나지 않는다. 다시 말해, 우리는 네비게이터에 정의된 라우트로만 이동할 수 있다. 임의의 컴포넌트로 이동할 수는 없다.
:::

이제 두 개의 라우트를 가진 스택이 있다: 1) `Home` 2) `Details`. 만약 `Details` 화면에서 `Details` 라우트로 다시 이동하면 어떤 일이 일어날까?

## 라우트로 여러 번 이동하기 {#navigate-to-a-route-multiple-times}

```tsx
{% raw %}function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}{% endraw %}
```

이 코드를 실행하면 "Go to Details... again"을 탭해도 아무 일도 일어나지 않는 것을 알 수 있다! 이는 우리가 이미 Details 라우트에 있기 때문이다. `navigate` 함수는 대략 "이 화면으로 이동하라"는 의미이며, 이미 해당 화면에 있다면 아무 일도 하지 않는 것이 옳다.

실제로 다른 상세 화면을 추가하고 싶다고 가정해 보자. 이는 각 라우트에 고유한 데이터를 전달하는 경우 매우 일반적인 상황이다(`params`에 대해 나중에 자세히 다룰 것이다!). 이를 위해 `navigate`를 `push`로 변경할 수 있다. 이를 통해 기존 탐색 기록에 관계없이 다른 라우트를 추가하려는 의도를 표현할 수 있다.

```tsx
<Button
  title="Go to Details... again"
  onPress={() => navigation.push('Details')}
/>
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-moving-between-screens/2.gif =40%x)

`push` 를 호출할 때마다 네비게이션 스택에 새로운 라우트를 추가한다. `navigate`를 호출하면 먼저 해당 이름의 기존 라우트를 찾으려고 하고, 스택에 아직 없는 경우에만 새 라우트를 푸시한다.

## 뒤로 가기 {#going-back}

네이티브 스택 네비게이터가 제공하는 헤더에는 활성화된 화면에서 뒤로 갈 수 있는 경우(네비게이션 스택에 화면이 하나만 있다면 되돌아갈 화면이 없는 것이므로 뒤로 가기 버튼이 없다) 자동으로 뒤로 가기 버튼이 포함된다.

때로는 이러한 동작을 프로그래밍 방식으로 트리거하고 싶을 수 있다. 이를 위해 `navigation.goBack();`을 사용할 수 있다.

```tsx
{% raw %}function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-moving-between-screens/3.gif =40%x)

:::note
Android에서 React Navigation은 하드웨어 뒤로 가기 버튼과 연결되어 사용자가 버튼을 누르면 `goBack()` 함수를 실행하므로, 사용자가 예상하는 대로 동작한다.
:::

또 다른 일반적인 요구 사항은 여러 화면을 _한 번에_ 돌아가는 것이다. 예를 들어, 스택에서 여러 화면이 들어가 있는 경우 이들을 모두 닫고 첫 번째 화면으로 돌아가려는 경우가 있다. 이 경우에는 `Home` 으로 돌아가고 싶은 것 이므로 `navigate('Home')`을 사용할 수 있다(`push`가 아니다!). 또 다른 대안은 `navigation.popToTop()`을 사용하는 것이다. 이는 스택의 첫 번째 화면으로 돌아간다.

```tsx
{% raw %}function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-moving-between-screens/4.gif =40%x)
