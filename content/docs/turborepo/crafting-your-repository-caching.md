---
title: 캐싱
description:
date: 2024-06-27
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/crafting-your-repository/caching',
    },
  ]
---

Turborepo는 빌드 속도를 높이기 위해 **캐싱**을 사용한다.

태스크가 캐시 가능할 때, 해당 태스크의 고유한 특징(코드, 설정 등)을 바탕으로 만든 **지문(fingerprint)** 을 이용해 이전에 실행한 결과를 찾아 재사용한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo/crafting-your-repository-caching/1.png)

캐싱을 사용하면 다음과 같은 장점이 있다.

- 같은 일을 두 번 하지 않아도 되기에 시간을 절약할 수 있다.
- [원격 캐싱](https://turbo.build/repo/docs/core-concepts/remote-caching)이 활성화되면 팀원과 CI 간에 캐시를 공유할 수 있다.

:::important
Turborepo는 태스크가 **결정적(deterministic)** 이라고 가정한다.

즉 같은 입력에는 항상 같은 결과가 나온다고 가정한다.

만약 같은 입력인데 다른 결과가 나오면, 캐싱이 제대로 작동하지 않을 수 있다.
:::

## 캐시 사용 예시

### 1. 새로운 Turborepo 프로젝트 만들기

`npx create-turbo@latest` 를 사용하여 새로운 Turborepo를 생성한다.

```bash
npx create-turbo@latest
```

### 2. 빌드 실행하기

`turbo` 를 전역으로 설치했다면, 저장소에서 `turbo build` 를 실행한다.

또는 패키지 관리자를 사용하여 `package.json` 의 `build` 스크립트를 실행한다.

```bash
npm run build
```

이 프로젝트에서 `turbo` 를 처음 실행하면, 저장된 결과가 없기에 캐시 미스가 발생한다.

대신 현재 프로젝트의 상태를 특별한 코드(해시)로 만들어 저장한다.

이 코드는 나중에 컴퓨터나 팀의 공유 저장소에서 같은 태스크 결과를 찾는 데 사용된다.

### 3. 캐시 사용하기

`turbo build` 를 다시 실행한다.

다음과 같은 메시지가 표시될 것이다:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo/crafting-your-repository-caching/2.png =60%x)

동일한 입력의 지문이 이미 캐시에 저장되어 있기 때문에 애플리케이션을 다시 빌드할 필요가 없다.

이전 빌드의 결과를 캐시에서 복원하여, 자원과 시간을 절약할 수 있다.

## 원격 캐싱

Turborepo는 태스크 결과를 로컬 `.turbo/cache` 디렉토리에 저장한다.

하지만 이 캐시를 팀원들 및 CI와 공유함으로써 조직 전체의 속도를 더욱 높일 수 있다.

:::note
원격 캐싱과 그 이점에 대해 더 자세히 알아보려면 [문서](https://turbo.build/repo/docs/core-concepts/remote-caching)를 참조한다.
:::

### 원격 캐시 활성화하기

먼저, 원격 캐시 프로바이더에 로그인한다.

```bash
npx turbo login
```

그 다음, 로컬 레포지토리를 원격 캐시와 연결한다:

```bash
npx turbo link
```

이제 태스크를 실행하면 Turborepo가 자동으로 태스크의 출력을 원격 캐시로 보낸다.

인증된 다른 기기에서 같은 태스크를 실행하면 해당 기기에서도 캐시를 사용할 수 있다.

:::note
CI 환경에 원격 캐시를 연결하는 방법은 [문서](https://turbo.build/repo/docs/crafting-your-repository/constructing-ci#enable-remote-caching)를 참조한다.
:::

:::note
기본적으로 Turborepo는 별도의 설정 없이 [Vercel 원격 캐시](https://vercel.com/docs/monorepos/remote-caching)를 사용한다.

다른 원격 캐시를 사용하고 싶다면 [문서](https://turbo.build/repo/docs/core-concepts/remote-caching#self-hosting)를 참조한다.
:::

## 무엇이 캐시될까?

### 태스크 출력

Turborepo는 `turbo.json` 의 `outputs` 키에 정의된 태스크의 파일 출력물을 캐시한다.

캐시 히트가 있을 때, Turborepo는 캐시에서 파일들을 복원한다.

:::warning 파일 출력물 제공하기
설정 파일에 태스크에 대한 출력물을 정의하지 않으면, Turborepo는 아무것도 캐시하지 않는다.

일부 태스크(예: 린터)에는 이것이 괜찮을 수 있지만, 대다수의 경우 태스크는 캐시할 수 있는 파일들을 생성한다.

캐시를 사용할 때 파일을 사용할 수 없다는 오류가 발생한다면, 태스크에 대한 출력물을 정의했는지 확인한다.
:::

### 로그

Turborepo는 항상 태스크의 터미널 출력을 캡처하며, 해당 태스크가 처음 실행되었을 때의 로그를 터미널에 복원한다.

재생되는 로그의 디테일 수준은 [`--output-logs` 플래그](https://turbo.build/repo/docs/reference/run#--output-logs-option)나 [`outputLogs` 설정 옵션](https://turbo.build/repo/docs/reference/configuration#outputmode)을 사용하여 변경할 수 있다.

### 태스크 입력

**입력**이란 코드, 설정 파일, 종속성 등 태스크를 실행하는데 필요한 모든 것을 말한다.

Turborepo는 태스크를 실행할 때마다 입력을 해시하여 지문(해시의 고유 결과물)을 만든다.

이 지문이 이전에 실행한 태스크의 지문과 같다면, 저장된 캐시를 사용한다.

내부적으로 Turborepo는 두 가지 해시를 생성한다:

- **전역 해시**: 프로젝트 전체에 영향을 주는 요소들의 해시다.
- **태스크 해시**: 특정 태스크에만 관련된 요소들의 해시다.

위의 해시들 중 하나라도 변경되면 태스크는 캐시를 사용하지 않는다.

#### 전역 해시

전역 해시에 영향을 주는 입력은 다음과 같다.

| 입력                                                                                                                | 예시                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 프로젝트 루트 및 개별 패키지의 `turbo.json` 설정                                                                    | 루트 또는 개별 패키지의 `turbo.json` 에서 `outputs` 속성 변경                                                                                                              |
| 프로젝트 루트의 `lockfile`                                                                                          | 루트 `package.json` 의 종속성 업데이트는 모든 태스크의 캐시 미스를 유발                                                                                                    |
| [`globalDependencies`](https://turbo.build/repo/docs/reference/configuration#globaldependencies) 속성에 정의된 파일 | `globalDependencies` 에 나열된 `./.env` 변경 시 모든 태스크의 캐시 미스 유발                                                                                               |
| [`globalEnv`](https://turbo.build/repo/docs/reference/configuration#globalenv) 속성에 정의된 변수 값                | `globalEnv` 에 추가된 `GITHUB_TOKEN` 값 변경                                                                                                                               |
| 태스크 런타임에 영향을 주는 플래그 값                                                                               | `--cache-dir`, `--framework-inference`, 또는 `--env-mode` 와 같은 옵션 플래그 사용                                                                                         |
| 명령어에 추가된 모든 임의의 인자 값                                                                                 | - `turbo build`<br/> - `turbo build -- --arg=value`<br/> - `turbo build -- --arg=diff`<br/> 이 세 명령은 모두 다른 <u>지문</u>을 가지게 되어, 서로 다른 태스크로 취급된다. |

#### 패키지 해시

패키지 해시에 영향을 주는 입력은 다음과 같다.

| 입력                       | 예시                                              |
| -------------------------- | ------------------------------------------------- |
| 패키지의 `turbo.json` 설정 | 패키지의 `turbo.json` 설정 변경                   |
| 패키지의 `lockfile`        | 패키지의 종속성 변경                              |
| 패키지의 `package.json`    | 패키지의 `package.json` 에서 `name` 필드 업데이트 |
| 소스 코드의 변경           | `src/index.ts` 에 새로운 코드 작성                |

## 트러블슈팅

### dry 사용하기

[`--dry` 플래그](https://turbo.build/repo/docs/reference/run#--dry----dry-run)를 사용하여 실제로 태스크를 실행하지 않고도 태스크를 실행했을 때의 결과를 볼 수 있다.

쉽게 말해 실제로 태스크를 실행하지 않고 <u>가상으로</u> 실행한다.

이를 통해, 어떤 태스크가 캐시를 사용하고, 새로 실행될지 미리 알 수 있다. 때문에 문제점이 있다면 쉽게 발견할 수 있다.

:::note
더 자세한 내용은 [`--dry` API 문서](https://turbo.build/repo/docs/reference/run#--dry----dry-run)를 참조한다.
:::

### summarize 사용하기

[`--summarize` 플래그](https://turbo.build/repo/docs/reference/run#--summarize)를 사용하여 태스크의 모든 입력, 출력 등에 대한 개요를 얻을 수 있다.

두 summarize를 비교하면 두 태스크의 해시가 왜 다른지 알 수 있다.

이는 다음과 같은 경우에 유용하다:

| 디버깅          | 설명                                                                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **입력 디버깅** | Turborepo의 태스크에는 많은 입력이 있다. 캐시가 사용될 것으로 예상했는데 그렇지 않은 경우, summarize를 사용하여 예상치 못한 입력의 차이를 확인할 수 있다. |
| **출력 디버깅** | 캐시가 예상한 파일들을 복원하지 않는 경우, summarize를 통해 어떤 출력이 캐시에서 복원되고 있는지 알아볼 수 있다.                                          |

네, 이 텍스트를 한국어로 번역해 드리겠습니다.

### 캐싱 비활성화

태스크 출력 캐시를 비활성화 할 수 있다.

- [`"cache": false`](https://turbo.build/repo/docs/reference/configuration#cache) : 특정 태스크에 대해 영구적으로 캐시 비활성화.
- [`--no-cache` 플래그](https://turbo.build/repo/docs/reference/run#--no-cache) : 전체 실행에 캐시 비활성화.

### 캐시 덮어쓰기

캐시된 태스크를 강제로 다시 실행하고 싶다면, [`--force` 플래그](https://turbo.build/repo/docs/reference/run#--force)를 사용한다.

:::note
이는 캐시 <u>읽기</u>를 비활성화하는 것이며, <u>쓰기</u>를 비활성화하는 것이 아니다.
:::

### 태스크를 캐싱하는 것이 실행하는 것보다 느린 경우

캐싱이 오히려 성능을 저하시키는 특수한 상황들이 있다.

이런 경우는 드물지만, 다음과 같은 몇 가지 예시가 있다:

| 예시                            | 설명                                                                                                                                                                                                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **매우 빠르게 실행되는 태스크** | 태스크 실행 시간이 원격 캐시의 네트워크 왕복 시간보다 빠른 경우가 있다.                                                                                                                                                                                        |
| **출력이 매우 큰 태스크**       | 완전한 Docker 컨테이너와 같이 너무 큰 아티팩트를 생성하여 업로드나 다운로드 시간이 재생성 시간을 초과하는 경우가 있을 수 있다.                                                                                                                                 |
| **자체 캐싱이 있는 스크립트**   | 일부 태스크에서 자체적으로 내부 캐싱 기능을 가지고 있는 경우가 있다.<br/> 두 개의 다른 캐싱 시스템(Turborepo와 도구 자체의 캐시)을 함께 사용하려고 할 때 설정과 관리가 복잡해질 수 있으며, 때로는 이로 인해 성능 향상보다는 오히려 관리의 부담이 커질 수 있다. |

이러한 상황은 드물지만, 프로젝트의 동작에 따라 특정 부분에서 캐싱을 비활성화하는 것이 나은지 확인한는 것이 좋다.
