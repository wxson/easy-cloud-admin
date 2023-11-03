<template>
  <div class="system-dept-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-dept-search mb15">
        <el-input size="default" placeholder="请输入部门名称" style="max-width: 180px"></el-input>
        <Auth-Btn :value="'system:dept:query'" class="ml10" size="default" type="primary" @click="onClickFindUserEvent"
                  title="查询"/>
        <Auth-Btn :value="'system:dept:add'" class="ml10" size="default" type="success" @click="onOpenAddDept('add')"
                  title="新增部门" icon="FolderAdd"/>
      </div>
      <el-table
          :data="state.tableData.data"
          v-loading="state.tableData.loading"
          style="width: 100%"
          row-key="id"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="部门名称" show-overflow-tooltip/>
        <el-table-column prop="leader" label="负责人" show-overflow-tooltip/>
        <el-table-column prop="tel" label="电话" show-overflow-tooltip/>
        <el-table-column prop="remark" label="部门描述" show-overflow-tooltip/>
        <el-table-column label="排序" show-overflow-tooltip width="80">
          <template #default="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="部门状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" show-overflow-tooltip/>
        <el-table-column label="操作" show-overflow-tooltip width="140">
          <template #default="scope">
            <Auth-Btn :value="'system:dept:add'" class="ml10" size="small" type="success" @click="onOpenAddDept('add')"
                      title="新增" text/>
            <Auth-Btn :value="'system:dept:update'" class="ml10" size="small" type="success"
                      @click="onOpenEditDept('edit', scope.row)"
                      title="修改" text/>
            <Auth-Btn :value="'system:dept:delete'" class="ml10" size="small" type="success"
                      @click="onTabelRowDel(scope.row)"
                      title="删除" text/>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <DeptDialog ref="deptDialogRef" @refresh="getTableData()"/>
  </div>
</template>

<script setup lang="ts" name="systemDept">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {useDeptApi} from "/@/api/dept";

// 认证按钮
const AuthBtn = defineAsyncComponent(() => import('/@/components/auth/authBtn.vue'));

// 引入组件
const DeptDialog = defineAsyncComponent(() => import('/@/views/system/dept/dialog.vue'));

// 定义变量内容
const deptDialogRef = ref();
const state = reactive<SysDeptState>({
  tableData: {
    data: [],
    loading: false
  }
});

// 初始化表格数据
const getTableData = () => {
  state.tableData.loading = true;
  // 加载部门信息
  useDeptApi().deptTree().then(res => {
    if (res.code === 0) {
      state.tableData.data = res.data;
      // 关闭加载窗口
      state.tableData.loading = false;
    }
  }).catch(error => {
    // 提示内容
    ElMessage.warning(error);
    // 关闭加载窗口
    state.tableData.loading = false;
  });
};
// 打开新增菜单弹窗
const onOpenAddDept = (type: string) => {
  deptDialogRef.value.openDialog(type);
};
// 打开编辑菜单弹窗
const onOpenEditDept = (type: string, row: DeptTreeType) => {
  deptDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelRowDel = (row: DeptTreeType) => {
  ElMessageBox.confirm(`此操作将永久删除部门：${row.name}, 是否继续?`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    getTableData();
    ElMessage.success('删除成功');
  }).catch(() => {
  });
};
// 部门查询
const onClickFindMenuEvent = () => {
  getTableData();
}
// 页面加载时
onMounted(() => {
  getTableData();
});
</script>
