<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        Login
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="login">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input v-model="username" autocomplete="off" type="text" class="form-control" id="username" placeholder="Enter username">
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input v-model="password" autocomplete="off" type="password" class="form-control" id="password" placeholder="Enter password">
                            </div>
                            <br>
                            <button type="submit" class="btn btn-primary" :disabled="username.length<2 || password.length<6" v-if="!loggingIn">Login</button>
                            <button type="submit" class="btn btn-primary" disabled v-if="loggingIn">Logging in...</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../axios.config";

export default {
    data() {
        return {
            username: '',
            password: '',
            loggingIn: false
        };
    },
    methods: {
        async login() {
            this.loggingIn = true;
            try {
                const response = await axios.post('/auth/login', {
                    username: this.username,
                    password: this.password
                });

                const data = response.data;

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.user.username);
                    localStorage.setItem('role', data.user.role);
                    this.$swal('Success', 'Login successful', 'success');
                    this.$router.push('/users');
                } else {
                    alert('Login failed, error: ' + data.error);
                }
            } catch (error) {
                console.error('Login error:', error);
            } finally {
                this.loggingIn = false;
            }
        }
    }
};
</script>