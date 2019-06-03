import React, { Component } from 'react';
import { message } from 'antd'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import './index.css'

export default class BarChart extends Component {
    constructor(props) {
        super(props)
        this.myChart = null;
    }

    initBarChart(data, intl) {
        let { id } = this.props;
        let _this = this;
        this.myChart = echarts.init(this.refs['barChart' + id], 'light')
        let options = this.createOptions(data, intl);
        let echartsConfig = echarts.config;
        this.myChart.on('click', function (param) {
            let options = _this.myChart.getOption();
            if (typeof param.seriesIndex !== 'undefined') {
                if (options.series[param.seriesIndex].rawdate[param.dataIndex] === '') {
                    message.warn('暂无店铺链接')
                } else {
                    window.open(options.series[param.seriesIndex].rawdate[param.dataIndex])
                }
            }
        });
        this.myChart.on('click', echartsConfig);
        this.myChart.setOption(options)
        this.myChart.resize()
    }

    componentDidMount() {
        let { data, intl } = this.props;
        this.initBarChart(data, intl)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data || nextProps.collapsed !== this.props.collapsed || nextProps.intl !== this.props.intl) {
            this.initBarChart(nextProps.data, nextProps.intl)
        }
    }

    createOptions(data, intl) {
        let seriesData = [];
        if (data.seriesData.length) {
            for (let i = 0; i < data.seriesData.length; i++) {
                const element = data.seriesData[i];
                seriesData.push({
                    name: intl.formatMessage({id: data.title, defaultMessage: ''}),
                    type: 'bar',
                    barWidth: '40%',
                    data: element.data,
                    rawdate: element.link
                })
            }
        }
        // if (data.xAxisData.length) {
        //     for (let i = 0; i < data.xAxisData.length; i++) {
        //         const element = data.xAxisData[i];
        //         xAxisData.push({
        //             type : 'category',
        //             data : element.data,
        //             axisTick: {
        //                 alignWithLabel: true
        //             }
        //         })
        //     }
        // }
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
            // xAxis: xAxisData,
            xAxis: [
                // 横坐标刻度
                {
                    type: 'category',
                    data: data.xAxisData,
                    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
            // series : [
            //     // 一个对象是一组数据  对象的data是对应横坐标的数据，
            //     {
            //         name:'直接访问',
            //         type:'bar',
            //         barWidth: '40%',
            //         data:[10, 52, 200, 334, 390, 330, 220]
            //     }
            // ]
        };
    }

    render() {
        let { id, title } = this.props;
        return (
            <div className="chart bar-chart">
                <div className="title-wrap">
                    {
                        title
                            ? <div className="chart-title">
                                {title}
                            </div>
                            : ''
                    }
                </div>
                <div className="chart-content" ref={'barChart' + id}></div>
            </div>
        )
    }
}