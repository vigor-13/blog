---
title: 여러 Git 계정 쉽게 관리하기
description:
date: 2024-07-14
tags: [git, ssh]
references:
  [
    {
      key: '[Medium] How to handle multiple git accounts',
      value: 'https://medium.com/expedia-group-tech/how-to-handle-multiple-git-accounts-385afe430d5a',
    },
  ]
---

개발자로서 직장, 개인 프로젝트, 또는 다양한 플랫폼(GitHub, GitLab 등)에서 여러 Git 계정을 사용해야 하는 경우가 많다.

이런 상황에서 계정을 쉽게 관리하는 방법을 알아본다.

## Git 계정 관리가 어려운 이유

Git은 대개 단독으로 사용되지 않고 Github 등의 호스팅 서비스와 함께 사용된다.

때문에 인증 과정에서도 두 가지 요소를 고려해야한다.

- **신원 정보 (내가 누구인지)**
  - 커밋에 붙는 이름과 이메일 같은 정보다.
  - Git에서 관리한다.
- **인증 (정말 나인지)**
  - Github과 같은 서비스에 접속할 때 확인하는 과정이다.
  - 로컬 컴퓨터와 Github과 같은 서비스에서 관리한다.

여기서 문제는 이 두 가지 요소를 따로 설정해야 한다는 점이다.

게다가 각각의 설정 방식이 달라서, 여러 계정을 사용하는 경우 계정마다 두 설정을 모두 신경써야한다.

즉, 여러 Git 계정을 사용하면 <u>내가 누구인지</u>와 <u>내가 정말 나인지</u>를 각각 여러 번 설정해야 해서 과정이 복잡해진다.

## 신원 정보 설정

커밋을 할 때 누가 한 것인지 확인할 수 있는 신원정보가 필요하다.

- `사용자 이름`
- `이메일 주소`
- `GPG 서명 키` (보안을 위해 사용하는 것이 좋다)

이 정보들은 `~/.gitconfig` 파일에서 관리된다.

```text
[merge]
    ff = false
[pull]
    ff = only
[core]
    editor = vim
[commit]
    gpgsign = true
[user]
    name = 홍길동
    email = hong@example.com
    signingkey = A0***9F
```

이 설정은 로컬 저장소에서 커밋할 때 사용되며, Git은 커밋할 때 사용자가 설정한 이름과 이메일을 그대로 사용한다.

:::note GPG가 필요한 이유
Git 자체는 이 정보가 진짜인지 확인하지 않는다. 때문에 커밋 위조가 가능하다. 이는 누구나 다른 사람의 이름과 이메일을 사용하여 커밋할 수 있다는 뜻이다.

GPG 서명 키는 이러한 문제를 해결하기 위한 도구다. 커밋할 때 개인 GPG 키로 서명을 하면, 그 커밋이 진짜 본인이 한 것임을 증명할 수 있다.

Github과 같은 서비스는 사용자의 공개 GPG 키를 등록할 수 있게 해준다. 커밋에 GPG 서명이 있다면 Github는 이를 확인하고 Verified 표시를 해준다.
:::

### 조건부로 여러 신원 정보 설정하기

하나의 계정만 사용한다면 `.gitconfig` 파일에 사용자를 등록하여 사용하면 된다.

문제는 여러 신원 정보를 사용하고 싶은 경우다.

`.gitconfig` 파일에서 `includeIf` 지시문을 사용하면 디렉토리에 따라 다른 설정을 적용할 수 있다.

```text
[merge]
  ff = false
[pull]
  ff = only
[core]
  editor = vim

[includeIf "gitdir:~/Development/personal/"]
    path = ~/.gitconfig.personal
[includeIf "gitdir:~/Development/work/"]
    path = ~/.gitconfig.work%
```

그리고 새롭게 신원 정보를 등록할 파일(`.gitconfig.personal` , `.gitconfig.work`)을 생성한다.

```text
[user]
    name = 홍길동
    email = hong@company.com
    signingkey = A0***9F
[commit]
    gpgsign = true
```

이렇게 하면 `~/Development/work` 디렉토리 아래에서 Git을 사용할 때 자동으로 회사 계정 정보가 적용된다.

이 방법으로 <u>신원 정보 관리 문제</u>는 해결할 수 있다. 하지만 여러 Git 호스트에 대한 인증 문제는 별도로 처리해야 한다.

## 호스팅 서비스 인증 설정

대부분의 회사나 팀에서는 Git을 단독으로 사용하지 않는다. 대신 GitHub, GitLab, BitBucket 같은 서비스를 이용한다.

이러한 호스팅 서비스에 접근하려면 권한을 증명해야 한다.

### HTTPS의 단점

호스팅 서비스와 연결하는 방법 중 하나는 <u>HTTPS</u>를 사용하는 것이다.

다만, 이 방법을 사용하면 코드를 pull, push, clone 할 때마다 매번 사용자 이름과 비밀번호를 입력해야 한다.

왜 그럴까? Git은 사용자의 로그인 정보를 기억하지 못하기 때문이다.

### SSH를 사용하자

매번 로그인하는 번거로움을 피하기 위해, <u>SSH</u>를 사용한다.

#### SSH란

SSH는 일종의 열쇠 시스템과 비슷하다

1. 키 만들기:
   - 로컬 컴퓨터에서 `비밀 키` 와 `공개 키` 를 만든다.
2. 공개 키 등록하기:
   - `공개 키` 를 호스팅 서비스에 등록한다.
   - 이는 마치 집 열쇠의 복사본을 친구에게 주는 것과 비슷하다(실제로는 열쇠를 주는게 아니라, 열쇠의 모양을 알려주는 것과 더 비슷하다).
3. 키 사용하기:
   - 호스팅 서비스에 연결할 때, 로컬 컴퓨터는 자동으로 `비밀 키` 를 사용해 암호화된 메시지를 만든다.
   - 호스팅 서비스는 등록된 `공개 키` 로 이를 확인(해독)한다.
   - 이 과정이 성공하면, 로그인 없이도 접속이 가능하다(즉, 메시지가 진짜 내가 보낸 메시지라는 것이 인증된다).
4. 키 저장 위치:
   - `비밀 키` 는 보통 로컬 컴퓨터의 `~/.ssh/id_rsa` 파일에 저장된다.
   - `공개 키` 는 같은 위치의 `id_rsa.pub` 파일에 저장된다.
5. 여러 개의 키:
   - 필요하다면 여러 쌍의 키를 만들 수 있다. 각각 다른 이름을 지정하면 된다.

#### SSH 키 생성하기

- `.ssh` 디렉토리로 이동하여 `ssh-keygen` 명령을 사용하면 키를 생성할 수 있다.
  ```bash
  cd ~/.ssh
  ssh-keygen
  ```
- 키의 이름을 입력한다. (입력하지 않으면 `id_ed25519` 와 같이 자동으로 생성된다)
  ```text
  Generating public/private ed25519 key pair.
  Enter file in which to save the key (/Users/kkw10/.ssh/id_ed25519):
  ```
- 비밀번호를 입력한다. (선택사항이다)
  ```text
  Enter passphrase (empty for no passphrase):
  ```
- 생성 완료
  ```text
  -rw-------  1 kkw10  staff   399 Jul 14 04:23 id_ed25519
  -rw-r--r--  1 kkw10  staff    93 Jul 14 04:23 id_ed25519.pub
  ```

#### SSH 공개 키 등록하기

:::tabs

@tab:active Github#github
프로필을 클릭하여 Settings 페이지로 이동한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/posts/managing-multiple-git-accounts-easily/1.png =30%x)

SSH and GPG keys 페이지로 이동한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/posts/managing-multiple-git-accounts-easily/2.png =30%x)

New SSH Key 버튼을 클릭한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/posts/managing-multiple-git-accounts-easily/3.png =90%x)

생성한 공개 키의 값을 복사하여 붙여넣는다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/posts/managing-multiple-git-accounts-easily/4.png =90%x)

@tab Gitlab#Gitlab

프로필을 클릭하여 Edit profile 페이지로 이동한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/posts/managing-multiple-git-accounts-easily/5.png =30%x)

SSH Keys 페이지로 이동한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/posts/managing-multiple-git-accounts-easily/6.png =30%x)

Add new key 버튼을 클릭한다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/posts/managing-multiple-git-accounts-easily/7.png =90%x)

생성한 공개 키의 값을 복사하여 붙여넣는다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/posts/managing-multiple-git-accounts-easily/8.png =90%x)

:::

#### SSH 키 선택하기

SSH는 기본적으로 `~/.ssh/config` 파일을 사용해 여러 설정을 관리하며, 이 파일을 통해 다양한 호스팅 서비스 계정에 대해 각각 다른 설정을 할 수 있다.

- 단일 계정을 사용하는 경우
  ```text
  Hostname github.com
  User rcbrown
  IdentityFile ~/.ssh/id_rsa
  ```
- 여러 계정을 사용하는 경우
  ```text
  Host work
    Hostname github.myemployer.com
    User rbrown
  Host personal
    Hostname github.com
    User rcbrown
  Host *
    IdentityFile ~/.ssh/id_rsa
  ```
- 주의할 점은 같은 SSH 키를 여러 계정에서 사용하면 안 된다. Github는 이를 허용하지 않는다. 각 계정마다 새로운 SSH키를 만들어야 한다.
  ```text
  Host work
    Hostname github.myemployer.com
    User rbrown
    IdentityFile ~/.ssh/id_rsa_work
  Host personal
    Hostname github.com
    User rcbrown
    IdentityFile ~/.ssh/id_rsa_personal
  Host *
    IdentityFile ~/.ssh/id_rsa
  ```
- 같은 서비스에 두 개의 계정이 있다면? 예를 들어, 오픈 소스 기여를 위한 계정과 개인용 계정이 따로 있다면?
  ```text
  Host work
    Hostname github.myemployer.com
    User rbrown
    IdentityFile ~/.ssh/id_rsa_work
  Host personal
    Hostname github.com
    User rcbrown
    IdentityFile ~/.ssh/id_rsa_personal
  Host oss
    Hostname github.com
    User open_rcbrown
    IdentityFile ~/.ssh/id_rsa_oss
  Host *
    IdentityFile ~/.ssh/id_rsa
  ```
  <u>이 경우 설정은 쉽지만, 실제로 어떤 계정을 사용할지 선택하는 것이 어려울 수 있다.</u>

##### 기존 접근 방식: 호스트 네임

일반적으로 GitHub에서 저장소를 복제(clone)할 때 사용하는 명령어는 다음과 같다:

```bash
git clone git@github.com:username/repository.git
```

하지만 여러 GitHub 계정을 사용할 때, 사람들이 제안하는 방법은 다음과 같다:

```bash
git clone git@personal:rcbrown/grpc-node-examples.git
```

여기서 핵심은 `github.com` 대신 `personal` 이라는 별칭을 사용하여 각 계정에 맞는 SSH 키를 자동으로 선택하게 하는 것이다.

예를 들어, `personal` 별칭을 사용하면 개인 계정용 SSH 키를, `work` 별칭을 사용하면 회사 계정용 SSH 키를 사용하게 할 수 있다.

하지만 이 해결책에는 심각한 단점이 있다.

1. **사용하기 불편한 문제**:
   - GitHub는 클론 URL을 클립보드에 복사하기 쉽게 제공하지만, 실제로 실행해야 하는 명령줄에서 호스트 이름을 수정해야 한다.
   - 매번 주소를 바꿔야 하는데, 이걸 자주 잊게된다.
   - 특히 다른 사람의 프로젝트를 포크하여 작업할 때 더 귀찮아진다.
2. **설정이 복잡한 문제**:
   - 새 계정을 만들 때마다 여러 곳의 설정을 바꿔야 한다.
   - Git 설정과 SSH 설정 둘 다 건드려야 해서 실수하기 쉽다.
3. **폴더 구조가 중요해지는 문제**:
   - 각 계정마다 다른 폴더를 써야 한다.
   - 프로젝트가 정확한 폴더에 있어야만 제대로 작동한다.
   - 이렇게 하면 프로젝트 관리가 더 어려워진다.
4. **관리가 어려운 문제**:
   - 설정이 여기저기 흩어져 있어서 전체를 파악하기 힘들어진다.
   - 나중에 문제가 생기면 원인 찾기가 어려워질 수 있다.

##### 새로운 접근 방식: sshCommand

기존의 방식보다 더 나은 방법이 필요하다.

- 계정 정보와 인증 방법을 한 곳에서 쉽게 관리할 수 있으면 좋다.
- Git 계정과 SSH 설정을 간단하게 연결할 수 있는 방법이 있으면 좋다.

즉 Git이 필요한 SSH 파일을 알아서 선택할 수 있도록 하면 되는 것이다.

Git은 `.gitconfig` 파일을 을 통해 다양한 옵션을 조절할 수 있다. 여기에 `includeIf` 메커니즘을 통해 직접 키를 선택하게 할 수 있다.

다음은 `.gitconfig.work` 파일의 예시다:

```text
[user]
    name = 김철수
    email = kimcs@회사.com
    signingkey = A0***9F
[commit]
    gpgsign = true
[core]
    sshCommand = "ssh -i ~/.ssh/id_rsa_work"
```

- `sshCommand` 명령어에 `i` 옵션을 추가해서 사용하면 Git에게 이 SSH 명령어를 써라고 말할 수 있다.
- 즉, Git이 폴더마다 다른 SSH 명령어를 사용하도록 설정할 수 있다.

따라서 `.gitconfig` 와 적절한 디렉토리를 사용하여 Git 신원과 SSH 인증을 모두 제어할 수 있다.

이 방법은 디렉토리에서 신원과 SSH 키를 모두 결정하는 통합된 구성을 제공한다.
