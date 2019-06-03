import React, { Component } from 'react'
import Content from '../../common/layout/content/index'
import { Form, Col, Row, Table, Button, Select, Card } from 'antd'
import { FormattedMessage } from 'react-intl'
import CleanlinesTrend from './children/cleanlinesTrend/connect'
import HistoryModal from './children/historyModal.js'
import { getButtonPrem } from '../../../utils/util'
import './index.css'
class BrandCleanliness extends Component {
    constructor() {
        super()
        this.state = {
            brandId: undefined,
            platformType: '',
            trendVisible: false,
            historyVisible: false,
            activeTabKey: '1',
            searchData: {
                brandId: '',
                platformType: ''
            },
            tortNum: '',
            monitorNum: '',
            gmtMonitor: '',
            historyBrandId: '',
            historyId: ''
        }
    }
    componentWillMount() {
        let { history, brandList } = this.props
        if (history.action !== 'POP' && !history.location.query) {
            if (brandList && brandList.length > 0) {
                this.setState({
                    brandId: brandList[0].id
                })
                let data = {
                    brandId: brandList[0].id
                }
                this.getCommonData(data)
            } else {
                this.props.getNoBrandCleanlinessData()
            }
        } else {
            let { cleanlinessSearchData } = this.props
            if (brandList && brandList.length > 0) {
                if (cleanlinessSearchData) {
                    this.setState({
                        brandId: cleanlinessSearchData.brandId,
                    })
                    let data = {
                        brandId: cleanlinessSearchData.brandId
                    }
                    this.getCommonData(data, cleanlinessSearchData)
                } else {
                    this.setState({
                        brandId: brandList[0].id
                    })
                    let data = {
                        brandId: brandList[0].id
                    }
                    this.getCommonData(data)
                }
            }
        }
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.brandList !== this.props.brandList && nextprops.brandList.length > 0) {
            this.setState({
                brandId: nextprops.brandList[0].id
            })
            let data = {
                brandId: nextprops.brandList[0].id
            }
            this.getBrandCleanlinessPlatform(data, () => {
                if (nextprops.brandCleanlinessPlatform !== this.props.brandCleanlinessPlatform && this.props.brandCleanlinessPlatform.length > 0) {
                    let { searchData } = this.state
                    searchData.platformType = this.props.brandCleanlinessPlatform[0].key
                    searchData.brandId = nextprops.brandList[0].id
                    this.setState({
                        activeTabKey: this.props.brandCleanlinessPlatform[0].key.toString(),
                        platformType: this.props.brandCleanlinessPlatform[0].key,
                        searchData
                    }, () => this.getBrandCleanlinessList([]))
                }
            })
        }
    }
    //componentWillMount中公共部分
    getCommonData(data, otherdata) {
        this.getBrandCleanlinessPlatform(data, () => {
            let { brandCleanlinessPlatform } = this.props
            if (brandCleanlinessPlatform && brandCleanlinessPlatform.length > 0) {
                let { searchData, activeTabKey, platformType } = this.state
                searchData.platformType = otherdata && otherdata.platformType ? otherdata.platformType.toString() : brandCleanlinessPlatform[0].key
                searchData.brandId = data.brandId
                activeTabKey = otherdata && otherdata.platformType ? otherdata.platformType.toString() : brandCleanlinessPlatform[0].key.toString()
                platformType = otherdata && otherdata.platformType ? otherdata.platformType.toString() : brandCleanlinessPlatform[0].key
                this.setState({
                    activeTabKey,
                    platformType,
                    searchData
                }, () => this.getBrandCleanlinessList([]))
            }else {
                this.props.getNoBrandCleanlinessData()
            }
        })
    }
    // 改变品牌
    handleSelectChange(value, key) {
        let { searchData } = this.state
        searchData[key] = value
        this.setState({
            [key]: value,
            searchData
        })
        let data = {
            brandId: value
        }
        this.getBrandCleanlinessPlatform(data, () => {
            let { brandCleanlinessPlatform } = this.props
            if (brandCleanlinessPlatform && brandCleanlinessPlatform.length > 0) {
                let { searchData } = this.state
                searchData.platformType = brandCleanlinessPlatform[0].key
                searchData.brandId = value
                this.setState({
                    activeTabKey: brandCleanlinessPlatform[0].key.toString(),
                    platformType: brandCleanlinessPlatform[0].key,
                    searchData
                }, () => this.getBrandCleanlinessList([]))
            } else {
                this.props.getNoBrandCleanlinessData()
            }
        })
    }
    //获取品牌下的平台
    getBrandCleanlinessPlatform(data, callback) {
        let { getBrandCleanlinessPlatformData } = this.props
        getBrandCleanlinessPlatformData(data, callback)
    }
    //获取数据
    getBrandCleanlinessList(oldbrandCleanlinessListData) {
        let { searchData } = this.state
        let { getBrandCleanlinessListdata } = this.props
        let data = Object.assign({}, searchData);
        getBrandCleanlinessListdata(data, oldbrandCleanlinessListData)
    }
    // 切换类型
    onTabChange(key) {
        let { searchData, brandId } = this.state;
        searchData.platformType = key;
        searchData.brandId = brandId;
        this.setState({
            platformType: key,
            activeTabKey: key,
            searchData
        }, () => this.getBrandCleanlinessList([]))
    }

    //洁净度趋势取消
    cleanlinesTrendModalCancel() {
        this.setState({
            trendVisible: false
        })
    }
    //查看洁净度趋势
    openTrendModal(record) {
        this.setState({
            trendVisible: true,
            modalDataId: record.id
        })
    }
    //立即监控
    cleanlinessImmediate(record) {
        let { brandCleanlinessImmediate } = this.props
        let data = {
            id: record.id
        }
        brandCleanlinessImmediate(data, () => {
            this.getBrandCleanlinessList([])
        })
    }
    //停止/启用
    cleanlinessStopOrEnable(record, type) {
        let { brandCleanOn, brandCleanOff, brandCleanlinessListData } = this.props
        let data = {
            id: record.id
        }
        if (type === 'stop') {
            brandCleanOff(data, brandCleanlinessListData)
        } else {
            brandCleanOn(data, brandCleanlinessListData)
        }
    }
    //删除
    cleanlinessDelete(record, type) {
        let { brandCleanlinessDel, cleanlinessSearchData } = this.props
        let data = {
            id: record.id
        }
        brandCleanlinessDel(data, () => {
            let { brandId } = this.state
            let data = {
                brandId: brandId
            }
            this.getBrandCleanlinessPlatform(data, () => {
                let { brandCleanlinessPlatform, brandCleanlinessListData } = this.props
                if (brandCleanlinessPlatform.length === 0 && brandCleanlinessListData.length === 1) {
                    let { searchData } = this.state
                    searchData.platformType = ''
                    searchData.brandId = brandId
                    this.setState({
                        searchData
                    }, () => this.getBrandCleanlinessList([]))
                } else {
                    if (brandCleanlinessPlatform && brandCleanlinessPlatform.length > 0) {
                        let { searchData, activeTabKey, platformType } = this.state
                        searchData.platformType = cleanlinessSearchData && cleanlinessSearchData.platformType ? cleanlinessSearchData && cleanlinessSearchData.platformType : brandCleanlinessPlatform[0].key
                        searchData.brandId = brandId
                        activeTabKey = cleanlinessSearchData && cleanlinessSearchData.platformType ? cleanlinessSearchData && cleanlinessSearchData.platformType.toString() : brandCleanlinessPlatform[0].key.toString()
                        platformType = cleanlinessSearchData && cleanlinessSearchData.platformType ? cleanlinessSearchData && cleanlinessSearchData.platformType : brandCleanlinessPlatform[0].key
                        this.setState({
                            searchData,
                            activeTabKey,
                            platformType
                        }, () => this.getBrandCleanlinessList([]))
                    }
                }
            })
        })
    }

    //获取历史数据
    cleanlinessHistory(record) {
        this.setState({
            historyVisible: true,
            historyBrandId: record.brandId,
            historyId: record.id
        })
    }
    //获取历史数据确定
    cleanlinesHistoryModalOk(value) {
        let { historyBrandId, historyId } = this.state
        let { brandCleanHistory } = this.props
        let data = {
            brandId: historyBrandId,
            id: historyId,
            tortNum: value.tortNum,
            monitorNum: value.monitorNum,
            gmtMonitor: value.gmtMonitor
        }
        brandCleanHistory(data, () => {
            this.setState({
                historyVisible: false
            })
        })
    }
    //获取历史数据取消
    cleanlinesHistoryModalCancel() {
        this.setState({
            historyVisible: false
        })
    }
    //渲染洁净度条件
    renderKeyCondition(record) {
        let { intl } = this.props;
        return (
            <div className="table-info">            
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="monitor.keyword" defaultMessage="关键字" description="关键字" /> : {record.keyword}
                    </span>
                </p>
                {
                    record.minPriceFormat ||  record.maxPriceFormat?
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                            <FormattedMessage id="global.crawler.filter.type.price" defaultMessage="价格" description="价格" /> : {record.minPriceFormat ? record.minPriceFormat : 0} - {record.maxPriceFormat ? record.maxPriceFormat : '∞'}
                            </span>
                        </p> : ''
                }
                {
                    record.consignmentPlace ?
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="global.crawler.filter.type.place.of.delivery" defaultMessage="发货地" description="发货地" /> : {record.consignmentPlace}
                            </span>
                        </p> : ''
                }
                {
                    record.maxPage ?
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="monitor.query.range" defaultMessage="查询范围" description="查询范围" values={{ number: record.maxPage }} /> : <FormattedMessage id="brand.query.range.page" defaultMessage={`前${record.maxPage}页`} description={`前${record.maxPage}页`} values={{ number: record.maxPage }} />
                            </span>
                        </p> : ''
                }
                {
                    record.sortCondition ?
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="monitor.sort.type" defaultMessage="排序类型" description="排序类型" /> : {intl.locale === 'en' ? record.sortConditionNameEn : record.sortConditionName}
                            </span>
                        </p> : ''
                }
            </div>
        )
    }
    //渲染周期
    functionWeek(data) {
        return (
            <FormattedMessage id={`brand.weekly.time.week${data}`} defaultMessage="每周" description="每周" />
        )
    }
    //渲染监控周期
    renderCycle(record) {
        return (
            record.deliverUnitName ?
                <div>
                    {
                        record.deliverUnit === 2 ?
                            <span>
                                <FormattedMessage id="brand.weekly.time" defaultMessage="每周" description="每周" />/{this.functionWeek(record.gmtDeliverDate)}
                            </span> :
                            <span>
                                <FormattedMessage id="brand.monthly.time" defaultMessage={`每月/${record.gmtDeliverDate}号`} description={`每月/${record.gmtDeliverDate}号`} values={{ number: record.gmtDeliverDate }} />
                            </span>
                    }
                </div> :
                <FormattedMessage id="brand.interaction.brand.no.data" defaultMessage="暂无" />
        )
    }
    //渲染操作
    renderOperate(record) {
        let { permissionList } = this.props
        return (
            <div>
                {
                    record.status === 1 && getButtonPrem(permissionList, '002005004') ?
                        <div>
                            <a onClick={() => this.cleanlinessStopOrEnable(record, 'stop')}>
                                <FormattedMessage id="global.stop" defaultMessage="停止" description="停止" />
                            </a>
                        </div>
                        :
                        getButtonPrem(permissionList, '002005003') ?
                            <div>
                                <a onClick={() => this.cleanlinessStopOrEnable(record, 'enable')}>
                                    <FormattedMessage id="global.enable" defaultMessage="启用" description="启用" />
                                </a>
                            </div>
                            : ''
                }
                {
                    getButtonPrem(permissionList, '002005005') ?
                        <div>
                            <a onClick={() => this.cleanlinessDelete(record, 'off')}>
                                <FormattedMessage id="global.delete" defaultMessage="删除" description="删除" />
                            </a>
                        </div>
                        : ''
                }
                {
                    getButtonPrem(permissionList, '002005007') ?
                        <div>
                            <a onClick={() => this.cleanlinessImmediate(record)}>
                                <FormattedMessage id="brand.cleanliness.immediate.monitoring" defaultMessage="立即监控" description="立即监控" />
                            </a>
                        </div>
                        : ''
                }
                {
                    getButtonPrem(permissionList, '002005006') ?
                        <div>
                            <a onClick={() => this.cleanlinessHistory(record)}>
                                <FormattedMessage id="brand.cleanliness.add.history.data" defaultMessage="新增历史数据" description="新增历史数据" />
                            </a>
                        </div>
                        : ''
                }
            </div>
        )
    }
    // 创建table配置
    createColumns() {
        let { permissionList } = this.props
        const columns = [
            {
                title: <FormattedMessage id="brand.cleanliness.conditions" defaultMessage="洁净度条件" />,
                width: '25%',
                key: 'name',
                dataIndex: 'name',
                render: (text, record) => this.renderKeyCondition(record)
            },
            {
                title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
                width: '15%',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {
                    let { intl } = this.props
                    return (
                        <span>{intl.locale === 'zh' ? record.statusName : record.statusNameEn}</span>
                    )
                }
            },
            {
                title: <FormattedMessage id="brand.cleanliness.cycle" defaultMessage="监控周期" />,
                width: '15%',
                render: (text, record) => this.renderCycle(record)
            },
            {
                title: <FormattedMessage id="brand.cleanliness.monitoring.time" defaultMessage="最近监控时间" />,
                width: '15%',
                dataIndex: 'gmtLastFormat',
                key: 'gmtLastFormat',
                render: (text, record) => {
                    return (
                        getButtonPrem(permissionList, '002005009') && record.crawlerDetailId ?
                            <div>
                                <a href={`/brand/cleanStatistics?crawlerId=${record.id}&id=${record.crawlerDetailId}`} target="_blank">
                                    {record.gmtLastFormat}
                                </a>
                            </div>
                            :
                            record.gmtLastFormat
                    )
                }
            },
            {
                title: <FormattedMessage id="brand.cleanliness.trend" defaultMessage="洁净度趋势" />,
                width: '15%',
                render: (text, record) => {
                    return (
                        getButtonPrem(permissionList, '002005008') ?
                            <a onClick={() => this.openTrendModal(record)}>
                                <FormattedMessage id="brand.cleanliness.look.up" defaultMessage="查看" />
                            </a> : ''
                    )
                }
            },
            {
                title: <FormattedMessage id="global.operate" defaultMessage="操作" />,
                width: '15%',
                render: (text, record) => this.renderOperate(record)
            }]
        return columns;
    }
    render() {
        let { brandCleanlinessPlatform, intl, brandList, brandCleanlinessListData, isFetch, history, permissionList } = this.props
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.brands.management', title: '品牌管理' },
            { link: '', titleId: 'router.brands.brand.cleanliness', title: '品牌洁净度' }
        ]
        let { brandId, modalDataId, trendVisible, activeTabKey, historyVisible } = this.state
        const tabListNoTitle = []
        if (brandCleanlinessPlatform && brandCleanlinessPlatform.length > 0) {
            for (let i = 0; i < brandCleanlinessPlatform.length; i++) {
                let tempTitle = {
                    key: brandCleanlinessPlatform[i].key,
                    tab: intl.locale === 'zh' ? brandCleanlinessPlatform[i].keyName : brandCleanlinessPlatform[i].keyNameEn
                }
                tabListNoTitle.push(tempTitle)
            }
        }
        return (
            <Content className='cleanliness' breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "report.subordinate.to.the.brand", defaultMessage: "所属品牌", description: "所属品牌" })}>
                                <Select
                                    
                                    showSearch
                                    value={brandId}
                                    onChange={(value) => this.handleSelectChange(value, 'brandId')}
                                    placeholder={intl.formatMessage({ id: "report.please.select.your.own.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        brandList && brandList.filter(item => item.isDelete === 0)
                                            .map(opt => <Select.Option key={opt.id} value={opt.id}>{opt.name}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
                {
                    getButtonPrem(permissionList, '002005002') ?
                        <Button type="primary" onClick={() => history.push('/brand/new/cleanliness')}><FormattedMessage id="brand.cleanliness.add.monitoring" defaultMessage="新增洁净度监控" /></Button>
                        : ''
                }
                <Card
                    tabList={tabListNoTitle}
                    activeTabKey={activeTabKey}
                    onTabChange={(key) => this.onTabChange(key)}
                >
                    <Table dataSource={brandCleanlinessListData}
                        columns={this.createColumns()}
                        pagination={false}
                        rowKey='id'
                        loading={isFetch}
                    />
                </Card>
                {
                    trendVisible ?
                        <CleanlinesTrend
                            visible={trendVisible}
                            onCancel={() => this.cleanlinesTrendModalCancel()}
                            modalDataId={modalDataId}
                        />
                        : ''
                }
                {
                    historyVisible ?
                        <HistoryModal
                            visible={historyVisible}
                            onOk={(data) => this.cleanlinesHistoryModalOk(data)}
                            onCancel={() => this.cleanlinesHistoryModalCancel()}
                        /> : ''
                }
            </Content>
        )
    }
}
export default BrandCleanliness