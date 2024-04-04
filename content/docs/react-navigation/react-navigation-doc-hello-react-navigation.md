---
title: Hello React Navigation
description:
date: 2024-04-04
tags: []
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/getting-started',
    },
  ]
---

웹 브라우저에서는 앵커(`<a>`) 태그를 사용하여 다른 페이지로 연결할 수 있다. 사용자가 링크를 클릭하면 URL이 브라우저 히스토리 스택에 푸시(push)된다. 사용자가 뒤로 가기 버튼을 누르면 브라우저는 히스토리 스택의 맨 위에서 항목을 팝(pop)하므로 이전에 방문한 페이지로 돌아간다. React Native에는 웹 브라우저와 같은 전역 히스토리 스택을 관리하는 기능이 내장되어 있지 않다. 바로 여기에서 React Navigation이 등장한다.

React Navigation의 네이티브 스택 네비게이터는 앱의 화면 전환과 탐색 히스토리를 관리할 수 있는 방법을 제공한다. 앱이 하나의 스택 네비게이터만 사용한다면, 이는 웹 브라우저가 탐색 상태를 처리하는 방식과 개념적으로 유사하다. 사용자가 앱과 상호 작용할 때 앱은 탐색 스택에서 항목을 푸시하고 팝하며, 사용자는 다른 화면을 보게 된다. 그러나 네이티브 스택 네비게이터는 웹 브라우저와 달리 네이티브 플랫폼에 최적화된 화면 전환 애니메이션과 제스처를 제공한다는 점에서 차이가 있다.

:::note
Android와 iOS 사용자는 특정 방식의 화면 전환 애니메이션과 제스처에 익숙하다. 예를 들어, iOS에서는 화면 오른쪽 가장자리에서 스와이프하면 이전 화면으로 돌아간다. Android에서는 백 버튼을 누르면 이전 화면으로 이동한다. React Navigation의 네이티브 스택 네비게이터는 이러한 플랫폼별 관례를 자동으로 처리한다.
:::

가장 일반적인 네비게이터인 `createNativeStackNavigator` 부터 시작해 보자.

## 네이티브 스택 네비게이터 라이브러리 설치 {#installing-the-native-stack-navigator-library}

앞선 가이드에서 설치한 라이브러리는 네비게이터를 위한 구성 요소와 공유 유틸리티를 제공하는 패키지다.

React Navigation의 각 네비게이터는 각각의 자체 라이브러리에서 제공한다.

**네이티브 스택 네비게이터**를 사용하려면 [`@react-navigation/native-stack`](https://github.com/react-navigation/react-navigation/tree/main/packages/native-stack) 을 설치해야 한다.

```bash
npm install @react-navigation/native-stack
```

:::note
`@react-navigation/native-stack` 은 `react-native-screens` 와 앞선 가이드에서 설치한 다른 라이브러리에 의존한다. 아직 설치하지 않았다면 해당 페이지로 이동하여 설치 지침을 따른다.
:::

### 네이티브 스택 네비게이터 생성하기 {#creating-a-native-stack-navigator}

`createNativeStackNavigator` 는 `Screen` 과 `Navigator` 라는 2개의 프로퍼티를 포함한 객체를 반환하는 함수다. 둘 다 네비게이터를 설정하는 데 사용되는 React 컴포넌트다. `Navigator` 는 자식으로 `Screen` 요소를 포함하여 라우트에 대한 설정을 정의한다.

`NavigationContainer` 는 네비게이션 트리를 관리하고 네비게이션 상태를 포함하는 컴포넌트다. 이 컴포넌트는 모든 네비게이터 구조를 래핑해야 한다. 일반적으로 이 컴포넌트는 앱의 루트에서 렌더링된다.

```tsx
// In App.js in a new project

{% raw %}import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-hello-react-navigation/1.png)

위의 코드를 실행하면 빈 탐색 바와 `HomeScreen` 화면이 표시된다. 탐색 바와 콘텐츠 영역에 대해 표시되는 스타일은 스택 네비게이터의 기본 설정이며, 나중에 이를 변경하는 방법을 배우게 될 것이다.

:::tip
라우트 이름에서 대소문자는 중요하지 않다. 소문자 `home` 또는 대문자 `Home`을 사용할 수 있으며, 선택은 여러분에게 달려 있다. 보통은 라우트 이름을 대문자로 시작하는 것을 선호한다.
:::

### 네비게이터 설정하기 {#configuring-the-navigator}

모든 라우트 설정은 네비게이터에 대한 props로 지정된다. 우리는 네비게이터에 어떤 props도 전달하지 않았기 때문에 기본 설정을 사용한다.

네이티브 스택 네비게이터에 두 번째 화면을 추가하고 `Home` 화면이 먼저 렌더링되도록 구성해 보자.

```tsx
{% raw %}function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}{% endraw %}
```

이제 우리의 스택에는 `Home` 라우트와 `Details` 라우트, 두 개의 *라우트*가 있다. 라우트는 `Screen` 컴포넌트를 사용하여 지정할 수 있다. `Screen` 컴포넌트는 탐색에 사용할 라우트의 이름에 해당하는 `name` prop과 렌더링할 컴포넌트에 해당하는 `component` prop을 받는다.

여기서 `Home` 라우트는 `HomeScreen` 컴포넌트에 해당하고, `Details` 라우트는 `DetailsScreen` 컴포넌트에 해당한다. 스택의 초기 경로는 `Home` 라우트다. `Details`로 변경하고 앱을 다시 로드해 보자(React Native의 Fast Refresh는 `initialRouteName`의 변경 사항을 업데이트하지 않는다). 이제 `Details` 화면이 표시되는 것을 확인할 수 있다. 그런 다음 다시 `Home` 으로 변경하고 한 번 더 다시 로드한다.

:::warning
`component` prop은 렌더 함수가 아닌 컴포넌트를 받는다. 인라인 함수(예: `component={() => <HomeScreen />}`)를 전달하면 안된다. 그렇게 하면 부모 컴포넌트가 리렌더링될 때 컴포넌트가 마운트 해제되고 다시 마운트되어 모든 상태를 잃게 된다. 대안은 아래의 "추가 props 전달" 섹션을 참조한다.
:::

### 옵션 지정하기 {#specifying-options}

네비게이터의 각 화면은 헤더에 렌더링할 제목과 같은 일부 옵션을 지정할 수 있다. 이러한 옵션은 각 화면 컴포넌트의 `options` prop으로 전달할 수 있다.

```tsx
{% raw %}<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{ title: 'Overview' }}
/>{% endraw %}
```

때로는 네비게이터의 모든 화면에 동일한 옵션을 지정하고 싶을 수 있다. 이를 위해 네비게이터에 `screenOptions` prop을 전달할 수 있다.

### 추가 props 전달하기 {#passing-additional-props}

때로는 화면에 추가 props를 전달하고 싶을 수 있다. 이를 위해 두 가지 접근 방식을 사용할 수 있다:

1. [React context](https://reactjs.org/docs/context.html)를 사용하고 navigator를 context provider로 감싸서 데이터를 전달한다(권장).
2. `component` prop을 지정하는 대신 화면에 렌더 콜백을 사용한다.

```tsx
<Stack.Screen name="Home">
  {(props) => <HomeScreen {...props} extraData={someData} />}
</Stack.Screen>
```

:::warning
기본적으로 React Navigation은 불필요한 렌더링을 방지하기 위해 화면 컴포넌트에 최적화를 적용한다. 렌더 콜백을 사용하면 이러한 최적화가 제거된다. 따라서 렌더 콜백을 사용하는 경우, 성능 문제를 피하기 위해 화면 컴포넌트에 [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo) 또는 [`React.PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent)를 사용해야 한다.
:::
