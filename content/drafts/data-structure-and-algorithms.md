---
title: 데이터 구조 & 알고리즘
description:
date: 2024-02-29
tags: []
---

## 시간 복잡도 / 공간 복잡도 {#1}

- **시간 복잡도**
  - 컴퓨터가 연산하는데 **최악의 경우** 얼마나 오래 걸리는가? (즉 몇 번 연산하는가?)
- **공간 복잡도**
  - N에 비례하여 메모리를 얼마나 사용하는 가?
  - 시간 복잡도와 트레이드 오프 관계다.
  - 보통 시간 복잡도가 더 중요하다.

### Big O 표기법 {#2}

복잡도를 표현하기 위해서 **Big O 표기법**을 사용한다.

![](https://yoeubi.github.io/static/7591ab45b8bcd1fd9b772984b0e906e3/6864c/big-o-chart.png)

- 가장 큰 항을 살리고 그 보다 작은 항은 제거한다.
- 계수, 상수는 전체 성능 축정에 큰 영향을 주지 않으므로 고려하지 않는다.
- **가장 크게 증가하는 항만 중요하다.**

## 자료 구조 {#3}

### 배열 & 연결 리스트 {#4}

#### 배열(Array) {#5}

![](https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230726162247/Array-data-structure.png)

- 데이터가 연속적으로 저장되어 **임의접근(Random Access)이 가능**하여 탐색이 빠르다.
- 데이터 삽입/삭제가 느리다.

| 빅오      | 설명 |
| --------- | ---- |
| 삽입/삭제 | O(N) |
| 탐색      | O(1) |

#### 연결 리스트(Linked List) {#6}

![](https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230726162542/Linked-List-Data-Structure.png)

- 다른 자료구조를 구현할 때 많이 사용된다.
- 데이터가 연속적으로 저장되지 않으므로 **임의접근이 불가능**하다. 따라서 탐색이 느리다.
- 데이터 삽입/삭제가 빠르다.

| 빅오      | 설명 |
| --------- | ---- |
| 삽입/삭제 | O(1) |
| 탐색      | O(N) |

#### 스택(Stack) {#7}

![](https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230726165552/Stack-Data-Structure.png)

- 보통 리스트로 구현한다.
- **FILO(Frist In Last Out) - 선입후출**
- 예: 브라우저 히스토리 스택

| 빅오      | 설명 |
| --------- | ---- |
| 삽입/삭제 | O(1) |

#### 큐(Queue) {#8}

![](https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230726165642/Queue-Data-structure1.png)

- 보통 리스트로 구현한다.
- **FIFO(First In First Out) - 선입선출**
- **LILO(Last In Last Out) - 후입후출**
- 예: 대기열

| 빅오      | 설명 |
| --------- | ---- |
| 삽입/삭제 | O(1) |

:::tip 리스트 vs 스택 vs 큐
| 자료구조 | 공통점 | 차이점 |
| -------- | ------------------------------ | ---------------------------------------------------------------------------- |
| 리스트 | 선형 자료구조이고 순서가 있다. | 읽기, 삽입과 삭제를 리스트의 어느 곳에서나 행한다. |
| 스택 | 선형 자료구조이고 순서가 있다. | 삽입과 삭제를 리스트의 한쪽(top) 에서 행한다. |
| 큐 | 선형 자료구조이고 순서가 있다. | 삽입은 리스트의 한쪽(rear)에서 하고, 삭제는 삽입의 반대쪽(front)에서 행한다. |
:::

#### 우선순위 큐(Priority Queue) - Heap {#9}

![](https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221220165711/MinHeapAndMaxHeap1.png)

| 빅오      | 설명    |
| --------- | ------- |
| 삽입/삭제 | O(logN) |

### 맵 & 집합 {#10}

#### 맵(Map or Dictionary) {#11}

![](https://miro.medium.com/v2/resize:fit:1086/1*b7bd4tJ7GiDYnvScHtCNTA.png)

- key, value로 구성된 데이터
- **트리**나 **해시**로 구현한다. (파이썬 - 해시, C++ - 레드 블랙 트리)
- 예: JSON

| 빅오      | 설명                               |
| --------- | ---------------------------------- |
| 삽입/삭제 | O(logN) - `C++` \| O(1) - `Python` |

#### 집합(Set) {#12}

| 빅오      | 설명                               |
| --------- | ---------------------------------- |
| 삽입/삭제 | O(logN) - `C++` \| O(1) - `Python` |

### 그래프(Graph) {#13}

![](https://media.geeksforgeeks.org/wp-content/uploads/20200630111809/graph18.jpg)

- 노드와 엣지로 이루어진다.
- 방향성과 순환성이 각각 있거나 없거나
  - **방향**에 따른 분류
    - 무방향 그래프(= 양방향 그래프)
    - 방향 그래프
  - **순환**에 따른 분류
    - 순환 그래프
    - 비순환 그래프
  - 둘 다 없으면 **트리**다.
- 예: 노선도, SNS 관계망, Git

#### 연결요소(Connected Component) {#14}

![](https://media.geeksforgeeks.org/wp-content/uploads/20200421194558/Count-of-Connected-Components.png)

#### 트리(Tree) {#15}

![](https://media.geeksforgeeks.org/wp-content/uploads/20230626160718/Tree-Data-Structure--nEW.png)

- 순환성이 없는 무방향 그래프다. (이론)
- 특정하지 않는한 어떤 노드든지 루트가 될 수 있다. (이론)
- 루트는 하나다. (자료 구조)
- 자식관계가 있는 방향 그래프다.
- 노드 A에서 노드 B로 가는 경로는 반드시 존재하며 유일하다.
- 트리 판별 공식: **노드 개수 = 간선 개수 + 1**

#### 그래프의 구현(행렬 vs 리스트) {#16}

- 인접 행렬(Adjacent Matrix) 또는 인접 리스트(Adjacent List)로 구현한다.

![](https://algorithmtutor.com/images/graph_representation_directed.png)

| 구현 방법    | 비교                                     |
| ------------ | ---------------------------------------- |
| 리스트(List) | 메모리 `↓` , 시간 `↑` (임의 접근 불가능) |
| 행렬(Array)  | 메모리 `↑` , 시간 `↓` (임의 접근 가능)   |

## 알고리즘 유형 {#17}

### 1. 완전 탐색(Exhaustive Search)

모든 경우의 수를 다 고려하는 탐색법이다.

- 장점: 반드시 답을 찾을 수 있다.
  - 답이 존재하지 않는 경우 = 답이 없다는 사실 확인
- 단점: 오래 걸린다.

#### 부르트포스(Brute Force)

- 무차별 대입법이다.
- **정렬**을 고려해야 한다.
- 순열(Permutation)
  - n개중 r개를 뽑아 순서대로 나열
  - 모든 경우의 수를 살펴볼 때 용이하다.
- 조합(Combination):
  - 순서 없이 n개중 r개를 뽑는 것

#### 깊이 우선 탐색 - DFS(Depth First Search)

- 스택 또는 재귀를 이용하여 구현한다.

#### 넓이 우선 탐색 - BFS(Breath First Search)

- 큐를 사용하여 구현한다.

:::tip DFS vs BFS

- 공통점: 반드시 답을 찾을 수 있다. 하지만 느리다.
- 차이점: BFS가 최단거리 구하기에 유리하다.

:::

#### 백트래킹(Back Tracking)

### 2. 탐욕법(Greedy Aalgorithm)

- 매 순간 최선의 경우만 골라간다.
- 다른 경우는 고려하지 않는다. 나중은 생각하지 않는다.
- 반레가 존재하면 안된다.
- 모든 경우의 수를 살펴보지 않으니 완전탐색보다 빠르다.
- 어떤 경우가 최선인지 찾는 것이 포인트다. 즉 **규칙성 찾기**

#### 이진탐색(Binary Search)

#### 매개변수 탐색(Parametric Search)

#### 동적 계획법(Dynamic Programming)
