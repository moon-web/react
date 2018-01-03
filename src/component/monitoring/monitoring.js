//监测数据首页
import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import {Button, Table, Pagination, Breadcrumb, Layout, Input, Form, Checkbox, Radio, DatePicker} from 'antd';
import {Select, message} from 'antd';
import $ from 'jquery';
import API from '../../api/index'
import PropTypes from 'prop-types'

const Option = Select.Option;
const RadioGroup = Radio.Group;
const {Header, Content} = Layout;
const CheckboxGroup = Checkbox.Group;
const plainOptions = [{label: '淘宝', value: '1'}, {label: '天猫', value: '2'}, {
    label: '1688',
    value: '3'
}, {label: 'alibaba', value: '4'}, {label: 'Aliexpress', value: '5'}, {label: 'Jdong', value: '6'}, {
    label: '一号店',
    value: '7'
}, {label: '唯品会', value: '8'}, {label: '当当网', value: '9'}, {label: '慧聪', value: '10'}]
const defaultCheckedList = ['1'];
var columns;
let addSize = 0;
let fanxuan = 0;
let selectUserId = [];
var monitorMode = '';
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        selectUserId = []
        for (let i = 0; i < selectedRows.length; i++) {
            selectUserId.push(selectedRows[i].monitorId)
        }
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
    }),
};

class Montioring extends Component {
    constructor() {
        super();
        this.state = {
            userName: '',
            brand: '',
            urlType: '',
            urlAddress: '',
            urlGoodAddress: '',
            type: '',
            data: [],
            datanew: [],
            other: '',
            current: 1,//当前页数
            pageNo: 1,// 页面号  默认1
            pageSize: 15,// 每页页面大小  默认20
            records: 0,//总条数
            user: '',// 用户名称
            monitorName: '',// 监控名称
            ownedBrand: '',// 所属品牌
            monitorMode: '',// 监控模式   (1:单次定时任务，2：循环定时任务，3：手动监控)
            monitorStatus: '',// 监控状态 (1:已完成,2:进行中)
            startTime: '', //监控开始时间,
            checkedList: defaultCheckedList,
            addMonitorMode: '1',
            monitorType: '1',
            indeterminate: true,
            checkAll: false,
            keyword: '',
            minPrice: '',
            maxPrice: '',
            ConsignmentPlace: '',
            judgeKeyword: '',
            judgeMinPrice: '',
            judgeMaxPrice: '',
            judgeConsignmentPlace: '',
            monitorNames: '',
            startValue: null,
            monitorId: '',
            rules: [],
            addfanxuan: [],
            bb: [],
            brandName: '',
            monitorId: '',
            xqs: [],
            testUrl: '',
            startValue: null,
            endValue: null,
            endOpen: false,
            endTime: '',
            judgeKey: '',
            bTag: true,
            fLag: true,
            loading: true
        }
        this.brand_active = this.brand_active.bind(this);
        this.active_add = this.active_add.bind(this);
        this.finshed = this.finshed.bind(this);
        this.gk = this.gk.bind(this);
        this.onRowClick = this.onRowClick.bind(this)
    }

    //监控规则列表
    data_watch_list = (page) => {
        this.setState({loading: true})
        let userId = localStorage.getItem("userId")
        let dataWatchData = {
            pageNo: page,
            pageSize: this.state.pageSize,
            monitorName: this.state.monitorName,
            ownedBrand: this.state.ownedBrand,
            monitorMode: this.state.monitorMode,
            monitorStatus: this.state.monitorStatus,
            startTime: this.state.startTime,
            user: userId
        }
        API.data_watch(dataWatchData).then(res => {
            if (res.success === true) {
                let data = [];
                let monitorStatus = null;
                let monitorMode = null;
                if (res.result && res.result.length > 0) {
                    for (let i = 0; i < res.result.length; i++) {
                        if (res.result[i].monitorStatus === 1) {
                            monitorStatus = '已完成'
                        }
                        if (res.result[i].monitorStatus === 2) {
                            monitorStatus = '进行中'
                        }
                        if (res.result[i].monitorMode === 1) {
                            monitorMode = '单次监控'
                        }
                        if (res.result[i].monitorMode === 2) {
                            monitorMode = '定时任务'
                        }
                        if (res.result[i].monitorMode === 3) {
                            monitorMode = '手动任务'
                        }
                        data.push({
                            key: i,
                            monitorId: res.result[i].monitorId,
                            brandName: res.result[i].brandName,
                            monitorName: res.result[i].monitorName,
                            monitorMode: monitorMode,
                            ownedBrand: res.result[i].ownedBrand,
                            monitorStartTime: res.result[i].monitorStartTime,
                            monitorStatus: monitorStatus,
                            audied: res.result[i].audied,
                            unaudi: res.result[i].unaudi
                        })
                    }
                    this.setState({
                        data: data,
                        records: res.records,
                        loading: false
                    })
                }
            }
        })
    }

    componentDidMount() {
        this.data_watch_list(this.state.pageNo);

        //新增监控规则  所属品牌
        API.brand().then(res => {
            if (res.success === true) {
                this.setState({bb: res.result})
            }
        })
    }
    componentDidUpdate() {
        //权限菜单
        let permission = this.context.permission;
        if(permission) {
            permission.forEach(v => {
                if (v.permValue === 'data') {
                    v.children.forEach(item => {
                        if (item.permValue === 'data/rule') {
                            $('.qiyong').attr({disabled: "disabled"})
                            if (item.children) {
                                item.children.forEach(list => {
                                    if (list.permValue === '3') {
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

    onChangeCkeckBox = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
            checkAll: checkedList.length === plainOptions.length,
        });
    }
    onCheckAllChange = (e) => {
        let aa = [];
        plainOptions.map(function (v) {
            aa.push(v.value)
        })
        this.setState({
            checkedList: e.target.checked ? aa : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }
    onChangeUserName = (e) => {
        this.setState({userName: e.target.value});
    }
    selecthandleChange = (value) => {
        this.setState({brand: value})

    }
    //商品或者url
    onChangeaa = (e) => {
        this.setState({testUrl: e.target.value})
    }
    onChangeUrl = (e) => {
        this.setState({urlAddress: encodeURIComponent(this.state.testUrl)})
    }
    onChangeGUrl = (value) => {
        this.setState({urlType: value})
    }

    //监控任务搜索
    getControlId = (e) => {
        this.setState({monitorId: e.target.value});
    }
    getControlName = (e) => {
        this.setState({monitorName: e.target.value});
    }
    onChangeMonitorStatus = (value) => {
        this.setState({monitorStatus: value});
    }
    onChangeMonitorMode = (value) => {
        this.setState({monitorMode: value});
    }
    //重置
    resetting = () => {
        this.setState({
            monitorId: '',
            monitorName: '',
            monitorStatus: '',
            monitorMode: '',
            startValue: '',
            endValue: '',
            startTime: '',
            endTime: ''
        })
    }
    //分页函数
    onChangePage = (page) => {
        this.setState({
            pageNo: page,
            current: page,
        })
        this.data_watch_list(page)
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

    //搜索
    searchCon = (e) => {
        this.data_watch_list(this.state.pageNo)
    }
    //新增手动监控
    addWatch = (e) => {
        if (this.state.bTag) {
            let time = new Date().getTime();
            let url = null;
            if (this.state.urlType == 1) {
                url = this.state.urlAddress
            }
            if (this.state.urlType == 2) {
                url = this.state.urlAddress
            }
            if (!this.state.brand) {
                message.warning("请重新选择所属品牌！")
            } else if (!this.state.urlType) {
                message.warning("请重新选择链接地址！")
            } else {
                let userId = localStorage.getItem("userId")
                let dataWatchManualRole = {
                    monitorId: time,//监控任务ID___入库时间戳
                    user: userId,
                    monitorName: this.state.userName,//监控任务名称
                    ownedBrand: this.state.brand,//所属品牌
                    urlType: this.state.urlType,//监控任务类型 1,商品url  2，店铺url
                    url: url,//具体url
                    monitorMode: this.state.monitorMode, //监控任务模式 1:单次任务，2：循环任务
                }
                API.data_watch_manual_role(dataWatchManualRole).then(res => {
                    if (res.success == true) {
                        message.success('监控成功！');
                        $(".flex_Add_task").addClass("active_add_s");
                        this.setState({
                            userName: '',
                            brand: '',
                            urlType: '',
                            testUrl: '',
                            bTag: false,
                            pageNo: 1
                        })
                        this.data_watch_list(this.state.pageNo)
                    } else {
                        message.error('新增监控任务失败!');
                    }
                })
            }
        }
    }

    getNewConName = (e) => {
        this.setState({monitorName: e.target.value})
    }
    onChangeconName = (e) => {
        this.setState({monitorNames: encodeURIComponent(this.state.monitorName)})
    }
    getNewBrand = (value) => {
        this.setState({ownedBrand: value})
    }
    selectSingal = (e) => {
        this.setState({
            addMonitorMode: e.target.value,
        });
    }
    fangshi = (e) => {
        this.setState({
            monitorType: e.target.value,
        });
    }
    addNewConKey = (e) => {
        this.setState({keyword: e.target.value})
    }
    addNewConKeys = (e) => {
        this.setState({keyword: encodeURIComponent(e.target.value)})
    }
    addNewConMinPrice = (e) => {
        this.setState({minPrice: e.target.value})
    }
    addNewConMinPrices = (e) => {
        this.setState({minPrice: encodeURIComponent(this.state.minPrice)})
    }
    addNewConMaxPrice = (e) => {
        this.setState({maxPrice: e.target.value})
    }
    addNewConMaxPrices = (e) => {
        this.setState({maxPrice: encodeURIComponent(this.state.maxPrice)})
    }
    addNewConMinPlace = (e) => {
        this.setState({ConsignmentPlace: e.target.value})
    }
    addNewConMinPlace = (e) => {
        this.setState({ConsignmentPlace: encodeURIComponent(this.state.ConsignmentPlace)})
    }
    addKeyWorld = (e) => {
        this.setState({judgeKey: e.target.value})
    }
    addKeyWorlds = (e) => {
        this.setState({judgeKeyword: encodeURIComponent(this.state.judgeKey)})
    }
    addMinPrice = (e) => {
        this.setState({judgeMinPrice: e.target.value})
    }
    addMinPrices = (e) => {
        this.setState({judgeMinPrice: encodeURIComponent(this.state.judgeMinPrice)})
    }
    addMaxPrice = (e) => {
        this.setState({judgeMaxPrice: e.target.value})
    }
    addMaxPrices = (e) => {
        this.setState({judgeMaxPrice: encodeURIComponent(this.state.judgeMaxPrice)})
    }

    // 新增反选监控
    Reverseselection = (e) => {
        this.setState({keyword: e.target.value})
    }
    fanxuanpricemin = (e) => {
        this.setState({minPrice: encodeURIComponent(e.target.value)})
    }
    fanxuanmax = (e) => {
        this.setState({maxPrice: encodeURIComponent(e.target.value)})
    }
    addfanxuanaddress = (e) => {
        this.setState({ConsignmentPlace: encodeURIComponent(e.target.value)})
    }

    //新增监控
    newAddWatch = (e) => {
        if (this.state.fLag) {
            if (this.state.monitorNames === '' || this.state.monitorNames === undefined) {
                message.warning('请输入监控名称')
                return false
            }
            if (this.state.ownedBrand === '' || this.state.ownedBrand === undefined) {
                message.warning('请选择监控品牌')
                return false
            }
            var monitorConditions = [];
            for (var i = 0; i <= addSize; i++) {
                var gjc = encodeURIComponent(document.getElementById("gjz" + i).value);
                if (gjc) {
                    var minPrice, maxPrice, ConsignmentPlace;
                    minPrice = encodeURIComponent(document.getElementById("minPrice" + i).value);
                    maxPrice = encodeURIComponent(document.getElementById("maxPrice" + i).value);
                    ConsignmentPlace = encodeURIComponent(document.getElementById("address" + i).value);
                    monitorConditions.push({
                        "keyword": gjc,
                        "minPrice": minPrice,
                        "maxPrice": maxPrice,
                        "ConsignmentPlace": ConsignmentPlace
                    });
                }
            }
            var exceptionalCondition = [];
            for (var i = 0; i <= fanxuan; i++) {
                var fx = encodeURIComponent(document.getElementById("fx" + i).value);
                if (fx) {
                    var fxminPrice, fxmaxPrice, fxConsignmentPlace;
                    fxminPrice = encodeURIComponent(document.getElementById("fxminPrice" + i).value);
                    fxmaxPrice = encodeURIComponent(document.getElementById("fxmaxPrice" + i).value);
                    fxConsignmentPlace = encodeURIComponent(document.getElementById("fxaddress" + i).value);
                    exceptionalCondition.push({
                        "keyword": fx,
                        "minPrice": fxminPrice,
                        "maxPrice": fxmaxPrice,
                        "ConsignmentPlace": fxConsignmentPlace
                    })
                }
            }
            let userId = localStorage.getItem("userId")
            let time = new Date().getTime();
            let data = {
                monitorId: time,
                monitorName: this.state.monitorNames,
                user: userId,
                ownedBrand: this.state.ownedBrand,
                monitorMode: this.state.addMonitorMode,
                monitorType: this.state.monitorType,
                monitorPlatforms: this.state.checkedList,
                monitorConditions: monitorConditions,
                judgeKeyword: this.state.judgeKeyword,
                judgeMinPrice: this.state.judgeMinPrice,
                judgeMaxPrice: this.state.judgeMaxPrice,
                judgeConsignmentPlace: this.state.judgeConsignmentPlace,
                exceptionalCondition: exceptionalCondition
            }
            fetch('http://118.89.197.95/ipcommune/monitor/newCycleMonitor?json=' + JSON.stringify(data), {
                method: 'GET',
            }).then(res => res.json())
                .then(res => {
                    if (res.success == true) {
                        message.success(res.msg)
                        this.setState({
                            fLag: false
                        })
                        $(".flex_monitoring").addClass("brand_active");
                        this.data_watch_list(this.state.pageNo)
                    } else {
                        message.error(res.msg)
                    }
                })
        }
    }

    brand_active() {
        $(".flex_monitoring").removeClass("brand_active");
    }

    active_add() {
        this.setState({
            userName: '',
            brand: '',
            urlType: '',
            testUrl: '',
            url: '',
            user: '',
        })
        $(".flex_Add_task").removeClass("active_add_s");
    }

    onRowClick(record, text) {
        if (text === '定时任务' || text === '单次监控') {
            $("#zidong").removeClass("active_add_xq");
            let c = record;
            fetch('http://118.89.197.95/ipcommune/monitor/queryMonitorDetailsById?monitorId=' + c, {
                method: 'GET'
            }).then(res => res.json())
                .then(res => {
                    let monitorPlatforms = null;
                    let monitorMode = null;
                    let monitorPlat = [];
                    let monitormond = '';
                    for (let i = 0; i < res.result[0].monitorPlatforms.length; i++) {
                        if (res.result[0].monitorPlatforms[i] === 1) {
                            monitorPlatforms = '淘宝'
                        }
                        if (res.result[0].monitorPlatforms[i] === 2) {
                            monitorPlatforms = '天猫'
                        }
                        if (res.result[0].monitorPlatforms[i] === 3) {
                            monitorPlatforms = '1688'
                        }
                        if (res.result[0].monitorPlatforms[i] === 4) {
                            monitorPlatforms = 'Alibaba'
                        }
                        if (res.result[0].monitorPlatforms[i] === 5) {
                            monitorPlatforms = 'Aliexpress'
                        }
                        if (res.result[0].monitorPlatforms[i] === 6) {
                            monitorPlatforms = '京东'
                        }
                        if (res.result[0].monitorPlatforms[i] === 7) {
                            monitorPlatforms = '一号店'
                        }
                        if (res.result[0].monitorPlatforms[i] === 8) {
                            monitorPlatforms = '唯品会'
                        }
                        if (res.result[0].monitorPlatforms[i] === 9) {
                            monitorPlatforms = '当当网'
                        }
                        if (res.result[0].monitorPlatforms[i] === 10) {
                            monitorPlatforms = '慧聪网'
                        }
                        if (res.result[0].monitorPlatforms[i] === 11) {
                            monitorPlatforms = '未知来源'
                        }

                        monitorPlat.push(monitorPlatforms)
                    }
                    if (res.result[0].monitorMode === "1") {
                        res.monitorMode = '单次监控'
                    }
                    if (res.result[0].monitorMode === '2') {
                        res.monitorMode = '定时任务'
                    }
                    if (res.result[0].monitorMode === '3') {
                        res.monitorMode = '手动任务'
                    }
                    res.result.push(monitorPlat)
                    res.result.push(monitormond)
                    this.setState({xqs: res.result, datas: res.monitorMode, datanew: res.result[0]})

                })
        } else if (text === '手动任务') {
            $("#shoudong").removeClass("active_add_xq");
            let c = record;
            fetch('http://118.89.197.95/ipcommune/monitor/queryMonitorDetailsById?monitorId=' + c, {
                method: 'GET'
            }).then(res => res.json())
                .then(res => {
                    this.setState({xqs: res.result[0]})
                })
        }
    }

    //取消手动监控
    conIndex() {
        $(".flex_monitoring").addClass("brand_active");
    }

    active_Index() {
        $(".flex_Add_task").addClass("active_add_s");
    }

    qxbutton() {
        $(".xq").addClass("active_add_xq");
    }

    //完成
    finshed() {
        let dataWatchFinish = {
            monitorId: selectUserId,
            monitorStatus: 1
        }
        API.data_watch_finish(dataWatchFinish).then(res => {
            if (res.success == true) {
                message.success(res.msg);
                this.data_watch_list(this.state.pageNo)
            } else {
                message.error(res.msg);
            }
        })
    }

    //添加反选监控条件
    addchoiceRules = () => {
        fanxuan++;
        let fx = <div className="flex_monitoring_content_list" style={{marginTop: '20px'}}>
            <div className="flex_monitoring_content_list_msg">
                {localStorage.lan === "chinese" ? "排除条件" : "Exclusive Condition"}
                {/*<span className='flex_monitoring_content_list_msgspan'>ANTI MONITORING CONDITIONS</span>*/}
            </div>
            <div className="flex_monitoring_content_list_from">
                <Form>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "关键字" : "Keyword"}
                            ：</label>
                        <Input id={"fx" + fanxuan} size="small" placeholder="" className="flex_monitoring_size"
                               onChange={this.Reverseselection} onBlur={this.Reverseselection}/>
                    </div>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_left flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "价格" : "Price Range"}
                            ：</label>
                        <input id={"fxminPrice" + fanxuan} className="flex_moinitoring_inputs"
                               onChange={this.fanxuanpricemin} onBlur={this.fanxuanpricemin}/><span
                        className='flex_span'> &nbsp;
                        - &nbsp; </span><input id={"fxmaxPrice" + fanxuan} className="flex_moinitoring_inputs"
                                               style={{marginLeft: '0px'}}
                                               onChange={this.fanxuanmax} onBlur={this.fanxuanmax}/>
                    </div>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "发货地" : "Shipping Address"}
                            ：</label>
                        <Input id={"fxaddress" + fanxuan} size="small" placeholder="" className="flex_monitoring_size"
                               onChange={this.addfanxuanaddress} onBlur={this.addfanxuanaddress}/>
                    </div>
                </Form>
            </div>
        </div>;
        let addfxrules = this.state.addfanxuan;
        let fanxuanze = addfxrules.length + 1
        addfxrules.push({key: fanxuanze, fx});
        this.setState({
            addfanxuan: addfxrules
        })
    }

    //添加监控条件
    addRules = () => {
        addSize++;
        let rule = <div className="flex_monitoring_content_list">
            <div className="flex_monitoring_content_list_msg">
                {localStorage.lan === "chinese" ? "监控条件" : "Monitoring Requirements"}
                {/*<span className='flex_monitoring_content_list_msgspan'>MONITORING CONDITION ONE</span>*/}
            </div>
            <div className="flex_monitoring_content_list_from">
                <Form>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "关键字" : "Keyword"}
                            ：</label>
                        <Input id={"gjz" + addSize} size="small" placeholder="" className="flex_monitoring_size"
                               onChange={this.addNewConKey} onBlur={this.addNewConKeys}/>
                    </div>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_left flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "价格" : "Price Range"}
                            ：</label>
                        <input id={"minPrice" + addSize} className="flex_moinitoring_inputs"
                               onChange={this.addNewConMinPrice} onBlur={this.addNewConMinPrice}/><span
                        className='flex_span'> &nbsp;
                        - &nbsp; </span>
                        <input id={"maxPrice" + addSize} className="flex_moinitoring_inputs" style={{marginLeft: '0px'}}
                               onChange={this.addNewConMaxPrice} onBlur={this.addNewConMaxPrices}/>
                    </div>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "发货地" : "Shipping Address"}
                            ：</label>
                        <Input id={"address" + addSize} size="small" placeholder="" className="flex_monitoring_size"
                               onChange={this.addNewConMinPlace} onBlur={this.addNewConMinPlace}/>
                    </div>
                </Form>
            </div>
        </div>;
        let rules = this.state.rules;
        let rulesLength = rules.length + 1
        rules.push({key: rulesLength, rule});
        this.setState({
            rules: rules
        })
    }

    gk = (e) => {
        $("#jkContent").parents('.ant-tabs-tabpane').removeClass("ant-tabs-tabpane-active").addClass("ant-tabs-tabpane-inactive");
    }

    //跳转界面
    render() {
        var bb = '';
        if (this.state.xqs[1]) {
            let aa = this.state.xqs[1];
            for (let i = 0; i < aa.length; i++) {
                bb += aa[i] + ','
            }
            bb = bb.substr(0, bb.length - 1)
        }

        //反选详情显示
        var fanxuandetails;
        var fanxuandata = this.state.datanew.exceptionalCondition;
        if (fanxuandata) {
            fanxuandetails = fanxuandata.map((v, i) => (
                <div className="Rule_information Rule_information_style">
                    <div
                        class="flex_monitoring_content_list_msg">{localStorage.lan === "chinese" ? "排除条件" : "Exclusive Condition"}
                        {/*<span class="flex_monitoring_content_list_msgspan">ANTI MONITORING CONDITIONS</span>*/}
                    </div>
                    <ul className="Rule_ul rule_uls_ll">
                        <li className="Rule_lis">
                            <span>{localStorage.lan === "chinese" ? "关键字" : "Keyword"}:</span>
                            <input type="text" className="inf_iputs" value={v.keyword}/>
                        </li>
                        <li className="Rule_lis">
                            <span>{localStorage.lan === "chinese" ? "价格" : "Price Range"}:</span>
                            <div className="Ru">{v.minPrice}</div>
                            <div className="Ru_ru">-</div>
                            <div className="Ru" style={{marginLeft: '0px'}}>{v.maxPrice}</div>
                        </li>
                        <li className="Rule_lis">
                            <span>{localStorage.lan === "chinese" ? "发货地" : "Shipping Address"}:</span>
                            <input type="text" className="inf_iputs" value={v.consignmentPlace}/>
                        </li>
                    </ul>
                </div>
            ))
        }


        var Ru_inf;
        var URL;
        var dataJson = this.state.datanew.monitorConditions;
        const {startValue, endValue} = this.state;
        if (this.state.datanew.urlType == '1') {
            URL = <li className="Rule_lis xxs">
                <span>{localStorage.lan === "chinese" ? "商品链接" : "Product URL"}:</span>
                <a href={this.state.datanew.url} target="_blank" className="splj">{this.state.datanew.url}</a>
            </li>
        } else if (this.state.datanew.urlType == '2') {
            URL = <li className="Rule_lis xxs">
                <span>{localStorage.lan === "chinese" ? "店铺链接" : "Shop URL"}:</span>
                <a href={this.state.datanew.url} target="_blank" className="splj">{this.state.datanew.url}</a>
            </li>
        }
        if (dataJson) {
            Ru_inf = dataJson.map((v, i) => (
                <div className="Rule_information Rule_information_style">
                    <div
                        class="flex_monitoring_content_list_msg">{localStorage.lan === "chinese" ? "监控条件" : "Monitoring Requirements"}
                        {/*<span class="flex_monitoring_content_list_msgspan">MOINITORING REQUIREMENTS</span>*/}
                    </div>
                    <ul className="Rule_ul rule_uls_ll">
                        <li className="Rule_lis">
                            <span>{localStorage.lan === "chinese" ? "关键字" : "Keyword"}:</span>
                            <input type="text" className="inf_iputs" value={v.keyword}/>
                        </li>
                        <li className="Rule_lis">
                            <span>{localStorage.lan === "chinese" ? "价格" : "Price Range"}:</span>
                            <div className="Ru">{v.minPrice}</div>
                            <div className="Ru_ru">-</div>
                            <div className="Ru" style={{marginLeft: '0px'}}>{v.maxPrice}</div>
                        </li>
                        <li className="Rule_lis">
                            <span>{localStorage.lan === "chinese" ? "发货地" : "Shipping Address"}:</span>
                            <input type="text" className="inf_iputs" value={v.consignmentPlace}/>
                        </li>
                    </ul>
                </div>
            ))
        }
        let rule = <div className="flex_monitoring_content_list">
            <div className="flex_monitoring_content_list_msg">
                {localStorage.lan === "chinese" ? "监控条件" : "Monitoring Requirements"}
                {/*<span className='flex_monitoring_content_list_msgspan'>MONITORING CONDITION ONE</span>*/}
            </div>
            <div className="flex_monitoring_content_list_from">
                <Form>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "关键字" : "Keyword"}
                            ：</label>
                        <Input id="gjz0" size="small" placeholder="" className="flex_monitoring_size"
                               onChange={this.addNewConKey} onBlur={this.addNewConKeys}/>
                    </div>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_left flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "价格" : "Price Range"}
                            ：</label>
                        <input id="minPrice0" className="flex_moinitoring_inputs"
                               onChange={this.addNewConMinPrice} onBlur={this.addNewConMinPrices}/><span
                        className='flex_span'> &nbsp;
                        - &nbsp; </span><input id="maxPrice0" className="flex_moinitoring_inputs"
                                               style={{marginLeft: '0px'}}
                                               onChange={this.addNewConMaxPrice} onBlur={this.addNewConMaxPrices}/>
                    </div>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "发货地" : "Shipping Address"}
                            ：</label>
                        <Input id="address0" size="small" placeholder="" className="flex_monitoring_size"
                               onChange={this.addNewConMinPlace} onBlur={this.addNewConMinPlaces}/>
                    </div>
                </Form>
            </div>
        </div>;

        let rules = this.state.rules;
        let rulesLength = rules.length + 1
        if (!rules.length) {
            rules.push({key: rulesLength, rule});
        }
        let rulelist = rules.map((v, i) => (
            v.rule
        ))
        let fx = <div className="flex_monitoring_content_list" style={{marginTop: '20px'}}>
            <div className="flex_monitoring_content_list_msg">
                {localStorage.lan === "chinese" ? "排除条件" : "Exclusive Condition"}
                {/*<span className='flex_monitoring_content_list_msgspan'>ANTI MONITORING CONDITIONS</span>*/}
            </div>
            <div className="flex_monitoring_content_list_from">
                <Form>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "关键字" : "Keyword"}
                            ：</label>
                        <Input id="fx0" size="small" placeholder="" className="flex_monitoring_size"
                               onChange={this.Reverseselection} onBlur={this.Reverseselection}/>
                    </div>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_left flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "价格" : "Price Range"}
                            ：</label>
                        <input id={"fxminPrice" + fanxuan} className="flex_moinitoring_inputs"
                               onChange={this.fanxuanpricemin} onBlur={this.fanxuanpricemin}/><span
                        className='flex_span'> &nbsp;
                        - &nbsp; </span><input id={"fxmaxPrice" + fanxuan} className="flex_moinitoring_inputs"
                                               style={{marginLeft: '0px'}}
                                               onChange={this.fanxuanmax} onBlur={this.fanxuanmax}/>
                    </div>
                    <div className="flex_monitoring_list_from_lab flex_monitoring_lab_top">
                        <label htmlFor=""
                               className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "发货地" : "Shipping Address"}
                            ：</label>
                        <Input id={"fxaddress" + fanxuan} size="small" placeholder="" className="flex_monitoring_size"
                               onChange={this.addfanxuanaddress} onBlur={this.addfanxuanaddress}/>
                    </div>
                </Form>
            </div>
        </div>;
        let fxchoice = this.state.addfanxuan;
        let fxlength = fxchoice.length + 1
        if (!fxchoice.length) {
            fxchoice.push({key: fxlength, fx})
        }
        let rulelists = fxchoice.map((v, i) => (
            v.fx
        ))

        const {userName, brand, urlType} = this.state;
        if (localStorage.lan === 'chinese') {
            columns = [{
                title: '规则ID',
                dataIndex: 'monitorId',
                width: 200,
            }, {
                title: '规则名称',
                dataIndex: 'monitorName',
                width: 200,
                render: (text, record) => {
                    return (<div className="unaudiots"
                                 onClick={() => this.onRowClick(record.monitorId, record.monitorMode)}>{record.monitorName}</div>)
                }
            }, {
                title: '监控类型',
                dataIndex: 'monitorMode',
                width: 200
            }, {
                title: '所属品牌',
                dataIndex: 'brandName',
                width: 200
            }, {
                title: '开始时间',
                dataIndex: 'monitorStartTime',
                width: 200
            }, {
                title: '监控状态',
                dataIndex: 'monitorStatus',
                width: 200,
            },
                {
                    title: '已审核',
                    dataIndex: 'audied',
                    width: 200,
                    render: (text, record) => {
                        return (<div className="unaudiots">{record.audied}</div>)
                    }
                },
                {
                    title: '待审核',
                    dataIndex: 'unaudi',
                    width: 200,
                    render: (text, record) => {
                        return (<div className="unaudiots" onClick={this.gk}>{record.unaudi}</div>)
                    }

                }];
        } else {
            columns = [{
                title: 'Rule ID',
                dataIndex: 'monitorId',
                width: 200,
            }, {
                title: 'Rule Name',
                dataIndex: 'monitorName',
                width: 200,
                render: (text, record) => {
                    return (<div className="unaudiots"
                                 onClick={() => this.onRowClick(record.monitorId, record.monitorMode)}>{record.monitorName}</div>)
                }
            }, {
                title: 'Monitoring Type',
                dataIndex: 'monitorMode',
                width: 200,
                render: (text, record) => {
                    if (record.monitorMode === '单次监控') {
                        return (<div>Single</div>)
                    } else if (record.monitorMode === '定时任务') {
                        return (<div>Timing</div>)
                    } else if (record.monitorMode === '手动任务') {
                        return (<div>Manual</div>)
                    }
                }
            }, {
                title: 'Brand',
                dataIndex: 'brandName',
                width: 200
            }, {
                title: 'Starting Time',
                dataIndex: 'monitorStartTime',
                width: 200
            }, {
                title: 'Monitoring Status',
                dataIndex: 'monitorStatus',
                width: 200,
                render: (text, record) => {
                    if (record.monitorStatus === '进行中') {
                        return (<div>Running</div>)
                    } else if (record.monitorStatus === '已完成') {
                        return (<div>Done</div>)
                    }
                }
            },
                {
                    title: 'Finished',
                    dataIndex: 'audied',
                    width: 200,
                    render: (text, record) => {
                        return (<div className="unaudiots">{record.audied}</div>)
                    }
                },
                {
                    title: 'Pending',
                    dataIndex: 'unaudi',
                    width: 200,
                    render: (text, record) => {
                        return (<div className="unaudiots" onClick={this.gk}>{record.unaudi}</div>)
                    }

                }];
        }
        return (
            <Content>
                <div>
                    <div className="search">
                        <div>
                            <Form>
                                <div className="userlist">
                                    <label htmlFor=""
                                           className="user_names">{localStorage.lan === "chinese" ? "规则ID" : "Rule ID"}
                                        ：</label>
                                    <input type="text" className="inputstyle" onChange={this.getControlId}
                                           value={this.state.monitorId}/>
                                </div>
                                <div className="userlist">
                                    <label htmlFor=""
                                           className="user_names">{localStorage.lan === "chinese" ? "规则名称" : "Rule Name"}
                                        ：</label>
                                    <input type="text" className="inputstyle" onChange={this.getControlName}
                                           value={this.state.monitorName}/>
                                </div>
                                <div className="userlist">
                                    <label htmlFor=""
                                           className="user_names">{localStorage.lan === "chinese" ? "规则状态" : "Rule Status"}
                                        ：</label>
                                    <Select
                                        showSearch
                                        style={{width: 130}}
                                        value={this.state.monitorStatus || '0'}
                                        optionFilterProp="children"
                                        onChange={this.onChangeMonitorStatus}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option value="0">{localStorage.lan === "chinese" ? "全部" : "All"} </Option>
                                        <Option value="2">{localStorage.lan === "chinese" ? "运行中" : "Runing"} </Option>
                                        <Option value="1">{localStorage.lan === "chinese" ? "已完成" : "Done"} </Option>
                                    </Select>
                                </div>
                                <div className="userlist">
                                    <label htmlFor="" style={{width: '104px'}}
                                           className="user_names">{localStorage.lan === "chinese" ? "开始时间" : "Starting Time"}
                                        ：</label>
                                    {/*<input type="text" className="inputstyle"  onChange={this.getControlStartTime}/>*/}
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
                                        style={{width: '127px', marginLeft: 10}}
                                        onChange={this.onEndChange}
                                        onOpenChange={this.handleEndOpenChange}
                                    />
                                </div>
                                <div className="userlist">
                                    <label htmlFor="" style={{width: '104px'}}
                                           className="user_names">{localStorage.lan === "chinese" ? "监控类型" : "Monitoring Type"}
                                        ：</label>
                                    <Select
                                        showSearch
                                        style={{width: 130}}
                                        value={this.state.monitorMode || '0'}
                                        optionFilterProp="children"
                                        onChange={this.onChangeMonitorMode}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option value="0">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                        <Option
                                            value="1">{localStorage.lan === "chinese" ? "单次定时任务" : "Single"}</Option>
                                        <Option
                                            value="2">{localStorage.lan === "chinese" ? "循环定时任务" : "Timing"}</Option>
                                        <Option value="3">{localStorage.lan === "chinese" ? "手动监控" : "Manual"}</Option>
                                    </Select>
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
                                    onClick={this.brand_active}>{localStorage.lan === "chinese" ? "新增监控规则" : "Create Monitoring Rule"}</Button>
                            <Button type="primary" className="qiyong"
                                    onClick={this.active_add}>{localStorage.lan === "chinese" ? "新增手动规则" : "Create Manual Rule"}</Button>
                            <Button type="primary" className="qiyong"
                                    onClick={this.finshed}>{localStorage.lan === "chinese" ? "完成" : "Finished"}</Button>
                        </div>
                        <div>
                            <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} bordered
                                   pagination={false} loading={this.state.loading}/>
                            <div className='pagina'>
                                <Pagination current={this.state.current} onChange={this.onChangePage}
                                            total={this.state.records} pageSize={15}/>
                            </div>
                        </div>
                    </div>
                    <div className="flex_monitoring brand_active flex_tiaozheng watch-box buju">
                        <Header className="flex_task_header">
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item
                                    onClick={this.conIndex}>{localStorage.lan === "chinese" ? "监控规则管理" : "Monitoring Rlue Management"}</Breadcrumb.Item>
                                <Breadcrumb.Item>{localStorage.lan === "chinese" ? "新增监控规则" : "Create Monitoring Rule"}</Breadcrumb.Item>
                            </Breadcrumb>
                        </Header>
                        <div className="flex_monitoring_content">
                            <div className="flex_monitoring_content_list htm">
                                <div className="flex_monitoring_content_list_msg">
                                    {localStorage.lan === "chinese" ? "规则信息" : "Rule Information"}
                                    {/*<span className='flex_monitoring_content_list_msgspan'>MONITORING INFORMATION</span>*/}
                                </div>
                                <div className="flex_monitoring_content_list_from">
                                    <Form>
                                        <div className="flex_monitoring_list_from_lab">
                                            <label htmlFor=""
                                                   className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "规则名称" : "Rule Name"}
                                                ：</label>
                                            <Input size="small" placeholder="" className="flex_monitoring_size"
                                                   onBlur={this.onChangeconName}
                                                   onChange={this.getNewConName}/>
                                        </div>
                                        <div className="flex_monitoring_list_from_lab flex_monitoring_left">
                                            <label htmlFor=""
                                                   className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "所属品牌" : "Brand"}
                                                ：</label>
                                            <Select defaultValue="" style={{width: 315, height: 18, lineHeight: 18}}
                                                    onChange={this.getNewBrand}>
                                                {
                                                    this.state.bb.map(v => (
                                                        <Option value={v.id}>{v.name}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </div>
                                        <div className="flex_monitoring_list_from_lab left_lab">
                                            <label htmlFor=""
                                                   className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "监控平台" : "Monitoring Platform"}
                                                ：</label>
                                            <div className="flex_monitoring_lab_checkbox">
                                                <div style={{borderBottom: '1px solid #E9E9E9'}}>
                                                    <Checkbox
                                                        indeterminate={this.state.indeterminate}
                                                        onChange={this.onCheckAllChange}
                                                        checked={this.state.checkAll}
                                                    >
                                                        {localStorage.lan === "chinese" ? "全选" : "All"}
                                                    </Checkbox>
                                                </div>
                                                <CheckboxGroup options={plainOptions} onChange={this.onChangeCkeckBox}
                                                               value={this.state.checkedList}/>
                                            </div>
                                        </div>
                                        <div className="flex_monitoring_list_from_lab left_lab">
                                            <label htmlFor=""
                                                   className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "监控方式" : "Monitoring Mode"}
                                                ：</label>
                                            <div className="flex_monitoring_lab_checkbox">
                                                <RadioGroup name="radiogroup" defaultValue={1}
                                                            onChange={this.selectSingal}>
                                                    <Radio
                                                        value={1}>{localStorage.lan === "chinese" ? "仅执行一次" : "仅执行一次"}</Radio>
                                                    <Radio
                                                        value={2}>{localStorage.lan === "chinese" ? "每日执行" : "每日执行"}</Radio>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                        <div className="flex_monitoring_list_from_lab left_lab">
                                            <label htmlFor=""
                                                   className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "监控代理类型" : "Monitoring Mode"}
                                                ：</label>
                                            <div className="flex_monitoring_lab_checkbox">
                                                <RadioGroup name="radiogroup" defaultValue={1}
                                                            onChange={this.fangshi}>
                                                    <Radio
                                                        value={1}>{localStorage.lan === "chinese" ? "vps" : "vps"}</Radio>
                                                    <Radio
                                                        value={0}>{localStorage.lan === "chinese" ? "手机分发" : "手机分发"}</Radio>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                            {rulelist}
                            <a herf="#">
                                <div className="flex_monitoring_list_from_add" onClick={this.addRules}>
                                    + {localStorage.lan === "chinese" ? "添加监控条件" : "Add Requirements"}
                                </div>
                            </a>

                            {rulelists}
                            <a herf="#">
                                <div className="flex_monitoring_list_from_add" onClick={this.addchoiceRules}>
                                    + {localStorage.lan === "chinese" ? "添加排除条件" : "Add Exclusive Condition"}
                                </div>
                            </a>

                            <div
                                className="flex_monitoring_content_list flex_monitoring_lab_top flex_monitoring_height">
                                <div className="flex_monitoring_content_list_msg">
                                    {localStorage.lan === "chinese" ? "判断条件" : "Judgement Condition"}
                                    {/*<span className='flex_monitoring_content_list_msgspan'>ANALYZING CONDITION</span>*/}
                                </div>
                                <div className="flex_monitoring_content_list_from">
                                    <Form>
                                        <div className="flex_monitoring_list_from_lab flex_monitoring_lab_top">
                                            <label htmlFor=""
                                                   className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "关键字" : "Keyword"}
                                                ：</label>
                                            <Input size="small" placeholder="" className="flex_monitoring_size"
                                                   onBlur={this.addKeyWorlds}
                                                   onChange={this.addKeyWorld}/>
                                        </div>
                                        <div
                                            className="flex_monitoring_list_from_lab flex_monitoring_left flex_monitoring_lab_top">
                                            <label htmlFor=""
                                                   className="flex_monitoring_lab_name">{localStorage.lan === "chinese" ? "价格" : "Price Range"}
                                                ：</label>
                                            <input className="flex_moinitoring_inputs" onBlur={this.addMinPrices}
                                                   onChange={this.addMinPrice}/><span className="flex_span"> &nbsp;
                                            - &nbsp; </span><input className="flex_moinitoring_inputs"
                                                                   style={{marginLeft: '0px'}}
                                                                   onChange={this.addMaxPrice}
                                                                   onBlur={this.addMaxPrices}/>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                            <ul className="flex_morings_buttons">
                                <Button type="" className="flex_task_center_list_top_buttons_lis"
                                        onClick={this.newAddWatch}>{localStorage.lan === "chinese" ? "开始监控" : "Start"}</Button>
                                <Button type="" className="flex_task_center_list_top_buttons_lis green"
                                        onClick={this.conIndex}>{localStorage.lan === "chinese" ? "取消" : "Cancle"}</Button>
                            </ul>

                        </div>
                    </div>
                    <div className="flex_nbsp">
                    </div>
                    <div className="flex_Add_task active_add_s">
                        <div className="flex_Add_content">
                            <div className="flex_Add_content_list">
                                <div className='flex_task_center'>
                                    <div className='flex_task_center_list top'>
                                        <label htmlFor="" style={{width: '104px'}}
                                               className="user_names flex_task_type">{localStorage.lan === "chinese" ? "规则名称" : "Rule Name"}
                                            ：</label>
                                        <Input size="small" placeholder=""
                                               className='flex_brand_small flex_task_width box_wdth'
                                               value={userName}
                                               style={{width: '315px!important'}}
                                               onChange={this.onChangeUserName}/>
                                    </div>
                                    <div className='flex_task_center_list top'>
                                        <label htmlFor="" style={{width: '104px'}}
                                               className="user_names flex_task_type">{localStorage.lan === "chinese" ? "所属品牌" : "Brand"}
                                            ：</label>
                                        <Select defaultValue="" value={brand}
                                                style={{width: 315, height: 18, lineHeight: 18}}
                                                onChange={this.selecthandleChange}>
                                            {
                                                this.state.bb.map(v => (
                                                    <Option value={v.id}>{v.name}</Option>
                                                ))
                                            }
                                        </Select>
                                    </div>
                                    <div className='flex_task_center_list top'>
                                        <label htmlFor="" style={{width: '104px'}}
                                               className="user_names flex_task_type">{localStorage.lan === "chinese" ? "链接地址" : "Product URL"}
                                            ：</label>
                                        <Select defaultValue="" value={urlType}
                                                style={{width: 315, height: 18, lineHeight: 18}}
                                                onChange={this.onChangeGUrl}>
                                            {/*<Option
                                                value="0">{localStorage.lan === "chinese" ? "请选择" : "Place Chose"}</Option>*/}
                                            <Option
                                                value="1">{localStorage.lan === "chinese" ? "商品链接" : "Product URL"}</Option>
                                            <Option
                                                value="2">{localStorage.lan === "chinese" ? "店铺链接" : "Shop URL"}</Option>
                                        </Select>
                                    </div>
                                    <div className='flex_task_center_list flex_task_center_list_top top'>
                                        <label htmlFor="" style={{width: '104px'}}
                                               className="user_names flex_task_type">{localStorage.lan === "chinese" ? "输入链接" : "Shop URL"}
                                            ：</label>
                                        <textarea className="flex_task_textarea" name='2' value={this.state.testUrl}
                                                  onChange={this.onChangeaa}
                                                  onBlur={this.onChangeUrl}
                                        >
                                          </textarea>
                                    </div>
                                    <ul className="flex_task_center_list_top_buttons">
                                        <li className='flex_task_center_list_top_buttons_lis flex_task_center_list_top_buttons_left'
                                            onClick={this.addWatch}>{localStorage.lan === "chinese" ? "添加" : "Add"}</li>
                                        <li className='flex_task_center_list_top_buttons_lis gray flex_task_center_list_top_buttons_left'
                                            onClick={this.active_Index}>{localStorage.lan === "chinese" ? "取消" : "Fail"}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xq active_add_xq  zidongguize" id="zidong">
                        <Header className="flex_task_header" style={{marginTop: '-30px'}}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item
                                    onClick={this.qxbutton}>{localStorage.lan === "chinese" ? "规则名称" : "Rule Name"}</Breadcrumb.Item>
                                <Breadcrumb.Item>{localStorage.lan === "chinese" ? "单次监控" : "Single monitoring"}</Breadcrumb.Item>
                            </Breadcrumb>
                        </Header>
                        <div className="xqxx zidongstyle" id="zidong">
                            <div className="Rule_information Rule_information_style">
                                <div
                                    className="flex_monitoring_content_list_msg">{localStorage.lan === "chinese" ? "规则信息" : "Rule Information"}
                                    {/*<span className="flex_monitoring_content_list_msgspan">MONITORINGINFORMATION</span>*/}
                                </div>
                                <ul className="Rule_ul  rule_uls_ll">
                                    <li className="Rule_lis">
                                        <span>{localStorage.lan === "chinese" ? "规则名称" : "Rule Name"}:</span>
                                        <input type="text" className="inf_iputs"
                                               value={this.state.datanew.monitorName}/>
                                    </li>
                                    <li className="Rule_lis">
                                        <span>{localStorage.lan === "chinese" ? "所属品牌" : "Brand"}:</span>
                                        <input type="text" className="inf_iputs" value={this.state.datanew.ownedBrand}/>
                                    </li>
                                    <li className="Rule_lis">
                                        <span>{localStorage.lan === "chinese" ? "监控平台" : "Monitoring platform"}:</span>
                                        <input type="text" className="inf_iputs" value={bb}/>
                                    </li>
                                    <li className="Rule_lis">
                                        <span>{localStorage.lan === "chinese" ? "监控方式" : "Monitoring mode"}:</span>
                                        <input type="text" className="inf_iputs" value={this.state.datas}/>
                                    </li>
                                </ul>
                            </div>
                            {Ru_inf}
                            {fanxuandetails}
                            <div className="Rule_information Rule_information_style">
                                <div className="flex_monitoring_content_list_msg">判断条件<span
                                    className="flex_monitoring_content_list_msgspan">JUDGEMENT CONDITION</span></div>
                                <ul className="Rule_ul rule_uls_ll">
                                    <li className="Rule_lis">
                                        <span>{localStorage.lan === "chinese" ? "关键字" : "Keyword"}:</span>
                                        <h2>{this.state.datanew.judgeKeyword}</h2>
                                    </li>
                                    <li className="Rule_lis">
                                        <span>{localStorage.lan === "chinese" ? "价格" : "Price Range"}:</span>
                                        <div className="Ru">{this.state.datanew.judgeMinPrice}</div>
                                        <div className="Ru_ru">-</div>
                                        <div className="Ru"
                                             style={{marginLeft: '0px'}}>{this.state.datanew.judgeMaxPrice}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xq active_add_xq zidongguize" id="shoudong">
                        <Header className="flex_task_header" style={{marginTop: '-30px'}}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item
                                    onClick={this.qxbutton}>{localStorage.lan === "chinese" ? "规则名称" : "Rule Name"}</Breadcrumb.Item>
                                <Breadcrumb.Item>{localStorage.lan === "chinese" ? "手动监控" : "Manual"}</Breadcrumb.Item>
                            </Breadcrumb>
                        </Header>
                        <div className="xqxx zidongstyle" id="zidong">
                            <div className="Rule_information Rule_information_style">
                                <div className="flex_monitoring_content_list_msg">手动监控<span
                                    className="flex_monitoring_content_list_msgspan">MANUAL</span></div>
                                <ul className="Rule_ul rule_uls_ll">
                                    <li className="Rule_lis xxs">
                                        <span>{localStorage.lan === "chinese" ? "规则名称" : "Rule Name"}:</span>
                                        <h2>{this.state.datanew.monitorName}</h2>
                                    </li>
                                    <li className="Rule_lis xxs">
                                        <span>{localStorage.lan === "chinese" ? "所属品牌" : "Brand"}:</span>
                                        <h2>{this.state.datanew.ownedBrand}</h2>
                                    </li>
                                    {URL}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </Content>

        )
    }
}

Montioring.contextTypes = {
    permission: PropTypes.array
}
export default Montioring;