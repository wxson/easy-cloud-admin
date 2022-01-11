import request from '@/utils/request'

/**
 * 订单分页查询
 * @param {*} query  查询条件
 * @returns 返回放平分页数据
 */
export function page(query) {
  return request({
    url: '/order/order/base/page',
    method: 'post',
    data: query
  })
}

/**
 * 获取订单详情
 * @param {*} id 订单ID
 * @returns  返回订单详情
 */
export function detailsById(id) {
  return request({
    url: '/order/order/base/details/' + id,
    method: 'get'
  })
}
