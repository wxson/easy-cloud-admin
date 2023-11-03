<template>
  <div class="system-menu-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="menuDialogFormRef" :model="state.ruleForm" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="上级菜单" prop="parentId">
              <el-cascader
                  :options="state.menuData"
                  :props="{ checkStrictly: true, value: 'id', label: 'title' }"
                  placeholder="请选择上级菜单"
                  clearable
                  class="w100"
                  v-model="state.ruleForm.parentId"
                  @change="handleCascaderChangeEvent"
              >
                <template #default="{ node, data }">
                  <span>{{ data.title }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="state.ruleForm.type">
                <el-radio label="MENU">菜单</el-radio>
                <el-radio label="BUTTON">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="state.ruleForm.title" placeholder="格式：message.router.xxx" clearable/>
            </el-form-item>
          </el-col>
          <template v-if="state.ruleForm.type === 'MENU'">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="路由名称" prop="name">
                <el-input v-model="state.ruleForm.name" placeholder="路由中的 name 值" clearable/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="路由路径" prop="path">
                <el-input v-model="state.ruleForm.path" placeholder="路由中的 path 值" clearable/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="重定向" prop="redirect">
                <el-input v-model="state.ruleForm.redirect" placeholder="请输入路由重定向" clearable/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="菜单图标" prop="icon">
                <IconSelector placeholder="请输入菜单图标" v-model="state.ruleForm.icon"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="组件路径" prop="component">
                <el-input v-model="state.ruleForm.component" placeholder="组件路径" clearable/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="链接地址" prop="linkUrl">
                <el-input
                    v-model="state.ruleForm.linkUrl"
                    placeholder="外链/内嵌时链接地址（http:xxx.com）"
                    clearable
                    :disabled="!state.ruleForm.isLink"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="权限标识" prop="perms">
                <el-input v-model="state.ruleForm.perms" placeholder="层级：如system:menu:add" clearable/>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="state.ruleForm.type === 'BUTTON'">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="权限标识" prop="perms">
                <el-input v-model="state.ruleForm.perms" placeholder="层级：如system:menu:add" clearable/>
              </el-form-item>
            </el-col>
          </template>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="菜单排序" prop="sort">
              <el-input-number v-model="state.ruleForm.sort" controls-position="right" placeholder="请输入排序"
                               class="w100"/>
            </el-form-item>
          </el-col>
          <template v-if="state.ruleForm.type === 'MENU'">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否隐藏" prop="isHidden">
                <el-radio-group v-model="state.ruleForm.isHidden">
                  <el-radio :label="true">隐藏</el-radio>
                  <el-radio :label="false">不隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="页面缓存" prop="isKeepAlive">
                <el-radio-group v-model="state.ruleForm.isKeepAlive">
                  <el-radio :label="true">缓存</el-radio>
                  <el-radio :label="false">不缓存</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否固定" prop="isAffix">
                <el-radio-group v-model="state.ruleForm.isAffix">
                  <el-radio :label="true">固定</el-radio>
                  <el-radio :label="false">不固定</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否外链" prop="isLink">
                <el-radio-group v-model="state.ruleForm.isLink" :disabled="state.ruleForm.isIframe">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否内嵌" prop="isIframe">
                <el-radio-group v-model="state.ruleForm.isIframe" @change="onSelectIframeChange">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemMenuDialog">
import {defineAsyncComponent, nextTick, onMounted, reactive, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {i18n} from '/@/i18n/index';
import {useRequestOldRoutes} from "/@/stores/requestOldRoutes";
import {setBackEndControlRefreshRoutes} from "/@/router/backEnd";
import {useMenuApi} from "/@/api/menu";
// import { setBackEndControlRefreshRoutes } from "/@/router/backEnd";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

// 定义变量内容
const menuDialogFormRef = ref();
const stores = useRequestOldRoutes();
const {requestOldRoutes} = storeToRefs(stores);

const state = reactive({
  // 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
  ruleForm: {
    id: undefined, // 上级菜单
    parentId: [], // 上级菜单
    type: 'MENU', // 菜单类型
    name: '', // 路由名称
    component: '', // 组件路径
    isLink: false, // 是否外链
    sort: 0, // 菜单排序
    path: '', // 路由路径
    redirect: '', // 路由重定向，有子集 children 时
    title: '', // 菜单名称
    perms: '', // 权限标识
    icon: '', // 菜单图标
    isHidden: false, // 是否隐藏
    isKeepAlive: true, // 是否缓存
    isAffix: false, // 是否固定
    linkUrl: '', // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink: 链接地址不为空`
    isIframe: false, // 是否内嵌，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
  },
  menuData: [] as RouteItems, // 上级菜单数据
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});

// 获取 pinia 中的路由
const getMenuData = (routes: RouteItems) => {
  const arr: RouteItems = [];
  routes.map((val: RouteItem) => {
    let item = {...val};
    item['title'] = i18n.global.t(item.title as string);
    if (val.children) {
      item.children = getMenuData(val.children);
    }
    arr.push(item);
  });
  return arr;
};
// 打开弹窗
const openDialog = (type: string, row?: any) => {
  state.dialog.type = type;
  state.dialog.isShowDialog = true;
  // 避免表单被赋值，导致表单重置不生效的错觉
  nextTick(() => {
    if (type === 'edit') {
      state.ruleForm = JSON.parse(JSON.stringify(row));
      state.dialog.title = '修改菜单';
      state.dialog.submitTxt = '修 改';
    } else {
      state.dialog.title = '新增菜单';
      state.dialog.submitTxt = '新 增';
      // 表单重置：将表单数据重置为初始值，重点初始值，故打开表单时，初始值不能赋值
      menuDialogFormRef.value.resetFields();
      state.ruleForm.id = undefined;
      state.ruleForm.parentId = [];
    }
  })
};
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
};
// 是否内嵌下拉改变
const onSelectIframeChange = () => {
  if (state.ruleForm.isIframe) state.ruleForm.isLink = true;
  else state.ruleForm.isLink = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};

// 级联选择发生改变
const handleCascaderChangeEvent = () => {
  if (state.ruleForm.parentId) {
    state.ruleForm.parentId = state.ruleForm.parentId[state.ruleForm.parentId.length - 1];
  }
}
// 提交
const onSubmit = () => {
  closeDialog(); // 关闭弹窗
  // 修改
  if (state.dialog.type === 'edit') {
    useMenuApi().updateMenu(state.ruleForm).then(res => {
      if (res.code == 0) {
        setBackEndControlRefreshRoutes().then(() => {
          // 重新请求后端路由菜单接口
          emit('refresh');
        });
      }
    });
  } else {
    // 默认新增：输出提交内容
    useMenuApi().addMenu(state.ruleForm).then(res => {
      if (res.code == 0) {
        setBackEndControlRefreshRoutes().then(() => {
          // 重新请求后端路由菜单接口
          emit('refresh');
        });
      }
    });
  }
};
// 页面加载时
onMounted(() => {
  state.menuData = getMenuData(requestOldRoutes.value);
});

// 暴露变量
defineExpose({
  openDialog,
});
</script>
