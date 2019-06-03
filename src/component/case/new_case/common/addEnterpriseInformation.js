import React, { Component } from 'react'
import {injectIntl } from 'react-intl'
import { Row, Col, Form, Input} from 'antd';
import '../index.css'
class AddEnterprise extends Component{

    //获取inutValue
    getcommodityinformationinfo(e,type) {
        if(this.props.getcommodityinformationinfo){
            this.props.getcommodityinformationinfo(e,type)
        } 
    }

    render(){
        let { intl} = this.props
        let {companyName, legalPerson, comRegisNumber, telephone, idCard, registerAddr, wareAddr, factoryAddr} = this.props.enterpriseObj
        return(
            <div className="search-form">
                    <Row>
                        <Col span={20} className="enterprise">
                            <Form.Item  label={intl.formatMessage({id:"case.corporate.name",defaultMessage:"名称"})}>
                                <Input placeholder={intl.formatMessage({id:"case.please.enter.name",defaultMessage:"请输入名称"})}   onChange={(e)=>this.getcommodityinformationinfo(e,'companyName')} value={companyName}/>
                            </Form.Item>
                        </Col>
                        <Col span={20} className="enterprise">
                            <Form.Item  label={intl.formatMessage({id:"case.legal.information",defaultMessage:"法人信息"})}>
                                <Input placeholder={intl.formatMessage({id:"case.please.input.corporate.information",defaultMessage:"请输入法人信息"})}   onChange={(e)=>this.getcommodityinformationinfo(e,'legalPerson')} value={legalPerson}/>
                            </Form.Item>
                        </Col>
                        <Col span={20} className="enterprise">
                            <Form.Item  label={intl.formatMessage({id:"case.registration.number",defaultMessage:"企业登记号"})}>
                                <Input placeholder={intl.formatMessage({id:"case.please.enter.enterprise.registration.number",defaultMessage:"请输入企业登记号"})}   onChange={(e)=>this.getcommodityinformationinfo(e,'comRegisNumber')} value={comRegisNumber}/>
                            </Form.Item>
                        </Col>
                        <Col span={20} className="enterprise">
                            <Form.Item  label={intl.formatMessage({id:"case.contact.information",defaultMessage:"联系方式"})}>
                                <Input placeholder={intl.formatMessage({id:"case.please.enter.the.contact.way",defaultMessage:"请输入联系方式"})}   onChange={(e)=>this.getcommodityinformationinfo(e,'telephone')} value={telephone}/>
                            </Form.Item>
                        </Col>
                        <Col span={20} className="enterprise">
                            <Form.Item  label={intl.formatMessage({id:"case.id.number",defaultMessage:"身份证号"})}>
                                <Input style={{width:'100%'}} placeholder={intl.formatMessage({id:"case.please.enter.your.id.card.number",defaultMessage:"请输入身份证号"})}   onChange={(e)=>this.getcommodityinformationinfo(e,'idCard')} value={idCard}/>
                            </Form.Item>
                        </Col>
                        <Col span={20} className="enterprise">
                            <Form.Item  label={intl.formatMessage({id:"case.registered.address",defaultMessage:"注册地址"})}>
                                <Input placeholder={intl.formatMessage({id:"case.please.enter.a.registered.address",defaultMessage:"请输入注册地址"})}   onChange={(e)=>this.getcommodityinformationinfo(e,'registerAddr')} value={registerAddr}/>
                            </Form.Item>
                        </Col>
                        <Col span={20} className="enterprise">
                            <Form.Item  label={intl.formatMessage({id:"case.warehouse.address",defaultMessage:"仓库地址"})}>
                                <Input placeholder={intl.formatMessage({id:"case.please.enter.a.warehouse.address",defaultMessage:"请输入仓库地址"})}   onChange={(e)=>this.getcommodityinformationinfo(e,'wareAddr')} value={wareAddr}/>
                            </Form.Item>
                        </Col>
                        <Col span={20} className="enterprise">
                            <Form.Item  label={intl.formatMessage({id:"case.factory.address",defaultMessage:"工厂地址"})}>
                                <Input placeholder={intl.formatMessage({id:"case.please.enter.a.factory.address",defaultMessage:"请输入工厂地址"})}   onChange={(e)=>this.getcommodityinformationinfo(e,'factoryAddr')} value={factoryAddr} />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
        )
    }
}
export default injectIntl(AddEnterprise)