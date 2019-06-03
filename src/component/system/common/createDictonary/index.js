import React, {Component} from 'react';
import { Form, Input ,Row, Col, Modal, Select } from 'antd';
import { injectIntl } from 'react-intl';
const Option = Select.Option;
class AddDictonary extends Component{
    constructor() {
        super()
        this.state = {
        }
	}

	//确定
	onOk() {
		if(this.props.onOk) {
			this.props.onOk()
		}
    }
    
	//取消
	onCancel() {
		if(this.props.onCancel) {
			this.props.onCancel()
		}
    }
    
	//输入框事件
	addModalChange(value,type) {
		if(this.props.addModalChange) {
			this.props.addModalChange(value,type)
		}
	}
	
    render(){
		let { intl, visible,dictonary, type,dictonaryType,name} = this.props
        return(
			<Modal
				className="root"
				title={type==='add'?
					intl.formatMessage({id:'global.add',defaultMessage:'新增',description:'新增'}):
					intl.formatMessage({id:'global.edit',defaultMessage:'编辑',description:'编辑'})}
                visible={visible}
                onOk={() => this.props.onOk()}
                onCancel={() => this.props.onCancel()}
            >
				<div className="search-form">
					{
						name==='dictonary'?"":
						<Row>
							<Col span={20}>
								<Form.Item label={
									intl.formatMessage({ id: "system.category.number", defaultMessage: "类目编号", description: "类目编号"})
								}>
									<Input placeholder={intl.formatMessage({ id: "system.please.enter.category.number", defaultMessage: "请输入类目编号", description: "请输入类目编号" })} 
										onChange={(e) => this.addModalChange(e.target.value.trim(),'number')}
										type='number'
										disabled={type==='edit'?true:false}
										value={dictonary.number} />
								</Form.Item>
							</Col>
						</Row>
					}
					<Row>
						<Col span={20}>
							<Form.Item label={
								name==='dictonary'?
								intl.formatMessage({ id: "system.dictonary.name", defaultMessage: "字典名称", description: "字典名称" }):
								intl.formatMessage({ id: "system.category.name", defaultMessage: "类目名称", description: "类目名称" })
							}>
								<Input placeholder={
										name==='dictonary'?
										intl.formatMessage({ id: "system.dictonary.please.enter.name", defaultMessage: "请输入字典名称", description: "请输入字典名称" }):
										intl.formatMessage({ id: "system.category.please.enter.name", defaultMessage: "请输入类目名称", description: "请输入类目名称" })
									} 
                                    onChange={(e) => this.addModalChange(e.target.value.trim(),'name')}
                                    value={dictonary.name} />
							</Form.Item>
						</Col>
					</Row> 	
					{
						name==='dictonary'?"":
						<Row>
							<Col span={20}>
								<Form.Item label={
									intl.formatMessage({ id: "system.category.abbreviation", defaultMessage: "类目简称", description: "类目简称"})
								}>
									<Input placeholder={intl.formatMessage({ id: "system.please.enter.category.for.short", defaultMessage: "请输入类目简称", description: "请输入类目简称" })} 
										onChange={(e) => this.addModalChange(e.target.value.trim(),'abbreviation')}
										value={dictonary.abbreviation} />
								</Form.Item>
							</Col>
						</Row>
					}
					<Row>
						<Col span={20}>
							<Form.Item label={
								name==='dictonary'?
								intl.formatMessage({ id: "system.dictonary.name.en", defaultMessage: "字典英文名称", description: "字典英文名称" }):
								intl.formatMessage({ id: "system.category.name.en", defaultMessage: "类目英文名称", description: "类目英文名称" })
							}>
								<Input placeholder={
									name==='dictonary'?
									intl.formatMessage({ id: "system.dictonary.please.enter.name.en", defaultMessage: "请输入字典英文名称", description: "请输入字典英文名称" }):
									intl.formatMessage({ id: "system.category.please.enter.name.en", defaultMessage: "请输入类目英文名称", description: "请输入类目英文名称" })
								} 
                                    onChange={(e) => this.addModalChange(e.target.value.trim(),'nameEn')}
                                    value={dictonary.nameEn} />
							</Form.Item>
						</Col>
					</Row>
					{
						name==='dictonary'?
						<Row>
							<Col span={20}>
								<Form.Item label={intl.formatMessage({ id: "system.dictonary.type", defaultMessage: "字典类型", description: "字典类型" })}>
									<Select
										placeholder={intl.formatMessage({ id: "system.choose.dictonary.type", defaultMessage: "请选择字典类型", description: "请选择字典类型" })}
										disabled={type==='edit'?true:false}
										onChange={ value =>  this.addModalChange( value,'description') }
										value={ dictonary.description }
										dropdownMatchSelectWidth={false}
										showSearch
										filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
										{
											dictonaryType && dictonaryType.map(opt => <Option key={opt.type} value={opt.type}>{opt.type + ' ' + opt.description}</Option>)
										}
									</Select>
								</Form.Item>
							</Col>    
						</Row>	:''
					}
					{
						name==='dictonary'?
						<Row>
							<Col span={20}>
								<Form.Item label={intl.formatMessage({ id: "system.dictonary.value", defaultMessage: "字典值", description: "字典值" })}>
								<Input 
									placeholder={intl.formatMessage({ id: "system.please.enter.dictonary.value", defaultMessage: "请输入字典值", description: "请输入字典值" })} 
									onChange={(e) => this.addModalChange(e.target.value.trim(),'dictVal')}
									disabled={type==='edit'?true:false}
                                    value={dictonary.dictVal} />
								</Form.Item>
							</Col>    
						</Row>	:''
					}
				</div>
			</Modal>
        )
    }
}
export default injectIntl(AddDictonary)