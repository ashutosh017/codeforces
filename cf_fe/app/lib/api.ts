import type { Problem, Submission, TestCase, User } from "./data";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setTokenCookie(token: string): void {
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=604800; samesite=lax`;
}

function removeTokenCookie(): void {
  document.cookie = "token=; path=/; max-age=0";
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function signOut(): void {
  removeTokenCookie();
}

export async function fetchProblems(): Promise<Problem[]> {
  const res = await fetch(`${BACKEND_URL}/api/problems`);
  if (!res.ok) throw new Error(`Failed to fetch problems: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchProblem(id: number): Promise<Problem> {
  const res = await fetch(`${BACKEND_URL}/api/problems/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch problem: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchSubmissions(): Promise<Submission[]> {
  const res = await fetch(`${BACKEND_URL}/api/submissions`);
  if (!res.ok) throw new Error(`Failed to fetch submissions: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchCurrentUser(): Promise<User> {
  const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchTestCases(problemId: number): Promise<TestCase[]> {
  const res = await fetch(`${BACKEND_URL}/api/problems/${problemId}/testcases`);
  if (!res.ok) throw new Error(`Failed to fetch test cases: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function signIn(
  username: string,
  password: string
): Promise<{ token: string }> {
  const res = await fetch(`${BACKEND_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Sign in failed: ${res.status}`);
  }
  return res.json();
}

export async function signUp(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Sign up failed: ${res.status}`);
  }
}
