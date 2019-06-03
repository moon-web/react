import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Steps, Form, Input, DatePicker, Upload, Icon, Button, message } from 'antd'
import moment from 'moment'
import Req from '../../../../../api/req'
import InputNumber from '../../../../common/form/numberInput';
import FileListComponent from '../../../../common/upload/flieList'
import { queryUrlParams } from '../../../../../utils/util'
const FormItem = Form.Item;
const Step = Steps.Step;

class ExecutionResult extends Component {
    constructor() {
        super();
        this.state = {
            editKey: '3',  // 3(刑事)行动，4(刑事)逮捕，5(刑事)判决，6(行政)行动，7(行政)处罚 
            userType: '',
            criminalAction: {
                actTime: '',
                lawUnit: '',
                registerDecision: [],
                attachmentList: [],
                detentionWarrant: [],
                onBailNote: [],
                actReport: []
            },
            arrest: {
                arrestTime: '',
                arrestNote: []
            },
            judgment: {
                judgmentNote: []
            },
            administrativeAction: {
                punishTime: '',
                attachmentList: [],
                brandPayFeeFormat: '',
                brandPayBill: [],
                cooprateFeeFormat: '',
                cooprateBill: []
            },
            punishment: {
                punishTime: '',
                punishNote: [],
                brandPayFeeFormat: '',
                brandPayBill: [],
                cooprateFeeFormat: '',
                cooprateBill: []
            }
        }
        this.uploadConfig = {
            action: Req.uploadFile,
            beforeUpload: file => this.beforeUpload(file),
            name: "file",
            withCredentials: true
        }
    }

    componentWillMount() {
        let type = queryUrlParams('brand');
        let key = '3';
        let { offlineCaseDetail } = this.props;
        if (offlineCaseDetail.caseType === 1) {
            switch (offlineCaseDetail.status) {
                case 8:
                    key = '6';
                    break;
                case 9:
                    key = '7';
                    break;
                default:
                    key = '6'
                    break;
            }
        } else {
            switch (offlineCaseDetail.status) {
                case 5:
                    key = '3';
                    break;
                case 6:
                    key = '4';
                    break;
                case 7:
                    key = '5';
                    break;
                default:
                    key = '3'
                    break;
            }
        }
        this.setState({
            userType: type,
            editKey: key
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.processDetail !== this.props.processDetail) {
            this.setState({
                criminalAction: nextProps.processDetail.lawyerCaseXSActDO,
                arrest: nextProps.processDetail.lawyerCaseXSArrestDO,
                judgment: nextProps.processDetail.lawyerCaseXSJudgmentDO,
                administrativeAction: nextProps.processDetail.lawyerCaseXZActDO,
                punishment: nextProps.processDetail.lawyerCaseXZPunishDO,
            })
        }
        if (nextProps.offlineCaseDetail !== this.props.offlineCaseDetail) {
            let key = '3';
            let { offlineCaseDetail } = this.props;
            if (offlineCaseDetail.caseType === 1) {
                switch (offlineCaseDetail.status) {
                    case 8:
                        key = '6';
                        break;
                    case 9:
                        key = '7';
                        break;
                    default:
                        key = '6'
                        break;
                }
            } else {
                switch (offlineCaseDetail.status) {
                    case 5:
                        key = '3';
                        break;
                    case 6:
                        key = '4';
                        break;
                    case 7:
                        key = '5';
                        break;
                    default:
                        key = '3'
                        break;
                }
            }
            this.setState({
                editKey: key
            })
        }
    }

    changeKey(key) {
        this.setState({
            editKey: key
        })
    }

    changeState(key, val) {
        let { criminalAction, arrest, judgment, administrativeAction, punishment } = this.state;
        let result = key.split('.');
        key = result[1];
        let parent = result[0],
            temp = {};
        if (parent === 'criminalAction') {
            criminalAction[key] = val;
            temp = criminalAction;
        } else if (parent === 'arrest') {
            arrest[key] = val;
            temp = arrest;
        } else if (parent === 'judgment') {
            judgment[key] = val;
            temp = judgment;
        } else if (parent === 'administrativeAction') {
            administrativeAction[key] = val;
            temp = administrativeAction;
        } else if (parent === 'punishment') {
            punishment[key] = val;
            temp = punishment;
        }
        this.setState({
            [parent]: temp
        })
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
    uploadChange({ fileList }, key) {
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
        this.changeState(key, newImges)
    }

    submitProcessJson(saveFlag) {
        let { editKey, criminalAction, arrest, judgment, administrativeAction, punishment } = this.state;
        let { saveProcessInfo, caseId, processDetail, getOfflineCaseDetail } = this.props;
        let data = {
            processType: editKey,
            saveFlag: saveFlag,
            caseId: caseId
        };
        let oldProcessDetail = Object.assign({}, processDetail)
        if (editKey === '3') {
            data.processJson = JSON.stringify(criminalAction)
        } else if (editKey === '4') {
            data.processJson = JSON.stringify(arrest)
        } else if (editKey === '5') {
            data.processJson = JSON.stringify(judgment)
        } else if (editKey === '6') {
            data.processJson = JSON.stringify(administrativeAction)
        } else if (editKey === '7') {
            data.processJson = JSON.stringify(punishment)
        }
        if (saveProcessInfo) {
            saveProcessInfo(data, oldProcessDetail, () => {
                getOfflineCaseDetail()
            })
        }
    }

    isDisabled(caseStatus, subStatus) {
        let { offlineCaseDetail } = this.props;
        let { userType } = this.state;
        if (offlineCaseDetail.status >= 3 && offlineCaseDetail.status <= 10 && offlineCaseDetail.status !== 4) {
            if ((offlineCaseDetail.status > caseStatus) || userType) {
                return true;
            } else {
                if (subStatus === 2) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return true;
        }
    }

    renderCriminalAction(data) {
        let { intl } = this.props;
        let { actTime, lawUnit, registerDecision, attachmentList, detentionWarrant, onBailNote, actReport, status } = data;
        return (
            <div className="search-form form">
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.action.time', defaultMessage: '行动时间' })}
                >
                    {
                        this.isDisabled(5, status)
                            ? actTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <DatePicker
                                value={actTime ? moment(actTime, 'YYYY-MM-DD') : null}
                                placeholder='请选择行动时间'
                                onChange={(date, dateStr) => this.changeState('criminalAction.actTime', dateStr)}
                            />
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.law.enforcement', defaultMessage: '执法单位' })}
                >
                    {
                        this.isDisabled(5, status)
                            ? lawUnit || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <Input
                                value={lawUnit}
                                placeholder='请输入执法单位名称'
                                onChange={e => this.changeState('criminalAction.lawUnit', e.target.value.trim())}
                            />
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.written.decision', defaultMessage: '立案决定书' })}
                >
                    {
                        this.isDisabled(5, status)
                            ? registerDecision.length ? <FileListComponent fileList={registerDecision} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={registerDecision}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'criminalAction.registerDecision')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.the.seizure.of.listing', defaultMessage: '扣押清单' })}
                >
                    {
                        this.isDisabled(5, status)
                            ? attachmentList.length ? <FileListComponent fileList={attachmentList} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={attachmentList}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'criminalAction.attachmentList')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.detention.certificate', defaultMessage: '拘留证' })}
                >
                    {
                        this.isDisabled(5, status)
                            ? detentionWarrant.length ? <FileListComponent fileList={detentionWarrant} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={detentionWarrant}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'criminalAction.detentionWarrant')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.written.decision.of.obtaining.a.guarantor.pending.trial', defaultMessage: '取保候审决定书' })}
                >
                    {
                        this.isDisabled(5, status)
                            ? onBailNote.length ? <FileListComponent fileList={onBailNote} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={onBailNote}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'criminalAction.onBailNote')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.action.report', defaultMessage: '行动报告' })}
                >
                    {
                        this.isDisabled(5, status)
                            ? actReport.length ? <FileListComponent fileList={actReport} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={actReport}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'criminalAction.actReport')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                {
                    this.isDisabled(5, status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.submitProcessJson(0)} ><FormattedMessage id="offline.case.submit" defaultMessage="提交" /></Button>
                                <Button onClick={() => this.submitProcessJson(1)} ><FormattedMessage id="offline.case.staging" defaultMessage="暂存" /></Button>
                            </div>
                        )
                }
            </div>
        )
    }

    renderArrest(data) {
        let { intl } = this.props;
        let { arrestTime, arrestNote, status } = data;
        return (
            <div className="search-form form">
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.the.arrest.of.time', defaultMessage: '逮捕时间' })}
                >
                    {
                        this.isDisabled(6, status)
                            ? arrestTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : <DatePicker
                                value={arrestTime ? moment(arrestTime, 'YYYY-MM-DD') : null}
                                placeholder='请选择逮捕时间'
                                onChange={(date, dateStr) => this.changeState('arrest.arrestTime', dateStr)}
                            />
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.the.an.arrest.warrant', defaultMessage: '逮捕证' })}
                >
                    {
                        this.isDisabled(6, status)
                            ? arrestNote.length ? <FileListComponent fileList={arrestNote} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={arrestNote}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'arrest.arrestNote')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                {
                    this.isDisabled(6, status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.submitProcessJson(0)} ><FormattedMessage id="offline.case.submit" defaultMessage="提交" /></Button>
                                <Button onClick={() => this.submitProcessJson(1)} ><FormattedMessage id="offline.case.staging" defaultMessage="暂存" /></Button>
                            </div>
                        )
                }
            </div>
        )
    }

    renderJudgment(data) {
        let { intl } = this.props;
        let { judgmentNote, status } = data;
        return (
            <div className="search-form form">
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.the.judgment', defaultMessage: '判决书' })}
                >
                    {
                        this.isDisabled(7, status)
                            ? judgmentNote.length ? <FileListComponent fileList={judgmentNote} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={judgmentNote}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'judgment.judgmentNote')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                {
                    this.isDisabled(7, status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.submitProcessJson(0)} ><FormattedMessage id="offline.case.submit" defaultMessage="提交" /></Button>
                                <Button onClick={() => this.submitProcessJson(1)} ><FormattedMessage id="offline.case.staging" defaultMessage="暂存" /></Button>
                            </div>
                        )
                }
            </div>
        )
    }

    renderAdministrativeAction(data) {
        let { intl } = this.props;
        let { punishTime, attachmentList, brandPayFeeFormat, brandPayBill, cooprateFeeFormat, cooprateBill, status } = data;
        return (
            <div className="search-form form">
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.punishment.according.to.the.time', defaultMessage: '处罚时间' })}
                >
                    {
                        this.isDisabled(8, status)
                            ? punishTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <DatePicker
                                    value={punishTime ? moment(punishTime, 'YYYY-MM-DD') : null}
                                    placeholder='请选择处罚时间'
                                    onChange={(date, dateStr) => this.changeState('administrativeAction.punishTime', dateStr)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.the.seizure.of.listing', defaultMessage: '扣押清单' })}
                >
                    {
                        this.isDisabled(8, status)
                            ? attachmentList.length ? <FileListComponent fileList={attachmentList} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={attachmentList}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'administrativeAction.attachmentList')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.brand.payment.amount', defaultMessage: '品牌支付金额' })}
                >
                    {
                        this.isDisabled(8, status)
                            ? brandPayFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <InputNumber
                                    value={brandPayFeeFormat}
                                    placeholder='请输入品牌支付金额'
                                    onChange={val => this.changeState('administrativeAction.brandPayFeeFormat', val)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.brand.payment.invoice', defaultMessage: '品牌支付发票' })}
                >
                    {
                        this.isDisabled(8, status)
                            ? brandPayBill.length ? <FileListComponent fileList={brandPayBill} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={brandPayBill}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'administrativeAction.brandPayBill')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.cooperation.commission', defaultMessage: '合作单位佣金' })}
                >
                    {
                        this.isDisabled(8, status)
                            ? cooprateFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <InputNumber
                                    value={cooprateFeeFormat}
                                    placeholder='请输入合作单位佣金'
                                    onChange={val => this.changeState('administrativeAction.cooprateFeeFormat', val)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.cooperation.invoice', defaultMessage: '合作单位发票' })}
                >
                    {
                        this.isDisabled(8, status)
                            ? cooprateBill.length ? <FileListComponent fileList={cooprateBill} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={cooprateBill}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'administrativeAction.cooprateBill')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                {
                    this.isDisabled(8, status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.submitProcessJson(0)} ><FormattedMessage id="offline.case.submit" defaultMessage="提交" /></Button>
                                <Button onClick={() => this.submitProcessJson(1)} ><FormattedMessage id="offline.case.staging" defaultMessage="暂存" /></Button>
                            </div>
                        )
                }
            </div>
        )
    }

    renderPunishment(data) {
        let { intl } = this.props;
        let { punishTime, punishNote, brandPayFeeFormat, brandPayBill, cooprateFeeFormat, cooprateBill, status } = data;
        return (
            <div className="search-form form">
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.punishment.according.to.the.time', defaultMessage: '处罚时间' })}
                >
                    {
                        this.isDisabled(9, status)
                            ? punishTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <DatePicker
                                    value={punishTime ? moment(punishTime, 'YYYY-MM-DD') : null}
                                    placeholder='请选择处罚时间'
                                    onChange={(date, dateStr) => this.changeState('punishment.punishTime', dateStr)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.penalty.decision', defaultMessage: '处罚决定书' })}
                >
                    {
                        this.isDisabled(9, status)
                            ? punishNote.length ? <FileListComponent fileList={punishNote} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={punishNote}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'punishment.punishNote')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.brand.payment.amount', defaultMessage: '品牌支付金额' })}
                >
                    {
                        this.isDisabled(9, status)
                            ? brandPayFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <InputNumber
                                    value={brandPayFeeFormat}
                                    placeholder='请输入品牌支付金额'
                                    onChange={val => this.changeState('punishment.brandPayFeeFormat', val)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.brand.payment.invoice', defaultMessage: '品牌支付发票' })}
                >
                    {
                        this.isDisabled(9, status)
                            ? brandPayBill.length ? <FileListComponent fileList={brandPayBill} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={brandPayBill}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'punishment.brandPayBill')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }

                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.cooperation.commission', defaultMessage: '合作单位佣金' })}
                >
                    {
                        this.isDisabled(9, status)
                            ? cooprateFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <InputNumber
                                    value={cooprateFeeFormat}
                                    placeholder='请输入合作单位佣金'
                                    onChange={val => this.changeState('punishment.cooprateFeeFormat', val)}
                                />
                            )
                    }
                </FormItem>
                <FormItem
                    label={intl.formatMessage({ id: 'offline.case.cooperation.invoice', defaultMessage: '合作单位发票' })}
                >
                    {
                        this.isDisabled(9, status)
                            ? cooprateBill.length ? <FileListComponent fileList={cooprateBill} /> : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                            : (
                                <Upload
                                    fileList={cooprateBill}
                                    {...this.uploadConfig}
                                    onChange={file => this.uploadChange(file, 'punishment.cooprateBill')}
                                >
                                    <a><Icon type='upload' /><FormattedMessage id="ligiation.upload" defaultMessage="上传文件" /></a>
                                </Upload>
                            )
                    }
                </FormItem>
                {
                    this.isDisabled(9, status)
                        ? ''
                        : (
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.submitProcessJson(0)} ><FormattedMessage id="offline.case.submit" defaultMessage="提交" /></Button>
                                <Button onClick={() => this.submitProcessJson(1)} ><FormattedMessage id="offline.case.staging" defaultMessage="暂存" /></Button>
                            </div>
                        )
                }
            </div>
        )
    }

    render() {
        let { offlineCaseDetail } = this.props;
        let { editKey, criminalAction, arrest, judgment, administrativeAction, punishment } = this.state;
        return (
            <div className='process'>
                <div className='step-wrap'>
                    {
                        offlineCaseDetail.caseType === 1
                            ? (
                                <Steps progressDot direction="vertical">
                                    <Step
                                        title={<a onClick={() => this.changeKey('6')}><FormattedMessage id='offline.case.action' defaultMessage='行动' /></a>}
                                        className={editKey === '6' ? 'step-active' : ''}
                                    />
                                    <Step
                                        title={<a onClick={() => this.changeKey('7')}><FormattedMessage id='offline.case.punishment' defaultMessage='处罚' /></a>}
                                        className={editKey === '7' ? 'step-active' : ''}
                                    />
                                </Steps>
                            )
                            : (
                                <Steps progressDot direction="vertical">
                                    <Step
                                        title={<a onClick={() => this.changeKey('3')}><FormattedMessage id='offline.case.action' defaultMessage='行动' /></a>}
                                        className={editKey === '3' ? 'step-active' : ''}
                                    />
                                    <Step
                                        title={<a onClick={() => this.changeKey('4')}><FormattedMessage id='offline.case.arrest' defaultMessage='逮捕' /></a>}
                                        className={editKey === '4' ? 'step-active' : ''}
                                    />
                                    <Step
                                        title={<a onClick={() => this.changeKey('5')}><FormattedMessage id='offline.case.judgment' defaultMessage='判决' /></a>}
                                        className={editKey === '5' ? 'step-active' : ''}
                                    />
                                </Steps>
                            )
                    }
                </div>
                <div className="step-info">
                    <div className="step-inner">
                        {
                            editKey === '3'
                                ? this.renderCriminalAction(criminalAction)
                                : ''
                        }
                        {
                            editKey === '4'
                                ? this.renderArrest(arrest)
                                : ''
                        }
                        {
                            editKey === '5'
                                ? this.renderJudgment(judgment)
                                : ''
                        }
                        {
                            editKey === '6'
                                ? this.renderAdministrativeAction(administrativeAction)
                                : ''
                        }
                        {
                            editKey === '7'
                                ? this.renderPunishment(punishment)
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default injectIntl(ExecutionResult);