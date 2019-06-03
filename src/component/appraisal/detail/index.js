import React, { Component } from 'react'
import { Form, Col, Row } from 'antd'
import Content from '../../common/layout/content/index'
import { FormattedMessage } from 'react-intl'
import { queryUrlParams } from '../../../utils/util'
import './index.css'

export default class AppraisalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
		}
    }
	componentWillMount() {
		let id = queryUrlParams('id')
		let data = {
			id: id
		}
		this.props.getAppraisalDetail(data)
	}

    render() {
		let { appraisalDetailList, intl } = this.props
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '/appraisal/list', titleId: 'router.law.enforcement.management', title: '鉴定管理' },
            { link: '', titleId: 'router.law.enforcement.detail.management', title: '鉴定管理详情' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData} className="appraisal-detail">
				<h3 className="title"><FormattedMessage id="appraisal.base.info" defaultMessage="基本信息" description="基本信息" /></h3>
				<div className="search-form">
                    <Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "appraisal.law.enforcement", defaultMessage: "执法单位", description: "执法单位" })}>
								{appraisalDetailList && appraisalDetailList.contactCompany }
                            </Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "appraisal.enforcement.officer", defaultMessage: "执法人姓名", description: "执法人姓名" })}>
								{appraisalDetailList && appraisalDetailList.contactName }
                            </Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "appraisal.law.phone", defaultMessage: "执法人电话", description: "执法人电话" })}>
								{appraisalDetailList && appraisalDetailList.contactMobile }
                            </Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "appraisal.tort.category", defaultMessage: "侵权类目", description: "侵权类目" })}>
								{appraisalDetailList && appraisalDetailList.cate }
                            </Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "investigation.detail.case.address", defaultMessage: "案件地址", description: "案件地址" })}>
								{appraisalDetailList && appraisalDetailList.address }
                            </Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "appraisal.involve.brand", defaultMessage: "涉及品牌", description: "涉及品牌" })}>
								{appraisalDetailList && appraisalDetailList.brand }
                            </Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "appraisal.quantity.goods", defaultMessage: "货物数量", description: "货物数量" })}>
								{appraisalDetailList &&  appraisalDetailList.num }
                            </Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "appraisal.expected.identification.time", defaultMessage: "期望鉴定时间", description: "期望鉴定时间" })}>
								{appraisalDetailList && appraisalDetailList.apparaisalTimeStr }
                            </Form.Item>
						</Col>
					</Row>
				</div>
            </Content>
        )
    }
}
