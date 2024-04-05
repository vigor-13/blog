---
title: 제한 사항
description:
date: 2024-04-05
tags: []
references:
  [
    {
      key: 'React Navigation 공식 문서',
      value: 'https://reactnavigation.org/docs/limitations',
    },
  ]
---

라이브러리의 사용자로서 무엇을 할 수 있고 할 수 없는지 아는 것이 중요하다. 이에 대한 지식을 가지고 있다면 대신 [`react-native-navigation`](https://github.com/wix/react-native-navigation) 과 같은 다른 라이브러리를 채택할지 결정할 수 있다. 우리는 [pitch & anti-pitch](https://reactnavigation.org/docs/pitch) 섹션에서 높은 수준의 설계 결정에 대해 논의했고, 여기서는 지원되지 않거나 너무 어려워서 사실상 불가능한 사용 사례에 대해 다룰 것이다. 다음 제한 사항 중 어느 하나라도 당신의 앱에 결정적인 것이라면 React Navigation은 적합하지 않다.

## 제한적인 Right-to-Left(RTL) 레이아웃 지원 {#limited-right-to-left-RTL-layout-support}

React Navigation에서는 RTL 레이아웃을 적절히 처리하려고 노력하지만, React Navigation을 개발하는 팀의 규모가 작아서 현재로서는 모든 변경사항을 RTL 레이아웃에 대해 테스트할 수 있는 대역폭이나 프로세스가 없다. 따라서 RTL 레이아웃에서 문제가 발생할 수 있다.

:::note RTL(Right-to-Left) 레이아웃
RTL(Right-to-Left) 레이아웃이란 문자를 오른쪽에서 왼쪽으로 배치하는 문화권(아랍어, 히브리어 등)에서 사용하는 레이아웃 방식을 말한다.
:::

## 일부 플랫폼 특정 동작 {#some-platform-specific-behavior}

React Navigation에는 3D 터치 가능 기기에서 사용할 수 있는 Peek & Pop 기능에 대한 지원이 포함되어 있지 않다.
