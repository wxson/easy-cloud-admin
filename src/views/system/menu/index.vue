<template>
  <div class="system-menu-container layout-pd">
    <el-card shadow="hover">
      <div class="system-menu-search mb15">
        <Auth :value="'system:menu:query'">
          <el-input size="default" placeholder="请输入菜单名称" style="max-width: 180px"></el-input>
          <el-button size="default" type="primary" class="ml10" @click="onClickFindMenuEvent">
            <el-icon>
              <ele-Search/>
            </el-icon>
            查询
          </el-button>
        </Auth>
        <Auth :value="'system:menu:add'">
          <el-button size="default" type="success" class="ml10" @click="onOpenAddMenu">
            <el-icon>
              <ele-FolderAdd/>
            </el-icon>
            新增菜单
          </el-button>
        </Auth>
      </div>
      <el-table
          :data="state.tableData.data"
          v-loading="state.tableData.loading"
          style="width: 100%"
          row-key="path"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="菜单名称" show-overflow-tooltip>
          <template #default="scope">
            <SvgIcon :name="scope.row.icon"/>
            <span class="ml10">{{ $t(scope.row.title) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="perms" label="权限标识" show-overflow-tooltip/>
        <el-table-column label="组件路径" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.component }}</span>
          </template>
        </el-table-column>
        <el-table-column label="隐藏" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.isHidden }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" show-overflow-tooltip width="80">
          <template #default="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="类型" show-overflow-tooltip width="80">
          <template #default="scope">
            <el-tag type="success" size="small">{{ scope.row.type === 'MENU' ? '菜单' : '按钮' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="140">
          <template #default="scope">
            <Auth :value="'system:menu:add'">
              <el-button size="small" text type="primary" @click="onOpenAddMenu('add')">新增</el-button>
            </Auth>
            <Auth :value="'system:menu:update'">
              <el-button size="small" text type="primary" @click="onOpenEditMenu('edit', scope.row)">修改</el-button>
            </Auth>
            <Auth :value="'system:menu:delete'">
              <el-button size="small" text type="primary" @click="onTabelRowDel(scope.row)">删除</el-button>
            </Auth>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <MenuDialog ref="menuDialogRef" @refresh="getTableData()"/>
  </div>
</template>

<script setup lang="ts" name="systemMenu">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
import {RouteRecordRaw} from 'vue-router';
import {ElMessage, ElMessageBox} from 'element-plus';
import {storeToRefs} from 'pinia';
import {useMenuApi} from "/@/api/menu";
import {setBackEndControlRefreshRoutes} from "/@/router/backEnd";
import {useRequestOldRoutes} from "/@/stores/requestOldRoutes";

const Auth = defineAsyncComponent(() => import('/@/components/auth/auth.vue'));

// 引入组件
const MenuDialog = defineAsyncComponent(() => import('/@/views/system/menu/dialog.vue'));

// 定义变量内容
const stores = useRequestOldRoutes();
const {requestOldRoutes} = storeToRefs(stores);
const menuDialogRef = ref();
const state = reactive({
  tableData: {
    data: [] as RouteRecordRaw[],
    loading: true,
  },
});

// 获取路由数据，真实请从接口获取
const getTableData = () => {
  state.tableData.loading = true;
  state.tableData.data = requestOldRoutes.value;
  setTimeout(() => {
    state.tableData.loading = false;
  }, 500);
};
// 打开新增菜单弹窗
const onOpenAddMenu = (type: string) => {
  menuDialogRef.value.openDialog(type);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (type: string, row: RouteRecordRaw) => {
  menuDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelRowDel = (row: RouteRecordRaw) => {
  ElMessageBox.confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 调用删除API
    useMenuApi().deleteMenu((row as any).id).then(res => {
      if (res.code == 0) {
        ElMessage.success('删除成功');
        // 删除成功，刷新路由
        setBackEndControlRefreshRoutes().then(() => {
          // 重新请求后端路由菜单接口
          getTableData();
        });
      }
    });
  }).catch(() => {
  });
};
// 菜单查询：本地查询即可
const onClickFindMenuEvent = () => {
  getTableData();
}
// 页面加载时
onMounted(() => {
  getTableData();
});
</script>
