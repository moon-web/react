import React, { Component } from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
/**
 * 首页
 */
import IndexHome from '../component/home/home/connect'
import IPRHome from '../component/home/IPR_home/connect'
import Kanban from '../component/home/online_complaint_overview/connect'

/**
 * 用户管理
 */
import InvestigatorList from '../component/user/investigator/connect'//调查员列表
import InvestigatorApplyList from '../component/user/investigatorApplication/connect'//调查员列表
import InvestigatorDetail from '../component/user/investigatorDetail/connect'
import InvestigatorCompanyDetail from '../component/user/investigationCompanyDetail/connect'
import VolunteerList from '../component/user/volunteer/connect'
import Lawyer from '../component/user/lawyer/connect' 

/**
 * 品牌管理
 */
import BrandList from '../component/brand/list/conenct'//品牌管理
import BrandEdit from '../component/brand/brand_edit/connect'//品牌编辑
import BrandConfirmation from '../component/brand/confirmation/connect'//品牌商确定
import CleanStatistics from '../component/brand/cleanStatistics/connect'
import CleanAudit from '../component/brand/cleanlinessAudit/connect'
import BrandCliness from '../component/brand/brand_cleanliness/connect'//品牌洁净度
import AddBrandCleanliness from '../component/brand/addBrandCleanliness/connect'

/**
 * 投诉管理
 */
import ComplaintOnline from '../component/complaint/online/connect'
import ComplaintVideo from '../component/complaint/video/connect'
import ComplaintWeChart from '../component/complaint/wechat/connect'
import ComplaintAccount from '../component/complaint/complaint_account/connect'

/**
 * 监控规则
 */
import NewMonitoringRules from '../component/monitoring/new_monitoring_rules/connect'
import NewMonitoringManual from '../component/monitoring/new_manual_rules/connect'
import NewPictureRules from '../component/monitoring/new_picture_rules/connect'
import RulesDetiles from '../component/monitoring/detail/connect'
import MontioringList from '../component/monitoring/list/connect';//数据监测
import MontioringResultList from '../component/monitoring/result/connect'//管控任务
import MontioringResultAudit from '../component/monitoring/audit/connect'

/**
 * 案件管理
 */
import CaseList from '../component/case/list/connect'
import NewCase from '../component/case/new_case/connect'
import CaseDetail from '../component/case/detail/connect'

/**
 * 志愿者举报
 */
import VolunteerReportTask from '../component/volunteerReport/statistic/connect'
import VolunteerReportAudit from '../component/volunteerReport/audit/connect'
import VolunteerReportlist from '../component/volunteerReport/report/connect'
import VolunteerReportBaseList from '../component/volunteerReport/reportBase/connect'
import OperationScreening from '../component/volunteerReport/operationScreening/connect'
import OperationScreeningBaseList from '../component/volunteerReport/operationBase/connect'

/**
 * 系统管理
 */
import SystemUser from '../component/system/system/connect'
import WhiteList from '../component/system/white/connect'
import NewWhite from '../component/system/white/chindren/add_white/connect'
import ResourceList from '../component/system/resource/connect'
import RoleList from '../component/system/role/connect'
import UploadFile from '../component/system/uploadfile/connect'
import Permissions from '../component/system/permissions/connect'
import Authority from '../component/system/authority/connect'
import Dictonary from '../component/system/dictionary/connect'
import CategoryList from '../component/system/category/connect'
import Oplogs from '../component/system/oplogs/connect'
import VersionNumber from '../component/system/versionNumber/connect'
import ExcelExport from '../component/system/excel/connect'
import ScriptLog from '../component/system/scriptLog/connect'
import LawyerRole from '../component/system/lawyer_role/connect'
import LawyerRoleMenu from '../component/system/lawyer_role/children/permissinos/connect'

/**
 * 线索及任务管理
 */
import OnLineClue from '../component/clue/online/connect'
import OffLineClue from '../component/clue/offline/connect'
import ReportApplication from '../component/clue/reportApplication/connect'
import ReportTask from '../component/clue/reportTask/connect'
import AddTask from '../component/clue/new_release_task/connect'
import ReportOnline from '../component/clue/reportOnline/connect'
import ReportOffline from '../component/clue/reportOffline/connect'
import TaskDeatils from '../component/clue/taskDetail/connect'
/**
 * 鉴定管理
 */
import ApprailList from '../component/appraisal/list/connect'
import ApprailDetail from '../component/appraisal/detail/connect'

/**
 * 调查举报管理
 */
import RewardList from '../component/investigationreport/reward/connect'
import RewardDetail from '../component/investigationreport/details/rewardDetail/connect'
import InvestigationReport from '../component/investigationreport/report/connect'
import InvestigationReportDetails from '../component/investigationreport/details/reportDetail/connect'
import InvestigationTask from '../component/investigationreport/task/connect'
import InvestigationTaskDetails from '../component/investigationreport/details/taskDetail/connect'

// 线索专案平台
import Thread from '../component/clueLitigation/thread/list/connect'
import ThreadEdit from '../component/clueLitigation/thread/editThread/connect'
//品牌方诉讼案件管理
import BrandLitigation from '../component/clueLitigation/brandLitigation/list/connect'
import BrandLitigationDetail from '../component/clueLitigation/brandLitigation/detail/connect'

//诉讼案件管理
import Litigation from '../component/clueLitigation/litigation/list/connect'
import SuitCaseDetail from '../component/clueLitigation/litigation/detail/connect'

//线下案件管理
import OfflineCaseList from '../component/clueLitigation/offlineCase/offlineCaseList/connect'
import OfflineCaseDetail from '../component/clueLitigation/offlineCase/detail/connect'
import BrandOfflineCaseList from '../component/clueLitigation/offlineCase/brandRecognitionList/connect'
export class BasicsRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: '',
        }
    }

    componentWillMount() {
        this.setState({
            userType: JSON.parse(localStorage.getItem('type')),
        })
    }

    render() {
        let Home = IndexHome;
        if (this.state.userType !== 1 && this.state.userType !== 2) {
            Home = IPRHome;
        }
        return (
            <div id="Admin" className="App">
                <Switch>
                    {/*首页*/}
                    <Route exact path="/" component={Home} />  {/*默认首页*/}
                    <Route path="/index" component={Home} />  {/*权利人首页*/}
                    <Route path="/kanban" component={Kanban} />  {/*经营看板*/}
                    {/*用户管理*/}
                    <Route path="/users/volunteer"  component={VolunteerList} />{/*志愿者管理*/}
                    <Route path="/users/investigator" exact component={InvestigatorList} />{/*调查员列表*/}
                    <Route path="/users/investigatorApply"  component={InvestigatorApplyList} />{/*调查员申请管理类别*/}
                    <Route path="/users/investigator/detail"  component={InvestigatorDetail} />{/*调查员申请管理类别*/}
                    <Route path="/users/investigatorCompany/detail"  component={InvestigatorCompanyDetail} />{/*调查员申请管理类别*/}
                    <Route path="/users/lawyer"  component={Lawyer} />{/*专案平台用户*/}
                    {/*品牌管理*/}
                    <Route path="/brand/list"  component={BrandList} />{/*品牌管理*/}
                    <Route path="/brand/edit"  component={BrandEdit} />{/*品牌编辑*/}
                    <Route path="/brand/confirmation"  component={BrandConfirmation} />{/*品牌商确认*/}
                    <Route path="/brand/cleanStatistics"  component={CleanStatistics} />{/*品牌商确认*/}
                    <Route path='/brand/clean/audit' component={CleanAudit} />{/**新增品牌洁净度 */}
                    <Route path="/brand/cleanliness" component={BrandCliness} />{/**品牌洁净度列表 */}
                    <Route path='/brand/new/cleanliness' component={AddBrandCleanliness} />{/**新增品牌洁净度 */}
                    {/*案件管理*/}
                    <Route path="/case/list"  component={CaseList} />{/*案件管理*/}
                    <Route path="/case/new"  component={NewCase} />
                    <Route path="/case/detail"  component={CaseDetail} />
                    {/* 志愿者举报管理 */}
                    <Route path="/volunteer/report/List"  component={VolunteerReportlist} /> {/* 举报管理 */}
                    <Route path='/volunteer/reportBase/list' component={VolunteerReportBaseList} />
                    <Route path="/volunteer/report/audit"  component={VolunteerReportAudit} /> {/* 志愿者举报审核 */}
                    <Route path="/volunteer/report/task"  component={VolunteerReportTask} />{/*志愿者举报统计*/}
                    <Route path="/volunteer/report/screen" component={OperationScreening} />{/*运营筛选*/}
                    <Route path="/volunteer/reportScreen/list" component={OperationScreeningBaseList} />
                    {/* 监控规则 */}
                    <Route path="/monitor/rule"  component={MontioringList} />{/*监控规则管理*/}
                    <Route path="/monitor/new/rule"  component={NewMonitoringRules} />{/*新增监控规则*/}
                    <Route path="/monitor/new/manual"  component={NewMonitoringManual} />{/*新增手动规则*/}
                    <Route path="/monitor/new/picture" component={NewPictureRules}/>
                    <Route path="/monitor/result" exact  component={MontioringResultList} />{/*管控任务审核*/}
                    <Route path="/monitor/detail" component={RulesDetiles} />
                    <Route path="/monitor/result/audit" component={MontioringResultAudit} /> {/* 监控任务审核 */}
                    {/* 投诉管理 */}
                    <Route path="/complaint/online"  component={ComplaintOnline} />{/*投诉管理*/}
                    <Route path="/complaint/wechat"  component={ComplaintWeChart} />{/*微信投诉管理*/}
                    <Route path="/complaint/video"  component={ComplaintVideo} />{/*视频投诉管理*/}                    
                    <Route path="/complaint/account" component={ComplaintAccount} />{/*账号投诉管理*/}
                    {/* 调查举报管理 */}
                    <Route path="/report/clue" exact component={InvestigationReport} />{/*举报线索管理*/}
                    <Route path="/report/clue/detail" component={InvestigationReportDetails} />
                    <Route path="/report/task" exact component={InvestigationTask} />{/*举报任务管理*/}
                    <Route path='/report/task/detail' component={InvestigationTaskDetails} />{/*调查任务详情*/}
                    <Route path="/report/reward" exact component={RewardList} />{/*奖励*/}
                    <Route path="/report/reward/detail" component={RewardDetail} />
                    {/* 鉴定管理 */}
                    <Route path="/appraisal/list"  component={ApprailList} />{/*鉴定*/}
                    <Route path="/appraisal/detail"  component={ApprailDetail} />{/*鉴定详情*/}
                    {/* 线索及任务管理 */}
                    <Route path="/clue/line"  component={OnLineClue} />{/*线上线索*/}
                    <Route path="/clue/offline"  component={OffLineClue} />{/*线下线索*/}
                    <Route path="/clue/task"  component={ReportTask} />{/*举报任务管理*/}
                    <Route path="/clue/new/task"  component={AddTask} />{/*发布任务*/}
                    <Route path="/clue/apply/task"  component={ReportApplication} />{/*举报任务申请管理*/}
                    <Route path="/clue/report/line"  component={ReportOnline} />{/*举报任务任务线上线索管理*/}
                    <Route path="/clue/report/offline"  component={ReportOffline} />{/*举报任务任务线下线索管理*/}
                    <Route path="/clue/report/task/detail" component={TaskDeatils} />{/*发布任务详情*/}
                    {/* 系统管理 */}
                    <Route path="/system/users"  component={SystemUser} />{/*系统管理*/}
                    <Route path="/system/white"  component={WhiteList} />{/*白名单*/}
                    <Route path="/system/new/white"  component={NewWhite} />{/*新增白名单*/}
                    <Route path="/system/resource"  component={ResourceList} />{/*资源管理*/}
                    <Route path="/system/uploadfile" component={UploadFile} />{/*上传附件 */}
                    <Route path="/system/auth" component={Permissions} /> {/* 角色权限管理 */}
                    <Route path="/system/role" component={RoleList} />{/*角色管理*/}
                    <Route path="/system/menu" component={Authority} />{/*权限管理列表*/}                    
                    <Route path="/system/dictonary" component={Dictonary} />{/*字典管理*/}
                    <Route path="/system/category" component={CategoryList}/>{/*类目管理*/}
                    <Route path="/system/oplogs" component={Oplogs}/>{/*类目管理*/}
                    <Route path="/system/versionNumber" component={VersionNumber} /> {/*版本号管理*/}
                    <Route path="/system/excel" component={ExcelExport} />
                    <Route path='/system/scriptLog' component={ScriptLog} />
                    <Route path='/system/lawyerRole' component={LawyerRole} />
                    <Route path='/system/new/lawyeMenu' component={LawyerRoleMenu} />
                    {/* 线索专案管理 */}
                    <Route path='/thread/list' component={Thread}/> {/* 线索管理 */}
                    <Route path='/thread/edit' component={ThreadEdit} />{/* 线索管理审核 */}
                    <Route path='/thread/brand/litigation' component={BrandLitigation}/> {/* 品牌方诉讼案件管理 */}
                    <Route path='/thread/brand/detail' component={BrandLitigationDetail}/> {/* 品牌方诉讼案件管理审核 */}
                    <Route path='/thread/litigation/list' component={Litigation} />{/* 诉讼案件管理 */}
                    <Route path='/thread/litigation/detail' component={SuitCaseDetail} />{/* 诉讼案件管理 */}
                    {/* <Route path='/offlineCase/detail' component={OfflineCaseDetail} /> */}
                    {/* 线下案件管理 */}
                    <Route path='/thread/offlinecaselist/list' component={OfflineCaseList} />{/* 线下案件管理 */}
                    <Route path='/thread/offlinecaselist/detail' component={OfflineCaseDetail} />{/* 线下案件管理-详情 */}
                    <Route path='/thread/offlinecaselist/brandlist' component={BrandOfflineCaseList} />{/* 线下案件管理-品牌方确认 */}
                    <Redirect from="*" to="/" />                    
                </Switch>  
            </div>
        )
    }
}

export default BasicsRouter