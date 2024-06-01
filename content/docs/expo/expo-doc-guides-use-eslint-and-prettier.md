---
title: ESLint, Prettier 사용하기
description: ESLint와 Prettier를 사용하여 Expo 앱 코드 스타일 통일하기
date: 2024-05-15
tags: [eslint, prettier]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/guides/using-eslint/',
    },
  ]
---

ESLint는 자바스크립트 코드에서 발생할 수 있는 오류를 찾아주고 수정할 수 있도록 도와주는 린팅 도구다. 코드 품질을 높이고 배포 전에 실수를 방지하는데 큰 도움이 된다. 추가로 Prettier를 함께 사용하면 프로젝트 내 모든 코드 파일의 스타일을 일관되게 유지할 수 있다.

이 가이드에서는 ESLint와 Prettier의 설정 방법에 대해 설명한다.

## ESLint {#eslint}

### 설치 {#setup}

Expo 프로젝트에서 ESLint를 설정하려면 Expo CLI를 사용하여 필요한 종속성을 설치한다. 이 명령을 실행하면 프로젝트 루트에 `.eslintrc.js` 파일도 생성되며, [`eslint-config-expo`](https://github.com/expo/expo/tree/main/packages/eslint-config-expo)의 설정을 확장한다.

```bash
npx expo lint
```

### 사용법 {#usage}

:::note
VS Code를 사용하는 경우 [ESLint 확장 프로그램](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)을 설치하여 입력 시 코드를 실시간으로 린트할 수 있다.
:::

`expo lint` 스크립트를 사용하여 명령줄에서 수동으로 코드를 린트할 수 있다:

```bash
# SDK 51이상
npx expo lint
```

위의 명령을 실행하면 `package.json` 의 `lint` 스크립트가 실행된다.

```bash
# npx expo lint 명령 실행 예시 출력
> npm run eslint .
> $ /app/node_modules/.bin/eslint .

/app/components/HelloWave.tsx
22:6 warning React Hook useEffect has a missing dependency: 'rotateAnimation'. Either include it or remove the dependency array react-hooks/exhaustive-deps

✖ 1 problem (0 errors, 1 warning)
```

### 환경 설정 {#configuration}

ESLint는 일반적으로 단일 환경에 대해 구성된다. 그러나 Expo 앱의 소스 코드는 여러 환경에서 실행되는 자바스크립트로 작성된다. 예를 들어 `app.config.js`, `metro.config.js`, `babel.config.js`, `app/+html.tsx` 파일은 Node.js 환경에서 실행된다. 이는 전역 `__dirname` 변수에 액세스할 수 있고 `path` 와 같은 Node.js 모듈을 사용할 수 있음을 의미한다. 표준 Expo 프로젝트 파일(예: `app/index.js`)은 Hermes, Node.js 또는 웹 브라우저에서 실행될 수 있다.

파일 상단에 `eslint-env` 주석 지시문을 추가하여 ESLint에 파일이 실행되는 환경을 알릴 수 있다. 예를 들어 파일이 Node.js에서 실행됨을 ESLint에 알리려면 파일 상단에 다음 주석을 추가한다:

```js
// metro.config.js
/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
```

## Prettier {#prettier}

### 설치

프로젝트에 Prettier를 설치하려면 다음 명령을 실행한다:

```bash
npx expo install -- --save-dev prettier eslint-config-prettier eslint-plugin-prettier

yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
```

### 설정

Prettier를 ESLint와 통합하려면 .eslintrc.js 파일을 다음과 같이 수정합니다:

module.exports = {
extends: ["expo", "prettier"],  
 plugins: ["prettier"],
rules: {
"prettier/prettier": "error",
},
};

이제 npx expo lint를 실행하면 Prettier 포맷팅에 맞지 않는 모든 것이 오류로 감지됩니다.

참고: 위의 설정에서 "prettier/prettier": "warn"을 사용하면 이러한 포맷팅 문제를 오류 대신 경고로 표시할 수 있습니다.

Prettier 설정을 사용자 정의하려면 프로젝트 루트에 .prettierrc 파일을 만들고 구성을 추가하세요.

사용자 정의 Prettier 구성에 대해 자세히 알아보려면 이 링크를 참고하세요.

## 문제 해결

VS Code에서 ESLint가 업데이트되지 않을 때
VS Code를 사용하는 경우 ESLint 확장을 설치하여 입력할 때 코드를 린트하세요. 명령 팔레트에서 'ESLint: Restart ESLint Server' 명령을 실행하여 ESLint 서버를 다시 시작할 수 있습니다.

ESLint 속도가 느릴 때  
ESLint는 대규모 프로젝트에서 실행 속도가 느릴 수 있습니다. 속도를 높이는 가장 쉬운 방법은 더 적은 파일을 린트하는 것입니다. 프로젝트 루트에 .eslintignore 파일을 추가하여 다음과 같은 특정 파일과 디렉토리를 무시하세요:

/.expo
node_modules

eslint-config-expo로 마이그레이션
eslint-config-universe가 설치된 이전 버전의 Expo SDK에서 마이그레이션하는 경우, eslint-config-expo 라이브러리를 설치하고 ESLint 구성을 업데이트하여 새 라이브러리에서 확장하세요.

1. eslint-config-universe 라이브러리를 제거하고 eslint-config-expo를 수동으로 설치하세요.

npx expo install -- --save-dev eslint-config-expo  
yarn add -D eslint-config-expo

2. ESLint 구성을 업데이트하여 eslint-config-expo를 확장하세요.

module.exports = {
extends: 'expo',
...
};

기존 ESLint 구성을 새 라이브러리 및 package.json의 lint 스크립트와 함께 계속 사용할 수 있습니다. SDK 51 이상을 사용하는 경우 다음 단계에 따라 npx expo lint를 사용하도록 전환할 수 있습니다.

3. npx expo lint 명령으로 코드를 린트하려면 package.json에서 lint 스크립트를 업데이트하세요.

{
"scripts": {  
 "lint": "expo lint"
}
}

참고: 위 설정은 SDK 51 이상에서만 작동합니다.

이제 npx expo lint를 실행하여 코드를 린트할 수 있습니다.
