---
title: 릴리즈 0.6.1
description: StyleX v0.6.1이 출시되었다. 이번 릴리스에서는 CSS 커스텀 프로퍼티(aka "변수")와 관련된 주요 개선 사항과 다양한 버그 수정이 이루어졌다.
date: 2024-05-02
tags: []
references:
  [{ key: 'StyleX 공식 블로그', value: 'https://stylexjs.com/blog/v0.6.1/' }]
---

## 변수 관련 개선 사항 {#improvements-from-variables}

변수와 테마 작업을 위한 새로운 기능과 개선 사항이 추가되었다.

### 변수의 폴백 값 {#fallback-values-for-variables}

`stylex.defineVars` 로 정의된 변수에 이제 폴백 값을 설정할 수 있다. 이를 위해 새로운 API가 도입된 것은 아니다. 대신, 기존의 `stylex.firstThatWorks` 가 변수를 인수로 받을 수 있도록 확장되었다.

```ts
import * as stylex from '@stylexjs/stylex';
import { colors } from './tokens.stylex';

const styles = stylex.create({
  container: {
    color: stylex.firstThatWorks(colors.primary, 'black'),
  },
});
```

폴백 변수 리스트도 지원한다.

### 타입이 지정된 변수 {#typed-variables}

StyleX는 CSS 변수에 `<syntax>` 타입을 정의하기 위해 새로운 API 세트를 도입했다. 이 API를 사용하면 생성된 CSS 출력에서 `@property` 규칙을 활용하여 CSS 변수에 애니메이션을 적용하거나 다른 특별한 용도로 사용할 수 있다.

`stylex.types.*` 함수는 변수를 정의할 때 해당 변수의 타입을 정의하는 데 사용된다.

```ts
import * as stylex from '@stylexjs/stylex';

const typedTokens = stylex.defineVars({
  bgColor: stylex.types.color<string>({
    default: 'cyan',
    [DARK]: 'navy',
  }),
  cornerRadius: stylex.types.length<string | number>({
    default: '4px',
    '@media (max-width: 600px)': 0,
  }),
  translucent: stylex.types.number<number>(0.5),
  angle: stylex.types.angle<string>('0deg'),
  shortAnimation: stylex.types.time<string>('0.5s'),
});
```

변수에 타입이 지정되면 `stylex.keyframes` 를 사용하여 다른 CSS 속성처럼 애니메이션을 적용할 수 있다.

```ts
import * as stylex from '@stylexjs/stylex';
import { typedTokens } from './tokens.stylex';

const rotate = stylex.keyframes({
  from: { [typedTokens.angle]: '0deg' },
  to: { [typedTokens.angle]: '360deg' },
});

const styles = stylex.create({
  gradient: {
    backgroundImage: `conic-gradient(from ${tokens.angle}, ...colors)`,
    animationName: rotate,
    animationDuration: '10s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
});
```

이를 통해 conic-gradient의 `angle` 에 애니메이션을 적용하는 등 다양한 효과를 만들어낼 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/stylex-blog-release-0.6.1/1.png)

이 새로운 기능은 CSS 타입에 초점을 맞추고 있지만, 새로운 API는 TypeScript(또는 Flow)에서 변수의 타입을 보다 명확하게 정의할 수 있게 해준다.

예제에서 볼 수 있듯이, 제네릭 타입 매개변수를 사용하여 `stylex.createTheme` 로 테마를 생성할 때 변수가 가질 수 있는 값의 범위를 제한할 수 있다.

## ESlint 플러그인 {#eslint-plugin}

### 새로운 `sort-keys` 규칙 {#new-sort-keys-rule}

StyleX ESlint 플러그인에 새로운 `sort-keys` 규칙이 추가되었다. 이 규칙은 StyleX 스타일의 키 순서를 일관되게 유지하기 위한 스타일 규칙이다.

### `valid-styles` 규칙의 `propLimits` 개선 {#improvements-to-propLimits-for-valid-styles-rule}

`valid-styles` 규칙이 개선되어 보다 표현력 있는 "prop limits"를 허용하게 되었습니다.

## 기타 {#miscellaneous}

1. ESlint의 'valid-styles' 규칙 개선:
   - 이제 동적 스타일 내에서 `stylex.defineVars` 로 생성된 변수를 키로 사용할 수 있다.
   - 이 변경 사항은 동적 스타일에서 변수를 더욱 유연하게 활용할 수 있게 해줍니다.
   - 예를 들어, 다음과 같이 동적 스타일에서 변수를 키로 사용할 수 있다:

```javascript
const styles = stylex.create({
  dynamic: {
    [myVariable]: '10px',
  },
});
```

2. `stylex.include` API 버그 수정:

   - `stylex.include` 는 실험적인 API로, 다른 스타일 객체를 포함하는 기능을 제공한다.
   - 이번 업데이트에서는 이 API와 관련된 버그가 수정되었다.
   - 버그 수정으로 인해 `stylex.include` 를 사용할 때 더욱 안정적으로 동작할 것으로 기대된다.

3. `stylex.createTheme` 의 디버그 클래스 이름 생성 수정:

   - `stylex.createTheme` 을 사용하여 테마를 생성할 때, 디버그 모드에서는 클래스 이름에 테마 정보가 포함된다.
   - 이번 업데이트에서는 디버그 클래스 이름 생성 로직이 수정되었다.
   - 수정된 로직은 테마 정보를 더욱 명확하고 일관성 있게 표시한다.

4. `0` 값에서 단위 제거 방지:

   - 이전 버전에서는 값이 `0` 인 경우 해당 값에서 단위가 제거되는 문제가 있었다.
   - 예를 들어, `margin: 0px` 로 지정한 경우 `margin: 0`으로 변환되었다.
   - 이번 업데이트에서는 이 문제가 수정되어, `0` 값에서도 지정된 단위가 유지된다.

5. 컴파일 관련 버그 수정:
   - StyleX의 컴파일 과정에서 발생하던 몇 가지 버그가 수정되었다.
   - 이는 StyleX 코드를 CSS로 변환할 때의 안정성과 정확성을 향상시킬 것이다.
   - 컴파일 버그 수정으로 인해 StyleX를 사용하는 개발자는 더욱 신뢰할 수 있는 결과를 얻을 수 있다.

우리의 [Ecosystem](https://stylexjs.com/docs/learn/ecosystem/) 페이지는 커뮤니티 프로젝트와 함께 계속 성장하고 있다. StyleX 스타일을 정렬하기 위한 [Prettier 플러그인](https://github.com/nedjulius/prettier-plugin-stylex-key-sort)도 포함되어 있다.
