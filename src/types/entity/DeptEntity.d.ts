/**
 * 部门
 * @author GR
 * @date 2023-10-08
 */
declare interface DeptEntity extends BaseEntity {
	id: number | string;
	name: string;
	createTime: string;
	status: boolean;
	sort: number;
	remark: string;
	children?: DeptEntity[];
};