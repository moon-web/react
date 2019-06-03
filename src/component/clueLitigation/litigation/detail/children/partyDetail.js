import React, { Component } from 'react'
import { Button, Col, Row, Select, Input, Radio, Form, Table, Cascader, DatePicker, Modal, message, Badge, Icon } from 'antd'
import options from '../../../../common/cascader/address';
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'
import emptyImg from '../../../../../assets/images/empty.svg'
const SelectOption = Select.Option;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm;
class PartyDetail extends Component {
    constructor() {
        super()
        this.state = {
            parties: [],            // 所有的当事人数据
            visible: false,
            contact: {
                defendantName: '',  // 姓名
                duties: '',         // 职务
                mobile: '',         // 电话
                wechat: '',         // 微信
                qq: '',             // QQ
                email: '',          // 邮箱或者传真
            },
            editKey: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.parties !== nextProps.parties) {
            let result = JSON.stringify(nextProps.parties);
            result = JSON.parse(result);
            this.setState({
                parties: result
            })
        }
    }

    changeState(key, value) {
        let { parties, editKey } = this.state;
        let { companyJson } = parties[editKey];
        if (key.indexOf('companyJson') !== -1) {
            key = key.split('.')[1]
            companyJson[key] = value;
            parties[editKey].companyJson = companyJson;
            this.setState({
                parties
            })
        } else if (key.indexOf('contact') !== -1) {
            let { contact } = this.state;
            key = key.split('.')[1]
            contact[key] = value;
            this.setState({
                contact
            })
        } else {
            if (key === 'defendantType' && value === 1) {
                parties[editKey].companyJson = {
                    companyName: '',        // 企业名称
                    companyLevel3: [],      // 三级省市区
                    companyProvince: '',    // 省
                    companyCity: '',        // 市
                    companyArea: '',        // 区
                    companyAddress: '',     // 详细地址
                    companyOnlineAddress: '',// 公司网址
                    companyMobile: '',      // 公司电话
                    companyEmail: '',       // 公司邮箱
                    companyRemark: '',      // 备注
                    registerFee: '',        // 注册资金
                    busyLicenseNumber: '',  // 营业执照号
                    registerTime: ''        // 注册时间
                };
            }
            parties[editKey][key] = value;
            this.setState({
                parties
            })
        }

    }

    // 添加当事人
    addPartieItem(key) {
        let { parties } = this.state;
        let data = {
            edit: true,
            defendantType: 2,         // 当事人类型
            defendantAttribute: '0',    // 当时人属性
            defendantName: '',          // 当事人名称
            defendantSex: '0',          // 当事人性别
            level3: [],                 // 三级省市区
            province: '',               // 省
            city: '',                   // 市
            area: '',                   // 区
            address: '',                // 详细地址
            mobile: '',                 // 电话
            email: '',                  // 邮箱
            qq: '',                     // QQ
            certityType: undefined,     // 证件类型
            certityNo: '',              // 证件号
            remark: '',                 // 备注
            companyJson: {              // 公司信息
                companyName: '',        // 企业名称
                companyLevel3: [],      // 三级省市区
                companyProvince: '',    // 省
                companyCity: '',        // 市
                companyArea: '',        // 区
                companyAddress: '',     // 详细地址
                companyOnlineAddress: '',// 公司网址
                companyMobile: '',      // 公司电话
                companyEmail: '',       // 公司邮箱
                companyRemark: '',      // 备注
                registerFee: '',        // 注册资金
                busyLicenseNumber: '',  // 营业执照号
                registerTime: ''        // 注册时间
            },
            contactJson: [              // 联系人信息数组
                {
                    defendantName: '',  // 姓名
                    duties: '',         // 职务
                    mobile: '',         // 电话
                    wechat: '',         // 微信
                    qq: '',             // QQ
                    email: '',          // 邮箱或者传真
                    key: -1,            // key
                }
            ],
        }
        parties.push(data);
        this.setState({
            parties,
            editKey: key + 1
        })
    }

    // 编辑当事人
    editPartieItem(data, key) {
        data.edit = true;
        // if (data.contactJson) {
        //     data.contactJson.push({
        //         defendantName: '',  // 姓名
        //         duties: '',         // 职务
        //         mobile: '',         // 电话
        //         wechat: '',         // 微信
        //         qq: '',             // QQ
        //         email: '',          // 邮箱或者传真
        //         key: -1,            // key
        //         edit: true
        //     })
        // }
        let { parties } = this.state;
        parties[key] = data;
        this.setState({
            parties,
            editKey: key
        })
    }

    // 保存当事人
    savePartieItem(data, id, key) {
        let { intl } = this.props;
        if (data.defendantType === undefined || data.defendantType === '') {
            message.info(intl.formatMessage({ id: 'ligiation.please.select.the.party.type', defaultMessage: '请选择当事人类型' }))
            return;
        } else if (data.defendantAttribute === undefined || data.defendantAttribute === '') {
            message.info(intl.formatMessage({ id: 'ligiation.please.select.the.party.attribute', defaultMessage: '请选择当事人属性' }))
            return;
        } else if (!data.defendantName) {
            message.info(intl.formatMessage({ id: 'ligiation.please.enter.the.name.of.the.party.concerned', defaultMessage: '请输入当事人姓名' }))
            return;
        } else if (data.certityType === undefined || data.certityType === '') {
            message.info(intl.formatMessage({ id: 'ligiation.please.select.the.type.of.identification', defaultMessage: '请选择当事人证件类型' }))
            return;
        } else if (!data.certityNo) {
            message.info(intl.formatMessage({ id: 'ligiation.please.enter.the.id.number', defaultMessage: '请输入当事人证件号码' }))
            return;
        } else if (data.certityType === 0 && !(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(data.certityNo))) {
            message.info(intl.formatMessage({ id: 'ligiation.please.enter.the.correct.id.number', defaultMessage: '请输入正确的身份证号' }))
            return;
        }
        if (data.defendantType !== 1) {
            if (!data.companyJson.companyName) {
                message.info(intl.formatMessage({ id: 'ligiation.enter.the.business.companyname', defaultMessage: '请输入企业名称' }))
                return;
            } else if (!data.companyJson.busyLicenseNumber) {
                message.info(intl.formatMessage({ id: 'ligiation.please.enter.business.license.number', defaultMessage: '请输入营业执照号' }))
                return;
            } else if (!data.companyJson.companyAddress) {
                message.info(intl.formatMessage({ id: 'ligiation.enter.the.business.companyaddress', defaultMessage: '请输入企业地址' }))
                return;
            }
        }
        let { updateDefendantInfo, suitId } = this.props;
        data.suitId = suitId;
        data.edit = false;
        if (data.level3.length) {
            data.province = data.level3[0];
            data.city = data.level3[1];
            data.area = data.level3[2];
        }
        // if (data.contactJson) {
        //     data.contactJson.splice((data.contactJson.length - 1), 1)
        // }
        if (data.companyJson && data.companyJson.companyLevel3.length) {
            data.companyJson.companyProvince = data.companyJson.companyLevel3[0];
            data.companyJson.companyCity = data.companyJson.companyLevel3[1];
            data.companyJson.companyArea = data.companyJson.companyLevel3[2];
        }
        let { parties } = this.state;
        parties[key] = data;
        if (id) {
            if (updateDefendantInfo) {
                updateDefendantInfo(data, parties)
            }
        }
        this.setState({
            parties
        })
    }

    // 删除当事人
    deletePartieItem(id, key) {
        let { parties } = this.state;
        parties.splice(key, 1);
        if (id) {
            let { deleteDefendantInfo } = this.props;
            if (deleteDefendantInfo) {
                deleteDefendantInfo({ id: id }, parties)
            }
        } else {
            parties = parties.filter(item => item.key !== key);
            this.setState({
                parties
            })
        }
    }

    // 显示不通过时提示弹窗
    showConfirm(id, key) {
        confirm({
            title: '当事人信息',
            content: '你确定删除当事人信息？',
            onOk: () => this.deletePartieItem(id, key)
        })
    }

    // 显示添加联系人弹窗
    showAddContackModal() {
        this.setState({
            visible: true,
            contact: {
                defendantName: '',  // 姓名
                duties: '',         // 职务
                mobile: '',         // 电话
                wechat: '',         // 微信
                qq: '',             // QQ
                email: '',          // 邮箱或者传真
                key: Date.now()
            }
        })
    }

    // 添加联系人
    addContact() {
        let { contact, parties, editKey } = this.state;
        let { intl } = this.props
        //let { contactJson } = parties[editKey];
        if (!contact.defendantName) {
            message.info(intl.formatMessage({ id: 'ligiation.please.enter.the.name.contact.person', defaultMessage: '请输入联系人姓名' }));
            return;
        } else if (!contact.mobile) {
            message.info(intl.formatMessage({ id: 'ligiation.enter.the.phone', defaultMessage: '请输入联系人手机号' }));
            return;
        }
        parties[editKey].contactJson.push(contact)
        // let n = contactJson.length;
        // contactJson[n] = contactJson[n - 1];
        // contactJson[n - 1] = contact;
        // parties[editKey].contactJson = contactJson;
        this.setState({
            parties,
            visible: false,
            contact: {
                defendantName: '',  // 姓名
                duties: '',         // 职务
                mobile: '',         // 电话
                wechat: '',         // 微信
                qq: '',             // QQ
                email: '',          // 邮箱或者传真
                key: Date.now(),
            }
        })
    }

    // 删除联系人
    deleteContact(key) {
        let { parties, editKey } = this.state;
        let { contactJson } = parties[editKey]
        contactJson = contactJson.filter(item => item.key !== key);
        parties[editKey].contactJson = contactJson;
        this.setState({
            parties
        })
    }

    // 创建表格配置
    createColumns(edit) {
        const columns = [
            {
                title: <FormattedMessage id="ligiation.detail.full.name" defaultMessage="姓名" />,
                dataIndex: 'defendantName',
                key: 'defendantName',
                render: (text, item) => {
                    if (item.key === -1 && edit) {
                        return (
                            <a onClick={() => this.showAddContackModal()} ><FormattedMessage id="global.add.to" defaultMessage="添加" /></a>
                        )
                    } else {
                        return text
                    }
                }
            }, {
                title: <FormattedMessage id="ligiation.detail.post" defaultMessage="职务" />,
                dataIndex: 'duties',
                key: 'duties',
            }, {
                title: <FormattedMessage id="ligiation.detail.phone" defaultMessage="电话" />,
                dataIndex: 'mobile',
                key: 'mobile',
            }, {
                title: <FormattedMessage id="ligiation.detail.wechart" defaultMessage="微信" />,
                dataIndex: 'wechat',
                key: 'wechat',
            }, {
                title: 'QQ',
                dataIndex: 'qq',
                key: 'qq',
            }, {
                title: <FormattedMessage id="ligiation.detail.mailbox" defaultMessage="邮箱" />,
                dataIndex: 'email',
                key: 'email',
            }, {
                title: <FormattedMessage id="global.operate" defaultMessage="操作" />,
                render: item => {
                    if (item.key !== -1 && edit) {
                        return (
                            <a onClick={() => this.deleteContact(item.key)}><FormattedMessage id="global.delete" defaultMessage="删除" /></a>
                        )
                    }
                }
            }
        ];
        return columns;
    }

    renderParty(data, key) {
        let {
            defendantName, defendantAttribute, defendantAttributeName, defendantSex, defendantType, defendantTypeName, level3,
            address, mobile, email, qq, certityNo,
            certityType, certityTypeName, remark, companyJson, contactJson, edit,
            id
        } = data;
        let { intl, threadMainBodyType, litigationDocumentType, litigationAttributes, suitCaseDetail } = this.props;
        return (
            <div key={data.id}>
                <div className="party-badge">
                    {/* <Badge count={key + 1} style={{ backgroundColor: '#668fff',margin:'10px 0px' }} overflowCount={999} /> */}
                    {
                        suitCaseDetail.status >= 2 && suitCaseDetail.status <= 8 ?
                            <div className='operations'>
                                {
                                    edit
                                        ? <a onClick={() => this.savePartieItem(data, id, key)} ><FormattedMessage id="global.save" defaultMessage="保存" /></a>
                                        : <a onClick={() => this.editPartieItem(data, key)} ><FormattedMessage id="global.edit" defaultMessage="编辑" /></a>
                                }
                                <a onClick={() => this.showConfirm(id, key)}><FormattedMessage id="global.delete" defaultMessage="删除" /></a>
                            </div> : ''
                    }
                </div>
                <div className="party-detail-sub-box">
                    <div className='search-form party-detail-sub-box-title'>
                        <Badge count={key + 1} style={{ backgroundColor: '#668fff' }} overflowCount={999} />
                        <div className="party-detail-sub-box-type">
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        required
                                        label={intl.formatMessage({ id: 'ligiation.user.type', defaultMessage: '当事人类型' })}
                                    >
                                        {
                                            edit
                                                ? (
                                                    <Select
                                                        disabled={!edit}
                                                        value={defendantType}
                                                        onChange={val => this.changeState('defendantType', val)}
                                                    >
                                                        {
                                                            threadMainBodyType && threadMainBodyType.filter(item => item.isDel === 0)
                                                                .map(opt => <SelectOption key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</SelectOption>)
                                                        }
                                                    </Select>
                                                )
                                                : defendantTypeName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        required
                                        label={intl.formatMessage({ id: 'ligiation.attributes.of.the.parties', defaultMessage: '当事人属性' })}
                                    >
                                        {
                                            edit
                                                ? (<RadioGroup
                                                    disabled={!edit}
                                                    value={defendantAttribute}
                                                    onChange={e => this.changeState('defendantAttribute', e.target.value)}
                                                >
                                                    {
                                                        litigationAttributes && litigationAttributes.filter(item => item.isDel === 0)
                                                            .map(opt => <Radio value={opt.dictVal} key={opt.dictVal} >{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Radio>)
                                                    }
                                                </RadioGroup>)
                                                : defendantAttributeName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    {/* 个人类型 */}
                    <div className="party-detail-sub-box-contnet">
                        <div className='search-form party-detail-sub-box-item'>
                            <div className="sub-title">
                                <span>
                                    {
                                        defendantType === 0
                                            ? <FormattedMessage id="ligiation.corporate.information" defaultMessage="法人信息" />
                                            : defendantType === 1
                                                ? <FormattedMessage id="ligiation.basic.information" defaultMessage="当事人基本信息" />
                                                : <FormattedMessage id="ligiation.operator.information" defaultMessage="经营者信息" />
                                    }
                                </span>
                            </div>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        required
                                        label={intl.formatMessage({ id: 'ligiation.detail.full.name', defaultMessage: '姓名' })}
                                    >
                                        {
                                            edit
                                                ? (<Input
                                                    disabled={!edit}
                                                    value={defendantName}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.attributes.of.the.parties', defaultMessage: '请输入姓名' })}
                                                    onChange={e => this.changeState('defendantName', e.target.value.trim())}
                                                />)
                                                : defendantName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label={intl.formatMessage({ id: 'ligiation.detail.phone', defaultMessage: '电话' })}>
                                        {
                                            edit
                                                ? (<Input
                                                    disabled={!edit}
                                                    value={mobile}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.enter.phone', defaultMessage: '请输入联系电话' })}
                                                    onChange={e => this.changeState('mobile', e.target.value.trim())}
                                                />)
                                                : mobile || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={intl.formatMessage({ id: 'ligiation.sex', defaultMessage: '性别' })}>
                                        {
                                            edit
                                                ? (<RadioGroup
                                                    disabled={!edit}
                                                    value={defendantSex}
                                                    onChange={e => this.changeState('defendantSex', e.target.value)}
                                                >
                                                    <Radio value='0'><FormattedMessage id="ligiation.male" defaultMessage="男" /></Radio>
                                                    <Radio value='1'><FormattedMessage id="ligiation.female" defaultMessage="女" /></Radio>
                                                </RadioGroup>)
                                                : defendantSex === '0' ? '男' : '女'
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        required
                                        label={intl.formatMessage({ id: 'ligiation.document.type', defaultMessage: '证件类型' })}
                                    >
                                        {
                                            edit
                                                ? (<Select
                                                    disabled={!edit}
                                                    value={certityType}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.please.choose.document.type', defaultMessage: '请选择证件类型' })}
                                                    onChange={val => this.changeState('certityType', val)}
                                                >
                                                    {
                                                        litigationDocumentType && litigationDocumentType.filter(item => item.isDel === 0)
                                                            .map(opt => <SelectOption key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</SelectOption>)
                                                    }
                                                </Select>)
                                                : certityTypeName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={intl.formatMessage({ id: 'ligiation.region', defaultMessage: '区域' })}>
                                        {
                                            edit
                                                ? (<Cascader
                                                    disabled={!edit}
                                                    value={level3}
                                                    options={options}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.please.choice.region', defaultMessage: '请选择所在区域' })}
                                                    onChange={val => this.changeState('level3', val)}
                                                />)
                                                : level3.length ? `${level3[0] ? level3[0] : ''} ${level3[1] ? level3[1] : ''} ${level3[2] ? level3[2] : ''}` : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        required
                                        label={intl.formatMessage({ id: 'ligiation.identification.number', defaultMessage: '证件号码' })}
                                    >
                                        {
                                            edit
                                                ? (<Input
                                                    disabled={!edit}
                                                    value={certityNo}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.please.enter.identification.number', defaultMessage: '请输入证件号码' })}
                                                    onChange={e => this.changeState('certityNo', e.target.value.trim())}
                                                />)
                                                : certityNo || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem label={intl.formatMessage({ id: 'ligiation.detailed.address', defaultMessage: '详细地址' })}>
                                        {
                                            edit
                                                ? (<Input
                                                    disabled={!edit}
                                                    value={address}
                                                    placeholder={intl.formatMessage({ id: 'ligiation.please.enter.detailed.address', defaultMessage: '请输入详细地址' })}
                                                    onChange={e => this.changeState('address', e.target.value.trim())}
                                                />)
                                                : address || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label={intl.formatMessage({ id: 'clue.report.note', defaultMessage: '备注' })}>
                                        {
                                            edit
                                                ? (<TextArea
                                                    disabled={!edit}
                                                    autosize={false}
                                                    value={remark}
                                                    placeholder={intl.formatMessage({ id: 'report.please.enter.note', defaultMessage: '请输入备注信息' })}
                                                    onChange={e => this.changeState('remark', e.target.value)}
                                                />)
                                                : <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                {/* 个人信息显示 */}
                                {
                                    defendantType === 1
                                        ? [
                                            <Col span={12} key={1}>
                                                <FormItem key='email' label={intl.formatMessage({ id: 'footer.Mailbox.num', defaultMessage: '邮箱' })}>
                                                    {
                                                        edit
                                                            ? (<Input
                                                                disabled={!edit}
                                                                value={email}
                                                                placeholder={intl.formatMessage({ id: 'users.enter.email', defaultMessage: '请输入邮箱' })}
                                                                onChange={e => this.changeState('email', e.target.value.trim())}
                                                            />)
                                                            : email || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                            </Col>,
                                            <Col span={12}>
                                                <FormItem key='QQ' label='QQ'>
                                                    {
                                                        edit
                                                            ? (<Input
                                                                disabled={!edit}
                                                                value={qq}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.input.qq', defaultMessage: '请输入QQ' })}
                                                                onChange={e => this.changeState('qq', e.target.value.trim())}
                                                            />)
                                                            : qq || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                            </Col>
                                        ]
                                        : ''
                                }
                            </Row>
                        </div>

                        {/* 个体户类型 / 企业 显示 */}
                        {
                            defendantType !== 1
                                ? (
                                    <div className='search-form party-detail-sub-box-item'>
                                        <div className="sub-title">
                                            <span><FormattedMessage id="ligiation.business.information.of.the.parties" defaultMessage="当事人工商信息" /></span>
                                        </div>
                                        <Row>
                                            <Col span={12}>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.registered.capital', defaultMessage: '注册资本' })}>
                                                    {
                                                        edit
                                                            ? (<Input
                                                                disabled={!edit}
                                                                value={companyJson.registerFee}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.please.enter.registered.capital', defaultMessage: '请输入注册资本' })}
                                                                onChange={e => this.changeState('companyJson.registerFee', e.target.value.trim())}
                                                            />)
                                                            : companyJson.registerFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                                <FormItem label={intl.formatMessage({ id: 'users.registrationTime', defaultMessage: '注册时间' })}>
                                                    {
                                                        edit
                                                            ? (<DatePicker
                                                                disabled={!edit}
                                                                value={companyJson.registerTime ? moment(companyJson.registerTime, 'YYYY-MM-DD') : null}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.registrationTime', defaultMessage: '请选择注册时间' })}
                                                                onChange={(date, dateStr) => this.changeState('companyJson.registerTime', dateStr)}
                                                            />)
                                                            : companyJson.registerTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.license.number', defaultMessage: '营业执照号' })}>
                                                    {
                                                        edit
                                                            ? (<Input
                                                                disabled={!edit}
                                                                value={companyJson.busyLicenseNumber}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.please.enter.business.license.number', defaultMessage: '请输入营业执照号' })}
                                                                onChange={e => this.changeState('companyJson.busyLicenseNumber', e.target.value.trim())}
                                                            />)
                                                            : companyJson.busyLicenseNumber || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                                : ''
                        }
                        {
                            defendantType !== 1
                                ? (
                                    <div className='search-form party-detail-sub-box-item'>
                                        <div className="sub-title">
                                            <span><FormattedMessage id="ligiation.enterprise.information" defaultMessage="企业信息" /></span>
                                        </div>
                                        <Row>
                                            <Col span={12}>
                                                <FormItem
                                                    required
                                                    label={intl.formatMessage({ id: 'ligiation.business.companyname', defaultMessage: '企业名称' })}
                                                >
                                                    {
                                                        edit
                                                            ? (<Input
                                                                disabled={!edit}
                                                                value={companyJson.companyName}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.enter.the.business.companyname', defaultMessage: '请输入企业名称' })}
                                                                onChange={e => this.changeState('companyJson.companyName', e.target.value.trim())}
                                                            />)
                                                            : companyJson.companyName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.region', defaultMessage: '区域' })}>
                                                    {
                                                        edit
                                                            ? (<Cascader
                                                                disabled={!edit}
                                                                value={companyJson.companyLevel3}
                                                                options={options}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.please.choice.region', defaultMessage: '请选择所在区域' })}
                                                                onChange={val => this.changeState('companyJson.companyLevel3', val)}
                                                            />)
                                                            : companyJson.companyLevel3.length ? `${companyJson.companyLevel3[0] ? companyJson.companyLevel3[0] : ''} ${companyJson.companyLevel3[1] ? companyJson.companyLevel3[1] : ''} ${companyJson.companyLevel3[2] ? companyJson.companyLevel3[2] : ''}` : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.companyaddress', defaultMessage: '企业地址' })}>
                                                    {
                                                        edit
                                                            ? (<Input
                                                                disabled={!edit}
                                                                value={companyJson.companyAddress}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.enter.the.business.companyaddress', defaultMessage: '请输入企业地址' })}
                                                                onChange={e => this.changeState('companyJson.companyAddress', e.target.value.trim())}
                                                            />)
                                                            : companyJson.companyAddress || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.companymobile', defaultMessage: '企业电话' })}>
                                                    {
                                                        edit
                                                            ? (<Input
                                                                disabled={!edit}
                                                                value={companyJson.companyMobile}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.enter.the.business.companymobile', defaultMessage: '请输入企业电话' })}
                                                                onChange={e => this.changeState('companyJson.companyMobile', e.target.value.trim())}
                                                            />)
                                                            : companyJson.companyMobile || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.companyemail', defaultMessage: '企业传真' })}>
                                                    {
                                                        edit
                                                            ? (<Input
                                                                disabled={!edit}
                                                                value={companyJson.companyEmail}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.enter.the.business.companyemail', defaultMessage: '请输入企业传真' })}
                                                                onChange={e => this.changeState('companyJson.companyEmail', e.target.value.trim())}
                                                            />)
                                                            : companyJson.companyEmail || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.companyonlineaddress', defaultMessage: '企业网址' })}>
                                                    {
                                                        edit
                                                            ? (<Input
                                                                disabled={!edit}
                                                                value={companyJson.companyOnlineAddress}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.enter.the.business.companyonlineaddress', defaultMessage: '请输入企业网址' })}
                                                                onChange={e => this.changeState('companyJson.companyOnlineAddress', e.target.value.trim())}
                                                            />)
                                                            : companyJson.companyOnlineAddress || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={24}>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.companyremark', defaultMessage: '企业备注' })}>
                                                    {
                                                        edit
                                                            ? (<TextArea
                                                                disabled={!edit}
                                                                autosize={false}
                                                                value={companyJson.companyRemark}
                                                                placeholder={intl.formatMessage({ id: 'ligiation.enter.the.business.companyremark', defaultMessage: '请输入企业备注信息' })}
                                                                onChange={e => this.changeState('companyJson.companyRemark', e.target.value)}
                                                            />)
                                                            : <p style={{ whiteSpace: 'pre-wrap' }} >{companyJson.companyRemark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
                                                    }
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                                : ''
                        }
                        <div className='search-form party-detail-sub-box-item'>
                            <div className="sub-title">
                                <span><FormattedMessage id="ligiation.contact.information" defaultMessage="联系人信息" /></span>
                            </div>
                            <Table
                                size='small'
                                rowKey='key'
                                pagination={false}
                                bordered={false}
                                dataSource={contactJson}
                                columns={this.createColumns(edit)}
                            />
                            {
                                suitCaseDetail && (suitCaseDetail.status >= 2 && suitCaseDetail.status <= 8) && edit ?
                                    <Button type="dashed" onClick={() => this.showAddContackModal()} style={{ width: '94%' }}>
                                        <Icon type="plus" />添加
                                    </Button> : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        let { contact, visible, parties } = this.state;
        let { intl } = this.props
        return (
            <div className='party'>
                {
                    parties && parties.length ?
                        parties.map((item, index) => this.renderParty(item, index)) :
                        <div className="empeyInfo">
                            <img src={emptyImg} alt="" />
                            <p><FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" /></p>
                        </div>
                }
                <Modal
                    visible={visible}
                    title={intl.formatMessage({ id: 'ligiation.add.a.contact', defaultMessage: '添加联系人' })}
                    className='root'
                    onCancel={() => this.setState({ visible: false })}
                    onOk={() => this.addContact()}
                >
                    <div className="search-form">
                        <FormItem
                            label={intl.formatMessage({ id: 'ligiation.detail.full.name', defaultMessage: '姓名' })}
                            required
                        >
                            <Input
                                value={contact.defendantName}
                                placeholder={intl.formatMessage({ id: 'ligiation.please.enter.the.name.contact.person', defaultMessage: '请输入联系人姓名' })}
                                onChange={e => this.changeState('contact.defendantName', e.target.value.trim())}
                            />
                        </FormItem>
                        <FormItem label={intl.formatMessage({ id: 'ligiation.detail.post', defaultMessage: '职务' })}>
                            <Input
                                value={contact.duties}
                                placeholder={intl.formatMessage({ id: 'ligiation.enter.the.detail.post', defaultMessage: '请输入联系人职务' })}
                                onChange={e => this.changeState('contact.duties', e.target.value.trim())}
                            />
                        </FormItem>
                        <FormItem
                            required
                            label={intl.formatMessage({ id: 'ligiation.detail.phone', defaultMessage: '电话' })}
                        >
                            <Input
                                value={contact.mobile}
                                placeholder={intl.formatMessage({ id: 'ligiation.enter.the.phone', defaultMessage: '请输入联系人电话' })}
                                onChange={e => this.changeState('contact.mobile', e.target.value.trim())}
                            />
                        </FormItem>
                        <FormItem label={intl.formatMessage({ id: 'ligiation.detail.wechart', defaultMessage: '微信' })}>
                            <Input
                                value={contact.wechat}
                                placeholder={intl.formatMessage({ id: 'ligiation.enter.wechart', defaultMessage: '请输入联系人微信' })}
                                onChange={e => this.changeState('contact.wechat', e.target.value.trim())}
                            />
                        </FormItem>
                        <FormItem label='QQ'>
                            <Input
                                value={contact.qq}
                                placeholder={intl.formatMessage({ id: 'ligiation.enter.qq', defaultMessage: '请输入联系人QQ' })}
                                onChange={e => this.changeState('contact.qq', e.target.value.trim())}
                            />
                        </FormItem>
                        <FormItem label={intl.formatMessage({ id: 'footer.Mailbox.num', defaultMessage: '邮箱' })}>
                            <Input
                                value={contact.email}
                                placeholder={intl.formatMessage({ id: 'ligiation.please.enter.mailbox', defaultMessage: '请输入联系人邮箱' })}
                                onChange={e => this.changeState('contact.email', e.target.value.trim())}
                            />
                        </FormItem>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default injectIntl(PartyDetail)
