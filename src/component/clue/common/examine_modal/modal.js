import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, Row, Col, Form, Select, Checkbox } from 'antd'
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
class ExamineModal extends Component {
	constructor(){
		super()
		this.state = {
			images: {
                img1: require('../../../../assets/images/one.png'),
                img2: require('../../../../assets/images/two.png'),
                img3: require('../../../../assets/images/three.png'),
                img4: require('../../../../assets/images/four.png'),
                img5: require('../../../../assets/images/five.png'),
                img6: require('../../../../assets/images/six.png'),
                img7: require('../../../../assets/images/seven.jpg'),
                img8: require('../../../../assets/images/eight.jpg')
            }
		}
	}
	examineModalChange(value,type) {
		if(this.props.examineModalChange) {
			this.props.examineModalChange(value,type)
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
	render() {
		let { intl, clue, visible, brandList, prodList, examinData, infringementList, monitorStatus } = this.props
		let { images } = this.state
		let title = ''
		if(clue === 'clue') {
			title = intl.formatMessage({ id: "clue.lead.review", defaultMessage: "线上线索审核", description: "线上线索审核" })
		}else {
			title = intl.formatMessage({ id: "clue.report.task.online.review", defaultMessage: "举报任务线上线索审核", description: "举报任务线上线索审核" })
		}
		return(
			<Modal
				className="root"
                title={ title }
                visible={visible}
				onCancel={() => this.onCancel()}
				onOk={() => this.onOk()}
            >
				<div className="search-form clue-online">
					{
						clue === 'clue' ?
						<Row>
							<Col span={20}>
								<Form.Item label={intl.formatMessage({ id: "system.brand.name", defaultMessage: "所属品牌", description: "所属品牌" })}>
									<Select
										placeholder={intl.formatMessage({ id: "system.choose.brand.name", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
										value={examinData.brandId}
										onChange={(value) => this.examineModalChange(value,'brandId')}
										showSearch
										filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
										{
											brandList && brandList.filter(item => item.isDelete === 0)
												.map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
										}
									</Select>
								</Form.Item>
							</Col>
						</Row> : ''
					}
					{
						clue === 'clue' || (clue === 'reportClue' && monitorStatus === 1)?
						<Row>
							<Col span={20}>
								<Form.Item label={intl.formatMessage({ id: "clue.report.product.kind", defaultMessage: "产品分类", description: "产品分类" })}>
									<Select
										placeholder={intl.formatMessage({ id: "clue.report.choose.product.kind", defaultMessage: "请选择产品分类", description: "请选择产品分类" })}
										value={examinData.prodCategoryId}
										onChange={(value) => this.examineModalChange(value,'prodCategoryId')}
										showSearch
										filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
										{
											prodList && prodList.filter(item => item.isDel === 0)
												.map(opt => <Option value={opt.id} key={opt.id}>{intl.locale==='zh'?opt.name:opt.nameEn}</Option>)
										}
									</Select>
								</Form.Item>
							</Col>	
						</Row> 
						: ''
					}				
					<Row>
						<Col span={20}>
                            <Form.Item label={intl.formatMessage({ id: "monitor.tort.type", defaultMessage: "侵权类型", description: "侵权类型" })}>
                                <CheckboxGroup
                                    className="search-check"
                                    value={examinData.tempTortsType}
                                    onChange={checkedList => this.examineModalChange(checkedList,'tempTortsType')}
                                >
                                    {
                                        infringementList && infringementList.map(item => (
                                            <Checkbox
                                                value={item.dictVal}
                                                key={item.dictVal}
                                                onChange={e => this.examineModalChange(e,'tempTortsType')}
                                            >
                                                <img className="checkbox-icon" src={images['img' + item.dictVal]} alt="icon" />
                                                {
                                                    item.dictEng
                                                        ? <FormattedMessage id={item.dictEng} defaultMessage={item.dictLabel} description={item.dictLabel} />
                                                        : item.dictLabel
                                                }
                                            </Checkbox>
                                        ))
                                    }
                                </CheckboxGroup>
                            </Form.Item>
                        </Col>
					</Row>
				</div>
            </Modal>
		)
	}
}
export default injectIntl(ExamineModal)