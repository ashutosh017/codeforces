"use client";

import { fetchCurrentUser } from "../lib/api";
import { useState, useEffect } from "react";
import type { User } from "../lib/data";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const u = await fetchCurrentUser();
        setUser(u);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load user");
      }
    })();
  }, []);

  if (error) {
    return (
      <div>
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  if (!user) {
    return <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>Loading...</div>;
  }

  return (
    <div>
      <div className="profile-header">
        <div className="profile-avatar">{(user.username ?? "?")[0].toUpperCase()}</div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="profile-rank">{user.rank}</p>
          {user.bio && <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{user.bio}</p>}
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
          </p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <div className="stat-value">{user.rating}</div>
          <div className="stat-label">Rating</div>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3 className="card-title">Account Settings</h3>
          <form className="auth-form" style={{ maxWidth: "400px" }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                defaultValue={user.username ?? ""}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                defaultValue={user.email ?? ""}
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