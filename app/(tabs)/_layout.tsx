import { Redirect, Tabs } from 'expo-router';
import { Chrome as Home, Users, FileText, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { authService } from '@/services/authService';

export default function TabLayout() {
	const [ready, setReady] = useState(false);
	const [isAuthed, setIsAuthed] = useState<boolean>(false);

	useEffect(() => {
		authService.fetchProfile()
			.then((p) => setIsAuthed(!!p))
			.finally(() => setReady(true));
	}, []);

	if (!ready) return null;
	if (!isAuthed) return <Redirect href="/auth/login" />;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: '#1a1a1a',
					borderTopColor: '#333',
					borderTopWidth: 1,
					height: 80,
					paddingBottom: 20,
					paddingTop: 10,
				},
				tabBarActiveTintColor: '#00ff88',
				tabBarInactiveTintColor: '#666',
				tabBarLabelStyle: {
					fontFamily: 'Inter-Medium',
					fontSize: 12,
				},
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ size, color }) => (
						<Home size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="classes"
				options={{
					title: 'Classes',
					tabBarIcon: ({ size, color }) => (
						<Users size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="reports"
				options={{
					title: 'Reports',
					tabBarIcon: ({ size, color }) => (
						<FileText size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ size, color }) => (
						<User size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}