import React, { Component } from 'react'
import { Select, Button, Input, Radio, Form, Steps, Upload, DatePicker, message, Icon, Modal } from 'antd'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment';
import FileListComponent from '../../../../common/upload/flieList'
import InputNumber from '../../../../common/form/numberInput'
import Req from '../../../../../api/req'
import { getName } from '../../../../../utils/util'
import '../index.css'
const SelectOption = Select.Option;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Step = Steps.Step;

class Process extends Component {
    constructor() {
        super()
        this.state = {
            editKey: 3,                     // 3取证，4诉讼方案，5立案，6庭前，7庭审，8判决 9结案
            current: 0,                     // 取证当前编辑
            isRead: false,
            forensics: [
                {                               // 取证信息
                    notarizationNum: '',        // 公证书号
                    notarizationOffice: '',     // 公证机构
                    evidenceAddress: '',        // 取证地点
                    evidenceTime: '',           // 公证时间
                    notarizationFeeFormat: '',  // 公证费用
                    otherFeeFormat: '',         // 其他费用
                    notarizationStr: [],        // 公证书
                    notarizationInvoice: [],    // 公证费发票
                    remark: '',                 // 备注
                    annexUrl: [],               // 附件
                }
            ],
            suitPlan: {                     // 诉讼方案
                defendantName: '',          // 对方当事人
                caseReason: '',             // 案由
                suitObject: '',             // 诉讼标的
                dealCourt: '',              // 管辖法院
                suitText: '',               // 起诉状
                authCertificate: '',        // 授权书
                evidenceIndex: '',          // 证据目录
                remark: '',                 // 备注
                annexUrl: [],               // 附件
            },
            caseInfo: {                     // 立案信息
                caseNum: '',                // 案号
                registerTime: '',           // 立案时间
                dealGownsman: '',           // 审理法官
                suitFeeFormat: '',          // 诉讼费
                summitFeeTime: '',          // 缴费时间
                registerNotice: '',         // 立案通知书
                summitFeeNotice: '',        // 缴费通知书
                remark: '',                 // 备注
                annexUrl: [],               // 附件
            },
            beforeTrial: {                  // 庭前
                courtTime: '',              // 开庭时间
                courtAddress: '',           // 庭审地点
                dealGownsmanContact: '',    // 主审法官及联系方式
                takeNoteManContact: '',     // 书记员及联系方式
                defendantContact: '',       // 被告联系方式
                citation: '',               // 传票
                statement: '',              // 代理词
                remark: '',                 // 备注
                annexUrl: [],               // 附件
            },
            courtTrial: {                   // 庭审
                isOnCourt: '',              // 是否到庭
                defendantContact: '',       // 被告联系方式
                startCourtReport: '',       // 开庭报告
                remark: '',                 // 备注
                annexUrl: [],               // 附件
            },
            judgment: {                     // 判决
                accptTime: '',              // 判决时间
                judgmentFeeFormat: '',      // 判决金额
                judgmentText: '',           // 判决书
                remark: '',                 // 备注
                annexUrl: [],               // 附件
            },
            adjudicate: {                   // 结案
                closeCaseWay: '',           // 结案方式
                finalFeeFormat: '',         // 最终赔偿金额
                finalFeeStr: '',            // 赔偿金到额情况
                backFeeFormat: '',          // 诉讼退费
                backFeeStr: '',             // 诉讼退费到款情况
                closeCaseText: '',          // 结案文书
            },
            backReason: '',                 // 驳回理由
            visibleReason: false,           // 驳回理由弹窗控制
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.process !== this.props.process) {
            let { forensics, suitPlan, caseInfo, beforeTrial, courtTrial, judgment, adjudicate } = this.state;
            if (nextProps.process) {
                let { suitCaseDetail } = this.props;
                if (nextProps.process.lawyerObtainEvidenceDOList) {
                    for (let i = 0; i < nextProps.process.lawyerObtainEvidenceDOList.length; i++) {
                        const element = nextProps.process.lawyerObtainEvidenceDOList[i];
                        forensics[i] = Object.assign({}, element);
                    }
                }
                this.setState({
                    forensics: forensics,
                    suitPlan: Object.assign({}, suitPlan, nextProps.process.lawyerSuitCaseDO),
                    caseInfo: Object.assign({}, caseInfo, nextProps.process.lawyerRegisterDO),
                    beforeTrial: Object.assign({}, beforeTrial, nextProps.process.lawyerBeforeCourtDO),
                    courtTrial: Object.assign({}, courtTrial, nextProps.process.lawyerOnCourtDO),
                    judgment: Object.assign({}, judgment, nextProps.process.lawyerJudgmentDO),
                    adjudicate: Object.assign({}, adjudicate, nextProps.process.lawyerCloseCaseDO),
                    editKey: suitCaseDetail.status > 8 ? 9 : suitCaseDetail.status + 1
                })
            }
        }
    }


    // 改变process进度
    changeProcess(key) {
        this.setState({
            editKey: key,
            isRead: false
        })
    }

    renderForensics(data) {
        // 取证
        let { intl } = this.props;
        return (
            <div className="search-form form" >
                <div className="process-title">
                    <FormattedMessage id="ligiation.detail.obtain.evidence" defaultMessage="取证" />
                </div>
                {
                    data
                        ? data.map((item, index) => (
                            <div className="search-form form forensics" key={index}>
                                <FormItem
                                    required
                                    label={intl.formatMessage({ id: 'ligiation.detail.notarization.number', defaultMessage: '公证书号' })}
                                >
                                    {
                                        item.notarizationNum || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                                <FormItem
                                    required
                                    label={intl.formatMessage({ id: 'ligiation.detail.notary.office', defaultMessage: '公证机构' })}
                                >
                                    {
                                        item.notarizationOffice || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                                <FormItem
                                    required
                                    label={intl.formatMessage({ id: 'ligiation.detail.evidence.collection', defaultMessage: '取证地点' })}
                                >
                                    {
                                        item.evidenceAddress || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.evidence.time', defaultMessage: '取证时间' })}>
                                    {
                                        item.evidenceTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                                <FormItem
                                    required
                                    label={intl.formatMessage({ id: 'ligiation.detail.notary.expenses', defaultMessage: '公证费用' })}
                                >
                                    {
                                        item.notarizationFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                                <FormItem
                                    required
                                    label={intl.formatMessage({ id: 'ligiation.detail.other.expenses', defaultMessage: '其他费用' })}
                                >
                                    {
                                        item.otherFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.authentic.act', defaultMessage: '公证书' })}>
                                    {
                                        item.notarizationStr.length ? 
                                            <FileListComponent fileList={item.notarizationStr} /> 
                                            : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.notarization.invoice', defaultMessage: '公证费发票' })}>
                                    {
                                        item.notarizationInvoice.length ? 
                                            <FileListComponent fileList={item.notarizationInvoice} /> 
                                            : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                            </div>
                        ))
                        : ''
                }
                {
                    data[0].remark || (data[0].annexUrl && data[0].annexUrl.length )
                        ? (
                            <div className='additional'>
                                <div className="process-title">
                                    <FormattedMessage id='ligiation.additional.information' defaultMessage='追加信息' />
                                </div>
                                <FormItem label={intl.formatMessage({ id: 'report.note', defaultMessage: '备注' })}>
                                    {
                                        <p style={{ whiteSpace: 'pre-wrap' }} >{data[0].remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        data[0].annexUrl ? <FileListComponent fileList={data[0].annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                            </div>
                        )
                        : ''
                }
                {
                    data[0].backReason
                        ? <FormItem label={intl.formatMessage({ id: 'ligiation.reasons.for.rejection', defaultMessage: '驳回理由' })}> <span style={{ color: 'red' }}>{data[0].backReason}</span></FormItem>
                        : ''
                }
            </div >
        )
    }

    renderPlan(data) {
        // 诉讼方案
        let { defendantName, caseReason, suitObject, dealCourt, suitText, authCertificate, evidenceIndex, remark, annexUrl } = data;
        let { intl } = this.props;
        return (
            <div className="search-form form suit-case">
                <div className="process-title">
                    <FormattedMessage id="ligiation.detail.litigation.plan" defaultMessage="诉讼方案" />
                </div>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.the.other.party', defaultMessage: '对方当事人' })}
                >
                    {
                        defendantName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.the.cause.of.action', defaultMessage: '案由' })}
                >
                    {
                        caseReason || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.object.of.litigation', defaultMessage: '诉讼标的' })}
                >

                    {
                        suitObject || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.court.of.jurisdiction', defaultMessage: '管辖法院' })}
                >
                    {
                        dealCourt || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.indictment', defaultMessage: '起诉状' })}
                >
                    {
                        suitText.length ? <FileListComponent fileList={suitText} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.certificate.of.authorization', defaultMessage: '授权书' })}
                >
                    {
                        authCertificate.length ? <FileListComponent fileList={authCertificate} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.evidence.catalogue', defaultMessage: '证据目录' })}>
                    {
                        evidenceIndex.length ? <FileListComponent fileList={evidenceIndex} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                {
                    remark || (annexUrl && annexUrl.length)
                        ? (
                            <div className='additional'>
                                <div className="process-title">
                                    <FormattedMessage id='ligiation.additional.information' defaultMessage='追加信息' />
                                </div>
                                <FormItem label={intl.formatMessage({ id: 'report.note', defaultMessage: '备注' })}>
                                    {
                                        <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        annexUrl ? <FileListComponent fileList={data.annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                            </div>
                        )
                        : ''
                }
                {
                    data.backReason
                        ? <FormItem label={intl.formatMessage({ id: 'ligiation.reasons.for.rejection', defaultMessage: '驳回理由' })}> <span style={{ color: 'red' }}>{data.backReason}</span></FormItem>
                        : ''
                }
            </div>
        )
    }

    renderCase(data) {
        // 立案
        let { caseNum, registerTime, dealGownsman, suitFeeFormat, summitFeeTime, registerNotice, summitFeeNotice, remark, annexUrl } = data;
        let { intl } = this.props;
        return (
            <div className="search-form form suit-case">
                <div className="process-title">
                    <FormattedMessage id="ligiation.detail.filing" defaultMessage="立案" />
                </div>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.case.number', defaultMessage: '案号' })}
                >
                    {
                        caseNum || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.filing.time', defaultMessage: '立案时间' })}
                >
                    {
                        registerTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.trial.judge', defaultMessage: '审理法官' })}
                >
                    {
                        dealGownsman || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.litigation.costs', defaultMessage: '诉讼费' })}
                >
                    {
                        suitFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.payment.time', defaultMessage: '缴费时间' })}>
                    {
                        summitFeeTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.notice.of.filing', defaultMessage: '立案通知书' })}
                >
                    {
                        registerNotice.length ? <FileListComponent fileList={registerNotice} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.payment.instructions', defaultMessage: '缴费通知书' })}
                >
                    {
                        summitFeeNotice.length ? <FileListComponent fileList={summitFeeNotice} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                {
                    remark || (annexUrl && annexUrl.length)
                        ? (
                            <div className='additional'>
                                <div className="process-title">
                                    <FormattedMessage id='ligiation.additional.information' defaultMessage='追加信息' />
                                </div>
                                <FormItem label={intl.formatMessage({ id: 'report.note', defaultMessage: '备注' })}>
                                    {
                                        <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        annexUrl ? <FileListComponent fileList={data.annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                            </div>
                        )
                        : ''
                }
                {
                    data.backReason
                        ? <FormItem label={intl.formatMessage({ id: 'ligiation.reasons.for.rejection', defaultMessage: '驳回理由' })}> <span style={{ color: 'red' }}>{data.backReason}</span></FormItem>
                        : ''
                }
            </div>
        )
    }

    renderBeforeTrial(data) {
        // 庭前
        let { courtTime, courtAddress, dealGownsmanContact, takeNoteManContact, defendantContact, citation, statement, remark, annexUrl } = data;
        let { intl } = this.props;
        return (
            <div className="search-form form suit-case">
                <div className="process-title">
                    <FormattedMessage id="ligiation.detail.pretrial" defaultMessage="庭前" />
                </div>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.court.time', defaultMessage: '开庭时间' })}
                >
                    {
                        courtTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.place.of.trial', defaultMessage: '庭审地点' })}
                >
                    {
                        courtAddress || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.presiding.judge', defaultMessage: '主审法官及联系方式' })}>
                    {
                        dealGownsmanContact || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.clerk.and.contact.information', defaultMessage: '书记员及联系方式' })}>
                    {
                        takeNoteManContact || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.defendant', defaultMessage: '被告联系方式' })}
                >
                    {
                        defendantContact || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.summons', defaultMessage: '传票' })}
                >
                    {
                        citation.length ? <FileListComponent fileList={citation} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.statement.procurator', defaultMessage: '代理词' })}>
                    {
                        statement.length ? <FileListComponent fileList={statement} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                {
                    remark || (annexUrl && annexUrl.length)
                        ? (
                            <div className='additional'>
                                <div className="process-title">
                                    <FormattedMessage id='ligiation.additional.information' defaultMessage='追加信息' />
                                </div>
                                <FormItem label={intl.formatMessage({ id: 'report.note', defaultMessage: '备注' })}>
                                    {
                                        <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        annexUrl ? <FileListComponent fileList={data.annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                            </div>
                        )
                        : ''
                }
                {
                    data.backReason
                        ? <FormItem label={intl.formatMessage({ id: 'ligiation.reasons.for.rejection', defaultMessage: '驳回理由' })}> <span style={{ color: 'red' }}>{data.backReason}</span></FormItem>
                        : ''
                }
            </div>
        )
    }

    renderCourtTrial(data) {
        // 庭审
        let { isOnCourt, defendantContact, startCourtReport, remark, annexUrl } = data;
        let { intl } = this.props;
        return (
            <div className="search-form form suit-case">
                <div className="process-title">
                    <FormattedMessage id="ligiation.detail.court.trial" defaultMessage="庭审" />
                </div>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.is.the.defendant', defaultMessage: '被告是否到庭' })}
                >
                    {
                        isOnCourt === 0 ? '是' : '否'
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.defendant.concat', defaultMessage: '被告联系方式' })}
                >
                    {
                        defendantContact || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.court.report', defaultMessage: '开庭报告' })}
                >
                    {
                        <p style={{ whiteSpace: 'pre-wrap' }}>{startCourtReport || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                    }
                </FormItem>
                {
                    remark || (annexUrl && annexUrl.length)
                        ? (
                            <div className='additional'>
                                <div className="process-title">
                                    <FormattedMessage id='ligiation.additional.information' defaultMessage='追加信息' />
                                </div>
                                <FormItem label={intl.formatMessage({ id: 'report.note', defaultMessage: '备注' })}>
                                    {
                                        <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        annexUrl ? <FileListComponent fileList={data.annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                            </div>
                        )
                        : ''
                }
                {
                    data.backReason
                        ? <FormItem label={intl.formatMessage({ id: 'ligiation.reasons.for.rejection', defaultMessage: '驳回理由' })}> <span style={{ color: 'red' }}>{data.backReason}</span></FormItem>
                        : ''
                }
            </div>
        )
    }

    renderJudgment(data) {
        // 判决
        let { accptTime, judgmentFeeFormat, judgmentText, remark, annexUrl } = data;
        let { intl } = this.props;
        return (
            <div className="search-form form suit-case">
                <div className="process-title">
                    <FormattedMessage id="ligiation.detail.sentence" defaultMessage="判决" />
                </div>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.receipt.time', defaultMessage: '判决书收到时间' })}
                >
                    {
                        accptTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.receipt.amount', defaultMessage: '判决金额' })}
                >
                    {
                        judgmentFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.receipt.book', defaultMessage: '判决书' })}
                >
                    {
                        judgmentText.length ? <FileListComponent fileList={judgmentText} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                {
                    remark || (annexUrl && annexUrl.length)
                        ? (
                            <div className='additional'>
                                <div className="process-title">
                                    <FormattedMessage id='ligiation.additional.information' defaultMessage='追加信息' />
                                </div>
                                <FormItem label={intl.formatMessage({ id: 'report.note', defaultMessage: '备注' })}>
                                    {
                                        <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        annexUrl ? <FileListComponent fileList={data.annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                    }
                                </FormItem>
                            </div>
                        )
                        : ''
                }
                {
                    data.backReason
                        ? <FormItem label={intl.formatMessage({ id: 'ligiation.reasons.for.rejection', defaultMessage: '驳回理由' })}> <span style={{ color: 'red' }}>{data.backReason}</span></FormItem>
                        : ''
                }
            </div>
        )
    }

    renderAdjudicate(data) {
        // 结案
        let { finalFeeFormat, finalFeeStr, backFeeFormat, backFeeStr, closeCaseText, closeCaseWayName, closeCaseWayNameEn } = data;
        let { intl } = this.props;
        return (
            <div className="search-form form suit-case">
                <div className="process-title">
                    <FormattedMessage id="ligiation.detail.closing.a.case" defaultMessage="结案" />
                </div>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.closing.method', defaultMessage: '结案方式' })}
                >
                    {
                        (intl.locale === 'en' ? closeCaseWayNameEn : closeCaseWayName) || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.final.compensation.amount', defaultMessage: '最终赔偿金额' })}
                >
                    {
                        finalFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'ligiation.detail.achievement.compensation', defaultMessage: '赔偿金额到额情况' })}
                >
                    {
                        finalFeeStr || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.litigation.refund', defaultMessage: '诉讼退费' })}
                >
                    {
                        backFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.refunds', defaultMessage: '诉讼退费到款情况' })}>
                    {
                        backFeeStr || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.closing.document', defaultMessage: '结案文书' })}
                >
                    {
                        closeCaseText.length ? <FileListComponent fileList={closeCaseText} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                    }
                </FormItem>
                {
                    data.backReason
                        ? <FormItem label={intl.formatMessage({ id: 'ligiation.reasons.for.rejection', defaultMessage: '驳回理由' })}> <span style={{ color: 'red' }}>{data.backReason}</span></FormItem>
                        : ''
                }
            </div>
        )
    }

    renderStatus(key, processStatus, processKey) {
        let { process, suitCaseDetail } = this.props;
        if (key === 'status') {
            if (suitCaseDetail.status >= 2 && suitCaseDetail.status <= 11) {
                if (suitCaseDetail.status >= processStatus) {
                    if (process[processKey]) {
                        if (processKey === 'lawyerObtainEvidenceDOList') {
                            if (process[processKey][0]) {
                                if (process[processKey][0].status === 2) {
                                    return 'process'
                                } else if (process[processKey][0].status === 1) {
                                    return 'wait'
                                } else if (process[processKey][0].status === 3) {
                                    return 'finish'
                                } else if (process[processKey][0].status === 4) {
                                    return 'error'
                                }
                            }
                        } else {
                            if (process[processKey].status === 2) {
                                return 'process'
                            } else if (process[processKey].status === 1) {
                                return 'wait'
                            } else if (process[processKey].status === 3) {
                                return 'finish'
                            } else if (process[processKey].status === 4) {
                                return 'error'
                            }
                        }
                    } else {
                        return 'wait'
                    }
                }
            }
        } else {
            if (process[processKey]) {
                if (processKey === 'lawyerObtainEvidenceDOList') {
                    if (process[processKey][0]) {
                        if (process[processKey][0].status === 2) {
                            return <span className='step-process submit'>（<Icon type="clock-circle" /><FormattedMessage id="ligiation.submitted" defaultMessage="已提交" />）</span>
                        } else if (process[processKey][0].status === 1) {
                            return <span className='step-process storage'>（<Icon type="download" /><FormattedMessage id="ligiation.committed" defaultMessage="已暂存" />）</span>
                        } else if (process[processKey][0].status === 3) {
                            return <span className='step-process pass'>（<Icon type="check" /><FormattedMessage id="ligiation.passed" defaultMessage="已通过" />）</span>
                        } else if (process[processKey][0].status === 4) {
                            return <span className='step-process close'>（<Icon type="close" /><FormattedMessage id="ligiation.rejected" defaultMessage="已驳回" />）</span>
                        }
                    }
                } else {
                    if (process[processKey].status === 2) {
                        return <span className='step-process submit'>（<Icon type="clock-circle" /><FormattedMessage id="ligiation.submitted" defaultMessage="已提交" />）</span>
                    } else if (process[processKey].status === 1) {
                        return <span className='step-process storage'>（<Icon type="download" /><FormattedMessage id="ligiation.committed" defaultMessage="已暂存" />）</span>
                    } else if (process[processKey].status === 3) {
                        return <span className='step-process pass'>（<Icon type="check" /><FormattedMessage id="ligiation.passed" defaultMessage="已通过" />）</span>
                    } else if (process[processKey].status === 4) {
                        return <span className='step-process close'>（<Icon type="close" /><FormattedMessage id="ligiation.rejected" defaultMessage="已驳回" />）</span>
                    }
                }
            }
        }
    }

    render() {
        let { process } = this.props;
        let { editKey, forensics, suitPlan, caseInfo, beforeTrial, courtTrial, judgment, adjudicate, backReason, visibleReason } = this.state;
        return (
            <div className='process'>
                <div className='step-wrap'>
                    <Steps progressDot direction="vertical">
                        <Step
                            className={editKey === 3 ? 'step-active' : ''}
                            title={<span className='link-button' onClick={() => this.changeProcess(3)}><FormattedMessage id="ligiation.detail.obtain.evidence" defaultMessage="取证" />{process ? this.renderStatus('desc', 2, 'lawyerObtainEvidenceDOList') : ''}</span>}
                            status={process ? this.renderStatus('status', 2, 'lawyerObtainEvidenceDOList') : 'wait'}
                        />
                        <Step
                            className={editKey === 4 ? 'step-active' : ''}
                            title={<span className='link-button' onClick={() => this.changeProcess(4)}><FormattedMessage id="ligiation.detail.litigation.plan" defaultMessage="诉讼方案" />{process ? this.renderStatus('desc', 3, 'lawyerSuitCaseDO') : ''}</span>}
                            status={process ? this.renderStatus('status', 3, 'lawyerSuitCaseDO') : 'wait'}
                        />
                        <Step
                            className={editKey === 5 ? 'step-active' : ''}
                            title={<span className='link-button' onClick={() => this.changeProcess(5)}><FormattedMessage id="ligiation.detail.filing" defaultMessage="立案" />{process ? this.renderStatus('desc', 4, 'lawyerRegisterDO') : ''}</span>}
                            status={process ? this.renderStatus('status', 4, 'lawyerRegisterDO') : 'wait'}
                        />
                        <Step
                            className={editKey === 6 ? 'step-active' : ''}
                            title={<span className='link-button' onClick={() => this.changeProcess(6)}><FormattedMessage id="ligiation.detail.pretrial" defaultMessage="庭前" />{process ? this.renderStatus('desc', 5, 'lawyerBeforeCourtDO') : ''}</span>}
                            status={process ? this.renderStatus('status', 5, 'lawyerBeforeCourtDO') : 'wait'}
                        />
                        <Step
                            className={editKey === 7 ? 'step-active' : ''}
                            title={<span className='link-button' onClick={() => this.changeProcess(7)}><FormattedMessage id="ligiation.detail.court.trial" defaultMessage="庭审" />{process ? this.renderStatus('desc', 6, 'lawyerOnCourtDO') : ''}</span>}
                            status={process ? this.renderStatus('status', 6, 'lawyerOnCourtDO') : 'wait'}
                        />
                        <Step
                            className={editKey === 8 ? 'step-active' : ''}
                            title={<span className='link-button' onClick={() => this.changeProcess(8)}><FormattedMessage id="ligiation.detail.sentence" defaultMessage="判决" />{process ? this.renderStatus('desc', 7, 'lawyerJudgmentDO') : ''}</span>}
                            status={process ? this.renderStatus('status', 7, 'lawyerJudgmentDO') : 'wait'}
                        />
                        <Step
                            className={editKey === 9 ? 'step-active' : ''}
                            title={<span className='link-button' onClick={() => this.changeProcess(9)}><FormattedMessage id="ligiation.detail.closing.a.case" defaultMessage="结案" />{process ? this.renderStatus('desc', 8, 'lawyerCloseCaseDO') : ''}</span>}
                            status={process ? this.renderStatus('status', 8, 'lawyerCloseCaseDO') : 'wait'}
                        />
                    </Steps>
                </div>
                <div className="step-info">
                    <div className="step-inner">
                        {
                            editKey === 3
                                ? this.renderForensics(forensics)
                                : ''
                        }
                        {
                            editKey === 4
                                ? this.renderPlan(suitPlan)
                                : ''
                        }
                        {
                            editKey === 5
                                ? this.renderCase(caseInfo)
                                : ''
                        }
                        {
                            editKey === 6
                                ? this.renderBeforeTrial(beforeTrial)
                                : ''
                        }
                        {
                            editKey === 7
                                ? this.renderCourtTrial(courtTrial)
                                : ''
                        }
                        {
                            editKey === 8
                                ? this.renderJudgment(judgment)
                                : ''
                        }
                        {
                            editKey === 9
                                ? this.renderAdjudicate(adjudicate)
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default injectIntl(Process)
