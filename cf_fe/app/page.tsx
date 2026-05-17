import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px 60px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          Codeforces Clone
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          A competitive programming platform. Solve challenges, track your progress,
          and improve your algorithmic skills.
        </p>
        <Link href="/problems" className="btn btn-primary" style={{ fontSize: "16px", padding: "12px 32px" }}>
          Browse Problems
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
          <h3 style={{ marginBottom: "8px", fontSize: "20px" }}>100+ Problems</h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
            A growing collection of algorithmic challenges across various difficulty levels.
          </p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
          <h3 style={{ marginBottom: "8px", fontSize: "20px" }}>Multiple Languages</h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
            Solve problems in C++, Rust, Go, Java, Python, JavaScript, and TypeScript.
          </p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
          <h3 style={{ marginBottom: "8px", fontSize: "20px" }}>Track Progress</h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
            Monitor your ratings, submissions, and growth over time.
          </p>
        </div>
      </div>
    </div>
  );
}