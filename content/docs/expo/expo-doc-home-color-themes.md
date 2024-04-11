---
title: 컬러 테마
description: 앱에서 라이트 모드와 다크 모드를 지원하는 방법을 알아본다.
date: 2024-04-12
tags: [theme]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/user-interface/color-themes/',
    },
  ]
---

앱에서 라이트 모드와 다크 모드를 모두 지원하는 것은 흔한 일이다. 다음은 Expo 프로젝트에서 두 모드를 모두 지원하는 방법의 예시다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-color-themes/1.gif)

## 설정 {#configuration}

Android와 iOS에서 라이트 모드와 다크 모드 전환을 지원하려면 프로젝트에 추가 설정이 필요하다. (웹에서는 추가 설정이 필요하지 않다)

`app.json` 의 `userInterfaceStyle` 프로퍼티를 사용하여 사용 가능한 컬러 모드를 설정할 수 있다. 또한 `android.userInterfaceStyle` 또는 `ios.userInterfaceStyle` 을 원하는 값으로 설정하여 특정 플랫폼이 다른 컬러 모드를 지원하도록 구성할 수도 있다.

사용 가능한 옵션은 다음과 같다:

- `automatic` : 시스템 테마 설정을 따르고 사용자가 변경할 때마다 알림
- `light` : 앱을 라이트 테마만 지원하도록 제한
- `dark` : 앱을 다크 테마만 지원하도록 제한

이 프로퍼티가 없으면 앱은 기본적으로 라이트 모드가 된다. 다음은 설정 예시다:

```json
// app.json
{
  "expo": {
    "userInterfaceStyle": "automatic"
  }
}
```

개발 빌드에서는 네이티브 패키지 [`expo-system-ui`](https://docs.expo.dev/versions/latest/sdk/system-ui/#installation) 를 설치해야 한다. 그렇지 않으면 `userInterfaceStyle` 프로퍼티는 무시된다. 다음 명령어를 사용하여 프로젝트가 잘못 설정되었는지 확인할 수도 있다:

```bash
npx expo config --type introspect
```

프로젝트가 잘못 설정된 경우 다음과 같은 경고가 표시된다:

```text
» android: userInterfaceStyle: Install expo-system-ui in your project to enable this feature.
```

:::note 순수 React Native 앱을 사용하는 경우

**Android**

`AndroidManifest.xml` 의 `MainActivity`(및 이 동작이 필요한 다른 모든 액티비티)에 `uiMode` 플래그가 있는지 확인한다:

```xml
<activity android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode">
```

`MainActivity.java` 에서 `onConfigurationChanged` 메서드를 구현한다:

```java
import android.content.Intent; // <--- import
import android.content.res.Configuration; // <--- import
public class MainActivity extends ReactActivity {
  // ...

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    sendBroadcast(intent);
  }
  // ...
}
```

**iOS**

앱 `Info.plist` 에서 [`UIUserInterfaceStyle`](https://developer.apple.com/documentation/bundleresources/information_property_list/uiuserinterfacestyle) 키를 사용하여 지원되는 스타일을 구성할 수 있다. 라이트 모드와 다크 모드를 모두 지원하려면 `Automatic` 을 사용한다.

:::

## 테마 감지 {#detect-the-color-scheme}

프로젝트에서 테마를 감지하려면 `react-native` 의 `Appearance` 또는 `useColorScheme`을 사용한다:

```jsx
import { Appearance, useColorScheme } from 'react-native';
```

그런 다음 아래와 같이 `useColorScheme()` 훅을 사용한다:

```jsx
function MyComponent() {
  let colorScheme = useColorScheme();

  if (colorScheme === 'dark') {
    // 다크 모드 렌더링
  } else {
    // 라이트 모드 렌더링
  }
}
```

경우에 따라 `Appearance.getColorScheme()` 으로 현재 테마를 명령적으로 가져오거나 `Appearance.addChangeListener` 로 변경 사항을 수신하는 것이 도움될 수 있다.

## 기본 예제 {#minimal-example}

```jsx
import { Text, StyleSheet, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar'; // 테마에 따라 자동으로 바 스타일 전환

export default function App() {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Text style={[styles.text, themeTextStyle]}>
        Color scheme: {colorScheme}
      </Text>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  lightContainer: {
    backgroundColor: '#d0d0c0',
  },
  darkContainer: {
    backgroundColor: '#242c40',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
  },
});
```

## 팁 {#tips}

프로젝트를 개발하는 동안 다음 단축키를 사용하여 시뮬레이터 또는 기기의 테마를 변경할 수 있다:

- Android 에뮬레이터를 사용하는 경우 `adb shell "cmd uimode night yes"`를 실행하여 다크 모드를 활성화하고, `adb shell "cmd uimode night no"` 를 실행하여 다크 모드를 비활성화할 수 있다.
- 실제 기기나 Android 에뮬레이터를 사용하는 경우 기기 설정에서 시스템 다크 모드 설정을 전환할 수 있다.
- 로컬에서 iOS 에뮬레이터로 작업하는 경우 `Cmd ⌘ + Shift + a` 단축키를 사용하여 라이트 모드와 다크 모드 간에 전환할 수 있다.

이렇게 Expo 프로젝트에서 라이트 모드와 다크 모드를 모두 지원하려면 약간의 설정이 필요하지만, `useColorScheme` 훅을 사용하면 현재 테마에 따라 동적으로 스타일을 적용할 수 있다. 이를 통해 사용자의 선호도에 맞는 적응형 UI를 제공할 수 있다.
