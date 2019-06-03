import React, { Component } from 'react'
import { Col, Input, Select, Form, Row, Button, DatePicker } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
const FormItem = Form.Item;
const SelectOption = Select.Option;

class SerachForm extends Component {
    constructor() {
        super()
        this.state = {
            editor: '',
            svnUrl: '',
            description: '',
            diaryTitle: '',
            type: undefined,
            gmtCreate: '',
            gmtCreateDate: null,
            gmtModify: '',
            gmtModifyDate: null,
            searchData: {}
        }
    }

    componentWillMount() {
        let { searchData } = this.props;
        if (searchData) {
            let data = this.formateData(searchData)
            this.setState({
                editor: searchData.editor ? searchData.editor : '',
                svnUrl: searchData.svnUrl ? searchData.svnUrl : '',
                description: searchData.description ? searchData.description : '',
                diaryTitle: searchData.diaryTitle ? searchData.diaryTitle : '',
                type: searchData.type,
                gmtCreate: searchData.gmtCreate ? searchData.gmtCreate : '',
                gmtCreateDate: searchData.gmtCreate ? moment(searchData.gmtCreate, 'YYYY-MM-DD') : null,
                gmtModify: searchData.gmtModify ? searchData.gmtModify : '',
                gmtModifyDate: searchData.gmtModify ? moment(searchData.gmtModify, 'YYYY-MM-DD') : null,
                searchData: data
            })
        }
    }

    handleSearch() {
        let { handleSearch } = this.props;
        let searchData = this.formateData(this.state);
        if (handleSearch) {
            handleSearch(searchData)
        }
    }

    handleReset() {
        this.setState({
            editor: '',
            svnUrl: '',
            description: '',
            diaryTitle: '',
            type: undefined,
            gmtCreate: '',
            gmtCreateDate: null,
            gmtModify: '',
            gmtModifyDate: null,
            searchData: {}
        }, () => {
            if (this.props.handleReset) {
                this.props.handleReset()
            }
        })
    }

    handleChangeState(key, value) {
        this.setState({
            [key]: value
        })
    }

    formateData(searchData) {
        let data = {};
        if (searchData.editor) {
            data.editor = searchData.editor;
        }
        if (searchData.svnUrl) {
            data.svnUrl = searchData.svnUrl;
        }
        if (searchData.description) {
            data.description = searchData.description;
        }
        if (searchData.diaryTitle) {
            data.diaryTitle = searchData.diaryTitle;
        }
        if (searchData.type) {
            data.type = searchData.type;
        }
        if (searchData.gmtCreate) {
            data.gmtCreate = searchData.gmtCreate;
        }
        if (searchData.gmtModify) {
            data.gmtModify = searchData.gmtModify;
        }
        return data;
    }

    changeDate(key, date, dateStr) {
        this.setState({
            [(key + 'Date')]: date,
            [key]: dateStr
        })
    }

    render() {
        let { editor, svnUrl, description, diaryTitle, type, gmtCreateDate, gmtModifyDate } = this.state;
        let { scriptLogTypeList, intl } = this.props;
        return (
            <div className="search-form">
                <Row>
                    <Col span={6}>
                        <FormItem
                            label={intl.formatMessage({ id: "system.editorial.staff", defaultMessage: "编辑人" })}
                        >
                            <Input
                                value={editor}
                                onPressEnter={() => this.handleSearch()}
                                onChange={e => this.handleChangeState('editor', e.target.value)}
                                placeholder={intl.formatMessage({ id: "system.please.enter.the.name.of.the.editor", defaultMessage: "请输入编辑人员名称" })}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label={intl.formatMessage({ id: "system.svn.url", defaultMessage: "SVN地址" })}
                        >
                            <Input
                                value={svnUrl}
                                onPressEnter={() => this.handleSearch()}
                                onChange={e => this.handleChangeState('svnUrl', e.target.value)}
                                placeholder={intl.formatMessage({ id: "system.please.enter.SVN.address", defaultMessage: "请输入SVN地址" })}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label={intl.formatMessage({ id: "system.demand.for.the.title", defaultMessage: "需求标题" })}
                        >
                            <Input
                                value={diaryTitle}
                                onPressEnter={() => this.handleSearch()}
                                onChange={e => this.handleChangeState('diaryTitle', e.target.value)}
                                placeholder={intl.formatMessage({ id: "system.please.enter.the.requirement.title", defaultMessage: "请输入需求标题" })}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label={intl.formatMessage({ id: "system.requirements.describe", defaultMessage: "需求描述" })}
                        >
                            <Input
                                value={description}
                                onPressEnter={() => this.handleSearch()}
                                onChange={e => this.handleChangeState('description', e.target.value)}
                                placeholder={intl.formatMessage({ id: "system.please.enter.the.requirements.description", defaultMessage: "请输入需求描述" })}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <FormItem
                            label={intl.formatMessage({ id: "system.requirement.types", defaultMessage: "需求类型" })}
                        >
                            <Select
                                value={type}
                                onChange={e => this.handleChangeState('type', e)}
                                placeholder={intl.formatMessage({ id: "system.please.select.the.requirement.type", defaultMessage: "请选择需求类型" })}
                            >
                                <SelectOption value='' ><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></SelectOption>
                                {
                                    scriptLogTypeList.filter(item => item.isDel === 0)
                                        .map(opt => (
                                            <SelectOption value={opt.dictVal} >{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</SelectOption>
                                        ))
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label={intl.formatMessage({ id: "system.creation.time", defaultMessage: "创建时间" })}
                        >
                            <DatePicker
                                value={gmtCreateDate}
                                onChange={(date, dateStr) => this.changeDate('gmtCreate', date, dateStr)}
                                placeholder={intl.formatMessage({ id: "system.please.select.the.creation.time", defaultMessage: "请选择创建时间" })}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label={intl.formatMessage({ id: "system.update.time", defaultMessage: "更新时间" })}
                        >
                            <DatePicker
                                value={gmtModifyDate}
                                onChange={(date, dateStr) => this.changeDate('gmtModify', date, dateStr)}
                                placeholder={intl.formatMessage({ id: "system.please.select.the.update.time", defaultMessage: "请选择更新时间" })}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
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