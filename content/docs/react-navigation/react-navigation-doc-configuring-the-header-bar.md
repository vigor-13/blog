---
title: 헤더 바 설정하기
description:
date: 2024-04-04
tags: []
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/headers',
    },
  ]
---

우리는 이미 앞서 헤더의 제목을 설정하는 방법을 살펴보았지만, 다른 옵션으로 넘어가기 전에 다시 한 번 살펴볼 것이다. 반복은 학습의 핵심이다!

## 헤더 제목 설정하기 {#setting-the-header-title}

Screen 컴포넌트는 `options` prop을 받는다.

다음 예제에서 볼 수 있듯이 헤더 제목에 사용하는 옵션은 `title` 이다.

```tsx
{% raw %}function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
    </Stack.Navigator>
  );
}{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-configuring-the-header-bar/1.png)

## 제목에서 params 사용하기 {#using-params-in-the-title}

`options` prop을 함수로 정의하면 React Navigation은 `{ navigation, route }` 객체를 인자로 사용하여 해당 함수를 호출한다. 이 객체는 화면 컴포넌트에서 사용할 수 있는 `navigation` 과 `route` prop을 포함하고 있다.

`route` prop은 현재 화면에 대한 정보를 담고 있는 객체다. 이 객체의 `params` 속성을 통해 화면으로 전달된 params에 접근할 수 있다.

아래의 예제에서 `options` 함수는 `route` 객체를 받아 `route.params.name` 을 추출하여 화면의 제목(`title`)으로 사용한다. 이렇게 하면 `ProfileScreen`으로 이동할 때 `name` param을 전달하여 동적으로 제목을 설정할 수 있다.

```tsx
{% raw %}function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}{% endraw %}
```

`options` 함수에 전달되는 인지는 다음 속성을 가진 객체다:

- `navigation` - 화면의 navigation prop.
- `route` - 화면의 route prop.

위의 예제에서는 `route` prop만 필요했지만, 경우에 따라 `navigation`도 사용할 수 있다.

## setOptions로 options 업데이트하기 {#updating-options-with-setOptions}

마운트된 화면 컴포넌트 자체에서 활성 화면의 `options` 설정을 업데이트해야 하는 경우가 많다. 이는 `navigation.setOptions`를 사용하여 할 수 있다.

```tsx
<Button
  title="Update the title"
  onPress={() => navigation.setOptions({ title: 'Updated!' })}
/>
```

## 헤더 스타일 조정하기 {#adjusting-header-styles}

헤더 스타일을 커스터마이징할 때 사용할 세 가지 주요 속성이 있다: `headerStyle` , `headerTintColor` , `headerTitleStyle`.

- `headerStyle`: 헤더를 감싸는 `View`에 적용될 스타일 객체다. 여기에 `backgroundColor` 를 설정하면 헤더의 색상이 된다.
- `headerTintColor`: 뒤로 가기 버튼과 제목 모두 이 속성을 색상으로 사용한다. 아래 예제에서는 색조 색상을 흰색(`#fff`)으로 설정하여 뒤로 가기 버튼과 헤더 제목이 흰색이 되도록 한다.
- `headerTitleStyle`: 제목의 `fontFamily`, `fontWeight` 및 기타 `Text` 스타일 속성을 커스터마이징 하려면 이 속성을 사용할 수 있다.

```tsx
{% raw %}function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'My home',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-configuring-the-header-bar/2.png)

여기서 주목해야 할 몇 가지 사항이 있다:

1. iOS에서는 상태 표시줄의 텍스트와 아이콘이 검정색이며, 어두운 색상의 배경에서는 잘 보이지 않는다. 여기서는 자세히 다루지 않겠지만, [상태 표시줄 가이드](https://reactnavigation.org/docs/status-bar)에 설명된 대로 화면 색상에 맞게 상태 표시줄을 구성해야 한다.
2. 설정한 구성은 홈 화면에만 적용된다. 상세 화면으로 이동하면 기본 스타일로 돌아간다. 이제 화면 간에 `options` 을 공유하는 방법을 살펴보자.

## 다양한 화면에서 공통 `options` 공유하기 {#sharing-common-options-across-screens}

많은 화면에서 헤더를 유사하게 구성하는 경우가 많다. 예를 들어, 회사의 브랜드 색상이 빨간색이라면 헤더 배경색은 빨간색, 텍스트 색상은 하얀색으로 설정하고 싶을 것이다. 편리하게도 우리가 진행중인 예제에서도 이 색상을 사용하고 있으며, `DetailsScreen`으로 이동하면 색상이 기본값으로 돌아가는 것을 확인할 수 있다. `HomeScreen` 에서 헤더 스타일 속성을 `DetailsScreen` 으로 복사하고, 앱에서 사용하는 모든 화면 컴포넌트에 대해 이를 반복해야 한다면 끔찍할 것이다. 다행히도 우리는 이렇게 할 필요가 없다. 대신 `screenOptions` 프로퍼티를 사용하여 설정을 네이티브 스택 네비게이터 수준으로 올릴 수 있다.

```tsx
{% raw %}function StackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
    </Stack.Navigator>
  );
}{% endraw %}
```

이제 `Stack.Navigator` 에 속한 모든 화면에 우리의 멋진 브랜드 스타일이 적용된다. 하지만 필요할 때 이러한 옵션을 재정의할 수 있는 방법이 있어야 한다.

## 제목을 커스텀 컴포넌트로 교체하기 {#replacing-the-title-with-a-custom-component}

때로는 제목 텍스트와 스타일을 변경하는 것 이상의 제어가 필요할 수 있다. 예를 들어 제목 대신 이미지를 렌더링하거나 제목을 버튼으로 만들고 싶을 수 있다. 이런 경우에는 제목에 사용되는 컴포넌트를 완전히 재정의하여 직접 제공할 수 있다.

```tsx
{% raw %}function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('@expo/snack-static/react-native-logo.png')}
    />
  );
}

function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
      />
    </Stack.Navigator>
  );
}{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-configuring-the-header-bar/3.png)

:::note
`title` 이 아닌 `headerTitle`을 제공하는 이유가 궁금할 수 있다. 그 이유는 `headerTitle` 이 헤더에 특화된 프로퍼티이기 때문이다. 반면 `title` 은 탭바, 드로워 등에서도 사용된다. `headerTitle` 의 기본값은 `title` 을 표시하는 `Text` 컴포넌트다.
:::

## 추가 설정 {#additional-configuration}

네이티브 스택 네비게이터 내부에서 사용 가능한 `options` 전체 목록은 [`createNativeStackNavigator` 레퍼런스](https://reactnavigation.org/docs/native-stack-navigator#options)에서 확인할 수 있다.
