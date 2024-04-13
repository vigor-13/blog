---
title: 라이브러리 사용하기
description: 프로젝트에서 React Native, Expo SDK 및 서드파티 기반 라이브러리를 사용하는 방법을 알아본다.
date: 2024-04-13
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/workflow/using-libraries/',
    },
  ]
---

Expo 프로젝트와 호환되는 라이브러리를 확인하는 방법을 알아본다.

## React Native 코어 라이브러리 {#react-native-core-libraries}

React Native는 크로스 플랫폼 모바일 앱 개발을 위한 프레임워크로, 개발자들이 iOS와 Android 앱을 동시에 개발할 수 있도록 도와준다. React Native는 이를 위해 일련의 내장 컴포넌트와 API를 제공하는데, 이를 **프리미티브(primitives)** 라고 부른다.

프리미티브는 React Native 앱을 구성하는 기본 구성 요소로, 대부분의 앱에서 공통적으로 사용되는 UI 요소와 기능을 포함한다.

예를 들면 다음과 같은 것들이 있다:

- `<ActivityIndicator>` : 로딩 중임을 나타내는 회전하는 표시기다.
- `<TextInput>` : 사용자로부터 텍스트 입력을 받을 수 있는 컴포넌트다.
- `<Text>` : 화면에 텍스트를 렌더링하는 컴포넌트다.
- `<ScrollView>` : 스크롤 가능한 컨테이너 뷰다.
- `<View>` : UI를 구성하기 위한 기본 컨테이너 컴포넌트다.

이러한 프리미티브는 React Native의 핵심 컴포넌트이며, 대부분의 앱에서 필수적으로 사용된다. 이들은 React Native 공식 문서의 [Core Components and APIs](https://reactnative.dev/docs/components-and-apis) 섹션에 자세히 설명되어 있다.

Expo는 React Native를 기반으로 하는 프레임워크로, React Native의 기능을 더욱 확장하고 개발 경험을 향상시킨다. Expo SDK는 React Native의 특정 버전과 호환되도록 설계되었으며, 각 Expo SDK 버전은 해당하는 React Native 버전을 기반으로 한다. 따라서 [현재 사용 중인 Expo SDK 버전에 해당하는 React Native 버전을 확인](https://docs.expo.dev/versions/latest/)할 수 있다.

프로젝트에서 React Native 컴포넌트나 API를 사용하려면 코드에서 `react-native` 패키지에서 `import` 한다.

```tsx
{% raw %}import * as React from 'react';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <Text>Hello, world!</Text>
    </View>
  );
}{% endraw %}
```

## Expo SDK 라이브러리 {#expo-sdk-libraries}

Expo SDK는 React Native에서 제공하는 기본 기능 외에 추가적인 기능과 라이브러리를 제공한다. 이를 통해 개발자는 더욱 쉽고 빠르게 앱을 개발할 수 있다.

React Native 자체는 UI 컴포넌트와 기본적인 기능만 제공하는 반면, Expo SDK는 이에 더해 오디오 재생, 바코드 스캔, 카메라 제어, 일정 관리, 연락처 액세스, 비디오 재생 등 다양한 기능을 추가로 제공한다. 이는 대부분의 앱에서 필요로 하는 기능들이다.

예를 들어, 앱에서 사용자의 연락처에 접근해야 한다면 Expo의 Contacts API를 사용할 수 있다. 또는 앱 내에서 바코드를 스캔해야 한다면 Expo의 BarCodeScanner를 사용하면 된다. 이런 식으로 Expo SDK는 개발자가 직접 구현하기 복잡한 기능들을 간단한 API로 제공한다.

뿐만 아니라 Expo SDK는 앱의 업데이트, 지도 기능, OAuth 인증 등 강력한 기능들도 제공한다. 예를 들어, Expo의 Updates API를 사용하면 앱을 업데이트하기 위해 앱스토어에 새 버전을 제출할 필요 없이 JavaScript 코드와 에셋을 실시간으로 업데이트할 수 있습니다.

이렇게 Expo SDK는 React Native의 기능을 대폭 확장하여, 개발자가 더욱 쉽고 빠르게 강력한 앱을 개발할 수 있도록 돕는다. Expo 팀은 어떤 기능을 SDK에 포함할지 결정할 때, 대부분의 앱에서 공통적으로 필요로 하는 기능인지, 그 기능이 플랫폼 간에 일관된 인터페이스를 제공할 수 있는지 등을 고려한다고 한다. (자세한 내용은 [여기](https://github.com/expo/fyi/blob/main/whats-in-the-sdk.md)를 참조)

Expo SDK의 라이브러리를 사용하려면 [API 레퍼런스](https://docs.expo.dev/versions/latest/) 또는 공식 문서 검색 창을 통해 찾고자 하는 라이브러리를 검색할 수 있다.

![Expo SDK API 레퍼런스](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-guides-use-libraries/1.png)

### 플랫폼 호환성 표 {#platform-compatibility}

각 모듈 레퍼런스 페이지 상단에는 라이브러리에 대한 설명과 플랫폼 호환성 표가 표시된다.

| Android Device | Android Emulator | iOS Device | iOS Simulator | Web |
| -------------- | ---------------- | ---------- | ------------- | --- |
| ✅             | ✅               | ✅         | ✅            | ✅  |

플랫폼 호환성 표 다음에는 설치 섹션이 있으며, 다음과 같은 지침이 포함되어 있다:

```bash
npx expo install expo-device
```

다음으로 API 섹션 아래에 있는 참조 페이지에서 코드에서 라이브러리를 import하는 방법을 알려준다:

```tsx
import * as Device from 'expo-device';
```

이 밖에도 사용 가능한 모든 타입, 함수 및 클래스 정보도 제공하고 있다.

TypeScript를 사용하는 경우 이 정보를 자동 완성 기능을 사용하여 TypeScript 호환 코드 편집기(예: Visual Studio Code)에서 볼 수 있다.

이제 프로젝트에서 라이브러리를 사용할 수 있다.

```tsx
{% raw %}import * as React from 'react';
import { Text, View } from 'react-native';
import * as Device from 'expo-device';

export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <Text>
        {Device.manufacturer}: {Device.modelName}
      </Text>
    </View>
  );
}{% endraw %}
```

## 서드파티 라이브러리 {#third-party-libraries}

### 서드파티 라이브러리 찾기 {#finding-a-third-party-library}

[React Native Directory](https://reactnative.directory/)는 React Native용으로 특별히 구축된 라이브러리 검색 데이터베이스다. **React Native나 Expo SDK에서 제공하지 않는 라이브러리를 찾으려는 경우 이곳을 먼저 찾아보는 것이 좋다.**

React Native Directory 다음으로는 [npm 레지스트리](https://www.npmjs.com/)가 최선의 선택이다. npm 레지스트리는 JavaScript 라이브러리의 핵심 소스지만, 나열된 라이브러리가 모두 React Native와 호환되는 것은 아니다.

React Native는 Node.js, 웹 브라우저, Electron 등을 포함한 여러 JavaScript 프로그래밍 환경 중 하나이며, npm에는 이러한 모든 환경에서 작동하는 라이브러리가 포함되어 있다. React Native와 호환되는 모든 라이브러리는 개발 빌드를 만들 때 Expo 프로젝트와 호환된다. 그러나 Expo Go 앱과는 호환되지 않을 수 있다.

### 서드파티 라이브러리 호환성 확인 {#determining-third-party-library-compatibility}

프로덕션 수준의 앱을 구축하려면 Expo 개발 빌드를 사용한다. 여기에는 프로젝트 실행에 필요한 모든 네이티브 코드가 포함되어 있다. 앱을 앱스토어나 구글 플레이에 게시하기 전에 앱을 테스트하기에 좋다. 또한 네이티브 프로젝트(`android/ios` 디렉토리) 설정이 필요한 라이브러리를 포함할 수 있다.

**Expo Go 앱은 개발 빌드로 가기 위한 선택적 디딤돌이다. 앱을 개발하는 동안 빠르게 테스트하는 데 사용할 수 있지만 모든 라이브러리를 지원하는 데 필요한 모든 네이티브 코드는 포함하지 않는다.**

React Native Directory에서 `✔️ Expo Go` 태그가 있는지 확인하여 Expo Go와 호환되는 라이브러리를 찾을 수 있다. Expo Go로 필터를 활성화할 수도 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-guides-use-libraries/2.png)

새 종속성이 네이티브 프로젝트 디렉토리를 변경하는지 확인하려면 다음을 체크한다:

- 라이브러리에 android 또는 ios 디렉토리가 포함되어 있는가?
- 라이브러리의 README에 링킹이 언급되어 있는가?
- 라이브러리를 사용하려면 `android/app/src/main/AndroidManifest.xml` 이나 `ios/Podfile` 또는 `ios/Info.plist` 를 변경해야 하는가?
- 라이브러리에 [config 플러그인](https://docs.expo.dev/config-plugins/introduction/)이 있는가?

이러한 질문 중 하나라도 "예"라고 대답했다면 프로젝트에서 라이브러리를 사용하기 위해서 개발 빌드를 만들어야 한다.

React Native Directory에 해당 라이브러리가 등록되어 있지 않다면 어떻게 해야할까? 이 경우 GitHub에서 프로젝트를 찾을 수 있다.

이를 수행하는 간단한 방법은 `npx npm-home --github <package-name>` 명령을 사용하는 것이다.

예를 들어 `react-native-localize` 의 GitHub 페이지를 열려면 다음을 실행한다:

```bash
npx npm-home --github react-native-localize
```

### 서드파티 라이브러리 설치 {#installing-a-third-party-library}

:::note
가능한 경우 Expo CLI가 라이브러리의 호환 버전을 선택하고 알려진 비호환성에 대해 경고할 수 있도록 `npm install` 이나 `yarn add` 대신 항상 `npx expo install` 을 사용하는 것이 좋다.
:::

라이브러리가 React Native와 호환되는지 확인한 후 Expo CLI를 사용하여 패키지를 설치한다:

```bash
npx expo install @react-navigation/native
```

추가 설정 및 사용 지침은 프로젝트 웹사이트나 README를 참조한다. 다음 명령을 사용하여 README에 빠르게 액세스할 수 있다:

```bash
npx npm-home @react-navigation/native
```

모듈에 추가 네이티브 설정이 필요한 경우 config 플러그인을 사용하여 설정할 수 있다. 일부 패키지에는 config 플러그인이 필요하지만 아직 없는 경우 [out-of-tree-config-plugins](https://github.com/expo/config-plugins/)을 참조할 수 있다.

모듈이 Expo Go에서 지원되지 않는 경우 개발 빌드를 생성한다:

- [커스텀 네이티브 코드 추가하기](https://docs.expo.dev/workflow/customizing/)
