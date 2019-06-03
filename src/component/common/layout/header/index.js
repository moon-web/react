import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl'
import { Menu, Icon } from 'antd';
import logo from '../../../../assets/images/logo1.png';
import { Link } from 'react-router-dom';

const { SubMenu, Item: MenuItem } = Menu;

class TopNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKeys: []
        }
    }

    componentWillMount() {
        let path = window.location.pathname;
        this.setState({
            selectedKeys: [path]
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setOpenKey(nextProps.history)
    }

    // 设置选中
    setOpenKey(history) {
        let path = history.location.pathname;
        this.setState({
            selectedKeys: [path]
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
                if (element.subList.length > 1 && (element.hasFlag === 0 || element.hasFlag === 1)) {
                    let subMenu = [];
                    for (let j = 0; j < element.subList.length; j++) {
                        const subElement = element.subList[j];
                        if (subElement.level === 2 && (subElement.hasFlag === 0 || subElement.hasFlag === 1)) {
                            subMenu.push(
                                <MenuItem key={subElement.permValue}>
                                    <Link to={subElement.permValue}>
                                        <Icon type={subElement.icon} theme="outlined" />
                                        {
                                            intl.locale === 'en'
                                            ? subElement.permEname
                                            : subElement.permName
                                        }
                                    </Link>
                                </MenuItem>
                            )
                        }
                    }
                    let result = (
                        <SubMenu key={element.permValue} title={
                            <span>
                                <Icon type={element.icon} />
                                {
                                    intl.locale === 'en'
                                    ? element.permEname
                                    : element.permName
                                }
                            </span>
                        } >
                            {subMenu}
                        </SubMenu>
                    )
                    menus.push(result)
                } else if (element.subList.length === 1 && element.level === 1 && (element.hasFlag === 0 || element.hasFlag === 1)) {
                    menus.push(
                        <MenuItem key={element.subList[0].permValue}>
                            <Link to={element.subList[0].permValue}>
                                <Icon type={element.icon} theme="outlined" />
                                {
                                    intl.locale === 'en'
                                    ? element.permEname
                                    : element.permName
                                }
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
        let { selectedKeys } = this.state;
        return (
            <div className="top-nav-wrapper">
                <div className="top-nav-left">
                    <div className="top-nav-title">
                        <img src={logo} alt="" className="" />
                        <h1 className="">浙江冠钰网络科技</h1>
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={selectedKeys}
                        onClick={data => this.onClickRemove(data)}
                    >
                        {this.renderMenuItem(permissionList)}
                    </Menu>
                </div>
            </div>
        );
    }
}

export default injectIntl(TopNav);
