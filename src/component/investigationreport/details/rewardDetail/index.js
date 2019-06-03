import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Col, Row } from 'antd';
import Contnet from '../../../common/layout/content/index';
import { queryUrlParams } from '../../../../utils/util'
import FormItem from '../../../monitoring/detail/formitem'
import PictureModal from '../../../common/layout/modal/pictureModal'
import '../../index.css'
class RewardDetails extends Component {
    constructor() {
        super()
        this.state = {
            visible:false,
            showImage:''
        }
    }

    componentDidMount() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        let { history } = this.props
        if (history.location.search) {
            let id = queryUrlParams('id');
            let data={
                id:id
            }
            this.props.getRewardList(data)
        }
    }

    //显示图片
    showImg(img) {
        this.setState({
            visible: true,
            showImage: img
        })
    }
    
    render() {
        let { intl, rewardDetails } = this.props
        let {visible,showImage} =this.state
        let breadcrumbData = [
            { link: '/', titleId: "router.home", title: '首页' },
            { link: '/report/reward', query: { goback: true }, titleId:"router.reward.distribution", title: '奖励发放' },
            { link: '', query: { goback: true }, titleId: "investigation.application.for.award.details", title: '申请奖励发放详情' },
        ];
        return (
            <Contnet breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <ul className="rulesDetails">
                        <li className="rulesDetailslist">
                            <h3 className="title">
                                <FormattedMessage id="investigation.essential.information" defaultMessage="基本信息" description="基本信息" />
                            </h3>
                            <Row>
                                <FormItem col={8} label={intl.formatMessage({ id: "investigation.amount.of.cash", defaultMessage: "提现金额" })} text={rewardDetails ? rewardDetails.price : ""} />
                                <FormItem col={8} label={intl.formatMessage({ id: "investigation.emergency.contact", defaultMessage: "紧急联系人" })} text={rewardDetails ? rewardDetails.contactName : ""} />
                                <FormItem col={8} label={intl.formatMessage({ id: "investigation.bank.card.number", defaultMessage: "银行卡号" })} text={rewardDetails ? rewardDetails.bankNo : ""} />
                            </Row>
                            <Row>
                                <FormItem col={8} label={intl.formatMessage({ id: "investigation.emergency.contact.telephone", defaultMessage: "紧急联系人电话" })} text={rewardDetails ? rewardDetails.contactMobile : ""} />
                                <FormItem col={8} label={intl.formatMessage({ id: "investigation.bank.account.information", defaultMessage: "开户行信息" })} text={rewardDetails ? rewardDetails.bankName : ""} />
                                <FormItem col={8} label={intl.formatMessage({ id: "investigation.name.of.account.holder", defaultMessage: "开户人姓名" })} text={rewardDetails ? rewardDetails.userName : ""} />
                            </Row>
                            <Row>
                                <FormItem col={8} label={intl.formatMessage({ id: "case.id.number", defaultMessage: "身份证号" })} text={rewardDetails ? rewardDetails.idNo : ""} />
                                <FormItem col={8} label={intl.formatMessage({ id: "users.user.investigator.present.address", defaultMessage: "现居地址" })} text={rewardDetails ? rewardDetails.address : ""} />
                            </Row>
                            <Row>
                                <Col span={24} className='monitoringName'>
                                    <Form.Item className="rulesDetailslistLable" label={intl.formatMessage({ id: "investigation.positive.and.negative.identity.cards", defaultMessage: "身份证正反面" })}>
                                        <img src={rewardDetails ? rewardDetails.idFront : ""} alt="" className="idCardImg" onClick={() => this.showImg(rewardDetails ? rewardDetails.idFront : "")}/>
                                        <img src={rewardDetails ? rewardDetails.idBack : ""} alt="" className="idCardImg" onClick={() => this.showImg(rewardDetails ? rewardDetails.idBack : "")}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </li>
                    </ul>
                </div>
                <PictureModal
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                    showImg={showImage}
                    />
            </Contnet>
        )
    }
}
export default injectIntl(RewardDetails)