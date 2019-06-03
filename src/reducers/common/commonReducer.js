
import {
    GET_BRAND_LIST_SUCCESS,
    GET_PERMISSION_LIST_SUCCESS,
    GET_PROD_LIST_SUCCESS,
    GET_FILTERLIST_SUCCESS,
    CHANGE_LANGUAGE_SUCCESS,
    CHANGE_COLLAPSED_SUCCESS,
    GET_CHANNEL_LIST_SUCCESS,
    GET_TRADEMARK_LIST_SUCCESS,
    GET_REPORT_REASON_LIST_SUCCESS,
    GET_OWNER_BRAND_LIST_SUCCESS,
    GET_SYSTEM_DICTONARY_SUCCESS,
    GET_REPORT_REASON_QUERY_LIST_SUCCESS,
    GET_TRADEMARK_QUERY_LIST_SUCCESS,
    GET_EXPORT_EXCEL_TITLE_SUCCESS,
    GET_LAWYER_BRAND_LIST_SUCCESS,
    GET_LAWYER_ROLE_TYPE_SUCCESS
} from '../../contants/commonTypes'
const initState = {
    brandList: [], platfromList: [], permissionList: [], prodList: [], typeList: [],
    infringementList: [], filterList: [], collapsed: sessionStorage.getItem('collapsed'), complaintSourceList: [], complaintStatusList: [],
    caseAuditStatus: [], complaintWechatStatusList: [], complaintVideoStatusList: [], investigationType: [], systemUserType: [],
    channelList: [], trademarkList: [], trademarkPosition: [], reportReasonList: [], confirmationStatus: [],
    reportConfirmationStatus: [], reportType: [], brandMerchant: [], b2bUserStatus: [], b2bUserType: [],
    autoComplaintGetCookieStatus:[], appraisalLawStatus:[], onlineClueStatus:[], offlineClueStatus:[], reportTaskStatus:[],
    reportTaskType:[], reportTaskApplyStatus:[], reportTaskApplyType:[], reportTaskOnlineClueStatus:[], reportTaskOfflineClueStatus:[],
    reportRewardDistributionStatus:[], monitorRulesTaskStatus:[], b2bUserApplyStatus: [], optlogTypeList: [], optlogResultTypeList: [], autoComplaintStatus: [],
    versionType:[], excelExportExcelTypeList: [], excelExportImportTypeList: [], excelExportTypeList: [], excelExportStatusList: [],
    reportOperationScreen:[], reportResourceType: [], reportReasonQueryList: [], tardemarkQueryList: [], exportExcelTitle: [], 
    scriptLogTypeList: [], brandCleanlinessStatus: [], monitorRulesQueryParamsSort: [], volunteerReportStatisticStatus: [], threadTortTypeList:[],
    threadMainTag:[], threadStatus:[], ligiationStatus:[], volunteerThreadStatus:[], litigationDocumentType:[], litigationCloseCaseWay:[],
    litigationAttributes:[], lawyerBrand:[], cluesClassification:[], offlineCaseClueType: [], cluesValue: [],  brandOffLineCaseStatusList : [], 
    offlineCaseStatusList: [], offlineCaseType: []
};
export default function (state = initState, action) {
    switch (action.type) {
        case GET_BRAND_LIST_SUCCESS:
            return Object.assign({}, state, {
                brandList: action.brandList
            })
        case GET_PROD_LIST_SUCCESS:
            return Object.assign({}, state, {
                prodList: action.prodList
            })
        case GET_FILTERLIST_SUCCESS:
            return Object.assign({}, state, {
                filterList: action.filterList
            })
        case CHANGE_LANGUAGE_SUCCESS:
            return Object.assign({}, state, {
                language: action.language
            })
        case CHANGE_COLLAPSED_SUCCESS:
            return Object.assign({}, state, {
                collapsed: action.collapsed
            })
        case GET_PERMISSION_LIST_SUCCESS:
            return Object.assign({}, state, {
                permissionList: action.permissionList
            })
        case GET_CHANNEL_LIST_SUCCESS:
            return Object.assign({}, state, {
                channelList: action.channelList
            })
        case GET_TRADEMARK_LIST_SUCCESS:
            return Object.assign({}, state, {
                trademarkList: action.trademarkList
            })
        case GET_REPORT_REASON_LIST_SUCCESS:
            return Object.assign({}, state, {
                reportReasonList: action.reportReasonList
            })
        case GET_OWNER_BRAND_LIST_SUCCESS:
            return Object.assign({}, state, {
                brandMerchant: action.brandMerchant
            })
        case GET_REPORT_REASON_QUERY_LIST_SUCCESS:
            return Object.assign({}, state,{
                reportReasonQueryList: action.reportReasonQueryList
            })
        case GET_TRADEMARK_QUERY_LIST_SUCCESS:
            return Object.assign({}, state,{
                tardemarkQueryList: action.tardemarkQueryList
            })
        case GET_EXPORT_EXCEL_TITLE_SUCCESS: 
            return Object.assign({}, state, {
                exportExcelTitle: action.exportExcelTitle
            })
        case GET_LAWYER_BRAND_LIST_SUCCESS:
            return Object.assign({}, state, {
                lawyerBrand: action.lawyerBrand
            })
        case GET_LAWYER_ROLE_TYPE_SUCCESS:
            return Object.assign({}, state, {
                lawyerRoleType: action.lawyerRoleType
            })
        case GET_SYSTEM_DICTONARY_SUCCESS:
            return Object.assign({}, state, {
                typeListCase: action.typeListCase,
                typeListComplaint: action.typeListComplaint,
                typeListWran: action.typeListWran,
                typecaseList: action.typecaseList,
                listTypeTortSource: action.listTypeTortSource,
                infringementList: action.infringementList,
                caseAuditStatus: action.caseAuditStatus,
                casePlatform: action.casePlatform,
                platfromList: action.platfromList,
                systemUserType: action.systemUserType,
                systemUserStatusType: action.systemUserStatusType,
                systemRoleStatusType: action.systemRoleStatusType,
                resourceTypeList: action.resourceTypeList,
                reportType: action.reportType,
                trademarkPosition: action.trademarkPosition,
                whiteListType: action.whiteListType,
                b2bUserType: action.b2bUserType,
                b2bUserStatus: action.b2bUserStatus,
                complaintStatusList: action.complaintStatusList,
                complaintVideoStatusList: action.complaintVideoStatusList,
                complaintWechatStatusList: action.complaintWechatStatusList,
                vTypeList: action.vTypeList,
                complaintSourceList: action.complaintSourceList,
                typeList: action.typeList,
                investigationType: action.investigationType,
                reportKindListType: action.reportKindListType,
                complaintPlatfromList: action.complaintPlatfromList,
                confirmationStatus: action.confirmationStatus,
                reportConfirmationStatus: action.reportConfirmationStatus,
                monitorResultAuditStatus: action.monitorResultAuditStatus,
                autoComplaintGetCookieStatus: action.autoComplaintGetCookieStatus,
                appraisalLawStatus: action.appraisalLawStatus,
                onlineClueStatus: action.onlineClueStatus,
                offlineClueStatus: action.offlineClueStatus,
                reportTaskType: action.reportTaskType,
                reportTaskStatus: action.reportTaskStatus,
                reportTaskApplyStatus: action.reportTaskApplyStatus,
                reportTaskOnlineClueStatus: action.reportTaskOnlineClueStatus,
                reportTaskApplyType: action.reportTaskApplyType,
                reportTaskOfflineClueStatus: action.reportTaskOfflineClueStatus,
                reportRewardDistributionStatus: action.reportRewardDistributionStatus,
                monitorRulesTaskStatus: action.monitorRulesTaskStatus,
                b2bUserApplyStatus: action.b2bUserApplyStatus,
                optlogTypeList: action.optlogTypeList,
                optlogResultTypeList: action.optlogResultTypeList,
                autoComplaintStatus: action.autoComplaintStatus,
                versionType: action.versionType,
                excelExportExcelTypeList: action.excelExportExcelTypeList, 
                excelExportImportTypeList: action.excelExportImportTypeList,
                excelExportTypeList: action.excelExportTypeList, 
                excelExportStatusList: action.excelExportStatusList,
                reportOperationScreen:action.reportOperationScreen,
                reportResourceType: action.reportResourceType,
                scriptLogTypeList: action.scriptLogTypeList,
                brandCleanlinessStatus: action.brandCleanlinessStatus,
                monitorRulesQueryParamsSort: action.monitorRulesQueryParamsSort,
                volunteerReportStatisticStatus: action.volunteerReportStatisticStatus,
                threadTortTypeList: action.threadTortTypeList,
                threadMainTag: action.threadMainTag,
                threadMainBodyType: action.threadMainBodyType,
                threadStatus: action.threadStatus,
                ligiationStatus: action.ligiationStatus,
                volunteerThreadStatus : action.volunteerThreadStatus,
                litigationCloseCaseWay: action.litigationCloseCaseWay,
                litigationDocumentType: action.litigationDocumentType,
                litigationAttributes: action.litigationAttributes,
                onlineComplaintPlatformList: action.onlineComplaintPlatformList,
                cluesClassification: action.cluesClassification,
                offlineCaseClueType: action.offlineCaseClueType,
                cluesValue: action.cluesValue,
                brandOffLineCaseStatusList: action.brandOffLineCaseStatusList,
                offlineCaseStatusList: action.offlineCaseStatusList,
                offlineCaseType: action.offlineCaseType
            })
        default:
            return state
    }
}