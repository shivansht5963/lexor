// Lightweight HTTP client for the Expo frontend to talk to the Django backend
// Uses Token authentication when a token is set via setAuthToken

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Prefer env, fall back to localhost for development
// IMPORTANT: Replace with your computer's local IP address for mobile access
export const API_BASE_URL: string = (process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.108:8000/api').replace(/\/$/, '');

let inMemoryAuthToken: string | null = null;

export function setAuthToken(token: string | null): void {
	inMemoryAuthToken = token;
	try {
		if (typeof window !== 'undefined' && 'localStorage' in window) {
			if (token) {
				window.localStorage.setItem('authToken', token);
			} else {
				window.localStorage.removeItem('authToken');
			}
		}
	} catch {}
}

export function getAuthToken(): string | null {
	if (inMemoryAuthToken) {
		return inMemoryAuthToken;
	}
	try {
		if (typeof window !== 'undefined' && 'localStorage' in window) {
			const token = window.localStorage.getItem('authToken');
			inMemoryAuthToken = token;
			return token;
		}
	} catch {}
	return null;
}

type JsonBody = Record<string, unknown> | undefined;

export async function httpJson<TResponse>(path: string, options: {
	method?: HttpMethod;
	body?: JsonBody;
	additionalHeaders?: Record<string, string>;
} = {}): Promise<TResponse> {
	const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.additionalHeaders || {}),
	};

	const token = getAuthToken();
	if (token) {
		headers['Authorization'] = `Token ${token}`;
	}

	const response = await fetch(url, {
		method: options.method || 'GET',
		headers,
		body: options.body ? JSON.stringify(options.body) : undefined,
	});

	if (!response.ok) {
		let errorPayload: any = undefined;
		try {
			errorPayload = await response.json();
		} catch {}
		const error = new Error(`HTTP ${response.status}`);
		(error as any).details = errorPayload;
		throw error;
	}

	// Some endpoints may return 204 No Content
	if (response.status === 204) {
		return undefined as unknown as TResponse;
	}

	return (await response.json()) as TResponse;
}

export async function httpMultipart<TResponse>(path: string, formData: FormData, options: {
	method?: Extract<HttpMethod, 'POST' | 'PUT' | 'PATCH'>;
	additionalHeaders?: Record<string, string>;
} = {}): Promise<TResponse> {
	const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
	const headers: Record<string, string> = {
		...(options.additionalHeaders || {}),
	};

	const token = getAuthToken();
	if (token) {
		headers['Authorization'] = `Token ${token}`;
	}

	const response = await fetch(url, {
		method: options.method || 'POST',
		headers,
		body: formData,
	});

	if (!response.ok) {
		let errorPayload: any = undefined;
		try {
			errorPayload = await response.json();
		} catch {}
		const error = new Error(`HTTP ${response.status}`);
		(error as any).details = errorPayload;
		throw error;
	}

	return (await response.json()) as TResponse;
}

