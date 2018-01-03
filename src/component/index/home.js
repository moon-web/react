//主页
import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import {Link} from 'react-router-dom';
import {TabsRow} from 'antd';
import report from '../../assets/images/1.png';
import Release from '../../assets/images/2.png';
import AddMonitor from '../../assets/images/3.png';
import Monitor from '../../assets/images/4.png';
import img_echarts from '../../assets/images/img_echarts.png'
import $ from 'jquery';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
//引入折线图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import API from '../../api/index'
import PropTypes from 'prop-types'

var btns = ''
var aaa = "";
var userIds = localStorage.getItem("userId")

class EChart extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            isButton: "",
            xiansuo: ''
        }
    }

    componentDidMount() {
        //平台数据监控统计
        let id = localStorage.getItem("userId");
        let noticePlantform = {
            user: id
        }
        API.notice_plantform(noticePlantform).then(res => {
            if (res.success === true) {
                if (res.result && res.result.length > 0) {
                    this.setState({data: res.result})
                }
            }
        })
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('row'));
        // 绘制图表

        myChart.setOption({
            title: {

                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'center',
                data: ['淘宝', '天猫', '天猫国际', '1688', 'AE', '京东', '1号店', '苏宁易购', '唯品会', '当当', '慧聪网']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 969, name: '淘宝'},
                        {value: 99, name: '天猫'},
                        {value: 99, name: '天猫国际'},
                        {value: 99, name: '1688'},
                        {value: 6, name: 'AE'},
                        {value: 6, name: '京东'},
                        {value: 6, name: '1号店'},
                        {value: 234, name: '苏宁易购'},
                        {value: 6, name: '唯品会'},
                        {value: 30, name: '当当'},
                        {value: 414, name: '慧聪网'}
                    ],
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                //首先定义一个数组
                                var colorList = [
                                    '#919191', '#dad9bb', '#bbbcb7', '#f4e5ea', '#ffb3d1',
                                    '#e4e4e4', '#a9d73a', '#bee4b1'
                                ];
                                return colorList[params.dataIndex]
                            },
                            //以下为是否显示
                            label: {
                                show: true,
                                textStyle: {
                                    fontWeight: 'bolder',
                                    fontSize: '12',
                                    color: '#bbbcb7'
                                },
                                position: 'top'
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, .5)'
                        }
                    },
                }
            ]
        })
    }

    render() {
        return (
            <div className="echarts_style echarts_styles">
                <div className="echarts">
                    <div id="row" style={{width: 220, height: 160,}}></div>
                </div>
            </div>
        )
    }
}

class EchartsTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            num: []
        }
    }

    componentDidMount() {
        let id = localStorage.getItem("userId");
        let noticePlantform = {
            user: id
        }
        API.notice_plantform(noticePlantform).then(res => {
            if (res) {
                let arr = [], nums = [];
                for (let i = 0; i < res.result.length; i++) {
                    this.setState({data: res.result[i].name})
                    arr.push(this.state.data)
                    this.setState({num: res.result[i].count})
                    nums.push(this.state.num)
                    // 基于准备好的dom，
                    var myChart = echarts.init(document.getElementById('main'));
                    // 绘制图表

                    myChart.setOption({
                        title: {

                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#56b0a1'
                                }
                            }
                        },
                        legend: {
                            data: arr
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                axisLabel: {
                                    interval: 0
                                },
                                boundaryGap: false,
                                data: arr
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '爬虫数据监控',
                                type: 'line',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                areaStyle: {normal: {}},
                                data: nums
                            }
                        ],
                        axisLabel: {
                            interval: 0
                        },
                    })

                }
            }
        })
    }

    render() {
        return (
            <div className="echarts_style">
                <div className="echarts">
                    <div id="main" style={{width: 300, height: 210,}}></div>
                </div>
            </div>
        );
    }
}

class Admincontent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            locale: props.locale
        }
    }

    componentDidMount(props) {
        //消息通知
        let id = localStorage.getItem("userId");
        let noticeInfo = {
            user: id
        }
        API.notice_info(noticeInfo).then(res => {
            if (res.success === true) {
                if (res.result && res.result.length > 0) {
                    for (let i = 0; i < res.result.length; i++) {
                        if (res.result[i].name) {
                            let names = '';
                            if (res.result[i].name === '数据监测待审核') {
                                names = '数据监测待审核'
                            } else if (res.result[i].name === '线上任务待审核') {
                                names = '线上任务待审核'
                            } else if (res.result[i].name === '线下任务待审核') {
                                names = "线下任务待审核"
                            }
                            if (res.result[i].count === 0) {
                                res.result.splice(i, 1);
                                i = i - 1;
                            }
                        }
                    }
                }
                this.setState({data: res.result})
            }
        })
    }
    componentDidUpdate() {
        //权限菜单
        let permission = this.context.permission;
        if(permission) {
            permission.forEach(v => {
                if (v.permValue === 'index') {
                    v.children.forEach(item => {
                        if (item.permValue === 'index/index') {
                            item.children.forEach(three => {
                                if (three.permValue === '1') {
                                    $('.ones').attr({disabled: null})
                                    $('.ones').removeClass('feiwu');
                                    $('.mark1').css({display: 'none'})
                                    $('.mark1').removeClass('mark');
                                }
                                if (three.permValue === '2') {
                                    $('.twos').attr({disabled: null})
                                    $('.twos').removeClass('feiwu');
                                    $('.mark2').css({display: 'none'})
                                }
                                if (three.permValue === '3') {
                                    $('.three').attr({disabled: null})
                                    $('.three').removeClass('feiwu');
                                    $('.mark3').css({display: 'none'})
                                }
                                if (three.permValue === '4') {
                                    $('.four').attr({disabled: null})
                                    $('.four').removeClass('feiwu');
                                    $('.mark4').css({display: 'none'})
                                }
                            })
                        }
                    })
                }
            })
            btns = permission
        }
    }

    // 左侧权限点击 举报任务审核
    handleSubmit(num) {
        if (btns) {
            btns.forEach(v => {
                if (userIds === '1') {
                    if (v.permValue === 'index') {
                        v.children.forEach(item => {
                            if (item.permValue === 'index/index') {
                                item.children.forEach(three => {
                                    if (three.permValue === '1') {
                                        aaa = localStorage.getItem('aaa', aaa);
                                        if (aaa) {
                                            var bos = aaa.split(',');
                                            let bb = bos.slice(0, bos.indexOf('4'));
                                            let cc = bos.slice(bos.indexOf('4') + 1, bos.length);
                                            let dd = bb.concat(cc);
                                            dd = dd.join(',');
                                            aaa = dd;
                                            localStorage.setItem('aaa', dd);
                                            if (aaa.indexOf(num + ",") === -1) {
                                                dd += num + ",";
                                                localStorage.setItem('aaa', dd);
                                                window.location.reload('/')
                                            }
                                        }
                                    }
                                })

                            }
                        })
                    }
                } else {
                    num = 9;
                    if (v.permValue === 'index') {
                        v.children.forEach(item => {
                            if (item.permValue === 'index/index') {
                                item.children.forEach(three => {
                                    if (three.permValue === '1') {
                                        aaa = localStorage.getItem('aaa', aaa);
                                        if (aaa) {
                                            var bos = aaa.split(',');
                                            let bb = bos.slice(0, bos.indexOf('9'));
                                            let cc = bos.slice(bos.indexOf('9') + 1, bos.length);
                                            let dd = bb.concat(cc);
                                            dd = dd.join(',');
                                            aaa = dd;
                                            localStorage.setItem('aaa', dd);
                                            if (aaa.indexOf(num + ",") === -1) {
                                                dd += num + ",";
                                                localStorage.setItem('aaa', dd);
                                                window.location.reload('/')
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    }

    // 左侧权限点击 新建举报任务
    handleSubmitTwo(num) {
        if (btns) {
            btns.forEach(v => {
                if (userIds === '1') {
                    if (v.permValue === 'index') {
                        v.children.forEach(item => {
                            if (item.permValue === 'index/index') {
                                item.children.forEach(three => {
                                    if (three.permValue === '2') {
                                        aaa = localStorage.getItem('aaa', aaa);
                                        if (aaa) {
                                            var bos = aaa.split(',');
                                            let bb = bos.slice(0, bos.indexOf('6'));
                                            let cc = bos.slice(bos.indexOf('6') + 1, bos.length);
                                            let dd = bb.concat(cc);
                                            dd = dd.join(',');
                                            aaa = dd;
                                            localStorage.setItem('aaa', dd);
                                            if (aaa.indexOf(num) === -1) {
                                                dd += num + ",";
                                                localStorage.setItem('aaa', dd);
                                                window.location.reload('/')
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                } else {
                    if (v.permValue === 'index') {
                        v.children.forEach(item => {
                            if (item.permValue === 'index/index') {
                                item.children.forEach(three => {
                                    if (three.permValue === '2') {
                                        aaa = localStorage.getItem('aaa', aaa);
                                        if (aaa) {
                                            var bos = aaa.split(',');
                                            let bb = bos.slice(0, bos.indexOf('6'));
                                            let cc = bos.slice(bos.indexOf('6') + 1, bos.length);
                                            let dd = bb.concat(cc);
                                            dd = dd.join(',');
                                            aaa = dd;
                                            localStorage.setItem('aaa', dd);
                                            if (aaa.indexOf(num) === -1) {
                                                dd += num + ",";
                                                localStorage.setItem('aaa', dd);
                                                window.location.reload('/')
                                            }
                                        }
                                    }
                                })

                            }
                        })
                    }
                }
            })
        }
    }

    // 左侧权限点击 新建监测规则
    handleSubmitThree(num) {
        // 新建监控规则       权限菜单
        if (btns) {
            btns.forEach(v => {
                if (userIds === '1') {
                    if (v.permValue === 'index') {
                        v.children.forEach(item => {
                            if (item.permValue === 'index/index') {
                                item.children.forEach(three => {
                                    if (three.permValue === '3') {
                                        aaa = localStorage.getItem('aaa', aaa);
                                        if (aaa) {
                                            var bos = aaa.split(',');
                                            let bb = bos.slice(0, bos.indexOf('10'));
                                            let cc = bos.slice(bos.indexOf('10') + 1, bos.length);
                                            let dd = bb.concat(cc);
                                            dd = dd.join(',');
                                            aaa = dd;
                                            localStorage.setItem('aaa', dd);
                                            if (aaa.indexOf(num) === -1) {
                                                dd += num + ",";
                                                localStorage.setItem('aaa', dd);
                                                window.location.reload('/')
                                            }
                                        }
                                    }
                                })

                            }
                        })
                    }
                } else {
                    if (v.permValue === 'index') {
                        v.children.forEach(item => {
                            if (item.permValue === 'index/index') {
                                item.children.forEach(three => {
                                    if (three.permValue === '3') {
                                        aaa = localStorage.getItem('aaa', aaa);
                                        if (aaa) {
                                            var bos = aaa.split(',');
                                            let bb = bos.slice(0, bos.indexOf('10'));
                                            let cc = bos.slice(bos.indexOf('10') + 1, bos.length);
                                            let dd = bb.concat(cc);
                                            dd = dd.join(',');
                                            aaa = dd;
                                            localStorage.setItem('aaa', dd);
                                            if (aaa.indexOf(num) === -1) {
                                                dd += num + ",";
                                                localStorage.setItem('aaa', dd);
                                                window.location.reload('/')
                                            }
                                        }
                                    }
                                })

                            }
                        })
                    }
                }

            })
        }
    }

    // 左侧权限点击 监控任务审核
    handleSubmitFour(num) {
        if (btns) {
            btns.forEach(v => {
                if (userIds === '1') {
                    if (v.permValue === 'index') {
                        v.children.forEach(item => {
                            if (item.permValue === 'index/index') {
                                item.children.forEach(three => {
                                    if (three.permValue === '4') {
                                        aaa = localStorage.getItem('aaa', aaa);
                                        if (aaa) {
                                            var bos = aaa.split(',');
                                            let bb = bos.slice(0, bos.indexOf('11'));
                                            let cc = bos.slice(bos.indexOf('11') + 1, bos.length);
                                            let dd = bb.concat(cc);
                                            dd = dd.join(',');
                                            aaa = dd;
                                            localStorage.setItem('aaa', dd);
                                            if (aaa.indexOf(num) === -1) {
                                                dd += num + ",";
                                                localStorage.setItem('aaa', dd);
                                                localStorage.setItem('auditStatus', 0);
                                                window.location.reload('/');
                                            }
                                        }
                                    }
                                })

                            }
                        })
                    }
                } else {
                    if (v.permValue === 'index') {
                        v.children.forEach(item => {
                            if (item.permValue === 'index/index') {
                                item.children.forEach(three => {
                                    if (three.permValue === '4') {
                                        aaa = localStorage.getItem('aaa', aaa);
                                        if (aaa) {
                                            var bos = aaa.split(',');
                                            let bb = bos.slice(0, bos.indexOf('11'));
                                            let cc = bos.slice(bos.indexOf('11') + 1, bos.length);
                                            let dd = bb.concat(cc);
                                            dd = dd.join(',');
                                            aaa = dd;
                                            localStorage.setItem('aaa', dd);
                                            if (aaa.indexOf(num) === -1) {
                                                dd += num + ",";
                                                localStorage.setItem('aaa', dd);
                                                localStorage.setItem('auditStatus', 0);
                                                window.location.reload('/');
                                            }
                                        }
                                    }
                                })

                            }
                        })
                    }
                }

            })
        }
    }

    //右侧点击跳转--消息通知
    Jump(nums) {
        if (this.state.data) {
            for (var i = 0; i < this.state.data.length; i++) {
                if (this.state.data[nums].id === 1) {
                    let num = '11';
                    aaa = localStorage.getItem('aaa', aaa);
                    if (aaa) {
                        var bos = aaa.split(',');
                        let bb = bos.slice(0, bos.indexOf('11'));
                        let cc = bos.slice(bos.indexOf('11') + 1, bos.length);
                        let dd = bb.concat(cc);
                        dd = dd.join(',');
                        localStorage.setItem('aaa', dd);
                        if (aaa.indexOf(num) === -1) {
                            dd += num + ",";
                            localStorage.setItem('aaa', dd);
                            localStorage.setItem('auditStatus', 0);
                            window.location.reload('/');
                            break;
                        }
                    }
                }
                if (this.state.data[nums].id === 2) {
                    let num = '4';
                    aaa = localStorage.getItem('aaa', aaa);
                    if (aaa) {
                        var bos = aaa.split(',');
                        let bb = bos.slice(0, bos.indexOf('4'));
                        let cc = bos.slice(bos.indexOf('4') + 1, bos.length);
                        let dd = bb.concat(cc);
                        dd = dd.join(',');
                        localStorage.setItem('aaa', dd);
                        if (aaa.indexOf(num) === -1) {
                            dd += num + ",";
                            localStorage.setItem('aaa', dd);
                            localStorage.setItem('status', 1);
                            window.location.reload('/')
                            break;
                        }
                    }
                }
                if (this.state.data[nums].id === 3) {
                    let num = '5';
                    aaa = localStorage.getItem('aaa', aaa);
                    if (aaa) {
                        var bos = aaa.split(',');
                        let bb = bos.slice(0, bos.indexOf('5'));
                        let cc = bos.slice(bos.indexOf('5') + 1, bos.length);
                        let dd = bb.concat(cc);
                        dd = dd.join(',');
                        localStorage.setItem('aaa', dd);
                        if (aaa.indexOf(num) === -1) {
                            dd += num + ",";
                            localStorage.setItem('aaa', dd);
                            localStorage.setItem('status', 1);
                            window.location.reload('/')
                            break;
                        }
                    }
                }
                if (this.state.data[nums].id === 4) {
                    let num = '9';
                    aaa = localStorage.getItem('aaa', aaa);
                    if (aaa) {
                        var bos = aaa.split(',');
                        let bb = bos.slice(0, bos.indexOf('9'));
                        let cc = bos.slice(bos.indexOf('9') + 1, bos.length);
                        let dd = bb.concat(cc);
                        dd = dd.join(',');
                        localStorage.setItem('aaa', dd);
                        if (aaa.indexOf(num + ',') === -1) {
                            dd += num + ",";
                            localStorage.setItem('aaa', dd);
                            localStorage.setItem('status', 1);
                            window.location.reload('/')
                            break;
                        }
                    }
                }
                if (this.state.data[nums].id === 5) {
                    let num = '8';
                    aaa = localStorage.getItem('aaa', aaa);
                    if (aaa) {
                        var bos = aaa.split(',');
                        let bb = bos.slice(0, bos.indexOf('8'));
                        let cc = bos.slice(bos.indexOf('8') + 1, bos.length);
                        let dd = bb.concat(cc);
                        dd = dd.join(',');
                        localStorage.setItem('aaa', dd);

                        if (aaa.indexOf(num + ',') === -1) {
                            dd += num + ",";
                            localStorage.setItem('aaa', dd);
                            localStorage.setItem('status', 1);
                            window.location.reload('/')
                            break;
                        }
                    }
                }
            }
        }
    }

    //渲染dom
    render() {

        const {data} = this.state;
        let aa = [];
        let j = 0;
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].name === '数据监测待审核') {
                    aa.push(
                        <li className="Message_list" key={i} onClick={() => this.Jump(i)}>
                            <span className="watchName number">{data[i].count}<span
                                className="black">{localStorage.lan === "chinese" ? "条" : "Pending"}</span></span>
                            <span className="watchName">
                                {localStorage.lan === "chinese" ? "数据监测待审核" : "Monitoring Task Check"}
                                </span>
                        </li>
                    )
                } else if (data[i].name === '线上任务待审核') {
                    aa.push(
                        <li className="Message_list" key={i} onClick={() => this.Jump(i)}>
                            <span className="watchName number">{data[i].count}<span
                                className="black">{localStorage.lan === "chinese" ? "条" : "Pending"}</span></span>
                            <span className="watchName">
                                {localStorage.lan === "chinese" ? "线上任务待审核" : "Online Tip-off Task Check"}
                                </span>
                        </li>
                    )
                } else if (data[i].name === '线下任务待审核') {
                    aa.push(
                        <li className="Message_list" key={i} onClick={() => this.Jump(i)}>
                            <span className="watchName number">{data[i].count}<span
                                className="black">{localStorage.lan === "chinese" ? "条" : "Pending"}</span></span>
                            <span className="watchName">
                                {localStorage.lan === "chinese" ? "线下任务待审核" : "Offline Tip-off Task Check"}
                                </span>
                        </li>
                    )
                }
            }
        }
        return (
            <div className="Admincontent">
                <div className="top_sub">
                    <div className="left_list">
                        <div className="top_name">
                            {localStorage.lan === "chinese" ? "常用功能" : "COMMON FUNCTION"}
                            &nbsp;
                        </div>
                        <div className="left_content">
                            <ul className="left_content_ul">
                                <div className='divs ones' style={{position: "relative"}}>
                                    <li className="left_content_lis" onClick={() => this.handleSubmit("4")}>
                                        <div className="left_imgs">
                                            <img src={AddMonitor} alt=""/>
                                        </div>
                                        <div className="left_title">
                                            {localStorage.lan === "chinese" ? "举报任务审核" : "Tip-off Task Check"}
                                            <br/>
                                            {localStorage.lan === "chinese" ? "对用户的线上、线下举报线索进行分析、审核" : "Check and analyze online and line clues tipped off by users"}

                                        </div>
                                    </li>
                                    <div className="mark mark1 xss" style={{}}></div>
                                </div>
                                <div className='divs twos'>
                                    <li className="left_content_lis" onClick={() => this.handleSubmitTwo("6")}>
                                        <div className="left_imgs">
                                            <img src={report} alt=""/>
                                        </div>
                                        <div className="left_title">
                                            {localStorage.lan === "chinese" ? "新建举报任务" : "Create Tip-off Task"}
                                            <br/>
                                            {localStorage.lan === "chinese" ? "发布具体任务，或者限时活动组织用户参与" : "Release specific tasks or time-limited activities for users to participate"}

                                        </div>
                                    </li>
                                    <div className="mark mark2 xss" style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 9
                                    }}></div>
                                </div>
                                <div className='divs three'>
                                    <li className="left_content_lis" onClick={() => this.handleSubmitThree("10")}>
                                        <div className="left_imgs">
                                            <img src={Release} alt=""/>
                                        </div>
                                        <div className="left_title">
                                            {localStorage.lan === "chinese" ? "新建监控规则" : "Create Monitoring Rule"}
                                            <br/>
                                            {localStorage.lan === "chinese" ? "增加不同纬度的条件，监测各网站平台商品" : "Dimensions for the use of monitoring commodities on various platforms"}

                                        </div>
                                    </li>
                                    <div className="mark mark3 xss" style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 9
                                    }}></div>
                                </div>
                                <div className='divs four'>
                                    <li className="left_content_lis" onClick={() => this.handleSubmitFour("11")}>
                                        <div className="left_imgs">
                                            <img src={Monitor} alt=""/>
                                        </div>
                                        <div className="left_title">
                                            {localStorage.lan === "chinese" ? "监控任务审核" : "Monitoring Task Check"}

                                            <br/>
                                            {localStorage.lan === "chinese" ? "审核任务监测到的具体数据情况" : "Check the data monitored by rules"}

                                        </div>
                                    </li>
                                    <div className="mark mark4 xss" style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 9
                                    }}></div>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div className="left_list">
                        <div className="top_name">
                            {localStorage.lan === "chinese" ? "数据分析" : "DATA ANALYSIS"}
                            &nbsp;
                        </div>
                        <div className="left_content" style={{height: 537}}>
                            <ul className="left_content_ul" style={{height: '100%'}}>
                                <div className="Chart" style={{height: '100%'}}>
                                    {/*<EChart/>*/}
                                    <div className="displays">
                                        {localStorage.lan === "chinese" ? "即将开放，敬请期待..." : "The data is under construction, please wait."}
                                        <div style={{marginTop: '-70px', opacity: .6}}>
                                            <img src={img_echarts} alt="" style={{width: '106%'}}/>
                                            {/*<EChart/>*/}
                                        </div>
                                        <div className="">

                                        </div>
                                    </div>
                                    {/*<div*/}
                                    {/*className="echars_titles">{localStorage.lan === "chinese" ? "线下假货线索分布" : "Location Distribution of Offline Clues"}*/}
                                    {/*</div>*/}
                                </div>
                                {/*<div className="Chart">*/}
                                {/*/!*<EchartsTest/>*!/*/}
                                {/*<div*/}
                                {/*className="echars_titles">{localStorage.lan === "chinese" ? "各平台商品监控量" : "Monitoring Data of Each Platforms"}</div>*/}

                                {/*</div>*/}
                            </ul>
                        </div>
                    </div>
                    <div className="left_list">
                        <div className="top_name">
                            {localStorage.lan === "chinese" ? "消息通知" : "NOTIFICATION"}
                            &nbsp;
                        </div>
                        <div className="left_content">
                            <ul className="left_content_ul">
                                <div className="contents">
                                    <ul>
                                        <Link to="#">
                                            {aa}
                                        </Link>
                                    </ul>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
Admincontent.contextTypes = {
    permission:PropTypes.array
}
export default Admincontent;