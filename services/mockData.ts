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
}

export interface Evaluation {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  score: number;
  maxScore: number;
  accuracy: number;
  strengths: string;
  missedPoints: string;
  aiTip: string;
  timestamp: string;
}

export interface CheatingDetection {
  id: string;
  studentA: string;
  studentB: string;
  similarity: number;
  details: {
    keywordsMatched: string[];
    writingStyleSimilarity: number;
    structureSimilarity: number;
  };
}

export const mockStudents: Student[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex@school.edu', classId: '1' },
  { id: '2', name: 'Ethan Smith', email: 'ethan@school.edu', classId: '1' },
  { id: '3', name: 'Noah Brown', email: 'noah@school.edu', classId: '2' },
  { id: '4', name: 'Liam Davis', email: 'liam@school.edu', classId: '2' },
];

export const mockClasses: Class[] = [
  { id: '1', name: 'Math 101', students: 15, color: '#ff9500', teacherId: 'teacher1' },
  { id: '2', name: 'Science - Unit 2', students: 12, color: '#007AFF', teacherId: 'teacher1' },
  { id: '3', name: 'English Literature', students: 18, color: '#FF6B6B', teacherId: 'teacher1' },
];

export const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    studentId: '1',
    classId: '1',
    subject: 'Math',
    score: 5,
    maxScore: 10,
    accuracy: 50,
    strengths: 'Alex demonstrated a strong understanding of basic arithmetic operations, including addition and subtraction. Their calculations were accurate, and they showed a good grasp of number sense.',
    missedPoints: 'Alex struggled with word problems that required multiple steps. They also had difficulty with problems involving fractions and decimals, indicating a need for further practice in these areas.',
    aiTip: 'To improve, Alex should focus on breaking down complex word problems into smaller, manageable steps. Practicing with visual aids and real-world examples can also help solidify their understanding of fractions and decimals.',
    timestamp: '2025-03-15T10:30:00Z',
  },
];

export const mockCheatingDetections: CheatingDetection[] = [
  {
    id: '1',
    studentA: 'Ethan',
    studentB: 'Student B',
    similarity: 87,
    details: {
      keywordsMatched: ['theorem', 'equation', 'solution'],
      writingStyleSimilarity: 92,
      structureSimilarity: 89,
    },
  },
  {
    id: '2',
    studentA: 'Noah',
    studentB: 'Student B',
    similarity: 75,
    details: {
      keywordsMatched: ['hypothesis', 'experiment', 'conclusion'],
      writingStyleSimilarity: 78,
      structureSimilarity: 72,
    },
  },
];