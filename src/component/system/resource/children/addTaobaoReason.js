import React, { Component } from 'react'
import { Input, Form, Select, Modal, Row, Col, message } from 'antd'
import { injectIntl } from 'react-intl'
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class AddTaobaoReason extends Component {
    constructor() {
        super()
        this.state = {
            type: 4,
            brandId: undefined,
            relationType: undefined,
            relationId: undefined,
            reasonId: undefined,
            tbReason: '',
            resourceTraList: [],
            resourceReasonList : []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tabbaoReasonData !== this.props.tabbaoReasonData && nextProps.edit) {
            let { brandId, relationType,relationId, reasonId, tbReason } = nextProps.tabbaoReasonData;
            this.setState({
                brandId,
                relationType,
                relationId,
                reasonId,
                tbReason
            },() => {
                this.getResourceForData()
            })
        } else if (nextProps.visible && nextProps.visible !== this.props.visible) {
            let { brandId, relationType,relationId, reasonId, tbReason } = nextProps.tabbaoReasonData;
            this.setState({
                brandId,
                relationType,
                relationId,
                reasonId,
                tbReason
            })
        } else if (nextProps.resourceTraList !== this.props.resourceTraList && nextProps.resourceTraList){
            let  resourceTraList  = nextProps.resourceTraList;
            let  resourceReasonList  = nextProps.resourceReasonList;
            this.setState({
                resourceTraList,
                resourceReasonList
            })
        }
    }

    getResourceForData() {
        let {relationType, brandId} = this.state;
        if (this.props.getResourceForData && relationType && brandId) {
            this.props.getResourceForData({ relationType, brandId })
        }
    }
    getBrandListForData() {
        let {relationType} = this.state;
        if (this.props.getTypeBrandList && relationType) {
            this.props.getTypeBrandList({ reportTypeOrList: relationType })
        }
    }

    addModalChange(value, key) {
        this.setState({
            [key]: value
        }, () => {
            let { relationType, brandId } = this.state
            if ((key === 'relationType' && (relationType !== undefined && brandId !== undefined)) || (key === 'brandId' && (relationType !== undefined && brandId !== undefined))) {
                this.getResourceForData()
            }
        })
    }

    handleCancel() {
        if (this.props.onCancel) {
            this.props.onCancel()
        }
        this.setState({
            brandId: undefined,
            relationType: undefined,
            relationId: undefined,
            reasonId: undefined,
            tbReason: '',
            resourceTraList: [],
            resourceReasonList : []
        })
    }

    handleOk() {
        let { intl } = this.props
        let { brandId, relationType, tbReason, type, relationId, reasonId } = this.state;
        if (!brandId) {
            message.info(intl.formatMessage({ id: "system.choose.brand.name", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" }))
            return
        } else if (!relationType) {
            message.info(intl.formatMessage({ id: "clue.report.choose.kind", defaultMessage: "请选择举报类别", description: "请选择举报类别" }))
            return
        } else if (relationType === 2 && !relationId) {
            message.info(intl.formatMessage({ id: "system.complaint.choose.trademark", defaultMessage: "请选择商标", description: "请选择商标" }))
            return
        } else if (!reasonId) {
            message.info(intl.formatMessage({ id: 'system.complaint.choose.reason', defaultMessage: '请选择投诉理由', description: '请选择投诉理由' }))
            return
        }  else if (!tbReason) {
            message.info(intl.formatMessage({ id: 'system.please.enter.tb.reason.description', defaultMessage: '请输入淘宝理由说明', description: '请输入淘宝理由说明' }))
            return
        } else {
            if(relationType !== 2 ) {
                relationId = ''
            }
            let data = {                
                type,
                brandId, 
                relationType, 
                relationId,
                reasonId,
                tbReason,
            }
            this.props.handleOk(data)
        }
    }

    render() {
        let { visible, intl, edit, reportType, brandList } = this.props;
        let { brandId, relationType, relationId, reasonId, tbReason, resourceTraList, resourceReasonList } = this.state;
        return (
            <Modal
                className='root resource-modal'
                visible={visible}
                onOk={() => this.handleOk()}
                onCancel={() => this.handleCancel()}
                title={
                    edit
                        ? intl.formatMessage({ id: "system.edit.tb.reason.description", defaultMessage: "编辑淘宝理由说明", description: "编辑淘宝理由说明" })
                        : intl.formatMessage({ id: "system.add.tb.reason.description", defaultMessage: "添加淘宝理由说明", description: "添加淘宝理由说明" })
                }
            >
                <div className='search-form'>                  
					<Row>
                        <Col span={20}>
                            <FormItem label={intl.formatMessage({ id: "system.brand.name", defaultMessage: "所属品牌", description: "所属品牌" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "system.choose.brand.name", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    value={brandId ? brandId : undefined}
                                    disabled={edit}
                                    onChange={(value) => this.addModalChange(value, 'brandId')}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        brandList && brandList.filter(item => item.isDelete === 0)
                                            .map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>              
                    <Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: 'clue.report.kind', defaultMessage: '举报类别', description: '举报类别' })}>
								<Select
									placeholder={intl.formatMessage({ id: "clue.report.choose.kind", defaultMessage: "请选择举报类别", description: "请选择举报类别" })}
									value={relationType}
									disabled={edit}
									onChange={(value) => this.addModalChange(value, 'relationType')}
									showSearch
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{
										reportType && reportType.filter(item => item.isDel === 0)
											.map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
									}
								</Select>
							</Form.Item>
						</Col>
                    </Row>
                    {
                        relationType === 2 ?
                        <Row>
                            <Col span={20}>
                                <FormItem label={intl.formatMessage({ id: 'system.trademark', defaultMessage: '商标', description: '商标' })}>
                                    <Select
                                        placeholder={intl.formatMessage({ id: "clue.report.choose.kind", defaultMessage: "请选择举报类别", description: "请选择举报类别" })}
                                        value={relationId ? relationId : undefined}
                                        onChange={(value) => this.addModalChange(value, 'relationId')}
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            resourceTraList && resourceTraList.filter(item => item.isDel === 0)
                                                .map(opt => <Select.Option key={opt.id} value={opt.id}> { opt.tbReason }</Select.Option>)
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row> : ''                   
                    }
                    <Row>
                        <Col span={20}>
                            <FormItem label={intl.formatMessage({ id: 'system.taobao.complaint', defaultMessage: '投诉理由', description: '投诉理由' })}>
                               <Select
									placeholder={intl.formatMessage({ id: 'system.complaint.choose.reason', defaultMessage: '请选择投诉理由', description: '请选择投诉理由' })}
                                    value={reasonId ? reasonId : undefined}
									//disabled={edit}
									onChange={(value) => this.addModalChange(value, 'reasonId')}
									showSearch
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{
										resourceReasonList && resourceReasonList.map(opt => <Select.Option key={opt.id} value={opt.id}> { opt.vrLabel }</Select.Option>)
									}
								</Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem label={intl.formatMessage({ id: 'system.reason.complaint', defaultMessage: '淘宝理由说明', description: '淘宝理由说明' })}>
								<TextArea onChange={(e) => this.addModalChange(e.target.value, 'tbReason')}  rows={4} value={tbReason}>
								</TextArea>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}
export default injectIntl(AddTaobaoReason)