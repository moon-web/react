//用户管理界面
import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import {Button, Input, Table, Pagination, Layout, Select, Form, message} from 'antd';
import $ from 'jquery'
import API from '../../api/index'
import PropTypes from 'prop-types';

var btns = ''
const Option = Select.Option;
const {Header, Content} = Layout;
const data = []
var columns;
let selectUserId = [];
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        selectUserId = []
        for (let i = 0; i < selectedRows.length; i++) {
            selectUserId.push(selectedRows[i].userId)
        }
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
    }),
};

class System extends Component {
    state = {
        data: [],
        pageNo: '1',
        records: 0,//数据总条数
        current: 1,
        userAccount: '',//手机
        userName: '',//用户名
        status: '',//状态 1.正常 2.禁用
        aa: [],
        account: '',
        name: '',
        password: '',
        roleIds: '',
        passwordId: '',//修改密码的账户id
        newPassword: '',//新密码
        confirmPassword: '',//新密码确认密码
        loading:true
    }

    //系统管理列表
    system_list = (page) =>{
        this.setState({loading:true})
        let system = {
            pageNo: page,
            pageSize: 15,
            userName: this.state.userName,
            userAccount: this.state.userAccount
        }
        API.system_list(system).then(res => {
            if(res.success === true) {
                if (res.result && res.result.length > 0) {
                    let data = [];
                    let status = null;
                    for (let i = 0; i < res.result.length; i++) {
                        if (res.result[i].userStatus === 0) {
                            status = '已启用'
                        }
                        if (res.result[i].userStatus === 1) {
                            status = '已禁用'
                        }
                        data.push({
                            key: i,
                            userId: res.result[i].userId,
                            userAccount: res.result[i].userAccount,
                            userName: res.result[i].userName,
                            userStatus: status,
                            roleStr: res.result[i].roleStr,
                            gmtCreate: res.result[i].gmtCreate,
                        });
                    }
                    this.setState({data: data, records: res.records, loading: false})
                }
            }
        });
    }
    componentDidMount() {
        this.system_list(this.state.pageNo)
        //获取角色
        API.sysytem_role().then(res => {
            if (res.success === true) {
                this.setState({aa: res.result})
            }
        })
    }
    componentDidUpdate() {
        //权限菜单
        let permiss = this.context.permission;
        if(permiss) {
            permiss.forEach(v => {
                if (v.permValue === 'system') {
                    v.children.forEach(item => {
                        if (item.permValue === 'system/user') {
                            $('.qiyong').attr({disabled: "disabled"})
                            $('.lines').attr({disabled: "disabled"})
                            $('.lines').addClass('feiwu');
                            if (item.children) {
                                item.children.forEach(list => {
                                    if (list.permValue === 'system/list/3') {
                                        $('.qiyong').attr({disabled: null})
                                        $('.lines').attr({disabled: null})
                                        $('.lines').removeClass('feiwu');
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }

    handleChange = (value) => {
        this.setState({
            roleIds: `${value}`
        })
    }
    onChangePage = (page) => {
        this.setState({
            current: page,
            pageNo: page,
        });
        this.system_list(page)
    }
    //搜索
    searchUser = () => {
        this.system_list(this.state.pageNo)
    }

    searchUserName = (e) => {
        this.setState({userName: e.target.value})
    }
    searchAccount = (e) => {
        this.setState({userAccount: e.target.value})
    }
    //批量禁用
    forbiden = () => {
        let data = selectUserId.join(',');
        let systemDisable = {
            adminUserId: data
        }
        API.system_disable(systemDisable).then(res => {
            if (res.success == true) {
                this.system_list(this.state.pageNo)
            }
        })
    }
    //批量启用
    canUse = () => {
        let data = selectUserId.join(',');
        let systemEnable = {
            adminUserId: data
        }
        API.system_enable(systemEnable).then(res => {
            if (res.success == true) {
                this.system_list(this.state.pageNo)
            }
        })
    }

    //新增账号
    userAccount = (e) => {
        this.setState({account: e.target.value});
    }
    //新增用户名
    userName = (e) => {
        this.setState({name: e.target.value});
    }
    //新增账号的密码
    userPw = (e) => {
        if (e.target.value.length >= 6 && e.target.value.length <= 18) {
            let aa = /^[A-Za-z0-9]+$/;
            if (aa.test(e.target.value)) {
                this.setState({password: e.target.value})
            } else {
                message.warning("请输入6-18位的字母和数字的组合！")
            }
        } else {
            message.warning("输入的密码不符合规则！")
        }
    }
    //确认密码
    userSurePw = (e) => {
        if (e.target.value === this.state.password) {
        } else {
            message.error("两次密码不一样，请重新输入")
        }
    }
    //新增
    addUser = () => {
        $(".addUser-box").removeClass("active_adduserBox");
    }
    //取消
    cancleAddBrand = () => {
        $(".addUser-box").addClass("active_adduserBox");
    }

    //启用
    onPass(id) {
        let systemEnable = {
            adminUserId: id
        }
        API.system_enable(systemEnable).then(res => {
            if (res.success == true) {
                this.system_list(this.state.pageNo)
            }
        })
    }

    //禁用
    offPass(id) {
        let systemDisable = {
            adminUserId: id
        }
        API.system_disable(systemDisable).then(res => {
            if (res.success == true) {
                this.system_list(this.state.pageNo)
            }
        })
    }

    //新增
    saveAdd = (e) => {
        let systemUserCreate = {
            userAccount: this.state.account,
            password: this.state.password,
            userName: this.state.name,
            roleIds: this.state.roleIds
        }
        API.system_user_create(systemUserCreate).then(res => {
            if (res.success === true) {
                message.success("新增成功");
                $(".addUser-box").addClass("active_adduserBox");
                this.system_list(this.state.pageNo)
            } else {
                message.error(res.msg);
            }
        })
    }

    //修改密码
    changePassWord = (id) => {
        this.setState({
            passwordId: id
        })
        $(".confirmPass-box").removeClass("active_adduserBox");
    }
    //取消修改密码
    canclePassword = () => {
        $(".confirmPass-box").addClass("active_adduserBox");
    }

    //新密码
    userNewPassword = (e) => {
        if (e.target.value.length >= 6 && e.target.value.length <= 18) {
            let aa = /^[A-Za-z0-9]+$/;
            if (aa.test(e.target.value)) {
                this.setState({newPassword: e.target.value})
            } else {
                message.warning("请输入6-18位的字母和数字的组合！")
            }
        } else {
            message.warning("输入的密码不符合规则！")
        }
    }
    //确认密码
    userConfirmPassword = (e) => {
        if (e.target.value != this.state.newPassword) {
            message.warning("两次输入密码不一致，请重新输入")
        } else {
            this.setState({confirmPassword: e.target.value})
        }
    }
    //保存修改密码
    saveNewPassword = () => {
        if (this.state.newPassword === '') {
            message.warning("密码不能为空！")
            return false;
        }
        if (this.state.newPassword != this.state.confirmPassword) {
            message.warning("两次输入密码不一致，请重新输入")
            return false;
        }
        let systemPass = {
            adminUserId: this.state.passwordId,
            password: this.state.newPassword
        }
        API.system_user_resetpass(systemPass).then(res => {
            if (res.success === true) {
                message.success("修改密码成功！")
                $(".confirmPass-box").addClass("active_adduserBox");
                $(".confirmPass-box Input").val("")
                this.setState({confirmPassword: '', newPassword: ''})
            } else {
                message.error("修改密码失败！")
            }
        })
    }
    render() {
        if (localStorage.lan === 'chinese') {
            columns = [{
                title: '账号',
                dataIndex: 'userAccount',
                width: 200
            }, {
                title: '用户名称',
                dataIndex: 'userName',
                key: 'userName',
                render: text => <div className="Name">{text}</div>,
                width: 200
            }, {
                title: '角色',
                dataIndex: 'roleStr',
                width: 200
            }, {
                title: '创建时间',
                dataIndex: 'gmtCreate',
                width: 200
            }, {
                title: '状态',
                dataIndex: 'userStatus',
                width: 100
            }, {
                title: '操作',
                dataIndex: 'optration',
                render: (text, record) => (
                    <ul className="offline_buttons">
                        <Button type="" className="offline_lis lines"
                                onClick={() => this.onPass(record.userId)}>启用</Button>
                        <Button type="" className="offline_lis lines"
                                onClick={() => this.offPass(record.userId)}>禁用</Button>
                        <Button type="" className="offline_lis lines"
                                onClick={() => this.changePassWord(record.userId)}>修改密码</Button>
                    </ul>

                ),
                width: 200
            }];
        } else {
            columns = [{
                title: 'Account',
                dataIndex: 'userAccount',
                width: 200
            }, {
                title: 'User Name',
                dataIndex: 'userName',
                key: 'userName',
                render: text => <div className="Name">{text}</div>,
                width: 200
            }, {
                title: 'Role',
                dataIndex: 'roleStr',
                width: 200,
                render: (text, record) => {
                    if (record.roleStr === '品牌商') {
                        return (<div>Brand Owner</div>)
                    } else {
                        return (<div>Volunteer</div>)
                    }
                }
            }, {
                title: 'Creation Time',
                dataIndex: 'gmtCreate',
                width: 200
            }, {
                title: 'Status',
                dataIndex: 'userStatus',
                width: 100,
                render: (text, record) => {
                    if (record.userStatus === '已启用') {
                        return (<div>Enabled</div>)
                    } else if (record.userStatus === '已禁用') {
                        return (<div>Disabled</div>)
                    }
                }
            }, {
                title: 'Operate',
                dataIndex: 'optration',
                render: (text, record) => (
                    <ul className="offline_buttons">
                        <Button type="" className="offline_lis lines"
                                onClick={() => this.onPass(record.userId)}>Enable</Button>
                        <Button type="" className="offline_lis lines"
                                onClick={() => this.offPass(record.userId)}>Disabled</Button>
                        <Button type="" className="offline_lis lines"
                                onClick={() => this.changePassWord(record.userId)}>Modify Password</Button>
                    </ul>

                ),
                width: 200
            }];
        }

        return (
            <div>
                <div className="search">
                    <div>
                        <Form>
                            <div className="userlist">
                                <label htmlFor=""
                                       className="user_names">{localStorage.lan === "chinese" ? "账号" : "Account"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.searchAccount}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor=""
                                       className="user_names">{localStorage.lan === "chinese" ? "用户名" : "User"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.searchUserName}/>
                            </div>
                            <Button type="primary" className="buttons"
                                    onClick={this.searchUser}>{localStorage.lan === "chinese" ? "搜索" : "Search"}</Button>
                        </Form>
                    </div>
                </div>
                <div className="tables_list">
                    <div className="tables_choice">
                        <Button type="primary" className="qiyong"
                                onClick={this.addUser}>{localStorage.lan === "chinese" ? "新增" : "Add"} </Button>
                        <Button type="primary" className="qiyong"
                                onClick={this.canUse}>{localStorage.lan === "chinese" ? "启用" : "Enable"} </Button>
                        <Button type="primary" className="qiyong jinyong"
                                onClick={this.forbiden}>{localStorage.lan === "chinese" ? "禁用" : "Disabled"} </Button>
                    </div>
                    <div>
                        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data}
                               onRowClick={this.showModal}
                               bordered pagination={false}
                               loading={this.state.loading}

                        />
                        <div className='pagina'>
                            <Pagination current={this.state.current} onChange={this.onChangePage}
                                        total={this.state.records} pageSize={15}/>
                        </div>
                    </div>
                </div>
                <div className="addUser-box active_adduserBox">
                    <div className='flex_brand'>
                        <Form className="flex_brand_form">
                            <div className="flex_brand_userlist styme">
                                <div className='flex_brand_input'>
                                    <label htmlFor=""
                                           className="user_names  flex_brand_username flex_nem">{localStorage.lan === "chinese" ? "账号" : "Account"}
                                        ：</label>
                                    <Input size="small" placeholder="" className='flex_brand_small'
                                           onChange={this.userAccount}/>
                                </div>
                                <div className='flex_brand_input'>
                                    <label htmlFor=""
                                           className="user_names  flex_brand_username flex_nem">{localStorage.lan === "chinese" ? "用户名称" : "User"}
                                        ：</label>
                                    <Input size="small" placeholder="" className='flex_brand_small'
                                           onChange={this.userName}/>
                                </div>
                                <div className='flex_brand_input'>
                                    <label htmlFor=""
                                           className="user_names  flex_brand_username flex_nem">{localStorage.lan === "chinese" ? "密码" : "Password"}
                                        ：</label>
                                    <Input size="small" placeholder="请输入6-18位的字母或数字" className='flex_brand_small'
                                           type="password" onBlur={this.userPw}/>
                                </div>
                                <div className='flex_brand_input'>
                                    <label htmlFor=""
                                           className="user_names  flex_brand_username flex_nem">{localStorage.lan === "chinese" ? "确认密码" : "Confirm Password"}
                                        ：</label>
                                    <Input size="small" placeholder="" className='flex_brand_small' type="password"
                                           onBlur={this.userSurePw}/>
                                </div>
                                <div className='flex_brand_input'>
                                    <label htmlFor=""
                                           className="user_names flex_brand_username flex_nem">{localStorage.lan === "chinese" ? "角色选择" : "Role Selection"}
                                        ：</label>
                                    <Select
                                        showSearch
                                        style={{width: 200, height: 22}}
                                        placeholder="所属品牌商"
                                        onChange={this.handleChange}
                                        className="flex_brand_select"
                                    >
                                        {
                                            this.state.aa.map((v, i) => (
                                                <Option value={v.roleId.toString()} key={i}>{v.roleName}</Option>
                                            ))
                                        }
                                    </Select>
                                    <div className="flex_brand_buttons">
                                        <Button type="primary" className="flex_brand_Primary"
                                                onClick={this.saveAdd}>{localStorage.lan === "chinese" ? "保存" : "Save"}</Button>
                                        <Button type="primary" className='flex_brand_out'
                                                onClick={this.cancleAddBrand}>{localStorage.lan === "chinese" ? "取消" : "Cancle"}</Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="confirmPass-box active_adduserBox">
                    <div className='flex_brand'>
                        <Form className="flex_brand_form">
                            <div className="flex_brand_userlist styme">
                                <div className='flex_brand_input'>
                                    {localStorage.lan === "chinese" ? <label htmlFor=""
                                                                             className="user_names  flex_brand_username flex_nem">新密码：</label> :
                                        <label htmlFor="" className="user_names  flex_brand_username flex_nem E_lable">New
                                            Password：</label>}
                                    <Input size="small" placeholder="请输入6-18位的字母或数字" className='flex_brand_small'
                                           type="password"
                                           onBlur={this.userNewPassword}/>
                                </div>
                                <div className='flex_brand_input'>
                                    {localStorage.lan === "chinese" ? <label htmlFor=""
                                                                             className="user_names  flex_brand_username flex_nem">确认密码：</label> :
                                        <label htmlFor="" className="user_names  flex_brand_username flex_nem E_lable">Confirm
                                            Password：</label>}
                                    <Input size="small" placeholder="请输入确认密码" className='flex_brand_small'
                                           type="password"
                                           onBlur={this.userConfirmPassword}/>
                                </div>
                                <div className="flex_brand_buttons">
                                    <Button type="primary" className="flex_brand_Primary" style={{marginLeft: '110px'}}
                                            onClick={this.saveNewPassword}>{localStorage.lan === "chinese" ? "保存" : "Save"}</Button>
                                    <Button type="primary" className='flex_brand_out'
                                            onClick={this.canclePassword}>{localStorage.lan === "chinese" ? "取消" : "Cancle"}</Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}
System.contextTypes = {
    permission:PropTypes.array
}

export default System;