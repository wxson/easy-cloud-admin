<template>
	<div class='system-tenant-container layout-padding'>
		<el-card shadow='hover' class='layout-padding-auto'>
			<div class='system-tenant-search mb15'>
				<el-input v-model='state.tableData.param.search' size='default' placeholder='请输入租户名称'
									style='max-width: 180px'></el-input>
				<Auth-Btn :value="'system:tenant:query'" class='ml10' size='default' type='primary'
									@click='onClickFindTenantEvent'
									title='查询' />
				<Auth-Btn :value="'system:tenant:add'" class='ml10' size='default' type='success'
									@click="onOpenAddTenant('add')"
									title='新增租户' icon='FolderAdd' />
			</div>
			<el-table :data='state.tableData.data' v-loading='state.tableData.loading' style='width: 100%'>
				<el-table-column type='index' label='序号' width='60' />
				<el-table-column prop='name' label='账户名称' show-overflow-tooltip />
				<el-table-column prop='tel' label='手机号' show-overflow-tooltip />
				<el-table-column prop='email' label='邮箱' show-overflow-tooltip />
				<el-table-column prop='remark' label='描述' show-overflow-tooltip />
				<el-table-column prop='status' label='租户状态' show-overflow-tooltip>
					<template #default='scope'>
						<el-tag type='success' v-if='scope.row.status === 1'>启用</el-tag>
						<el-tag type='success' v-else-if='scope.row.status === 2'>冻结</el-tag>
						<el-tag type='info' v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop='createAt' label='创建时间' show-overflow-tooltip />
				<el-table-column label='操作' width='200'>
					<template #default='scope'>
						<Auth-Btn :value="'system:tenant:update'" size='default' type='success'
											title='修改' text :lock="scope.row.userName === 'admin'"
											@click="onOpenEditTenant('edit', scope.row)" />
						<Auth-Btn :value="'system:tenant:delete'" size='default' type='success'
											title='删除' text :lock="scope.row.userName === 'admin'"
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
				v-model:current-page='state.tableData.param.page'
				background
				v-model:page-size='state.tableData.param.size'
				layout='total, sizes, prev, pager, next, jumper'
				:total='state.tableData.total'
			>
			</el-pagination>
		</el-card>
		<TenantDialog ref='tenantDialogRef' @refresh='getTableData()' />
	</div>
</template>

<script setup lang='ts' name='systemTenant'>
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useTenantApi } from '/@/api/tenant';

const AuthBtn = defineAsyncComponent(() => import('/@/components/auth/authBtn.vue'));

// 引入组件
const TenantDialog = defineAsyncComponent(() => import('/@/views/system/tenant/dialog.vue'));

// 定义变量内容
const tenantDialogRef = ref();
const state = reactive<TableType<TenantEntity>>({
	tableData: {
		data: [],
		loading: false,
		total: 0,
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
	// 查询租户分页
	useTenantApi().tenantPage(state.tableData.param).then(res => {
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
// 打开新增租户弹窗
const onOpenAddTenant = (type: string) => {
	tenantDialogRef.value.openDialog(type);
};
// 打开修改租户弹窗
const onOpenEditTenant = (type: string, row: TenantEntity) => {
	tenantDialogRef.value.openDialog(type, row);
};
// 删除租户
const onRowDel = (row: TenantEntity) => {
	ElMessageBox.confirm(`此操作将永久删除租户：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		useTenantApi().deleteTenant(row.id).then(res => {
			if (res.code === 0) {
				getTableData();
				ElMessage.success('删除成功');
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
const onClickFindTenantEvent = () => {
	getTableData();
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang='scss'>
.system-tenant-container {
	:deep(.el-card__body) {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;

		.el-table {
			flex: 1;
		}
	}
}
</style>
