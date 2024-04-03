---
title: Expo 스터디 노트
description:
date: 2024-04-02
tags: []
references: []
---

## 프로젝트 시작하기

```bash
yarn create expo --template
```

## Expo GO vs Development Builds

개발 빌드는 프로젝트에 맞게 특별히 조정된, 완전히 커스터마이징 가능한 버전의 Expo Go라고 생각할 수 있다. 또는 반대로, Expo Go는 미리 설정된 런타임을 가진 개발 환경이라고 볼 수 있다.

### Expo Go

- Expo 애플리케이션을 실행할 수 있는 샌드박스 애플리케이션이다.
- 네이티브 툴체인 없이 애플리케이션을 컴파일 할 수 있다.
- 애플리케이션 프로토타입을 빠르게 구성할 때 권장된다.
- 미리 구성된 네이티브 앱을 사용한다.
  - 때문에 일부 네이티브 기능에 제한 사항이 있다.

### Development Builds

- 네이티브 앱을 직접 빌드한다.
- 앱의 네이티브 런타임에 대한 완전한 제어권을 갖는다.
  - 설정 변경, 라이브러리 설치, 네이티브 코드 작성 등...
- `expo-dev-client`를 제공하여 디버깅을 돕는다.

## babel-preset-expo

`babel-preset-expo` 는 Expo 프로젝트에서 사용되는 Babel 프리셋으로, 선택적 네이티브 종속성을 자동으로 처리하는 기능을 제공한다. 이 기능은 Expo의 "선택적 모듈" 시스템과 연계되어 동작한다.

Expo는 다양한 네이티브 기능을 제공하는 모듈들을 가지고 있다. 예를 들어, `expo-camera`, `expo-location`, `expo-sensors` 등이 있다. 이러한 모듈들은 해당 기능을 사용하기 위해 네이티브 코드와 연결되어야 한다.

그러나 모든 Expo 프로젝트에서 모든 네이티브 모듈을 사용하는 것은 아니다. 프로젝트의 요구 사항에 따라 필요한 모듈만 선택적으로 설치하고 사용할 수 있다. 이때 `babel-preset-expo` 의 자동 처리 기능이 유용하게 사용된다.

`babel-preset-expo` 는 다음과 같이 동작한다:

1. 프로젝트에 설치된 Expo 모듈을 자동으로 감지한다.
2. 감지된 모듈 중에서 네이티브 종속성이 있는 모듈을 식별한다.
3. 해당 모듈이 실제로 프로젝트에서 사용되는지 확인한다.
4. 모듈이 사용 중이라면, 해당 모듈의 네이티브 코드를 자동으로 연결한다.
5. 모듈이 사용되지 않는다면, 해당 모듈의 네이티브 코드는 무시된다.

이러한 과정을 통해 `babel-preset-expo` 는 프로젝트에 필요한 네이티브 종속성만 선택적으로 연결할 수 있다. 개발자는 필요한 모듈을 설치하고 사용하기만 하면 되며, 네이티브 코드와의 연결은 자동으로 처리된다.

예를 들어, 프로젝트에서 `expo-camera` 모듈을 사용한다고 가정해보자. 개발자는 해당 모듈을 설치하고 코드에서 사용한다. `babel-preset-expo` 는 `expo-camera` 모듈이 설치되어 있음을 감지하고, 해당 모듈의 네이티브 코드를 자동으로 연결한다. 이를 통해 카메라 기능이 정상적으로 동작할 수 있다.

반면에, 프로젝트에서 `expo-camera` 모듈을 사용하지 않는다면, `babel-preset-expo` 는 해당 모듈의 네이티브 코드를 무시한다. 이렇게 함으로써 불필요한 네이티브 종속성을 피할 수 있고, 프로젝트의 크기와 성능을 최적화할 수 있다.

이러한 자동 처리 기능은 Expo 프로젝트에서 선택적 네이티브 종속성을 관리하는 데 큰 도움을 준다. 개발자는 필요한 모듈만 선택하여 사용할 수 있고, `babel-preset-expo` 가 네이티브 코드와의 연결을 자동으로 처리해주므로 개발 과정이 간소화된다.

### Config plugins vs babel-preset-expo

Config Plugins과 babel-preset-expo는 Expo 프로젝트에서 서로 다른 역할을 한다. 두 도구의 차이점을 알아보자.

1. Config Plugins:

   - Config Plugins은 Expo 프로젝트의 설정을 확장하고 커스터마이징하는 데 사용된다.
   - 프로젝트의 `app.json` 또는 `app.config.js` 파일에서 사용되며, 프로젝트의 구성을 수정하거나 추가 기능을 구현할 수 있다.
   - 예를 들어, 앱 아이콘, 스플래시 스크린, 권한 설정, 네이티브 코드 수정 등을 Config Plugins을 통해 처리할 수 있다.
   - Config Plugins은 주로 프로젝트의 빌드 과정에서 작동하며, Expo SDK와 직접 상호 작용한다.

2. babel-preset-expo:
   - babel-preset-expo는 Expo 프로젝트에서 사용되는 Babel 프리셋이다.
   - Babel은 JavaScript 코드를 변환하는 컴파일러로, ES6+ 문법을 이전 버전의 JavaScript로 변환하거나 JSX 문법을 일반 JavaScript로 변환하는 등의 작업을 수행한다.
   - babel-preset-expo는 Expo 프로젝트에 맞춰진 Babel 설정을 제공한다. 이 프리셋을 사용하면 Expo에서 지원하는 최신 JavaScript 기능과 React Native 구문을 사용할 수 있다.
   - babel-preset-expo는 주로 개발 과정에서 작동하며, 코드 변환과 관련된 작업을 처리한다.

요약하면, Config Plugins은 Expo 프로젝트의 설정과 관련된 작업을 처리하는 반면, babel-preset-expo는 Expo 프로젝트에서 사용되는 JavaScript 코드의 변환과 관련된 작업을 처리한다.

Config Plugins은 프로젝트의 구성을 수정하고 확장하는 데 사용되며, Expo SDK와 직접적으로 상호 작용한다. 반면에 babel-preset-expo는 Babel을 통해 JavaScript 코드를 변환하고 Expo 프로젝트에 맞게 최적화하는 역할을 한다.

두 도구는 서로 다른 영역에서 작동하지만, 모두 Expo 프로젝트의 개발과 빌드 과정에서 중요한 역할을 한다. Config Plugins은 프로젝트 설정을 관리하고, babel-preset-expo는 코드 변환을 처리하여 Expo 프로젝트가 원활하게 동작할 수 있도록 지원한다.
