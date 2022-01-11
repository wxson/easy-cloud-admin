import request from '@/utils/request'

/**
 * 用户分页查询
 * @param {*} query  查询条件
 * @returns 返回放平分页数据
 */
export function page(query) {
  return request({
    url: 'upms/user/base/page',
    method: 'post',
    data: query
  })
}

/**
 * 登录
 * @param {*} data 参数
 * @returns token
 */
export function login(data) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: data
  })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getInfo() {
  return request({
    url: '/upms/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
