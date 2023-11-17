import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 租户api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useTenantApi() {
    return {
        addTenant: (data?: object) => {
            return request({
                url: '/upms/tenant/save',
                method: 'post',
                data
            });
        },
        updateTenant: (data?: object) => {
            return request({
                url: '/upms/tenant/update',
                method: 'post',
                data
            });
        },
        deleteTenant: (tenantId?: string) => {
            return request({
                url: '/upms/tenant/remove/' + tenantId,
                method: 'get'
            });
        },
        tenantDetail: (tenantId?: string) => {
            return request({
                url: '/upms/tenant/detail/' + tenantId,
                method: 'get'
            });
        },
        tenantPage: (params?: object) => {
            return request({
                url: '/upms/tenant/page',
                method: 'get',
                params
            });
        },
    };
}
