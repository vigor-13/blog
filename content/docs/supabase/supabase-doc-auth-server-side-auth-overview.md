---
title: 서버 사이드 Auth 개요
description:
date: 2024-04-26
tags: [ssr]
references:
  [
    {
      key: 'Supabase 공식 문서',
      value: 'https://supabase.com/docs/guides/auth/server-side/overview',
    },
  ]
---

Next.js, SvelteKit 및 Remix와 같은 서버 사이드 언어 및 프레임워크와 함께 Supabase를 사용할 때는 **사용자 세션을 저장하기 위해 쿠키를 사용하도록 Supabase 클라이언트를 구성**하는 것이 중요하다. 이 프로세스를 가능한 한 단순화하기 위해 `@supabase/ssr` 패키지를 개발했다.

현재 이 패키지는 `beta` 단계다. 사용을 권장하지만 API가 아직 불안정하며 향후 Breaking Change가 있을 수 있다.

## 프레임워크 빠른 시작 가이드 {#framework-quickstarts}

### Next.js

Next.js에서 Supabase를 자동으로 구성하여 클라이언트와 서버 모두에서 사용자와 세션을 사용할 수 있도록 한다.

### SvelteKit

SvelteKit에서 Supabase를 자동으로 구성하여 클라이언트와 서버 모두에서 사용자와 세션을 사용할 수 있도록 한다.

:::note
현재 [Auth Helpers 패키지](https://github.com/supabase/auth-helpers)를 사용 중인 경우 문서는 계속 사용할 수 있지만, 앞으로는 새로운 `@supabase/ssr` 패키지로 마이그레이션할 것을 권장한다.
:::
