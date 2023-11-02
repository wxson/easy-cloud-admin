import {createApp} from 'vue';
import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import {directive} from '/@/directive/index';
import {i18n} from '/@/i18n/index';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import * as Icons from '@element-plus/icons-vue'
import '/@/theme/index.scss';
import VueGridLayout from 'vue-grid-layout';
import {Session} from "/@/utils/storage";

const app = createApp(App);

directive(app);
other.elSvg(app);

// 手动退出登录
Session.clear();

// 动态绑定Icon组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key as keyof typeof Icons])
});

app.use(pinia).use(router).use(ElementPlus).use(i18n).use(VueGridLayout).mount('#app');
