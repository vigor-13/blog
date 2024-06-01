---
title: 개발 시작하기
description: Expo 프로젝트에서 코드를 변경하고 기기에서 실시간으로 확인해본다.
date: 2024-06-01
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/get-started/start-developing/',
    },
  ]
---

## 개발 서버 시작하기 {#start-a-development-server}

개발 서버를 시작하려면 다음 명령을 실행한다:

```bash
npx expo start
```

## 기기에서 앱 열기 {#open-the-app-on-your-device}

위 명령을 실행한 후, 터미널에 QR 코드가 표시된다. 이 QR 코드를 스캔하여 기기에서 앱을 열 수 있다.

Android 에뮬레이터나 iOS 시뮬레이터를 사용하는 경우, 각각 `a` 또는 `i` 를 눌러 앱을 열 수 있다.

## 첫 번째 변경 만들기 {#make-your-first-change}

코드 편집기에서 **app/(tabs)/index.tsx** 파일을 열고 코드를 변경한다.

```diff-tsx
// app/(tabs)/index.tsx
      }
    >
      <ThemedView style={styles.titleContainer}>
-       <ThemedText type="title">Welcome!</ThemedText>
+       <ThemedText type="title">Hello World!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
```

**기기에 변경사항이 표시되지 않나요?**
