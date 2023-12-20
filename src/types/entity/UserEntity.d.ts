/**
 * 用户
 * @author GR
 * @date 2023-10-08
 */
declare interface UserEntity extends BaseEntity {
	id: string;
	userName: string;
	nickName: string;
	roleSign: string;
	department: string[];
	tel: string;
	email: string;
	gender: string;
	password: string;
	status: boolean;
	describe: string;
	createTime: string;
};