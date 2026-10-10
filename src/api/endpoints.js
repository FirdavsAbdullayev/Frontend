import api from './client';

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
  inviteInfo: (token) => api.get(`/auth/invite/${token}`),
  acceptInvite: (payload) => api.post('/auth/invite/accept', payload),
  changePassword: (payload) => api.post('/auth/change-password', payload),
};

export const usersApi = {
  list: (params) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  create: (payload) => api.post('/users', payload),
  update: (id, payload) => api.patch(`/users/${id}`, payload),
  resendInvite: (id) => api.post(`/users/${id}/invite`),
  deactivate: (id) => api.delete(`/users/${id}`),
  activate: (id) => api.patch(`/users/${id}`, { is_active: true }),
};

export const companiesApi = {
  list: (params) => api.get('/companies', { params }),
  get: (id) => api.get(`/companies/${id}`),
  create: (payload) => api.post('/companies', payload),
  update: (id, payload) => api.patch(`/companies/${id}`, payload),
};

export const deploymentsApi = {
  list: (params) => api.get('/deployments', { params }),
  get: (id) => api.get(`/deployments/${id}`),
  create: (payload) => api.post('/deployments', payload),
  update: (id, payload) => api.patch(`/deployments/${id}`, payload),
  changeStatus: (id, payload) => api.post(`/deployments/${id}/status`, payload),
  complete: (id, payload) => api.post(`/deployments/${id}/complete`, payload),
  progress: (id) => api.get(`/deployments/${id}/progress`),
};

export const dailyLogsApi = {
  list: (params) => api.get('/daily-logs', { params }),
  get: (id) => api.get(`/daily-logs/${id}`),
  create: (payload) => api.post('/daily-logs', payload),
  update: (id, payload) => api.patch(`/daily-logs/${id}`, payload),
  submit: (id) => api.post(`/daily-logs/${id}/submit`),
  approve: (id) => api.post(`/daily-logs/${id}/approve`),
  reject: (id, reason) => api.post(`/daily-logs/${id}/reject`, { reason }),
  remove: (id) => api.delete(`/daily-logs/${id}`),
};

export const weeklyReportsApi = {
  list: (params) => api.get('/weekly-reports', { params }),
  get: (id) => api.get(`/weekly-reports/${id}`),
  save: (payload) => api.post('/weekly-reports', payload),
  evaluate: (id, payload) => api.post(`/weekly-reports/${id}/evaluate`, payload),
};

export const auditApi = {
  list: (params) => api.get('/audit-logs', { params }),
};

export const remindersApi = {
  list: (params) => api.get('/reminders', { params }),
  run: () => api.post('/reminders/run'),
};

const downloadBlob = (response, filename) => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const exportApi = {
  deployments: async (params) => {
    const res = await api.get('/export/deployments.csv', { params, responseType: 'blob' });
    downloadBlob(res, `amaliyot_natijalari_${new Date().toISOString().slice(0, 10)}.csv`);
  },
  attendance: async (params) => {
    const res = await api.get('/export/attendance.csv', { params, responseType: 'blob' });
    downloadBlob(res, `davomat_jurnali_${new Date().toISOString().slice(0, 10)}.csv`);
  },
};
