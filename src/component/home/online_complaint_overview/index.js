import React, { Component } from 'react';
import { Select, DatePicker, Button, Radio, Table, Card, Icon, Row, Col, Form, message } from 'antd';
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import mao from '../../../assets/images/mao.png'
import MapHead from './children/map_head'
// 地图
import MapChart from '../../common/charts/mapChart'
// 饼图
import PieChart from '../../common/charts/pieChart'
// 柱状图
import BarChart from '../../common/charts/barChart'
// 折线图
import LineChart from '../../common/charts/lineChart'
import './index.css'
import { formatDateToMs } from '../../../utils/util'

const Option = Select.Option;
const FormItem = Form.Item;

class OnlineComplaintOverview extends Component {
    constructor() {
        super();
        this.state = {
            brandId: undefined,
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            type: 'complaints',
            sign: 1,
            more: false,
            userType: localStorage.getItem('type'),
            userName: localStorage.getItem('userAccount'),
            searchData: {
                brandId: '0',
                gmtReportDateStart: '',
                gmtReportDateEnd: '',
                sign: 1
            }
        }
    }

    //初始化获取数据
    componentDidMount() {
        this._loadData()
    }

    // 刷新数据
    _RefreshData() {
        let { getRefresh, userInfo } = this.props;
        getRefresh({ userId: userInfo.userId }, () => this._loadData())
    }

    // 加载所有数据
    _loadData() {
        let {
            userInfo,
            getAccuracyRList,
            getComplainSourceList,
            getMonitorLegalrightsDriftList,
            getMonitorLegalrightsList,
            getPlatformList,
            getProdAreaList,
            getProdCategoryList,
            getReportWeekList,
            getStoreTopList,
            getTortsTypeList,
            getVideoList,
            getWechatList
        } = this.props;
        let { searchData } = this.state;
        searchData.userId = userInfo.userId;
        let fetchs = [
            getAccuracyRList,
            getComplainSourceList,
            getMonitorLegalrightsDriftList,
            getMonitorLegalrightsList,
            getPlatformList,
            getProdAreaList,
            getProdCategoryList,
            getReportWeekList,
            getStoreTopList,
            getTortsTypeList,
            getVideoList,
            getWechatList
        ]
        for (let i = 0; i < fetchs.length; i++) {
            setTimeout(() => {
                fetchs[i](searchData)
            }, (i + 1) * 200)
        }
    }

    // 点击跳转到顶部
    _handleClick() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    // 选择日期
    changeDatePicker(date, dateStr, type) {
        let { startTimeMs, endTimeMs } = this.state;
        if (type === 'startTime') {
            startTimeMs = formatDateToMs(dateStr);
        } else if (type === 'endTime') {
            endTimeMs = formatDateToMs(dateStr)
        }
        if (endTimeMs && (endTimeMs - startTimeMs < 0)) {
            let { intl } = this.props;
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range' }));
            return
        }
        if (type === 'startTime') {
            this.setState({
                startTimeMs,
                startTime: dateStr,
                startDate: date
            })
        } else {
            this.setState({
                endTimeMs,
                endTime: dateStr,
                endDate: date
            })
        }
    }

    // 点击切换 投诉量/删除量
    handleChange(e) {
        let sign = 1;
        if (e.target.value === 'delete') {
            sign = 2;
        }
        let searchData = this.state.searchData;
        searchData.sign = sign;
        this.setState({
            type: e.target.value,
            sign,
            searchData
        }, () => {
            this._loadData()
        })
    }

    // 搜索
    handleSearch() {
        let { brandId, sign, startTime, endTime } = this.state;
        let data = {
            brandId: brandId || '0',
            gmtReportDateStart: startTime || '',
            gmtReportDateEnd: endTime || '',
            sign
        }
        this.setState({
            searchData: data
        }, () => this._loadData())
    }

    //重置
    resetting() {
        this.setState({
            brandId: undefined,
            sign: 1,
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            searchData: {
                brandId: '0',
                gmtReportDateStart: '',
                gmtReportDateEnd: '',
                sign: 1
            }
        }, () => {
            this._loadData()
        })
    }

    // 渲染table
    _renderTable(columns, data, bordered, rowKey) {
        return (
            <Table
                size='middle'
                columns={columns}
                dataSource={data}
                bordered={bordered}
                rowKey={record => record[rowKey]}
                pagination={false} />
        )
    }

    // 显示更多概述
    showMore() {
        let { monitorLegalrightsList } = this.props;
        if (monitorLegalrightsList.length) {
            this.setState({
                more: !this.state.more
            })
        }
    }

    // 创建柱状图配置
    createBarChartOptions(data, title) {
        let seriesData = [];
        if (data.seriesData.length) {
            for (let i = 0; i < data.seriesData.length; i++) {
                const element = data.seriesData[i];
                seriesData.push({
                    name: title,
                    type: 'bar',
                    barWidth: '40%',
                    data: element.data,
                    rawdate: element.link
                })
            }
        }
        return {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                // 横坐标刻度
                {
                    type: 'category',
                    data: data.xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval: 0,
                        rotate: -30,
                        margin: 30,
                        textStyle: {
                            align: 'center'
                        },
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: seriesData
        };
    }

    // 创建品牌列表table
    createBrandColumns() {
        let intl = this.props.intl;
        const brandColumns = [
            {
                title: <FormattedMessage id="home.brand" defaultMessage="品牌" description="品牌" />,
                dataIndex: 'brandName',
                render: text => text === '所有' && intl.locale === 'en' ? 'All' : text
            }, {
                title: <FormattedMessage id="home.monitored.platform" defaultMessage="监控平台" description="监控平台" />,
                className: 'column-money',
                dataIndex: 'mPlatformNum',
            }, {
                title: <FormattedMessage id="home.monitored.store" defaultMessage="监控店铺" description="监控店铺" />,
                dataIndex: 'mStoreNum',
            }, {
                title: <FormattedMessage id="home.complaints.total.take.down.notices.submissions" defaultMessage="投诉商品" description="投诉商品" />,
                dataIndex: 'lTotalNum',
            }, {
                title: <FormattedMessage id="home.delete.complaints" defaultMessage="删除商品" description="删除商品" />,
                dataIndex: 'lSuccessNum',
            }, {
                title: <FormattedMessage id="home.complaints.deletion.rate" defaultMessage="删除率" description="删除率" />,
                dataIndex: 'lAccuracyRateStr',
            }, {
                title: <FormattedMessage id="home.total.anti.infringement.amount(CNY)" defaultMessage="停止侵害价值" description="停止侵害价值" />,
                dataIndex: 'stopEncroachValue',
            }
        ];
        return brandColumns;

    }

    // 创建top列表table
    createTopColumns() {
        const topColumns = [
            {
                title: <FormattedMessage id="home.number" defaultMessage="序号" description="序号" />,
                dataIndex: 'index',
                className: 'column-index',
                render: (text, record, index) => index + 1
            }, {
                title: <FormattedMessage id="home.shop.name" defaultMessage="店铺名称" description="店铺名称" />,
                dataIndex: 'storeName',
                className: 'column-store-name',
                render: (text, record) => record.storeLink ? <a target="_blank" href={record.storeLink}>{text}</a> : text,
            }, {
                title: <FormattedMessage id="global.platform" defaultMessage="平台" description="平台" />,
                dataIndex: 'fullname',
                render: (text, item) => item.fullnameEng ? <FormattedMessage id={item.fullnameEng} defaultMessage={text} description={text} /> : text
            }, {
                title: <FormattedMessage id="home.complaints.total.take.down.notices.submissions" defaultMessage="投诉商品数" description="投诉商品数" />,
                dataIndex: 'cNum',
            }
        ];
        return topColumns;
    }

    render() {
        let { type, more, brandId, userName, userType, startDate, endDate } = this.state;
        let { intl, brandList, accuracyRList, complainSourceList, monitorLegalrightsDriftList,
            monitorLegalrightsList, platformList, prodAreaList, prodCategoryList, reportWeekList,
            storeTopList, tortsTypeList, videoList, wechatList, lTotalNum, totalNum, totalNums, collapsed } = this.props;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.online.complaints.overview', title: '线上投诉概况' }
        ]
        if (reportWeekList) {
            reportWeekList.legendData = [
                type === 'complaints'
                    ? intl.formatMessage({ id: "home.total.user.complaints", defaultMessage: "用户投诉数量", description: "用户投诉数量" })
                    : intl.formatMessage({ id: "home.total.user.delete", defaultMessage: "用户删除数量", description: "用户删除数量" })
            ]
        }
        if (monitorLegalrightsDriftList) {
            monitorLegalrightsDriftList.legendData = [
                intl.formatMessage({ id: "home.trend.of.complaints.total.take.down.notices.submission", defaultMessage: "数量趋势", description: "数量趋势" })
            ]
        }
        if (complainSourceList) {
            complainSourceList.legendData = [
                intl.formatMessage({ id: "global.complaint.source.system", defaultMessage: "系统抓取", description: "系统抓取" }),
                intl.formatMessage({ id: "global.complaint.source.user.report", defaultMessage: "用户举报", description: "用户举报" })
            ]
        }
        if (accuracyRList) {
            accuracyRList.legendData = [
                intl.formatMessage({ id: "home.trend.of.complaints.deletion.rate", defaultMessage: "删除率趋势", description: "删除率趋势" })
            ]
        }
        let categoryTitle, tortsTitle, platformTitle, videoTitle, wechatTitle;
        if (type === 'complaints') {
            storeTopList.data.title = "home.total.complaints"
            categoryTitle = intl.formatMessage({ id: "home.complaints.take.downs.by.category", defaultMessage: "类目分布", description: "类目分布" })
            tortsTitle = intl.formatMessage({ id: "home.complaints.take.downs.by.infringing.type", defaultMessage: "侵权类型分布", description: "侵权类型分布" })
            platformTitle = intl.formatMessage({ id: "home.complaints.take.downs.by.platform", defaultMessage: "平台分布", description: "平台分布" })
            videoTitle = intl.formatMessage({ id: "home.total.complaints.on.video.website", defaultMessage: "视频网站投诉量", description: "视频网站投诉量" })
            wechatTitle = intl.formatMessage({ id: "home.total.complaints.on.wechat", defaultMessage: "微信投诉量", description: "微信投诉量" })
        } else {
            storeTopList.data.title = "home.total.take.downs"
            categoryTitle = intl.formatMessage({ id: "home.total.take.downs.by.category", defaultMessage: "类目分布", description: "类目分布" })
            tortsTitle = intl.formatMessage({ id: "home.total.take.downs.by.infringing.type", defaultMessage: "侵权类型分布", description: "侵权类型分布" })
            platformTitle = intl.formatMessage({ id: "home.total.take.downs.by.platform", defaultMessage: "平台分布", description: "平台分布" })
            videoTitle = intl.formatMessage({ id: "home.total.delete.on.video.website", defaultMessage: "视频网站投诉量", description: "视频网站投诉量" })
            wechatTitle = intl.formatMessage({ id: "home.total.delete.on.wechat", defaultMessage: "微信投诉量", description: "微信投诉量" })
        }
        return (
            <Content className="kanban operating" breadcrumbData={breadcrumbData}>
                <div className='kanban-container'>
                    <div className="kanban-header">
                        <div className="cells">
                            <div className="cell title">
                                {
                                    userName && userType === '0'
                                        ? userName
                                        : <div><FormattedMessage id="global.ip.commune" defaultMessage="IP公社" description="IP公社" /></div>
                                }
                            </div>
                        </div>
                        <div className="cells">
                            <div className="cell">
                                <Radio.Group value={type} onChange={e => this.handleChange(e)}>
                                    <Radio.Button value="complaints"><FormattedMessage id="home.total.complaints" defaultMessage="投诉量" description="投诉量" /></Radio.Button>
                                    <Radio.Button value="delete"><FormattedMessage id="home.total.take.downs" defaultMessage="删除量" description="删除量" /></Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className="search-form">
                            <Row>
                                <Col span={6}>
                                    <FormItem label={intl.formatMessage({ id: "home.statistical.brand", defaultMessage: "统计品牌", description: "统计品牌" })}>
                                        <Select
                                            className="select"
                                            showSearch
                                            value={brandId}
                                            placeholder={intl.formatMessage({ id: 'report.please.select.your.own.brand', defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                            onChange={value => this.setState({ brandId: value })}
                                            filterOption={(input, option) => option.props.value === '0' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Option value="0"><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                            {
                                                brandList && brandList.filter(item => item.isDelete === 0)
                                                    .map(v => (
                                                        <Option value={v.id} key={v.id}>{v.name}</Option>
                                                    ))
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
                                        <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')} value={startDate} />
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
                                        <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')} value={endDate} />
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <div className="search-form-btns">
                                        <Button type="primary" onClick={() => this.handleSearch()}>
                                            <FormattedMessage id="global.search" defaultMessage="搜索" description="搜索" />
                                        </Button>
                                        <Button onClick={() => this.resetting()}>
                                            <FormattedMessage id="global.reset" defaultMessage="重置" description="重置" />
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className='kanban-content'>
                        <Card
                            title={intl.formatMessage({ id: "home.brand.data.summary", defaultMessage: "品牌概述", description: "品牌概述" })}>
                            <div className="table-wrap" style={{ width: '100%', height: more ? 'auto' : '276px', overflow: 'hidden', position: 'relative' }}>
                                {this._renderTable(this.createBrandColumns(), monitorLegalrightsList, false, 'brandId')}
                            </div>
                            {
                                monitorLegalrightsList.length > 5
                                    ? (
                                        <div style={{ textAlign: 'right', paddingTop: '15px' }}>
                                            <a onClick={() => this.showMore()}>
                                                {
                                                    more
                                                        ? <FormattedMessage id="home.pack.up" defaultMessage="收起" description="收起" />
                                                        : <FormattedMessage id="global.more" defaultMessage="更多" description="更多" />
                                                }
                                                <Icon type={more ? 'up' : 'down'} />
                                            </a>
                                        </div>
                                    )
                                    : ''
                            }
                        </Card>
                    </div>
                    <div className='kanban-content'>
                        <Card
                            title={
                                type === 'complaints'
                                    ? intl.formatMessage({ id: "home.total.take.downs.by.source", defaultMessage: "投诉商品分布", description: "投诉商品分布" })
                                    : intl.formatMessage({ id: "home.delete.product.distribution", defaultMessage: "删除商品分布", description: "删除商品分布" })

                            }>
                            <MapHead data={lTotalNum} jinum={100000} />
                            <div>
                                <MapChart
                                    collapsed={collapsed}
                                    data={prodAreaList}
                                    type={type}
                                    intl={intl}
                                />
                                <div className="pie-wrappwer header-high">
                                    <div className="pie-pisition">
                                        <PieChart
                                            collapsed={collapsed}
                                            // options={this.createPieChartOptions(prodCategoryList, categoryTitle)}
                                            data={prodCategoryList}
                                            title={categoryTitle}
                                            titleId={type === 'complaints' ? 'home.complaints.take.downs.by.category' : 'home.total.take.downs.by.category'}
                                            intl={intl}
                                            id="Category" />
                                        {
                                            prodCategoryList.length > 0
                                                ? ''
                                                : (
                                                    <div className="zanwu-history">
                                                        <FormattedMessage id="home.no.historical.data.yet" defaultMessage="暂无历史数据" description="暂无历史数据" />
                                                    </div>
                                                )
                                        }
                                    </div>
                                    <div className="pie-pisition">
                                        <PieChart
                                            collapsed={collapsed}
                                            // options={this.createPieChartOptions(tortsTypeList, tortsTitle)}
                                            data={tortsTypeList}
                                            title={tortsTitle}
                                            titleId={type === 'complaints' ? 'home.complaints.take.downs.by.infringing.type' : 'home.total.take.downs.by.infringing.type'}
                                            intl={intl}
                                            id="Type" />
                                        {
                                            tortsTypeList.length > 0
                                                ? ''
                                                : (
                                                    <div className="zanwu-history">
                                                        <FormattedMessage id="home.no.historical.data.yet" defaultMessage="暂无历史数据" description="暂无历史数据" />
                                                    </div>
                                                )
                                        }
                                    </div>
                                    <div className="pie-pisition">
                                        <PieChart
                                            id="platform"
                                            collapsed={collapsed}
                                            // options={this.createPieChartOptions(platformList, platformTitle)}
                                            data={platformList}
                                            title={platformTitle}
                                            titleId={type === 'complaints' ? 'home.complaints.take.downs.by.platform' : 'home.total.take.downs.by.platform'}
                                            intl={intl}
                                        />
                                        {
                                            platformList.length > 0
                                                ? ''
                                                : (
                                                    <div className="zanwu-history">
                                                        <FormattedMessage id="home.no.historical.data.yet" defaultMessage="暂无历史数据" description="暂无历史数据" />
                                                    </div>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className='kanban-content'>
                        <Card
                            title={
                                type === 'complaints'
                                    ? intl.formatMessage({ id: "home.trend.of.complaints", defaultMessage: "投诉趋势", description: "投诉趋势" })
                                    : intl.formatMessage({ id: "home.delete.trend", defaultMessage: "删除商品趋势", description: "删除商品趋势" })
                            }>
                            <div className="pie-wrappwer header-high">
                                <div className="pie-pisition">
                                    <LineChart collapsed={collapsed} data={complainSourceList} title={intl.formatMessage({ id: "home.trend.of.source", defaultMessage: "来源趋势", description: "来源趋势" })} id="source" />
                                </div>
                                <div className="pie-pisition">
                                    <LineChart collapsed={collapsed} data={monitorLegalrightsDriftList} title={intl.formatMessage({ id: "home.trend.of.complaints.total.take.down.notices.submission", defaultMessage: "数量趋势", description: "数量趋势" })} id="Complaint" />
                                </div>
                                <div className="pie-pisition">
                                    <LineChart collapsed={collapsed} data={accuracyRList} title={intl.formatMessage({ id: "home.trend.of.complaints.deletion.rate", defaultMessage: "删除率趋势", description: "删除率趋势" })} id="delete" />
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className='kanban-content'>
                        <Card
                            title={
                                type === 'complaints'
                                    ? intl.formatMessage({ id: "home.complaints.top.shop", defaultMessage: "投诉店铺TOP", description: "投诉店铺TOP" })
                                    : intl.formatMessage({ id: "home.delete.top.shop", defaultMessage: "删除店铺TOP", description: "删除店铺TOP" })
                            }>
                            <div className="pie-wrappwer no_align">
                                <div className="bar-complaints">
                                    <BarChart
                                        collapsed={collapsed}
                                        // options={this.createBarChartOptions(storeTopList.data, storeTopList.data.title) }
                                        data={storeTopList.data}
                                        title={
                                            type === 'complaints'
                                                ? intl.formatMessage({ id: "home.total.complaints", defaultMessage: "投诉量", description: "投诉量" })
                                                : intl.formatMessage({ id: "home.total.take.downs", defaultMessage: "删除量", description: "删除量" })
                                        }
                                        titleId={type === 'complaints' ? 'home.total.complaints' : 'home.total.take.downs'}
                                        intl={intl}
                                        id="amount"
                                    />
                                </div>
                                <div className='complaints-tabel-wrap'>
                                    {
                                        this._renderTable(this.createTopColumns(), storeTopList.tableData, false, 'storeName')
                                    }
                                </div>
                            </div>
                        </Card>
                    </div >
                    {/* <div className='kanban-content'>
                        <Card
                            className="user-complaints"
                            title={
                                type === 'complaints'
                                    ? intl.formatMessage({ id: "home.total.user.complaints", defaultMessage: "用户投诉数量", description: "用户投诉数量" })
                                    : intl.formatMessage({ id: "home.total.user.delete", defaultMessage: "用户删除数量", description: "用户删除数量" })
                            }>
                            <LineChart
                                collapsed={collapsed}
                                data={reportWeekList}
                                id="report"
                                title={
                                    type === 'complaints'
                                        ? intl.formatMessage({ id: "home.total.user.complaints", defaultMessage: "用户投诉数量", description: "用户投诉数量" })
                                        : intl.formatMessage({ id: "home.total.user.delete", defaultMessage: "用户删除数量", description: "用户删除数量" })

                                } />
                        </Card>
                    </div > */}
                    <div className='kanban-content clearfix'>
                        <div className="wechat">
                            <Card
                                title={
                                    type === 'complaints'
                                        ? intl.formatMessage({ id: "home.total.complaints.on.video.website", defaultMessage: "视频网站投诉量", description: "视频网站投诉量" })
                                        : intl.formatMessage({ id: "home.total.delete.on.video.website", defaultMessage: "视频网站删除量", description: "视频网站删除量" })
                                }
                            >
                                <div className="pie-pisition">
                                    <MapHead data={totalNum} jinum={10000} />
                                    <PieChart
                                        collapsed={collapsed}
                                        // options={this.createPieChartOptions(videoList, videoTitle)}
                                        data={videoList}
                                        title={videoTitle}
                                        titleId={type === 'complaints' ? 'home.total.complaints.on.video.website' : 'home.total.delete.on.video.website'}
                                        intl={intl}
                                        id="Video"
                                    />
                                    {
                                        videoList.length > 0
                                            ? ''
                                            : (
                                                <div className="zanwu-history">
                                                    <FormattedMessage id="home.no.historical.data.yet" defaultMessage="暂无历史数据" description="暂无历史数据" />
                                                </div>
                                            )
                                    }
                                </div>
                            </Card>
                        </div>
                        <div className="video">
                            <Card
                                title={
                                    type === 'complaints'
                                        ? intl.formatMessage({ id: "home.total.complaints.on.wechat", defaultMessage: "微信投诉量", description: "微信投诉量" })
                                        : intl.formatMessage({ id: "home.total.delete.on.wechat", defaultMessage: "微信删除量", description: "微信删除量" })
                                }
                            >
                                <div className="pie-pisition">
                                    <MapHead data={totalNums} jinum={10000} />
                                    <PieChart
                                        collapsed={collapsed}
                                        // options={this.createPieChartOptions(wechatList, wechatTitle)}
                                        data={wechatList}
                                        title={wechatTitle}
                                        titleId={type === 'complaints' ? 'home.total.complaints.on.wechat' : 'home.total.delete.on.wechat'}
                                        intl={intl}
                                        id="wechart"
                                    />
                                    {
                                        wechatList.length > 0
                                            ? ''
                                            : (
                                                <div className="zanwu-history">
                                                    <FormattedMessage id="home.no.historical.data.yet" defaultMessage="暂无历史数据" description="暂无历史数据" />
                                                </div>
                                            )
                                    }
                                </div>
                            </Card>
                        </div>
                    </div >
                </div >
                <div className="to-top" onClick={() => this._handleClick()} >
                    <img src={mao} alt="top" />
                </div>

            </Content >
        )
    }
}
export default OnlineComplaintOverview