---
title: 헤더 버튼
description:
date: 2024-04-05
tags: []
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/header-buttons',
    },
  ]
---

이제 헤더의 모습을 커스터마이징하는 방법을 알았으니, 헤더에 버튼을 추가해본다.

## 헤더에 버튼 추가하기 {#adding-a-button-to-the-header}

헤더와 상호작용하는 가장 일반적인 방법은 제목 왼쪽이나 오른쪽의 버튼을 터치하는 것이다. 헤더 오른쪽에 버튼을 추가해보자.

```tsx
{% raw %}function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerRight: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title="Info"
              color="#fff"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-header-buttons/1.png)

:::note
헤더에 올바른 스타일의 버튼을 렌더링하기 위해 커뮤니티에서 개발한 라이브러리 [react-navigation-header-buttons](https://github.com/vonovak/react-navigation-header-buttons)가 있다.
:::

## 헤더와 화면 컴포넌트 간 상호작용 {#header-interaction-with-its-screen-component}

경우에 따라 헤더의 컴포넌트가 화면 컴포넌트와 상호작용해야 할 수 있다. 이런 경우 `navigation.setOptions` 를 사용하여 옵션을 업데이트해야 한다. 화면 컴포넌트 내부에서 `navigation.setOptions`를 사용하면 화면의 props, state, context 등에 접근할 수 있다.

```tsx
{% raw %}function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation, route }) => ({
          headerTitle: (props) => <LogoTitle {...props} />,
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: () => <Button title="Update count" />,
        })}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({ navigation }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
      ),
    });
  }, [navigation]);

  return <Text>Count: {count}</Text>;
}{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-header-buttons/2.gif =40%x)

위의 코드에서 `headerRight` 를 컴포넌트의 state에 접근하고 업데이트할 수 있는 `onPress` 핸들러가 있는 버튼으로 업데이트한다.

## 백 버튼 커스터마이징 {#customizing-the-back-button}

`createNativeStackNavigator` 는 플랫폼별 기본 백(back) 버튼을 제공한다. iOS에서는 버튼 옆에 라벨이 포함되어 있어, 가능하면 이전 화면의 제목을 보여주고 그렇지 않으면 "Back"이라고 표시한다.

`headerBackTitle` 을 사용하여 라벨 동작을 변경하고 `headerBackTitleStyle` 로 스타일을 지정할 수 있다([더 읽어보기](https://reactnavigation.org/docs/native-stack-navigator#headerbacktitle)).

백 버튼 이미지를 커스터마이징하려면 `headerBackImageSource`를 사용할 수 있다([더 읽어보기](https://reactnavigation.org/docs/native-stack-navigator#headerbackimagesource)).

```tsx
{% raw %}<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen
    name="Details"
    component={DetailsScreen}
    options={{
      headerBackTitle: 'Custom Back',
      headerBackTitleStyle: { fontSize: 30 },
    }}
  />
</Stack.Navigator>{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-header-buttons/3.png)

## 백 버튼 재정의하기 {#overriding-the-back-button}

스택 네비게이터에서는 사용자가 현재 화면에서 뒤로 갈 수 있는 경우 백 버튼이 자동으로 렌더링된다. 다시 말해, 스택에 두 개 이상의 화면이 있으면 언제나 백 버튼이 렌더링된다.

일반적으로 이것이 원하는 동작일 것이다. 하지만 위에서 언급한 옵션으로는 충분하지 않아 백 버튼을 더 커스터마이징해야 하는 상황이 있을 수 있다. 그런 경우 `headerRight`에서 했던 것처럼 `headerLeft` 옵션에 렌더링할 React Element를 설정할 수 있다. 또는 `headerLeft` 옵션에 React 컴포넌트를 전달하여 백 버튼의 onPress 동작을 재정의할 수도 있다. 자세한 내용은 [API 레퍼런스](https://reactnavigation.org/docs/native-stack-navigator#headerleft)를 참고한다.
