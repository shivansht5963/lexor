import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { User, Settings, CircleHelp as HelpCircle, FileText, Bell, Lock, LogOut, ChevronRight } from 'lucide-react-native';
import { authService, type UserProfile } from '@/services/authService';

const menuItems = [
  { id: 'account', title: 'Account Settings', icon: Settings, subtitle: 'Manage your profile' },
  { id: 'notifications', title: 'Notifications', icon: Bell, subtitle: 'Configure alerts' },
  { id: 'privacy', title: 'Privacy & Security', icon: Lock, subtitle: 'Manage your data' },
  { id: 'help', title: 'Help & Support', icon: HelpCircle, subtitle: 'Get assistance' },
  { id: 'terms', title: 'Terms & Conditions', icon: FileText, subtitle: 'Legal information' },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    authService.fetchProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            router.replace('/auth/login');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#1a1a1a" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.full_name || profile?.username || 'User'}</Text>
            <Text style={styles.profileEmail}>{profile?.gmail || ''}</Text>
            <Text style={styles.profileRole}>{profile?.is_teacher ? 'Teacher' : 'User'}</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>127</Text>
            <Text style={styles.profileStatLabel}>Sheets Evaluated</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>8</Text>
            <Text style={styles.profileStatLabel}>Active Classes</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>3</Text>
            <Text style={styles.profileStatLabel}>Years Using Lexor</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            
            return (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemIcon}>
                  <IconComponent size={20} color="#00ff88" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color="#666" />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
  profileSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#00ff88',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#00ff88',
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  profileStat: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  profileStatNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#00ff88',
    marginBottom: 4,
  },
  profileStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
  menuSection: {
    gap: 2,
    marginBottom: 32,
  },
  menuItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF3B30',
  },
});