---
title: Google 검색엔진 최적화 - 구글 검색엔진 기초
description: Google 검색엔진의 작동 방식 알아보기
date: 2024-01-09
tags: [google, seo]
references:
  [
    {
      key: 'Google 검색 센터 - 표준화란 무엇인가?',
      value: 'https://developers.google.com/search/docs/crawling-indexing/canonicalization?hl=ko',
    },
    {
      key: 'Google에 웹사이트 등록하기',
      value: 'https://developers.google.com/search/docs/fundamentals/get-on-google?hl=ko',
    },
    {
      key: 'Google 검색의 작동 방식에 대한 상세 가이드',
      value: 'https://developers.google.com/search/docs/fundamentals/how-search-works?hl=ko',
    },
  ]
---

## 구글 검색의 작동 방식

구글은 검색엔진은 크게 다음과 같은 프로세스로 작동한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/google-seo/1.png)

### 크롤링

구글이 웹에 어떤 페이지가 존재하는지 파악하는 단계다. 2가지 방법이 존재한다.

- [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot?hl=ko)이 주기적으로 새로 등록된 페이지가 있는지 크롤링한다.
- 페이지 소유자가 [사이트맵](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=ko)을 구글에 제출한다.

크롤링의 대상이 되면 페이지는 최신 크롬 환경에서 렌더링되며 함께 발견된 자바스크립트도 실행된다(최신 웹 환경에서는 자바스크립트를 사용하여 컨텐츠를 표현하는 경우가 많기 때문이다).

:::warning 크롤링이 불가능한 경우

크롤러가 사이트에 액세스할 수 없는 경우 크롤링이 불가능하다.

- [사이트를 처리하는 서버 관련 문제](https://developers.google.com/search/docs/crawling-indexing/http-network-errors?hl=ko#http-status-codes)
- [네트워크 문제](https://developers.google.com/search/docs/crawling-indexing/http-network-errors?hl=ko#network-and-dns-errors)
- [Googlebot이 페이지에 액세스하지 못하도록 하는 robots.txt 규칙 문제](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=ko)

:::

### 색인 생성

크롤링된 페이지의 내용을 파악하는 단계다.

> 페이지가 크롤링되면 Google은 페이지의 내용을 파악하려고 합니다. 이 단계를 색인 생성이라고 하며 \<title> 요소 및 Alt 속성, 이미지, 동영상 등 텍스트 콘텐츠 및 핵심 콘텐츠 태그와 속성을 처리하고 분석하는 작업이 포함됩니다.

크롤링 중에는 다음과 같은 작업들이 이루어진다.

- 중복 URL의 **표준화** - 검색 결과에 표시될 수 있는 페이지를 결정한다.
  - 비슷한 페이지를 찾아 그룹화하고 그룹을 대표할 수 있는 페이지를 결정한다.
  - 나머지 페이지는 다른 디바이스 환경이나 클러스터의 특정 페이지를 검색하는 경우 대체 버전으로 제공된다.
- 페이지 내부의 콘텐츠를 분석하여 **신호**를 수집한다.
  - 이 때 수집된 신호는 다음 단계에서 검색 결과의 순위를 결정하는데 사용된다.
  - 일부 신호에는 페이지의 언어, 콘텐츠가 속하는 국가, 페이지의 사용성 등이 포함된다.

:::note 콘텐츠 표준화(표준 URL)
표준화는 콘텐츠를 대표하는 표준 URL을 선택하는 프로세스다. 표준 URL은 Google이 *여러 중복 페이지 중 가장 대표적이라고 선택한 페이지*의 URL을 말한다.
:::

:::note 중복 페이지

다음과 같은 다양한 이유로 사이트에 중복 페이지가 있을 수 있다.

- **지역별 변형**: 예를 들어 미국과 영국을 대상으로 제공되는 콘텐츠이며 여러 URL을 통해 액세스할 수 있지만, 본질적으로는 동일한 언어로 작성된 동일한 콘텐츠인 경우다.
- **기기 변형**: 예를 들어 페이지에 모바일 버전과 데스크톱 버전이 둘 다 있는 경우다.
- **프로토콜 변형**: 예를 들어 사이트에 HTTP 버전과 HTTPS 버전이 있는 경우다.
- **사이트 기능**: 예를 들어 카테고리 페이지에 정렬 및 필터링 기능을 사용한 결과다.
- **실수로 인한 변형**: 예를 들어 사이트의 데모 버전이 실수로 크롤러가 액세스할 수 있는 상태로 남아 있을 수 있다.

:::

이렇게 수집된 데이터는 Google의 데이터베이스에 저장되며 이를 Google 색인이라고 한다.

:::warning

색인 생성은 페이지 콘텐츠 및 메타데이터에 따라서도 달라진다. 색인 생성과 관련하여 일반적으로 발생하는 문제는 다음과 같다.

- [페이지 콘텐츠의 품질이 낮음](https://developers.google.com/search/docs/essentials?hl=ko)
- [Robots `meta` 규칙이 색인 생성을 허용하지 않음](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=ko)
- [웹사이트 디자인으로 인해 색인 생성이 어려울 수 있음](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=ko)

:::

### 검색 결과 게재

사용자의 요구사항에 적합한 페이지를 찾아 제공하는 단계다.

> 사용자가 검색어를 입력하면 Google 컴퓨터는 색인에서 일치하는 페이지를 검색한 다음 품질이 가장 높고 사용자의 검색어와 가장 관련성이 크다고 판단되는 결과를 반환합니다. 관련성은 사용자의 위치와 언어, 기기(데스크톱 또는 휴대전화)와 같은 정보를 비롯하여 수많은 요인으로 결정됩니다. 예를 들어 '자전거 수리점'을 검색하면 파리에 있는 사용자와 홍콩에 있는 사용자에게 서로 다른 결과가 표시됩니다.

Google 데이터베이스에 색인이 등록되었는데도 검색결과에 나타나지 않는다면 원인은 다음과 같을 수 있다.

- 페이지의 콘텐츠가 사용자의 검색어와 관련이 없음
- 콘텐츠 품질이 낮음
- Robots meta규칙으로 게재가 차단된

## 사이트가 Google에 등록되었는지 확인하기

구글 검색엔진에 내 사이트가 등록 되었는지 확인하는 방법을 알아보자.

방법은 간단하다. 구글에서 다음과 같이 검색해보면 된다!

```txt
site:example.com
```

:::tip 구글 크롤러가 사이트를 찾지 못하는 경우

구글에서 사이트가 검색되지 않는 다면 다음과 같은 요인들을 검토 해봐야 한다.

- 사이트가 웹상의 다른 사이트와 연결되어 있지 않은 경우
- 사이트가 개설된 지 얼마 되지 않아 크롤링이 안된 경우
- 사이트가 HTML로 빌드되지 않아 클롤러가 잘 인식하지 못하는 경우
- 크롤러가 사이트를 크롤링하는 중에 어떠한 오류가 발생하는 경우 (사이트가 어떤 이유에서인지 구글을 차단하는 경우다)
- 크롤러가 사이트를 발견하지 못한 경우

:::
