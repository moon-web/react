import React, { Component } from 'react'
import { Select, Input, Form,Row,Col } from 'antd'
import { injectIntl } from 'react-intl'
const Option = Select.Option
class NewBrandModal extends Component {

    //获取inputvalue
    getBrandInfo(value,type) {
        if(this.props.getBrandInfo){
            this.props.getBrandInfo(value,type)
        }
    }

    render() {
        let { intl,ownerBrandList,brandName,ownerBrand } = this.props
        return (
            <div className="search-form" style={{marginBottom:0}}>
                <Row>
					<Col span={20}>
						<Form.Item label={intl.formatMessage({ id: 'brand.interaction.name', defaultMessage: "品牌名称" })}>
							<Input placeholder={intl.formatMessage({id: 'please.brand.interaction.name',defaultMessage: '请输入所属品牌'})} onChange={(e)=>{this.getBrandInfo(e.target.value.trim(),'brandName')}} value={brandName}/>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={20}>
						<Form.Item label={intl.formatMessage({ id: "brand.interaction.brand.owner", defaultMessage: "所属品牌商", description: "所属品牌商" })}>
							<Select
								placeholder={intl.formatMessage({ id: "brand.olease.choose.interaction.brand.owner", defaultMessage: "请选择所属品牌商", description: "请选择所属品牌商" })}
								onChange={value => this.getBrandInfo(value,'ownerBrand')}
								value={ownerBrand}
								dropdownMatchSelectWidth={true}
								showSearch
								filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>
								{
									ownerBrandList && ownerBrandList.map((opt,i) => <Option key={i} value={opt.userId.toString()}>{opt.userName}</Option>)
								}
							</Select>
						</Form.Item>
					</Col>
				</Row>
			</div>
        )
    }
}
export default injectIntl(NewBrandModal)