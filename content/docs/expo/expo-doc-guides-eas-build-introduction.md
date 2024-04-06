---
title: EAS Build 소개
description:
date: 2024-04-06
tags: [eas, eas_build]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/build/introduction/',
    },
  ]
---

**EAS Build**는 Expo 및 React Native 프로젝트의 앱 바이너리를 빌드하기 위한 호스팅 서비스다.

EAS Build는 Expo와 React Native 프로젝트에 최적화된 기본 설정을 제공하여 앱 배포 과정을 간소화하고 자동화한다. 또한 원하는 경우 앱 서명 자격 증명 관리 기능을 제공하여 개발자의 편의성을 높인다.

[내부 배포](https://docs.expo.dev/build/internal-distribution/) 기능(ad hoc 및 엔터프라이즈 "범용" 프로비저닝)을 통해 팀 내에서 빌드를 손쉽게 공유할 수 있으며, EAS Submit과의 긴밀한 연동으로 앱 스토어 제출 프로세스를 효율적으로 처리할 수 있다. 아울러 [`expo-updates`](https://docs.expo.dev/build/updates/) 라이브러리를 일급으로 지원하여 개발 과정에서의 유연성을 제공한다.

EAS Build는 관리형 워크플로우 사용 여부와 관계없이 모든 네이티브 프로젝트에 적용 가능하도록 설계되었다. 따라서 `npx create-expo-app` 이나 `npx react-native init` 으로 시작한 프로젝트를 빠르고 쉽게 앱 스토어에 출시할 수 있는 최적의 솔루션이라 할 수 있다.

## 시작하기 {#get-started}

- **첫 번째 빌드 만들기**
  - iOS 및/또는 Android를 시작하고 실행다.
- **내부 테스터와 앱 공유하기**
  - EAS Build는 단일 URL로 앱의 미리보기 빌드를 공유할 수 있다.
- **제출 자동화**
  - 서비스가 성공적인 빌드를 가져와서 앱 스토어에 자동으로 업로드한다.
- **앱 버전 관리**
  - 버전 업데이트를 자동화하여 다시는 이에 대해 고민할 필요가 없다.
- **로컬 또는 자체 인프라에서 빌드 실행**
  - EAS Build는 호스팅 서비스이지만 디버깅을 위해 또는 회사 보안 정책을 준수하기 위해 자체 머신에서 실행할 수도 있다.
- **제한 사항**
  - EAS Build는 새롭고 빠르게 발전하고 있으므로 현재 제한 사항을 숙지하는 것이 좋다.
