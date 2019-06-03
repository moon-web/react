import React, { Component } from 'react';
import { Table } from 'antd';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/map';
import 'echarts/map/js/china';

// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

const nameMapEn = {
    '新疆': 'Sinkiang',
    '西藏': 'Tibet',
    '青海': 'Qinghai',
    '甘肃': 'Gansu',
    '宁夏': 'Ningxia',
    '内蒙古': 'Inner Mongolia',
    '陕西': 'Shaanxi',
    '山西': 'Shanxi',
    '四川': 'Sichuan',
    '云南': 'Yunnan',
    '重庆': 'Chungking',
    '贵州': 'Guizhou',
    '河南': 'Henan',
    '湖北': 'Hubei',
    '湖南': 'Hunan',
    '广西': 'Guangxi',
    '河北': 'Hebei',
    '北京': 'Beijing',
    '天津': 'Tianjin',
    '山东': 'Shandong',
    '安徽': 'Anhui',
    '江西': 'Jiangxi',
    '广东': 'Guangdong',
    '江苏': 'Jiangsu',
    '上海': 'Shanghai',
    '浙江': 'Zhejiang',
    '福建': 'Fujian',
    '辽宁': 'Liaoning',
    '吉林': 'Jilin',
    '黑龙江': 'Heilongjiang',
    '海南': 'Hainan',
    '澳门': 'Macao',
    '香港': 'Hong Kong',
    '台湾': 'Taiwan',
    '南海诸岛': 'South China Sea Islands'
}

export default class MapChart extends Component {
    constructor(props) {
        super(props)
        this.myChart = null;
    }

    componentDidMount() {
        let { data, intl } = this.props;
        this.initMapChart(data, intl)    
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data || nextProps.collapsed !== this.props.collapsed || nextProps.intl !== this.props.intl) {
            this.initMapChart(nextProps.data, nextProps.intl)
        }
    }

    // 初始化图标组件
    initMapChart(data, intl) {
        // 基于准备好的dom，初始化echarts实例
        // 绘制图表
        this.myChart = echarts.init(this.refs.mapChart);
        let options = this.createMapChartOptions(data, intl)
        this.myChart.setOption(options);
        this.myChart.resize()
    }

    // 创建图标配置
    createMapChartOptions(data, intl) {
        data = this.formatMapChartData(data, intl)
        let low = intl.formatMessage({ id: "home.low", defaultMessage: "低", description: "低" });
        let high = intl.formatMessage({ id: "home.high", defaultMessage: "高", description: "高" });
        return {
            tooltip: {
                trigger: 'item',
                formatter: function (data) {
                    if (!isNaN(data.value)) {
                        return data.name + "：" + data.value;
                    }
                }
            },
            visualMap: {
                seriesIndex: 0,
                min: 0,
                left: 'left',
                top: 'bottom',
                text: [high, low], // 文本，默认为数值文本
                calculable: false,//设置不可拖动
                inRange: { color: ["#bae7ff", "#1890ff"] }
            },
            grid: {
                height: 200,
                width: 8,
                right: 80,
                bottom: 10
            },
            xAxis: {
                type: 'category',
                data: [],
                splitNumber: 1,
                show: false
            },
            yAxis: {
                position: 'right',
                min: 0,
                max: 20,
                splitNumber: 20,
                inverse: true,
                axisLabel: {
                    show: true
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                data: []
            },
            calculable: false,
            series: [{
                zlevel: 1,
                name: '中国',
                type: 'map',
                mapType: 'china',
                selectedMode: 'multiple',
                left: 0,
                right: '15%',
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: data,
                nameMap: intl.locale === 'en' ? nameMapEn : ''
            }]
        }
    }

    // 格式化数据
    formatMapChartData(data, intl) {
        data = data || []
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                element.name = intl.locale === 'en' ? element.xAxisEn : element.xAxis;
                element.value = element.yAxis;
            }
        }
        return data;
    }

    render() {
        let { intl, type, data } = this.props;
        const columns = [{
            title: intl.formatMessage({ id: "home.province", defaultMessage: "省份", description: "省份" }),
            dataIndex: 'name',
            key: 'name',
            width: '50%',
        }, {
            title: (
                type === 'complaints'
                    ? intl.formatMessage({ id: "home.total.complaints", defaultMessage: "投诉量", description: "投诉量" })
                    : intl.formatMessage({ id: "home.total.take.downs", defaultMessage: "删除量", description: "删除量" })
            ),
            dataIndex: 'value',
            key: 'value',
            width: '50%',
            sorter: (a, b) => a.value - b.value
        }]
        return (
            <div>
                <div style={{ background: '#fff', padding: '0 10px' }}>
                    <div className="maptubiao">
                        <div className="map_wrap">
                            <div ref="mapChart" id='Enterprises' style={{ width: '100%', maxWidth: "850px", height: "580px", margin: 'auto' }}></div>
                        </div>
                        <div className="Map_data" id="#scroll">
                            <Table 
                                columns={columns} 
                                pagination={false} 
                                rowKey='name' 
                                dataSource={data} 
                                scroll={{ y: 465 }} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


