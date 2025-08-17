import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Download, FileText, CircleHelp as HelpCircle, Clipboard } from 'lucide-react-native';

const exportOptions = [
  {
    id: 'answer-sheet',
    title: 'Answer Sheet Evaluation',
    subtitle: 'Export the evaluation of the answer sheet',
    icon: FileText,
    color: '#ff9500',
  },
  {
    id: 'question-paper',
    title: 'Generated Question Paper',
    subtitle: 'Export the generated question paper',
    icon: Clipboard,
    color: '#007AFF',
  },
  {
    id: 'mcqs',
    title: 'MCQs',
    subtitle: 'Export the multiple-choice questions',
    icon: HelpCircle,
    color: '#34C759',
  },
  {
    id: 'notes',
    title: 'Generated Notes',
    subtitle: 'Export the generated notes',
    icon: FileText,
    color: '#ff9500',
  },
];

export default function ExportPDFScreen() {
  const handleDownload = (optionId: string) => {
    // Mock download functionality
    console.log(`Downloading ${optionId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Export to PDF</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.description}>Select what you want to export</Text>

        <View style={styles.optionsContainer}>
          {exportOptions.map((option) => {
            const IconComponent = option.icon;
            
            return (
              <View key={option.id} style={styles.optionCard}>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  <TouchableOpacity 
                    style={styles.downloadButton}
                    onPress={() => handleDownload(option.id)}
                  >
                    <Download size={16} color="#00ff88" />
                    <Text style={styles.downloadButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                  <IconComponent size={24} color="#fff" />
                </View>
              </View>
            );
          })}
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
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 12,
    lineHeight: 18,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    alignSelf: 'flex-start',
  },
  downloadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#00ff88',
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});