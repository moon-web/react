import React from 'react'
import { Col, Input, Row, Button, Upload, Select, Icon } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import { getButtonPrem } from '../../../../utils/util'
import Common from './common'
import InputNumber from '../../../common/form/numberInput'
// formattedFileList, beforeUpload, uploadFileChange, getName 方法均继承自Common组件
import Req from '../../../../api/req'
const Option = Select.Option;
const TextArea = Input.TextArea;

class CaseDetail extends Common {
    constructor(props) {
        super(props)
        this.state = {
            caseDetail: {},
            edit: false,
            reportFileList: [],
            docFileList: []
        }
    }

    componentWillMount() {
        let { caseDetail } = this.props;
        this.getDetail(caseDetail)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.caseDetail !== this.props.caseDetail) {
            let { caseDetail } = nextProps;
            this.getDetail(caseDetail)
        }
    }

    // 获取详情
    getDetail(caseDetail) {
        if (caseDetail) {
            let listFile = caseDetail.listFile;
            let reportFileList = [];
            let docFileList = [];
            if (listFile) {
                for (let i = 0; i < listFile.length; i++) {
                    const element = listFile[i];
                    element.uid = element.id || element.uid
                    element.name = element.fileName
                    element.url = element.fileUrl
                    element.status = 'done'
                    if (element.fileType === 1) {
                        reportFileList.push(element)
                    } else {
                        docFileList.push(element)
                    }
                }
            }
            this.setState({
                caseDetail: Object.assign({}, caseDetail),
                reportFileList,
                docFileList
            })
        }
    }

    // 修改
    changeCaseDetail(value, key) {
        let { caseDetail } = this.state;
        caseDetail[key] = value;
        this.setState({
            caseDetail
        })
    }

    // 取消更改
    cancelChange() {
        let { caseDetail } = this.props;
        if (caseDetail) {
            this.setState({
                caseDetail: Object.assign({}, caseDetail),
                edit: false
            })
        }
    }

    // 提交更改
    submitChange() {
        let { caseDetail, docFileList, reportFileList } = this.state;
        let listFile = [];
        if (docFileList.length) {
            for (let i = 0; i < docFileList.length; i++) {
                const element = docFileList[i];
                listFile.push({
                    fileName: element.name,
                    fileType: 2,
                    fileUrl: element.url
                })
            }
        }
        if (reportFileList.length) {
            for (let i = 0; i < reportFileList.length; i++) {
                const element = reportFileList[i];
                listFile.push({
                    fileName: element.name,
                    fileType: 1,
                    fileUrl: element.url
                })
            }
        }
        caseDetail.listFile = listFile;
        let { updateCaseDetail } = this.props;
        updateCaseDetail(caseDetail, () => {
            this.setState({
                edit: false
            })
        })
    }

    render() {
        let { caseDetail, edit, reportFileList, docFileList } = this.state;
        let { intl, userInfo, brandList, prodList, infringementList, casePlatform, typeListCase, typecaseList,permissionList } = this.props;
        return (
            <div className="tab-info">
                {
                    !edit ? getButtonPrem(permissionList,'003001006') ?
                        <a className="edit" onClick={() => this.setState({ edit: true })}><FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" /></a>
                        : '':""
                }
                <div className="tab-info-content">
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.state" defaultMessage="案件状态" description="案件状态" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                <Select
                                    disabled={!edit}
                                    value={caseDetail ? caseDetail.caseSchedule : ''}
                                    onChange={value => this.changeCaseDetail(value, 'caseSchedule')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        typeListCase && typeListCase.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.id}>{intl.locale==='zh'?opt.dictLabel:opt.dictLabelEn}</Option>)
                                    }
                                </Select>
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.sales.volume" defaultMessage="销售商品数" description="销售商品数" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={caseDetail ? caseDetail.saleProdNum : ''}
                                    onChange={value => this.changeCaseDetail(value.trim(), 'saleProdNum')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.average.selling.price.of.goods" defaultMessage="销售商品均价" description="销售商品均价" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={caseDetail ? caseDetail.saleProdPriceStr : ''}
                                    onChange={value => this.changeCaseDetail(value.trim(), 'saleProdPriceStr')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.value.of.a.case" defaultMessage="案值" description="案值" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                <InputNumber
                                    disabled={!edit}
                                    value={caseDetail ? caseDetail.saleProdMoneyStr : ''}
                                    onChange={value => this.changeCaseDetail(value.trim(), 'saleProdMoneyStr')}
                                />
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.tort" defaultMessage="侵权类型" description="侵权类型" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                <Select
                                    disabled={!edit}
                                    value={caseDetail ? caseDetail.tortsType : undefined}
                                    onChange={value => this.changeCaseDetail(value, 'tortsType')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        infringementList && infringementList.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.id}>{intl.locale==='zh'?opt.dictLabel:opt.dictLabelEn}</Option>)
                                    }
                                </Select>
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.brand" defaultMessage="侵权品牌" description="侵权品牌" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                <Select
                                    disabled={!edit}
                                    value={caseDetail ? caseDetail.brandId : undefined}
                                    onChange={value => this.changeCaseDetail(value, 'brandId')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        brandList && brandList.filter(item => item.isDelete === 0)
                                            .map(opt => <Option value={opt.id} key={opt.id}>{opt.name}</Option>)
                                    }
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.product.kind" defaultMessage="产品分类" description="产品分类" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                <Select
                                    disabled={!edit}
                                    value={caseDetail ? caseDetail.prodTypeId : undefined}
                                    onChange={value => this.changeCaseDetail(value, 'prodTypeId')}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        prodList && prodList.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.id} key={opt.id}>{intl.locale==='zh'?opt.name:opt.nameEn}</Option>)
                                    }
                                </Select>
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.platform.souzai" defaultMessage="所在平台" description="所在平台" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                <Select
                                    disabled={!edit}
                                    value={caseDetail ? caseDetail.platformTypeId : undefined}
                                    onChange={value => this.changeCaseDetail(value, 'platformTypeId')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        casePlatform && casePlatform.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.id}>{intl.locale==='zh'?opt.dictLabel:opt.dictLabelEn}</Option>)
                                    }
                                </Select>
                            </div>
                        </Col>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.type" defaultMessage="案件类型" description="案件类型" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                <Select
                                    disabled={!edit}
                                    value={caseDetail ? caseDetail.caseType : undefined}
                                    onChange={value => this.changeCaseDetail(value, 'caseType')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        typecaseList && typecaseList.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.id}>{intl.locale==='zh'?opt.dictLabel:opt.dictLabelEn}</Option>)
                                    }
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.location.of.case" defaultMessage="案件所在地" description="案件所在地" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                <Input
                                    disabled={!edit}
                                    value={caseDetail ? caseDetail.caseAddr : ''}
                                    onChange={e => this.changeCaseDetail(e.target.value.trim(), 'caseAddr')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.case.report" defaultMessage="案件相关报告" description="案件相关报告" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                {
                                    edit
                                        ? (
                                            <Upload
                                                fileList={reportFileList}
                                                withCredentials={true}
                                                action={Req.uploadFile}
                                                data={{ userId: userInfo.userId }}
                                                onChange={res => this.uploadFileChange(res, 'reportFileList')}
                                                beforeUpload={file => this.beforeUpload(file)}
                                            >
                                                <a >
                                                    <Icon type='upload' />
                                                    <FormattedMessage id="case.uploading.case.report" defaultMessage="案件相关报告上传" description="案件相关报告上传" />
                                                </a>
                                            </Upload>
                                        )
                                        : (
                                            reportFileList.map(item => (
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
                        <Col span={8} className="case-detail-flex">
                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                <FormattedMessage id="case.legal.documents.no" defaultMessage="法律文书" description="法律文书" />:
                                    </p>
                            <div className="case-detail-input-wrap">
                                {
                                    edit
                                        ? (
                                            <Upload
                                                fileList={docFileList}
                                                action={Req.uploadFile}
                                                withCredentials={true}
                                                data={{ userId: userInfo.userId }}
                                                onChange={res => this.uploadFileChange(res, 'docFileList')}
                                                beforeUpload={file => this.beforeUpload(file)}
                                            >
                                                <a>
                                                    <Icon type='upload' />
                                                    <FormattedMessage id="case.legal.documents" defaultMessage="法律文书上传" description="法律文书上传" />
                                                </a>
                                            </Upload>
                                        )
                                        : (
                                            docFileList.map(item => (
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
                                                value={caseDetail ? caseDetail.suggest : ''}
                                                onChange={e => this.changeCaseDetail(e.target.value, 'suggest')}
                                            />
                                        )
                                        : (
                                            <div className="case-text-area-info">
                                                {caseDetail ? caseDetail.suggest : ''}
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

            </div>
        )
    }
}

export default injectIntl(CaseDetail)