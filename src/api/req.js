/**
 * This file includes all remote apis.
 */
import { volunteerUrl } from './baseUrl'

export default {
    login:`${volunteerUrl}/volunteer/admin/login`,//登录
    logout:`${volunteerUrl}/volunteer/admin/logout`,//退出
    /**
     * admin首页
    */   
    queryNotice: `${volunteerUrl}/volunteer/admin/notice/queryNotice`, // 消息通知
    countClueAndSuit: `${volunteerUrl}/volunteer/admin/notice/countClueAndSuit`,  // 诉讼案件统计

    /**
     * 权利人首页接口
     */
    queryReportMonitorLegalrights:`${volunteerUrl}/volunteer/admin/obligee/queryReportMonitorLegalRights`,// 网络管理数据
    keyPointQueryBrand:`${volunteerUrl}/volunteer/admin/obligee/queryKeyPointBrand`,// 重点品牌统计
    keyPointQueryProdPlatform:`${volunteerUrl}/volunteer/admin/obligee/queryKeyPointProdPlatform`,// 重点平台统计
    keyPointQueryProdCategory:`${volunteerUrl}/volunteer/admin/obligee/queryKeyPointProdCategory`,// 重点类目统计
    keyPointQueryProdTortsType:`${volunteerUrl}/volunteer/admin/obligee/queryKeyPointProdTortsType`,// 重点侵权类型统计
    keyPointQueryRepordProdArea:`${volunteerUrl}/volunteer/admin/obligee/queryKeyPointProdArea`,// 重点省份统计

    /**
     * 公共接口
     */
    getOwnedBrandList:`${volunteerUrl}/volunteer/admin/user/ownedBrandList`,//所属品牌商
    brandList:`${volunteerUrl}/volunteer/admin/brand/list`,//获取品牌
    prodList:`${volunteerUrl}/volunteer/admin/prod/list`,//所属类目
    sysDictlist:`${volunteerUrl}/volunteer/admin/sysDict/list`,//分类查询字段表
    fliterListDict: `${volunteerUrl}/volunteer/admin/sysDict/listFilter`,//过滤条件字典
    uploadFile:`${volunteerUrl}/volunteer/admin/file/upload`,//文件上传接口
    uploadImage:`${volunteerUrl}/volunteer/admin/file/uploadImage`,//文件上传接口
    vrResourcesList: `${volunteerUrl}/volunteer/admin/vresouces/list`, // 资源列表
    createExportExcel: `${volunteerUrl}/volunteer/admin/excel/saveExcelRecord`, // 创建导出数据信息
    reportReasonQueryList: `${volunteerUrl}/volunteer/admin/vresouces/reportReasonList`, // 查询参数--举报理由列表
    trademarkQueryList: `${volunteerUrl}/volunteer/admin/vresouces/trademarkList`, // 查询参数--商标
    queryExcelTitle: `${volunteerUrl}/volunteer/admin/excel/excelParam`, // 查询表格标题
    /**
     * 用户类型
     * 1 普通用户
     * 2 供应商用户
     * 3 志愿汇用户 
     * 4 调查公司
     * 5 调查员 
     * 7 执法
     */
    

    /**
     * 下载模板接口
     * @param fileName
     * 1 资源导入模版
     * 2 投诉管理模版
     * 3 微信投诉管理模版 
     * 4 视频投诉管理模版
     * 5 线上线索管理模版 
     * 6 线上举报任务管理模版
     * 8 品牌方确认导入模板
     */
    downloadExcelTemplate: `${volunteerUrl}/volunteer/admin/export/exportTemplate`, 

    /**
     * 志愿者举报管理
     */
    //reportPage: `${volunteerUrl}/volunteer/admin/report/page`,  // 举报管理分页接口
    reportPage: `${volunteerUrl}/volunteer/admin/reportNew/audit/page`,  // 举报管理分页接口
    modifyVReportDetailById: `${volunteerUrl}/volunteer/admin/report/modifyVReportDetailById`,  // 修改举报信息
    queryVReportDetailById: `${volunteerUrl}/volunteer/admin/report/queryVReportDetailById`,  // 过去修改举报信息的详情
    //volunteerRepoerCount: `${volunteerUrl}/volunteer/admin/report/count`,    // 志愿者举报管理待审核数量
    volunteerRepoerCount: `${volunteerUrl}/volunteer/admin/reportNew/audit/count`,    // 志愿者举报管理待审核数量
    volunteerRepoerExport: `${volunteerUrl}/volunteer/admin/reportNew/audit/export`,    // 志愿者举报管理导出
    //volunteerReportByIdList: `${volunteerUrl}/volunteer/admin/report/modifyVReportStatusByIdList`,
    volunteerReportByIdList: `${volunteerUrl}/volunteer/admin/reportNew/audit/status`,

    getAllReportPage:`${volunteerUrl}/volunteer/admin/volunteer/reportPage`,//志愿者举报统计
    getCountReport:`${volunteerUrl}/volunteer/admin/volunteer/countReport`,//获取志愿者举报统计信息    
    getBrandInfo:`${volunteerUrl}/volunteer/admin/vbrandtask/brandInfo`,//通过品牌获取交付数据

    //getFilterPage:`${volunteerUrl}/volunteer/admin/report/filterPage`,//运营审核分页查询
    getFilterPage:`${volunteerUrl}/volunteer/admin/reportNew/filter/page`,//运营审核分页查询
    //volunteerModifyfilter:`${volunteerUrl}/volunteer/admin/report/modifyStatus4filter`,//运营批量审核
    volunteerModifyfilter:`${volunteerUrl}/volunteer/admin/reportNew/filter/status`,//运营批量审核
    //getFilterCount:`${volunteerUrl}/volunteer/admin/report/queryFilterCount`,//获取待推送count
    getFilterCount:`${volunteerUrl}/volunteer/admin/reportNew/filter/count`,//获取待推送count
    getFilterExport: `${volunteerUrl}/volunteer/admin/reportNew/filter/export`,//导出
    //queryStorePage: `${volunteerUrl}/volunteer/admin/report/storePage`, // 查询商品店铺
    queryStorePage:`${volunteerUrl}/volunteer/admin/reportNew/audit/store/page`,//查询商品店铺
    //getFilterStorePage: `${volunteerUrl}/volunteer/admin/report/filterStorePage`,//运营筛选店铺
    getFilterStorePage: `${volunteerUrl}/volunteer/admin/reportNew/filter/store/page`,//运营筛选店铺
    /**
     * 品牌管理
     */
    //品牌管理
    getBrandList:`${volunteerUrl}/volunteer/admin/brand/page`,//品牌管理列表
    createBrandInfo:`${volunteerUrl}/volunteer/admin/brand/createBrand`,//新增品牌商
    brandListEditDetail:`${volunteerUrl}/volunteer/admin/brand/`,//品牌列表编辑获取详情
    brandListEdit:`${volunteerUrl}/volunteer/admin/brand/`,//品牌列表编辑确定
    brandCleanlinessPlatform: `${volunteerUrl}/volunteer/admin/brandCrawler/platformInfo/`,//洁净度查询品牌下的平台
    brandCleanliness:`${volunteerUrl}/volunteer/admin/brandCrawler/brandCrawlerList`,//品牌洁净度列表
    brandCleanlinessImmediate:`${volunteerUrl}/volunteer/admin/brandCrawler/run/`,//品牌洁净度立即监控
    brandCleanOn:`${volunteerUrl}/volunteer/admin/brandCrawler/on/`,//品牌洁净度启用
    brandCleanOff:`${volunteerUrl}/volunteer/admin/brandCrawler/off/`,//品牌洁净度禁用
    brandCleanlinessDel:`${volunteerUrl}/volunteer/admin/brandCrawler/remove/`,//品牌洁净度删除
    brandCleanlinessCrawler: `${volunteerUrl}/volunteer/admin/brandCrawler/queryBrandCrawlerTrend`, //查看洁净度趋势
    brandCleanlinessCrawlerData: `${volunteerUrl}/volunteer/admin/brandCrawler/queryBrandCrawlerDetailTrendData`, //查看洁净度趋势图的数据
    brandCleanlinessCrawlerDetail: `${volunteerUrl}/volunteer/admin/brandCrawler/queryCleanPageBrandCrawlerDetail`,  // 洁净度详情接口
    brandCleanlinessInsertCleanHistory: `${volunteerUrl}/volunteer/admin/brandCrawler/saveCleanHistory`, // 获取历史洁净度数据
    addBrandCleanliness:`${volunteerUrl}/volunteer/admin/brandCrawler/`,//新增洁净度规则
    //品牌方确认
    //brandConfirmation: `${volunteerUrl}/volunteer/admin/report/confirm/page`,//品牌方确认列表
    brandConfirmation: `${volunteerUrl}/volunteer/admin/reportNew/confirm/page`,//品牌方确认列表
    //confirmExamin: `${volunteerUrl}/volunteer/admin/report/confirm`,//品牌方确认审核
    confirmExamin: `${volunteerUrl}/volunteer/admin/reportNew/confirm/status`,//品牌方确认审核
    //confirmCount: `${volunteerUrl}/volunteer/admin/report/confirm/count`,    // 待确认数量
    confirmCount: `${volunteerUrl}/volunteer/admin//reportNew/confirm/count`,    // 待确认数量
    confirmationImportExcel:`${volunteerUrl}/volunteer/admin/report/confirm/import/excel`,//品牌方确认列表导入
    confirmationExport:`${volunteerUrl}/volunteer/admin/reportNew/confirm/export`,//品牌方确认列表导出
    getCleanLIst: `${volunteerUrl}/volunteer/admin/brandCrawler/cleanPage`,  // 获取清洁度列表
    cleanLIstDistribution:`${volunteerUrl}/volunteer/admin/brandCrawler/modifyCleanDistribute`,//洁净度数据分配
    cancellationDistribution:`${volunteerUrl}/volunteer/admin/brandCrawler/modifyCleanDistribute4Unassign`,//取消分配
    cleanConfirm:`${volunteerUrl}/volunteer/admin/brandCrawler/cleanConfirm`,//洁净度确认按钮
    countCleanConfirm:`${volunteerUrl}/volunteer/admin/brandCrawler/countCleanConfirm`,//统计已确认待确认
    modifyIsTort:`${volunteerUrl}/volunteer/admin/brandCrawler/modifyIsTort`,//洁净度审核
    getAllocatedCount:`${volunteerUrl}/volunteer/admin/brandCrawler/countCleanWaitStatus`,//获取待分配count
    /**
     * 监控规则相关接口
     */
    createImageMonitor:`${volunteerUrl}/volunteer/admin/monitor/createImageMonitor`,//新增图片监控
    monitorlist:`${volunteerUrl}/volunteer/admin/monitor/itemPage`,//监控结果
    monitoring:`${volunteerUrl}/volunteer/admin/monitor/monitorPage`,//监控规则列表
    changeMonitorToEnd: `${volunteerUrl}/volunteer/admin/monitor/changeMonitorToEnd`,
    changeMonitorToAgain: `${volunteerUrl}/volunteer/admin/monitor/changeMonitorToAgain`,
    monitorlistCheck:`${volunteerUrl}/volunteer/admin/monitor/changeAuditStatusById`,//监控结果审核
    monitorDetails:`${volunteerUrl}/volunteer/admin/monitor/`,//监控规则详情
    createCycleMonitor:`${volunteerUrl}/volunteer/admin/monitor/createCycleMonitor`,//新增监控规则
    newManualMonitor:`${volunteerUrl}/volunteer/admin/monitor/createManualMonitor`,//新增手动监控规则
    checkProdUrl: `${volunteerUrl}/volunteer/admin/monitor/checkUrl`,  // 校验商品URL是否有效
    distributeMonitorResult: `${volunteerUrl}/volunteer/admin/monitor/modifyMonitorDistribute`,  // 分配任务接口
    queryVolunterrList: `${volunteerUrl}/volunteer/admin/monitor/queryAllotVolunteerList`,  // 查询可被分配任务的志愿者
    queryMonitorPendingCount: `${volunteerUrl}/volunteer/admin/monitor/queryMonitorWaitAuditCount`,  // 查询当前条件待审核数量
    newRulrUploadImage:`${volunteerUrl}/volunteer/admin/monitor/uploadImage4tfsid`,//新增图片规则上传图片
    cancelDistributeMonitorResult: `${volunteerUrl}/volunteer/admin/monitor/modifyMonitorDistribute4Unassign`, // 取消分配任务
    monitorChooseCount: `${volunteerUrl}/volunteer/admin/monitor/allWaitCount`,  // 批量全选时统计数据
    monitorListAuditByList:`${volunteerUrl}/volunteer/admin/monitor/changeAuditStatusByIdList`,//监控结果审核
    getProdUrlList: `${volunteerUrl}/volunteer/admin/monitor/allChoseLink`,   // 获取商品链接列表
    /**
     * 报表相关接口（线上投诉概况）
     */
    ComplainSource:`${volunteerUrl}/volunteer/admin/stat/complainSource`,//投诉来源
    LegalrightsDrift:`${volunteerUrl}/volunteer/admin/stat/monitorLegalrightsDrift`,//投诉来源
    MlDriftBylAccuracyR:`${volunteerUrl}/volunteer/admin/stat/accuracyR`,//删除率趋势
    PlatformStoreByTop:`${volunteerUrl}/volunteer/admin/stat/storeTop`,//店铺Top5
    ReportUserReportWeek:`${volunteerUrl}/volunteer/admin/stat/reportWeek`,//用户举报数量
    countReportVideo:`${volunteerUrl}/volunteer/admin/stat/video`,//视频报表统计
    countReportWechat:`${volunteerUrl}/volunteer/admin/stat/webchat`,//视频报表统计
    RepordProdCategory:`${volunteerUrl}/volunteer/admin/stat/prodCategory`,//商品类目统计
    reportProdTortsTypeCount:`${volunteerUrl}/volunteer/admin/stat/tortsType`,//商品侵权类型统计
    reportProdPlatformCount:`${volunteerUrl}/volunteer/admin/stat/platform`,//商品平台统计
    RepordProdArea:`${volunteerUrl}/volunteer/admin/stat/prodArea`,//商品区域统计
    MonitorLegalrights:`${volunteerUrl}/volunteer/admin/stat/monitorLegalrights`,//监控维权信息
    reportNew:`${volunteerUrl}/volunteer/admin/stat/refresh`,//统计刷新

    /**
     * 投诉相关列表
     */
    complaintVideo: `${volunteerUrl}/volunteer/admin/complaint/video/listPage`,//视频投诉列表
    complaintVideoImport: `${volunteerUrl}/volunteer/admin/complaint/video/importExcel`,//视频投诉导入excal
    weChatListPage:`${volunteerUrl}/volunteer/admin/complaint/webchat/listPage`,//微信投诉管理列表
    weChartimportExcel:`${volunteerUrl}/volunteer/admin/complaint/webchat/importExcel`,//微信导入
    queryComplaintPages: `${volunteerUrl}/volunteer/admin/complaintArrange/page`, // 投诉管理列表
    compomplaintImportExcel: `${volunteerUrl}/volunteer/admin/complaintArrange/importExcel`,  // 投诉管理导入 
    //淘宝投诉账号
    complaintList: `${volunteerUrl}/volunteer/admin/complaint/account/page`,//投诉账号列表
    complaintDel: `${volunteerUrl}/volunteer/admin/complaint/account/remove/`,//删除投诉账号
    complaintAdd: `${volunteerUrl}/volunteer/admin/complaint/account/add`,//新增投诉账号
    complaintEdit: `${volunteerUrl}/volunteer/admin/complaint/account/`,//编辑投诉账号
    complaintPullData: `${volunteerUrl}/volunteer/admin/complaint/account/grab/`,//立即下拉线上投诉数据
    complaintBindBrand: `${volunteerUrl}/volunteer/admin/complaint/account/binding/`,//关联品牌商
    getCookitNum:`${volunteerUrl}/volunteer/admin/complaint/pull/auto/cookies`,//获取自动投诉cookie
    getAutomatedComplaint: `${volunteerUrl}/volunteer/admin/complaint/account/modifyAccountInfoForAutoComplaint/`,//自动投诉开启

    /**
     * 案件管理相关接口
     */

    caseList: `${volunteerUrl}/volunteer/admin/lawcase/listPage`,//案件管理列表
    caseimportExcel: `${volunteerUrl}/volunteer/admin/lawcase/importExcel`,//案件导入
    lawcaseAudit:`${volunteerUrl}/volunteer/admin/lawcase/audit`,//案件审核
    lawcaseDetail:`${volunteerUrl}/volunteer/admin/lawcase/details/`,//案件基本信息
    lawcaseCaseDetail: `${volunteerUrl}/volunteer/admin/lawcase/details/case/`,//案件信息详情
    lawcaseCompanyDetail: `${volunteerUrl}/volunteer/admin/lawcase/details/company/`,//企业信息详情
    lawcaseProcessDetail: `${volunteerUrl}/volunteer/admin/lawcase/details/process/`,//案件过程
    lawcaseProdDetail: `${volunteerUrl}/volunteer/admin/lawcase/details/prod/`,//商品列表详情
    lawcaseSuitDetail: `${volunteerUrl}/volunteer/admin/lawcase/details/suit/`,//诉讼信息详情
    lawcaseWarnDetail: `${volunteerUrl}/volunteer/admin/lawcase/details/warn/`,//警告信详情
    lawcaseClassfy:`${volunteerUrl}/volunteer/admin/lawcase/classfy`,//案件归类
    lawcaseModifyCase: `${volunteerUrl}/volunteer/admin/lawcase/modify/basic/`, // 修改案件信息
    lawcaseModifyCompany: `${volunteerUrl}/volunteer/admin/lawcase/modify/company/`, // 修改企业信息
    lawcaseModifyProcess: `${volunteerUrl}/volunteer/admin/lawcase/modify/process/`, // 修改案件进度信息
    lawcaseModifyProd: `${volunteerUrl}/volunteer/admin/lawcase/modify/prod/`, // 修改商品信息
    lawcaseModifySuit: `${volunteerUrl}/volunteer/admin/lawcase/modify/suit/`, // 修改诉讼信息
    lawcaseModifyWarn: `${volunteerUrl}/volunteer/admin/lawcase/modify/warn/`, // 修改警告信
    Addlawcase:`${volunteerUrl}/volunteer/admin/lawcase/`,//新增案件信息
    verifyCaseNumber:`${volunteerUrl}/volunteer/admin/lawcase/details/validate/caseno`,//验证案件编号唯一
    getProDetails:`${volunteerUrl}/volunteer/admin/lawcase/details/prod/info/`,//获取商品详情信息
    getAsyncRefresh:`${volunteerUrl}/volunteer/admin/lawcase/modify/prod/refresh/`,//异步重新刷新商品信息

    /**
     * 系统管理
     */
    //系统用户
    systemList:`${volunteerUrl}/volunteer/admin/listPage`,//系统管理
    systemPass: `${volunteerUrl}/volunteer/admin/modifyStatus`,//启用禁用
    systemRole: `${volunteerUrl}/volunteer/admin/role/list`,//角色列表 
    syatemChangePw: `${volunteerUrl}/volunteer/admin/modify/password/`,//修改密码
    systemCreate: `${volunteerUrl}/volunteer/admin/`,//新增用户
    systemUserRole: `${volunteerUrl}/volunteer/admin/modify/roleInfo/`, // 修改用户角色
    updateUserStatus:`${volunteerUrl}/volunteer/admin/modifyStatus`,// 用户状态修改
    //白名单
    whiteList: `${volunteerUrl}/volunteer/admin/white/page`,//白名单列表
    delWhite: `${volunteerUrl}/volunteer/admin/white/delete/`,//删除白名单
    addWhite: `${volunteerUrl}/volunteer/admin/white/createCrawlerWhite`,//新增白名单
    appendOrCover: `${volunteerUrl}/volunteer/admin/white/appendOrCover`,  // 白名单导入追加或覆盖
    //资源列表
    resoucesList:`${volunteerUrl}/volunteer/admin/vresouces/listPage`,//资源管理列表
    createResources:`${volunteerUrl}/volunteer/admin/vresouces/`,//新增资源
    deleteResources:`${volunteerUrl}/volunteer/admin/vresouces/del/`,//删除资源
    editResources:`${volunteerUrl}/volunteer/admin/vresouces/modifyVResources`,//编辑资源信息
    importVResources:`${volunteerUrl}/volunteer/admin/vresouces/importExcel`,//资源管理导入
    resourceBrand: `${volunteerUrl}/volunteer/admin/brand/brandByVResource`,  // 获取对应type的品牌  商标、盗图
    queryResourceForData: `${volunteerUrl}/volunteer/admin/vresouces/queryResourceByBrandAndRelationType`, // 根据品牌和举报类别 查询（商标和投诉理由）数据
    addAutoComplaintReason: `${volunteerUrl}/volunteer/admin/vresouces/makeDefaultVResources`,   // 新增自动投诉的资源
    //角色管理
    roleList:`${volunteerUrl}/volunteer/admin/role/listPage`,//角色管理分页
    roleDeleteId:`${volunteerUrl}/volunteer/admin/role/disable`,//禁用
    roleEnable:`${volunteerUrl}/volunteer/admin/role/enable`,//启用
    roleDel:`${volunteerUrl}/volunteer/admin/role/del`,//删除角色
    roleAuth: `${volunteerUrl}/volunteer/admin/perm/role/`,  //角色权限编辑
    roleAuthTree: `${volunteerUrl}/volunteer/admin/perm/role/tree/all/`,  // 获取角色权限
    permissionList: `${volunteerUrl}/volunteer/admin/perm/`, // 获取当前用户展示菜单
    roleAdd: `${volunteerUrl}/volunteer/admin/role/`,//新增角色
    lawyerAddType: `${volunteerUrl}/volunteer/admin/lawyer/role/list`,//新增专案平台账号类型下拉
    //字典表
    dictonaryList:`${volunteerUrl}/volunteer/admin/sysDict/listPage`,//字典列表
    dictonaryType: `${volunteerUrl}/volunteer/admin/sysDict/typeList`,//字典类型下拉
    dictonaryDetele:`${volunteerUrl}/volunteer/admin/sysDict/del`,//删除字典
    dictonarymodify:`${volunteerUrl}/volunteer/admin/sysDict/modifySysDict`,//编辑字典信息
    dictonaryCreate:`${volunteerUrl}/volunteer/admin/sysDict/createSysDict`,//字典表新增
    //类目表
    categoryList:`${volunteerUrl}/volunteer/admin/prod/listPage`,//类目列表
    categoryDetele:`${volunteerUrl}/volunteer/admin/prod/del`,//类目删除
    categoryModify:`${volunteerUrl}/volunteer/admin/prod/modify`,//类目编辑
    categoryCreate:`${volunteerUrl}/volunteer/admin/prod/create`,//类目新增
    authorityPages: `${volunteerUrl}/volunteer/admin/perm/queryAdminPermission`, // 权限列表
    addAuthority: `${volunteerUrl}/volunteer/admin/perm/createAdminPermission`,  // 新增权限
    deleteAuthority: `${volunteerUrl}/volunteer/admin/perm/deleteAdminPermission`,  // 删除权限
    editAuthority: `${volunteerUrl}/volunteer/admin/perm/modifyAdminPermission`,   // 编辑权限
    editAuthoritySort: `${volunteerUrl}/volunteer/admin/perm/modifyAdminPermissionSort`,   // 排序
    // 操作日志
    systemOplogsPage: `${volunteerUrl}/volunteer/admin/oplog/page`,  // 操作日志分页
    //版本号管理
    versionList:`${volunteerUrl}/volunteer/admin/version/list`,//查询所有js版本号
    modifyVersion:`${volunteerUrl}/volunteer/admin/version`,//修改指定版本号
    judgingVersion:`${volunteerUrl}/volunteer/admin/version`,//查询指定版本号
    excelExport: `${volunteerUrl}/volunteer/admin/excel/listPage`, // 导出列表
    downloadExcel: `${volunteerUrl}/volunteer/admin/excel/downLoad`,  //excel 下载接口
    excelCount: `${volunteerUrl}/volunteer/admin/excel/modifyInfoById`, // 下载excel 计数
    // 发布日志
    queryScriptLog: `${volunteerUrl}/volunteer/admin/scriptlog/scriptLogPage`, // 查询发布日志列表
    modifyScriptLog: `${volunteerUrl}/volunteer/admin/scriptlog/modifyScriptLog`, // 查询发布日志列表
    delScriptLog: `${volunteerUrl}/volunteer/admin/scriptlog/delScriptLog`, // 查询发布日志列表
    createScriptLog: `${volunteerUrl}/volunteer/admin/scriptlog/createScriptLog`, // 查询发布日志列表
    //专案账号类型管理
    lawyerRoleList: `${volunteerUrl}/volunteer/admin/lawyer/role/page`,//专案角色列表
    lawyerRoleAdd: `${volunteerUrl}/volunteer/admin/lawyer/role/`,//新增角色
    lawyerRoleOff:`${volunteerUrl}/volunteer/admin/lawyer/role/off/`,//禁用
    lawyerRoleEnable:`${volunteerUrl}/volunteer/admin/lawyer/role/on/`,//启用
    lawyerRoleDel:`${volunteerUrl}/volunteer/admin/lawyer/role/del/`,//删除角色    
    lawyerRoleAuthTree: `${volunteerUrl}/volunteer/admin/lawyer/role/perm/tree/all/`,  // 获取角色权限
    lawyerRoleAuth: `${volunteerUrl}/volunteer/admin/lawyer/role/perm/`,  // 角色权限编辑

    /**
     * 线索及任务管理
     */
    onLineClue: `${volunteerUrl}/volunteer/admin/b2bReport/on/page`,//线上线索管理列表
    onLineClueExamin: `${volunteerUrl}/volunteer/admin/b2bReport/on/audit/`,//线上线索管理审核
    onLineClueImport: `${volunteerUrl}/volunteer/admin/b2bReport/on/importExcel`,//线上线索导入
    offLineClue: `${volunteerUrl}/volunteer/admin/b2bReport/off/page`,//线下线索管理列表
    offLineClueExamin: `${volunteerUrl}/volunteer/admin/b2bReport/off/audit/`,//线下线索管理审核
    reportApplication:`${volunteerUrl}/volunteer/admin/reportTaskApply/listPage`,//举报任务申请管理
    reportApplicationExamine:`${volunteerUrl}/volunteer/admin/reportTaskApply/modifyTaskAply`,//举报任务申请管理审核
    reportTaskList: `${volunteerUrl}/volunteer/admin/reportTask/listPage`,//举报任务管理列表
    reportAddTask: `${volunteerUrl}/volunteer/admin/reportTask/publishTask`,//举报任务 发布任务
    reportEndTask: `${volunteerUrl}/volunteer/admin/reportTask/endTask`,//举报任务 结束任务
    onReportClue:`${volunteerUrl}/volunteer/admin/reportTaskWork/listPage/on`,//举报任务线上线索管理列表
    offReportClue:`${volunteerUrl}/volunteer/admin/reportTaskWork/listPage/off`,//举报任务线下线索管理列表
    onReportClueExamine:`${volunteerUrl}/volunteer/admin/reportTaskWork/modifyTaskWorkOn`,//举报任务线上审核
    offReportClueExamine:`${volunteerUrl}/volunteer/admin/reportTaskWork/modifyTaskWorkOff`,//举报任务线下审核
    taskDownloadExcel: `${volunteerUrl}/volunteer/admin/reportTaskWork/downloadExcel`, //举报任务线上线索管理 下载导出模板
    taskImportExcel: `${volunteerUrl}/volunteer/admin/reportTaskWork/importExcel`,  //举报任务线上线索管理导入
    reportTaskDetail:`${volunteerUrl}/volunteer/admin/reportTask`,//举报任务详情
    /**
     * 鉴定管理
     */    
    appraisalList:`${volunteerUrl}/volunteer/admin/appraisal/queryAppraisalByPage`,//鉴定列表
    appraisalDetail:`${volunteerUrl}/volunteer/admin/appraisal/queryAppraisalById`,//鉴定详情
    appraisalExamine:`${volunteerUrl}/volunteer/admin/appraisal/modifyAppraisalById`,//审核鉴定

    /**
     * 调查举报管理
     */
    getReportAwardList:`${volunteerUrl}/volunteer/admin/compensable/queryApplyByPage`,//举报奖励发放
    getReportAwardListDetail:`${volunteerUrl}/volunteer/admin/compensable/queryApplyById`,//举报奖励发放详情
    getInvestigationReportList:`${volunteerUrl}/volunteer/admin/compensable/queryCompensableReportByPage`,//调查举报-线索列表
    getInvestigationTaskList:`${volunteerUrl}/volunteer/admin/compensable/queryCompensableDetailByPage`,//调查举报-任务列表
    getInvestigationDetail:`${volunteerUrl}/volunteer/admin/compensable/queryCompensableReportById`,//举报线索详情
    editInvestigationStatus:`${volunteerUrl}/volunteer/admin/compensable/checkCompensable`,//线索审核通过 不通过状态
    editInvestigationMoney:`${volunteerUrl}/volunteer/admin/compensable/modifyMoney`,//编辑举报任务金额
    editInvestigationAllot:`${volunteerUrl}/volunteer/admin/compensable/allotCompensable`,//分配调查员信息
    editfinishStatus:`${volunteerUrl}/volunteer/admin/compensable/finishCompensable`,//调查举报线索完结
    investigationLog:`${volunteerUrl}/volunteer/admin/compensable/queryCompensableLogPage`,//获取日志信息
    userInfo:`${volunteerUrl}/volunteer/admin/volunteer/queryB2bUserById`,//获取组团人员本身信息
    editStopCompensable:`${volunteerUrl}/volunteer/admin/compensable/stopCompensable`,//举报任务中止
    getInvestigationTaskDetail:`${volunteerUrl}/volunteer/admin/compensable/queryCompensableDetailById`,//调查举报任务详情
    editOverCompensable:`${volunteerUrl}/volunteer/admin/compensable/overCompensable`,//举报任务完成
    editCheckConsult:`${volunteerUrl}/volunteer/admin/compensable/checkConsult`,//举报列表协商
    editGiveOut:`${volunteerUrl}/volunteer/admin/compensable/giveout`,//举报奖励发放审核
    createDetailMoney:`${volunteerUrl}/volunteer/admin/compensable/modifyDetailMoney`,//协商金额
    getInvestigationByPage:`${volunteerUrl}/volunteer/admin/investigator/queryInvByPage`,//获取调查员数据

    /**
     * 用户管理相关接口
     */    
    getVolunteerPage:`${volunteerUrl}/volunteer/admin/volunteer/volPage`,//志愿者管理
    changeStatusById:`${volunteerUrl}/volunteer/admin/volunteer/changeStatusById`,//禁用启用状态
    investgatorsList:`${volunteerUrl}/volunteer/admin/investigator/queryInvByPage`,//二期调查员列表搜索
    investgatorDetail:`${volunteerUrl}/volunteer/admin/investigator/queryInvById`,//   userId  调查员审核详情接口
    investgatorAudit: `${volunteerUrl}/volunteer/admin/investigator/modifyInvById`, // 调查员审核
    investgatorApplyAudit:`${volunteerUrl}/volunteer/admin/investigator/modifyInvApplyById`,//这个是审核调查员的接口  userId  checkStatus  isWork  address  experience  workTime  coverRange  successExample  email  idNo industry
    investgatorAuditList: `${volunteerUrl}/volunteer/admin/investigator/queryInvApplyByPage`,  // 调查员审核列表
    lawyerList: `${volunteerUrl}/volunteer/admin/lawyer/user/page`,//专案平台用户列表
    lawyerOff: `${volunteerUrl}/volunteer/admin/lawyer/user/off/`, //用户禁用
    lawyerOn: `${volunteerUrl}/volunteer/admin/lawyer/user/on/`, //用户启用
    lawyerAdd: `${volunteerUrl}/volunteer/admin/lawyer/creatUser`, //用户新增

    // 线索专案
    getCluePage:`${volunteerUrl}/volunteer/admin/lawyer/clue/cluePage`,//线索专案列表
    getQueryClueInfoById:`${volunteerUrl}/volunteer/admin/lawyer/clue/queryClueInfoById`,//线索专案详情
    clueAudit:`${volunteerUrl}/volunteer/admin/lawyer/clue/modifyClueStatusById`,//审核
    editClassification:`${volunteerUrl}/volunteer/admin/lawyer/clue/modifyClueTypeById`,//归类
    editHolderAudit:`${volunteerUrl}/volunteer/admin/lawyer/clue/modifyClueStatusByRightAndId`,//权利人审核
    clueConfirmPage:`${volunteerUrl}/volunteer/admin/lawyer/clue/clueConfirmPage`,//权利人线索列表

    //诉讼列表
    getSuitPage:`${volunteerUrl}/volunteer/admin/lawyer/suit/suitPage`,//诉讼列表
    getDefendantInfo: `${volunteerUrl}/volunteer/admin/lawyer/suit/queryDefendantInfo`, // 诉讼案件详情 -- 对方当事人信息
    modifyDefendantInfo: `${volunteerUrl}/volunteer/admin/lawyer/suit/modifyDefendantInfo`, // 诉讼案件详情  -- 对方当事人信息修改
    removeDefendantInfo: `${volunteerUrl}/volunteer/admin/lawyer/suit/removeDefendantInfo`, // 诉讼案件详情  -- 对方当事人信息删除
    getProcessInfo: `${volunteerUrl}/volunteer/admin/lawyer/suit/queryProcessInfo`,     // 诉讼案件详情 -- 进程信息
    getSuitDetail: `${volunteerUrl}/volunteer/admin/lawyer/suit/querySuitInfoBySuitNo`,     // 诉讼案件详情 -- 诉讼案件详情信息
    auditSuitInfo: `${volunteerUrl}/volunteer/admin/lawyer/suit/auditSuitInfo`,         // 诉讼案件详情 -- 进程审核
    modifySuitDistribute: `${volunteerUrl}/volunteer/admin/lawyer/suit/modifySuitDistribute`,     // 诉讼案件详情 -- 案件分配
    getAllotLawyer:`${volunteerUrl}/volunteer/admin/lawyer/user/page`,//律师下拉接口
    queryLogs:`${volunteerUrl}/volunteer/admin/lawyer/suit/log`,//获取日志

    getLawyerBrand:`${volunteerUrl}/volunteer/admin/lawyer/brand/list`,//线索管理获取品牌接口

    brandSuitList:`${volunteerUrl}/volunteer/admin/lawyer/suit/suitPage4Brand`,//品牌方诉讼案件管理列表
    modifyBrandSuitList:`${volunteerUrl}/volunteer/admin/lawyer/suit/modifySuitStatus4Brand`,//品牌方诉讼案件管理审核

    //专案
    caseConfirmPage:`${volunteerUrl}/volunteer/admin/lawyer/case/caseConfirmPage`,//品牌方线下专案列表
    closeCase:`${volunteerUrl}/volunteer/admin/lawyer/case/closeCase`,//结案
    pushBrandCase:`${volunteerUrl}/volunteer/admin/lawyer/case/modifyCaseStatusById`,//线下专案 -推送
    giveUpCase:`${volunteerUrl}/volunteer/admin/lawyer/case/quitCase`,//线下专案-放弃案件
    getOfflineCaseDetail:`${volunteerUrl}/volunteer/admin/lawyer/case/queryCaseInfoById`,//专案详情
    updateBrandOffline:`${volunteerUrl}/volunteer/admin/lawyer/case/modifyCaseStatusByRightAndId`,//线下专案品牌商审核
    queryLawyerCaseReport: `${volunteerUrl}/volunteer/admin/lawyer/case/queryLawyerCaseReport`, // 根据当前专案id查询调查结果
    queryProcessInfo: `${volunteerUrl}/volunteer/admin/lawyer/case/queryProcessInfo`, // 根据当前专案id查询执行结果
    saveLawyerCaseReport: `${volunteerUrl}/volunteer/admin/lawyer/case/saveLawyerCaseReport`, // 填写调查结果
    saveProcessInfo: `${volunteerUrl}/volunteer/admin/lawyer/case/saveProcessInfo`, // 填写执行结果信息
    queryOfflineList:`${volunteerUrl}/volunteer/admin/lawyer/case/casePage`,//线下案件管理列表
    getOfflineLogList:`${volunteerUrl}/volunteer/admin/lawyer/case/log/`,//日志
    // 1./admin/prod/list
    // 增加参数brandId
    // 2./admin/sysDict/list
    // 增加参数brandId
    // 3./admin/brand/list
    // 参数修改为reportType 指定举报类型的品牌list  
    //  reportTypeOrList   设置举报类型的品牌list（多个存在一个即返回

}