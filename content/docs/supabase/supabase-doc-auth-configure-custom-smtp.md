---
title: 커스텀 SMTP 설정
description:
date: 2024-04-27
tags: [auth, smtp]
references:
  [
    {
      key: 'Supabase 공식 문서',
      value: 'https://supabase.com/docs/guides/auth/auth-smtp',
    },
  ]
---

## Auth SMTP {#auth-smtp}

- **기본 이메일 서비스의 제한**
  - Supabase는 기본적으로 시간당 최대 3개의 이메일만 전송할 수 있다. 이는 초기 단계에서 서비스를 무료로 사용해볼 수 있도록 하기 위한 제한이다. 그러나 프로덕션 환경에서는 이 제한 때문에 문제가 발생할 수 있다.
- **기본 서비스의 지속성 검토**
  - Supabase는 기본 이메일 서비스를 최선을 다해 제공하고 있지만, 서비스 지속 여부는 정기적인 사용량 검토 후에 결정된다. 과도한 사용량이 발생하면 기본 서비스를 중단할 수 있다. 따라서 프로덕션 환경에서는 기본 서비스에 의존하지 않는 것이 좋다.
- **커스텀 SMTP 서비스의 필요성**
  - 프로덕션 환경으로 나아가면서 이메일 전송 요구사항이 증가할 것이다. 이때 커스텀 SMTP 서비스를 사용하면 시간당 전송 이메일 수를 직접 설정할 수 있어 제한을 극복할 수 있다.
- **커스텀 SMTP 서비스의 이점**
  - 커스텀 SMTP 서비스는 단순히 전송 제한을 늘리는 것 외에도 다음과 같은 이점이 있다:
    - _전송 성공률 및 평판 관리_: 이메일 전송 성공률을 높이고, 스팸 메일로 간주되지 않도록 관리할 수 있다.
    - _확장성_: 트래픽 증가에 따라 서비스를 쉽게 확장할 수 있다.
    - _분석 및 추적_: 이메일 전송에 대한 상세한 분석과 추적이 가능하다.
    - _컴플라이언스 및 스팸 방지 조치_: 이메일 전송 규정을 준수하고, 스팸 메일 전송을 방지할 수 있다.

따라서 Supabase의 기본 이메일 서비스는 초기 단계에서는 유용하지만, 프로덕션 환경에서는 커스텀 SMTP 서비스를 사용하는 것이 바람직하다. 이를 통해 이메일 전송 제한을 극복하고, 다양한 추가 기능을 활용할 수 있다.

## SMTP 설정 방법 {how-to-set-up-smtp}

[Auth 설정 페이지](https://supabase.com/dashboard/project/_/settings/auth)로 이동하여 SMTP 프로바이더 섹션에서 "Enable Custom SMTP"를 클릭한다.

아래 필드에 SMTP 프로바이더로부터 받은 관련 정보를 입력한다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/supabase-doc-auth-configure-custom-smtp/1.png)

## 이메일 전송 제한 업데이트 방법 {#how-to-update-email-rate-limits}

커스텀 SMTP 프로바이더를 추가한 후, [Auth > Rate Limits](https://supabase.com/dashboard/project/_/auth/rate-limits)로 이동하여 이메일 전송 제한을 설정할 수 있다.

### SMTP 프로바이더 {#smtp-providers}

Supabase Auth에서는 원하는 주요 SMTP 프로바이더를 사용할 수 있다. 고려해볼 만한 SMTP 프로바이더로는 다음이 있다:

- [Twilio SendGrid](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)
- [AWS SES](https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html)
- [Resend](https://resend.com/docs/dashboard/emails/introduction)
