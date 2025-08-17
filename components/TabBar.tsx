import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Chrome as Home, Users, FileText, User } from 'lucide-react-native';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const tabs = [
  { id: 'home', title: 'Home', icon: Home },
  { id: 'classes', title: 'Classes', icon: Users },
  { id: 'reports', title: 'Reports', icon: FileText },
  { id: 'profile', title: 'Profile', icon: User },
];

export default function TabBar({ activeTab, onTabPress }: TabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
          >
            <IconComponent 
              size={24} 
              color={isActive ? '#00ff88' : '#666'} 
            />
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#00ff88',
  },
});