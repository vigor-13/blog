---
title: 중첩 네비게이터
description:
date: 2024-04-05
tags: []
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/nesting-navigators',
    },
  ]
---

내비게이터 중첩은 다른 내비게이터의 화면 안에 내비게이터를 렌더링하는 것을 의미한다. 예를 들어:

```tsx
{% raw %}function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Messages" component={Messages} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}{% endraw %}
```

위의 예제에서 `Home` 컴포넌트는 탭 내비게이터를 포함하고 있다. 또한 `App` 컴포넌트 내의 스택 내비게이터에서 Home 화면으로 사용된다. 따라서 여기서는 스택 내비게이터 내부에 탭 내비게이터가 중첩되어 있다:

- `Stack.Navigator`
  - `Home` (`Tab.Navigator`)
    - `Feed` (`Screen`)
    - `Messages` (`Screen`)
  - `Profile` (`Screen`)
  - `Settings` (`Screen`)

내비게이터를 중첩하는 것은 일반 컴포넌트를 중첩하는 것과 매우 유사하다. 원하는 동작을 구현하기 위해서는 종종 여러 내비게이터를 중첩해야 한다.

## 내비게이터 중첩이 동작에 미치는 영향 {#how-nesting-navigators-affects-the-behaviour}

내비게이터를 중첩할 때 염두에 두어야 할 몇 가지 사항이 있다:

### 각 내비게이터는 자체 탐색 히스토리를 갖는다 {#each-navigators-keeps-its-own-navigation-history}

예를 들어, 중첩된 스택 내비게이터 내부의 화면에서 백 버튼을 누르면 상위에 다른 내비게이터가 있더라도 중첩된 스택 내의 이전 화면으로 이동한다.

### 각 내비게이터는 자체 옵션을 갖는다 {#each-navigator-has-its-own-options}

예를 들어, 자식 내비게이터에 중첩된 화면에서 `title` 옵션을 지정해도 상위 내비게이터에 표시되는 제목에는 영향을 주지 않는다.

이런 기능이 필요하다면 [중첩 내비게이터의 화면 옵션](https://reactnavigation.org/docs/screen-options-resolution#setting-parent-screen-options-based-on-child-navigators-state) 가이드를 참고한다. 스택 내비게이터 내부에 탭 내비게이터를 렌더링하고 탭 내비게이터의 활성 화면 제목을 스택 내비게이터 헤더에 표시하려는 경우에 유용하다.

### 각 내비게이터의 화면마다 고유한 params를 갖는다 {#each-screen-in-a-navigator-has-its-own-params}

예를 들어, 중첩된 내비게이터의 화면에 전달된 모든 params는 그 화면의 `route` prop에 있으며, 상위나 하위 내비게이터의 화면에서 접근할 수 없다.

자식 화면에서 상위 화면의 params에 접근해야 한다면 [React Context](https://reactjs.org/docs/context.html)를 사용하여 params를 자식에게 전달한다.

### 탐색 작업은 현재 내비게이터에서 처리되고 그렇지 않으면 상위로 전파된다 {#navigation-actions-are-handled-by-current-navigator-and-bubble-up-if-couldnt-be-handled}

예를 들어 중첩된 화면에서 `navigation.goBack()` 을 호출하는 경우, 이미 내비게이터의 첫 번째 화면에 있는 경우에만 상위 내비게이터에서 처리된다. `navigate` 등 다른 작업도 유사하게 동작한다. 즉, 탐색이 중첩된 내비게이터에서 이루어지고 중첩된 내비게이터가 처리하지 못하면 상위 내비게이터가 처리하려고 한다. 위의 예에서 `Feed` 화면 내부에서 `navigate('Messages')`를 호출하면 중첩된 탭 내비게이터가 처리하지만, `navigate('Settings')` 를 호출하면 상위 스택 내비게이터가 처리한다.

### 내비게이터의 특정 메서드는 중첩된 내비게이터에서도 사용 가능하다 {#navigator-specific-methods-are-available-in-the-navigators-nested-inside}

예를 들어 드로어 내비게이터 내부에 스택이 있다면, 드로어의 `openDrawer`, `closeDrawer`, `toggleDrawer` 등의 메서드도 스택 내비게이터 내부 화면의 `navigation` prop에서 사용 가능하다. 하지만 만약 스택 내비게이터가 드로어의 상위에 있다면, 스택 내비게이터 내부의 화면에서는 이러한 메서드에 접근할 수 없다. 드로어 내부에 중첩되어 있지 않기 때문이다.

마찬가지로 스택 내비게이터 내부에 탭 내비게이터가 있다면, 탭 내비게이터의 화면에서는 스택의 `push` 와 `replace` 메서드를 `navigation` prop에서 사용할 수 있다.

상위에서 중첩된 하위 내비게이터로 작업을 디스패치해야 한다면 `navigation.dispatch` 를 사용한다:

```tsx
navigation.dispatch(DrawerActions.toggleDrawer());
```

### 중첩된 내비게이터는 상위의 이벤트를 받지 않는다 {#nested-navigators-dont-receive-parents-events}

예를 들어 탭 내비게이터 내부에 스택 내비게이터가 중첩되어 있다면, 스택 내비게이터 내부의 화면은 `navigation.addListener` 를 사용할 때 상위 탭 내비게이터에서 발생하는 이벤트(예: `tabPress`)를 받지 않는다.

상위 내비게이터의 이벤트를 받으려면 `navigation.getParent` 를 사용하여 명시적으로 상위 이벤트에 리스너를 추가해야 한다:

```tsx
const unsubscribe = navigation
  .getParent('MyTabs')
  .addListener('tabPress', (e) => {
    // 작업 수행
  });
```

여기서 `MyTabs` 는 리스너를 추가할 상위 `Tab.Navigator`의 `id` prop에 전달한 값이다.

### 상위 내비게이터의 UI는 하위 내비게이터 위에 렌더링된다 {#parent-navigators-ui-is-rendered-on-top-of-child-navigator}

예를 들어 스택 내비게이터를 드로어 내비게이터 내부에 중첩하면, 드로어가 스택 내비게이터 헤더 위에 나타나는 것을 볼 수 있다. 하지만 드로어 내비게이터를 스택 내부에 중첩하면 드로어가 스택 헤더 아래에 나타난다. 내비게이터를 중첩할 때 이 점을 고려하는 것이 중요하다.

앱에서는 원하는 동작에 따라 다음과 같은 패턴이 가능하다:

- 스택 내비게이터의 초기 화면 내부에 탭 내비게이터 중첩 - 새 화면을 푸시하면 탭 바를 가린다.
- 스택 내비게이터의 초기 화면 내부에 드로어 내비게이터 중첩하고 초기 화면의 스택 헤더 숨김 - 드로어는 스택의 첫 화면에서만 열 수 있다.
- 드로어 내비게이터의 각 화면 내부에 스택 내비게이터 중첩 - 드로어가 스택 헤더 위에 나타난다.
- 탭 내비게이터의 각 화면 내부에 스택 내비게이터 중첩 - 탭 바가 항상 표시된다. 일반적으로 탭을 다시 누르면 스택이 맨 위로 이동한다.

## 중첩된 내비게이터의 화면 탐색하기 {#navigating-to-a-screen-in-a-nested-navigator}

다음 예제를 살펴보자:

```tsx
{% raw %}
function Root() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Feed" component={Feed} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
{% endraw %}
```

여기서 `Feed` 컴포넌트에서 `Root` 화면으로 이동하고 싶을 수 있다:

```tsx
navigation.navigate('Root');
```

위의 코드를 사용하면 `Root` 컴포넌트 내부의 초기 화면인 `Home` 으로 이동한다. 하지만 때로는 탐색 시 표시될 화면을 제어하고 싶을 수 있다. 이를 위해 params에 화면 이름을 전달할 수 있다:

```tsx
navigation.navigate('Root', { screen: 'Profile' });
```

이제 탐색 시 `Home` 대신 `Profile` 화면이 렌더링된다.

이전 React Navigation 버전에서는 모든 내비게이터와 화면의 구성이 정적(static)이었다. 즉, 앱이 실행되기 전에 모든 내비게이터와 화면이 미리 정의되어 있었다. React Navigation은 이렇게 미리 정의된 정적 구성을 재귀적으로 탐색하여 전체 화면 계층 구조를 파악할 수 있었다.

하지만 최신 버전의 React Navigation에서는 동적(dynamic) 구성이 가능해졌다. 이제 내비게이터와 화면을 동적으로 렌더링할 수 있게 되었다. 이로인해 React Navigation은 앱이 실행되기 전에 전체 화면 계층 구조를 알 수 없다.

왜냐하면 일반적으로 화면의 내용은 그 화면으로 이동할 때까지 렌더링되지 않기 때문이다. 다시 말해, 특정 화면에 속한 내비게이터와 하위 화면들의 구성은 그 화면에 실제로 탐색할 때까지 알 수 없다.

따라서 중첩된 화면으로 탐색할 때는 단순히 화면 이름만 지정하는 것이 아니라, 탐색할 전체 계층 구조를 명시해야 한다. 예를 들어 `navigation.navigate('Root', { screen: 'Profile' })`과 같이 하위 화면으로 이동하려면 상위 화면 이름과 하위 화면 이름을 모두 지정해야 한다.

이런 동적 구성 방식 때문에 내비게이터의 중첩을 최소화하는 것이 코드를 간단하게 유지하는 데 도움이 된다. 중첩이 깊어질수록 탐색 시 전체 계층 구조를 명시해야 하므로 복잡해진다.

### 중첩된 내비게이터의 화면으로 params 전달하기 {#passing-params-to-a-screen-in-a-nested-navigator}

`params` 키를 지정하여 params를 전달할 수 있다:

```tsx
navigation.navigate('Root', {
  screen: 'Profile',
  params: { user: 'jane' },
});
```

내비게이터가 이미 렌더링된 상태라면, 다른 화면으로 이동할 때 스택 내비게이터의 경우 새 화면이 푸시된다.

이와 유사한 메커니즘으로 깊게 중첩된 화면에 접근할 수 있다. `navigate` 에 전달되는 두 번째 인자 `params` 는 다음과 같이 사용할 수 있다.

```tsx
navigation.navigate('Root', {
  screen: 'Settings',
  params: {
    screen: 'Sound',
    params: {
      screen: 'Media',
    },
  },
});
```

위 예제에서는 `Media` 화면으로 이동하는데, 이 화면은 `Sound` 화면 내부의 내비게이터 안에 있고, `Sound` 화면은 `Settings` 화면 내부의 내비게이터 안에 있다.

### 내비게이터에 정의된 초기 라우트 렌더링하기 {#rendering-initial-route-defined-in-the-navigator}

기본적으로 중첩된 내비게이터의 화면으로 이동할 때 지정한 화면이 초기 화면으로 사용되고, 내비게이터의 초기 `route` prop은 무시된다. 이 동작은 React Navigation 4와 다르다.

만약 내비게이터에 지정된 초기 라우트를 반드시 렌더링해야 한다면 `initial: false` 를 사용하여 지정된 화면을 초기 화면으로 사용하는 동작을 비활성화할 수 있다.

```tsx
navigation.navigate('Root', {
  screen: 'Settings',
  initial: false,
});
```

다만 이것은 백 버튼을 눌렀을 때 동작에 영향을 미친다. 초기 화면이 있다면 백 버튼을 누르면 해당 화면으로 이동한다.

## 여러 내비게이터 중첩하기 {#nesting-multiple-navigators}

때로는 스택, 드로어, 탭 등 여러 내비게이터를 중첩하는 것이 유용할 수 있다.

스택, 드로어 또는 바텀 탭 내비게이터를 여러 개 중첩하면 자식과 부모 내비게이터 모두의 헤더가 표시된다. 하지만 대개는 자식 내비게이터의 헤더를 표시하고 부모 내비게이터 화면의 헤더는 숨기는 것이 더 바람직하다.

이를 위해 `headerShown: false` 옵션을 사용하여 내비게이터를 포함하는 화면의 헤더를 숨길 수 있다.

예를 들어:

```tsx
{% raw %}
function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="EditPost" component={EditPost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
{% endraw %}
```

이 예제에서는 바텀 탭 내비게이터를 스택 내비게이터 바로 안에 중첩했지만, 중간에 다른 내비게이터가 있어도 동일한 원리가 적용된다. 예를 들어 스택 내비게이터가 탭 내비게이터 안에 있고 그 탭 내비게이터가 또 다른 스택 내비게이터 안에 있거나, 드로어 내비게이터 안에 스택 내비게이터가 있는 경우 등이다.

모든 내비게이터에서 헤더를 숨기고 싶다면 `{% raw %}screenOptions={{ headerShown: false }}{% endraw %}` 를 모든 내비게이터에 지정하면 된다:

```tsx
{% raw %}
function Home() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="EditPost" component={EditPost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
{% endraw %}
```

## 내비게이터 중첩 모범 사례 {#best-practices-when-nesting}

가능한 한 내비게이터 중첩을 최소화하는 것이 좋다. 원하는 동작을 얻기 위해 최소한의 중첩만 사용해야 한다.

중첩에는 다음과 같은 단점이 있다:

- 뷰 계층이 깊어져 저사양 기기에서 메모리 및 성능 문제가 발생할 수 있다.
- 동일한 유형의 내비게이터를 중첩하면(예: 탭 안의 탭, 드로어 안의 드로어 등) UX가 혼란스러워질 수 있다.
- 과도한 중첩으로 인해 중첩된 화면으로 이동하거나 딥 링크를 구성할 때 코드를 이해하기 어려워진다.

내비게이터 중첩은 코드를 구성하는 방식이 아니라 원하는 UI를 얻기 위한 수단으로 생각해야 한다. 화면 그룹을 구성하기 위해 별도의 내비게이터를 사용하는 대신, `Group` 컴포넌트를 사용할 수 있다.

```tsx
{% raw %}<Stack.Navigator>
  {isLoggedIn ? (
    // 로그인한 사용자를 위한 화면
    <Stack.Group>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Group>
  ) : (
    // 인증 화면
    <Stack.Group screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Group>
  )}
  {/* 공통 모달 화면 */}
  <Stack.Group screenOptions={{ presentation: 'modal' }}>
    <Stack.Screen name="Help" component={Help} />
    <Stack.Screen name="Invite" component={Invite} />
  </Stack.Group>
</Stack.Navigator>{% endraw %}
```
