---
title: 소개
description: Expo로 앱을 만들어보자.
date: 2024-06-01
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/get-started/introduction/',
    },
  ]
---

## Expo란? {#what-is-expo}

- Expo는 Android와 iOS 앱을 더 쉽게 개발할 수 있도록 도와주는 오픈소스 프레임워크다.
- Expo는 **파일 기반 라우팅**, **빌트인 네이티브 모듈 라이브러리** 등을 제공하여 앱을 더 쉽고 빠르게 개발할 수 있도록 도와준다.
- Expo는 [Github](https://github.com/expo/expo), [Discord](https://chat.expo.dev/) 등 활성화된 커뮤니티를 갖고 있다.
- Expo는 개발 과정의 각 단계에서 Expo 프레임워크를 보완하는 **Expo Application Service(EAS)** 라는 서비스 세트를 제공한다.

Expo를 시작하는 방법에는 두 가지가 있다:

- [expo.new로 자동 설정하기](https://expo.new/)
  - 프로젝트를 만들고, 개발 환경을 설정하고, 빌드와 업데이트 자동화를 자동으로 구성한 후 개발을 시작할 수 있다.
- [빠른 시작 문서](https://docs.expo.dev/get-started/create-a-project/)
  - 프로젝트를 만들고, 개발 환경을 설정한 후 개발을 시작할 수 있다.

## 정리 {#summary}

Expo는 크게 두 부분으로 구성된다.

1. **Expo 프레임워크**
   - React Native 기반의 오픈 소스 프레임워크다. 이 프레임워크는 파일 기반 라우팅, 빌트인 네이티브 모듈 등 앱 개발에 필요한 많은 기능을 제공한다.
   - Expo 프레임워크를 사용하면 Android, iOS, 웹에서 동작하는 네이티브 앱을 하나의 JavaScript 코드베이스로 개발할 수 있다.
2. **Expo Application Services (EAS)**
   - EAS는 Expo 프레임워크를 보완하는 클라우드 서비스 세트다. EAS는 앱의 빌드, 배포, 업데이트 등을 관리하는 데 도움을 준다.
   - EAS Build 서비스를 사용하면 개발자의 로컬 환경이 아닌 클라우드에서 앱을 빌드할 수 있다. 이는 개발자의 환경 설정 부담을 줄이고, 일관된 빌드 결과를 보장해준다.
   - EAS Submit 서비스를 사용하면 빌드된 앱을 App Store나 Play Store에 직접 제출할 수 있다. 이는 앱 배포 과정을 크게 단순화한다.
   - 또한 EAS Update 서비스를 사용하면 앱의 일부를 즉시 업데이트할 수 있다. 이를 통해 버그 수정이나 작은 기능 추가를 앱 스토어 심사 과정 없이 빠르게 배포할 수 있다.

Expo는 프레임워크와 EAS라는 두 축을 기반으로 모바일 앱 개발 전 과정을 지원하는 통합 솔루션이다.

Expo 프레임워크는 앱 개발을 단순화하고 가속화하는 데 초점을 맞추고 있고, EAS는 앱의 빌드, 배포, 업데이트를 자동화하고 간소화하는 데 초점을 맞추고 있다.
