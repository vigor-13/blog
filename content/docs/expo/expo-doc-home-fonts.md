---
title: 폰트
description: 커스텀 폰트 사용, 각 플랫폼에서 지원되는 폰트 형식 및 로드에 대해 알아본다.
date: 2024-04-12
tags: [font]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/user-interface/fonts/',
    },
  ]
---

Andorid와 iOS 및 대부분의 데스크톱 운영체제에는 각자의 플랫폼 폰트 세트가 있다. 하지만 앱에 더 많은 브랜드 개성을 주입하고 싶다면 잘 선택된 폰트가 큰 역할을 할 수 있다.

각 운영체제마다 고유한 플랫폼 폰트 세트가 있기 때문에, 모든 사용자에게 일관된 경험을 제공하려면 프로젝트에서 커스텀 폰트를 사용해야 한다. 이 페이지에서는 커스텀 폰트를 가져오고 프로젝트에 로드하는 방법, 그리고 폰트가 프로젝트에 로드될 때 사용할 몇 가지 모범 사례에 대해 다룬다.

## 폰트 가져오기 {#get-a-font}

먼저 폰트 파일이 필요하다. 작업 예제로 Rasmus Anderson의 [무료 오픈 소스 폰트 패밀리](https://rsms.me/inter/)인 Inter Black을 사용할 것이다.

React Native 앱에서 일반적인 컨벤션은 `./assets/fonts` 디렉토리에 폰트를 저장하는 것이지만, 원하는 곳 어디에나 둘 수 있다.

## 지원되는 폰트 형식 {#supported-font-formats}

Expo SDK에서 Android, iOS, 웹 전반에 걸쳐 일관되게 동작하는 공식 지원 폰트 형식은 **OTF**와 **TTF**다. 다른 형식의 폰트라면 [고급 설정](https://docs.expo.dev/develop/user-interface/fonts/#beyond-otf-and-ttf)이 필요하다.

_OTF와 TTF 버전의 폰트가 모두 있다면 OTF를 사용한다._ OTF는 더 새로운 형식이며 `.otf` 파일은 종종 `.ttf` 파일보다 작다. 때로는 특정 상황에서 OTF 파일이 약간 더 잘 렌더링되기도 한다. 일반적으로 두 형식은 매우 유사하며 완벽하게 수용 가능하다.

### OTF와 TTF를 넘어서 {#beyond-otf-and-ttf}

만약 폰트가 다른 형식이라면 OTF와 TTF 이외의 폰트를 사용하기 위해 Metro 번들러 설정을 커스터마이징헤야 한다. 경우에 따라 플랫폼에서 지원하지 않는 폰트 형식을 렌더링하려고 하면 앱이 크래시될 수 있다.

참고로 아래 표는 각 플랫폼에서 어떤 형식이 동작하는지 보여준다:

| 형식    | 웹  | iOS | Android |
| ------- | --- | --- | ------- |
| `bdf`   | ❌  | ❌  | ❌      |
| `dfont` | ❌  | ❌  | ✅      |
| `eot`   | ✅  | ❌  | ❌      |
| `fon`   | ❌  | ❌  | ❌      |
| `otf`   | ✅  | ✅  | ✅      |
| `ps`    | ❌  | ❌  | ❌      |
| `svg`   | ✅  | ❌  | ❌      |
| `ttc`   | ❌  | ❌  | ❌      |
| `ttf`   | ✅  | ✅  | ✅      |
| `woff`  | ✅  | ✅  | ❌      |
| `woff2` | ✅  | ✅  | ❌      |

## 커스텀 폰트 사용하기 {#use-a-custom-font}

프로젝트에서 커스텀 폰트를 사용하는 방법에는 두 가지가 있다. **네이티브 프로젝트에 폰트를 포함**시키거나 **런타임에 로드**하는 것입니다. 첫 번째 방식이 더 간단하고 안정적이어서 권장된다. 두 번째 방식은 Expo Go에서 폰트를 로드하거나 원격 URL에서 로드할 때 유용하다.

### 네이티브 프로젝트에 폰트 포함시키기 {#embed-font-in-a-native-project}

:::note
`expo-font` 설정 플러그인은 SDK 50 이상에서만 사용할 수 있다. 이전 SDK를 사용 중이라면 [런타임에 폰트를 로드](https://docs.expo.dev/develop/user-interface/fonts/#load-the-font-at-runtime)할 수 있다.
:::

`expo-font` 라이브러리를 설치하고 [앱 설정](https://docs.expo.dev/versions/latest/config/app/) 파일에 설정 플러그인을 추가한다. 플러그인이 폰트를 네이티브 프로젝트에 포함시킬 것이다.

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": ["./assets/fonts/Inter-Black.otf"]
        }
      ]
    ]
  }
}
```

`fonts` 옵션은 네이티브 프로젝트에 연결할 폰트 파일 배열을 받는다. 각 폰트 파일의 경로는 프로젝트 루트에 대한 상대 경로다.

[새 네이티브 빌드를 생성](https://docs.expo.dev/develop/development-builds/create-a-build/)한 후에는 `fontFamily` 스타일 속성으로 프로젝트에서 폰트를 사용할 수 있다. Android에서는 확장자를 제외한 폰트 파일 이름이 폰트 패밀리 이름이 된다. iOS에서는 폰트 파일 자체에서 폰트 패밀리 이름을 읽어온다. 폰트 파일 이름을 PostScript 이름과 동일하게 지정하여 양쪽 플랫폼에서 패밀리 이름이 일관되도록 하는 것이 좋다. 예를 들어 **Inter-Black**이라는 폰트 패밀리가 있고 파일 이름이 `Inter-Black.otf` 라면, Android와 iOS 모두에서 폰트 패밀리 이름은 Inter-Black이 될 것이다.

새 네이티브 빌드 없이 폰트를 테스트해보려면 런타임에 로드할 수 있다. 자세한 내용은 아래 섹션을 참조한다.

:::note bare React Native 앱 환경이라면?

- **Android**: `android/app/src/main/assets/fonts` 경로에 폰트 파일을 추가한다.
- **iOS**: Apple 개발자 문서에서 [앱에 커스텀 폰트 추가하기](https://developer.apple.com/documentation/uikit/text_display_and_fonts/adding_a_custom_font_to_your_app)를 참조한다.

:::

### 런타임에 폰트 로드하기 {#load-font-at-runtime}

프로젝트에 폰트 파일을 추가한 후 [`expo-font`](https://docs.expo.dev/versions/latest/sdk/font/#installation) 라이브러리를 설치해야 한다.

#### 폰트 import하기 {#import-the-font}

그 다음 `expo-font` 패키지에서 `useFonts` 훅을 import한다. 이 훅은 폰트의 로딩 상태를 추적한다. 앱이 초기화되면 훅이 아래 예시와 같이 폰트 맵을 로드한다:

```jsx
// Rest of the import statements
{% raw %}import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  });
}{% endraw %}
```

그런 다음 `<Text>` 에서 `fontFamily` 스타일 속성을 사용하여 폰트를 적용할 수 있다.

```jsx
{% raw %}
<Text style={{ fontFamily: 'Inter-Black', fontSize: 30 }}>Inter Black</Text>
{% endraw %}
```

또는 [`Font.loadAsync`](https://docs.expo.dev/develop/user-interface/fonts/#use-fontloadasync-instead-of-the-usefonts-hook) 를 사용하여 앱에서 폰트를 로드할 수도 있다.

#### 기본 예제 {#minimal-example}

Inter 폰트 패밀리를 사용하는 기본 예제를 살펴보자. `./assets/fonts` 디렉토리에서 폰트를 가져오기 위해 `useFonts` 훅을 사용한다.

```jsx
{% raw %}import { useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text style={{ fontFamily: 'Inter-Black', fontSize: 30 }}>
        Inter Black
      </Text>
      <Text style={{ fontSize: 30 }}>Platform Default</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});{% endraw %}
```

Inter Black은 폰트가 꽤 특징적이므로 예제가 제대로 작동하는지 또는 문제가 있는지 알기 쉽다. 플랫폼 기본 폰트가 조금 다르게 보인다면 괜찮다. 플랫폼 기본 폰트는 운영체제와 기기 제조사(Android의 경우)에 따라 다를 수 있다.

기기에서 로드하면 다음과 같은 화면이 표시될 것이다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-fonts/1.jpeg =40%x)

이 예제가 포함된 프로젝트를 생성하려면, 터미널에서 다음의 명령어를 사용한다.

```bash
npx create-expo-app --example with-custom-font
```

:::note
위의 예제에서는 [`expo-splash-screen`](https://docs.expo.dev/versions/latest/sdk/splash-screen/) 패키지도 사용한다. 이에 대한 자세한 내용은 ["폰트 로드 대기"](https://docs.expo.dev/develop/user-interface/fonts/#wait-for-fonts-to-load) 섹션을 참조한다.
:::

## 플랫폼 기본 폰트

웹에서는 sans-serif, serif, monospace, fantasy, cursive와 같은 일반적인 폰트 패밀리를 지정할 수 있다. 하지만 이러한 폰트 패밀리는 실제 어떤 폰트로 렌더링될지 정확히 지정하는 것이 아니다. 대신 해당 카테고리에 속하는 폰트 중 브라우저나 운영체제에서 선택한 폰트가 사용된다.

- sans-serif
- serif
- monospace
- fantasy
- cursive

예를 들어, sans-serif 폰트 패밀리를 지정했다고 가정해 보자. 이 경우 아이폰의 사파리 브라우저에서는 San Francisco 폰트가 기본으로 사용되는 반면, 윈도우의 Microsoft Edge에서는 Arial 폰트가 사용될 것이다. 안드로이드의 크롬에서는 Roboto가, 원플러스 폰에서는 Slate가 사용되는 식으로 브라우저와 운영체제, 기기에 따라 실제 렌더링되는 폰트는 다양하다.

이처럼 웹에서 일반 폰트 패밀리를 지정하면 브라우저나 운영체제가 해당 카테고리에 적합한 폰트를 선택하게 된다. 따라서 개발자가 의도한 폰트와 다른 폰트가 사용될 수 있다.

이런 상황에서 가장 안전한 방법은 시스템 기본 폰트를 사용하는 것이다. 보통 시스템 기본 폰트는 해당 운영체제나 브라우저에서 가장 흔하게 사용되는 sans-serif 폰트로, 가독성이 좋고 사용자에게 익숙한 편이기 때문이다.

하지만 시스템 폰트도 완벽하지는 않다. 일부 브라우저나 기기에서는 시스템 기본 폰트가 읽기 어려운 폰트일 수도 있다. 이런 경우에는 직접 커스텀 폰트를 지정하여 사용하는 것이 좋다. 커스텀 폰트를 사용하면 브라우저나 기기에 상관없이 의도한 대로 폰트를 표시할 수 있기 때문이다.

## 구글 폰트 사용하기 {#use-a-google-font}

Expo는 [Google Fonts](https://fonts.google.com/)에서 제공하는 모든 폰트를 일류로 지원한다. 이 중 하나를 사용하려면 [`expo-google-fonts`](https://github.com/expo/google-fonts) 패키지를 사용한다. 이 패키지를 사용하면 모든 폰트나 폰트 변형을 빠르게 통합할 수 있다.

예를 들어 Inter 폰트를 사용하려면 아래 명령어로 `@expo-google-fonts/inter` 패키지를 설치할 수 있다.

```bash
npx expo install expo-font @expo-google-fonts/inter
```

폰트를 프로젝트에서 사용하려면 [설정 플러그인에 포함](https://docs.expo.dev/develop/user-interface/fonts/#with-config-plugin)시키거나 `useFonts` 훅을 사용할 수 있다.

### 설정 플러그인 사용 {#with-config-plugin}

이 방법을 사용하려면 폰트를 포함하는 [새 네이티브 빌드를 만들어야 한다.](https://docs.expo.dev/develop/development-builds/create-a-build/) `expo-fonts.fonts` 옵션에 원하는 폰트 파일 경로를 전달하면 된다. 예시는 다음과 같다:

```json
// app.json
{
  "plugins": [
    [
      "expo-font",
      {
        "fonts": ["node_modules/@expo-google-fonts/inter/Inter_100Thin.ttf"]
      }
    ]
  ]
}
```

사용 중인 폰트에 여러 weight(예: `Inter_100Thin`, `Inter_700Bold` 등)가 포함된 경우 Android의 경우 폰트 파일 이름을 직접 사용할 수 있다. iOS의 경우 폰트와 해당 weight 이름을 사용한다.

아래 예제는 각 플랫폼에 맞는 폰트 패밀리 이름을 선택하기 위해 `Platform` 을 사용하는 방법을 보여준다:

```jsx
{% raw %}import { Platform } from 'react-native';

// Inside a component:
<Text
  style={{
    fontFamily: Platform.select({
      android: 'Inter_100Thin',
      ios: 'Inter-Thin',
    }),
  }}
>
  Inter Thin
</Text>;{% endraw %}
```

### useFonts 훅 {#useFonts-hook}

각 Google Fonts 패키지는 편의를 위해 `useFonts` 훅을 제공한다. 내부적으로 이 훅은 [`Font.loadAsync`](https://docs.expo.dev/versions/latest/sdk/font/#loadasyncfontfamilyorfontmap-source) 를 사용한다. 패키지 자체에서 폰트 파일을 명시적으로 임포트하므로 별도로 임포트할 필요가 없다.

```jsx
{% raw %}import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Inter_900Black,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Inter_900Black', fontSize: 40 }}>
        Inter Black
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

{% endraw %}
```

## 폰트 로드 대기하기 {#wait-for-fonts-to-load}

네이티브 프로젝트에 폰트를 포함시키면 추가 코드 없이 바로 사용할 수 있다. 하지만 런타임에 폰트를 로드하는 경우에는 즉시 사용할 수 없다. 그러므로 폰트가 준비될 때까지 아무것도 렌더링하지 않는 것이 일반적으로 좋은 방법이다. 대신 `expo-splash-screen` 패키지를 사용하여 모든 폰트가 로드되거나 에러가 발생할 때까지 앱의 스플래시 스크린을 계속 표시할 수 있다.

### 웹에서 폰트 로드하기 {#load-fonts-on-the-web}

특히 웹에서는 커스텀 폰트가 로드되는 동안 플랫폼 기본 폰트로 콘텐츠를 렌더링하거나, 커스텀 폰트에 의존하지 않는 나머지 콘텐츠를 먼저 렌더링하는 방식을 선택하기도 한다. 이런 접근 방식을 FOUT(Flash of Unstyled Text)와 FOIT(Flash of Invisible Text)라고 하며, 웹에서 이에 대해 더 많이 알아볼 수 있다.

일반적으로 네이티브 앱에서는 이런 전략을 추천하지 않는다. 프로젝트에 폰트를 포함시키면 코드가 실행될 때 항상 폰트가 사용자에게 전달될 것이다. 다만 웹에서는 이 방식을 선호할 수 있다.

## 추가 정보 {#additional-information}

앱에서 커스텀 폰트를 효과적으로 사용하기 위해 여기서 다룬 내용 이상을 알 필요는 없을 것이다. 그래도 궁금하거나 위의 정보로 해결되지 않은 사용 사례가 있다면 다음을 계속 읽어보자.

### 웹에서 직접 원격 폰트 로드하기 {#loading-a-remote-font-directly-from-the-web}

일반적으로 로컬 애셋에서 폰트를 로드하는 것이 가장 좋고 안전하다. 앱 스토어에 제출하면 다운로드에 폰트가 포함되어 즉시 사용할 수 있다. CORS나 기타 잠재적 문제를 걱정할 필요가 없다.

하지만 프로젝트 애셋이 아닌 웹에서 직접 원격 폰트 파일을 로드하려면 `require('./assets/fonts/MyFont.otf')` 를 폰트의 URL로 바꾸면 된다. 아래 예제를 참고한다:

```jsx
{% raw %}import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-SemiBoldItalic': 'https://rsms.me/inter/font-files/Inter-SemiBoldItalic.otf?v=3.12',
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Inter-SemiBoldItalic', fontSize: 30 }}>
        Inter SemiBoldItalic
      </Text>
      <Text style={{ fontSize: 30 }}>Platform Default</Text>
    </View>
  );
}

const styles = StyleSheet.create({ ... });{% endraw %}
```

:::warning
원격 폰트를 로드할 때는 **CORS**가 올바르게 구성된 출처에서 제공되는지 확인해야한다. 그렇지 않으면 웹 플랫폼에서 원격 폰트가 제대로 로드되지 않을 수 있다.
:::

### useFonts 훅 대신 Font.loadAsync 사용하기 {#using-font-loadAsync-instead-of-the-useFonts-hook}

`useFonts` 훅을 사용하고 싶지 않다면(예를 들어 클래스 컴포넌트를 선호한다면) `Font.loadAsync` 를 사용할 수 있다. 내부적으로 `useFonts` 훅은 `expo-font` 라이브러리의 `Font.loadAsync` 를 사용한다. 원한다면 직접 사용할 수도 있고, 렌더링 전에 폰트 로드 시점을 더 세밀하게 제어하고 싶다면 이 방식을 쓸 수 있다.

```jsx
{% raw %}import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

let customFonts = {
  'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  'Inter-SemiBoldItalic': 'https://rsms.me/inter/font-files/Inter-SemiBoldItalic.otf?v=3.12',
};

export default class App extends React.Component {
  state = {
    fontsLoaded: false,
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={{ fontFamily: 'Inter-Black', fontSize: 30 }}>
          Inter Black
        </Text>
        <Text style={{ fontFamily: 'Inter-SemiBoldItalic', fontSize: 30 }}>
          Inter SemiBoldItalic
        </Text>
        <Text style={{ fontSize: 30 }}>Platform Default</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({ ... });{% endraw %}
```
