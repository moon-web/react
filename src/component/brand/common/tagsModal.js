import React, { Component } from 'react'
import { Checkbox, Form,Row,Col } from 'antd'
import { FormattedMessage ,injectIntl} from 'react-intl'
const CheckboxGroup = Checkbox.Group;

class TagsModal extends Component {

    //选择tag
    tagsOnChange(checkedList) {
        if(this.props.tagsOnChange){
            this.props.tagsOnChange(checkedList)
        }
    }
    render() {
        let { intl, plainOptions, tagArr } = this.props
        return (
            <div className="search-form" style={{marginBottom:0}}>
                <Row>
					<Col span={20}>
						<Form.Item label={intl.formatMessage({ id: "brand.management.label", defaultMessage: "品牌标签" })}>
                        <CheckboxGroup
                            className="search-check"
                            value={tagArr}
                            onChange={checkedList => this.tagsOnChange(checkedList)}
                        >
                            {
                                plainOptions && plainOptions.map(item => (
                                    <Checkbox
                                        value={item.dictLabel}
                                        key={item.key}
                                        onChange={e => this.tagsOnChange(e)}
                                    >
                                        {
                                            intl.locale==='zh'?item.dictLabel:item.dictLabelEn
                                        }
                                    </Checkbox>
                                ))
                            }
                        </CheckboxGroup>
						</Form.Item>
					</Col>
				</Row>
			</div>
        )
    }
}
export default injectIntl(TagsModal)