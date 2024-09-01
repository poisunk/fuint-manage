import axios from 'axios';
import { getToken } from './storage';
import router from '../router';
import { useUserStore } from '../store/user';

const server = axios.create({
    baseURL: "http://82.156.2.228:8080",
    // baseURL: "http://localhost:8080",
    timeout: 6000,
    headers: {}
})

server.interceptors.request.use(function (config) {
    config.headers["Access-Token"] = getToken("Access-Token");
    return config;
}, function (error) {
    return Promise.reject(error);
});

server.interceptors.response.use(function (response) {
    if (response.data.code === 401 || response.data.code === 1001) {
        const userStore = useUserStore();
        userStore.logout().then(() => {
            router.push("/login");
        });
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default server
