/**
 * 租户
 * @author GR
 * @date 2023-10-08
 */
declare interface TenantEntity extends BaseEntity {
	id: string;
	name: string;
	leader: string;
	tel: string;
	email: string[];
	status: string;
	startDate: string;
	endDate: string;
	remark: string;
};