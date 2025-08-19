import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Camera, FileCheck, FileText, CircleHelp as HelpCircle, Shield, ChartBar as BarChart3, Download, Users } from 'lucide-react-native';
import { fetchDashboardStats, type DashboardStats } from '@/services/classService';
import { fetchEvaluationStats, fetchOcrRequestCount, type EvaluationStats } from '@/services/evaluationService';

const quickActions = [
  { id: 'scan', title: 'Scan', subtitle: 'Answer Sheet', icon: Camera, route: '/scan' },
  { id: 'evaluation', title: 'Evaluation', subtitle: 'Review Results', icon: FileCheck, route: '/evaluation-result' },
  { id: 'notes', title: 'Notes', subtitle: 'AI Generated', icon: FileText, route: '/notes' },
  { id: 'mcqs', title: 'MCQs', subtitle: 'Generate Tests', icon: HelpCircle, route: '/mcqs' },
  { id: 'cheating', title: 'Cheating Detection', subtitle: 'Compare Sheets', icon: Shield, route: '/cheating-detection' },
  { id: 'reports', title: 'Reports', subtitle: 'View Analytics', icon: BarChart3, route: '/(tabs)/reports' },
  { id: 'export', title: 'Export to PDF', subtitle: 'Download Files', icon: Download, route: '/export-pdf' },
  { id: 'classes', title: 'Class Groups', subtitle: 'Manage Students', icon: Users, route: '/class-groups' },
];

export default function HomeScreen() {
  const [classStats, setClassStats] = useState<DashboardStats | null>(null);
  const [evalStats, setEvalStats] = useState<EvaluationStats | null>(null);
  const [ocrCount, setOcrCount] = useState<number | null>(null);

  useEffect(() => {
    fetchDashboardStats().then(setClassStats).catch(() => setClassStats(null));
    fetchEvaluationStats().then(setEvalStats).catch(() => setEvalStats(null));
    fetchOcrRequestCount().then(setOcrCount).catch(() => setOcrCount(null));
  }, []);

  const renderQuickAction = (action: typeof quickActions[0]) => {
    const IconComponent = action.icon;
    
    return (
      <TouchableOpacity
        key={action.id}
        style={styles.actionCard}
        onPress={() => router.push(action.route as any)}
      >
        <View style={styles.actionIconContainer}>
          <IconComponent size={24} color="#00ff88" />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning</Text>
        <Text style={styles.teacherName}>Sarah Johnson</Text>
        <Text style={styles.todayDate}>Today, March 15, 2025</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{classStats?.total_students ?? '—'}</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{classStats?.active_classes ?? '—'}</Text>
          <Text style={styles.statLabel}>Active Classes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{evalStats?.total_evaluations ?? '—'}</Text>
          <Text style={styles.statLabel}>Total Evaluations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{ocrCount ?? '—'}</Text>
          <Text style={styles.statLabel}>OCR Scans</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map(renderQuickAction)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Math Quiz - Grade 10A</Text>
          <Text style={styles.activitySubtitle}>25 sheets evaluated • 2 hours ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Science Test - Grade 9B</Text>
          <Text style={styles.activitySubtitle}>18 sheets evaluated • 5 hours ago</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  teacherName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  todayDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#00ff88',
    marginBottom: 4,
  },
  statLabel: {
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
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#333',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  activityCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
});