---
title: 안전 영역 지원
description:
date: 2024-04-06
tags: [safe_area, react-native-safe-area-context]
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/handling-safe-area',
    },
  ]
---

기본적으로 React Navigation은 iPhone X와 같이 노치(notch)나 앱 콘텐츠를 가릴 수 있는 UI 요소가 있는 기기에서도 네비게이터의 구성 요소들이 올바르게 표시될 수 있도록 처리한다.

여기에는 다음과 같은 것들이 포함된다:

- 물리적 노치
- 상태 표시줄 오버레이
- iOS의 홈 활동 표시기
- Android의 탐색 바

위의 요소들에 의해서 가려지지 않는 영역을 **안전 영역(safe area)** 이라고 한다.

네비게이터의 UI 요소들이 물리적 노치나 시스템 UI에 의해 가려지는 것을 방지하기 위해, 우리는 적절한 간격을 적용한다. 이는 두 가지 목표를 달성하기 위함인데, 첫째는 화면을 최대한 활용하는 것이고, 둘째는 콘텐츠가 하드웨어의 특성이나 시스템 UI에 의해 가려지거나 상호작용이 어려워지는 것을 방지하는 것이다.

React Navigation은 내장된 UI 요소에 대해서는 기본적으로 안전 영역을 고려하여 처리하지만, 개발자가 직접 구현한 콘텐츠에 대해서는 추가적인 처리가 필요할 수 있다.

전체 앱을 패딩이 적용된 컨테이너로 감싸는 것은 간단한 해결책처럼 보일 수 있지만, 이는 아래 왼쪽 이미지에서 볼 수 있듯이 화면 공간을 낭비하게 된다. 우리가 원하는 이상적인 결과는 오른쪽 이미지처럼, 안전 영역을 고려하면서도 화면을 효율적으로 사용하는 것이다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-supporting-safe-areas/1.png)

React Native는 `SafeAreaView` 컴포넌트를 제공하지만 iOS 10 이상에서만 지원되며, 이전 버전의 iOS나 Android에서는 사용할 수 없다. 게다가 이 컴포넌트는 몇 가지 문제점을 가지고 있는데, 예를 들어 안전 영역이 적용된 화면에 애니메이션을 적용할 경우, 화면이 튀는 현상이 발생할 수 있다.

이러한 이유로, 우리는 [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context) 라이브러리에서 제공하는 `useSafeAreaInsets` 훅을 사용하여 안전 영역을 더욱 안정적이고 효과적으로 처리할 것을 권장한다.

:::warning
`react-native-safe-area-context` 라이브러리 역시 `SafeAreaView` 컴포넌트를 제공하지만, 이 컴포넌트 역시 애니메이션 적용 시 튀는 현상과 같은 문제를 가지고 있다. 따라서, 가능한 한 `SafeAreaView` 컴포넌트의 사용을 피하고, 대신 `useSafeAreaInsets` 훅을 활용하는 것을 권장한다.
:::

이 가이드의 나머지 부분에서는 React Navigation에서 안전 영역을 지원하는 방법에 대한 자세한 정보를 제공한다.

## 히든/커스텀 헤더 또는 탭 바 {#hidden-custom-header-or-tab-bar}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-supporting-safe-areas/2.png)

React Navigation의 기본 헤더는 자동으로 안전 영역을 처리한다. 그러나 커스텀 헤더를 사용하는 경우 UI가 안전 영역 내에 있는지 확인하는 것이 중요하다.

예를 들어, `header` 나 `tabBar` 에 아무것도 렌더링하지 않는 경우 안전 영역도 적용되지 않는다.

```tsx
{% raw %}import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function Demo() {
  return (
    <View
      style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </View>
  );
}
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home">
          {() => (
            <Tab.Navigator
              initialRouteName="Analitics"
              tabBar={() => null}
              screenOptions={{ headerShown: false }}
            >
              <Tab.Screen name="Analitics" component={Demo} />
              <Tab.Screen name="Profile" component={Demo} />
            </Tab.Navigator>
          )}
        </Stack.Screen>

        <Stack.Screen name="Settings" component={Demo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-supporting-safe-areas/3.png)

이 문제를 해결하기 위해 콘텐츠에 안전 영역 간격을 적용해야 한다. 이는 `react-native-safe-area-context` 라이브러리의 `useSafeAreaInsets` 훅을 사용하여 구현 가능하다:

```tsx
{% raw %}import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function Demo() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',

        // 안전 영역을 처리하기 위한 패딩
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>{/_(...) _/}</NavigationContainer>
    </SafeAreaProvider>
  );
}{% endraw %}
```

[여기](https://github.com/th3rdwave/react-native-safe-area-context#usage) 지침에 따라 앱을 `SafeAreaProvider` 로 래핑한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-supporting-safe-areas/4.png)

이렇게 하면 앱이 노치가 있는 기기에서 실행 중인지 감지하여 콘텐츠가 하드웨어 요소에 가려지지 않도록 한다.

## 가로 모드 {#landscape-mode}

애플리케이션이 가로 모드일 때, 안전 영역이 적영된 기본 탐색 바와 탭 바를 사용하더라도 콘텐츠가 기기의 센서 클러스터에 의해 가려지지 않도록 주의해야 한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-supporting-safe-areas/5.png)

이 문제를 해결하기 위해서는 세로 모드에서와 마찬가지로 콘텐츠 영역에 안전 영역 간격을 한 번 더 적용하는 것이 좋다. 이렇게 하면 가로 모드에서도 콘텐츠가 센서에 의해 가려지는 것을 방지할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-supporting-safe-areas/6.png)

## 더 세밀한 제어를 위해 훅 사용하기 {#Use-the-hook-for-more-control}

경우에 따라 적용되는 패딩에 대해 더 세밀한 제어가 필요할 수 있다. 예를 들어, `style` 객체를 변경하여 위쪽과 아래쪽에만 패딩을 적용할 수 있다:

```tsx
{% raw %}import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Demo() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,

        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </View>
  );
}{% endraw %}
```

마찬가지로, `FlatList` 컴포넌트의 `contentContainerStyle` 속성에 안전 영역 패딩을 적용함으로써, 리스트의 콘텐츠가 안전 영역을 침범하지 않도록 할 수 있다. 이렇게 하면 콘텐츠는 안전 영역 내에서 렌더링되지만, 사용자가 리스트를 스크롤할 때는 상태 표시줄이나 탐색 바 아래로 콘텐츠가 살짝 들어가는 것처럼 보이게 된다.
