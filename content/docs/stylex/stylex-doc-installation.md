---
title: 설치
description:
date: 2024-05-10
tags: []
references:
  [
    {
      key: 'StyleX 공식 문서',
      value: 'https://stylexjs.com/docs/learn/installation/',
    },
  ]
---

## 런타임 {#runtime}

StyleX를 사용하려면 **런타임 패키지**를 설치해야 한다.

```bash
npm install --save @stylexjs/stylex
```

## 컴파일러 {#compiler}

개발과 프로덕션 환경에서 StyleX를 활용할 때는 **빌드 타임 컴파일러**를 사용하는 것이 가장 좋다.

### 개발 환경 {#development}

개발 환경에서 StyleX를 사용하려면 Babel 플러그인을 설정하여 스타일이 컴파일 시점에 처리되도록 해야 한다.

이 플러그인은 두 가지 주요 역할을 수행한다.

1. **플러그인은 StyleX로 작성된 스타일 코드를 컴파일한다.**
   - 이 과정에서 스타일 코드는 최적화되고 유효성이 검사된다.
   - 컴파일러는 스타일 코드를 분석하고 필요한 변환을 수행하여 브라우저에서 실행될 수 있는 형태로 변환한다.
2. **컴파일된 스타일 코드는 해당 스타일이 사용되는 JavaScript 모듈에 삽입된다.**
   - 이는 런타임에 스타일을 동적으로 주입하기 위한 코드로, StyleX 런타임 라이브러리와 상호작용하여 스타일을 적용한다.
   - 이 과정은 개발자가 직접 처리할 필요 없이 자동으로 이루어진다.

```bash
npm install --save-dev @stylexjs/babel-plugin
```

```js
// babel.config.js
import styleXPlugin from '@stylexjs/babel-plugin';

const config = {
  plugins: [
    [
      styleXPlugin,
      {
        dev: true,
        // 스냅샷 테스팅을 위해 true로 설정하세요.
        // 기본값: false
        test: false,
        // CSS 변수 지원에 필요합니다.
        unstable_moduleResolution: {
          // type: 'commonJS' | 'haste'
          // 기본값: 'commonJS'
          type: 'commonJS',
          // 프로젝트 루트 디렉토리의 절대 경로
          rootDir: __dirname,
        },
      },
    ],
  ],
};

export default config;
```

### 프로덕션 환경 {#production}

프로덕션 환경에서 StyleX를 사용할 때는 성능 최적화와 캐싱 효과를 위해 CSS를 별도의 파일로 추출해야 한다.

이를 위해 StyleX는 Babel 플러그인에서 생성한 메타데이터를 활용하여 다양한 번들러와 함께 사용할 수 있는 방법을 제공한다.

- StyleX의 Babel 플러그인은 스타일 코드를 컴파일하는 과정에서 유용한 메타데이터를 생성한다.
- 이 메타데이터에는 스타일에 대한 정보, 의존성, 그리고 최적화를 위한 힌트 등이 포함된다.
- Babel을 지원하는 번들러는 이 메타데이터를 활용하여 CSS를 별도의 파일로 추출하고 최적화할 수 있다.

번들러는 이 메타데이터를 읽어들여 StyleX 스타일을 포함하는 JavaScript 모듈을 분석한다. 그리고 해당 모듈에서 사용되는 스타일을 별도의 CSS 파일로 추출한다. 이 과정에서 중복 스타일은 제거되고, 사용되지 않는 스타일은 제외된다. 최종적으로 최적화된 CSS 파일이 생성되어 웹 페이지에서 참조될 수 있게 된다.

StyleX는 이러한 과정을 쉽게 수행할 수 있도록 여러 인기 있는 번들러를 위한 플러그인을 제공한다. 현재 `Webpack` , `Rollup` , `Next.js` , 그리고 `esbuild` 를 위한 플러그인이 존재한다 (일부는 실험적 단계). 이 플러그인들은 해당 번들러의 생태계에 맞게 설계되어 StyleX와의 통합을 원활하게 해준다.

예를 들어 Webpack용 StyleX 플러그인을 사용하면, Webpack의 설정 파일에 간단히 플러그인을 추가하는 것만으로 CSS 추출 및 최적화 기능을 사용할 수 있다. 이는 Next.js, Rollup, esbuild 등 다른 도구에서도 마찬가지다.

StyleX가 제공하는 이러한 통합 방식 덕분에 개발자는 프로덕션 환경에서도 쉽게 StyleX를 사용할 수 있으며, 성능 최적화와 캐싱의 이점을 누릴 수 있다. CSS가 별도의 파일로 분리되므로 브라우저 캐싱을 효과적으로 활용할 수 있고, 스타일 변경 시에도 전체 애플리케이션을 다시 로드할 필요가 없어진다.

:::tabs

@tab:active Rollup#rollup

```bash
npm install --save-dev @stylexjs/rollup-plugin
```

```js
// rollup.config.js
import stylexPlugin from '@stylexjs/rollup-plugin';

const config = {
  input: './index.js',
  output: {
    file: './.build/bundle.js',
    format: 'es',
  },
  // stylex 플러그인이 Babel보다 먼저 사용되어야 한다.
  plugins: [
    stylexPlugin({
      // 필수. 생성된 CSS 파일의 파일 경로.
      fileName: './.build/stylex.css',
      // 기본값: false
      dev: false,
      // 생성된 모든 className에 대한 접두사
      classNamePrefix: 'x',
      // CSS 변수 지원에 필요
      unstable_moduleResolution: {
        // type: 'commonJS' | 'haste'
        // 기본값: 'commonJS'
        type: 'commonJS',
        // 프로젝트의 루트 디렉토리 절대 경로
        rootDir: __dirname,
      },
    }),
  ],
};

export default config;
```

@tab Webpack#webpack

```bash
npm install --save-dev @stylexjs/webpack-plugin
```

```js
// webpack.config.js
const StylexPlugin = require('@stylexjs/webpack-plugin');
const path = require('path');

const config = (env, argv) => ({
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, '.build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    // StyleX 플러그인이 Babel보다 먼저 사용되도록 한다.
    new StylexPlugin({
      filename: 'styles.[contenthash].css',
      // webpack 모드를 가져와서 dev 값을 설정한다.
      dev: argv.mode === 'development',
      // 런타임에 주입되는 CSS가 아닌 정적으로 생성된 CSS 파일을 사용한다.
      // 개발 환경에서도 마찬가지다.
      runtimeInjection: false,
      // 선택 사항. 기본값: 'x'
      classNamePrefix: 'x',
      // CSS 변수 지원에 필요
      unstable_moduleResolution: {
        // type: 'commonJS' | 'haste'
        // 기본값: 'commonJS'
        type: 'commonJS',
        // 프로젝트의 루트 디렉토리 절대 경로
        rootDir: __dirname,
      },
    }),
  ],
  cache: true,
});

module.exports = config;
```

@tab Next.js#nextjs

```bash
npm install --save-dev @stylexjs/nextjs-plugin
```

```js
// .babelrc.js
const path = require('path');
module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      '@stylexjs/babel-plugin',
      {
        dev: process.env.NODE_ENV === 'development',
        runtimeInjection: false,
        genConditionalClasses: true,
        treeshakeCompensation: true,
        aliases: {
          '@/*': [path.join(__dirname, '*')],
        },
        unstable_moduleResolution: {
          type: 'commonJS',
          rootDir: __dirname,
        },
      },
    ],
  ],
};
```

```js
// next.config.js
const path = require('path');
const stylexPlugin = require('@stylexjs/nextjs-plugin');

module.exports = stylexPlugin({
  aliases: {
    '@/*': [path.join(__dirname, '*')],
  },
  rootDir: __dirname,
})({});
```

@tab esbuild#esbuild

```bash
npm install --save-dev @stylexjs/esbuild-plugin
```

```js
// build.mjs
import esbuild from 'esbuild';
import stylexPlugin from '@stylexjs/esbuild-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: './build/bundle.js',
  minify: true,
  plugins: [
    stylexPlugin({
      // If set to 'true', bundler will inject styles in-line
      // Do not use in production
      dev: false,
      // Required. File path for the generated CSS file
      generatedCSSFileName: path.resolve(__dirname, 'build/stylex.css'),
      // Aliases for StyleX package imports
      // default: '@stylexjs/stylex'
      stylexImports: ['@stylexjs/stylex'],
      // Required for CSS variable support
      unstable_moduleResolution: {
        // type: 'commonJS' | 'ESModules' | 'haste'
        // default: 'commonJS'
        type: 'commonJS',
        // The absolute path to the root of your project
        rootDir: __dirname,
      },
    }),
  ],
});
```

:::

각 플러그인 사용 방법에 대한 데모는 [StyleX 예제 앱](https://github.com/facebook/stylex/tree/main/apps)을 참조한다.

## 로컬 개발 환경 전용 {#local-development-only}

:::caution
`@stylexjs/dev-runtime` 은 프로덕션 환경에서 사용해서는 안 된다. 성능에 상당한 영향을 미치므로 컴파일러 없이 로컬 개발 환경에서만 사용해야 한다. 또한 이 런타임은 컴파일러를 사용할 때 사용할 수 있는 기능들이 제한되어 있다.
:::

`@stylexjs/dev-runtime` 은 컴파일 과정 없이 런타임에서 스타일을 처리하고 주입한다. 이는 개발 중에는 빠르게 스타일을 적용하고 변경 사항을 확인할 수 있어 편리하지만, 런타임에서 추가적인 작업이 발생하므로 성능 면에서는 좋지 않다. 프로덕션 환경에서는 성능이 중요하므로, 런타임에서 스타일을 처리하는 것은 적절하지 않다.

또한 `@stylexjs/dev-runtime` 은 컴파일러를 사용할 때 제공되는 일부 기능이 제한되어 있다. 예를 들어, 컴파일 타임에 최적화나 CSS 추출 등의 작업을 수행할 수 없다. 이는 개발 과정에서는 큰 문제가 되지 않지만, 프로덕션에서는 성능과 효율성 면에서 중요한 요소다.

따라서 `@stylexjs/dev-runtime` 은 오직 로컬 개발 환경에서만 사용해야 한다. 컴파일러와 빌드 프로세스를 설정하는 것이 번거로울 경우, 개발 초기 단계에서는 이 런타임을 사용하여 빠르게 개발을 진행할 수 있다.

`@stylexjs/dev-runtime` 을 사용하려면 먼저 npm을 통해 설치해야 한다.

```bash
npm install --save-dev @stylexjs/dev-runtime
```

그리고 애플리케이션의 JavaScript 엔트리 포인트 파일에서 `@stylexjs/dev-runtime` 을 불러와 설정한다.

```javascript
import inject from '@stylexjs/dev-runtime';

inject({
  classNamePrefix: 'x',
  dev: true,
  test: false,
});
```

`inject` 함수를 호출하여 개발용 런타임을 설정한다.

이렇게 설정한 후에는 별도의 컴파일 과정 없이 `@stylexjs/stylex` 를 import하여 StyleX를 사용할 수 있다. 개발용 런타임이 런타임에서 스타일을 주입하고 관리해준다.

하지만 앱을 프로덕션 환경에 배포할 준비가 되면, 반드시 컴파일러와 빌드 프로세스를 설정하여 StyleX를 적용해야 한다. 이를 통해 최적화된 CSS 파일을 생성하고, 런타임 오버헤드를 제거할 수 있다.

## ESLint 설정 {#catch-mistake-with-eslint}

StyleX 컴파일러는 스타일 코드를 컴파일하고 최적화하는 데 중점을 두고 있지만, 스타일의 유효성을 검사하는 기능은 제공하지 않는다. 이는 컴파일 시점에서 유효하지 않은 스타일 코드도 컴파일이 가능하다는 것을 의미한다.

예를 들어, 존재하지 않는 CSS 속성이나 잘못된 값을 사용해도 컴파일러는 이를 감지하지 못하고 그대로 컴파일한다.

이러한 유효하지 않은 스타일 코드는 런타임에서 예기치 않은 동작을 일으키거나 스타일이 적용되지 않는 문제를 야기할 수 있다. 따라서 개발자는 스타일 코드를 작성할 때 실수를 최소화하고 유효한 코드를 작성해야 한다.

이를 위해 StyleX는 ESLint 플러그인을 제공한다. StyleX의 ESLint 플러그인을 사용하면 스타일 코드의 유효성을 검사하고 실수를 잡아낼 수 있다.

StyleX의 ESLint 플러그인을 사용하려면 먼저 npm을 통해 설치한다.

```bash
npm install --save-dev @stylexjs/eslint-plugin
```

그리고 ESLint 설정 파일( `.eslintrc.js` )에 StyleX 플러그인을 추가하고 규칙을 설정해야 한다.

```javascript
// // .eslintrc.js
module.exports = {
  plugins: ['@stylexjs'],
  rules: {
    '@stylexjs/valid-styles': 'error',
  },
};
```

위 설정에서는 StyleX 플러그인을 활성화하고, `@stylexjs/valid-styles` 규칙을 "error" 수준으로 설정했다. 이 규칙은 StyleX 스타일 코드의 유효성을 검사하고, 유효하지 않은 스타일이 있을 경우 ESLint 오류를 발생시킨다.

예를 들어, 다음과 같이 유효하지 않은 스타일 코드가 있다고 가정해보자.

```javascript
import { styleVariants } from '@stylexjs/stylex';

const styles = styleVariants({
  root: {
    color: 'red',
    fontWeight: 'invalid-value',
  },
});
```

위 코드에서 `fontWeight` 속성에 유효하지 않은 값인 `'invalid-value'` 가 사용되었다. ESLint와 StyleX 플러그인을 사용하면 이 코드를 검사할 때 다음과 같은 오류가 발생한다.

```text
Invalid value "invalid-value" for property "fontWeight". Valid values are "normal", "bold", "bolder", "lighter", or a numeric value.
```
