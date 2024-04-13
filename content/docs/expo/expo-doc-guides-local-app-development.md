---
title: 로컬 앱 개발
description: Expo를 사용할 때 로컬에서 앱을 컴파일하고 빌드하는 방법을 알아본다.
date: 2024-04-03
modified: 2024-04-13
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/guides/local-app-development/',
    },
  ]
---

로컬 머신을 사용하여 프로젝트를 앱으로 빌드하려면 디버그 빌드를 테스트하거나 앱 스토어에 제출할 프로덕션 빌드를 생성하기 전에 수동으로 네이티브 코드를 생성해야 한다. 앱을 로컬에서 빌드하는 방법에는 두 가지가 있다. 이 가이드에서는 두 가지 방법에 대한 간단한 소개하고 여기에 필요한 다른 가이드에 대한 참조를 제공한다.

:::important 네이티브 코드 생성 & 디버그 빌드 & 프로덕션 빌드

1. **네이티브 코드 생성**:
   - 수동으로 네이티브 코드를 생성할 때는 일반적으로 `expo prebuild` 명령을 사용한다.
   - 이 명령은 iOS 및 Android용 네이티브 프로젝트 디렉토리를 생성하고, Expo 설정 파일(`app.json/app.config.js`)을 기반으로 네이티브 프로젝트 파일을 생성하거나 수정한다.
   - 이렇게 생성된 네이티브 코드는 Xcode 또는 Android Studio에서 열어 수정할 수 있다.
2. **디버그 빌드**:
   - 디버그 빌드는 개발 및 테스트 목적으로 사용되는 앱 버전이다.
   - 디버그 빌드에는 개발자 도구, 추가 로깅, 핫 리로딩 등의 기능이 포함되어 있어 개발 과정에서 유용하다.
   - Expo CLI의 `expo run:ios` 또는 `expo run:android` 명령을 사용하거나, Xcode 또는 Android Studio에서 직접 디버그 빌드를 생성할 수 있다.
3. **프로덕션 빌드**:
   - 프로덕션 빌드는 앱 스토어에 제출하거나 최종 사용자에게 배포할 준비가 된 앱 버전이다.
   - 프로덕션 빌드는 코드 서명, 최적화, 불필요한 개발자 도구 제거 등의 추가 단계를 거친다.
   - Xcode 또는 Android Studio를 사용하여 프로덕션 빌드를 생성하고, 필요한 설정 및 빌드 설정을 수동으로 조정해야 한다.

:::

## 사전 준비 사항 {#prerequisites}

아래 지침을 참조하여 개발 환경을 설정하는 방법을 확인한다.

:::tabs

@tab:active Android#android

macOS에서 Android용 개발 환경을 설정하려면 `Node.js`, `Watchman`, `JDK` 및 `Android Studio`를 설치해야 한다.

**1. 종속성 설치하기**

[Homebrew](https://brew.sh/)와 같은 패키지 관리자를 사용하여 다음 종속성을 설치한다.

1. `nvm` 또는 `volta` 와 같은 [버전 관리 도구](https://nodejs.org/en/download/package-manager)를 사용하여 Node.js의 LTS 릴리스를 설치한다. (이미 시스템에 Node.js를 설치했다면 버전이 16 이상인지 확인한다.)

2. [Homebrew](https://brew.sh/)와 같은 도구를 사용하여 [Watchman을 설치](https://facebook.github.io/watchman/docs/install#macos)한다.

```bash
brew install watchman
```

3. Homebrew를 사용하여 Azul Zulu라는 OpenJDK 배포를 설치한다. (이 배포판은 M1 및 Intel Mac용 JDK를 제공한다.)

```bash
# SDK 50 이상
# JDK 17을 권장한다. 터미널 창에서 다음 명령을 실행하여 설치한다:
brew tap homebrew/cask-versions
brew install --cask zulu17
```

JDK를 설치한 후 `~/.bash_profile`(또는 Zsh를 사용하는 경우 `~/.zshrc`)에 `JAVA_HOME` 환경 변수를 추가한다:

```text
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

**2. Android Studio 설치 및 설정하기**

Android Stuido에서는 안드로이드 SDK, 안드로이드 SDK 플랫폼, 안드로이드 가상 디바이스를 설치할 수 있다. 이러한 도구는 Android 개발 환경을 설정하는 데 필요하다. [Android Studio 에뮬레이터의 지침](https://docs.expo.dev/workflow/android-studio-emulator/)에 따라 이러한 도구를 설치한다.

@tab iOS#iOS

> _macOS는 iOS용 네이티브 코드로 프로젝트를 빌드하는 데 필요하다. 개발 빌드를 생성하여 iOS 기기에 빌드를 설치할 수 있다._

iOS용 macOS에서 개발 환경을 설정하려면 `Node.js`, `Watchman`, `Xcode` 및 `CocoaPods` 을 설치해야 한다.

[Homebrew](https://brew.sh/)와 같은 패키지 관리자를 사용하여 다음 종속성을 설치한다.

**1. 종속성 설치하기**

1. `nvm` 또는 `volta` 와 같은 [버전 관리 도구](https://nodejs.org/en/download/package-manager)를 사용하여 Node.js의 LTS 릴리스를 설치한다. (이미 시스템에 Node.js를 설치했다면 버전이 16 이상인지 확인한다.)

2. [Homebrew](https://brew.sh/)와 같은 도구를 사용하여 [Watchman을 설치](https://facebook.github.io/watchman/docs/install#macos)한다.

```bash
brew install watchman
```

3. [App Store](https://apps.apple.com/us/app/xcode/id497799835?mt=12)를 사용하여 Xcode를 설치한다. 이 도구는 iOS 시뮬레이터도 함께 설치한다. [Xcode Command Line Tools](https://docs.expo.dev/workflow/ios-simulator/#install-xcode-command-line-tools)도 설치해야 한다.

4. [CocoaPod을 설치한다.](https://guides.cocoapods.org/using/getting-started.html) 최신 macOS 버전과 함께 제공되는 Ruby 버전을 사용하여 설치할 수 있다.

:::

## 로컬 앱 컴파일 {#local-app-compilation}

프로젝트를 로컬에서 빌드하려면 Expo CLI의 컴파일 명령을 사용할 수 있다. 이 명령은 `android/ios` 디렉토리를 생성한다:

```bash
# Android 네이티브 프로젝트 빌드
npx expo run:android

# iOS 네이티브 프로젝트 빌드
npx expo run:ios
```

위의 명령은 로컬에 설치된 Android SDK 또는 Xcode를 사용하여 **프로젝트를 컴파일하고 앱의 디버그 빌드를 생성한다.**

- 위의 명령은 빌드 전에 먼저 `npx expo prebuild` 를 실행하여 네이티브 디렉토리(`android/ios`)를 생성한다. 디렉토리가 이미 존재하면 이 단계는 건너뛴다.
- `--device` 플래그를 추가하여 앱을 실행할 디바이스를 선택할 수 있다. 물리적으로 연결된 디바이스나 에뮬레이터/시뮬레이터를 선택할 수 있다.
- `--variant release`(Android) 또는 `--configuration Release`(iOS)를 전달하여 [앱의 프로덕션 버전](https://docs.expo.dev/deploy/build-project/#production-builds-locally)을 빌드할 수 있다.

첫 번째 빌드 후에 프로젝트의 설정이나 네이티브 코드를 수정하려면 프로젝트를 다시 빌드해야 한다. `npx expo prebuild` 를 다시 실행하면 변경 사항이 기존 파일 위에 계층화된다. 때문에 빌드 후에 다른 결과를 생성할 수도 있다.

이를 방지하려면 프로젝트의 `.gitignore` 에 네이티브 디렉토리를 추가하고 `npx expo prebuild --clean` 명령을 사용한다. 이렇게 하면 프로젝트가 항상 관리되고, `--clean` 플래그가 디렉토리를 재생성하기 전에 기존 디렉토리를 삭제한다. 앱 설정을 사용하거나 설정 플러그인을 만들어 네이티브 디렉토리 내에서 프로젝트의 설정이나 코드를 수정할 수 있다.

컴파일과 prebuild가 어떻게 작동하는지 자세히 알아보려면 다음 가이드를 참조한다:

- [Expo CLI로 컴파일하기](https://docs.expo.dev/more/expo-cli/#compiling)
- [Prebuild](https://docs.expo.dev/workflow/prebuild/)

## expo-dev-client를 사용한 로컬 빌드 {#local-builds-with-expo-dev-client}

**프로젝트에 `expo-dev-client` 를 설치하면 프로젝트의 디버그 빌드에 `expo-dev-client` UI와 도구가 포함되며, 이를 개발 빌드라고 부른다.**

```bash
npx expo install expo-dev-client
```

개발 빌드를 생성하려면 로컬 앱 컴파일 명령(`npx expo run:[android|ios]`)을 사용할 수 있다. 이 명령은 디버그 빌드를 생성하고 개발 서버를 시작한다.

## EAS를 사용한 로컬 빌드 {#local-builds-with-eas}

- [자체 인프라 환경에서 빌드 실행하기](https://docs.expo.dev/build-reference/local-builds/)
