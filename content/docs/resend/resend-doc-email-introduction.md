---
title: 이메일 개요
description: Resend 대시보드에서 모든 이메일 확인하기.
date: 2024-04-28
tags: []
references:
  [
    {
      key: 'Resend 공식 문서',
      value: 'https://resend.com/docs/dashboard/emails/introduction',
    },
  ]
---

## 이메일 세부 정보 보기 {#view-email-details}

발신자 주소, 수신자 주소, 제목 등을 포함한 이메일과 관련된 모든 메타데이터를 확인할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-email-introduction/1.png)

또한 HTML 또는 일반 텍스트로 된 이메일 내용도 볼 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-email-introduction/2.png)

## 이메일 이벤트 이해하기 {#understand-email-events}

이메일과 관련된 모든 이벤트는 다음과 같다:

- `Sent` - API 요청이 성공적이었고 Resend가 수신자의 메일 서버에 메시지 전달을 시도한다.
- `Delivered` - Resend가 수신자의 메일 서버에 이메일을 성공적으로 전달했다.
- `Delivery Delayed` - 일시적인 문제가 발생하여 수신자의 메일 서버에 이메일을 전달할 수 없다. 예를 들어 수신자의 받은 편지함이 꽉 찼거나 수신 이메일 서버에 일시적인 문제가 발생했을 때 배달 지연이 발생할 수 있다.
- `Complained` - 이메일이 수신자의 메일 서버에 성공적으로 전달되었지만 수신자가 스팸으로 표시했다.
- `Bounced` - 수신자의 메일 서버가 이메일을 영구적으로 거부했다.

## 이메일 링크 공유하기 {#share-email-link}

이메일의 공개 링크를 생성하여 누구에게나 공유할 수 있다. 이렇게 하면 Resend 계정이 없는 사람들도 해당 이메일의 내용을 확인할 수 있다.

링크를 공유하는 방법은 간단하다. 드롭다운 메뉴에서 "Share email"를 선택한 후,

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-email-introduction/3.png)

생성된 URL을 복사하여 팀 구성원들에게 전달하기만 하면 된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-email-introduction/4.png)

공유 받은 사람은 링크를 클릭하는 것만으로 별도의 인증 절차 없이 이메일 전문을 확인할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-email-introduction/5.png)

## 관련 로그 보기 {#see-associated-logs}

이메일과 관련된 모든 로그를 확인할 수 있다. 이를 통해 요청 자체의 모든 문제를 해결할 수 있다.

로그를 보려면 드롭다운 메뉴를 클릭하고 "View log"를 선택한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-email-introduction/6.png)

그러면 이메일과 관련된 모든 로그를 볼 수 있는 로그 화면으로 이동한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-email-introduction/7.png)
