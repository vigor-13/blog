---
title: 환경 설정하기
description:
date: 2024-06-06
tags: []
references:
  [
    {
      key: 'React Native 공식 문서',
      value: 'https://reactnative.dev/docs/set-up-your-environment',
    },
  ]
---

여기서는 Android Studio와 Xcode로 프로젝트를 실행할 수 있도록 환경을 설정하는 방법을 알아본다.

이를 통해 Android 에뮬레이터와 iOS 시뮬레이터로 개발하고, 앱을 로컬에서 빌드하는 등의 작업을 할 수 있다.

:::note
이 가이드에는 Android Studio 또는 Xcode가 필요하다.

이미 설치되어 있다면, 빠르게 실행 환경을 갖출 수 있다. 설치되어 있지 않다면 설치 및 설정에 약 1시간 정도 소요될 것으로 예상된다.
:::

:::note 환경 설정은 필수인가?
[프레임워크](https://reactnative.dev/architecture/glossary#react-native-framework)를 사용하는 경우에는 환경 설정은 필수가 아니다.

React Native 프레임워크를 사용하면 프레임워크가 네이티브 앱 빌드를 처리하므로 Android Studio나 XCode를 따로 설정할 필요가 없다.

하지만 프레임워크 사용이 어려운 제약 조건이 있거나, 자체 프레임워크를 직접 작성하고 싶다면 로컬 환경 설정이 필요하다.
:::

## Android

### 종속성 설치하기

- Node, Watchman, React Native CLI, JDK, Android Studio가 필요하다.
- 앱 개발할 때는 원하는 에디터를 사용할 수 있지만, Android용 React Native 앱을 빌드하기 위해선 Android Studio를 설치해야 한다.

#### Node & Watchman

Homebrew 설치 후 터미널에서 다음 명령을 실행한다:

```bash
brew install node
brew install watchman
```

- 이미 시스템에 Node를 설치한 경우에는 <u>Node 18</u> 이상인지 확인한다.
- [Watchman](https://facebook.github.io/watchman)은 Facebook에서 만든 파일시스템의 변경 사항을 감시하는 도구다. 더 나은 성능을 위해 설치하는 것이 좋다.

#### JDK

- Homebrew를 사용하여 Azul <u>Zulu</u> OpenJDK 배포판을 설치한다.
- Homebrew 설치 후 터미널에서 다음 명령을 실행한다:

```bash
brew install --cask zulu@17

# cask가 설치된 경로를 얻어 설치 프로그램을 더블클릭한다.
brew info --cask zulu@17
```

- JDK 설치 후, `~/.zshrc` (또는 `~/.bash_profile`)에 `JAVA_HOME` 환경 변수를 추가하거나 업데이트한다.
- 위의 단계를 사용했다면 JDK는 `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`에 위치할 것이다

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

- Zulu OpenJDK 배포판은 Intel과 M1 Mac 모두에 대한 JDK를 제공한다.
- 이를 통해 Intel 기반 JDK를 사용하는 것에 비해 M1 Mac에서의 빌드 속도가 더 빨라질 것이다.
- 이미 시스템에 JDK를 설치했다면 <u>JDK 17</u>을 권장한다. 더 높은 버전의 JDK를 사용하면 문제가 발생할 수 있다.

#### Android 개발 환경

안드로이드 개발이 처음이라면 개발 환경을 설정하는 것이 다소 지루할 수 있다.

이미 안드로이드 개발에 익숙하다면 몇 가지 설정해야 할 사항이 있을 수 있다.

어떤 경우든 다음 몇 단계를 주의 깊게 살펴본다.

##### 1. Android Studio 설치

- [Android Studio](https://developer.android.com/studio/index.html)를 다운로드하고 설치한다.
- Android Studio 설치 마법사에서 다음 항목 옆의 체크박스가 모두 선택되어 있는지 확인한다:
  - `Android SDK`
  - `Android SDK Platform`
  - `Android Virtual Device`
- 그런 다음 "Next"를 클릭하여 이러한 모든 구성 요소를 설치한다.

:::warning
체크박스들이 회색으로 표시되어 있는 경우, 해당 구성 요소들이 지금 바로 설치될 수 없는 상태라는 뜻이다.

이는 대개 두 가지 경우에 발생한다:

- 해당 구성 요소들이 이미 시스템에 설치되어 있는 경우
- 해당 구성 요소들을 설치하기 위한 선행 조건(예: 특정 디렉토리에 대한 쓰기 권한 등)이 충족되지 않은 경우

하지만 설치 마법사에서 이 구성 요소들을 선택할 수 없다고 해서 문제가 되는 것은 아니다. Android Studio 설치가 완료된 후, Android Studio 내부의 SDK Manager를 통해 언제든지 이 구성 요소들을 추가로 설치할 수 있다.

따라서 설치 과정에서 해당 체크박스들이 회색으로 표시되어 선택할 수 없더라도, 일단 설치를 진행하고 나중에 필요한 구성 요소를 추가로 설치하면 된다.
:::

- 설치가 완료되고 시작 화면이 나타나면 다음 단계로 진행한다.

##### 2. Android SDK 설치

- Android Studio는 기본적으로 최신 Android SDK를 설치한다.
- 그러나 네이티브 코드를 사용하는 React Native 앱을 빌드하려면 특히 `Android 14 (UpsideDownCake)` SDK가 필요하다.
- 추가 Android SDK는 Android Studio의 SDK Manager를 통해 설치할 수 있다.
- 이를 위해 Android Studio를 열고 <u>More Actions</u> 버튼을 클릭한 다음 <u>SDK Manager</u>를 선택한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-set-up-your-environment/3.png =80%x)

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-set-up-your-environment/4.png =80%x)

:::tip
SDK Manager는 Android Studio <u>Settings</u> 대화상자에서 <u>Languages & Frameworks → Android SDK</u> 아래에서도 찾을 수 있다.
:::

- SDK Manager 내에서 <u>SDK Platforms</u> 탭을 선택한다.
  - <u>Show Package Details</u> 옆의 체크박스를 선택한다.
  - `Android 14 (UpsideDownCake)` 항목을 찾아 확장한 다음, 다음 항목이 선택되어 있는지 확인한다:
    - `Android SDK Platform 34`
    - `Intel x86 Atom_64 System Image` 또는 `Google APIs Intel x86 Atom System Image` 또는 (Apple M1 Silicon의 경우) `Google APIs ARM 64 v8a System Image`

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-set-up-your-environment/5.png =90%x)

- 다음으로 <u>SDK Tools</u> 탭을 선택한다.
  - <u>Show Package Details</u> 옆의 체크박스를 선택한다.
  - <u>Android SDK Build-Tools</u> 항목을 찾아 확장한 다음 `34.0.0` 이 선택되어 있는지 확인한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-set-up-your-environment/6.png =90%x)

- 마지막으로 <u>Apply</u>를 클릭하여 Android SDK와 관련 빌드 도구를 다운로드하고 설치한다.

##### 3. ANDROID_HOME 환경 변수 설정

- 네이티브 코드로 앱을 빌드하기 위해 몇 가지 환경 변수를 설정해야 한다.
- `~/.zprofile` 또는 `~/.zshrc` (`bash`를 사용하는 경우 `~/.bash_profile` 또는 `~/.bashrc`) 구성 파일에 다음 줄을 추가한다:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

- `source ~/.zprofile` (또는 `bash`의 경우 `source ~/.bash_profile`)을 실행하여 현재 셸에 구성을 로드한다.
- `echo $ANDROID_HOME` 을 실행하여 `ANDROID_HOME` 이 설정되었는지 확인하고, `echo $PATH` 를 실행하여 적절한 디렉토리가 경로에 추가되었는지 확인한다.

:::warning 올바른 Android SDK 경로를 사용해야 한다
Android Studio <u>Settings</u> 대화상자의 <u>Languages & Frameworks → Android SDK</u> 아래에서 SDK의 실제 위치를 찾을 수 있다.
:::

#### Android 디바이스 준비하기

- React Native 안드로이드 앱을 실행하려면 안드로이드 디바이스가 필요하다.
- 이는 물리적 안드로이드 디바이스일 수도 있고, 안드로이드 가상 디바이스(AVD)를 사용할 수도 있다.
- 어느 쪽이든 개발을 위해 안드로이드 앱을 실행할 수 있도록 디바이스를 준비해야 한다.

##### 물리적 디바이스 사용하기

- 물리적 안드로이드 디바이스가 있는 경우, USB 케이블을 사용하여 컴퓨터에 연결하고 [여기](https://reactnative.dev/docs/running-on-device)의 지침을 따라 개발에 사용할 수 있다.

##### 가상 디바이스 사용하기

- Android Studio를 사용하여 프로젝트를 열면 Android Studio 내에서 <u>AVD Manager</u>를 열어 사용 가능한 안드로이드 가상 디바이스(AVD) 목록을 볼 수 있다.
- 다음과 같은 아이콘을 찾아보자:

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-set-up-your-environment/7.png =90%x)

- 최근에 Android Studio를 설치했다면 새 AVD를 만들어야 할 가능성이 높다.
- <u>Create Virtual Device...</u>를 선택한 다음, 목록에서 아무 휴대폰이나 선택하고 "Next"를 클릭한 다음, UpsideDownCake API 레벨 34 이미지를 선택한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-set-up-your-environment/8.png =90%x)

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-set-up-your-environment/9.png =90%x)

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-set-up-your-environment/10.png =90%x)

- <u>Next</u>를 클릭한 다음 <u>Finish</u>를 클릭하여 AVD를 만든다.
- 이 시점에서 AVD 옆의 녹색 삼각형 버튼을 클릭하여 AVD를 실행할 수 있다.

## iOS

### 종속성 설치하기

- Node, Watchman, React Native CLI, Xcode, CocoaPods이 필요하다.
- 앱 개발할 때는 원하는 에디터를 사용할 수 있지만, iOS용 React Native 앱을 빌드하기 위해선 Xcode를 설치해야 한다.

#### Node & Watchman

- Homebrew 설치 후 터미널에서 다음 명령을 실행한다:

```bash
brew install node
brew install watchman
```

- 이미 시스템에 Node를 설치한 경우에는 <u>Node 18</u> 이상인지 확인한다.
- [Watchman](https://facebook.github.io/watchman)은 Facebook에서 만든 파일시스템의 변경 사항을 감시하는 도구다. 더 나은 성능을 위해 설치하는 것이 좋다.

#### Xcode

- <u>최신 버전</u>의 Xcode를 사용하는 것이 좋다.
- <u>Mac App Store</u>에서 설치할 수 있다.
- Xcode를 설치하면 iOS 시뮬레이터와 iOS 앱을 빌드하는 데 필요한 모든 도구도 함께 설치된다.

##### 명령줄 도구

- Xcode 명령줄 도구도 설치해야 한다.
- Xcode를 열고 Xcode 메뉴에서 <u>Settings... (또는 Preferences...)</u> 를 선택한다.
- <u>Locations</u> 패널로 이동하여 <u>Command Line Tools</u> 드롭다운에서 가장 최신 버전을 선택하여 도구를 설치한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-set-up-your-environment/1.png =70%x)

##### Xcode에서 iOS 시뮬레이터 설치하기

- <u>Xcode > Settings... (또는 Preferences...)</u>를 열고 <u>Platforms (또는 Components)</u> 탭을 선택한다.
- 사용하려는 iOS 버전에 해당하는 시뮬레이터를 선택한다.
- Xcode 버전 14.0 이상을 사용하여 시뮬레이터를 설치하는 경우 <u>Xcode > Settings > Platforms</u> 탭을 열고 `+` 아이콘을 클릭한 다음 <u>iOS...</u> 옵션을 선택한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/react-native-doc-guides-set-up-your-environment/2.png =70%x)

##### CocoaPods

- [CocoaPods](https://cocoapods.org/)는 iOS에서 사용할 수 있는 종속성 관리 시스템 중 하나다.
- CocoaPods는 Ruby [gem](https://en.wikipedia.org/wiki/RubyGems)이다.
- 최신 버전의 macOS에 포함된 Ruby 버전을 사용하여 CocoaPods를 설치할 수 있다.

:::note
더 자세한 내용은 [CocoaPods 시작 가이드](https://guides.cocoapods.org/using/getting-started.html)를 참조한다.
:::

### [선택사항] 환경 구성하기

- React Native <u>0.69</u> 버전부터는 `.xcode.env` 파일을 사용해서 Xcode 환경 설정을 할 수 있다.
- 시스템 Node가 아닌 지정된 버전의 Node를 사용할 수 있다.
  - `.xcode.env` 파일 안에는 `NODE_BINARY` 변수가 있는데, 여기에 로컬에 설치된 `node` 의 위치를 입력한다.
  - 만약 다른 버전의 `node` 를 사용하고 싶다면 이 변수 값을 알맞게 바꿔주면 된다.
- 다른 환경 변수들도 관리할 수 있다.
  - `.xcode.env` 파일에는 빌드에 필요한 다른 환경 변수들도 추가할 수 있다.
  - 빌드 과정에서 특별한 환경 설정이 필요한 스크립트를 실행해야 한다면, 이 파일에 필요한 환경 변수를 정의하여 소스로 사용할 수 있다.

:::note NVM을 사용하는 경우

- NVM(Node Version Manager)은 Node.js의 다양한 버전을 쉽게 설치하고 관리할 수 있도록 도와주는 커맨드라인 도구다. 이를 통해 프로젝트마다 다른 Node.js 버전을 사용할 수 있다.
- zsh는 bash와 유사한 Unix 쉘로, 사용자와 시스템 간의 상호작용을 처리한다. macOS에서는 기본 쉘로 zsh를 사용한다.
- 일반적으로 NVM 초기화 코드는 `~/.zshrc` 파일에 위치한다. 이 파일은 zsh가 대화형 쉘로 시작될 때 읽는 구성 파일이다.
- 하지만 Xcode는 `~/.zshrc` 파일을 읽지 않기 때문에, Xcode 내에서 실행되는 빌드 단계에서는 NVM으로 설치한 Node.js를 사용할 수 없다.
- 이 문제를 해결하기 위해, NVM 초기화 코드를 `~/.zshenv` 파일로 이동한다.
- `~/.zshenv` 는 zsh가 시작될 때마다, 대화형 쉘이든 아니든 간에 항상 읽어들이는 파일이다. 따라서 Xcode를 포함한 모든 프로세스에서 NVM을 사용할 수 있게 된다.

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 이 코드가 nvm을 로드한다.
```

- 위 코드는 NVM 디렉토리를 환경 변수로 설정하고, `nvm.sh` 스크립트를 실행하여 NVM을 초기화한다.
- 마지막으로, Xcode 프로젝트의 빌드 단계 중 "shell script build phase"에서 사용되는 쉘이 `/bin/zsh` 인지 확인한다.
- 이는 빌드 과정에서 실행되는 쉘 스크립트들이 zsh 환경에서 동작하도록 보장하기 위함이다.

:::
