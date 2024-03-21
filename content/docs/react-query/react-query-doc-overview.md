---
title: React Query 개요
description:
date: 2024-03-16
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/overview',
    },
  ]
---

## 개요 {#overview}

TanStack Query(FKA React Query)는 흔히 웹 애플리케이션을 위한 데이터 가져오기 라이브러리로 설명되지만, 보다 기술적인 측면에서 보면 웹 애플리케이션에서 **서버 상태를 쉽게 가져오고, 캐싱, 동기화 및 업데이트**를 할 수 있게 해준다.

## 동기 {#motivation}

대부분의 핵심 웹 프레임워크는 **데이터를 가져오거나 업데이트하는 방식을 강제하지 않는다**. 이로 인해 개발자들은 데이터 가져오기에 대한 기능을 캡슐화하는 메타 프레임워크를 만들거나 자체 데이터 가져오기 솔루션을 개발하기 마련이다. 이로 인해 컴포넌트 기반 상태와 사이드이펙트를 결합하거나 보다 일반적인 목적의 상태 관리 라이브러리를 사용하여 앱 전반에 걸쳐 비동기 데이터를 저장하고 제공한다.

전통적인 상태 관리 라이브러리 대부분은 클라이언트 상태를 대상으로 작업하는 데 훌륭하지만 **비동기적이거나 서버 상태를 작업하는 데는 그다지 효과적이지 않다.** 이는 **서버 상태가 완전히 다르기 때문**이다.

먼저, 서버 상태는 다음과 같은 특징이 있다:

- 사용자가 제어하거나 소유하지 않는 위치에서 원격으로 유지된다.
- 가져오기 및 업데이트에 비동기 API가 필요하다.
- 공유 소유권을 의미하며 사용자 모르게 다른 사람이 변경할 수 있다.
- 주의하지 않으면 애플리케이션에서 잠재적으로 "오래된" 상태를 유지할 수 있다.

애플리케이션에서 서버 상태의 본질을 이해하면, 계속해서 더 많은 문제점들이 있다는 것을 알게된다. 예를 들어:

- 캐싱... (프로그래밍에서 가장 어려운 작업일 수 있음)
- 동일한 데이터에 대한 여러 요청을 단일 요청으로 중복 제거하기
- 백그라운드에서 "오래된" 데이터 업데이트하기
- 데이터가 "오래된" 시기 파악하기
- 가능한 한 빨리 데이터에 업데이트 반영하기
- 페이지 매김 및 지연 로딩 데이터와 같은 성능 최적화
- 서버 상태의 메모리 및 가비지 컬렉션 관리
- 구조적 공유를 통한 쿼리 결과 메모화

만약 위의 목록에 압도당하지 않았면, 아마도 이미 모든 서버 상태 문제를 해결했으며 충분히 상을 받을 자격이 있다. 그러나 대부분의 사람들처럼, 이러한 도전에 대부분이나 모두 아직 대응하지 않았거나 단순히 표면만 긁은 상태일 것이다!

React Query는 확실히 서버 상태를 관리하기 위한 최고의 라이브러리 중 하나다. 이는 제로 구성으로 놀랍게 잘 작동하며, 애플리케이션이 성장함에 따라 원하는 대로 커스터마이징 할 수 있다.

기술적인 측면에서, React Query는 다음과 같은 일을 할 것이다:

- 복잡하고 오해하기 쉬운 많은 코드 라인을 제거하고 React Query 로직 몇 줄만으로 대체한다.
- 새 서버 상태 데이터 소스를 연결해야하는 걱정을 할 필요없이 새로운 기능을 쉽게 구축하고 유지 관리 가능한 애플리케이션으로 만들어 준다.
- 애플리케이션이 이전보다 더 빠르고 반응성이 뛰어나게 느껴지도록 함으로써 최종 사용자에게 영향을 미친다.
- 대역폭을 절약하고 메모리 성능을 향상시킬 수 있도록 도와준다.

## 코드 미리보기 {#show-some-code}

아래 예시에서는 가장 기본적이고 간단한 형태의 React Query가 React Query GitHub 프로젝트의 GitHub 통계를 가져오는 데 사용되는 것을 볼 수 있다:

```tsx
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then((res) =>
        res.json(),
      ),
  });

  if (isPending) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}
```
