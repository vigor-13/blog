---
title: 핵심 컴포넌트와 네이티브 컴포넌트
description:
date: 2024-04-10
tags: []
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/intro-react-native-components',
    },
  ]
---

React Native는 [React](https://reactjs.org/)를 사용하여 Android와 iOS 애플리케이션을 구축하기 위한 오픈 소스 프레임워크다.

React Native에서는 JavaScript를 사용하여 각 플랫폼의 API에 액세스하고, React 컴포넌트를 사용하여 UI의 모양과 동작을 표현한다.

우선 React Native에서 컴포넌트가 어떻게 동작하는지 살펴보자.

## 뷰와 모바일 개발 {#views-nd-mobile-development}

뷰(view)는 기본 UI 컴포넌트다.

화면의 작은 직사각형 요소로, 텍스트나 이미지를 표시하거나 사용자 입력에 반응하는 데 사용할 수 있다. 텍스트 한 줄이나 버튼 같은 앱의 가장 작은 시각적 요소조차 일종의 뷰다. 어떤 뷰는 다른 뷰를 포함할 수 있다.

모든 것은 뷰로 이루어진다!

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-core-components-and-native-components/1.svg)

## 네이티브 컴포넌트 {#native-components}

Android에서는 Kotlin이나 Java로 뷰를 작성하고, iOS에서는 Swift나 Objective-C를 사용한다. React Native에서는 React 컴포넌트를 사용하여 뷰를 생성할 수 있다.

런타임에 React Native는 컴포넌트에 대응하는 Android 및 iOS 뷰를 생성한다. React Native 컴포넌트가 Android/iOS와 동일한 뷰로 변환되기 때문에 React Native 앱은 다른 앱과 동일한 모습, 느낌, 성능을 갖는다. 우리는 이러한 플랫폼 기반 컴포넌트를 **네이티브 컴포넌트**라고 부른다.

React Native는 앱 제작에 바로 사용할 수 있는 필수 네이티브 컴포넌트 세트를 제공하는데 이것이 React Native의 **핵심(Core) 컴포넌트**다.

또한 React Native에서는 앱의 요구 사항에 맞춰 고유 네이티브 컴포넌트를 직접 만들 수 있으며, 커뮤니티에서 제공하는 컴포넌트도 많다. 자세한 내용은 [Native Directory](https://reactnative.directory/)를 참조한다.

## 핵심 컴포넌트 {#core-components}

React Native에는 많은 핵심 컴포넌트가 있다. 각각의 컴포넌트는 API 섹션에 문서화되어 있다.

주로 다음과 같은 핵심 컴포넌트로 작업하게 될 것이다:

| React Native UI 컴포넌트 | Android 뷰     | iOS 뷰           | 웹                      | 설명                                                                                 |
| ------------------------ | -------------- | ---------------- | ----------------------- | ------------------------------------------------------------------------------------ |
| `<View>`                 | `<ViewGroup>`  | `<UIView>`       | 스크롤되지 않는 `<div>` | flexbox를 사용한 레이아웃, 스타일, 일부 터치 처리 및 접근성 제어를 지원하는 컨테이너 |
| `<Text>`                 | `<TextView>`   | `<UITextView>`   | `<p>`                   | 텍스트 문자열을 표시, 스타일링, 중첩하고 나아가 터치 이벤트를 처리함                 |
| `<Image>`                | `<ImageView>`  | `<UIImageView>`  | `<img>`                 | 다양한 유형의 이미지를 표시함                                                        |
| `<ScrollView>`           | `<ScrollView>` | `<UIScrollView>` | `<div>`                 | 여러 컴포넌트와 뷰를 포함할 수 있는 일반적인 스크롤 컨테이너                         |
| `<TextInput>`            | `<EditText>`   | `<UITextField>`  | `input type="text"`     | 사용자가 텍스트를 입력할 수 있게 함                                                  |

React Native는 React 컴포넌트와 동일한 API 구조를 사용하기 때문에, 먼저 React 컴포넌트 API를 이해해야 한다. 다음 섹션에서는 이 주제에 대한 학습을 진행할 것이다. 하지만 이미 React에 익숙하다면 넘어가도 된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-core-components-and-native-components/2.svg)
