import React, { Component } from 'react'
import { Alert, Table, Button, Tooltip, Row, Col, Modal } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import SearchForm from './children/searchForm'
import AddScriptLogModal from './children/addScriptLogModal'
import EditScriptLogModal from './children/editScriptLogModal'
import { getButtonPrem } from '../../../utils/util'
const confirm = Modal.confirm;

export default class ScriptLog extends Component {
    constructor() {
        super()
        this.state = {
            pageSize: 10,
            searchData: {},
            visibleAdd: false,
            visibleEdit: false,
            editObj: {}
        }
    }

    componentWillMount() {
        this.getScriptLogList([], 1)
    }

    // 获取列表
    getScriptLogList(oldList, pageNo) {
        let { getScriptLogList } = this.props;
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData);
        data.pageNo = pageNo;
        data.pageSize = pageSize;
        if (getScriptLogList) {
            getScriptLogList(data, oldList)
        }
    }

    // 添加
    addScriptLog(data) {
        let { createScriptLog } = this.props;
        if (createScriptLog) {
            this.setState({
                visibleAdd: false
            })
            createScriptLog(data, () => {
                this.getScriptLogList([], 1)
            })
        }
    }

    // 删除
    handleDeleteLog(id) {
        let { delScriptLog, pageNo, intl } = this.props;
        confirm({
            title: intl.formatMessage({ id: "system.delete.the.data", defaultMessage: "删除数据" }),
            content: intl.formatMessage({ id: "system.do.you.want.to.delete.these.items", defaultMessage: "你想删除这条数据吗？" }),
            onOk: () => {
                if (delScriptLog) {
                    delScriptLog({ id: id }, () => {
                        this.getScriptLogList([], pageNo)
                    })
                }
            },
            onCancel: () => {

            }
        })
    }

    // 编辑
    handleEditLog(data) {
        let { modifyScriptLog, scriptLogList } = this.props;
        let { editObj } = this.state;
        data.id = editObj.id;
        if (modifyScriptLog) {
            this.setState({
                visibleEdit: false
            })
            modifyScriptLog(data, scriptLogList)
        }
    }

    // 搜索
    handleSearch(data) {
        this.setState({
            searchData: data
        }, () => {
            this.getScriptLogList([], 1)
        })
    }

    // 重置
    handleReset() {
        this.setState({
            searchData: {}
        }, () => {
            this.getScriptLogList([], 1)
        })
    }

    // 改变分页大小
    changePageSize(size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getScriptLogList([], 1)
        })
    }

    // 创建table配置
    createColumns() {
        let { intl, permissionList } = this.props;
        const columns = [
            {
                title: <FormattedMessage id='system.editorial.staff' defaultMessage='编辑人' description='编辑人' />,
                dataIndex: 'editor',
                key: 'editor',
            }, {
                title: <FormattedMessage id='system.svn.url' defaultMessage='SVN地址' description='SVN地址' />,
                dataIndex: 'svnUrl',
                key: 'svnUrl',
            }, {
                title: <FormattedMessage id='system.demand.for.the.title' defaultMessage='需求标题' description='需求标题' />,
                dataIndex: 'diaryTitle',
                key: 'diaryTitle',
                render: text => (
                    text && text.length > 20
                        ? <Tooltip title={text}>{text.slice(0, 20)}...</Tooltip>
                        : text
                )
            }, {
                title: <FormattedMessage id='system.requirements.describe' defaultMessage='需求描述' description='需求描述' />,
                dataIndex: 'description',
                key: 'description',
                render: text => (
                    text && text.length > 20
                        ? <Tooltip title={text}>{text.slice(0, 20)}...</Tooltip>
                        : text
                )
            }, {
                title: <FormattedMessage id='system.requirement.types' defaultMessage='需求类型' description='需求类型' />,
                dataIndex: 'type',
                key: 'type',
                render: (text, item) => (
                    intl.locale === 'en'
                        ? item.typeNameEn
                        : item.typeName
                )
            }, {
                title: <FormattedMessage id='system.to.develop.the.script' defaultMessage='开发脚本' description='开发脚本' />,
                dataIndex: 'scriptChange',
                key: 'scriptChange',
                render: text => (
                    text && text.length > 20
                        ? <Tooltip title={text}>{text.slice(0, 20)}...</Tooltip>
                        : text
                )
            }, {
                title: <FormattedMessage id='system.the.production.scripts' defaultMessage='生产脚本' description='生产脚本' />,
                dataIndex: 'scriptFinal',
                key: 'scriptFinal',
                render: text => (
                    text && text.length > 20
                        ? <Tooltip title={text}>{text.slice(0, 20)}...</Tooltip>
                        : text
                )
            }, {
                title: <FormattedMessage id='system.creation.time' defaultMessage='创建时间' description='创建时间' />,
                dataIndex: 'gmtCreate',
                key: 'gmtCreate',
            }, {
                title: <FormattedMessage id='system.update.time' defaultMessage='更新时间' description='更新时间' />,
                dataIndex: 'gmtModify',
                key: 'gmtModify',
            }, {
                title: <FormattedMessage id='global.operate' defaultMessage='操作' description='操作' />,
                dataIndex: 'id',
                key: 'id',
                render: (text, item) => (
                    <div>
                        {
                            getButtonPrem(permissionList, '010016002') ?
                                <a onClick={() => this.setState({ visibleEdit: true, editObj: item })}><FormattedMessage id='global.edit' defaultMessage='编辑' description='编辑' /></a>
                                : ''
                        }
                        <br />
                        {
                            getButtonPrem(permissionList, '010016003') ?
                                <a onClick={() => this.handleDeleteLog(text)}><FormattedMessage id='global.delete' defaultMessage='删除' description='删除' /></a>
                                : ''
                        }
                    </div>
                )
            }
        ];
        return columns;
    }

    // 创建分页器配置项
    createPaginationOption() {
        let { pageNo, total } = this.props;
        let { pageSize } = this.state;
        return {
            current: pageNo,
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            onChange: (page, pageSize) => this.getScriptLogList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    render() {
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.script.log', title: '脚本日志' }
        ];
        let { intl, total, scriptLogList, isFetch, permissionList, scriptLogTypeList } = this.props;
        let { searchData, visibleAdd, visibleEdit, editObj } = this.state;
        return (
            <Content
                breadcrumbData={breadcrumbData}
            >
                <SearchForm
                    searchData={searchData}
                    scriptLogTypeList={scriptLogTypeList}
                    handleSearch={data => this.handleSearch(data)}
                    handleReset={() => this.handleReset()}
                />
                <Row className="operation-btns">
                    <Col span={24}>
                        {
                            getButtonPrem(permissionList, '010016001') ?
                                <Button type="primary" onClick={() => this.setState({ visibleAdd: true })}><FormattedMessage id="global.add" defaultMessage="新增" description="新增" /></Button>
                                : ''
                        }
                    </Col>
                </Row>
                <Alert
                    showIcon
                    type="info"
                    className="Alert_info"
                    message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })}
                />
                <Table
                    rowKey="id"
                    loading={isFetch}
                    dataSource={scriptLogList}
                    columns={this.createColumns()}
                    pagination={this.createPaginationOption()}
                />
                <AddScriptLogModal
                    visible={visibleAdd}
                    scriptLogTypeList={scriptLogTypeList}
                    handleOk={(data) => this.addScriptLog(data)}
                    handleCancel={() => this.setState({ visibleAdd: false })}
                />
                <EditScriptLogModal
                    editObj={editObj}
                    visible={visibleEdit}
                    handleOk={(data) => this.handleEditLog(data)}
                    handleCancel={() => this.setState({ visibleEdit: false })}
                />
            </Content>
        )
    }
}
