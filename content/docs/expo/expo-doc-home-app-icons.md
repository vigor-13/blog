---
title: 앱 아이콘
description: Android 및 iOS용 앱 아이콘 설정 및 모범 사례에 대해 알아본다.
date: 2024-04-12
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/user-interface/app-icons/',
    },
  ]
---

앱 아이콘은 사용자의 기기 홈 화면과 앱 스토어에서 보게 되는 앱의 얼굴이다. Android와 iOS는 서로 다른 엄격한 요구사항이 있다.

## 앱 아이콘 설정하기 {#configure-an-apps-icon}

가장 간단한 방법은 `app.json` 의 [`icon`](https://docs.expo.dev/versions/latest/config/app/#icon) 프로퍼티에 로컬 경로나 원격 URL을 값으로 제공하는 것이다.

하지만 Expo에서는 각 플랫폼별로 다른 값을 제공할 수도 있다. 예를 들어 Android용 아이콘은 `android.icon` 을, iOS용 아이콘은 `ios.icon` 을 사용할 수 있다. 이러한 프로퍼티가 제공되면 각 플랫폼의 기본 `icon` 보다 우선한다.

대부분의 프로덕션 수준 앱은 Android와 iOS 간에 약간 다른 아이콘을 사용할 것이다.

## 앱 아이콘 만들기 {#create-an-app-icon}

앱 아이콘을 만들기 위해 이 [Figma 템플릿](https://www.figma.com/community/file/1155362909441341285)을 사용할 수 있다. 이 템플릿은 Android와 iOS용 아이콘과 splash 이미지를 위한 최소한의 디자인을 제공한다.

자세한 과정은 아래 영상을 참고한다:

https://youtu.be/QSNkU7v0MPc

## 커스터마이징 및 모범 사례 {#customization-and-best-practices}

### Android {#android}

[`android.adaptiveIcon`](https://docs.expo.dev/versions/latest/config/app/#adaptiveicon) 프로퍼티를 사용하면 Android 아이콘을 더욱 커스터마이징할 수 있으며, 이는 앞서 언급한 두 가지 설정을 모두 무시한다.

Android Adaptive Icon은 "전경 이미지"와 "배경색 또는 이미지", 두 개의 별도 레이어로 구성된다. 이를 통해 OS가 아이콘을 다양한 모양으로 마스킹할 수 있고 시각 효과도 지원한다. Android 13 이상에서는 OS가 배경화면과 테마를 사용하여 기기 테마에 의해 설정된 색상을 결정하는 테마 앱 아이콘을 지원한다.

제공하는 런처 아이콘에 대한 디자인은 [Android Adaptive Icon 가이드라인](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)을 따라야 한다. 또한:

- `.png` 파일을 사용한다.
- 전경 이미지 경로를 지정하려면 `android.adaptiveIcon.foregroundImage` 프로퍼티를 사용한다.
- 단색 이미지 경로를 지정하려면 `android.adaptiveIcon.monochromeImage` 프로퍼티를 사용한다.
- 기본 배경색은 흰색이다. 다른 배경색을 지정하려면 `android.adaptiveIcon.backgroundColor` 프로퍼티를 사용한다. 대신 `android.adaptiveIcon.backgroundImage` 프로퍼티를 사용하여 배경 이미지를 지정할 수도 있다. 전경 이미지와 동일한 크기인지 확인한다.

`android.icon` 프로퍼티를 사용하여 Adaptive Icon을 지원하지 않는 이전 Android 기기를 위해 별도의 아이콘을 제공할 수도 있다. 이 단일 아이콘은 전경과 배경 레이어의 조합이 될 것이다.

:::note
전문적으로 보이는 아이콘을 만들기 위해 다른 배경화면에서 아이콘을 테스트하고 제품 워드마크 옆에 텍스트를 피하는 등 [Apple의 모범 사례](https://developer.apple.com/design/human-interface-guidelines/app-icons/#Best-practices) 중 일부를 따르는 것이 좋다. 적어도 512x512 픽셀 이상을 제공해야 한다. iOS에는 이미 1024x1024가 필요하다.
:::

### iOS {#ios}

iOS의 경우 앱 아이콘은 [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons/)를 따라야 한다. 또한:

- `.png` 파일을 사용한다.
- `1024x1024` 가 적당한 크기다. Expo 관리형 프로젝트라면 EAS Build가 다른 크기를 생성해 줄 것이다. 베어 워크플로우 프로젝트라면 직접 아이콘을 생성해야 한다. EAS Build가 생성하는 가장 큰 크기는 `1024x1024` 이다.
- 아이콘은 정확히 정사각형이어야 한다. 예를 들어 `1023x1024` 아이콘은 유효하지 않다.
- 둥근 모서리나 다른 투명한 픽셀 없이 아이콘이 사각형 전체를 채우도록 한다. 운영 체제가 적절할 때 아이콘을 마스킹할 것이다.
