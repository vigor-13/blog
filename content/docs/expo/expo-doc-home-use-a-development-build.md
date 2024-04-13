---
title: 개발 빌드 사용하기
description: 프로젝트에 개발 빌드를 사용하는 방법을 알아본다.
date: 2024-04-12
tags: [development_build]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/development-builds/use-development-builds/',
    },
  ]
---

네이티브 앱을 개발할 때 일반적으로 코드를 변경한 후에는 앱을 다시 빌드하고 기기에 설치하는 과정을 거쳐야 변경 사항을 확인할 수 있다. 이 과정에는 다음과 같은 단계가 포함된다:

1. 코드 작성 및 변경
2. 앱 빌드 (iOS의 경우 Xcode에서, Android의 경우 Android Studio나 Gradle을 통해)
3. 빌드된 앱을 기기 또는 에뮬레이터/시뮬레이터에 설치
4. 앱 실행 및 변경 사항 확인

특히 2번 단계인 앱 빌드는 프로젝트의 규모가 크고 복잡할수록 오랜 시간이 소요될 수 있다. 네이티브 코드를 컴파일하고 링크하는 데 시간이 걸리기 때문이다. 이 시간 동안 개발자는 다른 작업을 하거나 기다리는 것 외에는 할 수 있는 게 별로 없다.

만약 이런 빌드 과정을 매번 거쳐야 한다면 개발 속도가 크게 떨어질 것이다. 사소한 변경을 한 번 확인하는 데에도 몇 분씩 기다려야하기 때문이다.

그런데 Expo의 개발 빌드를 사용하면 이 문제를 해결할 수 있다. _개발 빌드는 한 번 기기에 설치해 두면, 이후에는 JavaScript 코드만 변경하는 경우 앱을 다시 빌드하지 않고도 변경 사항을 바로 확인할 수 있게 해준다._

개발 빌드에는 Metro 번들러와 연결하는 기능이 포함되어 있어서, 로컬 개발 서버에서 JavaScript 코드를 실시간으로 불러올 수 있다. 따라서 개발자는 코드를 수정하고 저장만 하면 앱이 자동으로 리로드되어 변경 사항이 바로 반영된다.

물론 이는 순수 JavaScript로 작성된 부분에 한해서다. 만약 Swift, Objective-C, Java, Kotlin 등으로 작성된 네이티브 코드를 변경한다면 여전히 앱을 다시 빌드해야 한다. 하지만 대부분의 경우 앱 로직은 JavaScript로 구현하고 네이티브 코드는 꼭 필요한 경우에만 사용하므로, 개발 빌드를 사용하면 대부분의 변경 사항을 빠르게 확인할 수 있다.

이렇게 불필요한 빌드 시간을 줄임으로써 개발 과정에서의 집중력을 높이고 개발 속도를 크게 향상시킬 수 있다. 긴 빌드를 기다리지 않고도 코드를 바로 수정하고 테스트해 볼 수 있으니 개발 플로우가 훨씬 더 빨라지고 매끄러워진다.

특히 UI 작업 등 시각적 변경을 많이 해야 할 때는 이런 실시간 리로드 기능의 효용이 더욱 빛을 발한다. 변경한 스타일이 의도대로 적용되었는지 바로바로 확인하면서 개발할 수 있다.

따라서 Expo 앱을 개발할 때는 꼭 개발 빌드를 활용하시기 바란다. 기기에 한 번 설치해 두기만 하면 이후의 개발 과정이 훨씬 빨라지고 편해질 것이다. 다만 최종 빌드 시에는 모든 코드를 포함한 새로운 빌드를 해야 한다는 점은 유의해야 한다!

## 오류 처리 추가 {#add-error-handling}

Expo의 개발 빌드에는 더 향상된 에러 핸들링 기능이 포함되어 있다. 이 기능을 사용하면 React Native가 기본으로 제공하는 에러 메시지보다 더 구체적이고 유용한 정보를 얻을 수 있다.

React Native의 기본 에러 메시지는 일반적으로 다음과 같은 형태다:

```text
Something went wrong
```

```text
Error: (some error message)
```

이런 메시지로는 어떤 문제가 발생했는지, 그리고 어떻게 해결해야 할지 알기 어렵다. 특히 처음 React Native 개발을 시작한 사람들에게는 더욱 그렇다.

반면 Expo 개발 빌드의 향상된 에러 핸들링 기능을 사용하면, 다음과 같이 더 자세하고 유용한 정보를 제공한다:

- 에러가 발생한 파일명과 라인 번호
- 에러 메시지와 스택 트레이스
- 에러와 관련된 컴포넌트 정보
- 에러 발생 시점의 앱 상태 스냅샷

예를 들어 다음과 같은 에러 화면을 볼 수 있다:

```text
Error: undefined is not an object (evaluating 'props.title.toUpperCase')

This error is located at:
    in MyComponent (at App.js:10)
    in App (at withExpoRoot.js:20)
    in RootErrorBoundary (at withExpoRoot.js:19)
    in ExpoRootComponent (at renderApplication.js:35)
    in RCTView (at View.js:34)
    in View (at AppContainer.js:106)
    in RCTView (at View.js:34)
    in View (at AppContainer.js:132)
    in AppContainer (at renderApplication.js:34)
```

이렇게 되면 어디서 어떤 에러가 발생했는지 한 눈에 파악할 수 있다. 위 예시에서는 `App.js` 의 10번 라인, `MyComponent` 컴포넌트 내부에서 `props.title.toUpperCase()` 부분을 평가하는 중에 `undefined` 에러가 발생했다는 것을 알 수 있다.

또한 에러 스택 트레이스를 통해 에러가 발생하기까지의 컴포넌트 계층 구조도 파악할 수 있다. 이는 복잡한 앱에서 문제의 원인을 추적하는 데 큰 도움이 된다.

이 기능을 사용하려면 Expo 개발 빌드 프로젝트의 엔트리 파일(`App.js` 또는 `App.tsx`, `_layout.tsx` 등)에서 `expo-dev-client` 모듈을 import해야 한다.

```js
// App.js
import 'expo-dev-client';
```

이렇게 하면 개발 빌드에서 향상된 에러 핸들링 기능이 활성화된다. 이제 앱에서 에러가 발생하면 위에서 본 것과 같이 더 유용한 에러 정보를 확인할 수 있을 것이다.

단, 이 기능은 개발 빌드에서만 동작한다. 프로덕션 빌드에서는 앱의 크기와 성능을 위해 이런 상세한 에러 정보를 제공하지 않는다. 그리고 `import 'expo-dev-client';` 코드도 프로덕션 빌드에는 포함되지 않으므로 앱의 무게를 늘리지 않는다.

## 개발 서버 시작 {#start-the-development-server}

개발을 시작하려면 다음 명령을 실행하여 개발 서버를 시작한다:

```bash
npx expo start
```

:::note
SDK 48 이하의 경우 `npx expo start --dev-client`를 사용한다.
:::

개발 클라이언트에서 프로젝트를 열려면:

- `a` 또는 `i` 키를 눌러 Android 에뮬레이터 또는 iOS 시뮬레이터에서 프로젝트를 연다.
- 실제 기기에서는 시스템 카메라나 QR 코드 리더로 QR 코드를 스캔하여 기기에서 프로젝트를 연다.

## 런처 화면 {#the-launcher-screen}

기기의 홈 화면에서 개발 빌드를 실행하면 다음과 유사한 런처 화면이 표시된다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-use-a-development-build/1.png =80%x)

로컬 네트워크에서 번들러가 감지되거나 Expo CLI와 개발 빌드 모두에서 Expo 계정에 로그인한 경우 이 화면에서 직접 연결할 수 있다. 그렇지 않으면 Expo CLI에 표시된 QR 코드를 스캔하여 연결할 수 있다.

## 개발 빌드 리빌드 {#rebuild-a-development-build}

예를 들어 `expo-secure-store` 와 같이 네이티브 코드 API가 포함된 라이브러리를 프로젝트에 추가하는 경우 개발 클라이언트를 다시 빌드해야 한다. 이는 라이브러리를 프로젝트의 종속성으로 설치할 때 라이브러리의 네이티브 코드가 개발 클라이언트에 자동으로 포함되지 않기 때문이다.

## 개발 빌드 디버그 {#debug-a-development-build}

필요할 때 Expo CLI에서 `Cmd ⌘ + d` 또는 `Ctrl + d` 를 누르거나 휴대폰이나 태블릿을 흔들어 메뉴에 액세스할 수 있다. 여기에서 개발 빌드의 모든 기능, 필요한 모든 디버깅 기능에 액세스하거나 앱의 다른 버전으로 전환할 수 있다.

자세한 내용은 [디버깅 가이드](https://docs.expo.dev/debugging/runtime-issues/)를 참조하세요.
