import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'font-awesome/css/font-awesome.min.css'


axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

createApp(App)
    .use(router)
    .use(VueSweetalert2)
    .mount('#app')
