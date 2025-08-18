import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FileText, TrendingUp, Shield, Download, Calendar } from 'lucide-react-native';
import { httpJson } from '@/services/apiClient';

type DetectionItem = {
  id: number;
  class_name: string | null;
  student_name: string | null;
  cheating_level: string | null;
  confidence_score: number | null;
  status: string;
  created_at: string;
};

export default function ReportsScreen() {
  const [detections, setDetections] = useState<DetectionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Use cheating detection history as "recent reports"
    httpJson<DetectionItem[]>('/cheating-detection/history/')
      .then(setDetections)
      .catch(() => setDetections([]))
      .finally(() => setLoading(false));
  }, []);

  const handleExportReport = (reportId: string) => {
    // Mock export functionality
    console.log(`Exporting report ${reportId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.overviewCards}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>127</Text>
            <Text style={styles.overviewLabel}>Total Evaluations</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>8</Text>
            <Text style={styles.overviewLabel}>Cheating Cases</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>85%</Text>
            <Text style={styles.overviewLabel}>Avg Accuracy</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Detections</Text>
          {detections.map((item) => {
            const color = item.cheating_level === 'high' ? '#FF3B30' : item.cheating_level === 'medium' ? '#FF9500' : '#34C759';
            const IconComponent = item.cheating_level === 'high' ? Shield : item.cheating_level === 'medium' ? TrendingUp : FileText;
            return (
              <View key={item.id} style={styles.reportCard}>
                <View style={styles.reportIcon}>
                  <IconComponent size={20} color={color} />
                </View>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>{item.student_name || 'Unknown Student'}</Text>
                  <Text style={styles.reportClass}>{item.class_name || '—'}</Text>
                  <Text style={styles.reportDate}>{new Date(item.created_at).toLocaleString()}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.exportButton}
                  onPress={() => handleExportReport(String(item.id))}
                >
                  <Download size={16} color="#00ff88" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Most Improved Subject</Text>
            <Text style={styles.insightValue}>Mathematics (+12%)</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Best Performing Class</Text>
            <Text style={styles.insightValue}>Grade 10A (89% avg)</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Attention Needed</Text>
            <Text style={styles.insightValue}>Grade 9B (67% avg)</Text>
          </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  overviewCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  overviewNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#00ff88',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  reportIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 2,
  },
  reportClass: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 2,
  },
  reportDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  exportButton: {
    width: 36,
    height: 36,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  insightTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
  },
  insightValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#00ff88',
  },
});