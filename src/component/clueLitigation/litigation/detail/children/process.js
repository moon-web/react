import React, { Component } from 'react'
import { Select, Button, Input, Radio, Form, Steps, Upload, DatePicker, message, Icon, Modal } from 'antd'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment';
import FileListComponent from '../../../../common/upload/flieList'
import InputNumber from '../../../../common/form/numberInput'
import Req from '../../../../../api/req'
import { getName } from '../../../../../utils/util'
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
        this.uploadConfig = {
            action: Req.uploadFile,
            beforeUpload: file => this.beforeUpload(file),
            name: "file",
            withCredentials: true
        }
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

    // 提交保存数据
    updateProcessDetailStatus(status, saveFlag) {
        // status  3 通过，4 驳回, saveFlag: 0通过, 1 驳回 
        let { editKey, forensics, suitPlan, caseInfo, beforeTrial, courtTrial, judgment, adjudicate, backReason } = this.state;
        let { updateProcessDetailStatus, suitId, process, ligiationStatus, suitCaseDetail, litigationCloseCaseWay, ligitaionList, intl } = this.props;
        let data = {
            processType: editKey,
            suitId: suitId,
            status: status,
            saveFlag: saveFlag,

        };
        if (status === 4) {
            data.backReason = backReason
        }
        if (editKey === 3) {
            for (let i = 0; i < forensics.length; i++) {
                const element = forensics[i];
                if (!element.notarizationNum) {
                    message.info(intl.formatMessage({ id: 'ligiation.detail.please.enter.notarization.number', defaultMessage: '请输入公证书号' }));
                    return;
                } else if (!element.notarizationOffice) {
                    message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.notary.office', defaultMessage: '请输入公证机构' }));
                    return;
                } else if (!element.evidenceAddress) {
                    message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.evidence.collection', defaultMessage: '请输入取证地点' }));
                    return;
                } else if (!element.notarizationFeeFormat) {
                    message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.notary.expenses', defaultMessage: '请输入公证费用' }));
                    return;
                } else if (!element.otherFeeFormat) {
                    message.info(intl.formatMessage({ id: 'ligiation.detail.enter.other.expenses', defaultMessage: '请输入其他费用' }));
                    return;
                }
                element.backReason = ''
            }
            data.processJson = JSON.stringify(forensics);
        } else if (editKey === 4) {
            if (!suitPlan.defendantName) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.other.party', defaultMessage: '请输入对方当事人' }));
                return;
            } else if (!suitPlan.caseReason) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.cause.of.action', defaultMessage: '请输入案由' }));
                return;
            } else if (!suitPlan.suitObject) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.object.of.litigation', defaultMessage: '请输入诉讼标的' }));
                return;
            } else if (!suitPlan.dealCourt) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.court.of.jurisdiction', defaultMessage: '请输入管辖法院' }));
                return;
            } else if (!suitPlan.suitText.length) {
                message.info(intl.formatMessage({ id: 'ligiation.please.upload.the.indictment', defaultMessage: '请上传起诉状' }));
                return;
            } else if (!suitPlan.authCertificate.length) {
                message.info(intl.formatMessage({ id: 'ligiation.please.upload.the.authorization.form', defaultMessage: '请上传授权书' }));
                return;
            }
            suitPlan.backReason = ''
            data.processJson = JSON.stringify(suitPlan);
        } else if (editKey === 5) {
            if (!caseInfo.caseNum) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.case.number', defaultMessage: '请输入案号' }));
                return;
            } else if (!caseInfo.registerTime) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.choose.filingtime', defaultMessage: '请选择立案时间' }));
                return;
            } else if (!caseInfo.dealGownsman) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.trial.judge', defaultMessage: '请输入审理法官' }));
                return;
            } else if (!caseInfo.suitFeeFormat) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.litigation.costs', defaultMessage: '请输入诉讼费' }));
                return;
            } else if (!caseInfo.registerNotice.length) {
                message.info(intl.formatMessage({ id: 'ligiation.please.upload.the.notice.of.filing', defaultMessage: '请上传立案通知书' }));
                return;
            } else if (!caseInfo.summitFeeNotice.length) {
                message.info(intl.formatMessage({ id: 'ligiation.please.upload.the.demand.note', defaultMessage: '请上传缴费通知书' }));
                return;
            }
            caseInfo.backReason = ''
            data.processJson = JSON.stringify(caseInfo);
        } else if (editKey === 6) {
            if (!beforeTrial.courtTime) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.choose.court.time', defaultMessage: '请选择开庭时间' }));
                return;
            } else if (!beforeTrial.courtAddress) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.place.of.trial', defaultMessage: '请输入庭审地点' }));
                return;
            } else if (!beforeTrial.defendantContact) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.defendant', defaultMessage: '请输入被告联系方式' }));
                return;
            } else if (!beforeTrial.citation.length) {
                message.info(intl.formatMessage({ id: 'ligiation.please.upload.the.summons', defaultMessage: '请上传传票' }));
                return;
            }
            beforeTrial.backReason = ''
            data.processJson = JSON.stringify(beforeTrial);
        } else if (editKey === 7) {
            if (courtTrial.isOnCourt === '' || courtTrial.isOnCourt === undefined) {
                message.info(intl.formatMessage({ id: 'ligiation.please.choose.whether.to.attend.court.or.not', defaultMessage: '请选择是否到庭' }));
                return;
            } else if (!courtTrial.defendantContact) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.the.defendant', defaultMessage: '请输入被告联系方式' }));
                return;
            } else if (!courtTrial.startCourtReport.length) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.court.report', defaultMessage: '请输入开庭报告' }));
                return;
            }
            courtTrial.backReason = ''
            data.processJson = JSON.stringify(courtTrial);
        } else if (editKey === 8) {
            if (!judgment.accptTime) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.choose.receipt.time', defaultMessage: '请选择判决书收到时间' }));
                return;
            } else if (!judgment.judgmentFeeFormat) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.receipt.amount', defaultMessage: '请输入判决金额' }));
                return;
            } else if (!judgment.judgmentText.length) {
                message.info(intl.formatMessage({ id: 'ligiation.please.upload.the.judgment', defaultMessage: '请上传判决书' }));
                return;
            }
            judgment.backReason = ''
            data.processJson = JSON.stringify(judgment);
        } else if (editKey === 9) {
            if (!adjudicate.closeCaseWay) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.please.choose.closing.method', defaultMessage: '请选择结案方式' }));
                return;
            } else if (!adjudicate.finalFeeFormat) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.final.compensation.amount', defaultMessage: '请输入赔偿金额' }));
                return;
            } else if (!adjudicate.backFeeFormat) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.litigation.refund', defaultMessage: '请输入诉讼退费' }));
                return;
            } else if (!adjudicate.backFeeStr) {
                message.info(intl.formatMessage({ id: 'ligiation.detail.enter.refunds', defaultMessage: '请输入诉讼退费到款情况' }));
                return;
            } else if (!adjudicate.closeCaseText.length) {
                message.info(intl.formatMessage({ id: 'ligiation.please.upload.the.closing.paperwork', defaultMessage: '请上传结案文书' }));
                return;
            }
            adjudicate.backReason = ''
            let result = getName(litigationCloseCaseWay, adjudicate.closeCaseWay);
            adjudicate.closeCaseWayName = result.dictLabel;
            adjudicate.closeCaseWayNameEn = result.dictLabelEn;
            data.processJson = JSON.stringify(adjudicate);
        }
        if (updateProcessDetailStatus) {
            updateProcessDetailStatus(data, process, suitCaseDetail, ligiationStatus, ligitaionList)
        }
    }

    // 上传文件前检测文件大小
    beforeUpload(file) {
        if ((file.size / 1024 / 1024) >= 10) {
            message.info('上传文件过大');
            this.uid = file.uid;
            return false;
        }
    }

    // 上传图片
    uploadChange({ fileList }, key, index) {
        let newImges = fileList;
        if (this.uid) {
            newImges = fileList.filter(item => {
                return item.uid !== this.uid;
            })
        }
        for (let i = 0; i < newImges.length; i++) {
            const element = newImges[i];
            if (element.status === 'done') {
                element.url = element.response.dataObject;
            }
        }
        this.changeState(key, newImges, index)
    }

    // 改变process进度
    changeProcess(key) {
        this.setState({
            editKey: key,
            isRead: false
        })
    }

    // 改变页面state数据
    changeState(key, value, index) {
        let { forensics, suitPlan, caseInfo, beforeTrial, courtTrial, judgment, adjudicate } = this.state;
        let result = key.split('.');
        key = result[1];
        let parent = result[0],
            temp = {};
        if (parent === 'forensics') {
            forensics[index][key] = value;
            temp = forensics;
        } else if (parent === 'suitPlan') {
            suitPlan[key] = value;
            temp = suitPlan;
        } else if (parent === 'caseInfo') {
            caseInfo[key] = value;
            temp = caseInfo;
        } else if (parent === 'beforeTrial') {
            beforeTrial[key] = value;
            temp = beforeTrial;
        } else if (parent === 'courtTrial') {
            courtTrial[key] = value;
            temp = courtTrial;
        } else if (parent === 'judgment') {
            judgment[key] = value;
            temp = judgment;
        } else if (parent === 'adjudicate') {
            adjudicate[key] = value;
            temp = adjudicate;
        }
        this.setState({
            [parent]: temp
        })
    }

    confirmBack() {
        let { backReason } = this.state;
        let { intl } = this.props;
        if (!backReason) {
            message.info(intl.formatMessage({ id: 'ligiation.please.enter.your.reasons.for.rejection', defaultMessage: '请输入驳回理由' }));
            return;
        }
        this.setState({
            visibleReason: false
        })
        this.updateProcessDetailStatus(4, 1)
    }

    // 新增取证信息
    addForensics() {
        let { forensics } = this.state;
        forensics.push({
            notarizationNum: '',        // 公证书号
            notarizationOffice: '',     // 公证机构
            evidenceAddress: '',        // 取证地点
            evidenceTime: '',           // 公证时间
            notarizationFeeFormat: '',        // 公证费用
            otherFeeFormat: '',               // 其他费用
            notarizationStr: [],        // 公证书
            notarizationInvoice: [],    // 公证费发票
        })
        this.setState({
            forensics
        })
    }

    // 根据当前状态判断是否禁用按钮  输入框
    isDisabled(current, subStatus) {
        let { suitCaseDetail } = this.props;
        if (suitCaseDetail.status >= 2 && suitCaseDetail.status <= 11) {
            if (suitCaseDetail.status > current) {
                return true;
            } else {
                if (!subStatus || (subStatus && subStatus !== 2)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
    renderForensics(data) {
        // 取证
        let { suitCaseDetail, intl } = this.props;
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
                                        this.isDisabled(2, data[0].status)
                                            ? item.notarizationNum || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : (
                                                <Input
                                                    value={item.notarizationNum}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.please.enter.notarization.number', defaultMessage: '请输入公证书号' })}
                                                    disabled={this.isDisabled(2, data[0].status)}
                                                    onChange={e => this.changeState('forensics.notarizationNum', e.target.value, index)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    required
                                    label={intl.formatMessage({ id: 'ligiation.detail.notary.office', defaultMessage: '公证机构' })}
                                >
                                    {
                                        this.isDisabled(2, data[0].status)
                                            ? item.notarizationOffice || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : (
                                                <Input
                                                    value={item.notarizationOffice}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.notary.office', defaultMessage: '请输入公证机构' })}
                                                    disabled={this.isDisabled(2, data[0].status)}
                                                    onChange={e => this.changeState('forensics.notarizationOffice', e.target.value, index)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    required
                                    label={intl.formatMessage({ id: 'ligiation.detail.evidence.collection', defaultMessage: '取证地点' })}
                                >
                                    {
                                        this.isDisabled(2, data[0].status)
                                            ? item.evidenceAddress || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : (
                                                <Input
                                                    value={item.evidenceAddress}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.evidence.collection', defaultMessage: '请输入取证地点' })}
                                                    disabled={this.isDisabled(2, data[0].status)}
                                                    onChange={e => this.changeState('forensics.evidenceAddress', e.target.value, index)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.evidence.time', defaultMessage: '取证时间' })}>
                                    {
                                        this.isDisabled(2, data[0].status)
                                            ? item.evidenceTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : (
                                                <DatePicker
                                                    value={item.evidenceTime ? moment(item.evidenceTime, 'YYYY-MM-DD') : null}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.choose.evidence.time', defaultMessage: '请选择取证时间' })}
                                                    disabled={this.isDisabled(2, data[0].status)}
                                                    onChange={(date, dateStr) => this.changeState('forensics.evidenceTime', dateStr, index)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    required
                                    label={intl.formatMessage({ id: 'ligiation.detail.notary.expenses', defaultMessage: '公证费用' })}
                                >
                                    {
                                        this.isDisabled(2, data[0].status)
                                            ? item.notarizationFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : (
                                                <InputNumber
                                                    value={item.notarizationFeeFormat}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.notary.expenses', defaultMessage: '请输入公证费用' })}
                                                    disabled={this.isDisabled(2, data[0].status)}
                                                    onChange={val => this.changeState('forensics.notarizationFeeFormat', val, index)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem
                                    required
                                    label={intl.formatMessage({ id: 'ligiation.detail.other.expenses', defaultMessage: '其他费用' })}
                                >
                                    {
                                        this.isDisabled(2, data[0].status)
                                            ? item.otherFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : (
                                                <InputNumber
                                                    value={item.otherFeeFormat}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.other.expenses', defaultMessage: '请输入其他费用' })}
                                                    disabled={this.isDisabled(2, data[0].status)}
                                                    onChange={val => this.changeState('forensics.otherFeeFormat', val, index)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.authentic.act', defaultMessage: '公证书' })}>
                                    {
                                        this.isDisabled(2, data[0].status)
                                            ? item.notarizationStr.length ? <FileListComponent fileList={item.notarizationStr} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : <Upload
                                                fileList={item.notarizationStr}
                                                {...this.uploadConfig}
                                                onChange={file => this.uploadChange(file, 'forensics.notarizationStr', index)}
                                            >
                                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                            </Upload>
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.notarization.invoice', defaultMessage: '公证费发票' })}>
                                    {
                                        this.isDisabled(2, data[0].status)
                                            ? item.notarizationInvoice.length ? <FileListComponent fileList={item.notarizationInvoice} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : <Upload
                                                fileList={item.notarizationInvoice}
                                                {...this.uploadConfig}
                                                onChange={file => this.uploadChange(file, 'forensics.notarizationInvoice', index)}
                                            >
                                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                            </Upload>
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
                                        this.isDisabled(2, data[0].status)
                                            ? <p style={{ whiteSpace: 'pre-wrap' }} >{data[0].remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                            : (
                                                <TextArea
                                                    autosize={false}
                                                    value={data[0].remark}
                                                    placeholder={intl.formatMessage({ id: 'report.please.enter.note', defaultMessage: '请输入备注信息' })}
                                                    disabled={this.isDisabled(2, data[0].status)}
                                                    onChange={e => this.changeState('forensics.remark', e.target.value, 0)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        this.isDisabled(2, data[0].status)
                                            ? data[0].annexUrl ? <FileListComponent fileList={data[0].annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : <Upload
                                                fileList={data[0].annexUrl}
                                                {...this.uploadConfig}
                                                onChange={file => this.uploadChange(file, 'forensics.annexUrl', 0)}
                                            >
                                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                            </Upload>
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
                {
                    this.isDisabled(2, data[0].status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.updateProcessDetailStatus(3, 0)} ><FormattedMessage id="global.pass" defaultMessage="通过" /></Button>
                                <Button onClick={() => this.setState({ visibleReason: true, backReason: '' })}><FormattedMessage id="global.reject" defaultMessage="驳回" /></Button>
                            </div>
                        )
                }
            </div >
        )
    }

    renderPlan(data) {
        // 诉讼方案
        let { defendantName, caseReason, suitObject, dealCourt, suitText, authCertificate, evidenceIndex, remark, annexUrl } = data;
        let { suitCaseDetail, intl } = this.props;
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
                        this.isDisabled(3, data.status)
                            ? defendantName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={defendantName}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.other.party', defaultMessage: '请输入对方当事人' })}
                                    disabled={this.isDisabled(3, data.status)}
                                    onChange={e => this.changeState('suitPlan.defendantName', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.the.cause.of.action', defaultMessage: '案由' })}
                >
                    {
                        this.isDisabled(3, data.status)
                            ? caseReason || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={caseReason}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.cause.of.action', defaultMessage: '请输入案由' })}
                                    disabled={this.isDisabled(3, data.status)}
                                    onChange={e => this.changeState('suitPlan.caseReason', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.object.of.litigation', defaultMessage: '诉讼标的' })}
                >

                    {
                        this.isDisabled(3, data.status)
                            ? suitObject || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={suitObject}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.object.of.litigation', defaultMessage: '请输入诉讼标的' })}
                                    disabled={this.isDisabled(3, data.status)}
                                    onChange={e => this.changeState('suitPlan.suitObject', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.court.of.jurisdiction', defaultMessage: '管辖法院' })}
                >
                    {
                        this.isDisabled(3, data.status)
                            ? dealCourt || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={dealCourt}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.court.of.jurisdiction', defaultMessage: '请输入管辖法院' })}
                                    disabled={this.isDisabled(3, data.status)}
                                    onChange={e => this.changeState('suitPlan.dealCourt', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.indictment', defaultMessage: '起诉状' })}
                >
                    {
                        this.isDisabled(3, data.status)
                            ? suitText.length ? <FileListComponent fileList={suitText} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <Upload
                                fileList={suitText}
                                {...this.uploadConfig}
                                onChange={file => this.uploadChange(file, 'suitPlan.suitText')}
                            >
                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                            </Upload>
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.certificate.of.authorization', defaultMessage: '授权书' })}
                >
                    {
                        this.isDisabled(3, data.status)
                            ? authCertificate.length ? <FileListComponent fileList={authCertificate} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <Upload
                                fileList={authCertificate}
                                {...this.uploadConfig}
                                onChange={response => this.uploadChange(response, 'suitPlan.authCertificate')}
                            >
                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                            </Upload>
                    }
                </FormItem>
                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.evidence.catalogue', defaultMessage: '证据目录' })}>
                    {
                        this.isDisabled(3, data.status)
                            ? evidenceIndex.length ? <FileListComponent fileList={evidenceIndex} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <Upload
                                fileList={evidenceIndex}
                                {...this.uploadConfig}
                                onChange={response => this.uploadChange(response, 'suitPlan.evidenceIndex')}
                            >
                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                            </Upload>
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
                                        this.isDisabled(3, data.status)
                                            ? <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                            : (
                                                <TextArea
                                                    autosize={false}
                                                    value={data.remark}
                                                    placeholder={intl.formatMessage({ id: 'report.please.enter.note', defaultMessage: '请输入备注信息' })}
                                                    disabled={this.isDisabled(3, data.status)}
                                                    onChange={e => this.changeState('suitPlan.remark', e.target.value)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        this.isDisabled(3, data.status)
                                            ? annexUrl ? <FileListComponent fileList={data.annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : <Upload
                                                fileList={data.annexUrl}
                                                {...this.uploadConfig}
                                                onChange={file => this.uploadChange(file, 'suitPlan.annexUrl')}
                                            >
                                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                            </Upload>
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
                {
                    this.isDisabled(3, data.status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.updateProcessDetailStatus(3, 0)} ><FormattedMessage id="global.pass" defaultMessage="通过" /></Button>
                                <Button onClick={() => this.setState({ visibleReason: true, backReason: '' })}><FormattedMessage id="global.reject" defaultMessage="驳回" /></Button>
                            </div>
                        )
                }
            </div>
        )
    }

    renderCase(data) {
        // 立案
        let { caseNum, registerTime, dealGownsman, suitFeeFormat, summitFeeTime, registerNotice, summitFeeNotice, remark, annexUrl } = data;
        let { suitCaseDetail, intl } = this.props;
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
                        this.isDisabled(4, data.status)
                            ? caseNum || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={caseNum}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.case.number', defaultMessage: '请输入案号' })}
                                    disabled={this.isDisabled(4, data.status)}
                                    onChange={e => this.changeState('caseInfo.caseNum', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.filing.time', defaultMessage: '立案时间' })}
                >
                    {
                        this.isDisabled(4, data.status)
                            ? registerTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <DatePicker
                                    value={registerTime ? moment(registerTime, 'YYYY-MM-DD') : null}
                                    onChange={(date, dateStr) => this.changeState('caseInfo.registerTime', dateStr)}
                                    disabled={this.isDisabled(4, data.status)}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.choose.filingtime', defaultMessage: '请选择立案时间' })}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.trial.judge', defaultMessage: '审理法官' })}
                >
                    {
                        this.isDisabled(4, data.status)
                            ? dealGownsman || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={dealGownsman}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.trial.judge', defaultMessage: '请输入审理法官' })}
                                    disabled={this.isDisabled(4, data.status)}
                                    onChange={e => this.changeState('caseInfo.dealGownsman', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.litigation.costs', defaultMessage: '诉讼费' })}
                >
                    {
                        this.isDisabled(4, data.status)
                            ? suitFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <InputNumber
                                    value={suitFeeFormat}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.litigation.costs', defaultMessage: '请输入诉讼费' })}
                                    disabled={this.isDisabled(4, data.status)}
                                    onChange={val => this.changeState('caseInfo.suitFeeFormat', val)}
                                />
                            )
                    }
                </FormItem>
                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.payment.time', defaultMessage: '缴费时间' })}>
                    {
                        this.isDisabled(4, data.status)
                            ? summitFeeTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <DatePicker
                                    value={summitFeeTime ? moment(summitFeeTime, 'YYYY-MM-DD') : null}
                                    onChange={(date, dateStr) => this.changeState('caseInfo.summitFeeTime', dateStr)}
                                    disabled={this.isDisabled(4, data.status)}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.choose.payment.time', defaultMessage: '请选择缴费时间' })}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.notice.of.filing', defaultMessage: '立案通知书' })}
                >
                    {
                        this.isDisabled(4, data.status)
                            ? registerNotice.length ? <FileListComponent fileList={registerNotice} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <Upload
                                fileList={registerNotice}
                                {...this.uploadConfig}
                                onChange={response => this.uploadChange(response, 'caseInfo.registerNotice')}
                            >
                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                            </Upload>
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.payment.instructions', defaultMessage: '缴费通知书' })}
                >
                    {
                        this.isDisabled(4, data.status)
                            ? summitFeeNotice.length ? <FileListComponent fileList={summitFeeNotice} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <Upload
                                fileList={summitFeeNotice}
                                {...this.uploadConfig}
                                onChange={response => this.uploadChange(response, 'caseInfo.summitFeeNotice')}
                            >
                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                            </Upload>
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
                                        this.isDisabled(4, data.status)
                                            ? <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                            : (
                                                <TextArea
                                                    autosize={false}
                                                    value={data.remark}
                                                    placeholder={intl.formatMessage({ id: 'report.please.enter.note', defaultMessage: '请输入备注信息' })}
                                                    disabled={this.isDisabled(4, data.status)}
                                                    onChange={e => this.changeState('caseInfo.remark', e.target.value)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        this.isDisabled(4, data.status)
                                            ? annexUrl ? <FileListComponent fileList={data.annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : <Upload
                                                fileList={data.annexUrl}
                                                {...this.uploadConfig}
                                                onChange={file => this.uploadChange(file, 'caseInfo.annexUrl')}
                                            >
                                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                            </Upload>
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
                {
                    this.isDisabled(4, data.status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.updateProcessDetailStatus(3, 0)} ><FormattedMessage id="global.pass" defaultMessage="通过" /></Button>
                                <Button onClick={() => this.setState({ visibleReason: true, backReason: '' })}><FormattedMessage id="global.reject" defaultMessage="驳回" /></Button>
                            </div>
                        )
                }
            </div>
        )
    }

    renderBeforeTrial(data) {
        // 庭前
        let { courtTime, courtAddress, dealGownsmanContact, takeNoteManContact, defendantContact, citation, statement, remark, annexUrl } = data;
        let { suitCaseDetail, intl } = this.props;
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
                        this.isDisabled(5, data.status)
                            ? courtTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <DatePicker
                                    value={courtTime ? moment(courtTime, 'YYYY-MM-DD') : null}
                                    onChange={(date, dateStr) => this.changeState('beforeTrial.courtTime', dateStr)}
                                    disabled={this.isDisabled(5, data.status)}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.choose.court.time', defaultMessage: '请选择开庭时间' })}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.place.of.trial', defaultMessage: '庭审地点' })}
                >
                    {
                        this.isDisabled(5, data.status)
                            ? courtAddress || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={courtAddress}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.place.of.trial', defaultMessage: '请输入庭审地点' })}
                                    disabled={this.isDisabled(5, data.status)}
                                    onChange={e => this.changeState('beforeTrial.courtAddress', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.presiding.judge', defaultMessage: '主审法官及联系方式' })}>
                    {
                        this.isDisabled(5, data.status)
                            ? dealGownsmanContact || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={dealGownsmanContact}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.presiding.judge', defaultMessage: '请输入主审法官及联系方式' })}
                                    disabled={this.isDisabled(5, data.status)}
                                    onChange={e => this.changeState('beforeTrial.dealGownsmanContact', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.clerk.and.contact.information', defaultMessage: '书记员及联系方式' })}>
                    {
                        this.isDisabled(5, data.status)
                            ? takeNoteManContact || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={takeNoteManContact}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.clerk.and.contact.information', defaultMessage: '请输入书记员及联系方式' })}
                                    disabled={this.isDisabled(5, data.status)}
                                    onChange={e => this.changeState('beforeTrial.takeNoteManContact', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.defendant', defaultMessage: '被告联系方式' })}
                >
                    {
                        this.isDisabled(5, data.status)
                            ? defendantContact || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={defendantContact}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.the.defendant', defaultMessage: '请输入被告联系方式' })}
                                    disabled={this.isDisabled(5, data.status)}
                                    onChange={e => this.changeState('beforeTrial.defendantContact', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.summons', defaultMessage: '传票' })}
                >
                    {
                        this.isDisabled(5, data.status)
                            ? citation.length ? <FileListComponent fileList={citation} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <Upload
                                fileList={citation}
                                {...this.uploadConfig}
                                onChange={response => this.uploadChange(response, 'beforeTrial.citation')}
                            >
                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                            </Upload>
                    }
                </FormItem>
                <FormItem label={intl.formatMessage({ id: 'ligiation.detail.statement.procurator', defaultMessage: '代理词' })}>
                    {
                        this.isDisabled(5, data.status)
                            ? statement.length ? <FileListComponent fileList={statement} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <Upload
                                fileList={statement}
                                {...this.uploadConfig}
                                onChange={response => this.uploadChange(response, 'beforeTrial.statement')}
                            >
                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                            </Upload>
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
                                        this.isDisabled(5, data.status)
                                            ? <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                            : (
                                                <TextArea
                                                    autosize={false}
                                                    value={data.remark}
                                                    placeholder={intl.formatMessage({ id: 'report.please.enter.note', defaultMessage: '请输入备注信息' })}
                                                    disabled={this.isDisabled(5, data.status)}
                                                    onChange={e => this.changeState('beforeTrial.remark', e.target.value)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        this.isDisabled(5, data.status)
                                            ? annexUrl ? <FileListComponent fileList={data.annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : <Upload
                                                fileList={data.annexUrl}
                                                {...this.uploadConfig}
                                                onChange={file => this.uploadChange(file, 'beforeTrial.annexUrl')}
                                            >
                                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                            </Upload>
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
                {
                    this.isDisabled(5, data.status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.updateProcessDetailStatus(3, 0)} ><FormattedMessage id="global.pass" defaultMessage="通过" /></Button>
                                <Button onClick={() => this.setState({ visibleReason: true, backReason: '' })}><FormattedMessage id="global.reject" defaultMessage="驳回" /></Button>
                            </div>
                        )
                }
            </div>
        )
    }

    renderCourtTrial(data) {
        // 庭审
        let { isOnCourt, defendantContact, startCourtReport, remark, annexUrl } = data;
        let { suitCaseDetail, intl } = this.props;
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
                        this.isDisabled(6, data.status)
                            ? isOnCourt === 0 ? '是' : '否'
                            : (
                                <RadioGroup
                                    value={isOnCourt}
                                    disabled={this.isDisabled(6, data.status)}
                                    onChange={e => this.changeState('courtTrial.isOnCourt', e.target.value)}
                                >
                                    <Radio value={0}><FormattedMessage id="ligiation.yes" defaultMessage="是" /></Radio>
                                    <Radio value={1}><FormattedMessage id="ligiation.no" defaultMessage="否" /></Radio>
                                </RadioGroup>
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.defendant.concat', defaultMessage: '被告联系方式' })}
                >
                    {
                        this.isDisabled(6, data.status)
                            ? defendantContact || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={defendantContact}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.defendant.concat', defaultMessage: '请输入被告联系方式' })}
                                    disabled={this.isDisabled(6, data.status)}
                                    onChange={e => this.changeState('courtTrial.defendantContact', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.court.report', defaultMessage: '开庭报告' })}
                >
                    {
                        this.isDisabled(6, data.status)
                            ? <p style={{ whiteSpace: 'pre-wrap' }}>{startCourtReport || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                            : (
                                <TextArea autosize={false}
                                    value={startCourtReport}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.court.report', defaultMessage: '请输入开庭报告' })}
                                    disabled={this.isDisabled(6, data.status)}
                                    onChange={e => this.changeState('courtTrial.startCourtReport', e.target.value)}
                                />
                            )
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
                                        this.isDisabled(6, data.status)
                                            ? <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                            : (
                                                <TextArea
                                                    autosize={false}
                                                    value={data.remark}
                                                    placeholder={intl.formatMessage({ id: 'report.please.enter.note', defaultMessage: '请输入备注信息' })}
                                                    disabled={this.isDisabled(6, data.status)}
                                                    onChange={e => this.changeState('courtTrial.remark', e.target.value)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        this.isDisabled(6, data.status)
                                            ? annexUrl ? <FileListComponent fileList={data.annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : <Upload
                                                fileList={data.annexUrl}
                                                {...this.uploadConfig}
                                                onChange={file => this.uploadChange(file, 'courtTrial.annexUrl')}
                                            >
                                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                            </Upload>
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
                {
                    this.isDisabled(6, data.status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.updateProcessDetailStatus(3, 0)} ><FormattedMessage id="global.pass" defaultMessage="通过" /></Button>
                                <Button onClick={() => this.setState({ visibleReason: true, backReason: '' })}><FormattedMessage id="global.reject" defaultMessage="驳回" /></Button>
                            </div>
                        )
                }
            </div>
        )
    }

    renderJudgment(data) {
        // 判决
        let { accptTime, judgmentFeeFormat, judgmentText, remark, annexUrl } = data;
        let { suitCaseDetail, intl } = this.props;
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
                        this.isDisabled(7, data.status)
                            ? accptTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <DatePicker
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.choose.receipt.time', defaultMessage: '请选择判决书收到时间' })}
                                    disabled={this.isDisabled(7, data.status)}
                                    value={accptTime ? moment(accptTime, 'YYYY-MM-DD') : null}
                                    onChange={(date, dateStr) => this.changeState('judgment.accptTime', dateStr)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.receipt.amount', defaultMessage: '判决金额' })}
                >
                    {
                        this.isDisabled(7, data.status)
                            ? judgmentFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <InputNumber
                                    value={judgmentFeeFormat}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.receipt.amount', defaultMessage: '请输入判决金额' })}
                                    disabled={this.isDisabled(7, data.status)}
                                    onChange={val => this.changeState('judgment.judgmentFeeFormat', val)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.receipt.book', defaultMessage: '判决书' })}
                >
                    {
                        this.isDisabled(7, data.status)
                            ? judgmentText.length ? <FileListComponent fileList={judgmentText} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <Upload
                                fileList={judgmentText}
                                {...this.uploadConfig}
                                onChange={response => this.uploadChange(response, 'judgment.judgmentText')}
                            >
                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                            </Upload>
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
                                        this.isDisabled(7, data.status)
                                            ? <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                            : (
                                                <TextArea
                                                    autosize={false}
                                                    value={data.remark}
                                                    placeholder={intl.formatMessage({ id: 'report.please.enter.note', defaultMessage: '请输入备注信息' })}
                                                    disabled={this.isDisabled(7, data.status)}
                                                    onChange={e => this.changeState('judgment.remark', e.target.value)}
                                                />
                                            )
                                    }
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: 'case.enclosure', defaultMessage: '附件' })}>
                                    {
                                        this.isDisabled(7, data.status)
                                            ? annexUrl ? <FileListComponent fileList={data.annexUrl} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                            : <Upload
                                                fileList={data.annexUrl}
                                                {...this.uploadConfig}
                                                onChange={file => this.uploadChange(file, 'judgment.annexUrl')}
                                            >
                                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                            </Upload>
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
                {
                    this.isDisabled(7, data.status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.updateProcessDetailStatus(3, 0)} ><FormattedMessage id="global.pass" defaultMessage="通过" /></Button>
                                <Button onClick={() => this.setState({ visibleReason: true, backReason: '' })}><FormattedMessage id="global.reject" defaultMessage="驳回" /></Button>
                            </div>
                        )
                }
            </div>
        )
    }

    renderAdjudicate(data) {
        // 结案
        let { closeCaseWay, finalFeeFormat, finalFeeStr, backFeeFormat, backFeeStr, closeCaseText, closeCaseWayName, closeCaseWayNameEn } = data;
        let { suitCaseDetail, intl, litigationCloseCaseWay } = this.props;
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
                        this.isDisabled(8, data.status)
                            ? (intl.locale === 'en' ? closeCaseWayNameEn : closeCaseWayName) || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Select
                                    value={closeCaseWay}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.please.choose.closing.method', defaultMessage: '请选择结案方式' })}
                                    disabled={this.isDisabled(8, data.status)}
                                    onChange={val => this.changeState('adjudicate.closeCaseWay', val)}
                                >
                                    {
                                        litigationCloseCaseWay && litigationCloseCaseWay.filter(item => item.isDel === 0)
                                            .map(opt => <SelectOption key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</SelectOption>)
                                    }
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.final.compensation.amount', defaultMessage: '最终赔偿金额' })}
                >
                    {
                        this.isDisabled(8, data.status)
                            ? finalFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <InputNumber
                                    value={finalFeeFormat}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.final.compensation.amount', defaultMessage: '请输入赔偿金额' })}
                                    disabled={this.isDisabled(8, data.status)}
                                    onChange={val => this.changeState('adjudicate.finalFeeFormat', val)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'ligiation.detail.achievement.compensation', defaultMessage: '赔偿金额到额情况' })}
                >

                    {
                        this.isDisabled(8, data.status)
                            ? finalFeeStr || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={finalFeeStr}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.achievement.compensation', defaultMessage: '请输入赔偿金额到额情况' })}
                                    disabled={this.isDisabled(8, data.status)}
                                    onChange={e => this.changeState('adjudicate.finalFeeStr', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.litigation.refund', defaultMessage: '诉讼退费' })}
                >
                    {
                        this.isDisabled(8, data.status)
                            ? backFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <InputNumber
                                    value={backFeeFormat}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.litigation.refund', defaultMessage: '请输入诉讼退费' })}
                                    disabled={this.isDisabled(8, data.status)}
                                    onChange={val => this.changeState('adjudicate.backFeeFormat', val)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.refunds', defaultMessage: '诉讼退费到款情况' })}>
                    {
                        this.isDisabled(8, data.status)
                            ? backFeeStr || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Input
                                    value={backFeeStr}
                                    placeholder={intl.formatMessage({ id: 'ligiation.detail.enter.refunds', defaultMessage: '请输入诉讼退费到款情况' })}
                                    disabled={this.isDisabled(8, data.status)}
                                    onChange={e => this.changeState('adjudicate.backFeeStr', e.target.value)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    required
                    label={intl.formatMessage({ id: 'ligiation.detail.closing.document', defaultMessage: '结案文书' })}
                >
                    {
                        this.isDisabled(8, data.status)
                            ? closeCaseText.length ? <FileListComponent fileList={closeCaseText} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <Upload
                                fileList={closeCaseText}
                                {...this.uploadConfig}
                                onChange={response => this.uploadChange(response, 'adjudicate.closeCaseText')}
                            >
                                <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                            </Upload>
                    }
                </FormItem>
                {
                    data.backReason
                        ? <FormItem label={intl.formatMessage({ id: 'ligiation.reasons.for.rejection', defaultMessage: '驳回理由' })}> <span style={{ color: 'red' }}>{data.backReason}</span></FormItem>
                        : ''
                }
                {
                    this.isDisabled(8, data.status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.updateProcessDetailStatus(3, 0)} ><FormattedMessage id="global.pass" defaultMessage="通过" /></Button>
                                <Button onClick={() => this.setState({ visibleReason: true, backReason: '' })}><FormattedMessage id="global.reject" defaultMessage="驳回" /></Button>
                            </div>
                        )
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
        let { process, intl } = this.props;
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
                    <Modal
                        title={intl.formatMessage({ id: 'ligiation.reasons.for.rejection', defaultMessage: '驳回理由' })}
                        visible={visibleReason}
                        className='root'
                        onCancel={() => { this.setState({ visibleReason: false, backReason: '' }) }}
                        onOk={() => this.confirmBack()}
                    >
                        <div className="search-form form">
                            <FormItem
                                required
                                label={intl.formatMessage({ id: 'ligiation.reasons.for.rejection', defaultMessage: '驳回理由' })}
                            >
                                <Input
                                    value={backReason}
                                    placeholder={intl.formatMessage({ id: 'ligiation.please.enter.your.reasons.for.rejection', defaultMessage: '请输入驳回理由' })}
                                    onChange={e => this.setState({ backReason: e.target.value.trim() })}
                                />
                            </FormItem>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}
export default injectIntl(Process)
