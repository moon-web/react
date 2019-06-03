import React, { Component } from 'react'
import { Row, Col, Form, DatePicker } from 'antd'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Modal } from 'antd'
import LineChart from '../../../../common/charts/lineChart'
import { getFormatDate } from '../../../../../utils/util'
import './index.css'
import moment from 'moment'
const { RangePicker } = DatePicker;
class CleanlinesTrend extends Component {
	constructor(){
		super()
		this.state = {
			startTime: '',
			endTime: '',
			searchData: {
				id:'',
				startTime: '',
				endTime: '',
			}
		}
	}
	componentWillMount() {
		let { modalDataId } = this.props
		let { searchData } = this.state
		let endTime = getFormatDate('yyyy-MM-dd');
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let startTime = '';
		if ((month === 5 || month === 7 || month === 10 || month === 12) && day === 31) {
			day = 30
		} else if (month === 3 && year % 4 === 0 && day > 29) {
			day = 29
		} else if (month === 3 && year % 4 !== 0 && day > 28) {
			day = 28
		}
		if (month === 3) {
			year = year - 1;
			month = 12;
		} else {
			month = month - 3;
		}
		startTime = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
		this.setState({
			startTime,
			endTime
		})
		searchData.startTime = startTime;
		searchData.endTime = endTime;
		searchData.id = modalDataId
		let data = {
			id: modalDataId
		}
		this.getBrandCleanlinessCrawler(data)
		this.getBrandCleanlinessCrawlerTrendData(searchData)
	}
	getBrandCleanlinessCrawler(data) {		
        let { brandCleanlinessCrawler } = this.props        
        brandCleanlinessCrawler(data)
	}
	getBrandCleanlinessCrawlerTrendData(data) {
		let { brandCleanlinessCrawlerTrendData} = this.props 
        brandCleanlinessCrawlerTrendData(data)
	}
	onChangeRangePicker(dates, dateStrings) {
		let { modalDataId } = this.props
		let { searchData } = this.state
		searchData.id = modalDataId
		searchData.startTime = dateStrings[0]
		searchData.endTime = dateStrings[1]
		this.setState({
			startTime: dateStrings[0],
			endTime: dateStrings[1],
			searchData
		}, () => {
			let { searchData } = this.state
			this.getBrandCleanlinessCrawlerTrendData(searchData)
		})		
	}
	render(){
        let { visible, intl, brandCleanlinessCrawlerData, brandCleanlinessCrawlerLineData, permissionList } = this.props
		let title = ''
		if(brandCleanlinessCrawlerData) {
			intl.locale === 'zh' ? 
			title = `${brandCleanlinessCrawlerData.platformTypeName}${intl.formatMessage({ id: "global.platform", defaultMessage: "平台", description: "平台" })}${brandCleanlinessCrawlerData.brandName}${intl.formatMessage({ id: "brand.cleanliness.trend", defaultMessage: "洁净度趋势", description: "洁净度趋势" })}` :
			title = `${brandCleanlinessCrawlerData.platformTypeNameEn} ${intl.formatMessage({ id: "global.platform", defaultMessage: "平台", description: "平台" })} ${brandCleanlinessCrawlerData.brandName} ${intl.formatMessage({ id: "brand.cleanliness.trend", defaultMessage: "洁净度趋势", description: "洁净度趋势" })}`
			
		}
		if (brandCleanlinessCrawlerLineData) {
            brandCleanlinessCrawlerLineData.legendData = 
                [intl.formatMessage({ id: "brand.cleanliness.trend", defaultMessage: "洁净度趋势", description: "洁净度趋势" })]            
		}
		return(
			<Modal
				className="root echar"
				title={title}
				visible={visible}
				onCancel={() => this.props.onCancel()}
				width="80%"
				destroyOnClose
				footer={null}
			>
				<div className="search-form">
				{
					brandCleanlinessCrawlerData ? 
						<Row>
                            <Col span={6}>
                                <Form.Item label={intl.formatMessage({ id: 'monitor.keyword', defaultMessage: "关键字" })}>
                                    <span>{ brandCleanlinessCrawlerData.keyword }</span>
                                </Form.Item>
                            </Col>
							{
								brandCleanlinessCrawlerData.minPriceFormat ?
								<Col span={6}>
									<Form.Item label={intl.formatMessage({ id: 'monitor.price', defaultMessage: "价格" })}>
										<span>{ brandCleanlinessCrawlerData.minPriceFormat }-{ brandCleanlinessCrawlerData.maxPriceFormat}</span>
									</Form.Item>
								</Col> : ''
							}
							{
								brandCleanlinessCrawlerData.consignmentPlace ? 
								<Col span={6}>
									<Form.Item label={intl.formatMessage({ id: 'global.crawler.filter.type.place.of.delivery', defaultMessage: "发货地" })}>
										<span>{ brandCleanlinessCrawlerData.consignmentPlace }</span>
									</Form.Item>
								</Col> : ''
                            }
							{
								brandCleanlinessCrawlerData.maxPage ? 
								<Col span={6}>
									<Form.Item label={intl.formatMessage({ id: 'monitor.query.range', defaultMessage: "查询范围" })}>
										<FormattedMessage id="brand.query.range.page" defaultMessage={`前${brandCleanlinessCrawlerData.maxPage}页`} description={`前${brandCleanlinessCrawlerData.maxPage}页`} values={{ number: brandCleanlinessCrawlerData.maxPage}}/>
									</Form.Item>
								</Col> : ''
							}
                            {
								brandCleanlinessCrawlerData.sortConditionName ? 
								<Col span={6}>
									<Form.Item label={intl.formatMessage({ id: 'monitor.sort.type', defaultMessage: "排序类型" })}>
										<span>{intl.locale === 'zh' ? brandCleanlinessCrawlerData.sortConditionName : brandCleanlinessCrawlerData.sortConditionNameEn}</span>
									</Form.Item>
								</Col> : ''
							}
						</Row> : ''
                }
					<Row>
						<Col span={12}>
							<Form.Item label={intl.formatMessage({ id: 'brand.cleanliness.cycle', defaultMessage: "监控周期" })}>
								<RangePicker onChange={(dates, dateStrings) => this.onChangeRangePicker(dates, dateStrings)} 
									defaultValue={[moment(this.state.startTime), moment(this.state.endTime)]}
								/>
							</Form.Item>
						</Col>
					</Row>
				</div>	
				{
					brandCleanlinessCrawlerLineData && brandCleanlinessCrawlerLineData.xAxisData.length > 0 ?
						<LineChart permissionList={permissionList} data={brandCleanlinessCrawlerLineData} name="brandCleanliness" title={intl.formatMessage({ id: "brand.cleanliness.trend", defaultMessage: "洁净度趋势", description: "洁净度趋势" })} />           		
					: <div className="empty">暂无数据</div>
				}				
			</Modal>
		)
	}
} 
export default injectIntl(CleanlinesTrend)