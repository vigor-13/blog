---
title: 개발 및 프로덕션 모드
description: 개발 모드 또는 프로덕션 모드에서 프로젝트를 실행하는 방법을 알아본다.
date: 2024-04-03
tags: []
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/workflow/development-mode/',
    },
  ]
---

프로젝트는 항상 **개발(development)** 모드 또는 **프로덕션(production)** 모드 중 하나로 실행된다. 기본적으로 `npx expo start` 로 프로젝트를 로컬에서 실행하면 개발 모드로 실행되는 반면, 배포된 프로젝트(`eas update`를 사용한 경우) 또는 모든 독립 실행형 앱은 프로덕션 모드로 실행된다.

**개발 모드**에는 유용한 경고가 포함되어 있으며 개발과 디버깅을 더 쉽게 해주는 도구에 액세스할 수 있다. **프로덕션 모드**는 [코드를 압축](https://docs.expo.dev/guides/customizing-metro/#minification)하고 최종 사용자 기기에서 앱이 더 좋은 성능을 낸다. 각 모드를 더 자세히 살펴보고 모드 간 전환하는 방법을 알아보자.

## 개발 모드 {#development-mode}

React Native에는 개발에 매우 유용한 도구가 포함되어 있다: Chrome에서 원격 JavaScript 디버깅, 실시간 리로드, 핫 리로딩, Chrome에서 사용하는 유용한 인스펙터와 유사한 엘리먼트 인스펙터 등이 있다. 이러한 도구 사용 방법을 알아보려면 [디버깅](https://docs.expo.dev/debugging/runtime-issues/)을 참조한다.

개발 모드는 또한 앱이 실행되는 동안 유효성 검사를 수행하여 예를 들어 deprecated된 속성을 사용하거나 컴포넌트에 필수 속성을 전달하는 것을 잊은 경우 경고를 제공한다. 아래 비디오는 Android와 iOS 시뮬레이터에서 작동하는 엘리먼트 인스펙터와 성능 모니터를 보여준다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-guides-development-and-production-modes/1.gif)

:::warning
**여기에는 대가가 있다. 개발 모드에서는 앱이 더 느리게 실행된다.** Expo CLI를 사용하여 개발 모드를 켜고 끌 수 있다. [프로덕션 모드](https://docs.expo.dev/workflow/development-mode/#production-mode)를 참조한다.

모드를 전환할 때는 앱을 종료하고 다시 열어야 변경 사항이 적용된다. **앱의 성능을 테스트할 때는 항상 개발 모드를 비활성화해야 한다.**
:::

### 개발자 메뉴 보기 {#view-the-developer-menu}

개발자 메뉴는 개발과 디버깅을 훨씬 쉽게 만드는 다양한 기능에 접근할 수 있다. Android와 iOS에서 메뉴를 여는 방법에 대한 자세한 내용은 [개발자 메뉴](https://docs.expo.dev/debugging/tools/#developer-menu)를 참조한다.

## 프로덕션 모드 {#production-mode}

프로덕션 모드는 다음 두 가지 경우에 가장 유용하다:

- 앱의 성능을 테스트할 때, 개발 모드는 앱 속도를 상당히 느리게 만든다.
- 프로덕션 모드에서만 나타나는 버그를 발견할 때.

최종 사용자의 기기에서 프로젝트가 어떻게 실행될지 가장 쉽게 시뮬레이션하는 방법은 다음 명령을 사용하는 것이다:

```bash
npx expo start --no-dev --minify
```

이 명령은 앱의 JavaScript를 프로덕션 모드로 실행한다(다른 몇 가지 사항 중에서 Metro 번들러에게 `__DEV__` 환경 변수를 `false`로 설정하도록 지시한다). `--minify` 플래그는 앱을 압축한다. 이 플래그는 또한 주석, 서식, 사용하지 않는 코드와 같은 불필요한 데이터를 제거한다. 독립 실행형 앱에서 오류나 충돌이 발생하는 경우, 이 명령으로 프로젝트를 실행하면 근본 원인을 찾는 데 많은 시간을 절약할 수 있다.

프로덕션을 위해 앱을 완전히 컴파일하려면 [Android 컴파일](https://docs.expo.dev/more/expo-cli/#compiling-android) 및 [iOS 컴파일](https://docs.expo.dev/more/expo-cli/#compiling-ios)을 참조한다.
