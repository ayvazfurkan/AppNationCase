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
                <td>New User</td>
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
            const response = await fetch('http://localhost:3000/users', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            this.users = await response.json();
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
                }
            })
            .then(async (result) => {
                if (result.value) {
                    try {
                        const response = await fetch(`http://localhost:3000/user/${user._id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: localStorage.getItem('token')
                            },
                            body: JSON.stringify({
                                username: result.value
                            })
                        });
                        const data = await response.json();
                        if (response.ok) {
                            user.username = data.user.username;
                            this.$swal('Updated', data.message, 'success');
                        } else {
                            this.$swal('Failed', data.error, 'error');
                        }
                    } catch (error) {
                        console.error('Error updating user:', error);
                    }
                }
            });

        },
        async createUser() {
            try {
                const response = await fetch(`http://localhost:3000/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        username: this.newUser.username,
                        password: this.newUser.password,
                        role: this.newUser.role,
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    this.users.push(data.user);
                    this.newUser.username = '';
                    this.newUser.role = '';
                    this.$swal('Success', 'User created successfully with password: ' + this.newUser.password, 'success');
                } else {
                    this.$swal('Failed', data.error, 'error');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
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
                        const response = await fetch(`http://localhost:3000/user/${user._id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: localStorage.getItem('token')
                            }
                        });
                        const data = await response.json();
                        if (response.ok) {
                            const index = this.users.indexOf(user);
                            this.users.splice(index, 1);
                            this.$swal("Deleted!", user.username + " has been deleted!", "success");
                        } else {
                            this.$swal('Failed', data.error, 'error');
                        }
                    } catch (error) {
                        console.error('Error deleting user:', error);
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
            this.$swal('Logged Out','Logged out successfully', 'success');
            this.$router.push('/login');
        }
    }
};
</script>