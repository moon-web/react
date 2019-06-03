import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Col, Row } from 'antd';
import './common.css';
import '../new_monitoring_rules/index.css'
import Contnet from '../../common/layout/content/index';
import PictureModal from '../../common/layout/modal/pictureModal'
import FormItem from './formitem'
class PictureRulesDetiles extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            showImage: ''
        }
    }

    componentDidMount() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        let userId = this.props.userInfo.userId;
        let id = window.location.search.split('=')[1];
        this.props.pictureRulesDetiles({ userId: userId, id })
    }

    //显示图片
    showImg(img) {
        this.setState({
            visible: true,
            showImage: img
        })
    }

    //过滤条件
    filtrationCondition(data) {
        let intl = this.props.intl;
        return (
            <li className="rulesDetailslist">
                <h3 className="title"><FormattedMessage id="monitor.condition.add.rule" defaultMessage="过滤条件" description="过滤条件" /></h3>
                {
                    data && data.length > 0 ? data.map((v, i) => (
                        <Row key={i}>
                            <span className="filtration and-connect">{intl.locale === 'en' && v.relationTypeEn ? v.relationTypeEn : v.relationType}</span>
                            <div className="filtration and-connect element">{"{"}</div>
                            <div className="rulesDetailslistLable">
                                {
                                    v.relationList ? v.relationList.map((v, i) => (
                                        <div key={i}>
                                            <span className="filtration and-connect">{intl.locale === 'en' && v.relationTypeEn ? v.relationTypeEn : v.relationType}</span>
                                            {i <= 0 ? (
                                                <h3 className="filtration keyword">{intl.locale === 'en' && v.filterTypeEn ? v.filterTypeEn : v.filterType || ''}：</h3>
                                            ) : ""}
                                            <div className="filtration">【{intl.locale === 'en' && v.filterRelationEn ? v.filterRelationEn : v.filterRelation || ''} ( {v.filterVal} )】</div>
                                        </div>
                                    )) : ""
                                }
                            </div>
                            <div className="filtration and-connect">{"}"}</div>
                        </Row>
                    )) : ''
                }
            </li>
        )
    }

    //查询条件
    queryCriteria(data) {
        let intl = this.props.intl
        return (
            <li className="rulesDetailslist">
                <h3 className="title">
                    <FormattedMessage id="monitor.query.condition" defaultMessage="查询条件" description="查询条件" />
                </h3>
                {
                    data && data.length > 0 ? data.map((v, i) => (
                        <Row key={i}>
                            <Col span={8} className='monitoringName'>
                                <Form.Item className="rulesDetailslistLable" label={intl.formatMessage({ id: "monitor.price", defaultMessage: '价格' })}>
                                    <div>
                                        { v ? v.minPrice ? v.minPrice : 0 : "" }
                                        <span className="price"> - </span>
                                        { v ? v.maxPrice ? v.maxPrice  : "∞" : ''}
                                    </div>
                                </Form.Item>
                            </Col>
                            <FormItem col={8} label={intl.formatMessage({ id: "monitor.keyword", defaultMessage: "关键字" })} text={v ? v.keyword : ""} />
                            <FormItem col={8} label={intl.formatMessage({ id: "monitor.address", defaultMessage: "发货地" })} text={v ? v.consignmentPlace : ""} />
                            <FormItem col={8} label={intl.formatMessage({ id: "monitor.sort.type", defaultMessage: "排序类型" })} text={intl.locale === 'en' ? v.sortConditionNameEn : v.sortConditionName} />
                        </Row>
                    )) : ""
                }
            </li>
        )
    }

    //图片规则详情
    pictureRulesDetiles(data) {
        let { intl } = this.props
        return (
            <ul className="rulesDetails">
                <li className="rulesDetailslist">
                    <h3 className="title">
                        <FormattedMessage id="monitoring.rule.information" defaultMessage="规则信息" description="规则信息" />
                    </h3>
                    <Row>
                        <FormItem col={24} label={intl.formatMessage({ id: "monitor.picture.rule.name", defaultMessage: "规则名称" })} text={data ? data.monitorName : ""} />
                        <FormItem col={8} label={intl.formatMessage({ id: "monitor.picture.rule.brand", defaultMessage: '所属品牌' })} text={data ? data.brandName : ""} />
                        <FormItem col={8} label={intl.formatMessage({ id: "monitor.picture.rule.monitoring.mode", defaultMessage: "监控类型" })} text={data && intl.locale === 'en' ? data.monitorTypeNameEn : data.monitorTypeName} />
                        <Col span={8} className='monitoringName'>
                            <Form.Item className="rulesDetailslistLable" label={intl.formatMessage({ id: "monitor.picture.rule.subordinate.category", defaultMessage: "所属类目" })}>
                                {
                                    intl.locale === 'en'
                                        ? data && data.categoryNameListEng
                                            ? data.categoryNameListEng.map(item => <span key={item}> {item} &nbsp;</span>)
                                            : ''
                                        : data && data.categoryNameList
                                            ? data.categoryNameList.map(item => <span key={item}> {item} &nbsp;</span>)
                                            : ''
                                }
                            </Form.Item>
                        </Col>
                        <Col span={24} className='monitoringName'>
                            <Form.Item className="rulesDetailslistLable" label={intl.formatMessage({ id: "monitor.picture.rule.sample.picture", defaultMessage: "样本图片" })}>
                                <img src={data ? data.imageUrl : ""} alt="" className="ruleImg" onClick={() => this.showImg(data ? data.imageUrl : "")}></img>
                            </Form.Item>
                        </Col>
                    </Row>
                </li>
                {
                    data.filterList && data.filterList.length <= 0 ? "" : this.filtrationCondition(data ? data.filterList : "")
                }
            </ul>
        )
    }

    //规则监控详情
    monitoringDetails(data) {
        let { intl } = this.props
        return (
            <ul className="rulesDetails">
                <li className="rulesDetailslist">
                    <h3 className="title">
                        <FormattedMessage id="monitoring.rule.information" defaultMessage="规则信息" description="规则信息" />
                    </h3>
                    <Row>
                        <FormItem col={24} label={intl.formatMessage({ id: "monitor.picture.rule.name", defaultMessage: "规则名称" })} text={data ? data.monitorName : ""} />
                        <FormItem col={8} label={intl.formatMessage({ id: "monitor.picture.rule.brand", defaultMessage: '所属品牌' })} text={data ? data.brandName : ""} />
                        <Col span={8} className='monitoringName'>
                            <Form.Item className="rulesDetailslistLable" label={intl.formatMessage({ id: "monitor.monitoring.platform", defaultMessage: "监控平台" })}>
                                {
                                    intl.locale === 'en'
                                        ? data && data.platNameListEng
                                            ? data.platNameListEng.map(item => <span key={item}>{item} &nbsp;</span>)
                                            : ''
                                        : data && data.platNameList
                                            ? data.platNameList.map(item => <span key={item}>{item} &nbsp;</span>)
                                            : ""
                                }
                            </Form.Item>
                        </Col>
                        <FormItem col={8} label={intl.formatMessage({ id: "monitor.picture.rule.monitoring.mode", defaultMessage: "监控类型" })} text={intl.locale === 'en' ? data.monitorTypeNameEng : data.monitorTypeName} />
                    </Row>
                </li>
                {this.queryCriteria(data ? data.monitorConditions : "")}
                {
                    data.filterList && data.filterList.length <= 0 ? "" : this.filtrationCondition(data ? data.filterList : "")
                }
            </ul>
        )
    }

    //手动监控详情
    manualRuleDetails(data) {
        let { intl } = this.props
        return (
            <ul className="rulesDetails">
                <li className="rulesDetailslist">
                    <h3 className="title">
                        <FormattedMessage id="monitoring.rule.information" defaultMessage="规则信息" description="规则信息" />
                    </h3>
                    <Row>
                        <FormItem col={24} label={intl.formatMessage({ id: "monitor.picture.rule.name", defaultMessage: "规则名称" })} text={data ? data.monitorName : ""} />
                        <FormItem col={8} label={intl.formatMessage({ id: "monitor.picture.rule.brand", defaultMessage: '所属品牌' })} text={data ? data.brandName : ""} />
                        <FormItem col={8} label={intl.formatMessage({ id: "monitor.picture.rule.link.type", defaultMessage: "链接类型" })} text={data.urlTypeNameEng && intl.locale === 'en' ? data.urlTypeNameEng : data.urlTypeName} />
                        <FormItem col={8} label={intl.formatMessage({ id: "monitor.picture.rule.monitoring.mode", defaultMessage: "监控类型" })} text={data.monitorTypeNameEng && intl.locale === 'en' ? data.monitorTypeNameEng : data.monitorTypeName} />
                        <Col span={24} className='monitoringName'>
                            <Form.Item className="rulesDetailslistLable" label={intl.formatMessage({ id: "monitor.input.link", defaultMessage: "输入链接" })}>
                                {
                                    data ?
                                        data.urlList ? data.urlList.map((v, i) => (
                                            <div className="urlList" key={i}>
                                                <a href={v} target="_blank">{v}</a>
                                            </div>
                                        )) : ""
                                        : ""
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                </li>
                {
                    data.filterList && data.filterList.length <= 0 ? "" : this.filtrationCondition(data ? data.filterList : "")
                }
            </ul>
        )
    }

    render() {
        let { visible } = this.state
        let { monitorDetailsList } = this.props
        let view = '', breadcrumbData = [
            { link: '/', titleId: "router.home", title: '首页' },
            { link: '/monitor/rule', query: { goback: true }, titleId: "router.data.monitoring", title: '数据监测管理' },
            { link: '/monitor/rule', query: { goback: true }, titleId: "router.monitoring.rlue.management", title: '监控规则管理' },
            { link: '', titleId: "router.monitoring.rlue.detail", title: '监控规则详情' },
        ];
        if (monitorDetailsList) {
            if (monitorDetailsList.sourceType === 1) {
                breadcrumbData[breadcrumbData.length - 1] = { link: '', titleId: "router.monitoring.rlue.detail", title: '监控规则详情' };
                view = this.monitoringDetails(monitorDetailsList)
            } else if (monitorDetailsList.sourceType === 3) {
                breadcrumbData[breadcrumbData.length - 1] = { link: '', titleId: "router.manual.rlue.detail", title: '手动规则详情' };
                view = this.manualRuleDetails(monitorDetailsList)
            } else if (monitorDetailsList.sourceType === 4) {
                breadcrumbData[breadcrumbData.length - 1] = { link: '', titleId: "router.picture.rlue.detail", title: '图片规则详情' };
                view = this.pictureRulesDetiles(monitorDetailsList)
            }
        }

        return (
            <Contnet breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    {view}
                    <PictureModal
                        visible={visible}
                        onCancel={() => this.setState({ visible: false })}
                        showImg={this.state.showImage}
                    />
                </div>
            </Contnet>
        )
    }
}
export default injectIntl(PictureRulesDetiles)