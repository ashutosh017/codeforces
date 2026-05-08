import { users } from "../lib/data";

export default function ProfilePage() {
  const user = users[0];

  return (
    <div>
      <div className="profile-header">
        <div className="profile-avatar">{user.handle[0].toUpperCase()}</div>
        <div className="profile-info">
          <h1>{user.handle}</h1>
          <p className="profile-rank">{user.rank}</p>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Member since {user.joinedAt}
          </p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <div className="stat-value">{user.rating}</div>
          <div className="stat-label">Rating</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{user.maxRating}</div>
          <div className="stat-label">Max Rating</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{user.solvedCount}</div>
          <div className="stat-label">Problems Solved</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{user.submissionCount}</div>
          <div className="stat-label">Submissions</div>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Account Settings</h3>
          <form className="auth-form" style={{ maxWidth: "400px" }}>
            <div className="form-group">
              <label className="form-label">Handle</label>
              <input
                type="text"
                defaultValue={user.handle}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="form-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}