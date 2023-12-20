/**
 * 角色
 * @author GR
 * @date 2023-10-08
 */
declare interface RoleEntity extends BaseEntity {
	id: string;
	name: string;
	code: string;
	remark: string;
	sort: number;
	status: boolean;
	createTime: string;
};