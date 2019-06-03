import React, {Component} from 'react';
import { Form, Input ,Row, Col, Modal, Radio } from 'antd';
import { injectIntl } from 'react-intl';
const RadioGroup = Radio.Group;
class AddRole extends Component{
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
		let { intl, visible, addRole } = this.props
        return(
			<Modal
				className="root"
                title={intl.formatMessage({id:'global.add',defaultMessage:'新增',description:'新增'})}
                visible={visible}
                onOk={() => this.props.onOk()}
                onCancel={() => this.props.onCancel()}
            >
				<div className="search-form">
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.role.name", defaultMessage: "角色名称", description: "角色名称" })}>
								<Input placeholder={intl.formatMessage({ id: "system.role.please.enter.role.name", defaultMessage: "请输入角色名称", description: "请输入角色名称" })} 
									onChange={(e) => this.addModalChange(e.target.value.trim(),'roleName')} value={addRole.roleName}/>
							</Form.Item>
						</Col>
					</Row> 
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.explain", defaultMessage: "说明", description: "说明" })}>
								<Input placeholder={intl.formatMessage({ id: "system.please.explain", defaultMessage: "请输入说明", description: "请输入说明" })} 
									onChange={(e) => this.addModalChange(e.target.value.trim(),'note')} value={addRole.note}/>
							</Form.Item>
						</Col>
					</Row> 
                    <Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.lawyer.role.case", defaultMessage: "处理案件", description: "处理案件" })}>
								<RadioGroup
                                    value={addRole.suitFlag}
                                    onChange={e => this.addModalChange(e.target.value, 'suitFlag' )}
                                >
                                    <Radio value={0}>否</Radio>
                                    <Radio value={1}>是</Radio>
                                </RadioGroup>
							</Form.Item>
						</Col>
					</Row>					
				</div>
			</Modal>
        )
    }
}
export default injectIntl(AddRole)