<template>
    <div class="license-main">
        <licenseframe class="license-frame"></licenseframe>
    </div>
</template>
<script>
module.exports = {
    components: {
        'licenseframe': httpVueLoader('../license/license-frame.vue')
    }
}
</script>
<style scoped>
.license-frame {
    width: 100%;
    height: 100%;
}
.license-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-attachment: scroll; 
    background-repeat: no-repeat;
    background-size:100% 100%;
}
</style>