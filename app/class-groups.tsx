import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Users } from 'lucide-react-native';

const activeClasses = [
  { id: '1', name: 'Math 101', students: 15, color: '#ff9500' },
  { id: '2', name: 'Science - Unit 2', students: 12, color: '#007AFF' },
  { id: '3', name: 'English Literature', students: 18, color: '#FF6B6B' },
];

export default function ClassGroupsScreen() {
  const [className, setClassName] = useState('');
  const [groupCode, setGroupCode] = useState('');

  const handleCreateGroup = () => {
    if (!className.trim()) return;
    // Mock create group functionality
    setClassName('');
  };

  const handleJoinGroup = () => {
    if (!groupCode.trim()) return;
    // Mock join group functionality
    setGroupCode('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Class Groups</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create a New Class Group</Text>
          <TextInput
            style={styles.input}
            placeholder="Class Name"
            placeholderTextColor="#666"
            value={className}
            onChangeText={setClassName}
          />
          <TouchableOpacity 
            style={[styles.createButton, !className.trim() && styles.buttonDisabled]}
            onPress={handleCreateGroup}
            disabled={!className.trim()}
          >
            <Text style={styles.createButtonText}>Create Group</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join Existing Group</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Group Code"
            placeholderTextColor="#666"
            value={groupCode}
            onChangeText={setGroupCode}
          />
          <TouchableOpacity 
            style={[styles.joinButton, !groupCode.trim() && styles.buttonDisabled]}
            onPress={handleJoinGroup}
            disabled={!groupCode.trim()}
          >
            <Text style={styles.joinButtonText}>Join Group</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Active Classes</Text>
          {activeClasses.map((classItem) => (
            <View key={classItem.id} style={styles.classCard}>
              <View style={styles.classContent}>
                <Text style={styles.className}>{classItem.name}</Text>
                <Text style={styles.studentCount}>{classItem.students} students</Text>
              </View>
              <View style={styles.classActions}>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
                <View style={[styles.classIcon, { backgroundColor: classItem.color }]}>
                  <Users size={20} color="#fff" />
                </View>
              </View>
            </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#00ff88',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  joinButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  joinButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#00ff88',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  classCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  classContent: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  studentCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  classActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#00ff88',
  },
  classIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});