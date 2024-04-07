---
title: 라우트에 파라미터 전달하기
description:
date: 2024-04-04
tags: []
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/params',
    },
  ]
---

지금까지 우리는 몇 가지 라우트로 스택 네비게이터를 만들었고 그 라우트 사이를 네비게이션하는 방법을 알게 되었으니 이제 라우트로 이동할 때 데이터를 전달하는 방법을 살펴본다.

여기에는 두 가지 부분이 있다:

1. `navigation.navigate` 함수의 두 번째 파라미터에 객체에 포함시켜 라우트에 `params` 를 전달한다.
   - `navigation.navigate('RouteName', { /* params go here */ })`
2. 화면 컴포넌트에서 params를 읽는다: `route.params`.

:::note
전달하는 params는 JSON으로 직렬화할 수 있는 것이 좋다. 그래야 상태 지속성을 사용할 수 있고, 화면 컴포넌트가 딥 링킹을 올바르게 구현할 수 있다.
:::

```tsx
{% raw %}function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  /* 2. Get the param */
  const { itemId, otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-passing-parameters-to-routes/1.gif =40%x)

## 초기 params {#intial-params}

화면에 일부 초기 params를 전달할 수 있다. 이 화면으로 이동할 때 params를 지정하지 않으면 초기 params가 사용된다. 또한 전달하는 모든 params와 얕게 병합된다. 초기 params는 `initialParams` prop으로 지정할 수 있다:

```tsx
{% raw %}<Stack.Screen
  name="Details"
  component={DetailsScreen}
  initialParams={{ itemId: 42 }}
/>{% endraw %}
```

## params 업데이트하기 {#updating-params}

화면은 상태를 업데이트할 수 있는 것처럼 params도 업데이트할 수 있다. `navigation.setParams` 메서드를 사용하면 화면의 params를 업데이트할 수 있다. 자세한 내용은 [`setParams`의 API 레퍼런스](https://reactnavigation.org/docs/navigation-prop#setparams)를 확인한다.

기본 사용법:

```tsx
navigation.setParams({
  query: 'someText',
});
```

:::note
`title` 등의 화면 옵션을 업데이트하기 위해 `setParams`를 사용하는 것은 피해야 한다. 옵션을 업데이트해야 하는 경우에는 대신 `setOptions`를 사용한다.
:::

## 이전 화면으로 params 전달하기 {#passing-params-to-a-previous-screen}

params는 새 화면으로 데이터를 전달하는 데 유용할 뿐만 아니라 이전 화면으로 데이터를 전달하는 데에도 유용하다. 예를 들어, 게시물 작성 버튼이 있는 화면이 있고, 게시물 작성 버튼을 누르면 새 화면이 열려 게시물을 작성한다고 가정해 보자. 게시물을 작성한 후에는 게시물 데이터를 이전 화면으로 다시 전달하고 싶다.

이를 위해서는 화면이 이미 존재하는 경우 `goBack` 처럼 동작하는 `navigate` 메서드를 사용할 수 있다. `navigate`와 함께 `params`를 전달하여 데이터를 다시 전달할 수 있다:

```tsx
{% raw %}function HomeScreen({ navigation, route }) {
  React.useEffect(() => {
    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
    }
  }, [route.params?.post]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Create post"
        onPress={() => navigation.navigate('CreatePost')}
      />
      <Text style={{ margin: 10 }}>Post: {route.params?.post}</Text>
    </View>
  );
}

function CreatePostScreen({ navigation, route }) {
  const [postText, setPostText] = React.useState('');

  return (
    <>
      <TextInput
        multiline
        placeholder="What's on your mind?"
        style={{ height: 200, padding: 10, backgroundColor: 'white' }}
        value={postText}
        onChangeText={setPostText}
      />
      <Button
        title="Done"
        onPress={() => {
          // Pass and merge params back to home screen
          navigation.navigate({
            name: 'Home',
            params: { post: postText },
            merge: true,
          });
        }}
      />
    </>
  );
}{% endraw %}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-navigation-doc-passing-parameters-to-routes/2.gif =40%x)

여기서 "Done"을 누르면 home 화면의 `route.params` 가 `navigate` 에서 전달한 postText를 받는다.

## 중첩 네비게이터에 params 전달하기 {#passing-params-to-nested-navigators}

중첩 네비게이터가 있는 경우, params를 조금 다르게 전달해야 한다. 예를 들어, `Account` 화면 내부에 네비게이터가 있고, 해당 네비게이터 내부의 `Settings` 화면으로 params를 전달하고 싶다고 가정해 보자. 그러면 다음과 같이 params를 전달할 수 있다:

```tsx
navigation.navigate('Account', {
  screen: 'Settings',
  params: { user: 'jane' },
});
```

중첩에 대한 자세한 내용은 [중첩 네비게이터](https://reactnavigation.org/docs/nesting-navigators)를 참조한다.

## params에는 무엇이 들어가야 하는가 {#what-should-be-in-params}

params에 어떤 종류의 데이터가 들어가야 하는지 이해하는 것이 중요하다. params는 화면에 대한 옵션과 같다. 화면에 표시되는 내용을 구성하는 정보만 포함해야 한다. 화면 자체에 표시될 전체 데이터를 전달하는 것은 피해야 한다(예: 사용자 객체 대신 사용자 ID 전달). 또한 여러 화면에서 사용되는 데이터를 전달하는 것도 피한다. 이런 데이터는 전역 저장소에 있어야 한다.

_route 객체를 URL과 같이 생각할 수도 있다. 화면에 URL이 있다면 URL에 무엇이 들어가야 할까? params에는 URL에 있으면 안 된다고 생각하는 데이터를 포함하지 말아야 한다._ 이는 종종 화면이 무엇인지 결정하는 데 필요한 최소한의 데이터만 유지해야 함을 의미한다. 쇼핑 웹사이트를 방문할 때를 생각해 보자. 제품 목록을 볼 때 URL에는 일반적으로 카테고리 이름, 정렬 유형, 필터 등이 포함되지만 화면에 표시되는 실제 제품 목록은 포함되지 않는다.

예를 들어, `Profile` 화면이 있다고 가정해 보자. 이 화면으로 이동할 때 params에 사용자 객체를 전달하고 싶을 수 있다:

```jsx
// 이렇게 하면 안된다
navigation.navigate('Profile', {
  user: {
    id: 'jane',
    firstName: 'Jane',
    lastName: 'Done',
    age: 25,
  },
});
```

이는 편리해 보이고, 추가 작업 없이 `route.params.user`로 사용자 객체에 접근할 수 있게 해준다.

그러나 이는 안티 패턴이다. 사용자 객체와 같은 데이터는 전역 저장소에 있어야 한다. 그렇지 않으면 _여러 곳에서 동일한 데이터가 중복된다._ 이로 인해 네비게이션 후 사용자 객체가 변경되었더라도 프로필 화면에 오래된 데이터가 표시되는 등의 버그가 발생할 수 있다.

또한 다음과 같은 이유로 딥 링킹이나 웹에서 화면으로 연결하는 것이 문제가 될 수 있다:

1. URL은 화면을 나타내므로, params, 즉 전체 사용자 객체도 포함해야 하므로 URL이 매우 길어지고 읽기 어려워질 수 있다.
2. 사용자 객체가 URL에 있으므로 존재하지 않는 사용자를 나타내거나 프로필에 잘못된 데이터가 있는 임의의 사용자 객체를 전달할 수 있다.
3. 사용자 객체가 전달되지 않거나 잘못 형식화된 경우 화면이 이를 처리하는 방법을 모르기 때문에 충돌이 발생할 수 있다.

더 나은 방법은 params에 사용자의 ID만 전달하는 것이다:

```jsx
navigation.navigate('Profile', { userId: 'jane' });
```

이제 전달된 `userId` 를 사용하여 전역 저장소에서 사용자를 가져올 수 있다. 이렇게 하면 오래된 데이터나 문제가 있는 URL과 같은 많은 문제를 제거할 수 있다.

params에 포함되어야 하는 몇 가지 예는 다음과 같다:

1. 사용자 ID, 항목 ID 등의 ID
   - `navigation.navigate('Profile', { userId: 'Jane' })`
2. 항목 목록이 있을 때 데이터 정렬, 필터링 등을 위한 params
   - `navigation.navigate('Feeds', { sortBy: 'latest' })`
3. 페이지네이션을 위한 타임스탬프, 페이지 번호 또는 커서
   - `navigation.navigate('Chat', { beforeTime: 1603897152675 })`
4. 화면의 인풋을 채울 입력 데이터
   - `navigation.navigate('ComposeTweet', { title: 'Hello world!' })`

요약하면, 많은 경우 전체 객체를 전달하는 대신 객체의 ID를 전달하는 방식으로 화면을 식별하는 데 필요한 최소한의 데이터를 params에 전달한다. 애플리케이션 데이터를 네비게이션 상태와 분리한다.
