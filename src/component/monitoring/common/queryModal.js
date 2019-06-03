import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { Row, Col, Form, Modal, Input, Select } from 'antd'
import InputNumber from '../../common/form/numberInput'
import { getName } from '../../../utils/util'
const SelectOption = Select.Option;

class QueryCondition extends Component {
	constructor() {
		super()
		this.state = {
			modalVisible: false,
			originData: {},
			addQueryData: {
				keyword: '',
				minprice: '',
				maxprice: '',
				address: '',
				sortCondition: undefined
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		let { addQueryData, monitorRulesQueryParamsSort } = this.props;
		if (nextProps.addQueryData !== addQueryData || nextProps.monitorRulesQueryParamsSort !== monitorRulesQueryParamsSort) {
			let data = Object.assign({}, nextProps.addQueryData);
			if (!data.sortCondition && nextProps.monitorRulesQueryParamsSort.length) {
				data.sortCondition = nextProps.monitorRulesQueryParamsSort[0].dictVal
			}
			this.setState({
				addQueryData: data,
				originData: nextProps.addQueryData
			})
		}
	}

	//确定
	setModalOk(modalVisible) {
		let addQueryData = this.state.addQueryData;
		let { monitorRulesQueryParamsSort } = this.props;
		let result = getName(monitorRulesQueryParamsSort, addQueryData.sortCondition)
		addQueryData.sortConditionName = result.dictLabel;
		addQueryData.sortConditionNameEn = result.dictLabelEn;
		if (this.props.onOk) {
			this.props.onOk(modalVisible, addQueryData)
		}
	}
	//取消
	setModalVisible(modalVisible) {
		this.setState({
			addQueryData: Object.assign({}, this.state.originData)
		})
		if (this.props.onCancel) {
			this.props.onCancel(modalVisible)
		}
	}

	//输入框事件
	queryInputCondition(value, type) {
		let addQueryData = this.state.addQueryData;
		addQueryData[type] = value;
		this.setState({
			addQueryData
		})
	}


	render() {
		let { intl, modalVisible, modalType, monitorRulesQueryParamsSort } = this.props;
		let addQueryData = this.state.addQueryData;
		return (
			<Modal
				title={modalType === 'add' ?
					intl.formatMessage({ id: "monitor.query.add.condition", defaultMessage: "添加查询条件" }) : intl.formatMessage({ id: "monitor.query.edit.condition", defaultMessage: "编辑查询条件" })
				}
				centered={true}
				visible={modalVisible}
				onOk={() => this.setModalOk(false)}
				onCancel={() => this.setModalVisible(false)}
				className="root"
			>
				<div className="search-form" style={{ marginBottom: 0 }}>
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "monitor.keyword", formatMessage: "关键字" })}>
								<Input
									value={addQueryData.keyword}
									placeholder={intl.formatMessage({ id: "monitor.input.keyword", formatMessage: "请输入关键字" })}
									onChange={(e) => this.queryInputCondition(e.target.value.trim(), 'keyword')}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "monitor.price", formatMessage: "价格" })}>
								<Col span={11}>
									<InputNumber
										value={addQueryData.minPrice}
										placeholder={intl.formatMessage({ id: "monitor.please.price", formatMessage: "请输入价格" })}
										onChange={(value) => this.queryInputCondition(value, 'minPrice')}
									/>
								</Col>
								<Col span={2} style={{ textAlign: 'center' }}>
									-
							</Col>
								<Col span={11}>
									<InputNumber
										value={addQueryData.maxPrice}
										placeholder={intl.formatMessage({ id: "monitor.please.price", formatMessage: "请输入价格" })}
										onChange={(value) => this.queryInputCondition(value, 'maxPrice')}
									/>
								</Col>
							</Form.Item>
						</Col>
					</Row>
					<Row style={{ marginBottom: 0 }}>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "monitor.address", formatMessage: "发货地" })}>
								<Input
									value={addQueryData.consignmentPlace}
									placeholder={intl.formatMessage({ id: "monitor.please.address", formatMessage: "请输入发货地" })}
									onChange={(e) => this.queryInputCondition(e.target.value.trim(), 'consignmentPlace')}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row style={{ marginBottom: 0 }}>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "monitor.sort.type", formatMessage: "排序类型" })}>
								<Select
									value={addQueryData.sortCondition}
									onChange={value => this.queryInputCondition(value, 'sortCondition')}
									placeholder={intl.formatMessage({ id: "monitor.please.choose.sort.type", formatMessage: "请选择排序类型" })}
								>
									{
										monitorRulesQueryParamsSort && monitorRulesQueryParamsSort.filter(item => item.isDel === 0)
											.map(opt => <SelectOption key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</SelectOption>)
									}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</div>
			</Modal>
		)
	}
}
export default injectIntl(QueryCondition)