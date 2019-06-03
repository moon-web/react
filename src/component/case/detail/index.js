import React, { Component } from 'react'
import { Button, Card, Row, Col, Tabs, Modal, Checkbox, Input, message, Radio } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import CompanyDetail from './children/companyDetail'
import ProdDetail from './children/prodDetail'
import ProcessDetail from './children/processDetail'
import CaseDetail from './children/caseDetail'
import SuitDetail from './children/suitDetail'
import WarnDetail from './children/warnDetail'
import { queryUrlParams ,getButtonPrem} from '../../../utils/util'
import './index.css'
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

export default class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            basicDetail: {},
            caseDetail: {},
            companyDetail: [],
            processDetail: {},
            prodDetail: [],
            suitDetail: {},
            warnDetail: {},
            tabList: [],
            warnFollow: {
                checked: false,
                name: ''
            },
            caseFollow: {
                checked: false,
                name: ''
            },
            suitFollow: {
                checked: false,
                name: ''
            },
            visible: false,
            visibleAudit: false,
            caseStatus: ''
        }
    }

    componentWillMount() {
        let { getBasicDetail, getCaseDetail, getCompanyDetail, getProcessDetail, getProdDetail, getSuitDetail, getWarnDetail, userInfo, history, getAuditType } = this.props;
        if (history.location.search) {
            let id = queryUrlParams('id');
            let data = { userId: userInfo.userId, id: id };
            getBasicDetail(data)
            getCaseDetail(data)
            getCompanyDetail(data)
            getProcessDetail(data)
            getProdDetail(data)
            getSuitDetail(data)
            getWarnDetail(data)
            getAuditType({ userId: 1, dictType: 7 })
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.basicDetail !== this.props.basicDetail) {
            this.setState({
                basicDetail: Object.assign({}, nextProps.basicDetail)
            })
        }
    }

    // 获取公共接口数据
    getCommonData(data) {
        let { userInfo } = this.props;
        let id = queryUrlParams('id');
        data.userId = userInfo.userId;
        data.id = id;
        return data;
    }

    // 更新案件详情
    updateCaseDetail(data, callback) {
        data = this.getCommonData(data)
        let { updateCaseDetail, getBasicDetail, getCaseDetail } = this.props;
        updateCaseDetail(data, () => {
            getBasicDetail(data)
            getCaseDetail(data)
            typeof callback === 'function' && callback()
        })
    }

    // 更新公司信息详情
    updateCompanyDetail(data, callback) {
        data = this.getCommonData(data)
        let { updateCompanyDetail } = this.props;
        updateCompanyDetail(data, callback)
    }

    // 更新案件进度详情
    updateProcessDetail(data, callback) {
        data = this.getCommonData(data)
        this.props.updateProcessDetail(data, callback)
    }

    // 更新商品详情
    updateProdDetail(data, callback) {
        data = this.getCommonData(data)
        let { getProdDetail, updateProdDetail, userInfo } = this.props;
        let id = queryUrlParams('id');
        let getData = { userId: userInfo.userId, id: id };
        updateProdDetail(data, () => {
            typeof callback === 'function' && callback()
            getProdDetail(getData)
        })
    }

    // 更新诉讼详情
    updateSuitDetail(data, callback) {
        data = this.getCommonData(data)
        let { updateSuitDetail, getBasicDetail, getSuitDetail } = this.props;
        updateSuitDetail(data, () => {
            getBasicDetail(data)
            getSuitDetail(data)
            typeof callback === 'function' && callback()
        })
    }

    // 更新警告信详情
    updateWarnDetail(data, callback) {
        data = this.getCommonData(data)
        let { updateWarnDetail, getBasicDetail, getWarnDetail } = this.props;
        updateWarnDetail(data, () => {
            getBasicDetail(data)
            getWarnDetail(data)
            typeof callback === 'function' && callback()
        })
    }

    // 获取归类信息
    getFollowBy(basicDetail) {
        let { caseFollow, suitFollow, warnFollow } = this.state;
        if (basicDetail && basicDetail.classify) {
            let followBy = basicDetail.classify;
            caseFollow.checked = suitFollow.checked = warnFollow.checked = false;
            caseFollow.name = suitFollow.name = warnFollow.name = '';
            for (let i = 0; i < followBy.length; i++) {
                const element = followBy[i];
                if (element.type === 1) {
                    caseFollow.checked = true;
                    caseFollow.name = element.followBy;
                } else if (element.type === 2) {
                    suitFollow.checked = true;
                    suitFollow.name = element.followBy;
                } else if (element.type === 3) {
                    warnFollow.checked = true;
                    warnFollow.name = element.followBy;
                }
            }
            this.setState({
                caseFollow,
                suitFollow,
                warnFollow
            })
        }

    }

    // 显示归类弹窗
    showFollowByModal() {
        let basicDetail = this.state.basicDetail;
        this.getFollowBy(basicDetail)
        this.setState({
            visible: true
        })
    }

    // 修改归类
    changeFolliwBy(value, key, source) {
        let { caseFollow, suitFollow, warnFollow } = this.state;
        if (key === 'caseFollow') {
            caseFollow[source] = value
            caseFollow.checked = true
            if (value === '') {
                caseFollow.checked = false
            }
            if (source === 'checked' && !value) {
                caseFollow.name = ''
                caseFollow.checked = false
            }
        } else if (key === 'suitFollow') {
            suitFollow[source] = value
            suitFollow.checked = true
            if (value === '') {
                suitFollow.checked = false
            }
            if (source === 'checked' && !value) {
                suitFollow.name = ''
                suitFollow.checked = false
            }
        } else if (key === 'warnFollow') {
            warnFollow[source] = value
            warnFollow.checked = true
            if (value === '') {
                warnFollow.checked = false
            }
            if (source === 'checked' && !value) {
                warnFollow.name = ''
                warnFollow.checked = false
            }
        }
        this.setState({
            caseFollow,
            suitFollow,
            warnFollow
        })
    }

    // 提交归类
    submitClassify() {
        let { caseFollow, suitFollow, warnFollow } = this.state;
        let { userInfo, updateClassify, getCaseDetail, getBasicDetail, getSuitDetail, getWarnDetail } = this.props;
        let id = queryUrlParams('id');
        if ((caseFollow.checked && !caseFollow.name) || (suitFollow.checked && !suitFollow.name) || (warnFollow.checked && !warnFollow.name)) {
            message.info('请输入跟进人');
            return;
        }
        let data = {
            userId: userInfo.userId,
            lawCaseId: id,
            caseFollow: caseFollow.name,
            suitFollow: suitFollow.name,
            warnFollow: warnFollow.name
        }
        updateClassify(data, () => {
            let data = { userId: userInfo.userId, id: id };
            getBasicDetail(data)
            getCaseDetail(data)
            getSuitDetail(data)
            getWarnDetail(data)
            this.setState({
                visible: false
            })
        })
    }

    // 取消归类
    cancelClassify() {
        this.setState({
            visible: false,
        })
        let basicDetail = this.state.basicDetail;
        this.getFollowBy(basicDetail)
    }

    // 显示审核弹窗
    showAuditModal() {
        this.setState({
            visibleAudit: true,
            caseStatus: ''
        })
    }

    // 提交审核
    submitCaseStatus() {
        let caseStatus = this.state.caseStatus;
        if (!caseStatus) {
            message.info("请选择审核条件")
            return
        }
        let { userInfo, caseAudit, getCaseDetail, getBasicDetail, getSuitDetail, getWarnDetail } = this.props;
        let id = queryUrlParams('id');
        let data = {
            userId: userInfo.userId,
            lawCaseId: id,
            auditStatus: caseStatus
        }
        caseAudit(data, () => {
            this.setState({
                visibleAudit: false,
                caseStatus: ''
            })
            let result = {
                userId: userInfo.userId, id: id
            }
            getBasicDetail(result)
            getCaseDetail(result)
            getSuitDetail(result)
            getWarnDetail(result)
        })

    }

    // 取消审核
    cancelCaseStatus() {
        this.setState({
            visibleAudit: false,
            caseStatus: ''
        })
    }

    render() {
        let {
            userInfo, brandList, casePlatform, prodList, infringementList, typeListCase, typeListComplaint, typeListWran,
            typecaseList, caseAuditStatus, intl, caseDetail, companyDetail, processDetail, prodDetail, suitDetail, warnDetail,
            getProDetailsList, getProDetails, getAsyncRefresh,permissionList
        } = this.props;
        let { basicDetail, visible, caseFollow, suitFollow, warnFollow, visibleAudit, caseStatus } = this.state;
        let breadcrumbData = [
            {
                titleId: "router.home",
                title: "首页",
                link: "/"
            },
            {
                titleId: "router.case.management",
                title: "案件管理",
                link: "/case/list",
                query: {
                    goback: true
                }
            },
            {
                titleId: "router.case.detail",
                title: "案件详情",
                link: ""
            }
        ]
        return (
            <Content breadcrumbData={breadcrumbData} className="case-detail">
                <div className="case-basic">
                    <div className="case-basic-info">
                        <div className="case-title">
                            <span><FormattedMessage id="case.number" defaultMessage="案件编号" description="案件编号" />: </span>
                            <span>{basicDetail ? basicDetail.caseNo : ''}</span>
                            <span className="case-title-small">
                                {
                                    basicDetail && basicDetail.auditStatusNameEng
                                        ? <FormattedMessage id={basicDetail.auditStatusNameEng} defaultMessage={basicDetail.auditStatusName} description="案件信息" />
                                        : ''
                                }
                            </span>
                        </div>
                        <Row>
                            <Col span={7}>
                                <span className="case-label">
                                    <FormattedMessage id="case.source" defaultMessage="来源" description="来源" />:
                                </span>
                                {
                                    intl.locale==='zh' && basicDetail && basicDetail.caseSourceName? basicDetail.caseSourceName:basicDetail.caseSourceNameEn
                                }
                            </Col>
                            <Col span={7}>
                                <span className="case-label">
                                    <FormattedMessage id="case.rapporteur" defaultMessage="报告人" description="报告人" />:
                                </span>
                                <span>{basicDetail ? basicDetail.reporter : ''}</span>
                            </Col>
                            <Col span={10}>
                                <span className="case-label">
                                    <FormattedMessage id="case.report.time" defaultMessage="报告时间" description="报告时间" />:
                                </span>
                                <span>{basicDetail ? basicDetail.gmtCreate : ''}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <span className="case-label">
                                    <FormattedMessage id="case.tort" defaultMessage="侵权类型" description="侵权类型" />:
                                </span>
                                {
                                    intl.locale==='zh' && basicDetail && basicDetail.tortsTypeName? basicDetail.tortsTypeName:basicDetail.tortsTypeNameEn
                                }
                            </Col>
                            <Col span={7}>
                                <span className="case-label">
                                    <FormattedMessage id="case.brand" defaultMessage="侵权品牌" description="侵权品牌" />:
                                </span>
                                <span>{basicDetail ? basicDetail.brandName : ''}</span>
                            </Col>
                            <Col span={10}>
                                <span className="case-label">
                                    <FormattedMessage id="case.product.kind" defaultMessage="产品分类" description="产品分类" />:
                                </span>
                                {
                                    intl.locale==='zh' && basicDetail && basicDetail.prodTypeName? basicDetail.prodTypeName:basicDetail.prodTypeNameEn
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <span className="case-label">
                                    <FormattedMessage id="case.platform.souzai" defaultMessage="所在平台" description="所在平台" />:
                                </span>
                                {
                                    intl.locale==='zh' && basicDetail && basicDetail.platformTypeName? basicDetail.platformTypeName:basicDetail.platformTypeNameEn
                                }
                            </Col>
                            <Col span={7}>
                                <span className="case-label">
                                    <FormattedMessage id="case.location.of.case" defaultMessage="案件所在地" description="案件所在地" />:
                                </span>
                                <span>{basicDetail ? basicDetail.caseAddr : ''}</span>
                            </Col>
                        </Row>
                    </div>
                    <div className="case-basic-classify">
                        <div className="case-basic-btn-wrap">
                            {
                                basicDetail && basicDetail.auditStatus === ''
                                    ? 
                                    getButtonPrem(permissionList,'003001008')?
                                        <Button type='primary' onClick={() => this.showAuditModal()}><FormattedMessage id="global.audit" defaultMessage="审核" description="审核" /></Button> : '' 
                                    :
                                    getButtonPrem(permissionList,'003001008')?
                                        <Button onClick={() => this.showFollowByModal()}><FormattedMessage id="case.classification" defaultMessage="归类" description="归类" /></Button>
                                    :''
                            }
                        </div>
                        {
                            basicDetail && basicDetail.classify
                                ? basicDetail.classify.map(item => (
                                    <Row key={item.type}>
                                        <Col span={12}>
                                            <span className="case-label">
                                                {
                                                    item.type === 1
                                                        ? <FormattedMessage id="case.case" defaultMessage="案件" description="案件" />
                                                        : item.type === 2
                                                            ? <FormattedMessage id="case.litigation" defaultMessage="诉讼" description="案件" />
                                                            : item.type === 3
                                                                ? <FormattedMessage id="case.warning.letter" defaultMessage="警告信" description="警告信" />
                                                                : ''
                                                }
                                                :
                                            </span>
                                            <span>{intl.locale === 'zh' ? item.staName : item.staNameEn}</span>
                                        </Col>
                                        <Col span={12}>
                                            <span className="case-label">
                                                <FormattedMessage id="case.person" defaultMessage="跟进人" description="跟进人" />:
                                            </span>
                                            <span>{item.followBy}</span>
                                        </Col>
                                    </Row>
                                ))
                                : ''
                        }
                    </div>
                </div>
                <div className="case-company-prod">
                    <CompanyDetail
                        companyDetail={companyDetail}
                        updateCompanyDetail={(data, callback) => this.updateCompanyDetail(data, callback)}
                        permissionList={permissionList}
                    />
                    <ProdDetail
                        prodDetail={prodDetail}
                        updateProdDetail={(data, callback) => this.updateProdDetail(data, callback)}
                        getProDetailsList={getProDetailsList}
                        getAsyncRefresh={getAsyncRefresh}
                        getProDetails={getProDetails}
                        userInfo={userInfo}
                        permissionList={permissionList}
                    />
                </div>
                <Card className="case-tabs">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={
                            `${intl.formatMessage({ id: "case.info", defaultMessage: `案件信息`, description: `案件信息` })}
                                (${caseDetail
                                ? intl.formatMessage({ id: caseDetail.caseScheduleNameEng, defaultMessage: caseDetail.caseScheduleName, description: `案件进度` })
                                : ''
                            })`
                        } key="1">
                            <CaseDetail
                                brandList={brandList}
                                prodList={prodList}
                                infringementList={infringementList}
                                casePlatform={casePlatform}
                                typeListCase={typeListCase}
                                typecaseList={typecaseList}
                                caseDetail={caseDetail}
                                updateCaseDetail={(data, callback) => this.updateCaseDetail(data, callback)}
                                userInfo={userInfo}
                                permissionList={permissionList}
                            />
                        </TabPane>
                        {
                            suitDetail && suitDetail.suitStatus !== 1
                                ?
                                (
                                    <TabPane tab={
                                        `${intl.formatMessage({ id: "case.litigation.info", defaultMessage: `诉讼信息`, description: `诉讼信息` })}
                                            (${intl.formatMessage({ id: suitDetail.suitStatusNameEng, defaultMessage: suitDetail.suitStatusName, description: `诉讼进度` })})`
                                    } key="2">
                                        <SuitDetail
                                            suitDetail={suitDetail}
                                            typeListComplaint={typeListComplaint}
                                            updateSuitDetail={(data, callback) => this.updateSuitDetail(data, callback)}
                                            userInfo={userInfo}
                                            permissionList={permissionList}
                                        />
                                    </TabPane>
                                )
                                : ''
                        }
                        {
                            warnDetail && warnDetail.warnStatus !== 6
                                ?
                                (
                                    <TabPane tab={
                                        `${intl.formatMessage({ id: "case.warning.letter.info", defaultMessage: `警告信信息`, description: `警告信信息` })}
                                            (${intl.formatMessage({ id: warnDetail.warnStatusNameEng, defaultMessage: warnDetail.warnStatusName, description: `警告信进度` })})`
                                    } key="3">
                                        <WarnDetail
                                            warnDetail={warnDetail}
                                            typeListWran={typeListWran}
                                            updateWarnDetail={(data, callback) => this.updateWarnDetail(data, callback)}
                                            userInfo={userInfo}
                                            permissionList={permissionList}
                                        />
                                    </TabPane>
                                )
                                : ''
                        }

                    </Tabs>
                </Card>
                <ProcessDetail
                    processDetail={processDetail}
                    updateProcessDetail={(data, callback) => this.updateProcessDetail(data, callback)}
                    permissionList={permissionList}
                />
                <Modal
                    className="case-classify-modal"
                    title={intl.formatMessage({ id: "case.case.calssify", defaultMessage: "案件归类", description: "案件归类" })}
                    visible={visible}
                    onOk={() => this.submitClassify()}
                    onCancel={() => this.cancelClassify()}
                >
                    <div className="case-classify-modal-info">
                        <div className="case-classify-row">
                            <p className="key">
                                <FormattedMessage id="case.kind" defaultMessage="分类" description="分类" />
                            </p>
                            <p className="input-wrap">
                                <FormattedMessage id="case.person" defaultMessage="跟进人" description="跟进人" />
                            </p>
                        </div>
                        <div className="case-classify-row">
                            <p className="key check">
                                <Checkbox value={8} checked={caseFollow.checked} onChange={e => this.changeFolliwBy(e.target.checked, 'caseFollow', 'checked')}>
                                    <FormattedMessage id="case.case" defaultMessage="案件" description="案件" />
                                </Checkbox>
                            </p>
                            <p className="input-wrap">
                                <Input placeholder={intl.formatMessage({ id: "case.please.person", defaultMessage: "请输入跟进人" })} value={caseFollow.name} onChange={e => this.changeFolliwBy(e.target.value.trim(), 'caseFollow', 'name')} onBlur={e => this.changeFolliwBy(e.target.value.trim(), 'caseFollow', 'name')} />
                            </p>
                        </div>
                        <div className="case-classify-row">
                            <p className="key check">
                                <Checkbox value={2} checked={suitFollow.checked} onChange={e => this.changeFolliwBy(e.target.checked, 'suitFollow', 'checked')} >
                                    <FormattedMessage id="case.litigation" defaultMessage="诉讼" description="诉讼" />
                                </Checkbox>
                            </p>
                            <p className="input-wrap">
                                <Input placeholder={intl.formatMessage({ id: "case.please.person", defaultMessage: "请输入跟进人" })} value={suitFollow.name} onChange={e => this.changeFolliwBy(e.target.value.trim(), 'suitFollow', 'name')} onBlur={e => this.changeFolliwBy(e.target.value.trim(), 'suitFollow', 'name')} />
                            </p>
                        </div>
                        <div className="case-classify-row">
                            <p className="key check">
                                <Checkbox value={1} checked={warnFollow.checked} onChange={e => this.changeFolliwBy(e.target.checked, 'warnFollow', 'checked')}>
                                    <FormattedMessage id="case.warning.letter" defaultMessage="警告信" description="警告信" />
                                </Checkbox>
                            </p>
                            <p className="input-wrap">
                                <Input placeholder={intl.formatMessage({ id: "case.please.person", defaultMessage: "请输入跟进人" })} value={warnFollow.name} onChange={e => this.changeFolliwBy(e.target.value.trim(), 'warnFollow', 'name')} onBlur={e => this.changeFolliwBy(e.target.value.trim(), 'warnFollow', 'name')} />
                            </p>
                        </div>
                    </div>
                </Modal>
                <Modal
                    className="case-classify-modal"
                    title={intl.formatMessage({ id: "case.audit", defaultMessage: "案件审核", description: "案件审核" })}
                    visible={visibleAudit}
                    onOk={() => this.submitCaseStatus()}
                    onCancel={() => this.cancelCaseStatus()}
                >
                    <div className="case-classify-modal-info">
                        <RadioGroup
                            value={caseStatus}
                            onChange={e => this.setState({ caseStatus: e.target.value })}
                        >
                            {
                                caseAuditStatus && caseAuditStatus.filter(item => item.isDel === 0)
                                    .map(opt => (
                                        <div className="case-classify-row" key={opt.id}>
                                            <Radio value={opt.dictVal}>
                                                {opt.dictLabel}
                                            </Radio>
                                        </div>
                                    ))
                            }
                        </RadioGroup>
                    </div>
                </Modal>
            </Content>
        )
    }
}
