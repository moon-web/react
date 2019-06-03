import React, { Component } from 'react'
import { Card, Col, Input, Row, Button, message, Icon } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import { getButtonPrem} from '../../../../utils/util'
import InputNumber from '../../../common/form/numberInput';
class CompanyDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            companyDetail: [],
            edit: false,
            more: false
        }
    }

    componentWillMount() {
        let companyDetail = this.props.companyDetail;
        this.getDetail(companyDetail)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.companyDetail !== this.props.companyDetail) {
            let { companyDetail } = nextProps;
            this.getDetail(companyDetail)
        }
    }

    // 获取详情
    getDetail(companyDetail) {
        if (companyDetail) {
            companyDetail = JSON.stringify(companyDetail)
            companyDetail = JSON.parse(companyDetail)
            for (let index = 0; index < companyDetail.length; index++) {
                const element = companyDetail[index];
                element.key = Date.now() + index;
            }
            if (companyDetail) {
                this.setState({
                    companyDetail
                })
            }
        }
    }

    // 显示编辑
    showEdit() {
        this.setState({
            edit: true
        })
    }

    // 添加
    addItem() {
        let { companyDetail } = this.state;
        let item = {
            companyName: '',
            legalPerson: '',
            comRegisNumber: '',
            telephone: '',
            idCard: '',
            registerAddr: '',
            wareAddr: '',
            factoryAddr: '',
            key: Date.now()
        }
        companyDetail.push(item)
        this.setState({
            companyDetail
        })
    }

    // 删除
    deleteItem(key) {

        let { companyDetail } = this.state;
        let result = companyDetail.filter(item => item.key !== key)
        this.setState({
            companyDetail: result
        })
    }

    // 修改
    changeCompanyDetail(value, key, i) {
        let { companyDetail } = this.state;
        companyDetail[i][key] = value;
        this.setState({
            companyDetail
        })
    }

    // 取消更改
    cancelChange() {
        let { companyDetail } = this.props;
        this.getDetail(companyDetail)
        this.setState({
            edit: false,
            more: false
        })
    }

    // 提交更改
    submitChange() {
        let { companyDetail } = this.state;
        for (let i = 0; i < companyDetail.length; i++) {
            const element = companyDetail[i];
            if (!element.companyName) {
                message.info(`公司名称不能为空，请填写第${i + 1}个公司名称`);
                return
            }
        }
        let data = {
            json: companyDetail
        }
        this.props.updateCompanyDetail(data, () => {
            this.setState({
                edit: false,
                more: false
            })
        })
    }

    render() {
        let { companyDetail, edit, more } = this.state;
        let { intl,permissionList } = this.props;
        return (
            <Card
                extra={ !edit ? getButtonPrem( permissionList , '003001006' )?<a onClick={() => this.setState({ edit: true, more: true })}><FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" /></a> : '':''}
                className="case-company"
                title={intl.formatMessage({ id: "case.personal.information", defaultMessage: "企业（个人）信息", description: "企业（个人）信息" })}
            >
                <div className="case-company-list">
                    {
                        more
                            ? companyDetail && companyDetail.length
                                ? companyDetail.map((item, i) => (
                                    <div className="case-company-item" key={i}>
                                        {
                                            edit
                                                ? (
                                                    <a className="close-circle-o close_circle case-item-delete">
                                                        <Icon type="delete" onClick={() => this.deleteItem(item.key)} />
                                                    </a>
                                                )
                                                : ''
                                        }
                                        <Row>
                                        {
                                            item.companyName || edit
                                                ? (
                                                    <Col span={24} className="case-detail-flex">
                                                        <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                            <FormattedMessage id="case.corporate.name" defaultMessage="公司名称" description="公司名称" />:
                                                        </p>
                                                        <div className="case-detail-input-wrap">
                                                            <Input
                                                                disabled={!edit}
                                                                value={item.companyName}
                                                                onChange={e => this.changeCompanyDetail(e.target.value.trim(), 'companyName', i)}
                                                            />
                                                        </div>
                                                    </Col>
                                                )
                                                : ''
                                        }
                                        </Row>
                                        <Row>
                                            {
                                                item.legalPerson || edit
                                                    ? (
                                                        <Col span={12} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.legal.information" defaultMessage="法人信息" description="法人信息" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={item.legalPerson}
                                                                    onChange={e => this.changeCompanyDetail(e.target.value.trim(), 'legalPerson', i)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                            {
                                                item.comRegisNumber || edit
                                                    ? (
                                                        <Col span={12} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.registration.number" defaultMessage="企业登记号" description="企业登记号" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={item.comRegisNumber}
                                                                    onChange={e => this.changeCompanyDetail(e.target.value.trim(), 'comRegisNumber', i)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                item.telephone || edit
                                                    ? (
                                                        <Col span={12} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.contact.information" defaultMessage="联系方式" description="联系方式" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={item.telephone}
                                                                    onChange={e => this.changeCompanyDetail(e.target.value.trim(), 'telephone', i)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                            {
                                                item.idCard || edit
                                                    ? (
                                                        <Col span={12} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.id.number" defaultMessage="身份证号" description="身份证号" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <InputNumber
                                                                    disabled={!edit}
                                                                    value={item.idCard}
                                                                    onChange={value => this.changeCompanyDetail(value.trim(), 'idCard', i)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                item.registerAddr || edit
                                                    ? (
                                                        <Col span={24} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.registered.address" defaultMessage="注册地址" description="注册地址" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={item.registerAddr}
                                                                    onChange={e => this.changeCompanyDetail(e.target.value.trim(), 'registerAddr', i)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                item.factoryAddr || edit
                                                    ? (
                                                        <Col span={24} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.factory.address" defaultMessage="工厂地址" description="工厂地址" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={item.factoryAddr}
                                                                    onChange={e => this.changeCompanyDetail(e.target.value.trim(), 'factoryAddr', i)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                item.wareAddr || edit
                                                    ? (
                                                        <Col span={24} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.warehouse.address" defaultMessage="仓库地址" description="仓库地址" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={item.wareAddr}
                                                                    onChange={e => this.changeCompanyDetail(e.target.value.trim(), 'wareAddr', i)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                    </div>
                                ))
                                : ''
                            : companyDetail && companyDetail.length
                                ? (
                                    <div className="case-company-item">
                                        <Row>
                                            {
                                                companyDetail[0].companyName
                                                    ? (
                                                        <Col span={24} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.corporate.name" defaultMessage="公司名称" description="公司名称" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={companyDetail[0].companyName}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                companyDetail[0].legalPerson
                                                    ? (
                                                        <Col span={12} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.legal.information" defaultMessage="法人信息" description="法人信息" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={companyDetail[0].legalPerson}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                            {
                                                companyDetail[0].comRegisNumber
                                                    ? (
                                                        <Col span={12} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.registration.number" defaultMessage="企业登记号" description="企业登记号" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={companyDetail[0].comRegisNumber}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                companyDetail[0].telephone
                                                    ? (
                                                        <Col span={12} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.contact.information" defaultMessage="联系方式" description="联系方式" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={companyDetail[0].telephone}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                            {
                                                companyDetail[0].idCard
                                                    ? (
                                                        <Col span={12} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.id.number" defaultMessage="身份证号" description="身份证号" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <InputNumber
                                                                    disabled={!edit}
                                                                    value={companyDetail[0].idCard}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                companyDetail[0].registerAddr
                                                    ? (
                                                        <Col span={24} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.registered.address" defaultMessage="注册地址" description="注册地址" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input
                                                                    disabled={!edit}
                                                                    value={companyDetail[0].registerAddr}
                                                                />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                companyDetail[0].wareAddr
                                                    ? (
                                                        <Col span={24} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.warehouse.address" defaultMessage="仓库地址" description="仓库地址" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input disabled={!edit}  value={companyDetail[0].wareAddr} />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                        <Row>
                                            {
                                                companyDetail[0].factoryAddr
                                                    ? (
                                                        <Col span={24} className="case-detail-flex">
                                                            <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                                                                <FormattedMessage id="case.factory.address" defaultMessage="工厂地址" description="工厂地址" />:
                                                            </p>
                                                            <div className="case-detail-input-wrap">
                                                                <Input disabled={!edit} value={companyDetail[0].factoryAddr} />
                                                            </div>
                                                        </Col>
                                                    )
                                                    : ''
                                            }
                                        </Row>
                                    </div>
                                )
                                : ''
                    }
                    {
                        companyDetail && companyDetail.length > 1 && !edit
                            ? (
                                <div style={{ textAlign: 'right', lineHeight: '32px' }}>
                                    <a onClick={() => this.setState({ more: !more })}>
                                        {
                                            more
                                                ? <span><Icon type="up" theme="outlined" /><FormattedMessage id="case.take.up" defaultMessage="收起" /></span>
                                                : <span><Icon type="down" theme="outlined" /><FormattedMessage id="case.open" defaultMessage="展开" /> </span>
                                        }
                                    </a>
                                </div>
                            )
                            : ''
                    }
                    {
                        edit
                            ? (
                                <div className="btns">
                                    <div style={{ lineHeight: '32px' }}><a onClick={() => this.addItem()}><Icon type="plus" theme="outlined" /> <FormattedMessage id="global.add" defaultMessage="新增" /></a></div>
                                    <div>
                                        <Button onClick={() => this.submitChange()} type='primary'><FormattedMessage id="global.determine" defaultMessage="确定" /></Button>
                                        <Button onClick={() => this.cancelChange()}><FormattedMessage id="global.cancel" defaultMessage="取消" /></Button>
                                    </div>
                                </div>
                            )
                            : ''
                    }
                </div>
            </Card>
        )
    }
}


export default injectIntl(CompanyDetail)