---
title: Vercel에 배포하기
description: Vercel에서 Git, Vercel CLI, Deploy Hooks, Vercel REST API를 사용하여 배포하는 방법을 알아본다.
date: 2024-05-06
tags: []
references:
  [
    {
      key: 'Vecel 공식 문서',
      value: 'https://vercel.com/docs/deployments/overview',
    },
  ]
---

Vercel 배포는 [프로젝트](https://vercel.com/docs/projects/overview)의 빌드가 성공적으로 완료된 결과다.

배포를 생성하면 Vercel에서 자동으로 새로운 [고유 URL을 발급](https://vercel.com/docs/deployments/generated-urls)한다. 이 URL에 접속하면 실제 환경에서 변경 사항을 미리 확인할 수 있다.

또한 프로젝트에 [Vercel Toolbar 패키지](https://vercel.com/docs/workflow-collaboration/comments/in-production-and-localhost)를 추가하면 방문자들이 배포에 대한 피드백을 남길 수 있다.

Vercel에 프로젝트를 배포하는 방법은 다음 4가지가 있다.

- [Git](https://vercel.com/docs/deployments/overview#git)
- [Vercel CLI](https://vercel.com/docs/deployments/overview#vercel-cli)
- [Deploy Hooks](https://vercel.com/docs/deployments/overview#deploy-hooks)
- [Vercel REST API](https://vercel.com/docs/deployments/overview#vercel-rest-api)

## Git {#git}

Git은 Vercel에서 가장 일반적으로 사용되는 배포 방식이다. 프로젝트의 소스 코드를 Git 저장소에 푸시하면 Vercel에서 자동으로 배포 프로세스가 시작된다.

1. **Git 저장소 연결하기**
   - 처음에는 Vercel 대시보드에서 [New Project](https://vercel.com/new) 버튼을 클릭하여 [GitHub](https://vercel.com/docs/deployments/git/vercel-for-github), [GitLab](https://vercel.com/docs/deployments/git/vercel-for-gitlab), [Bitbucket](https://vercel.com/docs/deployments/git/vercel-for-bitbucket) 중 하나의 Git 호스팅 서비스를 선택하고 [저장소를 가져온다](https://vercel.com/docs/deployments/git#deploying-a-git-repository). 이 저장소는 공개 또는 비공개일 수 있다.
2. **자동 배포 설정**
   - Git 저장소를 Vercel 프로젝트에 연결하면 자동 배포가 설정된다. 이제 Git 저장소에 새로운 커밋을 푸시할 때마다 Vercel이 자동으로 배포를 실행한다.
3. **프리뷰 및 프로덕션 배포**
   - 자동 배포 설정 후에는 두 가지 유형의 배포를 생성할 수 있다.
   - [프리뷰 배포](https://vercel.com/docs/deployments/preview-deployments): 새 브랜치나 PR에 대한 배포로, 변경 사항을 미리 확인할 수 있다.
   - [프로덕션 배포](https://vercel.com/docs/deployments/environments#production): `main` 브랜치에 머지/푸시하면 자동으로 생성되는 실제 운영 배포다.
4. **협업 및 피드백**
   - Pull/Merge Request를 통해 팀원 간 협업이 용이해진다. 또한 Vercel을 지원하는 Git 프로바이더에서는 [프리뷰 배포에 대한 실시간 피드백을 제공하는 Comments 기능](https://vercel.com/docs/workflow-collaboration/comments)을 사용할 수 있다.
5. **필요 시 수동 배포**
   - 자동 배포 외에도 Vercel 대시보드에서 [특정 Git 브랜치, 커밋 등의 참조로 배포를 직접 트리거](https://vercel.com/docs/deployments/git#creating-a-deployment-from-a-git-reference)할 수 있다. 자동 배포에 중단이 있을 때 특정 커밋이나 브랜치의 최신 변경 사항을 배포해야 하는 경우에 유용하다.

Git 저장소의 외부 이벤트를 기반으로 배포를 시작하려면 [Deploy Hooks](https://vercel.com/docs/deployments/overview#deploy-hooks)를 사용할 수 있다.

## Vercel CLI {#vercel-cli}

[Vercel CLI](https://vercel.com/docs/cli)는 터미널에서 직접 배포할 수 있는 방법을 제공한다. Git 저장소 연결 여부와 상관없이 [프로젝트](https://vercel.com/docs/projects/overview)를 CLI로 배포할 수 있다.

1. **초기 배포**
   - 새 프로젝트의 경우, 처음 `vercel` 명령을 실행하여 로컬 디토리를 Vercel 프로젝트에 [연결](https://vercel.com/docs/cli/project-linking)하라는 메시지가 표시된다. 이렇게 하면 첫 번째 배포가 [프로덕션 환경](https://vercel.com/docs/deployments/environments#production)으로 생성된다.

```bash
# vercel 명령으로 초기 배포하기.
vercel
```

2. **.vercel 디렉터리 생성**
   - `vercel` 명령 실행 시 프로젝트 루트에 `.vercel` 디렉터리가 생성된다. 여기에는 해당 프로젝트의 조직과 프로젝트 `ID` 가 포함되어 있다. Vercel CLI는 자동으로 프로젝트의 [프레임워크를 감지](https://vercel.com/docs/cli/project-linking#framework-detection)한다.
3. **후속 배포**
   - 초기 배포 후에는 `vercel` 명령을 다시 실행하면 프리뷰 배포가 생성된다. 프로덕션 배포를 원한다면 `vercel --prod` 명령을 사용한다.

```bash
# vercel 명령으로 프로덕션 배포하기.
vercel --prod
```

4. **커스텀 워크플로우**
   - Vercel CLI를 활용하면 [커스텀 CI/CD 워크플로우](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)를 구축하고 기존 파이프라인에 통합할 수 있다.
5. **빌드 출력만 배포**
   - `vercel build` 와 `vercel deploy --prebuilt` 를 사용하면 생성된 빌드 출력물만 Vercel에 업로드할 수 있어, 소스 코드 접근을 제한할 수 있다.
6. **구성 옵션**
   - [Vercel CLI](https://vercel.com/docs/cli)에는 다양한 설정 옵션이 있다. 예를 들어 특정 빌드 명령어 지정, 환경 변수 설정, 배포 규칙 지정 등이 가능하다.

Vercel CLI를 사용하면 Git 저장소 없이도 간단히 배포할 수 있고, 기존 CI/CD 파이프라인과 통합하거나 소스 코드 노출 제한 등 다양한 요구사항을 충족할 수 있다. 또한 명령줄 인터페이스를 선호하는 개발 워크플로우에 적합하다.

## Deploy Hooks {#deploy-hooks}

[Deploy Hooks](https://vercel.com/docs/deployments/deploy-hooks)는 Git 저장소 변경 없이 외부 이벤트에 따라 배포를 트리거할 수 있는 유용한 기능이다. 하지만 Deploy Hooks를 사용하려면 반드시 [Git](https://vercel.com/docs/deployments/overview#git) 저장소에 연결되어 있어야 한다.

1. **외부 이벤트 트리거**
   - 많은 경우 애플리케이션의 변경 사항이 컨텐츠 업데이트나 외부 시스템의 이벤트에 따라 발생한다. 예를 들어 [헤드리스 CMS](https://vercel.com/guides/using-a-headless-cms-with-vercel)에서 새 블로그 포스트를 게시하거나, 데이터베이스에 데이터가 변경되는 경우다.
2. **코드 변경 없는 배포**
   - 이런 상황에서는 코드 자체를 변경하지 않고도 새로운 배포가 필요하다. Deploy Hooks를 사용하면 Git 커밋 없이도 Vercel에서 새 배포를 트리거할 수 있다.
3. **Deploy Hook URL 생성**
   - Deploy Hooks를 사용하려면 먼저 Vercel 프로젝트에서 고유한 URL을 생성해야 한다. 이 URL은 HTTP GET 또는 POST 요청을 받아 배포 프로세스를 시작한다.
4. **외부에서 배포 트리거**
   - 외부 시스템(예: CMS, CI/CD 파이프라인 등)에서 해당 URL로 요청을 보내면 Vercel에서 빌드 단계를 재실행하고 새로운 배포를 생성한다.
5. **외부 이벤트 통합**
   - Deploy Hooks를 사용하면 Vercel 배포를 다양한 외부 이벤트 및 워크플로우와 통합할 수 있다. 이를 통해 더욱 유연하고 자동화된 배포 프로세스를 구축할 수 있다.

Deploy Hooks의 주요 이점은 소스 코드 변경 없이도 컨텐츠 업데이트나 외부 이벤트에 따라 새로운 배포를 생성할 수 있다는 점이다. 또한 헤드리스 CMS, 데이터베이스, CI/CD 파이프라인 등과 쉽게 통합할 수 있다. 다만 Git 저장소 연결은 필수적이므로 이 점을 유념해야 한다.

자세한 내용은 [문서](https://vercel.com/docs/deployments/deploy-hooks)를 참조한다.

## Vercel REST API {#vercel-rest-api}

Vercel REST API를 사용하면 HTTP `POST` 요청으로 직접 배포를 생성할 수 있다. 이는 Git 기반 워크플로우 외에 다른 사용자 지정 워크플로우를 사용하거나 Vercel 플랫폼에서 현재 지원하지 않는 서비스를 통합할 때 유용하다.

1. **파일 준비**
   - 배포하려는 모든 파일(예: HTML, CSS, JS 등)을 준비하고 [각 파일의 `SHA` 해시값을 생성](https://vercel.com/guides/how-do-i-generate-an-sha-for-uploading-a-file-to-the-vercel-api)한다.
2. **HTTP POST 요청**
   - Vercel API 엔드포인트(https://api.vercel.com/v6/deployments)로 HTTP `POST` 요청을 보낸다. 요청 본문에는 배포할 파일 목록과 해당 파일의 `SHA` 해시값이 포함된다.
3. **인증**
   - `POST` 요청에는 Vercel 계정의 인증 토큰이 필요하다. 토큰은 Vercel 대시보드에서 생성할 수 있다.
4. **프로젝트 ID 지정**
   - 배포할 프로젝트의 ID를 요청에 포함시켜야 한다.
5. **배포 생성**
   - 요청이 성공하면 Vercel에서 새로운 배포가 생성되고 고유한 배포 URL이 반환된다.
6. **사용 사례**
   - 커스텀 CI/CD 워크플로우 통합
   - [멀티 테넌트 앱](https://vercel.com/guides/nextjs-multi-tenant-application#6.-add-custom-domains-with-the-vercel-api)에 커스텀 도메인 추가
   - Vercel 플랫폼에서 지원하지 않는 서드파티 서비스 통합

Vercel REST API를 사용하면 Git 기반 워크플로우 외에도 다양한 배포 시나리오를 지원할 수 있다. 하지만 각 파일의 SHA 해시 계산, 인증 토큰 관리 등 추가 작업이 필요하므로 복잡성이 있다. API 문서를 참고하여 올바른 요청 방식을 확인하는 것이 중요하다.

자세한 내용은 [문서](https://vercel.com/docs/rest-api/endpoints#create-a-new-deployment)를 참조한다.

## 배포 요약 {#deployment-summary}

웹사이트를 Vercel에 배포하면 빌드 결과로 여러 출력물이 생성된다. 이러한 출력물은 다음과 같다.

1. **Edge Middleware**
   - [Edge Middleware](https://vercel.com/docs/functions/edge-middleware)는 Next.js 13의 신규 기능으로, 요청 처리 로직을 Edge에서 실행할 수 있다. 예를 들어 A/B 테스트, 보안 규칙 적용, 다국어 지원 등에 활용할 수 있다.
2. **정적 자산**
   - HTML, CSS, JavaScript 등 정적 파일은 Vercel의 CDN을 통해 전 세계에 빠르게 배포된다. 캐싱 및 HTTP 최적화로 정적 애셋의 로딩 속도가 향상된다.
3. **서버리스 함수**
   - API Routes를 서버리스 함수로 배포하여 백엔드 로직을 구현할 수 있다. Lambda 기반이므로 자동 스케일링과 비용 효율성을 제공한다.
4. **Edge 함수**
   - 서버리스 함수를 Edge에 배포하면 Edge 함수가 된다. Edge에서 실행되므로 매우 낮은 레이턴시를 구현할 수 있다.
5. **ISR 함수**
   - Next.js의 Incremental Static Regeneration 기능을 사용하는 경우, ISR 함수가 생성된다. 이 함수는 정적 페이지를 주기적으로 재생성한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/vercel-doc-deploying-to-vercel/1.png)

### 배포 요약에서 어떤 정보를 확인할 수 있을까? {#what-information-is-available-in-this-summary}

배포 요약에서는 빌드에서 생성된 모든 아티팩트 목록과 해당 아티팩트에 대한 특정 정보를 볼 수 있다.

- Edge Middleware: 매처 패턴
- 정적 자산: 파일 이름, 크기
- 함수: 유형(서버리스/엣지), 이름, 런타임, 크기, 지역
- ISR 함수: 이름, 런타임, 크기, 지역, 관련 경로

또한 애플리케이션 배포 시간과 프레임워크(사용 가능한 경우)를 확인할 수 있다.

배포 요약을 통해 빌드 결과물의 구체적인 내역을 파악할 수 있어, 애플리케이션의 구조와 성능을 이해하는 데 큰 도움이 된다.
