<template>
    <div>
       <vxe-table
           border
           show-header-overflow
           show-overflow
           highlight-hover-row
           v-if="showUserList"
           :data="userList">
           <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
           <vxe-table-column field="username" title="用戶名"></vxe-table-column>
           <vxe-table-column field="validate_date" title="授權過期時間"></vxe-table-column>
           <vxe-table-column field="quota" title="授權設備總數"></vxe-table-column>
           <vxe-table-column field="count" title="在線設備數"></vxe-table-column>
       </vxe-table>
       <vxe-table
           border
           show-header-overflow
           show-overflow
           highlight-hover-row
           :data="clientList">
           <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
           <vxe-table-column field="client_sn" title="設備授權碼"></vxe-table-column>
           <vxe-table-column field="client_user" title="所屬用戶"></vxe-table-column>
           <vxe-table-column field="create_time" title="上線時間"></vxe-table-column>
           <vxe-table-column field="status" title="狀態"></vxe-table-column>
       </vxe-table>
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
