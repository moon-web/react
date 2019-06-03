import { connect } from 'react-redux'
import Authorized from './index'
import { actionCreator } from '../../utils/util'
import {
    GET_PERMISSION_LIST_SUCCESS,
    GET_BRAND_LIST_SUCCESS,
    GET_PROD_LIST_SUCCESS,
    GET_FILTERLIST_SUCCESS,
    CHANGE_COLLAPSED_SUCCESS,
    CHANGE_LANGUAGE_SUCCESS,
    GET_OWNER_BRAND_LIST_SUCCESS,
    GET_SYSTEM_DICTONARY_SUCCESS,
    GET_LAWYER_BRAND_LIST_SUCCESS,
    GET_LAWYER_ROLE_TYPE_SUCCESS
} from '../../contants/commonTypes'
import { GET_USERINFO_SUCCESS } from '../../contants/login/loginTypes'
import Api from '../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    let { permissionList, language } = state.commonReducer;
    return {
        permissionList: permissionList,
        userInfo: state.loginReducer.userInfo,
        language
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getPermissionList: () => {
            Api.permissionList().then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_PERMISSION_LIST_SUCCESS, { permissionList: res.dataObject || [] }))
                }
            })
        },
        //获取品牌商
        getOwnedBrandListData:() =>{
            Api.getOwnedBrandList().then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_OWNER_BRAND_LIST_SUCCESS, { brandMerchant: res.dataObject }))
                }
            })
        },
        //线索品牌
        getLawyerBrand:()=>{
            Api.getLawyerBrand().then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_LAWYER_BRAND_LIST_SUCCESS, { lawyerBrand: res.dataObject }))
                }
            })
        },
        
        //新增获取账号类型
        getLawyerType:(data) => {
            Api.lawyerAddType(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_LAWYER_ROLE_TYPE_SUCCESS, {lawyerRoleType: res.dataObject}))
                }
            })
        },
        // 获取字典表数据  11 是平台  42 是类型 39是微信投诉中的平台  1,案件状态，2投诉状态，3警告信状态，5案件来源，6侵权类型，21白名单类型，49举报类别（箱包）,13用户类型, 50线上投诉平台, 110线上投诉平台下拉
        getSysDictList: (type) => {
            Api.sysDictlist({ dictType: type }).then(res => {
                if (res.success) {
                    let data = res.dataObject;
                    let typeListCase = [], typeListComplaint = [], typeListWran = [], typecaseList = [], listTypeTortSource = [], 
                    infringementList = [], caseAuditStatus = [], casePlatform = [], platfromList = [], systemUserType = [], 
                    systemUserStatusType = [], systemRoleStatusType = [], resourceTypeList = [], reportType = [], trademarkPosition = [], 
                    whiteListType = [], b2bUserType = [], b2bUserStatus = [], complaintStatusList = [], complaintVideoStatusList = [], 
                    complaintWechatStatusList = [], vTypeList = [], complaintSourceList = [], typeList = [], investigationType = [], 
                    reportKindListType = [], complaintPlatfromList = [], confirmationStatus = [], reportConfirmationStatus = [], monitorResultAuditStatus = [],
                    autoComplaintGetCookieStatus = [], appraisalLawStatus = [], onlineClueStatus = [], offlineClueStatus = [], reportTaskStatus = [],
                    reportTaskType = [], reportTaskApplyStatus = [], reportTaskApplyType = [], reportTaskOnlineClueStatus = [], reportTaskOfflineClueStatus = [],
                    reportRewardDistributionStatus = [], monitorRulesTaskStatus = [], b2bUserApplyStatus = [], optlogTypeList = [], optlogResultTypeList = [], autoComplaintStatus = [],
                    versionType = [], excelExportExcelTypeList = [], excelExportImportTypeList = [], excelExportTypeList = [], excelExportStatusList = [],
                    reportOperationScreen = [], reportResourceType = [], scriptLogTypeList = [], brandCleanlinessStatus = [], monitorRulesQueryParamsSort = [],
                    volunteerReportStatisticStatus = [], threadTortTypeList=[], threadMainTag=[], threadMainBodyType=[], threadStatus=[], ligiationStatus =[],
                    volunteerThreadStatus=[], litigationCloseCaseWay = [], litigationDocumentType = [], litigationAttributes=[],onlineComplaintPlatformList = [],
                    cluesClassification = [], offlineCaseClueType = [], cluesValue = [], offlineCaseStatusList = [], brandOffLineCaseStatusList = [], offlineCaseType = [];
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        if (element.type === 1) {
                            // 案件-案件进度
                            typeListCase.push(element)
                        } else if (element.type === 2) {
                            // 案件-诉讼状态
                            typeListComplaint.push(element)
                        } else if (element.type === 3) {
                            // 案件-警告信状态
                            typeListWran.push(element)
                        } else if (element.type === 4) {
                            // 案件-案件类型
                            typecaseList.push(element)
                        } else if (element.type === 5) {
                            // 案件-投诉来源
                            listTypeTortSource.push(element)
                        } else if (element.type === 6) {
                            // 案件-侵权类型
                            infringementList.push(element)
                        } else if (element.type === 7) {
                            // 案件-审核状态
                            caseAuditStatus.push(element)
                        } else if (element.type === 10) {
                            // 公用-电商平台
                            casePlatform.push(element)
                        } else if (element.type === 11) {
                            // 爬虫-电商平台
                            platfromList.push(element)
                        } else if (element.type === 13) {
                            // 用户类型
                            systemUserType.push(element)
                        } else if (element.type === 14) {
                            // 后台用户状态
                            systemUserStatusType.push(element)
                        } else if (element.type === 15) {
                            // 后台角色状态
                            systemRoleStatusType.push(element)
                        } else if (element.type === 16) {
                            // 资源管理-类型
                            resourceTypeList.push(element)
                        } else if (element.type === 17) {
                            // 用户管理  调查员 调查公司申请审核状态
                            b2bUserApplyStatus.push(element)
                        } else if (element.type === 18) {
                            // 志愿者-举报类型
                            reportType.push(element)
                        } else if (element.type === 20) {
                            // 志愿者举报 商标所在位置
                            trademarkPosition.push(element)
                        } else if (element.type === 21) {
                            // 白名单店铺类型
                            whiteListType.push(element)
                        } else if (element.type === 29) {
                            // b2b用户类型
                            b2bUserType.push(element)
                        } else if (element.type === 30) {
                            // b2b用户状态
                            b2bUserStatus.push(element)
                        } else if (element.type === 36) {
                            // 投诉-投诉状态
                            complaintStatusList.push(element)
                        } else if (element.type === 37) {
                            // 投诉-视频投诉状态
                            complaintVideoStatusList.push(element)
                        } else if (element.type === 38) {
                            // 投诉-微信投诉状态
                            complaintWechatStatusList.push(element)
                        } else if (element.type === 39) {
                            // 投诉-视频平台
                            vTypeList.push(element)
                        } else if (element.type === 41) {
                            // 投诉-投诉来源
                            complaintSourceList.push(element)
                        } else if (element.type === 42) {
                            // 监控-图片监控类目
                            typeList.push(element)
                        } else if (element.type === 47) {
                            //调查举报线索类型
                            investigationType.push(element)
                        } else if (element.type === 49) {
                            // 举报类别
                            reportKindListType.push(element)
                        } else if (element.type === 50) {
                            //线上投诉平台
                            complaintPlatfromList.push(element)
                        }else if (element.type === 55) {
                            // 品牌方确认状态
                            confirmationStatus.push(element)
                        }else if (element.type === 54) {
                            // 志愿者举报  审核状态
                            reportConfirmationStatus.push(element)
                        } else if (element.type === 56) {
                            // 志愿者举报  举报来源
                            reportResourceType.push(element)
                        } else if (element.type === 58) {
                            // 监控规则管理  监控结果 审核状态
                            monitorResultAuditStatus.push(element)
                        } else if (element.type === 59) {
                            // 投诉管理-> 自动投诉 -> 获取cookie状态
                            autoComplaintGetCookieStatus.push(element)
                        } else if (element.type === 60) {
                            // 鉴定管理-> 执法状态
                            appraisalLawStatus.push(element)
                        } else if (element.type === 61) {
                            // 线索及任务管理-> 线上线索的状态
                            onlineClueStatus.push(element)
                        } else if (element.type === 62) {
                            // 线索及任务管理-> 线下线索的状态
                            offlineClueStatus.push(element)
                        } else if (element.type === 63) {
                            // 线索及任务管理-> 举报任务管理 任务类型
                            reportTaskType.push(element)
                        } else if (element.type === 64) {
                            // 线索及任务管理-> 举报任务管理 任务状态
                            reportTaskStatus.push(element)
                        } else if (element.type === 65) {
                            // 线索及任务管理-> 举报任务申请管理  任务状态
                            reportTaskApplyStatus.push(element)
                        } else if (element.type === 66) {
                            // 线索及任务管理-> 举报任务线上线索  任务状态
                            reportTaskOnlineClueStatus.push(element)
                        } else if (element.type === 67) {
                            // 线索及任务管理-> 举报任务申请管理  任务类型
                            reportTaskApplyType.push(element)
                        } else if (element.type === 68) {
                            // 线索及任务管理-> 举报任务线下线索  任务状态
                            reportTaskOfflineClueStatus.push(element)
                        } else if (element.type === 69) {
                            // 调查举报管理-> 举报奖励发放 发放状态
                            reportRewardDistributionStatus.push(element)
                        } else if (element.type === 70) {
                            // 监控规则-> 监控规则  规则任务状态
                            monitorRulesTaskStatus.push(element)
                        } else if (element.type === 73) {
                            optlogTypeList.push(element)
                        } else if (element.type === 74) {
                            optlogResultTypeList.push(element)
                        } else if(element.type === 78) {
                            autoComplaintStatus.push(element)
                        } else if(element.type === 77) {
                            versionType.push(element)
                        } else if (element.type === 79) {
                            // 导出excel类型
                            excelExportExcelTypeList.push(element)
                        } else if (element.type === 80) {
                            // excel 导出、导出
                            excelExportTypeList.push(element)
                            excelExportTypeList.reverse()
                        } else if (element.type === 81) {
                            // 导入，导出excel状态
                            excelExportStatusList.push(element)
                        } else if (element.type === 82) {
                            // 导入excel类型
                            excelExportImportTypeList.push(element)
                        }else if(element.type === 85){
                            //运营筛选状态
                            reportOperationScreen.push(element)
                        }else if (element.type === 86) {
                            scriptLogTypeList.push(element)
                        }else if(element.type === 92){
                            //洁净度结算状态
                            brandCleanlinessStatus.push(element)
                        }else if(element.type === 90){
                            //监控规则查询条件 -- 排序选项
                            monitorRulesQueryParamsSort.push(element)
                        }else if (element.type === 93) {
                            //志愿者举报统计状态
                            volunteerReportStatisticStatus.push(element)
                        }else if(element.type === 98){
                            //线索专案-侵权方式
                            threadTortTypeList.push(element)
                        }else if(element.type === 99){
                            //线索专案-主体标签
                            threadMainTag.push(element)
                        }else if(element.type === 100){
                            //当事人类型
                            threadMainBodyType.push(element)
                        }else if(element.type === 97){
                            threadStatus.push(element)
                        }else if(element.type === 102){
                            //诉讼--状态
                            ligiationStatus.push(element)
                        }else if(element.type === 101){
                            //线索--品牌方确认状态
                            volunteerThreadStatus.push(element)
                        }else if(element.type === 106){
                            //诉讼--结案方式
                            litigationCloseCaseWay.push(element)
                        }else if(element.type === 107){
                            //诉讼--证件类型
                            litigationDocumentType.push(element)
                        }else if(element.type === 108){
                            //诉讼--当事人属性
                            litigationAttributes.push(element)
                        }else if(element.type === 110) {
                            //线上投诉平台
                            onlineComplaintPlatformList.push(element)
                        }else if(element.type === 112){
                            //线索管理-再次归类
                            cluesClassification.push(element)
                        }else if(element.type === 113){
                            //线下案件管理-线索来源
                            offlineCaseClueType.push(element)
                        }else if(element.type === 114){
                            //线索管理-线索价值
                            cluesValue.push(element)
                        }else if(element.type === 115){
                            //线下案件状态
                            offlineCaseStatusList.push(element)
                        }else if(element.type === 116){
                            //品牌方线下案件审核状态
                            brandOffLineCaseStatusList.push(element)
                        }else if(element.type === 119){
                            //线下案件类型
                            offlineCaseType.push(element)
                        }
                    }
                    dispatch(actionCreator(GET_SYSTEM_DICTONARY_SUCCESS, {
                        typeListCase, typeListComplaint, typeListWran, typecaseList, listTypeTortSource, 
                        infringementList, caseAuditStatus, casePlatform, platfromList, systemUserType, 
                        systemUserStatusType, systemRoleStatusType, resourceTypeList, reportType, trademarkPosition, 
                        whiteListType, b2bUserType, b2bUserStatus, complaintStatusList, complaintVideoStatusList, 
                        complaintWechatStatusList, vTypeList, complaintSourceList, typeList, investigationType, 
                        reportKindListType, confirmationStatus, complaintPlatfromList, reportConfirmationStatus, monitorResultAuditStatus,
                        autoComplaintGetCookieStatus, appraisalLawStatus, onlineClueStatus, offlineClueStatus, reportTaskType, 
                        reportTaskStatus, reportTaskApplyStatus, reportTaskOnlineClueStatus, reportTaskApplyType, reportTaskOfflineClueStatus,
                        reportRewardDistributionStatus, monitorRulesTaskStatus, b2bUserApplyStatus, optlogTypeList, optlogResultTypeList, 
                        autoComplaintStatus,versionType, excelExportExcelTypeList, excelExportImportTypeList, excelExportTypeList, 
                        excelExportStatusList, reportOperationScreen, reportResourceType, scriptLogTypeList, brandCleanlinessStatus,
                        monitorRulesQueryParamsSort, volunteerReportStatisticStatus, threadTortTypeList, threadMainTag, threadMainBodyType, threadStatus,
                        ligiationStatus, volunteerThreadStatus, litigationCloseCaseWay, litigationDocumentType, litigationAttributes, onlineComplaintPlatformList,
                        cluesClassification, offlineCaseClueType, cluesValue, brandOffLineCaseStatusList, offlineCaseStatusList, offlineCaseType
                    }))
                }
            })
        },
        getBrandList: () => {
            Api.brandList().then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_BRAND_LIST_SUCCESS, { brandList: res.dataObject }))
                }
            })
        },
        getProdList: (id) => {
            Api.prodList({ userId: id }).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_PROD_LIST_SUCCESS, { prodList: res.dataObject }))
                }
            })
        },
        getFilterList: (id) => {
            Api.fliterListDict({ userId: id }).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_FILTERLIST_SUCCESS, { filterList: res.dataObject }))
                }
            })
        },
        getUserInfo: (data) => {
            dispatch(actionCreator(GET_USERINFO_SUCCESS, { userInfo: data }))
        },
        changeCollapsed: (flag) => {
            dispatch(actionCreator(CHANGE_COLLAPSED_SUCCESS, { collapsed: flag }))
        },
        changeLanguage: (language) => {
            dispatch(actionCreator(CHANGE_LANGUAGE_SUCCESS, { language: language }))
        },
        //查询指定版本号
        judgingVersionNumber:(data) =>{
            Api.judgingVersion(data).then((res)=>{
                if(res.success){
                    var scriptWrapper = document.getElementsByTagName('script');
                    if(res.dataObject && res.dataObject.length){
                        for(let i=0;i<res.dataObject.length;i++){
                            if(scriptWrapper && scriptWrapper.length){
                                for(let j=0;j<scriptWrapper.length;j++){
                                    if(scriptWrapper[j].src.indexOf('app')>0){
                                        let src = scriptWrapper[j].src.slice(window.location.origin.length,scriptWrapper[j].src.length)
                                        if(src !== res.dataObject[i].versionStr){
                                            window.location.reload(true)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authorized)
