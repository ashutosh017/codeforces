"use client";

import { problems } from "../../lib/data";
import Link from "next/link";
import { use } from "react";

export default function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const problem = problems.find((p) => p.id === parseInt(id));

  if (!problem) {
    return (
      <div>
        <h1>Problem not found</h1>
        <Link href="/problems" className="cf-link">
          Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="problem-index">{problem.index}. </span>
            {problem.title}
          </h1>
          <p className="problem-meta">
            Time limit: 1 second · Memory limit: 256 MB
          </p>
        </div>
        <Link href="/problems" className="back-link">
          Back to problems
        </Link>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Description</h3>
          <p className="problem-description">
            Given an array of integers <code className="code-block" style={{ padding: "2px 6px", fontSize: "13px" }}>nums</code> and an integer <code className="code-block" style={{ padding: "2px 6px", fontSize: "13px" }}>target</code>, return indices of the two numbers such that they add up to <code className="code-block" style={{ padding: "2px 6px", fontSize: "13px" }}>target</code>.
          </p>
          <p className="problem-description">
            You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Input</h3>
          <p style={{ fontSize: "14px" }}>
            The first line contains n (2 ≤ n ≤ 10⁴).
            The second line contains n integers.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Output</h3>
          <p style={{ fontSize: "14px" }}>
            Return the two indices (0-indexed) as [i, j] where nums[i] + nums[j] == target.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Example</h3>
          <pre className="code-block">{`Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}</pre>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Submit</h3>
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <select className="select">
              <option>GNU C++17</option>
              <option>Python 3</option>
              <option>Java 17</option>
            </select>
            <button className="btn btn-primary">Submit</button>
          </div>
          <textarea
            className="textarea"
            rows={12}
            placeholder="// Write your solution here..."
          ></textarea>
        </div>
      </div>

      <div className="info-row">
        <span>Solved: {problem.solvedCount.toLocaleString()}</span>
        <span>Submissions: {problem.submissionCount.toLocaleString()}</span>
        <Link href={`/problems/${problem.id}/submissions`} className="cf-link">
          View my submissions for this problem
        </Link>
      </div>
    </div>
  );
}