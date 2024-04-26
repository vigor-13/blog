---
title: Auth
description: Supabase를 사용하여 사용자를 인증하고 권한을 부여할 수 있다.
date: 2024-04-26
tags: [auth]
references:
  [
    {
      key: 'Supabase 공식 문서',
      value: 'https://supabase.com/docs/guides/auth',
    },
  ]
---

모든 인증 시스템은 두 가지 핵심 요소로 구성된다:

- **인증(Authentication)**: 이 사람이 시스템에 접근할 수 있는 권한이 있는가? 만약 그렇다면, 그들의 신원은 무엇인가?
- **권한 부여(Authorization)**: 일단 시스템에 접근했다면, 그들은 어떤 작업을 수행할 수 있는가?

Supabase의 Auth 기능은 독립적으로 사용할 수도 있고, 다른 Supabase 서비스와 긴밀하게 통합하여 사용할 수도 있도록 설계되었다.

Postgres 데이터베이스는 Supabase의 모든 서비스의 핵심이며, Auth 시스템 역시 이 원칙을 따른다. 우리는 가능한 한 Postgres의 내장 인증 기능을 최대한 활용한다.

아래는 Supabase에 내장된 Auth 기능을 간략히 소개하는 2분 가이드다:

https://youtu.be/6ow_jW4epf8

## 인증 {#Authentication}

사용자 인증은 다양한 방식으로 이루어질 수 있다:

- [이메일](https://supabase.com/docs/guides/auth/auth-email)이나 [전화번호](https://supabase.com/docs/guides/auth/phone-login)와 비밀번호를 사용하는 전통적인 비밀번호 기반 인증
- 매직 링크나 일회용 비밀번호(OTP)를 이메일이나 문자 메시지로 전송하는 비밀번호 없는 인증
- Google, Facebook, Twitter 등의 소셜 로그인 제공자를 통한 OAuth 인증
- SAML을 사용한 Single Sign-On (SSO) 인증
- 사용자 정보 없이 익명으로 로그인하는 [익명 로그인](https://supabase.com/docs/guides/auth/auth-anonymous)

### 프로바이더 {#providers}

Supabase는 다양한 인증 프로바이더와 로그인 방식을 지원할 뿐만 아니라, 인증 과정을 돕는 [유용한 도구](https://supabase.com/docs/guides/auth/auth-helpers/)들도 함께 제공한다.

#### 소셜 인증 {#social-auth}

- [Apple](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- Azure (Microsoft)
- Bitbucket
- Discord
- [Facebook](https://supabase.com/docs/guides/auth/social-login/auth-facebook)
- Figma
- [GitHub](https://supabase.com/docs/guides/auth/social-login/auth-github)
- GitLab
- [Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- Kakao
- Keycloak
- LinkedIn
- Notion
- Slack
- Spotify
- Twitter
- Twitch
- WorkOS
- Zoom

#### 전화 인증 {#phone-auth}

- MessageBird
- Twilio
- Vonage

### 써드파티 프로바이더 구성 {#configure-third-party-providers}

Supabase 대시보드에서 Authentication > Providers > Auth Providers로 이동한다.

여기에서 각 인증 프로바이더별로 할당받은 `Client ID` 와 `Secret` 키를 입력하기만 하면, 간단히 버튼 클릭 한 번으로 해당 프로바이더를 통한 인증을 활성화할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/supabase-doc-auth-overview/1.png)

### 리디렉션 URL 및 와일드카드 {#redirect-urls-and-wildcards}

리디렉션 URL 설정에 대한 가이드는 [여기](https://supabase.com/docs/guides/auth/concepts/redirect-urls)를 참조한다.

- [Netlify 미리보기 URL](https://supabase.com/docs/guides/auth/concepts/redirect-urls#netlify-preview-urls)
- [Vercel 미리보기 URL](https://supabase.com/docs/guides/auth/concepts/redirect-urls#vercel-preview-urls)
- [모바일 딥 링킹 URI](https://supabase.com/docs/guides/auth/concepts/redirect-urls#mobile-deep-linking-uris)

## 권한 부여 {#authorization}

데이터베이스 보안을 다룰 때, 특히 중요한 개념 중 하나는 권한 부여(Authorization)다. 권한 부여는 사용자가 인증되었다고 가정할 때, 해당 사용자가 어떤 데이터에 접근하고 어떤 작업을 수행할 수 있는지를 결정하는 과정이다.

일반적으로 애플리케이션 수준에서 권한 부여를 처리하는 경우가 많지만, 이는 몇 가지 문제점을 야기할 수 있다. 예를 들어, 애플리케이션 코드가 복잡해지고, 보안 규칙이 애플리케이션 로직과 혼재되어 유지보수가 어려워질 수 있다. 또한 애플리케이션 수준에서의 권한 부여는 우회될 가능성도 있다.

이러한 문제를 해결하기 위해 PostgreSQL은 **Row Level Security (RLS)** 라는 강력한 기능을 제공한다. RLS를 사용하면 데이터베이스 수준에서 권한 부여 규칙을 정의할 수 있다. 이는 애플리케이션 코드와 분리되어 있어 보안 규칙을 더욱 견고하게 만들어준다.

RLS의 핵심 개념은 '정책(Policy)'이다. 정책은 특정 테이블에 대한 접근 권한을 정의하는 SQL 표현식이다. 예를 들어, 사용자는 자신이 작성한 게시물만 읽을 수 있다는 정책을 설정할 수 있다. 이 정책은 SQL 문으로 표현되므로, 매우 유연하고 강력하다. 복잡한 비즈니스 로직도 SQL로 표현할 수 있다.

정책이 설정되면, 모든 쿼리는 자동으로 이 정책을 따르게 된다. 사용자가 권한이 없는 데이터를 요청하면, 해당 데이터는 쿼리 결과에서 자동으로 제외된다. 이는 개발자가 애플리케이션의 모든 쿼리문에 일일이 권한 부여 로직을 추가할 필요가 없음을 의미한다.

Supabase는 이 RLS 기능을 완벽히 지원한다. Supabase 대시보드에서 간단히 설정할 수 있고, 필요에 따라 SQL로 직접 정책을 작성할 수도 있다.

따라서 애플리케이션에서 세밀한 권한 부여가 필요하다면, Supabase와 PostgreSQL의 RLS 기능을 활용하는 것이 매우 효과적인 방법이 될 수 있다. 이는 애플리케이션의 보안을 향상시키고, 개발 및 유지보수를 단순화하는 데 큰 도움이 될 것이다.

[Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)로 시작할 수 있다.

### Row Level Security {#row-level-security}

인증만으로는 부족하다.

세분화된 권한 부여 규칙이 필요할 때는 PostgreSQL의 [Row Level Security (RLS)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)가 최고다. Supabase를 사용하면 RLS를 쉽게 켜고 끌 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/supabase-doc-auth-overview/2.gif)

### 정책 {#policies}

[정책(Policies)](https://www.postgresql.org/docs/current/sql-createpolicy.html)을 사용하면 데이터베이스 수준에서 접근 제어 규칙을 정의할 수 있다. 이는 애플리케이션 코드에서 권한 부여 로직을 분리하여 보안을 강화하고 유지보수를 용이하게 만든다.

예를 들어, 사용자는 자신의 `user_id` 와 일치하는 행만 읽을 수 있어야 한다는 비즈니스 규칙이 있다고 가정해 보자.

정책을 사용하지 않는다면, 애플리케이션 코드에서 다음과 같이 매 쿼리마다 사용자 ID를 확인해야 한다:

```ts
const loggedInUserId = 'd0714948';
const { data, error } = await supabase
  .from('users')
  .select('user_id, name')
  .eq('user_id', loggedInUserId);

// console.log(data)
// => { id: 'd0714948', name: 'Jane' }
```

이 방법은 몇 가지 문제점이 있다:

1. 모든 쿼리에 동일한 권한 부여 로직을 반복해서 작성해야 한다. 이는 코드를 복잡하게 만들고 유지보수를 어렵게 한다.
2. 개발자가 실수로 권한 부여 로직을 빼먹을 수 있다. 이는 보안 취약점으로 이어질 수 있다.
3. 권한 부여 로직이 애플리케이션 코드에 의존하므로, SQL 주입 공격 등의 위험이 있다.

반면에, PostgreSQL의 정책 기능을 사용하면 이러한 문제를 해결할 수 있다. 예를 들어, 다음과 같은 정책을 정의할 수 있다:

```sql
CREATE POLICY user_policy ON users
FOR SELECT
USING (auth.uid() = user_id);
```

이 정책은 `users` 테이블에 대한 `SELECT` 쿼리에 적용되며, 현재 인증된 사용자의 ID (`auth.uid()`)와 `user_id` 열이 일치하는 행만 반환하도록 제한한다.

정책이 설정되면, 애플리케이션 코드에서는 다음과 같이 권한 부여 로직을 제거할 수 있다:

```ts
const { data, error } = await supabase.from('users').select('user_id, name');

// console.log(data)
// 여전히 => { id: 'd0714948', name: 'Jane' }
```

쿼리 결과는 정책에 의해 자동으로 필터링되므로, 애플리케이션 코드는 간소화되고 잠재적인 보안 문제도 줄어든다.

또한 정책은 SQL로 정의되므로 매우 유연하다. 복잡한 비즈니스 로직도 SQL 표현식으로 나타낼 수 있다. 예를 들어, 사용자는 자신이 속한 조직의 데이터만 볼 수 있다는 등의 규칙을 정의할 수 있다.

이렇게 PostgreSQL의 정책 기능을 활용하면 데이터 접근 제어를 데이터베이스 수준에서 관리할 수 있어, 애플리케이션의 보안과 유지보수성을 크게 향상시킬 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/supabase-doc-auth-overview/3.gif)

### 작동 방식 {#how-it-works}

1. 사용자가 가입한다. Supabase는 `auth.users` 테이블에 새 사용자를 만든다.
2. Supabase는 사용자의 UUID가 포함된 새 JWT를 반환한다.
3. 데이터베이스에 대한 모든 요청도 JWT를 보낸다.
4. Postgres는 JWT를 검사하여 요청을 하는 사용자를 결정한다.
5. 사용자의 UID는 정책에서 행에 대한 접근을 제한하는 데 사용할 수 있다.

Supabase는 Postgres에 `auth.uid()` 라는 특수 함수를 제공하는데, 이 함수는 JWT에서 사용자의 UID를 추출한다. 이것은 정책을 만들 때 특히 유용하다.

## 사용자 관리 {#user-management}

Supabase는 사용자를 인증하고 관리하기 위한 여러 엔드포인트를 제공한다:

- [가입](https://supabase.com/docs/reference/javascript/auth-signup)
- [비밀번호로 로그인](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [비밀번호 없이 로그인 / 일회용 비밀번호(OTP)로 로그인](https://supabase.com/docs/reference/javascript/auth-signinwithotp)
- [OAuth로 로그인](https://supabase.com/docs/reference/javascript/auth-signinwithoauth)
- [로그아웃](https://supabase.com/docs/reference/javascript/auth-signout)

사용자 관리는 대부분의 애플리케이션에서 필수적인 기능이다. 사용자가 애플리케이션에 가입할 때, 해당 사용자를 고유하게 식별할 수 있는 식별자가 필요하다. Supabase는 이를 위해 사용자에게 고유한 ID를 할당한다.

Supabase의 인증 시스템은 `auth.users` 테이블을 사용하여 사용자 정보를 관리한다. 사용자가 가입하면 이 테이블에 새로운 행이 추가되고, 각 사용자에게는 `id` 라는 고유한 식별자가 할당된다. 이 `id` 는 UUID(Universally Unique Identifier) 형식으로, 충돌 가능성이 매우 낮은 랜덤한 문자열이다.

사용자 ID는 인증 시스템의 핵심 요소일 뿐만 아니라, 다른 데이터와 사용자를 연결하는 데에도 사용된다. 예를 들어, 사용자의 프로필 정보를 저장하는 `profiles` 테이블을 생성한다고 가정해 보자. 이 테이블에는 `user_id` 라는 필드를 만들고, 이 필드는 `auth.users` 테이블의 `id` 를 참조하도록 설정할 수 있다.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  -- 기타 프로필 정보 필드...
);
```

이렇게 하면 각 프로필 레코드는 특정 사용자와 연결된다. 이는 관계형 데이터베이스의 기본 개념 중 하나인 외래 키(Foreign Key)를 활용한 것이다.

이 패턴은 `profiles` 테이블뿐만 아니라 사용자와 관련된 모든 데이터에 적용할 수 있다. 예를 들어, 사용자가 생성한 게시물을 저장하는 `posts` 테이블에도 `user_id` 필드를 추가하여 각 게시물의 작성자를 추적할 수 있다.

이렇게 사용자 ID를 중심으로 데이터를 구조화하면 몇 가지 이점이 있다:

1. 데이터 무결성: 외래 키 제약 조건은 잘못된 사용자 ID가 다른 테이블에 삽입되는 것을 방지한다.
2. 쿼리 성능: 적절한 인덱스를 생성하면 사용자 ID를 기반으로 데이터를 효율적으로 검색할 수 있다.
3. 보안: Row Level Security 정책에서 사용자 ID를 활용하여 데이터에 대한 접근을 제어할 수 있다.
4. 데이터 관리: 사용자 계정을 삭제할 때, 관련된 모든 데이터를 쉽게 찾아 삭제할 수 있다.

Supabase는 이러한 패턴을 활용하여 사용자 관리와 관련 데이터 처리를 단순화한다. 개발자는 인증 시스템에서 제공하는 사용자 ID를 활용하여 애플리케이션의 데이터 모델을 설계할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/supabase-doc-auth-overview/4.gif)
