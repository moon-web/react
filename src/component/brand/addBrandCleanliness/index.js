import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Button, message } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import InputNumber from '../../common/form/numberInput'
import './index.css'
const Option = Select.Option;
export default class AddBrandCleanliness extends Component {
	constructor(props) {
		super(props)
		this.state = {
			endTime: [],
			unitTage: false,//是否显示提示选择最后一天
			deliverUnit: undefined,//交付单位
			gmtDeliverDate: undefined,//交付截止时间
			Keyword: '',//关键字
			brandId: undefined,//品牌
			platformId: undefined,//平台
			minPrice: '', //最小价格
			maxPrice: '', //最大价格
			queryScope: '10',//查询范围
			consignmentPlace: '',//发货地
			sortCondition: 1
		}
		this.endTimeMonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
		this.endTimeWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
		this.endTimeWeekEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	}

	componentWillMount() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		let { intl } = this.props;
		if (intl.locale === 'zh') {
			this.setState({
				endTime: this.endTimeWeek,
			})
		} else {
			this.setState({
				endTime: this.endTimeWeekEn
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.intl.locale === 'zh') {
			this.setState({
				endTime: this.endTimeWeek,
			})
		} else {
			this.setState({
				endTime: this.endTimeWeekEn
			})
		}
	}

	//赋值
	handleChange(value, type) {
		let { intl } = this.props;
		//启动周期-启动时间
		if (type === 'deliverUnit') {
			if (value === 1) {
				this.setState({
					endTime: this.endTimeMonth,
					gmtDeliverDate: '',
					unitTage: true
				})
			} else {
				this.setState({
					endTime: intl.locale === 'zh' ? this.endTimeWeek : this.endTimeWeekEn,
					gmtDeliverDate: '',
					unitTage: false
				})
			}
		}
		this.setState({
			[type]: value
		})
	}

	//新增品牌洁净度监控规则
	addBrandCleanSave() {
		let { addBrandCleanliness, isFetchBtag } = this.props;
		let { brandId, platformId, Keyword, minPrice, maxPrice, queryScope, deliverUnit, gmtDeliverDate, consignmentPlace, sortCondition } = this.state;
		let { intl } = this.props;
		if (brandId === undefined || brandId === '') {
			message.warning(intl.formatMessage({ id: 'report.users.pleaseChoose' }));
			return
		}
		if (platformId === undefined || platformId === '') {
			message.warning(intl.formatMessage({ id: 'complaint.choose.platform' }));
			return
		}
		if (Keyword === undefined || Keyword === '') {
			message.warning(intl.formatMessage({ id: 'monitor.input.keyword' }));
			return
		}
		if (deliverUnit === undefined || deliverUnit === '') {
			message.warning(intl.formatMessage({ id: 'brand.please.select.the.start.up.cycle' }));
			return
		}
		if (gmtDeliverDate === undefined || gmtDeliverDate === '') {
			message.warning(intl.formatMessage({ id: 'brand.please.select.the.start.up.time' }));
			return
		}
		if (sortCondition === undefined || sortCondition === '') {
			message.warning(intl.formatMessage({ id: 'monitor.please.choose.sort.type' }));
			return
		}
		let data = {
			brandId: brandId ? brandId : '',
			platformType: platformId ? platformId : '',
			keyword: Keyword ? Keyword : '',
			minPrice: minPrice ? minPrice * 100 : '', //最小价格
			maxPrice: maxPrice ? maxPrice * 100 : '', //最大价格
			maxPage: queryScope ? queryScope : '',//查询范围
			consignmentPlace: consignmentPlace ? consignmentPlace : '',//发货地
			deliverUnit: deliverUnit ? deliverUnit : '',//交付单位
			gmtDeliverDate: gmtDeliverDate ? gmtDeliverDate : '',//交付时间
			sortCondition: sortCondition
		}
		if (isFetchBtag || isFetchBtag === undefined) {
			addBrandCleanliness(data)
		}
	}

	//取消新增
	addBrandCleanCancel() {
		this.props.history.goBack()
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}

	render() {
		let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '/brand/list', titleId: 'router.brands.management', title: '品牌管理' },
			{ link: '/brand/cleanliness', titleId: 'router.brands.brand.cleanliness', title: '品牌洁净度' },
			{ link: '', titleId: 'router.brands.clean.add', title: '新增洁净度监控' },
		]
		let { intl, brandList, platfromList, monitorRulesQueryParamsSort } = this.props;
		let { deliverUnit, gmtDeliverDate, brandId, platformId, Keyword, minPrice, maxPrice, queryScope, consignmentPlace, sortCondition } = this.state;
		return (
			<Content breadcrumbData={breadcrumbData} className="brand-edit-wrapper addBrandCleanliness">
				<div className="search-form brand-edit-box">
					<div className="edit-info-title">
						<FormattedMessage id="brand.cleanliness.conditions" defaultMessage="洁净度条件" description="洁净度条件" />
					</div>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: 'home.brand', defaultMessage: "品牌" })}>
								<Select
									placeholder={intl.formatMessage({ id: "report.users.pleaseChoose", defaultMessage: "请选择品牌", description: "请选择所属品牌" })}
									value={brandId}
									onChange={(value) => this.handleChange(value, 'brandId')}
									dropdownMatchSelectWidth={true}
									showSearch
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{
										brandList && brandList.filter(item => item.isDelete === 0)
											.map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: 'global.platform', defaultMessage: "平台" })}>
								<Select
									value={platformId}
									showSearch
									placeholder={intl.formatMessage({ id: "complaint.choose.platform", defaultMessage: "请选择平台", description: "请选择平台" })}
									dropdownMatchSelectWidth={true}
									onChange={(value) => this.handleChange(value, 'platformId')}
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{
										platfromList && platfromList.filter(item => item.isDel === 0)
											.map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
												{
													intl.locale === 'en'
														? opt.dictLabelEn
														: opt.dictLabel
												}
											</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: 'monitor.keyword', defaultMessage: "关键字" })}>
								<Input
									onChange={(e) => this.handleChange(e.target.value.trim(), 'Keyword')}
									placeholder={intl.formatMessage({ id: 'monitor.input.keyword', defaultMessage: '请输入关键字' })}
									value={Keyword}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: 'global.crawler.filter.type.price', defaultMessage: "价格" })}>
								<Col span={10}>
									<InputNumber
										placeholder={intl.formatMessage({ id: 'brand.addclean.minprice', defaultMessage: '请输入价格' })}
										value={minPrice}
										onChange={value => this.handleChange(value.trim(), 'minPrice')}
									/>
								</Col>
								<Col span={4} className="price-section">
									<FormattedMessage id="brand.to" defaultMessage="至" description="至" />
								</Col>
								<Col span={10}>
									<InputNumber
										placeholder={intl.formatMessage({ id: 'brand.addclean.minprice', defaultMessage: '请输入价格' })}
										value={maxPrice}
										onChange={value => this.handleChange(value.trim(), 'maxPrice')}
									/>
								</Col>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: 'global.crawler.filter.type.place.of.delivery', defaultMessage: "发货地" })}>
								<Input
									placeholder={intl.formatMessage({ id: 'monitor.please.address', defaultMessage: '请输入发货地' })}
									onChange={(e) => this.handleChange(e.target.value.trim(), 'consignmentPlace')}
									value={consignmentPlace}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: 'monitor.query.range', defaultMessage: "查询范围" })}>
								<Col span={20}>
									<InputNumber
										placeholder={intl.formatMessage({ id: 'monitor.please.input.query.range', defaultMessage: '请输入查询范围' })}
										value={queryScope}
										onChange={value => this.handleChange(value.trim(), 'queryScope')}
									/>
								</Col>
								<Col span={4} className="price-section">
									<FormattedMessage id="brand.cleanliness.page" defaultMessage="页" description="页" />
								</Col>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: 'monitor.sort.type', defaultMessage: "排序类型" })}>
								<Select
									value={sortCondition}
									onChange={value => this.handleChange(value, 'sortCondition')}
									placeholder={intl.formatMessage({ id: "monitor.please.choose.sort.type", formatMessage: "请选择排序类型" })}
								>
									{
										monitorRulesQueryParamsSort && monitorRulesQueryParamsSort.filter(item => item.isDel === 0)
											.map(opt => <Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</div>
				<div className='search-form brand-edit-box'>
					<div className="edit-info-title">
						<FormattedMessage id="brand.start.up.time" defaultMessage="启动时间" description="启动时间" />
					</div>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "brand.start.cycle", defaultMessage: "启动周期" })}>
								<Select
									showSearch
									placeholder={intl.formatMessage({ id: "brand.please.select.the.start.up.cycle", defaultMessage: "请选择启动周期" })}
									value={deliverUnit ? deliverUnit : undefined}
									onChange={(value) => this.handleChange(value, 'deliverUnit')}
								>
									<Option value={1} key="1">
										<FormattedMessage id="brand.month" defaultMessage="月" description="月" />
									</Option>
									<Option value={2} key="2">
										<FormattedMessage id="brand.week" defaultMessage="周" description="周" />
									</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "brand.start.up.time", defaultMessage: "启动时间" })}>
								<Select
									showSearch
									placeholder={intl.formatMessage({ id: "brand.please.select.the.start.up.time", defaultMessage: "请选择启动时间" })}
									value={gmtDeliverDate ? gmtDeliverDate : undefined}
									onChange={(value) => this.handleChange(value, 'gmtDeliverDate')}
								>
									{
										this.state.endTime.map((v, i) => (
											<Option value={i + 1} key={i}>{v}</Option>
										))
									}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						{
							this.state.unitTage ? <p className="timeBtag"><FormattedMessage id="brand.interaction.add.brand.day" defaultMessage="如果是每月的最后一天，请选择31号" /></p> : ''
						}
					</Row>
				</div>
				<div className="btns">
					<Button type="primary" onClick={() => this.addBrandCleanSave()}>
						<FormattedMessage id="global.determine" defaultMessage="确定" />
					</Button>
					<Button onClick={() => this.addBrandCleanCancel()}>
						<FormattedMessage id="global.cancel" defaultMessage="取消" />
					</Button>
				</div>
			</Content>
		)
	}
}
