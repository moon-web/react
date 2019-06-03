import React, { Component } from 'react'
import { Modal, Row, Col, Checkbox, Input, message } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import InputNumber from '../../form/numberInput'
const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;

class ExportExcelModal extends Component {
    constructor() {
        super()
        this.state = {
            autoTitleParam: [],
            autoPageNum: '100',
            tbName:''
        }
    }

    componentWillMount() {
        let { checkedData, tbName } = this.props;
        this.setState({
            autoTitleParam: checkedData,
            tbName: tbName
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checkedData !== this.props.checkedData) {
            this.setState({
                autoTitleParam: nextProps.checkedData,
            })
        }
    }

    // 修改数据
    handleChange(key, value) {
        this.setState({
            [key]: value
        })
    }

    // 弹窗确认
    handleOk() {
        let { onOk, intl } = this.props;
        let { autoTitleParam, autoPageNum, tbName } = this.state;
        if (!tbName) {
            message.info(intl.formatMessage({ id: 'report.please.enter.excel.name', defaultMessage: '请输入名称', description: '请输入名称' }));
            return;
        }
        if (!autoTitleParam.length) {
            message.info(intl.formatMessage({ id: 'report.please.select.the.data.option', defaultMessage: '请选择数据选项', description: '请选择数据选项' }));
            return;
        }
        if (!autoPageNum) {
            message.info(intl.formatMessage({ id: 'report.please.enter.the.number.of.pages', defaultMessage: '请输入分页数量', description: '请输入分页数量' }));
            return;
        }
        if (autoPageNum < 100 || autoPageNum > 5000) {
            message.info(intl.formatMessage({ id: 'report.the.number.of.pages.does.not.match', defaultMessage: '分页数量范围100~5000条，请输入此范围内数量。', description: '分页数量范围100~5000条，请输入此范围内数量。' }));
            return;
        }
        if (onOk) {
            onOk({autoTitleParam, autoPageNum, tbName})
        }
        this.setState({
            autoTitleParam: [],
            autoPageNum: '100'
        })
    }
    
    // 弹窗取消
    handleCancel() {
        let { onCancel } = this.props;
        if (onCancel) {
            onCancel()
        }
        this.setState({
            autoTitleParam: [],
            autoPageNum: '100'
        })
    }

    render() {
        let { title, visible, data, total, intl } = this.props;
        let { autoTitleParam, autoPageNum, tbName } = this.state;
        return (
            <Modal
                title={title}
                visible={visible}
                className='export-excel-modal'
                onOk={() => this.handleOk()}
                onCancel={() => this.handleCancel()}
            >
                <div>
                    <Row className='form-row'>
                        <Col span={8} className='label'>
                            <FormattedMessage id='report.excel.name' defaultMessage='名称' description='名称' />:
                        </Col>
                        <Col span={16} className='input-wrap'>
                            <Input 
                                value={tbName} 
                                onChange={e => this.handleChange('tbName', e.target.value)} 
                                placeholder={intl.formatMessage({id: "report.please.enter.excel.name", defaultMessage: "请输入名称" , description: "请输入名称"})}
                             />
                        </Col>
                    </Row>
                    <Row className='form-row'>
                        <Col span={8} className='label'>
                            <FormattedMessage id='report.data.selection' defaultMessage='数据选择' description='数据选择' />:
                        </Col>
                        <Col span={16} className='input-wrap'>
                            <CheckboxGroup 
                                value={autoTitleParam}
                                onChange={val => this.handleChange('autoTitleParam', val)}
                            >
                            {
                                data && data.map(item => 
                                    <Checkbox key={item.num} value={item.num}>{intl.locale === 'en' ? item.paramEn : item.param }</Checkbox>
                                    )
                            }
                            </CheckboxGroup>
                        </Col>
                    </Row>
                    <Row className='form-row'>
                        <Col span={8} className='label'>
                            <FormattedMessage id='report.number.of.pages' defaultMessage='分页数量' description='分页数量' />:
                        </Col>
                        <Col span={16} className='input-wrap'>
                            <InputGroup compact>
                                <InputNumber 
                                    style={{width: '50%'}}
                                    value={autoPageNum} 
                                    placeholder={intl.formatMessage({ id: 'report.please.enter.the.number.of.pages', defaultMessage: '请输入分页数量', description: '请输入分页数量' })}
                                    onChange={val => this.handleChange('autoPageNum', val)}
                                />
                                <Input 
                                    style={{width: '50%'}}
                                    value={total}
                                    disabled
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}


export default injectIntl(ExportExcelModal);