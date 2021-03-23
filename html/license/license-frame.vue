<template>
    <div>
        <el-row>
            <el-button type="info" v-on:click="onModifyPassword">修改密碼</el-button>
            <el-button type="info" v-if="superUser">添加用戶</el-button>
            <el-button type="info" v-if="superUser">修改授權信息</el-button>
            <el-button type="info" v-if="superUser">修改設備狀態</el-button>
        </el-row>
       <el-table border stripe v-if="showUserList" :data="userList">
           <el-table-column prop="username" label="用戶名"></el-table-column>
           <el-table-column prop="validate_date" label="授權過期時間"></el-table-column>
           <el-table-column prop="quota" label="授權設備總數"></el-table-column>
           <el-table-column prop="count" label="在線設備數"></el-table-column>
       </el-table>
       <el-table border :data="clientList">
           <el-table-column prop="client_sn" label="設備授權碼"></el-table-column>
           <el-table-column prop="client_user" label="所屬用戶"></el-table-column>
           <el-table-column prop="create_time" label="上線時間"></el-table-column>
           <el-table-column prop="status" label="狀態"></el-table-column>
       </el-table>
       <el-dialog title="functionName" :visible.sync="showDialog" center :append-to-body="true" :lock-scroll="false" width="30%">
           <password-modifier v-if="functionModifyPassword"></password-modifier>
           <user-adder v-if="functionModifyPassword"></user-adder>
           <auth-modifier v-if="functionModifyPassword"></auth-modifier>
           <device-modifier v-if="functionModifyPassword"></device-modifier>
       </el-dialog> 
    </div>
</template>
<script>
import PasswordModifier from './password-modifier'
import UserAdder from './user-adder'
import AuthModifier from './auth-modifier'
import DeviceModifier from './device-modifier'

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
            functionName: '',
            showDialog: false,
            functionModifyPassword: false,
            functionAddUser: false,
            functionModifyAuth: false,
            functionModifyDeviceStatus: false,
        }
    },
    components: {
        PasswordModifier,
        UserAdder,
        AuthModifier,
        DeviceModifier,
    },
    created: function() {
        this.$on('get_license_list', this.getLicenseList);
        this.$on('modify_password', this.modifyPassword);
    },
    mounted: function() {
        this.$emit('get_license_list');
    },
    methods: {
        getLicenseList: function () {
            const axios = require('axios').default;

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

            }).catch(function (error) {
                ELEMENT.Notification({
                        title: '獲取客戶端列表失敗',
                        message: error.message,
			            type: 'error',
                    })
            })
        },
        onModifyPassword: function() {
            this.$emit('modify_password');
        },
        modifyPassword: function() {
            this.showDialog = true;
            this.functionModifyPassword = true;
        }
    }
}
</script>
<style scoped>
</style>
