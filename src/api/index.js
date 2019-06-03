/**
 * The main api service
 */
import req from './req';
import http from './http';
export default {
    /**
     * 监控规则相关接口
     */
    // 监控规则
    monitoring(params) {
        return http.get(req.monitoring, params)
    },
    // 监控结果审核列表
    monitorlist(params) {
        return http.get(req.monitorlist, params)
    },

    // 结束
    changeMonitorToEnd(params) {
        return http.post(req.changeMonitorToEnd, params)
    },

    // 再跑一次
    changeMonitorToAgain(params) {
        return http.post(req.changeMonitorToAgain, params)
    },

    // 监控结果审核
    monitorlistCheck(params) {
        return http.post(req.monitorlistCheck, params)
    },

    //新增图片规则
    createImageMonitor(params) {
        return http.post(req.createImageMonitor, params)
    },

    //新增监控规则
    createCycleMonitor(params) {
        return http.post(req.createCycleMonitor, params)
    },

    //新增手动监控规则
    newManualMonitor(params) {
        return http.post(req.newManualMonitor, params)
    },

    //监控规则详情
    monitorDetails(params) {
        return http.get(req.monitorDetails + params.id, params)
    },

    // 校验商品URL
    checkProdUrl(params) {
        return http.get(req.checkProdUrl, params)
    },

    // 分配志愿者任务
    distributeMonitorResult(params) {
        return http.postFormData(req.distributeMonitorResult, params)
    },

    // 取消分配任务
    cancelDistributeMonitorResult(params) {
        return http.postFormData(req.cancelDistributeMonitorResult, params)
    },

    // 监控结果 查询当前条件待审核数量
    monitorChooseCount(params) {
        return http.get(req.monitorChooseCount, params)
    },

    // 批量审核
    monitorListAuditByList(params) {
        return http.post(req.monitorListAuditByList, params)
    },

    // 获取商品链接列表
    getProdUrlList(params) {
        return http.get(req.getProdUrlList, params)
    },

    // 查询志愿者
    queryVolunterrList(params) {
        return http.get(req.queryVolunterrList, params)
    },

    // 查询当前条件的待审核数量
    queryMonitorPendingCount(params) {
        return http.get(req.queryMonitorPendingCount, params)
    },

    // 权限列表
    permissionList(params) {
        return http.get(req.permissionList, params)
    },

    /**
     * 线上经营看板接口
     */
    //统计
    MonitorLegalrights(params) {
        return http.get(req.MonitorLegalrights, params)
    },
    //投诉来源
    ComplainSource(params) {
        return http.get(req.ComplainSource, params)
    },
    //投诉量趋势
    LegalrightsDrift(params) {
        return http.get(req.LegalrightsDrift, params)
    },
    //删除率趋势
    MlDriftBylAccuracyR(params) {
        return http.get(req.MlDriftBylAccuracyR, params)
    },
    //店铺Top5
    PlatformStoreByTop(params) {
        return http.get(req.PlatformStoreByTop, params)
    },
    //用户举报数量
    ReportUserReportWeek(params) {
        return http.get(req.ReportUserReportWeek, params)
    },
    //商品区域统计
    RepordProdArea(params) {
        return http.get(req.RepordProdArea, params)
    },
    //商品类目
    RepordProdCategory(params) {
        return http.get(req.RepordProdCategory, params)
    },
    //商品类型
    reportProdTortsTypeCount(params) {
        return http.get(req.reportProdTortsTypeCount, params)
    },
    //商品平台
    reportProdPlatformCount(params) {
        return http.get(req.reportProdPlatformCount, params)
    },
    // 微信
    countReportWechat(params) {
        return http.get(req.countReportWechat, params)
    },
    // 视频
    countReportVideo(params) {
        return http.get(req.countReportVideo, params)
    },
    //统计刷新
    reportNew(params) {
        return http.get(req.reportNew, params)
    },

    //登录
    login(params) {
        return http.postFormData(req.login, params)
    },

    //退出
    logout(params) {
        return http.get(req.logout,params)
    },

    /**
     * 权利人首页相关接口 
     */
    queryReportMonitorLegalrights(params) {
        // 网络管理数据
        return http.get(req.queryReportMonitorLegalrights, params)
    },
    keyPointQueryBrand(params) {
        // 重点品牌统计
        return http.get(req.keyPointQueryBrand, params)
    },
    keyPointQueryProdPlatform(params) {
        // 重点平台统计
        return http.get(req.keyPointQueryProdPlatform, params)
    },
    keyPointQueryProdCategory(params) {
        // 重点类目统计
        return http.get(req.keyPointQueryProdCategory, params)
    },
    keyPointQueryProdTortsType(params) {
        // 重点侵权类型统计
        return http.get(req.keyPointQueryProdTortsType, params)
    },
    keyPointQueryRepordProdArea(params) {
        // 重点省份统计
        return http.get(req.keyPointQueryRepordProdArea, params)
    },

    // 消息通知
    queryNotice(params) {
        return http.get(req.queryNotice, params)
    },

    /**
     * 用户管理相关接口
     */
    //志愿者管理
    getVolunteerPage(params) {
        return http.get(req.getVolunteerPage, params)
    },

    //志愿者管理禁用启用
    changeStatusById(params) {
        return http.postFormData(req.changeStatusById, params)
    },

    // 调查员、调查公司列表
    investgatorsList(params) {
        return http.get(req.investgatorsList, params)
    },

    // 调查员、调查公司详情
    investgatorDetail(params) {
        return http.get(req.investgatorDetail, params)
    },

    // 调查员、调查公司审核
    investgatorAudit(params) {
        return http.postFormData(req.investgatorAudit, params)
    },

    // 调查员申请、调查公司申请审核
    investgatorApplyAudit(params) {
        return http.postFormData(req.investgatorApplyAudit, params)
    },

    // 调查员、调查公司审核列表
    investgatorAuditList(params) {
        return http.get(req.investgatorAuditList, params)
    },

    //获取调查员列表
    getInvestigationByPage(params) {
        return http.get(req.getInvestigationByPage, params)
    },

    //专案用户列表
    lawyerList(params) {
        return http.get(req.lawyerList, params)
    },
    //专案用户列表禁用
    lawyerOff(params) {
        return http.postFormData(req.lawyerOff + params.userId, params)
    },
    //专案用户启用
    lawyerOn(params) {
        return http.postFormData(req.lawyerOn + params.userId, params)
    },
    //用户新增
    lawyerAdd(params) {
        return http.postFormData(req.lawyerAdd, params)
    },
    /**
     * 公共数据相关接口
     */    
    //所属品牌商下拉
    getOwnedBrandList(params) {
        return http.get(req.getOwnedBrandList, params)
    },
    //分类查询字典表
    sysDictlist(params) {
        return http.get(req.sysDictlist, params)
    },

    //获取平台
    getPlatformList(params) {
        return http.postFormData(req.getPlatformList, params)
    },
    
    //获取品牌
    brandList(params) {
        return http.get(req.brandList, params)
    },

    //过滤条件字典
    fliterListDict(params) {
        return http.get(req.fliterListDict, params)
    },

    //商标类目
    prodList(params) {
        return http.get(req.prodList, params)
    },

    vrResourcesList(params) {
        return http.get(req.vrResourcesList, params)
    },

    // 查询参数--举报理由
    getReportReasonQueryList(params) {
        return http.get(req.reportReasonQueryList, params)
    },

    // 查询参数--商标
    getTrademarkQueryList(params) {
        return http.get(req.trademarkQueryList, params)
    },

    // 查询表格title
    queryExcelTitle(params) {
        return http.get(req.queryExcelTitle, params)
    },

    /**
     * 品牌管理相关接口
     */
    
    //品牌列表
    getBrandList(params) {
        return http.get(req.getBrandList,params)
    },

    //新增品牌商
    createBrandInfo(params) {
        return http.postFormData(req.createBrandInfo,params)
    },
    //品牌列表编辑按钮获取详情
    brandListEditDetail(params) {
        return http.get(req.brandListEditDetail + params.brandId,params)
    },
    //品牌编辑确定
    brandListEdit(params) {
        return http.postFormData(req.brandListEdit + params.id, params)
    },

    //品牌方确认列表
    brandConfirmation(params) {
        return http.get(req.brandConfirmation, params)
    },
    
    //品牌方确认审核
    confirmExamin(params) {
        return http.postFormData(req.confirmExamin, params)
    },

    // 品牌方确认 获取待审核数量
    confirmCount(params) {
        return http.get(req.confirmCount, params)
    },
    //品牌方确认导出
    confirmationExport(params) {
        return http.get(req.confirmationExport, params)
    },
    //查询品牌下的品台
    brandCleanlinessPlatform(params) {
        return http.get(req.brandCleanlinessPlatform + params.brandId, params)
    },
    //品牌洁净度列表
    brandCleanliness(params) {
        return http.get(req.brandCleanliness, params)
    },
    //品牌洁净度立即监控
    brandCleanlinessImmediate(params) {
        return http.postFormData(req.brandCleanlinessImmediate + params.id, params)
    },
    //品牌洁净度启用
    brandCleanOn(params) {
        return http.postFormData(req.brandCleanOn + params.id, params)
    },
    //品牌洁净度禁用
    brandCleanOff(params) {
        return http.postFormData(req.brandCleanOff + params.id, params)
    },
    
    // 清洁度统计列表
    getCleanLIst(params) {
        return http.get(req.getCleanLIst, params)
    },
    //洁净度数据分配
    cleanLIstDistribution(params) {
        return http.postFormData(req.cleanLIstDistribution, params)
    },
    //洁净度取消分配
    cancellationDistribution(params) {
        return http.postFormData(req.cancellationDistribution, params)
    },
    //洁净度确认
    cleanConfirm(params) {
        return http.postFormData(req.cleanConfirm, params)
    },
    //洁净度统计获取已确认值待确认值
    countCleanConfirm(params) {
        return http.get(req.countCleanConfirm, params)
    },
    //标记侵权
    modifyIsTort(params) {
        return http.post(req.modifyIsTort, params)
    },
    //获取待分配count
    getAllocatedCount(params) {
        return http.get(req.getAllocatedCount, params)
    },
    //品牌洁净度删除
    brandCleanlinessDel(params) {
        return http.postFormData(req.brandCleanlinessDel + params.id, params)
    },
    //品牌洁净度趋势查看
    brandCleanlinessCrawler(params) {
        return http.get(req.brandCleanlinessCrawler, params)
    },
    //查看洁净度趋势数据
    brandCleanlinessCrawlerData(params) {
        return http.postFormData(req.brandCleanlinessCrawlerData, params)
    },
    // 洁净度详情接口 
    brandCleanlinessCrawlerDetail(params) {
        return http.get(req.brandCleanlinessCrawlerDetail, params)
    },
    //获取历史洁净度数据
    brandCleanlinessInsertCleanHistory(params) {
        return http.postFormData(req.brandCleanlinessInsertCleanHistory, params)
    },
    //新增洁净度规则
    addBrandCleanliness(params) {
        return http.postFormData(req.addBrandCleanliness, params)
    },
    
    /**
     * 志愿者举报相关接口
     */
    //志愿者举报统计-获取统计数据
    getCountReport(params) {
        return http.get(req.getCountReport, params)
    },
    //志愿者举报统计
    getAllReportPage(params) {
        return http.get(req.getAllReportPage, params)
    },

    // 举报管理接口
    reportPage(params) {
        return http.get(req.reportPage, params)
    },

    //全选 审核志愿者举报管理待审核总量
    getVolunteerRepoerCount(params) {
        return http.get(req.volunteerRepoerCount, params)
    },
    //志愿者举报管理导出
    volunteerRepoerExport(params) {
        return http.get(req.volunteerRepoerExport, params)
    },

    //批量审核志愿者举报管理
    volunteerReportByIdList(params) {
        return http.postFormData(req.volunteerReportByIdList, params)
    },
    //根据品牌获取交付数据
    getBrandInfo(params) {
        return http.get(req.getBrandInfo, params)
    },

    // 获取修改志愿者举报的数据的详情
    queryVReportDetailById(params) {
        return http.get(req.queryVReportDetailById, params)
    },
    // 修改志愿者举报的数据
    modifyVReportDetailById(params) {
        return http.post(req.modifyVReportDetailById, params)
    },

    // 查询店铺待审核量
    queryStorePage(params) {
        return http.get(req.queryStorePage, params)
    },

    /**
     * 投诉管理相关接口
     */
    //投诉管理
    queryComplaintPages(params) {
        return http.get(req.queryComplaintPages, params)
    },

    //视频投诉管理列表
    complaintVideo(params) {
        return http.get(req.complaintVideo, params)
    },

    //微信投诉列表
    weChatListPage(params) {
        return http.get(req.weChatListPage, params)
    },

    //获取自动投诉cookie
    getCookitNum(params) {
        return http.get(req.getCookitNum, params)
    },
    
    /**
     * 案件管理相关接口
     */
    //案件管理列表
    caseList(params) {
        return http.get(req.caseList, params)
    },

    //案件审核
    lawcaseAudit(params) {
        return http.postFormData(req.lawcaseAudit, params)
    },

    //获取详情接口
    lawcaseDetail(params) {
        return http.get(req.lawcaseDetail + params.id, params)
    },

    //案件信息详情
    lawcaseCaseDetail(params) {
        return http.get(req.lawcaseCaseDetail + params.id, params)
    },

    //企业信息详情
    lawcaseCompanyDetail(params) {
        return http.get(req.lawcaseCompanyDetail + params.id, params)
    },

    //案件过程
    lawcaseProcessDetail(params) {
        return http.get(req.lawcaseProcessDetail + params.id, params)
    },

    //商品列表详情
    lawcaseProdDetail(params) {
        return http.get(req.lawcaseProdDetail + params.id, params)
    },

    //诉讼信息详情
    lawcaseSuitDetail(params) {
        return http.get(req.lawcaseSuitDetail + params.id, params)
    },

    //警告信详情
    lawcaseWarnDetail(params) {
        return http.get(req.lawcaseWarnDetail + params.id, params)
    },

    //案件归类
    lawcaseClassfy(params) {
        return http.postFormData(req.lawcaseClassfy, params)
    },

    // 修改案件信息
    lawcaseModifyCase(params) {
        return http.post(`${req.lawcaseModifyCase+params.id}?userId=${params.userId}`, params)
    },

    //修改企业信息
    lawcaseModifyCompany(params) {
        return http.post(`${req.lawcaseModifyCompany+params.id}?userId=${params.userId}`, params)
    },

    //案件过程相关信息
    lawcaseModifyProcess(params) {
        return http.post(`${req.lawcaseModifyProcess+params.id}?userId=${params.userId}`, params)
    },

    // 警告信编辑
    lawcaseModifyWarn(params) {
        return http.post(`${req.lawcaseModifyWarn+params.id}?userId=${params.userId}`, params)
    },

    // 修改商品信息
    lawcaseModifyProd(params) {
        return http.post(`${req.lawcaseModifyProd+params.id}?userId=${params.userId}`, params)
    },

    // 修改诉讼信息
    lawcaseModifySuit(params) {
        return http.post(`${req.lawcaseModifySuit+params.id}?userId=${params.userId}`, params)
    },

    //新增案件信息
    Addlawcase(params) {
        return http.post(req.Addlawcase + `?userId=${params.userId}`, params)
    },

    verifyCaseNumber(params){
        return http.get(req.verifyCaseNumber,params)
    },

    getProDetails(params){
        return http.get(`${req.getProDetails+params.id}?userId=${params.userId}`, params)
    },


    // 案件刷新
    getAsyncRefresh(params){
        return http.post(`${req.getAsyncRefresh+params.id}`, params)
    },

    /**
     * 线索及任务管理
     */
    //线上线索
    onLineClue(params) {
        return http.get(req.onLineClue, params)
    },

    //线上线索审核
    onLineClueExamin(params) {
        return http.postFormData(req.onLineClueExamin + params.id, params)
    },

    //线下线索
    offLineClue(params) {
        return http.get(req.offLineClue, params)
    },

    //线下线索审核
    offLineClueExamin(params) {
        return http.postFormData(req.offLineClueExamin + params.id, params)
    },

    //举报任务申请管理列表
    reportApplication(params) {
        return http.get(req.reportApplication, params)
    },

    //举报任务申请审核
    reportApplicationExamine(params) {
        return http.postFormData(req.reportApplicationExamine,params)
    },

    //举报任务列表
    reportTaskList(params) {
        return http.get(req.reportTaskList,params)
    },

    //举报任务发布任务
    reportAddTask(params) {
        return http.postFormData(req.reportAddTask,params)
    },

    //举报任务结束任务
    reportEndTask(params) {
        return http.postFormData(req.reportEndTask,params)
    },

    //举报任务线上线索管理列表    
    onReportClue(params) {
        return http.get(req.onReportClue, params)
    },
    //举报任务线下线索管理列表    
    offReportClue(params) {
        return http.get(req.offReportClue, params)
    },
    //举报任务线上线索管理审核 
    onReportClueExamine(params) {
        return http.postFormData(req.onReportClueExamine, params)
    },
    //举报任务线下线索管理审核 
    offReportClueExamine(params) {
        return http.postFormData(req.offReportClueExamine, params)
    },

    /**
     * 鉴定管理
     */
    // 鉴定管理列表
    appraisalList(params) {
        return http.get(req.appraisalList, params)
    },

    // 鉴定管理详情
    appraisalDetail(params) {
        return http.get(req.appraisalDetail, params)
    },

    // 鉴定管理审核
    appraisalExamine(params) {
        return http.postFormData(req.appraisalExamine, params)
    },


    /**
     * 调查举报相关接口
     */
    //举报奖励发放
    getReportAwardList(params){
        return http.get(req.getReportAwardList,params)
    },

    getInvestigationReportList(params) {
        return http.get(req.getInvestigationReportList,params)
    },

    getInvestigationTaskList(params) {
        return http.get(req.getInvestigationTaskList,params)
    },

    //调查举报线索-详情
    getInvestigationDetail(params) {
        return http.get(req.getInvestigationDetail,params)
    },

    //审核通过-不通过  80  90
    editInvestigationStatus(params) {
        return http.postFormData(req.editInvestigationStatus,params)
    },

    //编辑调查线索金额
    editInvestigationMoney(params) {
        return http.postFormData(req.editInvestigationMoney,params)
    },

    //分配调查员信息
    editInvestigationAllot(params) {
        return http.get(req.editInvestigationAllot, params)
    },

    //完结
    editfinishStatus(params) {
        return http.postFormData(req.editfinishStatus,params)
    },

    //调查详情日志
    investigationLog(params) {
        return http.get(req.investigationLog,params)
    },

    //获取当前用户信息
    userInfo(params) {
        return http.get(req.userInfo,params)
    },

    //举报任务中止
    editStopCompensable(params) {
        return http.postFormData(req.editStopCompensable,params)
    },

    //获取调查任务详情
    getInvestigationTaskDetail(params) {
        return http.get(req.getInvestigationTaskDetail,params)
    },

    //举报任务完成
    editOverCompensable(params) {
        return http.postFormData(req.editOverCompensable,params)
    },

    //举报列表协商
    editCheckConsult(params) {
        return http.postFormData(req.editCheckConsult,params)
    },

    //举报奖励发放
    getReportAwardListDetail(params) {
        return http.get(req.getReportAwardListDetail,params)
    },

    //举报奖励发放审核
    editGiveOut(params) {
        return http.postFormData(req.editGiveOut,params)
    },
    
    //任务协商金额
    createDetailMoney(params) {
        return http.post(req.createDetailMoney, params)
    },
 
    /**
     * 系统管理
     * */
    //系统管理列表    
    systemList(params) {
        return http.get(req.systemList, params)
    },
    //系统用户启用禁用
    systemPass(params) {
        return http.get(req.systemPass, params)
    },
    //角色列表
    systemRole(params) {
        return http.get(req.systemRole, params)
    },
    
    //修改密码
    systemChangePw(params) {
        return http.postFormData(req.syatemChangePw + params.id, params)
    },
    //新增
    systemCreate(params) {
        return http.postFormData(req.systemCreate, params)
    },
    
    // 用户状态
    updateUserStatus(params) {
        return http.get(req.updateUserStatus, params)
    },

    //白名单列表
    whiteList(params) {
        return http.get(req.whiteList, params)
    },

    //删除白名单
    delWhite(params) {
        return http.get(req.delWhite + params.id, params)
    },

    //新增白名单
    addWhite(params) {
        return http.post(req.addWhite, params)
    },

    // 白名单导入时  追加或覆盖
    appendOrCover(params) {
        return http.post(req.appendOrCover, params)
    },

    //资源列表
    resoucesList(params) {
        return http.get(req.resoucesList, params)
    },

    //删除资源
    deleteResources(params) {
        return http.postFormData(req.deleteResources + params.id, params)
    },
    
    //新增资源
    createResources(params) {
        return http.post(req.createResources, params)
    },

    //编辑资源信息
    editResources(params) {
        return http.post(req.editResources, params)
    },

    // 获取对应type的资源  商标、盗图
    resourceBrand(params) {
        return http.get(req.resourceBrand, params)
    },

    // 根据对应的type和品牌查询是否有数据
    queryResourceForData(params) {
        return http.get(req.queryResourceForData, params)
    },
    
    // 添加自动投诉的资源
    addAutoComplaintReason(params) {
        return http.post(req.addAutoComplaintReason, params)
    },

    //角色管理分页
    roleList(params) {
        return http.get(req.roleList, params)
    },

    //角色管理禁用
    roleDeleteId(params) {
        return http.get(`${req.roleDeleteId}/${params.roleId}`, params)
    },

    //启用
    roleEnable(params) {
        return http.get(`${req.roleEnable}/${params.roleId}`, params)
    },

    //删除角色
    roleDel(params) {
        return http.postFormData(`${req.roleDel}/${params.roleId}`, params)
    },

    // 获取当前用户权限
    roleAuthTree(params) {
        return http.get(`${req.roleAuthTree}${params.roleId}`, params)
    },

    // 修改用户角色
    systemUserRole(params) {
        return http.postFormData(`${req.systemUserRole}${params.id}`, params)
    },

    // 修改当前角色权限
    roleAuth(params) {
        return http.postFormData(`${req.roleAuth}${params.roleId}`, params)
    },

    //新增角色
    roleAdd(params) {
        return http.postFormData(req.roleAdd, params)
    },

    //字典表列表
    dictonaryList(params) {
        return http.get(req.dictonaryList, params)
    },

    //字典表下拉
    dictonaryType(params) {
        return http.get(req.dictonaryType, params)
    },

    //字典删除
    dictonaryDetele(params) {
        return http.post(`${req.dictonaryDetele}/${params}`, params)
    },

    //编辑字典信息
    dictonarymodify(params) {
        return http.post(req.dictonarymodify, params)
    },

    //字典表新增
    dictonaryCreate(params) {
        return http.post(req.dictonaryCreate, params)
    },

    //淘宝投诉账号列表
    complaintList(params) {
        return http.get(req.complaintList, params)
    },

    //删除投诉账号
    complaintDel(params) {
        return http.postFormData(req.complaintDel +  params.id, params)
    },

    //新增投诉账号
    complaintAdd(params) {
        return http.postFormData(req.complaintAdd, params)
    },

    //编辑投足账号
    complaintEdit(params) {
        return http.postFormData(req.complaintEdit + params.id, params)
    },

    //立即下拉线上投诉数据
    complaintPullData(params) {
        return http.postFormData(req.complaintPullData + params.id, params)
    },

    //关联品牌商
    complaintBindBrand(params) {
        return http.postFormData(req.complaintBindBrand + params.id, params)
    },
    //是否开启自动投诉
    getAutomatedComplaint(params) {
        return http.postFormData(req.getAutomatedComplaint + params.id, params)
    },

    //类目列表
    categoryList(params) {
        return http.get(req.categoryList, params)
    },

    //类目删除
    categoryDetele(params) {
        return http.post(`${req.categoryDetele}/${params}`, params)
    },

    //类目编辑
    categoryModify(params) {
        return http.post(req.categoryModify, params)
    },

    categoryCreate(params) {
        return http.post(req.categoryCreate, params)
    },

    // 权限管理分页
    authorityPages(params) {
        return http.get(req.authorityPages, params)
    },

    // 新增权限项
    addAuthority(params) {
        return http.post(req.addAuthority, params)
    },

    // 删除权限项
    deleteAuthority(params) {
        return http.get(req.deleteAuthority, params)
    },

    // 编辑权限
    editAuthority(params) {
        return http.post(req.editAuthority, params)
    },

    // 编辑权限排序
    editAuthoritySort(params) {
        return http.post(req.editAuthoritySort, params)
    },

    // 系统操作日志分页
    systemOplogsPage(params) {
        return http.get(req.systemOplogsPage, params)
    },
    
    //查询所有js版本号
    versionList(params) {
        return http.get(req.versionList, params)
    },

    //修改指定版本号
    modifyVersion(params) {
        return http.postFormData(`${req.modifyVersion}/${params.type}`, params)
    },

    //查询指定版本号
    judgingVersion(params) {
        return http.get(`${req.judgingVersion}/${params.type}`, params)
    },

    // 导出Excel分页
    excelExport(params) {
        return http.get(req.excelExport, params)
    },

    // 创建导出数据信息
    createExportExcel(params) {
        return http.postFormData(req.createExportExcel, params)
    },

    // 下载接口
    downloadExcel(params) {
        return http.downloadExcel(req.downloadExcel, params)
    },

    // 发布日志查询接口
    queryScriptLog(params) {
        return http.get(req.queryScriptLog, params)
    },

    // 发布日志更新接口
    modifyScriptLog(params) {
        return http.postFormData(req.modifyScriptLog, params)
    },

    // 发布日志删除接口
    delScriptLog(params) {
        return http.postFormData(req.delScriptLog, params)
    },

    // 发布日志新增接口
    createScriptLog(params) {
        return http.postFormData(req.createScriptLog, params)
    },

    excelCount(params) {
        return http.get(req.excelCount, params)
    },
    
    //举报任务详情
    reportTaskDetail(params) {
        return http.get(`${req.reportTaskDetail}/${params.id}`, params)
    },

    //运营审核分页查询
    getFilterPage(params) {
        return http.get(req.getFilterPage, params)
    },

    //运营批量审核
    volunteerModifyfilter(params) {
        return http.postFormData(req.volunteerModifyfilter, params)
    },

    //运营审核获取待推送数据count
    getFilterCount(params) {
        return http.get(req.getFilterCount, params)
    },
    //运营筛选导出
    getFilterExport(params) {
        return http.get(req.getFilterExport, params)
    },

    //运营筛选店铺
    getFilterStorePage(params) {
        return http.get(req.getFilterStorePage, params)
    },

    //线索专案--线索管理列表
    getCluePage(params) {
        return http.get(req.getCluePage, params)
    },
    //权利人线索列表
    clueConfirmPage(params) {
        return http.get(req.clueConfirmPage, params)
    },
    //线索专案--获取详情
    getQueryClueInfoById(params) {
        return http.get(req.getQueryClueInfoById, params)
    },
    //线索专案--审核
    clueAudit(params) {
        return http.post(req.clueAudit, params)
    },
    //线索专案--归类
    editClassification(params) {
        return http.post(req.editClassification, params)
    },
    //线索专案--权利人审核
    editHolderAudit(params){
        return http.post(req.editHolderAudit, params)
    },
    //品牌方诉讼案件管理列表
    brandSuitList(params) {
        return http.get(req.brandSuitList, params)
    },
    //品牌方诉讼案件管理审核
    modifyBrandSuitList(params) {
        return http.postFormData(req.modifyBrandSuitList, params)
    },
    //诉讼列表
    getSuitPage(params) {
        return http.get(req.getSuitPage, params)
    },
    // 诉讼案件详情 -- 对方当事人信息
    getDefendantInfo(params) {
        return http.get(req.getDefendantInfo, params)
    },
    // 诉讼案件详情  -- 对方当事人信息修改
    modifyDefendantInfo(params) {
        return http.post(req.modifyDefendantInfo, params)
    },
    // 诉讼案件详情  -- 对方当事人信息删除
    removeDefendantInfo(params) {
        return http.postFormData(req.removeDefendantInfo, params)
    },
    // 诉讼案件详情 -- 进程信息
    getProcessInfo(params) {
        return http.get(req.getProcessInfo, params)
    },
    queryProcessDetailInfo(params) {
        return http.get(req.queryProcessDetailInfo, params)
    },
    // 诉讼案件详情 -- 诉讼案件详情信息
    getSuitDetail(params) {
        return http.get(req.getSuitDetail, params)
    },
    // 诉讼案件详情 -- 进程审核
    auditSuitInfo(params) {
        return http.postFormData(req.auditSuitInfo, params)
    },
    // 诉讼案件详情 -- 案件分配
    modifySuitDistribute(params) {
        return http.postFormData(req.modifySuitDistribute, params)
    },
    //诉讼案件详情--律师下拉
    getAllotLawyer(params) {
        return http.get(req.getAllotLawyer, params)
    },
    //诉讼案件详情--案件日志
    queryLogs(params) {
        return http.get(`${req.queryLogs}/${params.suitId}`, params)
    },
    //线索管理--线索过滤的品牌
    getLawyerBrand(params) {
        return http.get(req.getLawyerBrand, params)
    },
    // 首页 -- 诉讼案件统计
    getSuitCaseCount(params) {
        return http.get(req.countClueAndSuit, params)
    },
    //专案账号类型管理
    //列表
    lawyerRoleList(params) {
        return http.get(req.lawyerRoleList, params)
    },
    //新增
    lawyerRoleAdd(params) {
        return http.postFormData(req.lawyerRoleAdd, params)
    },
    //禁用
    lawyerRoleOff(params) {
        return http.postFormData(req.lawyerRoleOff + params.id, params)
    },
    //启用
    lawyerRoleEnable(params) {
        return http.postFormData(req.lawyerRoleEnable + params.id, params)
    },
    //删除角色
    lawyerRoleDel(params) {
        return http.postFormData(req.lawyerRoleDel + params.id, params)
    },
    //获取角色权限
    lawyerRoleAuthTree(params) {
        return http.get(req.lawyerRoleAuthTree + params.roleId, params)
    },
    //编辑角色权限
    lawyerRoleAuth(params) {
        return http.postFormData(req.lawyerRoleAuth + params.roleId, params)
    },
    //新增专案平台装好类型下拉
    lawyerAddType(params) {
        return http.get(req.lawyerAddType, params)
    },
    //品牌方线下专案列表
    caseConfirmPage(params) {
        return http.get(req.caseConfirmPage, params)
    },
    //线下专案-结案
    closeCase(params) {
        return http.postFormData(req.closeCase, params)
    },
    //线下专案-推送
    pushBrandCase(params) {
        return http.postFormData(req.pushBrandCase, params)
    },
    //线下专案-放弃
    giveUpCase(params) {
        return http.postFormData(req.giveUpCase, params)
    },
    //线下专案-详情
    getOfflineCaseDetail(params) {
        return http.get(req.getOfflineCaseDetail, params)
    },
    //线下专案-审核
    updateBrandOffline(params) {
        return http.postFormData(req.updateBrandOffline, params)
    },
    // 线下专案-查询调查结果
    queryLawyerCaseReport(params) {
        return http.get(req.queryLawyerCaseReport, params)
    },
    // 线下专案-查询执行结果
    queryProcessInfo(params) {
        return http.get(req.queryProcessInfo, params)
    },
    // 线下专案-提交调查结果
    saveLawyerCaseReport(params) {
        return http.post(req.saveLawyerCaseReport, params)
    },
    // 线下专案-提交执行结果
    saveProcessInfo(params) {
        return http.post(req.saveProcessInfo, params)
    },
    //线下专案-列表
    queryOfflineList(params) {
        return http.get(req.queryOfflineList, params)
    },
    //线下专案-日志
    getOfflineLogList(params) {
        return http.get(`${req.getOfflineLogList}${params.caseId}`, params)
    }
}