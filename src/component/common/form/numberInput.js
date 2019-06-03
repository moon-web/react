import React, { Component } from 'react'
import { Input } from 'antd'

export default class InputNumber extends Component {
    handleChange(value) {
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.props.onChange(value);
        }
    }

    handleBlur() {
        let { onChange, onBlur, value } = this.props;
        if (value) {
            value = value.toString();
            if (value.charAt(value.length - 1) === '.' || value === '-') {
                onChange({ value: value.slice(0, -1) });
            }
            if (onBlur) {
                onBlur()
            }
        }
    }

    render() {
        return (
            <Input
                {...this.props}
                onChange={e => this.handleChange(e.target.value.trim())}
                onBlur={() => this.handleBlur()}
            />
        )
    }
}
