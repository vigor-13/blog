---
title: 상호작용 추가하기
description:
date: 2024-01-25
tags: []
references:
  [
    {
      key: 'React 공식 문서',
      value: 'https://react.dev/learn/adding-interactivity',
    },
  ]
---

화면의 일부 항목은 사용자 입력에 따라 업데이트된다. 예를 들어 이미지 갤러리를 클릭하면 활성 이미지가 전환된다. React에서는 시간이 지남에 따라 변하는 데이터를 상태(state)라고 한다. 모든 컴포넌트에 상태를 추가하고 필요에 따라 업데이트할 수 있다. 이 장에서는 상호작용을 처리하고, 상태를 업데이트하고, 시간에 따라 다른 출력을 표시하는 컴포넌트를 작성하는 방법을 배운다.

## 이벤트에 응답하기 {#responding-to-events}

React를 사용하면 JSX에 이벤트 핸들러를 추가할 수 있다. 이벤트 핸들러는 클릭, 허버, 폼 입력 포커싱 등과 같은 사용자 상호작용에 반응하여 트리거되는 자체 함수다.

`<button>`과 같은 컴포넌트는 `onClick` 과 같은 빌트인 브라우저 이벤트만 지원한다. 그러나 자체 컴포넌트를 생성하고 이벤트 핸들러 프로퍼티에 원하는 핸들러 이름을 지정할 수도 있다.

```jsx
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>Play Movie</Button>
      <Button onClick={onUploadImage}>Upload Image</Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

## 상태: 컴포넌트의 메모리 {#state-component-memory}

컴포넌트는 상호 작용의 결과로 화면의 내용을 변경해야 하는 경우가 많다. 폼에 입력하면 입력 필드가 업데이트되어야 하고, 이미지 캐러셀에서 '다음'을 클릭하면 표시되는 이미지가 변경되어야 하며, '구매'를 클릭하면 제품이 장바구니에 담기게 된다. 컴포넌트는 현재 입력값, 현재 이미지, 쇼핑 카트 등을 "기억"해야 한다. React에서는 이런 종류의 컴포넌트별 메모리를 상태(state)라고 부른다.

컴포넌트에 상태를 추가하려면 `useState` 훅(Hook)을 사용하면 된다. 훅은 컴포넌트가 React 기능을 사용할 수 있게 해주는 특수 함수다(상태는 그 기능 중 하나다). `useState` 훅을 사용하면 상태 변수를 선언할 수 있다. 이 함수는 초기 상태를 받아 현재 상태와 이를 업데이트할 수 있는 상태 설정자 함수의 값 쌍을 반환한다.

```jsx
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

이미지 갤러리에서 클릭 시 상태를 사용하고 업데이트하는 방법은 다음과 같다:

:::tabs

@tab:active App.js#app

```jsx
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>Next</button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img src={sculpture.url} alt={sculpture.alt} />
    </>
  );
}
```

@tab data.js#data

```jsx
export const sculptureList = [
  {
    name: 'Homenaje a la Neurocirugía',
    artist: 'Marta Colvin Andrade',
    description:
      'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
    url: 'https://i.imgur.com/Mx7dA2Y.jpg',
    alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.',
  },
  {
    name: 'Floralis Genérica',
    artist: 'Eduardo Catalano',
    description:
      'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
    url: 'https://i.imgur.com/ZF6s192m.jpg',
    alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.',
  },
  {
    name: 'Eternal Presence',
    artist: 'John Woodrow Wilson',
    description:
      'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
    url: 'https://i.imgur.com/aTtVpES.jpg',
    alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.',
  },
  {
    name: 'Moai',
    artist: 'Unknown Artist',
    description:
      'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
    url: 'https://i.imgur.com/RCwLEoQm.jpg',
    alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.',
  },
  {
    name: 'Blue Nana',
    artist: 'Niki de Saint Phalle',
    description:
      'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
    url: 'https://i.imgur.com/Sd1AgUOm.jpg',
    alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.',
  },
  {
    name: 'Ultimate Form',
    artist: 'Barbara Hepworth',
    description:
      'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
    url: 'https://i.imgur.com/2heNQDcm.jpg',
    alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.',
  },
  {
    name: 'Cavaliere',
    artist: 'Lamidi Olonade Fakeye',
    description:
      "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
    url: 'https://i.imgur.com/wIdGuZwm.png',
    alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.',
  },
  {
    name: 'Big Bellies',
    artist: 'Alina Szapocznikow',
    description:
      'Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.',
    url: 'https://i.imgur.com/AlHTAdDm.jpg',
    alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.',
  },
  {
    name: 'Terracotta Army',
    artist: 'Unknown Artist',
    description:
      'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
    url: 'https://i.imgur.com/HMFmH6m.jpg',
    alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.',
  },
  {
    name: 'Lunar Landscape',
    artist: 'Louise Nevelson',
    description:
      'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
    url: 'https://i.imgur.com/rN7hY6om.jpg',
    alt: 'A black matte sculpture where the individual elements are initially indistinguishable.',
  },
  {
    name: 'Aureole',
    artist: 'Ranjani Shettar',
    description:
      'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
    url: 'https://i.imgur.com/okTpbHhm.jpg',
    alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.',
  },
  {
    name: 'Hippos',
    artist: 'Taipei Zoo',
    description:
      'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
    url: 'https://i.imgur.com/6o5Vuyu.jpg',
    alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.',
  },
];
```

:::

## 렌더와 커밋 {#render-and-commit}

컴포넌트가 화면에 표시되기 전에 React에서 렌더링해야 한다. 이 과정의 단계를 이해하면 코드가 어떻게 실행되는지 생각하고 동작을 설명하는 데 도움이 된다.

컴포넌트가 부엌에서 재료로 맛있는 요리를 만드는 요리사라고 상상해 보자. 이 시나리오에서 React는 고객의 요청을 접수하고 주문을 가져오는 웨이터 역할을 한다. UI를 요청하고 제공하는 이 과정은 세 단계로 이루어진다:

1. 렌더링 트리거(식당의 주문을 주방으로 전달)
2. 컴포넌트 렌더링(주방에서 주문 준비)
3. DOM에 커밋(주문을 테이블에 배치)

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-doc-adding-interactivity/1.png)

## 스냅샷으로서 상태 {#state-as-snapshot}

일반 자바스크립트 변수와 달리 React 상태는 스냅샷처럼 동작한다. 상태 변수를 설정해도 이미 가지고 있는 상태 변수가 변경되는 것이 아니라 렌더링이 다시 실행된다.

```jsx
console.log(count); // 0
setCount(count + 1); // 1로 리렌더링 요청
console.log(count); // 아직 0!
```

이 동작은 미묘한 버그를 피하는 데 도움이 된다. 다음은 작은 채팅 앱이다. 먼저 '보내기'를 누른 다음 수신자를 Bob으로 변경하면 어떤 일이 벌어질지 맞춰보라. 5초 후 알림에 누구의 이름이 나타날까?

```jsx
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

## 대기열에 일련의 상태 업데이트 추가하기 {#queueing-series-of-state-updates}

다음의 코드에는 버그가 있다. "+3" 을 클릭해도 1만 올라간다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button
        onClick={() => {
          increment();
          increment();
          increment();
        }}
      >
        +3
      </button>
      <h1>Score: {score}</h1>
    </>
  );
}
```

[스냅샷으로서 상태]() 문서는 이런 일이 발생하는 이유를 설명한다. 상태 설정은 새로운 렌더링을 요청하지만 이미 실행 중인 코드는 변경하지 않는다. 따라서 `setScore(score + 1)` 를 호출한 직후에도 점수는 계속 `0` 이 된다.

```jsx
console.log(score); // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score); // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score); // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score); // 0
```

상태를 설정할 때 업데이터 함수를 전달하면 이 문제를 해결할 수 있다. `setScore(score + 1)` 를 `setScore(s => s + 1)` 로 바꾸면 "+3" 버튼이 어떻게 수정되는지 보라. 이렇게 하면 여러 상태 업데이트를 대기열에 넣을 수 있다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore((s) => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button
        onClick={() => {
          increment();
          increment();
          increment();
        }}
      >
        +3
      </button>
      <h1>Score: {score}</h1>
    </>
  );
}
```

## 객체 상태 업데이트하기 {#updating-objects-in-state}

상태는 객체를 포함한 모든 종류의 자바스크립트 값을 보유할 수 있다. 하지만 React 상태에 있는 객체와 배열을 직접 변경해서는 안 된다. 대신 객체와 배열을 업데이트하려면 새 객체를 생성하거나 기존 객체의 복사본을 만든 다음 해당 복사본을 사용하도록 상대를 업데이트해야 한다.

일반적으로 `...` 스프레드 구문을 사용하여 변경하려는 객체 및 배열을 복사한다. 예를 들어 중첩된 객체를 업데이트하는 방법은 다음과 같다:

```jsx
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    },
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value,
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value,
      },
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value,
      },
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value,
      },
    });
  }

  return (
    <>
      <label>
        Name:
        <input value={person.name} onChange={handleNameChange} />
      </label>
      <label>
        Title:
        <input value={person.artwork.title} onChange={handleTitleChange} />
      </label>
      <label>
        City:
        <input value={person.artwork.city} onChange={handleCityChange} />
      </label>
      <label>
        Image:
        <input value={person.artwork.image} onChange={handleImageChange} />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img src={person.artwork.image} alt={person.artwork.title} />
    </>
  );
}
```

코드에서 객체를 복사하는 것이 번거롭다면 [Immer](https://github.com/immerjs/use-immer)와 같은 라이브러리를 사용하여 반복되는 코드를 줄일 수 있다:

:::tabs

@tab:active package.json#package

```json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "devDependencies": {}
}
```

@tab App.js#app

```jsx
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    },
  });

  function handleNameChange(e) {
    updatePerson((draft) => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson((draft) => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson((draft) => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson((draft) => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input value={person.name} onChange={handleNameChange} />
      </label>
      <label>
        Title:
        <input value={person.artwork.title} onChange={handleTitleChange} />
      </label>
      <label>
        City:
        <input value={person.artwork.city} onChange={handleCityChange} />
      </label>
      <label>
        Image:
        <input value={person.artwork.image} onChange={handleImageChange} />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img src={person.artwork.image} alt={person.artwork.title} />
    </>
  );
}
```

:::

## 배열 상태 업데이트하기 {#updating-array-in-state}

배열은 상태에 저장할 수 있는 또 다른 유형의 변경 가능한 자바스크립트 객체이며 읽기 전용으로 취급해야 한다. 객체와 마찬가지로 사애에 저장된 배열을 업데이트하려면 새 배열을 만들거나 기존 배열의 복사본을 만든 다음 새 배열을 사용하도록 상태를 설정해야 한다:

```jsx
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(initialList);

  function handleToggle(artworkId, nextSeen) {
    setList(
      list.map((artwork) => {
        if (artwork.id === artworkId) {
          return { ...artwork, seen: nextSeen };
        } else {
          return artwork;
        }
      }),
    );
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList artworks={list} onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map((artwork) => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={(e) => {
                onToggle(artwork.id, e.target.checked);
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

코드에서 배열을 복사하는 것이 번거롭다면 [Immer](https://github.com/immerjs/use-immer)와 같은 라이브러리를 사용하여 반복되는 코드를 줄일 수 있다:

:::tabs

@tab:active package.json#package

```json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "devDependencies": {}
}
```

@tab App.js#app

```jsx
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList((draft) => {
      const artwork = draft.find((a) => a.id === artworkId);
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList artworks={list} onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map((artwork) => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={(e) => {
                onToggle(artwork.id, e.target.checked);
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

:::
