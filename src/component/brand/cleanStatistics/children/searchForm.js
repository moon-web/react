import React, { Component } from 'react'
import { Col, Select, Form, Row, Button } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import '../index.css'
const FormItem = Form.Item;
const SelectOption = Select.Option;

class SerachForm extends Component {
    constructor() {
        super()
        this.state = {
            detailStatus: undefined,
            searchData: {}
        }
    }

    componentWillMount() {
        let { searchData } = this.props;
        if (searchData) {
            let data = this.formateData(searchData)
            this.setState({
                detailStatus: searchData.detailStatus,
                searchData: data
            })
        }
    }

    //搜索
    handleSearch() {
        let { handleSearch } = this.props;
        let searchData = this.formateData(this.state);
        if (handleSearch) {
            handleSearch(searchData)
        }
    }

    //重置
    handleReset() {
        this.setState({
            detailStatus: undefined,
            searchData: {}
        }, () => {
            if (this.props.handleReset) {
                this.props.handleReset()
            }
        })
    }

    //赋值
    handleChangeState(key, value) {
        this.setState({
            [key]: value
        })
    }

    formateData(searchData) {
        let data = {};
        if (searchData.detailStatus !== undefined) {
            data.detailStatus = searchData.detailStatus;
        }
        return data;
    }

    render() {
        let { detailStatus } = this.state;
        let { intl, brandCleanlinessStatus } = this.props;
        return (
            <div className="search-form">
                <Row>
                    <Col span={6} className="distribution">
                        <FormItem label={intl.formatMessage({ id: "global.status", defaultMessage: "状态" })} >
                            <Select
                                value={detailStatus}
                                onChange={e => this.handleChangeState('detailStatus', e)}
                                placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态" })}
                            >
                                <SelectOption value='' ><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></SelectOption>
                                {
                                    brandCleanlinessStatus && brandCleanlinessStatus.filter(item => item.isDel === 0)
                                        .map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={6} offset={12}>
                        <div className="search-form-btns">
                            <Button type="primary" onClick={() => this.handleSearch()}>
                                <FormattedMessage id="global.search" defaultMessage="搜索" description="搜索" />
                            </Button>
                            <Button onClick={() => this.handleReset()}>
                                <FormattedMessage id="global.reset" defaultMessage="重置" description="重置" />
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default injectIntl(SerachForm)