---
title: 중요한 기본 값
description:
date: 2024-03-16
tags: []
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults',
    },
  ]
---

기본적으로 TanStack Query는 **공격적이지만 합리적인 기본값**으로 구성된다. 때로는 이러한 기본값이 신규 사용자를 당황하게 하거나 사용자가 알지 못하는 경우 학습/디버깅을 어렵게 만들 수 있다. TanStack Query를 계속 학습하고 사용하면서 이러한 기본값을 충분히 숙지해야 한다:

- 기본적으로 `useQuery` 또는 `useInfiniteQuery` 쿼리 인스턴스는 **캐시된 데이터를 오래된 것으로 간주한다.**

> `staleTime` 옵션을 사용하여 전역 또는 각 쿼리별로 설정을 변경할 수 있다. 더 긴 `staleTime` 을 지정하면 쿼리가 데이터를 덜 가져오게 된다.

- 오래된 쿼리는 다음과 같은 경우 백그라운드에서 자동으로 다시 가져온다:
  - 쿼리의 새 인스턴스가 마운트되는 경우
  - 창이 다시 포커스 되는 경우
  - 네트워크가 다시 연결된 경우
  - 쿼리가 선택적으로 다시 가져오기 간격을 구성한 경우

> 이 기능을 변경하려면 `refetchOnMount` , `refetchOnWindowFocus` , `refetchOnReconnect` 및 `refetchInterval` 과 같은 옵션을 사용한다

- `useQuery` , `useInfiniteQuery` 또는 쿼리 옵저버의 활성 인스턴스가 더 이상 없는 쿼리 결과는 "비활성"으로 표시되며 나중에 다시 사용될 경우를 대비하여 캐시에 남아 있다.

- 기본적으로 '비활성' 쿼리는 **5분** 후에 가비지 콜렉팅 된다.

> 이를 변경하려면 쿼리에 대한 기본 `gcTime` 을 `1000 * 60 * 5` 밀리초가 아닌 다른 값으로 변경한다.

- 실패한 쿼리는 **조용히 3번 다시 시도되며**, 오류를 포착하여 UI에 표시하기 전에 **exponential backoff delay가 발생**한다.

> 이를 변경하려면 쿼리의 기본 `retry` 및 `retryDelay` 옵션을 `3` 과 기본 exponential backoff delay 함수 이외의 다른 값으로 수정할 수 있다.

:::note exponential backoff delay
exponential backoff delay는 일정한 시간 간격으로 재시도하는 것이 아니라, 재시도 간격을 점차 증가시켜서 네트워크 요청의 부하를 줄이는 방식이다. 예를 들어, 첫 번째 재시도 후에는 1초를 기다리고, 두 번째 재시도 후에는 2초를 기다리는 식으로 각 재시도 간격을 두 배씩 증가시킨다. 이는 네트워크 문제나 서버 부하 등으로 인해 일시적으로 요청이 실패할 때, 서버에 대한 과도한 부하를 방지하고, 네트워크 혼잡을 완화하는 데 도움이 된다.
:::

기본적으로 쿼리 결과는 구조적으로 공유되어 데이터가 실제로 변경되었는지 감지하고, 변경되지 않은 경우 데이터 참조는 변경되지 않은 채로 유지되어 `useMemo` 및 `useCallback` 에 대한 값 안정화에 더 도움이 된다. 이 개념이 낯설게 들리더라도 걱정하지 않아도 된다! 99.9%의 경우 이 기능을 비활성화할 필요가 없으며 비용 없이 앱의 성능을 향상시킬 수 있다.

> 구조적 공유는 JSON 호환 값에서만 작동하며, 다른 값 유형은 항상 변경된 것으로 간주된다. 예를 들어 대규모 응답으로 인해 성능 문제가 발생하는 경우 `config.structuralSharing` 플래그를 사용하여 이 기능을 비활성화할 수 있다. 쿼리 응답에서 JSON과 호환되지 않는 값을 처리하면서도 데이터가 변경되었는지 여부를 감지하려는 경우 필요에 따라 참조를 유지하면서 이전 응답과 새 응답에서 값을 계산하는 사용자 지정 함수를 `config.structuralSharing` 으로 제공할 수 있다.
