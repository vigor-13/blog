---
title: 프로젝트 생성하기
description: 새 Expo 프로젝트를 만들고 기기에서 실행하는 방법을 알아본다.
date: 2024-04-02
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/get-started/create-a-project/',
    },
  ]
---

새로운 Expo 프로젝트를 실행하는 과정은 세 단계로 구성된다. 먼저 새 프로젝트를 초기화한 다음, Expo CLI로 개발 서버를 시작하고 마지막으로 Expo Go를 사용하여 기기에서 앱을 열어 변경 사항을 실시간으로 확인한다.

## 새 프로젝트 초기화 {#initialize-a-new-app}

새 프로젝트를 초기화하려면 다음 명령을 실행한다:

```bash
# my-app이라는 이름의 프로젝트 생성
npx create-expo-app my-app

# 프로젝트 디렉토리로 이동
cd my-app
```

:::note
`create-expo-app` 명령과 함께 `--template` 옵션을 사용할 수도 있다.

`npx create-expo-app --template` 를 실행하여 사용 가능한 템플릿 목록을 확인한다.
:::

## 개발 서버 시작 {#start-the-development-server}

개발 서버를 시작하려면 다음 명령을 실행한다:

```bash
npx expo start
```

위 명령을 실행하면 Expo CLI가 [Metro Bundler](https://docs.expo.dev/guides/customizing-metro/)를 시작한다. 이 번들러는 **[Babel](https://babeljs.io/)을 사용하여 앱의 JavaScript 코드를 컴파일하고 Expo 앱에 제공하는 HTTP 서버다.** 이 프로세스에 대한 자세한 내용은 [Expo 개발 서버](https://docs.expo.dev/more/expo-cli/#develop) 문서를 참조한다.

## 기기에서 앱 열기 {#open-the-app-on-your-device}

Expo Go가 이미 설치된 기기에서 앱을 열려면:

- Android 기기에서: Expo Go 앱의 **홈** 탭에서 **QR 코드 스캔**을 누르고 터미널에 표시된 QR 코드를 스캔한다.
- iPhone 또는 iPad에서: 기본 Apple **카메라** 앱을 열고 터미널에 표시된 QR 코드를 스캔한다.

여러 기기에서 동시에 프로젝트를 열 수 있다.

:::note 기기에서 앱이 로드되지 않는 경우

먼저, 컴퓨터와 기기가 동일한 Wi-Fi 네트워크에 연결되어 있는지 확인한다.

그래도 작동하지 않는다면, 라우터 구성 때문일 수 있다. 이는 공용 네트워크에서 흔히 발생한다. 이 문제를 해결하려면 개발 서버를 시작할 때 **Tunnel** 연결 유형을 선택한 다음 QR 코드를 다시 스캔한다.

```bash
npx expo start --tunnel
```

**Tunnel** 연결 유형을 사용하면 앱 리로드 속도가 **LAN** 또는 **로컬**에 비해 상당히 느려지므로, 가능한 경우 터널을 피하는 것이 가장 좋다. 네트워크의 다른 기기에서 컴퓨터에 액세스하려면 **터널**이 필요한 경우, 개발 속도를 높이기 위해 에뮬레이터/시뮬레이터를 설치하는 것이 좋다.
:::

:::note 에뮬레이터 또는 시뮬레이터를 사용하는 경우
에뮬레이터/시뮬레이터를 사용하는 경우, 다음 플랫폼 중 하나에서 앱을 열기 위해 다음과 같은 Expo CLI 키보드 단축키가 있다:

- `a` 를 누르면 Android 에뮬레이터 또는 연결된 기기에서 열린다.
- `i` 를 누르면 iOS 시뮬레이터에서 열린다.
- `w` 를 누르면 웹 브라우저에서 열린다. Expo는 모든 주요 브라우저를 지원한다.

:::

## App.js에서 첫 번째 변경 사항 만들기 {#make-your-first-change-in-appjs}

이제 시작하기 위한 모든 단계가 완료되었다.

코드 편집기에서 **App.js** 파일을 열고 기존 `<Text>`의 내용을 `Hello, world!` 로 변경하면 기기에서 업데이트되는 것을 볼 수 있을 것이다.
