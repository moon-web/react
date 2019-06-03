import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import BrandCleanliness from './index'
import Api from '../../../api/index'
import { message } from 'antd'
import { GET_BRAND_CLEANLINESS_PLATFORM_SUCCESS, GET_BRAND_CLEANLINESS_LIST_SUCCESS, GET_BRAND_CLEANLINESS_LIST_ERROR, GET_BRAND_NO_CLEANLINESS_LIST_SUCCESS, UPDATE_BRAND_CLEANLINESS_LIST_SUCCESS, UPDATE_BRAND_CLEANLINESS_LIST_ERROR } from '../../../contants/brand/brandCleanlinessType'
import { actionCreator, union } from '../../../utils/util'
function mapStateToProps(state, props) {
	const { brandList, permissionList } = state.commonReducer  
	const { brandCleanlinessPlatform = [], cleanlinessSearchData, oldbrandCleanlinessListData, newbrandCleanlinessListData, total, isFetch, pageNo, pageSize, brandCleanlinessCrawlerData } = state.brandCleanlinessReducer
    const brandCleanlinessListData = union(oldbrandCleanlinessListData, newbrandCleanlinessListData)  
	return {
		brandList,
		permissionList,
		brandCleanlinessPlatform,
        brandCleanlinessListData,
        cleanlinessSearchData,
		total,
		pageNo,
		isFetch,
		pageSize,
		brandCleanlinessCrawlerData
	}
}
function mapDispatchToProps(dispatch, props) {
	return {
		//品牌下的平台
		getBrandCleanlinessPlatformData: (data, callback) => {
			Api.brandCleanlinessPlatform(data).then(res => {
				if(res.success) {
					dispatch(actionCreator(GET_BRAND_CLEANLINESS_PLATFORM_SUCCESS, { brandCleanlinessPlatform: res.dataObject || []}))
					typeof callback === 'function' && callback()
				}else {
					message.info(res.msg)
				}
			})
		},
		//列表
		getBrandCleanlinessListdata: (data, oldbrandCleanlinessListData) => {
			dispatch(actionCreator(GET_BRAND_CLEANLINESS_LIST_SUCCESS, { isFetch: true }))
            Api.brandCleanliness(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_BRAND_CLEANLINESS_LIST_SUCCESS, { oldbrandCleanlinessListData, newbrandCleanlinessListData: res.dataObject || [], isFetch: false, cleanlinessSearchData: data }))
                }else {
					dispatch(actionCreator(GET_BRAND_CLEANLINESS_LIST_ERROR, { oldbrandCleanlinessListData, newbrandCleanlinessListData: [] }))
					message.info(res.msg)
				}
            })
		},
		//解决没有品牌下的数据，平台数据
		getNoBrandCleanlinessData: () => {
			dispatch(actionCreator(GET_BRAND_NO_CLEANLINESS_LIST_SUCCESS, { oldbrandCleanlinessListData: [], newbrandCleanlinessListData: [], brandCleanlinessPlatform: []  }))
		},
		//查看品牌洁净度趋势
		brandCleanlinessCrawler: (data, callback) => {
			Api.brandCleanlinessCrawler(data).then(res => {
				if(res.success) {
					typeof callback === 'function' && callback(res.result)
				}else {
					message.info(res.msg)
				}			
			})
		},
		//品牌洁净度立即监控
		brandCleanlinessImmediate: (data, callback) => {
			Api.brandCleanlinessImmediate(data).then(res => {
				if(res.success) {
					typeof callback === 'function' && callback()
				}else {
					message.info(res.msg)
				}
			})
		},
		//删除
		brandCleanlinessDel: (data, callback) => {
			Api.brandCleanlinessDel(data).then(res => {
				if(res.success) {
					typeof callback === 'function' && callback()
				}else {
					message.info(res.msg)
				}
			})
		},
		//启用
		brandCleanOn: (data, oldbrandCleanlinessListData) => {
			Api.brandCleanOn(data).then(res => {
				if(res.success) {
					let newbrandCleanlinessListData = [];
					for (let i = 0; i < oldbrandCleanlinessListData.length; i++) {
						const element = oldbrandCleanlinessListData[i];
						if (element.id === data.id) {
							element.status = 1
							element.statusName = '启用'
							element.statusNameEn = 'Enable'
						}
						newbrandCleanlinessListData.push(element)
					}
					dispatch(actionCreator(UPDATE_BRAND_CLEANLINESS_LIST_SUCCESS, { newbrandCleanlinessListData }))
				} else {
					message.info(res.msg)
					dispatch(actionCreator(UPDATE_BRAND_CLEANLINESS_LIST_ERROR, { oldbrandCleanlinessListData }))					
				}				
			})
		},
		//禁用
		brandCleanOff: (data,oldbrandCleanlinessListData) => {
			Api.brandCleanOff(data).then(res => {
				if(res.success) {
					let newbrandCleanlinessListData = [];
					for (let i = 0; i < oldbrandCleanlinessListData.length; i++) {
						const element = oldbrandCleanlinessListData[i];
						if (element.id === data.id) {
							element.status = 2
							element.statusName = '禁用'
							element.statusNameEn = 'Disable'
						}
						newbrandCleanlinessListData.push(element)
					}
					dispatch(actionCreator(UPDATE_BRAND_CLEANLINESS_LIST_SUCCESS, { newbrandCleanlinessListData }))
				} else {
					message.info(res.msg)
					dispatch(actionCreator(UPDATE_BRAND_CLEANLINESS_LIST_ERROR, { oldbrandCleanlinessListData }))					
				}
			})
		},
		//获取历史洁净度数据
		brandCleanHistory: (data, callback) => {
			Api.brandCleanlinessInsertCleanHistory(data).then(res => {
				if(res.success) {
					typeof callback === 'function' && callback()
					message.info('新增历史数据成功')
				}else {
					message.info(res.msg)
				}
			})
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BrandCleanliness))