---
title: 데이터 저장하기
description: Expo 프로젝트에서 데이터를 저장하는 데 사용할 수 있는 다양한 라이브러리에 대해 알아본다.
date: 2024-04-12
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/develop/user-interface/store-data/',
    },
  ]
---

Expo 프로젝트에서 데이터를 저장하는 방법은 저장하려는 데이터의 유형과 앱의 보안 요구사항에 따라 달라진다.

이 페이지에서는 프로젝트에 가장 적합한 솔루션을 결정하는 데 도움이 되는 다양한 라이브러리를 소개한다.

## Expo SecureStore {#expo-secureStore}

`expo-secure-store` 는 **키-값 쌍을 암호화**하고 기기에 안전하게 저장하는 방법을 제공한다.

자세한 설치 및 사용 방법은 [API 문서](https://docs.expo.dev/versions/latest/sdk/securestore/)를 참조한다.

## Expo FileSystem {#expo-filesystem}

`expo-file-system` 은 기기에 로컬로 저장된 **파일 시스템에 대한 접근**을 제공한다. Expo Go에서 각 프로젝트는 별도의 파일 시스템을 가지며 다른 Expo 프로젝트의 파일에 접근할 수 없다. 하지만 다른 프로젝트에서 공유한 콘텐츠를 로컬 파일 시스템에 저장하고 로컬 파일을 다른 프로젝트와 공유할 수 있다. 또한 네트워크 URL에서 파일을 업로드하고 다운로드할 수 있다.

자세한 설치 및 사용 방법은 [API 문서](https://docs.expo.dev/versions/latest/sdk/filesystem/)를 참조한다.

## Expo SQLite {#expo-sqlite}

`expo-sqlite` 패키지는 WebSQL과 유사한 API를 통해 쿼리할 수 있는 데이터베이스에 대한 접근을 제공한다. 데이터베이스는 앱이 재시작 되어도 유지된다. 기존 데이터베이스 가져오기, 데이터베이스 열기, 테이블 생성, 항목 삽입, 쿼리 및 결과 표시, prepared statements 사용 등에 활용할 수 있다.

자세한 설치 및 사용 방법은 [API 문서](https://docs.expo.dev/versions/latest/sdk/sqlite/)를 참조한다.

## Async Storage {#async-storage}

[Async Storage](https://react-native-async-storage.github.io/async-storage/)는 React Native 앱을 위한 비동기식, 비암호화, 영구 키-값 저장소다. 간단한 API를 가지고 있으며 소량의 데이터를 저장하는 데 좋은 선택이다. 또한 사용자 환경 설정이나 앱 상태와 같이 **암호화가 필요하지 않은 데이터를 저장**하는 데에도 좋은 선택지다.

자세한 설치 및 사용 방법은 [문서](https://react-native-async-storage.github.io/async-storage/docs/usage)를 참조한다.

## 기타 라이브러리 {#other-libraries}

다양한 목적으로 데이터를 저장하기 위한 다른 라이브러리들도 있다. 예를 들어 프로젝트에서 암호화가 필요하지 않거나 Async Storage와 유사한 더 빠른 솔루션을 찾고 있을 수 있다.

프로젝트 데이터 저장에 도움이 되는 라이브러리 목록은 [React Native 문서](https://reactnative.directory/?search=storage)를 참조하는 것이 좋다.
