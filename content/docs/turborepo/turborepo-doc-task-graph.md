---
title: 태스크 그래프
description:
date: 2024-01-18
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/monorepos/task-graph',
    },
  ]
---

이전 섹션에서는 터보레포가 `turbo.json`을 사용하여 태스크들이 서로 어떻게 연관되어 있는지 표현하는 방법에 대해 설명했다. 이러한 관계를 태스크 간의 종속성으로 생각할 수 있지만, 좀 더 공식적인 명칭은 **태스크 그래프**(Task Graph)다.

Turbo는 [방향성 비순환 그래프(Directed Acyclic Graph)](https://en.wikipedia.org/wiki/Directed_acyclic_graph)라는 데이터 구조를 사용하여 레포지토리와 해당 태스크를 이해한다. 그래프는 "**노드**(nodes)"와 "**에지**(edges)"로 구성된다. 태스크 그래프에서 노드는 태스크이고 에지는 태스크 간의 종속성을 나타낸다. 방향성 그래프는 각 노드를 연결하는 에지에 방향이 있음을 나타내므로, 태스크 A가 태스크 B를 가리키면 태스크 A가 태스크 B에 종속되어 있다고 말할 수 있다. 에지의 방향은 어떤 태스크가 어떤 태스크에 종속되어 있는지에 따라 달라진다.

예를 들어 `@repo/ui` 와 `@repo/utils` 두 개의 패키지에 의존하는 애플리케이션 `apps/web`이 있는 모노레포가 있다고 가정해 보자:

```text
my-monorepo
└─ apps
 └─ web
└─ packages
 └─ ui
 └─ utils
```

그리고 `^build` 에 의존하는 `build` 태스크가 있다:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

터보레포는 태스크 그래프를 다음과 같이 그릴 것이다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-task-graph/1.png)

## 환승 노드(Transit Nodes) {#transit-node}

태스크 그래프를 만들 때 어려운 점은 중첩된 종속성을 처리하는 것이다. 예를 들어, 모노레포에 `core` 패키지에 종속된 `ui` 패키지에 종속된 `docs` 앱이 있다고 가정해 보자:

```text
my-monorepo
└─ apps
 └─ docs
└─ packages
 └─ ui
 └─ core
```

`docs` 앱과 `core` 패키지에는 각각 `build` 태스크이 있지만 `ui` 패키지에는 `build` 작업이 없다고 가정해 보자. 또한 위와 같은 방식으로 `dependsOn: ["^build"]`을 사용하여 `build` 태스크를 구성하는 `turbo.json` 이 있다. `turbo run build` 를 실행하면 어떤 일이 발생할까?

터보레포는 다음과 같은 작업 그래프를 빌드할 것이다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-task-graph/2.png)

이 그래프는 일련의 단계로 생각할 수 있다:

- `docs` 앱은 `ui` 에만 의존한다.
- `ui` 패키지에는 `build` 스크립트가 없다.
- `ui` 패키지의 종속성에는 `build` 스크립트가 있으므로 작업 그래프가 이를 인식할 수 있다.

이 시나리오에서 터보레포는 `ui` 패키지를 자체 `build` 스크립트가 없기 때문에 트랜짓 노드라고 인식한다. `build` 스크립트가 없기 때문에 터보레포는 아무것도 실행하지 않지만, 종속성을 포함하기 위한 목적으로 그래프의 일부가 된다.

트랜짓 노드를 그래프에 포함하지 않으면 어떻게 될까?

위의 예시에서는 태스크 그래프에 `ui` 노드(및 해당 종속성)를 포함하고 있다. 이는 터보레포가 예상되는 시점에 캐시를 누락하지 않도록 하기 위한 중요한 구분이다.

트랜짓 노드를 제외하는 것이 기본값인 경우 `core` 패키지의 소스 코드를 변경해도 `core` 패키지의 이전 반복에서 나온 오래된 코드를 사용하기 때문에 `turbo run build`에 대한 `docs` 앱의 캐시 미스가 발생하지 않는다.

### 엔트리 포인트로서 환승 노드 {#entry-point-transit-node}

`docs/` 패키지가 `build` 태스크를 구현하지 않았다면 어떻게 될까? 이 경우 어떤 일이 일어날까? `ui` 와 `core` 패키지는 여전히 `build` 태스크를 실행해야 할까? 여기서 어떤 일이 발생해야 할까?

터보레포의 사고 모델은 태스크 그래프의 모든 노드가 동일하다는 것이다. 즉, 트랜짓 노드는 그래프에서 어디에 표시되든 상관없이 그래프에 포함된다. 이러한 사고방식은 예상치 못한 결과를 초래할 수 있다. 예를 들어 `build` 태스크가 `^test`에 종속되도록 구성했다고 가정해 보자:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^test"]
    }
  }
}
```

모노레포에 많은 앱과 많은 패키지가 있다고 가정해 보자. 모든 패키지에 `test` 태스크가 있지만 하나의 앱에만 `build` 태스크가 있다. 터보레포의 멘탈 모델에 따르면 `turbo run build`를 실행하면 앱이 `build`를 구현하지 않더라도 종속성이 있는 모든 패키지의 `test` 작업이 그래프에 표시된다.
