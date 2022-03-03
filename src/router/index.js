import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/community',
    component: Layout,
    redirect: '/community',
    name: '社区管理',
    meta: { title: '社区信息管理', icon: 'example' },
    children: [
      {
        path: 'community/list',
        name: '社区信息管理',
        component: () => import('@/views/community/communityinfo/list'),
        meta: { title: '社区信息管理' }
      },
      {
        path: 'community/add',
        name: '新增社区',
        component: () => import('@/views/community/communityinfo/add'),
        meta: { title: '新增社区' },
        hidden:true
      }
    ]
  },

  {
    path: '/community/',
    component: Layout,
    redirect: '/community/buildingInfo',
    name: '房产管理',
    meta: { title: '房产信息管理', icon: 'example' },
    children: [

       {
        path: 'house/list',
        name: '房产信息管理',
        component: () => import('@/views/community/houseInfo/list'),
        meta: { title: '房产管理' }
      },
      {
        path: 'house/add',
        name: '新增楼栋',
        component: () => import('@/views/community/houseInfo/add'),
        meta: { title: '新增楼栋' },
        hidden:true
      },
      {
        path: 'building/list',
        name: '楼栋信息管理',
        component: () => import('@/views/community/buildingInfo/list'),
        meta: { title: '楼栋管理' }
      },
      {
        path: 'building/add',
        name: '新增楼栋',
        component: () => import('@/views/community/buildingInfo/add'),
        meta: { title: '新增楼栋' },
        hidden:true
      }
    ]
  },

  {
    path: '/parkingSpace',
    component: Layout,
    redirect: '/parkingSpace',
    name: '停车位管理',
    meta: { title: '停车位管理', icon: 'example' },
    children: [
      {
        path: 'packingSpace/list',
        name: '停车位管理',
        component: () => import('@/views/community/parkingSpaceInfo/list'),
        meta: { title: '停车位信息管理' }
      },
      {
        path: 'packingSpace/add',
        name: '新增停车位',
        component: () => import('@/views/community/parkingSpaceInfo/add'),
        meta: { title: '新增停车位管理' },
        hidden:true
      },
      {
        path: 'packingSpaceUse/list',
        name: '停车位使用管理',
        component: () => import('@/views/community/parkingUseInfo/list'),
        meta: { title: '停车位使用管理' }
      },
      {
        path: 'packingSpaceUse/add',
        name: '新增停车位使用情况',
        component: () => import('@/views/community/parkingUseInfo/add'),
        meta: { title: '新增停车位使用情况' },
        hidden:true
      }
    ]
  },

 
  {
    path: '/userInfo',
    component: Layout,
    redirect: '/userInfo/user',
    name: '业主信息管理',
    meta: { title: '业主信息管理', icon: 'example' },
    children: [
      {
        path: 'user',
        name: '人员管理',
        component: () => import('@/views/userInfo/user/list'),
        meta: { title: '人员管理' }
      },
      {
        path: 'car/list',
        name: '车辆管理',
        component: () => import('@/views/userInfo/car/list'),
        meta: { title: '车辆管理' }
      },
      {
        path: 'car/add',
        name: '新增车辆',
        component: () => import('@/views/userInfo/car/add'),
        meta: { title: '新增车辆' },
        hidden:true
      },
      {
        path: 'pet/list',
        name: '宠物管理',
        component: () => import('@/views/userInfo/pet/list'),
        meta: { title: '宠物管理' }
      },

      {
        path: 'pet/add',
        name: '新增宠物',
        component: () => import('@/views/userInfo/pet/add'),
        meta: { title: '新增宠物' },
        hidden:true
      },

    ]
  },
  {
    path: '/deviceInfo',
    component: Layout,
    redirect: '/deviceInfo/device',
    name: '资产信息管理',
    meta: { title: '资产信息管理', icon: 'example' },
    children: [
      {
        path: 'device/list',
        name: '资产设备列表',
        component: () => import('@/views/community/deviceInfo/list'),
        meta: { title: '资产设备列表' }
      },
      {
        path: 'device/add',
        name: '添加资产',
        component: () => import('@/views/community/deviceInfo/add'),
        meta: { title: '添加资产' },
        hidden:true
      }

    ]
  },
  {
    path: '/expenseInfo',
    component: Layout,
    redirect: '/expenseInfo/expense',
    name: '收费管理',
    meta: { title: '收费信息管理', icon: 'example' },
    children: [
      {
        path: 'expenseProject/list',
        name: '收费项目',
        component: () => import('@/views/community/expenseInfo/expenseProject/list'),
        meta: { title: '收费项目' }
      },
      {
        path: 'expenses/list',
        name: '收费详情',
        component: () => import('@/views/community/expenseInfo/expense/list'),
        meta: { title: '收费详情' }
      },
      {
        path: 'expenses/add',
        name: '添加收费详情',
        component: () => import('@/views/community/expenseInfo/expense/add'),
        meta: { title: '添加收费详情' },
        hidden:true
      }

    ]
  },



  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
