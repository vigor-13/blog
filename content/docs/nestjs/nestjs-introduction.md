---
title: NestJS 소개
description:
date: 2024-03-05
tags: []
references: [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/' }]
---

NestJS 는 효율적이고 확장 가능한 Node.js 서버 애플리케이션을 구축하기 위한 프레임워크다. 이 프레임워크는 프로그레시브 자바스크립트(progressive javascript)를 사용하며, 타입스크립트를 기반으로 구축되어 완벽하게 지원하지만 개발자는 순수 자바스크립트로 코딩할 수 있으며, OOP(객체지향 프로그래밍), FP(함수형 프로그래밍), FRP(함수형 반응형 프로그래밍)의 요소를 결합한다.

내부적으로 Nest는 Express(기본값)와 같은 강력한 HTTP 서버 프레임워크를 사용하며, 선택적으로 Fastify 를 사용하도록 구성할 수 있다!

Nest는 이러한 일반적인 Node.js 프레임워크(Express/Fastify)보다 **높은 수준의 추상화**를 제공할 뿐만 아니라 해당 API를 개발자에게 직접 노출한다. 따라서 개발자는 기본 플랫폼에서 사용할 수 있는 무수히 많은 타사 모듈을 자유롭게 사용할 수 있다.

## 철학 {#philosophy}

최근 몇 년 동안 Node.js 덕분에 JavaScript는 프론트엔드 및 백엔드 애플리케이션 모두에서 웹의 '공용어'가 되었다. 이로 인해 개발자의 생산성을 향상시키고 빠르고 테스트 가능하며 확장 가능한 프론트엔드 애플리케이션을 만들 수 있는 Angular, React, Vue와 같은 멋진 프로젝트가 탄생했다. 하지만 노드(및 서버 측 자바스크립트)를 위한 훌륭한 라이브러리, 헬퍼, 도구가 많이 존재하지만, 아키텍처라는 주요 문제를 효과적으로 해결해 주는 것은 없었다.

Nest는 개발자와 팀이 고도로 테스트 가능하고 확장 가능하며 느슨하게 결합되고 유지 관리가 용이한 애플리케이션을 만들 수 있도록 **즉시 사용 가능한 애플리케이션 아키텍처**를 제공한다. 이 아키텍처는 Angular에서 많은 영감을 받았다.

## 설치 {#installation}

시작하려면 Nest CLI를 사용하여 프로젝트를 스캐폴드하거나 스타터 프로젝트를 복제할 수 있다(둘 다 동일한 결과를 생성한다).

Nest CLI로 프로젝트를 스캐폴딩하려면 다음 명령을 실행한다.

```bash
npm i -g @nestjs/cli
nest new project-name
```

그러면 새 프로젝트 디렉터리가 생성되고 초기 핵심 Nest 파일과 지원 모듈들로 디렉터리가 채워져 프로젝트의 기존 기본 구조가 만들어진다. 처음 사용하는 사용자들은 Nest CLI로 새 프로젝트를 생성하는 것을 권장한다.

:::tip
더 엄격한 기능 세트로 새 TypeScript 프로젝트를 만들려면 `nest new` 명령에 `--strict` 플래그를 전달하라.
:::

## 대안 {#alternatives}

또는 Git을 사용하여 TypeScript 스타터 프로젝트를 설치한다:

```bash
git clone https://github.com/nestjs/typescript-starter.git project
cd project
npm install
npm run start
```

:::tip
git 히스토리 없이 리포지토리를 복제하려면 [degit](https://github.com/Rich-Harris/degit)을 사용한다.
:::

브라우저를 열고 [http://localhost:3000/](http://localhost:3000/) 으로 이동한다.

스타터 프로젝트의 JavaScript 버전을 설치하려면 위의 명령 순서대로 `javascript-starter.git` 을 사용한다.

npm(또는 yarn)을 사용하여 코어 및 지원 파일을 설치하여 처음부터 새 프로젝트를 수동으로 만들 수도 있다. 물론 이 경우 프로젝트 보일러플레이트 파일을 직접 만들어야 한다.

```bash
npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata
```
