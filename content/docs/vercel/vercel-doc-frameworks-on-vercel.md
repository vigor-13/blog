---
title: Vercel의 프레임워크 지원
description: Vercel은 가장 널리 사용되는 프론트엔드 프레임워크를 광범위하게 지원하며, 사용하는 도구에 관계없이 사이트의 빌드 및 실행 방식을 최적화한다.
date: 2024-05-05
tags: []
references:
  [{ key: 'Vecel 공식 문서', value: 'https://vercel.com/docs/frameworks' }]
---

Vercel은 Next.js의 제작사이지만, 플랫폼에서는 가장 인기 있는 프론트엔드 프레임워크를 폭넓게 지원한다. Astro부터 SvelteKit까지 다양한 웹 애플리케이션을 구축할 수 있으며, 대부분의 경우 사전 구성 없이 배포할 수 있다.

Vercel에서 지원하는 프레임워크 중 하나를 사용하여 배포하면 다음과 같은 많은 기능을 이용할 수 있다:

- [코멘트가 포함된 미리 보기 배포](https://vercel.com/docs/deployments/preview-deployments)
  - 프로덕션 환경에 배포하기 전에 변경 사항을 미리 보고 팀원들과 협업할 수 있는 기능이다. 미리 보기 배포에 코멘트를 달아 피드백을 주고받을 수 있다.
- [Git 프로바이더 통합](https://vercel.com/docs/deployments/git)
  - GitHub, GitLab, Bitbucket 등의 Git 프로바이더와 연동하여 코드 변경 사항을 자동으로 배포할 수 있다. 이를 통해 지속적 배포(CD)를 구현할 수 있다.
- [서버리스 함수](https://vercel.com/docs/functions/serverless-functions)
  - 백엔드 로직을 작성하고 배포할 수 있는 기능이다. 서버를 관리할 필요 없이 API 엔드포인트를 생성하고 실행할 수 있다.
- [엣지 함수](https://vercel.com/docs/functions/edge-functions)
  - 서버리스 함수와 유사하지만, 전 세계에 분산된 엣지 네트워크에서 실행되어 더 빠른 응답 속도를 제공한다. 지연 시간에 민감한 작업에 적합하다.
- [엣지 구성](https://vercel.com/docs/storage/edge-config)
  - 애플리케이션의 동작을 엣지에서 동적으로 제어할 수 있는 기능이다. 예를 들어, 특정 국가에서 접근하는 사용자에게 다른 콘텐츠를 제공하는 등의 작업이 가능하다.
- [심층 분석](https://vercel.com/docs/analytics)
  - 애플리케이션의 트래픽, 성능, 에러 등에 대한 상세한 분석 정보를 제공한다. 이를 통해 애플리케이션의 상태를 모니터링하고 최적화할 수 있다.
- [속도 인사이트](https://vercel.com/docs/speed-insights)
  - 실제 사용자 데이터를 기반으로 애플리케이션의 성능을 분석하고 개선 방안을 제안한다. 웹 사이트의 로딩 속도와 사용자 경험을 향상시키는 데 도움이 된다.

[프레임워크 지원 매트릭스](https://vercel.com/docs/frameworks/more-frameworks#frameworks-infrastructure-support-matrix)를 참조하면 각 프레임워크가 Vercel에서 어떤 기능을 지원하는지 자세히 확인할 수 있다. 이를 통해 사용 중인 프레임워크에서 Vercel의 기능을 최대한 활용할 수 있다.

## 추가 리소스 {#more-resources}

다음 리소스를 통해 Vercel에서 선호하는 프레임워크를 배포하는 방법에 대해 자세히 알아볼 수 있다:

- [지원되는 프레임워크의 전체 목록 보기](https://vercel.com/docs/frameworks/more-frameworks)
  - 지원되는 프레임워크 목록을 살펴본다.
- [템플릿 마켓플레이스 탐색](https://vercel.com/templates)
  - 인기 있는 프레임워크를 탐색하고 Vercel로 배포한다.
- [배포 기능에 대해 알아보기](https://vercel.com/docs/deployments/overview)
  - Vercel이 프로젝트 배포에 어떤 도움을 줄 수 있는지 알아본다.
