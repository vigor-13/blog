---
title: 패키지 및 태스크 그래프
description:
date: 2024-07-11
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/package-and-task-graph',
    },
  ]
---

## 패키지 그래프

**패키지 그래프**는 프로젝트의 전체 구조를 보여주는 지도와 같은 역할을 한다.

이는 프로젝트의 여러 부분(패키지)이 서로 어떻게 의존하는지를 나타낸다.

Turborepo는 이러한 패키지 간의 관계를 자동으로 파악하여 개발자가 일일이 명시하지 않아도 되게 해준다.

한편, **태스크 그래프**는 이 구조(패키지 그래프)를 바탕으로 실제 작업이 어떤 순서로 진행되어야 하는지를 나타낸다.

이 두 그래프를 통해 Turborepo는 프로젝트의 구조와 작업 순서를 이해하고, 프로젝트를 더욱 효율적으로 관리하고 실행할 수 있게 도와준다.

네, 번역과 함께 한국어에 맞게 표현을 조정해 드리겠습니다:

## 태스크 그래프

`turbo.json` 파일을 통해 태스크들이 서로 어떻게 연관되는지 정의할 수 있다.

그리고 이러한 관계를 태스크 간의 의존성 또는 **태스크 그래프**라고 부른다.

Turborepo는 저장소와 그 태스크들을 이해하기 위해 [방향성 비순환 그래프(DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph) 데이터 구조를 사용한다.

이 그래프는 <u>노드</u>와 <u>엣지</u>로 구성되며, 노드는 태스크를, 엣지는 태스크 간의 의존성을 나타낸다.

방향성 그래프는 각 노드를 연결하는 엣지가 방향을 가진다는 것을 의미한다.

즉, 태스크 A가 태스크 B를 가리키면, 태스크 A가 태스크 B에 의존한다고 말할 수 있다.

엣지의 방향은 어떤 태스크가 어떤 태스크에 의존하는지에 따라 결정된다.

예를 들어, `./apps/web` 애플리케이션이 `@repo/ui` 와 `@repo/utils` 두 패키지에 의존하는 모노레포가 있다고 가정해 보자:

```text
apps
  web
packages
  ui
  utils
```

그리고 `^build` 에 의존하는 `build` 태스크가 있다:

```json
// ./turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

이 경우 Turborepo는 다음과 같은 태스크 그래프를 구성한다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo/core-concepts-package-and-task-graphs/1.png)

### 전이(transit) 노드

태스크 그래프를 구축할 때 중첩된 의존성을 처리하는 것은 어려운 과제다.

예를 들어, 모노레포에 `ui` 패키지에 의존하는 `docs` 앱이 있고, `ui` 패키지는 다시 `core` 패키지에 의존한다고 가정해 보자:

```text
apps
  docs
packages
  ui
  core
```

여기서 `docs` 앱과 `core` 패키지에는 각각 `build` 태스크가 있지만, `ui` 패키지에는 없다.

또한 `turbo.json` 에서 위와 같이 `"dependsOn": ["^build"]` 로 `build` 태스크를 구성한다.

이때 `turbo run build` 를 실행하면 어떤 일이 일어날까?

Turborepo는 다음과 같이 태스크 그래프를 구축할 것이다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo/core-concepts-package-and-task-graphs/2.png)

위의 그래프는 다음과 같이 단계별로 생각해볼 수 있다:

- `docs` 앱은 `ui` 에만 의존한다.
- `ui` 패키지는 `build` 스크립트가 없다.
- `ui` 패키지의 의존성에는 `build` 스크립트가 있으므로, 태스크 그래프는 이를 포함한다.

Turborepo는 이 시나리오에서 `ui` 패키지를 전이 노드라고 부른다.

`ui` 패키지는 자체 `build` 스크립트가 없기 때문에 Turborepo는 이에 대해 아무것도 실행하지 않지만, 자체 의존성을 포함하기 위해 여전히 그래프에 포함된다.

#### 진입점으로서의 전이 노드

Turborepo는 프로젝트의 모든 노드를 동등하게 중요하게 취급하며, 중간 단계의 노드(전이 노드)도 항상 태스크 그래프에 포함시킨다.

하지만 이로 인해 예상치 못한 상황이 발생할 수 있다.

예를 들어, `build` 태스크 전에 항상 `test` 태스크를 수행하도록 설정한 경우,

```json
// ./turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^test"]
    }
  }
}
```

`turbo run build` 명령을 실행하면 실제로 `build` 태스크가 없는 경우에도 관련된 모든 패키지의 `test` 태스크를 실행하려 할 수 있다.

이는 Turborepo가 모든 연결된 작업을 실행하려는 특성 때문이다.

이러한 방식은 때로는 효율적일 수 있지만, 다른 한편으로는 의도하지 않은 많은 작업이 실행될 수 있어 주의가 필요하다.
