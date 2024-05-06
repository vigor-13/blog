---
title: Git 레포지토리 Vercel에 배포하기
description: Vercel은 GitHub, GitLab, Bitbucket, Azure DevOps Pipelines 프로젝트에서 브랜치로 푸시하거나 프로덕션 브랜치에 병합할 때마다 자동으로 배포를 수행한다.
date: 2024-05-06
tags: [git]
references:
  [{ key: 'Vecel 공식 문서', value: 'https://vercel.com/docs/deployments/git' }]
---

Vercel은 [GitHub](https://vercel.com/docs/deployments/git/vercel-for-github), [GitLab](https://vercel.com/docs/deployments/git/vercel-for-gitlab), [Bitbucket](https://vercel.com/docs/deployments/git/vercel-for-bitbucket), [Azure DevOps Pipelines](https://vercel.com/docs/deployments/git/vercel-for-azure-pipelines) 프로젝트에서 브랜치로 푸시하거나 [프로덕션 브랜치](https://vercel.com/docs/deployments/git#production-branch)에 병합할 때마다 자동으로 배포를 수행한다.

Vercel을 Git과 함께 사용하면 다음과 같은 이점이 있다:

1. **프리뷰 배포**
   - 브랜치에 대한 푸시 할 때 Vercel에서 자동으로 [프리뷰 배포](https://vercel.com/docs/deployments/preview-deployments#)를 생성한다.
   - 이를 통해 변경사항을 실제 환경에서 미리 확인할 수 있다.
2. **프로덕션 배포**
   - [프로덕션 브랜치](https://vercel.com/docs/deployments/git#production-branch)(일반적으로 `main`)에 병합 시 Vercel에서 프로덕션 배포를 자동 생성한다.
   - 이는 최신 변경사항이 적용된 실제 운영 환경 버전이다.
3. **즉시 롤백**
   - 커스텀 도메인에 할당된 배포 버전의 변경사항에 이슈가 있는 경우, 이전 버전으로 즉시 롤백할 수 있다.

:::note 일반적인 Git 브랜치 전략은 다음과 같다.

- 하나의 프로덕션 브랜치(main)가 실제 운영 코드를 관리한다.
- 개발자들은 기능 브랜치를 체크아웃하여 작업한다.
- 기능 작업이 완료되면 프로덕션 브랜치로 Pull Request(PR)를 생성한다.
- Vercel에서는 이 PR에 대한 고유 프리뷰 배포를 자동 생성하여 변경사항을 확인할 수 있다.
- 리뷰 후 승인되면 PR을 프로덕션 브랜치에 병합한다.
- 병합 시 Vercel에서 자동으로 새 프로덕션 배포를 생성한다.

:::

:::tip
필요에 따라 `main` 외의 다른 브랜치를 [프로덕션 브랜치](https://vercel.com/docs/deployments/git#production-branch)로 지정할 수도 있다.
:::

이렇게 Vercel의 Git 통합을 통해 지속적인 배포, 협업, 프리뷰, 롤백 등의 기능을 편리하게 사용할 수 있다.

## 지원되는 Git 프로바이더 {#supported-git-providers}

- [GitHub Free](https://github.com/pricing)
- [GitHub Team](https://github.com/pricing)
- [GitHub Enterprise Cloud](https://docs.github.com/en/get-started/learning-about-github/githubs-products#github-enterprise)
- [GitHub Enterprise Server](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
- [GitLab Free](https://about.gitlab.com/pricing/)
- [GitLab Premium](https://about.gitlab.com/pricing/)
- [GitLab Ultimate](https://about.gitlab.com/pricing/)
- [GitLab Enterprise](https://about.gitlab.com/enterprise/)
- [Self-Managed GitLab](https://vercel.com/guides/how-can-i-use-gitlab-pipelines-with-vercel)
- [Bitbucket Free](https://www.atlassian.com/software/bitbucket/pricing)
- [Bitbucket Standard](https://www.atlassian.com/software/bitbucket/pricing)
- [Bitbucket Premium](https://www.atlassian.com/software/bitbucket/pricing)
- [Bitbucket Data Center (Self-Hosted)](https://vercel.com/guides/how-can-i-use-bitbucket-pipelines-with-vercel)
- [Azure DevOps Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines)

여기에 나열되지 않은 프로바이더의 경우 [Vercel CLI](https://vercel.com/guides/using-vercel-cli-for-custom-workflows)를 사용하여 Git 프로바이더를 통해 배포할 수 있다.

## Git 저장소 배포하기 {#deploying-a-git-repository}

Git 저장소를 Vercel에 연결하고 배포하는 과정은 다음과 같다.

1. **Vercel 대시보드에서 'New Project' 버튼 클릭**
   - 프로젝트 생성 프로세스를 시작하려면 Vercel 대시보드 오른쪽 상단의 [New Project](https://vercel.com/new) 버튼을 클릭한다.
2. **Git 호스팅 서비스 선택**
   - GitHub, GitLab, Bitbucket 중에서 저장소가 있는 Git 호스팅 서비스를 선택한다.
   - Azure DevOps의 경우, [Vercel Deployment Extension](https://vercel.com/docs/deployments/git/vercel-for-azure-pipelines)을 사용한다.
3. **Git 저장소 목록 확인**
   - 선택한 Git 계정에 쓰기 권한이 있는 저장소 목록이 표시된다. 섹션 상단 드롭다운을 이용해 다른 네임스페이스나 프로바이더를 선택할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/vercel-doc-delpoying-git-repositories-with-vercel/1.png)

4. **추가 옵션**
   - 섹션 하단의 [Import Third-Party Git Repository](https://vercel.com/new/git/third-party)를 클릭하면 서드파티 Git 저장소도 가져올 수 있다.
   - 오른쪽 섹션에서 사전 구축된 솔루션 템플릿을 선택할 수 있다.
5. **Git 저장소/템플릿 선택**
   - 배포할 Git 저장소나 템플릿을 선택하면 프로젝트 설정 페이지로 이동한다.
6. **프로젝트 설정**
   - 프로젝트 이름 설정
   - [프레임워크 프리셋](https://vercel.com/docs/deployments/configure-a-build#framework-preset) 선택 (Next.js, React 등)
   - 프로젝트 루트 디렉토리 지정
   - [빌드 출력 설정](https://vercel.com/docs/deployments/configure-a-build#build-command) 구성
   - [환경 변수](https://vercel.com/docs/projects/environment-variables) 설정
7. **배포 실행**
   - 프로젝트 설정을 마친 후 'Deploy' 버튼을 클릭하면 Vercel에서 빌드 및 배포 프로세스가 시작된다.

이렇게 Vercel 대시보드에서 Git 저장소를 손쉽게 연결하고 초기 배포를 수행할 수 있다.

### Git 참조로 배포 생성하기 {#creating-a-deployment-from-a-git-reference}

Vercel 대시보드에서 Git 참조를 사용하여 새 배포를 직접 시작할 수 있다. 방법은 다음과 같다.

1. **대시보드에서 프로젝트 선택**
   - 먼저 Vercel [대시보드](https://vercel.com/dashboard)에서 배포하려는 프로젝트를 선택한다.
2. **Deployments 탭 이동 및 Create Deployment 클릭**
   - 선택한 프로젝트의 Deployments 탭으로 이동하여 Create Deployment 버튼을 클릭한다.
3. **Git 참조 입력**
   - 특정 커밋 배포: 배포할 커밋의 고유 SHA 값을 입력한다. 이 경우 해당 커밋으로 빌드되고 배포된다.
   - 브랜치 기반 배포: 배포할 브랜치의 전체 이름을 입력한다(예: https://github.com/vercel/examples/tree/deploy). 이 경우 해당 브랜치의 최신 커밋으로 빌드되고 배포된다.
4. **Create Deployment 클릭하여 배포 실행**
   - Git 참조를 입력하고 Create Deployment를 선택하면 Vercel에서 지정한 커밋이나 브랜치로 빌드 및 배포 프로세스를 정상적으로 진행합니다.
5. **브랜치 구성 선택 (필요 시)**
   - 동일 커밋이 여러 브랜치에 있을 경우, Vercel에서 어떤 브랜치 구성을 사용할지 선택하라는 메시지가 표시된다. 브랜치별로 환경 변수 등 설정이 다를 수 있으므로 이 선택은 중요하다.

이 방식은 자동 배포가 중단되었거나 특정 커밋, 브랜치를 수동으로 배포하고 싶을 때 유용하다. Git 기록의 임의 시점으로 롤백하거나, 개발 중인 브랜치의 최신 상태를 미리 확인하는 등 다양한 상황에서 활용할 수 있다.

직접 Git 참조를 지정하여 배포하면 정확성과 제어 가능성이 높아지는 반면, 자동 배포에 비해 번거로운 수동 작업이 필요하다. 사용 사례에 맞게 적절한 배포 방식을 선택하면 된다.

## 비공개 Git 저장소 배포 {#deploying-private-git-repositories}

비공개 Git 저장소의 커밋 배포 시 Vercel에서 적용하는 보안 규칙은 다음과 같다.

1. **비공개 저장소 보안**
   - 보안을 강화하기 위해 Vercel에서는 비공개 Git 저장소 및 이를 포크한 저장소의 커밋에 대한 배포를 제한한다. 커밋 작성자가 Vercel의 해당 프로젝트에 액세스 권한이 있어야만 배포가 가능하다.
2. **소유자 유형별 동작 차이**
   - Vercel 프로젝트의 소유자가 개인 계정인지 팀 계정인지에 따라 보안 규칙 동작이 달라진다.
3. **팀 계정의 경우**
   - 커밋 작성자는 Git 저장소와 연결된 Vercel 팀의 구성원이어야 한다.
   - 커밋 작성자의 개인 계정을 Vercel의 팀 구성원 목록에서 확인한다.
   - 구성원이 아닌 경우 배포가 차단되고, 작성자는 팀 가입을 요청할 수 있다.
   - 팀 소유자가 요청을 수락하면 해당 작성자의 최신 커밋이 배포된다.
4. **개인 계정의 경우**
   - 커밋 작성자는 Git 저장소와 연결된 Vercel 개인 계정의 소유자여야 한다.
   - 소유자가 아닌 경우 배포가 차단되고, 프로젝트를 팀 계정으로 이전하라는 안내가 제공된다.
   - 팀 계정으로 이전 후 작성자를 팀원으로 추가하면 팀 규칙이 적용된다.
5. **적용 대상**
   - 이 규칙은 GitHub 조직, GitLab 그룹, 비개인 Bitbucket 작업 공간의 커밋 작성자에게만 적용됩니다. 개인 Git 계정 협력자는 제외된다.
6. **공개 저장소**
   - 공개 Git 저장소의 경우 위 규칙 대신 다른 보안 정책이 적용된다.

이렇게 비공개 저장소에 대해 엄격한 보안 규칙을 적용하여 승인되지 않은 배포를 방지하고, 액세스 권한에 따라 배포 가능 여부를 결정한다.

### 팀 사용하기 {#using-teams}

Vercel 팀 계정을 사용할 때 비공개 Git 저장소의 커밋을 배포하기 위한 규칙은 다음과 같다.

1. **팀 구성원 요건**
   - 커밋 작성자가 Git 저장소와 연결된 Vercel 프로젝트를 포함하는 팀의 구성원이어야 한다. 팀 구성원이 아니면 배포가 차단된다.
2. **개인 계정 매핑**
   - 팀 구성원 여부는 커밋 작성자의 Git 계정과 Vercel 개인 계정을 매핑하여 확인한다. 작성자의 Git 계정과 [연결](https://vercel.com/docs/accounts/create-an-account#login-methods-and-connections)된 Vercel 개인 계정이 해당 팀의 구성원인지 확인하는 방식이다.
3. **팀 가입 요청**
   - 구성원이 아닌 경우 커밋 작성자는 팀에 가입을 요청할 수 있다. 이 요청은 팀 소유자에게 전달되어 [Members](https://vercel.com/docs/accounts/team-members-and-roles) 페이지에서 수락 또는 거절할 수 있다.
4. **요청 거절 시**
   - 팀 가입 요청이 거절되면 해당 작성자의 커밋은 배포되지 않는다.
5. **요청 수락 시**
   - 작성자가 팀 구성원으로 승인되면 자동으로 가장 최근 커밋이 Vercel에 배포된다.
6. **기존 구성원 자동 인식**
   - 기존 팀 구성원 중 한명이 Vercel 개인 계정과 Git 계정을 연결해 두었다면, 해당 Git 계정의 커밋 작성자는 자동으로 팀 구성원으로 인식된다.

### 개인 계정 사용하기 {#using-personal-accounts}

개인 Vercel 계정에서 비공개 Git 저장소의 커밋 배포를 위한 규칙은 다음과 같다.

1. **계정 소유자 요건**
   - 커밋 작성자가 Git 저장소와 연결된 Vercel 개인 계정의 소유자여야만 배포가 가능하다. 소유자가 아닌 경우에는 배포가 차단된다.
2. **로그인 연결 확인**
   - 개인 계정 소유자 여부는 [로그인 연결](https://vercel.com/docs/accounts/create-an-account#login-methods-and-connections)을 통해 확인한다. Vercel 개인 계정의 로그인 연결과 커밋 작성자의 Git 계정을 비교하여 일치 여부를 판단한다.
3. **팀 계정 전환 권장**
   - 소유자가 아닌 커밋 작성자의 경우, Git 프로바이더(GitHub, GitLab 등)에 해당 프로젝트를 Vercel 팀 계정으로 이전하라는 권장 메시지가 표시된다.
4. **팀 구성원 추가**
   - 프로젝트를 팀 계정으로 이전한 후에는 커밋 작성자를 해당 팀의 구성원으로 쉽게 추가할 수 있습니다.
5. **팀 규칙 적용**
   - 팀 구성원으로 추가되면, 이후 커밋 시 앞서 설명한 '팀 사용하기' 섹션의 규칙이 적용된다. 팀 구성원 여부에 따라 배포가 결정되는 방식이다.

## 공개 Git 저장소 포크 배포 {#deploying-forks-of-public-git-repositories}

공개 Git 저장소를 포크한 경우의 배포 규칙은 다음과 같다.

1. **일반 포크 저장소 배포**
   - 공개 저장소를 포크하면 대체로 포크한 저장소의 커밋이 자동으로 Vercel에 배포된다.
2. **보안 민감 정보 변경 시**
   - 하지만 포크 저장소의 Pull Request에서 `vercel.json` 파일이나 [환경 변수](https://vercel.com/docs/projects/environment-variables)를 변경하는 경우, 이는 보안 민감 정보에 해당한다. 이런 경우에는 자동 배포되지 않는다.
3. **승인 프로세스**
   - 대신 Vercel에서는 프로젝트 소유자 또는 [팀 구성원](https://vercel.com/docs/accounts/team-members-and-roles)의 승인을 요구합니다. 이는 프로젝트 정보 유출을 방지하기 위한 보안 조치다.
4. **PR 댓글 승인 링크**
   - Pull Request 댓글에 배포 승인 링크가 게시된다. 이 링크를 통해 소유자나 팀원이 변경사항을 확인하고 배포 여부를 결정할 수 있다.
5. **팀 구성원 예외**
   - 단, 커밋 작성자가 이미 Vercel 팀의 구성원인 경우에는 별도 승인 없이 바로 배포가 진행된다.

이렇게 공개 저장소 포크의 경우에도 중요 프로젝트 설정 변경 시에는 추가 보안 체크를 거치도록 하고 있다. 이를 통해 프로젝트 정보 유출 및 의도치 않은 배포를 예방할 수 있다.

## 프로덕션 브랜치 {#production-branch}

프로덕션 브랜치에 병합될 때마다 [프로덕션 배포](https://vercel.com/docs/deployments/environments#production)가 생성된다.

### 기본 구성 {#default-configuration}

Vercel에서 Git 저장소로 새 프로젝트를 만들 때 프로덕션 브랜치는 다음 순서로 선택된다:

1. `main` 브랜치
2. `main` 브랜치가 없으면 `master` 브랜치([자세한 보기](https://vercel.com/blog/custom-production-branch#a-note-on-the-master-branch))
3. [Bitbucket만 해당] 없으면 Git 저장소의 "Production Branch" 설정이 사용된다.
4. 없으면 Git 저장소의 기본 브랜치

### 프로덕션 브랜치 커스터마이징 {#customizing-the-production-branch}

프로젝트 설정의 Git 페이지에서 프로덕션 브랜치를 변경할 수 있다.

그런 다음 여기에서 설정한 브랜치에 새 커밋이 푸시되면 프로덕션 배포가 생성된다.

## 프리뷰 브랜치 {#preview-branch}

앞서 언급한 프로덕션 브랜치는 방문자에게 제공되는 코드가 포함된 단일 Git 브랜치다. 프리뷰 브랜치는 프로덕션 브랜치가 아닌 모든 Git 브랜치를 말한다.

예를 들어 프로덕션 브랜치가 `main` 이라면 `main` 이 아닌 모든 Git 브랜치가 프리뷰 브랜치다. 즉, 프리뷰 브랜치는 많을 수 있지만 프로덕션 브랜치는 하나뿐이다.

프리뷰 브랜치는 이름 그대로 프로덕션에 병합하기 전에 변경 사항을 미리 보는 데 사용된다.

기본적으로 프리뷰 브랜치에 커밋을 푸시할 때마다 아래와 같은 고유 도메인의 배포가 자동으로 생성된다:

`<project-name>-git-<branch-name>-<scope-slug>.vercel.app`

또한 [프리뷰 환경에 정의된 환경 변수](https://vercel.com/docs/projects/environment-variables#preview-environment-variables)가 모두 적용된다.

[Vercel의 Comments 기능](https://vercel.com/docs/workflow-collaboration/comments)을 통해 팀원 및 다른 협력자로부터 피드백을 받을 수도 있다. GitHub에서 PR 내에서 코멘트를 추적하고 해결할 수 있다.

변경 사항에 만족하면 해당 프리뷰 브랜치를 프로덕션 브랜치에 머지하면 된다.

### 다중 프리뷰 단계 {#multiple-preview-phases}

대부분의 사용 사례에서는 위에서 언급한 기본 프리뷰 동작으로 충분하다.

프로덕션에 병합하기 전에 변경 사항을 여러 단계로 미리 보고 싶다면 다음과 같이 구현할 수 있다:

도메인과 환경 변수 모두 개별 설정 페이지에서 특정 프리뷰 브랜치에 할당할 수 있다. 도메인의 경우 [여기서](https://vercel.com/docs/projects/domains/assign-domain-to-a-git-branch), 환경 변수의 경우 [여기서](https://vercel.com/docs/projects/environment-variables#preview-environment-variables) 할당한다.

예를 들어 "Staging" 단계를 만들어 프로덕션에 병합하기 전에 프리뷰 변경 사항을 누적할 수 있다. 다음 단계를 따르세요:

1. Git 저장소에 "staging"이라는 Git 브랜치를 만든다.
2. Vercel 프로젝트에서 원하는 도메인(예: staging.example.com)을 추가하고 [여기](https://vercel.com/docs/projects/domains/assign-domain-to-a-git-branch)서 "staging" Git 브랜치에 할당한다.
3. Vercel 프로젝트에서 새로운 Staging 단계에 사용할 환경 변수를 [여기](https://vercel.com/docs/projects/environment-variables#preview-environment-variables)서 추가한다.

그런 다음 "staging" Git 브랜치에 푸시하면 Staging 단계가 업데이트되고 정의한 도메인과 환경 변수가 자동으로 적용된다.

변경사항에 만족스러우면 해당 프리뷰 브랜치를 프로덕션 브랜치에 병합한다. 하지만 기본 프리뷰 동작과 달리 브랜치를 삭제하지 않고 유지하여 나중에 다시 푸시할 수 있다.
