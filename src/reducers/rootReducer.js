import { combineReducers } from 'redux'
import commonReducer from './common/commonReducer'
import loginReducer from './login/loginReducer'
import monitorListReducer from './monitoring/monitorListReducer'
import monitorResultListReducer from './monitoring/monitorResultListReducer'
import monitorDetailsListRedcer from './monitoring/monitoringDetailsReducer'
import onlineComplaintOverviewReducer from './home/onlineComplaintOverviewReducer'
import complaintOnlineReducer from './complaint/complaintOnlineReducer'
import complaintVideoReducer from './complaint/complaintVideoReducer'
import complaintWechatReducer from './complaint/complaintWechatReducer'
import caseReducer from './case/caseReducer'
import caseDetailReducer from './case/caseDetailReducer'
import caseErrorReducer from './case/caseErrorDetailsReducer'
import monitorAdd from './monitoring/monitoringAddReducer'
import volunteerReportReducer from './report/volunteerReportReducer'
import volunteerReportBaseReducer from './report/volunteerReportBaseReducer'
import volunteerReportDetailReducer from './report/volunteerReportDetailReducer'
import brandListRedicer from './brand/brandListReducer'
import brandEditReducer from './brand/brandEditReducer'
import brandConfirmationReducer from './brand/brandConfirmationReducer'
import brandCleanlinessReducer from './brand/brandCleanlinessReducer'
import cleanStatisticsReducer from './brand/cleanStatisticsReducer'
import volunteerListReducer from './users/volunteerListReducer'
import investigatorListReducer from './users/investigatorListReducer'
import investigatorApplicationReducer from './users/investigatorApplicationListReducer'
import lawyerListReducer from './users/lawyerListReducer'
import resourceListReducer from './system/resourceListReducer'
import systemReducer from './system/systemListReducer'
import whiteReducer from './system/whiteListReducer'
import addwhiteReducer from './system/addWhiteReducer'
import roleListReducer from './system/roleListReducer'
import complaintAccountReducer from './system/complaintAccountReducer'
import rewardReducer from './investigationreport/rewardReducer'
import reportReducer from './investigationreport/reportReducer'
import taskReducer from './investigationreport/taskReducer'
import rewardDetailsReducer from './investigationreport/details/rewardDetailsReducer'
import investigationReportReducer from './investigationreport/reportReducer'
import reportApplicationReducer from './clue/reportApplicationReducer'
import reportTaskReducer from './clue/reportTaskReducer'
import onLineReducer from './clue/onlineReducer'
import offLineReducer from './clue/offlineReducer'
import appraisalReducer from './appraisal/appraisalListReducer'
import appraisalDetailReducer from './appraisal/appraisalDetailReducer'
import reportOnlineReducer from './clue/reportOnlineReducer'
import reportOfflineReducer from './clue/reportOfflineReducer'
import investigationDetailReducer from './investigationreport/details/investigationDetailReducer'
import homeReducer from './home/homeReducer'
import volunteerTaskReducer from './report/volunteerTaskReducer'
import authorityReducer from './system/authorityReducer'
import dictonaryReducer from './system/dictonaryReducer'
import categoryReducer from './system/categoryReducer'
import oplogsReducer from './system/oplogsReducer'
import versionReducer from './system/versionReducer'
import excelExportReducer from './system/excelExportReducer'
import scriptLogListReducer from './system/scriptLogListReducer'
import reportTaskDetail from './clue/reportTaskDetailReducer'
import volunteerscreenReducer from './report/volunteercreeningReducer'
import volunteerReportOperationBaseReducer from './report/volunteerReportOperationBaseReducer'
import cleanStatisticsAuditReducer from './brand/brandCleanlinessAuditReducer'
import threadReducer from './thread/threadReducer'
import ligitaionReducer from './litigation/litigationReducer'
import lawsuitDetailReducer from './litigation/lawsuitDetailReducer'
import lawyerRoleReducer from './system/lawyerRoleReducer'
import offlineCaseReducer from './offlineCase/offlineCaseReducer'
import offlineCaseDetailReducer from './offlineCase/offlineCaseDetailReducer'
import brandOfflineCaseReducer from './offlineCase/brandOfflineCaseReducer'
import brandLitigationReducer from './litigation/brandLitigationReducer'
const rootReducer = combineReducers({
    commonReducer,
    loginReducer,
    monitorListReducer,
    monitorResultListReducer,
    monitorDetailsListRedcer,
    onlineComplaintOverviewReducer,
    complaintOnlineReducer,
    complaintVideoReducer,
    complaintWechatReducer,
    caseReducer,
    caseDetailReducer,
    caseErrorReducer,
    monitorAdd,
    volunteerReportReducer,
    volunteerReportDetailReducer,
    brandListRedicer,
    brandEditReducer,
    brandConfirmationReducer,
    volunteerListReducer,
    investigatorListReducer,
    resourceListReducer,
    systemReducer,
    whiteReducer,
    addwhiteReducer,
    investigatorApplicationReducer,
    lawyerListReducer,
    rewardReducer,
    reportReducer,
    taskReducer,
    rewardDetailsReducer,
    reportApplicationReducer,
    reportTaskReducer,
    onLineReducer,
    offLineReducer,
    appraisalReducer,
    appraisalDetailReducer,
    reportOnlineReducer,
    reportOfflineReducer,
    investigationReportReducer,
    investigationDetailReducer,
    homeReducer,
    roleListReducer,
    complaintAccountReducer,
    volunteerTaskReducer,
    authorityReducer,
    dictonaryReducer,
    categoryReducer,
    oplogsReducer,
    versionReducer,
    excelExportReducer,
    reportTaskDetail,
    volunteerscreenReducer,
    volunteerReportBaseReducer,
    scriptLogListReducer,
    volunteerReportOperationBaseReducer,
    brandCleanlinessReducer,
    cleanStatisticsReducer,
    cleanStatisticsAuditReducer,
    threadReducer,
    ligitaionReducer,
    lawsuitDetailReducer,
    lawyerRoleReducer,
    offlineCaseReducer,
    offlineCaseDetailReducer,
    brandOfflineCaseReducer,
    brandLitigationReducer
})

export default rootReducer;