import React, { Component } from 'react'
import { Select, Form,Row,Col } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import InputNumber from '../../common/form/numberInput'
const Option = Select.Option
class EditItem extends Component {
    constructor() {
        super()
        this.state = {
            endTime: ['周一','周二','周三','周四','周五','周六','周日'],
            unitTage: '1',//是否显示提示选择最后一天
        },
        this.endTimeMonth = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
        this.endTimeWeek = ['周一','周二','周三','周四','周五','周六','周日']
    }
    componentDidMount() {
        if(this.props.editUnitValue === '1') {
            this.setState({
                unitTage: this.props.editUnitValue,
                endTime: this.endTimeMonth
            })
        }else {
            this.setState({
                endTime: this.endTimeWeek,
                unitTage: this.props.editUnitValue
            })
        }        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.editUnitValue === '1') {
            this.setState({
                unitTage: nextProps.editUnitValue,
                endTime: this.endTimeMonth,  
            })
        }else {
            this.setState({
                unitTage: nextProps.editUnitValue,
                endTime: this.endTimeWeek, 
            })
        } 
    }
    
    //单位
    unit(value) {
        this.props.editUnit(value)
        if(value === '1') {
            this.setState({
                endTime: this.endTimeMonth,
                unitTage: value
            })
        }else {
            this.setState({
                endTime: this.endTimeWeek,
                unitTage: value
            })
        }
    }

    render() {
        let { intl,editUnitValue,editTimeValue,editTargetValue,editBrandName } = this.props
        return (
            <div className="search-form" style={{marginBottom:0}}>
                <Row>
					<Col span={20}>
						<Form.Item label={intl.formatMessage({ id: 'brand.interaction.name', defaultMessage: "品牌名称" })}>
                            <span>{ editBrandName ? editBrandName : '' }</span>
						</Form.Item>
					</Col>
                </Row>
                <Row>
                    <Col span={20}>
						<Form.Item label={intl.formatMessage({ id: "brand.interaction.brand.delivery", defaultMessage: "交付目标" })}>
                            <InputNumber 
                                style={{width:'100%'}} 
                                placeholder={intl.formatMessage({id: "brand.interaction.edit.delivery",defaultMessage: "请输入交付目标"})}  
                                onChange={value => this.props.editTarget(value)} 
                                value={editTargetValue?editTargetValue:''}
                            />
						</Form.Item>
					</Col>
                </Row>
                <Row>
                    <Col span={20}>
						<Form.Item label={intl.formatMessage({ id: "brand.interaction.edit.unit", defaultMessage: "单位" })}>
                        <Select
                                showSearch
                                placeholder={intl.formatMessage({id: "brand.please.choise.interaction.edit.unit", defaultMessage: "请选择单位"})}
                                value={ editUnitValue ? editUnitValue : undefined }
                                onChange={(value) => this.unit(value)}
                                className="flex_brand_select"
                            >
                                <Option value="1" key="1">月</Option>
                                <Option value="2" key="2">周</Option>
                            </Select> 
						</Form.Item>
					</Col>
                </Row>
                <Row>
                    <Col span={20}>
						<Form.Item label={intl.formatMessage({ id: "brand.interaction.edit.deadline", defaultMessage: "截止时间" })}>
                            <Select
                                showSearch
                                placeholder={intl.formatMessage({id: "brand.please.choise.interaction.edit.deadline", defaultMessage: "请选择截止时间"})}
                                value={ editTimeValue ? editTimeValue : undefined }
                                onChange={(value) => this.props.editTime(value)}
                                className="flex_brand_select"
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
                        this.state.unitTage === '1' ? <p className="timeBtag"><FormattedMessage id="brand.interaction.add.brand.day" defaultMessage="如果是每月的最后一天，请选择31号"/></p> : ''
                    }
                </Row>
            </div>
        )
    }
}
export default injectIntl(EditItem)