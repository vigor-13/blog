---
title: ScrollView 사용하기
description:
date: 2024-04-10
tags: []
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/using-a-scrollview',
    },
  ]
---

[`ScrollView`](https://reactnative.dev/docs/scrollview) 는 여러 컴포넌트와 뷰를 포함할 수 있는 일반적인 스크롤 컨테이너다. 다양한 항목을 스크롤 할 수 있으며 , `horizontal` 속성을 설정하여 수직/수평 스크롤 모두 가능하다.

다음 예제는 이미지와 텍스트가 혼합된 수직 `ScrollView` 다.

```tsx
{% raw %}import React from 'react';
import { Image, ScrollView, Text } from 'react-native';

const logo = {
  uri: 'https://reactnative.dev/img/tiny_logo.png',
  width: 64,
  height: 64,
};

const App = () => (
  <ScrollView>
    <Text style={{ fontSize: 96 }}>Scroll me plz</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{ fontSize: 96 }}>If you like</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{ fontSize: 96 }}>Scrolling down</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{ fontSize: 96 }}>What's the best</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{ fontSize: 96 }}>Framework around?</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{ fontSize: 80 }}>React Native</Text>
  </ScrollView>
);

export default App;{% endraw %}
```

ScrollView는 `pagingEnabled` prop을 사용하여 스와이프 제스처로 View 사이를 페이징 처리 하도록 설정할 수 있다. Android에서는 [`ViewPager`](https://github.com/react-native-community/react-native-viewpager) 컴포넌트를 사용하여 뷰 사이를 수평으로 스와이프하는 것도 가능하다.

iOS에서는 단일 항목이 있는 ScrollView를 사용하여 사용자가 콘텐츠를 확대/축소할 수 있다. `maximumZoomScale` 과 `minimumZoomScale` prop을 설정하면 사용자는 핀치와 확장 제스처를 사용하여 확대 및 축소할 수 있다.

ScrollView는 제한된 크기의 적은 수의 항목을 표시하는 데 가장 적합하다. `ScrollView` 의 모든 요소와 뷰는 현재 화면에 표시되지 않더라도 렌더링된다. 화면에 맞출 수 없는 긴 항목 목록이 있다면 `FlatList` 를 대신 사용해야 한다.
