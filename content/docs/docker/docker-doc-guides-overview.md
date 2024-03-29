---
title: Docker 개요
description:
date: 2024-03-22
tags: []
references:
  [
    {
      key: 'Docker 공식 문서',
      value: 'https://docs.docker.com/get-started/overview/',
    },
  ]
---

Docker는 애플리케이션을 개발, 배포 및 실행하기 위한 오픈 플랫폼이다. Docker를 사용하면 **애플리케이션을 인프라와 분리**할 수 있어 소프트웨어를 빠르게 제공할 수 있다. Docker를 사용하면 애플리케이션을 관리하는 방식으로 인프라를 관리할 수 있다. Docker의 코드 배포, 테스트 및 배포 방법론을 활용하면 코드 작성과 프로덕션 환경에서 실행 사이의 지연을 크게 줄일 수 있다.

## Docker 플랫폼 {#the-docker-platform}

Docker는 애플리케이션을 **컨테이너**라고 하는 분리된 환경에서 패키징하고 실행할 수 있는 기능을 제공한다. 이러한 분리와 보안 기능으로 인해 주어진 호스트에서 많은 컨테이너를 동시에 실행할 수 있다. 컨테이너는 가볍고 애플리케이션 실행에 필요한 모든 것을 포함하고 있어, 호스트에 설치된 것에 의존할 필요가 없다. 작업하는 동안 컨테이너를 공유할 수 있으며, 공유하는 모든 사람이 동일한 방식으로 작동하는 동일한 컨테이너를 사용하도록 할 수 있다.

Docker는 컨테이너의 라이프사이클을 관리하기 위한 도구와 플랫폼을 제공한다:

- 컨테이너를 사용하여 애플리케이션과 지원 컴포넌트를 개발한다.
- 컨테이너가 애플리케이션을 배포하고 테스트하는 단위가 된다.
- 준비가 되면 컨테이너 또는 오케스트레이션 서비스로 프로덕션 환경에 애플리케이션을 배포한다. 프로덕션 환경이 로컬 데이터 센터, 클라우드 공급업체 또는 하이브리드 방식이든 상관없이 동일한 방식으로 작동한다.

## Docker를 어떤 용도로 사용할 수 있을까? {#what-can-i-use-docker-for}

### 빠르고 일관된 애플리케이션 제공 {#fast-consistent-delivery-of-your-applications}

Docker는 개발자가 로컬 컨테이너를 사용하여 **표준화된 환경**에서 작업할 수 있게 함으로써 개발 라이프사이클을 간소화한다. 컨테이너는 CI/CD 워크플로에 적합하다.

다음과 같은 시나리오를 상정할 수 있다:

- 개발자가 로컬에서 코드를 작성하고 Docker 컨테이너를 사용하여 동료들과 작업을 공유한다.
- 개발자는 Docker를 사용하여 애플리케이션을 테스트 환경에 푸시하고 자동 및 수동 테스트를 실행한다.
- 개발자가 버그를 발견하면 개발 환경에서 수정한 후 테스트 및 검증을 위해 테스트 환경에 재배포할 수 있다.
- 테스트가 완료되면 업데이트된 이미지를 프로덕션 환경에 푸시하는 것만으로 수정 사항을 배포할 수 있다.

### 반응형 배포 및 스케일링 {#responsive-deployment-and-scaling}

Docker의 컨테이너 기반 플랫폼을 통해 고도로 이식 가능한 워크로드를 구현할 수 있다. Docker 컨테이너는 개발자의 로컬 랩톱, 데이터 센터의 물리/가상 머신, 클라우드 제공업체 또는 이러한 환경이 혼합된 곳에서 실행될 수 있다.

Docker의 이식성과 가벼운 특성으로 인해 비즈니스 요구 사항에 따라 애플리케이션과 서비스를 거의 실시간으로 동적으로 관리하고 스케일링하거나 중지할 수 있다.

### 동일한 하드웨어에서 더 많은 워크로드 실행 {#running-more-workloads-on-the-same-hardware}

Docker는 가볍고 빠르다. 하이퍼바이저(hypervisor) 기반 가상 머신에 대한 비용 효율적인 대안을 제공하므로 비즈니스 목표를 달성하기 위해 서버 용량을 더 많이 사용할 수 있다. Docker는 고밀도 환경과 적은 리소스로 더 많은 작업을 수행해야 하는 소규모 및 중간규모 배포에 적합하다.

## Docker 아키텍처 {#docker-architecture}

Docker는 **클라이언트-서버** 아키텍처를 사용한다. Docker 클라이언트는 Docker 데몬과 대화하며, 이 데몬이 Docker 컨테이너의 빌드, 실행 및 배포와 같은 작업을 수행한다. Docker 클라이언트와 데몬은 동일 시스템에서 실행되거나 Docker 클라이언트를 원격 Docker 데몬에 연결할 수 있다. Docker 클라이언트와 데몬은 UNIX 소켓 또는 네트워크 인터페이스를 통해 REST API를 사용하여 통신한다. 또 다른 Docker 클라이언트인 Docker Compose를 사용하면 여러 컨테이너로 구성된 애플리케이션을 작업할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/docker-doc-guides-overview/1.png)

### Docker 데몬

Docker 데몬(`dockerd`)은 Docker API 요청을 수신하고 이미지, 컨테이너, 네트워크, 볼륨 등의 Docker 객체를 관리한다. 데몬은 또한 다른 데몬과 통신하여 Docker 서비스를 관리할 수 있다.

### Docker 클라이언트

Docker 클라이언트(`docker`)는 많은 Docker 사용자가 Docker와 상호작용하는 기본 방법이다. `docker run` 과 같은 명령을 사용하면 클라이언트가 이 명령을 `dockerd` 에 보내고 `dockerd` 가 실행한다. `docker` 명령은 Docker API를 사용한다. Docker 클라이언트는 여러 데몬과 통신할 수 있다.

### Docker 데스크탑

Docker 데스크탑은 Mac, Windows 또는 Linux 환경에서 컨테이너화된 애플리케이션과 마이크로서비스를 빌드하고 공유할 수 있는 애플리케이션이다. Docker 데스크탑에는 Docker 데몬(`dockerd`), Docker 클라이언트(`docker`), Docker Compose, Docker Content Trust, Kubernetes 및 Credential Helper가 포함되어 있다. 자세한 내용은 [Docker Desktop](https://docs.docker.com/desktop/)을 참조한다.

### Docker 레지스트리

Docker 레지스트리는 Docker 이미지를 저장한다. Docker Hub는 누구나 사용할 수 있는 공개 레지스트리이며, Docker는 기본적으로 Docker Hub에서 이미지를 찾는다. 심지어 자체 개인 레지스트리를 실행할 수도 있다.

`docker pull` 또는 `docker run` 명령을 사용하면 Docker는 설정된 레지스트리에서 필요한 이미지를 가져온다. `docker push` 명령을 사용하면 Docker가 이미지를 설정된 레지스트리에 푸시한다.

### Docker 객체

Docker를 사용하면 이미지, 컨테이너, 네트워크, 볼륨, 플러그인 및 기타 객체를 생성하고 사용한다. 이 섹션은 이러한 객체 중 일부에 대한 간단한 개요를 제공한다.

#### 이미지

**이미지는 Docker 컨테이너를 생성하기 위한 명령이 포함된 읽기 전용 템플릿이다.** 종종 이미지는 다른 이미지를 기반으로 하며 추가적인 커스터마이징이 적용된다. 예를 들어 `ubuntu` 이미지를 기반으로 Apache 웹 서버와 애플리케이션, 그리고 애플리케이션 실행에 필요한 구성 세부 사항을 설치하는 이미지를 빌드할 수 있다.

직접 이미지를 생성하거나 레지스트리에 게시된 다른 사람이 만든 이미지를 사용할 수도 있다. 직접 이미지를 빌드하려면 간단한 구문으로 이미지 생성 및 실행에 필요한 단계를 정의하는 Dockerfile을 작성한다. Dockerfile의 각 명령어는 이미지의 레이어를 생성한다. Dockerfile을 변경하고 이미지를 재빌드하면 변경된 레이어만 재빌드된다. 이것이 이미지가 다른 가상화 기술에 비해 가볍고 작고 빠른 이유 중 하나다.

#### 컨테이너

**컨테이너는 이미지의 실행 가능한 인스턴스다.** Docker API 또는 CLI를 사용하여 컨테이너를 생성, 시작, 중지, 이동 또는 삭제할 수 있다. 컨테이너를 하나 이상의 네트워크에 연결하거나 스토리지를 연결하거나 현재 상태를 기반으로 새 이미지를 만들 수도 있다.

기본적으로 컨테이너는 다른 컨테이너와 호스트 머신으로부터 비교적 잘 격리된다. 컨테이너의 네트워크, 스토리지 또는 기타 기반 하위 시스템이 다른 컨테이너나 호스트 머신으로부터 얼마나 격리되는지를 제어할 수 있다.

컨테이너는 이미지 및 생성 또는 시작 시 제공하는 모든 구성 옵션으로 정의된다. 컨테이너가 제거되면 지속적인 스토리지에 저장되지 않은 상태 변경 사항은 사라진다.

##### docker run 명령 예시 {#example-docker-run-command}

다음 명령은 ubuntu 컨테이너를 실행하고 로컬 명령줄 세션에 대화형으로 연결한 후 `/bin/bash` 를 실행한다.

```bash
docker run -i -t ubuntu /bin/bash
```

이 명령을 실행하면 (기본 레지스트리 설정을 사용한다고 가정할 때) 다음과 같은 일이 발생한다:

1. 로컬에 `ubuntu` 이미지가 없다면, Docker는 마치 수동으로 `docker pull ubuntu` 를 실행한 것처럼 설정된 레지스트리에서 이미지를 가져온다.
2. Docker는 마치 수동으로 `docker container create` 명령을 실행한 것처럼 새 컨테이너를 생성한다.
3. Docker는 컨테이너의 최종 레이어로 read-write 파일시스템을 할당한다. 이를 통해 실행 중인 컨테이너가 로컬 파일시스템에서 파일 및 디렉터리를 생성하거나 수정할 수 있다.
4. 네트워킹 옵션을 지정하지 않았으므로 Docker는 컨테이너를 기본 네트워크에 연결하기 위한 네트워크 인터페이스를 생성한다. 여기에는 컨테이너에 IP 주소 할당이 포함된다. 기본적으로 컨테이너는 호스트 머신의 네트워크 연결을 사용하여 외부 네트워크에 연결할 수 있다.
5. Docker는 컨테이너를 시작하고 `/bin/bash` 를 실행한다. 컨테이너가 대화식으로 실행되고 터미널에 연결되어 있기 때문에 (`-i`, `-t` 플래그) 키보드로 입력을 제공할 수 있으며 Docker는 출력을 터미널에 기록한다.
6. `/bin/bash` 명령을 종료하기 위해 `exit` 를 실행하면 컨테이너가 중지되지만 제거되지는 않는다. 컨테이너를 다시 시작하거나 제거할 수 있다.

## 기반 기술 {#underlying-technology}

Docker는 [Go 프로그래밍 언어](https://golang.org/)로 작성되었으며 Linux 커널의 여러 기능을 활용하여 기능을 제공한다. Docker는 `네임스페이스(namespaces)` 라는 기술을 사용하여 컨테이너라고 불리는 격리된 작업 공간을 제공한다. 컨테이너를 실행하면 Docker는 해당 컨테이너에 대한 일련의 네임스페이스를 생성한다.

이러한 네임스페이스는 격리 계층을 제공한다. 컨테이너의 각 측면은 별도의 네임스페이스에서 실행되며 액세스가 해당 네임스페이스로 제한된다.

Docker가 네임스페이스 기술을 사용하는 방식은 다음과 같습니다:

1. **pid 네임스페이스**: 프로세스 격리를 제공하며, 컨테이너 내에서 프로세스는 자체 프로세스 트리를 갖는다.
2. **net 네임스페이스**: 네트워크 인터페이스를 격리하므로 각 컨테이너에는 고유한 네트워크 스택이 있다.
3. **ipc 네임스페이스**: 프로세스 간 통신을 격리한다.
4. **mnt 네임스페이스**: 파일 시스템 마운트 지점을 격리하므로 컨테이너는 호스트와 다른 마운트 지점을 가질 수 있다.
5. **uts 네임스페이스**: 커널과 버전 식별자를 격리한다.
6. **user 네임스페이스**: 사용자 및 그룹 ID를 격리하여 컨테이너 내에서 루트 권한을 안전하게 사용할 수 있다.

이러한 네임스페이스를 통해 Docker는 컨테이너 내부에서 완전히 프라이빗 환경을 제공하여 격리, 보안 및 리소스 관리를 개선한다.
