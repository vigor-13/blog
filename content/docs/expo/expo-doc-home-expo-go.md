---
title: Expo Go
description: Android 및 iOS에서 React Native를 학습하고 실험할 수 있는 무료 오픈소스 샌드박스 앱인 Expo Go에 대해 알아본다.
date: 2024-04-02
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/get-started/expo-go/',
    },
  ]
---

[Expo Go](https://expo.dev/client)는 Android 및 iOS 기기에서 React Native를 학습하고 실험할 수 있는 무료 [오픈 소스](https://github.com/expo/expo/tree/main/apps/expo-go) 샌드박스다. 앱 스토어에서 직접 설치할 수 있으며 몇 분 안에 시작할 수 있다. 네이티브 툴체인을 설치하고 앱을 컴파일할 필요가 없다.

Expo Go는 프로덕션 수준의 앱을 빌드하는 데 권장되지 않는다. 대신 [개발 빌드](https://docs.expo.dev/develop/development-builds/introduction/)를 사용한다. 또한 [앱 배포](https://docs.expo.dev/deploy/build-project/)에도 권장되지 않는다. Expo Go에서 작업하면서 배운 모든 것을 개발 빌드로 이전할 수 있으며, 샌드박스 환경에서 새로운 아이디어를 시도하고 싶을 때 다시 Expo Go를 사용할 수 있다. 시작하기에 좋은 환경이다!

## 기기에 Expo Go 설치하기 {#install-expo-go-on-your-device}

Android Play Store와 iOS App Store 모두에서 사용할 수 있다.

- Android Play Store - Android Lollipop(5) 이상
- iOS App Store - iOS 13 이상

프로젝트에서 `npx expo start` 를 실행하면 Expo CLI가 개발 서버를 시작하고 QR 코드를 생성한다. Android에서는 기기에서 Expo Go 앱을 열고 QR 코드를 스캔하여 개발 서버에 연결할 수 있다. iOS에서는 기기의 카메라를 사용하여 QR 코드를 스캔한다.

```bash
npx expo start
```

:::note Expo Go의 작동방식 이해하기
![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-expo-go/1.png)

Expo Go가 개발 서버에 연결되면 개발 서버는 프로젝트를 설명하는 JSON **매니페스트** 파일을 반환한다. Expo Go는 이 매니페스트를 사용하여 JavaScript 번들과 프로젝트를 실행하는 데 필요한 모든 에셋을 다운로드한다. 그런 다음 JavaScript 엔진은 이 JavaScript 번들을 실행하여 React Native 앱을 렌더링한다.

매니페스트는 웹의 **index.html**과 유사하다. 루트 URL `/` 에서 제공되며 `bundleUrl` 에서 프로젝트 스크립트 코드를 다운로드할 수 있다. 매니페스트는 앱 구성(**app.json**, **app.config.js**)을 사용하여 커스터마이징 할 수 있다. `icon` 과 `splash` 와 같은 추가 필드를 사용하여 Expo Go 또는 `expo-dev-client` 가 앱을 표시하는 방식을 커스터마이징할 수 있다.

```json
{
  "name": "My New Project",
  "entryPoint": "index.js",
  "bundleUrl": "http://localhost:8081/index.bundle?platform=ios"
}
```

이 예시 매니페스트에서는 프로젝트의 이름이 "My New Project"로 설정되어 있고, 진입점은 "index.js" 파일이며, iOS 플랫폼용 번들 URL이 지정되어 있다. Expo Go는 이 정보를 사용하여 앱을 로드하고 실행한다.
:::

:::important Expo Go와 개발 서버 간의 상호 작용

1. 개발 서버 시작:

   - `npx expo start` 명령을 실행하면 Expo 개발 서버를 시작한다.
   - 개발 서버는 로컬 머신에서 실행되며, 일반적으로 `http://localhost:8081`과 같은 URL에서 접근할 수 있다.

2. Expo Go 앱 실행:

   - 사용자가 모바일 기기에서 Expo Go 앱을 실행한다.
   - Expo Go 앱은 개발 서버에 연결하기 위해 QR 코드 스캔 또는 링크를 통해 서버의 URL을 입력받는다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-expo-go/2.png =60%x)

3. 매니페스트 파일 요청:

   - Expo Go 앱이 개발 서버에 연결되면, 루트 URL `/`에 매니페스트 파일을 요청한다.
   - 개발 서버는 `app.json` 또는 `app.config.js` 에 정의된 앱 구성을 기반으로 매니페스트 파일을 생성하고 JSON 형식으로 반환한다.

4. 매니페스트 파일 분석:

   - Expo Go 앱은 받은 매니페스트 파일을 분석하여 앱의 이름, 아이콘, 시작 화면 등의 메타데이터를 추출한다.
   - 매니페스트 파일에는 JavaScript 번들의 URL(`bundleUrl`)과 앱의 진입점(`entryPoint`)도 포함되어 있다.

5. JavaScript 번들 다운로드:

   - Expo Go 앱은 매니페스트 파일에 명시된 `bundleUrl` 을 사용하여 JavaScript 번들을 다운로드한다.
   - JavaScript 번들은 앱의 실제 코드와 로직을 포함하고 있다.

6. 에셋 다운로드:

   - JavaScript 번들 외에도 Expo Go 앱은 매니페스트 파일에 명시된 에셋(이미지, 폰트 등)을 다운로드한다.
   - 에셋은 앱의 UI를 구성하는 데 사용된다.

7. JavaScript 번들 실행:

   - 모든 필요한 리소스가 다운로드되면, Expo Go 앱은 JavaScript 번들을 실행한다.
   - JavaScript 번들은 일반적으로 React Native 코드로 이루어져 있으며, 앱의 UI를 렌더링하고 사용자 상호 작용을 처리한다.

8. 앱 렌더링:
   - JavaScript 번들이 실행되면, React Native는 네이티브 컴포넌트를 사용하여 앱의 UI를 렌더링한다.
   - Expo Go 앱은 렌더링된 UI를 표시하고 사용자가 앱과 상호 작용할 수 있도록 한다.

:::

### SDK 버전 {#sdk-versions}

Expo Go는 여러 **SDK 버전**을 지원한다. 새로운 Expo SDK 버전은 일년에 약 3회 출시된다. 새 버전이 Expo Go에 추가될 때마다 이전 버전이 제거된다. Expo Go 앱의 설정 페이지로 이동하여 지원되는 SDK 버전을 확인할 수 있다.

:::note 지원되지 않는 SDK 버전으로 프로젝트를 여는 경우는 어떻게 될까?
지원되지 않는 SDK 버전으로 생성된 프로젝트를 Expo Go에서 실행할 때 다음과 같은 오류가 표시된다:

```text
"Project is incompatible with this version of Expo Go"
```

이 문제를 해결하려면 프로젝트를 [지원되는 SDK 버전](https://docs.expo.dev/versions/latest/#each-expo-sdk-version-depends-on-a-react-native-version)으로 업그레이드하는 것이 좋다. 업그레이드하는 방법을 알아보려면 [프로젝트를 새 SDK 버전으로 업그레이드하기](https://docs.expo.dev/get-started/expo-go/#how-do-i-upgrade-my-project-from)를 참조한다.
:::

:::note 지원되지 않는 SDK 버전에서 프로젝트를 업그레이드하려면 어떻게 해야 할까?
특정 SDK 버전으로 업그레이드하는 방법은 [Expo SDK 업그레이드 가이드](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)를 참조한다.
:::

:::note 프로젝트를 실행하기 위해 이전 버전의 Expo Go를 설치하려면 어떻게 할까?
프로젝트를 최신 SDK 버전으로 업그레이드할 수 없는 경우, 이전 버전의 Expo Go를 사용하여 프로젝트를 실행할 수 있다. 그러나 이 방법은 물리적인 iOS 디바이스에서는 작동하지 않는다. 왜냐하면 iOS에서는 앱을 직접 설치할 수 없기 때문이다. 물리적인 iOS 디바이스에서 프로젝트를 실행해야 하는 경우, [개발 빌드](https://docs.expo.dev/develop/development-builds/introduction/)를 생성하는 것을 고려한다.

물리적인 Android 디바이스에서 이 방법을 사용하려는 경우, 디바이스를 컴퓨터에 연결하고 **USB 디버깅** 옵션을 활성화한다.

에뮬레이터나 시뮬레이터에서 실행하려면 [Android 에뮬레이터](https://docs.expo.dev/workflow/android-studio-emulator/)와 [iOS 시뮬레이터](https://docs.expo.dev/workflow/ios-simulator/)를 참조한다.

1. 설치된 경우, 디바이스 또는 시뮬레이터에서 Expo Go를 제거한다.
2. 개발 서버를 시작한다:

```bash
npx expo start
```

3. **a** 또는 **i**를 눌러 Android 또는 iOS에서 앱을 실행한다. 그러면 호환되는 Expo Go가 디바이스/시뮬레이터에 다운로드 및 설치되고 클라이언트에서 프로젝트가 열린다.

호환되는 버전의 Expo Go가 자동으로 디바이스 또는 시뮬레이터에 설치되고 프로젝트가 실행된다.
:::

## Expo 계정으로 로그인 {#log-in-with-your-expo-account}

설치가 완료된 후 Expo Go 앱을 연다. Expo CLI로 계정을 만든 경우 **홈** 탭의 상단 헤더에 있는 **로그인** 버튼을 클릭하여 로그인할 수 있다. 로그인하면 개발하는 동안 Expo Go 앱에서 프로젝트를 더 쉽게 열 수 있다. 앱의 **홈** 탭에 있는 **프로젝트** 섹션 아래에 자동으로 나타난다.

:::note
때로는 별도의 물리적 기기에서가 아니라 컴퓨터에서 직접 앱을 실행하는 것이 유용할 수 있다. [Android 에뮬레이터](https://docs.expo.dev/workflow/android-studio-emulator/) 및 [iOS 시뮬레이터(macOS만 해당)](https://docs.expo.dev/workflow/ios-simulator/) 에서 자세히 알아볼 수 있다.
:::
