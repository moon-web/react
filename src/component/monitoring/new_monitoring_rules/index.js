import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import './index.css'
import PublicCheck from '../common/checkBox'
import MonitorTypeRadio from '../common/monitoringtyperadio'
import FilterCondition from '../common/filterConditionItem'
import QueryModal from '../common/queryModal'
import Contnet from '../../common/layout/content/index'
import { Row, Col, Form, Input, Button, Select, message ,Icon} from 'antd'
const Option = Select.Option
class MonitoringRules extends Component {
	constructor() {
		super()
		this.state = {
			brand: undefined,//所属品牌
			monitorName: '',//规则名称
			maxPage: 100,//查询范围
			checkedList: [1],
			type: 1,
			setModalVisible: false,
			queryListData: [],
			modalType: 'edit',
			editKey: 0,
			activeObj: [],
			filterListActiveObj: { filterRelation: undefined, filterType: undefined, filterVal: '', relationType: undefined },
			filterList: [],
			filterData: [],
			activeFilterData: [],
			filtersOut: [], //过滤条件之间的关系,
			activeFiltersOut: [],
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

	//所属类目回掉
	callBack(checkedList) {
		this.setState({
			checkedList
		})
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
	//确定按钮
	addMonitoringRules() {
		let conditionList = [], { monitorName, brand, type, maxPage, filtersOut, filterData, queryListData, checkedList } = this.state
		let { userInfo, isFetch } = this.props
		let userId = userInfo.userId || 1;
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
		if (monitorName === '' || monitorName === undefined) {
			message.info("请输入监控名称")
			return
		} else if (brand === "" || brand === undefined) {
			message.info('请选择所属品牌')
			return
		} else if (checkedList === "" || brand === []) {
			message.info('请选择监控平台')
			return
		} else if (maxPage === '' || maxPage === undefined) {
			message.info('请输入查询范围')
			return
		} else if (queryListData.length <= 0) {
			message.info('请添加查询条件')
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
			userId: userId,
			monitorName: monitorName,
			ownedBrand: brand,//所属品牌
			monitorPlatforms: checkedList,//监控平台
			monitorType: type,//监控类型
			maxPage: maxPage,//查询范围
			monitorConditions: queryListData,//查询条件
			filtersOut: tempFiltersOut,
			filters: conditionList
        }
		if(isFetch || isFetch === undefined){
			this.props.createMonitor(data)
		}

	}
	//取消新增
	cancel() {
		this.props.history.goBack()
		document.body.scrollTop = document.documentElement.scrollTop = 0;		
	}

	//添加查询条件Modal显示
	setModalVisible(setModalVisible, type) {
		let addCondition = { keyword: '', minPrice: '', maxPrice: '', consignmentPlace: '', key: Date.now() }
		this.setState({
			setModalVisible: true,
			modalType: type,
			activeObj: addCondition
		})
	}

	//Modal 确定
	onOKCall(value, data) {
		let { modalType, editKey, queryListData } = this.state
		if((data.keyword === '' || data.keyword === undefined) && (data.minPrice === '' || data.minPrice === undefined) && (data.maxPrice === '' || data.maxPrice === undefined) && (data.consignmentPlace === '' || data.consignmentPlace === undefined)) {
			message.info("至少输入一个查询条件")
			return
		}
		if (data.sortCondition === undefined) {
			data.sortCondition = ''
		}
		if (modalType === 'add') {
			queryListData.push(data)

		} else {
			queryListData[editKey] = data
		}
		this.setState({
			setModalVisible: value,
			queryListData,
		})
	}
	//Modal 取消
	onCancelCall(value) {
		this.setState({
			setModalVisible: value
		})
	}

	//编辑
	editQueryCondition(key, setModalVisible, type) {
		let { activeObj, queryListData } = this.state
		activeObj = queryListData[key]
		this.setState({
			activeObj,
			setModalVisible,
			modalType: type,
			editKey: key
		})
	}

	//删除
	delQueryCondition(key) {
		let data = this.state.queryListData
		data = data.filter(item => {
			return item.key !== key
		})
		this.setState({
			queryListData: data
		})
	}

	//查询条件列表渲染
	renderQueryConditionList(data) {
		let { intl } = this.props
		let queryConditionListData = []
		data.map((item, key) =>
			queryConditionListData.push(
				<div className="query_item" key={key}>
					<Row>
						<Col span={12}>
							<Form.Item label={intl.formatMessage({ id: "monitor.keyword", formatMessage: "关键字" })}>
								<span>{item.keyword}</span>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "monitor.sort.type", formatMessage: "排序类型" })}>
								<span>{ intl.locale === 'en' ? item.sortConditionNameEn : item.sortConditionName }</span>
							</Form.Item>
						</Col>
						<Col span={4}>
							<span className="condition_edit" onClick={() => this.editQueryCondition(key, true, 'edit')}>
								<FormattedMessage id="global.edit" defaultMessage="编辑" />
							</span>
							<span className="condition_del" onClick={() => this.delQueryCondition(item.key)}>
								<FormattedMessage id="global.delete" defaultMessage="删除" />
							</span>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item label={intl.formatMessage({ id: "monitor.price", formatMessage: "价格" })}>
								{
									!item.minPrice && !item.maxPrice ? '' : <span>{ item.minPrice ? item.minPrice : 0 } - { item.maxPrice ? item.maxPrice : '∞' }</span> 
								}
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label={intl.formatMessage({ id: "monitor.address", formatMessage: "发货地" })}>
								<span>{item.consignmentPlace}</span>
							</Form.Item>
						</Col>
					</Row>
				</div>

			))
		return queryConditionListData
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
			{ link: '', titleId: 'router.new.monitoring.rlue', title: '新增监控规则' }
		]
		let { intl, brandList, platfromList, monitorRulesQueryParamsSort } = this.props
		let { brand, monitorName, maxPage, queryListData, setModalVisible, filterData, filterList, filtersOut } = this.state
		
		return (
			<Contnet breadcrumbData={breadcrumbData} className="new-monitoring-rules-wrapper">
				<div className="search-form new-monitoring-rules-box">
					<Row>
						<Col span={16}>
							<Form.Item label={intl.formatMessage({ id: "monitor.picture.rule.name", defaultMessage: "规则名称" })}>
								<Input placeholder={intl.formatMessage({ id: "monitor.please.input.the.rule.name" })}
									value={monitorName}
									onChange={(e) => this.setState({ monitorName: e.target.value.trim() })}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "monitor.picture.rule.brand", defaultMessage: '所属品牌' })}>
								<Select
									placeholder={intl.formatMessage({ id: "monitor.please.input.picture.rule.brand", defaultMessage: '请选择所属品牌' })}
									onChange={(value) => this.getBrandInfo(value)}
									value={brand}
									showSearch
									optionFilterProp="children"
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "monitor.monitoring.platform", defaultMessage: "监控平台" })}>
								<PublicCheck
									checkedList={this.state.checkedList}
									plainOptions={platfromList}
									callBack={(checkedList) => this.callBack(checkedList)}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={16}>
							<Form.Item label={intl.formatMessage({ id: "monitor.picture.rule.monitoring.mode", defaultMessage: "监控类型" })}>
								<MonitorTypeRadio getMonitorTypeRadio={(value) => this.getMonitorTypeRadio(value)} value={this.state.type} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "monitor.query.range", defaultMessage: "查询范围" })}>
								<Input placeholder={intl.formatMessage({ id: "monitor.please.input.query.range" })}
									value={maxPage}
									type="number"
									onChange={e => this.setState({ maxPage: e.target.value.trim() })}
								/>
							</Form.Item>
						</Col>
						<Col span={2}>
							<Form.Item>
								<span>
									<FormattedMessage id="monitor.page" defaultMessage="页" />
								</span>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "monitor.query.condition", defaultMessage: "查询条件" })}>
								{
									this.renderQueryConditionList(queryListData)
								}
								<a className="query_condition" onClick={() => this.setModalVisible(true, 'add')}>
									<Icon type="plus"/>
									<FormattedMessage id="monitor.query.add.condition" defaultMessage="添加查询条件" />
								</a>
								<QueryModal
									modalVisible={setModalVisible}
									modalType={this.state.modalType}
									monitorRulesQueryParamsSort={monitorRulesQueryParamsSort}
									addQueryData={this.state.activeObj}
									onOk={(value, data) => this.onOKCall(value, data)}
									onCancel={(value) => this.onCancelCall(value)}
								/>
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
					<Button type='primary' onClick={() => this.addMonitoringRules()}>
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
export default injectIntl(MonitoringRules)