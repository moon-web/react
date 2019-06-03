import React, { Component } from 'react'
import { Modal, Input, Form, Select, message } from 'antd'
import { injectIntl, FormattedMessage } from 'react-intl'
const FormItem = Form.Item;
const SelectOption = Select.Option;

class AddScriptLog extends Component {
    constructor() {
        super()
        this.state = {
            editor: '',
            description: '',
            diaryTitle: '',
            type: undefined
        }
    }

    handleChangeState(key, value) {
        this.setState({
            [key]: value
        })
    }

    handleOk() {
        let { editor, description, diaryTitle, type } = this.state;
        let { intl } = this.props;
        if (!editor) {
            message.info(intl.formatMessage({ id: "system.please.enter.the.name.of.the.editor", defaultMessage: "请输入编辑人员名称" }));
            return;
        } else if (!diaryTitle) {
            message.info(intl.formatMessage({ id: "system.please.enter.the.requirement.title", defaultMessage: "请输入需求标题" }));
            return;
        } else if (!description) {
            message.info(intl.formatMessage({ id: "system.please.enter.the.requirements.description", defaultMessage: "请输入需求描述" }));
            return;
        } else if (!type) {
            message.info(intl.formatMessage({ id: "system.please.select.the.requirement.type", defaultMessage: "请选择需求类型" }));
            return;
        }
        let data = {
            editor, description, diaryTitle, type
        };
        if (this.props.handleOk) {
            this.props.handleOk(data)
        }
    }

    handleCancel() {
        if (this.props.handleCancel) {
            this.props.handleCancel()
            this.setState({
                editor: '',
                description: '',
                diaryTitle: '',
                type: undefined
            })
        }
    }

    render() {
        let { visible, intl, scriptLogTypeList } = this.props;
        let { editor, diaryTitle, description, type } = this.state;
        return (
            <Modal
                visible={visible}
                className="root"
                title={intl.formatMessage({ id: 'system.add.script.log', defaultMessage: '新增脚本日志' })}
                onOk={() => this.handleOk()}
                onCancel={() => this.handleCancel()}
            >
                <div className="search-form">
                    <FormItem
                        label={intl.formatMessage({ id: "system.editorial.staff", defaultMessage: "编辑人" })}
                    >
                        <Input
                            value={editor}
                            onChange={e => this.handleChangeState('editor', e.target.value)}
                            placeholder={intl.formatMessage({ id: "system.please.enter.the.name.of.the.editor", defaultMessage: "请输入编辑人员名称" })}
                        />
                    </FormItem>
                    <FormItem
                        label={intl.formatMessage({ id: "system.demand.for.the.title", defaultMessage: "需求标题" })}
                    >
                        <Input
                            value={diaryTitle}
                            onChange={e => this.handleChangeState('diaryTitle', e.target.value)}
                            placeholder={intl.formatMessage({ id: "system.please.enter.the.requirement.title", defaultMessage: "请输入需求标题" })}
                        />
                    </FormItem>
                    <FormItem
                        label={intl.formatMessage({ id: "system.requirements.describe", defaultMessage: "需求描述" })}
                    >
                        <Input
                            value={description}
                            onChange={e => this.handleChangeState('description', e.target.value)}
                            placeholder={intl.formatMessage({ id: "system.please.enter.the.requirements.description", defaultMessage: "请输入需求描述" })}
                        />
                    </FormItem>
                    <FormItem
                        label={intl.formatMessage({ id: "system.requirement.types", defaultMessage: "需求类型" })}
                    >
                        <Select
                            value={type}
                            onChange={e => this.handleChangeState('type', e)}
                            placeholder={intl.formatMessage({ id: "system.please.select.the.requirement.type", defaultMessage: "请选择需求类型" })}
                        >
                            <SelectOption value=''><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></SelectOption>
                            {
                                scriptLogTypeList.filter(item => item.isDel === 0)
                                    .map(opt => (
                                        <SelectOption value={opt.dictVal} >{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</SelectOption>
                                    ))
                            }
                        </Select>
                    </FormItem>
                </div>
            </Modal>
        )
    }
}

export default injectIntl(AddScriptLog);