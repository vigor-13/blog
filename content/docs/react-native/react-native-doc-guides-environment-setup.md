---
title: React Native 시작하기
description:
date: 2024-06-06
tags: [expo]
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/environment-setup',
    },
  ]
---

React Native는 React를 사용하여 네이티브 앱을 만들 수 있게 해주는 도구다.

즉, 웹 개발 기술로 모바일 앱을 만들 수 있다.

React Native로 앱을 만들 때는 Expo 프레임워크를 같이 사용하는 것이 좋다.

Expo 프레임워크는 다음과 같은 것들을 제공한다.

- 파일 기반 라우팅
- 고품질 범용 라이브러리
- 네이티브 코드를 직접 건드리지 않고도 수정할 수 있는 플러그인 기능

:::note 프레임워크 없이 React Native를 사용할 수 있을까?
React Native를 프레임워크 없이 사용할 수 있다. **하지만 React Native로 새로운 앱을 만드는 경우에는 프레임워크를 사용하는 것을 추천한다.**

간단히 말해서, 프레임워크를 사용하면 앱 자체를 작성하는 데에만 시간을 쓸 수 있다.

그동안 React Native 커뮤니티에서는 내비게이션, 네이티브 API 접근, 네이티브 종속성 처리 등에 대한 접근 방식을 수년에 걸쳐 개선해 왔다. 대부분의 앱에는 이러한 핵심 기능이 필요하다. React Native 프레임워크는 앱 개발을 시작할 때부터 이런 기능들을 제공한다.

프레임워크가 없다면, 핵심 기능을 구현하기 위한 나만의 솔루션을 직접 작성하거나, 기존 라이브러리들을 조합하여 프레임워크의 뼈대를 만들어야 한다. 이는 앱을 시작할 때뿐만 아니라 나중에 유지 관리할 때도 상당한 작업이 필요하다.

만약 앱이 프레임워크로는 잘 해결되지 않는 특이한 제약 조건을 가지고 있거나, 이러한 문제를 직접 해결하고 싶다면 Android Studio나 Xcode를 사용하여 프레임워크 없이 React Native 앱을 만들 수 있다. 이 경로에 관심이 있다면 [환경 설정 방법](https://reactnative.dev/docs/set-up-your-environment)과 [프레임워크 없이 시작하기](https://reactnative.dev/docs/getting-started-without-a-framework)를 참조한다.
:::

## Expo를 사용하여 새로운 React Native 시작하기

Expo는 React Native 프레임워크다. Expo는 파일 기반 라우팅, 표준 네이티브 모듈 라이브러리 등 앱 개발을 보다 쉽게 만드는 개발자 도구를 제공한다.

Expo의 프레임워크는 무료이며 오픈 소스이고, [GitHub](https://github.com/expo)과 [Discord](https://chat.expo.dev/)에서 활발한 커뮤니티 활동이 이루어지고 있다.

Expo 팀은 Meta의 React Native 팀과 긴밀히 협력하여 최신 React Native 기능을 Expo SDK에 도입하고 있다.

Expo 팀은 또한 개발 프로세스의 각 단계에서 프레임워크를 보완하는 선택적 서비스 세트인 Expo Application Services (EAS)도 제공한다.

새 Expo 프로젝트를 만들려면 터미널에서 다음 명령을 실행한다:

```bash
npx create-expo-app@latest

```

:::note
자세한 내용 [참조](https://docs.expo.dev/get-started/set-up-your-environment)
:::
