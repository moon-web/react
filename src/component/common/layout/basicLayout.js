import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown, message, Tooltip } from 'antd'
import { injectIntl, FormattedMessage } from 'react-intl'
import SiderMenu from './slider/index'
import TopMenu from './header/index'
import BasicsRouter from '../../../router/router'
import img from '../../../assets/images/gooutimg.png'
import { withRouter } from 'react-router-dom'
import FooterComponent from './footer/index'
import './index.css'
import Api from '../../../api/index'

const { Header, Content, Footer } = Layout;
class BasicLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: JSON.parse(sessionStorage.getItem('collapsed')) || false,
            locale: localStorage.getItem('lan'),
            userType: localStorage.getItem('type'),
            menuArry: [],
            userAccount: localStorage.getItem('userAccount'),
        }
    }
    
    componentWillMount() {
        this.setState({
            collapsed: JSON.parse(sessionStorage.getItem('collapsed')) || false,
            locale: localStorage.getItem('lan'),
            userType: localStorage.getItem('type'),
            userAccount: localStorage.getItem('userAccount')
        })
    }

    toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
        }, () => {
            sessionStorage.setItem('collapsed', this.state.collapsed)
            this.props.changeCollapsed(this.state.collapsed)
        });
    }
    

    //退出登录
    loginOut() {
        Api.logout().then((res)=>{
            if(res.success){
                localStorage.removeItem("userId");
                localStorage.removeItem("Login");
                localStorage.removeItem('auditStatus')
                localStorage.removeItem('status')
                localStorage.removeItem('userAccount')
                // this.props.history.replace('/login')
                window.location.href = '/login'
            }else{
                message.error(res.msg)
            }
        })    
    }

    //中英文切换
    changelan(lan) {
        this.setState({
            locale: lan
        });
        if (this.props.changeLocale) {
            this.props.changeLocale(lan)
            this.props.changeLanguage(lan)
        }
         
        localStorage.setItem("lan", lan);
        // window.location.reload()
    }

    render() {
        const locale = this.state.locale;
        let { userInfo, permissionList, history } = this.props
        const menu = (
            <Menu style={{ top: '20px' }}>
                <Menu.Item style={{ width: '160px' }}>
                    <div className="login-out"
                        onClick={() => this.loginOut()}>
                        <Icon type="login" className="login-out-icon" />
                        <FormattedMessage id="global.sign.out" defaultMessage="退出登录" description="退出登录" />
                    </div>
                </Menu.Item>
            </Menu>
        )
        return (
            <Layout>
                {
                    userInfo && userInfo.userType !== '0' ? 
                    <SiderMenu
                        selectedKeys='1'
                        collapsed={this.state.collapsed}
                        permissionList = {permissionList}
                        history={history}
                    /> : ''
                }                  
                <Layout style={{minHeight:'100vh'}}>
                    <Header style={{ padding: '0'}}>
                        <div className={ userInfo && userInfo.userType === '0' ? "header-top-wrapper" : '' }>
                            { 
                            userInfo && userInfo.userType === '0' ? 
                                <div className="header-top-left">
                                    <TopMenu 
                                        selectedKeys='1'
                                        collapsed={this.state.collapsed}
                                        permissionList = {permissionList}
                                        history={history}
                                    />
                                </div> : ''
                            }
                            <div className="header-top-right headerwrapper">                            
                                {
                                    userInfo && userInfo.userType !== '0' ? 
                                        <Icon
                                            className="trigger change-trigger"
                                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                            onClick={() => this.toggle()}
                                        /> : ''
                                }
                                <div className={ userInfo && userInfo.userType === '0' ? "header-top-right-setting" : "header-top-right-resetting"}>
                                    <Dropdown overlay={menu} className="right-drap">
                                        <a className="ant-dropdown-link">
                                            <img src={img} alt="" className="header-right-img" />
                                            <span className="header-right-account" title={this.state.userAccount}>{this.state.userAccount}</span>
                                            
                                        </a>
                                    </Dropdown>
                                    <div className="header-top-right-lan">
                                        <span key="zh" onClick={() => this.changelan('zh')} className={this.state.locale === 'zh' ? 'header-language' : ''}>
                                            <FormattedMessage id="global.chinese" defaultMessage="中文" description="中文" />    
                                        </span>
                                        <span style={{color:'#808080',margin:'0 10px'}}>|</span>
                                        <span key="en" value={locale} onClick={() => this.changelan('en')}  className={this.state.locale === 'en' ? 'header-language' : ''}>
                                            <FormattedMessage id="global.english" defaultMessage="English" description="English" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Header>
                    <Content className={ userInfo && userInfo.userType === '0' ? 'layout-type-content' : 'layout-type-content-common'}>
                        <BasicsRouter />
                    </Content>
                    <Footer className={ userInfo && userInfo.userType === '0' ? 'layout-type-footer' : 'layout-type-footer-common'}>
                        <FooterComponent />
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default injectIntl(withRouter(BasicLayout));
