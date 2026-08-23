import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

export const authApi = {
    register: (data) => api.post('/users', data),
    login: (data) => api.post('/users/login', data),
};

export const questionsApi = {
    getAll: () => api.get('/questions'),
};

export const reponsesApi = {
    getByUser: (userId) => api.get(`/reponses/user/${userId}`),
    getByUserAndDate: (userId, date) => api.get(`/reponses/user/${userId}/date/${date}`),
    save: (data) => api.post('/reponses', data),
};

export default api;
