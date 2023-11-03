<template>
  <div class="system-dic-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入字典名称" style="max-width: 180px"></el-input>
        <Auth-Btn :value="'system:dict:query'" size="default" type="primary" class="ml10"
                  title="查询" @click="onClickFindDictEvent"/>
        <Auth-Btn :value="'system:dict:add'" size="default" type="success" class="ml10"
                  title="新增字典" icon="FolderAdd" @click="onOpenAddDict('add')"/>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%"
                row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column type="expand">
          <template #default="scope">
            <el-table :data="scope.row.items" :border="true" size="small">
              <el-table-column label="字典标签" prop="label"/>
              <el-table-column label="字典值" prop="value"/>
              <el-table-column label="描述" prop="remark"/>
              <el-table-column label="状态" prop="status"/>
              <el-table-column label="创建时间" prop="createAt"/>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button size="small" text type="primary" @click="onOpenEditDict('edit', scope.row)">修改</el-button>
                  <el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="name" label="字典名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="字段名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="字典描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="字典状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <Auth-Btn :value="'system:dict:add'" size="default" type="success"
                      title="新增" text @click="onOpenAddDict('add', scope.row)"/>
            <Auth-Btn :value="'system:dict:update'" size="default" type="success"
                      title="修改" text @click="onOpenEditDict('edit', scope.row)"/>
            <Auth-Btn :value="'system:dict:delete'" size="default" type="success"
                      title="删除" text @click="onRowDel(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          v-model:current-page="state.tableData.param.pageNum"
          background
          v-model:page-size="state.tableData.param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.tableData.total"
      >
      </el-pagination>
    </el-card>
    <DicDialog ref="dicDialogRef" @refresh="getTableData()"/>
  </div>
</template>

<script setup lang="ts" name="systemDic">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {usedictApi} from "/@/api/dict";

const AuthBtn = defineAsyncComponent(() => import('/@/components/auth/authBtn.vue'));

// 引入组件
const DicDialog = defineAsyncComponent(() => import('/@/views/system/dict/dialog.vue'));

// 定义变量内容
const dicDialogRef = ref();
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
    },
  },
  expandedRows: []
});

// 初始化表格数据
const getTableData = () => {
  state.tableData.loading = true;
  usedictApi().dictPage().then(res => {
    if (res.code === 0) {
      state.tableData.data = res.data.content;
      state.tableData.total = res.data.totalElements;
      state.tableData.loading = false;
    }
  }).catch(error => {
    // 提示内容
    ElMessage.warning(error);
    state.tableData.loading = false;
  });
};
// 打开新增字典弹窗
const onOpenAddDict = (type: string) => {
  dicDialogRef.value.openDialog(type);
};
// 打开修改字典弹窗
const onOpenEditDict = (type: string, row: RowDictType) => {
  dicDialogRef.value.openDialog(type, row);
};
// 删除字典
const onRowDel = (row: RowDictType) => {
  ElMessageBox.confirm(`此操作将永久删除字典名称：“${row.dicName}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    usedictApi().deleteDict(row.id).then(res => {
      if (res.code === 0) {
        ElMessage.success('删除成功');
        getTableData();
      }
    })
  }).catch(() => {
  });
};
// 分页改变
const onHandleSizeChange = (val: number) => {
  state.tableData.param.pageSize = val;
  getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNum = val;
  getTableData();
};
// 菜单查询：本地查询即可
const onClickFindDictEvent = () => {
  getTableData();
}
// 页面加载时
onMounted(() => {
  getTableData();
});
</script>
