<template>
    <div class="container mt-5">
        <h2>User List
            <button class="btn btn-danger" style="float: right; margin-left: 5px" @click="logout()">
                <i class="fa fa-sign-out"></i>
                Logout
            </button>
            <span class="btn btn-success" style="float:right;">
                <i class="fa fa-user"></i> {{username}} [{{role}}]</span>
        </h2>
        <table class="table table-bordered table-hover table-striped">
            <thead>
            <tr>
                <th>Order</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, index) in users" :key="index">
                <td>{{index+1}}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.role }}</td>
                <td>
                    <button class="btn btn-primary btn-sm" @click="editUser(user)">
                        <i class="fa fa-edit"></i>
                        Edit</button>
                    <button class="btn btn-danger btn-sm m-1" @click="deleteUser(user)">
                        <i class="fa fa-trash"></i>
                        Delete</button>
                </td>
            </tr>
            <tr v-if="!fetching">
                <td>New User<br><i>No token needed</i></td>
                <td>
                    <input type="text" v-model="newUser.username" class="form-control" placeholder="Enter username">
                </td>
                <td>
                    <select class="form-control" v-model="newUser.role">
                        <option value="">Select role</option>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-success btn-sm" @click='createUser()' :disabled="newUser.username.trim().length<3 || !newUser.role">
                        <i class="fa fa-save"></i>
                        Save
                    </button>
                </td>
            </tr>
            <tr v-if="fetching">
                <td colspan="4" style="text-align: center">
                    Fetching Users..
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import axios from "../../axios.config";

export default {
    data() {
        return {
            newUser: {
                username: '',
                password: '123456',
                role: ''
            },
            users: [],
            username: localStorage.getItem('username'),
            role: localStorage.getItem('role'),
            fetching: false
        };
    },
    async created() {
        if(!localStorage.getItem('token')) {
            this.$router.push('/login');
            return;
        }
        try {
            this.fetching = true;
            const response = await axios.get('/users');
            this.users = await response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            this.fetching = false;
        }
    },
    methods: {
        editUser(user) {
            this.$swal({
                title: 'Update ' + user.username,
                input: 'text',
                inputPlaceholder: 'Update your name',
                showCloseButton: true,
                confirmButtonText: "Update",
                inputValidator: (value) => {
                    return !value && 'You need to write something!'
                },
                inputValue: user.username,
            })
            .then(async (result) => {
                if (result.value) {
                    try {
                        const response = await axios.put(`/user/${user._id}`, {
                            username: result.value
                        });
                        const data = await response.data;
                        if (response.status === 201) {
                            user.username = data.user.username;
                            this.$swal('Updated', data.message, 'success');
                        } else {
                            this.$swal('Failed', data.error, 'error');
                        }
                    } catch (error) {
                        this.$swal('Failed', error.response.data.error, 'error');
                    }
                }
            });

        },
        async createUser() {
            try {
                const response = await axios.post(`/auth/register`, {
                        username: this.newUser.username,
                        password: this.newUser.password,
                        role: this.newUser.role,
                });
                const data = await response.data;
                if (response.status === 201) {
                    this.users.push(data.user);
                    this.newUser.username = '';
                    this.newUser.role = '';
                    this.$swal('Success', 'User created successfully with password: ' + this.newUser.password, 'success');
                } else {
                    this.$swal('Failed', data.error, 'error');
                }
            } catch (error) {
                this.$swal('Failed', error.response.data.error, 'error');
            }
        },
        async deleteUser(user) {
            this.$swal({
                icon: "warning",
                title: "Are you sure?",
                html: "You are about to <b>delete</b> the <b>" + user.role + '</b> roled user <b>' + user.username + '</b>!',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false
            })
            .then(async (willDelete) => {
                if (willDelete.value) {
                    try {
                        const response = await axios.delete(`/user/${user._id}`);
                        const data = await response.data;
                        if (response.status === 204) {
                            const index = this.users.indexOf(user);
                            this.users.splice(index, 1);
                            this.$swal("Deleted!", user.username + " has been deleted!", "success");
                        } else {
                            this.$swal('Failed', data.error, 'error');
                        }
                    } catch (error) {
                        this.$swal('Failed', error.response.data.error, 'error');
                    }
                } else {
                    this.$swal("Cancelled", "User is safe", "success");
                }
            });
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            this.$swal({
                icon: 'success',
                title: 'Logged Out Successfully',
                showConfirmButton: true,
                timer: 1000
            });
            this.$router.push('/login');
        }
    }
};
</script>