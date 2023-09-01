import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '@/components/UserLogin.vue';
import UserList from '@/components/UserList.vue';

const routes = [
    {
        path: '/login',
        name: 'UserLogin',
        component: UserLogin,
    },
    {
        path: '/users',
        name: 'UserList',
        component: UserList,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
