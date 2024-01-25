---
title: React로 생각하기
description: React로 관점 바꾸기
date: 2024-01-15
tags: []
references: [{ key: 'React 공식 문서', value: 'https://react.dev/learn' }]
---

React는 디자인을 바라보는 방식과 앱을 빌드하는 방식을 바꿀 수 있다. React로 사용자 인터페이스를 구축할 때는 먼저 컴포넌트라는 조각으로 분해한다. 그런 다음 각 컴포넌트로 서로 다른 시각적 상태를 표현다. 마지막으로 컴포넌트를 서로 연결하여 데이터가 흐르도록 한다. 이 튜토리얼에서는 React로 검색 가능한 제품 데이터 테이블을 구축하는 사고 과정을 안내한다.

## 목업으로 시작하기

이미 디자이너가 만든 JSON API와 목업이 있다고 상상해 보자.

JSON API는 다음과 같은 데이터를 반환한다:

```js
[
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
];
```

목업은 다음과 같다:

![](https://react.dev/images/docs/s_thinking-in-react_ui.png =60%x)

React에서 UI를 구현하려면 일반적으로 동일한 5단계를 따른다.

## 1단계: UI를 컴포넌트 계층 구조로 나누기

먼저 목업의 모든 컴포넌트와 하위 컴포넌트 주위에 상자를 그리고 이름을 지정한다. 디자이너와 함께 작업하는 경우 디자이너가 디자인 도구에서 이러한 구성 요소의 이름을 이미 지정했을 수 있다.

사람의 배경에 따라 디자인을 컴포넌트로 분할하는 방식은 다 다를 것이다.

- **프로그래밍** - 새 함수나 객체를 생성할지 여부를 결정할 때도 동일한 기법을 사용한다. 이러한 기법 중 하나는 *단일 책임 원칙*으로, 하나의 컴포넌트는 이상적으로는 한 가지 일만 수행해야 한다는 것이다. 컴포넌트가 커지면 더 작은 하위 컴포넌트로 분해해야 한다.
- **CSS** - CSS에서 클래스 선택자를 어디에 만들지 생각해 보라. (하지만 컴포넌트는 조금 덜 세분화되어 있다.)
- **디자인** - 디자인의 레이어를 어떻게 구성할지 고려한다.

JSON이 잘 구조화되어 있다면, 자연스럽게 UI의 컴포넌트 구조에 매핑되는 경우가 많다. 그 이유는 UI와 데이터 모델이 동일한 정보 아키텍처, 즉 동일한 형태를 가지고 있는 경우가 많기 때문이다. UI를 컴포넌트로 분리하고, 각 컴포넌트가 데이터 모델의 한 부분과 일치하도록 하리.

이 화면에는 다섯 가지 컴포넌트가 있다:

![](https://react.dev/images/docs/s_thinking-in-react_ui_outline.png =80%x)

1. `FilterableProductTable`(회색)에는 전체 앱이 포함된다.
2. `SearchBar`(파란색)는 사용자 입력을 받는다.
3. `ProductTable`(연보라색)은 사용자 입력에 따라 목록을 표시하고 필터링한다.
4. `ProductCategoryRow`(녹색)는 각 카테고리에 대한 제목을 표시한다.
5. `ProductRow`(노란색)는 각 제품에 대한 행을 표시한다.

`ProductTable`(연보라색)을 보면 테이블 헤더('Name' 및 'Price' 레이블이 포함된)가 자체 컴포넌트가 아닌 것을 알 수 있다. 이것은 선호도의 문제이며 어느 쪽이든 상관없다. 이 예제에서는 `ProductTable`의 목록 안에 표시되므로 `ProductTable`의 일부다. 그러나 이 헤더가 복잡해지면(예: 정렬을 추가하는 경우) 자체 `ProductTableHeader` 컴포넌트로 분리할 수 있다.

이제 목업에서 컴포넌트를 식별했으므로 계층 구조로 정렬한다. 목업의 다른 컴포넌트 안에 있는 컴포넌트는 계층 구조에서 하위 컴포넌트로 나타나야 한다:

- `FilterableProductTable`
  - `SearchBar`
  - `ProductTable`
    - `ProductCategoryRow`
    - `ProductRow`

## 2단계: React에서 정적 버전 빌드하기

이제 컴포넌트 계층 구조가 완성되었으니 이제 앱을 구현할 차례다. 가장 간단한 접근 방식은 인터랙티브를 추가하지 않고 데이터 모델에서 정적인 UI를 렌더링하는 버전을 빌드하는 것이다! 정적 버전을 먼저 빌드하고 나중에 인터랙티브를 추가하는 것이 더 쉬운 경우가 많다. 정적 버전을 구축하려면 많은 타이핑이 필요하지만, 대화형 기능은 반대로 많은 생각이 필요하지만 타이핑은 많이 하지 않아도 된다.

앱의 정적 버전을 빌드하려면 다른 컴포넌트를 재사용하고 props를 사용하여 데이터를 전달하는 컴포넌트를 빌드하는 것이 좋다. 프로퍼티는 부모에서 자식으로 데이터를 전달하는 방법이다. (상태의 개념에 익숙하다면 이 정적 버전을 빌드할 때 상태를 전혀 사용하지 않는다. 상태는 상호작용, 즉 시간이 지남에 따라 변하는 데이터에만 사용된다. 이 앱은 정적 버전이므로 필요하지 않다.)

계층 구조의 상위 컴포넌트부터 빌드하는 '하향식' 빌드(예: `FilterableProductTable`) 또는 하위 컴포넌트부터 작업하는 '상향식' 빌드(예: `ProductRow`) 중 하나를 선택할 수 있다. 일반적으로 소규모 프로젝트에서는 하향식으로 작성하는 것이 더 쉽고, 큰 프로젝트에서는 상향식으로 작성하는 것이 더 쉽다.

```jsx {% raw %}
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: 'red' }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />,
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" /> Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}{% endraw %}
```

컴포넌트를 빌드하고 나면 데이터 모델을 렌더링하는 재사용 가능한 컴포넌트 라이브러리를 갖게 된다. 이 앱은 정적 앱이므로 컴포넌트는 JSX만 반환한다. 계층 구조의 맨 위에 있는 컴포넌트(`FilterableProductTable`)는 데이터 모델을 props로 사용한다. 데이터가 최상위 컴포넌트에서 트리의 하단에 있는 컴포넌트로 흐르기 때문에 이를 단방향 데이터 흐름이라고 한다.

## 3단계: 최소한의 완전한 UI 상태 표현 찾기

UI를 대화형으로 만들려면 사용자가 기본 데이터 모델을 변경할 수 있도록 해야 한다. 이를 위해 상태(state)를 사용한다.

상태는 앱이 기억해야 하는 최소한의 변하는 데이터(changing data) 집합이라고 생각하면 된다. 상태를 구조화할 때 가장 중요한 원칙은 *반복되지 않도록 유지하는 것*이다([DRY - Don’t Repeat Yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)). 애플리케이션에 *필요한 상태의 최소한의 표현을 파악*하고 그 외의 모든 것은 온디맨드 방식으로 계산하라. 예를 들어, 쇼핑 목록을 작성하는 경우 항목을 배열로 상태 저장할 수 있다. 목록에 있는 항목의 개수도 표시하려면 항목의 개수를 다른 상태 값으로 저장하지 말고 배열의 길이를 읽으면 된다.

이제 이 예제 애플리케이션의 모든 데이터 조각을 생각해 보자:

1. 제품 원본 목록
2. 사용자가 입력한 검색 텍스트
3. 체크박스의 값
4. 필터링된 제품 목록

다음 중 어느 것이 상태일까? 상태가 아닌것을 식별하라:

- 시간이 지나도 변하지 않는가? 그렇다면 상태가 아니다.
- 부모로부터 프로퍼티를 통해 전달되는가? 그렇다면 상태가 아니다.
- 컴포넌트의 기존 상태 또는 프로퍼티를 기반으로 계산할 수 있는가? 그렇다면 확실히 상태가 아니다!

남은 것은 아마도 상태일 것이다.

다시 하나씩 살펴보자:

1. 원본 제품 목록은 프로퍼티로 전달되므로 상태가 아니다.
2. 검색 텍스트는 시간이 지남에 따라 변경되고 아무 것도 계산할 수 없으므로 상태다.
3. 체크박스의 값은 시간이 지남에 따라 변경되고 아무 것도 계산할 수 없으므로 상태다.
4. 필터링된 제품 목록은 원래 제품 목록을 가져와서 검색 텍스트 및 체크박스의 값에 따라 필터링하여 계산할 수 있으므로 상태가 아니다.

즉, 검색 텍스트와 체크박스의 값만 상태다!

:::important Props vs State

React에는 두 가지 유형의 "모델" 데이터가 있다: `props` 와 `state`. 이 두 가지는 매우 다르다:

- 프로퍼티는 함수에 전달하는 인수와 같다. 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달하고 형태를 조정 할 수 있게 해준다. 예를 들어 `Form` 은 `Button` 에 `color` 프로퍼티를 전달할 수 있다.
- 상태는 컴포넌트의 메모리와 같다. 컴포넌트가 일부 정보를 추적하고 상호작용에 반응하여 변경할 수 있게 해준다. 예를 들어 `Button` 은 `isHovered` 상태를 추적할 수 있다.

프로퍼티와 상태는 서로 다르지만 함께 작동한다. 부모 컴포넌트는 종종 일부 정보를 상태에 보관하고(변경할 수 있도록) 이를 자식 컴포넌트에 프로퍼티로 전달한다. 처음 읽었을 때 그 차이가 여전히 모호하게 느껴지더라도 괜찮다. 실제로 적용하려면 약간의 연습이 필요다!

:::

## 4단계: 주 소재지 파악하기

앱의 최소 상태 데이터를 식별한 후에는 이 상태 변경을 담당하는 컴포넌트 또는 상태를 소유하는 컴포넌트를 식별해야 한다. 기억하라: React는 단방향 데이터 흐름을 사용하여 부모 컴포넌트에서 자식 컴포넌트로 컴포넌트 계층 구조를 따라 데이터를 전달한다. 어떤 컴포넌트가 어떤 상태를 소유해야 하는지 즉시 명확하지 않을 수 있다. 이 개념을 처음 접하는 경우 어려울 수 있지만 다음 단계를 따라하면 이해할 수 있다!

애플리케이션의 각 상태에 대해:

1. 해당 상태를 기반으로 무언가를 렌더링하는 모든 컴포넌트를 식별한다.
2. 가장 가까운 공통 상위 컴포넌트, 즉 계층 구조에서 모든 컴포넌트 위에 있는 컴포넌트를 찾는다.
3. 상태가 어디에 위치할지 결정한다:
   1. 종종 상태를 공통 부모에 직접 넣을 수 있다.
   2. 상태를 공통 부모 위에 있는 컴포넌트에 넣을 수도 있다.
   3. 상태를 소유하기에 적합한 컴포넌트를 찾을 수 없다면 상태를 보관하기 위한 새 컴포넌트를 만들어 공통 부모 컴포넌트 위의 계층 구조 어딘가에 추가하라.

이전 단계에서는 이 애플리케이션에서 검색 입력 텍스트와 체크박스의 값이라는 두 가지 상태를 발견했다. 이 예제에서는 항상 함께 표시되므로 같은 위치에 배치하는 것이 좋다.

이제 이들에 대한 전략을 살펴보자:

1. 상태를 사용하는 컴포넌트를 식별한다:
   - `ProductTable` 은 해당 상태(검색 텍스트 및 체크박스 값)를 기준으로 제품 목록을 필터링해야 한다.
   - `SearchBar` 에 해당 상태(검색 텍스트 및 체크박스 값)를 표시해야 한다.
2. 공통 부모 찾기: 두 컴포넌트가 공유하는 첫 번째 부모 컴포넌트는 `FilterableProductTable`다.
3. 상태가 어디에 있는지 결정한다: 필터 텍스트와 체크박스 값은 `FilterableProductTable`에 보관한다.

따라서 상태 값은 `FilterableProductTable`에 저장된다.

`useState()` Hook으로 컴포넌트에 상태를 추가한다. Hook은 React에 "연결"할 수 있는 특별한 함수다. `FilterableProductTable`의 상단에 상태 변수 두 개를 추가하고 초기 상태를 지정한다:

```jsx
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
```

그런 다음 `filterText` 및 `inStockOnly`를 `ProductTable` 및 `SearchBar`에 프로퍼티로 전달한다:

```jsx
<div>
  <SearchBar filterText={filterText} inStockOnly={inStockOnly} />
  <ProductTable
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly}
  />
</div>
```

이제 애플리케이션이 어떻게 작동하는지 확인할 수 있다.

```jsx {% raw %}
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar filterText={filterText} inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: 'red' }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />,
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input type="text" value={filterText} placeholder="Search..." />
      <label>
        <input type="checkbox" checked={inStockOnly} /> Only show products in
        stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}{% endraw %}
```

form 편집이 아직 작동하지 않는다. 위의 샌드박스에 콘솔 오류가 발생하여 그 이유를 설명한다:

```bash
You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field.
```

위의 샌드박스에서 `ProductTable`과 `SearchBar`는 `filterText` 및 `inStockOnly` 프로퍼티를 읽어 테이블, 인풋 및 체크박스를 렌더링한다. 예를 들어 `SearchBar`가 입력 값을 채우는 방법은 다음과 같다:

```jsx
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."/>
```

하지만 아직 입력과 같은 사용자 작업에 응답하는 코드를 추가하지 않았다. 이것이 마지막 단계다.

## 5단계: 역방향 데이터 흐름 추가

현재 앱은 프로퍼티와 상태가 계층 구조 아래로 흐르면서 올바르게 렌더링된다. 그러나 사용자 입력에 따라 상태를 변경하려면 계층 구조의 깊은 곳에 있는 form 컴포넌트가 `FilterableProductTable` 의 상태를 업데이트해야 하므로 다른 방향으로 흐르는 데이터를 지원해야 한다.

React는 이러한 데이터 흐름을 명시적으로 만들지만, 양방향 데이터 바인딩보다 조금 더 많은 타이핑이 필요하다. 위의 예시에서 입력하거나 체크박스를 선택하면 React가 사용자의 입력을 무시하는 것을 볼 수 있다. 이것은 의도적인 것이다. `<input value={filterText} />`를 작성하면, 입력의 `value` 프로퍼티가 항상 `FilterableProductTable` 에서 전달된 `filterText` 상태와 같도록 설정한 것이다. `filterText` 상태가 설정되지 않으므로 입력은 절대 변경되지 않는다.

사용자가 form 입력을 변경할 때마다 해당 변경 사항을 반영하여 상태가 업데이트되도록 만들고 싶다. 이 상태는 `FilterableProductTable`이 소유하고 있으므로 이 함수만 `setFilterText` 및 `setInStockOnly`를 호출할 수 있다. `SearchBar`가 `FilterableProductTable`의 상태를 업데이트하도록 하려면 이러한 함수를 `SearchBar`에 전달해야 한다:

```jsx
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

`SearchBar` 내부에 `onChange` 이벤트 핸들러를 추가하고 이 핸들러에서 부모 상태를 설정한다:

```jsx
<input
  type="text"
  value={filterText}
  placeholder="Search..."
  onChange={(e) => onFilterTextChange(e.target.value)}
/>
```

이제 애플리케이션이 완전히 작동한다!
