import axios from 'axios';

const api = axios.create({
    baseURL: 'https://java-project-4hxi.onrender.com' // 백엔드 주소 확인
});

// 모든 요청 전에 실행되는 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // 헤더에 토큰을 담아 보냅니다.
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;