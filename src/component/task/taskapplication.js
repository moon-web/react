//任务申领结果审批
import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import $ from 'jquery';
import {Button, Table, Pagination, Form, DatePicker, Select} from 'antd';
import API from '../../api/index'
import PropTypes from 'prop-types'

const Option = Select.Option;
var columns;
var btns = ''
let selectUserId = [];
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        for (let i = 0; i < selectedRows.length; i++) {
            selectUserId.push(selectedRows[i].id)
        }
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
    }),
};

class TaskApplication extends Component {
    //初始化
    constructor() {
        super()
        this.state = {
            data: [],
            pageNo: 1,// 页面号  默认1
            user: '',// 用户名称
            current: 1,
            records: 0,//数据总条数
            startValue: null,
            endValue: null,
            endOpen: false,
            userName: '',
            taskName: '',
            taskType: '',
            status: '',
            startTime: '',
            endTime: '',
            loading: true
        }
    }

    //举报人申请审核列表
    task_people_list = (page) => {
        this.setState({loading: true})
        let userId = localStorage.getItem("userId")
        if (userId === '1') {
            userId = ''
        }
        let taskPeople = {
            pageNo: this.state.pageNo,
            pageSize: 15,
            userName: this.state.userName,
            taskName: this.state.taskName,
            status: this.state.status,
            taskType: this.state.taskType,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            brandUserId: userId
        }
        API.task_people(taskPeople).then(res => {
            let data = [];
            let taskType = null;
            let status = null;
            if (res.success === true) {
                if (res.result && res.result.length > 0) {
                    for (let i = 0; i < res.result.length; i++) {
                        if (res.result[i].taskType === 1) {
                            taskType = '线上任务'
                        }
                        if (res.result[i].taskType === 2) {
                            taskType = '线下任务'
                        }
                        if (res.result[i].status === 1) {
                            status = '待审核'
                        }
                        if (res.result[i].status === 2) {
                            status = '通过'
                        }
                        if (res.result[i].status === 3) {
                            status = '不通过'
                        }
                        data.push({
                            id: res.result[i].id,
                            taskId: res.result[i].taskId,
                            userName: res.result[i].userName,
                            taskName: res.result[i].taskName,
                            taskType: taskType,
                            brandName: res.result[i].brandName,
                            status: status,
                            endTime: res.result[i].endTime,
                            startTime: res.result[i].startTime,
                            key: i,
                        })
                    }
                }
                this.setState({data: data, records: res.records, loading: false})
            }
        })
    }

    //获取数据
    componentDidMount() {
        this.task_people_list(this.state.pageNo)
    }

    componentDidUpdate() {
        //权限菜单
        let permission = this.context.permission;
        if (permission) {
            permission.forEach(v => {
                if (v.permValue === 'report') {
                    v.children.forEach(item => {
                        if (item.permValue === 'report/check') {
                            $('.lines').attr({disabled: "disabled"})
                            $('.lines').addClass('feiwu');
                            $('.nolines').attr({disabled: "disabled"})
                            $('.nolines').addClass('feiwu');
                            $('.qiyong').attr({disabled: "disabled"})
                            if (item.children) {
                                item.children.forEach(list => {
                                    if (list.permValue === '3') {
                                        $('.lines').attr({disabled: null})
                                        $('.lines').removeClass('feiwu');
                                        $('.nolines').attr({disabled: null})
                                        $('.nolines').removeClass('feiwu');
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

    //右审核通过
    pass(id) {
        let taskPeopelExamine = {
            id: id,
            status: 2
        }
        API.task_people_examine(taskPeopelExamine).then(res => {
            if (res.success === true) {
                this.task_people_list(this.state.pageNo)

            }
        })
    }

    //右审核不通过
    unpass(id) {
        let taskPeopelExamine = {
            id: id,
            status: 3
        }
        API.task_people_examine(taskPeopelExamine).then(res => {
            if (res.success === true) {
                this.task_people_list(this.state.pageNo)
            }
        })
    }

    //搜索获取
    taskpersonal = (e) => {
        this.setState({userName: e.target.value});
    }
    taskname = (e) => {
        this.setState({taskName: e.target.value});
    }
    tasktype = (value) => {
        this.setState({taskType: value});
    }
    taskstatus = (value) => {
        this.setState({status: value});
    }
    //重置
    resetting = () => {
        this.setState({
            userName: '',
            taskName: '',
            taskType: '',
            status: '',
            startValue: '',
            endValue: '',
            startTime: '',
            endTime: ''

        })
    }
    //搜索
    tasksearchCon = (e) => {
        this.task_people_list(this.state.pageNo)
    }
    //分页
    onChangePages = (page) => {
        this.setState({
            current: page,
            pageNo: page,
        });
        this.task_people_list(page)

    }
    //审核不过
    notsuc = () => {
        let data = selectUserId.join(',');
        let taskPeopelExamine = {
            id: data,
            status: 3
        }
        API.task_people_examine(taskPeopelExamine).then(res => {
            if (res.success === true) {
                this.task_people_list(this.state.pageNo)
            }
        })
    }
    //审核通过
    suc = () => {
        let data = selectUserId.join(',');
        let taskPeopelExamine = {
            id: data,
            status: 2
        }
        API.task_people_examine(taskPeopelExamine).then(res => {
            if (res.success === true) {
                this.task_people_list(this.state.pageNo)
            }
        })
    }
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    //时间选择框
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        if (value && value != undefined) {
            let date = new Date(value._d);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let second = date.getSeconds();

            function checked(test) {
                if (test <= 9) {
                    test = '0' + test
                }
                return test
            }

            let time = `${year}-${checked(month)}-${checked(day)} ${checked(hours)}:${checked(minutes)}:${checked(second)}`;
            this.setState({startTime: time})
        }
        this.onChange('startValue', value);

    }

    onEndChange = (value) => {
        if (value && value != undefined) {
            let date = new Date(value._d);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let second = date.getSeconds();

            function checked(test) {
                if (test <= 9) {
                    test = '0' + test
                }
                return test
            }

            let time = `${year}-${checked(month)}-${checked(day)} ${checked(hours)}:${checked(minutes)}:${checked(second)}`;
            this.setState({endTime: time})
        }
        this.onChange('endValue', value);

    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    }

    render() {
        const {startValue, endValue, endOpen} = this.state
        if (localStorage.lan === 'chinese') {
            columns = [{
                key: 'userid',
                title: '任务申请人',
                dataIndex: 'userName',
                width: 300
            }, {
                key: 'taskName',
                title: '任务名称',
                dataIndex: 'taskName',
                width: 300
            }, {
                key: 'taskType',
                title: '任务类型',
                dataIndex: 'taskType',
                width: 300
            }, {
                key: 'brandName',
                title: '所属品牌',
                dataIndex: 'brandName',
                width: 300
            }, {
                key: 'status',
                title: '状态',
                dataIndex: 'status',
                width: 300
            }, {
                key: 'options',
                title: '操作',
                render: (text, record, index) => {
                    let aa = ''
                    if (record.status && record.status === '待审核') {
                        aa = <ul className="offline_buttons">
                            <Button type="" className="qiyong offline_lis lines"
                                    onClick={() => this.pass(record.id)}>{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</Button>
                            <Button type="" className="qiyong offline_lis nolines"
                                    onClick={() => this.unpass(record.id)}>{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</Button>
                        </ul>
                    }
                    return aa;

                }, width: 220

            }];
        } else {
            columns = [{
                key: 'userid',
                title: 'Applicant',
                dataIndex: 'userName',
                width: 300
            }, {
                key: 'taskName',
                title: 'Task Name',
                dataIndex: 'taskName',
                width: 300
            }, {
                key: 'taskType',
                title: 'Task Type',
                dataIndex: 'taskType',
                width: 300,
                render: (text, record) => {
                    if (record.taskType === '线上任务') {
                        return (<div>Online</div>)
                    } else if (record.taskType === '线下任务') {
                        return (<div>Offline</div>)
                    }
                }
            }, {
                key: 'brandName',
                title: 'Brand',
                dataIndex: 'brandName',
                width: 300
            }, {
                key: 'status',
                title: 'Status',
                dataIndex: 'status',
                width: 300,
                render: (text, record) => {
                    if (record.status === '待审核') {
                        return (<div>Pending</div>)
                    } else if (record.status === '通过') {
                        return (<div>Pass</div>)
                    } else if (record.status === '不通过') {
                        return (<div>Fail</div>)
                    }

                }
            }, {
                key: 'options',
                title: 'Operate',
                render: (text, record, index) => {
                    let aa = ''
                    if (record.status && record.status === '待审核') {
                        aa = <ul className="offline_buttons">
                            <Button type="" className="qiyong offline_lis lines"
                                    onClick={() => this.pass(record.id)}>{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</Button>
                            <Button type="" className="qiyong offline_lis nolines"
                                    onClick={() => this.unpass(record.id)}>{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</Button>
                        </ul>
                    }
                    return aa;

                }, width: 220

            }];
        }

        return (
            <div>
                <div className="search">
                    <div id="lineTask_box">
                        <Form>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "任务申请人" : "Applicant"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.taskpersonal}
                                       value={this.state.userName}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "任务名称" : "Task Name"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.taskname}
                                       value={this.state.taskName}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "任务类型" : "Task Type"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    value={this.state.taskType || '0'}
                                    optionFilterProp="children"
                                    onChange={this.tasktype}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="0">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                    <Option value="2">{localStorage.lan === "chinese" ? "线下举报" : "Offline"}</Option>
                                    <Option value="1">{localStorage.lan === "chinese" ? "线上举报" : "Online"}</Option>
                                </Select>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "状态" : "Status"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    value={this.state.status || '0'}
                                    optionFilterProp="children"
                                    onChange={this.taskstatus}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="0">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                    <Option value="1">{localStorage.lan === "chinese" ? "待审核" : "Pending"}</Option>
                                    <Option value="2">{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</Option>
                                    <Option value="3">{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</Option>

                                </Select>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "创建时间" : "Creation Time"}
                                    ：</label>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={startValue}
                                    style={{width: '114px'}}
                                    placeholder="Start"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={endValue}
                                    placeholder="End"
                                    style={{width: '114px', marginLeft: 10}}
                                    onChange={this.onEndChange}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                            <Button type="primary" className="buttons" style={{marginLeft: '23px'}}
                                    onClick={this.tasksearchCon}>{localStorage.lan === "chinese" ? "搜索" : "Search"}</Button>
                            <Button type="primary" className="buttons"
                                    onClick={this.resetting}>{localStorage.lan === "chinese" ? "重置" : "Resetting"}</Button>
                        </Form>
                    </div>
                </div>
                <div className="tables_list">
                    <div className="tables_choice">
                        <Button type="primary" className="qiyong"
                                onClick={this.suc}>{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</Button>
                        <Button type="primary" className="qiyong no"
                                onClick={this.notsuc}>{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</Button>
                    </div>
                    <div>
                        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} bordered
                               pagination={false} loading={this.state.loading}/>
                        <div className='pagina'>
                            <Pagination current={this.state.current} onChange={this.onChangePages}
                                        total={this.state.records} pageSize={15}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
TaskApplication.contextTypes = {
    permission: PropTypes.array
}
export default TaskApplication;