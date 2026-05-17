import Link from "next/link";
import { fetchProblems } from "../lib/api";
import type { Problem } from "../lib/data";

export default async function ProblemsPage() {
  let problems: Problem[] = [];
  let error: string | null = null;
  try {
    problems = await fetchProblems();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load problems";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Problems</h1>
        <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          {problems.length} problems
        </span>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="card">
        <table className="cf-table">
          <thead>
            <tr>
              <th style={{ width: "8%" }}>#</th>
              <th style={{ width: "32%" }}>Problem Name</th>
              <th style={{ width: "10%" }}>Difficulty</th>
              <th style={{ width: "30%" }}>Tags</th>
              <th style={{ width: "20%" }}>Solved</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id}>
                <td>{problem.id}</td>
                <td>
                  <Link
                    href={`/problems/${problem.id}`}
                    className="problem-title cf-link"
                  >
                    {problem.title}
                  </Link>
                </td>
                <td>
                  <span className="rating-badge">{problem.difficulty}</span>
                </td>
                <td>
                  <div>
                    {problem.tags?.map((tag) => (
                      <span key={tag} className="tag-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{problem.solvedCount?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
