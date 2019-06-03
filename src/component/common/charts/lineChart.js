import React, { Component } from 'react';
import { injectIntl } from 'react-intl'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { getButtonPrem } from '../../../utils/util'
class LineChart extends Component {
    constructor(props) {
        super(props)
        this.myChart = null;
        this.state = {
            echartsFlag: false,
            data: []
        }
    }

    initLineChart(data) {
        let { name, permissionList } = this.props
        if(name) {
            //let _this = this;
            this.myChart = echarts.init(this.refs.pieChart, 'light')
            let options = this.setLineOption(data)
            let echartsConfig = echarts.config;
            this.myChart.on('click', function (param) {
                //let options = _this.myChart.getOption();
                if (typeof param.data !== 'undefined' && param.data.auditStatus !== 10 && getButtonPrem(permissionList,'002005009')) {
                    window.open(`/brand/cleanStatistics?crawlerId=${param.data.crawlerId}&id=${param.data.lineIdDot}`)
                }
            });
            this.myChart.on('click', echartsConfig);
            this.myChart.setOption(options)
            this.myChart.resize()
        }else {
            this.myChart = echarts.init(this.refs.pieChart, 'light')
            let options = this.setLineOption(data)
            this.myChart.setOption(options)
            this.myChart.resize()
        }
    }


    componentDidMount() {
        this.initLineChart(this.props.data)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data || nextProps.collapsed !== this.props.collapsed || nextProps.intl !== this.props.intl) {
            this.initLineChart(nextProps.data)
        }
    }

    diuRandomize(b, e) {
        return (Math.random() * (e - b) + b).toFixed(2)
    }


    //这是一个最简单的饼图~
    setLineOption(data) {
        let { name} = this.props
        let seriesData = [];
        let tooltipTemp = {}
        let yAxisTemp
        if(name) {
            if (data && data.seriesData.length) {
                for (let i = 0; i < data.seriesData.length; i++) {
                    const element = data.seriesData[i];
                    for(let j = 0; j < element.data.length; j ++ ){
                        if(!element.data[j].waiteFlag){
                            element.data[j].label = {
                                show: true,
                                formatter: function (params) {
                                      return `待确认` 
                                }
                            }                             
                            element.data[j].itemStyle = {
                                borderColor: '#f00',
                                color: '#f00'
                            }                             
                            element.data[j].tooltip = {
                                textStyle: {
                                    color: '#f00'
                                } 
                            }                           
                        } 
                    }       
                    seriesData.push({
                        name: data.legendData[i],
                        type: 'line',
                        stack: i,
                        data: element.data,                        
                        symbolSize: 16               
                    })
                }
            }
            tooltipTemp = {
                trigger: 'axis',
                formatter: function (params) {
                    for (var i = 0; i < params.length; i++) {
                        return `<div style='display:flex;flex-direction:column'><span>${params[i].axisValue} : ${params[i].data.value}%</span><span>侵权量：${params[i].data.tortNum}</span><span>未侵权量：${params[i].data.monitorNum-params[i].data.tortNum}</span><span>总商品数：${params[i].data.monitorNum}</span></div>`;
                    }                    
                },
                axisPointer : {
                    color: '#000'
                },
                padding: 15,
                textStyle: {
                    lineHeight: 30,
                    fontSize: 16
                }
            }
            yAxisTemp = [{  
                type: 'value', 
                min:0, // 设置y轴刻度的最小值
                max:100, 
                axisLabel: {  
                    show: true,   
                    formatter: '{value} %'  
                },  
                show: true  
            }]
        }else {
            if (data && data.seriesData.length) {
                for (let i = 0; i < data.seriesData.length; i++) {
                    const element = data.seriesData[i];
                    seriesData.push({
                        name: data.legendData[i],
                        type: 'line',
                        stack: i,
                        data: element.data                
                    })
                }
            }
            tooltipTemp = {
                trigger: 'axis'
            }
            yAxisTemp = {
                type: 'value',
            }
        }
        return {
            tooltip: tooltipTemp,
            legend: {
                data: data.legendData
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.xAxisData,
                axisLabel: {
                    interval: 0,
                    rotate: -30,
                    margin: 30,
                    textStyle: {
                        align: 'center'
                    },
                },
            },
            yAxis: yAxisTemp,
            series: seriesData,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        };
    }

    render() {
        let { title } = this.props;
        return (
            <div className="chart line-chart" id={this.props.id} name={this.props.id}>
                <div className="title-wrap">
                    {
                        title
                            ? <div className="chart-title">
                                {title}
                            </div>
                            : ''
                    }
                </div>
                <div ref="pieChart" className="chart-content"></div>
            </div>
        )
    }
}

export default injectIntl(LineChart)