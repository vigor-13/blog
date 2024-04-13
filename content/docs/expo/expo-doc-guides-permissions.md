---
title: 권한
description: 앱 설정 파일에서 권한을 설정하고 추가하는 방법에 대해 알아본다.
date: 2024-04-14
tags: [permission]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/guides/permissions/',
    },
  ]
---

**네이티브 앱에서 특정 기능을 사용하려면 해당 기능에 필요한 권한을 사용자로부터 받아야 한다.** 예를 들어, 카메라를 사용하려면 카메라 권한을, 위치 정보를 사용하려면 위치 정보 권한을 사용자에게 요청하고 허가받아야 한다.

독립형 빌드(standalone build)와 개발 빌드(development build)에서 이러한 권한을 요청하려면, 앱을 빌드하기 전에 네이티브 코드 수준에서 필요한 권한을 미리 설정해야 한다. 이를 "네이티브 빌드 타임 설정"이라고 한다.

예를 들어 **Android에서는 `AndroidManifest.xml` 파일에, iOS에서는 `Info.plist` 파일에 필요한 권한을 명시해야 한다.** 이렇게 네이티브 수준에서 권한을 설정해야만, JavaScript 코드에서 해당 권한을 요청할 수 있다.

반면, Expo Go 앱은 이미 대부분의 일반적인 권한이 미리 설정되어 있는 개발용 클라이언트 앱이다. 따라서 Expo Go에서 프로젝트를 실행할 때는 별도의 권한 설정 없이도 JavaScript 코드에서 바로 권한을 요청할 수 있다.

그러나 앱스토어나 플레이스토어에 앱을 게시할 때는 독립형 빌드나 개발 빌드를 사용해야 하므로, 반드시 네이티브 수준에서 권한을 적절히 설정해야 한다.

만약 필요한 권한을 제대로 설정하지 않았거나, 해당 권한이 앱에 필요한 이유를 적절히 설명하지 않았다면, 앱스토어나 플레이스토어의 심사 과정에서 앱이 거절될 수 있다. 또한 이미 출시된 앱이라도 권한 문제로 인해 스토어에서 삭제될 수 있다.

따라서 앱을 개발할 때는 해당 앱에 어떤 권한이 필요한지 면밀히 검토하고, 네이티브 수준에서 필요한 권한을 적절히 설정해야 한다. 그리고 각 권한이 앱에 필요한 이유를 사용자에게 잘 설명할 수 있어야 한다. 이를 통해 심사 과정을 원활히 통과하고, 사용자의 신뢰를 얻을 수 있다.

## Android {#android}

Android의 권한은 앱 설정(`app.json`, `app.config.js`)의 `expo.android.permissions` 및 `expo.android.blockedPermissions` 키로 설정한다.

대부분의 권한은 앱에서 사용하는 라이브러리에 의해 [설정 플러그](https://docs.expo.dev/config-plugins/plugins-and-mods/#create-a-plugin)인 또는 패키지 수준의 `AndroidManifest.xml` 을 통해 자동으로 추가되므로 `android.permissions` 를 사용하여 추가 권한을 추가할 필요가 거의 없다.

패키지 수준의 `AndroidManifest.xml` 파일에 의해 추가된 권한을 제거하는 유일한 방법은 [`expo.android.blockedPermissions`](https://docs.expo.dev/versions/latest/config/app/#blockedpermissions) 속성을 사용하여 차단하는 것이다. 그리고 이때 전체 권한 이름을 지정해야 한다. 예를 들어 `expo-av` 에서 추가한 오디오 녹음 권한을 제거하려면 다음과 같이 설정한다:

```json
{
  "expo": {
    "android": {
      "blockedPermissions": ["android.permission.RECORD_AUDIO"]
    }
  }
}
```

- 기본 [prebuild 템플릿](https://docs.expo.dev/workflow/prebuild/#templates)에 포함된 권한에 대해 알아보려면 [`expo.android.permissions`](https://docs.expo.dev/versions/latest/config/app/#permissions) 를 참조한다.
- 정당한 사유 없이 위험하거나 서명된 권한을 사용하는 앱은 Google에 의해 거부될 수 있다. 앱을 제출할 때 [Android 권한 모범 사례](https://developer.android.com/training/permissions/usage-notes)를 따르도록 한다.
- [사용 가능한 모든 Android Manifest.permissions](https://developer.android.com/reference/android/Manifest.permission).

## iOS {#ios}

iOS 앱은 사용자에게 시스템 권한을 요청할 수 있다. 예를 들어 기기의 카메라를 사용하거나 사진에 액세스하려면 Apple에서는 앱이 해당 데이터를 어떻게 사용하는지에 대한 설명을 요구한다. 대부분의 패키지는 설정 플러그인과 함께 주어진 권한에 대한 기본 사유를 자동으로 제공한다. 앱이 앱 스토어에 승인되려면 이러한 기본 메시지를 특정 사용 사례에 맞게 조정해야 할 가능성이 높다.

권한 메시지를 설정하려면 앱 설정(`app.json`, `app.config.js`)의 `expo.ios.infoPlist` 키를 사용한다.

예를 들면 다음과 같다:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "이 앱은 이벤트 티켓의 바코드를 스캔하기 위해 카메라를 사용합니다."
      }
    }
  }
}
```

이러한 속성 중 상당수는 해당 속성을 추가하는 라이브러리와 관련된 [설정 플러그인](https://docs.expo.dev/config-plugins/introduction/) 속성을 사용하여 직접 설정할 수도 있다. 예를 들어 [`expo-media-library`](https://docs.expo.dev/versions/latest/sdk/media-library/) 로 사진 권한 메시지를 다음과 같이 설정할 수 있다:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-media-library",
        {
          "photosPermission": "$(PRODUCT_NAME)에서 사진에 액세스하도록 허용합니다.",
          "savePhotosPermission": "$(PRODUCT_NAME)에서 사진을 저장하도록 허용합니다."
        }
      ]
    ]
  }
}
```

- `Info.plist` 의 변경 사항은 OTA 업데이트할 수 없으며, 예를 들어 `eas build` 를 사용하여 새 네이티브 바이너리를 제출할 때만 배포된다.
- Apple의 공식 [권한 메시지 권장 사항](https://developer.apple.com/design/human-interface-guidelines/privacy#Requesting-permission).
- [사용 가능한 모든 `Info.plist` 속성](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html).

## 웹 {#web}

웹에서는 카메라 및 위치와 같은 권한을 [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts#When_is_a_context_considered_secure)에서만 요청할 수 있다. 예를 들어 `https://` 또는 `http://localhost` 를 사용하는 경우다. 이 제한은 Android의 매니페스트 권한 및 iOS의 infoPlist 사용 메시지와 유사하며 개인정보를 보호하기 위해 시행된다.

## 권한 재설정 {#resetting-permissions}

사용자가 권한을 거부할 때 앱이 정상적으로 반응하는지 확인하기 위해 종종 권한이 거부되는 경우를 테스트해야 한다. Android와 iOS 모두에서 운영 체제 수준의 제한으로 인해 앱이 동일한 권한을 한 번 이상 요청하는 것이 금지된다(권한이 거부된 후 사용자에게 반복해서 권한을 요구하는 것이 얼마나 불편할 수 있는지 상상해보자). 개발 중에 권한과 관련된 다양한 흐름을 테스트하려면 네이티브 앱을 제거하고 다시 설치해야 할 수 있다.

Expo Go에서 테스트할 때는 `npx expo start` 를 실행하고 Expo CLI 터미널 UI에서 `i` 또는 `a` 를 눌러 앱을 삭제하고 재설치할 수 있다.
