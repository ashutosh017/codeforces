export interface Problem {
  id: number;
  title: string;
  index: string;
  difficulty: number;
  tags: string[];
  description: string;
  inputDescription: string;
  outputDescription: string;
  timeLimit: number;
  memoryLimit: number;
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

export interface TestCase {
  id: number;
  problemId: number;
  input: string;
  output: string;
  explanation: string | null;
  order: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  rating: number;
  rank: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

