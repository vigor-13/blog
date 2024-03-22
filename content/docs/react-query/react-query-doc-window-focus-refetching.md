---
title: 윈도우 포커스 refetching
description:
date: 2024-03-22
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/window-focus-refetching',
    },
  ]
---

사용자가 애플리케이션을 떠났다가 돌아왔을 때 쿼리 데이터가 오래된 경우, TanStack Query는 백그라운드에서 자동으로 새로운 데이터를 요청한다. 이 기능은 `refetchOnWindowFocus` 옵션을 사용하여 전역적으로 또는 쿼리별로 비활성화할 수 있다.

**전역 비활성화**

```tsx
//
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

**쿼리별로 비활성화**

```tsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchOnWindowFocus: false,
});
```

## 커스텀 윈도우 포커스 이벤트 {#custom-window-focus-event}

드문 경우지만, TanStack Query가 데이터를 재검증하도록 트리거하는 자체 윈도우 포커스 이벤트가 필요할 수도 있다. 이를 위해 TanStack Query는 윈도우가 포커싱될 때 실행할 콜백을 사용자가 직접 설정할 수 있도록 하는 `focusManager.setEventListener` 함수를 제공한다. `focusManager.setEventListener` 를 호출하면 이전에 설정된 핸들러가 제거되고 대신 새 핸들러가 사용된다.

예를 들어 기본 핸들러는 다음과 같다:

```tsx
focusManager.setEventListener((handleFocus) => {
  // Listen to visibilitychange
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('visibilitychange', () => handleFocus(), false);
    return () => {
      // Be sure to unsubscribe if a new handler is set
      window.removeEventListener('visibilitychange', () => handleFocus());
    };
  }
});
```

## React Native에서 포커스 관리하기 {#managing-focus-in-react-native}

`window` 이벤트 리스너 대신 React Native는 `AppState` 모듈을 통해 포커스 정보를 제공한다. `AppState` 상태가 "active" 로 변경될 때 `AppState` "change" 이벤트를 사용하여 업데이트를 트리거할 수 있다:

```tsx
import { AppState } from 'react-native';
import { focusManager } from '@tanstack/react-query';

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

useEffect(() => {
  const subscription = AppState.addEventListener('change', onAppStateChange);

  return () => subscription.remove();
}, []);
```

## 포커스 상태 관리 {#managing-focus-state}

```tsx
import { focusManager } from '@tanstack/react-query';

// 기본 포커스 상태 오버라이드
focusManager.setFocused(true);

// 기본 포커스 상태로 돌아가기
focusManager.setFocused(undefined);
```
