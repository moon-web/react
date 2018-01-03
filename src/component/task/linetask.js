//作业任务管理  线上任务
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
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
    }),
};

class Linetask extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            pageNo: 1,// 页面号  默认1
            pageSize: 15,// 每页页面大小  默认20
            user: '',// 用户名称
            taskName: '',
            userName: '',
            platformType: '',
            goodsLink: '',
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
            brand: '',
            startTime: '',
            endTime: '',
            loading:true
        }
    }
    //线上举报任务列表
    onLineTask = (page) => {
        this.setState({loading:true})
        let userId = localStorage.getItem("userId");
        if (userId === '1') {
            userId = ''
        }
        let onLineTask = {
            type: 1,
            pageNo: page,
            pageSize: this.state.pageSize,
            taskName: this.state.taskName,
            userName: this.state.userName,
            platformType: this.state.platformType,
            status: this.state.status,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            brandUserId: userId,
        }
        API.task_line(onLineTask).then(res => {
            let data = [];
            let platformType = null;
            let status = null;
            if(res.success === true) {
                if (res.result && res.result.length > 0) {
                    for (let i = 0; i < res.result.length; i++) {
                        if (res.result[i].platformType === 1) {
                            platformType = '淘宝'
                        }
                        if (res.result[i].platformType === 2) {
                            platformType = '天猫'
                        }
                        if (res.result[i].platformType === 3) {
                            platformType = '京东'
                        }
                        if (res.result[i].platformType === 4) {
                            platformType = 'alibaba'
                        }
                        if (res.result[i].platformType === 5) {
                            platformType = 'Aliexpress'
                        }
                        if (res.result[i].platformType === 6) {
                            platformType = '京东'
                        }
                        if (res.result[i].platformType === 7) {
                            platformType = '一号店'
                        }
                        if (res.result[i].platformType === 8) {
                            platformType = '唯品会'
                        }
                        if (res.result[i].platformType === 9) {
                            platformType = '当当网'
                        }
                        if (res.result[i].platformType === 10) {
                            platformType = '慧聪'
                        }
                        if (res.result[i].platformType === 11) {
                            platformType = '未知来源'
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
                            brandName: res.result[i].brandName,
                            taskName: res.result[i].taskName,
                            userName: res.result[i].userName,
                            platformType: platformType,
                            brand: res.result[i].brand,
                            goodsLink: res.result[i].goodsLink,
                            reportTime: res.result[i].reportTime,
                            mainPics: res.result[i].mainPics,
                            status: status,
                            note: res.result[i].note
                        })
                    }
                    this.setState({data: data, records: res.records,loading:false})
                }
            }
        })
    }
    componentDidMount() {
        this.onLineTask(this.state.pageNo)
    }

    componentDidUpdate() {
        //权限菜单
        let permission = this.context.permission;
        permission.forEach(v => {
            if (v.permValue === 'report') {
                v.children.forEach(item => {
                    if (item.permValue === 'report/online') {
                        $('.lines').attr({disabled: "disabled"})
                        $('.lines').addClass('feiwu');
                        $('.nolines').attr({disabled: "disabled"})
                        $('.nolines').addClass('feiwu');
                        $('.qiyong').attr({disabled: "disabled"})
                        if (item.children) {
                            item.children.forEach(list => {
                                if (list.permValue === 'report/online/check') {
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
    //审核通过
    linepass(id) {

        let taskOnlineExamine = {
            id:id,
            status:2
        }
        API.task_line_examine(taskOnlineExamine).then(res => {
                if (res.success == true) {
                    this.onLineTask(this.state.pageNo)
                }
            })
    }

    lineunpass(id) {
        let taskOnlineExamine = {
            id:id,
            status:3
        }
        API.task_line_examine(taskOnlineExamine).then(res => {
            if (res.success == true) {
                this.onLineTask(this.state.pageNo)
            }
        })
    }

    //批量审核不通过
    notsuc = () => {
        let data = selectUserId.join(',');
        let taskOnlineExamine = {
            id:data,
            status:2
        }
        API.task_line_examine(taskOnlineExamine).then(res => {
            if (res.success == true) {
                this.onLineTask(this.state.pageNo)
            }
        })
    }
    suc = () => {
        let data = selectUserId.join(',');
        let taskOnlineExamine = {
            id:data,
            status:3
        }
        API.task_line_examine(taskOnlineExamine).then(res => {
            if (res.success == true) {
                this.onLineTask(this.state.pageNo)
            }
        })
    }

    linetask = (e) => {
        this.setState({taskName: e.target.value});
    }

    linetaskpepole = (e) => {
        this.setState({userName: e.target.value});
    }

    linegoodlist = (value) => {
        this.setState({platformType: value});
    }

    linestatus = (value) => {
        this.setState({status: value});
    }
//重置
    resetting = () => {
        this.setState({
            taskName: '',
            userName: '',
            platformType: '',
            status: '',
            startValue: '',
            endValue: '',
            startTime: '',
            endTime: ''
        })
    }
    //搜索
    linesearchCon = (e) => {
        this.onLineTask(this.state.pageNo)
    }

    //分页
    onChangePages = (page) => {
        this.setState({
            current: page,
            pageNo: page,
        });
        this.onLineTask(page)

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
                    title: '任务名称',
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
                    title: '举报平台',
                    dataIndex: 'platformType',
                    width: 150
                },
                {
                    title: '商品链接',
                    dataIndex: 'goodsLink',
                    width: 500,
                    render: (text, record) => {
                        return (<a href={record.goodsLink} target="_blank" className="unaudiots">{record.goodsLink}</a>)
                    }
                },
                {
                    title: '举报时间',
                    dataIndex: 'reportTime',
                    width: 200

                },
                {
                    title: '缩略图',
                    dataIndex: 'mainPics',
                    width: 200,
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
                        if (record.status && record.status === '待审核') {
                            aa = <ul className="offline_buttons">
                                <Button type="" className="offline_lis lines"
                                        onClick={() => this.linepass(record.id)}>{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</Button>
                                <Button type="" className="offline_lis nolines"
                                        onClick={() => this.lineunpass(record.id)}>{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</Button>
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
                    title: 'Platform',
                    dataIndex: 'platformType',
                    width: 150,
                    render: (text, record) => {
                        if (record.platformType === '淘宝') {
                            return (<div>Taobao</div>)
                        } else if (record.platformType === '天猫') {
                            return (<div>Tmall</div>)
                        } else if (record.platformType === '1688') {
                            return (<div>1688</div>)
                        } else if (record.platformType === 'alibaba') {
                            return (<div>alibaba</div>)
                        } else if (record.platformType === 'Aliexpress') {
                            return (<div>Aliexpress</div>)
                        } else if (record.platformType === '京东') {
                            return (<div>Jdong</div>)
                        } else if (record.platformType === '一号店') {
                            return (<div>YHD.com</div>)
                        } else if (record.platformType === '唯品会') {
                            return (<div>vip.com</div>)
                        } else if (record.platformType === '当当网') {
                            return (<div>dangdang.com</div>)
                        } else if (record.platformType === '慧聪') {
                            return (<div>Hc360.Com</div>)
                        } else if (record.platformType === '未知来源') {
                            return (<div>Unknown Source</div>)
                        }

                    }
                },
                {
                    title: 'Product Link',
                    dataIndex: 'goodsLink',
                    width: 500,
                    render: (text, record) => {
                        return (<a href={record.goodsLink} target="_blank" className="unaudiots">{record.goodsLink}</a>)
                    }
                },
                {
                    title: 'Time',
                    dataIndex: 'reportTime',
                    width: 200

                },
                {
                    title: 'PIC',
                    dataIndex: 'mainPics',
                    width: 200,
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
                        if (record.status && record.status === '待审核') {
                            aa = <ul className="offline_buttons">
                                <Button type="" className="offline_lis lines"
                                        onClick={() => this.linepass(record.id)}>{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</Button>
                                <Button type="" className="offline_lis nolines"
                                        onClick={() => this.lineunpass(record.id)}>{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</Button>
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
                                <input type="text" className="inputstyle" onChange={this.linetask}
                                       value={this.state.taskName}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "举报人" : "Tipster"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.linetaskpepole}
                                       value={this.state.userName}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '108px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "所在平台" : "Platform"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    value={this.state.platformType || '0'}
                                    optionFilterProp="children"
                                    onChange={this.linegoodlist}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="0">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                    <Option value="1">{localStorage.lan === "chinese" ? "淘宝" : "Taobao"}</Option>
                                    <Option value="2">{localStorage.lan === "chinese" ? "天猫" : "Tmall"}</Option>
                                    <Option value="3">{localStorage.lan === "chinese" ? "1688" : "1688"}</Option>
                                    <Option value="4">{localStorage.lan === "chinese" ? "alibaba" : "alibaba"}</Option>
                                    <Option
                                        value="5">{localStorage.lan === "chinese" ? "Aliexpress" : "Aliexpress"}</Option>
                                    <Option value="6">{localStorage.lan === "chinese" ? "京东" : "Jdong"}</Option>
                                    <Option value="7">{localStorage.lan === "chinese" ? "一号店" : "YHD.com"}</Option>
                                    <Option value="8">{localStorage.lan === "chinese" ? "唯品会" : "vip.com"}</Option>
                                    <Option value="9">{localStorage.lan === "chinese" ? "当当网" : "dangdang.com"}</Option>
                                    <Option value="10">{localStorage.lan === "chinese" ? "慧聪网" : "Hc360.Com"}</Option>
                                    <Option
                                        value="11">{localStorage.lan === "chinese" ? "未知来源" : "Unknown Source"}</Option>
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
                                    onChange={this.linestatus}
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
                                    value={startValue}
                                    placeholder="Start"
                                    style={{width: '130px'}}
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
                                    onClick={this.linesearchCon}>{localStorage.lan === "chinese" ? "搜索" : "Search"}</Button>
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

Linetask.contextTypes = {
    permission:PropTypes.array
}
export default Linetask;