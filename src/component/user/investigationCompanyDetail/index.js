import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Col, Row } from 'antd'
import Content from '../../common/layout/content'
import PictureModal from '../../common/layout/modal/pictureModal'
import { queryUrlParams, getName } from '../../../utils/util'

export default class InvestigatorCompanyDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: '',
            audit: false,
            type: '',
            visible: false,
            showImg: ''
        }
    }

    componentWillMount() {
        let id = queryUrlParams('userId');
        let audit = queryUrlParams('audit');
        let type = queryUrlParams('type');
        this.setState({
            id,
            audit,
            type
        })
        this.getDetail(id)
    }

    // 获取详情
    getDetail(id) {
        let { getInvestigationDetail } = this.props;
        if (getInvestigationDetail) {
            getInvestigationDetail({ b2bUserId: id })
        }
    }

    // 更新状态
    updateInvestigator(status) {
        let { id } = this.state;
        let { updateInvestigationItem, investigationList, companyDetail, userInfo, b2bUserApplyStatus } = this.props;
        let data = {
            userId: userInfo.userId,
            b2bUserId: id,
            checkStatus: status
        }
        let checkStatus = getName(b2bUserApplyStatus, data.checkStatus);
        data.checkStatusName = checkStatus.dictLabel;
        data.checkStatusNameEn = checkStatus.dictLabelEn;
        updateInvestigationItem(data, investigationList, companyDetail)
    }

    render() {
        let { companyDetail } = this.props;
        let { audit, visible, showImg, type } = this.state;
        let breadcrumbData = []
        if (type === '1') {
            breadcrumbData = [
                { link: '/', titleId: 'router.home', title: '首页' },
                { link: '', titleId: 'router.user.management', title: '用户管理' },
                { link: '/users/investigator', titleId: 'router.investigator.management', title: '调查员管理', query: { goback: true } },
                { link: '', titleId: 'router.investigator.company.detail', title: '调查公司详情' }
            ];
        } else {
            breadcrumbData = [
                { link: '/', titleId: 'router.home', title: '首页' },
                { link: '', titleId: 'router.user.management', title: '用户管理' },
                { link: '/users/investigatorApply', titleId: 'router.investigator.application.management', title: '调查员申请管理', query: { goback: true } },
                { link: '', titleId: 'router.investigator.company.detail', title: '调查公司详情' }
            ];
        }
        return (
            <Content className="investigation-detail" breadcrumbData={breadcrumbData}>
                <div className="basic-info">
                    <div className="investigation-info-title">
                        <FormattedMessage id="users.essential.information" defaultMessage="基本信息" description="基本信息" />
                    </div>
                    <Row>
                        <Col span={8} className="info-flex inline-top">
                            <p className="info-label text">
                                <FormattedMessage id="users.name.of.person.in.charge" defaultMessage="负责人姓名" description="负责人姓名" /> :
                            </p>
                            <div className="input-wrap text">
                                {companyDetail && companyDetail.chargeName ? companyDetail.chargeName : ''}
                            </div>
                        </Col>
                        <Col span={8} className="info-flex inline-top">
                            <p className="info-label text">
                                <FormattedMessage id="users.responsible.person.nickname" defaultMessage="负责人昵称" description="负责人昵称" /> :
                            </p>
                            <div className="input-wrap text">
                                {companyDetail && companyDetail.chargeNick ? companyDetail.chargeNick :''}
                            </div>
                        </Col>
                        <Col span={8} className="info-flex inline-top">
                            <p className="info-label text">
                                <FormattedMessage id="users.responsible.person.mobile" defaultMessage="负责人手机" description="负责人手机" /> :
                            </p>
                            <div className="input-wrap text">
                                {companyDetail && companyDetail.mobile ? companyDetail.mobile :''}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="info-flex inline-top">
                            <p className="info-label text">
                                <FormattedMessage id="users.company.size" defaultMessage="公司规模" description="公司规模" /> :
                            </p>
                            <div className="input-wrap text">
                                {companyDetail && companyDetail.scale ? companyDetail.scale :''}
                            </div>
                        </Col>
                        <Col span={8} className="info-flex inline-top">
                            <p className="info-label text">
                                <FormattedMessage id="users.constact.address" defaultMessage="联系地址" description="联系地址" /> :
                            </p>
                            <div className="input-wrap text">
                                {companyDetail ? `${companyDetail.address ? companyDetail.address : ''} ${companyDetail.detailAddress ? companyDetail.detailAddress :''}` : ''}
                            </div>
                        </Col>
                        <Col span={8} className="info-flex inline-top">
                            <p className="info-label text">
                                <FormattedMessage id="users.law.enforcement.resources" defaultMessage="执法资源" description="执法资源" /> :
                            </p>
                            <div className="input-wrap text">
                                {
                                    companyDetail && companyDetail.lawResource
                                        ? companyDetail.lawResource === '1'
                                            ? <FormattedMessage id="users.public.security.scope" defaultMessage="公安范围" description="公安范围" />
                                            : companyDetail.lawResource === '2'
                                                ? <FormattedMessage id="users.industrial.and.commercial.scope" defaultMessage="工商范围" description="工商范围" />
                                                : ''
                                        : ''
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="info-flex inline-top">
                            <p className="info-label text">
                                <FormattedMessage id="users.overlay.area" defaultMessage="覆盖区域" description="覆盖区域" /> :
                            </p>
                            <div className="input-wrap text">
                                {
                                    companyDetail && companyDetail.coverRange
                                        ? companyDetail.coverRange.map(item => (
                                            <div key={item.coverRange}>
                                                {item.coverRange}
                                            </div>
                                        ))
                                        : ''
                                }
                            </div>
                        </Col>
                        {
                            companyDetail && companyDetail.lawResource
                                ? companyDetail.lawResource === '2'
                                    ? (
                                        <Col span={8} className="info-flex inline-top">
                                            <p className="info-label text">
                                                <FormattedMessage id="users.industrial.and.commercial.scope" defaultMessage="工商范围" description="工商范围" /> :
                                                </p>
                                            <div className="input-wrap text">
                                                {
                                                    companyDetail && companyDetail.iacRange
                                                        ? companyDetail.iacRange.map(item => (<div key={item}>{item}</div>))
                                                        : ''
                                                }
                                            </div>
                                        </Col>
                                    )
                                    : companyDetail.lawResource === '1'
                                        ? (
                                            <Col span={8} className="info-flex inline-top">

                                                <p className="info-label text">
                                                    <FormattedMessage id="users.public.security.scope" defaultMessage="公安范围" description="公安范围" /> :
                                            </p>
                                                <div className="input-wrap text">
                                                    {
                                                        companyDetail && companyDetail.policeRange
                                                            ? companyDetail.policeRange.map(item => (<div key={item}>{item}</div>))
                                                            : ''
                                                    }
                                                </div>
                                            </Col>
                                        )
                                        : ''
                                : ''
                        }
                    </Row>
                    <Row>
                        <Col span={8} className="info-flex">
                            <p className="info-label text">
                                <FormattedMessage id="users.business.license" defaultMessage="营业执照" description="营业执照" /> :
                            </p>
                            <div className="input-wrap text">
                                {
                                    companyDetail && companyDetail.businessLicence
                                        ? companyDetail.businessLicence.split(',').map((item, i) => (
                                            <div className="pic-wrap" onClick={() => this.setState({ visible: true, showImg: item })} key={i}><img src={item} alt={item} /></div>
                                        ))
                                        : ''
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
                {
                    audit
                        ? (
                            <div className="btns">
                                <Button type="primary" onClick={() => this.updateInvestigator(1)}>
                                    <FormattedMessage id="global.pass" defaultMessage="通过" description="通过" />
                                </Button>
                                <Button onClick={() => this.updateInvestigator(2)}>
                                    <FormattedMessage id="global.fail" defaultMessage="不通过" description="不通过" />
                                </Button>
                            </div>
                        )
                        : ''
                }
                <PictureModal
                    showImg={showImg}
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                />
            </Content>
        )
    }
}
