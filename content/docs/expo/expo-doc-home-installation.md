---
title: 설치
description:
date: 2024-04-02
tags: ['install']
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/get-started/installation/',
    },
  ]
---

Expo로 애플리케이션을 개발하려면 다음 요구 사항과 권장 도구를 확인한다.

## 요구 사항 {#requirements}

Expo를 사용하려면 다음 도구가 머신에 설치되어 있어야 한다:

- [Node.js LTS 릴리스](https://nodejs.org/en/) - Node.js LTS 릴리스(짝수)를 권장한다.
  - Node.js에서 공식적으로 명시한 바와 같이, "프로덕션 애플리케이션은 Active LTS 또는 Maintenance LTS 릴리스만 사용해야 한다".
  - Node.js 버전을 전환하기 위해 버전 관리 도구(`nvm`, `volta` 또는 기타 도구)를 사용하여 Node.js를 설치할 수 있다.
- 소스 제어를 위한 [Git](https://git-scm.com/).
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall) (Linux 또는 macOS 사용자의 경우).

## 시작하기 {#get-started}

Node.js를 설치한 후, `npx` 를 사용하여 새 앱을 만들 수 있다.

```bash
npx create-expo-app --template
```

## Expo CLI {#expo-cli}

[Expo CLI](https://docs.expo.dev/more/expo-cli/)는 `expo` 패키지의 일부이며, `npx` 를 활용하여 사용할 수 있다. 앱을 시작하려면 개발 머신에서 터미널을 열고 `npx expo` 명령을 실행한다:

```bash
# 개발 서버 시작
npx expo

# Expo CLI 명령어 목록 확인
npx expo --help
```

:::note
iOS 앱을 빌드하기 위해 macOS가 필요하지 않다. 개발 빌드를 실행하려면 iOS 디바이스만 있으면 된다. 개발 빌드가 무엇이고 프로젝트 빌드를 위해 어떻게 활용할 수 있는지 자세한 내용은 [문서](https://docs.expo.dev/develop/development-builds/introduction/)를 확인한다.
:::

## 권장 도구 {#recommended-tools}

- 더 빠르고 안정적인 의존성 관리를 위한 [Yarn Classic(v1)](https://classic.yarnpkg.com/en/docs/install). `npm` 과 `npx` 대신 사용할 수 있다.
- [VS Code](https://code.visualstudio.com/download) 와 디버깅 및 앱 구성 자동 완성을 쉽게 하기 위한 [Expo Tools VS Code extension](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools).

Yarn을 사용하는 경우, 다음 명령을 사용하여 새 앱을 부트스트랩할 수 있다:

```bash
yarn create expo
```

## **Windows 터미널 지원**

Expo CLI는 Windows 10 이상에서 다음 터미널과 호환된다:

- [PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/overview) (기본 터미널)
- Bash 셸을 사용하는 WSL 2 (Windows Subsystem for Linux)
