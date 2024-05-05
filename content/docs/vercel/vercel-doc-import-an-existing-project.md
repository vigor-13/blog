---
title: 기존 프로젝트 가져오기
description: 지원되는 프레임워크로 구축된 기존 프론트엔드 프로젝트를 가져와 Vercel에 새로운 프로젝트를 생성할 수 있다.
date: 2024-05-05
tags: []
references:
  [
    {
      key: 'Vecel 공식 문서',
      value: 'https://vercel.com/docs/getting-started-with-vercel/import',
    },
  ]
---

:::note CLI 사용하시나요?

Vercel CLI를 사용하여 기존 프로젝트를 배포하려면 다음 스니펫을 사용한다:

```bash
vercel --cwd [path-to-project]
```

:::

기존 프로젝트는 정적 HTML 콘텐츠(HTML, CSS 및 JavaScript를 포함하는 웹사이트 등)를 출력하는 모든 웹 프로젝트를 말한다. Vercel의 [지원되는 프레임워크](https://vercel.com/docs/frameworks) 중 하나를 사용하면 해당 프레임워크에 최적화된 빌드 및 배포 구성을 자동으로 감지하고 설정한다.

1. **Git 프로바이더에 연결하기**

   - [New Project](https://vercel.com/new) 페이지의 Import Git Repository 섹션에서 프로젝트를 가져올 Git 프로바이더를 선택한다.
   - 프롬프트에 따라 GitHub, GitLab 또는 BitBucket 계정에 로그인한다.

2. **저장소 가져오기**

   - 목록에서 가져올 저장소를 찾아 Import를 클릭한다.

3. **설정 구성하기 (선택 사항)**

   - Vercel은 프레임워크와 필요한 빌드 설정을 자동으로 감지한다. 하지만 이 단계에서 [빌드 및 출력 설정](https://vercel.com/docs/deployments/configure-a-build#build-and-development-settings), [환경 변수](https://vercel.com/docs/projects/environment-variables) 등 프로젝트 설정을 구성할 수 있다. 이는 나중에 설정할 수도 있다.
   - [프레임워크](https://vercel.com/docs/deployments/configure-a-build#framework-preset), [빌드 명령어](https://vercel.com/docs/deployments/configure-a-build#build-command), [출력 디렉토리](https://vercel.com/docs/deployments/configure-a-build#output-directory), [설치 명령어](https://vercel.com/docs/deployments/configure-a-build#install-command), [개발 명령](https://vercel.com/docs/deployments/configure-a-build#development-command)을 변경하려면 Build & Output Settings 섹션을 펼친 후 필요에 따라 수정한다.
   - 환경 변수를 설정하려면 환경 변수 섹션을 펼치고 변수를 붙여넣거나 입력한다.
   - [vercel.json](https://vercel.com/docs/projects/project-configuration) 파일을 프로젝트에 추가하여 추가 설정을 구성할 수도 있다. 이는 배포 전에 할 수도 있고, 나중에 추가한 후 프로젝트를 재배포할 수도 있다.

4. **프로젝트 배포하기**

   - Deploy 버튼을 클릭하면 Vercel이 선택한 구성을 기반으로 프로젝트를 생성하고 배포한다.

5. **배포 성공 축하하기!**
   - 배포 결과를 확인하려면 대시보드에서 프로젝트를 선택한 후 도메인을 클릭한다. 이제 해당 URL을 알고 있는 사람은 누구나 이 페이지에 접근할 수 있다.

![자동 생성된 도메인 접근하기](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/vercel-doc-import-an-existing-project/1.png)

## 다음 단계 {#next-steps}

다음으로, 새로운 배포에 도메인을 할당하는 방법을 알아본다.
