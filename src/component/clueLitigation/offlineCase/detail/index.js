import React, { Component } from 'react'
import { Card, Col, Row, Button, Tabs, message } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../../common/layout/content/index'
import { queryUrlParams, getName } from '../../../../utils/util'
import emptyImg from '../../../../assets/images/empty.svg'
import SurveyResult from './children/surveyResult'
import ExecutionResult from './children/executionResult'
import Logs from './children/logs'
import OfflineCaseDetailItem from './children/offlineCaseDetail'
import GiveUpModal from './children/giveUpModal'
const TabPane = Tabs.TabPane;

export default class OfflineCaseDetail extends Component {
    constructor() {
        super();
        this.state = {
            activeKey: '1',
            cid: '',
            pageSize: 10,
            brandAudit: '',
            visible: false,
            reason: '',
            editType: ''
        }
    }

    componentWillMount() {
        let cid = queryUrlParams('cid');
        let brandAudit = queryUrlParams('brand');
        this.setState({
            cid,
            brandAudit
        }, () => {
            this.getOfflineCaseDetail()
        })
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    //获取详情
    getOfflineCaseDetail() {
        let { getOfflineCaseDetail } = this.props;
        let { cid } = this.state
        if (cid && getOfflineCaseDetail) {
            getOfflineCaseDetail({ id: cid }, id => {
                this.setState({
                    cid: id
                })
            })
        }
    }

    //tab切换
    changeTabs(key) {
        this.setState({
            activeKey: key
        }, () => {
            let { getLogs, queryLawyerCaseReport, queryProcessInfo } = this.props;
            let { cid } = this.state;
            if (key === '2') {
                queryLawyerCaseReport({ infoId: cid })
            } else if (key === '3') {
                queryProcessInfo({ caseId: cid })
            } else if (key === '4') {
                getLogs({ caseId: cid })
            }
        })
    }

    //审核通过或审核不通过
    brandAuditPass(key) {
        let { brandAuditPass, brandOfflineCaseList, brandOffLineCaseStatusList } = this.props;
        let { cid } = this.state;
        if (key === 1) {
            let data = {
                id: cid,
                status: 3
            }
            let status = getName(brandOffLineCaseStatusList, data.status);
            data.statusName = status.dictLabel;
            data.statusNameEn = status.dictLabelEn;
            if (brandAuditPass) {
                brandAuditPass(data, brandOfflineCaseList, () => {
                    this.handleCancel()
                })
            }
        } else if (key === 2) {
            this.setState({
                editType: 2,
                visible: true,
                reason: ''
            })
        }
    }

    //推送给品牌
    pushToBrand() {
        let { pushBrandCase, offlineCaseList, offlineCaseStatusList, offlineCaseReport } = this.props;
        let { cid } = this.state;
        if(offlineCaseReport && offlineCaseReport.length <=0){
            message.info('请填写调查情况')
            return
        }
        let data = {
            id: cid,
            status: 1
        }
        let status = getName(offlineCaseStatusList, data.status);
        data.statusName = status.dictLabel;
        data.statusNameEn = status.dictLabelEn;
        if (pushBrandCase) {
            pushBrandCase(data, offlineCaseList)
        }
    }

    //放弃或结案
    giveUpAndClose(key) {
        let { closeCase, offlineCaseList, offlineCaseStatusList, offlineCaseDetail } = this.props;
        let { cid } = this.state;
        if (key === 1) {
            //放弃
            this.setState({
                editType: 1,
                visible: true,
                reason: ''
            })
        } else if (key === 2) {
            //结案
            let data={
                id:cid
            }
            if(offlineCaseDetail){
                if(offlineCaseDetail.caseType === 1){
                    //行政
                    data.status = 10
                }else{
                    //刑事
                    data.status = 11
                }
            }
            let statusInfo = getName(offlineCaseStatusList, data.status);
            data.statusName = statusInfo.dictLabel;
            data.statusNameEn = statusInfo.dictLabelEn;
            if (closeCase) {
                closeCase(data, offlineCaseList)
            }
        }
    }

    //取消提交不通过理由/放弃理由
    handleCancel() {
        this.setState({
            editType: '',
            visible: false,
            reason: ''
        })
    }

    //赋值
    handleChange(value, type) {
        this.setState({
            [type]: value
        })
    }

    //提交不通过理由/放弃理由
    handleOk() {
        let { editType, reason, cid } = this.state;
        let { offlineCaseList, giveUpCase, brandAuditPass, brandOffLineCaseStatusList, brandOfflineCaseList, offlineCaseStatusList } = this.props;
        if (editType === 2) {
            //不通过
            let data = {
                id: cid,
                status: 2,
                auditReason: reason
            }
            let status = getName(brandOffLineCaseStatusList, data.status);
            data.statusName = status.dictLabel;
            data.statusNameEn = status.dictLabelEn;
            if (brandAuditPass) {
                brandAuditPass(data, brandOfflineCaseList, () => {
                    this.handleCancel()
                })
            }
        } else {
            //放弃
            if(reason === undefined || reason === ''){
                message.info('请输入放弃理由')
                return
            }
            let data = {
                id: cid,
                status: 4,
                quitReason: reason
            }
            let status = getName(offlineCaseStatusList, data.status);
            data.statusName = status.dictLabel;
            data.statusNameEn = status.dictLabelEn;
            if (giveUpCase) {
                giveUpCase(data, offlineCaseList, () => {
                    this.handleCancel()
                })
            }
        }
    }

    render() {
        let { activeKey, brandAudit, visible, editType, reason, cid } = this.state;
        let { intl, offlineCaseDetail, logs, addOfflineReportResult, offlineCaseReport, queryLawyerCaseReport, saveProcessInfo, processDetail } = this.props;
        let breadcrumbData = []
        if (brandAudit && brandAudit === 'audit') {
            breadcrumbData = [
                { link: '/', titleId: 'router.home', title: '首页' },
                { link: '/thread/offlinecaselist/brandlist', titleId: 'router.brand.offline.case.management', title: '品牌方线下案件管理', query: { goBack: true } },
                { link: '', titleId: 'router.offline.case.management.detail.work', title: '线下案件详情' }
            ]
        } else {
            breadcrumbData = [
                { link: '/', titleId: 'router.home', title: '首页' },
                { link: '/thread/offlinecaselist/list', titleId: 'router.offline.case.management', title: '线下案件管理', query: { goBack: true } },
                { link: '', titleId: 'router.offline.case.management.detail.work', title: '线下案件详情' }
            ]
        }
        return (
            <Content className="lawsuits-detail" breadcrumbData={breadcrumbData}>
                <Card className='detail-head'>
                    <div className='head-l'>
                        <Row>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="offline.case.proceedings.number" defaultMessage="线下案件编号" /> :</span>
                                    <span className='row-info'>{offlineCaseDetail ? offlineCaseDetail.caseNo : ''}</span>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="thread.clue.name" defaultMessage="线索名称" /> :</span>
                                    <span className='row-info'>{offlineCaseDetail ? offlineCaseDetail.clueName : ''}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="offline.case.clue.source" defaultMessage="线索来源" /> :</span>
                                    <span className='row-info'>{offlineCaseDetail ? intl.locale === 'zh' ? offlineCaseDetail.clueTypeName : offlineCaseDetail.clueTypeNameEn : ''}</span>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="case.type" defaultMessage="案件类型" /> :</span>
                                    <span className='row-info'>{offlineCaseDetail ? intl.locale === 'zh' ? offlineCaseDetail.caseTypeName : offlineCaseDetail.caseTypeNameEn : ''}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="monitor.picture.rule.brand" defaultMessage="所属品牌" /> :</span>
                                    <span className='row-info'>{offlineCaseDetail ? offlineCaseDetail.brandName : ''}</span>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="case.state" defaultMessage="案件状态" /> :</span>
                                    <span className='row-info'>{offlineCaseDetail ? intl.locale === 'zh' ? offlineCaseDetail.statusName : offlineCaseDetail.statusNameEn : ''}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div className='row'>
                                    <span className='lable'><FormattedMessage id="global.start.time" defaultMessage="开始时间" /> :</span>
                                    <span className='row-info'>{offlineCaseDetail ? offlineCaseDetail.gmtCreate : ''}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    {
                        brandAudit && brandAudit === 'audit' ? (
                            <div className='head-r'>
                                {
                                    offlineCaseDetail ? offlineCaseDetail.status === 1 ? (
                                        <div>
                                            <div>
                                                <Button type='primary' onClick={() => this.brandAuditPass(1)} className="offline-btns">
                                                    <FormattedMessage id="brand.audit.pass" defaultMessage="审核通过" description="审核通过" />
                                                </Button>
                                            </div>
                                            <div>
                                                <Button type='primary' onClick={() => this.brandAuditPass(2)} className="offline-btns">
                                                    <FormattedMessage id="brand.audit.no.pass" defaultMessage="审核不通过" description="审核不通过" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : '' : ''
                                }
                            </div>
                        ) : (
                                <div className='head-r'>
                                    {
                                        offlineCaseDetail ? offlineCaseDetail.clueType !== 3 && offlineCaseDetail.status === 0 ? (
                                            <div>
                                                <div>
                                                    <Button type='primary' onClick={() => this.pushToBrand()} className="offline-btns">
                                                        <FormattedMessage id="offline.case.push.to.brand" defaultMessage="推送给品牌" description="推送给品牌" />
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button type='primary' onClick={() => this.giveUpAndClose(1)} className="offline-btns">
                                                        <FormattedMessage id="offline.case.give.up" defaultMessage="放弃" description="放弃" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : '' : ''
                                    }
                                    {
                                        offlineCaseDetail ? offlineCaseDetail.status >= 5 && offlineCaseDetail.status !== 10 ? (
                                            <div>
                                                <Button type='primary' onClick={() => this.giveUpAndClose(2)} className="offline-btns">
                                                    <FormattedMessage id="offline.case.closing.a.case" defaultMessage="结案" description="结案" />
                                                </Button>
                                            </div>
                                        ) : '' : ''
                                    }
                                </div>
                            )
                    }
                </Card>
                <Card className='details'>
                    <Tabs
                        activeKey={activeKey}
                        onChange={key => this.changeTabs(key)}
                    >
                        <TabPane
                            tab={intl.formatMessage({ id: 'router.clue.managment.details', defaultMessage: '线索详情' })}
                            key='1'
                        >
                            <OfflineCaseDetailItem
                                offlineCaseDetail={offlineCaseDetail}
                            />
                        </TabPane>
                        <TabPane
                            tab={intl.formatMessage({ id: 'offline.case.findings', defaultMessage: '调查结果' })}
                            key='2'
                        >
                            <SurveyResult
                                offlineCaseReport={offlineCaseReport}
                                brandAudit={brandAudit}
                                addOfflineReportResult={addOfflineReportResult}
                                queryLawyerCaseReport={queryLawyerCaseReport}
                                cid={cid}
                                offlineCaseDetail={offlineCaseDetail}
                            />
                        </TabPane>
                        <TabPane
                            tab={intl.formatMessage({ id: 'offline.case.results.of.enforcement', defaultMessage: '执行结果' })}
                            key='3'
                        >
                            <ExecutionResult
                                caseId={cid}
                                processDetail={processDetail}
                                offlineCaseDetail={offlineCaseDetail}
                                saveProcessInfo={saveProcessInfo}
                                getOfflineCaseDetail={() => this.getOfflineCaseDetail()}
                            />
                        </TabPane>
                        <TabPane
                            tab={intl.formatMessage({ id: 'ligiation.case.log', defaultMessage: '日志' })}
                            key='4'
                        >
                            {
                                offlineCaseDetail ? offlineCaseDetail.status === 12 ? (
                                    <div className="empeyInfo">
                                        <img src={emptyImg} alt="" />
                                        <p><FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" /></p>
                                    </div>
                                ) :
                                    <Logs
                                        logs={logs}
                                    /> : ''
                            }
                        </TabPane>
                    </Tabs>
                </Card>
                <GiveUpModal
                    visible={visible}
                    editType={editType}
                    reason={reason}
                    handleCancel={() => this.handleCancel()}
                    handleOk={() => this.handleOk()}
                    handleChange={(value, type) => this.handleChange(value, type)}
                />
            </Content>
        )
    }
}
