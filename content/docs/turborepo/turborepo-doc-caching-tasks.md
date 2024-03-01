---
title: 태스크 캐싱
description:
date: 2024-03-02
tags: [cache]
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/caching',
    },
  ]
---

모든 자바스크립트 또는 타입스크립트 코드베이스는 `build` , `test` , `lint` 와 같은 `package.json` 스크립트를 실행해야 한다. 터보레포에서는 이러한 태스크를 호출한다.

_터보레포는 작업의 결과와 로그를 캐시하여 느린 작업의 속도를 크게 향상시킬 수 있다._

## 캐시 미스 {#missing-the-cache}

코드베이스의 각 태스크에는 입력(inputs)과 출력(outputs)이 있다.

- `build` 태스크는 입력으로 소스 파일을 받고 `stderr` 및 `stdout` 로그를 출력한다.
- `lint` 또는 `test` 태스크는 입력으로 소스 파일을 받고 `stdout` 및 `stderr` 로그를 출력한다.

`turbo run build` 를 사용하여 터보레포에서 `build` 태스크를 실행한다고 가정해 보자:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-caching-tasks/1.png)

1. 터보레포는 태스크에 대한 입력을 평가하여 해시로 변환한다(예: `78awdk123`).
2. 로컬 파일 시스템 캐시에서 일치하는 캐시 아티팩트(예: `./node_modules/.cache/turbo/78awdk123.tar.zst`)가 있는지 확인한다.
3. 계산된 해시와 일치하는 아티팩트를 찾지 못하면 터보레포가 태스크를 실행한다.
4. 태스크가 성공적으로 완료되면 터보레포는 지정된 모든 출력(파일 및 로그 포함)을 해시에 의해 주소가 지정된 새 캐시 아티팩트에 저장한다.

:::note
터보레포는 해시를 생성할 때 종속성 그래프, 종속된 작업, 소스 파일, 환경 변수 등 많은 정보를 고려한다,
:::

## 캐시 히트 {#hitting-the-cache}

입력을 변경하지 않고 태스크를 다시 실행한다고 가정해 보자:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-caching-tasks/2.png)

1. 입력값이 변경되지 않았으므로 해시는 동일하다(예: `78awdk123`).
2. 터보레포는 일치하는 해시를 가진 캐시 아티팩트를 찾는다(예: `./node_modules/.cache/turbo/78awdk123.tar.zst`).
3. 터보레포는 태스크를 실행하는 대신 출력을 재생하여 저장된 로그를 `stdout` 에 프린트하고 저장된 출력 파일을 파일 시스템의 각 위치로 복원한다.

캐시에서 파일과 로그를 복원하는 작업은 거의 즉각적으로 이루어진다. 따라서 빌드 시간이 몇 분 또는 몇 시간에서 몇 초 또는 몇 밀리초로 단축될 수 있다. 구체적인 결과는 코드베이스의 종속성 그래프의 모양과 세분성에 따라 다르지만, 대부분의 팀은 터보레포의 캐싱을 통해 전체 월간 빌드 시간을 약 40~85%까지 줄일 수 있다.

## 캐시 비활성화 {#turn-off-caching}

일부 환경에서는 캐시 출력을 쓰고 싶지 않을 수 있다. 캐시 쓰기를 사용하지 않으려면 명령에 `--no-cache` 를 추가한다. 예를 들어, 이렇게 하면 모든 워크스페이스에서 `dev`(및 dev의 `dependsOn` 태스크)가 실행되지만 출력은 캐시되지 않는다:

```bash
turbo run dev --no-cache
```

`no-cache` 는 캐시 쓰기를 비활성화하지만 캐시 읽기를 비활성화하지는 않는다. 캐시 읽기를 비활성화하려면 `--force` 플래그를 사용한다.

`pipeline.<task>.cache` 구성을 `false`로 설정하여 특정 태스크가 캐시 쓰기를 건너뛰도록 구성할 수도 있다:

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## 강제로 캐시 덮어쓰기 {#force-overwrite-cache}

반대로 캐시 읽기를 비활성화하고 터보가 이전에 캐시된 작업을 강제로 다시 실행하도록 하려면 `--force` 플래그를 추가한다:

```bash
# Run `build` npm script in all workspaces ignoring the cache.
turbo run build --force
```

`force` 는 캐시 읽기를 비활성화하지만 캐시 쓰기는 비활성화하지 않는다. 캐시 쓰기를 비활성화하려면 `--no-cache` 플래그를 사용한다.

## Node.js 버전 관리 {#handling-node-js-versions}

Node.js 버전을 고려하려면 `package.json` 에서 [`engines` 키](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#engines)를 사용한다. 터보레포는 `package.json`의 필드가 변경될 때 변경 사항을 확인하고 캐시를 미스한다.

## 플랫폼 및 기타 임의의 해시 기여자 처리하기 {#handling-platforms-and-other-arbitrary-hash-contributors}

고급 사용 사례의 경우 운영 체제(OS), 아키텍처 또는 기타 외부 요인이 해시에 영향을 미치기를 원할 수 있다. 이 작업은 네 가지 간단한 단계로 수행할 수 있다.

### 1. 임의의 파일을 디스크에 쓴다 {#write-an-arbitrary-file-to-disk}

먼저, 관심 있는 해시 기여자를 설명하는 스크립트를 만든다. 예를 들어, 다음은 플랫폼과 아키텍처를 살펴보고 이러한 세부 정보를 파일(`turbo-cache-key.json`)에 기록하는 Node.js 스크립트다:

```javascript
#!/usr/bin/env node

const { writeFileSync } = require('fs');
const { join } = require('path');

const { platform, arch } = process;
const file = 'turbo-cache-key.json';
const str = JSON.stringify({ platform, arch });
console.log(`Generating cache key: ${str}`);
writeFileSync(file, str);
```

### 2. 파일을 .gitignore에 추가한다 {#add-the-file-to-your-gitignore}

이 파일은 환경에 따라 달라지므로 깃에 커밋하지 않는 것이 좋다. `.gitignore`에 추가한다:

```diff-text
// .gitignore
+ turbo-cache-key.json
```

### 3. 파일을 해시에 추가한다 {#add-the-file-to-the-hash}

이제 파일을 태스크 입력에 추가하여 터보가 파일을 인식하도록 한다. 이 작업은 두 가지 방법으로 할 수 있다:

- **특정 태스크의 경우**: 태스크의 `inputs` 배열에 파일을 추가한다:

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipelines": {
    "build-for-platforms": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", "turbo-cache-key.json"]
    }
  }
}
```

- **모든 태스크의 경우**: `globalDependencies` 에 파일을 추가한다.

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["turbo-cache-key.json"],
  "pipelines": {
    ...
  }
}
```

### 4. turbo 실행 전에 파일 생성하기 {#generate-the-file-before-running-turbo}

마지막으로, `turbo` 를 실행하기 전에 스크립트를 실행해야 한다. 예를 들어:

```json
// package.json
{
  "scripts": {
    "build-for-platforms": "node ./scripts/create-turbo-cache-key.js && turbo run build"
  }
}
```

`turbo run build` 는 이제 `build` 태스크의 해시를 계산할 때 `turbo-cache-key.json` 의 내용을 고려한다.

## 로그 {#logs}

`turbo` 는 태스크의 출력을 캐시할 뿐만 아니라 터미널 출력(예: `stdout` 과 `stderr` 의 결합)도 (`<package>/.turbo/run-<command>.log`)에 기록한다. 터보가 캐시된 태스크를 만나면 마치 다시 발생한 것처럼 출력을 재생하지만 패키지 이름이 약간 흐리게 표시된 형태로 재생한다.

## 해싱 {#hashing}

지금쯤이면 터보가 특정 태스크에 대해 캐시 히트와 미스를 어떻게 결정하는지 궁금할 것이다. 좋은 질문이다!

먼저 `turbo` 가 코드베이스의 현재 글로벌 상태 해시를 생성한다. 여기에는 다음과 같은 것들이 포함된다:

- `globalDependencies` 의 글로브 패턴을 만족하는 모든 파일 콘텐츠의 해시
- `globalEnv` 에 나열된 환경 변수 값
- `turbo.json` , `package.json` 및 모든 lockfile 에서 정보 선택
- 등등 ...

그런 다음 주어진 워크스페이스의 태스크와 관련된 요소를 더 추가한다:

- 워크스페이스 폴더에 있는 모든 버전 제어 파일(또는 구성된 경우 `inputs` 글로브와 일치하는 파일)의 콘텐츠 해시
- `pipeline` 에 지정된 `outputs`
- 설치된 모든 `dependencies` , `devDependencies` 및 `optionalDependencies` 의 확인된 버전 집합
- 워크스페이스 태스크 이름
- `pipeline.<task>.env` 목록에 지정된 환경 변수 키-값 쌍의 정렬된 목록.
- 등등 ...

`turbo` 가 실행 중 특정 워크스페이스의 태스크를 발견하면 로컬 및 원격으로 캐시에서 일치하는 해시가 있는지 확인한다. 일치하는 해시가 있으면 해당 태스크의 실행을 건너뛰고 캐시된 출력을 제자리로 이동하거나 다운로드한 다음 이전에 기록된 로그를 즉시 재생한다. 캐시(로컬 또는 원격)에 계산된 해시와 일치하는 항목이 없는 경우, 터보가 로컬에서 태스크를 실행한 다음 지정된 출력을 캐시한다.

지정된 태스크의 해시는 실행 시 태스크에서 환경 변수 `TURBO_HASH` 로 사용할 수 있다. 이 값은 출력에 스탬프를 찍거나 도커파일 등에 태그를 지정하는 데 유용할 수 있다.
