---
title: 개발 빌드 만들기
description: 프로젝트의 개발 빌드를 만드는 방법을 알아본다.
date: 2024-04-12
tags: [development_build]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/development-builds/create-a-build/',
    },
  ]
---

:::note
EAS가 아닌 로컬에서 개발 빌드를 만들려면 [`npx expo run:[android|ios]`](https://docs.expo.dev/guides/local-app-development/#local-builds-with-expo-dev-client) 또는 [`eas build --local`](https://docs.expo.dev/build-reference/local-builds/) 명령을 사용하여 로컬 빌드를 생성할 수 있다.
:::

개발 빌드는 EAS Build를 사용하거나 Android Studio와 Xcode가 설치된 컴퓨터에서 로컬로 만들 수 있다.

이 가이드에서는 EAS로 개발 빌드를 만들고 에뮬레이터/시뮬레이터 또는 실제 기기에 설치하는 방법을 알아본다.

## 사전 준비 {#prerequisites}

EAS Build를 사용하는 React Native Android/iOS 프로젝트가 필요하다. 아직 프로젝트를 구성하지 않았다면 이 [문서](https://docs.expo.dev/build/setup/)를 참조한다.

## 방법 {#instructions}

다음 지침은 Android와 iOS, 실제 기기와 에뮬레이터를 모두 다룬다. 여러분의 프로젝트에 맞는 지침을 사용할 수 있다.

### 1. expo-dev-client 설치 {#install-expo-dev-client}

```bash
npx expo install expo-dev-client
```

### 2. eas.json 설정 확인 {#verify-your-eas-json-configuration}

처음 `eas build` 명령을 실행하면 프로젝트 디렉토리 루트에 [`eas.json`](https://docs.expo.dev/build/eas-json/) 파일이 생성된다. `eas.json` 에는 `development` , `preview` , `production` 의 세 가지 기본 빌드 프로필이 포함되어 있다. `eas.json` 을 처음 초기화한 이후 development 프로필을 제거했다면 지금 다시 추가해야 한다.

최소 설정은 다음과 같다:

```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

위의 `development` 프로필에서 설정한 옵션은 다음과 같다:

- [`developmentClient`](https://docs.expo.dev/eas/json/#developmentclient) 를 `true` 로 설정하여 디버그 빌드를 생성한다. 또한 Android 기기나 에뮬레이터 또는 iOS 기기에 설치할 수 있는 빌드 아티팩트를 생성한다([내부 배포](https://docs.expo.dev/build/internal-distribution/)).
- iOS 기기용 빌드에는 **Apple Developer Program 멤버십**이 필요하다. 없다면 iOS 시뮬레이터용으로만 빌드할 수 있다. 자세한 내용은 다음 단계를 참조한다.

:::note
`developmentClient` 가 빌드 프로필에서 `true` 로 설정된 iOS 빌드는 항상 `internal` 배포해야 한다. TestFlight용으로 배포하는 경우 `distribution` 을 `store` 로 설정해야 한다.
:::

### 3. 에뮬레이터/시뮬레이터용 빌드 생성 {#create-a-build-for-emulator-or-simulator}

아래 단계에 따라 Android 에뮬레이터 또는 iOS 시뮬레이터에 개발 빌드를 생성하고 설치한다.

:::note
이는 에뮬레이터/시뮬레이터에서 프로젝트를 개발하려는 경우에만 필요합니다. 기기를 사용한다면 이 단계를 스킵해도 된다.
:::

각 플랫폼마다 따라야 할 특정 지침이 있다:

:::tabs

@tab:active Android 에뮬레이터#android

Android 에뮬레이터에 개발 빌드를 생성하고 설치하려면 `.apk` 파일이 필요하다. 생성하려면 다음 명령을 실행한다:

```bash
eas build --profile development --platform android
```

빌드가 완료되면 CLI에서 Android 에뮬레이터에 자동으로 다운로드하고 설치할 것인지 묻는 메시지가 표시된다. 메시지가 표시되면 `Y` 를 눌러 에뮬레이터에 직접 설치한다.

자세한 내용은 [Android 에뮬레이터 및 기기용 APK 빌드](https://docs.expo.dev/build-reference/apk/#installing-your-build)를 참조한다.

@tab iOS 시뮬레이터#ios

iOS 시뮬레이터에 개발 빌드를 생성하고 설치하려면 시뮬레이터용 별도의 빌드 프로필을 만든 다음 `eas.json` 에서 `ios.simulator` 옵션을 `true` 로 설정한다.

예를 들어 아래의 `development-simulator` 프로필은 iOS 시뮬레이터용 개발 빌드를 만드는 데에만 사용된다:

```json
{
  "build": {
    "development-simulator": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
  }
}
```

그런 다음 다음 명령을 실행하여 iOS 시뮬레이터에서 개발 빌드를 생성한다:

```bash
eas build --profile development-simulator --platform ios
```

빌드가 완료되면 CLI에서 iOS 시뮬레이터에 자동으로 다운로드하고 설치할 것인지 묻는 메시지가 표시된다. 메시지가 표시되면 `Y` 를 눌러 시뮬레이터에 직접 설치한다.

자세한 내용은 [시뮬레이터에 빌드 설치](https://docs.expo.dev/build-reference/simulators/#installing-build-on-the-simulator)를 참조한다.
:::

### 4. 기기용 빌드 생성 {#create-a-build-for-the-device}

아래 단계에 따라 Android 또는 iOS 기기에 개발 빌드를 생성하고 설치한다.

:::tabs

@tab:active Android 기기의 경우#android

Android 에뮬레이터용 개발 빌드를 만들었다면 별도의 기기용 빌드를 만들 필요가 없다. 동일한 `.apk` 파일이 두 시나리오에서 모두 작동한다.

Android 기기에 개발 빌드를 생성하고 설치하려면 `.apk` 가 필요하다. 생성하려면 다음 명령을 실행한다:

```bash
eas build --profile development --platform android
```

빌드가 완료되면 빌드 세부 정보 페이지 또는 `eas build` 가 완료될 때 제공되는 링크에서 `.apk` URL을 복사한다. 그런 다음 해당 URL을 기기로 보내고 기기에서 열어 .apk를 다운로드하고 설치할 수 있다.

@tab iOS 기기의 경우#ios

> iOS 기기에 개발 빌드를 생성하고 설치하려면 Apple Developer 멤버십이 필요하다.

[ad hoc 프로비저닝 프로필](https://docs.expo.dev/build/internal-distribution/#22-configure-app-signing-credentials-for-ios)에 개발하려는 iOS 기기를 등록하려면 다음 명령을 실행한다:

```bash
eas device:create
```

iOS 기기를 등록한 후 다음 명령을 실행하여 개발 빌드를 생성할 수 있다:

```bash
eas build --profile development --platform ios
```

> iOS 16 이상을 실행하는 기기는 개발 빌드를 설치하기 위해 특수한 OS 수준의 개발자 모드를 활성화해야 한다. 이 설정을 활성화하지 않았거나 기기에 처음으로 개발 빌드를 설치하는 경우 활성화 방법은 [iOS 개발자 모드](https://docs.expo.dev/guides/ios-developer-mode/)를 참조한다.

빌드가 완료되면 Expo CLI의 QR 코드를 기기의 카메라로 스캔하여 iOS 기기에 다운로드할 수 있다. QR 코드는 `eas build` 명령 실행이 끝났을 때 제공된다.

[Expo 대시보드](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/builds)의 빌드 페이지에서도 이 QR 코드를 찾을 수 있다. **Install** 버튼을 클릭하고 시스템 카메라를 사용하여 QR 코드를 스캔한다.
:::
