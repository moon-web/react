/**
 * The main api service
 */
import req from './req';
import http from '../utils/http';
export default {
    //登录接口
    login(params) {
        return http.get(req.LOGIN, params);
    },
    //权限管理
    permiss(paramas) {
        return http.get(req.PERMISS, paramas)
    },
    //用户管理
    user(params) {
        return http.get(req.USER, params);
    },
    //用户启用
    user_enable(params) {
        return http.get(req.USER_ENABLE, params)
    },
    //用户禁用
    user_disable(params) {
        return http.get(req.USER_DISABLE, params)
    },
    //品牌管理
    brand(params) {
        return http.get(req.BRAND, params)
    },
    //品牌新增
    brand_add(params) {
        return http.get(req.BRAND_ADD, params)
    },
    //品牌新增 所属品牌
    brand_owner(params) {
        return http.get(req.BRAND_OWNER, params)
    },

    //线上线下举报
    line(params) {
        return http.get(req.LINE, params)
    },
    //线上线下举报审核
    line_report(params) {
        return http.get(req.LINE_REPORT, params)
    },

    //举报任务
    task(params) {
        return http.get(req.TASK, params)
    },
    //新增任务
    task_add(params) {
        return http.get(req.TASK_ADD, params)
    },
    task_finish(params) {
        return http.get(req.TASK_FINISH, params)
    },
    //举报申请人
    task_people(params) {
        return http.get(req.TASK_PEOPLE, params)
    },
    //举报申请人审核
    task_people_examine(params) {
        return http.get(req.TASK_PEOPLE_EXAMINE, params)
    },
    //线上线下举报任务审核列表
    task_line(params) {
        return http.get(req.TASK_LINE, params)
    },
    //线上线下举报任务审核
    task_line_examine(params) {
        return http.get(req.TASK_LINE_EXAMINE, params)
    },

    //数据监测列表
    data_watch(params) {
        return http.get(req.DATA_WATCH, params)
    },
    //新增监控(参数与其方法不适合)
    data_watch_role(params) {
        return http.get(req.DATA_WATCH_ROLE, params)
    },
    //新增手动监控
    data_watch_manual_role(params) {
        return http.get(req.DATA_WATCH_MANUAL_ROLE, params)
    },
    //监控完成
    data_watch_finish(params) {
        return http.get(req.DATA_WATCH_FINISH, params)
    },
    //监控任务审核列表
    watch_task(params) {
        return http.get(req.WATCH_TASK, params)
    },
    //监控任务审核
    watch_task_examine(params) {
        return http.get(req.WATCH_TASK_EXAMINE, params)
    },

    //系统管理列表
    system_list(params) {
        return http.get(req.SYSTEM, params)
    },
    //角色选择
    sysytem_role() {
        return http.get(req.SYSTEM_ROLE)
    },
    //禁用用户
    system_disable(params) {
        return http.get(req.SYSTEM_DISABLE, params)
    },
    //启用用户
    system_enable(params) {
        return http.get(req.SYSTEM_ENABLE, params)
    },
    //系统用户新增
    system_user_create(params) {
        return http.get(req.SYSTEM_USER_CREATE, params)
    },
    //系统用户修改密码
    system_user_resetpass(params) {
        return http.get(req.SYSTEM_USER_RESETPASS, params)
    },

    //首页消息通知
    notice_info(params){
        return http.get(req.NOTICE_INFO,params)
    },
    //平台数据分析
    notice_plantform(params){
        return http.get(req.NOTICE_PLANTFORM,params)
    }
}