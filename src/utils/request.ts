import axios from 'axios';
import { getToken } from './storage';

const server = axios.create({
    baseURL: "http://localhost:8080",
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
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default server
