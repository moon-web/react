import React, {Component} from 'react';
import '../../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import $ from 'jquery';
import {
    Link
} from 'react-router-dom';
import Admincontent from '../../index/home';
import UserContent from '../../user/user';
import Brandmanagement from '../../brand/brand';
import OffLine from '../../line/offline.js';
import Online from '../../line/online.js';
import Task from '../../task//task.js';
import TaskApplication from '../../task//taskapplication.js';
import Offlinetask from '../../task/offlinetask.js';
import Linetask from '../../task/linetask.js';
import Montioring from '../../monitoring/monitoring.js';
import MontioringList from '../../monitoring/monitoringlist.js'
import System from '../../system/system.js'
import {Icon, Menu, Dropdown, Tabs} from 'antd';
import API from '../../../api/index'
import PropTypes from 'prop-types';


var aaa = "";
const TabPane = Tabs.TabPane;

class Head extends Component {
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        var panes;
        if (localStorage.lan === 'chinese') {
            panes = [
                {title: '首页', content: <Admincontent/>, key: '1', closable: false}
            ];
        } else {
            panes = [
                {title: 'Index', content: <Admincontent/>, key: '1', closable: false}
            ];
        }
        this.state = {
            activeKey: "1",
            panes:panes,
            arr: [],
            account: '',
            permission:[],
            locale: 'chinese',
            con: '',
            cons: []
        };
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changelan = this.changelan.bind(this)
    }
    componentDidMount() {
        if (localStorage.getItem('aaa')) {
            var arr = localStorage.getItem('aaa');
            var bos = arr.split(',');
            var titleId = bos;
            for (var i = 0; i < titleId.length; i++) {
                if (titleId[i]) {
                    this.handleSubmit(titleId[i]);
                }
            }
        }

        // this.state.panes.push({title: '首页', content:<Admincontent locale={this.state.locale}/>, key: '1', closable: false});
        let userId = localStorage.getItem("userId")
        this.setState({
            account: localStorage.getItem("userName")
        });
        let permissData = {
            adminUserId:userId
        }

        //权限菜单
        API.permiss(permissData).then(res => {
            if (res.success === true) {
                this.setState({permission: res.dataObject})
            }
        })
    }
    getChildContext() {
        return {
            permission: this.state.permission
        };
    }
    onChange = (activeKey) => {
        this.setState({activeKey});
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    add = () => {
        const panes = this.state.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push({title: 'New Tab', content: 'Content of new Tab', key: activeKey});
        this.setState({panes, activeKey});
    }
    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;

        aaa = aaa.replace(targetKey + ",", "");
        localStorage.setItem('aaa', aaa);
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({panes, activeKey});

        if (targetKey === '9') {
            localStorage.removeItem('status', 1);
        }
        if (targetKey === '8') {
            localStorage.removeItem('status', 1);
        }
        if (targetKey === '4') {
            localStorage.removeItem('status', 1);
        }
        if (targetKey === '5') {
            localStorage.removeItem('status', 1);
        }
        if (targetKey === '11') {
            localStorage.removeItem('auditStatus', 0);
        }
    }
    //退出登录
    loginOut = () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("Login");
        localStorage.removeItem('aaa');
        localStorage.removeItem('auditStatus')
        localStorage.removeItem('status')
    }

    handleSubmit(num) {
        if (aaa.indexOf(num + ",") === -1) {
            aaa += num + ",";
            localStorage.setItem('aaa', aaa);
        }
        let loc = this.state.locale;
        function e(c, a) {
            var e = []
            c.filter(function (v) {
                if (v.key === a.key) {
                    e.push(v.key)
                }
            })
            if (!e.length) {
                c.push(a)
            }
        }
        if (num === "1") {
            c = this.state.panes;
        } else if (num === "2") {
            var c = this.state.panes;
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '用户管理', content: <UserContent locale={loc}/>, key: '2', closable: true}
            } else {
                a = {title: 'User Management', content: <UserContent locale={loc}/>, key: '2', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        } else if (num === "3") {
            var c = this.state.panes;
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '品牌管理', content: <Brandmanagement/>, key: '3', closable: true}
            } else {
                a = {title: 'Brands Management', content: <Brandmanagement/>, key: '3', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        }
        else if (num === "4") {
            var c = this.state.panes
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '线上举报任务', content: <Online/>, key: '4', closable: true}
            } else {
                a = {title: 'Online Clue Tip-off', content: <Online/>, key: '4', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        }
        else if (num === "5") {
            var c = this.state.panes
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '线下举报任务', content: <OffLine/>, key: '5', closable: true}
            } else {
                a = {title: 'Offline Clue Tip-off', content: <OffLine/>, key: '5', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        }
        else if (num === "6") {
            var c = this.state.panes
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '举报任务管理', content: <Task/>, key: '6', closable: true}
            } else {
                a = {title: 'Tip-off Task Management', content: <Task/>, key: '6', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        }
        else if (num === "7") {
            var c = this.state.panes
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '举报人申请审核', content: <TaskApplication/>, key: '7', closable: true}
            } else {
                a = {title: 'Tip-off Applicant Check', content: <TaskApplication/>, key: '7', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        }
        else if (num === "8") {
            var c = this.state.panes
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '线下举报任务审核', content: <Offlinetask/>, key: '8', closable: true}
            } else {
                a = {title: 'Offline Tip-off Task Check', content: <Offlinetask/>, key: '8', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        }
        else if (num === "9") {
            var c = this.state.panes
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '线上举报任务审核', content: <Linetask/>, key: '9', closable: true}
            } else {
                a = {title: 'Online Tip-off Task Check', content: <Linetask/>, key: '9', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        }
        else if (num === "10") {
            var c = this.state.panes
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '监控规则管理', content: <Montioring/>, key: '10', closable: true}
            } else {
                a = {title: 'Monitoring Rlue Management', content: <Montioring/>, key: '10', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        }
        else if (num === "11") {
            var c = this.state.panes
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '管控任务审核', content: <MontioringList/>, key: '11', closable: true}
            } else {
                a = {title: 'Monitoring Task Check', content: <MontioringList/>, key: '11', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        }
        else if (num === "12") {
            var c = this.state.panes
            var a;
            if (localStorage.lan === 'chinese') {
                a = {title: '系统管理', content: <System/>, key: '12', closable: true}
            } else {
                a = {title: 'System Management', content: <System/>, key: '12', closable: true}
            }
            e(c, a);
            this.state.cons.push(num)
        }
        this.setState({
            activeKey: num,
            panes: c,
        });
    }

    changelan = (lan) => {
        this.setState({
            locale: lan
        });
        localStorage.lan = lan;
        window.location.reload('/')
    }

    render() {
        if (localStorage.lan === 'chinese') {
            $('#ens').addClass('enens')
            $('#en').removeClass('enens')
        } else {
            $('#en').addClass('enens')
            $('#ens').removeClass('enens')
        }
        var a = <li>
            <div onClick={() => this.handleSubmit("1")}>{localStorage.lan === "chinese" ? "首页1" : "index"}</div>
        </li>
        var b = (<li>
            <div
                onClick={() => this.handleSubmit("2")}>{localStorage.lan === "chinese" ? "用户管理" : "User Management"}</div>
        </li>)
        var c = (<li>
            <div
                onClick={() => this.handleSubmit("3")}>{localStorage.lan === "chinese" ? "品牌管理" : "Brands Management"}</div>
        </li>)

        var done = (<Menu.Item>
            <div target="_blank" rel="noopener noreferrer"
                 onClick={() => this.handleSubmit("4")}>{localStorage.lan === "chinese" ? "线上线索管理" : "Online Clue Tip-off"}</div>
        </Menu.Item>)
        var dtwo = (<Menu.Item>
            <div target="_blank" rel="noopener noreferrer"
                 onClick={() => this.handleSubmit("5")}>{localStorage.lan === "chinese" ? "线下线索管理" : "Offline Clue Tip-off"}</div>
        </Menu.Item>)
        var eone = (<Menu.Item>
            <div target="_blank" rel="noopener noreferrer"
                 onClick={() => this.handleSubmit("6")}>{localStorage.lan === "chinese" ? "举报任务管理" : "Tip-off Task Management"}</div>
        </Menu.Item>)
        var etwo = (<Menu.Item>
            <div target="_blank" rel="noopener noreferrer"
                 onClick={() => this.handleSubmit("7")}>{localStorage.lan === "chinese" ? "举报申请人审核" : "Tip-off Applicant Check"}</div>
        </Menu.Item>)
        var ethree = (<Menu.Item>
            <div target="_blank" rel="noopener noreferrer"
                 onClick={() => this.handleSubmit("8")}>{localStorage.lan === "chinese" ? "线下举报任务审核" : "Offline Tip-off Task Check"}</div>
        </Menu.Item>)
        var efour = (<Menu.Item>
            <div target="_blank" rel="noopener noreferrer"
                 onClick={() => this.handleSubmit("9")}>{localStorage.lan === "chinese" ? "线上举报任务审核" : "Online Tip-off Task Check"}</div>
        </Menu.Item>)

        var fone = (<Menu.Item>
            <div target="_blank" rel="noopener noreferrer"
                 onClick={() => this.handleSubmit("10")}>{localStorage.lan === "chinese" ? "监控规则管理" : "Monitoring Rlue Management"}</div>
        </Menu.Item>)
        var ftwo = (<Menu.Item>
            <div target="_blank" rel="noopener noreferrer"
                 onClick={() => this.handleSubmit("11")}>{localStorage.lan === "chinese" ? "管控任务审核" : "Monitoring Task Check"}</div>
        </Menu.Item>)

        var g = (<li>
            <div
                onClick={() => this.handleSubmit("12")}>{localStorage.lan === "chinese" ? "系统管理" : "System Management"}</div>
        </li>)

        var html = [];
        let dataObjects = this.state.permission;
        if (dataObjects) {
            for (let i = 0; i < dataObjects.length; i++) {
                if (dataObjects[i].permValue === 'user') {
                    if (dataObjects[i].children && dataObjects[i].children.length > 0) {
                        for (let j = 0; j < dataObjects[i].children.length; j++) {
                            if (dataObjects[i].children[j].children && dataObjects[i].children[j].children.length > 0) {
                                for (let z = 0; z < dataObjects[i].children[j].children.length; z++) {
                                    if (dataObjects[i].children[j].children[z].permName === '审核') {

                                    }
                                }
                            }
                        }
                    }
                    html.push(b)
                } else if (dataObjects[i].permValue === 'brand') {
                    html.push(c)
                } else if (dataObjects[i].permValue === 'xiansuo') {
                    let Wrapper = [];
                    if (dataObjects[i].children && dataObjects[i].children.length > 0) {
                        for (let j = 0; j < dataObjects[i].children.length; j++) {
                            if (dataObjects[i].children[j].permValue === 'xiansuo/up') {
                                Wrapper.push(done)
                            } else if (dataObjects[i].children[j].permValue === 'xiansuo/down') {
                                Wrapper.push(dtwo)
                            }
                        }
                    }
                    const menu = (
                        <Menu>
                            {Wrapper}
                        </Menu>
                    );
                    var d = (<li><Dropdown overlay={menu}>
                        <div className="ant-dropdown-link line_mess"
                             href="#">{localStorage.lan === "chinese" ? "线索管理" : "Clue Management"}<Icon type="down"/>
                        </div>
                    </Dropdown></li>)
                    html.push(d)
                } else if (dataObjects[i].permValue === 'report') {
                    let renwuWrapper = [];
                    if (dataObjects[i].children && dataObjects[i].children.length > 0) {
                        for (let j = 0; j < dataObjects[i].children.length; j++) {
                            if (dataObjects[i].children[j].permValue === 'report/task') {
                                renwuWrapper.push(eone)
                            } else if (dataObjects[i].children[j].permValue === 'report/check') {
                                renwuWrapper.push(etwo)
                            } else if (dataObjects[i].children[j].permValue === 'report/online') {
                                renwuWrapper.push(ethree)
                            } else if (dataObjects[i].children[j].permValue === 'report/down') {
                                renwuWrapper.push(efour)
                            }
                        }
                    }
                    const renwu = (
                        <Menu>
                            {renwuWrapper}
                        </Menu>
                    );
                    var e = (<li><Dropdown overlay={renwu}>
                        <div className="ant-dropdown-link line_mess"
                             href="#">{localStorage.lan === "chinese" ? "举报任务管理" : "Tip-off Task Management"}<Icon
                            type="down"/></div>
                    </Dropdown></li>)
                    html.push(e)
                } else if (dataObjects[i].permValue === 'data') {
                    let systemWrapper = [];
                    if (dataObjects[i].children && dataObjects[i].children.length > 0) {
                        for (let j = 0; j < dataObjects[i].children.length; j++) {
                            if (dataObjects[i].children[j].permValue === 'data/rule') {
                                systemWrapper.push(fone)
                            } else if (dataObjects[i].children[j].permValue === 'data/task') {
                                systemWrapper.push(ftwo)
                            }
                        }
                    }
                    const data = (
                        <Menu>
                            {systemWrapper}
                        </Menu>
                    );
                    var f = (<li><Dropdown overlay={data}><a className="ant-dropdown-link line_mess"
                                                             href="#">{localStorage.lan === "chinese" ? "数据监测" : "Monitoring Rlue Management"}<Icon
                        type="down"/></a></Dropdown></li>)
                    html.push(f)
                }
                else if (dataObjects[i].permValue === 'system') {
                    html.push(g)
                }
            }
        }
        const locale = this.state.locale;
        var con;
        if(this.state.panes){
            con = this.state.panes.map(pane =>
                <TabPane tab={pane.title} key={pane.key}
                         closable={pane.closable}>{pane.content}
                </TabPane>);
        }
        return (
            <div id="Admin_Head">
                <header className="login">
                    <div className="login_name">
                        <div className="bianhuan">
                            <div className="hea_head">
                                <span key="cn" onClick={() => this.changelan('chinese')} className="enen"
                                      id='ens'>中文</span>
                                <span>|</span>
                                <span key="en" value={locale} onClick={() => this.changelan('en')} className='enen'
                                      id='en'>English</span>
                            </div>
                        </div>
                        <div className="icon"><Icon type="user"/></div>
                        <h3 className="user_name">{this.state.account}</h3>
                        <span className="line"> | </span>
                        <Link to="/login" className="goout" onClick={this.loginOut}>{localStorage.lan === "chinese" ? "退出" : "Sign out"}</Link>
                    </div>
                </header>
                <div className="Names">
                    {localStorage.lan === "chinese" ? "平台" : "Platform"}
                </div>
                <div className="nav">
                    <div className="list">
                        <ul>
                            <li>
                                <div style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}
                                     onClick={() => this.handleSubmit("1")}>{localStorage.lan === "chinese" ? "首页" : "Home"}</div>
                            </li>
                            {html}
                        </ul>
                    </div>
                </div>
                <div>
                    <Tabs
                        onChange={this.onChange}
                        activeKey={this.state.activeKey}
                        type="editable-card"
                        onEdit={this.onEdit}
                        locale={this.state.locale}
                        hideAdd={true}
                    >
                        {con}
                    </Tabs>
                </div>
            </div>
        )
    }
}
Head.childContextTypes = {
    permission: PropTypes.array
};
export default Head;