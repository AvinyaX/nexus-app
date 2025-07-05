import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Change if your backend runs elsewhere
});

export default api;
