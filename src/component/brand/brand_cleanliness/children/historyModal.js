import React, { Component } from 'react'
import { Row, Col, Form, DatePicker, Modal, message } from 'antd'
import { injectIntl } from 'react-intl'
import InputNumber from '../../../common/form/numberInput';
class HistoryModal extends Component {
	constructor(){
		super()
		this.state = {
			tortNum: '',
			monitorNum: '',
			gmtMonitor: ''
		}
	}
	componentWillMount() {
		
	}
	historyChange(data,value,type){
		this.setState({
			[type]: value
		})
	}
	historyModalOk() {
		let { gmtMonitor, tortNum, monitorNum } = this.state
		let { intl, onOk } = this.props
        if(gmtMonitor === '' || gmtMonitor === undefined) {
            message.info(intl.formatMessage({ id: "brand.cleanliness.choose.history.time", defaultMessage: "'请选择历史时间'", description: "'请选择历史时间'" }))
            return false
        }
        if(!tortNum) {
            message.info(intl.formatMessage({ id: "brand.cleanliness.input.history.infringements", defaultMessage: "请输入侵权数量", description: "请输入侵权数量" }))
            return false
        }
        if(!monitorNum) {
            message.info(intl.formatMessage({ id: "brand.cleanliness.input.history.total.infringements", defaultMessage: "请输入总侵权数量", description: "请输入总侵权数量" }))
            return false
        }
        if(Number(tortNum) > Number(monitorNum)) {
            message.info(intl.formatMessage({ id: "brand.cleanliness.input.history.than.total.infringements", defaultMessage: "历史侵权数量大于历史总侵权数量", description: "历史侵权数量大于历史总侵权数量" }))
            return false
		}
		if(onOk) {
			let data = {
				gmtMonitor,
				tortNum,
				monitorNum
			}
			onOk(data)
		}
	}
	render(){
		let { visible, intl } = this.props
		return(
			<Modal
				className="root history-modal"
				title={intl.formatMessage({id:'brand.cleanliness.history.data',defaultMessage:'历史数据'})}
				visible={visible}
				onOk={() => this.historyModalOk()}
				onCancel={() => this.props.onCancel()}
				destroyOnClose
			>
				<div className="search-form">
					<Row>
						<Col span={22}>
							<Form.Item label={intl.formatMessage({ id: 'brand.cleanliness.history.time', defaultMessage: "历史时间" })}>
								<DatePicker onChange={(dates, dateStrings) => this.historyChange(dates, dateStrings, 'gmtMonitor')} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={22}>
							<Form.Item label={intl.formatMessage({ id: 'brand.cleanliness.history.infringements', defaultMessage: "侵权数量" })}>
								<InputNumber 
                                    placeholder={intl.formatMessage({ id: "brand.cleanliness.input.history.infringements", defaultMessage: "请输入侵权数量", description: "请输入侵权数量" })}
									onChange={(value) => this.historyChange('',value,'tortNum')}
									value={this.state.tortNum}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={22}>
							<Form.Item label={intl.formatMessage({ id: 'brand.cleanliness.history.total.infringements', defaultMessage: "总商品数" })}>
								<InputNumber 
									onChange={(value) => this.historyChange('',value,'monitorNum')} 
									placeholder={intl.formatMessage({ id: "brand.cleanliness.input.history.total.infringements", defaultMessage: "请输入总商品数", description: "请输入总商品数" })}
									value={this.state.monitorNum}
								/>									
							</Form.Item>
						</Col>
					</Row>
				</div>	
			</Modal>
		)
	}
} 
export default injectIntl(HistoryModal)