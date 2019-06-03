import React, { Component } from 'react';
import { Form, Col} from 'antd';
export default class FormItem extends Component{
    render(){
        return(
            <Col span={this.props.col} className='monitoringName'>
                <Form.Item className="rulesDetailslistLable" label={this.props.label}>
                    <div className="text">{this.props.text}</div>
                </Form.Item>
            </Col>
        )
    }
}