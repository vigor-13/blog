---
title: 렌더링
description:
date: 2024-02-03
tags: ['rendering']
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/app/building-your-application/rendering',
    },
  ]
---

렌더링은 작성한 코드를 사용자 인터페이스로 변환한다. React와 Next.js를 사용하면 코드의 일부가 서버 또는 클라이언트에서 렌더링될 수 있는 하이브리드 웹 애플리케이션을 만들 수 있다. 이 섹션에서는 이러한 렌더링 환경, 전략 및 런타임 간의 차이점을 설명한다.

## 기초 {#fundamentals}

먼저 세 가지 기본 웹 개념을 숙지하는 것이 도움이 된다:

- 애플리케이션 코드가 실행될 수 있는 환경: 서버와 클라이언트.
- 사용자가 애플리케이션을 방문하거나 애플리케이션과 상호 작용할 때 시작되는 요청-응답 라이프사이클.
- 서버와 클라이언트 코드를 구분하는 네트워크 바운더리.

### 렌더링 환경 {#rendering-environment}

웹 애플리케이션은 클라이언트와 서버의 두 가지 환경에서 렌더링할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/nextjs-doc-rendering/1.png)

- **클라이언트**는 애플리케이션 코드에 대한 요청을 서버로 전송하는 브라우저를 말한다. 그런 다음 서버의 응답을 사용자 인터페이스로 변환한다.
- **서버**는 애플리케이션 코드를 저장하고 클라이언트로부터 요청을 받은 후 적절한 응답을 다시 보내는 데이터 센터의 컴퓨터를 말한다.

기존에는 개발자가 서버와 클라이언트용 코드를 작성할 때 서로 다른 언어(예: JavaScript, PHP)와 프레임워크를 사용해야 했다. React를 사용하면 개발자는 동일한 언어(JavaScript)와 동일한 프레임워크(예: Next.js 또는 사용자가 선택한 프레임워크)를 사용할 수 있다. 이러한 유연성 덕분에 컨텍스트 전환 없이 두 환경 모두에 대한 코드를 원활하게 작성할 수 있다.

그러나 각 환경에는 고유한 기능과 제약 조건이 있다. 따라서 서버와 클라이언트에 대해 작성하는 코드가 항상 동일하지는 않다. 한 환경에 더 적합한 특정 작업(예: 데이터 페치 또는 상태 관리)이 다른 환경에 더 적합한 경우도 있다.

이러한 차이점을 이해하는 것이 React와 Next.js를 효과적으로 사용하기 위한 핵심이다.

### 요청-응답 라이프사이클 {#request-response-lifecycle}

대체로 모든 웹사이트는 동일한 요청-응답 라이프사이클을 따른다:

1. **사용자 액션** : 사용자가 웹 애플리케이션과 상호 작용한다. 링크를 클릭하거나, 폼을 제출하거나, 브라우저의 주소창에 URL을 직접 입력할 수 있다.
2. **HTTP 요청** : 클라이언트는 요청 중인 리소스, 사용 중인 메서드(예: `GET`, `POST`), 필요한 경우 추가 데이터 등 필요한 정보가 포함된 HTTP 요청을 서버로 보낸다.
3. **서버** : 서버는 요청을 처리하고 적절한 리소스로 응답한다. 이 프로세스에는 라우팅, 데이터 페치 등의 몇 가지 단계가 포함될 수 있다.
4. **HTTP 응답** : 요청을 처리한 후 서버는 HTTP 응답을 클라이언트에 다시 보낸다. 이 응답에는 상태 코드(요청이 성공했는지 여부를 클라이언트에게 알려줌)와 요청된 리소스(예: HTML, CSS, JavaScript, 정적 자산 등)가 포함된다.
5. **클라이언트** : 클라이언트가 리소스를 파싱하여 사용자 인터페이스를 렌더링한다.
6. **사용자 액션** : 사용자 인터페이스가 렌더링되면 사용자는 인터페이스와 상호 작용할 수 있으며 전체 프로세스가 다시 시작돤다.

하이브리드 웹 애플리케이션을 구축할 때 가장 중요한 부분은 라이프사이클에서 작업을 분할하는 방법과 네트워크 바운더리를 어디에 배치할지 결정하는 것이다.

### 네트워크 바운더리 {#network-boundary}

웹 개발에서 네트워크 바운더리는 서로 다른 환경을 구분하는 개념적 경계선이다. 예를 들어 클라이언트와 서버 또는 서버와 데이터 저장소가 이에 해당한다.

React에서는 클라이언트-서버 네트워크 바운더리를 가장 적합한 곳에 배치할 위치를 선택한다.

무대 뒤에서 작업은 클라이언트 모듈 그래프와 서버 모듈 그래프의 두 부분으로 나뉜다. 서버 모듈 그래프에는 서버에서 렌더링되는 모든 컴포넌트가 포함되고, 클라이언트 모듈 그래프에는 클라이언트에서 렌더링되는 모든 컴포넌트가 포함된다.

모듈 그래프는 애플리케이션의 파일들이 서로 어떻게 의존하는지를 시각적으로 표현한 것으로 생각하면 도움이 된다.

바운더리를 정의하기 위해 React `"use client"` 규칙을 사용할 수 있다. 또한 `"use server"` 규칙도 있는데, 이는 서버에서 일부 계산 작업을 수행하도록 React에 지시하는 규칙이다.

## 하이브리드 애플리케이션 만들기 {#building-hybrid-applications}

이러한 환경에서 작업할 때는 애플리케이션의 코드 흐름을 단방향으로 생각하는 것이 도움이 된다. 즉, 응답하는 동안 애플리케이션 코드는 서버에서 클라이언트 단 방향으로 흐른다.

클라이언트에서 서버에 액세스해야 하는 경우 동일한 요청을 재사용하지 않고 서버에 새 요청을 보낸다. 이렇게 하면 컴포넌트를 렌더링할 위치와 네트워크 바운더리를 배치할 위치를 더 쉽게 이해할 수 있다.

실제로 이 모델은 개발자가 결과를 클라이언트에 전송하고 애플리케이션을 대화형으로 만들기 전에 서버에서 무엇을 실행할지 먼저 생각하도록 권장한다.
