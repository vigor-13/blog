---
title: 플랫폼별 코드
description:
date: 2024-04-10
tags: []
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/platform-specific-code',
    },
  ]
---

크로스 플랫폼 앱을 개발할 때는 코드 재사용성을 극대화하는 것이 중요하다. 하지만 때로는 플랫폼별로 코드를 다르게 구현해야 할 상황이 생길 수 있다. 대표적인 예로 Android와 iOS에서 서로 다른 UI 컴포넌트를 사용하고 싶은 경우다.

React Native는 플랫폼별로 코드를 구성하고 분리할 수 있는 두 가지 방법을 제공한다:

- Platform 모듈 사용하기
- 플랫폼별 파일 확장자 사용하기

일부 컴포넌트는 특정 플랫폼에서만 지원되는 props을 가지고 있다. React Native 공식 문서에서는 이런 속성들을 쉽게 구분할 수 있도록 `@platform` 이라는 주석과 함께 작은 배지를 표시해두었다. 따라서 개발자는 문서를 통해 해당 속성이 어떤 플랫폼에서 동작하는지 한눈에 파악할 수 있다.

## Platform 모듈 {#platform-module}

React Native는 현재 실행 중인 플랫폼을 감지할 수 있는 모듈을 제공한다. 감지 로직을 사용하여 플랫폼별 코드를 구현할 수 있다. 컴포넌트의 일부분만 플랫폼별로 다를 때 이 옵션을 사용한다.

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});
```

`Platform.OS` 는 iOS에서 실행할 때는 `ios`, Android에서 실행할 때는 `android`가 된다.

`Platform.select` 메서드를 사용하면 현재 실행 중인 플랫폼에 따라 동적으로 값을 선택할 수 있다. 이 메서드는 `ios`, `android`, `native`, `default` 중 하나를 키로 가지는 객체를 인자로 받는다.

메서드 내부적으로는 현재 플랫폼을 감지하여, 해당 플랫폼에 맞는 키의 값을 반환한다. 만약 앱이 iOS나 Android 같은 모바일 기기에서 실행 중이라면 `ios` 와 `android` 키에 해당하는 값이 우선적으로 사용되고, 그 외의 경우에는 `native` 나 `default` 키 값이 사용된다.

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'red',
      },
      android: {
        backgroundColor: 'green',
      },
      default: {
        // 웹 같은 다른 플랫폼
        backgroundColor: 'blue',
      },
    }),
  },
});
```

위 예시 코드는 `Platform.select` 를 활용하여 플랫폼에 따라 다른 스타일을 적용하는 방법을 보여준다. 모든 플랫폼에서는 `flex: 1` 이라는 공통 스타일을 가지지만, iOS에서는 배경색이 빨간색, Android에서는 녹색, 그 외의 플랫폼에서는 파란색으로 지정된다.

`Platform.select` 는 단순히 스타일뿐만 아니라 어떤 값이든 플랫폼별로 다르게 반환할 수 있다. 예를 들어, 아래와 같이 플랫폼에 따라 서로 다른 컴포넌트를 반환하는 것도 가능하다.

```tsx
const Component = Platform.select({
  ios: () => require('ComponentIOS'),
  android: () => require('ComponentAndroid'),
})();

<Component />;
```

```tsx
const Component = Platform.select({
  native: () => require('ComponentForNative'),
  default: () => require('ComponentForWeb'),
})();

<Component />;
```

## Android 버전 감지 {#detecting-the-android-version}

Android에서는 `Platform` 모듈을 사용하여 현재 실행 중인 Android 플랫폼의 버전을 감지할 수도 있다:

```tsx
import { Platform } from 'react-native';

if (Platform.Version === 25) {
  console.log('Nougat에서 실행 중!');
}
```

:::note
`Version` 은 Android OS 버전이 아니라 Android API 버전으로 설정된다. 매핑을 찾으려면 [Android 버전 히스토리](https://en.wikipedia.org/wiki/Android_version_history#Overview)를 참조한다.
:::

## iOS 버전 감지 {#detecting-the-ios-version}

iOS에서는 `Platform.Version` 을 통해 현재 기기의 운영 체제 버전을 문자열 형태로 가져올 수 있다. 이 값은 내부적으로 `UIDevice` 의 `systemVersion` 속성을 사용하여 가져온다.

예를 들어 `Platform.Version` 값이 "10.3"이라면, iOS 10.3 버전에서 앱이 실행되고 있다는 것을 의미한다. 이 정보를 활용하여 특정 iOS 버전에서의 동작을 제어할 수 있다.

만약 iOS 10 이하에서는 다르게 처리해야 하는 로직이 있다면, 아래와 같이 `Platform.Version` 에서 주 버전(major version) 번호를 추출하여 비교할 수 있다.

```tsx
import { Platform } from 'react-native';

const majorVersionIOS = parseInt(Platform.Version, 10);

if (majorVersionIOS <= 9) {
  console.log('Work around a change in behavior');
}
```

## 플랫폼별 확장자 {#platform-specific-extensions}

플랫폼별 코드가 복잡할 때는 코드를 별도 파일로 분리하는 것을 고려해야 한다. React Native는 파일의 `.ios.` 또는 `.android.` 확장자를 감지하고 다른 컴포넌트에서 필요할 때 관련 플랫폼 파일을 로드한다.

예를 들어 프로젝트에 다음 파일들이 있다고 가정해 보자:

```text
BigButton.ios.js
BigButton.android.js
```

그러면 다음과 같이 컴포넌트를 가져올 수 있다:

```tsx
import BigButton from './BigButton';
```

React Native는 실행 중인 플랫폼에 따라 자동으로 올바른 파일을 선택한다.

## Native 전용 확장자(즉, NodeJS 및 웹과 코드 공유) {#native-specific-extensions}

모듈이 NodeJS/Web과 React Native 간에 공유되어야 하지만 Android/iOS 간에는 차이가 없는 경우 `.native.js` 확장자를 사용할 수 있다. 이는 React Native와 ReactJS 간에 공통 코드를 공유하는 프로젝트에 특히 유용하다.

예를 들어 프로젝트에 다음과 같은 파일이 있다고 가정해 보자:

```bash
Container.js # webpack, Rollup 또는 기타 웹 번들러에서 선택
Container.native.js # Android와 iOS 모두에 대해 React Native 번들러(Metro)에서 선택
```

물론 다음과 같이 `.native` 확장자 없이 import할 수 있다:

```tsx
import Container from './Container';
```

:::tip
프로덕션 번들에서 사용되지 않는 코드를 제거하여 최종 번들 크기를 줄이기 위해 웹 번들러가 `.native.js` 확장자를 무시하도록 설정하는 것이 좋다.
:::
