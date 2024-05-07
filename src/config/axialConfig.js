
// src/axiosConfig.js or a similar file
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vvkqufgiv7.execute-api.us-east-1.amazonaws.com/dev'
});

export default api;
