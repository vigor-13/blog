---
title: 빠른 시작
description: Style Dictionary 빠르게 살펴보기
date: 2024-01-19
tags: []
references:
  [
    {
      key: 'Style Dictionary 공식 문서',
      value: 'https://amzn.github.io/style-dictionary/#/quick_start',
    },
  ]
---

## 설치

CLI를 사용하려면 NPM을 통해 전역으로 설치할 수 있다:

```bash
npm install -g style-dictionary
```

또는 일반 NPM 의존성처럼 설치할 수 있다. 스타일 사전은 빌드 도구이므로 아마도 dev dependency로 사용할 것이다:

```bash
npm install -D style-dictionary
```

## 새 프로젝트 만들기

CLI에는 새 프로젝트를 쉽게 시작할 수 있는 몇 가지 시작 코드가 포함되어 있다.

```bash
mkdir MyStyleD
cd MyStyleD
style-dictionary init basic
```

이 명령은 이 레포지토리의 [기본 예제](https://github.com/amzn/style-dictionary/tree/main/examples/basic)에 있는 예제 파일을 복사한 다음 `style-dictionary build` 명령을 실행하여 빌드 아티팩트를 생성한다. 다음과 같은 결과가 표시된다:

```text
Copying starter files...

Source style dictionary starter files created!

Running `style-dictionary build` for the first time to generate build artifacts.


scss
✔︎  build/scss/_variables.scss

android
✔︎  build/android/font_dimens.xml
✔︎  build/android/colors.xml

compose
✔︎ build/compose/StyleDictionaryColor.kt
✔︎ build/compose/StyleDictionarySize.kt

ios
✔︎  build/ios/StyleDictionaryColor.h
✔︎  build/ios/StyleDictionaryColor.m
✔︎  build/ios/StyleDictionarySize.h
✔︎  build/ios/StyleDictionarySize.m

ios-swift
✔︎  build/ios-swift/StyleDictionary.swift

ios-swift-separate-enums
✔︎  build/ios-swift/StyleDictionaryColor.swift
✔︎  build/ios-swift/StyleDictionarySize.swift
```

첫 번째 스타일 사전을 만들었다! 결과물을 살펴보자. `build` 디렉터리가 다음과 같은 구조로 생성될 것이다.

```text
├── README.md
├── config.json
├── tokens/
│   ├── color/
│       ├── base.json
│       ├── font.json
│   ├── size/
│       ├── font.json
├── build/
│   ├── android/
│      ├── font_dimens.xml
│      ├── colors.xml
│   ├── compose/
│      ├── StyleDictionaryColor.kt
│      ├── StyleDictionarySize.kt
│   ├── scss/
│      ├── _variables.scss
│   ├── ios/
│      ├── StyleDictionaryColor.h
│      ├── StyleDictionaryColor.m
│      ├── StyleDictionarySize.h
│      ├── StyleDictionarySize.m
│   ├── ios-swift/
│      ├── StyleDictionary.swift
│      ├── StyleDictionaryColor.swift
│      ├── StyleDictionarySize.swift
```

`config.json`을 열면 3가지 플랫폼이 정의되어 있는 것을 볼 수 있다: `scss`, `android`, `ios`. 각 플랫폼에는 `transformGroup`, `buildPath` 및 `files`이 정의되어 있다. 플랫폼의 `buildPath` 와 `files` 은 빌드된 파일과 일치해야 한다.

:::tabs

@tab:active Android#android

```xml
<!-- font_dimens.xml -->
<resources>
  <dimen name="size_font_small">12.00sp</dimen>
  <dimen name="size_font_medium">16.00sp</dimen>
  <dimen name="size_font_large">32.00sp</dimen>
  <dimen name="size_font_base">16.00sp</dimen>
</resources>

<!-- colors.xml -->
<resources>
  <color name="color_base_gray_light">#ffcccccc</color>
  <color name="color_base_gray_medium">#ff999999</color>
  <color name="color_base_gray_dark">#ff111111</color>
  <color name="color_base_red">#ffff0000</color>
  <color name="color_base_green">#ff00ff00</color>
  <color name="color_font_base">#ff111111</color>
  <color name="color_font_secondary">#ff999999</color>
  <color name="color_font_tertiary">#ffcccccc</color>
</resources>
```

@tab Compose#compose

```text
object StyleDictionaryColor {
  val colorBaseGrayDark = Color(0xff111111)
  val colorBaseGrayLight = Color(0xffcccccc)
  val colorBaseGrayMedium = Color(0xff999999)
  val colorBaseGreen = Color(0xff00ff00)
  val colorBaseRed = Color(0xffff0000)
  val colorFontBase = Color(0xffff0000)
  val colorFontSecondary = Color(0xff00ff00)
  val colorFontTertiary = Color(0xffcccccc)
}

object StyleDictionarySize {
  /** the base size of the font */
  val sizeFontBase = 16.00.sp
  /** the large size of the font */
  val sizeFontLarge = 32.00.sp
  /** the medium size of the font */
  val sizeFontMedium = 16.00.sp
  /** the small size of the font */
  val sizeFontSmall = 12.00.sp
}
```

@tab SCSS#scss

```scss
$color-base-gray-light: #cccccc;
$color-base-gray-medium: #999999;
$color-base-gray-dark: #111111;
$color-base-red: #ff0000;
$color-base-green: #00ff00;
$color-font-base: #ff0000;
$color-font-secondary: #00ff00;
$color-font-tertiary: #cccccc;
$size-font-small: 0.75rem;
$size-font-medium: 1rem;
$size-font-large: 2rem;
$size-font-base: 1rem;
```

@tab iOS#ios

```swift
#import "StyleDictionaryColor.h"

@implementation StyleDictionaryColor

+ (UIColor *)color:(StyleDictionaryColorName)colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
[UIColor colorWithRed:0.800f green:0.800f blue:0.800f alpha:1.000f],
[UIColor colorWithRed:0.600f green:0.600f blue:0.600f alpha:1.000f],
[UIColor colorWithRed:0.067f green:0.067f blue:0.067f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:1.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:1.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.800f green:0.800f blue:0.800f alpha:1.000f]
    ];
  });

  return colorArray;
}

@end
```

:::

꽤 멋지다! 이것은 몇 가지 일이 일어나고 있음을 보여준다:

1. 빌드 시스템은 `config.json`의 `source` 속성에 정의된 모든 디자인 토큰 파일에 대해 딥 병합을 수행한다. 때문에 디자인 토큰 파일을 원하는 대로 분할할 수 있다. `color`를 최상위 키로 하는 2개의 JSON 파일이 있지만 제대로 병합된다.
2. 빌드 시스템은 다른 디자인 토큰에 대한 참조를 확인한다. `{size.font.medium.value}`가 제대로 리졸브된다.
3. 빌드 시스템은 다른 파일에 있는 디자인 토큰 값에 대한 참조도 처리한다(`tokens/color/font.json`에서 볼 수 있듯이).
4. 값은 각 플랫폼에 맞게 특별히 변환된다.

## 변경사항 적용하기

이제 변경 사항을 적용하여 어떤 영향을 미치는지 살펴보자. `tokens/color/base.json`을 열고 `#111111`을 `#000000`으로 변경한다. 변경한 후 파일을 저장하고 빌드 명령 `style-dictionary build`를 다시 실행한다. 빌드 파일을 열고 살펴본다.

:::tabs

@tab:active Android#android

```xml
<!-- colors.xml -->
<resources>
  <color name="color_base_gray_light">#ffcccccc</color>
  <color name="color_base_gray_medium">#ff999999</color>
  <color name="color_base_gray_dark">#ff000000</color>
  <color name="color_base_red">#ffff0000</color>
  <color name="color_base_green">#ff00ff00</color>
  <color name="color_font_base">#ffff0000</color>
  <color name="color_font_secondary">#ff00ff00</color>
  <color name="color_font_tertiary">#ffcccccc</color>
</resources>
```

@tab Compose#compose

```text
object StyleDictionaryColor {
  val colorBaseGrayDark = Color(0xff000000)
  val colorBaseGrayLight = Color(0xffcccccc)
  val colorBaseGrayMedium = Color(0xff999999)
  val colorBaseGreen = Color(0xff00ff00)
  val colorBaseRed = Color(0xffff0000)
  val colorFontBase = Color(0xffff0000)
  val colorFontSecondary = Color(0xff00ff00)
  val colorFontTertiary = Color(0xffcccccc)
}
```

@tab SCSS#scss

```scss
$color-base-gray-light: #cccccc;
$color-base-gray-medium: #999999;
$color-base-gray-dark: #000000;
$color-base-red: #ff0000;
$color-base-green: #00ff00;
$color-font-base: #ff0000;
$color-font-secondary: #00ff00;
$color-font-tertiary: #cccccc;
```

@tab iOS#ios

```swift
[UIColor colorWithRed:0.800f green:0.800f blue:0.800f alpha:1.000f],
[UIColor colorWithRed:0.600f green:0.600f blue:0.600f alpha:1.000f],
[UIColor colorWithRed:0.000f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:1.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:1.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.800f green:0.800f blue:0.800f alpha:1.000f]
```

:::

여기까지다! 스타일 사전으로 할 수 있는 일은 색상 값으로 파일을 생성하는 것 외에도 훨씬 더 많다. 몇 가지 [예시](https://amzn.github.io/style-dictionary/#/examples)를 살펴보거나 [패키지 구조](), [확장]() 또는 [빌드 프로세스]()의 작동 방식에 대해 자세히 알아볼 수 있다.

## 기본 사용법

### CLI

```bash
style-dictionary build
```

프로젝트의 루트 디렉터리에서 위의 명령을 실행한다, 프로젝트 루트에는 [구성]() 파일이 포함되어야 한다.

스타일 사전 CLI 사용법에 대한 자세한 정보는 [여기]()에서 확인할 수 있다.

### Node

기능을 [확장]()하거나 Grunt 또는 Gulp와 같은 다른 빌드 시스템에서 사용하려는 경우 노드에서 스타일 사전 빌드 시스템을 사용할 수도 있다.

```js
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.buildAllPlatforms();
```

`.extend()` 메서드는 [구성]() 객체를 받을 수 있다.

```js
const StyleDictionary = require('style-dictionary').extend({
  source: ['tokens/**/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [
        {
          destination: 'variables.scss',
          format: 'scss/variables',
        },
      ],
    },
    // ...
  },
});

StyleDictionary.buildAllPlatforms();
```

스타일 사전 NPM 모듈 사용에 대한 자세한 내용은 [여기]()에서 확인할 수 있다.
