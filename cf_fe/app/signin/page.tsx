import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Enter</h1>
        <p className="auth-subtitle">
          Enter your handle/email and password
        </p>
        <form className="auth-form">
          <div className="form-group">
            <label className="form-label">Handle or Email</label>
            <input
              type="text"
              className="form-input"
              style={{ maxWidth: "100%" }}
              placeholder="Enter your handle or email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              style={{ maxWidth: "100%" }}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="auth-submit">
            Enter
          </button>
        </form>
        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="cf-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}