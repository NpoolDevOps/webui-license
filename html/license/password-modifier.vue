<template>
    <el-form :model="passwordInfo" label-width="80px">
        <el-form-item label="當前用戶">
            <el-input v-model="passwordInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="舊密碼">
            <el-input v-model="passwordInfo.currentPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密碼">
            <el-input v-model="passwordInfo.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="確認密碼">
            <el-input v-model="passwordInfo.confirmPassword"></el-input>
        </el-form-item>
        <el-row>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button type="info" @click="onCancel">取消</el-button>
        </el-row>
    </el-form>
</template>
<script>
module.exports = {
    data () {
        return {
            passwordInfo: {
                username: '',
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            }
        }
    },
    methods: {
        onSubmit: function () {
            this.$emit('submit', this.passwordInfo)
        },
        onCancel: function() {
            this.$emit('cancel')
        }
    }
}
</script>