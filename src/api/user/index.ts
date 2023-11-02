import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 用户api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useUserApi() {
    return {
        addUser: (data?: object) => {
            return request({
                url: '/user/save',
                method: 'post',
                data
            });
        },
        updateUser: (data?: object) => {
            return request({
                url: '/user/update',
                method: 'post',
                data
            });
        },
        deleteUser: (userId?: string) => {
            return request({
                url: '/user/remove/' + userId,
                method: 'get'
            });
        },
        userDetail: (userId?: string) => {
            return request({
                url: '/user/detail/' + userId,
                method: 'get'
            });
        },
        userBaseDetail: () => {
            return request({
                url: '/user/base/detail',
                method: 'get'
            });
        },
        userPage: (params?: object) => {
            return request({
                url: '/user/page',
                method: 'get',
                params
            });
        },
    };
}
