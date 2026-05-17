"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchCurrentUser, signOut } from "../lib/api";
import type { User } from "../lib/data";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      setDarkMode(stored === "true");
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const u = await fetchCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      }
    })();
  }, [pathname]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  function handleLogout() {
    signOut();
    setUser(null);
    router.push("/");
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link href="/" className="logo">
            <span className="logo-icon">C</span>
            <span className="logo-text">Codeforces</span>
          </Link>
          <div className="nav-links">
            <Link href="/problems" className="nav-link">
              Problems
            </Link>
          </div>
        </div>
        <div className="nav-right">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          {user ? (
            <>
              <Link href="/profile" className="nav-link auth-link">
                {user.username}
              </Link>
              <button onClick={handleLogout} className="nav-link auth-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="nav-link auth-link">
                Sign In
              </Link>
              <Link href="/signup" className="nav-link auth-link register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
