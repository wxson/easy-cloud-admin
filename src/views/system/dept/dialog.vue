<template>
  <div class="system-dept-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="deptDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="上级部门" prop="parentId">
              <el-cascader
                  :options="state.deptData"
                  :props="{ checkStrictly: true, value: 'id', label: 'name' }"
                  placeholder="请选择部门"
                  clearable
                  class="w100"
                  v-model="state.ruleForm.parentId"
                  @change="handleCascaderChangeEvent"
              >
                <template #default="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="state.ruleForm.name" placeholder="请输入部门名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="state.ruleForm.leader" placeholder="请输入负责人" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="手机号" prop="tel">
              <el-input v-model="state.ruleForm.tel" placeholder="请输入手机号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="state.ruleForm.email" placeholder="请输入" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="state.ruleForm.sort" :min="0" :max="999" controls-position="right"
                               placeholder="请输入排序" class="w100"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="部门状态" prop="status">
              <el-switch v-model="state.ruleForm.status" inline-prompt active-text="启" inactive-text="禁"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="部门描述" prop="remark">
              <el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入部门描述" maxlength="150"/>
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

<script setup lang="ts" name="systemDeptDialog">
import {nextTick, reactive, ref} from 'vue';
import {useDeptApi} from "/@/api/dept";
import {ElMessage} from "element-plus";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const deptDialogFormRef = ref();
const state = reactive({
  ruleForm: {
    id: undefined,
    parentId: [], // 父级部门
    name: '', // 部门名称
    leader: '', // 负责人
    tel: '', // 手机号
    email: '', // 邮箱
    sort: 0, // 排序
    status: true, // 部门状态
    remark: '', // 部门描述
  },
  deptData: [] as DeptEntity[], // 部门数据
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});

// 打开弹窗
const openDialog = (type: string, row: DeptEntity) => {
  state.dialog.type = type;
  state.dialog.isShowDialog = true;
  // 避免表单被赋值，导致表单重置不生效的错觉
  nextTick(() => {
    if (type === 'edit') {
      state.ruleForm = JSON.parse(JSON.stringify(row));
      state.ruleForm.status = state.ruleForm.status === 1 ? true : false;
      state.dialog.title = '修改部门';
      state.dialog.submitTxt = '修 改';
    } else {
      state.dialog.title = '新增部门';
      state.dialog.submitTxt = '新 增';
      // 表单重置：将表单数据重置为初始值，重点初始值，故打开表单时，初始值不能赋值
      deptDialogFormRef.value.resetFields();
      state.ruleForm.id = undefined;
      state.ruleForm.parentId = [];
    }
  })
  getMenuData();
};
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
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
  if (state.dialog.type === 'edit') {
    useDeptApi().updateDept(state.ruleForm).then(res => {
      if (res.code == 0) {
        emit('refresh');
      }
    });
  } else {
    // 默认新增：输出提交内容
    useDeptApi().addDept(state.ruleForm).then(res => {
      if (res.code == 0) {
        emit('refresh');
      }
    });
  }
};
// 初始化部门数据
const getMenuData = () => {
  // 加载部门信息
  useDeptApi().deptTree().then(res => {
    if (res.code === 0) {
      state.deptData = res.data;
    }
  }).catch(error => {
    // 提示内容
    ElMessage.warning(error);
  });
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
