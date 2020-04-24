import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
// export const constantRouterMap = [
const router = new Router({
    mode: 'history', //去除#
    routes: [{
            path: '/login',
            component: () =>
                import ('@/views/login/index'),
            hidden: true,
        },
        {
            path: '/signup',
            component: () =>
                import ('@/views/login/signup'),
            hidden: true,
        },
        {
            path: '/forgetPassword',
            component: () =>
                import ('@/views/login/forgetPassword'),
            hidden: true,
        },
        {
            path: '/404',
            component: () =>
                import ('@/views/errorPage/404'),
            hidden: true
        },
        {
            path: '/403',
            component: () =>
                import ('@/views/errorPage/403'),
            hidden: true
        },
        {
            path: '/500',
            component: () =>
                import ('@/views/errorPage/500'),
            hidden: true
        },
        {
            path: '/error',
            component: () =>
                import ('@/views/errorPage/error'),
            hidden: true
        },
        {
            path: '/',
            component: Layout,
            redirect: '/home',
            name: 'Home',
            roles: "common",
            children: [{
                path: 'home',
                component: () =>
                    import ('@/views/homePage/index'),
                name: 'home',
                meta: { title: '首页', icon: 'dashboard', noCache: true }
            }]
        },
        {
            path: '/',
            component: Layout,
            redirect: '/information',
            name: 'information',
            isShow: false,

            children: [{
                path: 'information',
                component: () =>
                    import ('@/views/information/index'),
                name: 'information',
                meta: { title: '个人信息', icon: 'dashboard', noCache: false },

            }]
        },
        {
            path: '/',
            component: Layout,
            redirect: '/roleManage',
            name: 'roleManage',
            roles: "superAdmin",
            children: [{
                path: 'roleManage',
                component: () =>
                    import ('@/views/roleManage/index'),
                name: 'roleManage',
                meta: { title: '角色管理', icon: 'nested' },
            }]
        },
        {
            path: '/roleManage',
            component: Layout,
            name: 'roleManage1',
            isShow: false,
            meta: {
                title: '角色管理'
            },
            roles: "superAdmin",
            children: [{
                path: 'permissionAssignment',
                component: () =>
                    import ('@/views/roleManage/permissionAssignment'),
                name: 'permissionAssignment',
                meta: { title: '权限分配', bread: true },
            }]
        },
        {
            path: '/',
            component: Layout,
            redirect: '/userManage',
            name: 'User',
            roles: "superAdmin",
            bread: true,
            children: [{
                    path: 'userManage',
                    name: 'userManage',
                    component: () =>
                        import ('@/views/userManage/index'),
                    meta: { title: '用户管理', icon: 'user' }
                },

            ]
        },
        {
            path: '/userManage',
            component: Layout,
            name: 'userManage1',
            isShow: false,
            meta: {
                title: '用户管理'
            },
            roles: "superAdmin",
            children: [{
                path: 'permissionAssignment',
                component: () =>
                    import ('@/views/userManage/permissionAssignment'),
                name: 'permissionAssignment',
                meta: { title: '权限分配', bread: true },
            }]
        },
        {
            path: '/',
            component: Layout,
            redirect: '/menuManage',
            name: 'menuManage',
            roles: "superAdmin",
            bread: true,
            children: [{
                    path: 'menuManage',
                    name: 'menuManage',
                    component: () =>
                        import ('@/views/menuManage/index'),
                    meta: { title: '菜单管理', icon: 'component' }
                },

            ]
        },
        {
            path: '/',
            component: Layout,
            redirect: '/dataDictionary',
            name: 'dataDictionary',
            roles: "superAdmin",
            bread: true,
            children: [{
                    path: 'dataDictionary',
                    name: 'dataDictionary',
                    component: () =>
                        import ('@/views/dataDictionary/dictionaryList'),
                    meta: { title: '数据字典列表', icon: 'tree' }
                },

            ]
        },
        {
            path: '/',
            component: Layout,
            redirect: '/dataDictionary',
            name: 'dataDictionary1',
            isShow: false,
            bread: true,
            meta: {
                title: '数据字典列表'
            },
            children: [{
                path: 'dataDictionary/addDictionary',
                component: () =>
                    import ('@/views/dataDictionary/addDictionary'),
                name: 'addDictionary',
                meta: { title: '数据字典', icon: 'dashboard', noCache: false },

            }]
        },
        { path: '*', redirect: '/404', hidden: true },
        { path: '*', redirect: '/403', hidden: true },
    ]

})


// 未登陆过滤路由
const whiteList = ['/login']; //不需要登录能访问的path
router.beforeEach((to, from, next) => {
    // console.log('beforeEach');
    var userInfo = JSON.parse(localStorage.getItem('isLogin')); //获取缓存看是否登录过
    var time = localStorage.getItem('loginTime');
    var nowTime = new Date().getTime();
    if (whiteList.indexOf(to.path) < 0) { //访问了需要登录才能访问的页面
        if (userInfo === true && nowTime <= time + 604800000) { //登录过来直接进去，七天内登录不需要重新登录
            next();
        } else {
            if (to.path == '/login' || to.path == '/signup') {
                next();
            } else {
                next('/login');
            }
        }
    } else {
        next();
    }
});


// export default new Router({
//     scrollBehavior: () => ({ y: 0 }),
//     routes: constantRouterMap,
//     mode: 'history', //去除#
// })
export default router