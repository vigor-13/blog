---
title: 디바이스에서 실행하기
description:
date: 2024-06-06
tags: []
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/running-on-device',
    },
  ]
---

디바이스에서 React Native 앱을 실행하는 방법을 알아본다.

:::note
Expo를 사용하는 경우, `npm start` 를 실행할 때 표시되는 QR 코드를 스캔하여 Expo Go에서 디바이스로 앱을 실행할 수 있다.

자세한 내용은 [Expo 가이드](https://docs.expo.dev/get-started/expo-go/)를 참조한다.
:::

## Android

### Android 디바이스에서 앱 실행하기

#### 1. USB dubugging 활성화

기본적으로 Android 디바이스는 Google Play에서 다운로드한 앱만 설치하고 실행할 수 있다.

개발 중인 앱을 설치하려면 디바이스에서 <u>USB debugging</u>을 활성화해야 한다.

- 먼저 <u>Settings → About Phone → Software information</u>으로 이동한다.
- 하단의 `Build number` 항목을 일곱 번 탭하여 <u>Developer options</u> 메뉴를 활성화한다.
- 그런 다음 <u>Settings → Developer Options</u> 으로 돌아가 <u>USB debugging</u>을 활성화할 수 있다.

:::tabs#

@tab:active 1#1

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-running-on-device/1.png =30%x)

@tab 2#2

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-running-on-device/2.png =30%x)

@tab 3#3

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-running-on-device/3.png =30%x)

@tab 4#4

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-running-on-device/4.png =30%x)

:::

#### 2. USB로 디바이스 연결

USB로 디바이스를 개발 머신에 연결한다.

`adb devices` 명령을 실행하여 디바이스가 <u>ADB(Android Debug Bridge)</u>에 제대로 연결되어 있는지 확인한다.

```bash
$ adb devices
# List of devices attached
# emulator-5554 offline   # 구글 에뮬레이터
# 14ed2fcc device         # 물리적 디바이스
```

오른쪽 열에 `device` 가 표시되면 디바이스가 연결된 것이다.

<u>한 번에 하나의 디바이스만 연결</u>해야 한다.

:::note
목록에 `unauthorized` 가 표시되면 `adb reverse tcp:8081 tcp:8081` 명령을 실행하고 디바이스에서 <u>USB Debugging</u>을 허용해야 한다.
:::

#### 3. 앱 실행하기

프로젝트의 루트 디렉토리에서 다음 명령을 실행하여 디바이스에 앱을 설치하고 실행한다:

```bash
npm run android
```

:::warning

<u>bridge configuration isn't available</u> 오류가 발생하면 [adb reverse 사용](https://reactnative.dev/docs/running-on-device#method-1-using-adb-reverse-recommended)을 참조한다.

:::

:::tip
`React Native CLI` 를 사용하여 `release` 빌드를 생성하고 실행할 수도 있다.

(예: 프로젝트의 루트 디렉토리에서 `yarn android --mode release` 명령 실행)
:::

### 개발 서버에 연결하기

개발 서버에 연결하여 디바이스에서 앱을 빠르게 테스트하고 수정할 수 있다.

이를 위해서는 <u>USB 케이블</u>이나 <u>Wi-Fi 네트워크</u>를 사용할 수 있어야 하는데, 상황에 따라 적절한 방법을 선택할 수 있다.

#### 방법 1: adb reverse 사용 (권장)

다음과 같은 경우 이 방법을 사용할 수 있다.

- 디바이스가 <u>Android 5.0(Lollipop) 이상</u>을 실행
- <u>USB Debugging이 활성화</u>
- <u>USB를 통해 개발 머신에 연결</u>

명령 프롬프트에서 다음을 실행한다:

```bash
adb -s <device name> reverse tcp:8081 tcp:8081
```

디바이스 이름을 찾으려면 다음 명령을 실행한다:

```bash
adb devices
```

이제 [개발자 메뉴](https://reactnative.dev/docs/debugging#accessing-the-dev-menu)에서 실시간 리로딩을 활성화할 수 있다.

#### 방법 2: Wi-Fi를 통해 연결

Wi-Fi를 통해 개발 서버에 연결할 수도 있다.

먼저 USB 케이블을 사용하여 디바이스에 앱을 설치해야 하지만, 한 번 설치가 완료되면 다음 지침에 따라 무선으로 디버깅할 수 있다.

진행하기 전에 개발 머신의 현재 IP 주소가 필요하다. (IP 주소는 <u>시스템 설정(또는 시스템 환경설정) → 네트워크</u>에서 찾을 수 있다.)

1. 노트북과 휴대폰이 <u>동일한</u> Wi-Fi 네트워크에 연결되어 있는지 확인한다.
2. 디바이스에서 React Native 앱을 연다.
3. [빨간색 오류 화면](https://reactnative.dev/docs/debugging#in-app-errors-and-warnings)이 표시된다. 괜찮다. 다음 단계에서 이 문제를 해결할 것이다.
4. 앱 내 [개발자 메뉴](https://reactnative.dev/docs/debugging#accessing-the-dev-menu)를 연다.
5. <u>Dev Settings → Debug server host & port for device</u> 로 이동한다.
6. 머신의 IP 주소와 로컬 개발 서버의 포트를 입력한다(예: `10.0.1.1:8081`).
7. <u>개발자 메뉴</u>로 돌아가서 <u>JS Reload</u>를 선택한다.

이제 [개발자 메뉴](https://reactnative.dev/docs/debugging#accessing-the-dev-menu)에서 실시간 리로딩을 활성화할 수 있다.

### 프로덕션용 앱 빌드하기

앱을 완성했다면, 이제 Play 스토어에 출시만 남았다.

프로세스는 다른 네이티브 안드로이드 앱과 동일하지만, 고려해야 할 몇 가지 추가 사항이 있다.

자세한 내용은 [서명된 APK 생성 가이드](https://reactnative.dev/docs/signed-apk-android)를 참조한다.

## iOS

### iOS 디바이스에서 앱 실행하기

#### 1. USB로 디바이스 연결

USB 케이블을 사용하여 iOS 디바이스를 Mac에 연결한다.

프로젝트의 `ios` 폴더로 이동한 다음, Xcode를 사용하여 `.xcodeproj` 파일을 열거나, CocoaPods를 사용하는 경우에는 `.xcworkspace` 를 연다.

iOS 디바이스에서 앱을 처음 실행하는 경우, 개발을 위해 디바이스를 등록해야 한다.

Xcode 메뉴바에서 <u>Product</u> 메뉴를 연 다음, <u>Destination</u>으로 이동한다.

목록에서 사용자의 디바이스를 찾아 선택한다. 그러면 Xcode가 개발을 위해 디바이스를 등록할 것이다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-running-on-device/5.png =90%x)

#### 2. 코드 서명 구성

먼저 <u>Apple 개발자 계정</u>이 없다면 등록해야 한다.

Xcode 프로젝트 내비게이터에서 프로젝트를 선택한 다음, 메인 타겟을 선택한다(프로젝트와 동일한 이름).

<u>General</u> 탭에서 <u>Signing</u>으로 이동하여 <u>Team</u> 드롭다운 메뉴에서 Apple 개발자 계정 또는 팀이 선택되어 있는지 확인한다.

<u>테스트</u> 타겟(메인 타겟 아래에 있으며 <u>Tests</u>로 끝남)에 대해서도 동일하게 수행한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-running-on-device/6.png =90%x)

#### 3. 앱 빌드 및 실행

모든 설정이 올바르게 되어 있다면, Xcode 툴바에 빌드 대상으로 디바이스가 나열되고 Devices 창(`Shift ⇧ + Cmd ⌘ + 2`)에도 표시될 것이다.

이제 <u>Build and run</u> 버튼(`Cmd ⌘ + R`)을 누르거나 <u>Product</u> 메뉴에서 <u>Run</u>을 선택할 수 있다. 잠시 후 디바이스에서 앱이 실행될 것이다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-running-on-device/7.png)

:::note
문제가 발생하면 Apple의 [디바이스에서 앱 실행하기 문서](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html#//apple_ref/doc/uid/TP40012582-CH27-SW4)를 참조한다.
:::

### 개발 서버에 연결하기

개발 서버에 연결하여 디바이스에서 앱을 빠르게 테스트하고 수정할 수 있다.

컴퓨터와 동일한 Wi-Fi 네트워크에 연결되어 있기만 하면 된다.

디바이스를 흔들어 [개발자 메뉴](https://reactnative.dev/docs/debugging#accessing-the-dev-menu)를 열고 Live Reload를 활성화한다. JavaScript 코드가 변경될 때마다 앱이 다시 로드된다.

#### 트러블슈팅

:::warning

- 문제가 발생하면, 먼저 Mac 컴퓨터와 테스트용 모바일 디바이스가 같은 Wi-Fi에 연결되어 있는지 확인한다.
- 종종 공용 Wi-Fi에는 보안 때문에 연결된 디바이스들끼리 통신하지 못하게 막아놓은 경우가 있다. 이럴 때는 디바이스의 핫스팟 기능을 사용한다.
- 또 다른 방법은 USB 케이블로 Mac과 모바일 디바이스를 연결한 다음, Mac의 인터넷 연결을 모바일 디바이스에 공유하는 것이다. 이렇게 하면 마치 터널을 만든 것처럼 안정적이고 빠른 속도로 통신할 수 있다.

:::

개발 서버에 연결하려고 할 때 다음과 같은 오류 메시지와 함께 빨간색 에러 화면이 나타날 수 있다:

```text
Connection to http://localhost:8081/debugger-proxy?role=client timed out.
Are you running node proxy? If you are running on the device, check if you have the right IP address in RCTWebSocketExecutor.m.
```

이 문제를 해결하려면 다음 사항을 확인한다.

##### 1. Wi-Fi 네트워크

노트북과 휴대폰이 <u>동일한</u> Wi-Fi 네트워크에 연결되어 있는지 확인한다.

##### 2. IP 주소

빌드 스크립트가 컴퓨터의 IP 주소(예: `10.0.1.123`)를 올바르게 감지했는지 확인한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-running-on-device/8.png)

<u>Report navigator</u> 탭을 열고 마지막 <u>Build</u>를 선택한 다음 `IP=` 다음에 오는 IP 주소를 검색한다.

앱에 포함된 IP 주소는 컴퓨터의 IP 주소와 일치해야 한다.

### 프로덕션용 앱 빌드하기

앱을 완성했다면, 이제 앱 스토어에 출시만 남았다.

프로세스는 다른 네이티브 안드로이드 앱과 동일하지만, 고려해야 할 몇 가지 추가 사항이 있다.

자세한 내용은 [Apple App Store 게시 가이드](https://reactnative.dev/docs/publishing-to-app-store)를 참조한다.
