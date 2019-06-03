import React, { Component } from 'react'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入饼图
import 'echarts/lib/chart/pie';
export default class Pie extends Component {

  componentDidMount() {
    this.initPie()
  }

  initPie() {
    let { value, name, title } = this.props;
    this.myPie = echarts.init(this.refs['pie' + title], 'light')
    let option = this.setOption(value, name)
    this.myPie.setOption(option)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      let { value, name } = nextProps;
      let option = this.setOption(value, name)
      this.myPie.setOption(option)
    }
  }

  setOption(value, name) {
    const option = {
      color: ['#ccc', '#6988dd'],
      title: {
        textStyle: {
          color: '#333',
          fontSize: 16,
        }
      },
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
    let title = this.props.title;
    return (
      <div className='pie_wrap'>
        <div ref={'pie' + title} className='pie'>

        </div>
      </div>
    )
  }
}
