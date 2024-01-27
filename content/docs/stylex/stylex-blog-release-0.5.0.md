---
title: 릴리즈 0.5.0
description:
date: 2024-01-28
tags: []
references:
  [{ key: 'StyleX 공식 블로그', value: 'https://stylexjs.com/blog/v0.5.0/' }]
---

몇 가지 큰 개선 사항과 수정 사항이 포함된 Stylex v0.5.0을 출시하게 되어 기쁘다!

## 새로운 stylex.attrs 함수 {#new-stylex-attrs-function}

`stylex.props` 함수는 `className` 문자열과 `style` 객체가 있는 객체를 리턴한다. 일부 프레임워크는 `className` 대신 `class` 를, `style` 은 문자열 값을 요구할 수 있다.

StyleX가 더 많은 곳에서 잘 작동할 수 있도록 새로운 `stylex.attrs` 함수를 도입한다. `stylex.attrs` 는 `class` 문자열과 `style` 문자열이 포함된 객체를 리턴한다.

## ESLint를 위한 새로운 sort-keys 규칙 {#new-sort-keys-rule-for-the-eslint-plugin}

스타일을 알파벳순 및 우선순위에 따라 정렬하는 새로운 `@stylexjs/sort-keys` 플러그인이 도입되었다. 이를 통해 미디어 쿼리 순서를 보다 예측 가능하게 만들 수 있다.

## StyleX 바벨 플러그인을 위한 새로운 aliases 옵션 {#new-aliases-option-for-the-stylex-babel-plugin}

새 `aliases` 필드를 사용하여 `tsconfig` 파일에 설정할 수 있는 사용자 정의 별칭을 확인하도록 StyleX를 구성할 수 있다.

:::note
현재 StyleX에서 별칭은 절대 경로로 구성해야 한다.
:::

## 새로운 ESbuild 플러그인 {#new-esbuild-plugin}

Esbuild의 새로운 공식 플러그인으로 `@stylexjs/esbuild-plugin`가 도입 되었다.

## 그 밖의 개선 사항 {#other-enhancements}

- 이제 StyleX 바벨 플러그인에 전달된 구성 옵션의 유효성이 검사된다.
- 이제 `@stylexjs/stylex` 에 commonJS export와 함께 ESM export가 있다.
- 빈 문자열을 문자열 값으로 사용할 때 ESLint `valid-styles` 규칙에 잡힌다.

## 버그 수정 {#bug-fixes}

- 이전에 타입 및 린트 오류를 일으켰던 일부 CSS 속성이 이제 허용된다.
- `opacity` 에 변수를 사용해도 더 이상 타입 오류가 발생하지 않는다.
- 이제 `stylex.defineVars` 내에서 `stylex.keyframes` 를 사용하면 정상적으로 작동한다.
- 런타임 주입이 올바르게 처리된다.
- `defineVars` 에서 변수 값을 동적 스타일로 설정하는 것이 이제 정상적으로 작동한다.
- CSS 함수 내에서 `0px` 사용은 특정 경우에 작동하지 않으므로 더 이상 단위가 없는 `0`으로 단순화되지 않는다.
- CSS 연산자 주변의 공백은 유지된다.

이 외에도 웹사이트에 '에코시스템' 페이지를 추가하여 StyleX와 관련된 다양한 커뮤니티 프로젝트를 소개한다.
