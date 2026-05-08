"use client";

import "./globals.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      setDarkMode(stored === "true");
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-roboto">
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
                <Link href="/submissions" className="nav-link">
                  Submissions
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
              <Link href="/profile" className="nav-link auth-link">
                Profile
              </Link>
              <Link href="/signin" className="nav-link auth-link">
                Sign In
              </Link>
              <Link href="/signup" className="nav-link auth-link register">
                Register
              </Link>
            </div>
          </div>
        </nav>
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>
            © 2024 Codeforces Clone. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}