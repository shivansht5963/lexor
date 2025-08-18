import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, FolderOpen, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { httpMultipart } from '@/services/apiClient';

export default function ScanScreen() {
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  const handleCameraScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to scan answer sheets.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setScannedImage(result.assets[0].uri);
    }
  };

  const handleGalleryUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setScannedImage(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setScannedImage(null);
  };

  const handleProceedToEvaluation = async () => {
    if (!scannedImage) return;
    try {
      const fileName = scannedImage.split('/').pop() || 'scan.jpg';
      const formData = new FormData();
      // @ts-ignore - React Native FormData supports uri, type, name
      formData.append('image', { uri: scannedImage, type: 'image/jpeg', name: fileName });
      const result = await httpMultipart<{ text: string; confidence: number; message?: string }>(
        '/evaluation/ocr/',
        formData,
        { method: 'POST' }
      );
      router.push({ pathname: '/evaluation-result', params: { text: result.text, confidence: String(result.confidence) } as any });
    } catch (e: any) {
      const msg = e?.details?.error || 'Failed to process image. Please try again.';
      Alert.alert('OCR Error', msg);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan Answer Sheet</Text>
      </View>

      <View style={styles.content}>
        {!scannedImage ? (
          <>
            <TouchableOpacity style={styles.scanButton} onPress={handleCameraScan}>
              <Camera size={24} color="#1a1a1a" />
              <Text style={styles.scanButtonText}>Use Camera to Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadButton} onPress={handleGalleryUpload}>
              <FolderOpen size={24} color="#00ff88" />
              <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: scannedImage }} style={styles.scannedImage} />
            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
              <X size={20} color="#fff" />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {scannedImage && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Ensure well-lit, clear answer sheets without shadows.
            </Text>
            <TouchableOpacity 
              style={styles.proceedButton} 
              onPress={handleProceedToEvaluation}
            >
              <Text style={styles.proceedButtonText}>Proceed to Evaluation</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    padding: 20,
    justifyContent: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ff88',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 16,
    gap: 12,
  },
  scanButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: '#00ff88',
    gap: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#00ff88',
  },
  imageContainer: {
    alignItems: 'center',
    gap: 16,
  },
  scannedImage: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  removeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  instructionsContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  proceedButton: {
    backgroundColor: '#00ff88',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
});