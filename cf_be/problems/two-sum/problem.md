---
title: "Two Sum"
difficulty: 800
timeLimit: 1000
memoryLimit: 256
tags: ["array", "hash-table"]
---

# Two Sum

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.

## Input Description
The first line contains an integer `T` (`1 <= T <= 10^4`), the number of test cases.
- Each test case consists of a line containing a target integer followed by an array of integers.
- Second line will contain two values. `target` (`0 <= target <= 10^9`) and `n` (`2 <= n <= 10^5`) - the size of the array.
- Third line will contain `n` integers where each integer `x` (`0 <= x <= 10^9`).

## Output Description
For each test case, output a line containing two integers representing the 0-indexed positions of the numbers that sum to the target. If none index exists then output -1.

## Sample Input
```
3
9 4
2 7 11 15
6 3
3 2 4
6 2
3 3
```

## Sample Output
```
[0,1]
[1,2]
[0,1]
```

## Sample Explanations
1. Because nums[0] + nums[1] == 9, we return [0, 1].
2. Because nums[1] + nums[2] == 6, we return [1, 2].
3. Because nums[0] + nums[1] == 6, we return [0, 1].
