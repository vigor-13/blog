---
title: UI 표현하기
description:
date: 2024-01-25
tags: []
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/learn/describing-the-ui',
    },
  ]
---

React는 사용자 인터페이스(UI)를 렌더링하기 위한 자바스크립트 라이브러리다. UI는 버튼, 텍스트, 이미지와 같은 작은 단위로 구성된다. React를 사용하면 이들을 재사용 가능하고 중첩 가능한 컴포넌트로 결합할 수 있다. 웹 사이트에서 휴대폰 앱에 이르기까지 화면의 모든 것을 컴포넌트로 분해할 수 있다. 이 장에서는 React 컴포넌트를 만들고, 커스터마이징하고, 조건부로 표현하는 방법을 배운다.

## 첫 컴포넌트 {#first-component}

React 애플리케이션은 컴포넌트라고 하는 분리된 UI 조각으로 구축된다. React 컴포넌트는 마크업을 리턴하는 자바스크립트 함수다. 컴포넌트는 버튼만큼 작을 수도 있고 전체 페이지만큼 클 수도 있다. 다음은 세 개의 `Profile` 컴포넌트를 렌더링하는 `Gallery` 컴포넌트다:

```jsx
function Profile() {
  return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

## 컴포넌트 불러오기 & 내보내기 {#importing-and-exporting-components}

하나의 파일에 여러 컴포넌트를 선언할 수 있지만 파일이 크면 컴포넌트를 관리하기 어려울 수 있다. 이 문제를 해결하려면 컴포넌트를 자체 파일로 내보낸 다음 다른 파일에서 해당 컴포넌트를 가져오면 된다:

:::tabs

@tab:active Gallery.js#gallery

```jsx
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

@tab Profile.js#profile

```jsx
export default function Profile() {
  return <img src="https://i.imgur.com/QIrZWGIs.jpg" alt="Alan L. Hart" />;
}
```

:::

## JSX로 마크업 작성하기 {#markup-with-jsx}

각 React 컴포넌트는 마크업(브라우저에서 렌더링 가능한)을 포함할 수 있는 JavaScript 함수다. React 컴포넌트는 JSX라는 구문 확장자를 사용하여 해당 마크업을 표현한다. JSX는 HTML과 매우 비슷해 보이지만 조금 더 엄격하고 동적 정보를 표시할 수 있다.

기존 HTML 마크업을 React 컴포넌트에 붙여넣으면 항상 작동하는 것은 아니다:

:::tabs

@tab:active Bad Case#bad

다음의 코드는 작동하지 않는다!

```jsx
export default function TodoList() {
  return (
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

@tab Good Case#good

```jsx
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

:::

## JSX에서 중괄호와 자바스크립트 {#javascript-in-jsx}

JSX를 사용하면 JavaScript 파일 내에 HTML과 유사한 마크업을 작성하여 렌더링 로직과 콘텐츠를 같은 위치에서 유지할 수 있다. 마크업 안에 약간의 자바스크립트 로직을 추가하거나 동적 속성을 참조하고 싶을 때가 있다. 이 경우 JSX에서 중괄호를 사용하여 JavaScript를 직접적으로 사용 할 수 있다:

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink',
  },
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

## 컴포넌트에 프로퍼티 전달하기 {#passing-props-to-component}

React 컴포넌트는 프로퍼티를 사용해 서로 통신한다. 모든 부모 컴포넌트는 자식 컴포넌트에 프로퍼티를 전달하여 일부 정보를 전달할 수 있다. 프로퍼티라고 하면 HTML 어트리뷰트를 떠올릴 수 있지만 객체, 배열, 함수, 심지어 JSX를 포함한 모든 자바스크립트 값을 전달할 수 있다!

:::tabs

@tab:active App.js#app

```jsx
{% raw %}import { getImageUrl } from './utils.js';

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2',
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return <div className="card">{children}</div>;
} {% endraw %}
```

@tab utils.js#utils

```jsx
export function getImageUrl(person, size = 's') {
  return 'https://i.imgur.com/' + person.imageId + size + '.jpg';
}
```

:::

## 조건부 렌더링 {#conditional-rendering}

컴포넌트는 여러 조건에 따라 다른 것을 표시해야 하는 경우가 많다. React에서는 `if` 문, `&&`, `?` `:` 연산자 같은 자바스크립트 구문을 사용하여 조건부로 JSX를 렌더링할 수 있다.

이 예시에서는 자바스크립트 `&&` 연산자를 사용하여 체크 표시를 조건부로 렌더링한다:

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item isPacked={true} name="Space suit" />
        <Item isPacked={true} name="Helmet with a golden leaf" />
        <Item isPacked={false} name="Photo of Tam" />
      </ul>
    </section>
  );
}
```

## 리스트 렌더링 {#rednering-lists}

데이터 모음에서 유사한 컴포넌트를 여러 개 표시하고 싶을 때가 많다. React와 함께 JavaScript의 `filter()` 및 `map()` 함수를 사용하여 데이터 배열을 필터링하고 컴포넌트 배열로 변환할 수 있다.

각 배열 항목에 대해 `key` 를 지정해야 한다. 일반적으로 데이터베이스의 ID를 키로 사용하는 것이 좋습니다. `key` 를 사용하면 목록이 변경되더라도 React가 목록에서 각 항목의 위치를 추적할 수 있다.

:::tabs

@tab:active App.js#app

```jsx
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map((person) => (
    <li key={person.id}>
      <img src={getImageUrl(person)} alt={person.name} />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  ));
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

@tab data.js#data

```jsx
export const people = [
  {
    id: 0,
    name: 'Creola Katherine Johnson',
    profession: 'mathematician',
    accomplishment: 'spaceflight calculations',
    imageId: 'MK3eW3A',
  },
  {
    id: 1,
    name: 'Mario José Molina-Pasquel Henríquez',
    profession: 'chemist',
    accomplishment: 'discovery of Arctic ozone hole',
    imageId: 'mynHUSa',
  },
  {
    id: 2,
    name: 'Mohammad Abdus Salam',
    profession: 'physicist',
    accomplishment: 'electromagnetism theory',
    imageId: 'bE7W1ji',
  },
  {
    id: 3,
    name: 'Percy Lavon Julian',
    profession: 'chemist',
    accomplishment:
      'pioneering cortisone drugs, steroids and birth control pills',
    imageId: 'IOjWm71',
  },
  {
    id: 4,
    name: 'Subrahmanyan Chandrasekhar',
    profession: 'astrophysicist',
    accomplishment: 'white dwarf star mass calculations',
    imageId: 'lrWQx8l',
  },
];
```

@tab utils.js#utils

```jsx
export function getImageUrl(person) {
  return 'https://i.imgur.com/' + person.imageId + 's.jpg';
}
```

:::

## 컴포넌트를 순수하게 유지하기 {#keeping-component-pure}

일부 자바스크립트 함수는 순수(pure) 함수다.

순수 함수는 다음과 같다.

- 자기 일만 처리한다. 호출되기 전에 존재했던 객체나 변수를 변경하지 않는다.
- 동일한 입력, 동일한 출력. 동일한 입력이 주어지면 순수 함수는 항상 동일한 결과를 반환해야 한다.

컴포넌트를 순수 함수로만 엄격하게 작성하면 코드베이스가 커져도 당황스러운 버그와 예측할 수 없는 동작을 피할 수 있다.

:::tabs

@tab:active Bad Case#bad

다음은 불순한 컴포넌트의 예시다:

```jsx
let guest = 0;

function Cup() {
  // Bad: 이전에 존재하던 변수를 변경한다.
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

@tab Good Case#good

이 컴포넌트는 기존 변수를 수정하는 대신 프로퍼티를 전달하여 순수하게 만들 수 있다:

```jsx
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

:::

## UI 트리 {#ui-tree}

React는 트리를 사용하여 컴포넌트와 모듈 간의 관계를 모델링한다.

React 렌더 트리는 컴포넌트 간의 부모와 자식 관계를 표현한 것이다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-doc-describing-ui/1.png)

트리의 맨 위, 루트 컴포넌트 근처에 있는 컴포넌트는 최상위 컴포넌트로 간주된다. 자식 컴포넌트가 없는 컴포넌트는 리프 컴포넌트다. 이러한 컴포넌트 분류는 데이터 흐름과 렌더링 성능을 이해하는 데 유용하다.

자바스크립트 모듈 간의 관계를 모델링하는 것은 앱을 이해하는 또 다른 유용한 방법이다. 이를 모듈 종속성 트리(module dependency tree)라고 한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-doc-describing-ui/2.png)

의존성 트리는 빌드 도구에서 클라이언트가 다운로드하고 렌더링할 수 있도록 모든 관련 JavaScript 코드를 번들로 묶는 데 자주 사용된다. 번들 크기가 크면 React 앱의 사용자 경험이 저하된다. 모듈 종속성 트리를 이해하면 이러한 문제를 디버깅하는 데 도움이 된다.
