import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import {Form} from 'antd';
import {
    Link
} from 'react-router-dom';


class Password extends Component {
    render() {
        return (
            <div className="Admin_register">
                <h3 className="Login_name">修改密码</h3>
                <div className="contents list">
                    <Form action="" className="from">
                        <ul className="">
                            <li className="lis">
                                <div className="lab">
                                    <label className="labels">手机号码：</label>
                                </div>
                                <input type="text" className="inputs"/>
                            </li>
                            <li className="lis">
                                <div className="lab">
                                    <label className="labels">验证码：</label>
                                </div>
                                <input type="text" className="inputs yanzhen"/>
                                <div className="Verification_Code">获取验证码</div>
                            </li>
                            <li className="lis">
                                <div className="lab">
                                    <label className="labels">密码：</label>
                                </div>
                                <input type="password" className="inputs"/>
                            </li>
                            <li className="lis">
                                <div className="lab">
                                    <label className="labels">确认密码：</label>
                                </div>
                                <input type="password" className="inputs"/>
                            </li>
                            <button disabled className="buttons">确认修改</button>
                        </ul>
                    </Form>
                </div>
            </div>
        )
    }
}

class Modify extends Component {
    render() {
        return (
            <div id="Admin_taget">
                <div className="Admin_Index">
                    权利运营
                </div>
                <div className="Admin_backpag">
                    <Password/>
                </div>
            </div>
        )
    }
}

export default Modify;