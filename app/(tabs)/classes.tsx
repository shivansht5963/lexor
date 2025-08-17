import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Plus, Users, ChartBar as BarChart3, FileText } from 'lucide-react-native';

const classes = [
  { id: '1', name: 'Math 101', students: 15, evaluations: 45, color: '#ff9500' },
  { id: '2', name: 'Science - Unit 2', students: 12, evaluations: 32, color: '#007AFF' },
  { id: '3', name: 'English Literature', students: 18, evaluations: 58, color: '#FF6B6B' },
  { id: '4', name: 'Physics Advanced', students: 10, evaluations: 28, color: '#34C759' },
];

export default function ClassesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/class-groups')}
        >
          <Plus size={20} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Users size={20} color="#00ff88" />
            <Text style={styles.statNumber}>55</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statCard}>
            <BarChart3 size={20} color="#00ff88" />
            <Text style={styles.statNumber}>163</Text>
            <Text style={styles.statLabel}>Evaluations</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Classes</Text>
          {classes.map((classItem) => (
            <TouchableOpacity key={classItem.id} style={styles.classCard}>
              <View style={[styles.classColorBar, { backgroundColor: classItem.color }]} />
              <View style={styles.classContent}>
                <View style={styles.classHeader}>
                  <Text style={styles.className}>{classItem.name}</Text>
                  <View style={[styles.classIcon, { backgroundColor: classItem.color }]}>
                    <Users size={16} color="#fff" />
                  </View>
                </View>
                <View style={styles.classStats}>
                  <View style={styles.classStat}>
                    <Text style={styles.classStatNumber}>{classItem.students}</Text>
                    <Text style={styles.classStatLabel}>Students</Text>
                  </View>
                  <View style={styles.classStat}>
                    <Text style={styles.classStatNumber}>{classItem.evaluations}</Text>
                    <Text style={styles.classStatLabel}>Evaluations</Text>
                  </View>
                </View>
                <View style={styles.classActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <FileText size={16} color="#00ff88" />
                    <Text style={styles.actionButtonText}>View Reports</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <BarChart3 size={16} color="#00ff88" />
                    <Text style={styles.actionButtonText}>Analytics</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#00ff88',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
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
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
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
  classCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  classColorBar: {
    height: 4,
  },
  classContent: {
    padding: 16,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  classIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classStats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  classStat: {
    alignItems: 'center',
  },
  classStatNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#00ff88',
  },
  classStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  classActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#00ff88',
  },
});