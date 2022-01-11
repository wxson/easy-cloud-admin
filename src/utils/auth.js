/**
 * 获取token
 * @returns token
 */
export function getToken() {
  return window.localStorage.getItem('token')
}

/**
 * 保存token
 * @param {*} token
 */
export function saveToken(token) {
  window.localStorage.setItem('token', token)
}

/**
 * 移除token
 */
export function removeToken() {
  window.localStorage.removeItem('token')
}
