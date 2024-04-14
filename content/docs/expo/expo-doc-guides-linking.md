---
title: 링킹
description: 링크를 사용하여 URL 체계에 따라 URL을 처리하는 방법을 알아본다.
date: 2024-04-14
tags: [linking]
references:
  [{ key: 'Expo 공식 문서', value: 'https://docs.expo.dev/guides/linking/' }]
---

URL은 네이티브 애플리케이션을 실행하는 가장 강력한 방법이다. 그 이유는 다음과 같다:

1. **URL 체계(scheme)는 각 운영 체제에 내장되어 있다. 이를 통해 URL의 scheme을 보고 어떤 앱이 이를 처리해야 하는지 결정한다.**
   - 예를 들어, `https://` 나 `http://` 로 시작하는 URL은 Chrome이나 Safari 같은 웹 브라우저 앱에 전달된다.
   - `mailto://` 는 이메일 앱에, `tel://` 은 전화 앱에 연결된다.
2. **React Native로 빌드한 앱과 같은 네이티브 앱은 자체적인 URL 체계를 정의할 수 있다.**
   - 예를 들어, `myapp://path/to/something` 과 같은 형식으로 앱 전용 URL을 만들 수 있다.
   - 이 URL을 클릭하거나 열면, 해당 앱이 실행되고 지정된 경로나 매개변수를 JavaScript 코드에서 처리할 수 있다.
3. **JavaScript React 계층에서는 Linking API를 통해 앱을 실행한 URL을 받아서 필요한 작업을 수행할 수 있다.**
   - 앱이 특정 화면을 열거나, 데이터를 표시하거나, 특정 기능을 실행하는 등의 작업을 할 수 있다.
   - 이를 통해 앱 간 연동이나 웹에서 앱으로의 딥링크 등을 구현할 수 있다.

즉, URL 체계와 링크 처리 기능을 활용하면 운영 체제와 브라우저, 앱이 서로 긴밀하게 연동되어 사용자에게 더 풍부하고 매끄러운 경험을 제공할 수 있다. 이는 네이티브 기능과 웹의 장점을 결합한 React Native 앱에 특히 유용하다.

## 앱에서 링크 연결하기 {#linking-from-your-app}

[`expo-linking`](https://docs.expo.dev/versions/latest/sdk/linking/) API는 네이티브 링킹 API(웹의 window.history 등)를 보편적으로 추상화한다. 이를 통해 URL을 열거나, 앱 내에서 이동하거나, URL에서 데이터를 파싱할 수 있다.

```tsx
import * as Linking from 'expo-linking';

Linking.openURL('https://expo.dev');
```

웹 브라우저에는 "복사를 위한 오른쪽 클릭", "미리보기를 위한 마우스 오버"와 같은 추가 링크 기능이 있다. [`@expo/html-elements`](https://www.npmjs.com/package/@expo/html-elements) 패키지를 사용하여 범용 `<A />` 요소를 얻을 수 있다.

```bash
npx expo install @expo/html-elements
```

```tsx
import { A } from '@expo/html-elements';

export default function App() {
  return <A href="https://google.com">Go to Google</A>;
}
```

이는 웹에서는 `<a />` 를 렌더링하고 네이티브에서는 Linking API를 사용하는 대화형 `<Text />` 를 렌더링한다. React Navigation과 같은 라우터에는 앱 내에서 이동하는데 사용해야 하는 내장 [링킹 컴포넌트](https://reactnavigation.org/docs/link)가 있다.

### 일반적인 URL 스키마 {#common-url-scheme}

모든 플랫폼에 존재하는 핵심 기능에 대한 몇 가지 URL 스키마가 있다. 다음은 전체 목록은 아니지만 가장 일반적으로 사용되는 체계를 보여준다.

| 스킴         | 설명                                          |
| ------------ | --------------------------------------------- |
| `https/http` | 브라우저 앱을 연다. 예: `https://expo.dev`    |
| `mailto`     | 메일 앱을 연다. 예: `mailto:support@expo.dev` |
| `tel`        | 전화 앱을 연다. 예: `tel:+123456789`          |
| `sms`        | SMS 앱을 연다. 예: `sms:+123456789`           |

최신 Android 버전에서는 링크를 열려면 `AndroidManifest.xml` 에 적절한 쿼리를 포함해야 한다. 이는 설정 플러그인에서 설정할 수 있다.

예를 들어, 아래의 설정 플러그인은 전화 및 이메일 앱으로 링크를 허용한다.

```js
// my-plugin.js
const { withAndroidManifest } = require('@expo/config-plugins');

const withAndroidQueries = (config) => {
  return withAndroidManifest(config, (config) => {
    config.modResults.manifest.queries = [
      {
        intent: [
          {
            action: [{ $: { 'android:name': 'android.intent.action.SENDTO' } }],
            data: [{ $: { 'android:scheme': 'mailto' } }],
          },
          {
            action: [{ $: { 'android:name': 'android.intent.action.DIAL' } }],
          },
        ],
      },
    ];

    return config;
  });
};

module.exports = withAndroidQueries;
```

그런 다음 프로젝트의 앱 설정에 [커스텀 설정 플러그인을 import](https://docs.expo.dev/config-plugins/plugins-and-mods/#import-a-plugin)할 수 있다.

### 커스텀 URL 스키마 {#custom-url-scheme}

다른 앱의 커스텀 스키마를 알고 있다면 해당 앱으로 링크를 걸 수 있다. 일부 서비스는 딥링킹을 위한 문서를 제공하는데, 예를 들어 [Lyft의 딥링킹 문서](https://developer.lyft.com/v1/docs/deeplinking)에는 특정 픽업 위치와 목적지로 직접 연결하는 방법이 설명되어 있다:

```text
lyft://ridetype?id=lyft&pickup[latitude]=37.764728&pickup[longitude]=-122.422999&destination[latitude]=37.7763592&destination[longitude]=-122.4242038
```

이 URL을 사용하면 Lyft 앱이 실행되면서 지정된 위치로 픽업과 목적지가 설정된다.

하지만 사용자에게 Lyft 앱이 설치되어 있지 않을 수도 있다. 이 경우에는 App Store나 Play Store를 열어 앱을 설치하도록 안내하는 것이 좋다. 이런 상황에서는 [`react-native-app-link`](https://github.com/fiber-god/react-native-app-link) 라이브러리를 사용하는 것을 추천한다. 이 라이브러리는 앱이 설치되어 있는지 확인하고, 설치되어 있지 않다면 사용자를 스토어 페이지로 안내할 수 있게 도와준다.

iOS에서는 `Linking.canOpenURL` 을 사용하여 다른 앱의 링킹 스키마를 확인하려면 추가 설정이 필요하다. 앱 설정 파일(`app.json/app.config.js`)에서 `expo.ios.infoPlist` 키를 사용하여 앱이 쿼리해야 하는 스키마 목록을 지정할 수 있다.

예를 들면 다음과 같다:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "LSApplicationQueriesSchemes": ["lyft"]
      }
    }
  }
}
```

이 목록을 지정하지 않으면, 디바이스에 앱이 설치되어 있는지 여부에 관계없이 `Linking.canOpenURL` 이 `false` 를 반환한다.

주의할 점은, 이 설정은 네이티브 변경사항이 필요하므로 개발 빌드에서만 테스트할 수 있다는 것이다. Expo Go에서 테스트할 때는 적용되지 않는다.

이런 식으로 다른 앱과의 연동을 위해 맞춤 URL 스키마를 활용할 수 있다. 다만 사용자 경험을 고려하여, 앱이 설치되어 있지 않을 경우에 대한 대응책도 마련해두는 것이 좋다.

### URL 생성하기 {#creating-urls}

`Linking` 모듈은 앱 내에서 URL을 처리하고 생성하는 데 사용된다. 이 모듈은 환경에 따라 적절한 URL 스키마를 사용하여 앱 간 연결, 웹과 앱 간 연결 등을 가능하게 한다.

`Linking.createURL()` 함수는 이 모듈의 핵심 기능 중 하나인데, _앱 내의 특정 경로를 가리키는 URL을 생성한다. 이 함수가 생성하는 URL의 형태는 앱이 실행되는 환경에 따라 달라진다._

- **프로덕션 및 개발 빌드에서의 동작:**
  - `Linking.createURL()` 은 `myapp://` 같은 커스텀 URL 스키마를 사용한다.
  - 이 스키마는 앱의 설정 파일(`app.json` 등...)에서 설정한다.
  - 이렇게 생성된 URL을 열면, 해당 앱이 실행되고 지정된 경로로 이동한다.
  - 자세한 내용은 [여기](https://docs.expo.dev/guides/linking/#linking-to-your-app)를 참조한다.
- **Expo Go에서 개발 중일 때의 동작:**
  - `Linking.createURL()` 은 `exp://` 스키마를 사용한다.
  - URL은 `exp://127.0.0.1:8081` 과 같은 형태가 되며, Expo Go 앱에서 개발 중인 앱을 가리킨다.
  - SDK 버전에 따라 포트 번호가 다를 수 있다(예: SDK 48 이하에서는 `19000`).
- **Expo Go에서 업데이트를 로드할 때의 동작:**
  - 이 경우 `Linking.createURL()` 의 동작은 일관적이지 않고 안정적이지 않다.
  - URL의 형태는 프로젝트가 어떻게 로드되었느냐에 따라 달라진다.
    - `exp://u.expo.dev/[project-id]/group/[update-group-id]` 또는 `exp://u.expo.dev/[project-id]/update/[update-id]`.
    - 프로젝트 ID는 안정적이지만 업데이트 그룹 ID와 업데이트 ID는 안정적이지 않다.
  - 안정적인 URL이 필요한 경우(예: OAuth 리디렉션), 커스텀 스키마를 사용하는 개발 빌드를 사용해야 한다.

또한 `Linking.createURL()` 함수는 두 번째 인자로 옵션 객체를 받을 수 있는데, 이를 통해 쿼리 매개변수를 지정할 수 있다. 이렇게 전달된 데이터는 URL의 일부가 되어 앱에서 사용할 수 있다.

예를 들어:

```js
const redirectUrl = Linking.createURL('path/into/app', {
  queryParams: { hello: 'world' },
});
```

이 코드는 환경에 따라 다음과 같이 리졸브 된다.

- **프로덕션 & 개발 빌드**: `myapp://path/into/app?hello=world`
- **Expo Go**: `exp://127.0.0.1:8081/--/path/into/app?hello=world`
- **Expo Go에서 업데이트를 로드할 때**: `exp://u.expo.dev/[project-id]/group/[update-group-id]/--/path/into/app?hello=world`

:::note
여기서 `/--/` 같은 특별한 마커가 사용되는데, 이는 Expo Go에게 그 뒤의 부분이 앱 자체의 경로가 아니라 딥링크 경로임을 알려주는 역할을 한다.
:::

이런 식으로 `Linking` 모듈과 `createURL()` 함수를 사용하면, 앱의 특정 지점을 가리키는 URL을 환경에 맞게 쉽게 생성할 수 있고, 또 그 URL을 통해 데이터를 전달할 수도 있다. 이는 앱 내 화면 이동, 앱 간 연동, 웹-앱 간 연동 등 다양한 상황에서 유용하게 활용될 수 있다.

### 인앱 브라우저 {#in-app-browsers}

[expo-linking](https://docs.expo.dev/versions/latest/sdk/linking/) API를 사용하면 운영 체제의 기본 애플리케이션으로 URL을 열 수 있으며, [expo-web-browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/) 모듈을 사용하여 인앱 브라우저로 URL을 열 수 있다. 인앱 브라우저는 특히 보안 [인증](https://docs.expo.dev/guides/authentication/)에 유용하다.

```bash
npx expo install expo-web-browser
```

```tsx
import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="Open URL with the system browser"
        onPress={() => Linking.openURL('https://expo.dev')}
        style={styles.button}
      />
      <Button
        title="Open URL with an in-app browser"
        onPress={() => WebBrowser.openBrowserAsync('https://expo.dev')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 10,
  },
});
```

## 앱에 연결하기 {#linking-to-your-app}

개발 빌드 또는 독립형 앱에 연결하려면 앱의 커스텀 URL 체계를 지정해야 한다. 앱 구성(`app.json/app.config.js`)의 `scheme` 키에 문자열을 추가하여 스키마를 등록할 수 있다.

```json
// app.json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

앱을 빌드하고 설치하면 `myapp://` 링크로 앱을 열 수 있다.

:::note
[Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)는 앱의 iOS 번들 식별자/안드로이드 패키지를 URL 스키마에 자동으로 추가한다.
:::

### Expo Go에 연결하기 {#linking-to-expo-go}

Expo Go와 딥링킹의 동작을 좀 더 자세히 살펴보자.

1. **Expo Go의 URL 스키마**:
   - Expo Go는 `exp://` 스키마를 사용하여 앱을 식별하고 실행한다.
   - 만약 `exp://` 뒤에 아무 주소도 없이 링크를 열면, 단순히 Expo Go 앱의 홈 화면이 열린다.
   - 특정 앱을 열려면 `exp://` 뒤에 해당 앱의 주소를 지정해야 한다.
2. **개발 중인 앱의 주소**:
   - 개발 중에는 앱이 로컬 서버에서 실행되며, 주소는 일반적으로 `exp://127.0.0.1:8081` 과 같은 형태다.
   - 여기서 `127.0.0.1` 은 로컬 기기를 가리키는 IP 주소이고, `8081` 은 Expo 개발 서버의 포트 번호다.
   - SDK 48 이하 버전에서는 포트 번호가 `19000`으로 설정되어 있다.
   - 이 주소를 Expo Go에서 열면 개발 중인 앱이 실행된다.
3. **게시된 앱의 주소**:
   - 앱을 Expo에 게시하면, 해당 앱은 `u.expo.dev` 도메인의 특정 주소에 호스팅된다.
   - 이 주소는 `exp://u.expo.dev/[project-id]?channel-name=[channel-name]&runtime-version=[runtime-version]`와 같은 형태다.
   - `[project-id]`는 앱의 고유 식별자이며, `[channel-name]`과 `[runtime-version]`은 앱의 특정 버전을 지정하는 데 사용된다.
   - 이 주소를 Expo Go에서 열면 게시된 앱의 해당 버전이 실행된다.
4. **모바일 브라우저에서의 테스트**:
   - Expo Go의 딥링킹은 모바일 브라우저에서도 동작한다.
   - 예를 들어, `exp://u.expo.dev/F767ADF57-B487-4D8F-9522-85549C39F43F?channel-name=main&runtime-version=exposdk:45.0.0` 와 같은 주소를 모바일 브라우저의 주소창에 입력하면, 해당 앱의 특정 버전이 Expo Go에서 열린다.
   - 이를 통해 앱의 링크를 쉽게 공유하고 테스트할 수 있다.
5. **`exp://` 와 `exps://`의 차이**:
   - 기본적으로 Expo Go는 `exp://` 링크를 `http://` 링크로 취급한다. 즉, `exp://` 뒤의 주소는 일반 HTTP URL로 해석된다.
   - 만약 HTTPS URL을 열어야 한다면 `exps://` 를 사용해야 한다. 이는 `exp://` 의 보안 버전이라고 볼 수 있다.
   - 다만 `exps://` 는 현재 자체 서명된 인증서나 신뢰할 수 없는 인증서를 사용하는 사이트는 지원하지 않는다.

이렇게 Expo Go는 웹 기술과 네이티브 기능을 매끄럽게 연결하며, 개발과 배포 과정을 크게 단순화합니다. 개발자는 앱의 URL만 알면 디버깅, 테스트, 공유 등을 쉽게 할 수 있고, 사용자는 그 URL을 통해 앱을 설치하지 않고도 실행할 수 있다. 이는 Expo 플랫폼의 핵심 기능 중 하나로, React Native 앱 개발과 배포를 크게 단순화해주는 역할을 한다.

### 링크 처리하기 {#handling-links}

앱을 시작한 링크는 `Linking.useURL` React 훅을 사용하여 관찰할 수 있다.

```tsx
import * as Linking from 'expo-linking';
import { Text } from 'react-native';

export default function App() {
  const url = Linking.useURL();

  return <Text>URL: {url}</Text>;
}
```

이 훅은 백그라운드에서 다음의 필수 API 메서드를 사용합니다:

- 앱을 시작한 링크는 처음에 [`Linking.getInitialURL()`](https://docs.expo.dev/versions/latest/sdk/linking/#linkinggetinitialurl) 에서 반환된다.
- 앱이 이미 열려 있는 동안 트리거된 새 링크는 [`Linking.addEventListener('url', callback)`](https://docs.expo.dev/versions/latest/sdk/linking/#linkingaddeventlistenertype-handler) 로 관찰된다.

더 자세한 내용은 [expo-linking](https://docs.expo.dev/versions/latest/sdk/linking/) API 문서를 참조한다.

### URL 구문 분석 {#parsing-urls}

`Linking.parse()` 함수를 사용하여 URL에서 경로, 호스트 이름 및 쿼리 매개변수를 구문 분석한다. 다른 URL 구문 분석 방법과 달리 이 함수는 [Expo Go 링킹](https://docs.expo.dev/guides/linking/#linking-to-expo-go)과 같은 비표준 구현을 고려합니다.

```tsx
function App() {
  const url = Linking.useURL();

  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams,
      )}`,
    );
  }

  return null;
}
```

### URL 테스트 {#testing-urls}

:::note
스키마를 추가하면 앱을 다시 빌드해야 한다.
:::

```bash
# 커스텀 빌드
npx uri-scheme open myapp://somepath/into/app?hello-world --ios

# 개발 중 Expo Go (`127.0.0.1:8081`을 개발 서버 주소로 조정한다.)
npx uri-scheme open exp://127.0.0.1:8081/--/somepath/into/app?hello=world --ios
```

제공된 명령어를 통해 특정 URL을 열 수 있다. 또한 기기의 기본 브라우저에서 URL을 검색하여 열 수도 있다. 예를 들어 iOS에서 Safari를 열고 `exp://` 를 입력한 다음 검색하면 Expo Go를 열라는 메시지가 표시된다(설치된 경우).
