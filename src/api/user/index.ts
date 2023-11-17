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
                url: '/upms/user/save',
                method: 'post',
                data
            });
        },
        updateUser: (data?: object) => {
            return request({
                url: '/upms/user/update',
                method: 'post',
                data
            });
        },
        deleteUser: (userId?: string) => {
            return request({
                url: '/upms/user/remove/' + userId,
                method: 'get'
            });
        },
        userDetail: (userId?: string) => {
            return request({
                url: '/upms/user/detail/' + userId,
                method: 'get'
            });
        },
        userBaseDetail: () => {
            return request({
                url: '/upms/user/base/detail',
                method: 'get'
            });
        },
        userPage: (params?: object) => {
            return request({
                url: '/upms/user/page',
                method: 'get',
                params
            });
        },
    };
}
