import { submissions } from "../lib/data";
import Link from "next/link";

export default function SubmissionsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Submissions</h1>
        <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          {submissions.length} submissions
        </span>
      </div>

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
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "20px", color: "var(--text-secondary)" }}>
                  No submissions yet.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}