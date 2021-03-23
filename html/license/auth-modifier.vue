<template>
    <el-form :model="userInfo" label-width="80px">
        <el-form-item label="用戶名">
            <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="授權設備數">
            <el-input v-model="userInfo.quota" type="number"></el-input>
        </el-form-item>
        <el-form-item label="授權天數">
            <el-input v-model="userInfo.validate_time" type="number"></el-input>
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
                quota: 0,
                validate_time: 0,
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