import React, { Component } from 'react'
import { Button, Col, Card, Row, Tabs, message } from 'antd'
import Content from '../../../common/layout/content/index'
import CluesDetail from './children/cluesDetail'
import PartyDetail from './children/partyDetail'
import Process from './children/process'
import Logs from './children/logs'
import { FormattedMessage } from 'react-intl'
import { queryUrlParams } from '../../../../utils/util'
import DistributionModal from './children/distributionModal'
import emptyImg from '../../../../assets/images/empty.svg'
const TabPane = Tabs.TabPane;

export default class LawsuitsDetail extends Component {
    constructor() {
        super()
        this.state = {
            activeKey: '1',
            suitId: '',
            processDetail: {},
            visible: false,
            allotedId:'',
            pageSize: 10,
            nameLikeOrMobile:''
        }
    }

    componentWillMount() {
        let suitNo = queryUrlParams('suitNo');
        this.setState({
            suitNo
        },()=>{
            this.getSuitDetails()
        })
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    //获取详情
    getSuitDetails() {
        let { getSuitCaseDetail } = this.props;
        let { suitNo } = this.state
        if (suitNo && getSuitCaseDetail) {
            getSuitCaseDetail({suitNo: suitNo},(id) => {
                this.setState({
                    suitId: id
                })
            })
        }
    }

    //tab切换
    changeTabs(key) {
        this.setState({
            activeKey: key
        }, () => {
            let { getDefendantInfo, getLogs, getProcessInfo } = this.props;
            let { suitId } = this.state;
            if (key ==='2') {
                getDefendantInfo({ suitId: suitId })
            } else if (key ==='3') {
                getProcessInfo({ suitId: suitId })
            } else if (key ==='4') {
                getLogs({ suitId: suitId })
            }
        })
    }

    //获取合作律师list
    getCooperativeLawyer() {
        this.getCooperativeList(1)
    }

    //获取合作律师data
    getCooperativeList(pageNo) {
        let { getCooperativeLawyerList } = this.props;
        let { pageSize, nameLikeOrMobile } = this.state
        let data={
            pageNo: pageNo ? pageNo : '',
            pageSize: pageSize,
            nameLikeOrMobile: nameLikeOrMobile ? nameLikeOrMobile : '',
            allotFlag: 1,//只能查询账号类型为律师的数据
            status: 1
        }
        getCooperativeLawyerList(data)
    }

    //获取调查员信息modal分页器
    minPaginationdata(page,pageSize) {
        this.setState({
            minPageNo:page
        },()=>{
            let { getCooperativeLawyerList } = this.props;
            let { pageSize } = this.state
            let data={
                pageNo: page,
                pageSize: pageSize,
                allotFlag: 1,//只能查询账号类型为律师的数据
                status: 1
            }
            getCooperativeLawyerList(data)
        })
    }

    //打开分配modal
    openVisable() {
        this.setState({
            visible: true
        },()=>{
            this.getCooperativeLawyer()
        })
    }

    //分配确定
    handleOkVisible() {
        let { allotedId, suitId, nameLikeOrMobile, suitNo } = this.state;
        let { editSuitDistribue, ligitaionList } = this.props
        if(allotedId === '' || allotedId === undefined){
            message.info("请输入合作律师")
            return
        }
        let data={
            id: suitId,
            allotedId,
            suitNo: suitNo,
            nameLikeOrMobile: nameLikeOrMobile
        }
        if(editSuitDistribue){
            editSuitDistribue(data, ligitaionList, ()=>{
                this.closeVisible()
            })
        }
    }

    //分配取消
    closeVisible() {
        this.setState({
            visible: false,
            nameLikeOrMobile:'',
            allotedId:''
        })
    }

    //赋值
    handleChange(key, value) {
        this.setState({
            [key]: value
        },()=>{
            if(key === 'nameLikeOrMobile'){
                this.getCooperativeList(1)
            }
        })
    }

    //选择合作律师
    selectUser(item) {
        if(item){
            this.setState({
                allotedId: item.userId,
                nameLikeOrMobile: item.userName
            })
        }
    }

    render() {
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '/thread/litigation/list', titleId: 'router.litigation.case.management', title: '诉讼案件管理' ,query: { goBack: true }},
            { link: '', titleId:'router.details.of.litigation.cases', title: '诉讼案件详情' }
        ]
        let { activeKey, suitId, visible, nameLikeOrMobile, allotedId } = this.state;
        let {
            parties, updateDefendantInfo, deleteDefendantInfo, suitCaseDetail,
            process, getProcessInfo, updateProcessDetailStatus, logs, litigationCloseCaseWay, litigationDocumentType,
            cooperativeLawyerList, getCooperativeLawyerList, minToltal, minPageNo, intl, threadMainBodyType, litigationAttributes,
            ligiationStatus, ligitaionList
        } = this.props;
        return (
            <Content className="lawsuits-detail" breadcrumbData={breadcrumbData}>
                <Card className='detail-head'>
                    <div className='head-l'>
                        <Row>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="ligiation.proceedings.number" defaultMessage="诉讼案件编号" /> :</span>
                                    <span className='row-info'>{suitCaseDetail.suitNo}</span>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="thread.clue.name" defaultMessage="线索名称" /> :</span>
                                    <span className='row-info'>{suitCaseDetail.clueName}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="monitor.picture.rule.brand" defaultMessage="所属品牌" /> :</span>
                                    <span className='row-info'>{suitCaseDetail.brandName}</span>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="case.state" defaultMessage="案件状态" /> :</span>
                                    <span className='row-info'>{suitCaseDetail.statusName}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="ligiation.cooperative.lawyer" defaultMessage="合作律师" /> :</span>
                                    <span className='row-info'>{suitCaseDetail.allotedName}</span>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="global.start.time" defaultMessage="开始时间" /> :</span>
                                    <span className='row-info'>{suitCaseDetail.gmtAllot}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className='head-r'>
                        {
                            suitCaseDetail ? ( suitCaseDetail.status === 12 || suitCaseDetail.status === 1 ) && suitCaseDetail.isDel === 0? (
                                <Button type='primary' onClick={()=>this.openVisable()}><FormattedMessage id="global.distribution" defaultMessage="分配" description="分配" /></Button>
                            ):'':''
                        }
                    </div>
                </Card>
                <Card className='details'>
                    <Tabs defaultActiveKey="2" activeKey={activeKey} onChange={key => this.changeTabs(key)}>
                        <TabPane tab={intl.formatMessage({id:'router.clue.managment.details',defaultMessage:'线索详情'})} key="1">
                            <CluesDetail
                                suitCaseDetail={suitCaseDetail}
                            />
                        </TabPane>
                        <TabPane tab={intl.formatMessage({id:'ligiation.the.other.party',defaultMessage:'对方当事人'})} key="2">
                            {
                                suitCaseDetail.status === 12 ? (
                                    <div className="empeyInfo">
                                        <img src={emptyImg} alt=""/>
                                        <p><FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" /></p>
                                    </div>
                                ): <PartyDetail
                                        suitId={suitId}
                                        parties={parties}
                                        suitCaseDetail={suitCaseDetail}
                                        updateDefendantInfo={updateDefendantInfo}
                                        deleteDefendantInfo={deleteDefendantInfo}
                                        threadMainBodyType={threadMainBodyType}
                                        litigationDocumentType={litigationDocumentType}
                                        litigationAttributes={litigationAttributes}
                                    />
                            }
                        </TabPane>
                        <TabPane tab={intl.formatMessage({id:'ligiation.speed.of.progress',defaultMessage:'进度'})} key="3">
                            {
                                suitCaseDetail.status === 12  ||  suitCaseDetail.status === 1 ||  suitCaseDetail.status === 0 ? (
                                    <div className="empeyInfo">
                                        <img src={emptyImg} alt=""/>
                                        <p><FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" /></p>
                                    </div>
                                ):<Process
                                    suitId={suitId}
                                    process={process}
                                    ligitaionList={ligitaionList}
                                    ligiationStatus={ligiationStatus}
                                    suitCaseDetail={suitCaseDetail}
                                    getProcessInfo={getProcessInfo}
                                    updateProcessDetailStatus={updateProcessDetailStatus}
                                    litigationCloseCaseWay={litigationCloseCaseWay}
                                /> 
                            }
                        </TabPane>
                        <TabPane tab={intl.formatMessage({id:'ligiation.case.log',defaultMessage:'案件日志'})} key="4">
                            {
                                suitCaseDetail.status === 12 ? (
                                    <div className="empeyInfo">
                                        <img src={emptyImg} alt=""/>
                                        <p><FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" /></p>
                                    </div>
                                ):<Logs
                                    logs={logs}
                                />
                            }
                        </TabPane>
                    </Tabs>
                </Card>
                {
                    visible ? (
                        <DistributionModal
                            visible={visible}
                            handleOkVisible={()=>this.handleOkVisible()}
                            closeVisible={() => this.closeVisible()}
                            cooperativeLawyerList={cooperativeLawyerList}
                            getCooperativeLawyerList={getCooperativeLawyerList}
                            handleChange={(key, value)=>this.handleChange(key, value)}
                            minPaginationdata={(page,pageSize)=>this.minPaginationdata(page,pageSize)}
                            minToltal={minToltal}
                            minPageNo={minPageNo}
                            nameLikeOrMobile={nameLikeOrMobile}
                            selectUser={(item)=>this.selectUser(item)}
                            allotedId={allotedId}
                        />
                    ):''
                }
            </Content>
        )
    }
}
