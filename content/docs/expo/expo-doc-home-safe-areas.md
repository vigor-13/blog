---
title: 안전 영역
description: Expo 프로젝트에 안전 영역을 추가하는 방법과 기타 모범 사례를 알아본다.
date: 2024-04-11
tags: [safe_areas]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/user-interface/safe-areas/',
    },
  ]
---

:::note
[React Navigation 안전 영역](https://www.vigorously.xyz/docs/react-navigation/react-navigation-doc-supporting-safe-areas/) 문서를 함께 참조하는 것을 추천한다.
:::

안전 영역은 노치, 상태 표시줄, 홈 인디케이터 및 기타 인터페이스 요소 주변에 앱 콘텐츠를 적절하게 배치할 수 있도록 하는 좋은 방법이다.

앱 화면의 콘텐츠가 안전 영역 내에 위치하지 않으면 아래 예시와 같이 기기의 인터페이스 요소에 의해 가려질 수 있다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-safe-areas/1.png =80%x)

위 예시에서 콘텐츠는 화면 상단에 위치한다. Android에서는 상태 표시줄에 의해 가려지고, iOS에서는 둥근 모서리, 노치, 상태 표시줄에 의해 가려진다.

## `react-native-safe-area-context` 사용하기 {#use-react-native-safe-area-context}

[`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context)는 Android와 iOS 모두에 대해 기기 안전 영역 인셋 정보에 액세스할 수 있는 유연한 API를 제공한다. 또한 View 대신 사용하여 자동으로 안전 영역을 고려해 뷰를 인셋할 수 있는 `SafeAreaView` 컴포넌트도 제공한다.

이 라이브러리를 사용하면 이전 예시의 결과가 아래와 같이 변경되어 안전 영역 내에 콘텐츠를 표시한다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-safe-areas/2.png =80%x)

### 설치 {#installation}

아래 명령어를 실행하여 `react-native-safe-area-context`를 설치합니다:

```
npx expo install react-native-safe-area-context
```

### 사용법 {#usage}

#### `SafeAreaProvider` 추가 {#add-safeareaprovider}

라이브러리를 사용하려면 먼저 앱의 루트 컴포넌트에서 [`<SafeAreaProvider>`](https://github.com/th3rdwave/react-native-safe-area-context#safeareaprovider) 를 import해야 한다.

```jsx
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <View>
        <Text>My App</Text>
      </View>
    </SafeAreaProvider>
  );
}
```

그런 다음 안전 영역 인셋을 패딩이나 마진으로 적용한 일반 `<View>` 인 [`<SafeAreaView>`](https://github.com/th3rdwave/react-native-safe-area-context#safeareaview) 를 사용할 수 있다.

#### `useSafeAreaInsets` 훅 사용 {#use-usesafeareainsets-hook}

`<SafeAreaView>` 의 대안으로 안전 영역 인셋에 직접 액세스할 수 있는 [`useSafeAreaInsets`](https://github.com/th3rdwave/react-native-safe-area-context#usesafeareainsets) 훅을 사용할 수도 있다. 이는 더 많은 유연성과 제어력을 제공한다. 이 훅의 인셋을 사용하여 각 모서리에 패딩을 적용할 수 있다. 이 훅은 다음 형식으로 인셋을 제공한다:

```tsx
{
  top: number,
  right: number,
  bottom: number,
  left: number
}
```

## 기본 예제 {#minimal-working-example}

아래는 `useSafeAreaInsets` 훅을 사용하여 뷰에 상단 패딩을 적용하는 예제다.

```jsx
{% raw %}import { Text, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Text style={{ fontSize: 28 }}>Content is in safe area.</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}{% endraw %}
```

## React Navigation과 함께 사용 {#usage-with-react-navigation}

기본적으로 React Navigation은 안전 영역을 지원하며 `react-native-safe-area-context`를 피어 종속성으로 사용한다. 이 라이브러리를 어떻게 사용하는지에 대한 자세한 내용은 [React Navigation 문서](https://www.vigorously.xyz/docs/react-navigation/react-navigation-doc-supporting-safe-areas/)를 참조한다.

## 웹에서 사용 {#usage-with-web}

웹을 타겟팅하는 경우 훅 섹션에 설명된 대로 `<SafeAreaProvider>` 를 설정해야 한다. 서버 사이드 렌더링(SSR)을 하는 경우 라이브러리 문서의 Web SSR 섹션을 확인하는 것이 좋다.
