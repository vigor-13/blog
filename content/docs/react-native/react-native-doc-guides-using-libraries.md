---
title: 라이브러리 사용하기
description:
date: 2024-06-07
tags: []
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/libraries',
    },
  ]
---

React Native는 앱에서 바로 사용할 수 있는 일련의 내장 [Core Components와 API](https://reactnative.dev/docs/components-and-apis)를 제공한다.

여기에 React Native에는 수천 명의 개발자 커뮤니티가 있다.

Core Components와 API에 원하는 기능이 없다면 커뮤니티에서 라이브러리를 찾아 사용할 수 있다.

## 패키지 관리자 선택하기

React Native 라이브러리는 일반적으로 [npm CLI](https://docs.npmjs.com/cli/npm) 나 [Yarn Classic](https://classic.yarnpkg.com/en/) 같은 Node.js 패키지 관리자를 사용하여 [npm 레지스트리](https://www.npmjs.com/)에서 설치한다.

Node.js가 설치되어 있다면 npm CLI도 함께 설치되어 있다.

일부 개발자는 약간 더 빠른 설치 시간과 Workspaces와 같은 추가적인 고급 기능 때문에 Yarn Classic을 선호한다.

두 도구 모두 React Native와 잘 작동한다.

:::tip
JavaScript 커뮤니티에서 <u>라이브러리</u> 와 <u>패키지</u>는 같은 의미로 사용된다.
:::

## 라이브러리 설치하기

프로젝트에 라이브러리를 설치하려면 터미널에서 프로젝트 디렉토리로 이동하여 설치 명령을 실행한다.

```bash
npm install react-native-webview
```

설치한 라이브러리에 네이티브 코드가 포함되어 있는 경우, 사용하기 전에 앱에 연결해야 한다.

## iOS에서 네이티브 코드 연결하기

React Native는 <u>CocoaPods</u>을 사용하여 iOS 프로젝트 종속성을 관리하며 대부분의 React Native 라이브러리도 이 규칙을 따른다.

그렇지 않은 경우에는 해당 라이브러리의 README를 참조한다.

대부분의 경우 다음 지침이 적용된다.

- 네이티브 iOS 프로젝트에 연결하려면 `ios` 디렉토리에서 `pod install` 명령을 실행한다.
- `ios` 디렉토리로 전환하지 않고 이를 수행하는 명령은 `npx pod-install` 이다.

```bash
npx pod-install
```

작업이 완료되면 새 라이브러리를 사용하기 위해 앱을 다시 빌드한다:

```bash
npm run ios
```

## 안드로이드에서 네이티브 코드 연결하기

React Native는 <u>Gradle</u>을 사용하여 안드로이드 프로젝트 종속성을 관리한다.

라이브러리를 설치한 후에는 새 라이브러리를 사용하기 위해 앱을 다시 빌드해야 한다:

```bash
npm run android
```

## 라이브러리 찾기

[React Native Directory](https://reactnative.directory/)는 React Native 전용 라이브러리 검색 데이터베이스다.

디렉토리에서 찾을 수 있는 많은 라이브러리는 [React Native Community](https://github.com/react-native-community/) 또는 [Expo](https://docs.expo.dev/versions/latest/)에서 제공한다.

React Native Community에서 구축한 라이브러리는 자원봉사자들과 React Native에 의존하는 회사에 소속된 개인 개발자들이 주도하고 있다.

이 라이브러리들은 대부분 iOS, tvOS, Android, Windows 등 다양한 플랫폼을 지원하지만, 구체적인 지원 범위는 프로젝트마다 조금씩 차이가 있다.

React Native Community에 속한 여러 라이브러리들은 과거에는 React Native의 Core Component와 API에 포함되어 있었지만, 현재는 커뮤니티로 이관되어 관리되고 있다.

Expo에서 구축한 라이브러리는 모두 TypeScript로 작성되었으며 가능한 경우 iOS, Android 및 react-native-web을 지원한다.

[npm 레지스트리](https://www.npmjs.com/)에서도 React Native 라이브러리를 찾을 수 있다.

npm 레지스트리는 JavaScript 라이브러리의 핵심 소스이지만, 여기에 등록된 라이브러리가 모두 React Native와 호환되는 것은 아니다.

## 라이브러리 호환성 결정하기

### React Native에서 작동하는가?

보통 다른 플랫폼을 위해 특화된 라이브러리는 React Native에서 작동하지 않는다.

예를 들어, `react-select` 는 웹용으로 만들어졌고 `react-dom` 을 직접 사용하도록 설계되었다.

또한 `rimraf` 는 Node.js 환경을 위한 라이브러리로, 컴퓨터의 파일 시스템을 직접 다룬다.

반면 `lodash` 같은 라이브러리는 순수한 JavaScript로 작성되어 있어서 거의 모든 JavaScript 환경에서 문제없이 동작한다.

경험이 쌓이면 어떤 라이브러리가 React Native와 호환되는지 감을 잡을 수 있게 되지만, 처음에는 직접 설치해보는 것이 가장 확실한 방법이다.

### 내 앱이 지원하는 플랫폼에서 작동하는가?

React Native Directory에서는 iOS, Android, Web, Windows 등 라이브러리가 지원하는 플랫폼별로 검색 결과를 필터링할 수 있다.

하지만 아직 React Native Directory에 등록되지 않은 라이브러리도 많으므로, 원하는 라이브러리가 검색되지 않는다면 해당 라이브러리의 README 파일을 살펴보는 것이 좋다.

### 내 앱의 React Native 버전에서 작동하는가?

대부분의 경우 라이브러리의 최신 버전은 React Native의 최신 버전과 호환된다.

하지만 프로젝트에서 React Native의 이전 버전을 사용하고 있다면, 라이브러리의 어떤 버전을 설치해야 할지 해당 라이브러리의 README를 참조해야 한다.

특정 버전의 라이브러리를 설치하려면 `npm install` 명령에 라이브러리 이름과 함께 버전을 명시하면 된다.

예를 들어 `@react-native-community/netinfo` 라이브러리의 `2.0.0` 버전을 설치하려면 다음과 같다:

```bash
npm install @react-native-community/netinfo@^2.0.0
```
