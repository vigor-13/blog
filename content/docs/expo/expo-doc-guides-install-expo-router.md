---
title: Expo Router 설치
description: Expo Router로 새 프로젝트를 만들거나 기존 프로젝트에 라이브러리를 추가하여 빠르게 시작하는 방법을 알아본다.
date: 2024-04-04
tags: [expo_router]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/router/installation/',
    },
  ]
---

아래 단계를 따라 Expo Router 라이브러리로 새 프로젝트를 생성하거나 기존 프로젝트에 추가한다.

## 빠른 시작 {#quick-start}

1. `create-expo-app` 을 사용하여 새 Expo 앱을 생성하는 것을 권장한다. 이렇게 하면 Expo Router 라이브러리가 이미 설치된 기본 프로젝트가 생성된다. 프로젝트를 생성하려면 다음 명령을 실행한다:

```bash
npx create-expo-app@latest --template tabs@50
```

2. 이제 다음 명령을 실행하여 프로젝트를 시작할 수 있다:

```bash
npx expo start
```

- 모바일 기기에서 앱을 보려면 Expo Go로 시작하는 것이 좋다. 애플리케이션의 복잡성이 증가하고 더 많은 제어가 필요한 경우 개발 빌드를 생성할 수 있다.
- 터미널 UI에서 `w` 를 눌러 웹 브라우저에서 프로젝트를 연다. Android의 경우 `a` 를 누르고(Android Studio 필요), iOS의 경우 `i` 를 누릅니다(Xcode가 설치된 macOS 필요).

## 수동 설치 {#manual-installation}

Expo Router 버전이 프로젝트에서 사용 중인 Expo SDK 버전과 호환되는지 확인한다.

| Expo SDK | Expo Router |
| -------- | ----------- |
| 50.0.0   | 3.0.0       |
| 49.0.0   | 2.0.0       |
| 48.0.0   | 1.0.0       |

### 요구 사항 {#prerequisites}

컴퓨터가 [Expo 앱을 실행할 수 있도록 설정](https://docs.expo.dev/get-started/installation/)되어 있는지 확인한다.

1. **Expo 프로젝트를 생성한다.**

새 프로젝트를 생성하기 위해서 다음의 명령을 실행한다.

```bash
npx create-expo-app
```

2. **의존성을 설치한다.**

다음의 의존성들을 설치해야 한다.

```bash
# SDK 50 이상
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

위의 명령은 프로젝트에서 사용 중인 Expo SDK 버전과 호환되는 라이브러리 버전을 설치한다.

3. **엔트리 포인트 설정하기**

`package.json` 에서 `main` 프로퍼티의 값으로 `expo-router/entry` 를 사용한다. 초기 클라이언트 파일은 `app/_layout.js`다.

```json
// package.json
{
  "main": "expo-router/entry"
}
```

4. **프로젝트 설정 수정하기**

[앱 설정](https://docs.expo.dev/workflow/configuration/)에 딥링킹 `schema` 를 추가한다:

```json
// app.json
{
  "scheme": "your-app-scheme"
}
```

웹용 앱을 개발하는 경우 다음 종속성을 설치한다:

```bash
npx expo install react-native-web react-dom
```

그런 다음 [앱 설정](https://docs.expo.dev/workflow/configuration/)에 다음을 추가하여 [Metro 웹](https://docs.expo.dev/guides/customizing-metro/#adding-web-support-to-metro) 지원을 설정한다:

```json
// app.json
{
  "web": {
    "bundler": "metro"
  }
}
```

5. **babel.config.js 수정하기** {#modify-babel-config-js}

`babel.config.js` 파일에서 `babel-preset-expo` 를 프리셋으로 사용하거나 파일을 삭제한다:

```js
// SDK 50 이상
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

만약 Expo Router v3 이전 버전에서 업그레이드하는 경우, `plugins: ['expo-router/babel']`을 제거한다. `expo-router/babel` 은 SDK 50(Expo Router v3)에서 `babel-preset-expo` 에 병합되었다.

6. 번들러의 캐시를 지운다 {#clear-bundler-cache}

Babel 설정 파일을 업데이트한 후 다음 명령을 실행하여 번들러 캐시를 지운다:

```bash
npx expo start -c
```

7. **resolutions 업데이트하기** {#update-resolutions}

이전 버전의 Expo Router에서 업그레이드하는 경우, `package.json` 에서 모든 오래된 Yarn 리졸루션(resolutions)이나 npm 오버라이드(overrides)를 제거해야 한다. 특히, `package.json` 에서 metro, metro-resolver, react-refresh 리졸루션을 제거한다.
