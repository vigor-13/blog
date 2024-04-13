---
title: app config로 설정하기
description: app.json/app.config.js/app.config.ts 파일이 무엇이며 어떻게 커스터마이징 하고 사용할 수 있는지 알아본다.
date: 2024-04-03
modified: 2024-04-13
tags: [config]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/workflow/configuration/',
    },
  ]
---

**앱 설정(app config) 파일은 Expo 프로젝트의 다양한 측면을 설정하는 데 사용되는 중요한 파일이다.** 이 파일은 일반적으로 프로젝트 루트 디렉토리에 위치하며, JSON 형식(`app.json`)이나 JavaScript 또는 TypeScript 모듈(`app.config.js/app.config.ts`)로 작성될 수 있다.

앱 설정 파일의 주요 역할은 다음과 같다:

1. **Expo Prebuild 생성 설정**:
   - `expo prebuild` 명령을 실행할 때 생성되는 네이티브 프로젝트 디렉토리(`ios/android`)의 설정을 정의한다.
   - 앱 이름, 번들 식별자, 버전 번호, 방향, 아이콘, 스플래시 화면 등과 같은 앱의 기본 속성을 설정한다.
   - 필요한 권한, 연결된 도메인, 설정 플러그인(Config Plugins) 등을 지정하여 네이티브 프로젝트의 동작을 커스터마이징할 수 있다.
2. **Expo Go에서 프로젝트 로드 방식 설정**:
   - Expo Go에서 프로젝트를 열 때 사용되는 설정을 정의한다.
   - 개발 모드에서 앱의 동작을 제어하는 옵션을 포함한다(예: 개발자 메뉴 활성화, 리로드 시 캐시 지우기 등).
3. **OTA(Over-the-Air) 업데이트 매니페스트 설정**:
   - `expo-updates` 라이브러리를 사용하여 JavaScript 번들과 assets을 원격으로 업데이트할 때 사용되는 매니페스트를 설정한다.
   - 업데이트 서버 URL, 업데이트 간격, 폴백 동작 등을 지정할 수 있다.

앱 설정 파일의 기본 구조는 다음과 같다:

```json
// app.json
{
  "expo": {
    "name": "My app",
    "slug": "my-app"
  }
}
```

## 속성 {#properties}

앱 설정은 앱 이름, 아이콘, 스플래시 화면, 딥 링킹 스키마, 일부 서비스에 사용할 API 키 등 많은 것을 설정한다.

사용 가능한 프로퍼티의 전체 목록은 [app.json/app.config.js/app.config.ts 레퍼런스](https://docs.expo.dev/versions/latest/config/app/)를 확인한다.

:::note
Visual Studio Code를 사용한다면 [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools) 확장 프로그램을 설치하여 `app.json` 파일에서 속성의 자동 완성 기능을 사용하는 것이 좋다.
:::

## 앱에서 설정 값 읽기 {#reading-configuration-values-in-your-app}

앱 설정의 대부분의 값은 [`Constants.expoConfig`](https://docs.expo.dev/versions/latest/sdk/constants/#nativeconstants--properties) 를 사용하여 JavaScript 코드에서 런타임에 액세스할 수 있다.

앱 설정에는 민감한 정보를 포함해서는 **안 된다**(아래 설명된 대로 필터링되는 필드에 대한 몇 가지 예외 사항이 있음).

`npx expo config --type public` 명령을 실행하여 어떤 설정이 빌드/업데이트에 포함되어 런타임에 사용 가능한지 확인할 수 있다.

### 퍼블릭 앱 설정에서 어떤 필드가 필터링될까? {#which-fields-are-out-of-the-public-app-config}

다음 필드는 퍼블릭 앱 설정에서 필터링된다(즉, `Constants.expoConfig` 객체를 통해 접근할 수 없다):

- `hooks`
- `ios.config`
- `android.config`
- `updates.codeSigningCertificate`
- `updates.codeSigningMetadata`

:::warning
JavaScript 코드에서 `app.json/app.config.js` 를 직접 import하는 것은 피해야 한다. 이렇게 하면 처리된 버전이 아닌 파일 전체가 import되기 때문이다. 대신 [`Constants.expoConfig`](https://docs.expo.dev/versions/latest/sdk/constants/#nativeconstants--properties) 를 사용하여 설정에 액세스한다.
:::

## 설정 확장 {#extending-configuration}

라이브러리 작성자는 [Expo 설정 플러그인(Config plugins)](https://docs.expo.dev/config-plugins/introduction/)을 사용하여 앱 설정을 확장할 수 있다.

:::note
설정 플러그인은 주로 [`npx expo prebuild`](https://docs.expo.dev/workflow/prebuild/) 명령을 설정하는 데 사용된다.

prebuild 명령은 앱의 네이티브 프로젝트 디렉토리를 생성하거나 업데이트할 때 사용된다. 설정 플러그인은 네이티브 프로젝트 파일을 수정하거나 추가 리소스를 생성할 수 있다.
:::

## 동적 설정 {#dynamic-configuration}

JavaScript(`app.config.js`) 또는 TypeScript(`app.config.ts`)를 사용하면 앱 설정을 더 유연하게 커스터마이징 할 수 있다. 이러한 파일은 동적 설정을 가능하게 하는 몇 가지 이점이 있다:

- 주석, 변수 및 작은따옴표를 사용할 수 있다. 이를 통해 설정 파일을 더 읽기 쉽고 유지 관리하기 쉽게 만들 수 있다.
- 다른 JavaScript 파일을 import/require 할 수 있다. 이를 통해 설정을 여러 파일로 분할하고 코드를 재사용할 수 있다. 단, 외부 파일에서 import/export 구문을 사용하는 것은 지원되지 않으며, 가져온 모든 파일은 현재 Node.js 버전을 지원하도록 트랜스파일링되어야 한다.
- TypeScript를 사용할 수 있으며, nullish 병합 및 옵셔널 체이닝과 같은 기능을 활용할 수 있다. 이는 더 안전하고 표현력 있는 구성 파일을 작성하는 데 도움이 된다.
- Metro 번들러가 다시 로드될 때마다 설정 파일이 업데이트된다. 이를 통해 개발 중에 설정을 변경하고 즉시 반영할 수 있다.
- _설정 파일에서 환경 변수를 읽고 앱에 환경 정보를 제공할 수 있다. 이는 서로 다른 환경(예: 개발, 스테이징, 프로덕션)에 대해 다른 설정을 적용할 때 유용하다._

예를 들어, 커스텀 설정을 정의하기 위해 객체를 export 할 수 있다:

```js
// app.config.js
const myValue = 'My App';

module.exports = {
  name: myValue,
  version: process.env.MY_CUSTOM_PROJECT_VERSION || '1.0.0',
  // All values in extra will be passed to your app.
  extra: {
    fact: 'kittens are cool',
  },
};
```

`extra` 키를 사용하면 앱에 임의의 설정 데이터를 전달할 수 있다. 이 키의 값은 [`expo-constants`](https://docs.expo.dev/versions/latest/sdk/constants/) 를 사용하여 접근할 수 있다:

```js
// App.js
import Constants from 'expo-constants';

Constants.expoConfig.extra.fact === 'kittens are cool';
```

Expo는 앱 설정을 `app.json` 파일이나 `app.config.js` 파일에 정의할 수 있는 유연한 방식을 제공한다.

`app.json` 파일은 JSON 형식으로 앱의 설정을 정의하는 파일이다. 이 파일에는 앱의 이름, 버전, 아이콘, 권한 설정 등 다양한 메타데이터를 포함할 수 있다.

반면 `app.config.js` 파일은 JavaScript 파일로, 객체를 반환하는 함수를 export하여 앱 설정을 동적으로 생성하거나 수정할 수 있다. 이는 `app.json` 에 정의된 설정 값을 기반으로 추가적인 로직을 적용하거나, 설정 값을 동적으로 변경할 필요가 있을 때 유용하다.

만약 프로젝트에 `app.json` 과 `app.config.js` 파일이 모두 있다면, Expo CLI는 다음과 같은 순서로 설정을 읽어들인다:

1. 먼저 `app.json` 파일을 읽어들여 JSON 형식의 설정 값을 파싱한다.
2. 파싱된 설정 값을 정규화하여 JavaScript 객체 형태로 변환한다.
3. 정규화된 설정 객체를 `app.config.js` 파일에서 export한 함수의 인자로 전달한다.

`app.config.js` 파일에서 export한 함수는 이렇게 전달받은 설정 객체를 인자로 받아, 설정 값에 접근하고 필요에 따라 수정할 수 있다.

```json
// app.json
{
  "expo": {
    "name": "My App"
  }
}
```

```js
// app.config.js
module.exports = ({ config }) => {
  console.log(config.name); // prints 'My App'
  return {
    ...config,
  };
};
```

예를 들어, 위의 코드에서는 `app.json` 에 정의된 앱 이름( `name` )이 `app.config.js` 로 전달되고, 이를 콘솔에 출력하고 있다. 그리고 `...config` 를 사용하여 전달받은 설정 객체를 그대로 반환하고 있습니다.

이렇게 `app.config.js` 에서 설정 객체를 수정하면, 수정된 설정 값이 최종적으로 앱에 적용된다. 이를 통해 `app.json` 에 정의된 기본 설정을 기반으로 동적인 설정 관리를 할 수 있다.

예를 들어, 다음과 같이 `app.config.js` 에서 설정 객체를 수정할 수 있다:

```js
module.exports = ({ config }) => {
  // 설정 값을 동적으로 변경
  config.version = '1.0.0';

  // 추가적인 설정 값 정의
  config.extra = {
    apiKey: process.env.API_KEY,
  };

  return {
    ...config,
  };
};
```

이렇게 하면 `app.json`에 정의된 설정 값을 기반으로, 버전을 동적으로 변경하거나 새로운 설정 값(`extra.apiKey`)을 추가할 수 있다.

이 방식은 Expo 프로젝트에서 앱 설정을 유연하고 동적으로 관리할 수 있도록 도와준다. `app.json` 과 `app.config.js` 를 함께 사용하면 정적인 설정과 동적인 설정을 조합하여 앱의 요구사항에 맞게 설정을 구성할 수 있다.

### 환경에 따른 설정 전환 {#switching-configuration-based-on-the-environment}

개발, 스테이징 및 프로덕션 환경에서 일부 다른 설정을 사용하거나 앱을 화이트 라벨링하기 위해 설정을 완전히 교체하는 것이 일반적이다. 이를 달성하기 위해 환경 변수와 함께 `app.config.js` 를 사용한다.

```js
// app.config.js
module.exports = () => {
  if (process.env.MY_ENVIRONMENT === 'production') {
    return {
      /* 프로덕션 설정 */
    };
  } else {
    return {
      /* 개발 설정 */
    };
  }
};
```

Expo CLI 명령과 함께 환경 변수를 사용하여 설정을 전환하는 방법에는 두 가지가 있다:

1. **특정 명령에 대한 환경 변수 설정**:
   - _이 방법은 개별 명령을 실행할 때 일회성으로 환경 변수를 설정하는 것이다._
   - 예시와 같이 명령 앞에 `변수명=값` 을 접두사로 붙여 사용한다.
   - Unix 계열 시스템(Linux, macOS)에서는 `MY_ENVIRONMENT=production eas update` 와 같이 사용할 수 있다.
   - Windows에서는 `cross-env` 라는 패키지를 사용하여 유사한 동작을 구현할 수 있다: `npx cross-env MY_ENVIRONMENT=production eas update`
   - 이렇게 하면 해당 명령을 실행하는 동안에만 환경 변수가 설정되고, 명령이 완료되면 환경 변수는 초기 상태로 돌아간다.

```bash
MY_ENVIRONMENT=production eas update
```

```bash
npx cross-env MY_ENVIRONMENT=production eas update
```

2. **셸 프로파일에서 환경 변수 설정**:
   - 이 방법은 _셸 프로파일 파일(예: `.bashrc`, `.bash_profile`, `.zshrc` 등)에 환경 변수를 영구적으로 설정하는 것이다._
   - 셸 프로파일 파일에 `export MY_ENVIRONMENT=production`과 같은 명령을 추가한다.
   - 변경 사항을 적용하려면 새로운 터미널 세션을 시작하거나 `source` 명령을 사용하여 셸 프로파일을 다시 로드해야 한다.
   - 이렇게 설정된 환경 변수는 모든 명령에 대해 지속적으로 적용된다.

이 두 가지 방법 외에도 환경 변수를 설정하는 다른 메커니즘을 사용할 수 있다. 예를 들어:

- _`dotenv` 패키지를 사용하여 `.env` 파일에서 환경 변수를 로드할 수 있다._
- 프로세스 관리자(예: `pm2`)를 사용하여 환경 변수를 설정할 수 있다.
- CI/CD 시스템의 구성에서 환경 변수를 설정할 수 있다.

**중요한 점은 `app.config.js` 에서 `process.env` 를 통해 환경 변수에 접근할 수 있다는 것이다.** 이를 통해 환경에 따라 다른 설정을 적용할 수 있다. 개발 환경과 프로덕션 환경에서 서로 다른 API 엔드포인트, 인증 키, 기능 플래그 등을 사용할 수 있다.

### TypeScript를 사용한 설정: app.config.js 대신 app.config.ts 사용 {#using-typescript-for-configuration}

TypeScript에서 Expo 설정과 함께 자동 완성 및 doc-blocks을 사용할 수 있다. 다음과 같이 `app.config.ts` 를 생성한다:

```ts
// app.config.ts
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'my-app',
  name: 'My App',
});
```

다른 TypeScript 파일을 import하거나 언어 기능을 커스터마이징 하려면 `ts-node` 를 사용한다.

### 설정 해석 규칙 {#configuration-resolution-rules}

설정에는 두 가지 다른 유형이 있다: 정적 설정(`app.config.json/app.json`)과 동적 설정(`app.config.js/app.config.ts`)이다.

Expo는 앱 설정을 관리하기 위해 여러 가지 규칙을 사용한다. 이 규칙들은 정적 설정과 동적 설정이 어떻게 해석되고 병합되는지를 정의한다.

1. **정적 설정 읽기**:
   - Expo는 먼저 **app.config.json** 파일이 존재하는지 확인한다. 이 파일이 있으면 정적 설정으로 사용된다.
   - **app.config.json**이 없는 경우, Expo는 **app.json** 파일을 찾는다. 이 파일이 있으면 정적 설정으로 사용된다.
   - 정적 설정 파일이 없는 경우, Expo는 **package.json**과 프로젝트의 종속성에서 기본값을 추론한다.
2. **동적 설정 읽기**:
   - Expo는 **app.config.ts** 또는 **app.config.js** 파일이 존재하는지 확인한다.
   - 두 파일이 모두 존재하는 경우, TypeScript 설정(**app.config.ts**)이 우선적으로 사용된다.
   - 동적 설정 파일이 없는 경우, 이 단계는 건너뛴다.
3. **동적 설정에서 함수 반환**:
   - 동적 설정 파일(**app.config.js** 또는 **app.config.ts**)이 함수를 export하는 경우, 이 함수는 정적 설정을 인자로 받는다.
   - 함수 시그니처는 `({ config }) => ({})`와 같은 형태입니다. 여기서 `config`는 정적 구성 객체입니다.
   - 이 함수 내에서 정적 설정 값을 수정하거나 새로운 값을 추가할 수 있다.
   - 이 단계는 정적 설정에 대한 일종의 미들웨어로 생각할 수 있다. 동적 설정에서 정적 설정을 변경할 수 있다.
4. **최종 설정 반환**:
   - 동적 설정 파일에서 반환된 값은 최종 설정으로 사용된다.
   - 이 값은 일반 JavaScript 객체여야 하며, promise를 포함해서는 안 된다.
   - 동적 설정에서 반환된 값은 정적 설정과 병합되어 최종 설정을 형성한다.
5. **설정 함수 평가 및 직렬화**:
   - 설정 내의 모든 함수는 Expo 도구에서 사용되기 전에 평가되고 직렬화된다.
   - 함수는 실행되고 그 결과 값으로 대체된다.
   - 최종 설정은 JSON 형식으로 직렬화될 수 있어야 한다. 직렬화할 수 없는 값(예: 함수, Promise 등)은 포함될 수 없다.
   - 이 단계는 설정이 호스팅되거나 다른 도구에 의해 사용될 때 수행된다.

이러한 규칙을 통해 Expo는 정적 설정과 동적 설정을 유연하게 조합하여 사용할 수 있다. 개발자는 프로젝트의 요구 사항에 따라 적절한 설정 방식을 선택할 수 있다.

정적 설정은 간단하고 CLI 도구로 쉽게 업데이트할 수 있는 반면, 동적 설정은 더 많은 유연성과 프로그래밍 기능을 제공한다. 동적 설정을 사용하면 환경 변수에 따라 조건부로 설정을 수정하거나, 외부 데이터 소스에서 설정 값을 가져오는 등의 작업을 수행할 수 있다.

Expo의 설정 해석 규칙은 이러한 다양한 사용 사례를 지원하면서도 일관되고 예측 가능한 방식으로 설정을 관리할 수 있도록 도와준다.
