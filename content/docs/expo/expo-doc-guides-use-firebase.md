---
title: Firebase 사용하기
description: Firebase JS SDK 및 React Native Firebase 라이브러리를 시작하고 사용하는 방법에 대한 가이드다.
date: 2024-04-07
tags: [firebase]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/guides/using-firebase/',
    },
  ]
---

[Firebase](https://firebase.google.com/)는 Google의 인프라를 기반으로 구축된 Backend-as-a-Service(BaaS) 앱 개발 플랫폼이다. 이 플랫폼은 개발자들에게 실시간 데이터베이스, 클라우드 스토리지, 사용자 인증, 크래시 리포팅, 앱 분석 등 다양한 호스팅된 백엔드 서비스를 제공하여 앱 개발 프로세스를 간소화한다. Firebase의 가장 큰 장점 중 하나는 앱의 사용자와 데이터 요구 사항이 증가함에 따라 자동으로 확장되어 원활한 사용자 경험을 보장한다는 것이다. 이를 통해 개발자들은 백엔드 인프라 관리에 대한 걱정 없이 앱의 핵심 기능 개발에 집중할 수 있다.

Firebase를 프로젝트에서 사용하는 방법에는 두 가지가 있다:

- [Firebase JS SDK](https://docs.expo.dev/guides/using-firebase#using-firebase-js-sdk) 사용
- [React Native Firebase](https://docs.expo.dev/guides/using-firebase#using-react-native-firebase) 사용

React Native는 JS SDK와 네이티브 SDK를 모두 지원한다. 다음 섹션에서는 어떤 SDK를 사용해야 하는지와 Expo 프로젝트에서 Firebase를 사용하기 위해 필요한 모든 설정 단계를 안내한다.

## 요구 사항 {#prerequisites}

계속하기 전에 [Firebase 콘솔](https://console.firebase.google.com/)을 사용하여 새 Firebase 프로젝트를 만들었거나 기존 프로젝트가 있는지 확인한다.

## Firebase JS SDK 사용하기 {#using-firebase-js-sdk}

[Firebase JS SDK](https://firebase.google.com/docs/web/setup)는 프로젝트에서 Firebase 서비스와 상호 작용할 수 있는 JavaScript 라이브러리다. React Native 앱에서 [Authentication](https://firebase.google.com/docs/auth), [Firestore](https://firebase.google.com/docs/firestore), [Realtime Database](https://firebase.google.com/docs/database) 및 [Storage](https://firebase.google.com/docs/storage)와 같은 서비스를 지원한다.

### Firebase JS SDK를 사용해야 하는 경우 {#when-to-use-firebase-js-jdk}

다음과 같은 경우 Firebase JS SDK 사용을 고려할 수 있다:

- 앱에서 Authentication, Firestore, Realtime Database 및 Storage와 같은 Firebase 서비스를 사용하고 Expo Go로 앱을 개발하려는 경우.
- Firebase 서비스를 빠르게 시작하려는 경우.
- Android, iOS 및 웹용 범용 앱을 만들려는 경우.

### 주의 사항 {#firebase-js-sdk-caveats}

Firebase JS SDK는 "웹" 애플리케이션을 위해 설계되었기 때문에 모바일 앱 개발에 필요한 모든 Firebase 서비스를 완벽하게 지원하지는 않는다. 예를 들어, Analytics, Dynamic Links, Crashlytics 등의 몇 가지 중요한 모바일 전용 기능은 Firebase JS SDK에서 사용할 수 없다. 이러한 한계를 극복하고 모바일 앱에서 Firebase의 모든 기능을 활용하고자 하는 개발자는 React Native Firebase를 사용하는 것이 좋다. React Native Firebase는 네이티브 Android 및 iOS SDK를 래핑하여 JavaScript를 통해 Firebase의 모든 기능에 액세스할 수 있도록 해주는 라이브러리다. 따라서 모바일 앱 개발 시 Analytics, Dynamic Links, Crashlytics 등의 고급 기능이 필요하다면 [React Native Firebase](https://docs.expo.dev/guides/using-firebase#using-react-native-firebase) 사용을 고려해야 한다.

### Firebase JS SDK 설치 및 초기화 {#install-and-initialize-firebase-js-sdk}

다음 하위 섹션은 `firebase@9.x.x` 를 사용한다. Expo SDK는 앱에서 사용할 Firebase의 특정 버전을 강제하거나 권장하지 않는다.

프로젝트에서 이전 버전의 Firebase 라이브러리를 사용 중인 경우 [Firebase JS SDK 문서](https://github.com/firebase/firebase-js-sdk)의 도움을 받아 사용 중인 버전과 일치하도록 코드 예제를 수정해야 할 수 있다.

#### 1단계: SDK 설치 {#install-the-sdk}

Expo 프로젝트를 생성한 후 다음 명령을 사용하여 Firebase JS SDK를 설치한다:

```bash
npx expo install firebase
```

#### 2단계: SDK 초기화 {#initialize-the-sdk-in-your-project}

Expo 프로젝트에서 Firebase 인스턴스를 초기화하려면 config 객체를 만들고 `firebase/app` 모듈에서 가져온 `initializeApp()` 메서드에 전달해야 한다.

config 객체에는 API 키와 기타 고유 식별자가 필요하다. 이러한 값을 얻으려면 Firebase 프로젝트에서 웹 앱을 등록해야 한다. [Firebase 문서](https://firebase.google.com/docs/web/setup#register-app)에서 이에 대한 지침을 찾을 수 있다.

API 키 및 기타 식별자를 얻은 후 프로젝트의 루트 디렉터리 또는 설정 파일을 보관하는 다른 디렉터리에서 새 `firebaseConfig.js` 파일을 만들어 다음 코드를 추가한다:

```js
import { initializeApp } from 'firebase/app';

// 원하는 서비스를 import 할 수 있다.
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Firebase 초기화
const firebaseConfig = {
  apiKey: 'api-key',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-id',
  storageBucket: 'project-id.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// 프로젝트에서 Firebase에 접근하는 방법을 알아보려면 다음 문서를 확인한다.
// Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
```

Firebase JS SDK를 사용하기 위해 다른 플러그인이나 설정을 설치할 필요는 없다.

Firebase 버전 9는 모듈식 API를 제공한다. `firebase` 패키지에서 사용하려는 서비스를 직접 import할 수 있다. 예를 들어 프로젝트에서 인증 서비스를 사용하려는 경우 `firebase/auth` 패키지에서 auth 모듈을 가져올 수 있다.

:::note
버전 9 이하에서 Firebase Authentication을 사용한다면? [다시 로드할 때마다 사용자가 로그인 상태를 유지하도록 지속성 설정 가이드](https://expo.fyi/firebase-js-auth-setup)를 참조한다.
:::

#### Metro 설정 {#configure-metro}

:::note
Firebase 버전 9 이상을 사용하는 경우 다음 설정을 `metro.config.js` 파일에 추가하여 Firebase JS SDK가 올바르게 번들링 되도록 해야 한다.
:::

Expo CLI는 [Metro](https://facebook.github.io/metro/)를 사용하여 JavaScript 코드와 에셋을 번들링하고 [다양한 파일 확장자를 지원](https://docs.expo.dev/guides/customizing-metro#adding-more-file-extensions-to--assetexts)한다.

프로젝트 루트 디렉터리에서 다음 명령을 사용하여 `metro.config.js` 템플릿 파일을 생성하는 것부터 시작한다:

```bash
npx expo customize metro.config.js
```

그런 다음 파일을 다음과 같이 수정한다:

```js
// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
```

### 다음 단계 {#next-steps}

- [Authentication](https://firebase.google.com/docs/auth/web/start)
  - 프로젝트에서 인증을 사용하는 방법에 대한 자세한 내용은 Firebase 문서를 참조한다.
- [Firestore](https://firebase.google.com/docs/firestore/quickstart)
  - 프로젝트에서 Firestore 데이터베이스를 사용하는 방법에 대한 자세한 내용은 Firebase 문서를 참조한다.
- [Realtime Database](https://firebase.google.com/docs/database)
  - 프로젝트에서 Realtime Database를 사용하는 방법에 대한 자세한 내용은 Firebase 문서를 참조한다.
- [스토리지](https://firebase.google.com/docs/storage/web/start)
  - 스토리지 사용 방법에 대한 자세한 내용은 Firebase 문서를 참조한다.
- [Firebase 스토리지 예제](https://github.com/expo/examples/tree/master/with-firebase-storage-upload)
  - 예제를 통해 Expo 프로젝트에서 Firebase 스토리지를 사용하는 방법을 알아본다.
- [Firebase 프로젝트용 API 키 관리](https://firebase.google.com/docs/projects/api-keys)
  - Firebase 프로젝트의 API 키 및 고유 식별자 관리에 대한 자세한 내용을 참조한다.
- [Expo Firebase 패키지에서 React Native Firebase로 마이그레이션](https://expo.fyi/firebase-migration-guide)
  - expo-firebase-analytics 또는 expo-firebase-recaptcha 패키지에서 React Native Firebase로 마이그레이션하는 방법에 대한 자세한 내용을 참조한다.

## React Native Firebase 사용하기 {#using-react-native-firebase}

[React Native Firebase](https://rnfirebase.io/)는 Android 및 iOS용 네이티브 SDK를 JavaScript API로 래핑하여 네이티브 코드에 대한 액세스를 제공한다. 각 Firebase 서비스는 프로젝트에 종속성으로 추가할 수 있는 모듈에서 사용할 수 있다. 예를 들어 `auth` 모듈은 Firebase Authentication 서비스에 대한 액세스를 제공한다.

### React Native Firebase를 사용해야 하는 경우 {#when-to-use-react-native-firebase}

다음과 같은 경우 React Native Firebase 사용을 고려할 수 있다:

- 앱에서 [Dynamic Links](https://rnfirebase.io/dynamic-links/usage), [Crashlytics](https://rnfirebase.io/crashlytics/usage) 등 Firebase JS SDK에서 지원되지 않는 Firebase 서비스에 액세스해야 하는 경우. 네이티브 SDK에서 제공하는 추가 기능에 대한 자세한 내용은 [React Native Firebase 문서](https://rnfirebase.io/faqs-and-tips#why-react-native-firebase-over-firebase-js-sdk)를 참조한다.
- 앱에서 네이티브 SDK를 사용하려는 경우.
- React Native Firebase가 이미 구성된 React Native 앱이 있지만 Expo SDK를 사용하도록 마이그레이션하는 경우.
- 앱에서 [Firebase Analytics](https://rnfirebase.io/analytics/usage)를 사용하려는 경우.

:::note Expo Firebase 패키지에서 마이그레이션
프로젝트에서 이전에 `expo-firebase-analytics` 및 `expo-firebase-recaptcha` 패키지를 사용했다면, React Native Firebase 라이브러리로 마이그레이션할 수 있다. 자세한 내용은 [Firebase 마이그레이션 가이드](https://expo.fyi/firebase-migration-guide)를 참조한다.
:::

### 주의 사항 {#react-native-firebase-caveats}

React Native Firebase에는 [커스텀 네이티브 코드가 필요하므로 Expo Go와 함께 사용할 수 없다](https://docs.expo.dev/workflow/customizing).

### React Native Firebase 설치 및 초기화 {#install-and-initialize-react-native-firebase}

#### 1단계: expo-dev-client 설치 {#install-expo-dev-client}

React Native Firebase에는 커스텀 네이티브 코드가 필요하므로 프로젝트에 `expo-dev-client` 라이브러리를 설치해야 한다. 또한 직접 네이티브 코드를 작성하지 않고도 [설정 플러그인](https://docs.expo.dev/config-plugins/introduction)을 사용하여 React Native Firebase에 필요한 네이티브 코드를 설정할 수 있다.

다음 명령을 사용하여 `expo-dev-client` 를 설치한다:

```bash
npx expo install expo-dev-client
```

#### 2단계: React Native Firebase 설치 {#install-react-native-firebase}

React Native Firebase를 사용하려면 `@react-native-firebase/app` 모듈을 설치해야 한다. 이 모듈은 다른 모든 모듈의 핵심 기능을 제공한다. 또한 설정 플러그인을 사용하여 프로젝트에 커스텀 네이티브 코드를 추가한다.

다음 명령을 사용하여 설치할 수 있다:

```bash
npx expo install @react-native-firebase/app
```

이 시점에서 [React Native Firebase 문서](https://rnfirebase.io/#managed-workflow)의 지침을 따라야 한다. 프로젝트를 설정하는 데 필요한 모든 단계를 다룬다.

프로젝트에서 React Native Firebase 라이브러리를 설정한 후 이 가이드로 돌아와 다음 단계에서 프로젝트를 실행하는 방법을 알아 볼 수 있다.

#### 3단계: 프로젝트 실행 {#run-the-project}

[EAS Build](https://docs.expo.dev/build/introduction)를 사용하는 경우 개발 빌드를 만들어 기기에 설치할 수 있다. 개발 빌드를 만들기 전에 프로젝트를 로컬로 실행할 필요가 없다. 개발 빌드 생성에 대한 자세한 내용은 [개발 빌드 설치](https://docs.expo.dev/develop/development-builds/create-a-build) 섹션을 참조한다.

:::note
프로젝트를 로컬에서 실행하려면 Android Studio와 Xcode를 모두 설치 및 설정해야 한다. 자세한 내용은 [로컬 앱 개발 가이드](https://docs.expo.dev/guides/local-app-development)를 참조한다.

특정 React Native Firebase 모듈에 커스텀 네이티브 설정 단계가 필요한 경우 [앱 설정](https://docs.expo.dev/workflow/configuration) 파일에 `plugin` 으로 추가해야 한다. 그런 다음 프로젝트를 로컬에서 실행하려면 `npx expo run` 명령 전에 `npx expo prebuild --clean` 명령을 실행하여 네이티브 변경 사항을 적용해야 한다.
:::

### 다음 단계 {#next-steps2}

React Native Firebase 라이브러리를 설정을 완료하면 Expo 프로젝트에서 제공하는 모든 모듈을 사용할 수 있다.

- [React Native Firebase 문서](https://rnfirebase.io/)
  - React Native Firebase의 특정 모듈을 설치하고 사용하는 방법에 대한 자세한 내용은 해당 문서를 확인한다.
