---
title: Vecel 시작하기
description:
date: 2024-05-05
tags: []
references:
  [
    {
      key: 'Vecel 공식 문서',
      value: 'https://vercel.com/docs/getting-started-with-vercel',
    },
  ]
---

이 단계별 튜토리얼은 개발자를 위한 통합 플랫폼인 Vercel을 시작하는 데 도움을 준다. Vercel을 사용하면 웹 애플리케이션을 생성하고 배포할 수 있다.

Vercel은 개발자를 위한 플랫폼으로, 웹 앱을 더 빠르게 구축하고 배포하는 데 필요한 도구, 워크플로우 및 인프라를 추가 구성 없이 제공한다.

Vercel은 인기 있는 프론트엔드 프레임워크를 기본적으로 지원하며, 확장 가능하고 안전한 인프라는 전 세계에 분산되어 있어 사용자와 가까운 데이터 센터에서 최적의 속도로 콘텐츠를 제공한다.

개발 과정에서 Vercel은 자동 미리보기 및 프로덕션 환경, 미리보기 배포에 대한 코멘트 등 프로젝트에 대한 실시간 협업을 위한 도구를 제공한다.

## 시작하기 전에 {#before-you-begin}

시작하려면 Vercel 계정을 만들어야 한다. 사용자에게 적합한 [플랜을 선택](https://vercel.com/docs/accounts/plans)할 수 있다.

- [회원가입](https://vercel.com/signup)
  - 이전에 Vercel을 사용한 적이 없다면 새 Vercel 계정에 가입한다.
- [로그인](https://vercel.com/login)
  - 이미 Vercel 계정이 있다면 로그인하여 시작한다.

계정을 만들면 Git 제공자를 사용하거나 이메일을 사용하여 인증할 수 있다. 이메일 인증을 사용할 때는 이메일 주소와 전화번호를 모두 확인해야 할 수 있다.

## 튜토리얼 커스터마이징

이 튜토리얼은 프레임워크에 구애받지 않지만 Vercel은 많은 프론트엔드 [프레임워크](https://vercel.com/docs/frameworks/more-frameworks)를 지원한다. 문서를 살펴보면서 퀵스타트에서 해당 프레임워크에 대한 구체적인 지침을 제공한다.

대부분의 지침은 대시보드를 사용하지만 [Vercel CLI](https://vercel.com/docs/cli)를 사용하여 Vercel에서 대부분의 작업을 수행할 수 있다. 이 튜토리얼에서 "CLI 사용?" 섹션을 찾아 CLI 단계를 확인할 수 있다.

CLI를 사용하려면 먼저 설치해야 한다:

```bash
pnpm i -g vercel
```
