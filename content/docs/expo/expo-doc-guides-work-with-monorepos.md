---
title: 모노레포에서 작업하기
description: Yarn v1 워크스페이스를 사용하여 모노레포에서 Expo 프로젝트를 설정하는 방법을 알아본다.
date: 2024-04-11
tags: [monorepo]
references:
  [{ key: 'Expo 공식 문서', value: 'https://docs.expo.dev/guides/monorepos/' }]
---

Monorepo(모노레포)는 "monolithic repository"의 줄임말로, 여러 개의 앱이나 패키지를 단일 저장소에 포함하는 것을 말한다. 대규모 프로젝트의 개발 속도를 높이고, 코드 공유를 용이하게 하며, 단일 진실 공급원(single source of truth) 역할을 할 수 있다. 이 가이드에서는 Expo 프로젝트와 함께 간단한 monorepo를 설정하는 방법을 다룬다. 현재 [Yarn 1(Classic)](https://classic.yarnpkg.com/lang/en/) 워크스페이스에 대한 일급 지원이 제공된다. 다른 도구를 사용하려면 해당 도구의 구성 방법을 잘 알고 있어야 한다.

:::warning
Monorepo는 만능이 아니다. 사용하는 도구에 대한 심층적인 지식이 필요하고, 복잡성이 증가하며, 종종 특정 도구 설정이 필요하다. 단일 저장소만으로도 충분히 많은 것을 할 수 있다.
:::

## Monorepo 예시 {#example-monorepo}

이 예시에서는 [nohoist](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) 옵션 없이 Yarn 워크스페이스을 사용하여 monorepo를 설정한다. 익숙한 이름을 가정하겠지만 완전히 커스터마이징할 수 있다.

이 가이드를 따르면 기본 구조는 다음과 같다:

- `apps/` - React Native 앱을 포함한 여러 프로젝트가 포함되어 있다.
- `packages/` - 앱에서 사용하는 다양한 패키지가 포함되어 있다.
- `package.json` - Yarn 워크스페이스 설정을 포함하는 루트 패키지 파일이다.

### 루트 패키지 파일 {#root-package-file}

모든 Yarn monorepo에는 "루트" `package.json` 파일이 있어야 한다. 이는 monorepo의 메인 설정 파일이며, 저장소의 모든 내부 프로젝트에 설치된 패키지를 포함할 수 있다.

`yarn init` 을 실행하여 자동으로 생성하거나 `package.json` 을 수동으로 생성할 수 있다.

다음과 같은 내용이 포함되어야 한다:

```json
// package.json
{
  "name": "monorepo",
  "version": "1.0.0"
}
```

### Yarn 워크스페이스 설정 {#set-up-yarn-workspaces}

Yarn과 다른 도구에는 *워크스페이스*라는 개념이 있다. 저장소의 모든 패키지와 앱에는 자체 워크스페이스가 있다. 이를 사용하려면 Yarn이 워크스페이스를 찾을 수 있도록 위치를 지정해야 한다. `package.json` 에서 glob 패턴을 사용하여 `workspaces` 프로퍼티를 설정하면 된다:

```json
// package.json
{
  "private": true,
  "name": "monorepo",
  "version": "1.0.0",
  "workspaces": ["apps/*", "packages/*"]
}
```

:::warning
Yarn 워크스페이스의 루트 `package.json` 은 비공개여야 한다. 이를 설정하지 않으면 `yarn install` 시 이에 대한 메시지와 함께 오류가 발생한다.
:::

### 첫 번째 앱 생성하기 {#create-our-first-app}

이제 기본 monorepo 구조가 설정되었으니 첫 번째 앱을 추가해 보자.

앱을 생성하기 전에 `apps/` 폴더를 생성해야 한다. 이 폴더에는 이 monorepo에 속하는 모든 개별 앱이나 웹사이트가 포함된다. 이 `apps/` 폴더 내에 React Native 앱을 포함하는 하위 폴더를 생성할 수 있다.

```bash
yarn create expo apps/cool-app
```

:::note
기존 앱이 있는 경우 해당 파일을 모두 `apps/` 안의 폴더에 복사할 수 있다.
:::

앱을 복사하거나 생성한 후 `yarn` 을 실행하여 일반적인 경고를 확인한다.

#### Metro 설정 수정 {#modify-the-metro-config}

Expo의 Metro는 `bun`, `npm`, `yarn` 용 monorepo를 지원한다. `expo/metro-config` 설정을 사용하는 경우 monorepo에 Metro를 수동으로 설정할 필요가 없다. 그런 경우라면 이 단계를 건너뛸 수 있다.

Metro를 수동으로 monorepo에 설정하려면 두 가지 주요 변경 사항이 있다:

1. Metro가 `apps/cool-app` 뿐만 아니라 monorepo 내의 모든 관련 코드를 감시하고 있는지 확인한다.
2. Metro가 패키지를 리졸브할 수 있도록 위치를 알려준다. 패키지는 `apps/cool-app/node_modules` 또는 `node_modules` 에 설치될 수 있다.

다음과 같이 `metro.config.js` 를 생성하여 설정할 수 있다:

```js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// 프로젝트 및 워크스페이스 디렉토리 찾기
const projectRoot = __dirname;
// 이는 'find-yarn-workspace-root'로 대체될 수 있음
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. monorepo 내의 모든 파일 감시
config.watchFolders = [monorepoRoot];
// 2. Metro에 패키지를 해결할 위치와 순서 알려주기
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
```

:::note
Metro 커스터마이징에 대한 자세한 내용은 [문서](https://docs.expo.dev/guides/customizing-metro)를 참조한다.
:::

:::important Monorepo에서 왜 모든 파일을 감시해야 할까?

Metro는 번들링 프로세스에서 세 가지 별도의 단계를 거치는데, 자세한 내용은 [여기](https://facebook.github.io/metro/docs/concepts)에 문서화되어 있다. 첫 번째 단계인 **해석(Resolution)** 중에 Metro는 앱에 필요한 파일과 종속성을 해석한다. Metro는 이를 `watchFolders` 옵션으로 수행하는데, 기본적으로 프로젝트 디렉토리로 설정된다. 이 기본 설정은 monorepo 구조를 사용하지 않는 앱에 매우 적합하다.

monorepo를 사용할 때는 앱의 종속성이 여러 디렉토리로 분할된다. 이 디렉토리들은 각각 `watchFolders` 의 범위 내에 있어야 한다. 변경된 파일이 해당 범위 밖에 있다면 Metro는 이를 찾을 수 없다. 이 경로를 monorepo의 루트로 설정하면 Metro가 저장소 내의 모든 파일을 감시하도록 강제하여 초기 시작 시간이 느려질 수 있다.

monorepo의 크기가 커질수록 monorepo 내의 모든 파일을 감시하는 것은 점점 더 느려진다. 앱에서 사용하는 패키지만 감시하면 속도를 높일 수 있다. 일반적으로 이는 **package.json**에서 별표(\*)로 설치된 패키지들이다. 예를 들면 다음과 같다:

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(monorepoRoot);

// 앱에서 사용하는 monorepo 내의 패키지만 나열합니다. 다른 것은 추가할 필요 없다.
// monorepo 도구가 앱 워크스페이스에 연결된 워크스페이스 목록을 제공할 수 있다면,
// 하드코딩 대신 이 목록을 자동화할 수 있다.
const monorepoPackages = {
  '@acme/api': path.resolve(monorepoRoot, 'packages/api'),
  '@acme/components': path.resolve(monorepoRoot, 'packages/components'),
};

// 1. 로컬 앱 폴더와 공유 패키지만 감시한다(범위를 제한하고 속도를 높임).
// 이를 `monorepoRoot`에서 `projectRoot`로 변경하는것에 주목한다. 이는 최적화의 일부다!
config.watchFolders = [projectRoot, ...Object.values(monorepoPackages)];

// monorepo 워크스페이스를 Metro의 `extraNodeModules`에 추가한다.
// monorepo 도구가 `node_modules` 폴더에 워크스페이스 심볼릭 링크를 생성하는 경우,
// Metro에 심볼릭 링크 지원을 추가하거나 `extraNodeModules`를 설정하여 심볼릭 링크를 피할 수 있다.
// 참조: https://facebook.github.io/metro/docs/configuration/#extranodemodules
config.resolver.extraNodeModules = monorepoPackages;

// 2. Metro에 패키지를 해석할 위치와 순서를 알려준다.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];
```

:::

:::important 왜 Metro에게 패키지를 해석하는 방법을 알려줘야 할까?

이 옵션은 라이브러리를 올바른 **node_modules** 디렉토리에서 해석하는 데 중요하다. Yarn과 같은 monorepo 도구는 일반적으로 단일 워크스페이스에 사용되는 두 개의 서로 다른 **node_modules** 디렉토리를 생성한다.

1. **apps/mobile/node_modules** - "프로젝트" 폴더
2. **node_modules** - "루트" 폴더

Yarn은 루트 폴더를 사용하여 여러 워크스페이스에서 사용되는 패키지를 설치한다. 워크스페이스가 다른 패키지 버전을 사용하는 경우, 해당 다른 버전을 프로젝트 폴더에 설치한다.

우리는 Metro에게 이 두 폴더를 모두 찾아보라고 알려줘야 한다. 여기서 순서가 중요한데, 프로젝트 폴더의 **node_modules**에는 우리 앱에 사용하는 특정 버전이 포함될 수 있기 때문이다. 패키지가 프로젝트 폴더에 없으면 공유 루트 폴더를 시도해야 한다.

다음과 같이 Metro 설정에서 `nodeModulesPaths` 옵션을 사용하여 이를 지정할 수 있다:

```javascript
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];
```

이렇게 하면 Metro는 먼저 프로젝트 폴더의 `node_modules` 에서 패키지를 찾고, 거기에 없으면 monorepo 루트의 `node_modules` 에서 찾는다.

이 설정은 monorepo 환경에서 Metro가 올바른 패키지 버전을 해석하고 사용할 수 있도록 보장한다. 프로젝트별 종속성과 공유 종속성을 적절히 구분하여 처리할 수 있게 해준다.
:::

#### 기본 엔트리포인트 변경 {#change-default-entrypoint}

Monorepo에서는 패키지가 어디에 설치되어 있는지 확신할 수 없기 때문에 패키지 경로를 하드코딩할 수 없다.

관리형 프로젝트를 사용하는 경우 `node_modules/expo/AppEntry.js` 와 같이 기본 엔트리포인트를 직접 지정해야 한다.

앱의 `package.json` 을 열고 `main` 프로퍼티를 `index.js` 로 변경한 다음 아래 내용으로 앱 디렉토리에 새 `index.js` 파일을 생성한다.

```js
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent는 AppRegistry.registerComponent('main', () => App)를 호출한다.
// 또한 Expo Go 또는 기본 빌드에서 앱을 로드하든 상관없이
// 환경이 적절하게 설정되도록 한다.
registerRootComponent(App);
```

:::note
이 새로운 엔트리포인트는 베어(bare) 프로젝트에는 이미 존재한다. 관리형 프로젝트를 사용하는 경우에만 이를 추가해야 한다.
:::

[Expo Router](https://docs.expo.dev/router/introduction)를 사용하는 경우 `npx expo start` 명령을 실행할 때 [`EXPO_USE_METRO_WORKSPACE_ROOT`](https://docs.expo.dev/more/expo-cli#environment-variables) 환경 변수를 정의한다. 이는 Metro의 자동 서버 루트 감지 기능을 활성화한다.

```bash
EXPO_USE_METRO_WORKSPACE_ROOT=1 npx expo start
```

이 변수는 `.env` 파일 내에서도 정의될 수 있다.

### 패키지 생성하기 {#create-a-package}

Monorepo는 단일 저장소에서 코드를 그룹화하는 데 도움이 된다. 여기에는 앱뿐만 아니라 별도의 패키지도 포함된다. 또한 패키지를 배포할 필요가 없다. Expo 저장소에서도 이러한 방식을 사용한다. 모든 Expo SDK 패키지는 저장소의 `packages/` 폴더에 있다. 이를 통해 배포하기 전에 `apps/` 중 하나에서 코드를 테스트할 수 있다.

루트로 돌아가서 `packages/` 폴더를 생성해 보자. 이 폴더에는 만들고 싶은 모든 별도의 패키지가 포함된다. 이 폴더 안에 새 하위 폴더를 추가해야 한다. 하위 폴더는 앱 내에서 사용할 수 있는 별도의 패키지다. 아래 예시에서는 이름을 `cool-package` 로 지정했다.

```bash
mkdir -p packages/cool-package
cd packages/cool-package
yarn init
```

패키지 생성에 대해 너무 자세히 다루지는 않겠다. 익숙하지 않다면 monorepo 없이 간단한 앱을 사용하는 것을 고려해 보자. 그러나 예시를 완성하기 위해 다음 내용으로 `index.js` 파일을 추가해보자:

```js
export const greeting = 'Hello!';
```

### 패키지 사용하기 {#using-the-package}

표준 패키지와 마찬가지로 `cool-app` 에 `cool-package` 를 종속성으로 추가해야 한다. 표준 패키지와 monorepo의 패키지의 주요 차이점은 버전 대신 항상 "패키지의 현재 상태"를 사용한다는 것이다. 앱 `package.json` 파일에 `"cool-package": "*"` 를 추가하여 앱에 `cool-package` 를 추가한다:

```json
{
  "name": "cool-app",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "cool-package": "*",
    "expo": "~50.0.0",
    "expo-status-bar": "~1.10.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.73.0",
    "react-native-web": "~0.19.6"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  }
}
```

:::note
패키지를 종속성으로 추가한 후 `yarn install` 을 실행하여 종속성을 앱에 설치하거나 연결한다.
:::

이제 앱 내에서 패키지를 사용할 수 있다! 이를 테스트하기 위해 앱의 `App.js` 를 편집하고 `cool-package` 에서 `greeting` 텍스트를 렌더링해 본다.

```js
{% raw %}import { greeting } from 'cool-package';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{greeting}</Text>
      <StatusBar style="auto" />
    </View>
  );
}{% endraw %}
```

## 일반적인 이슈 {#common-issues}

앞서 언급했듯이 monorepo 사용은 모든 사람에게 적합하지 않다. 복잡성이 증가하고 마주칠 가능성이 높은 문제를 해결해야 한다. 다음은 자주 직면할 수 있는 몇 가지 일반적인 문제다.

### Monorepo 내 여러 React Native 버전 {#multiple-react-native-version-within-the-monorepo}

Expo SDK 50 이상은 격리된 모듈과 같은 보다 완전한 node_modules 패턴에 대한 지원이 개선되었다. 불행히도 React Native는 단일 monorepo 내에 여러 버전을 설치할 때 여전히 문제를 일으킬 수 있다. 따라서 단일 버전의 React Native만 사용하는 것이 좋다.

사용하는 패키지 관리자를 통해 monorepo에 여러 React Native 버전이 있는지, 그리고 왜 설치되었는지 확인할 수 있다.

```bash
bun install --yarn && yarn why react-native
npm why react-native
pnpm why --recursive react-native
yarn why react-native
```

### Yarn 워크스페이스 대신 다른 monorepo 도구를 사용할 수 있는가? {#can-i-use-another-monorepo-tool-instead-of-yarn-workspaces}

사용 가능한 많은 monorepo 도구가 있으며, 각 도구에는 장단점이 있다. 최신 도구와 방법을 따라잡기 어려우므로 새로운 monorepo 도구를 공식적으로 지원할 수 없습니다. 그렇다고 해도 도구가 다음 세 가지 규칙을 따른다면 잘 작동할 것이다.

1. **모든 종속성은 node_modules 디렉토리에 설치되어야 한다.**
2. **여러 워크스페이스에서 사용되는 종속성은 루트 node_modules 디렉토리에 설치될 수 있다.**
3. **다른 버전의 종속성은 앱 node_modules 디렉토리에 설치되어야 한다.**

[`pnpm`](https://pnpm.io/) 과 같은 도구의 기본 설정은 이러한 규칙을 따르지 않는다. `.npmrc` 파일에 `node-linker=hoisted` 를 추가하여 이를 변경할 수 있다([문서](https://pnpm.io/npmrc#node-linker) 참조).

### **'...' 스크립트가 존재하지 않습니다** {#script-does-not-exist}

React Native는 패키지를 사용하여 JavaScript와 네이티브 파일을 모두 제공한다. 이러한 네이티브 파일도 **android/app/build.Gradle**의 **react-native/react.Gradle** 파일과 같이 연결되어야 한다. 보통 이 경로는 다음과 같이 하드코딩된다:

**Android** ([출처](https://github.com/facebook/react-native/blob/e918362be3cb03ae9dee3b8d50a240c599f6723f/template/android/app/build.gradle#L84))

```groovy
apply from: "../../node_modules/react-native/react.gradle"
```

**iOS** ([출처](https://github.com/facebook/react-native/blob/e918362be3cb03ae9dee3b8d50a240c599f6723f/template/ios/Podfile#L1))

```ruby
require_relative '../node_modules/react-native/scripts/react_native_pods'
```

안타깝게도 [hoisting](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/)으로 인해 monorepo에서는 이 경로가 다를 수 있다. 또한 [Node module resolution](https://nodejs.org/api/modules.html#all-together)을 사용하지 않는다. 이를 하드코딩하는 대신 Node를 사용하여 패키지의 위치를 찾으면 이 문제를 피할 수 있다:

**Android** ([출처](https://github.com/expo/expo/blob/6877c1f5cdca62b395b0d5f49d87f2f3dbb50bec/templates/expo-template-bare-minimum/android/app/build.gradle#L87))

```groovy
apply from: new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim(), "../react.gradle")
```

**iOS** ([출처](https://github.com/expo/expo/blob/61cbd9a5092af319b44c319f7d51e4093210e81b/templates/expo-template-bare-minimum/ios/Podfile#L2))

```ruby
require File.join(File.dirname(`node --print "require.resolve('react-native/package.json')"`), "scripts/react_native_pods")
```

위의 코드 조각에서 Node의 `require.resolve()` 메서드를 사용하여 패키지 위치를 찾는 것을 볼 수 있다. 우리는 엔트리포인트의 위치가 아니라 패키지의 루트 위치를 찾고 싶기 때문에 `package.json`을 명시적으로 참조한다. 그리고 그 루트 위치를 사용하여 패키지 내의 예상되는 상대 경로를 해석할 수 있다. 자세한 내용은 [여기](https://github.com/expo/expo/blob/4633ab2364e30ea87ca2da968f3adaf5cdde9d8b/packages/expo-modules-core/README.mdx#importing-native-dependencies---autolinking)를 참조한다.

SDK 43부터 시작하는 모든 Expo SDK 모듈과 템플릿에는 이러한 동적 참조가 있으며 monorepo와 함께 작동한다. 그러나 가끔 하드코딩된 경로를 여전히 사용하는 패키지가 있을 수 있다. `patch-package` 로 수동으로 편집하거나 패키지 관리자에게 이를 요청할 수 있다.

### **expo-yarn-workspaces 제거** {#remove-expo-yarn-workspaces}

SDK 43 이전에는 `expo-yarn-workspaces`가 Expo 프로젝트에서 Yarn 워크스페이스를 사용하는 권장 방법이었다. 이는 필요한 모든 종속성을 앱의 **node_modules** 폴더로 다시 symlink하는 데 사용되었다. 이는 대부분의 앱에서 작동하지만 몇 가지 결함이 있다. 예를 들어 동일한 패키지의 여러 버전에서는 잘 작동하지 않는다.

Expo SDK 43에서 monorepo 지원을 개선하기 위해 몇 가지 중요한 변경 사항을 만들었다. 새로운 Expo 모듈의 자동 링커는 이제 상위 **node_modules** 폴더에서도 패키지를 찾는다. 템플릿 내부의 네이티브 파일에는 패키지에 대한 하드코딩된 경로가 포함되어 있지 않다.

이 가이드를 따르고 있다면 프로젝트의 종속성에서 해당 패키지를 제거해야 한다.
