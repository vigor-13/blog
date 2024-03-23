---
title: 왜 Prisma ORM인가?
description:
date: 2024-03-22
tags: []
references:
  [
    {
      key: 'Prisma 공식 문서',
      value: 'https://www.prisma.io/docs/orm/overview/introduction/why-prisma',
    },
  ]
---

이 페이지에서는 Prisma ORM의 개발 동기를 알아보고 기존 ORM 및 SQL 쿼리 빌더와 같은 다른 데이터베이스 도구와 Prisma가 어떻게 다른지 비교해본다.

관계형 데이터베이스 작업은 애플리케이션 개발의 주요 병목 지점이다. SQL 쿼리 또는 복잡한 ORM 객체를 디버깅하는 데 많은 시간이 소요된다.

Prisma ORM은 _일반 자바스크립트 객체_ 를 반환하는 데이터베이스 쿼리를 위한 깔끔하고 타입 안전한 API를 제공하여 개발자가 데이터베이스 쿼리를 쉽게 사용할 수 있도록 해준다.

## TLDR {#tldr}

Prisma ORM의 주요 목표는 데이터베이스 작업 시 애플리케이션 개발자의 생산성을 높이는 것이다. 다음은 Prisma ORM이 이를 달성하기 위해서 제공하는 것들이다:

- 관계형 데이터 매핑 대신 **객체 단위로 사고**하기
- 복잡한 모델 객체를 피하기 위해 **클래스가 아닌 쿼리**
- 데이터베이스 및 애플리케이션 모델을 위한 단일 데이터 소스
- 일반적인 함정과 안티 패턴을 방지하는 **건전한 제약 조건**
- **올바른 일을 쉽게 할 수 있게 해주는 추상화**
- 컴파일 시 유효성을 검사할 수 있는 **타입 안전 데이터베이스 쿼리**
- **상용구 감소**로 개발자가 앱의 중요한 부분에 집중할 수 있다
- 문서를 찾을 필요 없이 코드 편집기에서 **자동 완성 기능** 제공

이 페이지의 나머지 부분에서는 Prisma ORM이 기존 데이터베이스 도구와 어떻게 다른지 설명한다.

## SQL, 기존 ORM 그리고 다른 데이터베이스 도구들의 문제점 {#problems-with-sql-tranditional-orms-and-other-database-tools}

현재 Node.js 및 TypeScript 에코시스템에 존재하는 데이터베이스 도구의 주요 문제점은 **생산성과 제어 사이에서 큰 절충**이 필요하다는 점이다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/prisma-doc-overview-introduction-why-prisma-orm/1.png)

### 순수 SQL : 완전한 제어, 낮은 생산성 {#raw-sql-full-control-low-productivity}

순수 SQL(예: 네이티브 `pg` 또는 `mysql` Node.js 데이터베이스 드라이버 사용)을 사용하면 데이터베이스 작업을 완전히 제어할 수 있다. 그러나 일반 SQL 문자열을 데이터베이스로 전송하는 것은 번거롭고 많은 오버헤드(수동 연결 처리, 반복적인 상용구 등)가 발생하므로 생산성이 저하된다.

이 접근 방식의 또 다른 주요 문제는 쿼리 결과에 대한 타입 안전성을 확보할 수 없다는 것이다. 물론 결과를 수동으로 입력할 수는 있지만 이는 엄청난 양의 작업이며, 데이터베이스 스키마나 쿼리를 변경할 때마다 입력 내용을 동기화하기 위해 대규모 리팩토링이 필요하다.

또한 SQL 쿼리를 일반 문자열로 제출하면 편집기에서 자동 완성 기능을 사용할 수 없다.

### SQL 쿼리 빌더 : 높은 제어, 중간 생산성 {#sql-query-builder-high-control-medium-productivity}

높은 수준의 제어력을 유지하고 생산성을 향상시키는 일반적인 솔루션은 SQL 쿼리 빌더(예: knex.js)를 사용하는 것이다. 이러한 종류의 도구는 SQL 쿼리를 구성하기 위한 프로그래밍 방식의 추상화를 제공한다.

SQL 쿼리 빌더의 가장 큰 단점은 애플리케이션 개발자가 여전히 데이터를 SQL 관점에서 생각해야 한다는 것이다. 이로 인해 관계형 데이터를 객체로 변환하는 데 인지적, 실제적 비용이 발생한다. 또 다른 문제는 SQL 쿼리에서 자신이 무엇을 하고 있는지 정확히 알지 못하면 나중에 많은 문제가 발생할 수 있다는 것이다.

### 기존 ORM들 : 낮은 제어, 높은 생산성 {#traditional-orms-less-control-better-productivity}

기존 ORM은 애플리케이션 모델을 클래스로 정의할 수 있도록 하여 SQL을 추상화하며, 이러한 클래스는 데이터베이스의 테이블에 매핑된다.

> 객체 관계형 매퍼(ORM)는 프로그래머의 친구(객체)와 데이터베이스의 기본(관계) 사이의 간극을 메우기 위해 존재한다. 프로그래머는 실행 중인 프로그램에서 단일 대상의 상태를 캡슐화하기 때문에 객체를 좋아하고, 데이터베이스는 전체 데이터 집합 제약 조건과 전체 데이터 집합에 대한 효율적인 액세스 패턴에 더 적합하기 때문에 관계를 좋아한다.
>
> \- [The Troublesome Active Record Pattern, Cal Paterson (2020)](https://calpaterson.com/activerecord.html) -

그런 다음 모델 클래스의 인스턴스에서 메서드를 호출하여 데이터를 읽고 쓸 수 있다.

이 방법이 훨씬 더 편리하고 개발자가 데이터를 생각할 때 머릿속에 그리는 모델에 더 가까워진다. 그렇다면 문제는 무엇일까?

> ORM은 시작은 좋았지만 시간이 지날수록 점점 더 복잡해지고, 어느새 명확한 경계점도, 명확한 승리 조건도, 명확한 출구 전략도 없는 약속에 사용자를 가두는 수렁과도 같다.
>
> \- The Vietnam of Computer Science, Ted Neward (2006) -

애플리케이션 개발자가 데이터에 대해 가지고 있는 멘탈 모델은 **객체**의 멘탈 모델이다. 반면에 SQL에서 데이터에 대한 멘탈 모델은 **테이블**이다.

이 두 가지 다른 데이터 표현 사이의 차이를 흔히 [객체-관계 모델의 패러다임 불일치](https://en.wikipedia.org/wiki/Object-relational_impedance_mismatch)라고 한다. 객체-관계 모델 패러다임 불일치는 많은 개발자가 기존 ORM으로 작업하는 것을 싫어하는 주요 이유이기도 하다.

예를 들어, 각 접근 방식에서 데이터가 어떻게 구성되고 관계가 처리되는지 생각해 보자:

- **관계형 데이터베이스** : 데이터는 일반적으로 정규화(플랫)되고 외래 키를 사용하여 엔터티 간에 연결된다. 그런 다음 실제 관계를 나타내기 위해 엔티티를 조인해야 한다.
- **객체 지향** : 객체는 점 표기법을 사용하여 간단히 관계를 탐색할 수 있는 중첩된 구조다.

이는 기존 ORM의 주요 함정 중 하나를 암시한다: 익숙한 점 표기법을 사용하여 관계를 간단히 횡단할 수 있는 것처럼 보이지만, 내부적으로 ORM은 비용이 많이 들고 애플리케이션의 속도를 크게 저하시킬 가능성이 있는 SQL JOIN을 생성한다(그 증상 중 하나가 [n+1 문제](https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm-object-relational-mapping)다).

결론을 내리자면: 기존 ORM의 매력은 관계형 모델을 추상화하고 데이터를 순전히 객체 관점에서만 생각한다는 것이다. 이점은 훌륭하지만, 관계형 데이터를 객체에 쉽게 매핑할 수 있다는 잘못된 가정에 기초하고 있어 많은 복잡성과 함정을 초래한다.

## 애플리케이션 개발자는 SQL이 아니라 데이터에 집중해야 한다 {#application-developers-should-care-about-data-note-sql}

1970년대에 개발되었음에도 불구하고 SQL은 인상적인 방식으로 시간의 시험을 견뎌왔다. 하지만 개발자 도구가 발전하고 현대화되면서 SQL이 과연 애플리케이션 개발자가 작업하기에 가장 적합한 추상화 방식인지 생각해 볼 필요가 있다.

결국, 개발자는 기능을 구현하는 데 필요한 데이터에만 관심을 가져야 하며, 복잡한 SQL 쿼리를 파악하거나 쿼리 결과를 필요에 맞게 조정하는 데 시간을 소비해서는 안 된다.

애플리케이션 개발에서 SQL을 반대하는 또 다른 주장이 있다. 무엇을 하고 있는지 정확히 알고 있다면 SQL의 힘은 축복이 될 수 있지만, 그 복잡성은 저주가 될 수도 있다. 숙련된 SQL 사용자도 예상하기 안티 패턴과 함정이 많기 때문에 성능 저하와 디버깅 시간 낭비를 감수해야 하는 경우가 많다.

개발자는 SQL 쿼리에서 "올바른 작업을 수행하는지"에 대해 걱정할 필요 없이 필요한 데이터를 요청할 수 있어야 한다. 개발자는 올바른 결정을 내릴 수 있는 추상화를 사용해야 한다. 이는 추상화가 개발자의 실수를 방지하는 특정 "건전한" 제약 조건을 부과한다는 것을 의미한다.

## Prisma ORM은 개잘자의 생산성을 높인다 {#prisma-orm-makes-developers-productivity}

Prisma ORM의 주요 목표는 애플리케이션 개발자가 데이터베이스로 작업할 때 생산성을 높이는 것이다. 생산성과 제어 사이의 절충점을 다시 한 번 고려할 때 Prisma ORM은 여기에 적합하다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/prisma-doc-overview-introduction-why-prisma-orm/2.png)