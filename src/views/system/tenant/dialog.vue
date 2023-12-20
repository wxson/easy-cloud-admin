<template>
	<div class='system-dept-dialog-container'>
		<el-dialog :title='state.dialog.title' v-model='state.dialog.isShowDialog' width='769px'>
			<el-form ref='tenantDialogFormRef' :model='state.ruleForm' size='default' label-width='90px'>
				<el-row :gutter='35'>
					<el-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24' class='mb20'>
						<el-form-item label='租户名称' prop='name'>
							<el-input v-model='state.ruleForm.name' placeholder='请输入租户名称' clearable />
						</el-form-item>
					</el-col>
					<el-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24' class='mb20'>
						<el-form-item label='租户类型' prop='type'>
							<el-radio-group v-model='state.ruleForm.type'>
								<el-radio label='ENTERPRISE'>企业</el-radio>
								<el-radio label='PERSONAL'>个人</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24' class='mb20'>
						<el-form-item label='有效期' prop='date'>
							<!--              <el-date-picker v-model="state.ruleForm.date" type="date" placeholder="请选择"-->
							<!--                              class="w100"/>-->
							<el-date-picker
								v-model='state.dateTime'
								type='daterange'
								start-placeholder='开始时间'
								end-placeholder='结束时间'
								format='YYYY-MM-DD'
								@calendar-change='handleCalendarChange'
								class='w100'
							/>
						</el-form-item>
					</el-col>
					<el-col :xs='24' :sm='12' :md='12' :lg='12' :xl='12' class='mb20'>
						<el-form-item label='负责人' prop='leader'>
							<el-input v-model='state.ruleForm.leader' placeholder='请输入负责人' clearable />
						</el-form-item>
					</el-col>
					<el-col :xs='24' :sm='12' :md='12' :lg='12' :xl='12' class='mb20'>
						<el-form-item label='手机号' prop='tel'>
							<el-input v-model='state.ruleForm.tel' placeholder='请输入手机号' clearable />
						</el-form-item>
					</el-col>
					<el-col :xs='24' :sm='12' :md='12' :lg='12' :xl='12' class='mb20'>
						<el-form-item label='邮箱' prop='email'>
							<el-input v-model='state.ruleForm.email' placeholder='请输入' clearable />
						</el-form-item>
					</el-col>
					<el-col :xs='24' :sm='12' :md='12' :lg='12' :xl='12' class='mb20'>
						<el-form-item label='租户状态' prop='status'>
							<el-switch v-model='state.ruleForm.status'
												 inline-prompt
												 :active-value='0'
												 :inactive-value='1' />
						</el-form-item>
					</el-col>
					<el-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24' class='mb20'>
						<el-form-item label='租户描述' prop='remark'>
							<el-input v-model='state.ruleForm.remark' type='textarea' placeholder='请输入租户描述' maxlength='150' />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class='dialog-footer'>
					<el-button @click='onCancel' size='default'>取 消</el-button>
					<el-button type='primary' @click='onSubmit' size='default'>{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang='ts' name='systemTenantDialog'>
import { nextTick, reactive, ref } from 'vue';
import { addMonths, format } from 'date-fns';
import { useTenantApi } from '/@/api/tenant';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const tenantDialogFormRef = ref();
const state = reactive({
	ruleForm: {
		id: undefined,
		type: 'ENTERPRISE', // 默认企业
		name: '', // 租户名称
		leader: '', // 负责人
		tel: '', // 手机号
		email: '', // 邮箱
		sort: 0, // 排序
		status: true, // 租户状态
		startDate: '', // 开始时间
		endDate: '', // 结束时间
		remark: '', // 租户描述
	},
	dateTime: [], // 时间
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, row: TenantEntity) => {
	state.dialog.type = type;
	state.dialog.isShowDialog = true;
	// 避免表单被赋值，导致表单重置不生效的错觉
	nextTick(() => {
		if (type === 'edit') {
			state.ruleForm = JSON.parse(JSON.stringify(row));
			state.ruleForm.status = state.ruleForm.status === 1 ? true : false;
			state.dialog.title = '修改租户';
			state.dialog.submitTxt = '修 改';
			state.dateTime = [state.ruleForm.startDate, state.ruleForm.endDate];
			state.ruleForm.startDate = state.dateTime[0];
			state.ruleForm.endDate = state.dateTime[1];
			console.log(state.ruleForm);
		} else {
			state.dialog.title = '新增租户';
			state.dialog.submitTxt = '新 增';
			// 表单重置：将表单数据重置为初始值，重点初始值，故打开表单时，初始值不能赋值
			tenantDialogFormRef.value.resetFields();
			state.ruleForm.id = undefined;
			// 计算当前日期
			state.dateTime = [format(new Date(), 'yyyy-MM-dd'), format(addMonths(new Date(), 1), 'yyyy-MM-dd')];
			state.ruleForm.startDate = state.dateTime[0];
			state.ruleForm.endDate = state.dateTime[1];
		}
	});
};
// 获取当前时间
const handleCalendarChange = (date) => {
	state.ruleForm.startDate = date[0] ? format(date[0], 'yyyy-MM-dd') : state.ruleForm.startDate;
	state.ruleForm.endDate = date[1] ? format(date[1], 'yyyy-MM-dd') : state.ruleForm.endDate;
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
	console.log(state.ruleForm);
	if (state.dialog.type === 'edit') {
		useTenantApi().updateTenant(state.ruleForm).then(res => {
			if (res.code == 0) {
				emit('refresh');
			}
		});
	} else {
		// 默认新增：输出提交内容
		useTenantApi().addTenant(state.ruleForm).then(res => {
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
