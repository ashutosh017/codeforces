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
- An integer array `nums` where `2 <= nums.length <= 10^4`.
- Each element `nums[i]` is an integer where `-10^9 <= nums[i] <= 10^9`.
- A target integer `target` where `-10^9 <= target <= 10^9`.
- **Constraint**: Only one valid answer exists.

## Output Description
- Return an array of two integers representing the 0-indexed positions of the numbers that sum to the target.

## Examples

**Example 1:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

**Example 2:**
```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

**Example 3:**
```
Input: nums = [3,3], target = 6
Output: [0,1]
```
