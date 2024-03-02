---
title: 캐시 대상 결정하기
description:
date: 2024-03-02
tags: [cache]
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/caching/what-to-cache',
    },
  ]
---

기본적으로 모든 태스크의 콘솔 출력은 항상 터보레포에 의해 캡처된다. 태스크에서 파일을 내보내지 않는 경우(예: Jest를 사용한 단위 테스트) `outputs` 을 생략할 수 있다. 그 외에는 일반적으로 후속 종속 작업을 실행하기 위해 캡처(및 복원!)해야 하는 디스크의 파일을 지정해야 한다.

## 캐시 출력 설정 {#configuring-cache-outputs}

다음과 같이 `pipeline.<task>.outputs` 내에 글로브 배열을 지정하여 터보레포에서 캐시 출력을 구성할 수 있다:

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```

### 포함 {#inclusions}

앞선 `build` 태스크 정의에서는 전체 터보레포의 모든 `build` 태스크에 적용된다는 점에 유의해야 한다. 특히 레포지토리가 커짐에 따라 각 개별 태스크의 출력 위치에 약간의 차이가 있을 수 있다.

예를 들어, 빌드 중에 생성되는 아티팩트가 `dist` 대신 `lib` 에 나타나는 유틸리티 워크스페이스가 있을 수 있는데, 이렇게 되면 기존 설정으로는 dist를 사용하는 워크스페이스와 lib을 사용하는 워크스페이스 모두 정상적동 하지 않는다.

이 문제를 해결하는 방법에는 두 가지가 있다. 첫 번째 옵션은 출력에 `lib` 디렉터리를 포함하는 것이다:

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "outputs": ["dist/**", "lib/**"]
    }
  }
}
```

이 패턴은 터보의 모든 워크스페이스에 대해 `dist` 및 `lib` 폴더가 비어 있으면 잘 작동한다. `turbo` 는 해당 폴더에 나타나는 모든 파일을 캡처한다.

그러나 모든 워크스페이스에서 패턴이 충분히 일관되지 않은 경우 워크스페이스별로 패턴을 정의하거나 [워크스페이스 구성](https://turbo.build/repo/docs/core-concepts/monorepos/configuring-workspaces)을 사용할 수 있다.

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "app#build": {
      "outputs": ["dist/**"]
    },
    "util#build": {
      "outputs": ["lib/**"]
    }
  }
}
```

디렉터리 안에 있는 모든 파일을 `/**` 연산자를 사용하여 지정해야 한다는 것을 알 수 있다. 단순히 디렉터리 이름(예: `lib`)을 지정하면 디렉터리 자체만 포함되고 그 안의 내용은 포함되지 않는다.

### 제외 {#exclusions}

때로는 캐시해야 할 파일을 지정하는 가장 간단한 방법은 포함할 파일을 지정하고 거기에서 제외해야 할 파일을 지정하는 것이다.

예를 들어 기본 Next.js 애플리케이션의 가장 간단한 구성은 다음과 같다:

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "app#build": {
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

글로브 패턴 앞에 `!` 를 지정하여 일치하는 모든 파일을 제외할 수 있다.
