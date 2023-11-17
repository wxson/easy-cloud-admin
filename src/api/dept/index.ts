import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 部门api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useDeptApi() {
    return {
        addDept: (data?: object) => {
            return request({
                url: '/upms/dept/save',
                method: 'post',
                data
            });
        },
        updateDept: (data?: object) => {
            return request({
                url: '/upms/dept/update',
                method: 'post',
                data
            });
        },
        deleteDept: (deptId?: string) => {
            return request({
                url: '/upms/dept/remove/' + deptId,
                method: 'get'
            });
        },
        deptDetail: (deptId?: string) => {
            return request({
                url: '/upms/dept/detail/' + deptId,
                method: 'get'
            });
        },
        deptTree: (params?: object) => {
            return request({
                url: '/upms/dept/tree',
                method: 'get',
                params
            });
        },
    };
}
