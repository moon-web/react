import React, { Component } from 'react';
import { injectIntl } from 'react-intl'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入饼图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class PieChart extends Component {
    constructor(props) {
        super(props)
        this.myChart = null;
        this.state = {
            data: [],
        }
    }

    initPieChart() {
        this.myChart = echarts.init(this.refs.pieChart, 'light')
        // let options = this.setPieOption([])
        // this.myChart.setOption(options)
        // options = this.setPieOption(this.state.data)
        let options = this.props.options;
        this.myChart.setOption(options)
    }

    componentDidMount() {
        this.setState({
            data: this.props.data
        }, () => {
            this.initPieChart()
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data || nextProps.intl.locale !== this.props.intl.locale) {
            this.setState({
                data: nextProps.data
            }, () => {
                this.initPieChart()
            })
        }
    }

    //这是一个最简单的饼图~
    setPieOption(data) {
        let {intl, title} = this.props;
        let result = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                element.value = element.yAxis;
                if (intl.locale === 'zh') {
                    element.name = element.xAxis
                } else {
                    element.name = element.xAxisEn
                }
                result.push(element)
            }
        }
        return {
            color: ['#FFA540', '#6993FF'],
            tooltip: {
                trigger: 'item',
                formatter: `{a} <br/>{b} : ￥{c} <br/> ${intl.locale === 'zh' ? '占比' : 'Duty Ratio'}: {d}%`
            },
            label: {
                formatter: '{b} \n ￥{c}'
            },
            series: [
                {
                    name: title,
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    data: result,
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
        return (
            <div className="pie-chart" id={this.props.id} name={this.props.id}>
                <div className="pie-chart-title">
                    {this.props.title}
                </div>
                <div className="pie-react" ref='infoinner'>
                    <div ref="pieChart" className="pie-chart-content" style={{ width: '100%', height: "350px", margin: '0 auto' }}></div>
                </div>
            </div>
        )
    }
}

export default injectIntl(PieChart)