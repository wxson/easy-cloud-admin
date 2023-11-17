import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 角色api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useRoleApi() {
    return {
        addRole: (data?: object) => {
            return request({
                url: '/upms/role/save',
                method: 'post',
                data
            });
        },
        updateRole: (data?: object) => {
            return request({
                url: '/upms/role/update',
                method: 'post',
                data
            });
        },
        deleteRole: (roleId?: string) => {
            return request({
                url: '/upms/role/remove/' + roleId,
                method: 'get'
            });
        },
        roleDetail: (roleId?: string) => {
            return request({
                url: '/upms/role/detail/' + roleId,
                method: 'get'
            });
        },
        roleList: (params?: object) => {
            return request({
                url: '/upms/role/list',
                method: 'get',
                params
            });
        },
        rolePage: (params?: object) => {
            return request({
                url: '/upms/role/page',
                method: 'get',
                params
            });
        },
    };
}
