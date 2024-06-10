---
title: 에디터 통합
description:
date: 2024-06-09
tags: []
references:
  [
    {
      key: 'Turborepo 공식 문서',
      value: 'https://turbo.build/repo/docs/getting-started/editor-integration',
    },
  ]
---

`turbo` 로 최상의 경험을 얻기위해 Turborepo에서 제공하는 몇 가지 유틸리티를 에디터와 통합하여 사용할 수 있다.

## JSON Schema

Turborepo는 [JSON Schema](https://json-schema.org/)를 사용하여 `turbo.json` 파일 자동 완성 기능을 제공한다.

`turbo.json` 에 `$schema` 키를 포함하면 에디터 차원에서 파일의 유효성을 검사하고 실수를 방지할 수 있다.

```json
// ./turbo.json
{
  "$schema": "https://turbo.build/schema.json"
}
```

:::note
Turborepo v1을 사용하는 경우 `schema.v1.json` 을 사용한다.

```json
// ./turbo.json
{
  "$schema": "https://turbo.build/schema.v1.json"
}
```

:::

## eslint-config-turbo

모노레포 환경에서는 환경 변수를 잘 관리하는 것이 중요하다. 패키지가 많아지면 그만큼 관리해야 할 환경 변수도 늘어나기 때문이다.

여기에 [`eslint-config-turbo`](https://turbo.build/repo/docs/reference/eslint-config-turbo) 가 많은 도움을 준다.

`eslint-config-turbo` 는 코드에서 환경 변수를 쓰는 부분을 스캔해서, 실수를 찾아낸다.

예를들어 설정되지 않은 환경 변수를 읽어오면 경고를 띄운다거나, 환경 변수의 이름이 컨벤션에 맞는지 체크한다.

## Turborepo LSP

`turbo.json` 파일을 편집할 때, 잘못된 glob, 존재하지 않는 작업 또는 패키지에 대한 참조 검사 등 단순히 JSON Schema를 적용하는 것보다 더 강력한 자동완성과 오류 검사 기능을 제공한다.

:::note LSP란?

- LSP(Language Server Protocol)는 에디터와 언어 지원 도구 간의 통신 규약이다.
- 에디터가 LSP를 지원하면, 해당 언어에 대한 자동완성, 정의로 이동, 에러 표시 등의 기능을 플러그인 형태로 제공받을 수 있다.

:::
