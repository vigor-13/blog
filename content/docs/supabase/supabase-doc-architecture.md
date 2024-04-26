---
title: 아키텍처
description:
date: 2024-04-25
tags: []
references:
  [
    {
      key: 'Supabase 공식 문서',
      value: 'https://supabase.com/docs/guides/getting-started/architecture',
    },
  ]
---

**Supabase는 오픈 소스다.**

Supabase는 Firebase와 1:1 매핑되지 않는다. Firebase가 제공하는 많은 기능을 구축하고 있지만, 같은 방식으로 접근하지는 않는다:
기술적 선택이 상당히 다르다. Supabase에서 사용하는 모든 것은 오픈 소스이며, 가능한 한 처음부터 개발하기보다는 기존 도구를 사용하고 지원한다.

특히 NoSQL 저장소 대신 Postgres를 사용한다. 이 선택은 의도적인 것으로 Postgres만큼 Firebase와 경쟁하는 데 필요한 기능을 제공하면서도 그 이상으로 확장할 수 있는 확장성을 유지하는 다른 데이터베이스는 없다고 믿는다.

## 자신에게 맞는 수준을 선택할 수 있다 {#choose-your-comfort-level}

Supabase의 목표는 Postgres의 모든 기능을 쉽게 사용할 수 있도록 만드는 것이다. 그렇다고 모든 기능을 사용해야 하는 것은 아니다. Postgres 숙련자라면 우리가 제공하는 도구를 좋아할 것이다. Postgres를 처음 사용한다면 작은 규모로 시작하여 점차 확장해 나갈 수 있다. Postgres를 단순한 테이블 저장소처럼 사용하고 싶다면 그것도 좋다.

## 아키텍처 {#architecture}

각 Supabase 프로젝트는 여러 도구로 구성된다:

![Supabase의 아키텍처를 보여주는 다이어그램이다. Kong API 게이트웨이는 GoTrue, PostgREST, Realtime, Storage, pg_meta, Functions, pg_graphql의 7개 서비스 앞에 있다. 모든 서비스는 단일 Postgres 인스턴스와 통신한다.](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/supabase-doc-architecture/1.svg)

## PostgreSQL (데이터베이스) {#postgresql}

PostgreSQL은 Supabase의 핵심이다. 우리는 PostgreSQL 데이터베이스를 추상화하지 않는다. 전체 권한으로 액세스하고 사용할 수 있다. 우리는 단순히 PostgreSQL을 Firebase만큼 쉽게 사용할 수 있도록 만드는 도구를 제공한다.

- 공식 문서: [postgresql.org/docs](postgresql.org/docs)
- 소스 코드: [github.com/postgres/postgres](github.com/postgres/postgres) (미러)
- 라이선스: [PostgreSQL 라이선스](https://www.postgresql.org/about/licence/)
- 언어: C

## Studio (대시보드) {#studio}

데이터베이스와 서비스를 관리하기 위한 오픈 소스 대시보드다.

- 공식 문서: [Supabase 문서](https://supabase.com/docs)
- 소스 코드: [github.com/supabase/supabase](github.com/supabase/supabase)
- 라이선스: [Apache 2](https://github.com/supabase/supabase/blob/master/LICENSE)
- 언어: TypeScript

## GoTrue (인증) {#gotrue}

사용자 관리 및 액세스 토큰 발급을 위한 JWT 기반 API다. 이는 PostgreSQL의 Row Level Security 및 API 서버와 통합된다.

- 공식 문서: [Supabase 인증 참조 문서](https://supabase.com/docs/reference/auth)
- 소스 코드: [github.com/supabase/gotrue](github.com/supabase/gotrue)
- 라이선스: [MIT](https://github.com/supabase/gotrue/blob/master/LICENSE)
- 언어: Go

## PostgREST (API) {#postgrest}

PostgreSQL 데이터베이스를 직접 RESTful API로 전환하는 독립형 웹 서버다. 우리는 이를 [pg_graphql](https://github.com/supabase/pg_graphql) extension과 함께 사용하여 GraphQL API를 제공한다.

- 공식 문서: [postgrest.org](postgrest.org)
- 소스 코드: [github.com/PostgREST/postgrest](github.com/PostgREST/postgrest)
- 라이선스: [MIT](https://github.com/PostgREST/postgrest/blob/main/LICENSE)
- 언어: Haskell

## Realtime (API & 멀티플레이어) {#realtime}

사용자 Presence 관리, 메시지 브로드캐스트 및 데이터베이스 변경 사항 스트리밍을 위한 확장 가능한 웹소켓 엔진이다.

- 공식 문서: [Supabase Realtime 문서](https://supabase.com/docs/guides/realtime)
- 소스 코드: [github.com/supabase/realtime](github.com/supabase/realtime)
- 라이선스: [Apache 2](https://github.com/supabase/realtime/blob/main/LICENSE)
- 언어: Elixir

## Storage API (대용량 파일 저장소) {#storage-api}

메타데이터를 Postgres에 저장하는 S3 호환 객체 스토리지 서비스다.

- 공식 문서: [Supabase Storage 참조 문서](https://supabase.com/docs/reference/storage)
- 소스 코드: [github.com/supabase/storage-api](github.com/supabase/storage-api)
- 라이선스: [Apache 2.0](https://github.com/supabase/storage-api/blob/master/LICENSE)
- 언어: NodeJS / TypeScript

## Deno (Edge 함수) {#deno}

JavaScript 및 TypeScript를 위한 최신 런타임이다.

- 공식 문서: [Deno 문서](https://deno.land/)
- 소스 코드: [Deno 소스 코드](https://github.com/denoland/deno)
- 라이선스: [MIT](https://github.com/denoland/deno/blob/main/LICENSE.md)
- 언어: TypeScript / Rust

## postgres-meta (데이터베이스 관리) {#postgres-meta}

Postgres를 관리하기 위한 RESTful API다. 테이블을 가져오고, 역할을 추가하고, 쿼리를 실행한다.

- 공식 문서: [supabase.github.io/postgres-meta](supabase.github.io/postgres-meta)
- 소스 코드: [github.com/supabase/postgres-meta](supabase.github.io/postgres-meta)
- 라이선스: [Apache 2.0](https://github.com/supabase/postgres-meta/blob/master/LICENSE)
- 언어: NodeJS / TypeScript

## Supavisor {#supervisor}

클라우드 기반의 다중 테넌트 Postgres connection pooler다.

- 공식 문서: [Supavisor GitHub 페이지](https://supabase.github.io/supavisor/)
- 소스 코드: [supabase/supavisor](https://github.com/supabase/supavisor)
- 라이선스: [Apache 2.0](https://github.com/supabase/supavisor/blob/main/LICENSE)
- 언어: Elixir

## Kong (API 게이트웨이) {#kong}

NGINX 위에 구축된 클라우드 기반 API 게이트웨이다.

- 공식 문서: [docs.konghq.com](docs.konghq.com)
- 소스 코드: [github.com/kong/kong](github.com/kong/kong)
- 라이선스: [Apache 2.0](https://github.com/Kong/kong/blob/master/LICENSE)
- 언어: Lua

## 제품 원칙 {#product-principles}

- **대규모 기업을 위한 아키텍처 제공**:
  - Supabase는 대규모 기업이 필요로 하는 수준의 아키텍처를 제공하고자 한다.
  - 이는 확장성, 안정성, 보안성 등을 고려한 아키텍처를 의미한다.
  - 대규모 기업은 일반적으로 복잡하고 까다로운 요구사항을 가지고 있으므로, 이를 충족시킬 수 있는 아키텍처가 필요하다.
  - Supabase는 이러한 요구사항을 충족시키는 아키텍처를 제공함으로써 대규모 기업에서도 사용할 수 있는 솔루션이 되고자 한다.
- **인디 개발자와 소규모 팀을 위한 사용하기 쉬운 도구 제공**:
  - Supabase는 대규모 기업을 위한 아키텍처를 제공하는 것에 그치지 않고, 그 아키텍처 주변에 사용하기 쉬운 도구를 제공하고자 한다.
  - 인디 개발자와 소규모 팀은 대규모 기업과는 다른 요구사항과 제약 조건을 가지고 있다.
  - 이들은 일반적으로 자원과 시간이 제한적이므로, 복잡한 아키텍처를 직접 구축하고 관리하는 것이 어려울 수 있다.
  - Supabase는 이러한 인디 개발자와 소규모 팀을 위해 사용하기 쉬운 도구를 제공함으로써 진입 장벽을 낮추고자 한다.
  - 이를 통해 인디 개발자와 소규모 팀도 대규모 기업 수준의 아키텍처를 쉽게 활용할 수 있게 된다.

우리는 확장성과 사용 편의성이 상호 배타적이지 않도록 하기 위해 일련의 원칙을 사용한다:

### 모든 것은 독립적으로 작동한다 {#everything-works-in-isolation}

각 시스템은 외부 종속성을 최소화해야 하며 독립형 도구로 작동해야 한다.

이에 대한 판단 기준은 "사용자가 Postgres 데이터베이스만으로 이 제품을 실행할 수 있는가?" 이다.

### 모든 것은 통합되어 있다 {#everyting-is-integrated}

Supabase는 높은 수준의 모듈성을 가지고 있다. 각 제품은 독립적으로 기능하지만, 동시에 다른 제품과 원활하게 통합되어 시너지 효과를 발휘할 수 있도록 설계되었다. 이를 통해 Supabase 플랫폼의 각 구성 요소는 다른 구성 요소의 가치를 극대화하는 데 기여한다.

제품 간 통합을 원활하게 하기 위해 Supabase의 각 도구는 API와 Webhook을 제공한다. 이를 통해 개발자는 각 제품을 독립적으로 사용할 수도 있고, 필요에 따라 다른 제품과 손쉽게 연동할 수도 있다. API와 Webhook은 제품 간 데이터 교환과 이벤트 기반 통신을 가능하게 하여 Supabase 생태계 내에서 강력한 통합 솔루션을 제공한다.

이러한 모듈성과 통합 기능을 통해 Supabase는 개발자에게 유연성과 확장성을 제공합니다. 개발자는 필요에 따라 특정 제품을 선택적으로 사용할 수도 있고, 여러 제품을 조합하여 더 강력한 솔루션을 구축할 수도 있다. 이는 Supabase가 다양한 사용 사례와 요구 사항에 맞게 유연하게 대응할 수 있는 플랫폼임을 보여준다.

Supabase의 모듈성과 통합 기능은 개발자의 생산성을 향상시키고, 애플리케이션 개발 과정을 간소화한다. 각 제품의 독립성으로 인해 개발자는 필요한 기능에 집중할 수 있으며, API와 Webhook을 통한 통합으로 인해 제품 간 연동에 대한 부담을 줄일 수 있다. 이는 개발자가 더 빠르고 효율적으로 애플리케이션을 구축할 수 있도록 돕는다.

### 모든 것은 확장 가능하다 {#everything-is-extensible}

Supabase는 새로운 도구를 추가할 때 신중하게 접근한다. 우리는 기능의 확장성이 필요할 때 기존 도구를 개선하는 것을 선호한다. 이는 다양한 틈새 시장의 요구사항을 충족하기 위해 새로운 도구를 계속해서 추가하는 많은 클라우드 공급자의 접근 방식과는 대조적이다.

Supabase의 철학은 개발자에게 강력하면서도 단순한 도구를 제공하는 것이다. 우리는 개발자가 원하는 어떤 목표든 달성할 수 있도록 필수적인 구성 요소를 제공하는 데 집중한다. 이를 통해 개발자는 복잡성을 최소화하면서도 높은 수준의 유연성과 확장성을 얻을 수 있다.

우리는 "적지만 더 나은" 접근 방식을 따른다. 즉, 수많은 도구를 제공하기보다는 핵심적이고 강력한 도구를 제공하는 데 주력한다. 이를 통해 개발자는 필요한 기능에 집중하고, 도구의 복잡성으로 인한 부담을 줄일 수 있다. 우리는 간결하고 직관적인 API와 통합 기능을 제공함으로써 개발자가 효율적으로 작업할 수 있도록 지원한다.

### 모든 것이 이식 가능하다 {#everything-is-portable}

Supabase는 벤더 종속성을 최소화하기 위해 데이터 마이그레이션을 쉽게 할 수 있도록 설계되었다. 우리의 클라우드 서비스는 자체 호스팅 솔루션과 호환되므로, 고객은 언제든지 원하는 방식으로 Supabase를 사용할 수 있다.

데이터 이식성을 극대화하기 위해 Supabase는 pg_dump나 CSV 파일과 같은 널리 알려진 표준 형식을 채택하고 있다. 우리는 우리만의 독점적인 데이터 형식을 고수하기보다는, 업계 표준을 따르는 것을 선호한다. 만약 "Supabase"의 접근 방식보다 더 나은 새로운 표준이 등장한다면, 우리는 기존의 방식을 과감히 폐기하고 새로운 표준을 수용할 것이다.

이러한 원칙은 우리가 기술적인 측면보다는 사용자 경험에 초점을 맞추어야 함을 보여준다. Supabase는 단순히 기능적인 측면에서 경쟁하는 것이 아니라, 고객에게 최상의 서비스를 제공하는 것을 목표로 한다. 우리는 최고의 Postgres 호스팅 서비스가 되기 위해 끊임없이 노력하고 있다.

### 장기적인 관점에서 접근한다 {#play-the-long-game}

우리는 단기적인 이익보다는 장기적인 가치 창출에 초점을 맞춘다. 가끔은 당장의 필요에 따라 Postgres를 수정하여 우리 고객만을 위한 기능을 추가하고 싶은 유혹이 생길 수 있다. 하지만 우리는 그런 유혹을 뿌리치고, 대신 Postgres 커뮤니티 전체에 도움이 되는 방향으로 기능을 개선하고 기여하는 데 주력한다.

이러한 접근 방식은 단순히 올바른 일을 하는 것 이상의 의미가 있다. 우리가 Postgres의 업스트림에 기여할 때, 우리는 Supabase의 기반이 되는 기술의 발전에 직접적으로 기여하게 된다. 이는 장기적으로 볼 때 Supabase의 기능과 경쟁력을 높이는 효과가 있다. 또한 Postgres 커뮤니티 전체가 혜택을 볼 수 있기 때문에, 더 많은 개발자들이 Postgres를 사용하게 되고, 이는 결과적으로 Supabase의 성장에도 긍정적인 영향을 미친다.

뿐만 아니라, 이러한 개방적이고 협력적인 자세는 Supabase의 솔루션이 표준에 잘 부합하고, 다른 시스템과의 호환성과 이식성이 뛰어나다는 것을 보장한다. 이는 고객이 장기적으로 Supabase를 신뢰하고 안심하고 사용할 수 있게 해준다.

### 개발자를 위한 설계 {#build-for-developers}

우리는 "개발자"라는 특별한 사용자 그룹을 위해 Supabase를 설계한다. 개발자들은 단순한 사용자 이상의 존재다. 그들은 창조자이며 건설자다. 개발자들은 자신들의 노력으로 만들어낼 수 있는 제품과 시스템을 통해 엄청난 영향력을 발휘할 수 있다. 따라서 개발자들의 생산성을 향상시키는 것은 매우 높은 가치를 지닌다.

우리는 개발자들의 요구사항과 워크플로우를 깊이 이해하고, 그들의 작업 방식에 맞추어 Supabase를 설계하고 개선해 나가고 있다. 우리의 목표는 개발자들이 아이디어를 최대한 빠르고 효율적으로 실현할 수 있도록 돕는 것이다. 이를 위해 우리는 개발자들에게 필요한 도구와 리소스를 제공하고, 그들이 직면한 문제를 해결할 수 있는 최적의 솔루션을 끊임없이 모색한다.

개발자들의 니즈는 시간이 지남에 따라 변화한다. 새로운 기술과 트렌드가 등장하고, 개발 패러다임이 진화하며, 개발자들의 역할과 책임도 달라진다. Supabase는 이러한 변화를 민감하게 파악하고, 그에 맞게 제품을 지속적으로 발전시켜 나갈 것이다. 우리는 개발자들과 적극적으로 소통하고, 그들의 피드백과 제안을 귀담아 듣는다. 이를 통해 우리는 개발자들에게 최적화된 제품을 제공하고, 그들의 성공을 지원할 수 있다.

Supabase는 개발자 중심적인 사고를 가지고 있다. 우리는 개발자들의 가치를 인정하고, 그들의 요구사항을 최우선으로 고려한다. 이는 단순히 기능적인 도구를 제공하는 것 이상의 의미가 있다. 우리는 개발자들의 경험, 생산성, 그리고 궁극적으로는 그들의 성공을 향상시키기 위해 노력한다.

### 기존 도구와의 호환성 중시 {#support-existing-tools}

Supabase는 가능한 한 기존의 도구와 커뮤니티와 잘 어울리고 호환되도록 설계되었다. 우리는 우리만의 생태계를 구축하기보다는, 이미 존재하는 다양한 커뮤니티들과 협력하고 그들을 지원하는 데 주력한다.

Supabase는 하나의 커다란 커뮤니티라기보다는 여러 커뮤니티들의 연합체에 가깝다. 우리가 사용하고 통합하는 각각의 도구들은 그 자체로 고유한 커뮤니티를 가지고 있으며, 우리는 이 커뮤니티들과 긴밀히 협력한다. 우리는 그들의 도구를 Supabase에 통합함으로써 해당 도구의 가치를 높이고, 동시에 Supabase 사용자들에게도 혜택을 제공할 수 있다.

이러한 접근 방식은 특히 오픈 소스 생태계에서 중요하다. 우리는 오픈 소스 커뮤니티의 협력과 공생의 가치를 믿는다. 이를 위해 우리는 다양한 방식으로 오픈 소스 커뮤니티에 기여한다. 우리는 유능한 오픈 소스 개발자들을 고용하여 프로젝트에 기여하게 하고, 재정적인 후원을 통해 프로젝트의 지속 가능성을 높이며, 때로는 오픈 소스 기업에 직접 투자하기도 한다. 뿐만 아니라 우리 자신도 오픈 소스 도구를 개발하고 커뮤니티에 공개한다.

이는 단순히 우리의 제품을 개선하기 위한 전략 이상의 의미를 갖는다. 우리는 오픈 소스 생태계의 건강성과 다양성이 모든 개발자들과 사용자들에게 혜택이 된다고 믿는다. Supabase가 성장하고 발전함에 따라, 우리는 더 많은 오픈 소스 프로젝트와 커뮤니티를 지원하고 육성할 수 있기를 희망한다.

우리의 목표는 독점적인 플랫폼이 되는 것이 아니라, 개방적이고 협력적인 생태계의 한 부분이 되는 것이다. 우리는 기존의 도구와 커뮤니티를 인정하고 존중하며, 그들과 함께 성장하고 발전하기를 원한다. 이것이 Supabase가 추구하는 개방성과 협력의 가치다.
