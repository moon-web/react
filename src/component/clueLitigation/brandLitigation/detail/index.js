import React, { Component } from 'react'
import { Button, Col, Card, Row, Tabs, Modal, Form, Input, message } from 'antd'
import Content from '../../../common/layout/content/index'
import CluesDetail from './children/cluesDetail'
import PartyDetail from './children/partyDetail'
import Process from './children/process'
import Logs from './children/logs'
import { FormattedMessage } from 'react-intl'
import { queryUrlParams, getName } from '../../../../utils/util'
import emptyImg from '../../../../assets/images/empty.svg'
import './index.css'
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
            nameLikeOrMobile:'',
            auditReason: '',//品牌方审核不通过理由
            brandAuditVisibile: false,//品牌方审核modal
            status: ''
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
            let data = {
                suitNo
            }
            getSuitCaseDetail(data ,(result) => {
                this.setState({
                    suitId: result.id
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

    //审核
    modifyBrandSuitList(data) {
        let { modifyBrandSuitList, brandLigitaionList, ligiationStatus } = this.props
        let detailStatus = getName(ligiationStatus, data.status)
        data.statusName = detailStatus.dictLabel
        data.statusNameEn = detailStatus.dictLabelEn
        if(modifyBrandSuitList) {
            modifyBrandSuitList(data, brandLigitaionList, () => {
                this.setState({
                    brandAuditVisibile: false
                })
            })
        }
    }
    //审核通过
    auditBrand(status) {
        let { suitId } = this.state
        let data = {
            id: suitId,
            status: status
        }
        this.modifyBrandSuitList(data)
    }
    //不通过  打开品牌方确认审核modal
    openBrandAuditModal(status) {
        this.setState({
            brandAuditVisibile: true,
            status: status
        })
    }
    //品牌方确认审核不通过
    onOkModal() {
        let { auditReason, status, suitId } = this.state
        if(!auditReason) {
            message.info('请输入不通过理由')
            return 
        }
        let data = {
            auditReason,
            status,
            id: suitId
        }
        this.modifyBrandSuitList(data)
    }
    //品牌方确认审核不通过取消
    onCancelModal() {
        this.setState({
            brandAuditVisibile: false,
            auditReason: ''
        })
    }


    render() {
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '/thread/brand/litigation', titleId: 'router.litigation.brand.case.management', title: '品牌方诉讼案件管理', query: { goBack: true }},
            { link: '', titleId: 'router.litigation.brand.case..detail.management', title: '品牌方诉讼案件管理详情' },
        ]
        let { activeKey, suitId, auditReason, brandAuditVisibile } = this.state;
        let {
            parties, suitCaseDetail,
            process, getProcessInfo, logs, litigationCloseCaseWay, litigationDocumentType,
            intl, threadMainBodyType, litigationAttributes,
            ligiationStatus, brandLigitaionList
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
                            suitCaseDetail && suitCaseDetail.status === 13 ?
                            <div>
                                
                                <div>
                                    <Button type='primary' onClick={() => this.auditBrand(12)} className="offline-btns">
                                        <FormattedMessage id="brand.audit.pass" defaultMessage="审核通过" description="审核通过" />
                                    </Button>
                                </div>
                                <div>
                                    <Button type='primary' onClick={() => this.openBrandAuditModal(14)} className="offline-btns">
                                        <FormattedMessage id="brand.audit.no.pass" defaultMessage="审核不通过" description="审核不通过" />
                                    </Button>
                                </div> 
                            </div>: ''
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
                                    ligitaionList={brandLigitaionList}
                                    ligiationStatus={ligiationStatus}
                                    suitCaseDetail={suitCaseDetail}
                                    getProcessInfo={getProcessInfo}
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
                <Modal
                    className="root"
                    title={intl.formatMessage({id:'ligiation.management.brand.cases',defaultMessage:'品牌方诉讼案件管理审核',description:'品牌方诉讼案件管理审核'})}
                    visible={brandAuditVisibile}
                    onOk={() => this.onOkModal()}
                    onCancel={() => this.onCancelModal()}
                >
                    <div className="search-form">
                        <Row>
                            <Col span={20}>
                                <Form.Item label={intl.formatMessage({ id: "monitor.fail.reason", defaultMessage: "不通过理由", description: "不通过理由" })}>
                                    <Input 
                                        placeholder={intl.formatMessage({ id: "monitor.please.enter.fail.reason", defaultMessage: "请输入不通过理由", description: "请输入拒绝理由" })} 
                                        value={auditReason} 
                                        onChange={(e) => this.setState({auditReason : e.target.value.trim()})} />
                                </Form.Item>
                            </Col>
                        </Row>                             
                    </div>
                </Modal>
            </Content>
        )
    }
}
