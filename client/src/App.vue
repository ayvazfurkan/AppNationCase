<template>
    <div>
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            isLoggedIn: !!localStorage.getItem('token'),
        };
    },
    // if to.path changes, check if user is logged in
    watch: {
        $route(to) {
            this.isLoggedIn = !!localStorage.getItem('token');
            if(to.path === '/login') {
                if(this.isLoggedIn) {
                    this.$router.push('/users');
                }
            } else if(to.path === '/users') {
                if(!this.isLoggedIn) {
                    this.$router.push('/login');
                }
            } else {
                if(!this.isLoggedIn) {
                    this.$router.push('/login');
                } else {
                    this.$router.push('/users');
                }
            }
        }
    }
};
</script>