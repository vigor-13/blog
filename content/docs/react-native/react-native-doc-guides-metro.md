---
title: Metro
description:
date: 2024-06-07
tags: [metro]
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/metro',
    },
  ]
---

React Native는 [Metro](https://metrobundler.dev/) 번들러를 사용한다.

## Metro 설정하기

Metro 설정 파일인 `metro.config.js` 는 두 가지 형태로 작성할 수 있다:

1. **객체 형태 (권장)**:
   - 이 방법에서는 `metro.config.js` 파일이 설정 옵션들을 담은 JavaScript 객체를 내보낸다.
   - 이 객체는 Metro의 기본 설정 위에 병합(merge)된다. 즉, 기본 설정을 유지하면서 필요한 부분만 수정할 수 있다.
   - 예를 들면:
     ```javascript
     module.exports = {
       transformer: {
         getTransformOptions: async () => ({
           transform: {
             experimentalImportSupport: false,
             inlineRequires: true,
           },
         }),
       },
     };
     ```
   - 이 예시에서는 `transformer` 옵션만 변경하고, 나머지는 Metro 기본 설정을 그대로 사용한다.

<br />

2. **함수 형태**:
   - 이 방법에서는 `metro.config.js` 파일이 함수를 내보낸다.
   - 이 함수는 Metro의 기본 설정을 인자로 받고, 최종 설정 객체를 반환해야 한다.
   - 예를 들면:
     ```javascript
     module.exports = (defaultConfig) => {
       return {
         ...defaultConfig,
         transformer: {
           ...defaultConfig.transformer,
           getTransformOptions: async () => ({
             transform: {
               experimentalImportSupport: false,
               inlineRequires: true,
             },
           }),
         },
       };
     };
     ```
   - 이 예시에서는 기본 설정(`defaultConfig`)을 받아와서, 필요한 부분(`transformer`)을 변경하고, 나머지는 기본 설정을 유지한다.
   - 이 방법은 기본 설정을 완전히 제어할 수 있지만, 모든 설정을 직접 관리해야 하므로 더 복잡할 수 있다.

일반적으로는 객체 형태를 사용하는 것이 권장된다. 함수 형태는 기본 설정을 읽어와야 하는 등의 고급 사용 사례에 유용하다.

:::tip
사용 가능한 모든 설정 옵션에 대한 문서는 Metro 웹사이트의 [Metro 설정하기](https://metrobundler.dev/docs/configuration)를 참조한다.
:::

React Native에서는 Metro 설정을 할 때, [`@react-native/metro-config`](https://www.npmjs.com/package/@react-native/metro-config) 또는 [`@expo/metro-config`](https://www.npmjs.com/package/@expo/metro-config) 패키지를 사용해야 한다.

이 패키지들은 React Native 앱을 빌드하고 실행하는 데 필요한 기본 설정을 제공한다.

```javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

## 고급: 설정 함수 사용하기

설정 함수를 내보내는 방식은 Metro의 기본 설정을 완전히 제어하고 싶을 때 사용한다.

<u>설정 함수를 내보내면 Metro는 기본 설정을 적용하지 않는다.</u> 대신, 개발자가 제공한 함수에서 반환한 설정을 그대로 사용한다.

이 방법의 장점은 기본 설정 객체에 직접 액세스할 수 있고, 설정을 동적으로 생성할 수 있다는 점이다. 예를 들어, 환경 변수에 따라 다른 설정을 적용할 수 있다.

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = function (baseConfig) {
  const defaultConfig = mergeConfig(baseConfig, getDefaultConfig(__dirname));
  const {
    resolver: { assetExts, sourceExts },
  } = defaultConfig;

  return mergeConfig(defaultConfig, {
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  });
};
```

:::note
`@react-native/metro-config` <u>0.72.1</u> 버전부터는 설정 함수를 사용하지 않고도 기본 설정(`baseConfig`)에 액세스할 수 있게 되었다.

따라서 위의 코드 대신 다음과 같이 간단히 작성할 수 있다.

```javascript
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

하지만 이 방법보다는 필요한 설정을 직접 명시하는 것이 더 좋다.

```javascript
const config = {
  resolver: {
    sourceExts: ['js', 'ts', 'tsx', 'svg'],
  },
};
```

이 방법이 권장되는 이유는 설정 파일만 보고도 어떤 설정이 적용되는지 명확히 알 수 있기 때문이다. 기본 설정에 의존하지 않으므로 설정 파일이 더 명확해진다.

:::

## Metro에 대해 더 알아보기

- [Metro 웹사이트](https://metrobundler.dev/)
- [영상: App.js 2023에서 "Metro & React Native DevX" 강연](https://www.youtube.com/watch?v=c9D4pg0y9cI)
