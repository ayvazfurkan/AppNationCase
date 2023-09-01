const axios = require('axios');

axios.defaults.baseURL = 'https://app-nation.onrender.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
module.exports = axios;
