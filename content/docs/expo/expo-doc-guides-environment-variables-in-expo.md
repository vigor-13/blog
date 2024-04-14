---
title: 환경 변수
description:
date: 2024-04-14
tags: [environment_variable]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/guides/environment-variables/',
    },
  ]
---

환경 변수는 소스 코드 밖에서 설정되는 키-값 쌍으로, 앱이 실행되는 환경에 따라 다르게 동작하도록 해준다. 예를 들어, 테스트 버전의 앱을 빌드할 때는 특정 기능을 활성화하거나 비활성화할 수 있고, 프로덕션 빌드 시에는 다른 API 엔드포인트로 전환할 수 있다.

Expo CLI는 `npx expo start` 와 같이 Expo CLI를 사용할 때마다 자동으로 `EXPO_PUBLIC_` 접두사가 붙은 환경 변수를 `.env` 파일에서 로드하여 JavaScript 코드 내에서 사용할 수 있게 해준다.

:::note
이 기능은 SDK 49 이상에서 사용 가능하다.
:::

## .env 파일에서 환경 변수 읽어오기 {#reading-environment-variables-from-env-files}

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 `EXPO_PUBLIC_[NAME]=VALUE` 형식으로 변수를 추가한다.

```env
EXPO_PUBLIC_API_URL=https://staging.example.com
EXPO_PUBLIC_API_KEY=abc123
```

이제 소스 코드에서 직접 환경 변수를 사용할 수 있다.

```tsx
import { Button } from 'react-native';

function Post() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  async function onPress() {
    await fetch(apiUrl, { ... })
  }

  return <Button onPress={onPress} title="Post" />;
}
```

`npx expo start` 를 실행하면 앱 번들에서 `process.env.EXPO_PUBLIC_API_URL` 은 `https://staging.example.com` 으로 대체된다.

변수는 Expo CLI를 다시 시작하거나 캐시를 지우지 않고도 코드를 편집할 때 업데이트할 수 있다.

업데이트된 값을 보려면 전체 새로고침(예: 흔들기 제스처 후 Expo Go 또는 개발 빌드에서 Reload)을 수행해야 한다.

:::warning
프라이빗 키와 같은 중요 정보는 `EXPO_PUBLIC_` 변수에 저장하면 안 된다. 이 변수는 컴파일된 애플리케이션에서 일반 텍스트로 표시된다.
:::

### 변수가 로드되는 방식 {#how-variables-are-loaded}

Expo CLI는 [표준 .env 파일 해석](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use)에 따라 `.env` 파일을 로드한 다음, 코드에서 `process.env.EXPO_PUBLIC_[VARNAME]` 에 대한 모든 참조를 `.env` 파일에 설정된 해당 값으로 바꾼다.

보안상의 이유로 `node_modules` 내부 코드는 영향을 받지 않는다.

### 환경 변수 읽는 방법 {#how-to-read-from-environment-variables}

모든 환경 변수는 인라인 처리되려면 JavaScript의 점 표기법을 사용하여 `process.env` 의 속성으로 정적으로 참조되어야 한다.

- ✅ `process.env.EXPO_PUBLIC_KEY` 와 같은 표현식은 유효하며 인라인 처리된다.
- ❌ `process.env['EXPO_PUBLIC_KEY']` 또는 `const {EXPO_PUBLIC_X} = process.env` 와 같은 형식은 지원되지 않는다.

### 별도의 환경을 정의하기 위해 여러 .env 파일 사용하기 {#using-multiple-env-files-to-define-separate-environments}

[표준 `.env` 파일](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use)을 정의할 수 있으므로 `.env` , `.env.local` , `.env.production` 등의 파일을 별도로 둘 수 있으며, 이들은 표준 우선순위에 따라 로드된다.

기본 `.env` 파일이나 다른 표준 설정을 git에 커밋해도 되지만, 일반적으로 `.env.local` 파일은 `.gitignore` 에 추가해야 한다.

```text
.env*.local
```

`.env.test` 와 같은 환경별 파일을 만들면 Expo CLI를 실행할 때 `NODE_ENV` 를 설정하여 로드할 수 있다.

```bash
NODE_ENV=test npx expo start
```

### 환경 변수 비활성화하기 {#disabling-environment-variables}

Expo CLI의 환경 변수는 두 부분으로 구성되며 둘 다 비활성화할 수 있다.

1. Expo CLI가 `.env` 파일을 전역 프로세스로 자동 로드하는 것을 비활성화하려면, Expo CLI 명령을 실행하기 전에 `EXPO_NO_DOTENV` 환경 변수를 `1` 로 설정한다.
2. 클라이언트 JavaScript 번들에서 환경 변수의 인라인 직렬화를 비활성화하려면 `EXPO_NO_CLIENT_ENV_VARS=1` 을 사용한다.

## EAS의 환경 변수 {#environment-variables-in-eas}

### EAS Build {#eas-build}

[EAS Build](https://docs.expo.dev/build/introduction/)는 앱 바이너리에 포함된 JS 번들을 빌드할 때 Metro Bundler를 사용하므로, 빌드 작업과 함께 업로드된 `.env` 파일을 사용하여 `EXPO_PUBLIC_` 변수를 코드에 인라인 처리한다.

EAS Build는 `eas.json` 의 빌드 프로필 내에서 그리고 EAS Secrets를 통해 환경 변수를 정의할 수 있다.

환경 변수와 빌드 시크릿에 대한 자세한 내용은 [EAS Build 문서](https://docs.expo.dev/build-reference/variables/)를 참조한다.

:::note
EAS Build에서는 `.env` 파일과 `eas.json`의 빌드 프로필, 그리고 `EAS Secrets` 등 여러 방식으로 환경 변수를 설정할 수 있다. 이들은 상호 보완적으로 사용될 수 있다.

일반적으로,

- `.env` 파일은 로컬 개발 환경에서 주로 사용되며, 앱 번들링 시 인라인 처리된다.
- `eas.json` 의 *빌드 프로필*은 빌드 프로세스 중에 사용할 환경 변수를 정의하는 데 사용된다. 이는 빌드 타임에 환경 변수를 설정하는 편리한 방법이다.
- `EAS Secrets` 은 민감한 정보(예: API 키, 인증 토큰 등)를 저장하는 데 사용되며, 빌드 프로세스 중에 환경 변수로 안전하게 노출될 수 있다.

따라서 상황에 따라 적절한 방법을 선택하면 된다.

- 로컬 개발 시 `.env` 파일을 사용하고,
- 빌드별로 다른 설정이 필요한 경우 `eas.json` 의 빌드 프로필을 활용하며,
- 민감한 정보가 필요한 경우 `EAS Secrets` 을 사용하는 것이 좋다.

필요에 따라 이들을 조합하여 사용할 수도 있다. 예를 들어, `.env` 파일에 기본 환경 변수를 설정하고, `eas.json` 에서 빌드 타입별로 추가 변수를 지정할 수 있다.
:::

### EAS Update {#eas-update}

[EAS Update](https://docs.expo.dev/eas-update/introduction/)는 로컬 환경이나 CI에서 Metro Bundler를 사용하여 앱 번들을 빌드하므로, 사용 가능한 `.env` 파일을 이용해 `EXPO_PUBLIC_` 변수를 인라인 처리한다.

자세한 내용은 [환경 변수](https://docs.expo.dev/eas-update/environment-variables/)에 대한 EAS 업데이트 문서를 참조한다.

## Expo 환경 변수로 마이그레이션 {#migrating-to-expo-environment-variables}

### react-native-config {#from-react-native-config}

`react-native-config` 에서 마이그레이션 시에는 `.env` 파일에서 JS 코드에서 사용되는 변수 앞에 `EXPO_PUBLIC_` 접두사를 붙이고, 코드에서 `process.env.EXPO_PUBLIC_[VARNAME]` 을 사용하도록 업데이트한다.

```diff-env
- API_URL=https://myapi.com
+ EXPO_PUBLIC_API_URL=https://myapi.com
```

```diff-ts
- import Config from "react-native-config";

- const apiUrl = Config.API_URL;
+ const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

### babel-plugin-transform-inline-environment-variabels {#from-babel-plugin-transform-inline-environment-variabels}

`babel-plugin-transform-inline-environment-variables` 플러그인 사용 시에는 `.env` 파일 내 변수를 설정하고 `EXPO_PUBLIC_` 접두사를 사용하도록 변수 이름을 업데이트한 후, Babel 설정에서 해당 플러그인을 제거한다.

```diff-text
- const apiUrl = process.env.API_URL;
+ const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

```diff-js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
--    plugins: ['transform-inline-environment-variables'],
  };
};

```

바벨 설정 파일을 수정한 후에 `npx expo start -c` 명령으로 캐시를 제거한다.

### direnv {#from-direnv}

`direnv` 에서는 JS에 사용된 환경 변수를 `.envrc` 파일에서 `.env` 파일로 옮기고 `EXPO_PUBLIC_` 접두사를 붙인다.

```diff-text
- import Constants from 'expo-constants';

- const apiUrl = Constants.expoConfig.extra.apiUrl;
+ const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

## 보안 고려사항 {#security-considerations}

중요한 시크릿 환경변수는 절대 `EXPO_PUBLIC_` 접두사가 있는 환경 변수에 저장하면 안 된다. 최종 사용자가 앱을 실행하면 앱의 모든 코드와 내장된 환경 변수에 액세스할 수 있다.

더 자세한 내용은 [민감한 정보 저장하기](https://reactnative.dev/docs/security#storing-sensitive-info) 문서를 확인한다.
