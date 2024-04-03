---
title: 새 아키텍처
description: React Native의 "새로운 아키텍처"와 마이그레이션 방법 및 이유에 대해 알아본다.
date: 2024-04-03
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/guides/new-architecture/',
    },
  ]
---

새 아키텍처(New Architecture)는 React Native의 내부를 완전히 리팩토링하는 것을 설명하기 위해 사용하는 이름이다. 또한 기존의 사용자들이 프로덕션 환경에서 오랜 기간 사용하면서 발견된 기존 React Native 아키텍처의 한계를 해결하는 데 사용된다.

이 가이드에서는 오늘날 Expo 프로젝트에서 새 아키텍처를 사용하는 방법에 대해 알아본다.

새 아키텍처 이면의 아이디어와 동기에 대해 자세히 알아보려면 다음 리소스를 추천한다:

- [새 아키텍처 소개](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [왜 새 아키텍처 인가](https://reactnative.dev/docs/the-new-architecture/why)

## 왜 새 아키텍처로 마이그레이션하는 데 투자해야 할까? {#why-invest-in-migrating-to-the-new-architecture}

새 아키텍처는 React Native의 미래다. 그러나 많은 앱의 경우, 당장의 마이그레이션으로 얻을 수 있는 이점은 많지 않을 수 있다. 새 아카텍처로 마이그레이션하는 것은 앱을 즉시 개선하는 방법이 아니라 앱의 미래에 대한 투자로 생각해야 한다.

새 아키텍처와 함께 제공되는 변경 사항은 기존 구현의 기술 부채를 해결하고 React Native의 오랜 문제를 해결할 가능성을 열어준다. 예를 들어 동기식 네이티브 API(예: `UITableView`)와의 상호 운용성, [concurrent React support](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)를 위한 길을 열어준다.

:::important 새 아키텍처가 해결하는 기존 React Native의 기술 부채

1. 동기식 네이티브 API와의 상호 운용성

   - 기존 React Native 아키텍처에서는 네이티브 모듈과 JavaScript 간의 통신이 비동기적으로 이루어진다. 즉, JavaScript에서 네이티브 모듈의 메서드를 호출하면 결과를 즉시 받을 수 없고 콜백이나 프로미스를 통해 나중에 받게 된다.
   - 이런 제한 때문에 `UITableView` 와 같이 동기식 API를 사용하는 네이티브 컴포넌트와의 상호 작용이 어렵거나 불가능했다.
   - 새 아키텍처에서는 JavaScript와 네이티브 코드 간의 직접적인 상호 작용을 가능하게 하는 새로운 메커니즘을 도입한다. 이를 통해 동기식 API를 사용하는 네이티브 컴포넌트와의 원활한 통합이 가능해진다.

2. 성능 향상

   - 기존 아키텍처에서는 JavaScript와 네이티브 모듈 간의 통신이 브리지를 통해 이루어지므로 성능 오버헤드가 발생한다.
   - 새 아키텍처에서는 JavaScript와 네이티브 코드가 직접 상호 작용하여 브리지 오버헤드를 제거한다. 이는 더 빠른 실행과 향상된 성능으로 이어진다.
   - 또한 새 아키텍처는 네이티브 코드의 병렬 실행을 가능하게 하여 성능을 더욱 향상시킨다.

3. 유지보수성과 확장성

   - 기존 아키텍처는 시간이 지남에 따라 복잡해지고 유지보수하기 어려웠다. 네이티브 모듈과 JavaScript 간의 통신을 위한 브리지 코드는 이해하고 디버깅하기 어렵다.
   - 새 아키텍처는 모듈화되고 확장 가능한 방식으로 설계되어 코드베이스를 더 깔끔하고 유지보수하기 쉽게 만든다.
   - 새로운 아키텍처는 또한 서드파티 라이브러리 개발자가 더 쉽게 고품질의 네이티브 모듈을 작성할 수 있도록 하여 React Native 생태계를 개선한다.

4. 동시 모드 React 지원
   - React의 동시 모드는 사용자 경험을 향상시킬 수 있는 새로운 기능을 제공한다. 예를 들어 우선순위가 낮은 작업을 중단하고 우선순위가 높은 작업을 처리할 수 있다.
   - 그러나 기존 React Native 아키텍처는 동시 모드와 완전히 호환되지 않아 이러한 이점을 완전히 활용할 수 없었다.
   - 새 아키텍처는 React의 동시 모드를 완벽하게 지원하도록 설계되어 앱의 응답성과 성능을 한 단계 더 향상시킬 수 있다.

:::

## Expo 도구와 새 아키텍처 {#expo-tools-and-the-new-architecture}

SDK 49를 기준으로 [Expo SDK](https://docs.expo.dev/versions/latest/)의 거의 모든 `expo-*` 패키지가 새 아키텍처를 지원한다.

또한 [Expo Modules API](https://docs.expo.dev/modules/overview/)를 사용하여 작성된 모든 모듈은 기본적으로 새 아키텍처를 지원한다! 따라서 이 API를 사용하여 자체 네이티브 모듈을 구축한 경우 새 아키텍처와 함께 사용하기 위해 추가 작업이 필요하지 않다.

### 알려진 비호환성 {#known-incompatibilities}

- `expo-updates` 는 아직 새 아키텍처를 지원하지 않는다. SDK 51에서 준비될 것으로 예상된다.
- `expo-font` 의 `Font.loadAsync()` 는 아직 호환되지 않는다. SDK 51까지 준비될 것으로 예상된다. 대신 [`expo-font` 설정 플러그인](https://docs.expo.dev/develop/user-interface/fonts/#embed-the-font-in-your-native-project)을 사용하여 폰트를 앱에 정적으로 포함시킨다.
- 브리지리스(Bridgeless) 모드는 아직 지원되지 않는다. SDK 51에서 작업될 예정이지만 준비되지 않을 수 있다.

## 새 아키텍처로 프로젝트 초기화 {#initialize-a-new-project-with-the-new-architecture}

새 아키텍처를 시작하는 가장 쉬운 방법은 새 프로젝트를 만들 때 `with-new-arch` 템플릿을 사용하는 것이다:

```bash
npx create-expo-app@latest -e with-new-arch
```

## 기존 프로젝트에서 새 아키텍처 활성화 {#enable-the-new-architecture-in-an-existing-project}

[`expo-build-properties`](https://docs.expo.dev/versions/latest/sdk/build-properties/) 설정 플러그인을 사용하여 앱에서 새 아키텍처를 활성화할 수 있다:

1. `expo-build-properties` 를 설치한다:

```bash
npx expo install expo-build-properties
```

2. 대상 플랫폼에서 `newArchEnabled` 를 설정한다:

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "newArchEnabled": true
          },
          "android": {
            "newArchEnabled": true
          }
        }
      ]
    ]
  }
}
```

3. `prebuild` 명령을 실행하고 프로젝트를 컴파일한다:

```bash
# Android
npx expo prebuild --clean
npx expo run:android
eas build -p android

# iOS
npx expo prebuild --clean
npx expo run:ios
eas build -p ios
```

빌드가 성공하면 이제 새 아키텍처로 앱을 실행하게 된다!

이제 앱을 테스트해 볼 수 있다. 대부분의 복잡한 앱의 경우 새 아키텍처로 인해 아직 구현되지 않은 네이티브 뷰가 누락되는 등의 몇 가지 문제가 발생할 수 있다. 발생하는 많은 문제는 일부 설정 또는 코드 변경으로 해결할 수 있다.

:::note 새 아키텍처를 일반 React Native 앱에서 활성화 가능한가?
프로젝트에서 새 아키텍처를 활성화하는 방법에 대한 지침은 [React Native 문서의 "Prerequisites for Applications"](https://reactnative.dev/docs/new-architecture-app-intro) 섹션을 참조한다.
:::

## 상호 운용 계층 사용 {#using-the-interop-layer}

아직 모든 라이브러리가 새 아키텍처를 지원하도록 마이그레이션된 것은 아니다. 앱에서 이러한 라이브러리를 사용하려면 ["New Renderer Interop Layer" 워킹 그룹 게시물](https://github.com/reactwg/react-native-new-architecture/discussions/135)에 설명된 대로 상호 운용 계층을 사용할 수 있다.

상호 운용 계층을 사용하려면 `react-native.config.js` 에 다음을 추가해야 한다:

```js
// react-native.config.js
module.exports = {
  project: {
    android: {
      unstable_reactLegacyComponentNames: ['NativeComponentName'],
    },
    ios: {
      unstable_reactLegacyComponentNames: ['NativeComponentName'],
    },
  },
};
```

`"NativeComponentName"`을 사용하려는 네이티브 컴포넌트의 이름으로 바꾼다. 예를 들어 [`@react-native-segmented-control/segmented-control`](https://github.com/react-native-segmented-control/segmented-control) 의 뷰 컴포넌트는 `RNCSegmentedControl` 이므로 `unstable_reactLegacyComponentNames` 목록에 `"RNCSegmentedControl"` 을 추가해야 한다.

라이브러리 소스 코드를 살펴보고 이름을 확인해야 할 수 있다. 라이브러리에서 `requireNativeComponent` 를 찾아보면 이름을 찾는 데 도움이 될 수 있다([예시](https://github.com/react-native-segmented-control/segmented-control/blob/ca72237642499d9b06edd0d2adefb6bba7eaaea3/js/RNCSegmentedControlNativeComponent.js#L17-L19)).

상호 운용 계층은 완벽하지 않으며 모든 라이브러리에서 작동하지 않을 수 있다. 문제가 발생하면 라이브러리에 이슈를 등록한다.

## **문제 해결**

Meta와 Expo는 새 아키텍처를 모든 새로운 앱의 기본값으로 만들고 기존 앱을 최대한 쉽게 마이그레이션할 수 있도록 노력하고 있다. 그러나 이는 간단한 작업이 아니다. React Native의 내부 구조 중 많은 부분이 처음부터 다시 설계되고 재구축되었다. 결과적으로 앱에서 새 아키텍처를 활성화할 때 문제가 발생할 수 있다.
