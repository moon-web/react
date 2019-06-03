import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import CleanlinesTrend from './index'
import Api from '../../../../../api/index'
import { GET_BRAND_CLEANLINESS_CRAWLER_SUCCESS, GET_BRAND_CLEANLINESS_CRAWLER_LINE_SUCCESS, GET_BRAND_CLEANLINESS_CRAWLER_LINE_ERROR } from '../../../../../contants/brand/brandCleanlinessType'
import { actionCreator } from '../../../../../utils/util'
import { message } from 'antd';
function mapStateToProps(state, props) {
	const { permissionList } = state.commonReducer 
	const { brandCleanlinessCrawlerData, brandCleanlinessCrawlerLineData } =  state.brandCleanlinessReducer
	return {
		permissionList,
		brandCleanlinessCrawlerData,
		brandCleanlinessCrawlerLineData
	}
}
function mapDispatchToProps(dispatch, props) {
	return {
		//查看品牌洁净度趋势
		brandCleanlinessCrawler: (data, callback) => {
			Api.brandCleanlinessCrawler(data).then(res => {
				if(res.success) {
					dispatch(actionCreator(GET_BRAND_CLEANLINESS_CRAWLER_SUCCESS, { brandCleanlinessCrawlerData: res.dataObject }))
                }			
			})
		},
		//查看洁净度趋势数据
		brandCleanlinessCrawlerTrendData: (data) => {
			Api.brandCleanlinessCrawlerData(data).then(res => {
				if(res.success) {
					let result = res.module
					let lineData = {
						xAxisData: [],
						legendData: [],
						seriesData: [
							{
								data: []
							}
						]
					}
					for (let i = 0; i < result.length; i++) {
						const element = result[i];
                        lineData.xAxisData.push(element.gmtMonitorFormat)
						let temp = {
							value: element.rate,
							tortNum: element.tortNum,
							monitorNum: element.monitorNum,
							crawlerId: data.id,
                            waiteFlag: element.waiteFlag,
                            lineIdDot: element.id,
                            auditStatus: element.status
                        }
						lineData.seriesData[0].data.push(temp)
					}	
					dispatch(actionCreator(GET_BRAND_CLEANLINESS_CRAWLER_LINE_SUCCESS, { brandCleanlinessCrawlerLineData: lineData }))
				}else {
                    let lineData = {
						xAxisData: [],
						legendData: [],
						seriesData: [
							{
								data: []
							}
						]
					}
                    dispatch(actionCreator(GET_BRAND_CLEANLINESS_CRAWLER_LINE_ERROR, { brandCleanlinessCrawlerLineData: lineData }))
					message.info(res.errorDetail)
				}
			})
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CleanlinesTrend))