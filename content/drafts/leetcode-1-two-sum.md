---
title: Two Sum
description:
date: 2024-03-03
tags: [leetcode, easy, complement, brute_force, hashmap]
references: [{ key: '원문', value: 'https://leetcode.com/problems/two-sum/' }]
---

## 문제 {#description}

```ts
function twoSum(nums: number[], target: number): number[] {
  // 답안...
}
```

정수의 숫자 배열과 정수의 대상이 주어졌을 때, 두 숫자의 인덱스가 대상에 합산되도록 반환한다.

각 입력에는 정확히 하나의 해가 있다고 가정할 수 있으며, 같은 요소를 두 번 사용할 수 없다.

어떤 순서로든 답을 반환할 수 있다.

- Example 1:

```text
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

- Example 2:

```text
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

- Example 3:

```text
Input: nums = [3,3], target = 6
Output: [0,1]
```

## 해결방법 {#solutions}

### 접근법1 - 무차별 대입 {#approach1-brute-force}

무차별 대입 방식은 간단하다. 각 요소 `x` 를 반복하여 `target - x` 와 같은 다른 값이 있는지 찾는다.

```ts
function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i <= nums.length - 1; i++) {
    for (let j = i + 1; j <= nums.length - 1; j++) {
      if (nums[j] === target - nums[i]) return [i, j];
    }
  }
}
```

| 복잡도                 | 설명                                                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 시간 복잡도 - `O(n^2)` | 각 요소에 대해 배열의 나머지 부분을 순환하면서 해당 요소의 보수를 찾으려고 한다. 이는 `O(n)` 의 n번 걸린다. 따라서 시간 복잡도는 `O(n^2)` 이다. |
| 공간 복잡도 - `O(1)`   | 필요한 공간은 입력 배열의 크기에 따라 달라지지 않으므로 상수 공간만 사용한다. `O(1)`                                                            |

### 접근법2 - 2 패스 해시 테이블 {#two-pass-hash-table}

시간 복잡도를 개선하기 위해서는 배열에서 보수(complement)가 존재하는지를 효율적으로 탐색할 수 있는 방법이 필요하다. 만약 보수가 존재한다면 해당 보수의 인덱스를 얻어야 한다. 각 배열 요소를 해당 인덱스와 매핑하는 가장 좋은 방법은 무엇일까? **해시 테이블**이다.

우리는 공간을 속도로 교환하여 `O(n)` 의 조회 시간을 `O(1)` 로 줄일 수 있다. 해시 테이블은 거의 일정한 시간 안에 빠른 조회를 지원하기 때문에 이 목적에 적합하다. "거의"라고 하는 이유는 충돌이 발생하면 조회가 `O(n)` 으로 악화될 수 있기 때문이다. 그러나 해시 함수가 신중하게 선택되었다면 해시 테이블에서의 조회는 평균적으로 `O(1)` 이다.

간단한 구현에서는 두 번의 반복을 사용한다. 첫 번째 반복에서는 각 요소의 값을 키로, 인덱스를 값으로 해시 테이블에 추가한다. 그런 다음 두 번째 반복에서는 해시 테이블에 각 요소의 보수( `target - nums[i]` )가 존재하는지 확인한다. 존재하면 현재 엘리먼트의 인덱스와 그 보수의 인덱스를 반환한다. 보수는 `nums[i]` 자체가 아니어야 한다는 점에 유의해야 한다!

```ts
function twoSum(nums: number[], target: number): number[] {
  const hashmap = new Map();

  nums.forEach((n, i) => {
    hashmap.set(nums[i], i);
  });

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (hashmap.has(complement) && hashmap.get(complement) !== i) {
      return [i, hashmap.get(complement)];
    }
  }
}
```

| 복잡도               | 설명                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 시간 복잡도 - `O(n)` | `n` 개의 요소가 포함된 목록을 정확히 두 번 순회한다. 해시 테이블은 조회 시간을 `O(1)` 로 줄이므로, 전체 시간 복잡도는 `O(n)` 이다. |
| 공간 복잡도 - `O(n)` | 필요한 추가 공간은 해시 테이블에 저장된 항목 수에 따라 달라지며, 해시 테이블은 정확히 `n` 개의 요소를 저장한다.                    |

### 접근법3 - 1 패스 해시 테이블 {#one-pass-hash-table}

이 작업을 원패스로 수행할 수 도 있다. 해시 테이블에 요소를 반복하여 삽입하는 동안 현재 요소의 보수가 해시 테이블에 이미 존재하는지 확인한다. 존재하면 해결책을 찾은 것이고 인덱스를 즉시 반환한다.

```ts
function twoSum(nums: number[], target: number): number[] {
  const hashmap = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (hashmap.has(complement)) {
      return [i, hashmap.get(complement)];
    }

    hashmap.set(nums[i], i);
  }
}
```

| 복잡도               | 설명                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| 시간 복잡도 - `O(n)` | `n` 요소가 포함된 목록을 한 번만 순회한다. 테이블의 각 조회에는 `O(1)` 의 시간만 소요된다.          |
| 공간 복잡도 - `O(n)` | 필요한 추가 공간은 해시 테이블에 저장되는 항목의 수에 따라 달라지며, 최대 `n` 개의 요소를 저장한다. |
