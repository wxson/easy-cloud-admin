import request from '@/utils/request'

/**
 * 获取用户菜单列表
 * @returns 返回菜单列表
 */
export function listUserMenu() {
  return request({
    url: '/upms/menu/list',
    method: 'get'
  })
}

/**
 * 获取菜单列表
 * @param {*} data 请求参数
 * @returns 返回菜单列表
 */
export function listMenu(data) {
  return request({
    url: '/upms/menu/base/list',
    method: 'post',
    params: data
  })
}
