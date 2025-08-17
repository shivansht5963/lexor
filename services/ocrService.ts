export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

class OCRService {
  async processImage(imageUri: string): Promise<OCRResult> {
    // Mock OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      text: `
        Math Test - Grade 10
        Student: Alex Johnson
        
        1. Solve: 2x + 5 = 15
        Answer: x = 5 ✓
        
        2. Calculate: 3/4 + 2/8
        Answer: 1 ✗ (Correct: 1)
        
        3. Word Problem: A store has 240 apples. If they sell 3/5 of them, how many are left?
        Answer: 100 ✗ (Correct: 96)
        
        4. Simplify: 12/16
        Answer: 3/4 ✓
        
        5. Convert to decimal: 7/8
        Answer: 0.875 ✓
      `,
      confidence: 0.92,
      boundingBoxes: [],
    };
  }

  async evaluateAnswers(ocrText: string, subject: string): Promise<{
    score: number;
    maxScore: number;
    accuracy: number;
    strengths: string;
    missedPoints: string;
    aiTip: string;
  }> {
    // Mock AI evaluation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      score: 5,
      maxScore: 10,
      accuracy: 50,
      strengths: 'Alex demonstrated a strong understanding of basic arithmetic operations, including addition and subtraction. Their calculations were accurate, and they showed a good grasp of number sense.',
      missedPoints: 'Alex struggled with word problems that required multiple steps. They also had difficulty with problems involving fractions and decimals, indicating a need for further practice in these areas.',
      aiTip: 'To improve, Alex should focus on breaking down complex word problems into smaller, manageable steps. Practicing with visual aids and real-world examples can also help solidify their understanding of fractions and decimals.',
    };
  }
}

export const ocrService = new OCRService();