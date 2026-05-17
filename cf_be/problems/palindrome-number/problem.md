---
title: "Palindrome Number"
difficulty: 900
timeLimit: 1000
memoryLimit: 256
tags: ["math"]
---

# Palindrome Number

Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.

An integer is a palindrome when it reads the same backward as forward. For example, `121` is a palindrome while `123` is not.

## Input Description
The first line contains an integer `T` (`1 <= T <= 10^4`), the number of test cases.
Each test case consists of a single integer `x` where `-2^31 <= x <= 2^31 - 1`.

## Output Description
For each test case, output `true` if `x` is a palindrome integer, `false` otherwise.

## Sample Input
```
3
121
-121
10
```

## Sample Output
```
true
false
false
```

## Sample Explanations
1. 121 reads as 121 from left to right and from right to left, so it is a palindrome. 
2. From left to right, -121 reads as -121. From right to left, it becomes 121-, so it is not a palindrome.
3. 10 reads as 01 from right to left, so it is not a palindrome.
