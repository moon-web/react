import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Col, DatePicker, Row, Input, Select, message, Cascader } from 'antd'
import Content from '../../common/layout/content'
import InputNumber from '../../common/form/numberInput'
import { queryUrlParams, getName } from '../../../utils/util'
import moment from 'moment'
import addressCascaderOptions from '../../common/cascader/address'

import './index.css'
const Option = Select.Option;
const TextArea = Input.TextArea;

export default class InvestigatorDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: '',
            audit: false,
            type: '',
            isWork: undefined,  // 是否在职
            email: '',  // 邮箱
            currentAddress: '',  // 现居地址
            idNo: '',  // 身份证号
            experience: '',  // 工作经历
            industry: '', // 熟悉行业
            workTime: '',  // 从业时间
            coverRange: [],  // 覆盖区域
            successExample: '',  // 成功案例
            result: ''
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
        if (this.props.getInvestigationDetail) {
            this.props.getInvestigationDetail({ b2bUserId: id })
        }
    }

    // 关闭标签
    handleCloseTag(item) {
        let coverRange = this.state.coverRange;
        let result = coverRange.filter(val => val.key !== item.key)
        this.setState({
            coverRange: result
        })
    }

    // 覆盖地区输入框失去焦点/回车
    handleBlurResult() {
        let { result, coverRange } = this.state;
        let obj = {
            coverRange: [],
            key: []
        };
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            obj.coverRange.push(element.label);
            obj.key.push(element.value);
        }
        obj.coverRange = obj.coverRange.join('-');
        obj.key = obj.key.join('');
        for (let i = 0; i < coverRange.length; i++) {
            const element = coverRange[i];
            if (obj.key === element.key) {
                this.setState({
                    result: []
                })
                return
            }
        }
        coverRange.push(obj)
        this.setState({
            coverRange,
            result: []
        })
    }

    // email输入框失去焦点
    handleBlurEmail() {
        let email = this.state.email;
        if (email.trim() !== '' && !(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email))) {
            message.info('输入的邮箱格式不正确，请重新输入')
        }
    }

    // 校验身份证号
    checkIdNo() {
        let idNo = this.state.idNo;
        if (idNo.trim() !== '' && !(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(idNo))) {
            message.info('输入的身份证号不正确，请重新输入')
        }
    }

    changeAddress(val, option) {
        if (option) {
            this.setState({
                result: option
            }, () => {
                this.handleBlurResult()
            })
        }
    }

    // 修改信心
    handleChange(val, key) {
        this.setState({
            [key]: val
        })
    }

    // 更新状态
    updateInvestigator(status) {
        let { isWork, email, currentAddress, idNo, experience, industry, workTime, coverRange, successExample, id } = this.state;
        if (!isWork) {
            message.info('请选择是否在职')
            return
        } else if (!email || !(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email))) {
            message.info('请输入正确的邮箱地址')
            return
        } else if (!currentAddress) {
            message.info('请输入现居地址')
            return
        } else if (idNo==='' || !(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(idNo))) {
            message.info('输入的身份证号不正确，请重新输入')
        } else if (!experience) {
            message.info('请输入工作经历')
            return
        } else if (!industry) {
            message.info('请输入熟悉行业')
            return
        } else if (!workTime) {
            message.info('请选择从业时间')
            return
        } else if (!coverRange) {
            message.info('请输入覆盖区域')
            return
        } else if (!successExample) {
            message.info('请输入成功案例')
            return
        }
        let { updateInvestigationItem, investigationList, detail, userInfo, b2bUserApplyStatus } = this.props;
        let data = {
            userId: userInfo.userId,
            b2bUserId: id,
            checkStatus: status,
            isWork,
            email,
            currentAddress,
            idNo,
            experience,
            industry,
            workTime,
            successExample,
            coverRange: JSON.stringify(coverRange)
        }
        let checkStatus = getName(b2bUserApplyStatus, data.checkStatus);
        data.checkStatusName = checkStatus.dictLabel;
        data.checkStatusNameEn = checkStatus.dictLabelEn;
        updateInvestigationItem(data, investigationList, detail)
    }

    render() {
        let { intl, detail } = this.props;
        let { audit, coverRange, isWork, idNo, industry, successExample, experience, email, currentAddress, workTime, result, type } = this.state;
        let breadcrumbData = []
        if (type === '1') {
            breadcrumbData = [
                { link: '/', titleId: 'router.home', title: '首页' },
                { link: '', titleId: 'router.user.management', title: '用户管理' },
                { link: '/users/investigator', titleId: 'router.investigator.management', title: '调查员管理', query: { goback: true } },
                { link: '', titleId: 'router.investigator.detail', title: '调查员详情' }
            ];
        } else {
            breadcrumbData = [
                { link: '/', titleId: 'router.home', title: '首页' },
                { link: '', titleId: 'router.user.management', title: '用户管理' },
                { link: '/users/investigatorApply', titleId: 'router.investigator.application.management', title: '调查员申请管理', query: { goback: true } },
                { link: '', titleId: 'router.investigator.detail', title: '调查员详情' }
            ];
        }
        return (
            <Content className="investigation-detail" breadcrumbData={breadcrumbData}>
                <div className="basic-info bottom-line">
                    <div className="investigation-info-title">
                        <FormattedMessage id="users.essential.information" defaultMessage="基本信息" description="基本信息" />
                    </div>
                    <Row>
                        <Col span={8} className="info-flex">
                            <p className="info-label text">
                                <FormattedMessage id="users.user.investigator.name" defaultMessage="调查员姓名" description="调查员姓名" /> :
                            </p>
                            <div className="input-wrap text">
                                {detail && detail.name ? detail.name : ''}
                            </div>
                        </Col>
                        <Col span={8} className="info-flex">
                            <p className="info-label text">
                                <FormattedMessage id="users.user.investigator.nick" defaultMessage="调查员昵称" description="调查员昵称" /> :
                            </p>
                            <div className="input-wrap text">
                                {detail && detail.nickName ? detail.nickName : ''}
                            </div>
                        </Col>
                        <Col span={8} className="info-flex">
                            <p className="info-label text">
                                <FormattedMessage id="users.user.investigator.mobile" defaultMessage="调查员手机" description="调查员手机" /> :
                            </p>
                            <div className="input-wrap text">
                                {detail && detail.mobile ? detail.mobile : ''}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="info-flex">
                            <p className="info-label text">
                                <FormattedMessage id="users.user.investigator.name.of.recommender" defaultMessage="推荐人姓名" description="推荐人姓名" /> :
                            </p>
                            <div className="input-wrap text">
                                {detail && detail.parentName ? detail.parentName : ''}
                            </div>
                        </Col>
                        <Col span={8} className="info-flex">
                            <p className="info-label text">
                                <FormattedMessage id="users.user.investigator.recommender.nick" defaultMessage="推荐人昵称" description="推荐人昵称" /> :
                            </p>
                            <div className="input-wrap text">
                                {detail && detail.parentNick ? detail.parentNick :''}
                            </div>
                        </Col>
                        <Col span={8} className="info-flex">
                            <p className="info-label text">
                                <FormattedMessage id="users.user.investigator.recommender.mobile.phone" defaultMessage="推荐人手机" description="推荐人手机" /> :
                            </p>
                            <div className="input-wrap text">
                                {detail && detail.parentMobile ? detail.parentMobile : ''}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="info-flex">
                            <p className="info-label text">
                                <FormattedMessage id="users.user.investigator.address" defaultMessage="联系地址" description="联系地址" /> :
                            </p>
                            <div className="input-wrap text">
                                {detail && detail.address ? detail.address :''}
                            </div>
                        </Col>
                        <Col span={8} className="info-flex">
                            <p className="info-label text">
                                <FormattedMessage id="users.user.investigator.engage.in.investigation" defaultMessage="从事调查" description="从事调查" /> :
                            </p>
                            <div className="input-wrap text">
                                {detail && detail.experience ? detail.experience : ''}
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className={audit ? "supplement-info bottom-line" : "supplement-info"}>
                    <div className="investigation-info-title">
                        <FormattedMessage id="users.additional.information" defaultMessage="补全信息" description="补全信息" />
                    </div>
                    <Row>
                        <Col span={8} className="info-flex">
                            <p className={audit ? "info-label" : "info-label text"}>
                                <FormattedMessage id="users.user.investigator.on.the.job" defaultMessage="是否在职" description="是否在职" /> :
                            </p>
                            <div className={audit ? "input-wrap" : "input-wrap text"}>
                                {
                                    audit
                                        ? <Select
                                            value={isWork}
                                            onChange={val => this.handleChange(val, 'isWork')}
                                            placeholder={intl.formatMessage({ id: "users.choice.iswork", defaultMessage: "请选择是否在职" })}
                                        >
                                            <Option value="1">是</Option>
                                            <Option value="0">否</Option>
                                        </Select>
                                        : detail && detail.isWork === 1
                                            ? '是'
                                            : '否'
                                }
                            </div>
                        </Col>
                        <Col span={8} className="info-flex">
                            <p className={audit ? "info-label" : "info-label text"}>
                                <FormattedMessage id="users.user.investigator.Mailbox" defaultMessage="邮箱" description="邮箱" /> :
                            </p>
                            <div className={audit ? "input-wrap" : "input-wrap text"}>
                                {
                                    audit
                                        ? <Input
                                            value={email}
                                            onBlur={e => this.handleBlurEmail(e.target.value.trim())}
                                            onChange={e => this.handleChange(e.target.value.trim(), 'email')}
                                            placeholder={intl.formatMessage({ id: "users.enter.email", defaultMessage: "请输入邮箱号" })}
                                        />
                                        : detail && detail.email
                                }
                            </div>
                        </Col>
                        <Col span={8} className="info-flex">
                            <p className={audit ? "info-label" : "info-label text"}>
                                <FormattedMessage id="users.user.investigator.present.address" defaultMessage="现居地址" description="现居地址" /> :
                            </p>
                            <div className={audit ? "input-wrap" : "input-wrap text"}>
                                {
                                    audit
                                        ? <Input
                                            value={currentAddress}
                                            onChange={e => this.handleChange(e.target.value.trim(), 'currentAddress')}
                                            placeholder={intl.formatMessage({ id: "users.choice.address", defaultMessage: "请选择现居地址" })}
                                        />
                                        : detail && detail.currentAddress
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="info-flex">
                            <p className={audit ? "info-label" : "info-label text"}>
                                <FormattedMessage id="users.user.investigator.id.number" defaultMessage="身份证号" description="身份证号" /> :
                            </p>
                            <div className={audit ? "input-wrap" : "input-wrap text"}>
                                {
                                    audit
                                        ? <InputNumber
                                            value={idNo}
                                            onBlur={() => this.checkIdNo()}
                                            onChange={value => this.handleChange(value.trim(), 'idNo')}
                                            placeholder={intl.formatMessage({ id: "users.enter.idno", defaultMessage: "请输入身份证号码" })}
                                        />
                                        : detail && detail.idNo
                                }
                            </div>
                        </Col>
                        <Col span={8} className="info-flex">
                            <p className={audit ? "info-label" : "info-label text"}>
                                <FormattedMessage id="users.user.investigator.work.experience" defaultMessage="工作经历" description="工作经历" /> :
                            </p>
                            <div className={audit ? "input-wrap" : "input-wrap text"}>
                                {
                                    audit
                                        ? <Input
                                            value={experience}
                                            onChange={e => this.handleChange(e.target.value.trim(), 'experience')}
                                            placeholder={intl.formatMessage({ id: "users.enter.experience", defaultMessage: "请输入工作经历" })}
                                        />
                                        : detail && detail.experience
                                }
                            </div>
                        </Col>
                        <Col span={8} className="info-flex">
                            <p className={audit ? "info-label" : "info-label text"}>
                                <FormattedMessage id="users.user.investigator.familiarity.with.the.industry" defaultMessage="熟悉行业" description="熟悉行业" /> :
                            </p>
                            <div className={audit ? "input-wrap" : "input-wrap text"}>
                                {
                                    audit
                                        ? <Input
                                            value={industry}
                                            onChange={e => this.handleChange(e.target.value.trim(), 'industry')}
                                            placeholder={intl.formatMessage({ id: "users.enter.industry", defaultMessage: "请输入熟悉行业" })}
                                        />
                                        : detail && detail.industry
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="info-flex">
                            <p className={audit ? "info-label" : "info-label text"}>
                                <FormattedMessage id="users.user.investigator.employment.time" defaultMessage="从业时间" description="从业时间" /> :
                            </p>
                            <div className={audit ? "input-wrap" : "input-wrap text"}>
                                {
                                    audit
                                        ? <DatePicker value={workTime ? moment(workTime, 'YYYY-MM-DD') : null} onChange={(date, dateStr) => this.handleChange(dateStr, 'workTime')} />
                                        : detail && detail.workTime
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {
                            audit
                                ? [
                                    <Col span={8} className="info-flex" key="labels">
                                        <p className={audit ? "info-label" : "info-label text"}>
                                            <FormattedMessage id="users.user.investigator.overlay.area" defaultMessage="覆盖区域" description="覆盖区域" /> :
                                            </p>
                                        <div className={audit ? "input-wrap" : "input-wrap text"}>
                                            {
                                                audit
                                                    ? <Cascader
                                                        value={result}
                                                        onChange={(value, selectedOptions) => this.changeAddress(value, selectedOptions)}
                                                        placeholder={intl.formatMessage({ id: "users.user.investigator.coverage", defaultMessage: "请选择覆盖区域" })}
                                                        options={addressCascaderOptions}
                                                        displayRender={label => label.join('-')}
                                                    />
                                                    : ''
                                            }
                                        </div>
                                    </Col>,
                                    <Col span={16} key="tags-wrap">
                                        {
                                            coverRange.length
                                                ? (
                                                    <div className="tags">
                                                        {
                                                            coverRange.map((item, i) => (<div className="tags" key={item.key}>{item.coverRange}<span className="close-tag" onClick={() => this.handleCloseTag(item)}>X</span></div>))
                                                        }
                                                    </div>
                                                )
                                                : <div className="msg"></div>
                                        }
                                    </Col>
                                ]
                                : (
                                    <Col span={16} className="info-flex">
                                        <p className={audit ? "info-label" : "info-label text"}>
                                            <FormattedMessage id="users.user.investigator.overlay.area" defaultMessage="覆盖区域" description="覆盖区域" /> :
                                        </p>
                                        <div className={audit ? "input-wrap" : "input-wrap text"}>
                                            {
                                                detail && detail.coverRange
                                                    ? detail.coverRange.map((item, i) => (<div className="tags" key={item.key}>{item.coverRange}</div>))
                                                    : ''
                                            }
                                        </div>
                                    </Col>
                                )
                        }
                    </Row>
                    <Row>
                        <Col span={24} className="info-flex">
                            <p className={audit ? "info-label" : "info-label text"}>
                                <FormattedMessage id="users.user.investigator.success.case" defaultMessage="成功案例" description="成功案例" /> :
                            </p>
                            <div className={audit ? "input-wrap" : "input-wrap text"}>
                                {
                                    audit
                                        ? <TextArea value={successExample} onChange={e => this.handleChange(e.target.value, 'successExample')} />
                                        : <div className="textarea-info">{detail && detail.successExample}</div>
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
            </Content>
        )
    }
}
