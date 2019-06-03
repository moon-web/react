import React, { Component } from 'react'
import { Col, Row, Form, Table, Badge } from 'antd'
import { injectIntl, FormattedMessage } from 'react-intl'
import emptyImg from '../../../../../assets/images/empty.svg'
const FormItem = Form.Item;
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
   
    // 创建表格配置
    createColumns() {
        const columns = [
            {
                title: <FormattedMessage id="ligiation.detail.full.name" defaultMessage="姓名" />,
                dataIndex: 'defendantName',
                key: 'defendantName',
                render: (text, item) => {
                    return text
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
                    return (
                        ''
                    )
                }
            }
        ];
        return columns;
    }

    renderParty(data, key) {
        let {
            defendantName, defendantAttributeName, defendantSex, defendantType, defendantTypeName, level3,
            address, mobile, email, qq, certityNo, certityTypeName, remark, companyJson, contactJson
        } = data;
        let { intl } = this.props;
        return (
            <div key={data.id}>
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
                                            defendantTypeName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        required
                                        label={intl.formatMessage({ id: 'ligiation.attributes.of.the.parties', defaultMessage: '当事人属性' })}
                                    >
                                        { 
                                            defendantAttributeName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
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
                                            defendantName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label={intl.formatMessage({ id: 'ligiation.detail.phone', defaultMessage: '电话' })}>
                                        {
                                            mobile || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={intl.formatMessage({ id: 'ligiation.sex', defaultMessage: '性别' })}>
                                        {
                                            defendantSex === '0' ? '男' : '女'
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        required
                                        label={intl.formatMessage({ id: 'ligiation.document.type', defaultMessage: '证件类型' })}
                                    >
                                        {
                                            certityTypeName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={intl.formatMessage({ id: 'ligiation.region', defaultMessage: '区域' })}>
                                        {
                                            level3.length ? `${level3[0] ? level3[0] : ''} ${level3[1] ? level3[1] : ''} ${level3[2] ? level3[2] : ''}` : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        required
                                        label={intl.formatMessage({ id: 'ligiation.identification.number', defaultMessage: '证件号码' })}
                                    >
                                        {
                                            certityNo || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem label={intl.formatMessage({ id: 'ligiation.detailed.address', defaultMessage: '详细地址' })}>
                                        {
                                            address || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label={intl.formatMessage({ id: 'clue.report.note', defaultMessage: '备注' })}>
                                        {
                                            <p style={{ whiteSpace: 'pre-wrap' }} >{remark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
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
                                                        email || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                            </Col>,
                                            <Col span={12}>
                                                <FormItem key='QQ' label='QQ'>
                                                    {
                                                        qq || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
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
                                                        companyJson.registerFeeFormat || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                                <FormItem label={intl.formatMessage({ id: 'users.registrationTime', defaultMessage: '注册时间' })}>
                                                    {
                                                        companyJson.registerTime || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.license.number', defaultMessage: '营业执照号' })}>
                                                    {
                                                        companyJson.busyLicenseNumber || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
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
                                                        companyJson.companyName || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.region', defaultMessage: '区域' })}>
                                                    {
                                                        companyJson.companyLevel3.length ? `${companyJson.companyLevel3[0] ? companyJson.companyLevel3[0] : ''} ${companyJson.companyLevel3[1] ? companyJson.companyLevel3[1] : ''} ${companyJson.companyLevel3[2] ? companyJson.companyLevel3[2] : ''}` : <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.companyaddress', defaultMessage: '企业地址' })}>
                                                    {
                                                        companyJson.companyAddress || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.companymobile', defaultMessage: '企业电话' })}>
                                                    {
                                                        companyJson.companyMobile || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.companyemail', defaultMessage: '企业传真' })}>
                                                    {
                                                        companyJson.companyEmail || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.companyonlineaddress', defaultMessage: '企业网址' })}>
                                                    {
                                                        companyJson.companyOnlineAddress || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={24}>
                                                <FormItem label={intl.formatMessage({ id: 'ligiation.business.companyremark', defaultMessage: '企业备注' })}>
                                                    {
                                                        <p style={{ whiteSpace: 'pre-wrap' }} >{companyJson.companyRemark || <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" />}</p>
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
                                columns={this.createColumns()}
                            />
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
            </div>
        )
    }
}
export default injectIntl(PartyDetail)
