---
title: 프로젝트 생성하기
description: 새로운 Expo 프로젝트를 만드는 방법에 대해 알아본다.
date: 2024-06-01
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/get-started/create-a-project/',
    },
  ]
---

## 프로젝트 생성하기 {#create-a-project}

:::note 시스템 요구사항

- [Node.js (LTS)](https://nodejs.org/en/).
- macOS, Windows (Powershell 및 [WSL 2](https://expo.fyi/wsl)), Linux

:::

`create-expo-app` 으로 생성된 기본 프로젝트로 시작하는 것을 추천한다. 기본 프로젝트에는 시작하는 데 도움이 되는 예제 코드가 포함되어 있다.

새 프로젝트를 만들려면 다음 명령을 실행한다:

```bash
npx create-expo-app@latest
```

:::note
기본 프로젝트 템플릿에는 [Expo Router](https://docs.expo.dev/router/introduction/) 라이브러리가 포함되어 있다. 다른 종류의 프로젝트를 만들고 싶다면, `--template` 옵션을 사용한다.

예를 들어, `--template` 옵션에 `blank` 를 지정하면, 기본 프로젝트가 생성된다. 이 프로젝트에는 필수적인 라이브러리만 설치되어 있고, 네비게이션은 설정되어 있지 않다. 때문에 이 옵션을 사용하면 내게 필요한 것만 골라서 설치할 수 있다. 만약 처음부터 모든 것을 직접 설정하고 싶다면 `blank` 템플릿을 선택한다. 하지만 대부분의 경우에는 기본 템플릿을 사용하는 것이 더 편리할 것이다.
:::

## 정리 {#summary}

- [`create-expo-app`](https://www.npmjs.com/package/create-expo-app) 을 사용하여 프로젝트를 생성할 수 있다.
- [`--template`](https://github.com/expo/expo/tree/cced50e3289c22000af4c57d1424f3ef43406e42/templates) 옵션으로 템플릿을 변경할 수 있다.
