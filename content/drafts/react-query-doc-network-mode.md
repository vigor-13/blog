---
title: 쿼리 함수
description:
date: 2024-03-16
tags: [react_query, tanstack_query]
references:
  [
    {
      key: 'Tanstack Query 공식 문서',
      value: 'https://tanstack.com/query/latest/docs/framework/react/guides/network-mode',
    },
  ]
---

TanStack Query는 네트워크 연결이 없는 경우 쿼리 및 뮤테이션이 어떻게 작동해야 하는지를 구분하기 위해 세 가지 네트워크 모드를 제공한다. 이 모드는 각 쿼리/뮤테이션에 대해 개별적으로 설정하거나 쿼리/뮤테이션 기본값을 통해 전역적으로 설정할 수 있다.

TanStack Query는 데이터 가져오기 라이브러리와 함께 데이터 가져오기에 가장 자주 사용되므로 기본 네트워크 모드는 [온라인](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode#network-mode-online)이다.

## 네트워크 모드: online {#network-mode-online}

이 모드에서는 네트워크에 연결되어 있지 않으면 쿼리 및 뮤테이션이 실행되지 않는다. 이것이 기본 모드다.

쿼리에 대한 가져오기가 시작되면 네트워크에 연결되어 있지 않아 가져오기를 수행할 수 없는 경우 항상 현재 `state` ( `pending` , `error` , `success` )로 유지된다. 그러나 `fetchStatus` 가 추가로 노출된다. 이것은 다음 중 하나다:

- `fetching` : `queryFn` 이 실제로 실행 중이다. 요청이 실행 중이다.
- `paused` : 쿼리가 실행되고 있지 않다. 다시 연결될 때까지 `paused` 된다.
- `idle` : 쿼리를 실행하고 있지 않고 일시 중지되지 않는다.

이 상태에서 파생되어 편의를 위해 노출되는 플래그는 `isFetching` 및 `isPaused` 다.

> 로딩 중인 스피너를 표시하기 위해 `pending` 상태를 확인하는 것만으로는 충분하지 않을 수 있다. 쿼리의 상태는 'peding'일 수 있지만, 처음 마운트하는 중이고 네트워크 연결이 없는 경우 `fetchStatus: 'paused'`일 수 있다.

온라인 상태이기 때문에 쿼리가 실행되지만 가져오기가 계속 진행되는 동안 오프라인 상태가 되면 TanStack Query도 재시도 메커니즘을 일시 중지한다. 일시 중지된 쿼리는 네트워크 연결이 다시 되면 계속 실행된다. 이는 다시 가져오기가 아니라 계속하기 때문에 `refetchOnReconnect`(이 모드에서는 기본값이 `true`임)와는 별개다. 그 사이에 쿼리가 취소된 경우에는 계속 진행되지 않는다.

## 네트워크 모드: always {#network-mode-always}

이 모드에서 TanStack Query는 항상 온라인/오프라인 상태를 무시한고 가져오기를 실행한다. TanStack Query가 작동하기 위해 활성 네트워크 연결이 필요하지 않은 환경(예: `AsyncStorage` 에서 읽기만 하거나 `queryFn` 에서 `Promise.resolve(5)` 만 반환하려는 경우)에서 TanStack Query를 사용하는 경우 이 모드를 선택할 수 있다.

- 네트워크에 연결되어 있지 않다고 해서 쿼리가 `paused` 되지 않는다.
- 재시도도 일시 중지되지 않으며 쿼리가 실패하면 `error` 상태로 전환된다.
- 네트워크에 다시 연결하는 것은 더 이상 오래된 쿼리를 다시 가져와야 한다는 좋은 지표가 아니므로 이 모드에서 `refetchOnReconnect`는 기본적으로 `false` 로 설정된다. 원하는 경우 여전히 이 모드를 켤 수 있다.

## 네트워크 모드: offlineFirst {#network-mode-offline-first}

이 모드는 처음 두 옵션의 중간 지점으로, TanStack Query가 `queryFn` 을 한 번 실행한 다음 재시도를 일시 중지한다. [오프라인 우선 PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers)에서처럼 캐싱 요청을 가로채는 서비스 워커가 있거나 [Cache-Control 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#the_cache-control_header)를 통해 HTTP 캐싱을 사용하는 경우 매우 유용하다.

이러한 상황에서는 오프라인 저장소/캐시에서 가져오기 때문에 첫 번째 가져오기가 성공할 수 있다. 그러나 캐시 누락이 발생하면 네트워크 요청이 실패하며, 이 경우 이 모드는 `online` 쿼리처럼 작동하여 재시도를 일시 중지한다.

## 개발도구 {#devtools}

탄스택 쿼리 개발 도구는 쿼리를 가져올 수 있지만 네트워크에 연결되어 있지 않은 경우 `paused` 상태로 쿼리를 표시한다. 오프라인 동작을 모의로 설정하는 토글 버튼도 있다. 이 버튼은 실제로 네트워크 연결을 방해하지는 않지만(브라우저 개발자 도구에서 그렇게 할 수 있음), `OnlineManager` 를 오프라인 상태로 설정한다는 점에 유의한다.

## 시그니처 {#signature}

- `networkMode: 'online' | 'always' | 'offlineFirst`
  - 옵션
  - 기본 값은 `online`
