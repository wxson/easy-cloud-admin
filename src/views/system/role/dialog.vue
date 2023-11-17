<template>
  <div class="system-role-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="roleDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="state.ruleForm.name" placeholder="请输入角色名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色标识" prop="code">
              <el-input v-model="state.ruleForm.code" placeholder="请输入角色标识" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="state.ruleForm.sort" :min="0" :max="999" controls-position="right"
                               placeholder="请输入排序" class="w100"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色状态" prop="status">
              <el-switch v-model="state.ruleForm.status" inline-prompt active-text="启" inactive-text="禁"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="角色描述" prop="remark">
              <el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入角色描述" maxlength="150"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="菜单权限">
              <el-tree ref="treeRef" :data="state.menuData" :props="state.menuProps" show-checkbox
                       class="menu-data-tree"
                       :default-checked-keys="state.checkedKeys" node-key="id" @check="handleCheckChange"/>
            </el-form-item>
          </el-col>
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

<script setup lang="ts" name="systemRoleDialog">
import {nextTick, reactive, ref} from 'vue';
import {i18n} from "/@/i18n";
import {useMenuApi} from "/@/api/menu";
import {Tree} from "element-plus/es/components/tree-v2/src/types";
import {useRequestOldRoutes} from "/@/stores/requestOldRoutes";
import {storeToRefs} from "pinia";
import {useRoleApi} from "/@/api/role";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const stores = useRequestOldRoutes();
const {requestOldRoutes} = storeToRefs(stores);

// 定义变量内容
const roleDialogFormRef = ref();
// 树节点
const treeRef = ref();
const state = reactive({
  ruleForm: {
    id: undefined,// 角色ID
    name: '', // 角色名称
    code: '', // 角色标识
    sort: 0, // 排序
    status: true, // 角色状态
    remark: '', // 角色描述
    menuIds: [], // 菜单权限列表
  },
  menuData: [] as TreeType[],
  checkedKeys: [], // 默认选中的key
  menuProps: {
    children: 'children',
    label: 'label',
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});

// 打开弹窗
const openDialog = (type: string, row: RowRoleType) => {
  state.dialog.type = type;
  state.dialog.isShowDialog = true;
  // 获取菜单数据
  state.menuData = getMenuData(requestOldRoutes.value);
  // 避免表单被赋值，导致表单重置不生效的错觉
  nextTick(() => {
    if (type === 'edit') {
      state.ruleForm = JSON.parse(JSON.stringify(row));
      state.ruleForm.status = state.ruleForm.status === 1 ? true : false;
      state.checkedKeys = [];
      state.dialog.title = '修改角色';
      state.dialog.submitTxt = '修 改';
      // 默认勾选选中数据
      useMenuApi().roleMenus(state.ruleForm.id).then(res => {
        if (res.code === 0) {
          // 遍历设置选择项
          res.data.forEach(menuId => {
            let node = treeRef.value.getNode({id: menuId});
            if (node.isLeaf) {
              treeRef.value.setChecked(node, true);
            }
          });
        }
      });
    } else {
      state.dialog.title = '新增角色';
      state.dialog.submitTxt = '新 增';
      // 表单重置：将表单数据重置为初始值，重点初始值，故打开表单时，初始值不能赋值
      roleDialogFormRef.value.resetFields();
      state.ruleForm.id = undefined;
      treeRef.value!.setCheckedKeys([], false)
    }
  })
};
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
// 提交
const onSubmit = () => {
  // 关闭弹窗
  closeDialog();
  // console.log(state.ruleForm)
  // 修改
  if (state.dialog.type === 'edit') {
    useRoleApi().updateRole(state.ruleForm).then(res => {
      if (res.code == 0) {
        emit('refresh');
      }
    });
  } else {
    // 默认新增：输出提交内容
    useRoleApi().addRole(state.ruleForm).then(res => {
      if (res.code == 0) {
        emit('refresh');
      }
    });
  }
};

// 获取 pinia 中的路由
const getMenuData = (routes: RouteItems) => {
  const arr: RouteItems = [];
  routes.map((val: RouteItem) => {
    let item = {
      id: val.id,
      label: val.title,
      children: val.children
    };
    item['label'] = i18n.global.t(val.title as string);
    if (val.children) {
      item.children = getMenuData(val.children);
    }
    arr.push(item);
  });
  return arr;
};

// 权限选择事件
const handleCheckChange = (data: Tree, selectNodeKeys) => {
  let set = Array.from(new Set());
  // 加载选中的菜单
  set.push(...selectNodeKeys.checkedKeys)
  // 加载半选中（即选中菜单的父级）的菜单
  set.push(...selectNodeKeys.halfCheckedKeys)
  state.ruleForm.menuIds = set;
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
  .menu-data-tree {
    width: 100%;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    padding: 5px;
  }
}
</style>
