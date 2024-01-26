---
title: 빠르게 시작하기
description: React의 기본적인 내용을 빠르게 살펴보기
date: 2024-01-15
tags: []
references: [{ key: 'React 공식 문서', value: 'https://react.dev/learn' }]
---

## 컴포넌트 생성 및 중첩하기

React 앱은 컴포넌트로 구성된다. 컴포넌트는 고유한 로직과 스타일을 가진 UI(사용자 인터페이스)의 일부다. 컴포넌트는 버튼처럼 작을 수도 있고 전체 페이지처럼 클 수도 있다.

React 컴포넌트는 HTML 마크업을 반환하는 JavaScript 함수다:

```jsx
function MyButton() {
  return <button>I'm a button</button>;
}
```

이제 `MyButton` 을 선언했으므로 다른 컴포넌트에서 사용할 수 있다:

```jsx
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

`<MyButton />` 컴포넌트가 대문자로 시작하는 것을 주목하라. 이것이 바로 React 컴포넌트임을 알 수 있는 방법이다. React 컴포넌트 이름은 항상 대문자로 시작해야 하며, HTML 태그는 소문자로 시작해야 한다.

결과를 살펴보자:

```jsx
function MyButton() {
  return <button>I'm a button</button>;
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

`export default` 키워드는 파일의 메인 컴포넌트를 지정한다.

## JSX로 마크업 작성하기

위에서 본 마크업 구문을 **JSX**라고 한다. 선택 사항이지만 대부분의 React 프로젝트는 편의성을 위해 JSX를 사용한다. [로컬 개발용으로 권장하는 모든 도구]()는 JSX를 기본적으로 지원한다.

JSX는 HTML보다 더 엄격하다. `<br />` 과 같은 태그는 태그를 닫아야 한다. 컴포넌트는 또한 여러 개의 JSX 태그를 반환할 수 없다. `<div>...</div>` 또는 빈 `<>...</>` 래퍼와 같은 부모 요소로 래핑해야 한다:

```jsx
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>
        Hello there.
        <br />
        How do you do?
      </p>
    </>
  );
}
```

## 스타일 추가하기

React에서는 `className`으로 CSS 클래스를 지정한다.

```jsx
<img className="avatar" />
```

그런 다음 별도의 CSS 파일에 해당 CSS 규칙을 작성한다:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React는 CSS 파일을 추가하는 방법을 규정하지 않는다. 가장 간단한 경우 HTML에 `<link>` 태그를 추가하면 된다. 빌드 도구나 프레임워크를 사용하는 경우 해당 문서를 참조하여 프로젝트에 CSS 파일을 추가하는 방법을 알아보라.

## 데이터 표시하기

JSX를 사용하면 자바스크립트에서 HTML 마크업을 사용할 수 있다. 중괄호를 사용하면 마크업에 일부 변수를 삽입하여 사용자에게 표시할 수 있다. 즉 마크업에서 "자바스크립트로 이스케이프"할 수 있다. 예를 들어 `user.name` 데이터를 표시하고 싶다면 다음과 같이 작성할 수 있다:

```jsx
return <h1>{user.name}</h1>;
```

JSX 속성에서도 "자바스크립트로 이스케이프"할 수 있지만 따옴표 대신 중괄호를 사용해야 한다. 예를 들어 `className="avatar"`는 "avatar" 문자열을 CSS 클래스로 전달하지만, `src={user.imageUrl}`은 JavaScript `user.imageUrl` 변수 값을 읽은 다음 해당 값을 `src` 속성으로 전달한다:

```jsx
return <img className="avatar" src={user.imageUrl} />;
```

JSX 중괄호 안에 [문자열 연결(string concatenation)](https://javascript.info/operators#string-concatenation-with-binary)과 같이 더 복잡한 표현식을 넣을 수도 있다:

```jsx {% raw %}
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize,
        }}
      />
    </>
  );
}{% endraw %}
```

위의 예에서 {% raw %}`style={{}}`{% endraw %}은 특수한 구문이 아니라 `style={ }` JSX 중괄호 안에 있는 일반 `{}` 객체다. 스타일이 자바스크립트 변수에 의존할 때 `style`일 속성을 사용할 수 있다.

## 조건부 렌더링

React에서는 조건을 작성하기 위한 특별한 문법이 없다. 대신 일반 자바스크립트 코드를 작성할 때 사용하는 것과 동일한 기술을 사용한다. 예를 들어, `if` 문을 사용하여 조건부로 JSX를 포함할 수 있다:

```jsx
let content;

if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}

return <div>{content}</div>;
```

보다 간결한 코드를 원한다면 조건부 `?` 연산자를 사용할 수 있다. `if` 와 달리 JSX 내에서 작동한다:

```jsx
<div>{isLoggedIn ? <AdminPanel /> : <LoginForm />}</div>
```

`else` 분기가 필요하지 않은 경우 더 짧은 논리 `&&` 구문을 사용할 수도 있다:

```jsx
<div>{isLoggedIn && <AdminPanel />}</div>
```

이 모든 접근 방식은 조건부로 속성을 지정할 때도 사용할 수 있다. 이러한 자바스크립트 구문에 익숙하지 않다면 항상 `if...else` 를 사용하는 것부터 시작하면 된다.

## 리스트 렌더링

컴포넌트 목록을 렌더링하려면 `for` 루프 및 `array map()` 함수와 같은 자바스크립트 기능을 사용하게 된다.

예를 들어 제품 배열이 있다고 가정해 보겠다:

```jsx
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

컴포넌트 내에서 `map()` 함수를 사용하여 제품 배열을 `<li>` 아이템 배열로 변환한다:

```jsx
const listItems = products.map((product) => (
  <li key={product.id}>{product.title}</li>
));

return <ul>{listItems}</ul>;
```

`<li>` 에 `key` 속성이 있는 것을 주목하라. 목록의 각 항목에 대해 형제 항목 중에서 해당 항목을 고유하게 식별하는 문자열 또는 숫자를 전달해야 한다. 일반적으로 키는 데이터베이스 ID와 같은 데이터에서 가져와야 한다. React는 키를 사용하여 나중에 항목을 삽입, 삭제 또는 재정렬할 때 어떤 일이 일어났는지 파악한다.

```jsx {% raw %}
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map((product) => (
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen',
      }}
    >
      {product.title}
    </li>
  ));

  return <ul>{listItems}</ul>;
}{% endraw %}
```

## 이벤트에 응답하기

컴포넌트 내부에 이벤트 핸들러 함수를 선언하여 이벤트에 응답할 수 있다:

```jsx
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

`onClick={handleClick}` 끝에 괄호가 없는 것을 주목하라! 이벤트 핸들러 함수를 호출하지 말고 전달만 하면 된다. 사용자가 버튼을 클릭하면 React가 이벤트 핸들러를 호출한다.

## 스크린 업데이트하기

컴포넌트가 특정 정보를 '기억'하여 표시하기를 원하는 경우가 종종 있다. 예를 들어 버튼이 클릭된 횟수를 세고 싶을 수 있다. 이렇게 하려면 컴포넌트에 `state` 를 추가하면 된다.

먼저 React에서 `useState` 를 가져온다:

```jsx
import { useState } from 'react';
```

이제 컴포넌트 내에서 상태 변수를 선언할 수 있다:

```jsx
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState` 에서는 현재 상태(`count`)와 이를 업데이트할 수 있는 함수(`setCount`) 두 가지를 얻을 수 있다. 여기에 어떤 이름을 붙여도 상관 없지만, 일반적으로 `[something, setSomething]` 으로 작성하는 것이 좋다.

버튼이 처음 표시될 때는 `useState()`에 `0` 을 전달했기 때문에 카운트가 `0` 이 된다. 상태를 변경하려면 `setCount()`를 호출하고 새 값을 전달한다. 이 버튼을 클릭하면 카운터가 증가한다:

```jsx
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return <button onClick={handleClick}>Clicked {count} times</button>;
}
```

React가 컴포넌트 함수를 다시 호출한다. 이번에는 카운트가 `1` 이 된다. 그 다음에는 `2` 가 된다. 그리고 계속 반복한다.

동일한 컴포넌트를 여러 번 렌더링하면 각각 고유한 상태를 갖게 된다. 각 버튼을 개별적으로 클릭해보자:

```jsx
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return <button onClick={handleClick}>Clicked {count} times</button>;
}
```

각 버튼이 자신의 `count` 상태를 '기억'하고 다른 버튼에 영향을 주지 않는다.

## Hooks 사용하기

`use` 로 시작하는 함수를 Hook이라고 한다. `useState` 는 React에서 제공하는 빌트인 Hook이다. 다른 내장 Hook은 API 레퍼런스에서 찾을 수 있다. 기존 Hook을 조합하여 자신만의 Hook을 작성할 수도 있다.

Hook은 다른 함수보다 더 제한적이다. 컴포넌트(또는 다른 Hook)의 맨 위에 있는 Hook만 호출할 수 있다. 조건문이나 루프에서 `useState`를 사용하려면 새 컴포넌트로 추출하여 거기에 넣으면 된다.

## 컴포넌트 간 데이터 공유하기

이전 예제에서는 각 `MyButton` 에 독립적인 `count` 가 있었으며, 각 버튼을 클릭하면 클릭한 버튼의 `count` 만 변경되었다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-doc-quick-start/1.png)

하지만 데이터를 공유하고 항상 함께 업데이트할 수 있는 컴포넌트가 필요한 경우가 많다.

두 `MyButton` 컴포넌트가 동일한 `count` 를 표시하고 함께 업데이트되도록 하려면 개별 버튼에서 모든 버튼이 포함된 가장 가까운 컴포넌트로 상태를 '위쪽'으로 이동해야 한다.

이 예에서는 `MyApp` 이다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-doc-quick-start/2.png)

이제 두 버튼 중 하나를 클릭하면 `MyApp` 의 `count` 가 변경되고, 이에 따라 `MyButton` 의 `count` 도 모두 변경된다. 이를 코드로 표현하는 방법은 다음과 같다.

먼저 상태를 `MyButton` 에서 `MyApp` 으로 이동한다:

```jsx
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}
```

그런 다음 공유 클릭 핸들러와 함께 `MyApp` 에서 각 `MyButton` 으로 상태를 전달한다. 이전에 `<img>` 와 같은 기본 제공 태그를 사용했던 것처럼 JSX 중괄호를 사용하여 `MyButton` 에 정보를 전달할 수 있다:

```jsx
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

이렇게 전달하는 정보를 `props` 라고 한다. 이제 `MyApp` 컴포넌트에는 `count` 상태와 `handleClick` 이벤트 핸들러가 포함되어 있으며, 이 두 가지를 각 버튼에 `props` 로 전달한다.

마지막으로, 부모 컴포넌트에서 전달한 프로퍼티를 읽도록 `MyButton` 을 변경한다:

```jsx
function MyButton({ count, onClick }) {
  return <button onClick={onClick}>Clicked {count} times</button>;
}
```

버튼을 클릭하면 `onClick` 핸들러가 실행된다. 각 버튼의 `onClick` 프로퍼티는 `MyApp` 내부의 `handleClick` 함수로 설정되었으므로 그 안의 코드가 실행된다. 이 코드는 `setCount(count + 1)` 를 호출하여 `count` 상태 변수를 증가시킨다. 새로운 `count` 값은 각 버튼에 프로퍼티로 전달되므로 모든 버튼에 새 값이 표시된다. 이를 "상태 올리기(lifting state up)"라고 한다. 상태를 위로 이동하면 컴포넌트 간에 상태를 공유할 수 있게 된다.

```jsx
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return <button onClick={onClick}>Clicked {count} times</button>;
}
```
