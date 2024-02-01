---
title: Next.js 프로젝트 구조
description:
date: 2024-02-01
tags: []
references:
  [
    {
      key: 'NextJS 공식 문서',
      value: 'https://nextjs.org/docs/getting-started/project-structure',
    },
  ]
---

이 페이지에서는 Next.js 프로젝트의 파일 및 폴더 구조에 대한 개요를 설명한다.

`app` 및 `pages` 디렉토리 내의 최상위 파일 및 폴더, 설정 파일, 라우팅 규칙을 다룬다.

## 최상위 레벨 폴터 {#top-level-folders}

| 폴더     | 설명                              |
| -------- | --------------------------------- |
| `app`    | 앱 라우터                         |
| `pages`  | 페이지 라우터                     |
| `public` | 정적 에셋                         |
| `src`    | 애플리케이션 소스 폴더 (optional) |

Next.js 프로젝트를 처음 초기화할 때 앱 라우터와 src 폴더를 선택 했다면 다음과 같은 모습으로 초기화 된다.

## 최상위 레벨 파일 {#top-level-files}

| 파일                | 설명                                  |
| ------------------- | ------------------------------------- |
| `next.config.js`    | Next.js 설정 파일                     |
| `package.json`      | 프로젝트 의존성 및 스크립트           |
| `instrumentaion.ts` | OpenTelemetry & Instrumentation 파일  |
| `middleware.ts`     | Next.js 요청 미들웨어                 |
| `.env`              | 환경 변수                             |
| `.env.local`        | 로컬 환경 변수                        |
| `.env.production`   | 프로덕션 환경 변수                    |
| `.env.development`  | 개발 환경 변수                        |
| `.eslintrc.json`    | ESLint 설정 파일                      |
| `.gitignore`        | gitignore 파일                        |
| `.next-env.d.ts`    | Next.js를 위한 타입스크립트 선언 파일 |
| `tsconfig.json`     | 타입스크립트 설정 파일                |
| `jsconfig.json`     | 자바스크립트 설정 파일                |

## 앱 라우팅 컨벤션 {#app-routing-conventions}

### 라우팅 파일 {#routing-files}

| 파일           | 확장자              | 설명                    |
| -------------- | ------------------- | ----------------------- |
| `layout`       | `.js` `.jsx` `.tsx` | 레이아웃                |
| `page`         | `.js` `.jsx` `.tsx` | 페이지                  |
| `loading`      | `.js` `.jsx` `.tsx` | 로딩 UI                 |
| `not-found`    | `.js` `.jsx` `.tsx` | Not found UI            |
| `error`        | `.js` `.jsx` `.tsx` | 에러 UI                 |
| `global-error` | `.js` `.jsx` `.tsx` | 글로벌 에러 UI          |
| `route`        | `.js` `.jsx`        | API 엔드포인트          |
| `template`     | `.js` `.jsx` `.tsx` | 재사용 레이아웃         |
| `default`      | `.js` `.jsx` `.tsx` | 병렬 라우트 폴백 페이지 |

### 중첩 라우트 {#nested-routes}

| 경로            | 설명                 |
| --------------- | -------------------- |
| `folder`        | 라우트 세그먼트      |
| `folder/folder` | 중첩 라우트 세그먼트 |

### 동적 라우트 {#dynamic-routes}

| 경로            | 설명                               |
| --------------- | ---------------------------------- |
| `[folder]`      | 동적 라우트 세그먼트               |
| `[...folder]`   | Catch-all 라우트 세그먼트          |
| `[[...folder]]` | Optional catch-all 라우트 세그먼트 |

### 라우트 그룹 & 프라이빗 폴더 {#route-groups-and-private-folders}

| 경로       | 설명                                         |
| ---------- | -------------------------------------------- |
| `(folder)` | 라우팅에 영향을 미치지 않는 그룹 라우트      |
| `_folder`  | 해당 폴더와 모든 하위 폴더를 라우팅에서 제외 |

### 병렬 & 인터셉트 라우트 {#paralle-and-intercepted-routes}

| 경로             | 설명                       |
| ---------------- | -------------------------- |
| `@folder`        | 명명된 슬롯                |
| `(.)folder`      | 동일 레벨 인터셉트         |
| `(..)folder`     | 한 단계 상위 레벨 인터셉트 |
| `(..)(..)folder` | 두 단계 상위 레벨 인터셉트 |
| `(...)folder`    | 루트 인터셉트              |

### 메타데이터 파일 컨벤션 {#metadata-file-conventions}

#### 앱 아이콘 {#app-icons}

| 파일         | 확장자                              | 설명                  |
| ------------ | ----------------------------------- | --------------------- |
| `favicon`    | `.ico`                              | 파비콘 파일           |
| `icon`       | `.ico` `.jpg` `.jpeg` `.png` `.svg` | 앱 아이콘 파일        |
| `icon`       | `.js` `.ts` `.tsx`                  | 생성된 앱 아이콘      |
| `apple-icon` | `.jpg` `.jpeg` `.png`               | 애플 앱 아이콘 파일   |
| `apple-icon` | `.js` `.ts` `.tsx`                  | 생성된 애플 앱 아이콘 |

#### Open Graph & Twitter 이미지 {#open-graph-and-twitter-images}

| 파일              | 확장자                       | 설명                     |
| ----------------- | ---------------------------- | ------------------------ |
| `opengraph-image` | `.jpg` `.jpeg` `.png` `.gif` | Open Graph 이미지 파일   |
| `opengraph-image` | `.js` `.ts` `.tsx`           | 생성된 Open Graph 이미지 |
| `twitter-image`   | `.jpg` `.jpeg` `.png` `.gif` | 트위터 이미지 파일       |
| `twitter-image`   | `.js` `.ts` `.tsx`           | 생성된 트위터 이미지     |

#### SEO {#seo}

| 파일      | 확장자      | 설명               |
| --------- | ----------- | ------------------ |
| `sitemap` | `.xml`      | 사이트맵 파일      |
| `sitemap` | `.js` `.ts` | 생성된 사이트 맵   |
| `robots`  | `.txt`      | Robots 파일        |
| `robots`  | `.js` `.ts` | 생성된 Robots 파일 |
