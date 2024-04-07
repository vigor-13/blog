---
title: 탭 네비게이션
description:
date: 2024-04-05
tags: [tab]
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/tab-based-navigation',
    },
  ]
---

모바일 앱에서 가장 일반적인 탐색 스타일 중 하나는 탭 기반 탐색이다. 이는 화면 하단이나 헤더 바로 아래(또는 헤더 대신)에 탭이 있는 것을 말한다.

이 가이드에서는 [`createBottomTabNavigator`](https://reactnavigation.org/docs/bottom-tab-navigator) 에 대해 다룬다. [`createMaterialBottomTabNavigator`](https://reactnavigation.org/docs/material-bottom-tab-navigator) 와 [`createMaterialTopTabNavigator`](https://reactnavigation.org/docs/material-top-tab-navigator) 를 사용하여 앱에 탭을 추가할 수도 있다.

시작하기 전에 먼저 [@react-navigation/bottom-tabs](https://github.com/react-navigation/react-navigation/tree/main/packages/bottom-tabs) 를 설치한다:

```bash
npm install @react-navigation/bottom-tabs
```

## 탭 기반 탐색의 기본 예제 {#minimal-example-of-tab-based-navigation}

```tsx
{% raw %}
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-tab-navigation/1.png)

## 외관 커스터마이징하기 {#customizing-the-appearance}

스택 내비게이터를 커스터마이징 하는 방식과 유사하다 - 탭 내비게이터를 초기화할 때 사용하는 속성들과 각 화면별로 커스터마이징 할 수 있는 options 속성들이 있다.

```tsx
{% raw %}// Expo를 사용한다면 @expo/vector-icons/Ionicons에서 import할 수 있고,
// 그렇지 않다면 react-native-vector-icons/Ionicons에서 import한다.
import Ionicons from 'react-native-vector-icons/Ionicons';

// (...)

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }

            // 여기에서 원하는 컴포넌트를 사용할 수 있다!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
{% endraw %}
```

위의 예시를 하나씩 살펴보자:

- `tabBarIcon` 은 `createBottomTabNavigator` 에서 지원하는 옵션 중 하나다. 이 옵션을 사용하면 각 탭 화면에 아이콘을 렌더링할 수 있다.

  - `tabBarIcon` 은 `focused`, `color`, `size` 파라미터를 받는 함수다.
  - 기본적으로 `tabBarIcon` 옵션은 각 화면 컴포넌트의 `options` prop에서 개별적으로 설정할 수 있다.
  - 그러나 이 예제에서는 모든 탭 화면에 대한 아이콘 설정을 한곳에서 중앙 집중화하기 위해 `Tab.Navigator` 의 `screenOptions` prop을 사용했다.
  - `screenOptions` 는 모든 탭 화면에 공통으로 적용될 옵션을 설정할 수 있다. 이를 통해 `tabBarIcon` 옵션을 한 곳에서 관리할 수 있어 코드 중복을 줄이고 편의성을 높일 수 있다.
  - 물론 필요에 따라 개별 화면에서 `options` prop을 재정의하여 특정 화면에 대해서만 다른 아이콘을 렌더링할 수도 있다.

- 설정을 더 살펴보면 `tabBarActiveTintColor` 와 `tabBarInactiveTintColor` 를 볼 수 있다.

  - 탭의 활성/비활성 상태에 따른 색상을 설정하는 데 사용된다. 이 옵션들의 기본값은 iOS 플랫폼 기본값을 따르지만, 직접 색상을 지정할 수 있다.
  - `tabBarIcon` 함수에 전달되는 `color` 매개변수는 `tabBarActiveTintColor` 와 `tabBarInactiveTintColor` 옵션에서 설정한 값 중 하나다. 탭이 활성화되어 있으면 `tabBarActiveTintColor` 의 값이, 그렇지 않으면 `tabBarInactiveTintColor` 의 값이 `color` 로 전달된다.

- createBottomTabNavigator 설정 옵션에 대한 자세한 내용은 [전체 API 문서](https://reactnavigation.org/docs/bottom-tab-navigator)를 참조한다.

## 아이콘에 배지 추가하기 {#add-badges-to-icons}

때로는 일부 아이콘에 배지를 추가하고 싶을 수 있다. 이를 위해 [`tabBarBadge` 옵션](https://reactnavigation.org/docs/bottom-tab-navigator#tabbarbadge)을 사용할 수 있다:

```tsx
{% raw %}<Tab.Screen name="Home" component={HomeScreen} options={{ tabBarBadge: 3 }} />{% endraw %}
```

UI 관점에서 이 컴포넌트는 사용 준비가 되어 있지만, 여전히 React Context, Redux, MobX 또는 이벤트 전파자를 사용하여 어딘가에서 적절하게 배지 개수를 전달하는 방법을 찾아야 한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-tab-navigation/2.png)

## 탭 간 이동하기 {#jumping-between-tabs}

한 탭에서 다른 탭으로 전환하는 것은 익숙한 API인 `navigation.navigate` 를 사용한다.

```tsx
{% raw %}function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-tab-navigation/3.gif =40%x)

## 각 탭에 대한 스택 내비게이터 {#a-stack-navigator-for-each-tab}

종종 탭은 단일 화면만을 표시하지 않는다 - 예를 들어, 트위터 피드에서 트윗을 탭하면 해당 탭 내에서 모든 답글이 표시되는 새 화면으로 이동한다. 이를 각 탭 내에 별도의 네비게이션 스택이 있다고 생각할 수 있으며, 이것이 바로 React Navigation에서 모델링하는 방식이다.

```tsx
{% raw %}import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details!</Text>
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Details" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="HomeStack" component={HomeStackScreen} />
        <Tab.Screen name="SettingsStack" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-tab-navigation/4.gif =40%x)

## 왜 TabNavigator가 필요할까? 다른 독립 컴포넌트로는 부족한가? {#why-do-we-need-a-TabNavigator-instead-of-TabBarIOS-or-some-other-component}

앱에서 사용하는 네비게이션 라이브러리에 통합하지 않고 독립된 탭바 컴포넌트를 사용하려고 시도하는 경우가 많다. 경우에 따라서는 괜찮을 수 있다! 하지만 이렇게 하면 예기치 않은 불편한 문제에 직면할 수 있다는 점을 알아야 한다.

React Navigation의 탭 내비게이터를 사용하는 이유는 독립적인 탭바 컴포넌트를 사용하는 것보다 더 많은 이점이 있기 때문이다.

1. **플랫폼 기본 동작 지원**

   - 탭 내비게이터는 Android 백 버튼 처리를 자동으로 해준다. 반면 독립된 컴포넌트는 대개 이를 지원하지 않는다.

2. **탐색 작업의 일관성**

   - 탭 간 이동 뿐만 아니라 "이 탭으로 이동한 다음 이 화면으로 이동"과 같은 작업을 하나의 API(`navigation.navigate`)로 수행할 수 있다.
   - 독립된 컴포넌트를 사용하면 탭 이동과 화면 이동을 분리된 API로 처리해야 하므로 작업이 더 복잡해진다.

3. **모바일 UI 디자인 세부 사항 처리**

   - 모바일 UI에는 다양한 디자인 세부 사항이 있으며, 각 컴포넌트는 레이아웃이나 다른 컴포넌트의 존재를 인식해야 한다.
   - 예를 들어 반투명 탭바가 있다면 콘텐츠가 그 아래로 스크롤되어야 하고, 스크롤 뷰에는 탭바 높이만큼의 여백이 있어야 한다.
   - 또한 탭바를 두 번 탭하면 활성 탐색 스택이 상단으로 이동하고, 다시 탭하면 그 스택의 활성 스크롤 뷰가 맨 위로 스크롤되어야 한다.
   - React Navigation은 이러한 디자인 세부 사항을 점차 구현해 나갈 예정이다.

4. **일관된 탐색 경험**
   - 독립된 탭 컴포넌트를 사용하면 앱의 다른 부분과 탐색 경험이 일관되지 않을 수 있다.
   - React Navigation을 사용하면 전체 앱에서 일관된 탐색 경험을 제공할 수 있다.

물론 간단한 앱의 경우 독립된 탭 컴포넌트로도 충분할 수 있지만, 복잡한 앱이나 향후 기능 확장을 고려한다면 React Navigation의 탭 내비게이터를 사용하는 것이 더 나은 선택이 될 것이다.

## 탭 내비게이터에 스택이 포함되어 있는 상황에서 특정 화면에서 탭바를 숨기고 싶은 경우 {#a-tab-navigator-contains-a-stack-and-you-want-to-hide-the-tab-bar-on-specific-screens}

[여기 문서](https://reactnavigation.org/docs/hiding-tabbar-in-screens)를 확인한다.
