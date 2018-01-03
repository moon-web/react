/**
 * This file includes all remote apis.
 */

const baseUrl1 = '/ipcommune/admin'; // BaseUrl
const baseUrl2 = '/ipcommune/monitor';
const baseUrl3 = '/ipcommune/itemDetails';
const baseUrl4 = '/ipcommune/notice';

export default {
    LOGIN: `${baseUrl1}/adminLogin`,//登陆

    PERMISS:`${baseUrl1}/queryPermissionList`,//权限

    USER:`${baseUrl1}/mall_user_queryBuyerPage`,//用户管理列表
    USER_ENABLE:`${baseUrl1}/mall_user_enableBuyer`,//用户启用
    USER_DISABLE:`${baseUrl1}/mall_user_disableBuyer`,//用户禁用

    BRAND:`${baseUrl1}/brand_queryBrandByPage`,//品牌管理列表
    BRAND_ADD:`${baseUrl1}/brand_createBrand`,//品牌新增
    BRAND_OWNER:`${baseUrl1}/user_queryList`,//品牌新增 所属品牌商

    LINE:`${baseUrl1}/report_queryReportByPage`,//线上，线下举报列表 type=1,线上。type=2,线下
    LINE_REPORT:`${baseUrl1}/report_modifyReport`,//线上，线下举报审核  status=2,审核通过 status=3，审核不通过

    TASK:`${baseUrl1}/task_queryTaskByPage`,//举报任务列表
    TASK_ADD:`${baseUrl1}/task_createTask`,//新增发布任务
    TASK_FINISH:`${baseUrl1}/task_modifyTask`,//结束任务
    TASK_PEOPLE:`${baseUrl1}/task_queryTaskApplyByPage`,//举报申请人
    TASK_PEOPLE_EXAMINE:`${baseUrl1}/task_modifyTaskApply`,//举报申请人审核
    TASK_LINE:`${baseUrl1}/task_queryTaskWorkByPage`,//线上线下举报任务审核列表
    TASK_LINE_EXAMINE:`${baseUrl1}/task_modifyTaskWork`,//线上线下举报任务审核 status=2 通过 status=3 不通过

    DATA_WATCH:`${baseUrl2}/queryMonitorByPage`,//数据监测列表
    DATA_WATCH_ROLE:`${baseUrl2}/newCycleMonitor`,//新增监控
    DATA_WATCH_MANUAL_ROLE:`${baseUrl2}/newManualMonitor`,//新增手动监控
    DATA_WATCH_FINISH:`${baseUrl2}/updateMonitorStatusById`,//监控完成

    WATCH_TASK:`${baseUrl3}/queryItemDetailsByPage`,//监控任务审核列表
    WATCH_TASK_EXAMINE:`${baseUrl3}/updateAuditStatusById`,//监控任务审核

    SYSTEM:`${baseUrl1}/user_queryList`,//系统管理列表
    SYSTEM_ROLE:`${baseUrl1}/role_queryRolePage`,//角色选择
    SYSTEM_DISABLE:`${baseUrl1}/user_modifyStatusOff`,//禁用用户
    SYSTEM_ENABLE:`${baseUrl1}/user_modifyStatusOn`,//启用用户
    SYSTEM_USER_CREATE:`${baseUrl1}/user_create`,//系统用户新增
    SYSTEM_USER_RESETPASS:`${baseUrl1}/user_resetPassword`,//系统用户修改密码

    NOTICE_INFO:`${baseUrl4}/queryNotice`,//首页消息通知
    NOTICE_PLANTFORM:`${baseUrl4}/queryAllPlatform`,//平台数据分析
}