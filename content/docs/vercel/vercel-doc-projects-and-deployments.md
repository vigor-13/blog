---
title: 프로젝트와 배포
description: Vercel의 프로젝트 및 배포 관리 기능을 활용하여 워크플로우를 간소화할 수 있다. 이를 통해 생산성을 향상시키고 손쉽게 확장할 수 있다.
date: 2024-05-05
tags: []
references:
  [
    {
      key: 'Vecel 공식 문서',
      value: 'https://vercel.com/docs/getting-started-with-vercel/projects-deployments',
    },
  ]
---

## 프로젝트와 배포 {#projects-and-deployments}

Vercel을 시작할 때 **프로젝트**와 **배포**의 개념을 이해하는 것이 중요하다:

### 프로젝트 {#projects}

[프로젝트](https://vercel.com/docs/projects/overview)는 Vercel에 배포된 애플리케이션을 의미한다. 하나의 저장소(예: [모노레포](https://vercel.com/docs/monorepos))에 여러 프로젝트를 연결할 수 있으며, 각 프로젝트는 다수의 [배포](https://vercel.com/docs/deployments/overview)를 가질 수 있다.

[대시보드](https://vercel.com/dashboard)에서 모든 프로젝트를 조회하고, [프로젝트 대시보드](https://vercel.com/docs/projects/project-dashboard)에서 설정을 구성할 수 있다.

### 배포 {#deployments}

[배포](https://vercel.com/docs/deployments/overview)는 프로젝트의 빌드가 성공적으로 완료된 결과물이다. 기존 프로젝트나 템플릿을 가져오거나, [연결된 통합](https://vercel.com/docs/deployments/git)을 통해 Git 커밋을 푸시하거나, [CLI](https://vercel.com/docs/cli)에서 `vercel deploy` 명령을 실행하면 배포가 트리거된다. 모든 배포는 [고유한 URL을 자동으로 생성](https://vercel.com/docs/deployments/generated-urls)한다.

## 다음 단계 {#next-steps}

시작하려면 **템플릿 배포** 또는 **기존 프로젝트 가져오기 및 배포**를 통해 새 프로젝트를 생성한다:

- [템플릿 사용](https://vercel.com/docs/getting-started-with-vercel/template)
  - Vercel과 커뮤니티에서 제공하는 미리 구축된 솔루션으로 앱 개발 프로세스를 빠르게 시작한다.
- [기존 프로젝트 가져오기](https://vercel.com/docs/getting-started-with-vercel/import)
  - 기존 프로젝트를 가져와 Vercel에서 개발을 시작한다.
