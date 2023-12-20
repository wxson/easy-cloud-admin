<template>
	<div class='system-role-container layout-padding'>
		<div class='system-role-padding layout-padding-auto layout-padding-view'>
			<div class='system-user-search mb15'>
				<el-input v-model='state.tableData.param.search' size='default' placeholder='请输入角色名称'
									style='max-width: 180px'></el-input>
				<Auth-Btn :value="'system:role:query'" size='default' type='primary' class='ml10'
									title='查询' @click='onClickFindUserEvent' />
				<Auth-Btn :value="'system:role:add'" size='default' type='success' class='ml10'
									title='新增角色' icon='FolderAdd' @click="onOpenAddRole('add')" />
			</div>
			<el-table :data='state.tableData.data' v-loading='state.tableData.loading' style='width: 100%'>
				<el-table-column type='index' label='序号' width='60' />
				<el-table-column prop='name' label='角色名称' show-overflow-tooltip />
				<el-table-column prop='code' label='角色标识' show-overflow-tooltip />
				<el-table-column prop='remark' label='角色描述' show-overflow-tooltip />
				<el-table-column prop='sort' label='排序' show-overflow-tooltip />
				<el-table-column prop='status' label='角色状态' show-overflow-tooltip>
					<template #default='scope'>
						<el-tag type="success" v-if="scope.row.status === 0">启用</el-tag>
						<el-tag type="success" v-else-if="scope.row.status === 2">冻结</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop='createAt' label='创建时间' show-overflow-tooltip />
				<el-table-column label='操作' width='100'>
					<template #default='scope'>
						<Auth-Btn :value="'system:role:update'" size='default' type='success'
											title='修改' text :lock="scope.row.code === 'admin'"
											@click="onOpenEditRole('edit', scope.row)" />
						<Auth-Btn :value="'system:role:delete'" size='default' type='success'
											title='删除' text :lock="scope.row.code === 'admin'"
											@click='onRowDel(scope.row)' />
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change='onHandleSizeChange'
				@current-change='onHandleCurrentChange'
				class='mt15'
				:pager-count='5'
				:page-sizes='[10, 20, 30]'
				v-model:current-page='state.tableData.param.pageNum'
				background
				v-model:page-size='state.tableData.param.pageSize'
				layout='total, sizes, prev, pager, next, jumper'
				:total='state.tableData.total'
			>
			</el-pagination>
		</div>
		<RoleDialog ref='roleDialogRef' @refresh='getTableData()' />
	</div>
</template>

<script setup lang='ts' name='systemRole'>
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoleApi } from '/@/api/role';

const AuthBtn = defineAsyncComponent(() => import('/@/components/auth/authBtn.vue'));

// 引入组件
const RoleDialog = defineAsyncComponent(() => import('/@/views/system/role/dialog.vue'));

// 定义变量内容
const roleDialogRef = ref();
const state = reactive<TableType<RoleEntity>>({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			search: '',
			page: 1,
			size: 10,
		},
	},
});
// 初始化表格数据
const getTableData = () => {
	state.tableData.loading = true;
	useRoleApi().rolePage(state.tableData.param).then(res => {
		if (res.code === 0) {
			state.tableData.data = res.data.content;
			state.tableData.total = res.data.totalElements;
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
// 打开新增角色弹窗
const onOpenAddRole = (type: string) => {
	roleDialogRef.value.openDialog(type);
};
// 打开修改角色弹窗
const onOpenEditRole = (type: string, row: RoleEntity) => {
	roleDialogRef.value.openDialog(type, row);
};
// 删除角色
const onRowDel = (row: RoleEntity) => {
	ElMessageBox.confirm(`此操作将永久删除角色名称：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		useRoleApi().deleteRole(row.id).then(res => {
			if (res.code === 0) {
				ElMessage.success('删除成功');
				getTableData();
			}
		});
	}).catch(() => {
	});
};
// 分页改变
const onHandleSizeChange = (val: number) => {
	state.tableData.param.size = val;
	getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.page = val;
	getTableData();
};
// 查询
const onClickFindUserEvent = () => {
	getTableData();
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang='scss'>
.system-role-container {
	.system-role-padding {
		padding: 15px;

		.el-table {
			flex: 1;
		}
	}
}
</style>
