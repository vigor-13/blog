---
title: NestJS 소개
description:
date: 2024-03-05
tags: []
references: [{ key: 'NestJS 공식 문서', value: 'https://docs.nestjs.com/' }]
---

NestJS는 Node.js 기반의 서버 애플리케이션을 만들기 위한 프레임워크다. NestJS를 사용하면 효율적이고 확장성 있는 서버를 쉽게 구축할 수 있다.

NestJS는 프로그레시브 자바스크립트를 사용하며, 타입스크립트로 만들어졌다. 타입스크립트를 완벽하게 지원하지만, 개발자가 원한다면 일반 자바스크립트로도 코딩할 수 있다.

NestJS는 객체지향(OOP), 함수형(FP), 반응형(FRP) 프로그래밍의 장점들을 모두 결합한다.

NestJS는 내부적으로 Express를 사용한다. Express 대신 Fastify를 사용하도록 구성할 수도 있다.

Nest는 이러한 일반적인 Node.js 프레임워크(Express/Fastify)보다 **높은 수준의 추상화**를 제공하는 동시에 해당 API를 직접 노출하기 때문에 프레임워크의 기능들을 그대로 사용할 수 있다. 덕분에 개발자는 이 프레임워크들을 위해 만들어진 다양한 외부 모듈을 NestJS에서도 쉽게 사용할 수 있다.

## 철학 {#philosophy}

최근 몇 년간 Node.js 덕분에 자바스크립트는 웹 개발에서 가장 중요한 언어가 되었다. 자바스크립트로 프론트엔드와 백엔드 개발을 모두 할 수 있게 되었다. 그 결과 Angular, React, Vue 같은 훌륭한 프론트엔드 프레임워크들이 만들어졌고, 개발자들은 더 쉽고 빠르게 웹 애플리케이션을 개발할 수 있게 되었다.

하지만 백엔드 쪽은 상황이 달랐다. Node.js로 서버를 만들 때 사용할 수 있는 라이브러리나 도구들은 많았지만, 정작 서버 개발의 가장 중요한 문제인 "아키텍처"를 체계적으로 다루는 도구는 없었다.
(여기서 아키텍처란, 코드를 어떻게 구성하고 각 부분을 어떻게 연결할지에 대한 전반적인 설계를 말한다.)

NestJS는 이런 문제를 해결하기 위해 만들어졌다. **NestJS는 개발자들이 고민 없이, 바로 사용할 수 있는 아키텍처를 제공한다.** NestJS의 아키텍처는 Angular에서 많은 영향을 받았으며, 이를 통해 확장성과 유지보수가 용이한 서버 애플리케이션을 만들 수 있다.

## 설치 {#installation}

### CLI 사용하기

Nest CLI를 사용하여 프로젝트를 시작할 수 있다.

```bash
npm i -g @nestjs/cli
nest new project-name
```

위의 명령을 실행하면 새 프로젝트 디렉토리와 프로젝트의 기존 기본 구조가 만들어진다.

처음 사용하는 사용자들은 Nest CLI로 새 프로젝트를 생성하는 것을 권장한다.

:::tip
strict 모드로 TypeScript 프로젝트를 만들려면 `nest new` 명령에 `--strict` 플래그를 사용한다.
:::

### Git에서 직접 설치하기

Git을 사용하여 스타터 프로젝트를 설치할 수 있다:

```bash
git clone https://github.com/nestjs/typescript-starter.git project
cd project
npm install
npm run start
```

[http://localhost:3000/](http://localhost:3000/)에서 확인할 수 있다.

:::tip
git 히스토리 없이 리포지토리를 복제하려면 [degit](https://github.com/Rich-Harris/degit)을 사용한다.
:::

:::tip
스타터 프로젝트의 JavaScript 버전을 설치하려면 `javascript-starter.git` 을 사용한다.
:::

### 수동으로 설치하기

npm(또는 yarn)을 사용하여 수동으로 새 프로젝트를 만들 수도 있다. 물론 이 경우 프로젝트 보일러플레이트 파일을 직접 만들어야 한다.

```bash
npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata
```
