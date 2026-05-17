"use client";

import { fetchProblem, fetchTestCases } from "../../lib/api";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Problem, TestCase } from "../../lib/data";
import { tcpProxy } from "next/dist/build/turborepo-access-trace/tcp";

export default function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [error, setError] = useState<string | null>(null);
  console.log(problem)
  console.log(testCases)

  useEffect(() => {
    (async () => {
      try {
        const pid = parseInt(id);
        const [found, cases] = await Promise.all([
          fetchProblem(pid),
          fetchTestCases(pid),
        ]);
        setProblem(found);
        setTestCases(cases);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load problem");
      }
    })();
  }, [id]);

  if (error) {
    return (
      <div>
        <div className="error-banner">{error}</div>
        <Link href="/" className="cf-link">
          Back to Problems
        </Link>
      </div>
    );
  }

  if (!problem) {
    return (
      <div>
        <h1>Problem not found</h1>
        <Link href="/" className="cf-link">
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
            <span className="problem-index">{problem.id}. </span>
            {problem.title}
          </h1>
          <p className="problem-meta">
            Time limit: {problem.timeLimit ?? "?"} second{problem.timeLimit !== 1 ? "s" : ""} · Memory limit: {problem.memoryLimit ?? "?"} MB
          </p>
        </div>
        <Link href="/" className="back-link">
          Back to problems
        </Link>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Description</h3>
          <div className="problem-description">
            <ReactMarkdown>{(problem.description ?? "").replace(/^# .*\n?/, "")}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Input</h3>
          <div style={{ fontSize: "14px" }}>
            <ReactMarkdown>{problem.inputDescription ?? ""}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Output</h3>
          <div style={{ fontSize: "14px" }}>
            <ReactMarkdown>{problem.outputDescription ?? ""}</ReactMarkdown>
          </div>
        </div>
      </div>

      {testCases.length > 0 && (
        <>
          <div className="section">
            <div className="card">
              <h3 className="card-title">Input</h3>
              <pre className="code-block" style={{ margin: 0 }}>
                {testCases
                  .sort((a, b) => a.order - b.order)
                  .map((tc) => tc.input)
                  .join("\n")}
              </pre>
            </div>
          </div>
          <div className="section">
            <div className="card">
              <h3 className="card-title">Output</h3>
              <pre className="code-block" style={{ margin: 0 }}>
                {testCases
                  .sort((a, b) => a.order - b.order)
                  .map((tc) => tc.output)
                  .join("\n")}
              </pre>
            </div>
          </div>
          {testCases.some((tc) => tc.explanation) && (
            <div className="section">
              <div className="card">
                <h3 className="card-title">Note</h3>
                {testCases
                  .sort((a, b) => a.order - b.order)
                  .map(
                    (tc) =>
                      tc.explanation && (
                        <div key={tc.id} style={{ fontSize: "14px", marginBottom: "8px", whiteSpace: "pre-wrap" }}>
                          {tc.explanation}
                        </div>
                      )
                  )}
              </div>
            </div>
          )}
        </>
      )}

      <div className="section">
        <div className="card">
          <h3 className="card-title">Submit</h3>
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <select className="select">
              <option>GNU C++17</option>
              <option>GNU C11</option>
              <option>Rust 2021</option>
              <option>Go 1.21</option>
              <option>Java 17</option>
              <option>Python 3</option>
              <option>JavaScript (Node.js)</option>
              <option>TypeScript (Node.js)</option>
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
        <span>Solved: {problem.solvedCount?.toLocaleString()}</span>
        <span>Submissions: {problem.submissionCount?.toLocaleString()}</span>
      </div>
    </div>
  );
}