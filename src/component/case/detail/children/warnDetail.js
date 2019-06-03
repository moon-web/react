import React from 'react'
import { Col, Input, Row, Button, Upload, Select, DatePicker, Icon } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import Common from './common'
import Req from '../../../../api/req'
import { getButtonPrem} from '../../../../utils/util'
const Option = Select.Option;

class WarnDetail extends Common {
    constructor(props) {
        super(props)
        this.state = {
            warnDetail: {},
            edit: false,
            fileList: []
        }
    }

    componentWillMount() {
        let { warnDetail } = this.props;
        this.getDetail(warnDetail)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.warnDetail !== this.props.warnDetail) {
            let { warnDetail } = nextProps;
            this.getDetail(warnDetail)
        }
    }

    // 获取详情
    getDetail(warnDetail) {
        if (warnDetail) {
            let fileList = [];
            if (warnDetail.listFile.length) {
                for (let i = 0; i < warnDetail.listFile.length; i++) {
                    const element = warnDetail.listFile[i];
                    element.uid = element.id || element.uid
                    element.name = element.fileName
                    element.url = element.fileUrl
                    element.status = 'done'
                }
                fileList = JSON.stringify(warnDetail.listFile)
                fileList = JSON.parse(fileList)
            }
            this.setState({
                warnDetail: Object.assign({}, warnDetail),
                fileList
            })
        }
    }

    // 修改
    changeWarnDetail(value, key) {
        let { warnDetail } = this.state;
        warnDetail[key] = value;
        this.setState({
            warnDetail
        })
    }

    // 取消更改
    cancelChange() {
        let { warnDetail } = this.props;
        if (warnDetail) {
            this.getDetail(warnDetail)
            this.setState({
                edit: false,
            })
        }
    }

    // 提交更改
    submitChange() {
        let { warnDetail, fileList } = this.state;
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
        warnDetail.listFile = listFile;
        this.props.updateWarnDetail(warnDetail, () => {
            this.setState({
                edit: false
            })
        })
    }

    render() {
        let { warnDetail, edit, fileList } = this.state;
        let { userInfo, typeListWran, intl , permissionList} = this.props;
        return (
            <div className="tab-info">
                {
                    !edit ? getButtonPrem( permissionList,'003001006' )?<a className="edit" onClick={() => this.setState({ edit: true })}><FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" /></a>
                        : '':''
                }
                <div className="tab-info-content">
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.letter" defaultMessage="警告信状态" description="警告信状态" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Select
                                    disabled={!edit}
                                    value={warnDetail ? warnDetail.warnStatus : undefined}
                                    onChange={value => this.changeWarnDetail(value, 'warnStatus')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        typeListWran && typeListWran.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.id}>{intl.locale==='zh'?opt.dictLabel:opt.dictLabelEn}</Option>)
                                    }
                                </Select>
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.sending.body" defaultMessage="发送主体" description="发送主体" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={warnDetail ? warnDetail.sendSubject : ''}
                                    onChange={e => this.changeWarnDetail(e.target.value.trim(), 'sendSubject')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.sending.date" defaultMessage="发送日期" description="发送日期" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                {
                                    warnDetail && !edit ? <span className="time">{warnDetail.gmtSend}</span>
                                        : (
                                            <DatePicker
                                                disabled={!edit}
                                                value={warnDetail && warnDetail.gmtSend ? moment(warnDetail.gmtSend, "YYYY-MM-DD") : null}
                                                onChange={(date, dateStr) => this.changeWarnDetail(dateStr, 'gmtSend')}
                                            />
                                        )
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.delivery.situation" defaultMessage="送达情况" description="送达情况" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={warnDetail ? warnDetail.sendInfo : ''}
                                    onChange={e => this.changeWarnDetail(e.target.value.trim(), 'sendInfo')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.note" defaultMessage="备注" description="备注" />:
                            </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={warnDetail ? warnDetail.memo : ''}
                                    onChange={e => this.changeWarnDetail(e.target.value.trim(), 'memo')}
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
                                                    <FormattedMessage id="case.warning.letter.upload" defaultMessage="警告信上传" description="警告信上传" />
                                                </a>
                                            </Upload>
                                        )
                                        : (
                                            warnDetail.listFile.map(item => (
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
            </div>
        )
    }
}

export default injectIntl(WarnDetail)