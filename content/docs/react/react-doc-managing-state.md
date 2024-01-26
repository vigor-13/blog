---
title: 상태 관리하기
description:
date: 2024-01-26
tags: []
references:
  [{ key: 'React 공식 문서', value: 'https://react.dev/learn/managing-state' }]
---

애플리케이션이 성장함에 따라 상태를 구성하는 방법과 컴포넌트 간의 데이터 흐름에 대해 보다 계획적인 태도로 접근하는 것이 좋다. 불필요하거나 중복된 상태는 버그의 원인이 된다. 이 장에서는 상태를 잘 구조화하는 방법, 상태 업데이트 로직을 유지 관리하는 방법, 멀리 떨어져 있는 컴포넌트 간에 상태를 공유하는 방법에 대해 알아본다.

## 상태로 입력에 반응하기 {#reacting-to-input-with-state}

React에서는 UI를 직접 수정하지 않는다. 예를 들어 "버튼 비활성화", "버튼 활성화", "성공 메시지 표시" 등과 같은 명령을 작성하지 않는다. 대신 컴포넌트의 다양한 시각적 상태('초기 상태', '입력 상태', '성공 상태')에 대해 표시하고자 하는 UI를 설명한 다음 사용자 입력에 따라 상태 변경을 트리거한다. 이는 디자이너가 UI에 대해 생각하는 방식과 유사하다.

다음은 React를 사용해 만든 퀴즈 Form이다. `status` 변수를 사용하여 Submit 버튼을 활성화 또는 비활성화할지 여부와 성공 메시지를 대신 표시할지 여부를 결정하는 방법에 주목하라.

```jsx
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={answer.length === 0 || status === 'submitting'}>
          Submit
        </button>
        {error !== null && <p className="Error">{error.message}</p>}
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima';
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

## 상태 구조 결정하기 {#choosing-state-structure}

상태를 잘 구조화하면 수정과 디버깅이 쉬운 컴포넌트를 만들 수 있다. 가장 중요한 원칙은 상태에 불필요하거나 중복된 정보를 포함하지 않아야 한다는 것이다. 불필요한 상태가 있으면 업데이트하는 것을 잊어버려 버그를 유발하기 쉽다!

:::tabs

@tab:active Bad Case#bad

예를 들어, 아래의 Form에는 불필요한 `fullName` 상태 변수가 있다:

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name: <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name: <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

@tab Good Case#good

`fullName` 은 다른 상태 변수로 계산이 가능하므로 이를 제거하고 코드를 단순화할 수 있다:

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name: <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name: <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

:::

작은 변화처럼 보일 수 있지만, React에서 많은 버그를 이런 식으로 수정할 수 있다.

## 컴포넌트간에 상태 공유하기 {#sharing-state-between-components}

때로는 두 컴포넌트의 상태가 항상 함께 변경되기를 원할 때도 있다. 이렇게 하려면 두 컴포넌트에서 상태를 제거하고 가장 가까운 공통 부모로 이동한 다음 프로퍼티를 통해 전달하면 된다. 이를 "상태 올리기(lifting state up)"라고 하며, React 코드를 작성할 때 가장 흔히 하는 작업 중 하나다.

이 예시에서는 한 번에 하나의 패널만 활성화해야 한다. 이를 위해 각 개별 패널 내부에 활성 상태를 유지하는 대신 부모 컴포넌트가 상태를 유지하고 자식에 대한 프로퍼티를 지정한다.

```jsx
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest
        city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for
        "apple" and is often translated as "full of apples". In fact, the region
        surrounding Almaty is thought to be the ancestral home of the apple, and
        the wild <i lang="la">Malus sieversii</i> is considered a likely
        candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive, onShow }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
    </section>
  );
}
```

## 상태 보존 및 재설정 하기 {#preserving-and-resetting-state}

컴포넌트를 다시 렌더링할 때 React는 트리의 어떤 부분을 유지하고 업데이트할지, 어떤 부분을 버리거나 처음부터 다시 생성할지 결정해야 한다. 대부분의 경우 React는 이러한 프로세스를 자동으로 잘 처리한다. 기본적으로 React는 이전에 렌더링된 컴포넌트 트리와 "일치하는" 트리의 부분은 보존한다.

하지만 때로는 이를 원하지 않는 경우가 있다. 다음의 채팅 앱에서는 메시지를 입력한 후 수신자를 전환해도 입력이 재설정되지 않는다. 이로 인해 사용자가 실수로 엉뚱한 사람에게 메시지를 보낼 수 있다:

:::tabs

@tab:active App.js#app

```jsx
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={(contact) => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  );
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' },
];
```

@tab ContactList.js#contact-list

```jsx
export default function ContactList({ selectedContact, contacts, onSelect }) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.email}>
            <button
              onClick={() => {
                onSelect(contact);
              }}
            >
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

@tab Chat.js#chaat

```jsx
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

:::

React에서는 컴포넌트에 다른 `key` 를 전달하면 컴포넌트의 기본 동작을 재정의하고 상태를 재설정할 수 있다. 예를 들어 `<Chat key={email} />`와 같이 키를 전달하는 것은 React에게 수신자가 다르면 기존의 `Chat` 컴포넌트 대신 새로운 데이터 및 UI로 구성된 다른 `Chat` 컴포넌트로 간주하라고 알려주는 것이다. 이제 수신자를 전환하면 입력 필드가 재설정되며(컴포넌트는 동일하게 렌더링되지만) 이전에 입력한 내용이 초기화된다.

:::tabs

@tab:active App.js#app

```jsx
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={(contact) => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  );
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' },
];
```

@tab ContactList.js#contact-list

```jsx
export default function ContactList({ selectedContact, contacts, onSelect }) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.email}>
            <button
              onClick={() => {
                onSelect(contact);
              }}
            >
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

@tab Chat.js#chaat

```jsx
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

:::

## 상태 로직을 리듀서로 추출하기 {#extracting-state-logic-into-reducer}

많은 상태 업데이트가 여러 이벤트 핸들러에 분산되어 있는 컴포넌트는 과부하가 걸릴 수 있다. 이러한 경우 컴포넌트 외부의 모든 상태 업데이트 로직을 "reducer"라는 단일 함수로 통합할 수 있다. 이벤트 핸들러는 사용자 "액션"만 지정하기 때문에 간결해진다. 파일 맨 아래에서 리듀서 함수는 각 액션에 대한 응답으로 상태가 어떻게 업데이트되어야 하는지 지정한다!

```jsx
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

## 컨텍스트로 데이터 전달하기 {#passing-data-deeply-with-context}

일반적으로 부모 컴포넌트에서 자식 컴포넌트로 정보를 전달할 때는 프로퍼티를 통해 전달한다. 하지만 일부 프로퍼티를 여러 컴포넌트에 전달해야 하거나 여러 컴포넌트에 동일한 정보가 필요한 경우 프로퍼티를 전달하는 것이 불편할 수 있다. 컨텍스트를 사용하면 부모 컴포넌트가 프로퍼티를 통해 명시적으로 전달하지 않고도 그 아래 트리의 모든 컴포넌트에서 일부 정보를 사용할 수 있다.

여기서 `Heading` 컴포넌트는 가장 가까운 `Section` 에게 레벨을 "요청"하여 자체 제목 레벨을 결정한다. 각 `Section` 은 부모 `Section` 에게 레벨을 물어보고 그에 1을 더하여 자체 레벨을 추적한다. 각 `Section` 은 프로퍼티를 전달하지 않고 컨텍스트를 통해 그 아래의 모든 컴포넌트에 정보를 제공한다.

:::tabs

@tab:active App.js#app

```jsx
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

@tab Section.js#section

```jsx
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

@tab Heading.js#heading

```jsx
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

@tab LevelContext.js#level-context

```jsx
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

:::

## 리듀서와 컨텍스트로 확장하기 {#scaling-up-with-reducer-and-context}

리듀서를 사용하면 컴포넌트의 상태 업데이트 로직을 통합할 수 있다. 컨텍스트를 사용하면 다른 컴포넌트에 정보를 깊숙이 전달할 수 있다. 리듀서와 컨텍스트를 함께 사용하여 복잡한 화면의 상태를 관리할 수 있다.

이 접근 방식을 사용하면 복잡한 상태를 가진 부모 컴포넌트가 리듀서를 사용하여 상태를 관리한다. 트리의 깊은 곳에 있는 다른 컴포넌트는 컨텍스트를 통해 해당 상태를 읽을 수 있다. 또한 해당 상태를 업데이트하기 위해 액션을 디스패치할 수도 있다.

:::tabs

@tab:active App.js#app

```jsx
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

@tab TasksContext.js#task-context

```jsx
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false },
];
```

@tab AddTask.js#add-task

```jsx
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          dispatch({
            type: 'added',
            id: nextId++,
            text: text,
          });
        }}
      >
        Add
      </button>
    </>
  );
}

let nextId = 3;
```

@tab TaskList.js#tast-list

```jsx
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value,
              },
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked,
            },
          });
        }}
      />
      {taskContent}
      <button
        onClick={() => {
          dispatch({
            type: 'deleted',
            id: task.id,
          });
        }}
      >
        Delete
      </button>
    </label>
  );
}
```

:::
