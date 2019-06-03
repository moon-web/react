import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Radio } from 'antd';
const RadioGroup = Radio.Group;

class MonitorTypeRadio extends Component {
    
    //选择
    onChangeRadio(e) {
        if(this.props.getMonitorTypeRadio){
            this.props.getMonitorTypeRadio(e.target.value)
        }
    }

    render(){
        return(
            <div>
                <div>
                    <RadioGroup onChange={(e)=>this.onChangeRadio(e)} value={this.props.value}>
                        <Radio value={1}>vps</Radio>
                        <Radio value={2}><FormattedMessage id="mointring.mobile.distribution" defaultMessage="手机分发" description="手机分发" /></Radio>
                    </RadioGroup>
                </div>
            </div>
        )
    }
}
export default injectIntl(MonitorTypeRadio)