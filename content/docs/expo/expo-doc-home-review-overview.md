---
title: 앱 리뷰를 위한 배포 개요
description: 앱스토어, 내부 배포, EAS Update를 사용하여 리뷰용 앱을 배포하는 방법에 대해 알아본다.
date: 2024-06-02
tags: []
references:
  [{ key: 'Expo 공식 문서', value: 'https://docs.expo.dev/review/overview/' }]
---

이 페이지에서는 QA 및 리뷰를 위해 앱의 프리뷰 버전을 공유하는 세 가지 방법을 설명한다.

- 앱스토어 테스팅 트랙
- 내부 배포
- EAS Update를 사용한 개발 빌드

:::note 릴리스 리뷰를 위해 Expo Go를 사용할 수 있을까?
Expo Go는 Android와 iOS에서 독립된 프로토타입을 프리뷰하는 데 유용할 수 있는 오픈 소스 샌드박스이지만, 프로덕션 앱을 위한 용도는 아니다.

앱 프리뷰 과정에서는 Expo Go 사용을 피해야 한다.
:::

## 앱스토어 테스팅 트랙 {#app-store-testing-tracks}

**앱스토어 테스팅 트랙**은 앱의 릴리스 빌드를 배포하여 선택한 사용자들이 테스트할 수 있도록 하는 방법이다. 이 방식은 일반 사용자에게 공개하기 전에 앱의 안정성과 기능을 검증하는 데 유용하다. 하지만 앱스토어 테스팅 트랙은 개발 빌드를 지원하지 않기 때문에, 개발 중인 기능을 테스트하려면 별도의 방법이 필요하다.

:::note
이때 대안으로 사용할 수 있는 것이 [내부 배포](https://docs.expo.dev/review/overview#internal-distribution)다. 내부 배포는 릴리스 빌드와 개발 빌드 모두를 배포할 수 있어서, 개발 과정에서 팀원들이 앱을 테스트하고 피드백을 주고받는 데 유용하다. 내부 배포는 앱스토어를 거치지 않고 직접 설치 파일을 공유하는 방식으로 이루어진다.
:::

- **Android**
  - Google Play 베타를 통해 앱을 배포할 수 있다.
  - Google Play 베타는 비공개 트랙과 공개 트랙을 제공한다.
  - 비공개 트랙은 초대한 사용자들만 앱을 테스트할 수 있고, 공개 트랙은 베타 프로그램에 참여한 모든 사용자가 앱을 사용할 수 있다.
- **iOS**
  - TestFlight를 사용하여 앱을 배포할 수 있다.
  - TestFlight는 최대 100명의 내부 테스터와 최대 10,000명의 외부 테스터에게 앱을 공유할 수 있다.
  - 내부 테스터는 개발팀이나 회사 직원 등 제한된 인원을 대상으로 하고, 외부 테스터는 더 넓은 범위의 사용자를 대상으로 한다.

:::note EAS Submit
앱스토어 테스팅 및 릴리스 트랙에 앱을 업로드하는 방법을 알아본다. ([링크](https://docs.expo.dev/submit/introduction))
:::

## EAS Build를 사용한 내부 배포 {#internal-distribution-with-eas-build}

[내부 배포](https://docs.expo.dev/build/internal-distribution)는 EAS에서 제공하는 기능으로, 개발자가 빌드를 생성하고 URL을 통해 쉽게 공유할 수 있다.

사용자는 이 URL을 디바이스에서 열어 앱을 설치할 수 있다. Android의 경우 설치 가능한 APK 파일로, iOS의 경우 ad hoc 프로비저닝된 앱으로 제공된다.

내부 배포 빌드가 생성되면 즉시 다운로드 및 설치가 가능하다. 별도의 양식을 작성하거나 승인/처리를 기다릴 필요가 없다. 내부 배포를 통해 릴리스 빌드와 개발 빌드 모두를 공유할 수 있다.

:::note Ad hoc 프로비저닝(Ad Hoc Provisioning)
Ad hoc 프로비저닝(Ad Hoc Provisioning)은 iOS 앱 배포 방식 중 하나로, 개발자가 제한된 수의 등록된 디바이스에 앱을 직접 설치할 수 있도록 하는 방법이다.

App Store를 통하지 않고 테스터, 베타 사용자 또는 특정 사용자 그룹에게 앱을 배포하는 데 유용하다.
:::

:::note 내부 배포 빌드를 설정하는 방법
EAS Build가 팀 내부 배포를 위해 빌드를 공유할 수 있는 URL을 어떻게 제공하는지 알아본다. ([링크](https://docs.expo.dev/build/internal-distribution))
:::

## 개발 빌드와 EAS Update {#development-builds-and-eas-update}

EAS Update를 사용하면 앱의 JavaScript 코드와 에셋을 업데이트할 수 있으며, 사용자는 앱스토어나 플레이스토어를 통하지 않고도 업데이트를 받을 수 있다.

내부 배포를 통해 개발 빌드를 공유하고 설치한 후, EAS Update를 사용하여 앱을 업데이트할 수 있다. 이는 다음과 같은 상황에서 유용하다:

- 앱 심사 과정 중에 변경 사항이 필요한 경우, EAS Update를 통해 업데이트를 게시하고 심사팀에게 최신 버전의 앱을 제공할 수 있다.
- 베타 테스터나 내부 사용자에게 새로운 기능이나 수정 사항을 신속하게 제공하고자 할 때, EAS Update를 사용하여 앱을 업데이트할 수 있다.

중요한 점은, EAS Update를 통해 게시된 업데이트는 설치된 개발 빌드와 호환되어야 한다는 것이다. 호환성은 런타임 버전에 따라 결정된다. 따라서 개발 빌드를 내부 배포하고 EAS Update를 사용하여 앱을 업데이트하려면, 업데이트의 런타임 버전과 설치된 빌드의 런타임 버전이 호환되어야 한다. 이에 대한 자세한 내용은 [여기](https://docs.expo.dev/eas-update/runtime-versions)를 참조한다.

다음과 같은 방법으로 업데이트를 시작하고 공유할 수 있다:

- Expo 대시보드를 사용하여 업데이트를 시작하고 특정 업데이트에 대한 링크를 공유할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-review-overview/1.gif)

- 개발 빌드에서 직접 업데이트를 탐색하고 시작할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-review-overview/2.gif)

- GitHub 액션을 구성하여 PR 및 커밋에 대한 업데이트를 자동으로 게시할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/expo-doc-home-review-overview/3.gif)

:::note 참조

- [EAS Update 시작하기](https://docs.expo.dev/eas-update/getting-started/) : `expo-updates` 라이브러리를 사용하여 EAS Update를 프로젝트에서 사용하는 방법에 대해 알아본다.
- [GitHub Actions 사용하기](https://docs.expo.dev/eas-update/github-actions/) : GitHub Actions를 사용하여 EAS Update로 업데이트를 게시하는 프로세스를 자동화하는 방법을 알아본다. 이를 통해 업데이트 배포를 일관되고 빠르게 수행할 수 있다.
- [EAS Update와 함께 `expo-dev-client` 사용하기](https://docs.expo.dev/eas-update/expo-dev-client/) : 프로젝트에서 `expo-dev-client` 를 사용하여 다양한 앱 버전을 실행하고 개발 빌드 내에서 게시된 업데이트를 프리뷰하는 방법을 알아본다.

:::
