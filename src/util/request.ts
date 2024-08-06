import axios from 'axios'

const server = axios.create({
    baseURL: "http://82.156.2.228:8080",
    // baseURL: "http://localhost:8080",
    timeout: 6000,
    headers: {}
})

server.interceptors.request.use(function (config) {
    config.headers["Access-Token"] = localStorage.getItem("fuint-admin-token")
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default server
