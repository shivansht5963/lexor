import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FileText, TrendingUp, Shield, Download, Calendar } from 'lucide-react-native';

const reports = [
  {
    id: '1',
    title: 'Math Quiz Evaluation',
    class: 'Grade 10A',
    date: '2025-03-15',
    type: 'evaluation',
    icon: FileText,
    color: '#007AFF',
  },
  {
    id: '2',
    title: 'Performance Analysis',
    class: 'Science - Unit 2',
    date: '2025-03-14',
    type: 'performance',
    icon: TrendingUp,
    color: '#34C759',
  },
  {
    id: '3',
    title: 'Cheating Detection',
    class: 'English Literature',
    date: '2025-03-13',
    type: 'cheating',
    icon: Shield,
    color: '#FF3B30',
  },
  {
    id: '4',
    title: 'Weekly Summary',
    class: 'All Classes',
    date: '2025-03-10',
    type: 'summary',
    icon: Calendar,
    color: '#FF9500',
  },
];

export default function ReportsScreen() {
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
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          {reports.map((report) => {
            const IconComponent = report.icon;
            
            return (
              <View key={report.id} style={styles.reportCard}>
                <View style={styles.reportIcon}>
                  <IconComponent size={20} color={report.color} />
                </View>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportClass}>{report.class}</Text>
                  <Text style={styles.reportDate}>{report.date}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.exportButton}
                  onPress={() => handleExportReport(report.id)}
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