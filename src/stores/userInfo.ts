import {defineStore} from 'pinia';
import Cookies from 'js-cookie';
import {Session} from '/@/utils/storage';
import {useUserApi} from "/@/api/user";

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
    state: (): UserInfosState => ({
        userInfos: {
            nickName: '',
            userName: '',
            avatar: '',
            channel: '',
            roles: [],
            permissions: [],
        },
    }),
    actions: {
        async setUserInfos() {
            // 存储用户信息到浏览器缓存
            if (Session.get('userInfo')) {
                this.userInfos = Session.get('userInfo');
            } else {
                // 获取用户基本信息详情
                const res = await useUserApi().userBaseDetail();
                if (res.code === 0) {
                    const userInfos = <UserInfos>res.data;
                    Session.set('userInfo', userInfos);
                    Cookies.set('userName', res.data.nickName);
                    this.userInfos = userInfos;
                }
            }
        }
    },
});
