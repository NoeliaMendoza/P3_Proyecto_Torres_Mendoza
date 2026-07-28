import api from '../api/axios';

export const getAIStatus = async () =>
  (await api.get('/ai/status')).data;

export const askLocalAssistant = async (question, history) =>
  (await api.post('/ai/chat', { question, history })).data;
