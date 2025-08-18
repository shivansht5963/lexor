import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, RotateCcw, Download } from 'lucide-react-native';

export default function EvaluationResultScreen() {
  const params = useLocalSearchParams<{ text?: string; confidence?: string }>();
  const extractedText = params.text || '—';
  const confidence = params.confidence ? Math.round(parseFloat(params.confidence) * 100) : 50;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>AI Evaluation Result</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.resultHeader}>
          <View style={styles.subjectContainer}>
            <Text style={styles.subjectLabel}>Subject: Math</Text>
            <Text style={styles.studentName}>Student Name: Alex</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>5/10</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accuracy</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
            <Text style={styles.progressText}>{confidence}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Extracted Text</Text>
          <Text style={styles.sectionContent}>
            {extractedText}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Missed Points</Text>
          <Text style={styles.sectionContent}>
            Alex struggled with word problems that required multiple steps. They also had 
            difficulty with problems involving fractions and decimals, indicating a need for 
            further practice in these areas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Tip</Text>
          <Text style={styles.sectionContent}>
            To improve, Alex should focus on breaking down complex word problems into smaller, 
            manageable steps. Practicing with visual aids and real-world examples can also help 
            solidify their understanding of fractions and decimals.
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.recheckButton}>
            <RotateCcw size={20} color="#00ff88" />
            <Text style={styles.recheckButtonText}>Recheck with AI</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportButton}>
            <Download size={20} color="#1a1a1a" />
            <Text style={styles.exportButtonText}>Export as PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  resultHeader: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  subjectContainer: {
    flex: 1,
  },
  subjectLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  scoreContainer: {
    backgroundColor: '#00ff88',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  score: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#00ff88',
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
    marginTop: 16,
  },
  recheckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#00ff88',
    gap: 8,
  },
  recheckButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#00ff88',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ff88',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  exportButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
});