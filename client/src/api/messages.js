import api from './axios';

export const fetchMessages = (projectId) => api.get(`/messages/${projectId}`);