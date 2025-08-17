export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'admin';
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classId: string;
}

export interface Class {
  id: string;
  name: string;
  students: number;
  color: string;
  teacherId: string;
  createdAt: string;
}

export interface AnswerSheet {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  imageUri: string;
  ocrText?: string;
  uploadedAt: string;
}

export interface Evaluation {
  id: string;
  answerSheetId: string;
  studentId: string;
  classId: string;
  subject: string;
  score: number;
  maxScore: number;
  accuracy: number;
  strengths: string;
  missedPoints: string;
  aiTip: string;
  evaluatedAt: string;
}

export interface CheatingDetection {
  id: string;
  studentAId: string;
  studentBId: string;
  studentAName: string;
  studentBName: string;
  similarity: number;
  details: {
    keywordsMatched: string[];
    keywordSimilarity: number;
    writingStyleSimilarity: number;
    structureSimilarity: number;
    suspiciousPatterns: string[];
  };
  riskLevel: 'low' | 'medium' | 'high';
  detectedAt: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'evaluation' | 'performance' | 'cheating' | 'summary';
  classId?: string;
  className?: string;
  generatedAt: string;
  data: any;
}

export interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  questions: Array<{
    question: string;
    marks: number;
    type: 'short' | 'long' | 'mcq';
  }>;
  totalMarks: number;
  duration: number; // in minutes
  createdAt: string;
}

export interface MCQSet {
  id: string;
  title: string;
  subject: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
  createdAt: string;
}