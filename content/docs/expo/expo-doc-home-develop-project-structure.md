---
title: 프로젝트 구조
description: Expo 프로젝트의 파일 및 폴더 구조에 대해 알아본다.
date: 2024-04-02
tags: ['project_structure']
references: [{ key: 'Expo 공식 문서', value: '' }]
---

새로운 Expo 프로젝트를 생성하면 기본적으로 몇 가지 파일과 폴더가 제공된다. 이 페이지에서는 Expo 앱을 개발할 때 이해해야 하는 필수 파일과 폴더를 알아본다.

## App.js {#app-js}

**App.js** 파일은 프로젝트의 기본 화면이다. `npx expo start` 로 개발 서버를 실행한 후 로드되는 루트 파일이다. 이 파일을 편집하면 프로젝트가 즉시 업데이트되는 것을 볼 수 있다. 일반적으로 이 파일에는 루트 수준의 React Context와 내비게이션이 포함된다.

:::note
이제 [Expo Router](https://docs.expo.dev/router/introduction/)를 사용할 수 있으며 프로젝트에서 파일 기반 내비게이션을 지원한다. Expo Router를 사용하면 루트 파일(**App.js**)이 **index.js**가 되고 프로젝트의 모든 화면이 **app** 폴더에 위치하게 된다.
:::

## app.json {#app-json}

**app.json** 파일에는 프로젝트에 대한 [구성 옵션](https://docs.expo.dev/versions/latest/config/app/)이 포함되어 있다. 이러한 옵션은 개발하는 동안뿐만 아니라 앱을 빌드, 제출 및 업데이트하는 동안에도 프로젝트의 동작을 변경한다.

:::note
인텔리센스를 사용하려면 [VS Code Expo Tools](https://github.com/expo/vscode-expo) 확장 프로그램을 설치한다.
:::

## assets 폴더 {#assets-folder}

**assets** 폴더에는 Android용 **adaptive-icon.png**와 iOS용 앱 아이콘으로 사용되는 **icon.png**가 포함되어 있다. 또한 프로젝트의 스플래시 화면을 위한 이미지인 **splash.png**와 앱이 브라우저에서 실행될 경우 **favicon.png**도 포함되어 있다.

:::note
**assets** 디렉토리는 특수 디렉토리는 아니며, 프로젝트에는 이미지와 기타 에셋을 프로젝트 구조의 어느 곳에나 배치할 수 있다.
:::

## 기타 표준 파일 {#other-standard-files}

아래 나열된 표준 파일은 Expo CLI로 생성된 모든 프로젝트 공통이다. 이러한 파일을 편집하여 프로젝트를 커스터마이징 할 수 있다.

### .gitignore {#gitignore}

**.gitignore**를 사용하면 Git에서 추적하지 않을 파일과 폴더를 나열할 수 있다. 프로젝트에서 다른 파일과 폴더를 추가할 수도 있다. 일반적으로 대부분의 프로젝트는 기본 목록으로도 충분하다.

### babel.config.js {#babel-config-js}

기본 React Native 프리셋을 확장하고 데코레이터, 트리 쉐이킹 웹 패키지에 대한 지원을 추가하며, 설치된 경우 선택적 네이티브 종속성과 함께 폰트 아이콘을 로드하는 `babel-preset-expo` 프리셋을 적용한다. 또한 추가 Babel 플러그인이나 프리셋을 추가하도록 이 파일을 수정할 수도 있다.

:::important Babel Preset Expo

`babel-preset-expo` 프리셋은 Expo 프로젝트에서 사용되는 Babel 설정을 포함하는 패키지다. 이 프리셋은 React Native에서 제공하는 기본 프리셋을 확장하고 추가적인 기능을 제공한다. `babel.config.js` 파일에서 이 프리셋을 적용하면 다음과 같은 기능을 사용할 수 있다:

1. **데코레이터 지원**: 데코레이터는 클래스와 클래스 메서드에 대한 주석을 추가하는 방법이다. 데코레이터를 사용하면 코드의 가독성과 재사용성을 높일 수 있다. `babel-preset-expo` 는 데코레이터 문법을 지원하므로 데코레이터를 사용할 수 있다.

2. **트리 쉐이킹 웹 패키지 지원**: 트리 쉐이킹은 사용하지 않는 코드를 제거하여 번들 크기를 최적화하는 기술이다. `babel-preset-expo` 는 웹 패키지에 대한 트리 쉐이킹을 지원한다. 이를 통해 앱에 포함되는 코드의 양을 줄일 수 있다.

3. **폰트 아이콘 로딩**: `babel-preset-expo` 는 폰트 아이콘을 로딩하는 기능을 제공한다. 이를 통해 앱에서 벡터 아이콘을 쉽게 사용할 수 있다. 폰트 아이콘을 사용하면 다양한 크기와 색상의 아이콘을 유연하게 사용할 수 있다.

4. **선택적 네이티브 종속성**: 일부 Expo 모듈은 네이티브 종속성을 가지고 있다. 예를 들어, `expo-camera` 모듈을 사용하려면 해당 모듈의 네이티브 코드도 설치해야 한다. `babel-preset-expo` 는 이러한 선택적 네이티브 종속성을 자동으로 처리한다. 만약 해당 모듈이 설치되어 있다면 자동으로 연결되고, 설치되어 있지 않다면 무시된다.

`babel.config.js` 파일에서는 `babel-preset-expo` 프리셋을 적용하는 것 외에도 추가적인 Babel 플러그인이나 프리셋을 설정할 수 있다. 예를 들어, 실험적인 자바스크립트 기능을 사용하려면 해당 기능을 지원하는 Babel 플러그인을 추가할 수 있다.

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['@babel/plugin-proposal-optional-chaining'],
  };
};
```

위 예시에서는 `babel-preset-expo` 프리셋을 적용하고, 추가로 `@babel/plugin-proposal-optional-chaining` 플러그인을 사용하도록 설정하였다. 이 플러그인은 옵셔널 체이닝 문법을 지원한다.

이처럼 `babel-preset-expo` 는 Expo 프로젝트에 필요한 기본적인 Babel 설정을 제공하며, 추가로 필요한 플러그인이나 프리셋을 적용할 수 있는 유연성도 제공한다. 이를 통해 개발자는 최신 자바스크립트 기능을 사용하면서도 Expo의 기능을 효과적으로 활용할 수 있다.

:::

### package.json {#package-json}

**package.json** 파일에는 프로젝트의 종속성, 스크립트 및 메타데이터가 포함되어 있다. 프로젝트에 새로운 종속성이 추가될 때마다 이 파일에 추가된다.

또한 `scripts` 를 수정하여 추가하거나 제거할 수 있다. 프로젝트의 개발 서버를 트리거하기 위해 `expo start`, `expo start --android`, `expo start --ios` 및 `expo start --web`과 같은 네 가지 기본 스크립트가 제공된다.
