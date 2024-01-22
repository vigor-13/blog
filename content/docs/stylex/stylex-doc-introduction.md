---
title: 소개
description: StyleX 소개하기
date: 2024-01-23
tags: []
references:
  [{ key: 'StyleX 공식 문서', value: 'https://stylexjs.com/docs/learn/' }]
---

StyleX는 웹 애플리케이션 스타일링을 위한 간단하고 사용하기 쉬운 JavaScript 문법 및 컴파일러다.

StyleX는 인라인 스타일과 정적(static) CSS의 장점을 결합하고 단점을 피한다. 스타일을 정의하고 사용하려면 컴포넌트 내의 로컬 지식만 있으면 되며, 미디어 쿼리와 같은 기능을 유지하면서 [명시도](https://developer.mozilla.org/ko/docs/Web/CSS/Specificity) 문제를 피할 수 있다. StyleX는 충돌이 없는 아토믹(atomic) CSS를 사용하여 최적화된 스타일을 빌드하므로 수작업으로 작성하고 유지 관리해야하는 다른 아토믹 CSS보다 뛰어나다.

## 기능 살펴보기 {#features}

### 확장성 {#scalable}

- 아토믹 CSS로 CSS 출력 최소화.
- 컴포넌트 수가 증가해도 CSS 크기가 그에 비례하여 급증하지 않는다.
- 스타일은 증가하는 코드베이스 속에서도 가독성과 유지 관리성을 유지한다.

### 예측가능성 {#predictable}

- 클래스 이름을 사용하여 스타일을 지정할 때 해당 클래스가 할당된 엘리먼트에만 스타일이 적용된다.
- 명시도 문제가 없다.
- "마지막으로 적용된 스타일이 항상 승리한다!"

### 컴포저블 {#composable}

- 조건부로 스타일 적용.
- 컴포넌트 및 파일 경계에서 임의의 스타일을 병합하고 작성할 수 있다.
- 지역 상수와 표현식을 사용하여 스타일을 DRY하게 유지하라. 또는 성능에 대한 걱정 없이 스타일을 반복할 수 있다.

### 빠른 속도 {#fast}

- 런타임 스타일 주입이 없다.
- 모든 스타일은 컴파일 시 정적 CSS 파일에 번들로 제공된다.
- 클래스 이름 병합에 최적화된 런타임.

### 타입 안정성 {#type-safe}

- 타입 안전한 API
- 타입 안전한 스타일
- 타입 안전한 테마

## StyleX 사용하기 {#using-stylex}

### 컴파일러 구성하기 {#configure-compiler}

```js
import plugin from '@stylexjs/rollup-plugin';

const config = () => ({
  plugins: [plugin({ ...options })],
});

export default config;
```

### 스타일 정의하기 {#define-styles}

스타일은 객체 구문과 `create()` API를 사용하여 정의한다.

```jsx
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  root: {
    width: '100%',
    maxWidth: 800,
    minHeight: 40,
  },
});
```

추가로 키와 `create()` 를 사용하여 원하는 만큼의 규칙을 만들 수 있다:

```jsx
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  root: {
    width: '100%',
    maxWidth: 800,
    minHeight: 40,
  },
  child: {
    backgroundColor: 'black',
    marginBlock: '1rem',
  },
});

const colorStyles = stylex.create({
  red: {
    backgroundColor: 'red',
    borderColor: 'darkred',
  },
  green: {
    backgroundColor: 'lightgreen',
    borderColor: 'darkgreen',
  },
});

function ReactDiv({ color, isActive, style }) {
  /* ... */
}
```

### 스타일 사용하기 {#use-style}

스타일을 사용하려면 `props()` 함수에 전달하면 된다. 스타일은 표준 JavaScript 표현식을 사용하여 조건부로 결합하고 적용할 수 있다.

```jsx
import * as React from 'react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({ ... });
const colorStyles = stylex.create({ ... });

function ReactDiv({ color, isActive, style }) {
  return <div {...stylex.props(
    styles.main,
    // 조건부로 스타일 적용
    isActive && styles.active,
    // 프로퍼티로 스타일 선택
    colorStyles[color],
    // 프로퍼티로 전달된 스타일
    style,
  )} />;
}
```

위의 예는 JSX를 사용한다. StyleX 자체는 프레임워크에 구애받지 않는다. 동일한 코드는 SolidJS, Preact 또는 Qwik과 같이 `className` 문자열 및 `style` 객체를 허용하는 다른 프레임워크에서도 작동한다.

## 이상적인 사용 사례 {#ideal-use-cases}

StyleX는 다양한 프로젝트에서 잘 작동하지만 특정 사용 사례의 과제를 해결하도록 설계되었다.

### 자바스크립트로 작성된 UI {#authoring-ui-in-javascript}

StyleX는 CSS-in-JS 라이브러리이므로 앱의 UI가 자바스크립트로 작성된 경우에 가장 유용하다. 애플리케이션이 React, Preact, Solid, lit-html 또는 Angular와 같은 프레임워크를 사용하는 경우 StyleX를 사용하는 것이 좋다.

Svelte 및 Vue와 같은 일부 프레임워크는 빌드 시점에 JavaScript로 컴파일되는 사용자 정의 파일 형식을 사용한다. 이러한 프레임워크에서도 StyleX를 사용할 수 있지만 일부 사용자 정의 구성이 필요할 수 있다.

### 대규모 프로젝트 {#large-projects}

StyleX는 모든 규모의 프로젝트에 적합하지만, 특히 대규모 애플리케이션에서 그 진가를 발휘한다.

StyleX는 아토믹 클래스 이름으로 컴파일되기 때문에 프로젝트가 커짐에 따라 CSS 번들의 크기가 일정 수준을 유지한다는 큰 성능상의 이점이 있다.

### 재사용가능한 컴포넌트 {#reusable-components}

StyleX는 재사용 가능한 UI 컴포넌트와 함께 사용할 때 가장 큰 장점을 발휘한다.

수년 동안 스타일이 기본 제공되지만 커스터마이징이 어려운 '디자인 시스템' 컴포넌트나 스타일이 전혀 없는 '헤드리스' 컴포넌트 중 하나를 선택해야 했다.

StyleX를 통해 개발자는 기본 스타일이 있으면서도 사용자 정의가 가능한 UI 컴포넌트를 만들 수 있다.

또한 일관성을 통해 이러한 컴포넌트를 NPM에 배포하여 공유할 수 있습니다. 컴포넌트의 소비자도 StyleX를 사용하는 한, 추가 구성 없이 스타일이 병합되어 올바르게 구성된다.
