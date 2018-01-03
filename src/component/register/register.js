//注册界面
import React, { Component } from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import { Form} from 'antd';

class Admin_Register extends Component{
    render(){
        return(
            <div id="Admin_Register">
                <div className="Admin_Index">
                    权利运营
                </div>
                <div className="Admin_backpag">
                     <div className="Admin_register">
                <h3 className="Login_name">您好，加入权利运营平台</h3>
                <div className="contents">
                    <Form action="" className="from">
                        <ul className="">
                            <li className="lis">
                                <div className="lab">
                                    <label for="" className="labels">手机号码：</label>
                                </div>
                                <input type="text" className="inputs"/>
                            </li>
                            <li className="lis">
                                <div className="lab">
                                    <label for="" className="labels">验证码：</label>
                                </div>
                                <input type="text" className="inputs yanzhen"/>
                                <div className="Verification_Code">获取验证码</div>
                            </li>
                            <li className="lis">
                                <div className="lab">
                                    <label for="" className="labels">密码：</label>
                                </div>
                                <input type="password" className="inputs"/>
                            </li>
                            <li className="lis">
                                <div className="lab">
                                    <label for="" className="labels">确认密码：</label>
                                </div>
                                <input type="password" className="inputs"/>
                            </li>
                            <li className="lis">
                                <div className="lab">
                                    <label for="" className="labels">邀请码：</label>
                                </div>
                                <input type="password" className="inputs"/>
                            </li>
                            <button disabled className="buttons">确认注册</button>
                        </ul>
                    </Form>
                </div>
            </div>
                </div>
            </div>
        )
    }
}
export default Admin_Register;