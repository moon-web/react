import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'antd';
import InputNumber from '../../../common/form/numberInput'
import '../../index.css'
// 请输入线索奖励modal(线索操作审核通过)
class CueBonusModal extends Component {
    
    //get createmoney
    getInputValue(value,type) {
        if(this.props.getInputValue){
            this.props.getInputValue(value,type)
        }
    }

    render() {
        let { intl, createMoney } = this.props
        return (
            <div className="investigation-detail">
                <Row>
                    <InputNumber 
                        placeholder={intl.formatMessage({id: "investigation.detail.please.input.the.reward.amount",defaultMessage: "请输入线索奖励金额"})} 
                        onChange={value => this.getInputValue(value,'createMoney')} 
                        value={createMoney}
                    />
                </Row>
            </div>
        )
    }
}
export default injectIntl(CueBonusModal)