---
title: 디자인 시스템 - 확장하기
description:
date: 2024-01-25
tags: [design_system, atomic_design, design_token]
references:
  [
    {
      key: 'Brad Frost Blog',
      value: 'https://bradfrost.com/blog/post/extending-atomic-design/',
    },
  ]
---

![https://bradfrost.com/blog/post/extending-atomic-design/](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-extension/1.jpg)

2013년 아토믹 디자인이 소개된 이래 많은 팀들이 디자인 시스템을 프로젝트에 적용하기 시작했다. 여러 사례들이 생겨났고 그중에는 다른 개념들과 아토믹 디자인을 함께 사용하는 경우도 있었다. 이 글은 이렇게 다른 개념들과 아토믹 시스템을 어떻게 상호작용하여 확장하는지 알아본다.

## 디자인 토큰: 아토믹 디자인의 아원자 입자(sub atomic particles) {#design-token}

디자인 시스템을 확장한 대표적인 사례는 [디자인 토큰]()이다. 디자인 토큰은 여러 플랫폼에서 디자인 속성을 공유하는 데 도움이 된다.

> 디자인 토큰은 타이포그래피, 색상 및 간격과 같은 변수를 저장하는 독립적인 방법으로, 디자인 시스템을 iOS, Android 및 일반 웹사이트와 같은 플랫폼에서 공유할 수 있다.

기존의 아토믹 디자인에 디자인 토큰을 적용하려면 어떻게 해야 할까? 먼저 그림으로 표현하자면 다음과 같다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-extension/2.png)

> UI의 세계에서 디자인 토큰은 아원자 입자다. 디자인 토큰 색상인 color-brand-blue는 UI의 핵심 요소이지만, 그 자체만으로는 기능하지 않는다. 버튼의 배경색과 같은 '원자'에 적용되어야만 살아 움직일 수 있다. - Brad Frost -

즉 원자 컴포넌트에서 한 단계 더 요소를 분리한 개념이다.

## ions, quarks, 그리고 다른 레이어 {#other-layer}

디자인 토큰외에도 다른 여러 레이어를 디자인 시스템에 추가하여 구성할 수 있다.

> 아토믹 디자인은 그 범위가 제한되어 있기 때문에 많은 것을 명시적으로 다루지 않는다. 아토믹 디자인에서 모션은 어떻게 처리할까? 흐름? 페르소나? 비즈니스 요구사항? A/B 테스트? 로컬라이제이션? 테스트? - Brad Frost -

아토믹 디자인 시스템에서 다루지 않는 부분은 확장하여 사용할 수밖에 없다. 크리스 시드는 [이온](https://www.cjcid.com/essays/ions-introduction/)이라는 개념을 사용하여 아토믹 디자인 시스템을 확장했다.

> 이온은 모든 컴포넌트가 가질 수 있는 다양한 속성을 관리할 수 있는 저장소다.

이런 식으로 시스템을 확장하는 것은 좋은 방법이다.

## 네이밍 {#naming}

앞서 살펴본 확장의 사례에서 주목해야 할 점은 **네이밍**이다.

> "아토믹 디자인"라는 유행어는 모듈식 설계 및 개발의 개념을 요약한 것으로, 이해관계자를 설득하고 동료와 대화할 때 유용한 약어가 된다. 하지만 아토믹 디자인은 딱딱한 도그마가 아니다. 궁극적으로, 어떤 분류법을 선택하든 여러분과 조직이 더 효과적으로 소통하여 멋진 UI 디자인 시스템을 구축하는 데 도움이 될 것이다. - Brad Frost -

자유롭게 시스템을 확장하고 팀원들이 이해하기 쉽도록 적절한 네이밍을 하는 것이 좋다. 아토믹 디자인 시스템의 네이밍을 규칙을 절대적으로 따른 필요는 없다.
