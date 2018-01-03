//用户管理界面
import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import {
    Button,
    Table,
    Pagination,
    Modal,
    Breadcrumb,
    Layout,
    Select,
    Form
} from 'antd';
import $ from 'jquery';
import API from '../../api/index'
import PropTypes from 'prop-types'


const Option = Select.Option;
const {Header, Content} = Layout;
const data = [];
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

class UserContent extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            visible: false,
            data: [],
            pageNo: '1',
            records: 0,//数据总条数
            current: 1,
            mobile: '',//手机
            userName: '',//用户名
            type: '',//用户类型 1 个人用户  2 品牌方
            status: '',//状态 1.正常 2.禁用
            isButton: false,
            loading:true,
        }
    }

    handleOk = () => {
        setTimeout(() => {
            this.setState({
                visible: false,
            });
        }, 50);
    };
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    //用户管理列表
    user = (page) => {
        this.setState({loading:true})
        let userData = {
            pageNo: page,
            pageSize: 15,
            userName: this.state.userName,
            mobile: this.state.mobile,
            type: this.state.type,
            status: this.state.status
        }
        API.user(userData).then(res => {
            if(res.success === true) {
                if (res.result && res.result.length > 0) {
                    const data = [];
                    let type = null;
                    let status = null;
                    for (let i = 0; i < res.result.length; i++) {
                        if (res.result[i].type == 1) {
                            type = '个人用户'
                        }
                        if (res.result[i].type == 2) {
                            type = '品牌方'
                        }
                        if (res.result[i].status == 1) {
                            status = '已启用'
                        }
                        if (res.result[i].status == 2) {
                            status = '已禁用'
                        }
                        data.push({
                            key: i,
                            userId: res.result[i].userId,
                            mobile: res.result[i].mobile,
                            userName: res.result[i].userName,
                            type: type,
                            status: status,
                            tortsType: this.tortsType,
                            auditStatus: this.auditStatus,
                            gmtCreate: res.result[i].gmtCreate,
                        });
                    }
                    this.setState({data: data, records: res.records, loading: false})
                }
            }
        })
    }
    componentDidMount() {
        this.user(this.state.pageNo)
    }

    componentDidUpdate(){
        //权限菜单
        let permission = this.context.permission
        if(permission) {
            permission.forEach(v => {
                if (v.permValue === 'user') {
                    v.children.forEach(item => {
                        if (item.permValue === 'user/list') {
                            $('.qiyong').attr({disabled: "disabled"})
                            if (item.children) {
                                item.children.forEach(list => {
                                    if (list.permValue === 'user/list/3') {
                                        $('.qiyong').attr({disabled: null})
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }
    //分页
    onChangePage = (page) => {
        this.setState({
            current: page,
            pageNo: page,
        });
        this.user(page)

    }
    //搜索
    searchUser = () => {
        this.user(this.state.pageNo)
    }
    searchUserName = (e) => {
        this.setState({userName: e.target.value})
    }
    searchPhone = (e) => {
        this.setState({mobile: e.target.value})
    }
    onChangeUserType = (value) => {
        this.setState({type: value});
    }
    onChangeState = (value) => {
        this.setState({status: value});
    }
    //禁用
    forbiden = () => {
        let userDisableData = {
            userId: selectUserId.join(',')
        };
        API.user_disable(userDisableData).then(res => {
            if (res.success == true) {
                this.user(this.state.pageNo)
            }
        })
    }
    //启用
    canUse = () => {
        let userEnableData = {
            userId: selectUserId.join(',')
        };
        API.user_enable(userEnableData).then(res => {
            if (res.success == true) {
                this.user(this.state.pageNo)
            }
        })
    }

    //重置按钮
    resetting = () => {
        this.setState({status: '0', type: '0', mobile: '', userName: ''});
    }

    render() {
        if (localStorage.lan === "chinese") {
            columns = [{
                title: '用户名',
                dataIndex: 'userName',
                /* render: () =><div className="Name" onClick={this.showModal}>name</div> ,*/
                key: 'userName',
                render: text => <div className="Name">{text}</div>,
                width: 200
            }, {
                title: '手机号码',
                dataIndex: 'mobile',
                width: 200
            }, {
                title: '用户类型',
                dataIndex: 'type',
                width: 200
            }, {
                title: '注册',
                dataIndex: 'gmtCreate',
                width: 200
            }, {
                title: '用户状态',
                dataIndex: 'status',
                width: 200
            }];
        } else {
            columns = [{
                title: 'User',
                dataIndex: 'userName',
                /* render: () =><div className="Name" onClick={this.showModal}>name</div> ,*/
                key: 'userName',
                render: text => <div className="Name">{text}</div>,
                width: 200
            }, {
                title: 'TEL',
                dataIndex: 'mobile',
                width: 200
            }, {
                title: 'User Types',
                dataIndex: 'type',
                width: 200
            }, {
                title: 'Registration Time',
                dataIndex: 'gmtCreate',
                width: 200
            }, {
                title: 'User Status',
                dataIndex: 'status',
                width: 200,
                render: (text, record) => {
                    if (record.status === '已启用') {
                        return (<div>{localStorage.lan === "chinese" ? "已启用" : "Enabled"}</div>)
                    } else if (record.status === '已禁用') {
                        return (<div>{localStorage.lan === "chinese" ? "已禁用" : "Disabled"}</div>)
                    }
                }
            }];
        }
        return (
            <div>
                <div className="search">
                    <div>
                        <Form>
                            <div className="userlist">
                                <label htmlFor=""
                                       className="user_names">{localStorage.lan === "chinese" ? "用户名称" : "User"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.searchUserName}
                                       value={this.state.userName}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor=""
                                       className="user_names">{localStorage.lan === "chinese" ? "手机号码" : "TEL"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.searchPhone}
                                       value={this.state.mobile}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '83px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "用户类型" : "User Types"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    defaultValue="0"
                                    optionFilterProp="children"
                                    onChange={this.onChangeUserType}
                                    value={this.state.type || '0'}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="0">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                    <Option value="2">{localStorage.lan === "chinese" ? "品牌方" : "Brand Owner"}</Option>
                                    <Option
                                        value="1">{localStorage.lan === "chinese" ? "个人用户" : "ndividual User"}</Option>
                                </Select>
                            </div>
                            <div className="userlist">
                                <label htmlFor=""
                                       className="user_names">{localStorage.lan === "chinese" ? "用户状态" : "User Status"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    defaultValue="0"
                                    value={this.state.status || '0'}
                                    optionFilterProp="children"
                                    onChange={this.onChangeState}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="0">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                    <Option value="2">{localStorage.lan === "chinese" ? "已禁用" : "Disabled"}</Option>
                                    <Option value="1">{localStorage.lan === "chinese" ? "已启用" : "Enabled"}</Option>
                                </Select>
                            </div>
                            <Button type="primary" className="buttons"
                                    onClick={this.searchUser}>{localStorage.lan === "chinese" ? "搜索" : "Search"}</Button>
                            <Button type="primary" className="buttons"
                                    onClick={this.resetting}>{localStorage.lan === "chinese" ? "重置" : "Resetting"}</Button>
                        </Form>
                    </div>
                </div>
                <div className="tables_list">
                    <div className="tables_choice">
                        <Button type="primary" className="qiyong"
                                onClick={this.canUse}>{localStorage.lan === "chinese" ? "启用" : "Enable"}</Button>
                        <Button type="primary" className="qiyong jinyong"
                                onClick={this.forbiden}>{localStorage.lan === "chinese" ? "禁用" : "Disable"}</Button>
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
                            <div>
                                <Modal visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}
                                       footer={null}>
                                    <div className='mask_modal'>
                                        <Header style={{paddingLeft: 20 + 'px', background: "#fff"}}>
                                            <Breadcrumb separator=">">
                                                <Breadcrumb.Item>{localStorage.lan === "chinese" ? "用户管理" : "User Management"}</Breadcrumb.Item>
                                                <Breadcrumb.Item>{localStorage.lan === "chinese" ? "用户资料" : "Users Information"}</Breadcrumb.Item>
                                            </Breadcrumb>
                                        </Header>
                                        <div className='User_msg'>
                                            <div className='user_msg_list'>
                                                <h3 className='zhanghao'>{localStorage.lan === "chinese" ? "账号" : "Account"}
                                                    :</h3>
                                                <span className='zhanghao_msg'></span>
                                            </div>
                                            <div className='user_msg_list'>
                                                <h3 className='zhanghao'>{localStorage.lan === "chinese" ? "昵称" : "Nickname"}
                                                    :</h3>
                                                <span className='zhanghao_msg'>张三</span>
                                            </div>
                                            <div className='user_msg_list'>
                                                <h3 className='zhanghao'>{localStorage.lan === "chinese" ? "npm sta证件类型" : "Certificate Type"}
                                                    :</h3>
                                                <span className='zhanghao_msg'>张三</span>
                                            </div>
                                            <div className='user_msg_list'>
                                                <h3 className='zhanghao'>{localStorage.lan === "chinese" ? "证件号" : "Certificate Number"}
                                                    :</h3>
                                                <span className='zhanghao_msg'>张三</span>
                                            </div>
                                            <div className='user_msg_list'>
                                                <h3 className='zhanghao'>{localStorage.lan === "chinese" ? "所在地" : "Location"}
                                                    :</h3>
                                                <span className='zhanghao_msg'>张三</span>
                                            </div>
                                            <div className='user_msg_list'>
                                                <h3 className='zhanghao'>{localStorage.lan === "chinese" ? "真实地理位置" : "Real-Time Location"}
                                                    :</h3>
                                                <span className='zhanghao_msg'>测试</span>
                                            </div>
                                            <Button type="primary" onClick={this.handleOk}
                                                    className='cancelsfan'>{localStorage.lan === "chinese" ? "返回用户管理" : "Return to User Management"}</Button>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
UserContent.contextTypes = {
    permission:PropTypes.array
}
export default UserContent;