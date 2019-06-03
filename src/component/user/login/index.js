import React, { Component } from 'react'
import { Row, Col, Input, Button, Checkbox, message} from 'antd'
import { FormattedMessage } from 'react-intl'
import Footer from '../../common/layout/footer/index'
import logo from '../../../assets/images/newlogo.png'
import CN from '../../../assets/images/cn.png';
import EN from '../../../assets/images/eng.png';
import Username from '../../../assets/images/secondLogin_username.png';
import Password from '../../../assets/images/secondLogin_pw.png';
import  Close from '../../../assets/images/secondLogin_eye.png'
import  Open from '../../../assets/images/secondLogin_yan.png'
import './index.css'
export default class Login extends Component {
	constructor(props) {
		super()
		this.state = {
			lanBtag: true,
			rememberPd: false,
			changePassInput: true,
			username: '',
			password: ''
		}
	}
	componentWillMount() {
		let rememberPd = localStorage.getItem('rememberPd')
        if(rememberPd === 'true'){
			this.setState({
				rememberPd: true,
			})
        }else {
            this.setState({
                rememberPd: false
            })
        }
        this.setState({
            username: localStorage.getItem('username') || '',
            password: localStorage.getItem('password') || ''
		})
	}
	//改变语言
	changeLan(lan) {
		this.setState({
			locale: lan
		})
		localStorage.setItem("lan", lan)
        if (this.props.changeLocale) {
            this.props.changeLocale(lan)
        }
	}
	//登陆
	loginBtn() {
		let { username, password, rememberPd } = this.state
		let { intl } = this.props
        if(rememberPd) {
            localStorage.setItem("username",this.state.username)
            localStorage.setItem("password",this.state.password)
        }else {
            localStorage.removeItem("username")
            localStorage.removeItem("password")
		}
		localStorage.setItem("rememberPd",this.state.rememberPd)
		if(username === '' || username === undefined) {
			message.info(intl.formatMessage({id: 'login.please.user.name', defaultMessage: '请输入用户名', description: '请输入用户名'}))
			return
		}
		if(password === '' ||password === undefined) {
			message.info(intl.formatMessage({id: 'login.please.password', defaultMessage: '请输入密码', description: '请输入密码'}))
			return
		}
		let data = {
			username: username,
			password: password
		}
		this.props.login(data)
	}
	//记住密码
	remeberMe(e) {
        this.setState({
            rememberPd: e.target.checked
        })
	}
	clickChangePwInput() {
		let changePassInput = !this.state.changePassInput
		this.setState({
			changePassInput
		})
	}
	render() {
		let { username, password, rememberPd, changePassInput } = this.state
		let { intl } = this.props
		return(
			<div className="login-wrapper">
				<div className="login-top">
					<div className="login-top-box">
						<img src={logo} alt="" />
						<h3>
							<FormattedMessage id="login.title" defaultMessage="IP公社权利运营平台" description="IP公社权利运营平台"/>
						</h3>
					</div>
					<div className="login-top-box">	
						{
							intl.locale === 'zh' ?
							<div className="login-top-right" onClick={() => this.changeLan('en')}>				
								<img src={CN} alt="" className="language"/>
								<span>CN</span>
							</div> :
							<div className="login-top-right" onClick={() => this.changeLan('zh')}>				
								<img src={EN} alt="" className="language"/>
								<span>EN</span>
							</div>
						}							
					</div>
				</div>
				<div className="login-container">
					<div className="login-content">
						<div className="search-form login-box">
							<Row>
								<Col>
									<h3 className="login-title"><FormattedMessage id="login.account.login" defaultMessage="账号密码登录" description="账号密码登录"/></h3>
								</Col>
							</Row>
								<Row>
									<Col span={24}>
										<Input prefix={<img src={Username} alt="" />}
											placeholder={intl.formatMessage({id: 'login.please.user.name', defaultMessage: '请输入用户名', description: '请输入用户名'})}
											value={username} onChange={(e) => {this.setState({username: e.target.value.trim()})}}
										/>
									</Col>
								</Row>
								<Row>
									<Col span={24}>
										<Input prefix={<img src={Password} alt="" />} type={changePassInput ? "password" : "text"}
											placeholder={intl.formatMessage({id: 'login.please.password', defaultMessage: '请输入密码', description: '请输入密码'})}
											value={password} 
											onChange={(e) => {this.setState({password: e.target.value.trim()})}}
											suffix={<img src={changePassInput ? Open : Close} alt="" onClick={() => this.clickChangePwInput()}/>}
											onPressEnter={(e) => this.loginBtn()}
										/>
									</Col>
								</Row>
								<Row>
									<Col span={24}>
										<Button type="primary" onClick={() => this.loginBtn()}>
											<FormattedMessage id="login.btn" defaultMessage="登录" description="登录"/>
										</Button>
									</Col>
								</Row>
								<Row>
									<Col span={24}>
										<Checkbox  checked={rememberPd} onChange={(e) => this.remeberMe(e)}>
											<FormattedMessage id="login.remember" defaultMessage="记住密码" description="记住密码"/>											
										</Checkbox>
									</Col>
								</Row>
								
						</div>
					</div>
				</div>
				<div className="login-footer">
					<Footer />
				</div>
			</div>
		)
	}
}