---
title: 디자인 시스템 - 패턴 라이브러리
description: 아토믹 디자인 - 패턴 라이브러리 개념 정리
date: 2024-01-11
tags: [design_system, atomic_design, storybook]
references:
  [
    {
      key: 'Brad Frost - Atomic Design',
      value: 'https://atomicdesign.bradfrost.com/',
    },
  ]
---

:::note
이 글은 Brad Frost의 Atomic Design을 내 나름의 방식으로 정리한 글이다. 아토믹 디자인이 소개된 지 많은 시간이 흘렀기 때문에 다들 익숙한 개념이겠지만 정리를 위해서 다시 한번 내용을 상기해 보고자 한다.
:::

## 패턴 라이브러리란?

앞서 아토믹 디자인에 대한 이론을 살펴봤으니 이제 실제 구현 사례를 알아볼 차례다.

아토믹 디자인은 인터페이스를 여러 계층(패턴)으로 나누어 개발하는 시스템이다. 이렇게 분할되어 작동하는 시스템을 효과적으로 관리하기 위해서는 반드시 **중앙 집중형 허브**가 필요하다. 저자는 이 것을 **패턴 라이브러리**라고 정의 한다.

:::note 패턴 라이브러리의 장점

- 전체 경험에 걸쳐 일관성과 응집력을 촉진한다.
- 팀의 워크플로 속도를 높여 시간과 비용을 절약할 수 있다.
- 프로젝트에 관련된 모든 분야 간에 보다 협업적인 워크플로우를 구축한다.
- 외부 공급업체를 포함하여 조직의 모든 구성원 간에 공유된 용어를 확립한다.
- 이해관계자, 동료, 심지어 제3자를 교육하는 데 도움이 되는 유용한 문서를 제공한다.
- 브라우저/기기 간, 성능 및 접근성 테스트를 더 쉽게 만든다.
- 또한 시간이 지남에 따라 팀이 수정, 확장 및 개선할 수 있는 미래 지향적인 기반 역할을 한다.

:::

Brad Frost는 패턴 라이브러리의 특성을 반영하여 [Patter Lab](https://patternlab.io/)이라는 오픈소스 라이브러리를 구현했다.

![Pattern Lab](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/1.png =80%x)

> 웹 개발자 Dave Olsen, Brian Muenzenmeyer와 내가 아토믹 디자인 시스템을 실행하기 위해 유지 관리하는 오픈 소스 프로젝트인 Pattern Lab이라는 도구를 통해 효과적인 패턴 라이브러리의 특성에 대해 이야기하겠다. Pattern Lab과 그 다양한 기능에 대해 흥미롭게 논의하겠지만, _이 장의 핵심은 잘 구성된 패턴 라이브러리의 특성을 다루는 것이지 특정 도구를 소개하는 것이 아니라는 점을 강조하고 싶다._ 사실 Pattern Lab은 판매용도 아니다! 하나의 도구가 모든 설정과 시나리오에 완벽하게 맞을 수는 없지만, 패턴 라이브러리를 만드는 데 사용할 도구를 결정할 때 다음 원칙을 염두에 두어야 한다. - Atomic Design -

:::tip Storybook과 패턴 라이브러리

2024년 현재는 [스토리북(Storybook)](https://storybook.js.org/)이 대표적인 패턴 라이브러리 구현체로 사용되고 있다.

> 2013년부터 프론트엔드 워크샵 환경에서 아토믹 디자인 시스템을 구축해왔는데, 그 시작은 내가 만든 Pattern Lab이라는 도구였다. 기술 환경이 변화하고 JS 에코시스템이 폭발적으로 성장하면서 스토리북은 패턴 랩에서 시작한 작업을 자연스럽게 계승하게 되었다. 구체적인 프레임워크는 바뀌었지만(그리고 지금도 계속 바뀌고 있다!), 내가 여기서 다룬 개념과 아키텍처는 매우 견고하게 유지되고 있다. - [atomic design and storybook](https://bradfrost.com/blog/post/atomic-design-and-storybook/) -

:::

## 패턴 랩(Pattern Lab)이란?

패턴랩의 구체적인 작동 방식을 살펴보기 전에 패턴 랩이 무엇인지 알아봐야 한다.

| ✅ 패턴 랩 이란?                                      | ❌ 패턴 랩의 특성이 아닌 것                   |
| ----------------------------------------------------- | --------------------------------------------- |
| 아토믹 디자인 시스템 구축을 위한 "정적 사이트 생성기" | Bootstrap이나 Ant Design과 같은 UI 프레임워크 |
| 문서화 및 주석 도구                                   | 언어나 라이브러리 또는 스타일에 대한 의존성   |
| 패턴 스타터 키트                                      | 콘텐츠 관리 시스템                            |

패턴 랩은 시스템이 원활하게 작동할 수 있도록 도움을 주는 가이드라인의 역할을 할 뿐이다. Ant Design과 같은 UI 컴포넌트 라이브러리나 어떤 기술을 말하는 것이 아니다. 물론 콘텐츠를 관리하기 위한 시스템도 아니다. 이러한 것들은 실제 개발자와 팀 구성원들의 몫이다.

> 패턴 랩은 프런트엔드 코드를 디자인하거나 설계하는 방법에 대한 어떠한 답변도 제공하지 않는다. 이 모든 작업은 여러분이 직접 수행해야 한다. 룩앤필, 명명 규칙, 구문, 구조, 라이브러리 및 스크립트는 여러분과 여러분의 팀에게 달려 있다. 게다가, 패턴 랩 내에서 Bootstrap과 같은 UI 프레임워크를 사용할 수도 있다. _패턴 랩은 모든 것을 조합하는 데 도움을 주는 도구일 뿐이다._ - Atomic Design -

## 패턴 라이브러리에서 제공해야 하는 구체적인 기능들

:::note
Atomic Design 원문에서는 여기서부터 패턴 랩에 대한 실제 사용법 설명에 대한 내용이 주를 이룬다. 하지만 앞서 언급했듯이 현재는 스토리북이 패턴랩을 대체한 상황이다. 따라서 관련 내용을 요약하여 스토리북과 연결지어 볼 것이다.
:::

패턴라이브러리에 제공해야 하는 기능들은 다음과 같다.

- [ ] 컴포넌트의 표현
  - [ ] 컴포넌트를 조합하여 사용할 수 있는 수단을 제공할 것
  - [ ] 컴포넌트에 동적으로 데이터를 제공할 수 있을 것
  - [ ] 컴포넌트의 변형을 표현할 수 있을 것
- [ ] 컴포넌트의 문서화
  - [ ] 뷰포트에 따른 해상도 스펙트럼 제공
  - [ ] 실제 코드 제공
  - [ ] 문서 및 주석 제공

위의 사항들은 모두 스토리북과 프론트엔드 프레임워크(리액트, 뷰, 스벨트 등...)를 사용하여 구현할 수 있다.

그럼 하나씩 살펴보자

### 컴포넌트 표현하기

#### 컴포넌트 조합하여 사용하기(= 패턴 라이브러리에서 아토믹 디자인 시스템 구현하기)

아토믹 디자인 시스템은 여러가지 방법으로 구현할 수 있다. Atomic Design의 원문을 살펴보면 패턴 랩은 [Mustache](https://mustache.github.io/)의 `include`를 사용하여 시스템을 구현한 것을 볼 수 있다.

예를 들면 다음과 같다.

![block-post 분자 컴포넌트](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/2.png =60%x)

위의 이미지와 같은 분자 컴포넌트를 다음과 같은 코드로 표현할 수 있다.

```mustache
{% raw %}<div class="block-post">
  <a href="{{ url }}">
      {{> atoms-thumb }}
      <h3>{{ headline }}</h3>
      <p>{{ excerpt }}</p>
  </a>
</div>{% endraw %}
```

스토리북에서는 React, Vue, Angular 등 다양한 옵션을 지원하므로 원하는 것을 사용하면 된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/3.png =70%x)

위의 예제를 React로 표현하지면 다음 정도로 표현할 수 있을 것이다.

```jsx
<BlockPost href={url}>
  <Thumb />
  <Headline />
  <Excerpt />
</BlockPost>
```

이렇게 놓고 보니 제목에는 "아토믹 디자인 시스템 구현하기"라고 표현했지만 사실 "React 사용하기"라고 봐도 무방하다.

#### 컴포넌트에 데이터 제공하기

패넡 라이브러리는 컴포넌트에 실제 데이터를 넣어서 확인할 수 있는 기능을 제공해야한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/5.png =70%x)

패턴 랩에서는 `json` 파일을 만들어서 컴포넌트에 데이터를 연결한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/4.png =70%x)

```json
// 00-homepage.json
"hero" : {
  "headline": "Moving People",
  "img": {
    "src": "/images/hero_beyonce.jpg",
    "alt": "Beyonce"
  }
}
```

스토리북에서도 여러가지 방식으로 데이터를 컴포넌트에 제공할 수 있다. 목업 데이터가 포함된 스토리를 직접 만들 수도 있고 간단한 리덕스 스토어를 만들어서 추가할 수도 있다.

:::note
자세한 내용은 [스토리북 - 데이터 연결하기](https://storybook.js.org/tutorials/intro-to-storybook/react/ko/data/)를 참조하라
:::

#### 컴포넌트의 변형 표현하기

컴포넌트는 변수에 따라 여러가지 다양한 변형(variation)을 갖는다. 패턴 라이브러리는 이러한 변형을 표현할 수 있어야 한다.

예를 들어 보통 관리자 권한이 있는 유저와 일반 유저는 UI 상으로 많이 차이가 발생한다.

![권한에 따른 대시보드 UI의 변형](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/6.png =80%x)

패턴 랩에서 위의 기본 대시보드 컴포넌트의 데이터는 다음과 같다.

```json
// dashboard.json
"collaborators" : [
  {
    "img": "/images/sample/avatar1.jpg",
    "name" : "Steve Boomshakalaka",
    "title" : "CIA"
  },
  {
    "img": "/images/sample/avatar2.jpg",
    "name" : "Gingersnap Jujubees-Daniels",
    "title" : "President of the Longest Company Name in the World Corporation, Global Division"
  },
  {
    "img": "/images/sample/avatar3.jpg",
    "name" : "Sarunus Marciulionis",
    "title" : "Golden State Warriors"
  },
  {
    "img": "/images/sample/avatar4.jpg",
    "name" : "Sara Smith",
    "title" : "Short Title"
  }
]
```

관리자 대시보드의 데이터의 변형을 표현하기 위해서 `~` 기호를 사용하여 `dashboard~admin.json` 파일을 사용한다. `~` 기호를 사용하면 데이터를 상속하고 새로운 데이터를 추가할 수 있다.

```json
// dashboard~admin.json
"isAdmin": true
```

`dashboard~admin.json` 에 연결된 컴포넌트는 이제 `isAdmin` 데이터를 사용할 수 있다.

```mustache
{% raw %}<div class="block">
  <img src="{{ img }}" alt="{{ name }}" />
  <h3>{{ name }}</h3>
  <h4>{{ title }}</h4>
  {{# isAdmin }}
  {{> molecules-block-actions }}
  {{/ isAdmin }}
</div>{% endraw %}
```

스토리북에서는 더 쉽고 간단하게 컴포넌트의 변형을 표현한다. 예를 들면 다음과 같다. (자세한 내용은 [문서](https://storybook.js.org/docs/writing-stories/args)를 참조한다)

```tsx
// Button.stories.tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const PrimaryLongName: Story = {
  args: {
    ...Primary.args,
    label: 'Primary with a really long name',
  },
};
```

addon을 사용하여 실시간으로 사용자가 변형을 컨트롤할 수도 있다.

![Control addon](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/7.png)

### 컴포넌트 문서화하기

패턴 라이브러리는 컴포넌트의 문서화를 위해서 다음과 같은 기능들을 제공해야 한다.

#### 뷰포트

패턴 랩에서는 `ish` 라는 도구를 통해서 해상도의 스펙트럼에 따른 UI 정보를 제공한다.

> 초기의 많은 반응형 디자인 테스트 도구는 320픽셀(아이폰 4 세로 모드), 480픽셀(아이폰 4 가로 모드), 768픽셀(아이패드 세로 모드) 등 널리 사용되는 모바일 디바이스 너비에서 디자인을 보는 데 중점을 두었다. 물론 웹은 모바일 뷰, 태블릿 뷰, 데스크톱 뷰보다 훨씬 더 다양하다. 디자이너가 반응형 디자인을 테스트할 때 전체 해상도 스펙트럼을 더 잘 고려할 수 있도록 ish라는 도구를 만들었다. - Atomic Design -

:::tabs

@tab:active small-ish#small

![small-ish](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/8.png)

@tab medium-ish#medium

![medium-ish](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/9.png)

@tab large-ish#large

![large-ish](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/10.png)

:::

스토리북에서는 addon으로 뷰포트를 조절할 수 있는 기능을 제공한다.

![Storybook Viewport Addon](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/11.png)

자세한 내용은 [공식 문서](https://storybook.js.org/docs/essentials/viewport)를 확인한다.

#### 코드뷰

패턴 라이브러리의 가장 기본적인 기능 중 하나는 컴포넌트의 기본 코드를 확인할 수 있는 기능이다. 조직마다 컴포넌트 구현에 사용하는 스펙이 다르기 때문에 코드를 어떻게 보여줄지는 상황마다 다르다.

> 패턴 라이브러리에서 강조할 코드의 유형은 조직마다 자연스럽게 다양하며 다양한 환경, 기술 및 규칙을 충족하기 위한 것이다. 대부분의 패턴 라이브러리는 패턴의 기본 HTML을 보여주며, 다른 패턴은 패턴별 CSS와 JavaScript도 포함한다. 예를 들어 Salesforce의 Lightning 디자인 시스템은 패턴의 HTML뿐만 아니라 해당 패턴과 관련된 모든 (S)CSS를 보여준다. - Atomic Design -

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/12.png)

다른 회사에서는 직접적인 코드 대신 `include` 코드를 제공하는 곳도 있다고 한다.

> 론리 플래닛의 Rizzo 스타일 가이드는 HTML과 CSS를 제공하는 대신 팀이 적절한 UI 컴포넌트를 가져올 수 있도록 include 코드를 표시한다. - Atomic Design -

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/13.png)

스토리북에서 **Autodocs** 기능을 사용하면 스토리북이 컴포넌트 스토리를 참조하여 자동으로 문서를 생성한다. 이떄 `Show code` 버튼으로 코드를 확인할 수 있다.

![](https://storybook.js.org/662efcf083cd7f9ad4ed84f2db61cf5c/doc-block-canvas.png)

#### 문서화

이전의 프로세스에서는 많은 문서들이 대용량 PDF의 형식으로 관리되면서 프로젝트와 동떨어져 점차 잊혀지는 경우가 많았다고 한다. 이러한 문서는 디자인 시스템과 관련된 많은 인사이트와 지침들을 포함하기에 반드시 관리가 되어야 한다.

> UI의 문서에는 UI를 만드는 데 관련된 모든 분야의 인사이트가 포함되어야 하며, 살아 숨 쉬는 디자인 시스템에 반영되어야 한다. 효과적인 패턴 라이브러리는 UI 컴포넌트를 정의하고 설명할 수 있는 공간을 마련하여 접근성부터 성능, 미학에 이르기까지 다양한 고려 사항을 명확하게 표현한다. - Atomic Design -

패턴 랩에서는 마크다운 형식과 컴포넌트 내부의 주석을 사용하여 문서가 시스템에 반영될 수 있도록 한다.

> 패턴 랩은 디자인 시스템에 패턴 설명과 주석을 추가하는 여러 가지 방법을 제공한다. 패턴 설명은 패턴 이름에 해당하는 마크다운 파일을 생성하여 추가할 수 있다(예: pattern-name.md). 그러면 라이브러리 목록 뷰에서 패턴 설명을 볼 수 있다. - Atomic Design -

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/14.png)

스토리북도 물론 문서화 기능을 제공한다.

기본적으로 컴포넌트의 메타데이터를 기반으로한 자동 생성 문서를 사용할 수 있고 MDX, Doc Blocks를 사용하여 더 확장된 문서 포맷을 사용할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-pattern-library/15.png)

자세한 내용은 [공식 문서](https://storybook.js.org/docs/writing-docs)를 확인한다.

## 정리

지금까지 아토믹 디자인과 패턴 라이브러리에 대한 개념을 알아봤다. 요약을 한다고 했는데도 적지 않은 양이 되었다. 하지만 결론은 간단하다. UI를 일정 단위로 나누어 설계하고 라이브러리화하여 사용하자는 것이다.
