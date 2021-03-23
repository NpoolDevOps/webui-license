<template>
    <div>
       <el-table
           stripe
           v-if="showUserList"
           :data="userList">
           <el-table-column prop="username" label="用戶名"></el-table-column>
           <el-table-column prop="validate_date" label="授權過期時間"></el-table-column>
           <el-table-column prop="quota" label="授權設備總數"></el-table-column>
           <el-table-column prop="count" label="在線設備數"></el-table-column>
       </el-table>
       <el-table
           border
           show-header-overflow
           show-overflow
           highlight-hover-row
           :data="clientList">
           <el-table-column prop="client_sn" label="設備授權碼"></el-table-column>
           <el-table-column prop="client_user" label="所屬用戶"></el-table-column>
           <el-table-column prop="create_time" label="上線時間"></el-table-column>
           <el-table-column prop="status" label="狀態"></el-table-column>
       </el-table>
    </div>
</template>
<script>
module.exports = {
    data () {
        return {
            authCode: '',
            showUserList: false,
            modifiable: false,
            appId: '00000000-0000-0000-0000-000000000000',
            userList: [],
            clientList: [],
        }
    },
    created: function() {
        this.$on('get_license_list', this.getLicenseList);
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

                this.userList = resp.body.users;
                this.showUserList = resp.body.super_user;
                this.modifiable = !resp.body.visitor_only;
                this.clientList = resp.body.clients;
            })
        }
    }
}
</script>
<style scoped>
</style>
