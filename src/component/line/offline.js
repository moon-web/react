//线下举报管理
import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import {Button, Table, Pagination, Form, message, Select, DatePicker} from 'antd';
import $ from 'jquery'
import btn from '../../assets/images/btn.png'
import API from '../../api/index'
import PropTypes from 'prop-types'
const Option = Select.Option;
let selectUserId = [];
var Brandcolumns;
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        selectUserId = [];
        for (let i = 0; i < selectedRows.length; i++) {
            selectUserId.push(selectedRows[i].id);
        }
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
    }),
};

class OffLine extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            pageNo: 1,// 页面号  默认1
            pageSize: 15,// 每页页面大小  默认20
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
            isButton: false,
            startTime: '',
            endTime: '',
            loading:true
        }
    }
    //线下举报列表
    offLine = (page) => {
        this.setState({loading:true})
        let offLineData = {
            pageNo: page,
            pageSize: this.state.pageSize,
            userName: this.state.userName,
            goodsType: this.state.goodsType,
            status: this.state.status,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            type: 2
        }
        API.line(offLineData).then(res => {
            if (res.success == true) {
                if (res.result && res.result.length > 0) {
                    let data = [];
                    let goodsType = null;
                    let status = null;
                    for (let i = 0; i < res.result.length; i++) {
                        if (res.result[i].goodsType === 1) {
                            goodsType = '服饰箱包'
                        }
                        if (res.result[i].goodsType === 2) {
                            goodsType = '日化百货'
                        }
                        if (res.result[i].goodsType === 3) {
                            goodsType = '运动书籍'
                        }
                        if (res.result[i].goodsType === 4) {
                            goodsType = '家装电器'
                        }
                        if (res.result[i].goodsType === 5) {
                            goodsType = '其他'
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
                            note: res.result[i].note,
                            key: i
                        })
                    }
                    this.setState({data: data, records: res.records,loading:false})
                }
            }
        })
    }
    componentDidMount() {
        this.offLine(this.state.pageNo)
    }

    componentDidUpdate() {
        //权限菜单
        let permission = this.context.permission;
        if(permission) {
            permission.forEach(v => {
                if (v.permValue === 'xiansuo') {
                    v.children.forEach(item => {
                        if (item.permValue === 'xiansuo/down') {
                            $('.lines').attr({disabled: "disabled"})
                            $('.lines').addClass('feiwu');
                            $('.nolines').attr({disabled: "disabled"})
                            $('.nolines').addClass('feiwu');
                            $('.qiyong').attr({disabled: "disabled"})
                            if (item.children) {
                                item.children.forEach(list => {
                                    if (list.permValue === 'xiansuo/down/3') {
                                        $('.qiyong').attr({disabled: null})
                                        $('.lines').attr({disabled: null})
                                        $('.lines').removeClass('feiwu');
                                        $('.nolines').attr({disabled: null})
                                        $('.nolines').removeClass('feiwu');
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }

    //审核通过
    opass(id) {
        let offLineReportData = {
            id: id,
            status: 2
        }
        API.line_report(offLineReportData).then(res => {
            if (res.success == true) {
                this.offLine(this.state.pageNo)
            }
        })
    }

    //审核不通过
    ounpass(id) {
        let offLineReportData = {
            id: id,
            status: 3
        }
        API.line_report(offLineReportData).then(res => {
            if (res.success == true) {
                this.offLine(this.state.pageNo)
            }
        })
    }

    //分页
    onChangePages = (page) => {
        this.setState({
            current: page,
            pageNo: page,
        });
        this.offLine(page)
    }

    reportpersonal = (e) => {
        this.setState({userName: e.target.value});
    }
    reportplatformType = (value) => {
        this.setState({goodsType: value});
    }
    reportstatus = (value) => {
        this.setState({status: value});
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

    //点击小图变大
    bigImg(imgSrc) {
        $(".bigImg-box").addClass("bigImg-show")
        $(".bigImg-box .bigImg").attr({src: imgSrc})
    }

    closeBigImg = () => {
        $(".bigImg-box").removeClass("bigImg-show")
    }
    //搜索
    reportsearch = (e) => {
        this.offLine(this.state.pageNo)
    }

    //批量审核不通过
    notsuc = () => {
        let data = selectUserId.join(',');
        let offLineReportData = {
            id: data,
            status: 3
        }
        API.line_report(offLineReportData).then(res => {
            if (res.success == true) {
                this.offLine(this.state.pageNo)
            }
        })
    }
    //批量审核通过
    suc = () => {
        let data = selectUserId.join(',');
        let offLineReportData = {
            id: data,
            status: 2
        }
        API.line_report(offLineReportData).then(res => {
            if (res.success == true) {
                this.offLine(this.state.pageNo)
            }
        })
    }
    //重置
    resetting = () => {
        this.setState({
            status: '0',
            userName: '',
            goodsType: '0',
            startValue: '',
            endValue: '',
            startTime: '',
            endTime: ''
        })
    }

    render() {
        const {startValue, endValue, endOpen} = this.state;
        if (localStorage.lan === "chinese") {
            Brandcolumns = [
                {
                    title: '举报人',
                    dataIndex: 'userName' || 'userMobile',
                    width: 200
                },
                {
                    title: '举报类别',
                    dataIndex: 'goodsType',
                    width: 200
                },
                {
                    title: '举报地址',
                    dataIndex: 'address',
                    width: 300
                },
                {
                    title: '详细地点',
                    dataIndex: 'detailAddress',
                    width: 300
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
                                <img src={v} key={i} className='imgs_off' href="#" onClick={() => this.bigImg(v)}/>
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
                    width: 400
                },
                {
                    title: '假冒品牌',
                    dataIndex: 'brand',
                    width: 400

                },

                {
                    title: '操作',
                    dataIndex: 'opreation',
                    width: 200,
                    render: (text, record) => {
                        let aa = ''
                        if (record.status && record.status === "待审核") {
                            aa = <ul className="offline_buttons">
                                <Button type="" id="offline_lis" className="qiyong offline_lis lines"
                                        onClick={() => this.opass(record.id)}>{localStorage.lan === "chinese" ? "通过" : "Pass"}</Button>
                                <Button type="" id="offline_lis" className="qiyong offline_lis nolines"
                                        onClick={() => this.ounpass(record.id)}>{localStorage.lan === "chinese" ? "不通过" : "Fail"}</Button>
                            </ul>
                        }
                        return aa;
                    }
                }];

        } else {
            Brandcolumns = [
                {
                    title: 'Tipster',
                    dataIndex: 'userName' || 'userMobile',
                    width: 200
                },
                {
                    title: 'Category',
                    dataIndex: 'goodsType',
                    width: 200,
                    render: (text, record) => {
                        if (record.goodsType === '日化百货') {
                            return (<div>Daily Chemicals& General Merchandise</div>)
                        } else if (record.goodsType === '服装箱包') {
                            return (<div>Clothing</div>)
                        } else if (record.goodsType === '运动书籍') {
                            return (<div>Sports&Books</div>)
                        } else if (record.goodsType === '家装电器') {
                            return (<div>Electrical Appliances&Home Decoration</div>)
                        } else if (record.goodsType === '其他') {
                            return (<div>Others</div>)
                        }

                    }
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
                                <img src={v} key={i} className='imgs_off' href="#" onClick={() => this.bigImg(v)}/>
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
                    width: 400
                },
                {
                    title: 'Brand',
                    dataIndex: 'brand',
                    width: 400

                },

                {
                    title: 'Operate',
                    dataIndex: 'opreation',
                    width: 200,
                    render: (text, record) => {
                        let aa = ''
                        if (record.status && record.status === "待审核") {
                            aa = <ul className="offline_buttons">
                                <Button type="" id="offline_lis" className="qiyong offline_lis lines"
                                        onClick={() => this.opass(record.id)}>{localStorage.lan === "chinese" ? "通过" : "Pass"}</Button>
                                <Button type="" id="offline_lis" className="qiyong offline_lis nolines"
                                        onClick={() => this.ounpass(record.id)}>{localStorage.lan === "chinese" ? "不通过" : "Fail"}</Button>
                            </ul>
                        }
                        return aa;
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
                                       className="user_names">{localStorage.lan === "chinese" ? "举报人" : "Tipster"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.reportpersonal}
                                       value={this.state.userName}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor=""
                                       className="user_names">{localStorage.lan === "chinese" ? "举报类别" : "Category"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    value={this.state.goodsType || '0'}
                                    optionFilterProp="children"
                                    onChange={this.reportplatformType}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="0">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                    <Option
                                        value="1">{localStorage.lan === "chinese" ? "服装箱包" : "Clothing&Bags"}</Option>
                                    <Option
                                        value="2">{localStorage.lan === "chinese" ? "日化百货" : "Daily Chemicals& General Merchandise"}</Option>
                                    <Option
                                        value="3">{localStorage.lan === "chinese" ? "运动书籍" : "Sports&Books"}</Option>
                                    <Option
                                        value="4">{localStorage.lan === "chinese" ? "家装电器" : "Electrical Appliances&Home Decoration"}</Option>
                                    <Option value="5">{localStorage.lan === "chinese" ? "其他" : "Others"}</Option>
                                </Select>
                            </div>
                            <div className="userlist">
                                <label htmlFor=""
                                       className="user_names">{localStorage.lan === "chinese" ? "状态" : "Status"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    value={this.state.status || '0'}
                                    optionFilterProp="children"
                                    onChange={this.reportstatus}
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
                                       className="user_names">{localStorage.lan === "chinese" ? "举报时间" : "Time"}
                                    ：</label>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={startValue}
                                    placeholder="Start"
                                    id='Start'
                                    style={{width: '130px'}}
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={endValue}
                                    id="End"
                                    placeholder="End"
                                    style={{width: '130px', marginLeft: 10}}
                                    onChange={this.onEndChange}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                            <Button type="primary" className="buttons"
                                    onClick={this.reportsearch}>{localStorage.lan === "chinese" ? "搜索" : "Search"}</Button>
                            <Button type="primary" className="buttons"
                                    onClick={this.resetting}>{localStorage.lan === "chinese" ? "重置" : "Resetting"}</Button>
                        </Form>
                    </div>
                </div>
                <div className="tables_list big-imgPosition">
                    <div className="tables_choice">
                        <Button type="primary" className="qiyong"
                                onClick={this.suc}>{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</Button>
                        <Button type="primary" className="qiyong no"
                                onClick={this.notsuc}>{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</Button>
                    </div>
                    <div>
                        <Table rowSelection={rowSelection} columns={Brandcolumns} dataSource={this.state.data} bordered
                               pagination={false} loading={this.state.loading}/>
                        <div className='pagina'>
                            <Pagination current={this.state.current} onChange={this.onChangePages}
                                        total={this.state.records} pageSize={15}/>
                        </div>
                    </div>
                    <div className="bigImg-box">
                        <img className="bigImg" src="" alt="图片路径错误"/>
                        <span className="close_big" onClick={this.closeBigImg}><img src={btn} alt=""/></span>
                    </div>
                </div>
            </div>

        )
    }
}
OffLine.contextTypes = {
    permission:PropTypes.array
}
export default OffLine;