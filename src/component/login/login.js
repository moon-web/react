import React, { Component } from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import {
    Link
} from 'react-router-dom';
import 'antd/dist/antd-with-locales.js';
import { Form, Input, Checkbox,message } from 'antd';
import LoginFooter from '../common/logofooter.js'
import API from '../../api/index'
//国际化
import { LocaleProvider, Pagination, DatePicker, TimePicker, Calendar,
         Popconfirm, Table, Modal, Button, Select, Transfer, Radio } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';
import $ from 'jquery'
moment.locale('en');
let aaa=''
const FormItem = Form.Item;

const formItemLayout = {labelCol: { span: 6 },wrapperCol: { span: 16 } };

const formTailLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16, offset: 4 }};

class DynamicRule extends React.Component {
    constructor(){
        super();
        this.state = {
            checkNick: false,
        };
    }
        
    componentDidMount(){
        localStorage.setItem('aaa',1);
        localStorage.setItem('lan','chinese');
        if(localStorage.getItem("userId")){
            window.location.pathname = "/";
        }
    }
        check = () => {
            this.props.form.validateFields(
                (err) => {
                    if (!err) {
                        console.info('success');
                    }
                }
            );
        }
        handleChange = (e) => {
            this.setState({
                checkNick: e.target.checked
            }, () => {
                this.props.form.validateFields(['nickname'], { force: true });
            });
        }
        checkPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('password')) {
                callback('Two passwords that you enter is inconsistent!');
            } else {
                callback();
            }
        }
        handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    localStorage.setItem("userName",values.username);
                    let data = {
                        username:values.username,
                        password:values.password
                    }
                    API.login(data).then(res => {
                        if(res.success === true) {
                            const info = {
                                id: res.dataObject.userId,
                                pass: res.dataObject.userPassword
                            }
                            localStorage.setItem("userId",res.dataObject.userId);
                            localStorage.setItem('Login', JSON.stringify(info));
                            window.location.pathname = "/";
                        }else{
                            message.error(res.msg)
                        }
                    })
                }
            });
        }

      
        render() {
            const { getFieldDecorator } = this.props.form;
            return (
                <div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem {...formItemLayout} label={this.props.locale==="chinese"? "用户名" : "Account" }>
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true,
                                message: '请输入正确用户名',
                            }],
                        })(
                            <Input placeholder="Please input your name" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}  label={this.props.locale==="chinese"? "登录密码" : "Password" } hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入正确的密码!',
                            }, {
                                validator: this.checkConfirm,
                            }],
                        })(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>{this.props.locale==="chinese"? "记住密码" : "Log on automatically" }</Checkbox>
                        )}
                        </FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        {this.props.locale==="chinese"? "登录" : "Sign in" }
                    </Button>
                         </Form>
                </div>
            );
        }}

const WrappedDynamicRule = Form.create()(DynamicRule);

class Admin_login extends Component{
     constructor() {
        super();     
        this.state = {        
            locale:'chinese',
        }
        this.changelan=this.changelan.bind(this)
    }
    changelan = (lan)=>{
        this.setState({
            locale:lan
        })
        localStorage.lan = lan;
        if(lan==='chinese'){
                 $('#ens').addClass('enens')
                $('#en').removeClass('enens')
        }else{
            $('#en').addClass('enens')
            $('#ens').removeClass('enens')
        }
    }
    render(){
        const locale=this.state.locale;
        return(
            <div id="Admin_login">
                <div className="Admin_Index">                   
                    <div className="hea">
                        <div className="hea_head">
                            <span key="cn" onClick={()=>this.changelan('chinese')} className="enen" id='ens'>中文</span>
                            <span>|</span>
                            <span key="en" value={locale} onClick={()=>this.changelan('en')} className='enen' id='en'>English</span>
                        </div>
                    </div>
                    {this.state.locale==="chinese"? "平台" : "Platform" }
                </div>
                <div className="Admin_backpag">
                    <div className="Admin_login">
                    <h3 className="Login_name">{this.state.locale==="chinese"? "您好，欢迎登录" : "Hello, welcome to sign in" }</h3>
                    <div className="content">
                        <WrappedDynamicRule  locale={this.state.locale}/>
                        <div className="choices">
                            <h3 className="taget">                           
                            </h3>
                            <div className="tagister">
                            </div>
                        </div>
                    </div>
                </div>
                <LoginFooter/>
                </div>
            </div>
        )
    }}

export default Admin_login;


