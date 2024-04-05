---
title: 네비게이션 라이프사이클
description:
date: 2024-04-05
tags: []
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/navigation-lifecycle',
    },
  ]
---

이전 가이드에서 우리는 `Home` 과 `Details` 두 개의 화면을 가진 스택 내비게이터를 사용했고, `navigation.navigate('RouteName')` 를 통해 라우트 간 이동하는 방법을 배웠다.

이 상황에서 중요한 질문은 `Home` 화면에서 벗어났을 때나 `Home` 화면으로 돌아올 때 무슨 일이 일어나는지다. 라우트는 사용자가 화면을 떠나거나 되돌아오는 것을 어떻게 알 수 있을까?

웹 백그라운드에서 온 분들은 라우트 A에서 라우트 B로 이동할 때 A가 unmount(componentWillUnmount가 호출) 되고, 사용자가 A로 돌아오면 A가 다시 mount된다고 생각할 것이다. React의 이러한 라이프사이클 메서드는 여전히 유효하지만, 사용 방식이 웹과 다르다. 이는 모바일 탐색의 더 복잡한 요구 사항에 기인한다.

## 예시 시나리오 {#example-scenario}

A와 B 화면을 가진 스택 내비게이터를 가정해보자. A 화면으로 이동하면 `componentDidMount` 가 호출된다. B 화면을 푸시하면 B의 `componentDidMount` 도 호출되지만, A는 스택에 마운트된 상태로 남아있어 `componentWillUnmount` 는 호출되지 않는다.

B에서 A로 돌아갈 때는 B의 `componentWillUnmount` 가 호출되지만, A의 `componentDidMount` 는 호출되지 않는다. 왜냐하면 A는 계속 마운트된 상태였기 때문이다.

이는 다른 내비게이터에서도 유사하다. 각 탭이 스택 내비게이터인 탭 내비게이터를 생각해보자:

```tsx
function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="First">
          {() => (
            <SettingsStack.Navigator>
              <SettingsStack.Screen
                name="Settings"
                component={SettingsScreen}
              />
              <SettingsStack.Screen name="Profile" component={ProfileScreen} />
            </SettingsStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="Second">
          {() => (
            <HomeStack.Navigator>
              <HomeStack.Screen name="Home" component={HomeScreen} />
              <HomeStack.Screen name="Details" component={DetailsScreen} />
            </HomeStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-navigation-lifecycle/1.gif =40%x)

우리는 `HomeScreen` 에서 시작해 `DetailsScreen` 으로 이동한다. 그런 다음 탭바를 사용해 `SettingsScreen` 으로 전환하고 `ProfileScreen` 으로 이동한다. 이 일련의 작업이 완료되면 4개의 화면 모두가 마운트된 상태다! 탭바를 사용해 `HomeStack` 으로 다시 전환하면 `DetailsScreen` 이 표시되는 것을 볼 수 있다 - `HomeStack` 의 탐색 상태가 보존되어 있다!

## React Navigation 라이프사이클 이벤트 {#react-navigation-lifecycle-events}

이제 React Navigation에서 React 라이프사이클 메서드가 어떻게 작동하는지 이해했으므로, 처음에 물었던 질문에 답해보자: "사용자가 화면을 떠나거나(blur) 되돌아 올 때(focus)를 어떻게 알 수 있을까?"

React Navigation은 구독한 화면 컴포넌트에 이벤트를 발생시킨다. `focus` 와 `blur` 이벤트에 리스너를 추가하면 화면이 포커스되거나 포커스를 잃을 때를 알 수 있다.

```tsx
function Profile({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 화면이 포커스됨
      // 작업 수행
    });

    return unsubscribe;
  }, [navigation]);

  return <ProfileContent />;
}
```

사용 가능한 이벤트와 API 사용법에 대한 자세한 내용은 [Navigation events](https://reactnavigation.org/docs/navigation-events)를 참고한다.

수동으로 이벤트 리스너를 추가하는 대신, [useFocusEffect](https://reactnavigation.org/docs/use-focus-effect) 훅을 사용할 수 있다. React의 `useEffect` 훅과 비슷하지만 탐색 라이프사이클에 연동된다.

```tsx
import { useFocusEffect } from '@react-navigation/native';

function Profile() {
  useFocusEffect(
    React.useCallback(() => {
      // 화면이 포커스될 때 작업 수행

      return () => {
        // 화면이 포커스를 잃을 때 작업 수행
        // 정리 함수에 유용
      };
    }, []),
  );

  return <ProfileContent />;
}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-navigation-lifecycle/2.gif =40%x)

화면이 포커스 된 상태에 따라 다른 것을 렌더링하고 싶다면 [`useIsFocused`](https://reactnavigation.org/docs/use-is-focused) 훅을 사용한다. 이 훅은 화면이 포커스 되었는지 여부를 나타내는 boolean 값을 리턴한다.
