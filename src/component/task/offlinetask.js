//作业任务管理  线下任务
import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import {Button, Table, Pagination, Form, message, DatePicker, Select} from 'antd';
import $ from 'jquery'
import btn from '../../assets/images/btn.png'
import API from '../../api/index'
import PropTypes from 'prop-types'
const Option = Select.Option;
var columns;
var btns = ''

let selectUserId = [];
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        selectUserId = [];
        for (let i = 0; i < selectedRows.length; i++) {
            selectUserId.push(selectedRows[i].id)
        }
    },
    /* getCheckboxProps: record => ({
       disabled: record.name === 'Disabled User', // Column configuration not to be checked
     }),*/
};

class Offlinetask extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            pageNo: 1,// 页面号  默认1
            user: '',// 用户名称
            taskName: '',
            userName: '',
            goodsType: '',
            address: '',
            detailAddress: '',
            status: '',
            reportTime: '',
            require: '',
            mainPics: '',
            note: '',
            current: 1,
            records: 0,//数据总条数
            startValue: null,
            endValue: null,
            endOpen: false,
            brandName: '',
            startTime: '',
            endTime: '',
            loading:true
        }
    }
    //线下举报任务列表
    offLineTask = (page) => {
        let userId = localStorage.getItem("userId");
        if (userId === '1') {
            userId = ''
        }
        let offLineData = {
            brandUserId: userId,
            pageNo: page,
            pageSize: 15,
            taskName: this.state.taskName,
            userName: this.state.userName,
            address: this.state.address,
            status: this.state.status,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            type: 2
        }
        API.task_line(offLineData).then(res => {
            let data = [];
            let goodsType = null;
            let status = null;
            if(res.success === true) {
                if (res.result && res.result.length > 0) {
                    for (let i = 0; i < res.result.length; i++) {
                        if (res.result[i].goodsType === 1) {
                            goodsType = '衣服'
                        }
                        if (res.result[i].goodsType === 2) {
                            goodsType = '鞋包'
                        }
                        if (res.result[i].goodsType === 3) {
                            goodsType = '首饰'
                        }
                        if (res.result[i].goodsType === 4) {
                            goodsType = '手表'
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
                            key: i,
                            id: res.result[i].id,
                            brandName: res.result[i].brandName,
                            taskName: res.result[i].taskName,
                            userName: res.result[i].userName,
                            goodsType: goodsType,
                            brand: res.result[i].brand,
                            address: res.result[i].address,
                            detailAddress: res.result[i].detailAddress,
                            status: status,
                            reportTime: res.result[i].reportTime,
                            require: res.result[i].require,
                            mainPics: res.result[i].mainPics,
                            note: res.result[i].note
                        })
                    }
                    this.setState({data: data, records: res.records, loading: false})
                }
            }
        })
    }
    componentDidMount() {
        this.offLineTask(this.state.pageNo)
    }

    componentDidUpdate() {
        //权限菜单
        let permission = this.context.permission;
        permission.forEach(v => {
            if (v.permValue === 'report') {
                v.children.forEach(item => {
                    if (item.permValue === 'report/down') {
                        $('.qiyong').attr({disabled: "disabled"})
                        $('.lines').attr({disabled: "disabled"})
                        $('.lines').addClass('feiwu');
                        $('.nolines').attr({disabled: "disabled"})
                        $('.nolines').addClass('feiwu');
                        if (item.children) {
                            item.children.forEach(list => {
                                if (list.permValue === 'report/down/3') {
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

    //批量审核不通过
    notsuc = () => {
        let data = selectUserId.join(',');
        let offLineExamine = {
            id: data,
            status: 3
        }
        API.task_line_examine(offLineExamine).then(res => {
            if (res.success == true) {
                this.offLineTask(this.state.pageNo)
            }
        })
    }
    //批量审核通过
    suc = (id) => {
        let data = selectUserId.join(',');
        let offLineExamine = {
            id: data,
            status: 2
        }
        API.task_line_examine(offLineExamine).then(res => {
            if (res.success == true) {
                this.offLineTask(this.state.pageNo)
            }
        })
    }

    task = (e) => {
        this.setState({taskName: e.target.value});
    }

    taskpepole = (e) => {
        this.setState({userName: e.target.value});
    }

    address = (e) => {
        this.setState({address: e.target.value});
    }

    status = (value) => {
        this.setState({status: value});
    }
    //重置
    resetting = () => {
        this.setState({
            taskName: '',
            userName: '',
            address: '',
            status: '',
            startValue: '',
            endValue: '',
            startTime: '',
            endTime: ''
        })
    }
    reportTime = (e) => {
        this.setState({reportTime: e.target.value});
    }
    //搜索
    searchCon = (e) => {
        this.offLineTask(this.state.pageNo)
    }
    //审核通过
    offpass = (id) => {
        let offLineExamine = {
            id: id,
            status: 2
        }
        API.task_line_examine(offLineExamine).then(res => {
            if (res.success == true) {
                this.offLineTask(this.state.pageNo)
            }
        })
    }
    //审核不通过
    offunpass = (id) => {
        let offLineExamine = {
            id: id,
            status: 3
        }
        API.task_line_examine(offLineExamine).then(res => {
            if (res.success == true) {
                this.offLineTask(this.state.pageNo)
            }
        })
    }

    //分页
    onChangePages = (page) => {
        this.setState({
            current: page,
            pageNo: page,
        });
        this.offLineTask(page)

    }

    //时间选择框
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

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

            let time = `${year}-${checked(month)}-${checked(day)}${checked(hours)}:${checked(minutes)}:${checked(second)}`;
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

            let time = `${year}-${checked(month)}-${checked(day)}${checked(hours)}:${checked(minutes)}:${checked(second)}`;
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

    //点击小图变大
    bigImg(imgSrc) {
        $(".bigImg-box").addClass("bigImg-show")
        $(".bigImg-box .bigImg").attr({src: imgSrc})
    }

    closeBigImg = () => {
        $(".bigImg-box").removeClass("bigImg-show")
    }

    render() {
        const {startValue, endValue, endOpen} = this.state;
        if (localStorage.lan === "chinese") {
            columns = [
                {
                    title: '所属任务',
                    dataIndex: 'taskName',
                    width: 200
                },
                {
                    title: '所属品牌',
                    dataIndex: 'brandName',
                    width: 200
                },
                {
                    title: '举报人',
                    dataIndex: 'userName',
                    width: 200
                },
                {
                    title: '举报类别',
                    dataIndex: 'goodsType',
                    width: 150
                },
                {
                    title: '举报地址',
                    dataIndex: 'address',
                    width: 300
                },
                {
                    title: '详细地址',
                    dataIndex: 'detailAddress',
                    width: 300
                },
                {
                    title: '举报时间',
                    dataIndex: 'reportTime',
                    width: 300

                },
                {
                    title: '现场照片',
                    dataIndex: 'mainPics',
                    width: 400,
                    render: (text, record) => {
                        let bb = "";
                        if (record.mainPics != undefined && record.mainPics.length > 0) {
                            let aa = record.mainPics.split(",");
                            bb = aa.map((v, i) => (
                                <img src={v} key={v} className='imgs_off' href="#" onClick={() => this.bigImg(v)}/>
                            ))
                        } else {
                            bb = <span>没有缩略图</span>
                        }
                        return bb;
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    width: 200

                },
                {
                    title: '备注',
                    dataIndex: 'note',
                    width: 200

                },
                {
                    title: '假冒品牌',
                    dataIndex: 'brand',
                    width: 200

                },
                {
                    title: '操作',
                    dataIndex: 'opreation',
                    width: 280,
                    render: (text, record) => {
                        let aa = "";
                        if (record.status === '待审核') {
                            aa = <ul className="offline_buttons">
                                <Button type="" className="offline_lis lines"
                                        onClick={() => this.offpass(record.id)}>{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</Button>
                                <Button type="" className="offline_lis nolines"
                                        onClick={() => this.offunpass(record.id)}>{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</Button>
                            </ul>
                        }
                        return aa;
                    },

                }];
        } else {
            columns = [
                {
                    title: 'Task Name',
                    dataIndex: 'taskName',
                    width: 200
                },
                {
                    title: 'Brand',
                    dataIndex: 'brandName',
                    width: 200
                },
                {
                    title: 'Tipster',
                    dataIndex: 'userName',
                    width: 200
                },
                {
                    title: 'Category',
                    dataIndex: 'goodsType',
                    width: 150
                },
                {
                    title: 'Location',
                    dataIndex: 'address',
                    width: 300
                },
                {
                    title: 'Address',
                    dataIndex: 'detailAddress',
                    width: 300
                },
                {
                    title: 'Time',
                    dataIndex: 'reportTime',
                    width: 300

                },
                {
                    title: 'PIC',
                    dataIndex: 'mainPics',
                    width: 400,
                    render: (text, record) => {
                        let bb = "";
                        if (record.mainPics != undefined && record.mainPics.length > 0) {
                            let aa = record.mainPics.split(",");
                            bb = aa.map((v, i) => (
                                <img src={v} key={v} className='imgs_off' href="#" onClick={() => this.bigImg(v)}/>
                            ))
                        } else {
                            bb = <span>没有缩略图</span>
                        }
                        return bb;
                    }
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    width: 200,
                    render: (text, record) => {
                        if (record.status === '待审核') {
                            return (<div>Pending</div>)
                        } else if (record.status === '通过') {
                            return (<div>Pass</div>)
                        } else if (record.status === '不通过') {
                            return (<div>Fail</div>)
                        }

                    }

                },
                {
                    title: 'Remark',
                    dataIndex: 'note',
                    width: 200

                },
                {
                    title: 'Brand',
                    dataIndex: 'brand',
                    width: 200

                },
                {
                    title: 'Operate',
                    dataIndex: 'opreation',
                    width: 280,
                    render: (text, record) => {
                        let aa = "";
                        if (record.status === '待审核') {
                            aa = <ul className="offline_buttons">
                                <Button type="" className="offline_lis lines"
                                        onClick={() => this.offpass(record.id)}>{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</Button>
                                <Button type="" className="offline_lis nolines"
                                        onClick={() => this.offunpass(record.id)}>{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</Button>
                            </ul>
                        }
                        return aa;
                    },

                }];
        }

        return (
            <div>
                <div className="search">
                    <div>
                        <Form>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "所属任务" : "Task Name"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.task}
                                       value={this.state.taskName}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "举报人" : "Tipster"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.taskpepole}
                                       value={this.state.userName}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "所在地点" : "Location"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.address}
                                       value={this.state.address}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "状态" : "Status"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    value={this.state.status || ''}
                                    optionFilterProp="children"
                                    onChange={this.status}
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
                                       className="user_names">{localStorage.lan === "chinese" ? "作业时间" : "Time"}
                                    ：</label>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style={{width: '130px'}}
                                    value={startValue}
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
                                    style={{width: '130px', marginLeft: 10}}
                                    onChange={this.onEndChange}

                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                            <Button type="primary" className="buttons"
                                    onClick={this.searchCon}>{localStorage.lan === "chinese" ? "搜索" : "Search"}</Button>
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
                        <div className="bigImg-box">
                            <img className="bigImg" src="" alt="图片路径错误"/>
                            <span className="close_big" onClick={this.closeBigImg}><img src={btn} alt=""/></span>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
Offlinetask.contextTypes = {
    permission:PropTypes.array
}
export default Offlinetask;