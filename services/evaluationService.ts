import { httpJson, httpMultipart } from '@/services/apiClient';

export type Evaluation = {
	id: number;
	student: any;
	evaluator: any;
	class_group: any;
	title: string;
	evaluation_type: string;
	score: number;
	max_score: number;
	grade: string;
	feedback: string;
	scanned_document?: string;
	ocr_text?: string;
	percentage_score: number;
	created_at: string;
	evaluation_date: string;
};

export type EvaluationStats = {
	total_evaluations: number;
	average_score: number;
	grade_distribution: Record<string, number>;
	evaluation_type_distribution: Record<string, number>;
	recent_evaluations: Evaluation[];
};

export async function fetchEvaluationStats(): Promise<EvaluationStats> {
	return await httpJson<EvaluationStats>('/evaluation/evaluations/stats/');
}

export async function createEvaluation(payload: {
	student: number;
	class_group: number;
	title: string;
	evaluation_type: string;
	score: number;
	max_score: number;
	grade?: string;
	feedback?: string;
	evaluation_date: string;
	scannedDocumentUri?: string;
}): Promise<Evaluation> {
	if (payload.scannedDocumentUri) {
		const form = new FormData();
		form.append('student', String(payload.student));
		form.append('class_group', String(payload.class_group));
		form.append('title', payload.title);
		form.append('evaluation_type', payload.evaluation_type);
		form.append('score', String(payload.score));
		form.append('max_score', String(payload.max_score));
		if (payload.grade) form.append('grade', payload.grade);
		if (payload.feedback) form.append('feedback', payload.feedback);
		form.append('evaluation_date', payload.evaluation_date);
		const fileName = payload.scannedDocumentUri.split('/').pop() || 'document.jpg';
		// @ts-ignore react native
		form.append('scanned_document', { uri: payload.scannedDocumentUri, type: 'image/jpeg', name: fileName });
		return await httpMultipart<Evaluation>('/evaluation/evaluations/', form, { method: 'POST' });
	}
	return await httpJson<Evaluation>('/evaluation/evaluations/', { method: 'POST', body: {
		student: payload.student,
		class_group: payload.class_group,
		title: payload.title,
		evaluation_type: payload.evaluation_type,
		score: payload.score,
		max_score: payload.max_score,
		grade: payload.grade,
		feedback: payload.feedback,
		evaluation_date: payload.evaluation_date,
	}});
}

export async function fetchOcrRequestCount(): Promise<number> {
	// DRF pagination returns {count, results}
	const resp = await httpJson<{ count: number; results: any[] }>('/evaluation/ocr-requests/');
	return resp.count ?? (Array.isArray((resp as any)) ? (resp as any).length : 0);
}

