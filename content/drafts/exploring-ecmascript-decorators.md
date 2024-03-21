---
title: EcmaScript 데코레이터 알아보기
description:
date: 2024-03-21
tags: [javascript, decorator, 번역]
references:
  [
    {
      key: 'Medium 원문',
      value: 'https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841',
    },
  ]
---

[이터레이터(Iterators)](http://jakearchibald.com/2014/iterators-gonna-iterate/), [제너레이터(generators)](http://www.2ality.com/2015/03/es6-generators.html), [배열](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions) 등... 시간이 지날수록 자바스크립트와 파이썬의 유사성은 계속 증가하고 있다. 오늘은 ECMAScript의 다음 파이썬 제안인 [데코레이터(Decorators)](https://github.com/wycats/javascript-decorators)에 대해 알아본다.

## 데코레이터 패턴 {#the-decorator-pattern}

데코레이터란 무엇일까? 파이썬에서 데코레이터는 고차 함수를 호출하기 위한 매우 간단한 구문을 제공한다. 파이썬 데코레이터는 **다른 함수를 직접 수정하지 않고 해당 함수의 동작을 확장하는 함수다.** 가장 단순한 파이썬 데코레이터는 다음과 같다:

![](https://miro.medium.com/v2/resize%3Afit%3A640/format%3Awebp/1%2ANp2xWAiiQmq9LfwOquDOuQ.png)

맨 위의 `@mydecorator` 가 데코레이터이며, ES2016(ES7)에서도 형태가 크게 다르지 않을 것이다!

`@` 는 파서에게 데코레이터를 사용한다는 것을 알려주며, `mydecorator` 는 해당 이름의 함수를 참조한다. 우리의 데코레이터는 인자(데코레이팅되는 함수)를 받아 추가 기능이 더해진 동일한 함수를 반환한다.

데코레이터는 투명하게 추가 기능을 감싸고 싶은 모든 것에 유용하다. 여기에는 메모이제이션, 접근 제어 및 인증 강제, 계측 및 타이밍 함수, 로깅, 요청 제한 등이 포함되며 그 밖에도 더 많은 경우가 있다.

## ES6에서의 데코레이터 {#decorators-in-es6}

ES5에서 명령형 데코레이터(pure functions)를 구현하는 것은 간단하다. ES2015(이전 ES6)에서는 클래스가 확장을 지원하지만, **여러 클래스가 단일 기능을 공유해야 하는 경우** 더 나은 방법이 필요하다.

이번 데코레이터 제안은 자바스크립트 클래스, 프로퍼티 및 객체 리터럴의 설계 시점에 주석 달고 수정할 수 있도록 하면서도 선언적 구문을 유지하고자 한다.

ES2016 데코레이터 동작을 살펴보자!

## ES2016 데코레이터 {#es2016-decorators-in-action}

ES2016 데코레이터는 함수를 반환하는 식(expression)으로, target, name 및 property descriptor를 인자로 받을 수 있다. `@` 문자로 접두사를 붙이고 데코레이팅하려는 대상 맨 위에 놓으면 적용된다. 데코레이터는 클래스 또는 프로퍼티에 사용할 수 있다.

### 프로퍼티 데코레이팅 {#decorating-property}

기본적인 `Cat` 클래스를 살펴보자:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2AvgZrCKk9PtyCAkUQdJC1Dg.png)

이 클래스를 평가하면 다음과 같이 `Cat.prototype` 에 `meow` 함수를 추가하게 된다:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2ArsumqLVuE3FaFZy5mKBZSg.png)

프로퍼티나 메서드 이름을 읽기 전용으로 만들고 싶다고 가정해보자. 데코레이터는 프로퍼티를 정의하는 구문 앞에 온다. 따라서 `@readonly` 데코레이터는 다음과 같이 정의할 수 있다:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2A1rWYZ3XAjD-6Eu1Y_7x8QA.png)

그리고 데코레이터를 다음과 같이 `meow` 프로퍼티에 추가한다:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2AKDIo38_mEWYLS-s2kvsIiw.png)

데코레이터는 평가될 표현식일 뿐이며 함수를 반환해야 한다. 그렇기 때문에 `@readonly` 와 `@something(parameter)` 모두 작동할 수 있다.

이제 `Cat.prototype`에 descriptor를 설치하기 전에 엔진이 먼저 데코레이터를 호출한다:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2AhSy8oLzgqEHKOOnX8dzdRg.png)

이제 `meow` 는 읽기 전용이 된다. 다음과 같이 이 동작을 확인할 수 있다:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2AMv24M1ipQtk-HqX3pRr9Hw.png)

재미있지 않은가? 잠시 후에 데코레이션 클래스에 대해 살펴볼 예정이지만, 우선 라이브러리에 대해 잠시 살펴보자. 아직 시작 단계임에도 불구하고 제이 펠프스(https://github.com/jayphelps/core-decorators.js)의 라이브러리를 비롯해 2016 데코레이터에 대한 라이브러리들이 이미 등장하기 시작했다.

위의 읽기 전용 프로퍼티에 대한 시도와 유사하게, 이 라이브러리에는 `@readonly`에 대한 자체 구현이 포함되어 있으며, 임포트만 하면 된다:

![](https://miro.medium.com/v2/resize%3Afit%3A1100/format%3Awebp/1%2AFJIBx1JqlHmMlRPNVa5glQ.png)

또한 API에 메서드가 변경될 가능성이 있다는 힌트가 필요할 때를 대비해 `@deprecate` 와 같은 다른 데코레이터 유틸리티도 포함되어 있다:

> 사용 중단 메시지와 함께 `console.warn()` 을 호출한다. 기본 메시지를 재정의하려면 커스텀 메시지를 입력한다. 추가적인 내용을 위해 URL과 함께 옵션 해시를 제공할 수도 있다.

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2ARZcsUApI6TGaIPnD9syfFw.png)

### 클래스 데코레이팅 {#decorating-class}

다음으로 데코레이터 클래스를 살펴보자. 이 경우, 제안된 사양에 따라 데코레이터는 대상 생성자를 취한다. 가상의 `MySuperHero` 클래스의 경우 `@superhero` 데코레이션을 사용하여 다음과 같이 간단한 데코레이터를 정의할 수 있다:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2AwRKeM_ZJmeqZoD-2sXrvlQ.png)

이를 더 확장하여 데코레이터 함수를 팩토리로 정의하기 위한 인자를 제공할 수 있다:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2AHAL1EWF3ekb1nJBskLKRyg.png)

ES2016 데코레이터는 프로퍼티 디스크립터와 클래스에서 작동한다. 곧 다룰 내용이지만 데코레이터는 프로퍼티 이름과 대상 객체를 자동으로 전달받는다. 디스크립터에 액세스하면 데코레이터가 프로퍼티가 getter를 사용하도록 변경하는 등의 작업을 수행할 수 있으므로 프로퍼티에 처음 액세스할 때 현재 인스턴스에 메서드를 자동으로 바인딩하는 등 번거로울 수 있는 동작을 수행할 수 있다.

### ES2016 데코레이터 및 믹스인 {#es2016-decorators-and-mixins}

나는 Reg Braithwaite의 최근 기사 ['ES2016 Decorators as mixins'](http://raganwald.com/2015/06/26/decorators-in-es7.html) 과 그 전신인 ['Functional Mixins'](http://raganwald.com/2015/06/17/functional-mixins.html) 를 읽는 것을 매우 즐겼다. Reg는 클래스 프로토타입이나 독립적인 대상에 행동을 혼합하는 헬퍼를 제안했고, 이어서 클래스 전용 버전을 설명했다. 인스턴스 행동을 클래스의 프로토타입에 혼합하는 함수형 믹스인은 다음과 같다:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2AbB77ghg773qnwCA1aeKPBg.png)

좋다. 이제 몇 가지 믹스인을 정의하고 이를 사용하여 클래스를 꾸밀 수 있다. 간단한 `ComicBookCharacter` 클래스가 있다고 가정해 보자:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2A1YMyHF0gp8F4mVRBtloJ-A.png)

이것은 세상에서 가장 지루한 캐릭터일 수 있지만, `SuperPowers` 와 `UtilityBelt` 를 부여하는 동작을 제공하는 몇 가지 믹스인을 정의할 수 있다. Reg의 믹스인 헬퍼를 사용해 이 작업을 해보자:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2A2a3HCBjjQSPZcoER0rSFsg.png)

이제 `@` 구문을 믹스인 함수의 이름과 함께 사용하여 `ComicBookCharacter` 를 원하는 동작으로 데코레이션할 수 있다. 클래스 앞에 여러 개의 데코레이터 문을 접두사로 붙이는 방법에 주목한다:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2AjbX4pzw31FBNp-2QgnfCew.png)

이제 정의한 내용을 사용하여 배트맨 캐릭터를 만들어 본다.

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2A_4pUUwbwlqTdBTxV-X111g.png)

이러한 클래스 데코레이터는 비교적 간결하며, 함수 호출 대신 또는 고차 컴포넌트의 헬퍼로 사용할 수 있다.

## 바벨을 통해서 데코레이터 사용하기 {#enabling-decortors-via-babel}

데코레이터는 (이 글을 쓰는 시점에서) 아직 제안에 불과하며 아직 승인되지도 않았다. 하지만 다행히도 바벨은 실험 모드에서 구문 변환을 지원하므로 이 글의 대부분의 샘플을 직접 사용해 볼 수 있다.

Babel CLI를 사용하는 경우 다음과 같이 데코레이터를 옵트인할 수 있다:

```bash
babel --optional es7.decorators
```

또는 transformer를 사용하여 활성화 할 수 있다:

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2A9dlzSG1EqMCpH-dk1RZ5xg.png)

'Experimental' 확인란을 눌러 데코레이터를 활성화하면 [온라인 바벨 REPL](https://babeljs.io/repl/)에서도 이용할 수 있다.

## 흥미로운 실험 {#interesting-experiments}

운 좋게도 내 옆자리에 있는 Paul Lewis는 DOM을 읽고 쓰는 코드를 리스케줄링하기 위한 수단으로 데코레이터를 실험해왔다. Wilson Page의 FastDOM 아이디어를 차용했지만 더 간소한 API를 제공한다. Paul의 read/write 데코레이터는 @write(또는 @read 중 DOM 변경) 시 레이아웃을 트리거하는 메서드나 프로퍼티를 호출하면 콘솔에 경고를 표시할 수도 있다.

아래는 Paul의 실험에서 가져온 샘플로, @read 안에서 DOM을 변경하려 하면 콘솔에 경고가 표시된다.

![](https://miro.medium.com/v2/resize%3Afit%3A720/format%3Awebp/1%2AA3gYGXlTPdXGtCkfgK_NRA.png)

## 지금 데코레이터를 사용해 보자! {#go-try-decorators-now}

단기적으로 ES2016 데코레이터는 선언적 데코레이션과 주석 달기, 타입 체킹, ES2015 클래스에 데코레이터 적용의 어려움을 해결하는 데 유용하다. 장기적으로는 정적 분석(컴파일 시 타입 검사 또는 자동완성 도구로 이어질 수 있음)에 매우 유용할 수 있다.

클래식 OOP의 데코레이터와 크게 다르지 않다. 이 패턴을 통해 객체는 동일한 클래스의 객체에 영향을 주지 않고 정적 또는 동적으로 행동으로 데코레이팅될 수 있다. 이것은 멋진 추가라고 생각한다. 그러나 클래스 프로퍼티 데코레이터의 의미론은 여전히 변화 중이므로 Yehuda의 저장소를 지켜보자.

현재 라이브러리 작성자들은 데코레이터가 믹스인을 대체할 수 있는지 논의 중이며, 확실히 **React에서 고차 컴포넌트로 사용될 수 있다.**

개인적으로 데코레이터 사용에 대한 실험이 증가하기를 기대하며, Babel을 사용해 데코레이터를 사용해보고 재사용 가능한 데코레이터를 찾아내며, 심지어 Paul이 그렇게 했던 것처럼 여러분의 작업을 공유하기를 바란다.

## 추가 자료 {#further-reading-and-references}

- [https://github.com/wycats/javascript-decorators](https://github.com/wycats/javascript-decorators)
- [https://github.com/jayphelps/core-decorators.js](https://github.com/jayphelps/core-decorators.js)
- [http://blog.developsuperpowers.com/eli5-ecmascript-7-decorators/](http://blog.developsuperpowers.com/eli5-ecmascript-7-decorators/)
- [http://elmasse.github.io/js/decorators-bindings-es7.html](http://elmasse.github.io/js/decorators-bindings-es7.html)
- [http://raganwald.com/2015/06/26/decorators-in-es7.html](http://raganwald.com/2015/06/26/decorators-in-es7.html)
- [Jay’s function expression ES2016 Decorators example](<https://babeljs.io/repl/#?experimental=true&evaluate=true&loose=false&spec=false&playground=true&code=class%20Foo%20%7B%0A%20%20%40function%20(target%2C%20key%2C%20descriptor)%20%7B%20%20%20%0A%20%20%20%20descriptor.writable%20%3D%20false%3B%20%0A%20%20%20%20return%20descriptor%3B%20%0A%20%20%7D%0A%20%20bar()%20%7B%0A%20%20%20%20%0A%20%20%7D%0A%7D&stage=0>)
