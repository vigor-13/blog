---
title: 디자인 시스템 - 컴포넌트 레이어
description:
date: 2024-01-24
tags: [design_system, atomic_design]
references:
  [
    {
      key: 'Brad Frost Blog',
      value: 'https://bradfrost.com/blog/post/design-system-components-recipes-and-snowflakes/',
    },
  ]
---

## 컴포넌트 계층 {#component-layer}

현대 웹 애플리케이션은 컴포넌트 단위로 구성된다. 모든 것은 컴포넌트다. 단순한 이야기 같지만 컴포넌트를 디자인 시스템으로 관리하는 경우 상황은 달라진다. 개별 애플리케이션의 모든 컴포넌트를 하나의 시스템으로 통합시키는 것은 비효율적이기 때문이다.

컴포넌트를 여러 계층으로 분리할 필요가 있다. 물론 [아토믹 디자인에서는 컴포넌트를 5가지 계층으로 나누었다](https://www.vigorously.xyz/posts/design-system-atomic-design/). 이것은 애플리케이션을 어떻게 컴포넌트 단위로 세분화할 수 있는지에 대한 고찰이지 디자인 시스템 내에서 컴포넌트가 어디에 위치해야 하는지를 말하는 것은 아니다. 이 글에서 말하고자 하는 것은 시스템 내에서 컴포넌트의 **위치**다.

Brad Frost가 제시하는 컴포넌트의 위치를 결정하기 위해서 다음과 같은 계층 구조를 제시한다.

![https://bradfrost.com/blog/post/design-system-components-recipes-and-snowflakes/](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-layer-cake/1.png)

### 디자인 시스템 컴포넌트 {#design-system-components}

**재사용성을 극대화**하기 위한 공유 컴포넌트 집합이다. 콘텐츠와 컨텍스트에 구애받지 않는다. `Accordian` , `Button`, `Card`, `Select`, `Table` 과 같은 컴포넌트들을 말한다. 오픈소스 컴포넌트 라이브러리들이 여기에 해당한다.

### 레시피 컴포넌트 {#recipes-components}

하나의 애플리케이션 내에서는 재사용 가능하지만 디자인 시스템에 포함시킬 만큼 독립적이지는 않은 컴포넌트 집합이다. `ProductCard`, `ContactCard`, `NameField`, `AddressField` 와 같은 컴포넌트를 말한다. 아토믹 디자인 계층 구조에서는 [Organism 계층](https://www.vigorously.xyz/posts/design-system-atomic-design/)에 해당하는 컴포넌트를 말한다.

### 스노우플레이크 컴포넌트 {#snowflakes-components}

일회성 컴포넌트를 말한다. 예를 들어 항공사 좌석 예약 애플리케이션에서 좌석 선택 기능에 들어갈 `Seat` 컴포넌트가 그렇다.

## 패턴 라이브러리에서 {#place-for-building-components}

패턴 라이브러리(ex. 스토리북)에서는 모든 계층의 컴포넌트를 한 번에 확인할 수 있어야 한다. 동시에 이러한 컴포넌트 게층 간에 명확한 구분이 있어야 한다.

예를 들면 스토리북에서 컴포넌트를 다음과 같은 형태로 구성할 수도 있겠다. `src` 내부에 있는 컴포넌트가 디자인 시스템 컴포넌트 계층이 된다.

```text
.storybook
|--pages
|--recipes
|--snowflakes
src
|--components
```

물론 스토리북만이 아니라 스케치나 피그마에서도 동일한 구조로 컴포넌트를 구성하는 것이 효과적이다.

## 고려 사항 {#considerations}

이를 실제로 구현하기 위해서는 다음과 같은 사항들을 고려해야만 한다.

**컴포지션 개념을 이해해야 한다.** 리액트에서는 [컴포지션](https://ko.legacy.reactjs.org/docs/composition-vs-inheritance.html) 개념을 강조하는 것을 볼 수 있는데 간단히 말하자면 다음과 같다.

> React에서는 이 역시 합성을 통해 해결할 수 있습니다. *더 “구체적인” 컴포넌트가 “일반적인” 컴포넌트를 렌더링*하고 props를 통해 내용을 구성합니다. [- 리액트 공식 문서 -](https://ko.legacy.reactjs.org/docs/composition-vs-inheritance.html#specialization)

```jsx
<Card>
  <CardHeader>
    <img src={ imgSrc } alt={ imgAlt } />
  <CardHeader>
  <CardBody>
    <Heading size={3}>{ title }</Heading>
    <TextPassage>{ description }</TextPassage>
    <StarRating rating={ rating } />
  </CardBody>
  <CardFooter>
    <Button text="Add to cart" />
  </CardFooter>
</Card>
```

위는 `ProductCard` 레시피 컴포넌트다. 여기서 `Card` 컴포넌트는 매우 일반적인 컴포넌트다. 즉 `ProductCard` (구체적) 컴포넌트가 `Card` (일반적) 컴포넌트를 렌더링 한다.

`ProductCard` 컴포넌트는 props를 통해서 내용을 구성한다.

```jsx
<ProductCard
  imgSrc="cool-socks.jpg"
  imgSrc="Socks with a zebra-stripe pattern"
  title="Cool socks"
  description="These are some really cool socks."
  rating="4"
/>
```

**모든 것은 컴포넌트라는 생각을 가져야 한다.**

> 컴포넌트 라이브러리를 만들 때는 _"글로벌하게 생각하고 로컬에서 행동한다"_ 는 사고방식을 받아들여야 한다. 따라서 실제 제품 화면의 렌즈를 통해 특정 컴포넌트를 빌드하더라도 "어떻게 하면 최대한 재사용 가능하고 애그노스틱하게 디자인/구조화/명칭/빌드할 수 있을까?"라는 질문을 스스로에게 던져야 한다. - Brad Frost -

**컴포넌트의 레벨은 유동적이다.**

처음에는 하나의 애플리케이션에서만 사용된 컴포넌트라도 시간이 지나 여러 애플리케이션에서 공용으로 사용될 수 있다면 컴포넌트의 계층을 유동적으로 이동할 수 있어야 한다. 이는 반대도 마찬가지다.

**레시피, 스노우플레이크 및 기타 유틸리티가 포함된 독립형 '추가' 라이브러리를 고려한다.**

레시피, 스노우플레이크 계층의 컴포넌트라도 외부 라이브러리로 분리하면 관심 사항을 분리할 수 있기 때문에 코드를 관리하는 데 도움이 된다.

**연습이 필요하다.**

이 모든 것을 실제로 구현하는 것은 쉽지 않은 일이다. 시간을 들여 충분히 논의를 해야만 한다.
