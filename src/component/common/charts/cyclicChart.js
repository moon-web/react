import React, { Component } from 'react'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入饼图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default class CyclicChart extends Component {

  componentDidMount() {
    this.initCyclicChart()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapsed !== this.props.collapsed) {
      this.initCyclicChart()
    }
  }

  initCyclicChart() {
    let { options, id } = this.props;
    this.myPie = echarts.init(this.refs['cyclic' + id], 'light')
    this.myPie.setOption(options)
    this.myChart.resize()
  }

  setOption(value, name) {
    const option = {
      color: ['#ccc', '#6988dd'],
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: false,
              position: 'center',
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
              },
            }
          },
          data: [
            {
              value: 100 - value,
              name: ''
            },
            {
              value: value,
              name: name
            }
          ]
        }
      ]
    };
    return option;
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
