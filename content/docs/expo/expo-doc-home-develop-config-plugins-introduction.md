---
title: 설정 플러그인 소개
description:
date: 2024-04-02
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/config-plugins/introduction/',
    },
  ]
---

기본적으로 프로젝트에 네이티브 모듈을 추가할때 관련 설정은 자동으로 처리된다. 하지만 때로는 모듈이 더 복잡한 설정을 요구하기도 한다. 이 때 설정 플러그인(config plugin)을 사용하면 모듈에 맞게 네이티브 프로젝트를 자동으로 구성하고, 네이티브 프로젝트와의 직접적인 상호 작용을 피함으로써 복잡성을 줄일 수 있다.

## 설정 플러그인이란? {#what-is-a-config-plugin}

설정 플러그인은 [앱 설정](https://docs.expo.dev/workflow/configuration/)을 확장하고 앱의 사전 빌드(prebuild) 프로세스를 커스터마이징하는 시스템이다. 기본적으로 포함되지 않은 네이티브 모듈을 추가하거나, 추가 설정이 필요한 네이티브 코드를 추가하는 데 사용할 수 있다.

내부적으로 Expo CLI는 설정 플러그인을 사용하여 관리되는 프로젝트의 모든 네이티브 코드를 생성하고 구성한다. 플러그인은 앱 아이콘 생성, 앱 이름 설정, **AndroidManifest.xml**, **Info.plist** 등을 구성하는 작업을 수행한다.

**플러그인은 네이티브 프로젝트를 위한 번들러와 같다.** `npx expo prebuild` 를 실행하면 모든 프로젝트 플러그인을 평가하여 프로젝트를 번들링한다. 이렇게 하면 **android**와 **ios** 디렉토리가 생성된다. 이 디렉토리는 생성된 후 수동으로 수정할 수 있지만, 수동 수정 사항을 덮어쓸 가능성이 있기 때문에 더 이상 안전하게 재생성할 수 없다.

## 설정 플러그인 사용하기 {#use-a-config-plugin}

Expo 설정 플러그인은 대부분 Node.js 모듈에서 제공된다. 프로젝트의 다른 패키지와 마찬가지로 설치할 수 있다.

예를 들어, `expo-camera` 에는 **AndroidManifest.xml**과 **Info.plist**에 카메라 권한을 추가하는 플러그인이 있다. 프로젝트에 설치하려면 다음 명령을 실행한다:

```bash
npx expo install expo-camera
```

앱의 설정(**app.json** 또는 **app.config.js**)에서 `expo-camera` 를 플러그인 목록에 추가할 수 있다:

```json
// app.json
{
  "expo": {
    "plugins": ["expo-camera"]
  }
}
```

`expo-camera` 와 같은 일부 플러그인은 두 번째 인자로 옵션을 전달하여 커스터마이징 할 수 있다:

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
        }
      ]
    ]
  }
}
```

:::note
설정 플러그인을 사용할 수 있는 각 Expo 패키지에 대한 자세한 정보는 [해당 패키지의 API 레퍼런스](https://docs.expo.dev/versions/latest/)에서 찾을 수 있다.
:::

`npx expo prebuild` 를 실행하면 `mods` 가 컴파일되고 네이티브 파일이 변경된다.

변경 사항은 Xcode와 같은 도구로 네이티브 프로젝트를 다시 빌드할 때까지 적용되지 않는다. **관리되는 앱에서 설정 플러그인을 사용하는 경우 `eas build` 중 사전 빌드 단계에서 적용된다.**

:::important
`npx expo prebuild` 명령을 실행하면 Expo CLI는 프로젝트의 설정 파일(**app.json** 또는 **app.config.js**)을 읽고, 정의된 설정 플러그인을 실행한다. 이 과정에서 플러그인은 네이티브 프로젝트에 필요한 변경 사항을 생성한다. 이를 `mods` 라고 한다.

`mods` 는 네이티브 프로젝트의 특정 부분을 수정하거나 추가하는 일련의 작업이다. 예를 들어, `expo-camera` 플러그인은 **AndroidManifest.xml**과 **Info.plist** 파일에 카메라 권한을 추가하는 `mods` 를 생성한다. 이런 식으로 각 플러그인은 해당 기능을 활성화하는 데 필요한 네이티브 코드 변경 사항을 생성한다.

`npx expo prebuild` 명령은 이러한 `mods` 를 컴파일하여 **android** 및 **ios** 디렉토리에 적용한다. 그러나 이 변경 사항이 실제 앱에 반영되려면 네이티브 프로젝트를 다시 빌드해야 한다. 이는 일반적으로 Xcode(iOS용) 또는 Android Studio(Android용)와 같은 IDE를 사용하여 수행된다.

하지만 관리되는 앱(managed app)에서 설정 플러그인을 사용하는 경우, `eas build` 명령을 사용하여 앱을 빌드할 때 사전 빌드 단계에서 플러그인이 자동으로 적용된다. 관리되는 앱은 Expo가 네이티브 프로젝트를 관리하고 빌드 프로세스를 처리하는 앱을 의미한다.

`eas build` 는 Expo의 클라우드 빌드 서비스로, 개발자가 직접 네이티브 빌드 환경을 설정하지 않고도 앱을 빌드할 수 있도록 해준다. `eas build` 를 실행하면 다음과 같은 일이 일어난다:

1. Expo 서버는 프로젝트의 소스 코드를 받는다.
2. 서버는 프로젝트의 설정 파일을 읽고 정의된 설정 플러그인을 실행하여 `mods` 를 생성한다.
3. 생성된 `mods` 는 네이티브 프로젝트에 적용된다.
4. 업데이트된 네이티브 프로젝트가 빌드되어 앱 바이너리(IPA 또는 APK)가 생성된다.

따라서 관리되는 앱에서는 `eas build` 를 실행할 때 설정 플러그인이 자동으로 적용되므로, 개발자가 별도로 `npx expo prebuild` 를 실행하고 네이티브 프로젝트를 수동으로 빌드할 필요가 없다.

이 자동화된 프로세스 덕분에 관리되는 앱에서 설정 플러그인을 사용하는 것이 훨씬 간편해진다. 개발자는 앱의 설정 파일에 플러그인을 추가하고 `eas build` 를 실행하기만 하면 되며, Expo가 나머지 작업을 처리한다.
:::
