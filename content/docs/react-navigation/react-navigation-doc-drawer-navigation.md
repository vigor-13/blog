---
title: 드로어 네비게이션
description:
date: 2024-04-05
tags: [drawer]
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/drawer-based-navigation',
    },
  ]
---

탐색에서 일반적인 패턴은 화면 간 이동을 위해 왼쪽(때로는 오른쪽) 측면에서 드로어를 사용하는 것이다.

계속하기 전에 먼저 [`@react-navigation/drawer`](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer) 와 그 종속성을 [지시](https://reactnavigation.org/docs/drawer-navigator#installation)에 따라 설치해야 한다.

## 드로어 기반 탐색 기본 예제 {#minimal-example-of-drawer-based-navigation}

드로어 내비게이터를 사용하려면 `@react-navigation/drawer` 에서 import한다:

```jsx
{% raw %}import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-drawer-navigation/1.gif =40%x)

## 드로어 열기와 닫기​ {#opening-and-closing-drawer}

드로어를 열고 닫으려면 다음 헬퍼를 사용한다:

```tsx
navigation.openDrawer();
navigation.closeDrawer();
```

드로어를 토글하려면 다음과 같이 호출한다:

```tsx
navigation.toggleDrawer();
```

이 함수들은 내부적으로 액션을 디스패치한다:

```tsx
navigation.dispatch(DrawerActions.openDrawer());
navigation.dispatch(DrawerActions.closeDrawer());
navigation.dispatch(DrawerActions.toggleDrawer());
```

드로어가 열려 있는지 닫혀 있는지 다음과 같이 확인 할 수 있다:

```tsx
import { useDrawerStatus } from '@react-navigation/drawer';

// ...

const isDrawerOpen = useDrawerStatus() === 'open';
```
