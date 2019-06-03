import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Button, Divider, Radio } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import PublicCheck from '../../monitoring/common/checkBox'
import InputNumber from '../../common/form/numberInput'
import { queryUrlParams } from '../../../utils/util'
import './index.css'
const Option = Select.Option
const RadioGroup = Radio.Group;

export default class BrandEdit extends Component {
	constructor(props) {
		super(props)
		this.state = {
            endTime: ['周一','周二','周三','周四','周五','周六','周日'],
			unitTage: false,//是否显示提示选择最后一天
			name: '',
			userName: '',
			deliverTarget: '',
			deliverUnit: undefined,//交付单位
			gmtDeliverDate: undefined,//交付截止时间
			reportTypeList: [],
			reportPlatformList: [],
			reportCategoryList: [],
            value: 0,
            lawyerSuitFlag: ''
        }
		this.endTimeMonth = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
		this.endTimeWeek = ['周一','周二','周三','周四','周五','周六','周日']
	}
	componentWillMount() {
		let { history } = this.props
        if (history.location.search) {
			let id = queryUrlParams('id')
			this.getBrandEditDetail({brandId: id})

		}
		
		document.body.scrollTop = document.documentElement.scrollTop = 0;	
	}
	componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.brandEditDetail) {
			let { id, name, userName, deliverTarget, deliverUnit, gmtDeliverDate, reportTypeList, reportPlatformList, reportCategoryList, lawyerFlag, lawyerSuitFlag } = nextProps.brandEditDetail;
			this.setState({
                id,
                name,
				userName,
				deliverTarget,
				deliverUnit,
				gmtDeliverDate,
				reportTypeList: reportTypeList ? reportTypeList : [],
				reportPlatformList: reportPlatformList ? reportPlatformList : [],
				reportCategoryList: reportCategoryList ? reportCategoryList : [],
				endTime: deliverUnit === 1 ? this.endTimeMonth : this.endTimeWeek,
				unitTage: deliverUnit === 1 ? true : false,
                lawyerFlag,
                lawyerSuitFlag
			})
		}
	}
	getBrandEditDetail(data) {
		this.props.brandListEditDetail(data)
	}

	//投诉类型
	complaintType(reportTypeList) {
		this.setState({
			reportTypeList
		})
	}
	//投诉平台 
	complaintPlatform(reportPlatformList) {
		this.setState({
			reportPlatformList
		})
	}
	//change事件
	brandEditChange(value,type) {
		if(type === 'deliverUnit') {
			if(value === 1) {
				this.setState({
					endTime: this.endTimeMonth,
					gmtDeliverDate:'',
					unitTage: true
				})
			}else {
				this.setState({
					endTime: this.endTimeWeek,
					gmtDeliverDate:'',					
					unitTage: false
				})
			}
		}
		this.setState({
			[type]: value
		})
	}
	//品牌编辑保存
	brandEditSave() {
		let { brandListEdit } = this.props
		let { id, deliverTarget, deliverUnit, gmtDeliverDate, reportTypeList, reportPlatformList, reportCategoryList, lawyerFlag, lawyerSuitFlag } = this.state
		let data = {
			id, 
			deliverTarget,
			deliverUnit, 
			gmtDeliverDate, 
			reportTypeList, 
			reportPlatformList, 
			reportCategoryList,
            lawyerFlag,
            lawyerSuitFlag
		}
		brandListEdit(data)
	}
	//取消新增
	cancel() {
		this.props.history.goBack()
		document.body.scrollTop = document.documentElement.scrollTop = 0;		
	}

	//判断是否允许专案品牌显示
	getLawyerFlag(value, type) {
		this.setState({
			[type]: value
		})
	}

	render() {
		let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '/brand/list', titleId: 'router.brands.management', title: '品牌管理' },
			{ link: '', titleId: 'router.brands.editor', title: '品牌编辑' },
		]
		let { intl, reportType, platfromList, prodList } = this.props
		let { name, userName, deliverTarget, deliverUnit, gmtDeliverDate, reportTypeList, reportPlatformList, reportCategoryList, lawyerFlag, lawyerSuitFlag } = this.state
		return (
			<Content breadcrumbData = {breadcrumbData} className="brand-edit-wrapper">
				<div className={intl.locale === 'en' ? 'search-form brand-edit-box en' : 'search-form brand-edit-box' }>
					<div className="edit-info-title">
						<FormattedMessage id="users.essential.information" defaultMessage="基本信息" description="基本信息" />
					</div>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: 'brand.interaction.name', defaultMessage: "品牌名称" })}>
								<Input disabled={true} value={name}/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item
								label={intl.formatMessage({ id: 'brand.interaction.brand.owner', defaultMessage: '所属品牌商', description: '所属品牌商' })}
							>
								<Input disabled={true} value={userName}/>
							</Form.Item>
						</Col>
					</Row>
				</div>
				<div className={intl.locale === 'en' ? 'search-form brand-edit-box en' : 'search-form brand-edit-box'}>
					<div className="edit-info-title">
						<FormattedMessage id="brand.delivery.settings" defaultMessage="交付设置" description="交付设置"/>
					</div>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "brand.interaction.brand.delivery", defaultMessage: "交付目标" })}>
								<InputNumber 
									style={{width: '100%'}} 
									value={deliverTarget}
									placeholder={intl.formatMessage({id: "brand.interaction.edit.delivery",defaultMessage: "请输入交付目标"})}
									onChange={value => this.brandEditChange(value.trim(),'deliverTarget')}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "brand.interaction.edit.unit", defaultMessage: "单位" })}>
								<Select
									showSearch
									placeholder={intl.formatMessage({id: "brand.please.choise.interaction.edit.unit", defaultMessage: "请选择单位"})}
									value={ deliverUnit ? deliverUnit : undefined }
									onChange={(value) => this.brandEditChange(value,'deliverUnit')}
								>
									<Option value={1} key="1">月</Option>
									<Option value={2} key="2">周</Option>
								</Select> 
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "brand.interaction.edit.deadline", defaultMessage: "交付截止时间" })}>
								<Select
									showSearch
									placeholder={intl.formatMessage({id: "brand.please.choise.interaction.edit.deadline", defaultMessage: "请选择交付截止时间"})}
									value={ gmtDeliverDate ? gmtDeliverDate : undefined }
									onChange={(value) => this.brandEditChange(value,'gmtDeliverDate')}
								>
									{
										this.state.endTime.map((v,i)=>(
											<Option value={i+1} key={i}>{v}</Option>
										))
									}
								</Select>   
							</Form.Item>
						</Col>
					</Row>
					<Row>
						{
							this.state.unitTage ? <p className="timeBtag"><FormattedMessage id="brand.interaction.add.brand.day" defaultMessage="如果是每月的最后一天，请选择31号"/></p> : ''
						}
					</Row>
				</div>
				<div className={intl.locale === 'en' ? 'search-form en' : 'search-form'}>
					<div className="edit-info-title">
						<FormattedMessage id="brand.complaint.settings" defaultMessage="投诉设置" description="投诉设置"/>
					</div>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "brand.complaints.type", defaultMessage: "投诉类型", description: "投诉类型" })}>
								<PublicCheck
									checkedList={reportTypeList}
									plainOptions={reportType}
									callBack={(reportTypeList) => this.complaintType(reportTypeList)}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "system.complaint.platform", defaultMessage: "投诉平台", description: "投诉平台" })}>
								<PublicCheck
									checkedList={reportPlatformList}
									plainOptions={platfromList}
									callBack={(reportPlatformList) => this.complaintPlatform(reportPlatformList)}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "brand.complaints.category", defaultMessage: "投诉类目", description: "投诉类目" })}>
								<Select
									showSearch
									mode="multiple"
									value={reportCategoryList}
									onChange={value => this.brandEditChange(value,'reportCategoryList')}
									placeholder={intl.formatMessage({ id: "brand.choose.complaints.category", defaultMessage: "请选择投诉类目", description: "请选择投诉类目" })}
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{
										prodList && prodList.filter(item => item.isDel === 0)
											.map(opt => <Option value={opt.id} key={opt.id}>
													{
														intl.locale === 'en'
															? opt.nameEn
															: opt.name
													}
												</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</div>				
				<Divider />
				<div className={intl.locale === 'en' ? 'search-form en' : 'search-form isBrandLawyer'}>
					<div className="edit-info-title">
						<FormattedMessage id="brand.clue.project.settings" defaultMessage="线索设置" description="线索设置"/>
					</div>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "brand.are.clues.allowed.to.be.reported", defaultMessage: "是否允许上报线索", description: "是否允许上报线索" })}>
								<RadioGroup onChange={(e)=>this.getLawyerFlag(e.target.value, 'lawyerFlag')} value={lawyerFlag}>
									<Radio value={1}><FormattedMessage id="brand.yes" defaultMessage="是" description="是"/></Radio>
									<Radio value={0}><FormattedMessage id="brand.no" defaultMessage="否" description="否"/></Radio>
								</RadioGroup>
							</Form.Item>
						</Col>
					</Row>
                    <Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "brand.are.clues.to.audit.litigation.cases", defaultMessage: "是否审核诉讼案件", description: "是否审核诉讼案件" })}>
								<RadioGroup onChange={(e)=>this.getLawyerFlag(e.target.value, 'lawyerSuitFlag')} value={lawyerSuitFlag}>
									<Radio value={1}><FormattedMessage id="brand.yes" defaultMessage="是" description="是"/></Radio>
									<Radio value={0}><FormattedMessage id="brand.no" defaultMessage="否" description="否"/></Radio>
								</RadioGroup>
							</Form.Item>
						</Col>
					</Row>
				</div>	
				<div className="btns">
					<Button type="primary" onClick={() => this.brandEditSave()}>
						<FormattedMessage id="global.determine" defaultMessage="确定"/>
					</Button>
					<Button onClick={() => this.cancel()}>
						<FormattedMessage id="global.cancel" defaultMessage="取消"/>
					</Button>
				</div>
			</Content>
		)
	}
}
