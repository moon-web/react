import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入饼图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default class PieChart extends Component {
    constructor(props) {
        super(props)
        this.myChart = null;
    }

    initPieChart(data, intl) {
        let { id } = this.props;
        this.myChart = echarts.init(this.refs['pieChart' + id], 'light')
        let options = this.createOptions(data, intl)
        this.myChart.setOption(options)
        this.myChart.resize()
    }

    componentDidMount() {
        let { data, intl } = this.props;
        this.initPieChart(data, intl)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data || nextProps.collapsed !== this.props.collapsed || nextProps.intl !== this.props.intl) {
            this.initPieChart(nextProps.data, nextProps.intl)
        }
    }

    // 按照饼图格式数据
    formatData(data, intl) {
        let result = [];
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                result.push({
                    name: intl.locale === 'en' ? element.xAxisEn : element.xAxis,
                    value: element.yAxis
                })
            }
        }
        return result;
    }

    // 创建配置
    createOptions(data, intl) {
        data = this.formatData(data, intl)
        let { titleId } = this.props
        return {
            color: ['#FFA540', '#6993FF'],
            tooltip: {
                trigger: 'item',
                formatter: `{a} <br/> {b} : {c} <br/> ${intl.formatMessage({id:"home.duty.ratio", defaultMessage: "占比"})}  {d}%`
            },
            label: {
                formatter: '{b}'
            },
            series: [
                {
                    name: intl.formatMessage({id: titleId, defaultMessage: ""}),
                    // name: '荆州',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    data: data,
                    // data: [{value:535, name: '荆州'},{value:510, name: '兖州'},{value:634, name: '益州'},{value:735, name: '西凉'}],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
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
                <div className="chart-content" ref={'pieChart' + id}></div>
            </div>
        )
    }
}
