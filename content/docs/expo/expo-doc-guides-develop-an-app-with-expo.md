---
title: Expo로 앱 개발하기
description: Expo 앱 개발 프로세스의 개요를 알아본다.
date: 2024-04-02
tags: []
references:
  [{ key: 'Expo 공식 문서', value: 'https://docs.expo.dev/workflow/overview/' }]
---

**이 문서는 Expo를 사용하여 앱을 개발하는 과정을 설명한다.**

"핵심 개발 루프"란 개발자가 앱을 만들 때 반복하는 일련의 과정을 말한다. 코드를 작성하고, 앱을 실행하고, 테스트하고, 수정하는 과정을 반복하는 것이다.

이 문서는 이런 개발 과정에서 개발자가 가지는 생각의 흐름, 즉 "멘탈 모델"을 이해하는 데 도움을 준다.

그리고 Expo에서 제공하는 다양한 도구들이 이런 개발 과정에 어떻게 도움을 주는지 설명한다.

예를 들어, Expo Go 앱은 개발 중인 앱을 바로 실행해볼 수 있게 해주고, Expo CLI는 개발 환경을 쉽게 설정할 수 있도록 도와줍니다.

즉, 이 문서를 통해 Expo 앱 개발의 전체적인 그림을 이해하고, 개발 과정에서 Expo 도구들을 효과적으로 활용하는 방법을 배울 수 있다.

## 핵심 컨셉 {#key-concepts}

### Expo 앱이란? {#what-is-an-expo-app}

**Expo 앱은 React Native 프레임워크를 기반으로 Expo 도구를 사용하여 만든 앱을 통칭하는 말이다.**

Expo는 React Native로 앱을 개발할 때 필요한 다양한 도구와 서비스를 제공하는데, 이를 활용하면 개발 과정을 크게 단순화할 수 있다.

Expo 앱은 다음과 같은 다양한 도구와 서비스를 사용할 수 있다:

1. **Expo SDK**:
   - Expo SDK는 React Native를 기반으로 구축된 라이브러리 모음이다.
   - 이 SDK는 일반적인 모바일 앱 개발에 필요한 대부분의 기능을 제공한다. 예를 들어, 카메라, 위치 정보, 푸시 알림, 센서 등을 쉽게 다룰 수 있는 API를 포함한다.
   - Expo SDK를 사용하면 iOS와 Android 플랫폼 모두에서 동작하는 크로스 플랫폼 앱을 간편하게 개발할 수 있다.
2. **Expo Router**:
   - Expo Router는 React Native 앱의 내비게이션을 손쉽게 구현할 수 있는 도구다.
   - 파일 시스템 기반의 라우팅을 제공하므로, 폴더와 파일의 구조로 앱의 화면 구성을 정의할 수 있다.
   - 이를 통해 앱의 내비게이션 로직을 선언적으로 작성할 수 있어, 코드의 가독성과 유지보수성이 향상된다.
3. **Expo CLI**:
   - Expo CLI는 Expo 프로젝트를 생성하고 관리하는 도구다.
   - 이 도구를 사용하면 새로운 Expo 프로젝트를 쉽게 시작할 수 있으며, 개발 서버를 실행하고, 앱을 빌드하고 배포하는 등의 작업을 수행할 수 있다.
   - 또한 Expo CLI는 다양한 유틸리티 기능을 제공하여, 개발 과정에서 발생하는 일반적인 작업을 자동화할 수 있다.
4. **Continuous Native Generation (CNG)**:
   - CNG는 Expo에서 제공하는 최신 기능으로, React Native와 Expo SDK의 통합을 더욱 강화한다.
   - CNG를 사용하면 네이티브 플랫폼(iOS/Android)의 변경 사항을 자동으로 감지하고, 이에 맞게 React Native 인터페이스를 생성할 수 있다.
   - 이를 통해 네이티브 기능과 React Native 코드 간의 상호 운용성이 향상되며, 개발 과정이 더욱 효율적으로 이루어질 수 있다.

위에서 언급한 도구들은 개별적으로 사용될 수도 있고, 함께 조합하여 사용될 수도 있다. 예를 들어, Expo SDK만 사용하는 앱도 있을 수 있고, Expo SDK, Expo Router, Expo CLI를 모두 활용하는 앱도 있을 수 있다.

:::note Expo 앱과 순수 React Native 앱의 개발 프로세스 차이

"Expo 앱"과 "순수 React Native 앱"의 개발 프로세스는 몇 가지 중요한 차이점이 있다. 이는 주로 Expo가 제공하는 도구와 서비스 때문인데, 이러한 도구들은 React Native 개발 과정의 많은 부분을 단순화하고 자동화한다.

1. **개발 환경 설정**:
   - 순수 React Native 앱: 개발자가 직접 Xcode(iOS용) 또는 Android Studio(Android용)를 설치하고 설정해야 한다. 또한 React Native CLI를 설치하고, 프로젝트에 필요한 종속성을 수동으로 관리해야 한다.
   - Expo 앱: Expo CLI를 설치하면 대부분의 개발 환경 설정이 자동으로 이루어진다. Xcode나 Android Studio를 별도로 설치할 필요가 없으며, 종속성 관리도 Expo에서 처리한다.
2. **네이티브 모듈 및 API 사용**:
   - 순수 React Native 앱: 네이티브 모듈이나 API를 사용하려면 직접 구현하거나, 서드파티 라이브러리를 찾아 설치해야 한다. 이는 iOS와 Android에 대해 별도로 이루어져야 하므로 복잡할 수 있다.
   - Expo 앱: Expo SDK는 일반적으로 필요한 대부분의 네이티브 기능을 미리 구현하여 제공한다. 이를 통해 개발자는 네이티브 코드를 직접 작성하지 않고도 다양한 기능을 사용할 수 있다.
3. **앱 테스트 및 미리보기**:
   - 순수 React Native 앱: 앱을 실행하려면 iOS 시뮬레이터나 Android 에뮬레이터를 사용해야 한다. 실제 기기에서 테스트하려면 추가 설정이 필요하다.
   - Expo 앱: Expo Go 앱을 사용하면 QR 코드를 스캔하는 것만으로 실제 기기에서 앱을 미리볼 수 있다. 이를 통해 개발 중인 앱을 빠르게 테스트하고 반복할 수 있다.
4. **앱 빌드 및 배포**:
   - 순수 React Native 앱: 앱을 빌드하고 배포하려면 Xcode나 Android Studio를 사용해야 한다. 인증서 관리, 앱 서명 등의 과정을 수동으로 처리해야 하므로 복잡할 수 있다.
   - Expo 앱: Expo CLI를 사용하면 앱 빌드와 배포 과정이 크게 단순화된다. Expo의 빌드 서비스를 통해 앱을 빌드하고, Expo의 업데이트 서비스를 통해 실시간으로 업데이트를 배포할 수 있다.

이러한 차이점들은 Expo가 제공하는 도구와 서비스 때문에 발생한다. Expo는 React Native 개발에 최적화된 도구들을 제공하지만, Meta(Facebook)에서는 이에 상응하는 도구를 공식적으로 제공하지 않는다.

따라서 Expo 앱과 순수 React Native 앱의 개발 프로세스는 선택한 도구에 따라 크게 달라질 수 있다. Expo를 사용하면 개발 과정의 많은 부분이 단순화되고 자동화되지만, 일부 제한 사항이 있을 수 있습니다. 반면 순수 React Native 앱은 더 많은 유연성을 제공하지만, 개발 과정이 상대적으로 복잡할 수 있다.

어떤 접근 방식이 더 적합한지는 프로젝트의 요구사항, 개발 팀의 역량, 기존 인프라 등 다양한 요인에 따라 달라집니다. 많은 경우 Expo의 도구와 서비스를 활용하는 것이 개발 효율성과 생산성 측면에서 유리하지만, 항상 그런 것은 아니다.
:::

### Expo와 EAS(Expo Application Service)의 차이점 {#what-is-the-difference-between-expo-and-eas}

Expo는 React Native 앱을 구축하고 유지 관리하는 데 도움이 되는 강력한 도구를 제공하는 오픈 소스 프로젝트다. 예를 들어, Expo CLI, Expo Router 및 Expo SDK 패키지가 있다. 모든 Expo 오픈 소스 도구는 무료로 사용할 수 있으며 MIT 라이선스를 따른다.

Expo Application Services(EAS)는 Expo 및 React Native 프로젝트에서 사용할 수 있는 호스팅 서비스 모음으로 다음과 같은 기능을 제공한다:

- 앱 빌드, 제출 및 업데이트
- 이러한 모든 프로세스에 대한 자동화 설정
- 팀과의 협업

EAS는 Expo 및 React Native 프로젝트에서 발생할 수 있는 몇 가지 문제를 해결하기 위해 **물리적 리소스**를 제공한다.

1. **OTA 업데이트를 위한 애플리케이션 서버 및 CDN**:
   - Expo 앱은 JavaScript 번들과 에셋을 포함하는 **OTA 업데이트(over-the-air updates)** 를 통해 새로운 기능과 버그 수정을 배포할 수 있다.
   - 이를 위해서는 업데이트 파일을 호스팅하고 앱에 전달할 수 있는 서버 인프라가 필요하다.
   - EAS는 이러한 업데이트를 제공하기 위한 애플리케이션 서버와 CDN (Content Delivery Network)을 제공한다.
   - 개발자는 EAS를 사용하여 업데이트를 쉽게 배포하고 관리할 수 있으며, 서버 인프라 설정 및 유지 관리에 대해 걱정할 필요가 없다.
2. **빌드 실행을 위한 물리적 서버**:
   - React Native 앱을 iOS 및 Android용으로 빌드하려면 Xcode와 Android Studio를 실행할 수 있는 물리적 또는 가상 머신이 필요하다.
   - 개발자 자신의 컴퓨터에서 이러한 빌드를 실행할 수 있지만, 팀 환경에서 일관성과 자동화를 위해서는 **전용 빌드 서버**를 사용하는 것이 좋다.
   - EAS Build는 iOS 및 Android 앱을 빌드하기 위한 호스팅된 빌드 인프라를 제공한다.
   - 개발자는 코드를 EAS로 푸시하면 EAS에서 앱을 빌드하고 결과 바이너리를 제공한다.
   - 이를 통해 개발자는 로컬 개발 환경에서 빌드 프로세스를 설정하고 관리할 필요 없이 앱을 쉽게 빌드할 수 있다.

EAS는 이러한 서비스를 관대한 [무료 플랜](https://expo.dev/pricing#get-started)으로 제공하므로, 학생이나 취미 프로젝트에 적합하다. 무료 플랜에는 일정 한도의 무선 업데이트 및 빌드 시간이 포함되어 있어 소규모 프로젝트에서 추가 비용 없이 EAS의 이점을 누릴 수 있다.

EAS를 사용하면 개발자는 서버 인프라 및 빌드 프로세스 관리와 같은 복잡한 작업을 처리할 필요 없이 Expo 및 React Native 앱을 더 쉽게 개발, 배포 및 유지 관리할 수 있다. 이를 통해 개발자는 앱 자체에 더 집중할 수 있으며, 특히 소규모 프로젝트나 예산이 제한된 상황에서 도움이 된다.

**Git을 사용하기 위해 반드시 GitHub를 사용해야 하는 것은 아니지만, 많은 경우에 도움이 된다. EAS와 Expo도 마찬가지다.**

:::important OTA 업데이트
**OTA 업데이트 (Over-the-Air updates, OTA updates)는 앱 스토어를 통하지 않고 앱의 JavaScript 코드와 에셋을 업데이트하는 메커니즘이다.** 이를 통해 개발자는 새로운 기능이나 버그 수정을 빠르게 배포할 수 있다. 사용자는 앱 스토어에서 업데이트를 다운로드하고 설치할 필요 없이 앱을 열면 자동으로 최신 버전을 받게 된다.

Expo Go는 Expo 개발 도구와 함께 사용되는 모바일 앱으로, 개발 중인 Expo 앱을 미리보기 및 테스트할 수 있다. Expo Go를 사용하면 개발 과정에서 변경 사항을 즉시 확인할 수 있는데, 이는 Expo의 OTA 업데이트 기능 덕분에 가능하다.

그러나 OTA 업데이트는 Expo Go에만 국한되지 않는다. Expo를 사용하여 구축 및 게시된 독립 실행형 앱 (Expo Go 없이 실행되는 앱)도 OTA 업데이트를 통해 JavaScript 코드와 자산을 업데이트할 수 있다. 이는 EAS의 호스팅 서비스를 통해 이루어진다.

따라서 OTA 업데이트는 Expo 플랫폼의 핵심 기능 중 하나이며, 개발 과정에서 (Expo Go를 통해) 변경 사항을 미리보는 데 사용될 수 있고, 프로덕션 앱에서 앱 스토어 심사 없이 업데이트를 배포하는 데에도 사용될 수 있다.
:::

:::note OTA 업데이트 vs 코드 푸시
OTA 업데이트는 코드 푸시(Code Push)와 비슷한 개념이다. 둘 다 앱 스토어를 거치지 않고 앱의 JavaScript 코드와 에셋을 업데이트할 수 있는 메커니즘을 제공한다.

코드 푸시는 Microsoft에서 개발한 오픈 소스 서비스로, Expo의 무선 업데이트와 유사한 기능을 제공한다. 코드 푸시를 사용하면 개발자는 앱의 JavaScript 번들과 에셋을 업데이트할 수 있고, 사용자는 앱 스토어에서 업데이트를 다운로드하지 않아도 최신 버전을 받을 수 있다.

Expo의 무선 업데이트와 코드 푸시의 주요 차이점은 다음과 같다:

1. Expo의 무선 업데이트는 Expo 프레임워크와 긴밀하게 통합되어 있어 설정과 사용이 간편하다. 반면 코드 푸시는 독립적인 서비스이므로 React Native 앱에 통합하려면 추가 설정이 필요하다.
2. Expo의 무선 업데이트는 EAS와 함께 사용할 때 빌드 프로세스와 직접 연결되어 있어 개발자 경험이 더 원활하다.
3. 코드 푸시는 React Native 앱뿐만 아니라 Cordova 및 Xamarin과 같은 다른 프레임워크에서도 사용할 수 있는 범용 솔루션이다.

요약하면, Expo의 무선 업데이트와 코드 푸시는 앱 스토어를 거치지 않고 앱을 업데이트할 수 있다는 점에서 비슷한 개념이지만, Expo의 솔루션은 Expo 프레임워크 및 서비스와 더 긴밀하게 통합되어 있어 Expo 앱을 개발할 때 더 나은 개발자 경험을 제공한다.
:::

<!-- :::note Expo 도구를 사용한다면 반드시 EAS를 사용해야 할까?
아니다! Expo 프로젝트는 그냥 React Native 앱이고, 이는 그냥 네이티브 앱이다. 원하는 대로 Fastlane이나 다른 도구를 사용할 수 있다.

대부분의 EAS 서비스는 사용자 자신의 인프라에서 실행할 수 있으며, 이를 달성하는 방법에 대한 지침을 제공한다. 예를 들어, EAS Update를 사용하는 대신 [자체 호스팅 업데이트](https://docs.expo.dev/distribution/custom-updates-server/)를 하거나, EAS Build worker fleet을 사용하는 대신 [로컬](https://docs.expo.dev/guides/local-app-development/) 또는 [사용자 자신의 CI](https://docs.expo.dev/workflow/build/building-on-ci/)에서 빌드를 실행할 수 있다.

대부분의 팀에게는 EAS를 사용하는 것이 다른 인프라에서 서비스를 확보, 설정 및 유지 관리하는 데 엔지니어링 시간과 리소스를 투자하는 것보다 더 타당하다. 또한 EAS는 앱 버전 채택을 위한 모니터링, 특정 빌드에 업데이트 할당, 점진적 업데이트 배포 등의 서비스 간 긴밀한 통합을 제공하며, 이는 [EAS Insights](https://docs.expo.dev/eas-insights/introduction/)를 통한 모니터링과 연결된다.
::: -->

#### Expo 도구를 사용하는 경우 반드시 EAS도 함께 사용해야 할까? {do-i-have-to-use-eas-if-i-use-expo-tools}

Expo 오픈 소스 도구를 사용한다고 해서 반드시 EAS를 사용해야 하는 것은 아니다. Expo 프로젝트는 결국 React Native 앱이며, 이는 네이티브 앱이다. 따라서 Fastlane이나 다른 네이티브 빌드, 업데이트 등의 도구를 원하는 대로 사용할 수 있다.

대부분의 EAS 서비스는 사용자의 인프라에서도 실행할 수 있도록 허용하며, Expo에서는 이를 달성하는 방법에 대한 지침을 제공한다. 예를 들어, EAS 업데이트를 사용하는 대신 [자체 호스팅 업데이트](https://docs.expo.dev/distribution/custom-updates-server/)를 하거나, EAS 빌드 작업자 플릿을 사용하는 대신 [로컬](https://docs.expo.dev/guides/local-app-development/) 또는 [자체 CI에서 빌드](https://docs.expo.dev/workflow/build/building-on-ci/)를 실행할 수 있다.

그러나 대부분의 팀에게는 EAS를 사용하는 것이 더 합리적인 선택이다. 다른 인프라에서 서비스를 획득, 설정 및 유지 관리하는 데 엔지니어링 시간과 리소스를 투입하는 것보다는 EAS를 활용하는 것이 효율적이기 때문이다.

또한 EAS는 서비스 간의 깊은 통합을 제공한다. 예를 들어, 앱 버전 채택 모니터링, 특정 빌드에 업데이트 할당, 점진적 업데이트 롤아웃 등을 위한 배포 페이지가 있는데, 이는 다시 [EAS Insights](https://docs.expo.dev/eas-insights/introduction/)를 통한 모니터링과 연결된다.

즉, Expo 오픈 소스 도구를 사용할 때 EAS의 활용은 선택 사항이지만, 대부분의 경우 EAS를 사용하는 것이 개발 효율성과 편의성 측면에서 더 나은 선택이다. 하지만 프로젝트의 특성과 팀의 상황에 따라 다른 도구나 인프라를 사용하는 것도 가능하므로, 유연하게 접근할 수 있다.

### Expo Go: 학습, 실험, 프로토타이핑을 위한 선택적 도구 {#expo-go-optional-tool}

[Expo Go](https://docs.expo.dev/get-started/expo-go/)와 [Snack](https://snack.expo.dev/)을 함께 사용하면 React Native 프로젝트를 더 빠르게 시작할 수 있다.

그러나 **Expo Go와 Snack은 프로덕션 앱을 구축하기 위한 것이 아니다**. 프로젝트를 시작하거나 프로토타입을 만들 때는 좋은 도구이다. **앱을 스토어에 배포할 계획이라면 개발 빌드(Development builds)가 더 유연하고 안정적이며 완전한 개발 환경을 제공할 것이다.** 이 가이드에서는 Expo Go에 대해 자세히 다루지 않으며, 여기가 Expo Go를 언급하는 유일한 부분이다.

### 개발 빌드(Development builds) {#development-builds}

**개발 빌드는 `expo-dev-client` 라이브러리를 포함하는 앱의 디버그 빌드다.** 개발 빌드는 가능한 한 빠르게 반복할 수 있도록 도와주며, Expo Go보다 더 유연하고 안정적이며 완전한 개발 환경을 제공한다. 네이티브 라이브러리를 설치하고 [앱 설정](https://docs.expo.dev/workflow/configuration/)을 사용하거나 [설정 플러그인](https://docs.expo.dev/config-plugins/introduction/)을 생성하여 [네이티브 프로젝트](https://docs.expo.dev/workflow/overview/#android-and-ios-native-projects)에 변경 사항을 적용할 수 있다. [로컬](https://docs.expo.dev/guides/local-app-development/#local-builds-with-expo-dev-client)에서 개발 빌드를 생성하거나 [EAS Build](https://docs.expo.dev/develop/development-builds/create-a-build/)를 사용하여 클라우드에서 빌드를 생성할 수 있다.

### Android와 iOS 네이티브 프로젝트 {#android-and-ios-native-projects}

React Native 앱은 서로 연결된 두 부분으로 구성된다:

#### JavaScript 앱 {#javascript-app}

이 부분은 React 컴포넌트와 대부분의 (전부는 아니더라도) **애플리케이션 로직**을 포함한다. React 웹사이트의 JavaScript와 거의 동일한 역할을 한다.

#### 네이티브 프로젝트 {#native-project}

네이티브(Android 및 Xcode) 프로젝트는 JavaScript 앱을 번들로 묶고, **각 플랫폼에서 JavaScript 앱의 실행 환경 역할을 한다.** 또한 네이티브 컴포넌트의 렌더링을 처리하고 플랫폼별 기능에 접근하며 설치된 네이티브 라이브러리와 통합하는 수단을 제공한다. 홈 화면에 표시되는 이름, 아이콘, 필요한 권한, 연결된 도메인, 지원되는 오리엔테이션 등과 같은 앱 설정은 네이티브 프로젝트에서 설정된다.

다른 모바일 앱과 마찬가지로, 사용자에게 배포되는 애플리케이션은 Android Studio 또는 Xcode 프로젝트를 컴파일("빌드")하여 생성된다.

`npx create-expo-app` 으로 새 앱을 초기화할 때, `android/ios` 디렉토리가 보이지 않을 것이다.

[`npx expo prebuild` 를 실행하여 네이티브 프로젝트를 생성](https://docs.expo.dev/workflow/prebuild/)할 수 있으며, 이 명령은 네이티브 프로젝트를 초기화한 다음 프로젝트의 Expo 앱 설정(`app.json/app.config.js`)을 적용한다.

클라우드 기반 개발 워크플로우를 사용하는 경우, 자신의 컴퓨터에서 직접 prebuild를 실행하거나 Android Studio 또는 Xcode를 설치할 필요가 거의 없다.

##### Expo 프로젝트를 초기화할 때 기본적으로 네이티브 프로젝트가 생성되지 않는 이유 {#why-arent-native-project-created-by-default}

1. **간소화된 시작**: create-expo-app은 개발자가 최소한의 설정으로 빠르게 시작할 수 있도록 설계되었다. 네이티브 프로젝트를 즉시 생성하지 않음으로써 프로젝트 구조를 단순하게 유지하고 초보자에게 친숙한 환경을 제공한다.
2. **필요에 따른 생성**: 모든 개발자가 처음부터 네이티브 프로젝트를 필요로 하는 것은 아니다. Expo Go 앱을 사용하여 개발 초기 단계에서 앱을 미리보고 테스트할 수 있다. 네이티브 기능이나 사용자 정의 구성이 필요한 경우에만 prebuild를 실행하여 네이티브 프로젝트를 생성할 수 있다.
3. **클라우드 기반 개발 지원**: Expo는 클라우드 기반 개발 워크플로우를 지원하므로 개발자가 로컬 환경에서 네이티브 프로젝트를 설정하고 관리할 필요가 없다. EAS Build와 같은 서비스를 사용하면 클라우드에서 앱을 빌드할 수 있으므로 로컬 컴퓨터에 Android Studio나 Xcode를 설치하지 않아도 된다.
4. **유연성 제공**: 네이티브 프로젝트 생성을 선택 사항으로 제공함으로써 Expo는 개발자에게 더 많은 유연성을 제공한다. 프로젝트의 요구 사항에 따라 네이티브 프로젝트를 생성할 시기와 방법을 결정할 수 있다.

다음 세 가지 명령은 거의 동일한 프로젝트를 생성한다:

```bash
npx create-expo-app MyApp && cd MyApp && npx expo prebuild
npx create-expo-app --template bare-minimum
npx react-native init MyApp && cd MyApp && npx install-expo-modules
```

### CNG(Continuous Native Generation) {#continuous-native-generation}

**CNG(Continuous Native Generation)는 `app.json` 과 `package.json` 을 사용하여 필요할 때마다 [네이티브 프로젝트](https://docs.expo.dev/workflow/overview/#android-and-ios-native-projects)를 생성하는 Expo 앱 빌드 프로세스다.**

이는 `package.json` 에서 `node_modules`가 생성되는 방식과 유사하다.

[네이티브 프로젝트](https://docs.expo.dev/workflow/overview/#android-and-ios-native-projects) 디렉토리(`android/ios`)를 `.gitignore` 에 추가하거나 삭제한 다음, 필요할 때마다 `npx expo prebuild` 를 사용하여 Expo 앱 설정을 통해서 다시 생성할 수 있다. 클라우드 기반 개발 워크플로우를 사용하는 경우 개발 컴퓨터에서 직접 prebuild를 실행하지 않을 수도 있다.

CNG를 사용하면 React Native의 새 버전으로 업그레이드하는 것이 훨씬 쉬워진다. 프로젝트 유지 관리를 단순화하고 [App Clips](https://github.com/bndkt/react-native-app-clip), [공유 익스텐션](https://github.com/timedtext/expo-config-plugin-ios-share-extension), [푸시 알림](https://github.com/OneSignal/onesignal-expo-plugin)과 같은 복잡한 기능의 설정을 용이하게 한다. 이는 모두 [설정 플러그인](https://docs.expo.dev/config-plugins/introduction/)을 통해 가능하다.

#### prebuild를 사용하는 대신 Android Studio나 Xcode에서 직접 네이티브 프로젝트 설정을 편집하고 싶다면?

CNG는 많은 팀에게 유용한 도구로 입증되었지만, 모든 프로젝트에 적합한 것은 아니다. 어떤 경우에는 Expo 도구를 사용하면서 네이티브 프로젝트 파일을 직접 수정하는 것이 더 나은 선택일 수 있다.

이를 위해 다음과 같은 방법을 사용할 수 있다:

1. 프로젝트에서 `npx expo prebuild` 를 실행하여 **android**와 **ios** 디렉토리를 생성한다.
2. Expo 앱 설정을 사용하는 대신 Android Studio나 Xcode에서 직접 네이티브 프로젝트 파일을 수정한다. 예를 들어, 네이티브 모듈을 수동으로 연결하거나, 빌드 설정을 커스터마이징 하거나, 네이티브 코드를 추가할 수 있다.
3. 네이티브 프로젝트를 수정한 후에는 일반적인 React Native 개발 워크플로우에 따라 앱을 빌드하고 실행할 수 있다.

그러나 이 방법을 선택할 경우 다음 사항을 유의해야 한다:

- 네이티브 프로젝트 파일을 직접 수정하면 더 이상 prebuild를 사용하여 프로젝트를 다시 생성할 수 없다. prebuild를 실행하면 수정한 내용이 모두 덮어씌워진다.
- CNG를 사용하지 않으면 업그레이드와 유지 관리가 더 어려워질 수 있다. 새로운 React Native 버전으로 업그레이드할 때 네이티브 프로젝트 파일을 수동으로 업데이트해야 할 수도 있다.

이러한 제한 사항에도 불구하고 [설정 플러그인](https://docs.expo.dev/config-plugins/introduction/)을 사용하면 네이티브 프로젝트를 직접 수정하지 않고도 네이티브 프로젝트 설정을 커스터마이징 할 수 있다. [설정 플러그인](https://docs.expo.dev/config-plugins/introduction/)을 사용하면 Expo 앱 구성에서 네이티브 프로젝트 설정을 수정할 수 있으므로, 나중에 CNG로 다시 전환하기로 결정하더라도 쉽게 할 수 있다.

요약하면, 네이티브 프로젝트 파일을 직접 수정하는 것은 특정 사용 사례에 적합할 수 있지만, **CNG와 설정 플러그인을 사용하는 것이 일반적으로 더 나은 접근 방식이다.** 이를 통해 Expo 도구의 이점을 유지하면서 네이티브 프로젝트 커스터마이징을 위한 유연성을 얻을 수 있다.

#### prebuild 명령을 언제 실행해야 할까?

프로젝트에 **새로운 네이티브 종속성을 추가하거나 Expo 앱 구성(`app.json/app.config.js`)에서 프로젝트 설정을 변경하는 경우**, `npx expo prebuild --clean` 을 실행하여 네이티브 프로젝트 디렉토리를 다시 생성할 수 있다.

새로운 종속성이 네이티브 코드 변경을 필요로 하는지 확인하는 방법에 대한 자세한 내용은 [써드파티 라이브러리 호환성 확인](https://docs.expo.dev/workflow/using-libraries/#determining-third-party-library-compatibility)을 참조한다.

### 클라우드 기반 워크플로우 & 로컬 개발 워크플로우 {#cloud-base-and-local-development-workflows}

**클라우드 기반 워크플로우와 로컬 개발 워크플로우는 Expo 앱을 개발하고 배포하는 두 가지 주요 접근 방식이다.**

선택한 방식에 따라 개발 프로세스와 앱 바이너리 생성 방법이 달라진다.

1. **클라우드 기반 개발 (EAS Build 사용)**:
   - EAS Build는 Expo의 클라우드 기반 빌드 서비스로, 개발자가 Android Studio나 Xcode를 설치하지 않고도 앱을 쉽게 컴파일할 수 있도록 해준다.
   - _`eas build` 명령을 실행하면 Expo의 클라우드 인프라에서 앱이 컴파일되며, 생성된 바이너리(APK 또는 IPA)를 다운로드할 수 있는 URL이 제공된다._
   - 클라우드 빌드를 사용하면 다른 팀원이나 이해 관계자와 앱을 쉽게 공유할 수 있다. 빌드 과정이 표준화되고 모든 사람이 동일한 환경에서 작업하게 된다.
   - 또한 EAS Build는 iOS 앱을 컴파일하기 위해 Mac 컴퓨터가 필요하지 않으므로, Windows나 Linux에서도 iOS 앱을 빌드할 수 있다.
2. **로컬 개발**:
   - 로컬 개발에서는 개발자 자신의 컴퓨터에 Android Studio와 Xcode를 설치해야 한다.
   - _네이티브 프로젝트 디렉토리(`android/ios`)를 생성하기 위해 `expo prebuild` 를 실행한다._
   - _그런 다음 Android Studio 또는 Xcode에서 직접 빌드를 실행하거나, `npx expo run:android` 또는 `npx expo run:ios` 명령을 사용하여 앱을 컴파일할 수 있다._
   - 로컬 개발은 네이티브 디버깅 도구를 사용하여 물리적 기기 또는 에뮬레이터/시뮬레이터에서 앱을 디버그해야 할 때 특히 유용하다.
   - 또한 로컬 개발에서는 네이티브 코드를 직접 수정하고 커스터마이징할 수 있는 유연성이 더 높다.

선택한 방식에 관계없이 JavaScript 코드와 Expo 구성은 동일하게 유지된다. **주요 차이점은 앱 바이너리를 생성하는 방법과 네이티브 코드를 다루는 방식이다.**

개발자는 프로젝트의 요구 사항과 선호하는 워크플로우에 따라 클라우드 기반 또는 로컬 개발을 선택할 수 있다. 두 가지 방식을 혼합하여 사용할 수도 있다. 예를 들어, 대부분의 개발 과정에서는 EAS Build를 사용하고, 네이티브 디버깅이 필요한 경우에만 로컬 개발을 사용할 수 있다.

자세한 내용은 [EAS Build를 사용한 클라우드 기반 워크플로우](https://docs.expo.dev/build/introduction/)와 [로컬 개발](https://docs.expo.dev/guides/local-app-development/)을 참조한다.

## 프로젝트 초기화 및 실행 {#intialize-and-run-a-project}

프로젝트 초기화 및 실행은 Expo 앱 개발을 시작하는 첫 단계다. 이 과정에서는 새 프로젝트를 만들고, 필요한 종속성을 설치하며, 개발 빌드를 생성하고 실행한다.

1. **프로젝트 생성**:
   - `create-expo-app` 명령어를 사용하여 새 Expo 프로젝트를 생성한다.
   - 이 명령어는 새 프로젝트를 위한 기본 구조와 필요한 구성 파일을 생성한다.
2. **Expo Go에서 실행 (선택 사항)**:
   - 빠른 실험이나 프로토타입 제작을 위해 프로젝트를 바로 Expo Go에서 실행할 수 있다.
   - 먼저 물리적 기기 또는 에뮬레이터/시뮬레이터에 Expo Go 앱을 설치한다.
   - 그런 다음 프로젝트 디렉토리에서 `npx expo start` 명령어를 실행하여 개발 서버를 시작한다.
   - Expo Go 앱을 열고 QR 코드를 스캔하거나 URL을 입력하여 프로젝트에 연결한다.
3. **개발 빌드 생성**:
   - 대부분의 경우, 프로젝트의 개발 빌드(Development Builds)를 생성하고 사용하게 된다.
   - 개발 빌드는 `expo-dev-client` 라이브러리를 포함하며, 이를 통해 추가 개발 도구와 기능을 사용할 수 있다.
   - 개발 빌드를 생성하기 전에 `npx expo install expo-dev-client` 명령어를 사용하여 `expo-dev-client` 라이브러리를 설치한다.
   - 개발 빌드는 EAS Build를 사용하여 클라우드에서 생성하거나, 로컬 컴퓨터에서 생성할 수 있다.
4. **EAS Build로 개발 빌드 생성 (선택 사항)**:
   - EAS Build를 사용하여 클라우드에서 개발 빌드를 생성하려면 `eas build` 명령어를 실행한다.
     - `npx eas build --profile development --platform android`
     - `npx eas build --profile development --platform ios`
   - EAS Build는 Expo의 클라우드 인프라를 사용하여 앱을 빌드하고, 생성된 바이너리를 다운로드할 수 있는 URL을 제공한다.
5. **로컬에서 개발 빌드 생성 및 실행 (선택 사항)**:
   - 로컬 컴퓨터에서 개발 빌드를 생성하려면 먼저 `npx expo prebuild` 명령어를 실행하여 네이티브 프로젝트 디렉토리를 생성한다.
   - 그런 다음 `npx expo run:android` 또는 `npx expo run:ios` 명령어를 사용하여 앱을 빌드하고 실행한다.
   - 로컬 개발을 위해서는 Android Studio와 Xcode를 설치해야 한다.

이러한 단계를 통해 Expo 프로젝트를 초기화하고 실행할 수 있다.

## 핵심 개발 루프 {#the-core-development-loop}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-guides-develop-an-app-with-expo/1.png)

위의 다이어그램에 설명된 핵심 개발 루프는 앱을 개발할 때 일반적으로 거치는 네 가지 주요 활동의 주기다.

- **JavaScript 코드 작성 및 실행**:
  - 여기에는 컴포넌트 생성, 비즈니스 로직 작성 또는 네이티브 코드 변경이 필요하지 않은 npm 라이브러리 설치를 포함한다. 여기서 변경된 사항은 앱의 네이티브 영역에 관계없이 앱에 반영된다.
- **앱 설정 업데이트**:
  - 여기에는 앱 설정 파일(`app.json/app.config.js`)을 사용하여 앱의 설정을 수정하는 것을 포함한다. 앱의 이름, 아이콘, 스플래시 화면 및 기타 속성 업데이트가 포함된다. 이러한 변경 사항이 모두 네이티브 프로젝트에 직접 영향을 미치는 것은 아니다. 그러나 네이티브 프로젝트에 영향을 미치는 변경을 하는 경우 [앱 설정](https://docs.expo.dev/workflow/configuration/)을 사용하여 네이티브 프로젝트 설정을 수정하거나 [설정 플러그인](https://docs.expo.dev/config-plugins/introduction/)을 생성하거나 사용할 수 있다. 앱 설정 파일에서 사용 가능한 속성의 전체 목록은 [앱 구성 레퍼런스](https://docs.expo.dev/versions/latest/config/app/)를 참조한다.
- **네이티브 코드 작성 또는 네이티브 프로젝트 구성 수정**:
  - 여기에는 네이티브 코드를 직접 작성하거나 네이티브 코드 구성을 수정하는 것을 포함한다. 이러한 변경을 수행하려면 네이티브 코드 프로젝트 디렉토리에 대한 액세스 권한이 필요하거나 [로컬 Expo Module](https://docs.expo.dev/modules/get-started/#adding-a-new-module-to-an-existing-application)을 사용하여 네이티브 코드를 작성할 수 있다.
- **네이티브 코드 수정이 필요한 라이브러리 설치**:
  - 여기에는 라이브러리가 네이티브 코드 프로젝트 구성을 변경해야 함을 의미한다. 라이브러리는 구성 플러그인이나 앱 구성을 업데이트하기 위한 단계를 제공한다. 이전 활동과 마찬가지로 이 작업에도 개발 빌드를 생성해야 한다.

개발 빌드를 생성할 때는 두 가지 옵션이 있다. EAS Build를 사용하여 클라우드 기반 빌드를 생성하거나 로컬에서 수행할 수 있다. 로컬에서 수행하기로 선택한 경우 CNG를 사용한 다음 `npx expo prebuild --clean`을 사용하거나 `npx expo run android|ios` 또는 Android Studio 및 Xcode를 사용하여 개발 빌드를 생성할 수 있다.

:::note
개발 빌드를 로컬에서 생성할 때 `npx expo run` 명령은 앱을 빌드하기 전에 네이티브 디렉토리를 생성한다. 첫 번째 빌드 후에 프로젝트 설정이나 네이티브 코드를 수정하는 경우 프로젝트를 다시 빌드해야 한다. `npx expo prebuild` 를 다시 실행하면 변경 사항이 기존 파일 위에 계층화된다. 또한 빌드 후에 다른 결과를 생성할 수 있다. 이를 방지하려면 프로젝트의 `.gitignore` 에 네이티브 디렉토리를 추가하고 `npx expo prebuild --clean` 명령을 사용한다.
:::

앱 개발 루프 동안 동일한 디바이스에 앱의 [다양한 변형(development, preview 또는 production)을 설치](https://docs.expo.dev/build-reference/variants/)할 수도 있다.

개발 루프의 또 다른 핵심 부분은 디버깅이다. 앱 디버깅에 대한 자세한 내용은 [런타임 이슈 디버깅](https://docs.expo.dev/debugging/runtime-issues/)과 [디버깅 도구](https://docs.expo.dev/debugging/tools/)를 참조한다.

## 테스터와 앱 공유 {#share-app-with-testers}

앱 개발의 다음 단계는 앱을 팀과 공유하고, 베타 테스터와 공유하거나, 여러 테스트 디바이스에서 실행하는 것이다. 전통적인 방법은 앱의 바이너리를 **Google Play 베타(Android)** 또는 **TestFlight(iOS)** 에 업로드하는 것이다. 이는 시간이 많이 걸리는 작업일 수 있으며 한 번에 하나의 활성 빌드로만 제한된다(예: TestFlight의 경우).

EAS Build를 사용하는 경우 [내부 배포](https://docs.expo.dev/build/internal-distribution/)를 통해 테스트를 위해 앱을 공유하는 방법에 대해 자세히 알아보는 것을 추천한다.

앱을 로컬에서 컴파일하는 경우 [로컬에서 릴리스 빌드](https://docs.expo.dev/deploy/build-project/#production-builds-locally)를 생성할 수 있다.

## 앱 스토어에 앱 출시 {#release-app-to-store}

앱 스토어에 앱을 출시하려면 [EAS Submit](https://docs.expo.dev/submit/introduction/)을 사용할 수 있다. EAS Submit 사용에 대한 자세한 내용은 [Google Play 스토어에 제출](https://docs.expo.dev/submit/android/) 및 [Apple App Store에 제출](https://docs.expo.dev/submit/ios/)을 참조한다.

로컬에서 릴리스 빌드를 생성하려면 [로컬에서 릴리스 빌드](https://docs.expo.dev/deploy/build-project/#production-builds-locally)를 참조한 다음 앱 스토어 가이드를 통해 앱을 제출한다.

## 프로덕션에서 앱 모니터링 {#monitor-app-in-production}

프로덕션 앱을 모니터링하는 두 가지 방법은 크래시 리포트와 분석이다. 크래시 리포트는 사용자가 앱을 사용하는 동안 발생하는 예외 또는 오류에 대해 알아볼 수 있도록 도와준다. 크래시 리포트를 활성화하려면 [Sentry](https://docs.expo.dev/guides/using-sentry/) 또는 [BugSnag](https://docs.bugsnag.com/platforms/react-native/expo/)를 사용할 수 있다.

분석을 통해 사용자가 앱과 상호 작용하는 방식을 추적할 수 있다. Expo 및 React Native 생태계에서 사용 가능한 서비스에 대해 자세히 알아보려면 [분석 개요](https://docs.expo.dev/guides/using-analytics/)를 참조한다.

## 앱 업데이트 {#update-the-app}

`expo-updates` 라이브러리를 사용하면 프로덕션 앱에서 앱의 JavaScript에 대한 즉각적인 업데이트를 프로그래밍 방식으로 사용할 수 있다.

[EAS Update](https://docs.expo.dev/eas-update/introduction/)를 사용하면 React Native 앱에서 즉각적인 업데이트를 지원한다. 글로벌 CDN의 엣지에서 업데이트를 제공하며 HTTP/3와 같은 최신 네트워킹 프로토콜을 지원하는 클라이언트에 사용한다. 또한 [EAS Build를 사용하는 개발자를 위해 맞춤 설정](https://docs.expo.dev/eas-update/develop-faster/)되어 있다. [로컬](https://docs.expo.dev/eas-update/build-locally/)에서 생성한 빌드에도 사용할 수 있다.
