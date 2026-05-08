export interface Problem {
  id: number;
  title: string;
  index: string;
  rating: number;
  tags: string[];
  solvedCount: number;
  submissionCount: number;
}

export interface Submission {
  id: number;
  problemId: number;
  problemIndex: string;
  problemTitle: string;
  userId: number;
  userName: string;
  verdict: "Accepted" | "Wrong Answer" | "Time Limit" | "Runtime Error";
  language: string;
  time: number;
  memory: number;
  submittedAt: string;
}

export interface User {
  id: number;
  handle: string;
  email: string;
  rating: number;
  maxRating: number;
  solvedCount: number;
  submissionCount: number;
  rank: string;
  joinedAt: string;
}

export const problems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    index: "A",
    rating: 800,
    tags: ["implementation", "hashing"],
    solvedCount: 15420,
    submissionCount: 18230,
  },
];

export const submissions: Submission[] = [
  {
    id: 1,
    problemId: 1,
    problemIndex: "A",
    problemTitle: "Two Sum",
    userId: 1,
    userName: "john",
    verdict: "Accepted",
    language: "GNU C++17",
    time: 31,
    memory: 256,
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    problemId: 1,
    problemIndex: "A",
    problemTitle: "Two Sum",
    userId: 1,
    userName: "john",
    verdict: "Wrong Answer",
    language: "GNU C++17",
    time: 0,
    memory: 0,
    submittedAt: "2024-01-15T10:25:00Z",
  },
];

export const users: User[] = [
  {
    id: 1,
    handle: "john",
    email: "john@example.com",
    rating: 1200,
    maxRating: 1400,
    solvedCount: 45,
    submissionCount: 120,
    rank: "Expert",
    joinedAt: "2023-01-01",
  },
];