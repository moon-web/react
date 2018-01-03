//监测数据首页
import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import {Button,Table, Pagination, Form, Select, message, DatePicker} from 'antd';
import {Row, Col} from 'antd';
import $ from 'jquery';
import one from '../../assets/images/one.png';
import two from '../../assets/images/two.png';
import three from '../../assets/images/three.png';
import four from '../../assets/images/four.png';
import five from '../../assets/images/five.png';
import six from '../../assets/images/six.png';
import imgages from '../../assets/images/images.png'
import btn from '../../assets/images/btn.png'

import API from '../../api/index'
import PropTypes from 'prop-types'

const FormItem = Form.Item;
const Option = Select.Option;
var columns;
let checked = [];
let checkedType = [];
var btns = '';
let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

class MontioringLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
            isExpand: true,
            data: [],
            current: 1,
            pageNo: 1,
            pageSize: 15,
            records: 0,
            monitorName: '',
            ownedBrand: '',
            user: '',
            platformTypeId: '',
            auditStatus: '',
            tortsType: '',
            title: '',
            startTime: '',
            endTime: '',
            id: '',
            auditStatus: '',
            status: '',
            startValue: null,
            crawleTime: "",
            brandName: "",
            monitorId: '',
            bb: [],
            endValue: null,
            endOpen: false,
            addResponseFlagHas: false,
            expandedRowKeys: arr,
            loading: true,
        }
        this.brand_active = this.brand_active.bind(this);
    }
    //管控任务审核列表
    watch_task_list = (page,type) => {
        this.setState({loading:true})
        let auditStatus = '';
        let userId = localStorage.getItem("userId")
        if (localStorage.getItem('auditStatus')) {
            auditStatus = localStorage.getItem("userId")
        } else {
            auditStatus = this.state.auditStatus
        }
        let watchTask = {
            pageNo: page,
            pageSize: this.state.pageSize,
            monitorId: this.state.monitorId,
            ownedBrand: this.state.ownedBrand,
            platformTypeId: this.state.platformTypeId,
            auditStatus: auditStatus,
            tortsType: type,
            title: this.state.title,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            user: userId
        }
        API.watch_task(watchTask).then(res => {
            const data = [];
            let platformType = null;
            let auditStatus = null;
            if (res.result && res.result.length > 0) {
                for (let i = 0; i < res.result.length; i++) {
                    //商品来源判断
                    if (res.result[i].platformTypeId === 1) {
                        platformType = '淘宝'
                    } else if (res.result[i].platformTypeId === 2) {
                        platformType = '天猫'
                    } else if (res.result[i].platformTypeId === 3) {
                        platformType = '1688'
                    } else if (res.result[i].platformTypeId === 4) {
                        platformType = 'alibaba'
                    } else if (res.result[i].platformTypeId === 5) {
                        platformType = 'Aliexpress'
                    } else if (res.result[i].platformTypeId === 6) {
                        platformType = '京东'
                    } else if (res.result[i].platformTypeId === 7) {
                        platformType = '一号店'
                    } else if (res.result[i].platformTypeId === 8) {
                        platformType = '唯品会'
                    } else if (res.result[i].platformTypeId === 9) {
                        platformType = '当当网'
                    } else if (res.result[i].platformTypeId === 10) {
                        platformType = '慧聪网'
                    } else {
                        platformType = '未知来源'
                    }
                    if (res.result[i].auditStatus === 0) {
                        auditStatus = '待审核'
                    } else if (res.result[i].auditStatus === 1) {
                        auditStatus = '审核通过'
                    } else if (res.result[i].auditStatus === 2) {
                        auditStatus = '审核不通过'
                    }
                    data.push({
                        key: i,
                        monitorId: res.result[i].monitorId,
                        ownedBrand: res.result[i].ownedBrand,
                        crawleTime: res.result[i].crawleTime,
                        crawleTime: res.result[i].crawleTime,
                        platformTypeId: platformType,
                        tortsType: res.result[i].tortsType,
                        auditStatus: auditStatus,
                        brandName: res.result[i].brandName,
                        montioring: '',
                        title: res.result[i].title,
                        url: res.result[i].url,
                        price: res.result[i].price,
                        salesVolume: res.result[i].salesVolume,
                        picUrl: res.result[i].picUrl,
                        storeName: res.result[i].storeName,
                        storeLevel: res.result[i].storeLevel,
                        consignmentPlace: res.result[i].consignmentPlace,
                        evaluate: res.result[i].evaluate,
                        id: res.result[i].id,
                        evaluate: res.result[i].evaluate,
                        status: res.result[i].auditStatus,
                        brand: res.result[i].brand,
                        isDangerous: res.result[i].isDangerous
                    });
                }
                this.setState({data: data, records: res.records, isExpand: true,loading:false})

            }
        })
    }

    componentDidMount() {
        this.watch_task_list(this.state.pageNo,this.state.tortsType)
        let userId = localStorage.getItem("userId")
        let brandData = {
            userId: userId
        }
        API.brand(brandData).then(res => {
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
                        if (item.permValue === 'data/task') {
                            $('.lines').attr({disabled: true})
                            $('.lines').addClass('feiwu');
                            $('.qiyong').attr({disabled: "disabled"})
                            if (item.children) {
                                item.children.forEach(list => {
                                    if (list.permValue === '3') {
                                        $('.lines').attr({disabled: null})
                                        $('.lines').removeClass('feiwu');
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
        arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        this.setState({
            current: page,
            pageNo: page,
            expandedRowKeys: arr
        });
        let str = checked.join(",")
        this.watch_task_list(page,str)
    }

    //审核按钮
    brand_active(id, status) {
        $(".flex_monitoring_list").removeClass("brand_active");
        this.setState({
            id: id,
            status: status
        })
    }

    brand_unactive() {
        $(".flex_monitoring_list").addClass("brand_active");
    }

    owenTask = (e) => {
        this.setState({monitorId: e.target.value})
    }
    owenBrand = (value) => {
        this.setState({ownedBrand: value})
    }
    owenResource = (value) => {
        this.setState({platformTypeId: value})
    }
    owenSatus = (value) => {
        this.setState({auditStatus: value})
    }
    ovwnTitle = (e) => {
        this.setState({title: e.target.value})
    }
    //重置
    resetting = () => {
        arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        this.setState({
            monitorId: '',
            ownedBrand: '',
            platformTypeId: '',
            auditStatus: '',
            startValue: '',
            endValue: '',
            title: '',
            startTime: '',
            endTime: '',
            expandedRowKeys: arr
        })
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

    searchList = (e) => {
        arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        let str = checked.join(",")
        this.watch_task_list(this.state.pageNo,str)
    }
    //审核选择侵权类型
    choseType = (e) => {
        if (e.target.checked) {
            checkedType.push(e.target.value);
        } else {
            checkedType.splice(checkedType.indexOf(e.target.value), 1);
        }
    }
    //审核通过
    updateType = (e) => {
        let str = "";
        str = checkedType.join(",");
        let watchTaskExamine = {
            id:this.state.id,
            tortsType:str,
            auditStatus:1,
        }
        API.watch_task_examine(watchTaskExamine).then(res => {
                if (res.success === true) {
                    message.success("审核成功!");
                    $(".flex_monitoring_list").addClass("brand_active");
                    this.watch_task_list(this.state.pageNo,this.state.tortsType)

                } else {
                    message.success("审核失败！")
                }
            })
    }
    //审核不通过
    offdateType = (e) => {
        let str = "";
        str = checkedType.join(",");
        let watchTaskExamine = {
            id:this.state.id,
            tortsType:str,
            auditStatus:2,
        }
        API.watch_task_examine(watchTaskExamine).then(res => {
            if (res.success === true) {
                message.success("审核成功!");
                $(".flex_monitoring_list").addClass("brand_active");
                this.watch_task_list(this.state.pageNo,this.state.tortsType)

            } else {
                message.success("审核失败！")
            }
        })
    }

    //全選
    checkedAll = (e) => {
        checked = [];
        if (e.target.checked) {
            $(".checkAll input").prop("checked", true);
            for (let i = 1; i < $(".checkAll input").length; i++) {
                checked.push($(".checkAll input")[i].value)
            }
        } else {
            $(".checkAll input").prop("checked", false);
            checked = [];
        }
    }
    //单选
    singalChecked = (e) => {
        if (e.target.checked) {
            checked.push(e.target.value);
        } else {
            checked.splice(checked.indexOf(e.target.value), 1);
        }
        if (checked.length === $(".checkAll input").length - 1) {
            $(".checkAll .check_all").prop("checked", true);
        } else {
            $(".checkAll .check_all").prop("checked", false);
        }
    }

    //导出
    exportData = (e) => {

        let num = this.state.records;
        let page = Math.ceil(num / 5000);

        for (let i = 1; i <= page; i++) {
            let data = `monitorId=${this.state.monitorId}&ownedBrand=${this.state.ownedBrand}&user=1&platformTypeId=${this.state.platformTypeId}&auditStatus=${this.state.auditStatus}&tortsType=${this.state.tortsType}&title=${this.state.title}&startTime=${this.state.startTime}&endTime=&pageNo=${i}`
            // window.location.href ="http://192.168.1.4:8899/ipcommune/itemDetails/exportExcel?"+data

            fetch("http://118.89.197.95/ipcommune/itemDetails/exportExcel?" + data, {
                method: 'GET'
            }).then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "filename.xls";
                    a.click();
                });
        }


    }


    //点击小图变大
    bigImg(imgSrc) {
        $(".bigImg-box").addClass("bigImg-show")
        $(".bigImg-box .bigImg").attr({src: imgSrc})
    }

    closeBigImg = () => {
        $(".bigImg-box").removeClass("bigImg-show")
    }


    //默认额外行展开行
    onExpand = (expanded, record) => {
        if (expanded === false) {
            arr.splice(arr.indexOf(record.key), 1);
            this.setState({expandedRowKeys: arr})
        } else {
            arr.splice(record.key, 0, record.key);
            this.setState({expandedRowKeys: arr})
        }
    }


    render() {
        const bTag = true
        const expandedRowRender = record =>
            <div className='wrappers'>
                <div className="wrappers_search">
                    <Row style={{width: '100%'}}>
                        <Col span={8}>
                            <div className="wrapers_lis" style={{width: '100%'}}>
                                <label htmlFor="" className="wraps_names" style={{
                                    width: '43%',
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{localStorage.lan === "chinese" ? "商品标题" : "Product Title"}
                                    ：</label>
                                <input type="text" className="wraps_inpit"
                                       style={{width: '55%', fontSize: '12px'}} readOnly
                                       value={record.title || '暂无'}/>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="wrapers_lis" style={{width: '100%'}}>
                                <label htmlFor="" className="wraps_names" style={{
                                    width: '43%',
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{localStorage.lan === "chinese" ? "商品链接" : "Product URL"}
                                    ：</label>
                                <div className="wraps_inpit"
                                     style={{width: '55%', fontSize: '12px'}}>
                                    <a href={record.url} target="_blank"
                                       className="unaudiots">{record.url || '暂无'}</a>
                                </div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="wrapers_lis" style={{width: '100%'}}>
                                <label htmlFor="" className="wraps_names" style={{
                                    width: '43%',
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{localStorage.lan === "chinese" ? "商品价格" : "Commodity Price"}
                                    ：</label>
                                <input type="text" className="wraps_inpit"
                                       style={{width: '55%', fontSize: '12px'}} readOnly
                                       value={record.price || '暂无'}/>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="wrapers_lis" style={{width: '100%'}}>
                                <label htmlFor="" className="wraps_names" style={{
                                    width: '43%',
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{localStorage.lan === "chinese" ? "销量" : "Monthly Sales"}
                                    ：</label>
                                <input type="text" className="wraps_inpit"
                                       style={{width: '55%', fontSize: '12px'}} readOnly
                                       value={record.salesVolume || '暂无'}/>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="wrapers_lis" style={{width: '100%'}}>
                                <label htmlFor="" className="wraps_names" style={{
                                    width: '43%',
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{localStorage.lan === "chinese" ? "评价" : "Feedback"} ：</label>
                                <input type="text" className="wraps_inpit"
                                       style={{width: '55%', fontSize: '12px'}} readOnly
                                       value={record.evaluate || '暂无'}/>
                            </div>
                        </Col>

                        <Col span={8}>
                            <div className="wrapers_lis" style={{width: '100%'}}>
                                <label htmlFor="" className="wraps_names" style={{
                                    width: '43%',
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{localStorage.lan === "chinese" ? "品牌" : "Brand"} ：</label>
                                <input type="text" className="wraps_inpit"
                                       style={{width: '55%', fontSize: '12px'}} readOnly
                                       value={record.brand || '暂无'}/>
                            </div>
                        </Col>

                        <Col span={8}>
                            <div className="wrapers_lis" style={{width: '100%'}}>
                                <label htmlFor="" className="wraps_names" style={{
                                    width: '43%',
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{localStorage.lan === "chinese" ? "店铺名称" : "Shop Name"} ：</label>
                                <input type="text" className="wraps_inpit"
                                       style={{width: '55%', fontSize: '12px'}} readOnly
                                       value={record.storeName || '暂无'}/>
                            </div>
                        </Col>

                        <Col span={8}>
                            <div className="wrapers_lis" style={{width: '100%'}}>
                                <label htmlFor="" className="wraps_names" style={{
                                    width: '43%',
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{localStorage.lan === "chinese" ? "店铺等级" : "Shop Grade"}
                                    ：</label>
                                <input type="text" className="wraps_inpit"
                                       style={{width: '55%', fontSize: '12px'}} readOnly
                                       value={record.storeLevel || '暂无'}/>
                            </div>
                        </Col>

                        <Col span={8}>
                            <div className="wrapers_lis" style={{width: '100%'}}>
                                <label htmlFor="" className="wraps_names" style={{
                                    width: '43%',
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{localStorage.lan === "chinese" ? "发货地" : "Point of Origin"}
                                    ：</label>
                                <input type="text" className="wraps_inpit"
                                       style={{width: '55%', fontSize: '12px'}} readOnly
                                       value={record.consignmentPlace || '暂无'}/>
                            </div>
                        </Col>

                    </Row>
                </div>
                <div className="wrappers_imgages">
                    <div className="wrappser_img">
                        <img src={record.picUrl || imgages} alt=""
                             onClick={() => this.bigImg(record.picUrl)}/>
                    </div>
                </div>
            </div>
        const {startValue, endValue, endOpen} = this.state;
        const {getFieldDecorator} = this.props.form;
        if (localStorage.lan === 'chinese') {
            columns = [{
                title: '所属监控ID',
                dataIndex: 'monitorId',
                width: 300
            }, {
                title: '所属品牌',
                dataIndex: 'brandName',
                width: 300
            }, {
                title: '监控时间',
                dataIndex: 'crawleTime',
                width: 300
            }, {
                title: '商品来源',
                dataIndex: 'platformTypeId',
                width: 300,
            }, {
                title: '侵权类型',
                dataIndex: 'tortsType',
                width: 200,
                render: (text, record) => {
                    let aa = '';
                    let bb = [];
                    if (record.tortsType && record.tortsType.length > 0) {
                        let arr = record.tortsType.split(",");
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] === '1') {
                                bb.push(<img src={one} className='monitimg'/>)
                            }
                            if (arr[i] === '2') {
                                bb.push(<img src={two} className='monitimg'/>)
                            }
                            if (arr[i] === '3') {
                                bb.push(<img src={three} className='monitimg'/>)
                            }
                            if (arr[i] === '4') {
                                bb.push(<img src={four} className='monitimg'/>)
                            }
                            if (arr[i] === '5') {
                                bb.push(<img src={five} className='monitimg'/>)
                            }
                            if (arr[i] === '6') {
                                bb.push(<img src={six} className='monitimg'/>)
                            }
                            if (arr[i] === '7') {
                                bb.push(<img src={one} className='monitimg'/>)
                            }
                        }
                    }
                    return bb;
                }
            }, {
                title: '状态',
                dataIndex: 'auditStatus',
                width: 300,
                render: (text, record) => {
                    var cc = '';
                    if (record.isDangerous) {
                        if (record.isDangerous === '0') {
                            cc = ''
                        } else if (record.isDangerous === '1') {
                            cc = '!'
                        }
                    }
                    return (
                        <div>
                            <span>{record.auditStatus}</span>
                            <span style={{fontWeight: 800, fontSize: 14, color: 'red'}}> {cc} </span>
                        </div>
                    )
                }
            },
                {
                    title: '操作',
                    dataIndex: 'opreation',
                    width: 115,
                    render: (text, record) => {
                        let aa = '';
                        if (record.auditStatus && record.auditStatus === '待审核') {
                            aa = <ul className="offline_buttons"
                                     onClick={() => this.brand_active(record.id, record.status)}>
                                <Button type="" className="offline_lis lines">审核</Button>
                            </ul>
                        }
                        return aa;
                    }
                }
            ];
        } else {
            columns = [{
                title: 'Rule ID',
                dataIndex: 'monitorId',
                width: 300
            }, {
                title: 'Brand',
                dataIndex: 'brandName',
                width: 300
            }, {
                title: 'Monitoring Time',
                dataIndex: 'crawleTime',
                width: 300
            }, {
                title: 'Source Platform',
                dataIndex: 'platformTypeId',
                width: 300,
                render: (text, record) => {
                    if (record.platformTypeId === '淘宝') {
                        return (<div>Taobao</div>)
                    } else if (record.platformTypeId === '天猫') {
                        return (<div>Tmall</div>)
                    } else if (record.platformTypeId === '1688') {
                        return (<div>1688</div>)
                    } else if (record.platformTypeId === 'alibaba') {
                        return (<div>alibaba</div>)
                    } else if (record.platformTypeId === 'Aliexpress') {
                        return (<div>Aliexpress</div>)
                    } else if (record.platformTypeId === '京东') {
                        return (<div>Jdong</div>)
                    } else if (record.platformTypeId === '一号店') {
                        return (<div>YHD.com</div>)
                    } else if (record.platformTypeId === '唯品会') {
                        return (<div>vip.com</div>)
                    } else if (record.platformTypeId === '当当网') {
                        return (<div>dangdang.com</div>)
                    } else if (record.platformTypeId === '慧聪网') {
                        return (<div>Hc360.Com</div>)
                    } else if (record.platformTypeId === '未知来源') {
                        return (<div>Unknown Source</div>)
                    }

                }
            }, {
                title: 'Infringement Type',
                dataIndex: 'tortsType',
                width: 200,
                render: (text, record) => {
                    let aa = '';
                    let bb = [];
                    if (record.tortsType && record.tortsType.length > 0) {
                        let arr = record.tortsType.split(",");
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] === '1') {
                                bb.push(<img src={one} className='monitimg'/>)
                            }
                            if (arr[i] === '2') {
                                bb.push(<img src={two} className='monitimg'/>)
                            }
                            if (arr[i] === '3') {
                                bb.push(<img src={three} className='monitimg'/>)
                            }
                            if (arr[i] === '4') {
                                bb.push(<img src={four} className='monitimg'/>)
                            }
                            if (arr[i] === '5') {
                                bb.push(<img src={five} className='monitimg'/>)
                            }
                            if (arr[i] === '6') {
                                bb.push(<img src={six} className='monitimg'/>)
                            }
                            if (arr[i] === '7') {
                                bb.push(<img src={one} className='monitimg'/>)
                            }
                        }
                    }
                    return bb;
                }
            }, {
                title: 'Status',
                dataIndex: 'auditStatus',
                width: 300,
                render: (text, record) => {
                    if (record.auditStatus === '待审核') {
                        return (<div>{localStorage.lan === "chinese" ? "待审核" : "Pending"}</div>)
                    } else if (record.auditStatus === '审核通过') {
                        return (<div>{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</div>)
                    } else if (record.auditStatus === '审核不通过') {
                        return (<div>{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</div>)
                    }
                }
            },
                {
                    title: 'Operate',
                    dataIndex: 'opreation',
                    width: 115,
                    render: (text, record) => {
                        let aa = '';
                        if (record.auditStatus && record.auditStatus === '待审核') {
                            aa = <ul className="offline_buttons"
                                     onClick={() => this.brand_active(record.id, record.status)}>
                                <Button type=""
                                        className="offline_lis lines">{localStorage.lan === "chinese" ? "审核" : "Pass"}</Button>
                            </ul>
                        }
                        return aa;
                    }
                }
            ];
        }

        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {

            },
            onSelect(record, selected, selectedRows) {

            },
            onSelectAll(selected, selectedRows, changeRows) {

            },
        };

        return (
            <div id="jkContent">
                <div className="search">
                    <div>
                        <Form>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "所属监控ID" : "Rule ID"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.owenTask}
                                       value={this.state.monitorId}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "所属品牌" : "Brand"}
                                    ：</label>

                                <Select defaultValue="" style={{width: 130}} onChange={this.owenBrand}
                                        value={this.state.ownedBrand || '-1'}>
                                    <Option value="-1">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                    {
                                        this.state.bb.map(v => (
                                            <Option value={v.id} key={v.id}>{v.name}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: 'auto'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "商品来源" : "Commodity source"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    value={this.state.platformTypeId || '0'}
                                    optionFilterProp="children"
                                    onChange={this.owenResource}
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
                                    value={this.state.auditStatus}
                                    optionFilterProp="children"
                                    onChange={this.owenSatus}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=" ">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                    <Option value="0">{localStorage.lan === "chinese" ? "待审核" : "Pending"}</Option>
                                    <Option value="1">{localStorage.lan === "chinese" ? "审核通过" : "Pass"}</Option>
                                    <Option value="2">{localStorage.lan === "chinese" ? "审核不通过" : "Fail"}</Option>
                                </Select>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '104px'}} style={{width: '104px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "商品标题" : "Product Title"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.ovwnTitle}
                                       value={this.state.title}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{minWidth: '104px', width: 109}}
                                       className="user_names">{localStorage.lan === "chinese" ? "监控时间" : "Monitoring Time"}
                                    ：</label>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={startValue}
                                    placeholder="StartTime"
                                    style={{width: '130px'}}
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={endValue}
                                    placeholder="EndTime"
                                    style={{width: '130px', marginLeft: '10px'}}
                                    onChange={this.onEndChange}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="search checkAll">
                    <div>
                        <Form>
                            <div className="userlist">
                                <label htmlFor="" style={{width: 'auto'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "侵权类型" : "Infringement Type"}
                                    ：</label>
                                <input type="checkbox" className="vehicle check_all" value="all"
                                       onClick={this.checkedAll}/> &nbsp; {localStorage.lan === "chinese" ? "全选" : "All"}
                            </div>
                            <div className="userlist">
                                <input type="checkbox" className="vehicle" value="1"
                                       onClick={this.singalChecked}/> &nbsp;
                                <img src={one} alt=""
                                     className='vehicle_img'/> {localStorage.lan === "chinese" ? "突出使用logo" : "Logo Infringement"}
                            </div>

                            <div className="userlist">
                                <input type="checkbox" className="vehicle" value="2"
                                       onClick={this.singalChecked}/> &nbsp;
                                <img src={two} alt=""
                                     className='vehicle_img'/> {localStorage.lan === "chinese" ? "未生产" : "Non-Existent Product"}
                            </div>

                            <div className="userlist">
                                <input type="checkbox" className="vehicle" value="3"
                                       onClick={this.singalChecked}/> &nbsp;
                                <img src={three} alt=""
                                     className='vehicle_img'/> {localStorage.lan === "chinese" ? "真假对比" : "Comparison of Genuine Goods and Counterfeits"}
                            </div>

                            <div className="userlist">
                                <input type="checkbox" className="vehicle" value="4"
                                       onClick={this.singalChecked}/> &nbsp;
                                <img src={four} alt=""
                                     className='vehicle_img'/> {localStorage.lan === "chinese" ? "盗图/盗用文字" : "Copyright Infringement"}
                            </div>

                            <div className="userlist">
                                <input type="checkbox" className="vehicle" value="5"
                                       onClick={this.singalChecked}/> &nbsp;
                                <img src={five} alt=""
                                     className='vehicle_img'/> {localStorage.lan === "chinese" ? "滥用关键字" : "Brand Confusion"}
                            </div>
                            <div className="userlist">
                                <input type="checkbox" className="vehicle" value="7"
                                       onClick={this.singalChecked}/> &nbsp;
                                <img src={one} alt=""
                                     className='vehicle_img'/> {localStorage.lan === "chinese" ? "著作权" : "Brand Confusion"}
                            </div>
                            <div className="userlist">
                                <input type="checkbox" className="vehicle" value="6"
                                       onClick={this.singalChecked}/> &nbsp;
                                <img src={six} alt=""
                                     className='vehicle_img'/> {localStorage.lan === "chinese" ? "其他" : "Others"}
                            </div>
                            <Button type="primary" htmlType="submit" className="buttons fuzhi_btns search_btn"
                                    onClick={this.searchList}>{localStorage.lan === "chinese" ? "搜索" : "Search"}</Button>
                            <Button type="primary" className="buttons"
                                    onClick={this.resetting}>{localStorage.lan === "chinese" ? "重置" : "Resetting"}</Button>
                        </Form>
                    </div>
                </div>
                <div className="tables_list">
                    <div className="tables_choice">
                        <Button type="primary" className="qiyong"
                                onClick={this.exportData}>{localStorage.lan === "chinese" ? "导出" : "Export"}</Button>
                    </div>
                    <div>
                        <Table
                            columns={columns}
                            expandedRowRender={expandedRowRender}
                            bordered pagination={false}
                            defaultExpandAllRows={true}
                            rowSelection={rowSelection}
                            dataSource={this.state.data}
                            expandedRowKeys={this.state.expandedRowKeys}
                            onExpand={(expanded, record) => this.onExpand(expanded, record)}
                            loading={this.state.loading}
                        />
                        <div className='pagina'>
                            <Pagination current={this.state.current} onChange={this.onChangePage}
                                        total={this.state.records} pageSize={15}/>
                        </div>
                        <div className="bigImg-box extend-img">
                            <img className="bigImg" src="" alt="图片路径错误"/>
                            <span className="close_big" onClick={this.closeBigImg}><img src={btn} alt=""/></span>
                        </div>
                    </div>
                </div>
                <div className="flex_monitoring_list brand_active ">
                    <div className="flex_monitoring_list_top">
                        商品审核
                        <span className="shenhe_close" onClick={this.brand_unactive}>X</span>
                    </div>
                    <div className="flex_monitoring_list_choice" style={{width: '110%'}}>
                        <h3 className="flex_monitoring_choice_title">
                            侵权类型 :
                        </h3>
                        <div className='flex_monitoring_choice_cont shenhe_box' style={{margin: '20px auto'}}>
                            <Form>
                                <Row style={{width: '100%'}}>
                                    <Col span={12}>
                                        <div className="choices_moringlist" style={{width: '100%'}}>
                                            <input type="checkbox" className="vehicle" value="1" ref={1}
                                                   onClick={this.choseType}/> &nbsp;
                                            <img src={one} alt=""
                                                 className='vehicle_img'/> {localStorage.lan === "chinese" ? "突出使用logo" : "Logo Infringement"}
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div className="choices_moringlist" style={{width: '100%'}}>
                                            <input type="checkbox" className="vehicle" value="2"
                                                   onClick={this.choseType}/> &nbsp;
                                            <img src={two} alt=""
                                                 className='vehicle_img'/> {localStorage.lan === "chinese" ? "未生产" : "Non-Existent Product"}
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div className="choices_moringlist" style={{width: '100%'}}>
                                            <input type="checkbox" className="vehicle" value="3"
                                                   onClick={this.choseType}/> &nbsp;
                                            <img src={three} alt=""
                                                 className='vehicle_img'/> {localStorage.lan === "chinese" ? "真假对比" : "Comparison of Genuine Goods and Counterfeits"}
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div className="choices_moringlist" style={{width: '100%'}}>
                                            <input type="checkbox" className="vehicle" value="4"
                                                   onClick={this.choseType}/> &nbsp;
                                            <img src={four} alt=""
                                                 className='vehicle_img'/> {localStorage.lan === "chinese" ? "盗图/盗用文字" : "Copyright Infringement"}
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div className="choices_moringlist" style={{width: '100%'}}>
                                            <input type="checkbox" className="vehicle" value="5"
                                                   onClick={this.choseType}/> &nbsp;
                                            <img src={five} alt=""
                                                 className='vehicle_img'/> {localStorage.lan === "chinese" ? "滥用关键字" : "Brand Confusion"}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="choices_moringlist" style={{width: '100%'}}>
                                            <input type="checkbox" className="vehicle" value="7"
                                                   onClick={this.choseType}/> &nbsp;
                                            <img src={one} alt=""
                                                 className='vehicle_img'/> {localStorage.lan === "chinese" ? "著作权" : "Brand Confusion"}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="choices_moringlist" style={{width: '100%'}}>
                                            <input type="checkbox" className="vehicle" value="6"
                                                   onClick={this.choseType}/> &nbsp;
                                            <img src={six} alt=""
                                                 className='vehicle_img'/> {localStorage.lan === "chinese" ? "其他" : "Others"}
                                        </div>
                                    </Col>
                                </Row>
                                <ul className="choices_button">
                                    <Button type="primary" className="buttons shenhe tijiaoj"
                                            onClick={this.updateType}>{localStorage.lan === "chinese" ? "审核通过" : "Submit"}</Button>
                                    <Button type="primary" className="buttons qiyong no"
                                            onClick={this.offdateType}>{localStorage.lan === "chinese" ? "审核不通过" : "Cancel "}</Button>
                                </ul>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const MontioringList = Form.create()(MontioringLists);
MontioringList.contextTypes = {
    permission:PropTypes.array
}
export default MontioringList;
