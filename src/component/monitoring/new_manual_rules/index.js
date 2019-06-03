import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Row, Col, Form, Input, Select, Button, message } from 'antd'
import './index.css'
import MonitorTypeRadio from '../common/monitoringtyperadio'
import Contnet from '../../common/layout/content/index'
import FilterCondition from '../common/filterConditionItem'
const Option = Select.Option
const { TextArea } = Input
class ManualRule extends Component {
	constructor() {
		super()
		this.state = {
			type: 1,
			brand : undefined,//所属品牌
			monitorName: '',
			linkType: undefined,
			url:'',
			btag: true,
			filterList: [],
			filterData: [],
			filtersOut: [], //过滤条件之间的关系,
			filterListActiveObj: { filterRelation: undefined, filterType: undefined, filterVal: '', relationType: undefined },
			filtersOutActive: { nextFilter: '', prevFilter: '', relationType: undefined }
		}
	}
	componentWillMount() {
		let {filterList} = this.props
		if(filterList && filterList!==undefined){
			let result = [];
			result = JSON.stringify(filterList)
			result = JSON.parse(result)
			this.setState({
				filterList: result
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.filterList !== this.props.filterList) {
			let result = [];
			result = JSON.stringify(nextProps.filterList)
			result = JSON.parse(result)
			this.setState({
				filterList: result
			})
		}
	}
	//监控类型
	getMonitorTypeRadio(value) {
		this.setState({
			type: value
		})
	}
	//获取所属品牌
	getBrandInfo(value) {
		this.setState({
			brand: value
		})
	}
	//连接类型
	getLinkType(value) {
		this.setState({
			linkType: value
		})
	}
	//确定 新郑手动规则
	addManualRules() {
		let conditionList = [], { monitorName, brand, type, linkType, url, filtersOut, filterData,  } = this.state
		let { userInfo } = this.props
		let userId = userInfo.userId || 1
		let tempFiltersOut = []
		if (filterData.length > 0) {
			for (let i = 0; i < filterData.length; i++) {
				if (filterData[i].children) {
					for (let j = 0; j < filterData[i].children.length; j++) {
						if(j === 0){
							filterData[i].children[0].relationType = ''
						}
						if(filterData[i].dictVal === 2) {
							filterData[i].children[j].filterVal = filterData[i].children[j].filterVal.replace('-',',')
						}
						conditionList.push(filterData[i].children[j])
					}
				}
			}
		}
		if(monitorName === '' || monitorName === undefined) {
			message.info("请输入监控名称")
			return 
		}else if(brand === "" || brand === undefined){
			message.info('请选择所属品牌')
			return 
		}else if(linkType === "" || linkType === undefined){
			message.info('请选择连接类型')
			return 
		}else if(url === "" || url === undefined){
			message.info('请输入链接')
			return 
		}else if (filtersOut) {
			if (filtersOut.length > 0) {
				for (let i = 0; i < filtersOut.length - 1; i++) {
					tempFiltersOut.push(filtersOut[i])
					if (filtersOut[i].relationType === '' || filtersOut[i].relationType === undefined) {
						message.info('请选择条件之间的关系')
						return
					}
				}
			}
			if (filterData.length > 0) {
				for (let i = 0; i < filterData.length; i++) {
					if (filterData[i].children) {

					} else {
						message.info(`请添加${filterData[i].dictLabel}信息`)
						return
					}
				}
			}
		}
		let data = {
			//currentUserId: userId,
			userId: userId,
			monitorName: monitorName,//规则名称
			ownedBrand: brand,//所属品牌
			monitorType: type,//监控代理类型
			urlType: linkType,//地址类型
			url: url,
			filtersOut: tempFiltersOut,
			filters: conditionList
		}
		if(this.state.btag){
			this.props.newManualMonitor(data,() => {
				this.setState({
					btag: false
				})
			})
		}
	}
	//取消新增
	cancel() {
		this.props.history.goBack()
		document.body.scrollTop = document.documentElement.scrollTop = 0;		
	}

	//过滤条件tab
	tabClick(item, key) {
		let { filterData, filterList, filtersOut } = this.state
		filterList[key].active = !filterList[key].active
		let filtersOutActive = {
			prevFilter: '',
			nextFilter: '',
			relationType: ''
		}
		let isExist = false;
		let activeId = null;
		if (item.active === true) {
			filtersOut.push(filtersOutActive)
			let activeItem = {}
			for(let key in item){   
				if(key !== 'children'){
					activeItem[key] = item[key]
				}  
			} 
			filterData.push(activeItem)
		}else{
			for (let i in filtersOut) {
				if (filtersOut[i].prevFilter === item.dictVal || filtersOut[i].nextFilter === item.dictVal) {
					isExist = true
					activeId = i
				}
			}
			if (isExist) {
				if (filtersOut[activeId - 1]) {
					filtersOut[activeId - 1] = filtersOutActive
				}
				if (filtersOut[activeId + 1]) {
					filtersOut[activeId + 1] = filtersOutActive
				}
				filtersOut.splice(activeId, 1).join(',')
			} else {
				filtersOut.pop()
			}
			for(let i in filterData){
				if(filterData[i].dictVal === item.dictVal){					
					filterData.splice(i,1).join(',')
				}
			}
		}
		this.setState({
			filterData,
			filterList,
			filtersOut
		})
	}

	//添加单个条件
	addFilter(item, key) {
		let { filterData, filterListActiveObj } = this.state
		if (item.children && item.children.length >= 1) {
			if ((filterData[key].relationType === '' || filterData[key].relationType === undefined)) {
				message.info('请选择与或条件关系')
				return
			}
		}

		if (filterData[key].filterRelation === '' || filterData[key].filterRelation === undefined) {
			message.info('请包含条件关系')
			return
		}

		if (filterData[key].filterVal === '' || filterData[key].filterVal === undefined) {
			message.info('请填写限制条件')
			return
		}

		if(filterData[key].dictVal===2 && filterData[key].filterVal && !(/^\d+-\d+$/.test(filterData[key].filterVal))){
			message.info('请补全信息')
			return
		}

		filterData[key].relationType = undefined //与或条件
		filterData[key].filterRelation = undefined //包含条件
		filterData[key].filterVal = ''
		filterListActiveObj.filterType = item.dictVal
		for (let i = 0; i < filterData.length; i++) {
			if (item.dictVal === filterData[i].dictVal) {
				if (filterData[i].children) {
					filterData[i].children.push(filterListActiveObj)
				} else {
					filterData[i].children = []
					filterData[i].children.push(filterListActiveObj)
				}
			}
		}
		this.setState({
			filterData,
			filterListActiveObj: { filterRelation: undefined, filterType: undefined, filterVal: '', relationType: undefined }
		})

	}

	//选择
	conditionOnchange(value, type, key) {
		let { filterListActiveObj, filterData } = this.state
		filterListActiveObj[type] = value
		filterData[key][type] = value
		this.setState({
			filterListActiveObj,
			filterData
		})
	}
	//添加条件内容
	conditionInputOnchange(e, type, key, entryType) {
		let { filterListActiveObj, filterData } = this.state
		if (entryType === 'minPrice') {
			if (filterData[key][type] && filterData[key][type].indexOf('-') !== -1) {
				filterListActiveObj[type] = filterListActiveObj[type].replace(/^(\d+|\d*)-/, e.target.value + '-');
				filterData[key][type] = filterData[key][type].replace(/^(\d+|\d*)-/, e.target.value + '-');
			} else {
				filterListActiveObj[type] = e.target.value.trim() + '-'
				filterData[key][type] = e.target.value.trim() + '-'
			}
		} else if (entryType === 'maxPrice') {
			if (filterData[key][type] && filterData[key][type].indexOf('-') !== -1) {
				filterListActiveObj[type] = filterListActiveObj[type].replace(/-(\d+|\d*)$/, '-' + e.target.value);
				filterData[key][type] = filterData[key][type].replace(/-(\d+|\d*)$/, '-' + e.target.value);
			} else {
				filterListActiveObj[type] = '-' + e.target.value.trim()
				filterData[key][type] = '-' + e.target.value.trim()
			}
		} else if (entryType === 'time') {
			filterListActiveObj[type] = e;
			filterData[key][type] = e;
		} else {
			filterListActiveObj[type] = e.target.value.trim()
			filterData[key][type] = e.target.value.trim()
		}
		this.setState({
			filterListActiveObj,
			filterData
		})
	}
	//条件选择
	conditionSelectionOnchange(value, type, key, item) {
		let { filterData, filtersOut } = this.state
		let filtersOutActive = {
			prevFilter: filterData[key - 1].dictVal,
			nextFilter: filterData[key].dictVal,
			relationType: value
		}
		filtersOut[key - 1] = filtersOutActive
		this.setState({
			filtersOut
		})
	}
	//删除单个条件
	delFilterCondition(v, i, key) {
		let { filterData } = this.state
		let data = filterData[key].children
		if (data.length > 0) {
			data = data.filter(item => {
				return item.filterVal !== v.filterVal
			})
			filterData[key].children = data
			this.setState({
				filterData
			})
		}
	}
	//下移下移
	moveUpDown(item, key, type) {
		let { filterData, filtersOut } = this.state
		if (type === 'down') {
			filterData[key] = [filterData[key + 1], filterData[key + 1] = filterData[key]][0]
			if (key === 0 || key === filtersOut.length - 1) {
				filtersOut[key].prevFilter = filterData[key].dictVal
				filtersOut[key].nextFilter = filterData[key + 1].dictVal
				filtersOut[key + 1].prevFilter = filterData[key + 1].dictVal
			} else {
				filtersOut[key - 1].nextFilter = filterData[key].dictVal
				filtersOut[key].prevFilter = filterData[key].dictVal
				filtersOut[key].nextFilter = filterData[key + 1].dictVal
				filtersOut[key + 1].prevFilter = filterData[key + 1].dictVal
			}
			this.setState({
				filterData,
				filtersOut
			})
		} else {
			filterData[key - 1] = [filterData[key], filterData[key] = filterData[key - 1]][0]
			if (key === 1) {
				filtersOut[key - 1].prevFilter = filterData[key - 1].dictVal
				filtersOut[key - 1].nextFilter = filterData[key].dictVal
				filtersOut[key].prevFilter = filterData[key].dictVal
			} else if (key === filtersOut.length - 1) {
				filtersOut[key - 2].nextFilter = filterData[key - 1].dictVal
				filtersOut[key - 1].prevFilter = filterData[key - 1].dictVal
				filtersOut[key - 1].nextFilter = filterData[key].dictVal
				filtersOut[key].prevFilter = filterData[key].dictVal
			} else {
				filtersOut[key - 2].nextFilter = filterData[key - 1].dictVal
				filtersOut[key - 1].prevFilter = filterData[key - 1].dictVal
				filtersOut[key - 1].nextFilter = filterData[key].dictVal
				filtersOut[key].prevFilter = filterData[key].dictVal
			}
			this.setState({
				filterData,
				filtersOut
			})
		}
	}
	
	render() {
		let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '', titleId: 'router.data.monitoring', title: '数据监测管理' },
            { link: '/monitor/rule', titleId: 'router.monitoring.rlue.management', title: '监控规则管理' },
			{ link: '', titleId: 'router.new.manual.rlue', title: '新增手动规则' }
		]
		let { intl, brandList } = this.props
		let { brand, monitorName, linkType, filterList, filterData, filtersOut } = this.state
		return( 
			<Contnet breadcrumbData={breadcrumbData} className="new-monitoring-rules-wrapper">
				<div className="search-form new-monitoring-rules-box">
					<Row>
						<Col span={16}>
							<Form.Item label={intl.formatMessage({id:"monitor.picture.rule.name",defaultMessage:"规则名称"})}>
								<Input placeholder={intl.formatMessage({id:"monitor.please.input.the.rule.name",defaultMessage:'请输入规则名称'})}
									value={monitorName} 
									onChange={(e) => this.setState({monitorName: e.target.value.trim()}) }
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({id:"monitor.picture.rule.brand",defaultMessage:'所属品牌'})}>
								<Select 
									placeholder={intl.formatMessage({id:"monitor.please.input.picture.rule.brand",defaultMessage:'请选择所属品牌'})}								
									onChange={(value)=>this.getBrandInfo(value)}
									value={brand}
									showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.value === '' ? false :  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{
                                        brandList.filter(item => item.isDelete === 0)
                                        	.map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
                                    }
								</Select>
                            </Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({id:"monitor.picture.rule.link.type",defaultMessage:"链接类型"})}>
								<Select	
									placeholder={intl.formatMessage({ id: "monitor.please.link.type" })}
									onChange={(value)=>this.getLinkType(value)}				
									dropdownMatchSelectWidth={true}
									value={linkType}
									showSearch
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<Option value="1"><FormattedMessage id="monitor.goods" defaultMessage="商品"/></Option>
									<Option value="2"><FormattedMessage id="monitor.shop" defaultMessage="店铺"/></Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={16}>
							<Form.Item label={intl.formatMessage({id:"monitor.picture.rule.monitoring.mode",defaultMessage:"监控类型"})}>
								<MonitorTypeRadio getMonitorTypeRadio={(value)=>this.getMonitorTypeRadio(value)} value={this.state.type}/>
                            </Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={16}>
							<Form.Item label={intl.formatMessage({id:"monitor.input.link",defaultMessage:"输入链接"})}>
								<span className="linkUrl">
									<FormattedMessage id="monitor.one.line" defaultMessage="一行一个url，以回车换行"/>
								</span>
								<TextArea rows={8} onChange={(e) => this.setState({url:e.target.value})}/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "monitor.condition.add.rule", defaultMessage: "过滤条件" })}>
								<div className="tab-contain">
									<div className="tab-box">
										{
											filterList.map((item, key) => (
												<span key={key} className={item.active ? 'tab-item-active' : 'tab-item'} onClick={() => this.tabClick(item, key)}>
													<FormattedMessage id={`monitor.${item.dictLabelEn}`} defaultMessage={item.dictLabel} />

												</span>
											))
										}
									</div>
									<div className="tab-box-list">
										<FilterCondition
											filterData={filterData}
											addFilter={(item, key) => this.addFilter(item, key)}
											conditionSelectionOnchange={(value, type, key, item) => this.conditionSelectionOnchange(value, type, key, item)}
											conditionOnchange={(value, type, key) => this.conditionOnchange(value, type, key)}
											conditionInputOnchange={(e, type, key, entryType) => this.conditionInputOnchange(e, type, key, entryType)}
											delFilterCondition={(v, i, key) => this.delFilterCondition(v, i, key)}
											moveUpDown={(item, key, type) => this.moveUpDown(item, key, type)}
											filtersOut={filtersOut}
										/>
									</div>
								</div>
							</Form.Item>
						</Col>
					</Row>
				</div>
				<div className="btns">
					<Button type='primary' onClick={() => this.addManualRules()}>
						<FormattedMessage id="global.determine" defaultMessage="确定" description="确定" />
					</Button>
					<Button onClick={() => this.cancel()} >
						<FormattedMessage id="global.cancel" defaultMessage="取消" description="取消" />
					</Button>
				</div>
			</Contnet>
		)
	}
}
export default injectIntl(ManualRule)