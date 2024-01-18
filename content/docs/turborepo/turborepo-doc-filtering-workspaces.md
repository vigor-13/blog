---
title: 워크스페이스 필터링
description:
date: 2024-01-18
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/core-concepts/monorepos/filtering',
    },
  ]
---

모노레포에는 수백 또는 수천 개의 워크스페이스가 포함될 수 있다. 기본적으로 레포지토리의 루트에서 `turbo run test`를 실행하면 사용 가능한 모든 워크스페이스에서 `test` 태스크가 실행된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-filtering-workspaces/1.png)

터보레포는 태스크를 실행할 워크스페이스를 선택할 수 있는 `--filter` 플래그를 지원한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/turborepo-doc-filtering-workspaces/2.png)

다음과 같은 용도로 사용할 수 있다:

- 워크스페이스 이름으로 필터링
- 워크스페이스 디렉터리로 필터링
- 일치하는 워크스페이스의 종속성 및 의존성 포함
- 워크스페이스 루트에서 태스크 실행하기
- 변경내용 기록으로 필터링
- 선택에서 워크스페이스 제외

터보레포는 일치하는 워크스페이스에 대해 태스크를 실행하여 `turbo.json`의 `pipeline` 사양에 따라 해당 워크스페이스에 종속된 모든 태스크가 먼저 실행되도록 한다.

## 필터 문법 {#filter-syntax}

### 다중으로 필터하기 {#multiple-filters}

명령에 여러 개의 `--filter` 플래그를 전달하여 둘 이상의 필터를 지정할 수 있다:

```bash
turbo build --filter=my-pkg --filter=my-app
```

### 워크스페이스 이름으로 필터하기 {#filter-by-workspace-name}

특정 워크스페이스에서만 스크립트를 실행하려는 경우 `--filter=my-pkg`라는 단일 필터를 사용하면 된다.

```bash
# "my-pkg"를 빌드하되, `turbo`가 turbo.json에 정의된 파이프라인에서 작업 종속성을 추론하도록 한다.
turbo run build --filter=my-pkg

# `@acme/bar`를 빌드하되, `turbo`가 turbo.json에 정의된 파이프라인에서 작업 종속성을 추론하도록 한다.
turbo run build --filter=@acme/bar
```

이름이 비슷한 여러 워크스페이스에서 작업을 실행하려면 glob 구문을 사용하면 된다: `--filter=*my-pkg*`.

```bash
# 'admin-'으로 시작하는 모든 워크스페이스를 빌드하되, `turbo`가 turbo.json에 정의된 파이프라인에서 작업 종속성을 추론하도록 한다.
turbo run build --filter=admin-*
```

#### 스코프 {#scopes}

일부 모노레포는 워크스페이스 이름 앞에 `@acme/ui` 및 `@acme/app` 과 같은 스코프를 추가한다. 스코프(`@acme`)가 코드베이스 전체에서 고유하다면 필터에서 생략해도 된다.

```text
- turbo run build --filter=@acme/ui
+ turbo run build --filter=ui
```

### 일치하는 워크스페이스에 종속된 워크스페이스 포함하기 {#include-dependents-workspaces}

때로는 공유 패키지가 다운스트림 종속성에 영향을 미치지 않는지 확인하고 싶을 때가 있다. 이를 위해 `--filter=...my-lib` 을 사용할 수 있다.

`my-app`이 `my-lib`에 종속된 경우, `...my-lib`은 내 `my-app` 과 `my-lib`을 선택한다.

`^` (`...^my-lib`)를 포함하면 `my-lib`의 모든 종속 워크스페이스가 선택되지만 `my-lib` 자체는 선택되지 않는다.

```bash
#  'my-lib' 과 'my-lib'에 의존하는 모든 워크스페이스를 테스트한다.
turbo run test --filter=...my-lib

# 'my-lib'에 의존하는 모든 워크스페이스를 테스트하되, 'my-lib' 자체는 테스트하지 않는다.
turbo run test --filter=...^my-lib
```

### 일치하는 워크스페이스의 종속 워크스페이스 포함하기 {#include-workspaces-dependencies}

때로는 대상 라이브러리의 모든 종속성에서 `build`가 실행되는지 확인하고 싶을 때가 있다. 이를 위해 `--filter=my-app....`을 사용하면 된다.

`my-app`이 `my-lib`에 종속된 경우 `my-app...`은 `my-app`과 `my-lib`을 선택한다.

`^` `(my-app^...)`를 포함하면 `my-app` 의 모든 종속성이 선택되지만 `my-app` 자체는 선택되지 않는다.

```bash
# 'my-app' 과 그 종속성들을 빌드한다.
turbo run build --filter=my-app...

# 'my-app'의 종속성을 빌드한다, 하지만 `my-app` 자체는 제외한다.
turbo run build --filter=my-app^...
```

### 디렉토리로 필터하기 {#filter-by-directory}

워크스페이스 이름이 아닌 특정 디렉터리를 대상으로 지정하려는 경우에 유용하다.

- 정확히 일치: `--filter=./apps/docs`
- Globs 패턴: `--filter='./apps/*'`

```bash
# 'apps' 디렉터리에 있는 모든 워크스페이스에서 `build` 명령을 실행한다.
turbo run build --filter='./apps/*'
```

#### 다른 구문과 조합하기 {#filter-by-directory-with-other-syntaxes}

디렉토리 필터를 다른 구문과 결합할 때는 `{}`로 묶어야 한다. 예를 들면 다음과 같다:

```bash
# 'libs' 디렉토리의 모든 워크스페이스와 그들에 종속된 모든 워크스페이스를 빌드한다.
turbo run build --filter=...{./libs/*}
```

### 변경된 워크스페이스로 필터하기 {#filter-by-changed-workspaces}

특정 커밋 이후 변경된 모든 워크스페이스에서 태스크를 실행할 수 있다.

예를 들어 `--filter=[HEAD^1]`은 가장 최근 커밋에서 변경된 모든 워크스페이스를 선택한다:

```bash
# 마지막 커밋에서 변경된 모든 내용을 테스트한다.
turbo run test --filter=[HEAD^1]
```

#### 커밋 범위 확인하기 {#check-commit-range}

`HEAD`와 비교하지 않고 특정 범위의 커밋을 확인해야 하는 경우, `[<from commit>...<to commit>]`을 통해 비교의 양쪽 끝을 설정할 수 있다.

```bash
# 'main'과 'my-feature' 사이에서 변경된 각 워크스페이스를 테스트한다.
turbo run test --filter=[main...my-feature]
```

#### 변경 파일 무시하기 {#ignore-changed-files}

`--ignore`를 사용하여 변경된 파일을 변경된 워크스페이스 계산에서 무시하도록 지정할 수 있다.

#### 다른 구문과 조합하기 {#filter-by-changing-with-other-syntaxes}

커밋 참조 앞에 `...`를 추가하여 다른 컴포넌트의 종속성을 변경된 워크스페이스와 일치시킬 수 있다. 예를 들어, 마지막 커밋에서 `foo`의 종속성이 변경된 경우 `foo`를 선택하려면 `--filter=foo...[HEAD^1]`을 전달하면 된다.

```bash
# 브랜치 'my-feature'의 변경 사항에 의존하는 모든 것을 빌드한다.
turbo run build --filter=...[origin/my-feature]

# 만약 지난 커밋에서 '@foo/bar' 또는 그 종속성 중 하나라도 변경되었다면 '@foo/bar'를 빌드한다.
turbo run build --filter=@foo/bar...[HEAD^1]
```

구문은 `[]` 및 `{}` 구문을 함께 조합할 수도 있다:

```bash
# 지난 커밋에서 변경된 경우 'packages' 디렉토리에 있는 '@scope' 범위의 각 워크스페이스를 테스트한다.
turbo run test --filter=@scope/*{./packages/*}[HEAD^1]
```

### 워크스페이스 루트 {#workspace-root}

토큰 `//`를 사용하여 모노레포의 루트를 선택할 수 있다.

```bash
# 루트 "package.json" 파일에서 format 스크립트를 실행한다.
turbo run format --filter=//
```

### 워크스페이스 제외하기 {#exclude-workspaces}

필터의 앞에 `!`를 붙인다. 전체 필터에서 일치하는 워크스페이스는 대상 집합에서 제외된다. 예를 들어, `@foo/bar`를 제외한 모든 것을 일치시키려면 `--filter=!@foo/bar`를 사용한다. 쉘에 따라 `!`를 적절하게 이스케이프해야 할 수 있음에 유의한다 (예: `\!`)

```bash
# '@foo/bar'를 제외한 모든 것을 빌드한다.
turbo run build --filter=!@foo/bar

# 'apps' 디렉터리에서 'admin' 워크스페이스를 제외한 모든 워크스페이스를 빌드한다.
turbo run build --filter=./apps/* --filter=!admin
```

### 전역 "turbo" 명령의 경우 {#via-global-turbo}

전역으로 설치된 터보 버전을 사용하는 경우, 워크스페이스 내에서 실행하면 자동으로 해당 워크스페이스의 디렉터리로 필터링된다. 즉, 레포지토리의 루트에서 `turbo run test --filter={./packages/shared}` 를 실행하는 것은 `cd packages/shared && turbo run test`를 실행하는 것과 동일하다.

명시적으로 이름이 지정된 워크스페이스로 실행하면 레포지토리 내 어디에서나 항상 작동한다(`turbo run test --filter=shared`).
