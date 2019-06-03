import React, { Component } from 'react'
import { Button, Icon, message, Tree } from 'antd'
import Content from '../../common/layout/content/index'
import { queryUrlParams } from '../../../utils/util'
import '../common/index.css'
const TreeNode = Tree.TreeNode;

export default class PermissionsManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            roleId: '',
            checkedKeys: [],
            autoExpandParent: true,
            expandedKeys: []
        }
    }

    componentWillMount() {
        let id = queryUrlParams('roleId')
        this.setState({
            roleId: id
        })
        this.getUserAuthTree(id)
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userRoleAuthTree !== this.props.userRoleAuthTree) {
            this.initData(nextProps.userRoleAuthTree, 'receive')
        }
    }

    // 获取角色权限
    getUserAuthTree(id) {
        let { getUserAuthTree } = this.props;
        getUserAuthTree({ roleId: id })
    }

    // 初始化数据
    initData(userRoleAuthTree) {
        if (userRoleAuthTree) {
            let data = JSON.stringify(userRoleAuthTree);
            data = JSON.parse(data);
            let { data: result, checkedKeys } = this.eachData(data, [])
            this.setState({
                data: result,
                checkedKeys
            })
        }
    }

    // 遍历数据格式
    eachData(data, checkedKeys) {
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.key = element.permId;
            element.title = element.permName
            if (element.icon) {
                element.icon = <Icon type={element.icon} style={{ color: '#668fff' }} />;
            } else if(!element.icon && element.level === 2) {
                element.icon = <Icon type="folder" style={{ color: '#668fff' }} />
            } else if (!element.icon && element.level === 3) (
                element.icon = <Icon type="file-text" style={{ color: '#668fff' }} />
            )
            if (element.hasFlag === 0 && element.level === 3) {
                checkedKeys.push(element.permId.toString())
            }
            if (element.subList.length) {
                element.children = element.subList;
                this.eachData(element.subList, checkedKeys)
            }
        }
        return { data, checkedKeys };
    }

    // 确认提交
    submitCheckedList() {
        let { checkedKeys, roleId } = this.state;
        let { updateRoleAuth, history } = this.props;
        if (!checkedKeys.length) {
            message.info('请选择用户权限')
            return;
        }
        let data = {
            roleId,
            permIds: checkedKeys.toString()
        }
        updateRoleAuth(data, (res) => {
            if (res.success) {
                message.info('更新成功')
                history.goBack()
            } else {
                message.info(res.msg)
            }
        })
    }

    // 取消修改
    cancelSubmit() {
        let { permissionList, history } = this.props;
        this.initData(permissionList, 'cancel')
        history.goBack();
    }

    // 改变选中
    changeCheck(checkedKeys, { checked, node }) {
        let permId = '';
        // 首页与权利人首页互斥
        if (node.props.permId) {
            permId = node.props.permId
        } else {
            permId = node.props.dataRef.permId
        }
        // 判断选中的首页项
        if (permId === 10301 && checked) {
            checkedKeys = checkedKeys.filter(item => item !== '10101')
        } else if (permId === 10101 && checked) {
            checkedKeys = checkedKeys.filter(item => item !== '10301')
        } else if ((permId === 101 || permId === 1) && checked) {
            checkedKeys = checkedKeys.filter(item => item !== '10301')
        }
        checkedKeys = checkedKeys.filter(item => item !== '101')
        checkedKeys = checkedKeys.filter(item => item !== '1')
        this.setState({ checkedKeys })
    }

    // 展开子节点
    onExpand(expandedKeys) {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    // 渲染Tree
    renderTreeNodes(data) {
        let intl = this.props.intl;
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode icon={item.icon} title={ intl.locale === 'en' ? item.permEname : item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }

    render() {
        let { data, expandedKeys, autoExpandParent, checkedKeys } = this.state;
        let { intl } = this.props;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '/system/role', titleId: 'router.system.role.management', title: '角色管理', query: { goback: true } },
            { link: '', titleId: 'system.role.management.editor', title: '角色管理编辑' },
        ]
        return (
            <Content className='permissions' breadcrumbData={breadcrumbData}>
                <div className="tree-wrap">
                    {
                        this.state.data.length
                            ? (
                                <Tree
                                    checkable
                                    showIcon={true}
                                    onExpand={expandedKeys => this.onExpand(expandedKeys)}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    onCheck={(checkedKeys, e) => this.changeCheck(checkedKeys, e)}
                                    checkedKeys={checkedKeys}
                                >
                                    {this.renderTreeNodes(data)}
                                </Tree>
                            )
                            : intl.formatMessage({id: "system.loading", defaultMessage: "加载中...", description: "加载中..."})
                    }
                </div>
                <div className="btns">
                    <Button type='primary' onClick={() => this.submitCheckedList()}> 确认 </Button>
                    <Button onClick={() => this.cancelSubmit()}> 取消 </Button>
                </div>
            </Content>
        )
    }
}
