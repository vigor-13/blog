---
title: 레퍼런스 개요
description:
date: 2024-01-27
tags: []
references:
  [{ key: 'React 공식 문서', value: 'https://react.dev/reference/react' }]
---

이 섹션에서는 React로 작업하기 위한 자세한 참조 문서를 제공한다.

React 참조 문서는 기능별 하위 섹션으로 분류되어 있다:

## React {#react}

프로그래밍 방식의 기능:

- Hooks - 컴포넌트에서 다양한 React 기능.
- Components - JSX에서 사용할 수 있는 내장 컴포넌트.
- APIs - 컴포넌트를 정의하는 데 유용한 API.
- Directives - React 서버 컴포넌트와 호환되는 번들러에 지침 제공.

## React DOM {#react-dom}

React-dom에는 웹 애플리케이션(브라우저 DOM 환경에서 실행되는)에만 지원되는 기능이 포함되어 있다. 이 섹션은 다음과 같이 분류되어 있다:

- Hooks - 브라우저 DOM 환경에서 실행되는 웹 애플리케이션용 Hook.
- Components - React는 브라우저에 내장된 모든 HTML 및 SVG 컴포넌트를 지원한다.
- APIs - `react-dom` 패키지에는 웹 애플리케이션에서만 지원되는 메서드가 포함되어 있다.
- Client APIs - `react-dom/client` API를 사용하면 클라이언트(브라우저에서)에서 React 컴포넌트를 렌더링할 수 있다.
- Server APIs - `react-dom/server` API를 사용하면 서버에서 React 컴포넌트를 HTML로 렌더링할 수 있다.

## Legacy APIs {#legacy}

- Legacy APIs - react 패키지에 포함되어 있지만 새로 작성된 코드에 사용하는 것은 권장하지 않는다.
