const licensePage = httpVueLoader('main/license.vue')
const routes = [
    {path: '/', component: licensePage},
]
const router = new VueRouter({
    routes: routes
})
export {router}
