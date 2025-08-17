import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Eye } from 'lucide-react-native';

const detectionResults = [
  {
    id: '1',
    studentA: 'Ethan',
    studentB: 'Student B',
    similarity: 87,
    color: '#FF3B30',
  },
  {
    id: '2',
    studentA: 'Noah',
    studentB: 'Student B',
    similarity: 75,
    color: '#FF9500',
  },
  {
    id: '3',
    studentA: 'Liam',
    studentB: 'Student B',
    similarity: 62,
    color: '#FFD60A',
  },
];

export default function CheatingDetectionScreen() {
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return '#FF3B30';
    if (similarity >= 70) return '#FF9500';
    return '#FFD60A';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Cheating Detection Report</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.spotlight}>
          <View style={styles.spotlightGlow} />
        </View>

        <View style={styles.analysisSection}>
          <Text style={styles.analysisTitle}>Match 100</Text>
          <Text style={styles.analysisSubtitle}>AI-generated and cross-verified</Text>
        </View>

        <View style={styles.resultsContainer}>
          {detectionResults.map((result) => (
            <View key={result.id} style={styles.resultCard}>
              <View style={styles.resultContent}>
                <Text style={styles.resultText}>
                  <Text style={styles.studentName}>Student A: {result.studentA}</Text>
                  {', '}
                  <Text style={styles.studentName}>Student B: {result.studentB}</Text>
                </Text>
                <Text style={[styles.similarityText, { color: getSimilarityColor(result.similarity) }]}>
                  {result.similarity}% Match
                </Text>
              </View>
              <TouchableOpacity style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            This feature uses natural language matching, keyword pattern, and writing style checks.
          </Text>
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
  spotlight: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  spotlightGlow: {
    width: 120,
    height: 120,
    backgroundColor: '#00ff88',
    borderRadius: 60,
    opacity: 0.3,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  analysisSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  analysisTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  analysisSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  resultsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  resultCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#333',
  },
  resultContent: {
    flex: 1,
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    marginBottom: 4,
  },
  studentName: {
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  similarityText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  viewDetailsButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#00ff88',
  },
  infoSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});