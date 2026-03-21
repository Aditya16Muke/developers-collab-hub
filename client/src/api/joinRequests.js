import api from './axios';

export const sendJoinRequest    = (data)           => api.post('/join-requests', data);
export const getProjectRequests = (projectId)      => api.get(`/join-requests/${projectId}`);
export const respondToRequest   = (id, status)     => api.put(`/join-requests/${id}`, { status });