export interface CheatingAnalysis {
  studentA: string;
  studentB: string;
  overallSimilarity: number;
  details: {
    keywordsMatched: string[];
    keywordSimilarity: number;
    writingStyleSimilarity: number;
    structureSimilarity: number;
    suspiciousPatterns: string[];
  };
  riskLevel: 'low' | 'medium' | 'high';
}

class CheatingDetectionService {
  async compareAnswerSheets(
    answerSheetA: string, 
    answerSheetB: string,
    studentNameA: string,
    studentNameB: string
  ): Promise<CheatingAnalysis> {
    // Mock cheating detection analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const similarity = Math.floor(Math.random() * 40) + 60; // 60-100% range
    
    return {
      studentA: studentNameA,
      studentB: studentNameB,
      overallSimilarity: similarity,
      details: {
        keywordsMatched: ['theorem', 'equation', 'solution', 'calculate'],
        keywordSimilarity: similarity + 5,
        writingStyleSimilarity: similarity - 3,
        structureSimilarity: similarity + 2,
        suspiciousPatterns: [
          'Identical mathematical notation style',
          'Similar error patterns in calculations',
          'Matching answer structure and format',
        ],
      },
      riskLevel: similarity >= 80 ? 'high' : similarity >= 70 ? 'medium' : 'low',
    };
  }

  async batchCompareAnswerSheets(answerSheets: Array<{
    text: string;
    studentName: string;
    studentId: string;
  }>): Promise<CheatingAnalysis[]> {
    const results: CheatingAnalysis[] = [];
    
    for (let i = 0; i < answerSheets.length; i++) {
      for (let j = i + 1; j < answerSheets.length; j++) {
        const analysis = await this.compareAnswerSheets(
          answerSheets[i].text,
          answerSheets[j].text,
          answerSheets[i].studentName,
          answerSheets[j].studentName
        );
        results.push(analysis);
      }
    }
    
    return results.sort((a, b) => b.overallSimilarity - a.overallSimilarity);
  }
}

export const cheatingDetectionService = new CheatingDetectionService();