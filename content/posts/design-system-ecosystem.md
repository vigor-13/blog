---
title: 디자인 시스템 - 에코시스템
description:
date: 2024-02-13
tags: [design_system, atomic_design]
references:
  [
    {
      key: 'Brad Frost Blog',
      value: 'https://bradfrost.com/blog/post/the-design-system-ecosystem/',
    },
  ]
---

![디자인 시스템과 애플리케이션의 관계](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/1.png)

디자인 시스템과 애플리케이션은 서로 영향을 주고받으며 성장한다. 이렇게만 보면 단순한 이야기 같지만 개발 환경이 발전하고 시스템이 성숙해질수록 그 과정 속에는 많은 디테일이 더해진다.

디자인 시스템과 애플리케이션의 상호작용 과정을 이해하기 위해서 계층 구조를 그리는 것이 도움이 된다.

![디자인 시스템의 에코시스템 레이어](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/2.png)

이러한 계층 구조 전체를 디자인 시스템 에코시스템이라고 한다.

엔터프라이즈급의 디자인 시스템은 엄청난 디테일을 보여준다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/3.gif)

다만 모든 조직에서 위와 같은 수준의 에코시스템을 구축할 필요는 없다. 그저 대기업 수준에서 성숙한 디자인 시스템이 어떤 모습일지 보여주는 예시일 뿐이다.

> 작동하는 복잡한 시스템은 항상 작동하는 단순한 시스템에서 진화한 것으로 밝혀진다. 처음부터 설계된 복잡한 시스템은 절대 작동하지 않으며, 작동하도록 패치할 수도 없다. 작동하는 단순한 시스템에서 다시 시작해야 한다. - [Gall의 법칙](<https://en.wikipedia.org/wiki/John_Gall_(author)#Galls_law>) -

> 디자인 시스템 아키텍처는 필요한 만큼만 복잡하게 만들고, 실제 요구가 발생할 때만 추가 계층이나 복잡성을 추가하는 것이 중요하다. 디자인 시스템을 성장시키는 것은 점진적인 과정이다. - Brad frost -

이제 각 레이어를 하나씩 알아보자.

## 에코시스템 분석 {#ecosystem-overview}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/4.png)

| 레이어                        | 설명                                         |
| ----------------------------- | -------------------------------------------- |
| **핵심 디자인 시스템 레이어** | 조적 전반의 공통 UI 빌딩 블록                |
| **기술별 구현 레이어**        | 공통 UI 컴포넌트를 프레임워크별로 구현       |
| **레시피 레이어**             | 특정 애플리케이션에서만 사용되는 UI 컴포넌트 |
| **스마트 컴포넌트 레이어**    | 공통 UI 컴포넌트와 공통 서비스 로직 통합     |
| **프로덕트 레이어**           | 실제 애플리케이션                            |

각 레이어에는 다음과 같은 유형의 에셋이 포함된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/5.png)

| 에셋                  | 설명                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------ |
| **디자인 라이브러리** | Figam 팀 라이브러리 등...                                                            |
| **디자인 파일**       | Figma 프로젝트 파일 등...                                                            |
| **코드 저장소**       | Github 등...                                                                         |
| **프론트엔드 워크샵** | 스토리북(코딩된 UI 컴포넌트 빌드, 확인, 테스트, 검토 및 문서화할 수 있는 도구) 등... |
| **코드 패키지**       | NPM 등에 게시한 코드 패키지                                                          |
| **참조 웹사이트**     | [zeroheight](https://zeroheight.com/) 등...                                          |

## 핵심 디자인 시스템 {#core-design-system-layer}

조직의 모든 곳에서 사용할 수 있는 공통 인터페이스 요소들을 관리하는 레이어다.

:::note
[디자인 시스템은 사용자 인터페이스를 위한 것](https://www.vigorously.xyz/posts/design-system-for-user-interface/)으로 이 레이어는 인터페이스 구축에 필요한 건축 자재를 공급하는 레이어라고 할 수 있다.
:::

핵심 디자인 시스템 레이어에 포함되는 요소는 다음과 같다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/6.png)

### 디자인 토큰 레이어 {#design-token-layer}

[디자인 토큰](https://www.vigorously.xyz/posts/design-system-extension/#design-token)이란 특정 룩앤필을 구현하기 위한 브랜드 변수로 주로 테마를 구현하기 위해서 사용된다.

디자인 토큰을 UI 컴포넌트와 분리하면 다음과 같은 이점을 얻을 수 있다.

- 시스템 상에서 테마를 관리할 수 있다.
- 브랜드 언어를 독립적으로 관리할 수 있다.

디자인 토큰 레이어에는 다음과 같은 에셋들이 포함된다.

#### 파운데이션 디자인 라이브러리 {#foundation-design-library}

디자인 토큰을 코드화하는 것은 개발 팀의 일이지만 토큰 값을 구성하고 결정하는 것은 다지인 팀이다. 디자인 팀은 토큰을 다른 팀에서도 구독할 수 있도록 피그마와 같은 **디자인 라이브**(피그마, 스케치 등...)에서 관리해야 한다. (디자인 분야에서는 디자인 토큰을 "파운데이션"이라고 부른다)

#### 디자인 토큰 레포지토리 {#design-token-repository}

디자인 토큰 값이 정의된 JSON 파일을 관리하는 레포지토리다. [Style Dictionary](https://www.vigorously.xyz/docs/style-dictionary/style-dictionary-overview/)와 같은 라이브러리를 사용하면 JSON으로 정의된 토큰 값을 다른 프레임워크, 플랫폼에서 사용할 수 있도록 변환할 수 있다.

#### 디자인 토큰 패키지 {#design-token-package}

디자인 토큰 레포지토리에서 만들어진 토큰을 각 플랫폼별 레지스트리(NPM 등...)에 게시하여 다른 레이어에서 사용할 수 있도록 한다.

![https://raw.githubusercontent.com/d01000100/figma-token-engine/HEAD/.docs/engine-diagram.svg](https://raw.githubusercontent.com/d01000100/figma-token-engine/HEAD/.docs/engine-diagram.svg)

### 아이콘 레이어 {#icon-layer}

아이콘은 디자인 토큰과 유사한 상황이다. 다양한 환경(Web, iOS, Android 등...)에서 사용되기 때문에 독립적인 레이어로 관리해야 한다.

아이콘 레이어에 포함되는 에셋은 다음과 같다.

- 아이콘 피그마 파일
- 아이콘 코드(SVG) 레포지토리
- 아이콘 패키지

:::tip
아이콘도 디자인 토큰과 마찬가지로 [Style Dictionary](https://amzn.github.io/style-dictionary/#/package_structure?id=package-structure)를 활용하여 관리할 수 있다.
:::

### UI 컴포넌트 레이어 {#ui-component-layer}

이제 가장 핵심 요소를 살펴보자. 일반적으로 디자인 시스템이라고 하면 사람들은 재사용 가능한 UI 컴포넌트 세트를 떠올린다.

#### UI 컴포넌트 피그마 라이브러리 {#ui-component-figma-library}

디자인 팀에서 관리하는 UI 컴포넌트 모음이다. ([참조](https://help.figma.com/hc/en-us/articles/360041051154-Guide-to-libraries-in-Figma))

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/7.png)

#### 웹 컴포넌트 라이브러리 레포지토리 {#web-component-library-repository}

코딩된 컴포넌트 라이브러리를 관리하는 레포지토리다. 여기서 컴포넌트를 구현하는데 사용하는 기술이 중요한데 React, Vue 와 같은 라이브러리나 프레임워크를 사용할 수도 있지만 이렇게 되면 해당 기술에 종속되는 단점이 있다. 대신 [웹 컴포넌트](https://developer.mozilla.org/ko/docs/Web/API/Web_components)를 사용하여 범용성을 확보 하는 것이 좋다.

#### 웹 컴포넌트 스토리북 {#web-component-storybook}

코딩된 컴포넌트를 공유하고 테스트, 검토 및 문서화하기 위해서 [스토리북](https://www.vigorously.xyz/posts/design-system-pattern-library/)을 사용한다.

#### 웹 컴포넌트 라이브러리 패키지 {#web-component-library-package}

컴포넌트 소스 코드를 NPM 등의 레지스트리에 게시하여 상위 레이어에서 사용할 수 있도록 한다.

#### 레퍼런스 웹사이트 {#reference-website}

위의 모든 에셋들을 모아서 하나의 레퍼런스 웹사이트로 제공한다. 직접 개발할 수도 있지만 솔루션을 사용할 수도 있다. 예를들어 zeroheight를 사용하면 피그마와 스토리북에서 에셋을 가져와 제공할 수 있다.

## 기술별 구현 (선택 사항) {#technology-specific-implementation}

핵심 디자인 시스템 레이어를 특정 라이브러리나 프레임워크로 구현하는 레이어다. 예를 들어 앞선 레이어에서 UI 컴포넌트를 웹 컴포넌트로 구현했다고 할 때 이를 다시 React나 Vue로 래핑하거나 웹이 아닌 네이티브 환경(android, iOS, flutter 등...)의 코드를 개발하는 것을 말한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/8.png)

### 프레임워크 래퍼 레이어 {#framework-wrapper-layer}

웹 컴포넌트로 개발된 코드를 React, Vue 등의 라이브러리에서 사용할 수 있도록 래핑한다.

```jsx
// 웹 컴포넌트
<ds-button variant="primary" />

// React 컴포넌트
<DsButton variant="primary" />
```

굳이 이렇게 해야하는 이유는 특정 기술에 종속되지 않기 위해서다. 만약 Vue로 작성된 코드를 React로 이전한다고 했을 때 웹 컴포넌트를 기반으로 작성된 코드라면 훨씬 수월하게 이전할 수 있다.

#### 프레임워크 래퍼 레이어 에셋 {#framwork-wrapper-layer-assets}

| 에셋            | 설명                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| 코드 레포지토리 | 프레임워크 래퍼의 코드 레포지토리에서 중요한 것은 핵심 레이어 코드 레이어와 동기화를 유지하는 것이다. |
| 스토리북        | 라이브러리별 컴포넌트가 존재하는 경우 각 기술마다 스토리북을 제공하는 것이 좋다.                      |
| 코드 패키지     | 상위 레이어에서 사용할 수 있도록 레지스트리에 게시한다.                                               |

### 네이티브 레이어 {#native-layer}

네이티브 앱 환경은 웹에 비해서 여러모로 까다롭다. 웹 처럼 브라우저로 단일화된 환경에서 실행되는 것이 아니라 iOS, Android 등... 여러 환경을 고려해야 한다. 개발 언어도 다양하다(React Native, Flutter, Swift, Java, Kotlin 등...). 상황이 어떠하든 네이티브 레이어는 다음과 같은 에셋을 제공해야 한다.

- **iOS 및 Android 컴포넌트 라이브러리 레포지토리**
- **iOS 및 Android 코드 패키지**

### 다른 비-웹 구현체들 {#other-non-web-implemetations}

네이티브 애플리케이션을 제외하고도 은행 ATM, 키오스크, 각종 의료 과학 장비 등과 같은 다른 비-웹 구현체들이 존재한다. 이러한 구현체를 제공해야하는 경우 각 환경 전용 코드 레포지토리와 레지스트리 배포가 필요하다.

## 레시피 레이어 (선택 사항) {#recipe-ayer}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/11.png)

레시피 레이어는 핵심 디자인 시스템 레이어의 팽창을 막아주는 역할을 한다. 여러 애플리케이션을 관리하는 조직이라면 각 애플리케이션에서 사용되는 모든 컴포넌트를 공용 UI 컴포넌트 라이브러리에서 관리하는 것은 피해야 한다. 각 애플리케이션에서만 사용되는 컴포넌트나 디자인 에셋이 존재할 것이다. 이러한 것들은 핵심 디자인 시스템 레이어에 포함 시키지 말고 각자 알아서 처리하도록 하는 것이 좋다. ([컴포넌트 레이어 참조](https://www.vigorously.xyz/posts/design-system-layer-cake/))

> 디자인 시스템이 회사 제품 환경의 모든 UI를 소유하거나 포함하거나 감독할 필요는 없다. 핵심적인 재료만 제공하고 팀이 그 재료로 레시피를 만들 수 있도록 지원하거나 장려하면 된다. ...
>
> 레시피란 정확히 무엇인가? 이름에서 알 수 있듯이 레시피는 재료를 조합하여 복잡하고 맛있고 영양가 있는 UI 경험을 만드는 것이다. 디자인 시스템의 핵심 컴포넌트는 식료품 저장실에 보관된 재료다. 그런 다음 다른 제품 디자이너는 이러한 재료를 사용하여 제품 요구 사항을 충족하는 제품별 구성을 만든다.
>
> \- Brad Frost -

:::tabs

@tab:active 핵심 컴포넌트#core-component

![레시피 컴포넌트를 위한 핵심 재료 컴포넌트](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/9.png)

@tab 레시피 컴포넌트#recipe-component

![핵심 재료 컴포넌트를 사용하여 만든 레시피 컴포넌트](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/10.png)

:::

여기서 중요한 것은 컴포넌트의 위치는 고정된 것이 아니라는 것이다. 레시피 컴포넌트 중에도 사용성이 입증된 것은 핵심 컴포넌트로 옮길 수 있다.

### 레시피 레이어 에셋 {#recipe-layer-assets}

| 에셋              | 설명                                                                                                                                                                                                                                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 디자인 라이브러리 | 각 애플리케이션별 컴포넌트와 구성을 포함하는 피그마 라이브러리다. 이 라이브러리는 핵심 다지인 시스템에 의존한다.                                                                                                                                                                                                                        |
| 코드 레포지토리   | 특정 애플리케이션에서 사용되는 컴포넌트 코드를 관리하는 레포지토리다. 예를 들면 헤더의 경우 애플리케이션마다 다르므로 공통 UI 컴포넌트에 관리하기 보다는 각 애플리케이션 별 컴포넌트 라이브러리에서 관리하는 것이 좋다. 또한 레시피 컴포넌트도 웹 컴포넌트, 라이브러리 래퍼 컴포넌트, 네이티브 컴포넌트 등으로 분리하여 작성할 수 있다. |
| 스토리북          | 코딩된 컴포넌트를 공유하고 테스트, 검토 및 문서화하기 위해서 스토리북을 사용한다.                                                                                                                                                                                                                                                       |
| 코드 패키지       | 상위 레이어에서 사용할 수 있도록 레지스트리에 게시한다.                                                                                                                                                                                                                                                                                 |
| 참조 사이트       | 애플리케이션별 스타일 가이드 역할을 한다.                                                                                                                                                                                                                                                                                               |

## 스마트 컴포넌트 레이어 (선택 사항) {#smart-component-layer}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/12.png)

지금까지의 컴포넌트는 비즈니스 로직이 포함되지 않은 순수 프론트엔드 컴포넌트다(아코디언의 열기/닫기 기능과 같은 컴포넌트 자체가 갖는 기본 기능은 예외). 이는 의도적인 것으로 재사용성을 극대화하기 위한 것이다.

이러한 컴포넌트에도 결국 로직이 추가되어야 한다. 레시피 컴포넌트에 비즈니스 로직을 추가한 것을 "스마트 컴포넌트" 라고 한다.

예를 들면 다음과 같다.

- 폼 제출 및 유효성 검사 => React Hook Form
- 신용카드 결제 처리를 위한 결제 컴포넌트
- 정렬/필터링/검색 로직이 포함된 데이터 테이블 => AG 그리드
- UI 컴포넌트에 애널리틱스 연결

물론 공통 UI 컴포넌트를 재사용하는 것과 마찬가지로 스마트 컴포넌트도 재사용할 수 있는 것은 공통 관리하는 것이 좋다.

### 스마트 컴포넌트 레이어 에셋 {#smart-component-layer-assets}

| 에셋                         | 설명                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| 컴포넌트 레포지토리와 패키지 | 스마트 컴포넌트의 레포지토리와 패키지는 여러 애플리케이션에서 사용되므로 개별 컴포넌트 별로 관리한다. |

## 프로덕트 레이어 {#product-layer}

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/design-system-ecosystem/13.png)

이제 마지막으로 실제 애플리케이션을 구현하는 레이어다. 여기서 그동안 준비한 에셋들을 모두 활용하여 디자인 시스템이 제대로 작동하는지 확인할 수 있다.

### 프로덕트 디자인 파일 {#product-design-file}

디자이너는 앞선 레이어에서 만들어진 에셋을 구독하여 활용한다.

- 핵심 디자인 시스템 파운데이션 라이브러리
- 핵심 UI 컴포넌트 라이브러리
- 관련 레시피 컴포넌트 라이브러리

### 프로덕트 코드베이스 {#product-codebase}

각 애플리케이션의 코드베이스는 앞선 레이어의 코드 베이스를 가져와서 종속성으로 사용한다.

```json
"dependencies": {
  "@your-org/design-system-name": "^0.1.0",
  "@your-org/marketing-site-recipes": "^0.1.0",
  "@your-org/smart-form-components": "^0.1.0"
}
```

```jsx
import DsButton from "@your-org/design-system-name/Button";
import SiteHeader from "@your-org/marketing-site-recipes/SiteHeader";
import TextField from "@your-org/smart-form-components/TextField";

<SiteHeader />
<form onSubmit={handleSubmit(onSubmit)}>
  <TextField label="Email" />
  <TextField label="Password" />
  <DsButton variant="primary" text="Sign in" />
</form>
```

### iOS/Android/비-웹 프로덕트 코드베이스 {#non-web-codebase}

비-웹 환경에서는 웹 컴포넌트를 사용할 수 없으므로 자체 컴포넌트 라이브러리를 사용한다.
