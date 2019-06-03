import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Row, Col, Form, Input, Select, Button, message } from 'antd'
import Contnet from '../../../../common/layout/content/index'
import '../../../common/index.css'
const Option = Select.Option
const { TextArea } = Input
class AddWhite extends Component {
	constructor() {
		super()
		this.state = {
			brandId: undefined,
			platformTypeId: undefined,
			whiteType: undefined,
			contents: '',

		}
	}
	
	//确定 新增
	addWhite() {
		let { brandId, platformTypeId, whiteType, contents } = this.state
		let { intl, userInfo, isFetch } = this.props
		if(brandId === '' || brandId === undefined) {
			message.warning(intl.formatMessage({ id: 'monitor.please.input.picture.rule.brand', defaultMessage: "请选择所属品牌", description: "请选择所属品牌" }));
            return 
		}else if(platformTypeId === "" || platformTypeId === undefined){
			message.warning(intl.formatMessage({ id: 'system.choose.platform', defaultMessage: "请选择平台", description: "请选择平台" }));
            return
		}else if(whiteType === "" || whiteType === undefined){
			message.warning(intl.formatMessage({ id: 'system.choose.shop.type', defaultMessage: "请选择店铺类型", description: "请选择店铺类型" }));
			return false
		}else if(contents === "" || contents === undefined){
			message.warning(intl.formatMessage({ id: 'system.please.shop.info', defaultMessage: "请输入店铺信息", description: "请输入店铺信息" }));
			return false
		}else {
			let data = {
				currentUserId: userInfo.userId,
				brandId: brandId,
				platformTypeId: platformTypeId,
				whiteType: whiteType,
				contents: contents,
			}
			if(isFetch || isFetch === undefined){
				this.props.addWhite(data)
			}
			
		}
	}
	//取消新增
	cancel() {
		this.props.history.goBack()
		document.body.scrollTop = document.documentElement.scrollTop = 0;		
	}
	
	render() {
		let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '/system/white', titleId: 'router.white.list.management', title: '白名单管理' },
            { link: '', titleId: 'global.add', title: '新增' },
        ]
		let { intl, brandList, platfromList, whiteListType } = this.props
		let { brandId, platformTypeId, whiteType } = this.state
		return( 
			<Contnet breadcrumbData={breadcrumbData} className="add-white-wrapper">
				<div className="search-form">
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({id:"monitor.picture.rule.brand",defaultMessage:'所属品牌'})}>
								<Select 
									placeholder={intl.formatMessage({id:"monitor.please.input.picture.rule.brand",defaultMessage:'请选择所属品牌'})}								
									onChange={(value)=>this.setState({brandId: value})}
									value={brandId}
									showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.value === '' ? false :  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{
                                        brandList.filter(item => item.isDelete === 0)
                                        	.map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
                                    }
								</Select>
                            </Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
                            <Form.Item label={intl.formatMessage({ id: "system.platform", defaultMessage: "所在平台", description: "所在平台" })}>
                                <Select
                                    value={platformTypeId}
                                    showSearch
                                    placeholder={intl.formatMessage({ id: "system.choose.platform", defaultMessage: "请选择平台", description: "请选择平台" })}
                                    dropdownMatchSelectWidth={true}
                                    onChange={value => this.setState({ platformTypeId: value })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                   {
                                        platfromList && platfromList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                                {
                                                    intl.locale === 'en'
                                                        ? opt.dictLabelEn
                                                        : opt.dictLabel
                                                }
                                            </Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({id:"system.shop.type",defaultMessage:"店铺类型", description:"店铺类型"})}>
								<Select	
									placeholder={intl.formatMessage({ id: "system.choose.shop.type", defaultMessage:'请选择店铺类型', description:'请选择店铺类型' })}
									onChange={(value)=>this.setState({whiteType: value})}				
									dropdownMatchSelectWidth={true}
									value={whiteType}
									showSearch
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>								
									{
                                        whiteListType && whiteListType.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                                {
                                                    intl.locale === 'en'
                                                        ? opt.dictLabelEn
                                                        : opt.dictLabel
                                                }
                                            </Option>)
                                    }
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={16}>
							<Form.Item label={intl.formatMessage({id:"system.shop.info",defaultMessage:"店铺信息", description:"店铺信息"})}>
								<span className="add-white-linkUrl">
									<FormattedMessage id="system.add.white.info" defaultMessage="需要输入: 店铺名称，掌柜名称。格式: 小打小闹卖白菜正品之家,z738245173  (一行一条数据，以回车换行)"/>
								</span>
								<TextArea rows={8} onChange={(e) => this.setState({contents:e.target.value})}/>
							</Form.Item>
						</Col>
					</Row>
				</div>
				<div className="btns">
					<Button type='primary' onClick={() => this.addWhite()}>
						<FormattedMessage id="global.determine" defaultMessage="确定" description="确定" />
					</Button>
					<Button onClick={() => this.cancel()} >
						<FormattedMessage id="global.cancel" defaultMessage="取消" description="取消" />
					</Button>
				</div>
			</Contnet>
		)
	}
}
export default injectIntl(AddWhite)