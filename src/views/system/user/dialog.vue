<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="名称" prop="userName">
              <el-input v-model="state.ruleForm.userName" placeholder="请输入账户名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="state.ruleForm.nickName" placeholder="请输入用户昵称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="密码" prop="password">
              <el-input v-model="state.ruleForm.password" placeholder="请输入" type="password" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="手机" prop="tel">
              <el-input v-model="state.ruleForm.tel" placeholder="请输入手机号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="state.ruleForm.gender" placeholder="请选择" clearable class="w100">
                <el-option label="男" value="MAN"/>
                <el-option label="女" value="WOMAN"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="state.ruleForm.email" placeholder="请输入" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色" prop="roleCodes">
              <el-select v-model="state.ruleForm.roleCodes" placeholder="请选择" multiple clearable class="w100">
                <el-option v-for="item in state.roleData" :key="item.id" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="部门" prop="deptIds">
              <el-cascader
                  :options="state.deptData"
                  :props="{ checkStrictly: true, value: 'id', label: 'name' }"
                  placeholder="请选择部门"
                  clearable
                  class="w100"
                  v-model="state.ruleForm.deptIds"
              >
                <template #default="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="账户过期" prop="overdueTime">
              <el-date-picker v-model="state.ruleForm.overdueTime" type="date" placeholder="请选择"
                              class="w100"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="状态" prop="status">
              <el-switch v-model="state.ruleForm.status"
                         inline-prompt
                         active-text="启"
                         inactive-text="禁"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户描述" prop="describe">
              <el-input v-model="state.ruleForm.describe" type="textarea" placeholder="请输入用户描述"
                        maxlength="150"/>
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

<script setup lang="ts" name="systemUserDialog">
import {nextTick, reactive, ref} from 'vue';
import {useUserApi} from "/@/api/user";
import {useRoleApi} from "/@/api/role";
import {useDeptApi} from "/@/api/dept";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const userDialogFormRef = ref();
const state = reactive({
  ruleForm: {
    id: undefined,
    userName: '', // 账户名称
    nickName: '', // 用户昵称
    roleCodes: [], // 关联角色
    deptIds: [], // 部门
    tel: '', // 手机号
    email: '', // 邮箱
    gender: 'MAN', // 性别
    password: '', // 账户密码
    overdueTime: '', // 账户过期
    status: true, // 用户状态
    describe: '', // 用户描述
  },
  deptData: [] as DeptTreeType[], // 部门数据
  roleData: [] as RowRoleType[], // 角色信息
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});

/**
 * 获取平台角色信息
 */
const getRoleData = () => {
  // 获取角色列表信息
  useRoleApi().roleList().then(res => {
    if (res.code === 0) {
      // 过滤掉超级管理员角色
      state.roleData = res.data.filter(role => role.code !== 'admin');
    }
  }).catch(error => {
    console.log("获取角色信息失败：", error);
  });
};


/**
 * 获取部门信息
 */
const getDeptData = () => {
  // 获取角色列表信息
  useDeptApi().deptTree().then(res => {
    if (res.code === 0) {
      // 过滤掉超级管理员角色
      state.deptData = res.data;
    }
  }).catch(error => {
    console.log("获取部门信息失败：", error);
  });
};

// 打开弹窗
const openDialog = (type: string, row: RowUserType) => {
  state.dialog.type = type;
  state.dialog.isShowDialog = true;
  // 避免表单被赋值，导致表单重置不生效的错觉
  nextTick(() => {
    if (type === 'edit') {
      state.ruleForm = JSON.parse(JSON.stringify(row));
      state.ruleForm.status = state.ruleForm.status === 1 ? true : false;
      state.dialog.title = '修改用户';
      state.dialog.submitTxt = '修 改';
    } else {
      state.dialog.title = '新增用户';
      state.dialog.submitTxt = '新 增';
      // 表单重置：将表单数据重置为初始值，重点初始值，故打开表单时，初始值不能赋值
      userDialogFormRef.value.resetFields();
      state.ruleForm.id = undefined;
    }
  });
  // 读取角色信息
  getRoleData();
  // 读取部门信息
  getDeptData();
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
  closeDialog();
  console.log(state.ruleForm);
  // 修改
  if (state.dialog.type === 'edit') {
    useUserApi().updateUser(state.ruleForm).then(res => {
      if (res.code == 0) {
        emit('refresh');
      }
    });
  } else {
    // 默认新增：输出提交内容
    useUserApi().addUser(state.ruleForm).then(res => {
      if (res.code == 0) {
        emit('refresh');
      }
    });
  }
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
