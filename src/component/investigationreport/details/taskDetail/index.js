import React, { Component } from 'react';
import {injectIntl } from 'react-intl';
import { Card, Tabs,} from 'antd';
import Contnet from '../../../common/layout/content/index';
import EssentialInformation from '../common/essentialInformation'
import ClueInformation from '../common/clueinformation'
import TaskSchedule from '../common/taskschedule'
import TaskLog from '../common/tasklog'
import { queryUrlParams } from '../../../../utils/util'
import '../../index.css'
const TabPane = Tabs.TabPane;
class InvestigationTaskDetails extends Component {
    constructor() {
        super()
        this.state = {
            activeKey:"1",
            compensableId:null,
            id:null,
            dic: {
                80: '协商未通过',
                12: '调查协商中',
                13: '调查协商通过',
                14: '调查任务中',
                15: '调查中止',
                16: '调查任务完成',
                21: '执法任务待接受',
                22: '执法协商中',
                23: '执法协商通过',
                24: '执法任务中',
                25: '执法中止',
                26: '执法完结',
                31: '任务待接受',
                32: '调查加执法协商中',
                33: '调查加执法协商通过',
                34: '调查加执法任务中',
                35: '调查加执法中止',
                36: '调查加执法完结',
                17: '调查完结',
                97: '完结',
                91: '协商不通过'
            },
            dicEn: {
                80: 'Negotiation is not approved',
                12: 'Investigation and consultation',
                13: 'Investigation and consultation',
                14: 'Investigation mission',
                15: 'Investigation discontinuation',
                16: 'Completion of investigation mission',
                21: 'Enforcement task to be accepted',
                22: 'Law enforcement consultation',
                23: 'Negotiation through law enforcement',
                24: 'Law enforcement tasks',
                25: 'Suspension of law enforcement',
                26: 'Completion of law enforcement',
                31: 'Task to be accepted',
                32: 'Investigation and law enforcement consultation',
                33: 'Investigation, enforcement and negotiation',
                34: 'Investigation and enforcement tasks',
                35: 'Suspension of investigation and enforcement',
                36: 'Investigation and enforcement',
                17: 'Investigation and completion',
                97: 'End',
                91: 'Negotiation is not approved'
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
                    compensableId:investigationDetail?investigationDetail.b2bCompensableDetailDO.compensableId : null
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
                            if(groupUserData.nickName || groupUserData.showNick !==""){
                                journalData.push({id:Date.now()-1,tag:groupUserData.nickName?groupUserData.nickName:groupUserData.showNick})
                            }
                        })
                    }
                }
                
                //获取线索人员  组团人员 分配人员
                let data={
                    b2bUserId:investigationDetail?investigationDetail.userId:null,
                }
                if(this.props.getUserGroupInfo){
                    this.props.getUserGroupInfo(data,()=>{
                        let { groupUserData } =this.props
                        if(groupUserData.nickName!=="" || groupUserData.showNick!=='' ){
                            journalData.push({id:1,tag:groupUserData.nickName?groupUserData.nickName:groupUserData.showNick})
                        }
                        if(investigationDetail){
                            let allotData=investigationDetail?investigationDetail.b2bCompensableDetailDO.allot : [];
                            let logListName = investigationDetail?investigationDetail.logList:[]
                            let teamData=investigationDetail?investigationDetail.b2bCompensableDetailDO.team : [] 
                            if(logListName && logListName.length>0){
                                logListName.map((v,i)=>{
                                    journalData.push({id:Date.now()+i,tag:v.nickName?v.nickName:v.showNick})
                                })
                            }
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
                        };
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
        let { intl, investigationDetail, getCueBonus, eidtCheckCompensable, getDistributionList, minTotal ,
            getDistributionData, userInfo, geteditInvestigationAllot, getFinishOperate, getInvestigationDetail,permissionList,
            getTaskLog, investigationDetailTaskLog, total, getStopCompensable,getEditOverCompensable,getEditCheckConsult,getCreateMoney} = this.props
        let { activeKey, compensableId , typeDic, dic,journalData,type,id,dicEn,typeDicEn}= this.state
        let breadcrumbData = [
            { link: '/', titleId: "router.home", title: '首页' },
            { link: '/report/task', query: { goback: true }, titleId:"router.report.task.management", title: '举报任务管理' },
            { link: '', query: { goback: true }, titleId: "router.report.task.detail", title: '任务详情' },
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
                        dic={intl.locale==='zh'?dic:dicEn}
                        typeDic={intl.locale==='zh'?typeDic:typeDicEn}
                        type={type}
                        journalData={journalData}
                        getStopCompensable={getStopCompensable}
                        getEditOverCompensable={getEditOverCompensable}
                        id={id}
                        getEditCheckConsult={getEditCheckConsult}
                        getCreateMoney={getCreateMoney}
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
export default injectIntl(InvestigationTaskDetails)