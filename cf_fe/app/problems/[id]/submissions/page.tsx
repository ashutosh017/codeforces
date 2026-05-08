"use client";

import { submissions } from "../../../lib/data";
import Link from "next/link";
import { use } from "react";

export default function ProblemSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const problemId = parseInt(id);
  const problemSubmissions = submissions.filter(
    (s) => s.problemId === problemId
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Submissions</h1>
        <Link href={`/problems/${id}`} className="back-link">
          Back to problem
        </Link>
      </div>

      {problemSubmissions.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-secondary)" }}>
            No submissions yet. Be the first to submit!
          </p>
          <div style={{ textAlign: "center" }}>
            <Link href={`/problems/${id}`} className="btn btn-primary">
              Submit Solution
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <table className="cf-table">
            <thead>
              <tr>
                <th style={{ width: "8%" }}>#</th>
                <th style={{ width: "20%" }}>When</th>
                <th style={{ width: "27%" }}>Problem</th>
                <th style={{ width: "15%" }}>Verdict</th>
                <th style={{ width: "15%" }}>Language</th>
                <th style={{ width: "7.5%" }}>Time</th>
                <th style={{ width: "7.5%" }}>Memory</th>
              </tr>
            </thead>
            <tbody>
              {problemSubmissions.map((sub) => (
                <tr key={sub.id}>
                  <td>{sub.id}</td>
                  <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/problems/${sub.problemId}`}
                      className="cf-link"
                    >
                      {sub.problemIndex}. {sub.problemTitle}
                    </Link>
                  </td>
                  <td>
                    <span
                      className={
                        sub.verdict === "Accepted"
                          ? "verdict-accepted"
                          : "verdict-rejected"
                      }
                    >
                      {sub.verdict}
                    </span>
                  </td>
                  <td>{sub.language}</td>
                  <td>{sub.time}ms</td>
                  <td>{sub.memory}KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}