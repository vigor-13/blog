---
title: React Navigation 시작하기
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

React Navigation 문서의 _기본_ 섹션에서 React Navigation의 핵심 개요를 설명한다.

일반적인 소규모 모바일 애플리케이션을 구축하는데 필요한 정도의 내용을 다루며 추후에 React Navigation의 고급 기술을 학습할 수 있는 배경 지식을 제공한다.

## 사전 지식 {#pre-requisites}

JavaScript, React, React Native에 이미 익숙하다면 React Navigation을 빠르게 시작할 수 있다! 그렇지 않다면 먼저 기본 지식을 학습해야 한다.

도움이 될 만한 자료를 소개한다:

1.  [React Native Express (섹션 1부터 4까지)](https://www.reactnative.express/)
2.  [React의 주요 개념](https://react.dev/learn)
3.  [React Hooks](https://react.dev/reference/react)
4.  [React Context (고급)](https://react.dev/learn/passing-data-deeply-with-context)

## 최소 요구사항 {#minimum-requirements}

- `react-native` >= 0.63.0
- `expo` >= 41 ([Expo](https://expo.io/)를 사용하는 경우)
- `typescript` >= 4.1.0 ([TypeScript](https://www.typescriptlang.org/)를 사용하는 경우)

## 설치 {#installation}

React Native 프로젝트에 필요한 패키지를 설치한다:

```bash
npm install @react-navigation/native
```

React Navigation은 일부 핵심 유틸리티로 구성되며, 이러한 유틸리티는 네비게이터에서 사용되어 앱의 내비게이션 구조를 생성한다. 지금은 이에 대해 너무 걱정하지 않아도 된다. 곧 명확해질 것이다!

설치 작업을 먼저 처리하기 위해 종속성 설치 및 설정이 필요하다. 그런 다음 코드 작성을 시작할 수 있다.

이제 설치할 라이브러리는 [`react-native-screens`](https://github.com/software-mansion/react-native-screens) 와 [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context) 다. 이미 이러한 라이브러리가 설치되어 있고 최신 버전이라면 여기서 끝이다! 그렇지 않다면 다음을 계속 읽어야 한다.

### Expo 프로젝트의 경우 {#installing-dependencies-into-an-expo-managed-project}

프로젝트 디렉토리에서 다음 명령어를 실행한다:

```bash
npx expo install react-native-screens react-native-safe-area-context
```

이렇게 하면 호환되는 버전의 라이브러리가 설치된다.

이제 "Hello React Navigation"으로 이동하여 코드 작성을 시작할 수 있다.

### 순수 React Native 프로젝트의 경우 {#installing-dependencies-into-a-bare-react-native-project}

프로젝트 디렉터리에서 다음 명령어를 실행한다:

```bash
npm install react-native-screens react-native-safe-area-context
```

:::note
설치 후에 peer 종속성과 관련된 경고가 표시될 수 있다. 이는 일부 패키지에 지정된 버전 범위가 잘못되어 발생하는 경우가 많다. 앱이 빌드되는 한 대부분의 경고는 안전하게 무시할 수 있다.
:::

React Native 0.60 이상부터는 [링킹이 자동으로 이루어진다](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md). 따라서 `react-native link` 명령을 실행할 필요가 없다.

Mac에서 iOS용 개발을 하는 경우, 링킹을 완료하려면 [Cocoapods](https://cocoapods.org/)를 통해 pod을 설치해야 한다.

```bash
npx pod-install ios
```

`react-native-screens` 패키지가 Android 기기에서 제대로 작동하려면 추가 설정 단계가 하나 더 필요하다. `android/app/src/main/java/<your package name>/` 경로에 있는 `MainActivity.kt` 또는 `MainActivity.java` 파일을 수정해야 한다.

`MainActivity` 클래스의 본문에 아래의 코드를 추가한다:

:::tabs

@tab:active kotlin#kotlin

```kotlin
class MainActivity: ReactActivity() {
  // ...
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
  // ...
}
```

@tab java#java

```java
public class MainActivity extends ReactActivity {
  // ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
  // ...
}
```

:::

그리고 파일 상단부 패키지 문 아래에 다음 import 문을 추가해야 한다:

```java
import android.os.Bundle;
```

이 변경은 액티비티가 재시될 때 뷰 상태가 일관되게 유지되지 않아 발생하는 크래시를 방지하는 데 필요하다.

:::note
네비게이터(예: 스택 네비게이터)를 사용할 때는 해당 네비게이터에 필요한 추가 종속성에 대한 설치 지침을 따라야 한다. "Unable to resolve module" 오류가 발생하면 해당 모듈을 프로젝트에 설치해야 한다.
:::

## NavigationContainer로 앱 감싸기 {#wrapping-your-app-in-navigationContainer}

이제 `NavigationContainer` 로 전체 앱을 래핑해야 한다. 일반적으로 `index.js` 또는 `App.js` 와 같은 엔트리 파일에서 이 작업을 수행한다.

```jsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return <NavigationContainer>{/* 나머지 앱 코드 */}</NavigationContainer>;
}
```

:::warning
일반적인 React Native 앱에서 `NavigationContainer` 는 앱의 루트에서 한 번만 사용되어야 한다. 특별한 사용 사례가 없다면 여러 개의 `NavigationContainer` 를 중첩해서는 안 된다.
:::

이제 기기/시뮬레이터에서 앱을 빌드하고 실행할 준비가 되었다.
