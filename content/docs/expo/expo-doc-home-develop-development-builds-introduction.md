---
title: 개발 빌드 소개
description: 리액트 네이티브 앱을 위한 더 나은 개발 환경
date: 2024-04-02
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/development-builds/introduction/',
    },
  ]
---

개발 빌드(development build)는 [`expo-dev-client`](https://docs.expo.dev/versions/latest/sdk/dev-client/) 패키지를 포함하는 앱의 디버그 빌드다. Expo Go 대신 개발 빌드를 사용하면 네이티브 런타임을 완전히 제어할 수 있으므로 원하는 [네이티브 라이브러리를 설치](https://docs.expo.dev/workflow/using-libraries/#determining-third-party-library-compatibility)하고, [프로젝트 구성을 수정](https://docs.expo.dev/config-plugins/introduction/)하거나, [직접 네이티브 코드를 작성](https://docs.expo.dev/modules/get-started/)할 수 있다. Expo 개발 빌드를 사용할 때는 자신만의 네이티브 앱을 빌드하는 반면, Expo Go를 사용할 때는 샌드박스 네이티브 앱 환경에서 프로젝트를 실행하게 된다.

![개발 빌드를 실행하면 위의 이미지와 같이 보일 것이다. 다만 "Microfoam" 대신 여러분의 앱 이름과 아이콘이 포함될 것이다. 런처 UI는 왼쪽의 iOS와 오른쪽의 Android에 표시되어 있다. 그 사이에는 사용자 정의 가능한 개발자 메뉴가 열려 있는 상태로 개발 빌드 내에서 실행 중인 앱을 볼 수 있다.](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-develop-user-interface-development-builds-introduction/1.png)

- **네이티브 런타임 제어**: Expo 개발 빌드를 사용하면 앱의 네이티브 런타임을 완전히 제어할 수 있다. 이는 네이티브 코드를 수정하거나 추가할 수 있으며, 원하는 네이티브 라이브러리를 설치할 수 있다는 것을 의미한다. 반면 Expo Go는 미리 빌드된 네이티브 앱 환경에서 프로젝트를 실행하므로 네이티브 코드를 직접 수정할 수 없다.
- **프로젝트 구성 수정**: 개발 빌드에서는 프로젝트 구성 파일(예: app.json)을 자유롭게 수정할 수 있다. 이를 통해 앱의 동작과 외관을 커스터마이징 할 수 있다. Expo Go에서는 프로젝트 구성 파일을 수정할 수 있지만, 일부 옵션은 Expo Go 환경에서 지원되지 않을 수 있다.
- **네이티브 코드 작성**: 개발 빌드에서는 직접 네이티브 코드(Java/Kotlin for Android, Objective-C/Swift for iOS)를 작성할 수 있다. 이를 통해 플랫폼별 기능을 구현하거나 최적화할 수 있다. Expo Go에서는 네이티브 코드를 직접 작성할 수 없으며, Expo SDK에서 제공하는 기능만 사용할 수 있다.
- **샌드박스 환경**: Expo Go는 샌드박스 네이티브 앱 환경에서 프로젝트를 실행한다. 이는 Expo Go가 미리 빌드된 네이티브 앱이며, 프로젝트는 이 앱 내에서 실행된다는 것을 의미한다. 이 환경에서는 일부 제한 사항이 있을 수 있으며, 네이티브 기능에 대한 직접적인 액세스가 제한될 수 있다.

**개발 빌드를 사용하면 Expo의 편의성과 React Native의 유연성을 모두 활용할 수 있다. 개발 초기 단계에서는 Expo Go를 사용하여 빠르게 프로토타입을 제작하고, 프로젝트가 성장함에 따라 개발 빌드로 전환하여 더 많은 제어와 사용자 정의 옵션을 얻을 수 있다.**

그러나 개발 빌드를 사용할 때는 빌드 프로세스와 네이티브 종속성 관리에 대한 책임이 개발자에게 있다는 점을 유의해야 한다. 이는 Expo Go에 비해 약간의 복잡성이 추가될 수 있지만, 앱의 요구 사항에 따라 필요할 수 있다.

![React Native 기본 인앱 개발 도구](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-develop-user-interface-development-builds-introduction/2.jpeg)

[`expo-dev-client`](https://docs.expo.dev/versions/latest/sdk/dev-client/) 패키지는 React Native에서 제공하는 기본 인앱 개발 도구 UI를 [더 강력하고 확장 가능한 인앱 UI](https://docs.expo.dev/debugging/tools/#developer-menu)로 대체하고, [네트워크 디버깅 지원](https://docs.expo.dev/debugging/tools/#inspecting-network-requests)을 추가하며, [업데이트 실행](https://docs.expo.dev/eas-update/expo-dev-client/)(예: [PR 리뷰](https://docs.expo.dev/develop/development-builds/development-workflows/#pr-previews)에서)을 위한 지원을 추가하고, 런처 UI를 추가한다.

런처 UI를 통해 앱 바이너리를 다시 빌드하지 않고도 개발 서버를 전환할 수 있다. 이는 [Continuous Native Generation(CNG)](https://docs.expo.dev/workflow/continuous-native-generation/)과 함께 잘 작동한다. 앱의 네이티브 코드를 수정할 때마다 단일 개발 빌드를 생성한 다음, 다음에 네이티브 코드를 수정해야 할 때까지 네이티브 코드를 다시 빌드할 필요 없이 JavaScript 코드를 반복할 수 있기 때문이다. 또한 CNG 없이도 잘 작동한다. 이 접근 방식은 네이티브 런타임에서 작업하는 전문 네이티브 엔지니어와 React에 특화된 애플리케이션 개발자로 구성된 팀에 매우 적합하다. 이를 통해 타협 없이 [웹과 같은 반복 속도](https://blog.expo.dev/javascript-driven-development-with-custom-runtimes-eda87d574c9d)로 네이티브 앱을 개발할 수 있다.

정리해보면 다음과 같다:

- **개선된 인앱 개발 도구 UI**: `expo-dev-client` 패키지는 React Native의 기본 인앱 개발 도구 UI를 대체한다. 이는 더 많은 기능과 사용자 정의 옵션을 제공하여 개발자가 앱을 효과적으로 디버그하고 테스트할 수 있도록 도와준다.
- **네트워크 디버깅 지원**: 이 패키지는 네트워크 요청과 응답을 모니터링하고 검사할 수 있는 네트워크 디버깅 기능을 추가한다. 이를 통해 앱의 네트워크 성능을 최적화하고 잠재적인 문제를 식별할 수 있다.
- **업데이트 실행 지원**: [PR 리뷰](https://docs.expo.dev/develop/development-builds/development-workflows/#pr-previews)와 같은 소스에서 업데이트를 받아 실행할 수 있는 기능을 제공한다. 이를 통해 코드 변경 사항을 빠르게 테스트하고 검증할 수 있다.
- **런처 UI**: 런처 UI는 개발 서버 간 전환을 용이하게 한다. 앱 바이너리를 다시 빌드하지 않고도 다른 개발 서버에 연결할 수 있다. 이는 개발 과정에서 시간을 절약하고 반복 속도를 높이는 데 도움이 된다.
- **지속적인 네이티브 생성(CNG)과의 통합**: `expo-dev-client` 는 CNG와 잘 작동한다. CNG를 사용하면 네이티브 코드를 수정할 때마다 개발 빌드를 생성할 수 있다. 그 후에는 네이티브 코드를 다시 빌드할 필요 없이 JavaScript 코드를 반복할 수 있다. 이는 개발 속도를 크게 향상시킨다.
- **전문 팀에 적합**: 이 접근 방식은 네이티브 엔지니어와 React 개발자로 구성된 팀에 매우 적합하다. 네이티브 엔지니어는 네이티브 런타임과 코드를 담당하고, React 개발자는 JavaScript 코드를 반복하고 개선할 수 있다. 이를 통해 웹과 같은 개발 속도로 네이티브 앱을 개발할 수 있다.

:::note 네이티브 런타임이란?
네이티브 런타임(native runtime)은 JavaScript 애플리케이션 코드가 실행되는 런타임 환경을 의미한다. 만약 개발 빌드가 `expo-camera` 를 설치한 상태로 컴파일되었다면, 네이티브 런타임은 JavaScript에서 해당 기능에 접근할 수 있도록 적절한 코드를 포함하게 된다. 만약 빌드가 `expo-camera` 와 함께 컴파일되지 않았다면, JavaScript 코드에서 해당 코드에 접근할 수 없다. 앱 런타임의 다양한 버전은 [runtime version](https://docs.expo.dev/eas-update/runtime-versions/) 구성 필드로 관리된다.
:::

:::note Expo Go vs 개발 빌드
Expo로 새로운 프로젝트를 시작할 때, "Hello, world!"까지 가장 빠르고 쉬운 방법은 기기에서 Expo Go를 사용하는 것이다. 네이티브 코드를 컴파일하거나 네이티브 도구를 설치할 필요가 없기 때문이다.

"Hello, world!"와 프로토타입을 넘어서면, 곧 제한 사항에 직면하게 되고 앱의 개발 빌드를 생성해야 할 필요성이 생긴다. 예를 들어, Expo Go 샌드박스 환경은 Expo SDK에 포함된 네이티브 패키지로만 제한되는 반면, 개발 빌드에서는 일반적인 네이티브 앱이기 때문에 모든 라이브러리를 포함할 수 있다.

**개발 빌드는 프로젝트에 맞게 특별히 조정된, 완전히 커스터마이징 가능한 버전의 Expo Go라고 생각할 수 있다. 또는 반대로, Expo Go는 미리 설정된 런타임을 가진 개발 환경이라고 볼 수 있다.**
:::

:::note 다른 유형의 빌드는?

- 프로덕션 빌드(production build)는 일반 대중을 위한 것으로, 스토어를 통해 배포된다.
- 프리뷰 빌드(preview build)는 팀이 다음 릴리스를 테스트할 수 있도록 해준다. Android에서는 APK를 직접 설치하거나, iOS에서는 임시 배포(ad hoc) 또는 엔터프라이즈 프로비저닝을 사용하여 설치할 수 있다.
  :::
