<template>
    <div>
        <el-table
            v-if="showUserList"
            :data="userList">
        </el-table>
        <el-table
            :data="clientList">
        </el-table>
    </div>
</template>
<script>
module.exports = {
    data () {
        return {
            authCode: '',
            showUserList: false,
            appId: '00000000-0000-0000-0000-000000000000',
            userList: [],
            clientList: [],
        }
    },
    created: function() {
         this.getLicenseList();
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
            })
        }
    }
}
</script>
<style scoped>
.login-tab-pane {
    font-weight: bold;
}
.login-form {
    margin-top: 20px;
    margin-right: 20px;
}
.login-hint {
    display: flex;
    justify-content: space-between;
}
</style>
