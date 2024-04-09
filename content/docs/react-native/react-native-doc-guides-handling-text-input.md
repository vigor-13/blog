---
title: TextInput 다루기
description:
date: 2024-04-10
tags: []
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/handling-text-input',
    },
  ]
---

[`TextInput`](https://reactnative.dev/docs/textinput#content) 은 사용자가 텍스트를 입력할 수 있게 해주는 핵심 컴포넌트다. `onChangeText` (텍스트가 변경될 때마다 호출되는 함수), `onSubmitEditing` (텍스트를 제출할 때 호출되는 함수) 등의 props을 받는다.

예를 들어, 사용자가 입력한 단어를 다른 언어로 번역한다고 해보자. 번역을 할 때 모든 단어는 🍕로 변환할 것이다. 즉 "Hello there Bob"이라는 문장은 "🍕 🍕 🍕"로 번역된다.

```tsx
{% raw %}import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const PizzaTranslator = () => {
  const [text, setText] = useState('');
  return (
    <View style={{ padding: 10 }}>
      <TextInput
        style={{ height: 40 }}
        placeholder="Type here to translate!"
        onChangeText={(newText) => setText(newText)}
        defaultValue={text}
      />
      <Text style={{ padding: 10, fontSize: 42 }}>
        {text
          .split(' ')
          .map((word) => word && '🍕')
          .join(' ')}
      </Text>
    </View>
  );
};

export default PizzaTranslator;{% endraw %}
```

위의 예제에서 텍스트는 고정 값이 아니기 때문에 `text` 상태(state)에 저장한다.

텍스트 입력과 관련하여 다양한 처리를 할 수 있다. 예를 들어, 사용자가 입력하는 동안 내부의 텍스트를 검증할 수 있다. 더 자세한 예제는 [React docs on controlled components 문서](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)나 [TextInput 레퍼런스 문서](https://reactnative.dev/docs/textinput)를 참고한다.

텍스트 입력은 사용자가 앱과 상호작용하는 방법 중 하나다. 다음으로, 다른 유형의 입력을 살펴보고 터치를 처리하는 방법을 알아본다.
