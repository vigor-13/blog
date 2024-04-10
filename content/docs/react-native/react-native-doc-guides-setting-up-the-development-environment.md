---
title: 개발 환경 설정하기
description:
date: 2024-04-10
tags: []
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/environment-setup',
    },
  ]
---

## React Native 앱 개발 시작하기

React Native로 모바일 앱 개발을 시작하는 가장 쉬운 방법은 Expo Go를 사용하는 것이다. Expo는 React Native를 기반으로 구축된 도구와 서비스의 집합체로, 최신 버전의 Node.js와 휴대폰 또는 에뮬레이터만 있으면 몇 분 만에 React Native 앱을 작성할 수 있다.

이미 모바일 개발에 익숙한 경우에는 React Native CLI를 사용하는 것이 더 적합할 수 있다. 이 경우 Xcode 또는 Android Studio가 필요한데, 이미 설치되어 있다면 바로 시작할 수 있지만 그렇지 않다면 설치 및 설정에 약 한 시간 정도 소요될 수 있다.

:::tabs

@tab:active Expo#expo

다음 명령을 실행하여 새 프로젝트를 생성하고 개발 서버를 실행한다.

```bash
npx create-expo-app AwesomeProject

cd AwesomeProject
npx expo start
```

**React Native 앱 실행하기**

[Expo Go](https://expo.dev/client) 앱을 사용하면 iOS나 Android SDK를 설치하지 않고도 실제 기기에서 앱을 실행해 볼 수 있다. 안드로이드에서는 프로젝트 생성 후 Expo Go 앱으로 QR 코드를 스캔하면 바로 앱이 실행된다. iOS에서는 기본 카메라 앱으로 QR 코드를 스캔하면 앱을 실행할 수 있다.

앱 개발이 완료되면 시뮬레이터나 가상 기기에서도 테스트해 볼 수 있다. 이를 위해서는 Xcode나 Android Studio 등의 네이티브 개발 환경 설정이 필요하다.

**주의사항**

Expo Go는 간단한 앱을 빠르게 개발하고 공유하는데 최적화된 도구다. 하지만 Expo SDK에서 제공하는 네이티브 모듈만 사용할 수 있다는 제약이 있다. 따라서 커스텀 네이티브 모듈을 사용하려면 Expo의 `prebuild` 기능을 활용하거나 별도의 네이티브 설정이 필요하다.

또한 Expo SDK는 일정 주기로 최신 React Native 버전을 지원하므로, 항상 최신 버전을 사용하지는 못할 수도 있다. [이 문서](https://docs.expo.dev/versions/latest/#each-expo-sdk-version-depends-on-a)를 참조하여 현재 지원되는 버전을 확인할 수 있다.

만약 React Native를 기존 앱에 통합하려면 Expo 없이도 개발할 수 있지만, 이 경우 반드시 네이티브 개발 환경을 직접 설정해야 한다.

이처럼 React Native로 모바일 앱 개발을 시작하는 방법은 개발 목적과 환경에 따라 조금씩 다르다. 하지만 **Expo Go는 대부분의 경우 가장 빠르고 간편한 방법이므로, 특별한 이유가 없다면 Expo로 시작하는 것이 좋다. 프로젝트가 커지고 네이티브 기능 통합이 필요해지면 그때 Expo의 추가 기능을 활용하거나 React Native CLI로 전환하는 방안을 고려해 보는 것이 좋다.**

@tab React Native CLI - Android#react-native-cli-android

React Native 프로젝트에서 네이티브 코드를 빌드해야 하는 경우, 예를 들어 기존 앱에 React Native를 통합하거나 Expo에서 `prebuild` 를 실행하여 프로젝트의 네이티브 코드를 생성한 경우에는 다음 지침을 따른다.

**종속성 설치**

`Node` , `Watchman` , `React Native CLI` , `JDK` , `Android Studio` 가 필요하다.

앱 개발에 원하는 편집기를 사용할 수 있지만 Android용 React Native 앱을 빌드하는 데 필요한 도구를 설정하려면 Android Studio를 설치해야 한다.

**Node & Watchman**

[Homebrew](https://brew.sh/)를 사용하여 Node와 Watchman을 설치하는 것이 좋다. Homebrew 설치 후 터미널에서 다음 명령을 실행한다.

```bash
brew install node
brew install watchman
```

시스템에 이미 Node를 설치한 경우 _Node 18_ 이상인지 확인한다.

[Watchman](https://facebook.github.io/watchman)은 Facebook에서 만든 파일 시스템 변경 감시 도구로, 더 나은 성능을 위해 설치하는 것이 좋다.

**JDK(Java Development Kit)**

Homebrew를 사용하여 Azul _Zulu_ 라는 OpenJDK 배포판을 설치하는 것이 좋다.

```bash
brew tap homebrew/cask-versions
brew install --cask zulu17

# Get path to where cask was installed to double-click installer
brew info --cask zulu17
```

설치 후 `JAVA_HOME` 환경 변수를 업데이트한다. 앞선 과정을 따랐다면 값은 `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home` 이다.

Zulu OpenJDK는 *Intel과 M1 Mac 모두를 위한 JDK를 제공*하여 Intel 기반 JDK를 사용하는 것보다 M1 Mac에서 빌드 속도가 빨르다.

시스템에 이미 JDK를 설치했다면 *JDK 17*을 권장한다. 상위 JDK 버전을 사용하면 문제가 발생할 수 있다.

**안드로이드 개발 환경**

Android 개발이 처음이라면 개발 환경을 설정하는 것이 다소 지루할 수 있다. 이미 Android 개발에 익숙하다면 설정해야 할 몇 가지 사항이 있다. 어떤 경우든 다음 단계를 주의 깊게 따라야 한다.

1. **Android Studio 설치** : Android Studio를 다운로드하여 설치한다.

설치 마법사에서 다음 항목 옆의 체크박스가 모두 선택되었는지 확인한다:

- Android SDK
- Android SDK Platform
- Android Virtual Device

그런 다음 "Next"를 클릭하여 이러한 구성 요소를 모두 설치한다.

> 체크박스가 회색으로 표시되면 나중에 이러한 구성 요소를 설치할 수 있다.

설정이 완료되고 시작 화면이 표시되면 다음 단계로 진행한다.

2. **Android SDK 설치** : Android Studio는 기본적으로 최신 Android SDK를 설치한다. 그러나 네이티브 코드로 React Native 앱을 빌드하려면 특히 _Android 14(UpsideDownCake)_ SDK가 필요하다. Android Studio의 SDK Manager를 통해 추가 Android SDK를 설치할 수 있다.

이를 위해 Android Studio를 열고 `More Actions` 버튼을 클릭한 다음 `SDK Manager` 를 선택한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-setting-up-the-development-environment/1.png)

> SDK Manager는 Android Studio `Settings` 의 `Languages & Frameworks → Android SDK` 에서도 찾을 수 있다.

SDK Manager에서 `SDK Platforms` 탭을 선택하고 오른쪽 하단 모서리에 있는 `Show Package Details` 옆의 상자를 선택한다. Android 14(UpsideDownCake) 항목을 찾아 확장한 다음 다음 항목이 선택되었는지 확인한다:

- Android SDK Platform 34
- Intel x86 Atom_64 System Image 또는 Google APIs Intel x86 Atom System Image 또는 (Apple M1 실리콘의 경우) Google APIs ARM 64 v8a System Image

다음으로 `SDK Tools` 탭을 선택하고 여기에서도 `Show Package Details` 옆의 상자를 선택한다. `Android SDK Build-Tools` 항목을 찾아 확장한 다음 34.0.0이 선택되었는지 확인하다.

마지막으로 `Apply` 를 클릭하여 Android SDK와 관련 빌드 도구를 다운로드하고 설치한다.

3. **ANDROID_HOME 환경 변수 설정** : React Native 도구는 네이티브 코드로 앱을 빌드하려면 일부 환경 변수를 설정해야 한다.

`~/.zprofile` 이나 `~/.zshrc` (bash를 사용하는 경우 `~/.bash_profile` 또는 `~/.bashrc`) 설정 파일에 다음 줄을 추가한다:

```text
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

`source ~/.zprofile` (bash의 경우 `source ~/.bash_profile` )을 실행하여 현재 셸에 설정을 로드한다. `echo $ANDROID_HOME` 을 실행하여 `ANDROID_HOME` 이 설정되었는지 확인하고, `echo $PATH` 를 실행하여 적절한 디렉토리가 경로에 추가되었는지 확인한다.

> Android Studio "Settings"에서 Languages & Frameworks → Android SDK에 있는 실제 SDK 위치를 사용하고 있는지 확인하는 것이 중요하다.

**React Native CLI**

React Native에는 내장 CLI가 있다. CLI 특정 버전을 전역으로 설치하고 관리하는 대신, 노드에 포함된 npx를 사용하여 런타임에 현재 버전에 액세스하는 것이 좋다.

```bash
npx react-native <command>
```

**새 앱 만들기**

이전에 전역 `react-native-cli` 패키지를 설치한 경우 예기치 않은 문제를 일으킬 수 있으므로 제거한다:

```bash
npm uninstall -g react-native-cli @react-native-community/cli
```

다음 명령으로 "AwesomeProject"라는 새 React Native 프로젝트를 만들 수 있다.

```bash
npx react-native@latest init AwesomeProject
```

이는 React Native를 기존 앱에 통합하거나 프로젝트에 Expo를 설치했거나 기존 React Native 프로젝트에 Android 지원을 추가하는 경우에는 필요하지 않다.

[Ignite CLI](https://github.com/infinitered/ignite)와 같은 서드파티 CLI를 사용하여 React Native 앱을 초기화할 수도 있다.

**[선택사항] 특정 버전이나 템플릿 사용**

`--version` 인자를 사용하여 특정 React Native 버전으로 새 프로젝트를 시작할 수 있다:

```bash
npx react-native@X.XX.X init AwesomeProject --version X.XX.X
```

`--template` 인자로 커스텀 React Native 템플릿 프로젝트를 시작할 수도 있다.

**안드로이드 기기 준비**

React Native Android 앱을 실행하려면 Android 기기가 필요하다. 실제 Android 기기일 수도 있고, 더 일반적으로 컴퓨터에서 Android 기기를 에뮬레이션할 수 있는 Android Virtual Device(AVD)를 사용할 수 있다.

어느 쪽이든 개발용 Android 앱을 실행할 수 있도록 기기를 준비해야 한다.

**물리적 기기 사용**

물리적 Android 기기가 있는 경우 USB 케이블로 컴퓨터에 연결하고 [여기](https://reactnative.dev/docs/running-on-device)에 있는 지침을 따라 AVD 대신 개발에 사용할 수 있다.

**가상 기기 사용**

Android Studio를 사용하여 `./AwesomeProject/android` 를 열면 Android Studio 내에서 `AVD Manager` 를 열어 사용 가능한 Android Virtual Device(AVD) 목록을 볼 수 있다. 다음과 같은 아이콘을 찾아보자:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-setting-up-the-development-environment/2.png)

Android Studio를 최근에 설치했다면 새 AVD를 만들어야 한다. `Create Virtual Device...` 를 선택한 다음 목록에서 휴대폰을 선택하고 `Next` 를 클릭한 다음 _UpsideDownCake_ API Level 34 이미지를 선택한다.

`Next` 를 클릭한 다음 `Finish` 를 클릭하여 AVD를 만든다. 이 시점에서 AVD 옆에 있는 녹색 삼각형 버튼을 클릭하여 AVD를 실행한 다음 다음 단계로 진행할 수 있다.

**React Native 애플리케이션 실행하기**

1. **Metro 시작하기**

Metro는 React Native를 위한 JavaScript 빌드 도구다. Metro 개발 서버를 시작하려면 프로젝트 폴더에서 다음 명령어를 실행한다:

```bash
npm start
```

> 웹 개발에 익숙하다면 Metro가 Vite나 webpack 같은 번들러와 유사하다는 것을 알 수 있다. 하지만 Metro는 처음부터 끝까지 React Native를 위해 설계되었다. 예를 들어 Metro는 Babel을 사용하여 JSX 같은 문법을 실행 가능한 JavaScript로 변환한다.

1. **애플리케이션 시작하기**

```bash
npm run android
```

모든 설정이 제대로 되었다면, 곧 Android 에뮬레이터에서 새 앱이 실행되는 것을 볼 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-setting-up-the-development-environment/5.png)

이는 앱을 실행하는 한 가지 방법이며, Android Studio 내에서 직접 실행할 수도 있다.

> 만약 이 과정이 잘 되지 않는다면 [문제 해결 페이지](https://reactnative.dev/docs/troubleshooting)를 참조한다.

**앱 수정하기**

이제 앱을 성공적으로 실행했으니 수정해 보자.

- 선택한 텍스트 에디터에서 `App.tsx` 파일을 열고 몇 줄을 편집한다.
- `R` 키를 두 번 누르거나 개발자 메뉴( `Cmd ⌘ + M` )에서 `Reload`를 선택하여 변경 사항을 확인한다!

**끝!**

축하한다! 여러분은 첫 번째 React Native 앱을 성공적으로 실행하고 수정했다.

@tab React Native CLI - iOS#react-native-cli-ios

React Native 프로젝트에서 네이티브 코드를 빌드해야 하는 경우, 예를 들어 기존 앱에 React Native를 통합하거나 Expo에서 `prebuild` 를 실행하여 프로젝트의 네이티브 코드를 생성한 경우에는 다음 지침을 따른다.

React Native 프로젝트 개발을 위해서는 `Node` , `Watchman` , `React Native CLI` , `Xcode` , `CocoaPods` 등의 의존성을 설치해야 한다. 이 중 Xcode는 iOS용 React Native 앱을 빌드하는데 필수적이다.

**Node와 Watchman 설치**

Homebrew를 사용하여 Node와 Watchman을 설치하는 것이 좋다. Homebrew 설치 후 터미널에서 다음 명령을 실행한다:

```bash
brew install node
brew install watchman
```

이미 시스템에 Node를 설치한 경우 _Node 18_ 이상인지 확인하다.

Watchman은 파일 시스템의 변경 사항을 감시하는 Facebook의 도구로, 성능 향상을 위해 설치하는 것이 좋다.

**Xcode 설치**

최신 버전의 Xcode를 사용한다. 가장 쉬운 설치 방법은 [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)를 통하는 것이다. Xcode를 설치하면 iOS 시뮬레이터와 iOS 앱 빌드에 필요한 모든 도구가 함께 설치된다.

추가로 **Xcode Command Line Tools**도 설치해야 한다. Xcode 설정(Settings 또는 Preferences)에서 Locations 패널로 이동하여 Command Line Tools 드롭다운에서 가장 최신 버전을 선택하면 된다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-setting-up-the-development-environment/3.png)

**iOS 시뮬레이터 설치**

시뮬레이터를 설치하려면 `Xcode > Settings(또는 Preferences)` 로 이동하여 `Platforms` (또는 `Components`) 탭을 선택한다. 사용하려는 iOS 버전에 해당하는 시뮬레이터를 선택한다.

Xcode 14.0 이상에서는 `Xcode > Settings > Platforms` 탭에서 `+` 아이콘을 클릭하고 iOS 옵션을 선택하여 시뮬레이터를 설치할 수 있다.

**CocoaPods 설치**

[CocoaPods](https://cocoapods.org/)는 iOS에서 사용 가능한 의존성 관리 시스템 중 하나로, Ruby 기반이다. 최신 macOS와 함께 제공되는 Ruby 버전을 사용하여 설치할 수 있다. 자세한 내용은 [CocoaPods 시작 가이드](https://guides.cocoapods.org/using/getting-started.html)를 참조한다.

**React Native CLI**

React Native에는 내장 CLI가 있다. CLI의 특정 버전을 전역으로 설치하고 관리하는 대신, Node.js와 함께 제공되는 npx를 사용하여 런타임에 현재 버전에 액세스하는 것이 좋다.
다음의 명령을 사용하면 CLI의 현재 안정 버전이 다운로드되어 실행된다.

```tsx
npx react-native <command>
```

**새 앱 생성하기**

이전에 전역 `react-native-cli` 패키지를 설치했다면 예기치 않은 문제를 일으킬 수 있으므로 제거한다:

```bash
npm uninstall -g react-native-cli @react-native-community/cli
```

React Native의 내장 CLI를 사용하여 새 프로젝트를 생성할 수 있다. 다음의 명령을 사용하여 "AwesomeProject"라는 새로운 React Native 프로젝트를 만들 수 있다.

```bash
npx react-native@latest init AwesomeProject
```

이는 React Native를 기존 앱에 통합하거나, 프로젝트에 Expo를 설치했거나, 기존 React Native 프로젝트에 iOS 지원을 추가하는 경우에는 필요하지 않다. Ignite CLI와 같은 서드파티 CLI를 사용하여 React Native 앱을 초기화할 수도 있다.

만약 iOS에서 문제가 있다면 다음 단계를 통해 의존성을 다시 설치한다:

1. `cd ios` 명령으로 `ios` 폴더로 이동
2. `bundle install` 로 번들러 설치
3. `bundle exec pod install` 로 CocoaPods가 관리하는 iOS 의존성 설치

**[선택사항] 특정 버전이나 템플릿 사용하기**

`--version` 인자를 사용하여 특정 React Native 버전으로 새 프로젝트를 시작할 수 있다:

```bash
npx react-native@X.XX.X init AwesomeProject --version X.XX.X
```

`--template` 인자를 사용하여 커스텀 React Native 템플릿으로 프로젝트를 시작할 수도 있다.

> 위 명령이 실패하는 경우 PC에 오래된 버전의 `react-native` 나 `react-native-cli` 가 전역으로 설치되어 있을 수 있다. cli를 제거하고 npx를 사용해 다시 실행해 보자.

**[선택사항] 환경 구성**

React Native 0.69부터는 템플릿에서 제공하는 `.xcode.env` 파일을 사용하여 Xcode 환경을 구성할 수 있다.

`.xcode.env` 파일에는 `NODE_BINARY` 변수에 node 실행 파일의 경로를 내보내는 환경 변수가 포함되어 있다. 이는 빌드 인프라를 시스템 버전의 node에서 분리하는 데 권장되는 방법이다. 기본값과 다른 경우 사용자 고유의 경로나 node 버전 관리자로 이 변수를 사용자 정의해야 한다.

이 외에도 다른 환경 변수를 추가하고 빌드 스크립트 단계에서 `.xcode.env` 파일을 소스로 사용할 수 있다. 특정 환경이 필요한 스크립트를 실행해야 하는 경우 이 방법을 사용하는 것이 좋다. 빌드 단계를 특정 환경에서 분리할 수 있기 때문이다.

[NVM](https://nvm.sh/)(Node.js 버전 설치 및 전환을 도와주는 명령)과 [zsh](https://ohmyz.sh/)를 이미 사용 중이라면, Xcode가 Node 실행 파일을 찾을 수 있도록 `~/.zshrc` 에서 NVM을 초기화하는 코드를 `~/.zshenv` 파일로 이동하는 것이 좋다:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

또한 Xcode 프로젝트의 모든 "shell script build phase"에서 /bin/zsh를 셸로 사용하고 있는지 확인하는 것이 좋다.

**React Native 애플리케이션 실행하기**

1. **Metro 시작하기​**

**Metro**는 React Native를 위한 JavaScript 빌드 도구다. Metro 개발 서버를 시작하려면 프로젝트 폴더에서 다음 명령어를 실행한다:

```bash
npm start
```

> 웹 개발에 익숙하다면 Metro가 Vite나 webpack 같은 번들러와 유사하다는 것을 알 수 있다. 하지만 Metro는 처음부터 끝까지 React Native를 위해 설계되었다. 예를 들어 Metro는 Babel을 사용하여 JSX 같은 문법을 실행 가능한 JavaScript로 변환한다.

2. **애플리케이션 시작하기​**

Metro Bundler를 별도의 터미널에서 실행한 상태로 두고, React Native 프로젝트 폴더 내에서 새 터미널을 열고 다음 명령어를 실행한다:

```bash
npm run ios
```

곧 iOS 시뮬레이터에서 새 앱이 실행되는 것을 볼 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-setting-up-the-development-environment/4.png)

이는 앱을 실행하는 한 가지 방법이며, Xcode 내에서 직접 실행할 수도 있다.

> 만약 이 과정이 잘 되지 않는다면 [문제 해결 페이지](https://reactnative.dev/docs/troubleshooting)를 참조한다.

**실제 기기에서 실행하기​**

위 명령어는 기본적으로 iOS 시뮬레이터에서 앱을 자동으로 실행한다. 실제 물리적인 iOS 기기에서 앱을 실행하고 싶다면 [여기](https://reactnative.dev/docs/running-on-device)의 지침을 따른다.

**앱 수정하기​**

이제 앱을 성공적으로 실행했으니 수정해 보자.

- 선택한 텍스트 에디터에서 `App.tsx` 파일을 열고 몇 줄을 편집한다.
- iOS 시뮬레이터에서 Cmd ⌘ + R 키를 눌러 앱을 리로드하고 변경 사항을 확인한다.

**끝!​**

축하한다! 여러분은 첫 번째 React Native 앱을 성공적으로 실행하고 수정했다.

:::
