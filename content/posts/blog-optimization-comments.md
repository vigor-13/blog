---
title: 블로그 최적화 - 댓글
description: utterances로 댓글 추가하기
date: 2024-01-07
tags: [utterances]
references:
  [
    {
      key: '11ty 블로그에 utterances로 댓글 추가하기',
      value: 'https://dev.to/antopiras89/add-comments-to-your-static-blog-with-utterances-3jao',
    },
  ]
---

블로그에 댓글을 추가하기 위해서 조사를 했다. 자주 사용되는 몇 가지 솔루션이 있었다.

- Disqus
- Jamstack Comments Engine
- utterances

Disqus의 경우 무료로도 사용이 가능하지만 광고가 붙고 사용자를 추적하는 등의 단점이 있다.

Jamstack Comments Engine은 댓글이 달릴 때마다 Netlify API를 통해서 웹을 새로 빌드하는 방식이다. 다만 그 과정이 복잡해서 선뜻 손이 가진 않는다.

개발자에게 가장 간단하고 대중적인 솔루션은 [utterances](https://github.com/utterance/utterances)다.

## utterances

### 특징

깃헙에서 소개하는 [utterances](https://github.com/utterance/utterances)의 특징은 다음과 같다.

- 오픈소스다.
- 추적이나 광고 없이 항상 무료다.
- 모든 데이터가 GitHub issues에 저장된다.
- GitHub를 지원하는 CSS 툴킷인 Primer로 스타일을 지정한다.
- 다크 테마 지원
- 가볍다(폰트를 다운로드 하거나, 프레임워크, 폴리필등을 사용하지 않는다).

### 어떻게 작동하는가?

utterances는 댓글을 Github issues에 저장한다. 페이지에서 utterances 스크립트가 로드되면 Github issue search API를 사용하여 관련 이슈를 찾는다. 등록된 이슈가 없더라도 utterances-bot이 자동으로 이슈를 등록해 준다.

댓글(=이슈)를 등록하기 위해서 사용자는 반드시 utterances app에 권한을 부여해야 한다.

### 설정 방법

우선 utterances와 연동할 레포지토리를 정하고 다음의 사항들을 확인한다.

- 레포지토리는 public이어야 한다. 그렇지 않으면 독자들이 이슈/댓글을 볼 수 없다.
- 레포지토리에 [utterances 앱](https://github.com/apps/utterances)이 설치되어 있어야 한다. 그렇지 않으면 사용자가 댓글을 게시할 수 없다.
- 포크한 레포지토리인 경우 설정 탭으로 이동하여 이슈 기능이 켜져 있는지 확인한다.

다음으로 [https://utteranc.es/](https://utteranc.es/)페이지에 가보면 utterances 스크립트를 설정할 수 있는 도구를 제공한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-comments/1.png)

옵션을 적절히 입력하면 다음과 같이 코드를 만들어 준다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-comments/2.png)

생성된 코드를 프로젝트의 원하는 위치에 추가만하면 완성이다.
