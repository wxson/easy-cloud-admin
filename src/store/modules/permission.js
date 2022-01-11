// import { asyncRoutes, constantRoutes } from '@/router'
// import { constantRoutes } from '@/router'
import { listUserMenu } from '@/api/menu'/* Layout */
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * Filter routing tables by recursion
 * @param routes asyncRoutes
 */
export function filterRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    tmp.meta = {
      title: tmp.title,
      icon: tmp.icon,
      affix: tmp.affix
    }
    if (tmp.children.length > 0) {
      tmp.component = Layout
      tmp.children = filterRoutes(tmp.children)
    } else {
      // 动态路由加载
      const component = tmp.component
      tmp.component = (resolve) => require([`@/views/${component}`], resolve)
    }
    res.push(tmp)
  })
  return res
}

/**
 * 绑定路由Actions
 * @param routes routes
 */
export function bindRouteActions(routes) {
  const map = new Map()

  routes.forEach(route => {
    map.set(route.name, route.actions)
  })

  return map
}

const state = {
  routes: [],
  addRoutes: [],
  routeActions: null
}

const mutations = {
  // 设置路由
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // state.routes = constantRoutes.concat(routes)
    state.routes = routes
  },
  // 设置Action Map
  SET_ACTION: (state, routes) => {
    // 绑定Actions
    state.routeActions = bindRouteActions(routes)
  }
}

const actions = {
  // generateRoutes({ commit }, roles) {
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     if (roles.includes('admin')) {
  //       accessedRoutes = asyncRoutes || []
  //     } else {
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     }
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // }

  // get user menu
  getRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      listUserMenu().then(response => {
        const { data } = response
        commit('SET_ACTION', data)
        const routes = filterRoutes(data)
        commit('SET_ROUTES', routes)
        resolve(routes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
