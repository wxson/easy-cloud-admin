import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 部门api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useDepartmentApi() {
    return {
        addDepartment: (data?: object) => {
            return request({
                url: '/department/save',
                method: 'post',
                data
            });
        },
        updateDepartment: (data?: object) => {
            return request({
                url: '/department/update',
                method: 'post',
                data
            });
        },
        deleteDepartment: (departmentId?: string) => {
            return request({
                url: '/department/remove/' + departmentId,
                method: 'get'
            });
        },
        departmentDetail: (departmentId?: string) => {
            return request({
                url: '/department/detail/' + departmentId,
                method: 'get'
            });
        },
        departmentTree: (params?: object) => {
            return request({
                url: '/department/tree',
                method: 'get',
                params
            });
        },
    };
}
