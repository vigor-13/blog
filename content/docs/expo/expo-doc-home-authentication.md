---
title: 인증
description: Expo 프로젝트에서 인증 설정에 대해 알아본다.
date: 2024-04-17
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/authentication/',
    },
  ]
---

Expo는 다양한 인증 방식을 지원하여 개발자가 쉽게 앱에 로그인 기능을 추가할 수 있도록 도와준다. 주요 내용은 다음과 같다:

1. [**`expo-auth-session` 패키지**](https://docs.expo.dev/versions/latest/sdk/auth-session/)
   - 이 패키지는 [브라우저 기반 인증](https://docs.expo.dev/versions/latest/sdk/auth-session/#how-web-browser-based-authentication-flows-work)을 Expo 앱에 통합할 수 있는 가장 간단한 방법이다.
   - OAuth 또는 OpenID Connect를 사용하는 인증 공급자와 호환된다.
   - Android, iOS 및 웹 플랫폼에서 동일한 코드로 사용할 수 있어 개발 과정을 단순화한다.
   - 사용자는 기본 웹 브라우저 또는 WebView를 통해 인증 과정을 진행하게 된다.
2. **타사 공급자용 네이티브 라이브러리**
   - Expo의 개발 빌드에서는 타사 공급자(예: Google, Facebook 등)에서 제공하는 네이티브 인증 라이브러리를 사용할 수 있다.
   - 이러한 라이브러리는 해당 플랫폼(Android 또는 iOS)에 최적화된 인증 경험을 제공한다.
   - 네이티브 라이브러리를 사용하면 앱 내에서 직접 로그인 화면을 표시할 수 있으며, 웹 브라우저로 전환할 필요가 없다.
   - 단, Expo의 관리형 워크플로우(managed workflow)에서는 이러한 네이티브 라이브러리를 직접 사용할 수 없으며, [개발 빌드(development build)](https://docs.expo.dev/develop/development-builds/create-a-build/)를 통해 사용해야 한다.

Expo에서 제공하는 인증 옵션은 다음과 같은 이점이 있다:

- 다양한 인증 공급자를 지원하여 개발자가 선호하는 방식을 선택할 수 있다.
- `expo-auth-session`을 사용하면 동일한 코드로 여러 플랫폼에서 인증을 구현할 수 있어 개발 과정이 간소화된다.
- 네이티브 라이브러리를 사용하면 플랫폼에 최적화된 인증 경험을 제공할 수 있다.
- Expo의 관리형 워크플로우와 호환되어 추가 설정 없이 바로 사용할 수 있다.

이러한 인증 옵션을 활용하면 개발자는 보다 쉽고 빠르게 앱에 로그인 기능을 구현할 수 있으며, 사용자에게 안전하고 편리한 인증 경험을 제공할 수 있다.

- [AuthSession API](https://docs.expo.dev/versions/latest/sdk/auth-session/)
  - `expo-auth-session`은 웹 브라우저 기반 인증(예: 브라우저 기반 OAuth 흐름)을 앱에 추가하는 가장 쉬운 방법이다.
- [Google 인증](https://docs.expo.dev/guides/google-authentication/)
  - `@react-native-google-signin/google-signin` 라이브러리를 사용하여 Expo 프로젝트에 Google 인증을 통합하는 방법에 대한 가이드다.
- [Facebook 인증](https://docs.expo.dev/guides/facebook-authentication/)
  - `react-native-fbsdk-next` 라이브러리를 사용하여 Expo 프로젝트에 Facebook 인증을 통합하는 방법에 대한 가이드다.
- [Apple 인증](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
  - `expo-apple-authentication`은 iOS 13 이상에서 Apple 인증을 제공한다.
- [기타 인증 예제](https://docs.expo.dev/guides/authentication/)
  - AuthSession API와 기타 OAuth 공급자를 사용하여 Expo 앱에서 웹 기반 인증을 구현하는 예제 모음이다.
