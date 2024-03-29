import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 角色api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function usedictApi() {
    return {
        addDict: (data?: object) => {
            return request({
                url: '/upms/dict/save',
                method: 'post',
                data
            });
        },
        updateDict: (data?: object) => {
            return request({
                url: '/upms/dict/update',
                method: 'post',
                data
            });
        },
        deleteDict: (dictId?: string) => {
            return request({
                url: '/upms/dict/remove/' + dictId,
                method: 'get'
            });
        },
        dictDetail: (dictId?: string) => {
            return request({
                url: '/upms/dict/detail/' + dictId,
                method: 'get'
            });
        },
        dictPage: (params?: object) => {
            return request({
                url: '/upms/dict/page',
                method: 'get',
                params
            });
        },
        getDictItems: (dictType?: object) => {
            return request({
                url: '/upms/dictItem/list/' + dictType,
                method: 'get'
            });
        },
    };
}
