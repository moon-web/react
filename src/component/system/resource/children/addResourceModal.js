import React, { Component } from 'react';
import { Form, Input, Row, Col, Select, Modal, Radio, Upload, Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import Req from '../../../../api/req'
import PictureModal from '../../../common/layout/modal/pictureModal'
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
class AddAddress extends Component {
	constructor() {
		super()
		this.state = {
			showModalVisible: false,
			showModalImg: ''
		}
	}
	//确定
	onOk() {
		if (this.props.onOk) {
			this.props.onOk()
		}
	}
	//取消
	onCancel() {
		if (this.props.onCancel) {
			this.props.onCancel()
		}
	}
	//select选择事件
	//输入框事件
	addModalChange(value, type) {
		if (this.props.addModalChange) {
			this.props.addModalChange(value, type)
		}
	}
	//添加商标主题类型
	addTrademarkType(type) {
		if (this.props.addTrademarkType) {
			this.props.addTrademarkType(type)
		}
	}
	//上传图片onchange
	uploadHandleChange(fileList) {
		if (this.props.uploadHandleChange) {
			this.props.uploadHandleChange(fileList)
		}
	}
	//
	handlePreview(file) {
		this.setState({
			showModalVisible: true,
			showModalImg: file.url ? file.url : file.response.dataObject
		})
	}

	handleCancelImg() {
		this.setState({
			showModalVisible: false,
			showModalImg: ''
		})
	}
	render() {
		let { intl, visible, brandList, type, addResourceData, prodList, fileList, trademarkType, edit, reportType } = this.props
		let { showModalVisible, showModalImg } = this.state
		let title = ''
		if (edit) {
			switch (type) {
				case 1:
					title = intl.formatMessage({ id: "system.edit.address", defaultMessage: "编辑著作权", description: "编辑著作权" })
					break;
				case 2:
					title = intl.formatMessage({ id: "system.edit.trademark", defaultMessage: "编辑商标", description: "编辑商标" })
					break;
				case 3:
					title = intl.formatMessage({ id: "system.edit.reason", defaultMessage: "编辑理由", description: "编辑理由" })
					break;
				default:
					title = ''
					break;
			}
		} else {
			switch (type) {
				case 1:
					title = intl.formatMessage({ id: "system.add.address", defaultMessage: "添加著作权", description: "添加著作权" })
					break;
				case 2:
					title = intl.formatMessage({ id: "system.add.trademark", defaultMessage: "添加商标", description: "添加商标" })
					break;
				case 3:
					title = intl.formatMessage({ id: "system.add.reason", defaultMessage: "添加理由", description: "添加理由" })
					break;
				default:
					title = ''
					break;
			}
		}
		return (
			<Modal
				className="root"
				title={title}
				visible={visible}
				onOk={() => this.props.onOk()}
				onCancel={() => this.props.onCancel()}
			>
				<div className="search-form">												
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.brand.name", defaultMessage: "所属品牌", description: "所属品牌" })}>
								<Select
									placeholder={intl.formatMessage({ id: "system.choose.brand.name", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
									value={addResourceData.brandId ? addResourceData.brandId : undefined}
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
							</Form.Item>
						</Col>
					</Row>
					{
						type === 1 ?
							<div className='search-form'>
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: 'clue.report.kind', defaultMessage: '举报类别', description: '举报类别' })}>
											<Select
												placeholder={intl.formatMessage({ id: "clue.report.choose.kind", defaultMessage: "请选择举报类别", description: "请选择举报类别" })}
												value={addResourceData.relationType}
												disabled={edit}
												onChange={(value) => this.addModalChange(value, 'relationType')}
												showSearch
												filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											>
												{
													reportType && reportType.filter(item => item.dictVal !== 2)
														.map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
												}
											</Select>
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: 'system.name.of.copyright', defaultMessage: '著作权名称', description: '著作权名称' })}>
											<Input placeholder={intl.formatMessage({ id: 'system.trademark.copyright', defaultMessage: '请输入著作权名称', description: '请输入著作权名称' })}
												onChange={(e) => this.addModalChange(e.target.value.trim(), 'vrLabel')} value={addResourceData.vrLabel} />
										</Form.Item>
									</Col>
								</Row>
							</div> : ''
					}
					{
						type === 2 ?
							<div className='search-form'>
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: 'system.trademark.number', defaultMessage: '商标号', description: '商标号' })}>
											<Input placeholder={intl.formatMessage({ id: 'system.please.trademark.number', defaultMessage: '请输入商标号', description: '请输入商标号' })}
												onChange={(e) => this.addModalChange(e.target.value.trim(), 'vrLabel')} value={addResourceData.vrLabel} />
										</Form.Item>
									</Col>
								</Row>								
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: 'system.subject.of.trademark.text', defaultMessage: '商标文字主体', description: '商标文字主体' })}>
											<Input placeholder={intl.formatMessage({ id: 'system.please.trademark.theme', defaultMessage: '请输入商标主题', description: '请输入商标主题' })}
												onChange={(e) => this.addModalChange(e.target.value.trim(), 'description')} value={addResourceData.description} />
										</Form.Item>
									</Col>
								</Row> 
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: 'system.subject.of.trademark.picture', defaultMessage: '商标图片主体', description: '商标图片主体' })}>
											<Upload
												fileList={fileList}  //vrResource
												action={Req.uploadImage}
												withCredentials={true}
												name="file"
												listType="picture"
												onChange={(fileList) => this.props.uploadHandleChange(fileList)}
												onPreview={(file) => this.handlePreview(file)}
											>
												{
													fileList.length > 0 ? null : <a style={{ marginLeft: '0px' }}><Icon type="upload" /> <FormattedMessage id="global.upload" defaultMessage="上传图片" description="上传图片" /></a>
												}
											</Upload>											
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: "system.category", defaultMessage: "商品类目", description: "商品类目" })}>
											<Select
												placeholder={intl.formatMessage({ id: "system.choose.category", defaultMessage: "请选择商品类目", description: "请选择商品类目" })}
												value={addResourceData.prodTypeId}
												onChange={(value) => this.addModalChange(value, 'prodTypeId')}
												showSearch
												filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											>
												{
													prodList && prodList.filter(item => item.isDel === 0)
														.map(opt => <Option value={opt.id} key={opt.id}>														
															{
																intl.locale === 'en'
																	? opt.nameEn
																	: opt.name
															}
														</Option>)
												}
											</Select>
										</Form.Item>
									</Col>
								</Row>
							</div> : ''
					}
					{
						type === 3 ?
							<div className='search-form'>	
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: 'clue.report.kind', defaultMessage: '举报类别', description: '举报类别' })}>
											<Select
												placeholder={intl.formatMessage({ id: "clue.report.choose.kind", defaultMessage: "请选择举报类别", description: "请选择举报类别" })}
												value={addResourceData.relationType}
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
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: 'system.reason.number', defaultMessage: '理由名称', description: '理由名称' })}>
											<Input placeholder={intl.formatMessage({ id: 'system.please.reason.number', defaultMessage: '请输入理由名称', description: '请输入理由名称' })}
												onChange={(e) => this.addModalChange(e.target.value.trim(), 'vrLabel')} value={addResourceData.vrLabel} />
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: 'system.tb.reason', defaultMessage: '淘宝理由', description: '淘宝理由' })}>
											<Input
												placeholder={intl.formatMessage({ id: 'system.please.enter.tb.reason', defaultMessage: '请输入淘宝理由', description: '请输入淘宝理由' })}
												onChange={(e) => this.addModalChange(e.target.value.trim(), 'tbReason')}
												value={addResourceData.tbReason}
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: "system.reason.picture", defaultMessage: "理由图片", description: "理由图片" })}>
											<Upload
												fileList={fileList}  //vrResource
												action={Req.uploadImage}
												withCredentials={true}
												name="file"
												listType="picture"
												onChange={(fileList) => this.props.uploadHandleChange(fileList)}
												onPreview={(file) => this.handlePreview(file)}
											>
												{
													fileList.length > 0 ? null : <a style={{ marginLeft: '0px' }}><Icon type="upload" /> <FormattedMessage id="global.upload" defaultMessage="上传图片" description="上传图片" /></a>
												}
											</Upload>
										</Form.Item>
									</Col>
								</Row>
							</div> : ''
					}
					<PictureModal
						visible={showModalVisible}
						onCancel={() => this.handleCancelImg()}
						showImg={showModalImg}
					/>

				</div>
			</Modal>
		)
	}
}
export default injectIntl(AddAddress)