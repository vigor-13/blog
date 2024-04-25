---
title: 딥링킹
description: 앱/유니버설 링크를 사용하여 표준 웹 URL에서 앱을 여는 방법을 알아본다.
date: 2024-04-14
tags: [deep_linking]
references:
  [
    {
      key: 'Expo 공식 문서',
      value: 'https://docs.expo.dev/guides/deep-linking/',
    },
    {
      key: '딥링크의 모든것(feat. App Link, Universal Link, Deferred DeepLink)',
      value: 'https://medium.com/prnd/%EB%94%A5%EB%A7%81%ED%81%AC%EC%9D%98-%EB%AA%A8%EB%93%A0%EA%B2%83-feat-app-link-universal-link-deferred-deeplink-61d6cf63a0a5',
    },
  ]
---

**유니버설 링크(Universal Links)** 는 iOS와 Android 모바일 운영 체제에서 사용되는 기술로, **앱과 웹 사이트 간의 원활한 연결을 제공한다.** 이를 통해 사용자는 웹 링크를 클릭하여 해당 앱의 특정 콘텐츠로 직접 이동할 수 있다. (iOS에서는 _유니버설 링크_, Android에서는 *앱 링크*라고 부른다)

주요 특징 및 장점:

1. **표준 HTTPS 링크 사용**: 유니버설 링크는 일반적인 웹 링크(https://)를 사용하므로, 웹 브라우저에서도 문제없이 작동한다.
2. **앱 설치 여부에 따른 동작**: 사용자의 기기에 앱이 설치되어 있다면, 링크를 클릭했을 때 해당 앱의 특정 화면으로 바로 이동한다. 앱이 설치되어 있지 않다면, 링크는 연결된 웹 페이지로 이동한다.
3. **크로스 플랫폼 호환성**: 데스크톱과 모바일에서 모두 동작하므로, 이메일이나 소셜 미디어 등 다양한 채널에서 동일한 링크를 사용할 수 있다.
4. **사용자 경험 개선**: 앱 설치 여부와 관계없이 콘텐츠에 접근할 수 있어 사용자 경험이 향상된다. 또한, 앱 내 특정 화면으로 바로 이동하여 사용자의 목적을 빠르게 달성할 수 있다.
5. **SEO 효과**: 유니버설 링크는 웹 표준을 따르므로, 검색 엔진 최적화(SEO)에도 도움이 된다. 앱 내 콘텐츠도 검색 결과에 노출될 수 있다.

구현 방법:

1. iOS의 경우, 애플 개발자 웹 사이트에서 앱-사이트 연결 파일(apple-app-site-association)을 생성하고, 웹 서버의 루트 디렉토리 또는 .well-known 디렉토리에 업로드해야 한다.
2. Android의 경우, 디지털 애셋 링크 파일(assetlinks.json)을 생성하고, 웹 서버의 .well-known 디렉토리에 업로드해야 한다.
3. 앱 내에서는 해당 링크를 처리하기 위한 코드를 작성해야 한다. iOS에서는 AppDelegate의 application(\_:continue:restorationHandler:) 메서드를, Android에서는 Intent Filter를 사용한다.

:::note
지연된 딥링크(Deferred Deep Links)는 [react-native-branch](https://github.com/expo/config-plugins/tree/main/packages/react-native-branch)를 사용하여 구현할 수 있다.
:::

앱/유니버설 링크를 사용하기 전에, Android와 iOS 모두에 대해 **웹사이트와 앱 간의 양방향 연결을 설정**해야 한다:

1. **네이티브 앱 검증**:
   - 앱과 웹사이트 간의 연결을 설정하기 위해, 앱 개발자는 *웹사이트 도메인을 참조하는 특별한 파일을 생성*해야 합니다.
   - iOS의 경우, 이 파일은 `apple-app-site-association` 이라는 이름의 JSON 파일이다. 이 파일에는 앱의 번들 ID와 앱에서 처리할 수 있는 경로에 대한 정보가 포함된다.
   - Android의 경우, `assetlinks.json` 이라는 유사한 파일을 사용한다. 이 파일에는 앱의 패키지 이름과 SHA-256 키 해시가 포함된다.
   - 이러한 파일은 디지털 서명되어 앱과 웹사이트 간의 신뢰할 수 있는 연결을 보장한다.
2. **웹사이트 검증**:
   - 앱-사이트 연결 파일을 생성한 후, 웹 개발자는 이를 웹사이트의 `/.well-known` 디렉토리에 업로드해야 한다.
   - `.well-known` 디렉토리는 웹 서버의 표준 위치로, 클라이언트가 특정 정보를 찾을 수 있는 곳이다.
   - iOS의 경우, `apple-app-site-association` 파일을 `.well-known` 디렉토리 또는 웹사이트 루트에 업로드한다.
   - Android의 경우, `assetlinks.json` 파일을 `.well-known` 디렉토리에 업로드한다.
   - 이 단계는 모바일 운영 체제가 앱과 웹사이트 간의 연결을 확인할 수 있도록 한다.
3. **링크의 런타임 라우팅 설정**:
   - 양방향 연결이 설정되면, 앱 개발자는 들어오는 링크를 적절한 앱 화면으로 라우팅하는 코드를 작성해야 한다.
   - 이는 일반적으로 JavaScript를 사용하여 수행되며, 웹과 앱 간의 모든 경로에 대해 설정되어야 한다.
   - 이 과정은 복잡할 수 있으므로, Expo와 같은 일부 프레임워크에서는 Expo Router와 같은 자동화된 솔루션을 제공한다. 이를 통해 개발자는 런타임 라우팅을 더 쉽게 관리할 수 있다.

:::note
유니버설 링크는 Expo Go 앱에서 테스트할 수 없다. 개발 빌드를 생성해야 한다.
:::

## iOS의 유니버설 링크 {#univeral-links-on-ios}

iOS의 유니버설 링크는 정규화된 **Apple Developer Team ID**와 연결해야 하므로 유료 Apple Developer 계정이 필요하다.

### 네이티브 Apple 설정 {#native-apple-configuration}

AASA(apple-app-site-association) 파일을 배포한 후, 앱이 연결된 도메인을 사용하도록 설정해야 한다:

`app.json` 에 [`expo.ios.associatedDomains`](https://docs.expo.dev/versions/latest/config/app#associateddomains) 를 추가하고 [Apple의 지정된 형식](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_associated-domains)을 따른다. URL에 프로토콜(https)을 포함하지 않도록 주의한다. 이는 유니버설 링크가 작동하지 않게 만드는 일반적인 실수다.

예를 들어, 연결된 웹사이트가 `https://expo.dev/`인 경우, 앱 링크는 다음과 같다:

```json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:expo.dev"]
    }
  }
}
```

권한이 Apple에 등록되도록 EAS Build로 네이티브 앱을 빌드한다.

### AASA 설정 {#assa-configuration}

웹 측에서는 `/.well-known/apple-app-site-association` (확장자 없음)에서 설정 파일을 호스팅해야 한다. 이 JSON 파일은 Apple Developer Team ID, 번들러 ID, 네이티브 앱으로 리디렉션할 지원되는 경로 목록을 지정한다.

:::note
실험적인 CLI 명령어 `npx setup-safari` 를 실행하여 번들 식별자를 Apple 계정에 자동으로 등록하고, ID에 권한을 할당하며, 스토어에 iTunes 앱 항목을 생성할 수 있습니다. 로컬 설정이 출력되며 다음 대부분을 건너뛸 수 있습니다. 이는 iOS의 유니버설 링크를 시작하는 가장 쉬운 방법이다.
:::

Expo Router(또는 Remix, Next.js 등의 다른 최신 React 프레임워크)를 사용하여 웹사이트를 구축하는 경우 `public/.well-known/apple-app-site-association` 에 파일을 생성한다. 레거시 Expo 웹팩 프로젝트는 `web/.well-known/apple-app-site-association` 에 파일을 생성할 수 있다.

```json
// public/.well-known/apple-app-site-association
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "{APPLE_TEAM_ID}.{BUNDLE_ID}",
        "paths": ["/records/*"]
      }
    ]
  },
  "activitycontinuation": {
    "apps": ["{APPLE_TEAM_ID}.{BUNDLE_ID}"]
  },
  "webcredentials": {
    "apps": ["{APPLE_TEAM_ID}.{BUNDLE_ID}"]
  }
}
```

이 코드 조각은 iOS에게 `https://www.myapp.io/records/*` 로의 모든 링크(레코드 ID에 대한 와일드카드 매칭 사용)가 일치하는 번들 식별자를 가진 앱에 의해 직접 열려야 함을 알려준다. 이는 Team ID와 앱 번들 식별자의 조합이다. Team ID는 Apple Developer 계정의 멤버십 세부 정보에서 찾을 수 있다.

:::note
`activitycontinuation` 과 `webcredentials` 객체는 선택 사항이지만 권장된다.
:::

AASA 파일 설정이 완료되면, HTTPS를 지원하는 서버에 웹사이트를 배포한다(대부분의 최신 웹 호스트는 이를 지원함).

AASA의 형식에 대한 자세한 내용은 [Apple의 문서](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html)를 참조한다. Branch에서 제공하는 [AASA 검증기](https://branch.io/resources/aasa-validator/)를 통해 AASA가 올바르게 배포되었는지, 유효한 형식인지 확인할 수 있다.

:::note
와일드카드(`*`)는 도메인이나 경로 구분 기호(마침표 및 슬래시)와 일치하지 않는다.
:::

iOS 13 이상에서는 다음을 지정할 수 있는 새로운 세부 정보 형식이 지원된다:

- `appID` 대신 `appIDs` 를 사용하면 동일한 설정과 여러 앱을 보다 쉽게 연결할 수 있다.
- 구성 요소의 배열을 사용하면 조각을 지정하고, 특정 경로를 제외하며, 주석을 추가할 수 있다.

:::important AASA JSON 예시

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["ABCDE12345.com.example.app", "ABCDE12345.com.example.app2"],
        "components": [
          {
            "#": "no_universal_links",
            "exclude": true,
            "comment": "Matches any URL whose fragment equals no_universal_links and instructs the system not to open it as a universal link"
          },
          {
            "/": "/buy/*",
            "comment": "Matches any URL whose path starts with /buy/"
          },
          {
            "/": "/help/website/*",
            "exclude": true,
            "comment": "Matches any URL whose path starts with /help/website/ and instructs the system not to open it as a universal link"
          },
          {
            "/": "/help/*",
            "?": {
              "articleNumber": "????"
            },
            "comment": "Matches any URL whose path starts with /help/ and which has a query item with name 'articleNumber' and a value of exactly 4 characters"
          }
        ]
      }
    ]
  }
}
```

:::

모든 iOS 버전을 지원하려면 `details` 키에 위의 두 형식을 모두 제공할 수 있지만, 최신 iOS 버전에 대한 구성을 먼저 배치하는 것이 좋다.

iOS는 앱이 처음 설치될 때와 App Store에서 업데이트가 설치될 때 AASA를 다운로드하지만, 더 자주 새로 고침하지는 않는다. 프로덕션 앱의 AASA에서 경로를 변경하려면 App Store를 통해 전체 업데이트를 해야 하므로 모든 사용자의 앱이 AASA를 다시 가져와 새 경로를 인식할 수 있다.

이제 모바일 기기의 웹사이트 링크가 앱을 열어야 한다. 그렇지 않은 경우 이전 단계를 다시 확인하여 AASA가 유효하고, 경로가 AASA에 지정되어 있으며, [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)에서 App ID를 올바르게 구성했는지 확인한다. 앱이 열리면 앱으로 들어오는 링크 처리 섹션으로 이동하여 인바운드 [링크를 처리](https://docs.expo.dev/guides/linking#handling-links)하고 사용자에게 요청한 콘텐츠를 표시하는 방법에 대한 세부 정보를 확인한다.

### Apple Smart Banner {#apple-smart-banner}

사용자에게 앱이 설치되어 있지 않으면 웹사이트로 이동한다. [Apple Smart Banner](https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners)를 사용하여 페이지 상단에 앱 설치를 유도하는 배너를 표시할 수 있다. 사용자가 모바일 기기에 있고 앱이 설치되어 있지 않은 경우에만 배너가 표시된다.

배너를 활성화하려면 웹사이트의 <head>에 다음 메타 태그를 추가하고, {ITUNES_ID}를 앱의 iTunes ID로 대체하세요:

```xml
<meta name="apple-itunes-app" content="app-id={ITUNES_ID}" />
```

배너 설정에 문제가 있는 경우 다음 명령을 실행하여 프로젝트에 대한 메타 태그를 자동으로 생성하세요:

```bash
npx setup-safari
```

Expo Router로 정적으로 렌더링된 웹사이트를 구축하는 경우 `app/+html.js` 파일의 `<head>` 요소에 다음의 HTML 태그를 추가한다.

```jsx
// app/+html.js
export default function Root({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta name="apple-itunes-app" content="app-id={ITUNES_ID}" />

        {/* Other head elements... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

다음에 웹사이트를 배포하면 앱이 설치되어 있지 않은 모바일 기기에서 방문할 때 배너가 나타나야 한다.

## Android의 딥링크 {#deep-links-on-android}

Android에서 딥링크를 구현하는 것(커스텀 URL 스키마 없이)은 iOS에 비해 다소 간단한다. `app.json` 의 `android` 섹션에 `intentFilters` 를 추가해야 한다.

다음 기본 설정은 `myapp.io` 에 대한 모든 레코드 링크를 처리하기 위한 옵션으로 표준 Android 대화상자에 앱을 표시하도록 한다:

```json
// app.json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "*.myapp.io",
              "pathPrefix": "/records"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### Android 앱 링크 {#android-app-links}

도메인으로 연결되는 링크가 (사용자에게 브라우저나 다른 처리기를 선택할 수 있는 대화 상자를 표시하지 않고) 항상 앱을 열도록 하는 것이 바람직할 수 있다. 이는 iOS의 유니버설 링크와 유사한 검증 프로세스를 사용하는 Android 앱 링크로 구현할 수 있다.

웹사이트 검증([디지털 애셋 링크](https://developers.google.com/digital-asset-links/v1/getting-started) 파일이라고도 함)을 위한 JSON 파일을 `public/.well-known/assetlinks.json` (또는 레거시 Expo 웹팩 웹사이트의 경우 `web/.well-known/assetlinks.json`)에 생성하고 다음 정보를 수집한다:

- `package_name` : 앱의 Android 애플리케이션 ID(예: `com.bacon.app`). 이는 `app.json` 파일의 `expo.android.package` 에서 찾을 수 있다.
- `sha256_cert_fingerprints` : 앱 서명 인증서의 SHA256 지문. 이는 다음 두 가지 방법 중 하나로 얻을 수 있다:
  1. EAS Build로 Android 앱을 빌드한 후, `eas credentials -p android` 를 실행하고 지문을 얻으려는 프로필을 선택한다. 지문은 SHA256 Fingerprint에 나열된다.
  2. [Play Console](https://play.google.com/console/) 개발자 계정의 `Release > Setup > App Signing` 에서 확인할 수 있다. 이 경우 동일한 페이지에서 앱에 맞는 Digital Asset Links JSON 코드 조각도 찾을 수 있다. 값은 `14:6D:E9:83...`와 같은 형식이다.

```json
// public/.well-known/assetlinks.json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "{package_name}",
      "sha256_cert_fingerprints": [
        // 서로 다른 앱과 키에 대한 여러 개의 지문 지원
        "{sha256_cert_fingerprints}"
      ]
    }
  }
]
```

디바이스에 네이티브 앱을 설치하면 [Android 앱 검증](https://developer.android.com/training/app-links/verify-android-applinks#web-assoc) 프로세스가 트리거되며, 최대 20초가 소요될 수 있다. 앱이 열리면 인바운드 링크를 처리하고 사용자에게 요청한 콘텐츠를 표시하는 방법에 대한 자세한 내용은 [앱으로 링크 처리](https://docs.expo.dev/guides/linking#handling-links) 섹션으로 이동한다.

<!-- ## 디버깅 {#debugging}

Expo CLI를 사용하면 웹사이트를 배포하지 않고도 유니버설 링크를 테스트할 수 있다. `--tunnel` 기능을 활용하여 개발 서버를 공개적으로 사용 가능한 HTTPS URL로 전달할 수 있다.

개발 중에 사용할 고유한 문자열인 "my-custom-domain"으로 환경 변수 `EXPO_TUNNEL_SUBDOMAIN=my-custom-domain` 을 설정한다. 이렇게 하면 개발 서버를 다시 시작해도 터널 URL이 일관되게 유지된다.

위에서 설명한 대로 유니버설 링크를 설정하되, 이번에는 Ngrok URL인 my-custom-domain.ngrok.io를 사용한다.

--tunnel 플래그를 사용하여 개발 서버를 시작합니다:
npx expo start --tunnel --dev-client
디바이스에서 개발 빌드를 컴파일합니다:
npx expo run:android
npx expo run:ios

문제 해결
Apple의 공식 문서에서 유니버설 링크 디버깅에 대해 읽어보세요.
검증 도구를 사용하여 apple-app-site-association 파일이 유효한지 확인하세요.
웹사이트가 HTTPS를 통해 제공되는지 확인하세요.
압축되지 않은 apple-app-site-association 파일은 128kb를 초과할 수 없습니다.
Android 앱 링크 검증
두 웹사이트 검증 파일이 content-type application/json으로 제공되는지 확인하세요.
Android 검증은 적용되는 데 최대 20초가 걸릴 수 있습니다.
웹 파일을 업데이트하는 경우 벤더 측(Google, Apple)에서 서버 업데이트를 트리거하려면 네이티브 앱을 다시 빌드하세요.

딥링크를 사용하지 않아야 하는 경우
이는 최소한의 구성만 필요하므로 앱에서 딥링크를 설정하는 가장 쉬운 방법입니다.

주요 문제는 사용자에게 앱이 설치되어 있지 않고 사용자 지정 구성표가 있는 앱 링크를 따라가는 경우 운영 체제에서 페이지를 열 수 없다는 표시는 하지만 더 자세한 정보는 제공하지 않는다는 점입니다. 이는 훌륭한 사용자 경험이 아닙니다. 브라우저에서 이를 해결할 방법은 없습니다.

또한 많은 메시징 앱은 사용자 지정 구성표가 있는 URL을 자동으로 링크하지 않습니다. 예를 들어 exp://u.expo.dev/[project-id]?channel-name=[channel-name]&runtime-version=[runtime-version]은 브라우저에 링크(exp://u.expo.dev/[project-id]?channel-name=[channel-name]&runtime-version=[runtime-version])가 아닌 일반 텍스트로 표시될 수 있습니다.

이에 대한 예시로 Gmail은 대부분의 앱 링크에서 href 속성을 제거합니다. 이를 해결하기 위한 방법은 앱의 사용자 지정 구성표 대신 일반 HTTPS URL로 링크하는 것입니다. 이렇게 하면 사용자의 웹 브라우저가 열립니다. 브라우저는 일반적으로 href 속성을 제거하지 않으므로 사용자를 앱의 사용자 지정 구성표로 리디렉션하는 파일을 온라인에 호스팅할 수 있습니다.

example://path/into/app으로 링크하는 대신 https://example.com/redirect-to-app.html로 링크할 수 있으며, redirect-to-app.html에는 다음 코드가 포함됩니다:

```text
<script>window.location.replace("example://path/into/app");</script>
``` -->
