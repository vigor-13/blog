---
title: Supabase와 SMTP 연동하기
description: Supabase Auth와 Resend SMTP를 연동하는 방법에 대해 알아본다.
date: 2024-04-29
tags: [supabase]
references:
  [
    {
      key: 'Resend 공식 문서',
      value: 'https://resend.com/docs/send-with-supabase-smtp',
    },
  ]
---

## 사전 준비 사항 {#prerequisites}

이 가이드를 진행하기 위해 다음 사항이 필요하다:

- [API 키 생성하기](https://resend.com/api-keys)
- [도메인 인증하기](https://resend.com/domains)

## 1. Resend SMTP 인증 정보 확인하기 {#get-the-resend-smtp-credentials}

SMTP 연동 설정할 때는 다음 인증 정보를 사용한다:

- **Host**: `smtp.resend.com`
- **Port**: `465`
- **Username**: `resend`
- **Password**: `YOUR_API_KEY`

## 2. Supabase SMTP와 연동하기 {#integrate-with-supabase-smtp}

Supabase 계정에 로그인한 후, SMTP 연동을 활성화해야 한다.

1.  Supabase 프로젝트로 이동한다.
2.  왼쪽 사이드바에서 **Project Settings**을 클릭한다.
3.  **Auth** 탭을 선택한다.
4.  SMTP 섹션을 찾아 **Enable Custom SMTP** 옵션을 토글한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-smtp-supabase/1.png)

활성화되면 Resend에서 SMTP 인증 정보를 복사하여 Supabase에 붙여넣는다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-smtp-supabase/2.png)

그런 다음 **Save** 버튼을 클릭하면 모든 이메일이 Resend를 통해 전송된다.
