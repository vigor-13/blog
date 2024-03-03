---
title: Add Two Numbers
description:
date: 2024-03-04
tags: [leetcode, medium, linked_list, carry]
references:
  [
    {
      key: '원문',
      value: 'https://leetcode.com/problems/add-two-numbers/description/',
    },
  ]
---

## 문제 {#description}

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */
function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null,
): ListNode | null {
  // 답안 ...
}
```

두 개의 음수가 아닌 정수를 나타내는 비어 있지 않은 **연결 리스트(Linked List)** 두 개가 주어진다. 숫자는 역순으로 저장되며 각 노드에는 단일 숫자가 포함된다. 두 숫자를 더하고 그 합계를 연결 리스트로 반환해야 한다.

두 숫자에는 숫자 0을 제외하고 선행 0이 포함되지 않는다고 가정할 수 있다.

- 예제 1:

```text
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

- 예제 2:

```text
Input: l1 = [0], l2 = [0]
Output: [0]
```

- 예제 3:

```text
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

## 해결방법 {#solutions}

### 접근법1 - 기초 수학 {#approach1-elementry-math}

변수를 사용하여 자리올림(carry)을 추적하고 가장 작은 숫자가 포함된 리스트의 머리부터 시작하여 자릿수 단위로 합계를 시뮬레이션한다.

![두 숫자의 덧셈의 시각화: `342 + 465 = 807`.
각 노드에는 한 자릿수가 포함되며 자릿수는 역순으로 저장된다.](https://leetcode.com/problems/add-two-numbers/Figures/2_add_two_numbers.svg)

종이에 두 개의 숫자를 합산하는 것과 마찬가지로 가장 작은 숫자, 즉 `l1` 과 `l2` 의 헤드부터 합산한다. 각 자릿수는 `0...9` 범위에 있으므로 두 자릿수를 합산하면 "오버플로"가 발생할 수 있다. 예를 들어 `5 + 7 = 12` 다. 이 경우 현재 자리 숫자를 `2` 로 설정하고 `carry=1` 을 다음 반복으로 넘긴다. 캐리(올림수) 포함 두 숫자의 가능한 최대 합은 `9 + 9 + 1 = 19`이므로 `carry` 는 `0` 또는 `1` 이 되어야 한다.

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */
function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null,
): ListNode | null {
  const answerList = new ListNode(0);
  let currentNode = answerList;
  let carry = 0;

  while (l1 !== null || l2 !== null || carry !== 0) {
    const l1Val = l1 ? l1.val : 0;
    const l2Val = l2 ? l2.val : 0;
    const columnSum = l1Val + l2Val + carry;
    carry = Math.floor(columnSum / 10);
    const newNode = new ListNode(columnSum % 10);
    currentNode.next = newNode;
    currentNode = newNode;
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
  }

  return answerList.next;
}
```

| 복잡도                       | 설명                                                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 시간 복잡도 - `O(max(m, n))` | `m` 과 `n` 이 각각 `l1` 과 `l2` 의 길이를 나타낸다고 가정하면, 위의 알고리즘은 최대 `max(m,n)` 횟수만큼 반복한다. |
| 공간 복잡도 - `O(1)`         | 답안으로 제출할 리스트의 길이는 최대 `max(m, n) + 1` 이다. 그러나 답은 공간 복잡도의 일부로 계산하지 않는다.      |
