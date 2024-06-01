---
title: 개발 환경 설정하기
description: Expo로 개발을 시작하기 위해 개발 환경을 설정하는 방법에 대해 알아본다.
date: 2024-06-01
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/get-started/create-a-project/',
    },
  ]
---

Android와 iOS에서 프로젝트를 실행하기 위한 로컬 개발 환경을 설정해야 한다.

## 어떤 환경에서 개발할 것인가? {#where-would-you-like-to-develop}

- Android 기기
- Android 에뮬레이터
- iOS 기기
- iOS 시뮬레이터

실제 사용자가 보게 될 것과 정확히 동일한 환경을 경험할 수 있기 때문에, 실제 기기에서 개발하는 것을 추천한다.

## 어떤 방법으로 개발할 것인가? {#how-would-you-like-to-develop}

- **Expo Go**
  - Expo Go는 Expo를 빠르게 테스트할 수 있는 샌드박스 환경이다, 안전하고 제한된 환경에서 Expo 앱을 테스트해볼 수 있다.
  - Expo에서 기본적으로 제공하는 기능들만 사용할 수 있다. 커스텀 기능을 추가할 수는 없댜.
  - Expo를 처음 접하는 경우 빠르고 쉽게 시험해보기에 적합하다. 다만, 본격적인 앱을 만들기에는 좀 제한적이다.
- **개발 빌드(Development Build)**
  - Expo의 개발자 도구가 포함되어 있어서, 필요한 다양한 기능을 추가할 수 있다. 개발자가 만든 커스텀 기능도 사용할 수 있다.
  - 실제 사용자들에게 제공할 앱을 만들 때 개발 빌드를 사용한다.

## 개발 환경 설정하기 {#set-up-environment}

### Expo Go를 사용하는 경우

:::tabs

@tab:active Android 기기#adnroid-device

[구글 플레이 스토어](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs)에서 Expo Go를 다운로드 한다.

@tab Android 에뮬레이터#android-emulator

@tab iOS 기기#ios-device

[앱 스토어](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs)에서 Expo Go를 다운로드 한다.

@tab iOS 시뮬레이터#ios-simulator

:::

### 개발 빌드를 사용하는 경우

:::tabs

@tab:active Android 기기#adnroid-device

@tab Android 에뮬레이터#android-emulator

@tab iOS 기기#ios-device

@tab iOS 시뮬레이터#ios-simulator

:::
