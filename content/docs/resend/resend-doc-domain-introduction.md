---
title: 도메인 개요
description: Resend 대시보드에서 모든 도메인 확인하기
date: 2024-04-28
tags: [domain]
references:
  [
    {
      key: 'Resend 공식 문서',
      value: 'https://resend.com/docs/dashboard/domains/introduction',
    },
  ]
---

## 도메인이란 {#what-is-a-domain}

도메인은 웹사이트의 주소이자 이메일 주소의 `@` 기호 뒷부분에 해당하는 고유한 식별자다. 예를 들어, "example.com"은 도메인이다. 이 도메인을 사용하여 "info@example.com"과 같은 이메일 주소를 만들 수 있다.

도메인 인증은 이메일 서비스 제공자(ESP)가 사용자를 대신하여 이메일을 보내는 것을 허용하는 프로세스다. 이는 사용자의 도메인 평판을 보호하고, 이메일이 스팸으로 분류되는 것을 방지하며, 이메일 전송 능력을 향상시키는 데 필수적이다.

도메인 인증을 위해서는 도메인의 DNS(Domain Name System) 설정에 특정 레코드를 추가해야 한다. 이러한 DNS 레코드는 ESP에게 사용자를 대신하여 이메일을 보낼 수 있는 권한을 부여한다. 대표적인 DNS 레코드로는 SPF(Sender Policy Framework)와 DKIM(DomainKeys Identified Mail)이 있다.

- `SPF` 레코드는 사용자의 도메인을 대신하여 이메일을 보낼 수 있는 IP 주소 목록을 지정한다. 이를 통해 수신자는 이메일이 승인된 서버에서 전송되었는지 확인할 수 있다.
- `DKIM` 레코드는 이메일에 디지털 서명을 추가하여 이메일의 진위를 검증한다. 이는 이메일 내용이 전송 중에 변경되지 않았으며, 실제로 지정된 도메인에서 전송되었음을 보장한다.

사용자가 ESP에 도메인을 추가하고 필요한 DNS 레코드를 설정하면, ESP는 해당 레코드의 존재를 확인하여 도메인 인증을 완료한다. 인증이 완료되면 사용자는 해당 도메인을 사용하여 이메일을 전송할 수 있게 된다.

따라서 도메인 인증은 이메일 전송의 신뢰성과 전송 능력을 보장하는 데 있어 필수적인 단계다. 이를 통해 사용자는 자신의 도메인 평판을 보호하고, 이메일이 의도한 수신자에게 전달될 가능성을 높일 수 있다.

## 도메인 세부 정보 보기 {#view-domain-details}

도메인 이름, 인증 상태 및 기록에 대한 정보를 확인할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-domain-introduction/1.png)

## SPF 레코드란 {#what-are-spf-records}

**Sender Policy Framework (SPF)** 는 이메일 스푸핑을 방지하고 이메일 인증을 개선하기 위해 설계된 이메일 인증 표준이다. SPF를 사용하면 도메인 소유자는 자신의 도메인을 대신하여 이메일을 보낼 수 있는 IP 주소 목록을 지정할 수 있다.

SPF 구성은 DNS의 TXT 레코드에 정의된다. 이 TXT 레코드에는 해당 도메인에서 이메일을 보낼 수 있는 IP 주소 또는 호스트 이름이 포함된다. 예를 들어, `v=spf1 ip4:192.0.2.0/24 include:example.com ~all` 과 같은 SPF 레코드는 `192.0.2.0/24` IP 범위와 `example.com` 에서 지정한 IP 주소에서 이메일을 보낼 수 있음을 나타낸다.

이메일을 받는 메일 서버는 발신자의 IP 주소를 확인하고, 해당 IP 주소가 발송 도메인의 SPF 레코드에 명시된 IP 주소 목록에 포함되어 있는지 검사한다. 만약 IP 주소가 SPF 레코드에 포함되어 있지 않다면, 해당 이메일은 스팸으로 분류되거나 거부될 수 있다.

SPF 구성에는 보통 해당 도메인의 MX 레코드도 포함된다. MX 레코드는 해당 도메인으로 전송된 이메일을 수신할 메일 서버를 지정한다. 이는 반송 메일과 수신자의 불만 피드백을 처리하는 데 사용된다. 따라서 SPF 레코드에 MX 레코드를 포함시키면, 도메인 소유자는 이메일 전송 문제에 대한 알림을 받을 수 있다.

SPF는 단독으로 사용될 수도 있지만, 보통 DKIM 및 DMARC와 같은 다른 이메일 인증 메커니즘과 함께 사용된다. 이러한 인증 메커니즘을 조합하여 사용하면 이메일 전송의 신뢰성과 보안을 더욱 강화할 수 있다.

SPF를 구현하면 도메인 소유자는 자신의 도메인에서 전송되는 이메일에 대한 통제력을 높일 수 있다. 이는 이메일 스푸핑을 방지하고, 도메인의 평판을 보호하며, 이메일 전송 능력을 향상시키는 데 도움이 된다. 그러나 SPF는 이메일 인증을 위한 완벽한 솔루션은 아니며, 다른 인증 메커니즘과 함께 사용할 때 가장 효과적이다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-domain-introduction/2.png)

## DKIM 레코드란 {#what-are-dkim-records}

**DomainKeys Identified Mail (DKIM)** 은 이메일의 진위성을 확인하고 이메일 스푸핑을 방지하기 위해 설계된 이메일 인증 메커니즘이다. DKIM은 발신자의 도메인에서 이메일에 디지털 서명을 추가하여 작동한다.

DKIM 구성은 DNS의 TXT 레코드에 공개 키를 게시하는 것으로 시작된다. 이 공개 키는 이메일에 첨부된 DKIM 서명을 확인하는 데 사용된다. 예를 들어, `k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHiqFs1WqD5hoYtLmWo1Yiw...` 와 같은 DKIM 레코드는 해당 도메인의 공개 키를 포함한다.

이메일을 보낼 때, 발신자의 메일 서버는 이메일 헤더에 DKIM 서명을 추가한다. 이 서명은 이메일의 특정 부분(일반적으로 헤더와 본문)을 발신자의 개인 키로 암호화한 해시값이다. 개인 키는 공개 키에 대응하며, 발신자만 알고 있다.

이메일을 받는 수신자의 메일 서버는 발신자 도메인의 DNS에서 DKIM 공개 키를 검색한다. 그런 다음 이 공개 키를 사용하여 이메일에 첨부된 DKIM 서명을 확인한다. 서명이 유효하다면, 이메일이 전송 도중 변경되지 않았으며 실제로 해당 도메인에서 전송되었음을 보장한다. 만약 서명이 유효하지 않다면, 이메일은 스팸으로 분류되거나 거부될 수 있다.

_DKIM은 이메일의 내용이 전송 중에 변경되지 않았음을 보장하는 데 도움이 된다._ 또한 수신자가 이메일의 진위를 확인할 수 있게 해주므로, 피싱 및 스팸 이메일을 감지하는 데에도 도움이 된다.

그러나 DKIM은 "From" 주소를 확인하지 않는다. 따라서 DKIM 서명이 유효하더라도 "From" 주소가 스푸핑될 수 있다. 이 문제를 해결하기 위해 DKIM은 종종 SPF 및 DMARC와 같은 다른 이메일 인증 메커니즘과 함께 사용된다.

DKIM을 구현하려면 도메인 소유자가 메일 서버에서 DKIM 서명을 구성하고 DNS에 공개 키를 게시해야 한다. 이 과정은 기술적 전문 지식을 필요로 할 수 있지만, 이메일의 신뢰성과 전송 능력을 크게 향상시킬 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-domain-introduction/3.png)

## 도메인 상태 이해하기 {#understanding-a-domain-status}

도메인은 다음과 같은 다양한 상태를 가질 수 있다:

- `Not Started` : Resend에 도메인을 추가했지만 아직 `DNS 레코드 확인`을 클릭하지 않았다.
- `Pending` : Resend는 여전히 도메인을 확인하려고 시도 중이다.
- `Verified` : 귀하의 도메인은 Resend에서 전송할 수 있도록 성공적으로 인증되었다.
- `Failure` : Resend가 72시간 이내에 DNS 레코드를 감지할 수 없다.
- `Temporary Failure` : 이전에 인증된 도메인의 경우 Resend는 인증에 필요한 DNS 레코드를 주기적으로 확인한다. 어느 시점에서 Resend가 레코드를 감지할 수 없으면 상태가 `Temporary Failure` 로 변경된다. Resend는 72시간 동안 DNS 레코드를 다시 확인하며, 레코드를 감지할 수 없으면 도메인 상태가 `Failure` 로 변경된다. 레코드를 감지할 수 있으면 도메인 상태는 `Verified` 로 변경된다.

## 열기 및 클릭 추적 {#open-and-click-tracking}

기본적으로 모든 도메인에 대해 열기 및 클릭 추적이 비활성화되어 있다. 도메인 설정 내에서 토글을 클릭하여 활성화할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/resend-doc-domain-introduction/4.png)

## 열기 추적이 작동하는 방식 {#how-open-tracking-works}

각 이메일에 1x1 픽셀 투명 GIF 이미지가 삽입되고 이 이미지 파일에 대한 고유한 참조가 포함된다. 이미지가 다운로드되면 Resend는 정확히 어떤 메시지가 열렸고 누구에 의해 열렸는지 알 수 있다.

## 클릭 추적이 작동하는 방식 {#how-click-tracking-works}

클릭을 추적하기 위해 Resend는 HTML 이메일 본문의 각 링크를 수정한다. 수신자가 링크를 열면 Resend 서버로 전송된 후 즉시 URL 대상으로 리디렉션된다.
