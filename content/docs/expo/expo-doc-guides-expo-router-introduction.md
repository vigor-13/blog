---
title: Expo Router 소개
description: Expo Router는 Expo로 구축된 범용 React Native 애플리케이션을 위한 오픈소스 라우팅 라이브러리다.
date: 2024-04-04
tags: [expo_router]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/router/introduction/',
    },
  ]
---

Expo Router는 React Native와 웹 애플리케이션을 위한 파일 기반 라우터다. 이를 통해 앱의 화면 간 탐색을 관리할 수 있으며, 사용자가 Android, iOS, 웹 등 다양한 플랫폼에서 동일한 컴포넌트를 사용하여 앱 UI의 다른 부분 사이를 원활하게 이동할 수 있다.

Expo Router의 가장 큰 장점은 Android, iOS, 웹 등 다양한 플랫폼에서 동일한 컴포넌트와 라우팅 구조를 사용할 수 있다는 점이다. 이를 통해 개발자는 한 번의 코드 작성으로 모든 플랫폼에서 동작하는 유니버설 앱을 만들 수 있다.

`app` 디렉토리에 파일을 추가하면 해당 파일은 자동으로 내비게이션의 라우트가 된다.

## 주요 기능 {#features}

- **네이티브**: Expo Router는 [React Navigation](https://reactnavigation.org/) 라이브러리를 기반으로 구축되어 있어 네이티브 수준의 성능과 플랫폼 최적화를 제공한다. 이는 사용자에게 매끄러운 내비게이션 경험을 선사한다.
- **공유 가능**: 앱의 모든 화면은 자동으로 딥 링크가 가능하다. 링크를 통해 앱의 모든 라우트를 공유할 수 있다. 이를 통해 사용자는 링크를 통해 앱의 특정 화면으로 바로 이동할 수 있으며, 앱의 콘텐츠를 쉽게 공유할 수 있습니다.
- **오프라인 우선**: 앱은 캐시되어 오프라인 우선으로 실행되며, 새 버전을 게시할 때 자동으로 업데이트된다. 네트워크 연결이나 서버 없이도 모든 들어오는 네이티브 URL을 처리한다.
- **최적화**: 라우트는 프로덕션에서는 지연 평가(lazy-evaluation)로, 개발 중에는 지연 번들링(deferred bundling)으로 자동 최적화된다.
- **반복**: Android, iOS, 웹에서 유니버설 Fast Refresh를 지원하며, 번들러의 아티팩트 메모이제이션(memoization)을 통해 대규모에서도 빠른 개발이 가능히다.
- **유니버설**: Android, iOS, 웹이 통합된 내비게이션 구조를 공유하며, 라우트 수준에서 플랫폼별 API로 내려갈 수 있다.
- **검색 가능**: Expo Router는 웹에서 빌드 시 정적 렌더링을 지원하고, 네이티브에 유니버설 링킹을 지원한다. 이는 앱 콘텐츠가 검색 엔진에 인덱싱될 수 있음을 의미한다.

:::important 오프라인 우선
Expo Router는 오프라인 우선 방식으로 동작한다. 이는 앱이 처음 다운로드될 때 모든 필요한 자원을 캐시에 저장하고, 이후에는 캐시된 자원을 사용하여 오프라인에서도 앱을 실행할 수 있음을 의미한다. 사용자는 네트워크 연결 없이도 앱의 대부분의 기능을 사용할 수 있다.

새로운 버전의 앱이 게시되면, Expo Router는 자동으로 업데이트를 감지하고 새 버전의 자원을 다운로드한다. 이 과정은 백그라운드에서 이루어지므로 사용자는 앱을 사용하는 동안 업데이트를 의식하지 않아도 된다. 업데이트가 완료되면 다음 앱 실행 시 새 버전이 적용된다.

또한, Expo Router는 네트워크 연결이나 서버 없이도 모든 들어오는 네이티브 URL을 처리할 수 있다. 이는 딥링크를 통해 앱의 특정 화면으로 이동하는 경우에도 오프라인에서 동작할 수 있음을 의미한다.
:::

:::important 최적화
Expo Router는 라우트를 자동으로 최적화하여 앱의 성능을 향상시킨다.

프로덕션 환경에서는 지연 평가(lazy-evaluation) 기술을 사용한다. 이는 앱 실행 시 모든 라우트를 한 번에 로드하는 대신, 필요한 라우트만 로드하는 방식이다. 이를 통해 앱의 초기 로딩 속도를 향상시키고 메모리 사용량을 줄일 수 있다. 사용자가 특정 라우트를 탐색할 때만 해당 라우트에 필요한 자원이 로드된다.

개발 환경에서는 지연 번들링(deferred bundling) 기술을 사용한다. 이는 개발 중에 변경된 부분만 다시 번들링하고 나머지는 캐시를 사용하는 방식이다. 이를 통해 개발 중 빌드 시간을 대폭 단축할 수 있다. 개발자는 변경 사항을 빠르게 확인하고 반복할 수 있다.

이러한 최적화 기술들은 Expo Router가 자동으로 처리하므로, 개발자는 별도의 설정 없이 최적화된 성능을 경험할 수 있다. 이는 개발 효율성과 사용자 경험 모두를 향상시키는 데 기여한다.
:::
