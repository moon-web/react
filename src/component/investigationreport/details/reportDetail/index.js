import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Card, Tabs} from 'antd';
import Contnet from '../../../common/layout/content/index';
import EssentialInformation from '../common/essentialInformation'
import ClueInformation from '../common/clueinformation'
import TaskSchedule from '../common/taskschedule'
import TaskLog from '../common/tasklog'
import { queryUrlParams } from '../../../../utils/util'
import '../../index.css'
const TabPane = Tabs.TabPane;
class InvestigationReportDetails extends Component {
    constructor() {
        super()
        this.state = {
            activeKey:"1",
            compensableId:null,
            id:null,
            dic: {
                0: '待审核',
                80: '审核通过待调查',
                90: '审核不通过',
                12: '任务中',
                13: '任务中',
                14: '任务中',
                15: '审核通过待调查',
                16: '调查完成待执法',
                21: '任务中',
                22: '任务中',
                23: '任务中',
                24: '任务中',
                25: '调查完成待执法',
                26: '完结',
                31: '任务中',
                32: '任务中',
                33: '任务中',
                34: '任务中',
                35: '审核通过待调查',
                36: '完结',
                17: '完结',
                97: '完结',
            },
            dicEn: {
                0: 'Pending',
                80: 'Audited through investigation',
                90: 'No pass',
                12: 'In the task',
                13: 'In the task',
                14: 'In the task',
                15: 'Audited through investigation',
                16: 'Investigation completed until law enforcement',
                21: 'In the task',
                22: 'In the task',
                23: 'In the task',
                24: 'In the task',
                25: 'Investigation completed until law enforcement',
                26: 'Completion of law enforcement',
                31: 'In the task',
                32: 'In the task',
                33: 'In the task',
                34: 'In the task',
                35: 'Audited through investigation',
                36: 'Investigation completed until law enforcement',
                17: 'Finish',
                97: 'Finish',
            },
            typeDic:{
                1: '刑事案件',
                2: '行政案件',
            },
            typeDicEn:{
                1: 'PSB Case',
                2: 'AIC Case',
            },
            journalData:[],
            type:null
        }
    }

    componentDidMount() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        let { history } = this.props
        if (history.location.search) {
            let id = queryUrlParams('id');
            let type = queryUrlParams('type')
            let { userInfo } = this.props
            this.setState({
                id:id,
                type:type
            },()=>{
                let data={
                    userId:userInfo.userId,
                    id:this.state.id
                }
               this.getRepoetDetail(data)
            })          
        }
    }

    //当前调查详情信息
    getRepoetDetail(data){
        if(this.props.getInvestigationDetail){
            this.props.getInvestigationDetail(data,()=>{
                //获取当前人员个人信息
                let { investigationDetail } = this.props
                this.setState({
                    compensableId:investigationDetail?investigationDetail.b2bCompensableDetailDO.compensableId:''
                })

                let journalData=[]
                //获取执法分配后的成员
                if(investigationDetail){
                    let info = {
                        b2bUserId:investigationDetail?investigationDetail.allotUserId:null,
                    }
                    if(this.props.getUserGroupInfo){
                        this.props.getUserGroupInfo(info,()=>{
                            let { groupUserData } =this.props
                            if(groupUserData.nickName!=='' || groupUserData.showNick !==""){
                                journalData.push({id:Date.now()-1,tag:groupUserData.nickName?groupUserData.nickName:groupUserData.showNick})
                            }
                        })
                    }
                }
                
                let data={
                    b2bUserId:investigationDetail?investigationDetail.userId:null,
                }
                if(this.props.getUserGroupInfo){
                    this.props.getUserGroupInfo(data,()=>{
                        let { groupUserData } =this.props
                        if(groupUserData.nickName!=='' || groupUserData.showNick !==""){
                            journalData.push({id:1,tag:groupUserData.nickName?groupUserData.nickName:groupUserData.showNick})
                        }
                        //组团人员  allot+team
                        if(investigationDetail){
                            let allotData=investigationDetail?investigationDetail.b2bCompensableDetailDO.allot : [];
                            let teamData=investigationDetail?investigationDetail.b2bCompensableDetailDO.team : [] 
                            if(allotData !== '' && allotData !== undefined && allotData.length>0){
                                JSON.parse(allotData).map((v,i)=>{
                                    journalData.push({id:Date.now()+i,tag:v.nickName?v.nickName:v.showNick})
                                })
                            }
                            if(teamData !=="" && teamData !==undefined && teamData.length > 0){
                                JSON.parse(teamData).map((v,i)=>{
                                    journalData.push({id:Date.now()+i,tag:v.nickName?v.nickName:v.showNick})
                                })
                            }
                        }
                        
                        //数组过滤  id相同 tag相同
                        let newJournalData=[]
                        for(var i=0;i<journalData.length;i++){
                        　　var flag = true;
                        　　for(var j=0;j<newJournalData.length;j++){
                        　　　　if(journalData[i].id === newJournalData[j].id || journalData[i].tag === newJournalData[j].tag){
                        　　　　　　flag = false;
                        　　　　};
                        　　}; 
                        　　if(flag){
                                newJournalData.push(journalData[i]);
                        　　};
                        }
                        this.setState({
                            journalData:newJournalData
                        })
                    })
                }
            })
        }
    }
        
    //操作当前tabs显示
    getTabsValue(key) {
        this.setState({
            activeKey:key
        })
    }
    
    render() {
        let { intl, investigationDetail, getCueBonus, eidtCheckCompensable, getDistributionList, minTotal ,minPageNo,
            getDistributionData, userInfo, geteditInvestigationAllot, getFinishOperate, getInvestigationDetail,updateInvestigationDetail,
            getTaskLog, investigationDetailTaskLog, total, getStopCompensable,investigationReportList, permissionList} = this.props
        let { activeKey, compensableId , typeDic, dic,journalData,type,id,dicEn,typeDicEn}= this.state
        let breadcrumbData = [
            { link: '/', titleId: "router.home", title: '首页' },
            { link: '/report/clue', query: { goback: true }, titleId:"router.tip.off.clue.management", title: '举报线索管理' },
            { link: '', query: { goback: true }, titleId: "router.clue.managment.details", title: '线索详情' },
        ];
        return (
            <Contnet breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <EssentialInformation 
                        compensableId={compensableId} 
                        getCueBonus={getCueBonus} 
                        eidtCheckCompensable={eidtCheckCompensable}
                        getRepoetDetail={(data)=>this.getRepoetDetail(data)}
                        getDistributionList={getDistributionList}
                        minTotal={minTotal}
                        getDistributionData={getDistributionData}
                        investigationDetail={investigationDetail}
                        userInfo={userInfo}
                        geteditInvestigationAllot={geteditInvestigationAllot}
                        getFinishOperate={getFinishOperate}
                        getInvestigationDetail={getInvestigationDetail}
                        dic={ intl.locale === 'zh' ? dic : dicEn }
                        typeDic={intl.locale === 'zh' ? typeDic : typeDicEn}
                        type={type}
                        journalData={journalData}
                        getStopCompensable={getStopCompensable}
                        id={id}
                        minPageNo={minPageNo}
                        investigationReportList={investigationReportList}
                        updateInvestigationDetail={updateInvestigationDetail}
                        permissionList={permissionList}
                    />
                    <div className="case-detail">
                        <Card className="case-tabs">
                            <Tabs defaultActiveKey="1" activeKey={activeKey} onChange={(key) => this.getTabsValue(key) }>
                                <TabPane tab={intl.formatMessage({ id: "investigation.detail.clue.information", defaultMessage: `线索信息`})} key="1">
                                    <ClueInformation
                                        investigationDetail={investigationDetail}
                                        dic={intl.locale==='zh'?dic:dicEn}
                                        typeDic={intl.locale==='zh'?typeDic:typeDicEn}
                                    />
                                </TabPane>
                                <TabPane tab={intl.formatMessage({ id: "investigation.detail.task.schedule", defaultMessage: `任务进度`})} key="2">
                                    <TaskSchedule
                                        investigationDetail={investigationDetail}
                                    />
                                </TabPane>
                                <TabPane tab={intl.formatMessage({ id: "investigation.detail.task.log", defaultMessage: `任务日志`})} key="3">
                                    <TaskLog
                                        getTaskLog={getTaskLog}
                                        compensableId={compensableId}
                                        userInfo={userInfo}
                                        investigationDetailTaskLog={investigationDetailTaskLog}
                                        total={total}
                                        journalData={journalData}
                                        id={id}
                                        type={type}
                                    />
                                </TabPane>
                            </Tabs>
                        </Card>
                    </div>
                </div>
            </Contnet>
        )
    }
}
export default injectIntl(InvestigationReportDetails)