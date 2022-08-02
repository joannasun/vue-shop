import Vue from 'vue'
import Router from 'vue-router'
import store from 'store/index'

import Shop from 'pages/client/Shop'
import ShopLogin from 'pages/client/ShopLogin'
import ShopShow from 'pages/client/ShopShow'
import ShopIndex from 'pages/client/ShopIndex'
import GoodsDetail from 'pages/client/GoodsDetail'
import GoodsList from 'pages/client/GoodsList'
import Personal from 'pages/client/Personal'
import MyOrder from 'pages/client/MyOrder'
import MyData from 'pages/client/MyData'
import Cart from 'pages/client/Cart'
import ErrorPage from 'pages/ErrorPage'

import Backstage from 'pages/admin/Backstage'
import EditUser from 'pages/admin/EditUser' 
import EditAdmin from 'pages/admin/EditAdmin'
import Goods from 'pages/admin/Goods' 
import Orders from 'pages/admin/Orders' 
import EditOrders from 'pages/admin/EditOrders'
import EditGoods from 'pages/admin/EditGoods'
import EditComment from 'pages/admin/EditComment' 
import EditBatches from 'pages/admin/EditBatches'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/shop'
    },
    {
      path: '/login',
      name: 'ShopLogin',
      component: ShopLogin
    }, 
    {
      path: '/shop',
      name: 'Shop',
      component: Shop,
      redirect: '/shop/show',
      children:[
        {
          path: 'show',
          name: 'ShopShow',
          component: ShopShow,
          redirect:'/shop/show/index',
          children:[
            {
              path: 'index',
              name: 'ShopIndex',
              component: ShopIndex
            },{
              path: 'goodsList/:typeId/:keyword',
              name: 'GoodsList',
              component: GoodsList
            },
          ]
        },
        {
          path: 'goods/:id',
          name: 'GoodsDetail',
          component: GoodsDetail
        },
        {
          path: 'personal',
          name: 'Personal',
          component: Personal,
          redirect:'/shop/personal/cart',
          children:[
            {
              path: 'cart',
              name: 'Cart',
              component: Cart,
              meta: {
                requireLogin:true,
              },
            },{
              path: 'myData',
              name: 'MyData',
              component: MyData,
              meta: {
                requireLogin:true,
              },
            },{
              path: 'myOrder',
              name: 'MyOrder',
              component: MyOrder,
              meta: {
                requireLogin:true,
              },
            }
          ]
        }
      ]
    }, 
    {
      path: '/backstage',
      name: 'Backstage',
      redirect:"/backstage/editUser",
      component: Backstage,
      children: [
        {
          path: 'editUser',
          name: 'EditUser',
          component: EditUser,
          meta: {
            requireLogin:true,
          },
        },
        {
          path: 'editAdmin',
          name: 'EditAdmin',
          component: EditAdmin,
          meta: {
            requireLogin:true,
          },
        },
        {
          path: 'goods',
          name: 'Goods',
          component: Goods,
          meta: {
            requireLogin:true,
          },
        },
        {
          path: 'goods/:id',
          name: 'EditGoods',
          component: EditGoods,
          meta: {
            requireLogin:true,
          },
        },
        {
          path: 'goods/batch/:id',
          name: 'EditBatches',
          component: EditBatches,
          meta: {
            requireLogin:true,
          },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: {
            requireLogin:true,
          },
        },
        {
          path: 'orders/:id',
          name: 'EditOrders',
          component: EditOrders,
          meta: {
            requireLogin:true,
          },
        },{
          path: 'editComment',
          name: 'EditComment',
          component: EditComment,
          meta: {
            requireLogin:true,
          },
        }
      ]
    },
    {
  	  path: '*',
  	  name: 'ErrorPage',
  	  component: ErrorPage
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 登录拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requireLogin) {
    if (store.state.clientName || store.state.adminName) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router
