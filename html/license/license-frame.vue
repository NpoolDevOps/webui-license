<template>
    <div>
        <el-row>
            <el-button type="primary" @click="onModifyPassword">修改密碼</el-button>
            <el-button type="primary" v-if="superUser" @click="onAddUser">添加用戶</el-button>
            <el-button type="primary" v-if="superUser" @click="onModifyAuth">修改授權信息</el-button>
            <el-button type="primary" v-if="superUser">修改設備狀態</el-button>
        </el-row>
        <el-table border stripe v-if="showUserList" :data="registeredUserList">
           <el-table-column prop="username" label="用戶名"></el-table-column>
       </el-table>
       <el-table border stripe :data="userList">
           <el-table-column prop="username" label="用戶名"></el-table-column>
           <el-table-column prop="validate_date" label="授權過期時間"></el-table-column>
           <el-table-column prop="quota" label="授權設備總數"></el-table-column>
           <el-table-column prop="count" label="在線設備數"></el-table-column>
           <el-table-column prop="offline_count" label="離線設備數"></el-table-column>
           <el-table-column prop="disable_count" label="禁用設備數"></el-table-column>
           <el-table-column prop="maintain_count" label="維護中設備數"></el-table-column>
       </el-table>
       <el-table border :data="clientList">
           <el-table-column prop="client_sn" label="設備授權碼"></el-table-column>
           <el-table-column prop="client_user" label="所屬用戶"></el-table-column>
           <el-table-column prop="create_time" label="上線時間"></el-table-column>
           <el-table-column prop="status" label="狀態"></el-table-column>
           <el-table-column prop="network_type" label="應用類型"></el-table-column>
       </el-table>
       <el-dialog :title="functionName" :visible.sync="showDialog" center :append-to-body="true" :lock-scroll="false" width="30%" :show-close="false">
           <password-modifier v-if="functionModifyPassword" @submit="submitModifyPassword" @cancel="cancel"></password-modifier>
           <user-adder v-if="functionAddUser" @submit="submitAddUser" @cancel="cancel"></user-adder>
           <auth-modifier v-if="functionModifyAuth" @submit="submitModifyAuth" @cancel="cancel"></auth-modifier>
           <device-modifier v-if="functionModifyDeviceStatus"></device-modifier>
       </el-dialog> 
    </div>
</template>
<script>
module.exports = {
    data () {
        return {
            authCode: '',
            showUserList: false,
            modifiable: false,
            superUser: false,
            appId: '00000000-0000-0000-0000-000000000000',
            userList: [],
            clientList: [],
            registeredUserList: [],
            functionName: '',
            showDialog: false,
            functionModifyPassword: false,
            functionAddUser: false,
            functionModifyAuth: false,
            functionModifyDeviceStatus: false,
        }
    },
    components: {
        'password-modifier':httpVueLoader('./password-modifier.vue'),
        'auth-modifier':httpVueLoader('./auth-modifier.vue'),
        'device-modifier':httpVueLoader('./device-modifier.vue'),
        'user-adder':httpVueLoader('./user-adder.vue'),
    },
    created: function() {
        this.$on('get_license_list', this.getLicenseList);
        this.$on('modify_password', this.modifyPassword);
        this.$on('get_user_list', this.getUserList)
    },
    mounted: function() {
        this.$emit('get_license_list');
        this.$emit('get_user_list')
    },
    methods: {
        getUserList: function() {
            let authCode = this.$cookies.get('authcode');
            if (!authCode || authCode == '' || authCode == 'null') {
                ELEMENT.Notification({
                    title: '授權失敗',
                    message: '授權碼缺失: ' + authCode,
                    type: 'error',
                })
                return;
            }

             var self = this;
            axios({
                url: 'https://auth.npool.top/api/v0/user/list',
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                data: {
                    auth_code: authCode,
                },
            }).then(function (response) {
                let resp = response.data;

                if (resp.code != 0) {
                    ELEMENT.Notification({
                        title: '獲取用戶列表失敗',
                        message: resp.msg,
                        type: 'error',
                    })
                    return;
                }

                self.registeredUserList = [];
                resp.body.users.forEach((v, i) => self.registeredUserList.push({
                    username: v
                }))

            }).catch(function (error) {
                ELEMENT.Notification({
                        title: '獲取用戶列表失敗',
                        message: error.message,
                        type: 'error',
                    })
            })
        },
        getLicenseList: function () {
            let authCode = this.$cookies.get('authcode');
            if (!authCode || authCode == '' || authCode == 'null') {
                ELEMENT.Notification({
                    title: '授權失敗',
                    message: '授權碼缺失: ' + authCode,
                    type: 'error',
                })
                return;
            }

            var self = this;
            axios({
                url: 'https://license.npool.top/api/v0/client/myclients',
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                data: {
                    auth_code: authCode,
                },
            }).then(function (response) {
                let resp = response.data;

                if (resp.code != 0) {
                    ELEMENT.Notification({
                        title: '獲取客戶端列表失敗',
                        message: resp.msg,
                        type: 'error',
                    })
                    return;
                }

                self.userList = resp.body.users;
                self.showUserList = resp.body.super_user;
                self.modifiable = !resp.body.visitor_only;
                self.clientList = resp.body.clients;
                self.superUser = resp.body.super_user;

                self.userList.forEach((_, i)  => {
                    self.userList[i].count = 0;
                    self.userList[i].offline_count = 0;
                    self.userList[i].disable_count = 0;
                    self.userList[i].maintain_count = 0;
                })

                resp.body.clients.forEach((v, _) => {
                    self.userList.some((u, i) => {
                        if (u.username == v.client_user) {
                            if (v.status == 'online') {
                                self.userList[i].count += 1;
                            } else if (v.status == 'offline') {
                                self.userList[i].offline_count += 1;
                            } else if (v.status == 'disable') {
                                self.userList[i].disable_count += 1;
                            } else if (v.status == 'maintaining') {
                                self.userList[i].maintain_count += 1;
                            }
                            return true;
                        }
                    })
                    console.log(self.userList)
                })

            }).catch(function (error) {
                ELEMENT.Notification({
                        title: '獲取客戶端列表失敗',
                        message: error.message,
                        type: 'error',
                    })
            })
        },
        onAddUser: function() {
            this.showDialog = true;
            this.functionAddUser = true;
        },
        onModifyPassword: function() {
            this.$emit('modify_password');
        },
        submitAddUser: function(userInfo) {
            this.finishModify();
            if (userInfo.username == '') {
                ELEMENT.Notification({
                        title: '用戶名設置不符合規範',
                        message: '用戶名不能爲空',
                        type: 'error',
                    })
                return;
            }
            if (userInfo.password == '') {
                ELEMENT.Notification({
                        title: '密碼設置不符合規範',
                        message: '密碼不能爲空',
                        type: 'error',
                    })
                return;
            }

            let encPassword = sha256(userInfo.password).substring(0, 12)

            let authCode = this.$cookies.get('authcode');
            if (!authCode || authCode == '' || authCode == 'null') {
                ELEMENT.Notification({
                    title: '授權碼無效',
                    message: '授權碼缺失: ' + authCode,
                    type: 'error',
                })
                return;
            }

            axios({
                url: 'https://auth.npool.top/api/v0/user/create',
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                data: {
                    auth_code: authCode,
                    password: encPassword,
                    username: userInfo.username,
                },
            }).then(function (response) {
                let resp = response.data;

                if (resp.code != 0) {
                    ELEMENT.Notification({
                        title: '創建用戶失敗',
                        message: resp.msg,
                        type: 'error',
                    })
                }
            }).catch(function (error) {
                ELEMENT.Notification({
                        title: '創建用戶失敗',
                        message: error.message,
                        type: 'error',
                    })
            })
        },
        modifyPassword: function() {
            this.showDialog = true;
            this.functionModifyPassword = true;
        },
        finishModify: function() {
            this.showDialog = false;
            this.functionModifyPassword = false;
            this.functionAddUser = false;
            this.functionModifyAuth = false;
            this.functionModifyDeviceStatus = false;
        },
        submitModifyPassword: function(passwordInfo) {
            this.finishModify();
            if (passwordInfo.newPassword != passwordInfo.confirmPassword) {
                ELEMENT.Notification({
                        title: '密碼設置不符合規範',
                        message: '新密碼與確認密碼不一致',
                        type: 'error',
                    })
                return;
            }
            if (passwordInfo.currentPassword == passwordInfo.newPassword) {
                ELEMENT.Notification({
                        title: '密碼設置不符合規範',
                        message: '新密碼與舊密碼一樣',
                        type: 'error',
                    })
                return;
            }
            if (passwordInfo.newPassword == '') {
                ELEMENT.Notification({
                        title: '密碼設置不符合規範',
                        message: '新密碼不能爲空',
                        type: 'error',
                    })
                return;
            }

            let oldEncPassword = sha256(passwordInfo.currentPassword).substring(0, 12)
            let newEncPassword = sha256(passwordInfo.newPassword).substring(0, 12)

            let authCode = this.$cookies.get('authcode');
            if (!authCode || authCode == '' || authCode == 'null') {
                ELEMENT.Notification({
                    title: '授權碼無效',
                    message: '授權碼缺失: ' + authCode,
                    type: 'error',
                })
                return;
            }

            axios({
                url: 'https://auth.npool.top/api/v0/user/modifypwd',
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                data: {
                    auth_code: authCode,
                    new_password: newEncPassword,
                    old_password: oldEncPassword,
                },
            }).then(function (response) {
                let resp = response.data;

                if (resp.code != 0) {
                    ELEMENT.Notification({
                        title: '修改密碼失敗',
                        message: resp.msg,
                        type: 'error',
                    })
                }
            }).catch(function (error) {
                ELEMENT.Notification({
                        title: '修改密碼失敗',
                        message: error.message,
                        type: 'error',
                    })
            })
        },
        onModifyAuth: function() {
            this.showDialog = true;
            this.functionModifyAuth = true;
        },
        submitModifyAuth: function(userInfo) {
            this.finishModify();
            let authCode = this.$cookies.get('authcode');
            if (!authCode || authCode == '' || authCode == 'null') {
                ELEMENT.Notification({
                    title: '授權碼無效',
                    message: '授權碼缺失: ' + authCode,
                    type: 'error',
                })
                return;
            }

            axios({
                url: 'https://license.npool.top/api/v0/client/update_auth',
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                data: {
                    auth_code: authCode,
                    username: userInfo.username,
                    quota: parseInt(userInfo.quota, 10),
                    validate_date: parseInt(userInfo.validate_time, 10),
                },
            }).then(function (response) {
                let resp = response.data;

                if (resp.code != 0) {
                    ELEMENT.Notification({
                        title: '修改用戶授權失敗',
                        message: resp.msg,
                        type: 'error',
                    })
                }
            }).catch(function (error) {
                ELEMENT.Notification({
                        title: '修改用戶授權失敗',
                        message: error.message,
                        type: 'error',
                    })
            })
        },
        cancel: function() {
            this.finishModify();
        }
    }
}
</script>
<style scoped>
</style>
