---
title: 스타일 정의하기
description:
date: 2024-05-15
tags: []
references:
  [
    {
      key: 'StyleX 공식 문서',
      value: 'https://stylexjs.com/docs/learn/styling-ui/defining-styles/',
    },
  ]
---

StyleX는 React DOM에서 인라인 스타일로 작업하거나, React Native에서 스타일을 작업하는 것과 유사한 방식의 스타일링 표현법을 사용한다.

## 제약 조건 {#constraints}

StyleX는 사전 컴파일 방식을 사용하므로, 모든 스타일은 정적으로 분석 가능해야 한다. 즉, "Raw 스타일 객체"에는 다음과 같은 요소만 포함될 수 있다:

1. **일반 객체 리터럴**
2. **문자열 리터럴**
3. **숫자 리터럴**
4. **배열 리터럴**
5. **`null` 또는 `undefined`**
6. **상수**, **간단한 표현식**, 위의 값 중 하나로 리졸브되는 **내장 메서드**(예: `.toString()`)
7. **화살표 함수**: 동적으로 스타일을 계산하기 위해 화살표 함수 `() => ({ ... })` 를 사용할 수 있다. 이 함수는 위의 규칙을 따르는 객체를 반환해야 한다.

반면, 다음과 같은 경우는 StyleX에서 허용되지 않는다:

1. **함수 호출**: StyleX에서 제공하는 함수를 제외한 일반 함수 호출은 허용되지 않는다. 스타일 정의 시점에서 함수의 반환값을 알 수 없기 때문이다.
2. **다른 모듈에서 가져온 값**: `.stylex.js` 파일에서 StyleX를 통해 생성한 CSS 변수를 제외하고는, 다른 모듈에서 가져온 값을 스타일에 사용할 수 없다. 이는 정적 분석을 위해 필요한 제약사항이다.

## 스타일 생성하기 {#creating-styles}

스타일을 만들 때는 `stylex.create` 를 사용한다 . 이 함수를 사용하면 스타일을 그룹으로 묶어서 정의할 수 있다.

이 그룹을 **네임스페이스**라고 부른다.

예를 들어, 아래 코드에서는 `base` 와 `highlighted` 라는 두 개의 네임스페이스를 만들었다.

```javascript
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  base: {
    fontSize: 16,
    lineHeight: 1.5,
    color: 'rgb(60,60,60)',
  },
  highlighted: {
    color: 'rebeccapurple',
  },
});
```

`base` 에는 기본적인 스타일을, `highlighted` 에는 강조 스타일을 정의했다. 이렇게 네임스페이스를 사용하면 관련 있는 스타일끼리 모아서 관리할 수 있다.

네임스페이스의 이름은 `base`, `highlighted` 처럼 원하는대로 지을 수 있다. 이 이름은 나중에 스타일을 사용할 때 구분하기 위해 필요하다.

`stylex.create` 함수를 호출하면 정의한 스타일 객체가 만들어지고, 이걸 `styles` 라는 변수에 저장했다.

이렇게 만든 스타일은 나중에 컴포넌트에서 `styles.base`, `styles.highlighted` 같은 방식으로 사용할 수 있다.

## 가상 클래스 {#pseudo-classes}

웹사이트를 사용할 때, 버튼 같은 요소들은 상황에 따라 모습이 달라진다. 마우스를 버튼 위에 올리면 색깔이 바뀌기도 하고, 클릭하면 더 진한 색으로 변하기도 한다. 이렇게 요소의 상태에 따라 스타일을 다르게 적용하는 것을 **가상 클래스(pseudo classes)** 라고 한다.

StyleX에서는 가상 클래스를 아주 쉽게 사용할 수 있다. 스타일을 정의할 때 객체 안에 가상 클래스를 나타내는 속성을 추가하면 된다.

```javascript
const styles = stylex.create({
  button: {
    backgroundColor: {
      default: 'lightblue',
      ':hover': 'blue',
      ':active': 'darkblue',
    },
  },
});
```

위 코드를 보면, `backgroundColor` 라는 속성 안에 객체가 있다. 이 객체의 속성으로 `default`, `:hover`, `:active` 가 있는데, 각각 버튼의 기본 상태, 마우스를 올렸을 때, 클릭했을 때의 배경색을 나타낸다.

이런 식으로 `:hover` 나 `:active` 말고도 다양한 가상 클래스가 있다. 필요에 따라 원하는 가상 클래스를 추가해서 사용하면 된다.

## 가상 요소 {#pseudo-elements}

웹 페이지를 만들 때, 우리는 주로 HTML 태그를 사용한다. 예를 들면 `<div>`, `<span>`, `<input>` 같은 것들이다. 그런데 가끔은 이런 태그들로 표현하기 어려운 부분들이 있다. 이럴 때 사용하는 것이 바로 **가상 요소(pseudo-elements)** 다.

가상 요소는 실제로 HTML 코드에는 없지만, 마치 있는 것처럼 스타일을 줄 수 있는 특수한 요소다.

예를 들어, 입력창(input)에는 사용자가 입력하기 전에 미리 보여주는 힌트 텍스트가 있다. 이걸 플레이스홀더(placeholder)라고 한다. 이 플레이스홀더는 실제 HTML 태그로는 표현할 수 없다. 그래서 `::placeholder` 라는 가상 요소를 사용해서 스타일을 지정한다.

```javascript
const styles = stylex.create({
  input: {
    '::placeholder': {
      color: '#999',
    },
  },
});
```

위 코드처럼 `::placeholder` 가상 요소를 사용하면, 플레이스홀더 텍스트의 색상을 `#999` 로 바꿀 수 있다.

:::tip 불필요한 가상 요소는 피해야한다
가능하면 가상 요소를 사용하지 않고 실제 HTML 요소에 의존하는 것이 좋다.

예를 들어, `::before` 와 `::after` 를 `div` 나 `span` 과 같은 요소로 대체한다. 이렇게 하면 CSS 번들의 크기를 줄이는 데 도움이 된다.
:::

가상 요소를 스타일링할 때는 네임스페이스 안에서 최상위 키로 정의해야 한다. 가상 클래스와는 달리, 속성 안에 중첩해서 쓸 수 없다.

```js
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  input: {
    // pseudo-element
    '::placeholder': {
      color: '#999',
    },
    color: {
      default: '#333',
      // pseudo-class
      ':invalid': 'red',
    },
  },
});
```

## 미디어 쿼리(및 기타 @규칙) {#media-queries}

미디어 쿼리는 화면 크기에 따라서 다른 스타일을 적용할 수 있게 해준다.

예를 들어서 화면이 작을 때는 글자 크기를 좀 더 크게, 화면이 클 때는 글자 크기를 좀 더 작게 만들 수 있다.

미디어 쿼리 역시 스타일 값 내에서 "조건"처럼 사용할 수 있다.

```js
const styles = stylex.create({
  base: {
    width: {
      default: 800,
      '@media (max-width: 800px)': '100%',
      '@media (min-width: 1540px)': 1366,
    },
  },
});
```

## 조건 결합하기 {#combining-conditions}

미디어 쿼리와 가상 클래스(:hover, :active 등)를 같이 사용해야 하는 경우 조건을 중첩해서 쓸 수 있다.

```js
const styles = stylex.create({
  button: {
    color: {
      default: 'var(--blue-link)',
      ':hover': {
        default: null,
        '@media (hover: hover)': 'scale(1.1)',
      },
      ':active': 'scale(0.9)',
    },
  },
});
```

이 코드는 버튼의 색상을 설정하고 있다.

- 기본 색상은 `var(--blue-link)` 다.
- 마우스를 올렸을 때( `:hover` )는 두 가지 경우로 나뉜다.
  - 기본적으로는 아무 변화가 없다( `default: null` ).
  - 마우스를 올릴 수 있는 기기에서는( `@media (hover: hover)` ) 크기가 1.1배로 커진다( `scale(1.1)` ).
- 마우스를 클릭했을 때( `:active` )는 크기가 `0.9` 배로 작아진다.

이렇게 미디어 쿼리와 가상 클래스를 중첩해서 쓰면, 좀 더 다양한 상황에 맞는 스타일을 적용할 수 있다.

:::note
조건을 쓸 때는 필수로 `default` 값을 정해줘야 한다. 만약 기본값에 아무 스타일도 주고 싶지 않으면 `null` 을 쓰면 된다.
:::

## 폴백 스타일 {#fallback-styles}

때로는 새로운 스타일 속성을 사용해야하는 경우가 있다. 문제는 그 새로운 속성을 지원하지 않는 브라우저를 어떻게 하는가 이다.

이때 "폴백"을 사용한다. 폴백은 "대체"라는 뜻으로, 새로운 속성을 지원하지 않는 브라우저를 위한 대체 스타일을 제공한다.

CSS에서는 다음과 같은 식으로 폴백을 사용한다:

```css
.header {
  position: fixed;
  position: -webkit-sticky;
  position: sticky;
}
```

여기서는 `position` 속성에 대해 세 가지 값을 순서대로 쓰고 있다. 브라우저는 위에서부터 차례로 속성을 읽다가, 지원하는 속성을 만나면 그걸 적용하고 나머지는 무시한다.

그런데 StyleX에서는 JavaScript 객체를 사용하기 때문에, 이런 식으로 쓸 수가 없다. 대신 `firstThatWorks` 라는 특별한 함수를 제공한다.

```javascript
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  header: {
    position: stylex.firstThatWorks('sticky', '-webkit-sticky', 'fixed'),
  },
});
```

`firstThatWorks` 함수는 괄호 안에 쓴 값들을 차례로 시도해 보고, 첫 번째로 작동하는 값을 사용한다.

## 키프레임 애니메이션 {#keyframe-animations}

StyleX에서는 `stylex.keyframes()` 를 사용하여 애니메이션을 만들 수 있다.

```javascript
import * as stylex from '@stylexjs/stylex';

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const styles = stylex.create({
  base: {
    animationName: fadeIn,
    animationDuration: '1s',
  },
});
```

## 동적 스타일 {#dynamic-styles}

:::warning
동적 스타일은 고급 기능이므로 신중하게 사용해야 한다. 대부분의 경우에는 조건부 스타일로 충분하다.
:::

StyleX는 모든 스타일을 컴파일 시점에 생성하므로, 해당 스타일들을 미리 알고 있어야 한다. 하지만 때로는 런타임까지 어떤 스타일이 필요할지 모를 수도 있다.

이러한 상황에서는 스타일을 객체 대신 함수로 정의하고, 필요한 스타일의 동적 구성요소를 매개변수로 전달할 수 있다.

:::note
함수 본문은 _반드시_ 객체 리터럴이어야 한다. 여러 문장을 포함하는 함수 본문은 사용할 수 없다.
:::

```javascript
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  // 함수 인자는 반드시 단순 식별자여야 함
  // -- 구조분해나 기본값 할당은 허용되지 않음
  bar: (height) => ({
    height,
    // 함수 본문은 반드시 객체 리터럴이어야 함
    // -- { return {} } 형태는 허용되지 않음
  }),
});

function MyComponent() {
  // `height` 값은 컴파일 시점에 알 수 없음
  const [height, setHeight] = useState(10);

  return <div {...stylex.props(styles.bar(height))} />;
}
```

위 코드에서 `height` 는 변수다. 이 변수의 값은 런타임에, 즉 프로그램이 실행되는 동안 결정된다.

StyleX는 이런 동적 스타일을 처리하기 위해서 CSS 변수를 활용한다. CSS 변수는 CSS에서 값을 변수로 저장할 수 있게 해주는 기능이다.

**StyleX는 동적 스타일을 만나면, 그것을 CSS 변수를 사용하는 정적인 스타일로 변환한다.**

예를 들어서 위의 `bar` 스타일은 아래와 같은 CSS로 변환된다.

```css
.bar {
  height: var(--height);
}
```

그리고 런타임에, 즉 `styles.bar(height)` 가 호출되는 시점에, StyleX는 `--height` 변수의 값을 실제 `height` 값으로 설정한다.

```javascript
<div {...stylex.props(styles.bar(100))} />
```

위와 같은 코드가 실행되면, StyleX는 내부적으로 아래와 같은 작업을 수행하는 셈이다.

```css
.bar {
  height: var(--height);
}

/* 런타임에 추가되는 부분 */
.bar {
  --height: 100px;
}
```

이렇게 CSS 변수를 활용하면 어떤 스타일이든 동적으로 만들 수 있다. 심지어 미디어 쿼리나 가상 클래스도 가능하다.

```javascript
const styles = stylex.create({
  bar: (height) => ({
    height,
    '@media (min-width: 768px)': {
      height: height * 2,
    },
    ':hover': {
      height: height * 1.5,
    },
  }),
});
```

동적 스타일은 매우 강력한 기능이지만, 남용하면 코드의 복잡성이 증가하고 성능에 영향을 줄 수 있다. 정말 필요한 경우에만 사용하는 것이 좋다.
