---
title: 인증 플로우
description:
date: 2024-04-05
tags: []
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/auth-flow',
    },
  ]
---

대부분의 앱은 사용자 인증을 통해 사용자 관련 데이터나 기타 프라이빗 컨텐츠에 액세스할 수 있다. 일반적인 흐름은 다음과 같다:

1. 사용자가 앱을 실행한다.
2. 앱은 암호화된 영구 저장소(예: [`SecureStore`](https://docs.expo.io/versions/latest/sdk/securestore/))에서 인증 상태를 로드한다.
3. 상태가 로드되면 유효한 인증 상태가 로드되었는지 여부에 따라 사용자에게 인증 화면 또는 메인 앱이 표시된다.
4. 사용자가 로그아웃하면 인증 상태를 지우고 사용자를 인증 화면으로 되돌린다.

:::note
보통 "인증"과 관련된 화면은 여러 개다. 사용자 이름과 비밀번호 필드가 있는 메인 화면, "비밀번호 찾기" 화면, 가입 화면 등이 있다.
:::

## 필요한 사항 {#what-we-need}

사용자가 로그인하면 인증 관련 화면들의 상태를 완전히 제거하고 싶을 것이다. 이렇게 하면 사용자가 백버튼을 눌러도 인증 화면으로 되돌아갈 수 없다.

구체적으로는 다음과 같은 동작을 원한다:

1. 사용자가 로그인 화면에서 로그인에 성공하면, 인증 관련 모든 화면(로그인, 회원가입, 비밀번호 재설정 등)의 상태를 메모리에서 제거한다.
2. 이때 React Navigation은 인증 관련 화면들을 언마운트하고, 메인 앱의 홈 화면 등 로그인 후 화면으로 즉시 전환된다.
3. 이제 백버튼을 눌러도 이전에 있던 인증 화면으로 돌아가지 않고, 앱에서 완전히 나가거나 메인 화면 내에서만 이동한다.
4. 로그아웃 시에는 반대로 메인 앱 화면들의 상태를 제거하고 인증 화면들로 되돌아간다.

이렇게 함으로써 인증 전/후 화면의 상태가 완전히 분리되어, 사용자 경험에 혼란이 가지 않게 된다. 백버튼을 눌러 예기치 않게 로그인 화면으로 돌아가는 일이 없어진다.

<!-- React Navigation에서는 이를 구현하기 위해 navigationKey라는 prop을 사용하여 특정 화면 그룹을 완전히 제거할 수 있습니다. 또한 조건부 렌더링을 활용해 인증 여부에 따라 다른 화면 셋을 렌더링합니다. -->

## 작동 방식 {#how-it-will-work}

특정 조건에 따라 다른 화면을 정의할 수 있다. 예를 들어 사용자가 로그인했다면 `Home`, `Profile`, `Settings` 등을 정의할 수 있고, 로그인하지 않았다면 `SignIn` 과 `SignUp` 화면을 정의할 수 있다.

예시:

```tsx
isSignedIn ? (
  <>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </>
) : (
  <>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </>
);
```

이렇게 화면을 정의하면, `isSignedIn` 이 true일 때 React Navigation은 `Home`, `Profile`, `Settings` 화면만 볼 수 있고, false일 때는 `SignIn` 과 `SignUp` 화면만 볼 수 있다. 이렇게 하면 사용자가 로그인하지 않은 상태에서 `Home`, `Profile`, `Settings` 화면으로 이동할 수 없고, 로그인한 상태에서 `SignIn` 과 `SignUp` 화면으로 이동할 수 없다.

이 패턴은 React Router와 같은 다른 라우팅 라이브러리에서 오랫동안 사용되어 왔으며, 일반적으로 "보호된 라우트(Protected routes)"라고 불린다. 여기서 사용자가 로그인해야 하는 화면은 "보호되어" 있어 사용자가 로그인하지 않은 상태에서는 다른 방식으로 접근할 수 없다.

마법은 `isSignedIn` 변수 값이 변경될 때 일어난다. 예를 들어 초기에 `isSignedIn` 이 false라고 가정해 보자. 이 경우 `SignIn` 또는 `SignUp` 화면이 표시된다. 사용자가 로그인하면 `isSignedIn` 값이 true로 변경된다. 그러면 React Navigation은 `SignIn` 과 `SignUp` 화면이 더 이상 정의되지 않았음을 알고 이들을 제거한다. 그리고 `isSignedIn` 이 true일 때 정의된 첫 번째 화면인 `Home` 화면을 자동으로 표시한다.

예제는 스택 내비게이터를 사용하고 있지만 동일한 접근 방식을 다른 내비게이터에서도 사용할 수 있다.

변수에 따라 다른 화면을 조건부로 정의함으로써 추가 로직 없이 인증 흐름을 단순하게 구현할 수 있다.

## 화면을 조건부로 렌더링할 때는 수동으로 탐색하지 않아야 한다 {#dont-manually-navigate-when-conditionally-rendering-screens}

이런한 설정을 사용할 때 `navigation.navigate('Home')` 또는 다른 메서드를 호출하여 `Home` 화면으로 수동으로 이동하지 않는다는 점에 유의한다. `isSignedIn` 이 변경되면 React Navigation이 자동으로 올바른 화면으로 이동한다. `isSignedIn` 이 true가 되면 `Home` 화면으로, false가 되면 `SignIn` 화면으로 이동한다. 수동으로 이동하려고 하면 오류가 발생한다.

## 화면 정의하기 {#define-our-screens}

내비게이터에서 적절한 화면을 조건부로 정의할 수 있다. 여기서는 다음 3개의 화면이 있다고 가정해 보자:

- `SplashScreen` - 토큰을 복원할 때 이 화면에 스플래시나 로딩 화면이 표시된다.
- `SignInScreen` - 사용자가 아직 로그인하지 않은 경우(토큰을 찾을 수 없음) 이 화면을 표시한다.
- `HomeScreen` - 사용자가 이미 로그인한 경우 이 화면을 표시한다.

따라서 내비게이터는 다음과 같다:

```jsx
{% raw %}if (state.isLoading) {
  // 토큰 확인이 아직 끝나지 않았다
  return <SplashScreen />;
}

return (
  <Stack.Navigator>
    {state.userToken == null ? (
      // 토큰을 찾을 수 없어 사용자가 로그인하지 않은 상태
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: 'Sign in',
          // 로그아웃 시 팝 애니메이션이 더 자연스러워 보인다
          // 기본 '푸시' 애니메이션을 원한다면 이 옵션을 제거한다
          animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
    ) : (
      // 사용자가 로그인한 상태
      <Stack.Screen name="Home" component={HomeScreen} />
    )}
  </Stack.Navigator>
);{% endraw %}
```

위 코드에서 `isLoading` 은 토큰 유무를 아직 확인 중임을 의미한다. 이는 일반적으로 `SecureStore` 에 토큰이 있는지 확인하고 토큰을 검증하는 과정을 거친다. 토큰을 받은 후 토큰이 유효한 경우 `userToken` 을 설정해야 한다. 또한 로그아웃 시 애니메이션을 다르게 표현하기 위해 `isSignout` 상태도 사용한다.

주목해야 할 주요 사항은 이러한 상태 변수를 기반으로 화면을 조건부로 정의한다는 점이다:

- `userToken` 이 `null` 이면(사용자가 로그인하지 않음) `SignIn` 화면만 정의된다.
- `userToken` 이 null이 아니라면(사용자가 로그인함) `Home` 화면만 정의된다.

여기서는 각 경우마다 하나의 화면만 정의했지만, 여러 화면을 정의할 수도 있다. 예를 들어 사용자가 로그인하지 않은 경우 비밀번호 재설정, 가입 등의 화면을 정의하고 싶을 것이다. 마찬가지로 로그인 후 접근 가능한 화면도 하나 이상일 것이다. `React.Fragment` 를 사용하여 여러 화면을 정의할 수 있다:

```tsx
state.userToken == null ? (
  <>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
  </>
) : (
  <>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </>
);
```

:::tip
로그인 관련 화면과 기타 화면을 두 개의 별도 스택 내비게이터에 두었다면, 제대로 된 로그인/로그아웃 전환 애니메이션을 사용하기 위해서는 단일 스택 내비게이터를 사용하고 그 안에 조건문을 배치하는 것이 좋다.
:::

## 토큰 복원 로직 구현 {#implement-the-logic-for-restoring-the-token}

:::note
다음은 앱에서 인증 로직을 구현할 수 있는 방법의 예시일 뿐이다. 꼭 이렇게 따를 필요는 없다.
:::

앞선 예제 코드에서 3가지 상태 변수가 필요함을 알 수 있었다:

- `isLoading` - `SecureStore` 에서 토큰을 확인 중일 때 true로 설정한다.
- `isSignout` - 사용자가 로그아웃할 때 true로 설정하고, 그렇지 않으면 false로 설정한다.
- `userToken` - 사용자의 토큰이다. null이 아니면 사용자가 로그인한 것으로 간주하고, null이면 로그인하지 않은 것으로 간주한다.

따라서 다음을 구현 해야 한다:

- 토큰 복원, 로그인, 로그아웃을 위한 일부 로직 추가
- 다른 컴포넌트에서 로그인과 로그아웃을 위한 메서드 노출

이 가이드에서는 `React.useReducer` 와 `React.useContext` 를 사용한다. 하지만 Redux나 Mobx 같은 상태 관리 라이브러리를 사용한다면 이 기능에 대해서도 라이브러리를 사용할 수 있다. 실제로 큰 앱에서는 인증 토큰을 저장하기 위해 전역 상태 관리 라이브러리가 더 적합하다. 동일한 접근 방식을 상태 관리 라이브러리에 적용할 수 있다.

먼저 필요한 메서드를 노출할 수 있는 인증 컨텍스트를 만들어야 한다:

```tsx
import * as React from 'react';

const AuthContext = React.createContext();
```

우리의 컴포넌트는 다음과 같다:

```tsx
import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // 저장소에서 토큰을 가져온 후 적절한 곳으로 이동
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // 토큰 복원에 실패
      }

      // 토큰 복원 후 프로덕션 앱에서는 추가적으로 토큰 검증이 필요하다

      // 이로 인해 앱 화면 또는 인증 화면으로 전환되고
      // 이 로딩 화면은 마운트 해제되어 제거된다.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // 프로덕션 앱에서는 일부 데이터(일반적으로 사용자 이름, 비밀번호)를 서버로 보내서 토큰을 받아야 한다
        // 로그인에 실패한 경우 에러 처리도 필요하다
        // 토큰을 받은 후에는 `SecureStore`에 토큰을 영구 저장해야 한다
        // 이 예제에서는 더미 토큰을 사용한다

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // 프로덕션 앱에서는 유저 데이터를 서버로 보내서 토큰을 받아야 한다
        // 회원가입에 실패한 경우 에러 처리도 필요하다
        // 토큰을 받은 후에는, `SecureStore`에 토큰을 영구 저장해야 한다.
        // 이 예제에서는 더미 토큰을 사용한다.

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>
        {state.userToken == null ? (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
```

## 다른 컴포넌트 작성 {#fill-in-other-components}

인증 화면에 대한 텍스트 입력과 버튼 구현 방법은 내비게이션 범위를 벗어나므로 다루지 않겠다. 여기선 플레이스홀더 컨텐츠만 채워 넣는다.

```tsx
function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
    </View>
  );
}
```

## 인증 상태 변경 시 공유 화면 제거 {#removing-shared-screens-when-auth-state-changes}

다음 예제를 살펴보자:

```tsx
isSignedIn ? (
  <>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
  </>
) : (
  <>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
  </>
);
```

여기서 `SignIn`, `Home` 등의 특정 화면은 로그인 상태에 따라서만 표시된다. 하지만 `Help` 화면은 두 경우 모두에서 표시될 수 있다. 이는 사용자가 `Help` 화면에 있을 때 로그인 상태가 변경되면 `Help` 화면에 그대로 남아있게 된다는 것을 의미한다.

이는 문제가 될 수 있다. 아마도 사용자를 `Help` 화면에 그대로 두는 대신 `SignIn` 화면 또는 `Home` 화면으로 이동시키고 싶을 것이다. 이를 구현하기 위해 `navigationKey` prop을 사용할 수 있다. `navigationKey`가 변경되면 React Navigation은 모든 화면을 제거한다.

코드를 다음과 같이 수정할 수 있다:

```tsx
<>
  {isSignedIn ? (
    <>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </>
  ) : (
    <>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </>
  )}
  <Stack.Screen
    navigationKey={isSignedIn ? 'user' : 'guest'}
    name="Help"
    component={HelpScreen}
  />
</>
```

공유 화면이 여러 개라면 `Group` 과 함께 `navigationKey` 를 사용하여 그룹 내 모든 화면을 제거할 수 있다.

예를 들어:

```tsx
<>
  {isSignedIn ? (
    <>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </>
  ) : (
    <>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </>
  )}
  <Stack.Group navigationKey={isSignedIn ? 'user' : 'guest'}>
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
  </Stack.Group>
</>
```
