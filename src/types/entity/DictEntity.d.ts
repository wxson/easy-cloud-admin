/**
 * 字典
 * @author GR
 * @date 2023-10-08
 */
declare interface DictEntity extends BaseEntity {
	id: string,
	dicName: string;
	fieldName: string;
	describe: string;
	status: boolean;
	createTime: string;
	list: ListType[];
};