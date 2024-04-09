---
title: 리스트 뷰 사용하기
description:
date: 2024-04-10
tags: []
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/getting-started',
    },
  ]
---

React Native는 데이터 목록을 표시하기 위한 일련의 컴포넌트를 제공한다. 일반적으로 `FlatList` 나 `SectionList` 를 사용한다.

`FlatList` 컴포넌트는 유사한 구조의 데이터 목록을 표시한다. `FlatList` 는 항목 수가 늘어나는 긴 데이터 목록에 적합하다. 보다 일반적인 `ScrollView` 와 달리 `FlatList` 는 모든 요소를 한 번에 렌더링하지 않고 현재 화면에 표시되는 요소만 렌더링한다.

`FlatList` 컴포넌트에는 `data` 와 `renderItem` 두 가지 prop이 필요하다. `data` 는 렌더링할 데이터 소스다. `renderItem` 은 데이터에서 각각의 항목을 렌더링할 때 사용할 컴포넌트다.

다음 예제는 하드코딩된 목업 데이터로 기본 `FlatList` 를 구현한다. `data` prop의 각 항목은 `Text` 컴포넌트로 렌더링된다. 그런 다음 `FlatListBasics` 컴포넌트는 `FlatList`와 모든 `Text` 컴포넌트를 렌더링한다.

```tsx
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const FlatListBasics = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { key: 'Devin' },
          { key: 'Dan' },
          { key: 'Dominic' },
          { key: 'Jackson' },
          { key: 'James' },
          { key: 'Joel' },
          { key: 'John' },
          { key: 'Jillian' },
          { key: 'Jimmy' },
          { key: 'Julie' },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
      />
    </View>
  );
};

export default FlatListBasics;
```

만약 iOS의 `UITableView` 처럼 섹션 헤더와 함께 논리적 섹션으로 나뉘어진 데이터 세트를 렌더링하고 싶다면 [`SectionList`](https://reactnative.dev/docs/sectionlist) 를 사용한다.

```tsx
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const SectionListBasics = () => {
  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          { title: 'D', data: ['Devin', 'Dan', 'Dominic'] },
          {
            title: 'J',
            data: [
              'Jackson',
              'James',
              'Jillian',
              'Jimmy',
              'Joel',
              'John',
              'Julie',
            ],
          },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item) => `basicListEntry-${item}`}
      />
    </View>
  );
};

export default SectionListBasics;
```

리스트 뷰의 가장 일반적인 용도 중 하나는 서버에서 가져온 데이터를 표시하는 것이다. 따라서 다음 섹션에서는 React Native에서의 네트워킹에 대해 알아본다.
