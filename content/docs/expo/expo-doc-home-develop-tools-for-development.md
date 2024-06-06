---
title: 개발 도구
description: Expo로 앱을 만드는 과정에서 유용하게 사용할 수 있는 도구와 웹사이트들을 소개한다.
date: 2024-06-02
tags: []
references:
  [{ key: 'Expo 공식 문서', value: 'https://docs.expo.dev/develop/tools/' }]
---

Expo 앱 개발 과정에서 알아두면 좋은 도구와 웹사이트들이 있다. 여기서는 이러한 도구들을 간단히 소개한다.

## Expo CLI {#expo-cli}

Expo CLI는 앱 개발을 도와주는 도구다. 새 프로젝트를 만들 때 `expo` 패키지와 함께 자동으로 설치된다. `npx` 를 통해 사용할 수 있다.

Expo CLI는 앱 개발 단계에서 개발자가 더 빠르게 작업을 수행할 수 있도록 설계되었다.

앱을 개발하는 동안 Expo CLI에서 자주 사용하는 명령은 다음과 같다:

| 명령                            | 설명                                                                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npx expo start`                | 개발 서버를 시작한다.                                                                                                                                                                      |
| `npx expo prebuild`             | [Prebuild](https://docs.expo.dev/workflow/prebuild/)를 사용하여 네이티브 Android 및 iOS 디렉토리를 생성한다.                                                                               |
| `npx expo run:android`          | 네이티브 Android 앱을 로컬에서 컴파일한다.                                                                                                                                                 |
| `npx expo run:ios`              | 네이티브 iOS 앱을 로컬에서 컴파일한다.                                                                                                                                                     |
| `npx expo install package-name` | 새 라이브러리를 설치하거나 `--fix` 옵션을 이 명령에 추가하여 프로젝트의 특정 라이브러리를 검증 및 업데이트한다.                                                                            |
| `npx expo lint`                 | ESLint를 [설정 및 구성](https://docs.expo.dev/guides/using-eslint/)한다. ESLint가 이미 구성된 경우 이 명령은 [프로젝트 파일을 린트](https://docs.expo.dev/guides/using-eslint/#usage)한다. |

정리하면, Expo CLI는 앱 개발의 여러 단계에서 우리를 도와주는 든든한 조력자라고 할 수 있다. 앱을 만들고, 빌드하고, 실행하는 등 다양한 작업을 Expo CLI를 통해 할 수 있다.

:::note
자세한 내용은 [문서](https://docs.expo.dev/more/expo-cli/)를 참조한다.
:::

## EAS CLI {#expo-cli}

EAS CLI를 통해서 Expo 계정 로그인, EAS Build, Update, Submit 등의 다양한 EAS 서비스를 사용할 수 있다.

또한 EAS CLI를 사용하여 다음과 같은 작업들을 할 수 있다:

- 앱 스토어에 앱 배포
- 앱의 개발, 미리보기 또는 프로덕션 빌드 생성
- Over-the-air (OTA) 업데이트 생성
- 앱 자격 증명 관리
- iOS 기기용 임시 프로비저닝 프로파일 생성

EAS CLI를 사용하려면 다음 명령을 실행하여 로컬 머신에 전역으로 설치해야 한다:

```bash
npm install -g eas-cli
```

터미널 창에서 `eas --help` 를 사용하여 사용 가능한 명령에 대해 자세히 알아볼 수 있다.

:::note
자세한 내용은 [문서](https://www.npmjs.com/package/eas-cli)를 참조한다.
:::

## Orbit {#orbit}

Orbit은 macOS와 Windows용 앱으로, 다음과 같은 기능을 제공한다:

- EAS에서 빌드한 앱을 실제 기기나 에뮬레이터에 설치하고 실행할 수 있다.
- EAS에서 업데이트된 내용을 Android 에뮬레이터나 iOS 시뮬레이터에 적용하고 실행할 수 있다.
- Android 에뮬레이터나 iOS 시뮬레이터에서 snack 프로젝트를 실행할 수 있다.
- 내 컴퓨터에 있는 파일을 이용해서 앱을 설치하고 실행할 수 있다.
  - Orbit은 Android용 `.apk` 파일, iOS 시뮬레이터용 `.app` 파일, 또는 `ad hoc` 방식으로 서명된 앱을 지원한다.
- EAS 대시보드에서 고정된 프로젝트 목록을 볼 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-develop-tools-for-development/1.gif)

### 설치 {#installation}

:::tabs

@tab:active macOS#mac-os

Homebrew로 Orbit을 다운로드하거나 [GitHub 릴리스](https://github.com/expo/orbit/releases)에서 직접 다운로드할 수 있다.

```bash
brew install expo-orbit
```

로그인할 때 Orbit이 자동으로 시작되도록 하려면 메뉴 바에서 Orbit 아이콘을 클릭한 다음 **Settings**에서 **Launch on Login** 옵션을 선택한다.

@tab Windows#windows

:::

:::note
Orbit을 사용하려면 몇 가지 준비물이 필요하다.

- macOS와 Windows에서는 Android SDK가 설치되어 있어야 한다.
- macOS에서는 `xcrun` 이라는 도구도 필요한데, 기기를 관리하는 데 사용된다.

:::

## VS Code용 Expo 도구 {#expo-tools-for-vscode}

Expo Tools는 앱 설정 파일을 작업할 때 도움을 주는 VS Code 확장 프로그램이다.

앱 설정, EAS 설정, 스토어 설정, Expo 모듈 설정 파일 등에 대한 자동 완성 및 인텔리센스 기능을 제공한다.

:::note Expo Tools VS Code 확장 프로그램 설치

- 이 [링크](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)에 접속하여 확장 프로그램을 설치
- VS Code 편집기에서 직접 Expo Tools를 검색하여 설치.

:::

또한 VS Code의 내장 디버거를 사용하여 앱을 디버깅할 수 있다. 중단점 설정, 변수 검사, 디버그 콘솔을 통한 코드 실행 등이 가능하다.

:::note
디버깅과 관련하여 자세한 내용은 [문서](https://docs.expo.dev/debugging/tools/#debugging-with-vs-code)를 참조한다.
:::

## Snack과 Expo Go로 프로토타입 테스트하기 {#test-prototype-with-snack-and-expo-go}

### Snack {#snack}

Snack은 Expo Go와 유사하게 작동하는 브라우저 내 개발 환경이다.

컴퓨터에 어떤 도구도 다운로드하지 않고 React Native로 테스트하고 코드 스니펫을 공유하는 좋은 방법이다.

[snack.expo.dev](https://snack.expo.dev/)에서 사용해볼 수 있다.

### Expo Go {#expo-go}

Expo Go는 React Native를 배우고 테스트할 수 있는 무료 오픈 소스 샌드박스다. Android와 iOS에서 작동한다.

:::note
앱 스토어에 배포할 프로덕션 앱을 구축하는 데는 권장되지 않는다. 대신 [개발 빌드](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build)를 사용한다.
:::

:::note
자세한 내용은 [문서](https://docs.expo.dev/get-started/set-up-your-environment/?mode=expo-go)를 참조한다.
:::

## React Native 디렉토리 {#react-native-directory}

개발 빌드로 Expo 프로젝트를 만들면, React Native와 호환되는 모든 라이브러리를 사용할 수 있다. 개발 빌드는 Expo의 기본 기능 외에도 React Native의 모든 기능을 활용할 수 있게 해주는 빌드 방식이다.

필요한 라이브러리가 Expo SDK에 포함되어 있지 않은 경우 [reactnative.directory](https://reactnative.directory/)를 사용하면 도움이 된다. 이 웹사이트는 React Native 라이브러리들을 모아놓은 데이터베이스다. 여기서 내 프로젝트에 맞는 라이브러리를 검색하고 찾을 수 있다.

라이브러리를 사용하기 전에, React Native 기본 라이브러리, Expo SDK 라이브러리, 그리고 서드파티 라이브러리의 차이를 이해하는 게 중요하다.

- React Native 기본 라이브러리는 React Native에 내장된 라이브러리다.
- Expo SDK 라이브러리는 Expo에서 제공하는 추가적인 라이브러리다.
- 서드파티 라이브러리는 React Native 커뮤니티나 개발자들이 만든 라이브러리다.

이 [가이드](https://docs.expo.dev/workflow/using-libraries/)를 읽어보면 이런 라이브러리들의 차이점을 자세히 알 수 있다. 그리고 서드파티 라이브러리가 내 프로젝트에 잘 맞는지, 호환이 되는지 판단하는 방법도 배울 수 있다.
