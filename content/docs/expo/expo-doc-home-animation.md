---
title: 애니메이션
description: react-native-reanimated 라이브러리를 Expo 프로젝트에서 사용하는 방법을 알아본다.
date: 2024-04-12
tags: [animation, react-native-reanimated]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/user-interface/animation/',
    },
  ]
---

애니메이션은 사용자 경험을 향상시키고 개선하는 좋은 방법이다. Expo 프로젝트에서는 React Native의 [Animated API](https://reactnative.dev/docs/next/animations)를 사용할 수 있다. 하지만 더 나은 성능으로 고급 애니메이션을 사용하고 싶다면 [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) 라이브러리를 사용한다. 이 라이브러리는 부드럽고 강력하며 유지보수 가능한 애니메이션을 만드는 과정을 단순화하는 API를 제공한다.

## 설치 {#installation}

다음 명령을 실행하여 `react-native-reanimated` 를 설치한다

```bash
npx expo install react-native-reanimated
```

:::tabs

@tab:active SDK 50 이상#sdk-50

SDK 50 이상에서는 추가 설정이 필요하지 않다. 라이브러리를 설치하면 `babel-expo-preset` 에서 [Reanimated Babel 플러그인](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#reanimated-babel-plugin)이 자동으로 설정된다.

:::

## 웹 지원 {#web-support}

:::tabs

@tab:active SDK 50 이상#sdk-50

SDK 50 이상에서 `react-native-reanimated` 를 사용할 때는 추가 설정이 필요하지 않다.

:::

## 기본 예제 {#minimal-example}

다음 예제는 `react-native-reanimated` 라이브러리를 사용하여 간단한 애니메이션을 만드는 방법을 보여준다. API와 사용법에 대한 자세한 내용은 [`react-native-reanimated` 문서](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation)를 참조한다.

```jsx
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { View, Button, StyleSheet } from 'react-native';

export default function AnimatedStyleUpdateExample() {
  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, style]} />
      <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
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
  box: {
    width: 100,
    height: 80,
    backgroundColor: 'black',
    margin: 30,
  },
});
```

이 예제에서는 `useSharedValue` 를 사용하여 애니메이션의 상태를 관리하고, `useAnimatedStyle` 을 사용하여 이 상태에 따라 동적으로 스타일을 업데이트한다. 버튼을 누르면 `randomWidth` 값이 변경되고, 이에 따라 박스의 너비가 애니메이션된다.

## 다른 애니메이션 라이브러리 {#other-animation-libraries}

[Moti](https://moti.fyi/) 와 같은 다른 애니메이션 패키지도 있다.
