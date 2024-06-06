---
title: 개발 빌드 소개
description: React Native 앱을 위한 더 나은 개발 환경
date: 2024-06-02
tags: [expo_dev_client, cng]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/development-builds/introduction/',
    },
  ]
---

## 개발 빌드란? {#what-is-development-build}

**개발 빌드**는 [`expo-dev-client`](https://docs.expo.dev/versions/latest/sdk/dev-client/) 패키지가 포함된 앱의 디버깅 버전이다.

개발 빌드를 사용하면 앱의 네이티브 부분을 완전히 제어할 수 있다.

예를 들어, 원하는 [네이티브 라이브러리를 설치](https://docs.expo.dev/workflow/using-libraries/#determining-third-party-library-compatibility)하거나 앱의 [설정을 마음대로 변경](https://docs.expo.dev/config-plugins/introduction/)할 수도 있고 직접 [네이티브 코드를 작성](https://docs.expo.dev/modules/get-started/)할 수도 있다.

이는 [Expo Go](https://docs.expo.dev/get-started/set-up-your-environment/)에서는 불가능하다. Expo Go는 샌드박스처럼 제한된 환경에서 앱을 실행하기 때문에, 네이티브 부분을 자유롭게 제어할 수 없다.

![개발 빌드를 실행하면, "Microfoam" 이라는 예시 대신 실제 앱 이름과 아이콘이 표시된다. 왼쪽 화면은 iOS 버전, 오른쪽 화면은 Android 버전이다. 가운데 화면에서는 개발 빌드 내에서 실행 중인 앱으로, 개발자 메뉴가 열려 있다. 이 개발자 메뉴는 원하는 대로 커스터마이징할 수 있다.](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-develop-user-interface-development-builds-introduction/1.png)

- [EAS Build를 사용하여 개발 빌드 시작하기](https://docs.expo.dev/develop/development-builds/create-a-build/)
  - 개발 빌드를 시작하는 가장 쉬운 방법은 EAS Build를 사용하여 클라우드에서 앱을 빌드하는 것이다.
- [로컬 개발 환경에서 개발 빌드 시작하기](https://docs.expo.dev/guides/local-app-development/)
  - 개발을 위한 앱 빌드의 기본 사항을 다루고 환경 구성 방법에 대한 지침을 제공한다.
- [Expo로 앱 개발하기](https://docs.expo.dev/workflow/overview/)
  - Expo 앱 개발 과정의 개요로, 핵심 개발 루프의 멘탈 모델을 구축하는데 도움이 된다. 개발 빌드가 어디에 적합한지 살펴볼 수 있다.
- [Expo 개발 빌드란?](https://www.youtube.com/watch?v=Iw8FAUftJFU)
  - 개발 빌드가 무엇이고 어떻게 사용하는지 설명하는 YouTube 영상이다.

## expo-dev-client {#expo-dev-cleint}

[`expo-dev-client`](https://docs.expo.dev/versions/latest/sdk/dev-client/) 패키지는 React Native의 기본 개발 도구 UI를 [더욱 강력하고 확장 가능한 UI](https://docs.expo.dev/debugging/tools/#developer-menu)로 대체한다. [네트워크 디버깅](https://docs.expo.dev/debugging/tools/#inspecting-network-requests) 기능, [업데이트 실행](https://docs.expo.dev/eas-update/expo-dev-client/) 기능(예: [PR 미리보기](https://docs.expo.dev/develop/development-builds/development-workflows/#pr-previews)), 그리고 런처 UI 등이 추가된다.

런처 UI는 여러 개발 서버를 오가며 앱을 실행할 수 있게 해주는 인터페이스다. 보통은 개발 서버를 바꾸려면 앱을 새로 빌드해야 하는데, 런처 UI를 사용하면 그럴 필요가 없다.

이 기능은 [CNG(Continuous Native Generation)](https://docs.expo.dev/workflow/continuous-native-generation/)와 함께 사용하면 더욱 강력하다.

CNG는 개발자가 네이티브 코드를 수정할 때마다 자동으로 새 개발 빌드를 생성해주는 시스템이다. 런처 UI와 함께 사용하면, 네이티브 개발자는 네이티브 코드를 수정한 후 그에 맞는 새 개발용 빌드를 런처 UI에 추가할 수 있다.

그러고 나면 React 개발자는 런처 UI에서 새 빌드를 선택하여 JavaScript 코드를 계속 개발할 수 있다. 네이티브 코드를 다시 수정하기 전까지는 이 개발 빌드를 계속 사용할 수 있다.

이렇게 하면 네이티브 코드 변경의 영향을 최소화하면서도, 항상 최신의 네이티브 코드를 사용할 수 있다. React 개발자는 네이티브 코드가 변경될 때마다 앱 전체를 다시 빌드할 필요 없이, 새 개발 빌드만 받아서 바로 개발을 이어갈 수 있다.

이런 개발 방식은 네이티브 개발과 React 개발을 분업화한 팀에게 아주 적합하다. 네이티브 엔지니어는 네이티브 런타임과 앱의 네이티브 부분을 담당하고, React 개발자는 JavaScript로 앱의 나머지 부분을 개발한다.

이렇게 하면 네이티브 앱의 장점은 유지하면서 [웹 개발에 버금가는 빠른 개발 속도](https://blog.expo.dev/javascript-driven-development-with-custom-runtimes-eda87d574c9d)를 얻을 수 있다.

## 자주 묻는 질문

### 네이티브 런타임이란? {#what-is-a-native-runtime}

네이티브 런타임은 JavaScript 코드가 실행되는 환경을 말한다. 이를 이해하려면 먼저 Expo 앱이 어떻게 만들어지는지 살펴볼 필요가 있다.

Expo 앱은 JavaScript 코드와 네이티브 코드의 조합으로 이루어진다. 우리가 주로 작성하는 것은 JavaScript 코드다. 하지만 이 JavaScript 코드만으로는 카메라, 푸시 알림 등의 네이티브 기능을 직접 사용할 수 없다.

그래서 Expo는 JavaScript 코드가 이런 네이티브 기능을 사용할 수 있도록 중간에서 연결해주는 네이티브 코드를 제공한다. 이 네이티브 코드는 Expo SDK의 일부로 제공된다.

여기서 네이티브 런타임의 개념이 등장한다. 네이티브 런타임은 바로 이 네이티브 코드들이 실행되는 환경을 말한다.

예를 들어보자. 우리가 `expo-camera` 라이브러리를 설치하고 앱을 빌드했다면 Expo는 `expo-camera` 를 사용하는 데 필요한 네이티브 코드를 앱의 네이티브 런타임에 포함시킨다. 그 결과 우리는 JavaScript 코드에서 `expo-camera` 의 기능을 사용할 수 있게 된다.

반대로 `expo-camera` 를 설치하지 않고 빌드했다면, 네이티브 런타임에는 카메라 관련 네이티브 코드가 포함되지 않는다. 그러면 JavaScript에서 아무리 카메라 기능을 사용하려 해도 동작하지 않는다.

이처럼 네이티브 런타임은 앱이 어떤 네이티브 기능을 사용할 수 있는지 결정한다. 그리고 이 네이티브 런타임은 우리가 설치한 Expo SDK 라이브러리에 따라 달라진다.

Expo SDK는 꾸준히 업데이트되고 있다. 새로운 기능이 추가되기도 하고, 기존 기능이 개선되기도 한다. 이런 업데이트는 대부분 하위 호환성을 유지하지만, 가끔은 이전 버전과 호환되지 않는 변경 사항이 포함되기도 한다.

만약 앱이 특정 버전의 Expo SDK를 사용하도록 만들어졌는데, Expo SDK가 업데이트되면서 호환성이 깨진다면 문제가 될 수 있다.

바로 이런 상황을 대비하기 위해 Expo는 [runtime version](https://docs.expo.dev/eas-update/runtime-versions/) 설정을 제공한다. 이 설정은 앱의 설정 파일(`app.json` 또는 `app.config.js`)에서 관리한다. 이를 통해 우리는 앱이 사용할 네이티브 런타임의 버전을 명시적으로 지정할 수 있다.

예를 들어 앱이 Expo SDK 버전 46을 사용하도록 만들어졌다고 해보자. 그런데 Expo SDK 버전 47이 릴리즈되면서 일부 변경 사항이 생겼고, 이게 앱과 호환되지 않는다면?

이런 경우, 우리는 `runtime version` 에 버전 46을 지정함으로써, 앱이 항상 Expo SDK 버전 46에 맞는 네이티브 런타임을 사용하도록 설정할 수 있다. 그러면 Expo SDK가 버전 47로 업데이트되더라도, 앱은 여전히 버전 46의 네이티브 런타임을 사용하게 된다.

물론, 이는 임시적인 해결책이다. 장기적으로는 앱이 최신 버전의 Expo SDK를 사용하도록 업데이트해야 한다.

### 개발 빌드는 Expo Go와 어떻게 다른가?

Expo로 새 프로젝트를 시작할 때 가장 빠르고 쉬운 방법은 기기에서 Expo Go를 사용하는 것이다. 네이티브 코드를 컴파일하거나 네이티브 도구를 설치할 필요가 없기 때문이다.

프로젝트가 프로토타입의 수준을 넘어서면 곧 한계에 부딪히게 되고 앱의 개발 빌드를 만들어야 한다.

예를 들어, Expo Go 샌드박스 환경은 Expo SDK에 포함된 네이티브 패키지로만 제한되는 반면, 개발 빌드는 일반 네이티브 앱이기 때문에 어떤 라이브러리도 설치할 수 있다.

정리해보면, 개발 빌드는 프로젝트에 특화된, 완전히 커스터마이징 가능한 버전의 Expo Go라고 볼 수 있다. 반대로, Expo Go는 미리 설정된 런타임을 가진 개발 환경이라고 할 수 있다.

### 다른 유형의 빌드에는 어떤 것이 있는가?

- **프로덕션 빌드(Production Build)**
  - 앱스토어나 플레이스토어 같은 스토어를 통해 일반 사용자에게 배포되는 최종 버전의 앱이다. 이 빌드는 완성도 높고 안정적이어야 하며, 모든 기능이 의도한 대로 작동해야 한다. 프로덕션 빌드는 개발 과정에서의 디버깅 코드나 불필요한 로그 등을 제거하고 성능 최적화를 거친 버전이다.
- **프리뷰 빌드(Preview Build)**
  - 다음 버전의 앱을 출시하기 전에 팀 내부에서 테스트하기 위한 용도로 만들어진다. 개발자들은 새로운 기능이 제대로 동작하는지, 버그는 없는지 등을 확인하기 위해 프리뷰 빌드를 사용한다.
    - Android의 경우 APK 파일을 직접 기기에 설치하여 프리뷰 빌드를 테스트할 수 있다.
    - iOS의 경우에는 애드혹(Ad Hoc) 또는 엔터프라이즈 프로비저닝(Enterprise Provisioning)을 통해 프리뷰 빌드를 배포할 수 있다.
      - 애드혹 프로비저닝은 100대 이하의 특정 기기에 앱을 설치할 수 있도록 하는 방식이고,
      - 엔터프라이즈 프로비저닝은 조직 내부에서 자체적으로 앱을 배포하고 관리할 수 있도록 하는 방식이다.

## 정리 {#summary}

Expo를 사용할 때 2가지 방법으로 개발 환경을 구성할 수 있다.

1. Expo GO
   - 빌트인 개발 환경이다.
   - 네이티브 개발환경을 구축할 필요 없이 빠르게 프로토타입을 개발할 수 있다.
2. 개발 빌드
   - 커스텀 개발 환경이다.
   - `expo-dev-client` 를 사용한다.
   - 앱의 네이티브 영역을 완전히 컨트롤 할 수 있다.
