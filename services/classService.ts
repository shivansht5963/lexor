import { httpJson } from '@/services/apiClient';

export type ClassGroup = {
	id: number;
	name: string;
	description: string;
	subject: string;
	is_active: boolean;
	student_count?: number;
};

export type Student = {
	id: number;
	name: string;
	email: string;
	student_id: string;
	class_group: number;
	class_group_name?: string;
	is_active: boolean;
	added_at: string;
};

export async function listClassGroups(): Promise<ClassGroup[]> {
	const resp = await httpJson<any>('/classes/groups/');
	if (Array.isArray(resp)) return resp as ClassGroup[];
	if (resp && Array.isArray(resp.results)) return resp.results as ClassGroup[];
	return [];
}

export async function createClassGroup(payload: { name: string; description?: string; subject?: string; is_active?: boolean; }): Promise<ClassGroup> {
	return await httpJson<ClassGroup>('/classes/groups/', { method: 'POST', body: { is_active: true, subject: 'General', ...payload } });
}

export async function listStudentsInClass(classId: number): Promise<Student[]> {
	const resp = await httpJson<any>(`/classes/groups/${classId}/students/`);
	if (Array.isArray(resp)) return resp as Student[];
	if (resp && Array.isArray(resp.results)) return resp.results as Student[];
	return [];
}

export async function addStudentToClass(classId: number, payload: { name: string; email: string; student_id: string; }): Promise<Student> {
	return await httpJson<Student>(`/classes/groups/${classId}/add_student/`, { method: 'POST', body: payload });
}

export type DashboardStats = {
	total_classes: number;
	active_classes: number;
	total_students: number;
	active_students: number;
	recent_classes: Array<ClassGroup>;
	classes_with_most_students: Array<ClassGroup & { student_count: number }>;
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
	return await httpJson<DashboardStats>('/classes/dashboard-stats/');
}

