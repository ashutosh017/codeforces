import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Register</h1>
        <p className="auth-subtitle">
          Create your account
        </p>
        <form className="auth-form">
          <div className="form-group">
            <label className="form-label">Handle</label>
            <input
              type="text"
              className="form-input"
              style={{ maxWidth: "100%" }}
              placeholder="Choose a handle"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              style={{ maxWidth: "100%" }}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              style={{ maxWidth: "100%" }}
              placeholder="Create a password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              style={{ maxWidth: "100%" }}
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="auth-submit">
            Register
          </button>
        </form>
        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/signin" className="cf-link">
            Enter
          </Link>
        </p>
      </div>
    </div>
  );
}