---
title: 스플래시 스크린
description: Expo 프로젝트를 위한 스플래시 화면을 만드는 방법과 기타 모범 사례를 알아본다.
date: 2024-04-11
tags: [splash_screen]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/user-interface/splash-screen/',
    },
  ]
---

splash 스크린, 또는 시작 화면은 사용자가 앱을 실행할 때 가장 먼저 보게 되는 화면이다. 이 화면은 앱이 로딩되는 동안 표시된다. 또한 네이티브 [SplashScreen API](https://docs.expo.dev/versions/latest/sdk/splash-screen/)를 사용하여 splash 스크린이 사라지는 시점을 제어할 수 있다.

## 앱의 Splash 스크린 설정하기 {#configure-the-splash-screen-for-your-app}

기본 splash 스크린은 흰색 빈 화면이다. 프로젝트의 `app.json` 에 있는 `splash` 키를 사용하여 이를 커스터마이징할 수 있다.

## Splash 이미지 만들기 {#make-a-splash-image}

splash 이미지를 만들기 위해 이 [Figma 템플릿](https://www.figma.com/community/file/1155362909441341285)을 사용할 수 있다. 이 템플릿은 Android와 iOS용 아이콘과 splash 이미지를 위한 최소한의 디자인을 제공한다.

자세한 과정은 아래 영상을 참고한다:

https://youtu.be/QSNkU7v0MPc

### Android {#android}

Android 화면 크기는 매우 다양하다. 이에 대처하는 한 가지 전략은 가장 일반적인 해상도를 살펴보고 그에 맞게 디자인하는 것이다. 기기와 해상도 목록은 [여기](https://material.io/resources/devices/)에서 볼 수 있다. splash 이미지를 자동으로 크기 조정 및 자를 수 있으므로, 화면에 정확히 맞출 필요가 없는 한 우리의 규격을 유지할 수 있다. 이는 Android와 iOS에 하나의 splash 이미지를 사용할 수 있어 편리하다. 이 가이드에서 읽어야 할 내용과 해야 할 작업이 줄어듭니다.

### iOS {#ios}

Expo는 기기 화면 크기에 따라 앱의 이미지 크기를 조정한다. [`splash.resizeMode`](https://docs.expo.dev/versions/latest/config/app/#resizemode) 를 사용하여 이미지 크기 조정에 사용되는 전략을 지정할 수 있다. 최신 화면 크기 목록은 iOS Human Interface Guidelines의 ['기기 화면 및 크기 사양'](https://developer.apple.com/design/human-interface-guidelines/layout#Specifications)을 참조한다.

## Splash 이미지를 .png로 내보내기 {#export-the-splash-image-as-a-png}

splash 스크린을 만든 후 `.png` 형식으로 내보내 `assets` 디렉토리에 저장한다. 현재는 `.png` 이미지만 지원된다. 다른 이미지 형식을 사용하면 앱의 프로덕션 빌드가 실패한다.

### splash.image 사용하기 {#using-splash-image}

`app.json` 을 열고 `splash.image` 의 값으로 새 splash 이미지를 가리키는 경로를 추가한다. 기본 파일명을 변경하지 않았다면 `./assets/splash.png` 가 되어야 한다.

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png"
    }
  }
}
```

splash 이미지 미리보기는 Expo Go 로컬 개발, 독립형 빌드 및 개발 빌드로 제한된다. 자세한 내용은 아래의 **환경 간 차이점** 섹션을 참조한다.

Expo Go에서 splash 이미지를 미리 보려면 Expo Go를 다시 열고 Expo CLI에서 프로젝트를 시작한다. 새 splash 스크린이 보일 것이다. 그러나 약간의 지연이 있을 수 있다.

:::note
Android에서는 알림 창의 새로 고침 버튼을 눌러야 한다. iOS에서는 `app.json` 의 splash 스크린 변경 사항을 보려면 Expo Go를 닫았다가 다시 열어야 한다.
:::

### splash.backgroundColor {#splash-backgroundColor}

splash 이미지의 배경색을 흰색이 아닌 다른 색상으로 설정하면 주변에 흰색 테두리가 보일 수 있다. 이는 기본값이 `#ffffff` 인 `splash.backgroundColor` 프로퍼티 때문이다.

이를 해결하려면 아래 예시와 같이 `splash.backgroundColor` 를 splash 이미지 배경색과 동일하게 설정한다:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#FEF9B0"
    }
  }
}
```

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-splash-screen/1.png)

### splash.resizeMode {#splash-resizeMode}

제공하는 모든 splash 이미지는 종횡비를 유지하고 사용자 기기의 해상도에 맞도록 크기가 조정된다.

크기 조정에는 `contain` (기본값)과 `cover`의 두 가지 전략을 사용할 수 있다. 두 경우 모두 splash 이미지는 splash 스크린 내에 있다. 이는 React Native `<Image>` 의 [`resizeMode`](https://reactnative.dev/docs/image/#resizemode) 와 유사하게 작동한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-splash-screen/2.png)

이를 예제에 적용하고 `backgroundColor`를 제거해 보자:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover"
    }
  }
}
```

결과는 다음과 같다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-splash-screen/3.png)

위 예시에서 이미지는 종횡비를 유지하면서 전체 너비를 채우도록 늘어난다. 그래서 splash 이미지의 로고가 `resizeMode` 가 `contain` 으로 설정된 경우보다 더 크게 보이는 것이다.

`contain` 과 `cover` 의 차이를 자세히 알아보려면 [블로그 글](http://blog.vjeux.com/2013/image/css-container-and-cover.html)을 참조한다.

## Android와 iOS용 커스텀 설정 {#custom-configuration-for-android-and-ios}

splash 옵션은 `app.json` 에서 `android` 나 `ios` 아래에 설정을 중첩하여 플랫폼별로 설정할 수 있다. 또한 각 플랫폼에서만 사용할 수 있는 특정 설정 옵션이 있다:

- Android에서는 `mdpi` 부터 `xxxhdpi` 까지 [다양한 기기 DPI](https://docs.expo.dev/versions/latest/config/app/#mdpi)에 대한 splash 이미지를 설정할 수 있다.
- iOS에서는 [`ios.splash.tabletImage`](https://docs.expo.dev/versions/latest/config/app/#tabletimage) 를 설정하여 iPad에서 다른 splash 이미지를 사용할 수 있다.

:::important
앱에서 Expo Prebuild(이전의 관리형 워크플로우)를 사용하여 네이티브 `android` 와 `iOS` 디렉토리를 생성하지 않는다면, `app.json` 의 변경 사항은 아무런 효과가 없을 것이다. 자세한 내용은 [여기](https://github.com/expo/expo/tree/main/packages/expo-splash-screen#-installation-in-bare-react-native-projects)를 참조한다.
:::

### Android의 splash 스크린 API 제한 사항 {#splash-screen-api-limitations-on-android}

Android에서는 대부분의 경우 iOS와 동일하게 splash 스크린이 동작한다. 독립형 Android 애플리케이션의 경우에는 약간의 차이가 있다. 이 시나리오에서는 `app.json` 내의 `android.splash` 설정에 특별히 주의를 기울여야 한다.

`resizeMode` 에 따라 Android는 다음과 같이 동작한다:

- `contain` - splash 스크린 API는 splash 이미지를 늘리거나 축소할 수 없다. 결과적으로 `contain` 모드에서는 먼저 배경색만 표시되고, 초기 뷰 계층이 마운트될 때 `splash.image` 가 표시된다.
- `cover` - 같은 이유로 `contain` 과 동일한 제한이 있다.
- `native` - 이 모드에서는 애플리케이션이 시작되는 동안 Android의 정적 비트맵 표시 기능을 활용한다. Android는 iOS와 달리 제공된 이미지를 늘리는 것을 지원하지 않으므로, 애플리케이션은 주어진 이미지를 화면 중앙에 표시한다. 기본적으로 `splash.image` 가 `xxxdpi` 리소스로 사용된다. 기대에 부합하고 화면 크기에 맞는 그래픽을 제공하는 것은 여러분의 몫이다. 이를 위해 mdpi부터 xxxhdpi까지 [다양한 기기 DPI에 맞는 다른 해상도](https://docs.expo.dev/versions/latest/config/app/#mdpi)를 사용해야 한다.

### 환경 간 차이점 {#differences-between-environments}

앱은 Expo Go에서 열리거나 독립형 앱으로 열릴 수 있으며, 게시되거나 개발 중일 수 있다. 이러한 환경 간에는 splash 스크린 동작에 약간의 차이가 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-splash-screen/4.gif)

- 왼쪽은 Expo Go에서 현재 개발 중인 프로젝트를 로드한다. splash 스크린 하단에 JavaScript 준비 및 기기로 다운로드와 관련된 정보를 보여주는 정보 표시줄이 있다. 배경색이 즉시 설정되므로 splash 이미지가 나타나기 전에 주황색 화면이 보인다. 그러나 이미지는 다운로드되어야 한다.
- 가운데는 Expo Go가 게시된 앱을 로드한다. splash 이미지가 즉시 나타나지 않거나 전혀 나타나지 않을 수 있다.
- 오른쪽은 독립형 앱이다. splash 이미지가 즉시 나타난다.

### iOS 캐싱 {#ios-caching}

커스텀 iOS 빌드에서는 빌드 간에 시작 화면이 캐시로 남아 있어 새 이미지 테스트가 어려울 수 있다. Apple은 다시 빌드하기 전에 파생 데이터 폴더를 지울 것을 권장한다. 이는 Expo CLI에서 다음을 실행하여 수행할 수 있다:

```bash
npx expo run:ios --no-build-cache
```

시작 화면 테스트에 대한 자세한 내용은 Apple의 [가이드](https://developer.apple.com/documentation/technotes/tn3118-debugging-your-apps-launch-screen)를 참조한다.
