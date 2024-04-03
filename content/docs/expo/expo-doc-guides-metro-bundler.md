---
title: Metro 번들러
description: 커스터마이징 할 수 있는 다양한 Metro 번들러 설정에 대해 알아본다.
date: 2024-04-03
tags: [metro]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/guides/customizing-metro/',
    },
  ]
---

Expo CLI는 개발 및 배포 과정에서 Metro라는 도구를 사용하여 JavaScript 코드와 에셋을 번들링한다. Metro는 React Native 생태계에서 널리 사용되는 번들러이며, 특히 React Native 애플리케이션을 위해 설계되고 최적화되었다.

Expo CLI는 내부적으로 Metro를 사용하여 `npx expo start` 명령으로 개발 서버를 시작하고, `npx expo export` 명령으로 프로덕션 빌드를 생성한다.

:::important Metro의 주요 역할
Metro의 주요 역할은 다음과 같다:

1. JavaScript 코드 번들링:

   - Metro는 프로젝트의 모든 JavaScript 파일을 분석하고 번들링한다.
   - 이는 여러 개의 모듈과 파일로 구성된 코드를 하나의 파일로 합치는 과정이다.
   - 번들링된 코드는 브라우저나 모바일 디바이스에서 실행될 수 있는 형태로 최적화된다.

2. 에셋 처리:

   - Metro는 이미지, 폰트, 비디오 등의 에셋을 처리하고 번들에 포함시킨다.
   - 에셋은 코드에서 참조할 수 있는 고유한 식별자로 변환된다.
   - Metro는 에셋의 크기를 최적화하고 필요에 따라 압축하여 앱의 성능을 향상시킨다.

3. 핫 리로딩 및 개발 경험 향상:

   - Metro는 개발 중에 코드 변경 사항을 빠르게 감지하고 반영할 수 있다.
   - 이는 "고속 리로딩" 또는 "핫 리로딩"이라고 불리는 기능으로, 앱을 새로 고치지 않고도 변경 사항을 즉시 확인할 수 있다.
   - Metro의 빠른 번들링 속도와 증분 번들링 기능은 개발 경험을 향상시키고 개발 생산성을 높인다.

4. 대규모 애플리케이션 지원:
   - Metro는 Facebook과 Instagram과 같은 대규모 React Native 애플리케이션에서 사용되고 검증되었다.
   - 대규모 코드베이스와 복잡한 종속성 그래프를 효율적으로 처리할 수 있도록 설계되었다.
   - Metro의 확장성과 성능 최적화는 대규모 프로젝트에서 특히 유용하다.

:::

## 사용자 정의 {#customizing}

프로젝트 루트에 `metro.config.js` 파일을 생성하여 Metro 번들러를 커스터마이징 할 수 있다. 이 파일은 `expo/metro-config` 를 확장하는 Metro 설정을 export해야 한다. 버전 일관성을 보장하려면 `@expo/metro-config` 대신 `expo/metro-config` 에서 import 한다.

템플릿 파일을 생성하려면 다음 명령을 실행한다:

```bash
npx expo customize metro.config.js
```

생성된 `metro.config.js` 파일은 다음과 같다:

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

더 자세한 내용은 [metro.config.js 문서](https://facebook.github.io/metro/docs/configuration)를 확인한다.

## 에셋 {#assets}

Metro는 파일을 소스 코드 또는 에셋으로 리졸브한다. 소스 코드는 애플리케이션에서 사용하는 JavaScript, TypeScript, JSON 및 기타 파일이다. [에셋](https://docs.expo.dev/guides/assets/)은 이미지, 폰트 및 Metro에 의해 변환되어서는 안 되는 기타 파일이다. 대규모 코드베이스를 수용하기 위해 Metro는 번들러를 시작하기 전에 소스 코드와 에셋 모두에 대한 모든 확장자를 명시적으로 정의해야 한다. 이는 Metro 설정에 `resolver.sourceExts` 와 `resolver.assetExts` 옵션을 추가하여 수행된다. 기본적으로 다음 확장자가 포함된다:

- [`resolver.assetExts`](https://github.com/facebook/metro/blob/7028b7f51074f9ceef22258a8643d0f90de2388b/packages/metro-config/src/defaults/defaults.js#L15)
- [`resolver.sourceExts`](https://github.com/facebook/metro/blob/7028b7f51074f9ceef22258a8643d0f90de2388b/packages/metro-config/src/defaults/defaults.js#L53)

### assetExts에 더 많은 파일 확장자 추가하기 {#adding-more-file-extensions-to-assetExts}

가장 일반적인 커스터마이징은 Metro에 추가 에셋 확장자를 포함하는 것이다.

`metro.config.js` 파일에서 파일 확장자(앞에 `.` 이 없는)를 `resolver.assetExts` 배열에 추가한다:

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // SQLite 데이터베이스용 '.db' 파일에 대한 지원 추가
  'db',
);

module.exports = config;
```

## 번들 분할 {#bundle-splitting}

SDK 50부터 Expo CLI는 비동기 import(웹 전용)를 기반으로 번들을 자동으로 분할한다.

이 기술은 Expo Router와 함께 사용하여 `app/` 디렉토리의 라우트 파일을 기반으로 번들을 자동으로 분할할 수 있다. 이렇게 하면 현재 라우트에 필요한 코드만 로드하고, 사용자가 다른 페이지로 이동할 때까지 추가 JavaScript 로딩을 지연시킨다. 자세한 내용은 [비동기 라우트](https://docs.expo.dev/router/reference/async-routes/)를 참조한다.

## 트리 쉐이킹 {#tree-shaking}

- [트리 쉐이킹](https://docs.expo.dev/guides/tree-shaking/)

## 압축 {#minification}

- [자바스크립트 압축](https://docs.expo.dev/guides/minify/)

## 웹 지원 {#web-support}

Expo SDK 46부터 Expo CLI는 Metro를 사용하여 웹사이트를 번들링하는 기능을 지원한다. 이는 네이티브 앱에 사용되는 것과 동일한 번들러이며, 플랫폼 간에 보편적으로 사용되도록 설계되었다. Expo SDK 50 이상부터 웹 프로젝트에 권장된다.

### Expo webpack vs Expo Metro {#expo-webpack-vs-expo-metro}

deprecated된 `@expo/webpack-adapter` 를 사용하여 웹사이트를 작성한 경우, [마이그레이션 가이드](https://docs.expo.dev/router/migrate/from-expo-webpack/)와 [비교 차트](https://docs.expo.dev/router/migrate/from-expo-webpack/#expo-cli)를 참조한다.

### Metro에 웹 지원 추가하기 {#adding-web-support-to-metro}

Metro 웹 지원을 활성화하려면 프로젝트에서 Expo SDK 46 이상을 사용하고 있는지 확인한다. 그런 다음 `expo.web.bundler` 필드를 사용하여 앱 구성을 수정하고 기능을 활성화한다:

```json
// app.json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

#### 개발 {#development}

개발 서버를 시작하려면 다음 명령을 실행한다:

```bash
npx expo start --web
```

또는 Expo CLI 터미널 UI에서 `W` 를 누른다.

#### 정적 파일 {#static-files}

Expo의 Metro는 루트 `public/` 디렉토리에 정적 파일을 배치하여 개발 서버에서 정적 파일을 호스팅하는 것을 지원한다. 이는 다른 많은 웹 프레임워크와 유사하다.

`npx expo export` 로 내보낼 때 `public` 디렉토리의 내용이 `dist/` 디렉토리로 복사된다. 즉, 앱은 호스트 URL을 기준으로 이러한 에셋을 가져올 수 있다. 가장 일반적인 예는 웹사이트에서 탭 아이콘을 렌더링하는 데 사용되는 `public/favicon.ico` 이다.

프로젝트에 `public/index.html` 파일을 생성하여 Metro 웹의 기본 `index.html` 을 덮어쓸 수 있다.

향후 이 기능은 EAS 업데이트 호스팅을 사용하는 모든 플랫폼에서 보편적으로 지원할 예정이다. 현재 이 기능은 네이티브 앱에 사용되는 정적 호스트에 기반한 웹 전용 기능으로, 예를 들어 기존 Expo 서비스 업데이트는 이 기능을 지원하지 않는다.

## TypeScript {#typescript}

> SDK 49 이상에서 사용 가능합니다.

Expo의 Metro 설정은 프로젝트의 `tsconfig.json`(또는 `jsconfig.json`) 파일에서 `compilerOptions.paths` 와 `compilerOptions.baseUrl` 필드를 지원한다. 이를 통해 프로젝트에서 절대 경로와 별칭을 사용할 수 있다. 자세한 내용은 [TypeScript 가이드](https://docs.expo.dev/guides/typescript/)를 참조한다.

이 기능을 bare 프로젝트에서 사용하려면 추가 설정이 필요하다. 자세한 내용은 [Metro 설정 가이드](https://docs.expo.dev/versions/latest/config/metro/#bare-workflow-setup)를 참조한다.
