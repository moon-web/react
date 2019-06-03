import React, { Component } from 'react';
import { injectIntl } from 'react-intl'
import { Layout, Menu, Icon } from 'antd';
import logo from '../../../../assets/images/logo1.png';
import { Link } from 'react-router-dom';
const { Sider } = Layout;
const { SubMenu, Item: MenuItem } = Menu;

class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            openKeys: [],
            selectedKeys: []
        }
    }

    componentWillMount() {
        let history = this.props.history;
        this.setOpenKey(history)
    }

    componentWillReceiveProps(nextProps) {
        this.setOpenKey(nextProps.history)
        if (nextProps.collapsed) {
            this.setState({
                openKeys: []
            })
        }
    }
  
    // 设置选中
    setOpenKey(history) {
        let path = history.location.pathname;
        let openKeys = path.split('/');
        if (openKeys.length <= 2) {
            openKeys = '/';
        } else {
            openKeys = '/' + openKeys[1];
        }
        this.setState({
            selectedKeys: [path],
            openKeys: [openKeys]
        })
    }

    // 打开二级
    handleOpenChange(openKeys) {
        let result = openKeys;
        if (openKeys.length > 1) {
            let resultState = openKeys.pop()
            result = resultState.split(',')
        }
        this.setState({
            openKeys: result
        })
    }

    // 点击子项
    onClickRemove({ key }) {
        this.setState({
            selectedKeys: [key]
        })
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    // 渲染菜单item
    renderMenuItem(permissionList) {
        let menus = [],
            intl = this.props.intl;
        if (permissionList.length) {
            for (let i = 0; i < permissionList.length; i++) {
                const element = permissionList[i];
                if (element.subList.length > 1 && element.level === 1) {
                    let subMenu = [];
                    for (let j = 0; j < element.subList.length; j++) {
                        const subElement = element.subList[j];
                        if (subElement.level === 2 && (subElement.hasFlag === 0 || subElement.hasFlag === 1)) {
                            subMenu.push(
                                <MenuItem key={subElement.permValue}>
                                    <Link to={subElement.permValue}>
                                        {/* <Icon type={subElement.icon} theme="outlined" /> */}
                                        <span>
                                            {
                                                intl.locale === 'en'
                                                    ? subElement.permEname
                                                    : subElement.permName
                                            }
                                        </span>
                                    </Link>
                                </MenuItem>
                            )
                        }
                    }
                    let result = (
                        <SubMenu key={element.permValue} title={
                            <span>
                                <Icon type={element.icon} theme="outlined" />
                                <span>
                                    {
                                        intl.locale === 'en'
                                            ? element.permEname
                                            : element.permName
                                    }
                                </span>
                            </span>
                        } >
                            {subMenu}
                        </SubMenu>
                    )
                    menus.push(result)
                }
                else if (element.subList.length === 1 && element.level === 1 && (element.hasFlag === 0 || element.hasFlag === 1)) {
                    menus.push(
                        <MenuItem key={element.subList[0].permValue}>
                            <Link to={element.subList[0].permValue}>
                                <Icon type={element.icon} theme="outlined" />
                                <span>
                                    {
                                        intl.locale === 'en'
                                            ? element.permEname
                                            : element.permName
                                    }
                                </span>
                            </Link>
                        </MenuItem>
                    )
                }
            }
        }
        return menus;
    }

    render() {
        let { permissionList } = this.props;
        let { openKeys, selectedKeys } = this.state;
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
                className="sider"
            >
                <div className="layout-title">
                    <img src={logo} alt="" className="layout-title-logo" />
                    <h1 className="layout-title-title">浙江冠钰网络科技</h1>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    onOpenChange={openKeys => this.handleOpenChange(openKeys)}
                    selectedKeys={selectedKeys}
                    openKeys={openKeys}
                    onClick={data => this.onClickRemove(data)}
                >
                    {this.renderMenuItem(permissionList)}
                </Menu>
            </Sider>
        );
    }
}

export default injectIntl(SideMenu);
