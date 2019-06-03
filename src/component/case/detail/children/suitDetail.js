import React from 'react'
import { Col, Input, Row, Button, Upload, Select, DatePicker, Icon } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import Common from './common'
import Req from '../../../../api/req'
import { getButtonPrem} from '../../../../utils/util'
import InputNumber from '../../../common/form/numberInput';
const Option = Select.Option;
const TextArea = Input.TextArea;

class SuitDetail extends Common {
    constructor(props) {
        super(props)
        this.state = {
            suitDetail: {},
            edit: false,
            fileList: []
        }
    }

    componentWillMount() {
        let { suitDetail } = this.props;
        this.getDetail(suitDetail)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.suitDetail !== this.props.suitDetail) {
            let { suitDetail } = nextProps;
            this.getDetail(suitDetail)
        }
    }

    // 获取详情
    getDetail(suitDetail) {
        if (suitDetail) {
            let fileList = [];
            if (suitDetail.listFile.length) {
                for (let i = 0; i < suitDetail.listFile.length; i++) {
                    const element = suitDetail.listFile[i];
                    element.uid = element.id || element.uid
                    element.name = element.fileName
                    element.url = element.fileUrl
                    element.status = 'done'
                }
                fileList = JSON.stringify(suitDetail.listFile)
                fileList = JSON.parse(fileList)
            }
            this.setState({
                suitDetail: Object.assign({}, suitDetail),
                fileList
            })
        }
    }

    // 修改
    changeSuitDetail(value, key) {
        let { suitDetail } = this.state;
        suitDetail[key] = value;
        this.setState({
            suitDetail
        })
    }

    // 取消更改
    cancelChange() {
        let { suitDetail } = this.props;
        if (suitDetail) {
            this.getDetail(suitDetail)
            this.setState({
                edit: false
            })
        }
    }

    // 提交更改
    submitChange() {
        let { suitDetail, fileList } = this.state;
        let listFile = [];
        if (fileList.length) {
            for (let i = 0; i < fileList.length; i++) {
                const element = fileList[i];
                listFile.push({
                    fileName: element.name,
                    fileType: 1,
                    fileUrl: element.url
                })
            }
        }
        suitDetail.listFile = listFile;
        this.props.updateSuitDetail(suitDetail, () => {
            this.setState({
                edit: false
            })
        })
    }

    render() {
        let { suitDetail, edit, fileList } = this.state;
        let { userInfo, typeListComplaint,intl,permissionList } = this.props;
        return (
            <div className="tab-info">
                {
                    !edit ?  getButtonPrem( permissionList, '003001006' ) ?
                        <a className="edit" onClick={() => this.setState({ edit: true })}><FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" /></a>
                        : '':''
                }
                <div className="tab-info-content">
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.state.litigation" defaultMessage="诉讼状态" description="诉讼状态" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Select
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.suitStatus : undefined}
                                    onChange={value => this.changeSuitDetail(value, 'suitStatus')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        typeListComplaint && typeListComplaint.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.id}>{intl.locale==='zh'?opt.dictLabel:opt.dictLabelEn}</Option>)
                                    }
                                </Select>
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.deliverer" defaultMessage="交付方" description="交付方" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.deliveryObj : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'deliveryObj')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.deliverer.time" defaultMessage="交付时间" description="交付时间" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                {
                                    suitDetail && !edit
                                        ? <span className="time">{suitDetail.gmtDelivery}</span>
                                        : (
                                            <DatePicker
                                                disabled={!edit}
                                                value={suitDetail && suitDetail.gmtDelivery ? moment(suitDetail.gmtDelivery, "YYYY-MM-DD") : null}
                                                onChange={(date, dateString) => this.changeSuitDetail(dateString, 'gmtDelivery')}
                                            />
                                        )
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.notarization.progress" defaultMessage="公证进度" description="公证进度" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.notarizationSchedule : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'notarizationSchedule')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.notarization.no" defaultMessage="公证编号" description="公证编号" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.notarizationNo : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'notarizationNo')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.purchase.fee" defaultMessage="购买费" description="购买费" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.buyCostStr : ''}
                                    onChange={value => this.changeSuitDetail(value.trim(), 'buyCostStr')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.fair.fee" defaultMessage="公证费" description="公证费" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.notarizationCostStr : ''}
                                    onChange={value => this.changeSuitDetail(value.trim(), 'notarizationCostStr')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.other.fee" defaultMessage="其他取证费" description="其他取证费" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.otherCostStr : ''}
                                    onChange={value => this.changeSuitDetail(value.trim(), 'otherCostStr')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.guarantee.fee" defaultMessage="诉讼担保费" description="诉讼担保费" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.guaranteeCostStr : ''}
                                    onChange={value => this.changeSuitDetail(value.trim(), 'guaranteeCostStr')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.undertake.lawyer" defaultMessage="承办律师" description="承办律师" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.contractLawyer : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'contractLawyer')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.case.court" defaultMessage="立案法院" description="立案法院" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.caseCourt : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'caseCourt')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.undertake.judge" defaultMessage="承办法官" description="承办法官" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.contractJudge : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'contractJudge')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.data.filing" defaultMessage="立案日期" description="立案日期" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                {
                                    suitDetail && !edit ? <span className="time">{suitDetail.gmtRegister}</span>
                                        : (
                                            <DatePicker
                                                disabled={!edit}
                                                value={suitDetail && suitDetail.gmtRegister ? moment(suitDetail.gmtRegister, "YYYY-MM-DD") : null}
                                                onChange={(date, dateString) => this.changeSuitDetail(dateString, 'gmtRegister')}
                                            />
                                        )
                                }
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.case.number" defaultMessage="立案案号" description="立案案号" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.registerNo : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'registerNo')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.amount.appeal" defaultMessage="诉请金额" description="诉请金额" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.appealCostStr : ''}
                                    onChange={value => this.changeSuitDetail(value.trim(), 'appealCostStr')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.acceptance.fee" defaultMessage="诉讼受理费" description="诉讼受理费" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.appceptanceCostStr : ''}
                                    onChange={value => this.changeSuitDetail(value.trim(), 'appceptanceCostStr')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.preservation.acceptance.fee" defaultMessage="保全申请费" description="保全申请费" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.securityApplyCostStr : ''}
                                    onChange={value => this.changeSuitDetail(value.trim(), 'securityApplyCostStr')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.preservation" defaultMessage="保全情况" description="保全情况" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.securityInfo : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'securityInfo')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.reconciliation" defaultMessage="和解情况" description="和解情况" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.compromiseInfo : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'compromiseInfo')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.date.court" defaultMessage="开庭日期" description="开庭日期" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                {
                                    suitDetail && !edit
                                        ? <span className="time">{suitDetail.gmtCourt}</span>
                                        : (
                                            <DatePicker
                                                disabled={!edit}
                                                value={suitDetail && suitDetail.gmtCourt ? moment(suitDetail.gmtCourt, "YYYY-MM-DD") : null}
                                                onChange={(date, dateString) => this.changeSuitDetail(dateString, 'gmtCourt')}
                                            />
                                        )
                                }
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.trial.situation" defaultMessage="审理情况" description="审理情况" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.courtInfo : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'courtInfo')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.verdict.amount" defaultMessage="判决金额" description="判决金额" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.judgePriceStr : ''}
                                    onChange={value => this.changeSuitDetail(value.trim(), 'judgePriceStr')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.implementation" defaultMessage="执行情况" description="执行情况" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.enforceInfo : ''}
                                    onChange={e => this.changeSuitDetail(e.target.value.trim(), 'enforceInfo')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.litigation.refund" defaultMessage="诉讼退费" description="诉讼退费" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.refundCostStr : ''}
                                    onChange={value => this.changeSuitDetail(value.trim(), 'refundCostStr')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.other.expenditure" defaultMessage="其他支出" description="其他支出" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={suitDetail ? suitDetail.otherFeeStr : ''}
                                    onChange={value => this.changeSuitDetail(value.trim(), 'otherFeeStr')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.enclosure" defaultMessage="附件" description="附件" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                {
                                    edit
                                        ? (
                                            <Upload
                                                fileList={fileList}
                                                withCredentials={true}
                                                action={Req.uploadFile}
                                                data={{ userId: userInfo.userId }}
                                                onChange={res => this.uploadFileChange(res, 'fileList')}
                                                beforeUpload={file => this.beforeUpload(file)}
                                            >
                                                <a>
                                                    <Icon type='upload' />
                                                    <FormattedMessage id="case.enclosure.report.upload" defaultMessage="附件报告上传" description="附件报告上传" />
                                                </a>
                                            </Upload>
                                        )
                                        : (
                                            suitDetail.listFile.map(item => (
                                                <div className="ant-upload-list ant-upload-list-text" key={item.uid}>
                                                    <div className="ant-upload-list-item ant-upload-list-item-done">
                                                        <div className="ant-upload-list-item-info">
                                                            <span>
                                                                <Icon type="paper-clip" theme="outlined" />
                                                                <a href={item.url} className="ant-upload-list-item-name">{item.name}</a>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.suggest" defaultMessage="建议" description="建议" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                {
                                    edit
                                        ? (
                                            <TextArea
                                                rows={15}
                                                disabled={!edit}
                                                value={suitDetail ? suitDetail.suggest : ''}
                                                onChange={e => this.changeSuitDetail(e.target.value, 'suggest')}
                                            />
                                        )
                                        : (
                                            <div className="case-text-area-info">
                                                {suitDetail ? suitDetail.suggest : ''}
                                            </div>
                                        )
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
                {
                    edit
                        ? (
                            <div className="btns">
                                <Button onClick={() => this.submitChange()} type='primary'><FormattedMessage id="global.determine" defaultMessage="确定" /></Button>
                                <Button onClick={() => this.cancelChange()}><FormattedMessage id="global.cancel" defaultMessage="取消" /></Button>
                            </div>
                        )
                        : ''
                }
            </div >
        )
    }
}

export default injectIntl(SuitDetail)