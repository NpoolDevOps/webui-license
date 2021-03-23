<template>
    <el-form :model="userInfo" label-width="80px">
        <el-form-item label="用戶名">
            <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密碼">
            <el-input v-model="userInfo.password"></el-input>
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
            userInfo: {
                username: '',
                password: '',
            }
        }
    },
    methods: {
        onSubmit: function () {
            this.$emit('submit', this.userInfo)
        },
        onCancel: function() {
            this.$emit('cancel')
        }
    }
}
</script>