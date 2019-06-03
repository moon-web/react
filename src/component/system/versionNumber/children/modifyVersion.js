import React, {Component} from 'react';
import { Form, Input ,Row, Col, Modal , Select} from 'antd';
import { injectIntl } from 'react-intl';
const Option = Select.Option
class ModifyVersion extends Component{
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
	addModalChange(value,key) {
		if(this.props.addModalChange) {
			this.props.addModalChange(value,key)
		}
	}
	
	
    render(){
		let { intl, visible, modifiyVersion ,versionType} = this.props
        return(
			<Modal
				className="root"
                title={intl.formatMessage({id:'system.modify.the.specified.version',description:'修改指定版本号'})}
                visible={visible}
                onOk={() => this.props.onOk()}
                onCancel={() => this.props.onCancel()}
            >
				<div className="search-form">
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.type", description: "类型" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "system.please.select.the.type", defaultMessage: "请选择类型", description: "请选择类型" })}
                                    onChange={ value =>  this.addModalChange( value,'type') }
                                    value={ modifiyVersion.type }
									dropdownMatchSelectWidth={false}
									disabled
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        versionType && versionType.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale==='zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
                                    }
                                </Select>
							</Form.Item>
						</Col>
					</Row> 
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.version.number", defaultMessage: "版本号", description: "版本号" })}>
								<Input placeholder={intl.formatMessage({ id: "system.please.enter.the.specified.version.number", defaultMessage: "请输入指定版本号", description: "请输入指定版本号" })} 
									onChange={(e) => this.addModalChange(e.target.value.trim(),'versionNum')} value={modifiyVersion.versionNum}/>
							</Form.Item>
						</Col>
					</Row> 					
				</div>
			</Modal>
        )
    }
}
export default injectIntl(ModifyVersion)