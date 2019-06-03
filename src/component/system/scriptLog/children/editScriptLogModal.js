import React, { Component } from 'react'
import { Modal, Input, Form, message } from 'antd'
import { injectIntl } from 'react-intl'
const FormItem = Form.Item;

class EditScriptLog extends Component {
    constructor() {
        super()
        this.state = {
            editor: '',
            scriptChange: '',
            scriptFinal: '',
            svnUrl: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editObj !== this.props.editObj) {
            this.setState({
                editor: nextProps.editObj.editor,
                scriptChange: nextProps.editObj.scriptChange,
                scriptFinal: nextProps.editObj.scriptFinal,
                svnUrl: nextProps.editObj.svnUrl
            })
        }
    }

    handleChangeState(key, value) {
        this.setState({
            [key]: value
        })
    }

    handleOk() {
        let { editor, scriptChange, scriptFinal, svnUrl } = this.state;
        let { intl } = this.props;
        if (!editor) {
            message.info(intl.formatMessage({ id: "system.please.enter.the.name.of.the.editor", defaultMessage: "请输入编辑人员名称" }));
            return;
        }
        let data = {
            editor, scriptChange, scriptFinal, svnUrl
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
                scriptChange: '',
                scriptFinal: '',
                svnUrl: ''
            })
        }
    }

    render() {
        let { visible, intl } = this.props;
        let { editor, scriptChange, scriptFinal, svnUrl } = this.state;
        return (
            <Modal
                visible={visible}
                className="root"
                title={intl.formatMessage({ id: 'system.edit.script.log', defaultMessage: '编辑脚本日志' })}
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
                        label={intl.formatMessage({ id: "system.to.develop.the.script", defaultMessage: "开发脚本" })}
                    >
                        <Input
                            value={scriptChange}
                            onChange={e => this.handleChangeState('scriptChange', e.target.value)}
                            placeholder={intl.formatMessage({ id: "system.please.enter.the.development.script", defaultMessage: "请输入开发脚本" })}
                        />
                    </FormItem>
                    <FormItem
                        label={intl.formatMessage({ id: "system.the.production.scripts", defaultMessage: "生产脚本" })}
                    >
                        <Input
                            value={scriptFinal}
                            onChange={e => this.handleChangeState('scriptFinal', e.target.value)}
                            placeholder={intl.formatMessage({ id: "system.please.enter.the.production.script", defaultMessage: "请输入生产脚本" })}
                        />
                    </FormItem>
                    <FormItem
                        label={intl.formatMessage({ id: "system.svn.url", defaultMessage: "SVN地址" })}
                    >
                        <Input
                            value={svnUrl}
                            onChange={e => this.handleChangeState('svnUrl', e.target.value)}
                            placeholder={intl.formatMessage({ id: "system.please.enter.SVN.address", defaultMessage: "请输入SVN地址" })}
                        />
                    </FormItem>
                </div>
            </Modal>
        )
    }
}

export default injectIntl(EditScriptLog);