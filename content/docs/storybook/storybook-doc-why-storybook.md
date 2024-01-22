---
title: 왜 스토리북인가?
description: 스토리북을 사용해야 하는 이유 알아보기
date: 2024-01-20
tags: []
references:
  [
    {
      key: 'Storybook 공식 문서',
      value: 'https://storybook.js.org/docs/get-started/why-storybook',
    },
  ]
---

## 문제점 {#problem}

웹의 보편성으로 인해 프론트엔드의 복잡성이 더욱 커지고 있다. 그 시작은 반응형 웹 디자인으로, 모든 사용자 인터페이스를 하나에서 10개, 100개, 1000개의 다양한 사용자 인터페이스로 바꾸었다. 시간이 지남에 따라 디바이스, 브라우저, 접근성, 성능, 비동기 상태와 같은 추가적인 요구 사항이 쌓여갔다.

React, Vue, Angular와 같은 컴포넌트 중심 도구는 복잡한 UI를 단순한 컴포넌트로 분해하는 데 도움이 되지만 만능은 아니다. 프론트엔드가 성장함에 따라 컴포넌트의 수도 늘어난다. 성숙한 프로젝트에는 수천 개의 개별 변형(variations)을 생성하는 수백 개의 컴포넌트가 있을 수 있다.

문제를 더욱 복잡하게 만드는 것은 이러한 UI가 비즈니스 로직, 대화형 상태 및 앱 컨텍스트에 얽혀 있기 때문에 디버깅하기가 어렵다는 점이다.

최신 프론트엔드의 광범위한 기능은 기존 워크플로를 압도한다. 개발자는 수많은 UI 변형을 고려해야 하지만 이를 모두 개발하거나 정리할 수 있는 역량을 갖추지 못했다. 결국 UI를 구축하기가 더 어렵고, 작업 만족도가 떨어지며, 깨지기 쉬운 상황에 처하게 된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/storybook-doc-why-storybook/1.png)

## 해결방법 {#solution}

### 독립된 환경에서 UI 빌드 {#isolation-build}

이제 UI의 모든 부분은 컴포넌트다. 컴포넌트의 강력한 장점은 렌더링 방식을 확인하기 위해 전체 앱을 실행할 필요가 없다는 것이다. 프로퍼티를 전달하거나 데이터를 모킹하거나 이벤트를 가짜로 만들어 특정 변형을 따로 렌더링할 수 있다.

스토리북은 앱과 함께 제공되는 소규모 개발 전용 [워크샵(workshop)]()으로 패키징되어 있다. 앱 비즈니스 로직 및 컨텍스트의 간섭 없이 컴포넌트를 렌더링할 수 있는 격리된 iframe을 제공한다. 이를 통해 컴포넌트의 각 변형, 심지어 도달하기 어려운 엣지 케이스까지 개발에 집중할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/storybook-doc-why-storybook/2.gif)

### "스토리"로 UI 버전 캡처 {#ui-capture}

컴포넌트 변형을 단독으로 개발할 때는 스토리로 저장한다. [스토리]()는 컴포넌트 변형을 시뮬레이션하기 위해 프로퍼티와 목업 데이터를 제공하기 위한 선언적 구문이다. 각 컴포넌트는 여러 개의 스토리를 가질 수 있다. 각 스토리를 통해 해당 컴포넌트의 특정 변형을 시연하여 모양과 동작을 확인할 수 있다.

세분화된 UI 컴포넌트 변형을 위한 스토리를 작성한 다음 개발, 테스트 및 문서화에서 해당 스토리를 사용할 수 있다.

```ts
// Histogram.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Histogram } from './Histogram';

const meta: Meta<typeof Histogram> = {
  component: Histogram,
};

export default meta;
type Story = StoryObj<typeof Histogram>;

export const Default: Story = {
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

### 모든 스토리를 추적하는 스토리북 {#storybook-keeps-track-story}

스토리북은 UI 컴포넌트와 그 스토리를 담은 인터랙티브 디렉토리다. 과거에는 앱을 실행하고 페이지로 이동한 다음 UI를 올바른 상태로 조정해야 했다. 이는 엄청난 시간 낭비이며 프론트엔드 개발에 지장을 준다. 스토리북을 사용하면 이러한 단계를 모두 건너뛰고 특정 상태의 UI 컴포넌트 작업으로 바로 이동할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/storybook-doc-why-storybook/3.gif)

## 이점 {#benefits}

컴포넌트에 대한 스토리를 작성하면 여러 혜택을 받을 수 있다.

📝 **내구성이 뛰어난 UI 개발**

컴포넌트와 페이지를 분리하고 사용 사례를 스토리로 추적할 수 있다. 접근하기 어려운 UI의 엣지 케이스를 검토할 수 있다. 애드온을 사용하여 컴포넌트에 필요한 모든 것(컨텍스트, API 요청, 디바이스 기능 등)을 모의 테스트할 수 있다.

✅ **적은 노력으로 오류 없이 UI 테스트하기**

스토리는 UI 상태를 추적하는 실용적이고 재사용 가능한 방법이다. 즉 개발 중에 UI의 스팟 테스트에 사용할 수 있다. 스토리북은 자동화된 [접근성](), [상호 작용]() 및 [시각적]() 테스트를 위한 기본 제공 워크플로를 제공한다. 또는 스토리를 다른 JavaScript 테스트 도구로 가져와서 테스트 케이스로 사용할 수도 있다.

📚 **팀이 재사용할 수 있는 문서 UI**

스토리북은 UI에 대한 신뢰할 수 있는 단일 소스다. 스토리는 모든 컴포넌트와 다양한 상태를 색인화하여 팀이 기존 UI 패턴을 쉽게 찾고 재사용할 수 있도록 한다. 또한 스토리북은 해당 스토리에서 [문서]()를 자동으로 생성한다.

📤 **실제 UI 작동 방식 공유**

스토리는 UI가 어떻게 작동해야 하는지에 대한 그림뿐 아니라 실제로 어떻게 작동하는지를 보여준다. 이를 통해 모든 사람이 현재 프로덕션에 대해 일관성을 유지할 수 있다. 스토리북을 게시하여 팀원들의 승인을 받아보자. 또는 위키, 마크다운, 피그마에 스토리북을 삽입하여 협업을 간소화할 수도 있다.

🚦 **UI 워크플로 자동화하기**

스토리북은 CI 워크플로와 호환된다. CI 단계에 추가하여 사용자 인터페이스 테스트를 자동화하고, 팀원들과 함께 구현을 검토하고, 이해 관계자의 서명을 받을 수 있다.

## 한 번 작성하면 어디서나 재사용 가능한 스토리 {#reusable-stories}

스토리북은 자바스크립트 ES6 모듈에 기반한 개방형 표준인 [컴포넌트 스토리 포맷(Component Story Format)]()으로 구동된다. 이를 통해 개발, 테스트, 디자인 도구 간에 스토리를 상호 운용할 수 있다. 각 스토리는 JavaScript 함수로 내보내어 다른 도구에서 재사용할 수 있다. 특정 벤더에 종속되지 않는다.

[Jest](https://jestjs.io/) 및 [Testing Library](https://testing-library.com/)와 함께 스토리를 재사용하여 상호 작용을 검증해보자. 시각적 테스트를 위해 [크로매틱(Chromatic)](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)에 넣어보자. [Axe](https://github.com/dequelabs/axe-core)로 스토리 접근성을 감사해보자. 또는 [Playwright](https://playwright.dev/) 와 [Cypress](https://www.cypress.io/)로 사용자 흐름을 테스트하라. 재사용을 통해 추가 비용 없이 더 많은 워크플로를 활용할 수 있다.
