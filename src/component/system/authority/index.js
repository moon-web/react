import React, { Component } from 'react'
import { Form, Table, Modal, Input, Row, message, Select, Icon, Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import { getButtonPrem } from '../../../utils/util'

const FormItem = Form.Item;
const Option = Select.Option;

export default class Authority extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,  // 弹窗显示控制
            edit: false,  // 编辑状态
            data: [],  // 列表数据
            permName: '',  // 功能名称
            permEname: '',  // 功能英文名称
            permNote: '',  // 功能中英文ID
            permValue: '',  // 功能路由
            permMethodUrl: '',  // 功能后台方法名
            icon: '',  // 功能菜单图标
            parentId: '',  // 功能父级ID
            permId: '',  // 功能功能ID
            status: '',  // 功能状态
            sort: '',  // 功能列表的顺序
            level: '',  // 功能菜单级别
            refresh: false
        }
    }

    componentWillMount() {
        this.getAuthorityList()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.authorityList !== this.props.authorityList) {
            this.getData(nextProps.authorityList)
        }
    }

    // 从props获取数据转state
    getData(authorityList) {
        if (authorityList) {
            let data = JSON.stringify(authorityList);
            data = JSON.parse(data)
            this.setState({
                data
            })
        }
    }

    // 获取权限列表
    getAuthorityList(callback) {
        let { getAuthTree } = this.props;
        getAuthTree(undefined, callback)
    }

    // 输入信息
    setNewAuthority(value, key) {
        this.setState({
            [key]: value
        })
    }

    // 提交新增
    submitAuthority() {
        let edit = this.state.edit;
        if (!edit) {
            this.addAuthority()
        } else {
            let { permName, permEname, permNote, permValue, permMethodUrl, icon, permId, status } = this.state
            this.editAuthority({
                permName,
                permEname,
                permNote,
                permValue,
                permMethodUrl,
                icon,
                permId,
                status
            })
        }
    }

    // 新增
    addAuthority() {
        let { permName, permEname, permNote, permValue, permMethodUrl, icon, parentId } = this.state
        let { addAuthority, getPermissionList } = this.props;
        if (!permName) {
            message.info('请输入功能名称')
            return
        }
        let data = {
            permName,
            permEname,
            permNote,
            permValue,
            permMethodUrl,
            icon,
            parentId
        }
        addAuthority(data, () => {
            this.getAuthorityList()
            getPermissionList()
            this.cancelAuthority()
        })
    }

    // 编辑
    editAuthority(data) {
        let { editAuthority, getPermissionList } = this.props;
        editAuthority(data, () => {
            this.getAuthorityList()
            getPermissionList()
            this.cancelAuthority()
        })
    }

    // 取消新增
    cancelAuthority() {
        this.setState({
            visible: false,
            edit: false,
            permName: '',
            permEname: '',
            permNote: '',
            permValue: '',
            permMethodUrl: '',
            icon: '',
            parentId: '',
            permId: '',
            status: '',
            sort: '',
            level: ''
        })
    }

    // 显示删除提示框
    showDeleteModal(item) {
        let { intl } = this.props;
        this.setState({
            deleteItem: item
        }, () => {
            Modal.confirm({
                title: intl.formatMessage({ id: "system.delete.authority.item", defaultMessage: "删除功能块", description: "删除功能块" }),
                content: intl.formatMessage({ id: "system.are.you.sure.to.delete.this.function.module", defaultMessage: "你确定删除该功能模块吗？", description: "你确定删除该功能模块吗？" }),
                onCancel: () => { },
                onOk: () => this.deleteAuthority()
            })
        })
    }

    // 显示编辑或添加弹窗
    showAddOrEditModal(type, item, children) {
        let edit = false;
        if (type === 'edit') {
            edit = true;
            let { permId, parentId, permName, permEname, permNote, permValue, permMethodUrl, icon, status, level } = item;
            this.setState({
                visible: true,
                edit,
                permId,
                parentId,
                permName,
                permEname,
                permNote,
                permValue,
                permMethodUrl,
                icon,
                status,
                level
            })
        } else {
            let parentId = '';
            let level = '';
            if (children) {
                parentId = item.permId;
                level = item.level + 1;
            } else {
                parentId = item.parentId
                level = item.level
            }
            this.setState({
                visible: true,
                edit,
                parentId,
                level
            })
        }

    }

    // 删除
    deleteAuthority() {
        let { deleteItem } = this.state;
        let { deleteAuthority, getPermissionList } = this.props;
        deleteAuthority({ permId: deleteItem.permId }, () => {
            this.getAuthorityList()
            getPermissionList()
            this.setState({
                deleteItem: ''
            })
        })
    }

    // 移动排序
    moveSort(item, type) {
        let seesaw, { editAuthoritySort, getPermissionList } = this.props;
        if (type === 'down') {
            seesaw = 1;
        } else {
            seesaw = -1;
        }
        editAuthoritySort({ permId: item.permId, seesaw }, () => {
            getPermissionList()
            this.getAuthorityList()
        })
    }

    refreshList() {
        this.setState({
            refresh: true
        }, () => {
            this.getAuthorityList(() => {
                this.setState({
                    refresh: false
                })
            })
        })
    }

    // 渲染操作栏
    renderOperate(item, index) {
        let { permissionList } = this.props;
        let data = this.state.data;
        if (item.level !== 1) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                if (item.parentId === element.permId) {
                    data = element.children;
                    break;
                }
                if (element.children) {
                    for (let j = 0; j < element.children.length; j++) {
                        const subElem = element.children[j];
                        if (item.parentId === subElem.permId) {
                            data = subElem.children;
                            break;
                        }
                    }
                }
            }
        }
        if (item.status === -1) {
            // 判断为-1 时为自定义的添加同级菜单
            if (getButtonPrem(permissionList, '010008002')) {
                return (
                    <div>
                        <a onClick={() => this.showAddOrEditModal('add', item, false)} >
                            <FormattedMessage id="system.new.equal" defaultMessage="添加同级" description="添加同级" />
                        </a>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    {
                        getButtonPrem(permissionList, '010008002')
                            ? <a onClick={() => this.showDeleteModal(item)}>
                                <FormattedMessage id="global.delete" defaultMessage="删除" description="删除" />
                            </a>
                            : ''
                    }
                    <br />
                    {
                        getButtonPrem(permissionList, '010008002')
                            ? <a onClick={() => this.showAddOrEditModal('edit', item)}>
                                <FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" />
                            </a>
                            : ''
                    }
                    <br />
                    {
                        // 判断索引渲染上下移
                        index === 0
                            ? getButtonPrem(permissionList, '010008002')
                                ? (
                                    <a onClick={() => this.moveSort(item, 'down')}>
                                        <FormattedMessage id="system.move.down" defaultMessage="下移" description="下移" />
                                    </a>
                                )
                                : ''
                            : index === data.length - 2
                                ? getButtonPrem(permissionList, '010008002')
                                    ? (
                                        <a onClick={() => this.moveSort(item, 'up')}>
                                            <FormattedMessage id="system.move.up" defaultMessage="上移" description="上移" />
                                        </a>
                                    )
                                    : ''
                                : 0 < index < data.length - 2
                                    ? getButtonPrem(permissionList, '010008002')
                                        ? [
                                            <a key='up' onClick={() => this.moveSort(item, 'up')}>
                                                <FormattedMessage id="system.move.up" defaultMessage="上移" description="上移" />
                                            </a>,
                                            <br key='br' />,
                                            <a  key='down' onClick={() => this.moveSort(item, 'down')}>
                                                <FormattedMessage id="system.move.down" defaultMessage="下移" description="下移" />
                                            </a>
                                        ]
                                        : ''
                                    : ''
                    }
                    <br />
                    {
                        // 除了三级菜单都有添加下级
                        item.level !== 3 && getButtonPrem(permissionList, '010008002')
                            ? (
                                <a onClick={() => this.showAddOrEditModal('add', item, true)} >
                                    <FormattedMessage id="system.new.children" defaultMessage="添加下级" description="添加下级" />
                                </a>
                            )
                            : ''
                    }
                </div>
            )
        }

    }

    // 创建行配置项
    createColumns() {
        const columns = [{
            title: <FormattedMessage id="system.function.name" defaultMessage="功能名称" description="功能名称" />,
            dataIndex: 'permName',
            key: 'permName',
            align: 'left',
            width: "20%",
        }, {
            title: <FormattedMessage id="system.english" defaultMessage="英文名称" description="英文名称" />,
            dataIndex: 'permEname',
            key: 'permEname',
        }, {
            title: <FormattedMessage id="system.menu.icon" defaultMessage="菜单图标" description="菜单图标" />,
            dataIndex: 'icon',
            key: 'icon'
        }, {
            title: <FormattedMessage id="system.front-end.routing" defaultMessage="前端路径" description="前端路径" />,
            dataIndex: 'permValue',
            key: 'permValue'
        }, {
            title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
            dataIndex: 'status',
            key: 'status',
            render: text => (
                text === 0
                    ? <FormattedMessage id="global.disable" defaultMessage="禁用" description="禁用" />
                    : text === 1
                        ? <FormattedMessage id="global.enable" defaultMessage="启用" description="启用" />
                        : ''
            )
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            dataIndex: 'status',
            key: 'code',
            render: (text, item, index) => this.renderOperate(item, index)
        }];
        return columns;
    }

    render() {
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.system.menu.management', title: '菜单管理' }
        ]
        let { intl, isFetch } = this.props;
        let { visible, permName, permEname, permValue, permMethodUrl, icon, status, edit, data, level, refresh } = this.state;
        return (
            <Content breadcrumbData={breadcrumbData} className='authority'>
                <div className="operation-btns">
                    <Button type='primary'  onClick={() => this.refreshList()}>
                        <Icon type={refresh ? 'loading' : 'reload' } />
                        <FormattedMessage id="global.reload" defaultMessage="刷新" description="刷新" />
                    </Button>
                </div>
                <Table
                    columns={this.createColumns()}
                    dataSource={data}
                    rowKey='permId'
                    pagination={false}
                    loading={isFetch}
                />
                <Modal
                    visible={visible}
                    className="root"
                    title={
                        !edit
                            ? intl.formatMessage({ id: "system.new.function.module", defaultMessage: "新增功能模块", description: "新增功能模块" })
                            : intl.formatMessage({ id: "system.edit.function.module", defaultMessage: "编辑功能模块", description: "编辑功能模块" })
                    }
                    onOk={() => this.submitAuthority()}
                    onCancel={() => this.cancelAuthority()}
                >
                    <div className='search-form'>
                        <Row>
                            <FormItem label={intl.formatMessage({ id: "system.function.name", defaultMessage: "功能名称", description: "功能名称" })}>
                                <Input
                                    value={permName}
                                    onChange={e => this.setNewAuthority(e.target.value.trim(), 'permName')}
                                    placeholder={intl.formatMessage({ id: "system.please.enter.function.name", defaultMessage: "请输入功能名称", description: "请输入功能名称" })}
                                />
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label={intl.formatMessage({ id: "system.english", defaultMessage: "英文翻译", description: "英文翻译" })}>
                                <Input
                                    value={permEname}
                                    onChange={e => this.setNewAuthority(e.target.value.trim(), 'permEname')}
                                    placeholder={intl.formatMessage({ id: "system.please.enter.english", defaultMessage: "请输入英文翻译", description: "请输入英文翻译" })}
                                />
                            </FormItem>
                        </Row>
                        {
                            level !== 3
                                ? (
                                    <Row>
                                        <FormItem label={intl.formatMessage({ id: "system.front-end.routing", defaultMessage: "前端路径", description: "前端路径" })}>
                                            <Input
                                                value={permValue}
                                                onChange={e => this.setNewAuthority(e.target.value.trim(), 'permValue')}
                                                placeholder={intl.formatMessage({ id: "system.please.enter.front-end.routing", defaultMessage: "请输入前端路径", description: "请输入前端路径" })}
                                            />
                                        </FormItem>
                                    </Row>
                                )
                                : ''
                        }
                        {
                            level === 1
                                ? (
                                    <Row>
                                        <FormItem label={intl.formatMessage({ id: "system.menu.icon", defaultMessage: "菜单图标", description: "菜单图标" })}>
                                            <Input
                                                value={icon}
                                                onChange={e => this.setNewAuthority(e.target.value.trim(), 'icon')}
                                                placeholder={intl.formatMessage({ id: "system.please.enter.menu.icon", defaultMessage: "请输入菜单图标", description: "请输入菜单图标" })}
                                            />
                                        </FormItem>
                                    </Row>
                                )
                                : ''
                        }
                        {
                            level === 3
                                ? (
                                    <Row>
                                        <FormItem label={intl.formatMessage({ id: "system.method.name.url", defaultMessage: "方法名称Url", description: "方法名称Url" })}>
                                            <Input
                                                value={permMethodUrl}
                                                onChange={e => this.setNewAuthority(e.target.value.trim(), 'permMethodUrl')}
                                                placeholder={intl.formatMessage({ id: "system.please.enter.method.name.url", defaultMessage: "请输入方法名称Url", description: "请输入方法名称Url" })}
                                            />
                                        </FormItem>
                                    </Row>
                                )
                                : ''
                        }
                        {
                            edit
                                ? (
                                    <Row>
                                        <FormItem label={intl.formatMessage({ id: "global.status", defaultMessage: "状态", description: "状态" })}>
                                            <Select
                                                value={status}
                                                onChange={e => this.setNewAuthority(e, 'status')}
                                            >
                                                <Option value={1}><FormattedMessage id="global.enable" defaultMessage="启用" description="启用" /></Option>
                                                <Option value={0}><FormattedMessage id="global.disable" defaultMessage="禁用" description="禁用" /></Option>
                                            </Select>
                                        </FormItem>
                                    </Row>
                                )
                                : ''
                        }
                    </div>
                </Modal>
            </Content>
        )
    }
}