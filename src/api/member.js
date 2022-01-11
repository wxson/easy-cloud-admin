import request from '@/utils/request'

/**
 * 会员分页查询
 * @param {*} query  查询条件
 * @returns 返回放平分页数据
 */
export function page(query) {
  return request({
    url: 'vip/member/base/page',
    method: 'post',
    data: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
