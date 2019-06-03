import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Row, Col, Form, Input, Select, Icon, DatePicker } from 'antd'
import './common.css'
import moment from 'moment'
const Option = Select.Option;
const InputGroup = Input.Group;
class FilterConditionItem extends Component {
	constructor() {
		super()
		this.state = {
			activeObj: {filterRelation:'',filterType:'',filterVal:'',relationType:''},
			filterData: [],
			filtersOut: []
		}
	}
	componentWillReceiveProps(nextprops) {
		this.setState({
			filterData: nextprops.filterData,
			filtersOut: nextprops.filtersOut
		})
	}
	//添加
	addFilter(item,key) {
		if(this.props.addFilter){
			this.props.addFilter(item,key)
		}
	}
	//条件选择
	conditionSelectionOnchange(value,type,key,item) {
		if(this.props.conditionSelectionOnchange) {
			this.props.conditionSelectionOnchange(value,type,key,item)
		}
	}   
	//选择
	conditionOnchange(value,type,key) {
		if(this.props.conditionOnchange) {
			this.props.conditionOnchange(value,type,key)
		}
	}
	//添加条件内容
	conditionInputOnchange(e,type,key, entryType) {
		if(this.props.conditionInputOnchange) {
			this.props.conditionInputOnchange(e,type,key, entryType)
		}
	}
	//删除条件
	delFilterCondition(v,i,key) {
		if(this.props.delFilterCondition) {
			this.props.delFilterCondition(v,i,key)
		}
	}

	//下移上移
	moveUpDown(item,key,type) {
		if(this.props.moveUpDown) {
			this.props.moveUpDown(item,key,type)
		}
	}

	render() {
		let { intl } = this.props
		let { filterData,filtersOut } = this.state
		return (
			<div className="filter-condition-wrapper">
				{
					filterData.map((item,key) => (
						<div key={key} className="filter-condition-wrapper-item">
							{
								key === 0 ? '' :
									<Row className="filter-condition-filter-condition">
										<Col span={6}>
											<Form.Item>
												<Select	
													placeholder={intl.formatMessage({ id: "monitor.condition.add.condition",defaultMessage:'请选择条件关系' })}				
													dropdownMatchSelectWidth={true}
													showSearch
													value={filtersOut[key-1]?filtersOut[key-1].relationType ? filtersOut[key-1].relationType : undefined: undefined}
													onChange={(value) => this.conditionSelectionOnchange(value,'relationType',key,item)}
													filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
												>
													<Option value="0"><FormattedMessage id="monitor.or" defaultMessage="或"/></Option>
													<Option value="1"><FormattedMessage id="monitor.and" defaultMessage="与"/></Option>
												</Select>
											</Form.Item>
										</Col> 
									</Row>
							}
							<Row>
								<Col span={19}>				
									<div className="filter-condition">	
										<div className="filter-condition-condition">
											<Col span={24}>
												<Form.Item label={intl.formatMessage({id:`monitor.${item.dictLabelEn}`,defaultMessage:`${item.dictLabel}`})}>
													<div>
														<Col span={1}>（</Col>
														<Col span={19}>
															{
																item.children && item.children.length >= 1 ?
																	<Col span={6}>
																		<Form.Item>
																			<Select	
																				placeholder={intl.formatMessage({ id: "monitor.condition.add.condition" })}				
																				dropdownMatchSelectWidth={true}
																				showSearch
																				value={item.relationType ? item.relationType : undefined}
																				onChange={(value) => this.conditionOnchange(value,'relationType',key)}
																				filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
																			>
																				<Option value="0"><FormattedMessage id="monitor.or" defaultMessage="或"/></Option>
																				<Option value="1"><FormattedMessage id="monitor.and" defaultMessage="与"/></Option>
																			</Select>
																		</Form.Item>
																	</Col> : ''
															}															
															<Col span={6}>
																<Form.Item>
																	<Select	
																		placeholder={intl.formatMessage({ id: "monitor.condition.add.condition" })}				
																		dropdownMatchSelectWidth={true}
																		showSearch
																		value={item.filterRelation ? item.filterRelation : undefined}
																		onChange={(value) => this.conditionOnchange(value,'filterRelation',key)}
																		filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
																	>
																		<Option value="0"><FormattedMessage id="monitor.contain" defaultMessage="包含"/></Option>
																		<Option value="1"><FormattedMessage id="monitor.not.contain" defaultMessage="不包含"/></Option>
																	</Select>
																</Form.Item>
															</Col>
															<Col span={12} style={{paddingLeft:'10px',paddingRight:'10px'}}>
																{
																	item.dictVal === 2 ? 
																		<InputGroup>
																			<Input style={{ width: '49%', textAlign: 'center', borderRight: 0}} type="number" placeholder={intl.formatMessage({id:'monitor.minprice',defaultMessage:'请输入最小金额'})} value={item.filterVal ? item.filterVal.split('-')[0] : '' } onChange={(e) => this.conditionInputOnchange(e,'filterVal',key, 'minPrice')} />
																			<Input style={{ width: '2%', borderLeft: 0, borderRight: 0, pointerEvents: 'none', backgroundColor: '#fff', padding: 0, textAlign: 'center' }} placeholder="-" disabled />
																			<Input style={{ width: '49%', textAlign: 'center', borderLeft: 0}} type="number" placeholder={intl.formatMessage({id:'monitor.maxprice',defaultMessage:'请输入最大金额'})} value={item.filterVal ? item.filterVal.split('-')[1] : ''} onChange={(e) => this.conditionInputOnchange(e,'filterVal',key, 'maxPrice')} />
																		</InputGroup>
																	: ''
																}
																{
																	item.dictVal === 9 ? 
																		<DatePicker 
																			value={item.filterVal ? moment(item.filterVal, 'YYYY-MM-DD'): null}
																			onChange={(date, dateString) => this.conditionInputOnchange(dateString,'filterVal',key, 'time')} />
																	: ''
																}
																{
																	item.dictVal !== 9 && item.dictVal !== 2? 
																		<Input 
																			placeholder={intl.formatMessage({id:`monitor.input.${item.dictLabelEn}`,defaultMessage:`请输入${item.dictLabel}`})}																	
																			value={item.filterVal ? item.filterVal : ''}
																			onChange={(e) => this.conditionInputOnchange(e,'filterVal',key)}
																		/>
																	: ''
																}																
															</Col>
														</Col>
														<Col span={1}>）</Col>									
														<Col span={3}>
															<span className="condition_add" onClick={() => this.addFilter(item,key)}>
																<FormattedMessage id="global.add.to" defaultMessage="添加" />
															</span>
														</Col>
													</div>
												</Form.Item>
											</Col>
										</div>
										<div style={{display:'flex'}}>
											<div style={{width:'80px'}}></div>
											<div className="filter-condition-box">																	
												{
													item.children ? item.children.map((v,i) => (
															<div className="filter-condition-list" key={i}>
																{
																	i === 0 ? '' :
																	<span className="filter-condition-list-condition">
																		{v.relationType === '0' ? <FormattedMessage id="monitor.or" defaultMessage="或"/> : <FormattedMessage id="monitor.and" defaultMessage="与"/>}
																	</span>
																}
																<div className="filter-condition-item">
																	<span>{v.filterRelation === '0' ? 
																		<FormattedMessage id="monitor.contain" defaultMessage="包含"/> : <FormattedMessage id="monitor.not.contain" defaultMessage="不包含"/>}
																	</span>
																	<span>（{v.filterVal}）</span>
																	<Icon type="close" theme="outlined" onClick={() => this.delFilterCondition(v,i,key)}/>
																</div>
															</div>
														))
													: ''
												}
											</div>	
										</div>	
									</div>
								</Col>
								<Col span={5}>
									{
										key === 0 && filterData.length > 1? 
											<div className="filter-move"> 
												<span onClick={() => this.moveUpDown(item,key,'down')}>
													<FormattedMessage id="global.add.move.down" defaultMessage="下移" />
												</span>
											</div> : ''									
									}
									{
										key !== 0 && key !== filterData.length-1  ?										
											<div className="filter-move"> 
												<span onClick={() => this.moveUpDown(item,key,'up')}>
													<FormattedMessage id="global.add.move.up" defaultMessage="上移" />
												</span>
												<span className="filter-ge">|</span>
												<span onClick={() => this.moveUpDown(item,key,'down')}>
													<FormattedMessage id="global.add.move.down" defaultMessage="下移" />
												</span>
											</div> : ''
									}
									{
										key === filterData.length-1 && key !== 0?
											<div className="filter-move"> 
												<span onClick={() => this.moveUpDown(item,key,'up')}>
													<FormattedMessage id="global.add.move.up" defaultMessage="上移" />
												</span>
											</div> : ''
									}
								</Col>	
							</Row>
						</div>
					))
				}	
			</div>
		)
	}
}
export default injectIntl(FilterConditionItem)