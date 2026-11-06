const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.dekakrens.com/api/v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
}

async function adminFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    removeAuthToken();
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${res.status}`);
  }

  return res.json();
}

// -----------------------------------------------------------------------------
// Auth
// -----------------------------------------------------------------------------
export async function adminLogin(email: string, password: string) {
  const data = await adminFetch<{
    token: string;
    user: { id: string; email: string; name: string; role: string };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setAuthToken(data.token);
  return data;
}

export async function adminGetMe() {
  return adminFetch<{
    userId: string;
    email: string;
    name: string;
    role: string;
  }>('/auth/me');
}

// -----------------------------------------------------------------------------
// Dashboard Stats
// -----------------------------------------------------------------------------
export async function adminGetStats() {
  return adminFetch<{
    totalArticles: number;
    totalProjects: number;
    totalInquiries: number;
    totalSkills: number;
  }>('/admin/stats');
}

// -----------------------------------------------------------------------------
// Wiki Articles
// -----------------------------------------------------------------------------
export async function adminGetArticles() {
  return adminFetch<any[]>('/admin/wiki/articles');
}

export async function adminGetArticle(id: string) {
  return adminFetch<any>(`/admin/wiki/articles/${id}`);
}

export async function adminCreateArticle(data: any) {
  return adminFetch<any>('/admin/wiki/articles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateArticle(id: string, data: any) {
  return adminFetch<any>(`/admin/wiki/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteArticle(id: string) {
  return adminFetch<{ success: boolean; id: string }>(`/admin/wiki/articles/${id}`, {
    method: 'DELETE',
  });
}

export async function adminGetWikiCategories() {
  return adminFetch<any[]>('/admin/wiki/categories');
}

// -----------------------------------------------------------------------------
// Projects
// -----------------------------------------------------------------------------
export async function adminGetProjects() {
  return adminFetch<any[]>('/admin/projects');
}

export async function adminGetProject(id: string) {
  return adminFetch<any>(`/admin/projects/${id}`);
}

export async function adminCreateProject(data: any) {
  return adminFetch<any>('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateProject(id: string, data: any) {
  return adminFetch<any>(`/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteProject(id: string) {
  return adminFetch<{ success: boolean; id: string }>(`/admin/projects/${id}`, {
    method: 'DELETE',
  });
}

// -----------------------------------------------------------------------------
// Inquiries
// -----------------------------------------------------------------------------
export async function adminGetInquiries() {
  return adminFetch<any[]>('/admin/inquiries');
}

export async function adminDeleteInquiry(id: string) {
  return adminFetch<{ success: boolean; id: string }>(`/admin/inquiries/${id}`, {
    method: 'DELETE',
  });
}

// -----------------------------------------------------------------------------
// Profile
// -----------------------------------------------------------------------------
export async function adminGetProfile() {
  return adminFetch<any>('/admin/profile');
}

export async function adminUpdateProfile(data: any) {
  return adminFetch<any>('/admin/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
