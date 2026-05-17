import axios from 'axios';

const API = axios.create({
    baseURL: 'https://localhost:44361/api'
});

export default API;