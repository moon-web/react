import React, { Component } from 'react'
import { Modal, Row, Col, Form, Input, Radio, Checkbox, message } from 'antd'
import { injectIntl } from 'react-intl'
import NumberInput from '../../../../common/form/numberInput'
import { getName } from '../../../../../utils/util'
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
class AuditModal extends Component {
    constructor() {
        super()
        this.state = {
            status: 1,//线索价值
            reason: '', 
            targetVolume: '', 
            kind: [],
        }
    }
    componentWillMount() {
        let { cluesClassification, cluesValue, statusAudit } = this.props
        let data = Object.assign([],cluesValue)
        let cluesClassificationData = Object.assign([],cluesClassification)
        if(statusAudit && statusAudit === 6) {
            data.pop()
        }
        if(cluesClassification){
            cluesClassification[1].disabled = false
            cluesClassification[2].disabled = false
        }
        this.setState({
            cluesClassification: cluesClassificationData,
            cluesValue: data
        })
    }
    
	//确定
	onOk() {
        let { status, reason, targetVolume, kind } = this.state
        let { cluesClassification } = this.props
        let suitFlag = 0
        let caseType = ''        
        let data = {
            status, 
        }
        if(status === 1 ) {
            if(!reason){
                message.info("请输入无价值原因")
                return
            }else {
                data.reason = reason
            }            
        }
        if(status === 4) {
            if(kind.length <= 0) {
                message.info("请选择线索分类")
                return
            }else {
                if(kind.indexOf(1) >= 0) {
                    suitFlag = 1
                    let suitFlagStatus = getName(cluesClassification, 1)
                    data.suitFlagName = suitFlagStatus.dictLabel
                    data.suitFlagNameEn = suitFlagStatus.dictLabelEn
                }else {                    
                    suitFlag = 0
                }
                if(kind.indexOf(3) >= 0) {
                    let caseTypeStatus = getName(cluesClassification, 3) 
                    data.caseTypeName = caseTypeStatus.dictLabel
                    data.caseTypeNameEn = caseTypeStatus.dictLabelEn 
                    caseType = 1
                }else if(kind.indexOf(2) >= 0) {
                    let caseTypeStatus = getName(cluesClassification, 2) 
                    data.caseTypeName = caseTypeStatus.dictLabel
                    data.caseTypeNameEn = caseTypeStatus.dictLabelEn 
                    caseType = 2
                }
                data.suitFlag = suitFlag
                data.caseType = caseType                      
            }            
        }
        if(status === 6) {
            if(!targetVolume){
                 message.info("请设定目标销量")
                return
            }else {
                data.targetVolume = targetVolume
            }
        }
		if(this.props.onOk) {
			this.props.onOk(data)
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
        let { cluesClassification } = this.state
        this.setState({
            [type]: value
        })
        if(type === 'kind') {
            if(value.indexOf(2) >= 0) {
                cluesClassification[2].disabled = true
            }else {
                cluesClassification[2].disabled = false
            }
            if(value.indexOf(3) >= 0) {
                cluesClassification[1].disabled = true
            }else {
                cluesClassification[1].disabled = false
            }
        }
	}
    render() {
        let { intl, visible, cluesClassification } = this.props
        let { status, targetVolume, reason, kind, cluesValue } = this.state
        return (
            <Modal
                className="root"
                title={intl.formatMessage({id:'thread.thread.audit',defaultMessage:'线索审核',description:'线索审核'})}
                visible={visible}
                onOk={() => this.onOk()}
                onCancel={() => this.onCancel()}
            >
                <div className="search-form">
                    <Row>
                        <Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "thread.clue.value", defaultMessage: "线索价值", description: "线索价值" })}>
                                <RadioGroup
                                    value={status}
                                    onChange={e => this.addModalChange(e.target.value, 'status' )}
                                >
                                    {
                                        cluesValue.filter(item => item.isDel === 0)
                                            .map(opt => <Radio value={opt.dictVal} key={opt.dictVal}>{opt.dictLabel}</Radio>)
                                    }
                                </RadioGroup>
							</Form.Item>
						</Col>
                    </Row>
                    {
                        status === 1 ?
                        <Row>
                            <Col span={20}>
                                <Form.Item label={intl.formatMessage({id: "thread.valueless.reasons", defaultMessage:"无价值原因", description:"无价值原因"})}>
                                    <Input 
                                        placeholder={intl.formatMessage({id:"thread.valueless.please.input.reasons", defaultMessage:"请输入无价值原因",description:"请输入无价值原因"})}
                                        value={reason}
                                        onChange={e => this.addModalChange(e.target.value, 'reason' )}
                                    />
                                </Form.Item>
                            </Col>
                        </Row> : 
                        status === 6 ?
                        <Row>
                            <Col span={20}>
                                <Form.Item label={intl.formatMessage({id: "thread.target.sales.volume", defaultMessage:"目标销量", description:"目标销量"})}>
                                    <NumberInput 
                                        placeholder={intl.formatMessage({id:"thread.target.sales", defaultMessage:"请设定目标销量",description:"请设定目标销量"})}
                                        value={targetVolume}
                                        onChange={value => this.addModalChange(value, 'targetVolume' )}
                                    />
                                </Form.Item>
                            </Col>
                        </Row> : 
                        <Row>
                            <Col span={20}>
                                <Form.Item label={intl.formatMessage({ id: "thread.clue.kind", defaultMessage: "线索分类", description: "线索分类" })}>
                                    <CheckboxGroup onChange={value => this.addModalChange(value, 'kind')} value={kind}>
                                        {
                                            cluesClassification && cluesClassification.length > 0 && cluesClassification.filter(item => item.isDel === 0) ?
                                            cluesClassification.map((v,i)=>(
                                                    <Checkbox value={v.dictVal} key={v.dictVal} disabled={v.disabled}>{ intl.locale === 'zh' ? v.dictLabel:  v.dictLabelEn }</Checkbox>
                                                )):''
                                        }
                                    </CheckboxGroup>
                                </Form.Item>
                            </Col>
                        </Row>
                    }
                </div>
            </Modal>
        )
    }
}
export default injectIntl(AuditModal)