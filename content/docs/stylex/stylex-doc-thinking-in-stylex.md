---
title: StyleX로 생각하기
description:
date: 2024-03-23
tags: []
references:
  [
    {
      key: 'StyleX 공식 문서',
      value: 'https://stylexjs.com/blog/introducing-stylex/',
    },
  ]
---

## 핵심 원칙 {#core-principles}

StyleX가 존재하는 이유와 그 의사결정의 근거를 이해하기 위해서는 StyleX를 지탱하는 근본 원칙들을 이해해야 한다. 이를 통해 StyleX가 자신에게 적합한 솔루션인지 판단할 수 있다.

또한 이러한 원칙들은 StyleX를 위한 새로운 API를 설계할 때에도 유용하다.

### 코로케이션(Co-location) {#colocation}

DRY 코드는 나름의 이점은 있지만, 스타일을 작성할 때는 상황이 다르다. 가장 좋은 스타일 코드 작성 방법은 마크업 파일과 동일한 파일에 스타일을 작성하는 것이다.

StyleX는 로컬에서 스타일을 작성, 적용 및 추론하기 위해 설계되었다.

### 결정론적 해결(Deterministic resolution) {#deterministic-resolution}

CSS는 강력하고 표현력이 뛰어난 언어다. 하지만 취약한 점도 있다. 이는 CSS의 작동 방식에 대한 오해에서 비롯되기도 하지만, 대부분 CSS 선택자들 간의 **명시도(Specificity) 충돌**을 방지하기 위해 필요한 규율과 체계에서 비롯된다.

이 문제에 대한 대부분의 기존 해결책들은 규칙과 관례에 의존한다.

:::note BEM과 OOCSS 컨벤션
BEM과 OOCSS는 이러한 문제를 피하기 위해 명명 규칙을 도입하여, 개발자들이 규칙을 일관되게 따르도록 요구한다. 그 결과 스타일을 전혀 병합하지 않기에 CSS가 비대해질 수 있다.
:::

:::note 유틸리티 클래스
Tailwind CSS와 Tachyons와 같은 아토믹 유틸리티 클래스 명명 방식은 충돌하는 클래스 이름이 동일한 요소에 적용되지 않도록 하기 위해 규칙과 린트에 의존한다. 이러한 도구들은 스타일을 적용할 수 있는 위치와 방식에 제약을 가하여, 스타일링에 구조적 한계를 부과한다.
:::

StyleX는 스타일의 일관성과 예측 가능성을 향상시키는 동시에 표현력도 개선하는 것을 목표로 한다. 그리고 이것이 **빌드 도구**를 통해 가능하다고 믿는다.

**StyleX는 파일 전반에 걸쳐 완전히 예측 가능하고 결정론적인 스타일링 시스템을 제공한다.** 이는 여러 선택자를 병합할 때뿐만 아니라 여러 단축(shorthand) 속성과 장축(longhand) 속성을 병합할 때에도 결정론적인 결과를 산출한다(예: `margin` vs `margin-top` ).

> "마지막으로 적용된 스타일이 항상 승리한다."

### 저비용 추상화 {#low-cost-abstractions}

StyleX의 성능 비용에 관한 우리의 원칙은 StyleX가 특정 패턴을 달성하는 가장 빠른 방법이어야 한다는 것이다. 즉 일반적인 패턴에는 런타임 비용이 없어야 하고, 고급 패턴은 가능한 한 빠르게 동작해야 한다. 우리는 런타임 성능을 개선하기 위해 빌드 타임에 더 많은 작업을 수행하는 절충안을 채택했다.

이는 실제로 다음과 같이 적용된다:

#### 1. 로컬에서 생성 및 적용된 스타일 {#styles-created-and-applied-locally}

동일한 파일 내에서 스타일을 작성하고 사용할 때 StyleX의 비용은 0이다. 이는 StyleX가 `stylex.create` 호출을 컴파일하는 것 외에도 가능한 경우 `stylex.props` 호출도 컴파일하기 때문이다.

> 즉 스타일의 생성과 적용 모두 컴파일 단계에서 수행되므로 런타임 비용은 0이다.

그래서, 다음의 코드는

```ts
import * as stylex from 'stylex';

const styles = stylex.create({
  red: { color: 'red' },
});

let a = stylex.props(styles.red);
```

이렇게 컴파일 된다.

:::tabs

@tab:active JS 출력물#js-output

```js
import * as stylex from 'stylex';

let a = { className: 'x1e2nbdu' };
```

@tab CSS 출력물#css-output

```css
.x1e2nbdu {
  color: red;
}
```

:::

#### 2. 다른 파일에서 사용되는 스타일 {#using-styles-across-files}

파일 경계를 넘어 스타일을 전달하면 추가적인 기능과 표현력을 위해 약간의 비용이 발생한다. `stylex.create` 호출은 컴파일 후에 완전히 제거되지 않고 대신 클래스 이름을 키로 매핑하는 객체가 남는다. 그리고 `stylex.props()` 호출은 런타임에 실행된다.

> 즉, 스타일 적용을 위한 클래스 객체를 생성한 후에 런타임에 적용한다.

예를 들어, 다음의 코드는

```ts
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  foo: {
    color: 'red',
  },
  bar: {
    backgroundColor: 'blue',
  },
});

function MyComponent({style}) {
  return <div {...stylex.props(styles.foo, styles.bar, style)} />;
}
```

이렇게 컴파일 된다.

:::tabs

@tab:active JS 출력물#js-output

```js
import * as stylex from '@stylexjs/stylex';

const styles = {
  foo: {
    color: 'x1e2nbdu',
    $$css: true,
  },
  bar: {
    backgroundColor: 'x1t391ir',
    $$css: true,
  },
};

function MyComponent({ style }) {
  return <div {...stylex.props(styles.foo, styles.bar, style)} />;
}
```

@tab CSS 출력물#css-output

```css
.x1e2nbdu {
  color: red;
}
.x1t391ir {
  background-color: blue;
}
```

:::

코드가 조금 더 많지만 `stylex.props()` 함수의 속도 덕분에 런타임 비용은 여전히 최소화된다.

대부분의 다른 스타일링 솔루션은 파일 경계를 넘어 스타일을 구성할 수 없다. 최신 기술은 클래스 이름 목록을 결합하는 것이다.

### 최소한의 API {#small-api-surface}

우리의 목표는 StyleX를 가능한 한 최소한으로 만들고 쉽게 배울 수 있도록 만드는 것이다. 그렇기 때문에 우리는 너무 많은 API를 만들고 싶지 않았다. 대신, 가능한 한 일반적인 JavaScript 패턴에 의존하고 가능한 한 작은 API 표면을 제공하고 싶다.

핵심적으로, StyleX는 두 가지 함수로 요약될 수 있다:

1.  `stylex.create`
2.  `stylex.props`

`stylex.create` 는 스타일을 생성하는 데 사용되고 `stylex.props` 는 해당 스타일을 요소에 적용하는 데 사용된다.

이 두 함수 내에서, 우리는 StyleX에 대한 고유한 API 또는 패턴을 도입하는 대신 일반적인 JS 패턴에 의존하기로 선택했다. 예를 들어, 조건부 스타일에 대한 API가 없다. 대신, 우리는 부울 또는 삼항 표현식을 사용하여 조건부로 스타일을 적용하는 것을 지원한다.

JavaScript 객체와 배열을 다룰 때 모든 것은 예상대로 작동해야 한다.

### 타입 안전 스타일​ {#type-safe-styles}

TypeScript는 제공하는 경험과 안전성 때문에 엄청나게 인기를 얻었다. 그러나 우리의 스타일은 대부분 타입이 지정되지 않고 신뢰할 수 없는 상태로 남아 있다. [Vanilla Extract](https://vanilla-extract.style/)와 같은 획기적인 프로젝트를 제외하고는 대부분의 스타일링 솔루션에서 스타일은 단순히 문자열 모음일 뿐이다.

StyleX는 강력한 정적 타입을 가진 Flow로 작성되었다. NPM의 패키지에는 Flow와 TypeScript 모두에 대해 자동 생성된 타입이 포함되어 있다. 두 타입 시스템 간에 비호환성이 있을 때, 우리는 Flow와 동일한 수준의 강력함과 안전성을 달성하기 위해 커스텀 TypeScript 타입을 작성한다.

**모든 스타일은 타입이 지정된다.** 스타일을 prop으로 받아들일 때, 타입을 사용하여 받아들여지는 스타일을 제한할 수 있다. 스타일은 다른 모든 컴포넌트 prop만큼 타입 안전성을 가져야 한다.

StyleX API는 강력하게 타입이 지정되어 있다. StyleX로 정의된 스타일도 타입이 지정된다. 이는 원시 스타일을 작성하기 위해 JavaScript 객체를 사용하기에 가능하다. 이것이 우리가 템플릿 문자열보다 객체를 선택한 큰 이유 중 하나다.

이러한 타입은 컴포넌트가 프로퍼티로 받아들일 스타일을 제한하는데 활용될 수 있다. 예를 들어, 컴포넌트 prop은 `color` 와 `backgroundColor` 만 받아들이고 다른 스타일은 받아들이지 않도록 정의할 수 있다.

```tsx
import type { StyleXStyles } from '@stylexjs/stylex';

type Props = {
  //...
  style?: StyleXStyles<{ color?: string; backgroundColor?: string }>;
  //...
};
```

다른 예로, prop으로 margin을 허용하지 않으면서 다른 모든 스타일을 허용할 수도 있다.

```tsx
import type { StyleXStylesWithout } from '@stylexjs/stylex';

type Props = {
  //...
  style?: StyleXStylesWithout<{
    margin: unknown;
    marginBlock: unknown;
    marginInline: unknown;
    marginTop: unknown;
    marginBottom: unknown;
    marginLeft: unknown;
    marginRight: unknown;
    marginBlockStart: unknown;
    marginBlockEnd: unknown;
    marginInlineStart: unknown;
    marginInlineEnd: unknown;
  }>;
  //...
};
```

스타일이 타입화되면 컴포넌트의 스타일을 **런타임 비용 없이** 커스터마이징 할 수 있는 매우 정교한 규칙을 만들 수 있다.

### 공유 가능한 상수​ {#shareable-constants}

CSS 클래스 이름, CSS 변수 및 기타 CSS 식별자는 전역 네임스페이스에서 정의된다. CSS 문자열을 그대로 JavaScript로 가져오면 타입 안전성과 컴포저빌리티를 잃을 수 있다.

우리는 스타일이 타입 안전성을 갖기를 원하므로, 이러한 문자열을 JavaScript 상수로 대체하는 API를 고안하는 데 많은 시간을 할애했다. 지금까지 이것은 다음의 API에 반영되어 있다:

- `stylex.create`
  - 이 함수는 CSS 클래스 이름을 생성하는 과정을 추상화한다.
  - 개발자는 실제로 생성된 클래스 이름을 직접 다루지 않고 대신 스타일을 나타내는 JavaScript 객체를 사용한다.
  - JavaScript 객체를 사용할 때 개발자는 객체 내부의 구조를 알 필요가 없이 사용할 수 있으며 객체는 강력한 타입 정보를 포함하기 때문에 스타일의 내용을 명확하게 파악할 수 있다.
- `stylex.defineVars`
  - 이 함수는 CSS 변수의 이름을 생성하는 과정을 추상화한다.
  - CSS 변수는 재사용 가능한 스타일 값을 저장하는 데 사용되는데, 일반적으로 전역 네임스페이스에 정의된다.
  - 이 함수를 사용하면 CSS 변수를 JavaScript 상수로 가져올 수 있다.
  - 이렇게 가져온 상수는 스타일 정의 내에서 직접 사용할 수 있어, 스타일 코드의 가독성과 유지보수성을 높일 수 있다.
- `stylex.keyframes`
  - 이 함수는 CSS 키프레임 애니메이션의 이름 생성 과정을 추상화한다.
  - 키프레임 애니메이션은 CSS에서 복잡한 애니메이션을 정의하는 데 사용되며, 각 애니메이션은 고유한 이름을 가져야 한다.
  - 이 함수를 사용하면 애니메이션의 이름을 직접 지정하는 대신, JavaScript 상수로 대체할 수 있다.
  - 이렇게 정의된 상수는 스타일 정의 내에서 사용할 수 있다.
  - 이는 애니메이션 이름의 충돌을 방지하고 코드의 가독성과 유지보수성을 향상시킨다.

우리는 `container-name` 과 `@font-face` 와 같은 다른 CSS 식별자도 타입 안전성 있게 만드는 방법도 모색하고 있다.

### 프레임워크에 구애받지 않는다 {#framework-agnostic}

StyleX는 CSS-in-React 솔루션이 아니라 CSS-in-JS 솔루션이다. 비록 StyleX가 오늘날 React와 가장 잘 작동하도록 맞춤화되었지만, JavaScript에서 마크업을 작성할 수 있는 모든 JavaScript 프레임워크와 함께 사용할 수 있도록 설계되었다. 여기에는 JSX, 템플릿 문자열 등을 사용하는 프레임워크가 포함된다.

`stylex.props` 는 `className` 과 `style` 속성이 있는 객체를 반환한다. 다양한 프레임워크에서 작동하도록 변환하려면 래퍼 함수가 필요할 수 있다.

### 캡슐화​ {#encapsulation}

> 요소의 모든 스타일은 해당 요소 자체의 클래스 이름에 의해 발생해야 한다.

CSS는 아래와 같이 **거리에 따른 스타일** 방식으로 스타일을 작성하는 것이 매우 쉽다:

- `.className > *`
- `.className ~ *`
- `.className:hover > div:first-child`

이러한 모든 패턴은 강력하지만 스타일을 취약하고 예측 가능성이 떨어지게 만든다. 한 요소에 클래스 이름을 적용하면 완전히 다른 요소에 영향을 줄 수 있다.

`color` 와 같은 상속 가능한 스타일은 여전히 상속되지만, 이는 StyleX가 허용하는 유일한 예외다. 이러한 경우에도 요소에 직접 적용되는 스타일은 항상 상속된 스타일보다 우선한다.

복합 선택자는 상속과는 경우가 다르다. 복합 선택자는 일반적으로 단순한 클래스 선택자보다 높은 특이성을 가지기 때문이다.

:::note 복합 선택자
여기서 복합 선택자란, 여러 종류의 선택자를 조합하여 만든 선택자를 말한다. 예를 들면:

- `.className > div` (클래스 선택자 + 자식 선택자 + 요소 선택자)
- `#idName .className` (ID 선택자 + 자손 선택자 + 클래스 선택자)

이런 복합 선택자는 단순한 클래스 선택자 (.className)보다 높은 특이성을 갖는다. 따라서 같은 요소에 단순한 클래스 선택자와 복합 선택자가 모두 적용되는 경우, 복합 선택자의 스타일이 우선 적용된다.

이는 종종 의도치 않은 결과를 야기할 수 있다. 단순한 클래스 이름을 통해 스타일을 적용하려 했지만, 다른 곳에서 정의된 복합 선택자 때문에 스타일이 원하는 대로 적용되지 않을 수 있다.

:::

StyleX는 이러한 복합 선택자들을 의도적으로 허용하지 않는다. 현재 이로 인해 특정 CSS 패턴을 StyleX로 구현할 수 없다. 우리의 목표는 스타일 캡슐화를 유지하면서 이러한 패턴을 지원하는 것이다.

StyleX는 CSS 전처리기가 아니다. 빠르고 예측 가능한 시스템을 구축하기 위해 CSS 선택자의 강력함에 의도적으로 제약을 가한다. 템플릿 문자열 대신 JavaScript 객체를 기반으로 하는 API는 이러한 제약을 자연스럽게 느끼도록 설계되었다.

### 간결함보다 가독성과 유지보수성​ {#readability-and-maintainability-over-terseness}

최근 일부 유틸리티 기반 스타일링 솔루션은 매우 간결하고 작성하기 쉽다. StyleX는 간결함보다 가독성과 유지보수성을 우선시하는 것을 선택했다.

StyleX는 가독성과 얕은 학습 곡선을 우선시하기 위해 친숙한 CSS 속성 이름을 사용하는 것을 선택한다. _(편의를 위해 케밥 케이스 대신 카멜 케이스를 사용하기로 결정했다.)_

또한 스타일이 사용되는 HTML 요소와 별도의 객체로 작성되도록 강제한다. 우리는 HTML 마크업의 가독성을 높이고 적절하게 명명된 스타일이 그 목적을 나타내도록 하기 위해 이러한 결정을 내렸다. 예를 들어, `styles.active` 와 같은 이름을 사용하면 적용되는 스타일이 무엇인지 파고들 필요 없이 스타일이 적용되는 이유를 알 수 있다.

이러한 원칙은 StyleX로 스타일을 작성하는 것이 다른 솔루션보다 더 많은 타이핑을 요구하는 트레이드 오프로 작용한다.

우리는 이러한 비용이 시간이 지남에 따라 향상된 가독성으로 돌아와 더 많은 이점을 줄 것이라고 믿는다. 각 HTML 요소에 의미론적 이름을 부여하는 것은 스타일 자체보다 훨씬 더 많은 것을 전달할 수 있다.

:::note
스타일에 대한 참조를 사용하는 것은 인라인 스타일을 사용하는 것보다 테스트 가능성 측면에서 큰 이점이 있다.

1. **아토믹 스타일 제거**: 단위 테스트 환경에서 StyleX를 사용하면, 모든 아토믹 스타일(개별적인 스타일 속성)을 제거하도록 구성할 수 있다. 이는 테스트 결과를 단순화하고 가독성을 높인다. 스타일 속성 자체보다는 스타일이 적용된 위치에 더 집중할 수 있게 해준다.

2. **디버깅 클래스 이름**: 아토믹 스타일을 제거하는 대신, StyleX는 해당 스타일이 정의된 소스 코드의 위치를 나타내는 단일 디버깅 클래스 이름을 출력할 수 있다. 이는 스타일 문제를 디버깅할 때 매우 유용하다. 실제 스타일 속성 값을 모두 출력하는 대신, 문제의 스타일이 어디에서 왔는지를 추적하기 쉽게 해준다.

3. **스냅샷 테스트 탄력성**: 스냅샷 테스트는 컴포넌트의 렌더링 결과를 캡처하여 이전에 저장된 "스냅샷"과 비교하는 테스트 방식이다. 인라인 스타일을 사용하면 스타일이 변경될 때마다 스냅샷 테스트도 함께 업데이트되어야 한다. 하지만 StyleX의 참조 방식을 사용하면, 스타일 변경이 스냅샷 테스트에 영향을 주지 않는다. 스타일 참조만 저장되기 때문이다. 이는 스타일 리팩토링이나 변경 시에도 기존 스냅샷 테스트를 그대로 유지할 수 있게 해준다.

4. **테스트 포커스**: 스타일 참조를 사용하면 테스트가 스타일 자체보다는 컴포넌트의 동작과 구조에 더 집중할 수 있다. 이는 테스트의 목적과 의도를 더 명확히 하고, 테스트 코드의 가독성과 유지보수성을 향상시킨다.

요약하자면, StyleX의 스타일 참조 방식은 단위 테스트 환경에서 아토믹 스타일을 제거하고 디버깅 클래스 이름을 출력하는 등의 방식으로 테스트 가능성을 크게 향상시킨다. 이는 스냅샷 테스트의 탄력성을 높이고, 테스트 코드의 포커스를 개선하는 데 도움이 된다.
:::

### 모듈성과 합성 가능성​ {#modularity-and-composability}

StyleX는 모듈성과 합성 가능성을 핵심 가치로 삼고 있다. 이는 스타일을 쉽게 공유하고 재사용할 수 있는 시스템을 만드는 것을 목표로 한다.

1. **NPM을 통한 코드 공유**:
   NPM(Node Package Manager)은 JavaScript 생태계에서 코드 공유를 매우 쉽게 만들었다. 개발자들은 NPM을 통해 패키지를 공유하고, 다른 프로젝트에서 이를 쉽게 설치하고 사용할 수 있다. 하지만 CSS의 경우에는 이런 공유가 아직도 어렵다.

2. **CSS 공유의 어려움**:
   현재 CSS 공유의 주요 문제점은 다음과 같다:

   - 서드파티 컴포넌트에 내장된 스타일: 많은 서드파티 컴포넌트들은 커스터마이징하기 어렵거나 불가능한 스타일을 내장하고 있다. 이는 컴포넌트를 사용하는 프로젝트에서 스타일을 변경하거나 조정하기 어렵게 만든다.
   - 완전히 스타일이 없는 컴포넌트: 반대로 일부 컴포넌트들은 아무런 스타일이 없이 제공되기도 한다. 이 경우 컴포넌트를 사용하는 프로젝트에서 모든 스타일을 직접 정의해야 하므로, 스타일 재사용성이 떨어진다.

3. **스타일 병합 및 구성의 어려움**:
   패키지 간에 스타일을 예측 가능한 방식으로 병합하고 구성하는 것도 쉽지 않다. 각 패키지가 서로 다른 방식으로 스타일을 정의하고 적용하기 때문에, 이를 일관되게 통합하는 것이 어렵다. 이는 패키지 내에서 스타일을 공유할 때도 마찬가지의 문제가 된다.

4. **StyleX의 목표**:
   StyleX는 이러한 문제점들을 해결하고자 한다. StyleX의 주요 목표는 다음과 같다:

   - NPM 패키지 내에서 컴포넌트와 함께 스타일을 쉽게 공유할 수 있는 시스템 제공
   - 공유된 스타일을 안정적이고 예측 가능한 방식으로 병합 및 구성할 수 있는 메커니즘 제공
   - 스타일의 모듈성과 캡슐화를 유지하면서도 필요에 따라 커스터마이징을 허용

5. **StyleX의 접근 방식**:
   StyleX는 이를 위해 다음과 같은 접근 방식을 취한다:
   - JavaScript 객체를 사용하여 스타일을 정의하고 공유
   - 컴포넌트와 스타일을 함께 NPM 패키지로 배포
   - 스타일 합성을 위한 명확하고 예측 가능한 규칙 제공
   - 스타일의 우선순위와 상속을 제어할 수 있는 메커니즘 제공
   - 런타임에 스타일을 동적으로 조정할 수 있는 API 제공

이를 통해 StyleX는 스타일의 모듈성과 합성 가능성을 크게 향상시키고, NPM 생태계 내에서 스타일 공유와 재사용을 촉진하고자 한다. 이는 개발자들이 보다 쉽게 일관되고 유지보수 가능한 스타일을 작성하고 공유할 수 있게 해줄 것이다.

### 전역 구성 피하기​ {#avoiding-global-configuration}

1. **프로젝트 간 일관성**:
   StyleX는 프로젝트마다 다르게 동작하는 것을 지양한다. StyleX의 구문이나 동작을 프로젝트별로 변경하는 구성을 만드는 것은 피해야 한다. 이는 StyleX를 사용하는 모든 프로젝트에서 일관된 경험을 제공하고, 한 프로젝트에서 습득한 지식을 다른 프로젝트에 쉽게 적용할 수 있도록 하기 위함이다.

2. **합성 가능성과 일관성 우선**:
   프로젝트별 구성을 허용하면 단기적인 편의성은 얻을 수 있지만, 장기적으로는 코드의 합성 가능성과 일관성을 해칠 수 있다. StyleX는 이런 단기적 편의보다는 합성 가능성과 일관성을 우선시하기로 선택했다. 이는 다양한 프로젝트와 팀에서 StyleX 코드를 쉽게 공유하고 통합할 수 있게 해준다.

3. **린팅과 타입을 통한 프로젝트별 규칙**:
   프로젝트별 구성 대신, StyleX는 린팅과 타입 시스템을 활용하여 프로젝트별 규칙을 만드는 것을 권장한다. 린터를 사용하면 코드 스타일, 네이밍 컨벤션, 허용되는 패턴 등을 프로젝트 수준에서 정의하고 강제할 수 있다. 또한 TypeScript와 같은 타입 시스템을 사용하면 프로젝트에 특화된 타입과 인터페이스를 정의할 수 있다. 이런 방식으로 프로젝트별 규칙을 만들면 StyleX 자체의 동작은 변경하지 않으면서도 프로젝트의 요구사항을 충족할 수 있다.

4. **마법의 문자열 피하기**:
   StyleX는 프로젝트 내에서 전역적으로 특별한 의미를 가지는 "마법의 문자열"을 피한다. 마법의 문자열은 코드의 의도를 파악하기 어렵게 만들고, 리팩토링을 어렵게 만든다. 대신 StyleX에서는 모든 스타일, 변수, 공유 상수를 JavaScript 모듈에서 임포트하는 방식을 사용한다. 이렇게 하면 고유한 이름이나 프로젝트 구성 없이도 코드의 의미를 명확히 할 수 있다.

5. **명시적 임포트**:
   StyleX에서는 모든 의존성을 명시적으로 임포트해야 한다. 이는 코드의 출처를 명확히 하고, 의존성 관리를 용이하게 해준다. 암묵적 전역 상태나 구성에 의존하는 대신, 필요한 모든 것을 명시적으로 임포트함으로써 코드의 모듈성과 재사용성을 높일 수 있다.

이러한 원칙들을 따름으로써 StyleX는 프로젝트 간에 일관되고 합성 가능한 방식으로 동작할 수 있습니다. 이는 StyleX 코드의 공유와 유지보수를 용이하게 하며, 대규모 프로젝트에서도 복잡성을 관리할 수 있게 해준다.

### 다수의 작은 파일보다 하나의 작은 파일​ {#one-small-file-over-many-smaller-files}

StyleX는 성능 최적화를 위해 "다수의 작은 파일보다 하나의 작은 파일" 전략을 채택하고 있다.

1. **CSS 지연 로딩의 장단점**:
   대량의 CSS를 다룰 때, 일반적인 최적화 기법 중 하나는 CSS를 지연 로딩하는 것이다. 이는 초기에 필요한 CSS만 로드하고, 나머지는 나중에 로드하는 방식이다. 이렇게 하면 페이지의 초기 로드 시간을 단축할 수 있다. 하지만 이는 업데이트 시간이 느려지는 대가가 따른다. 새로운 CSS가 로드될 때마다 전체 페이지의 스타일을 재계산해야 하기 때문이다. 이는 사용자 경험에 부정적인 영향을 줄 수 있다.

2. **Interaction to Next Paint (INP)**:
   INP는 사용자가 페이지와 상호 작용한 후, 다음 화면이 그려질 때까지의 시간을 측정하는 메트릭이다. CSS 지연 로딩은 이 INP 메트릭에 부정적인 영향을 준다. 지연 로딩된 CSS가 적용될 때마다 페이지 전체의 스타일이 재계산되어야 하므로, 사용자 상호 작용 후 다음 화면이 그려지는 데 더 오랜 시간이 소요되기 때문이다.

3. **StyleX의 단일 파일 전략**:
   StyleX는 이러한 문제를 해결하기 위해 단일의 고도로 최적화된 CSS 번들을 생성하여 미리 로드하는 전략을 취한다. StyleX는 빌드 타임에 모든 스타일을 분석하고, 불필요한 중복을 제거하며, 최적의 순서로 스타일을 정렬한다. 이렇게 생성된 CSS 번들은 매우 작고 효율적이다.

4. **초기 로드 시간과 성능**:
   StyleX의 목표는 생성된 CSS 번들의 크기를 최소화하여, 모든 CSS를 초기에 로드하더라도 성능에 큰 영향을 주지 않도록 하는 것이다. 작고 최적화된 CSS 번들은 네트워크 전송 시간을 최소화하고, 브라우저에서 빠르게 파싱되고 적용될 수 있다. 이는 지연 로딩의 장점인 초기 로드 시간 단축을 유지하면서도, 지연 로딩의 단점인 INP 저하를 피할 수 있게 해준다.

5. **다른 최적화 기법과의 호환성**:
   "크리티컬 CSS"와 같이 초기 로드 시간을 단축시키기 위한 다른 최적화 기법들은 StyleX와 호환된다. 크리티컬 CSS는 페이지의 초기 렌더링에 필수적인 스타일만을 추출하여 인라인으로 삽입하는 기법이다. 이는 StyleX로 생성된 CSS와 함께 사용할 수 있다. 다만 StyleX의 최적화가 잘 이루어진 경우, 크리티컬 CSS와 같은 추가적인 최적화는 불필요할 수 있다.

이렇게 StyleX는 "하나의 작은 파일" 전략을 통해 CSS 성능 최적화와 사용자 경험 향상이라는 두 마리 토끼를 잡고자 한다. 이는 개발자로 하여금 성능에 대한 걱정 없이 스타일을 작성할 수 있게 하며, 사용자에게는 빠르고 일관된 경험을 제공할 수 있게 해준다.