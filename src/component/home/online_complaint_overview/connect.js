import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import OnlineComplaintOverview from './index'
import { actionCreator } from '../../../utils/util'
import {
    GET_START_ACCURACY_R_SUCCESS,
    GET_START_COMPLAIN_SOURCE_SUCCESS,
    GET_START_MONITOR_LEGALRIGHTS_DRIFT_SUCCESS,
    GET_START_MONITOR_LEGALRIGHTS_SUCCESS,
    GET_START_PLATFORM_SUCCESS,
    GET_START_PROD_AREA_SUCCESS,
    GET_START_PROD_CATEGORY_SUCCESS,
    GET_START_REFRESH_SUCCESS,
    GET_START_REPORT_WEEK_SUCCESS,
    GET_START_STORE_TOP_SUCCESS,
    GET_START_TORTS_TYPE_SUCCESS,
    GET_START_VIDEO_SUCCESS,
    GET_START_WECHAT_SUCCESS
} from '../../../contants/home/onlineComplaintOverviewTypes'
import Api from '../../../api/index'
function mapStateToProps(state, props) {
    // 属性 
    const {
        accuracyRList,
        complainSourceList,
        headerInfoList,
        monitorLegalrightsDriftList,
        monitorLegalrightsList,
        platformList,
        prodAreaList,
        prodCategoryList,
        reportWeekList,
        storeTopList,
        tortsTypeList,
        videoList,
        wechatList,
        refresh,
        lTotalNum,
        totalNum,
        totalNums

    } = state.onlineComplaintOverviewReducer;
    const { brandList = [], collapsed } = state.commonReducer;
    const userInfo = state.loginReducer.userInfo || {};
    return {
        brandList,
        userInfo,
        accuracyRList,
        complainSourceList,
        headerInfoList,
        monitorLegalrightsDriftList,
        monitorLegalrightsList,
        platformList,
        prodAreaList,
        prodCategoryList,
        reportWeekList,
        storeTopList,
        tortsTypeList,
        videoList,
        wechatList,
        refresh,
        lTotalNum,
        totalNum,
        totalNums,
        collapsed
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        // 维权准确率
        getAccuracyRList: (data) => {
            Api.MlDriftBylAccuracyR(data).then(res => {
                let data = {
                    xAxisData: [],
                    legendData: [],
                    seriesData: [
                        {
                            data: []
                        }
                    ]
                }
                if (res.success) {
                    for (let i = 0; i < res.dataObject.length; i++) {
                        const element = res.dataObject[i];
                        data.xAxisData.push(element.gmtReportDateStr)
                        data.seriesData[0].data.push(element.lAccuracyRate / 100)
                    }
                }
                dispatch(actionCreator(GET_START_ACCURACY_R_SUCCESS, { accuracyRList: data }))
            })
        },
        // 投诉来源
        getComplainSourceList: (data) => {
            Api.ComplainSource(data).then(res => {
                let data = {
                    xAxisData: [],
                    legendData: [],
                    seriesData: [
                        {
                            data: []
                        },
                        {
                            data: []
                        }
                    ]
                }
                if (res.success) {
                    for (let i = 0; i < res.dataObject.length; i++) {
                        const element = res.dataObject[i];
                        data.xAxisData.push(element.gmtReportDateStr)
                        data.seriesData[0].data.push(element.gyNum)
                        data.seriesData[1].data.push(element.lNum)
                    }
                    
                }
                dispatch(actionCreator(GET_START_COMPLAIN_SOURCE_SUCCESS, { complainSourceList: data }))
            })
        },
        // 监控投诉量趋势
        getMonitorLegalrightsDriftList: (data) => {
            Api.LegalrightsDrift(data).then(res => {
                let data = {
                    xAxisData: [],
                    legendData: [],
                    seriesData: [
                        {
                            data: []
                        }
                    ]
                }
                if (res.success) {
                    for (let i = 0; i < res.dataObject.length; i++) {
                        const element = res.dataObject[i];
                        data.xAxisData.push(element.gmtReportDateStr)
                        data.seriesData[0].data.push(element.lTotalNum)
                    }
                }
                dispatch(actionCreator(GET_START_MONITOR_LEGALRIGHTS_DRIFT_SUCCESS, { monitorLegalrightsDriftList: data }))
            })
        },
        // 监控维权统计
        getMonitorLegalrightsList: (data) => {
            let newData = Object.assign({}, data)
            newData.sign = 1;
            Api.MonitorLegalrights(newData).then((res) => {
                dispatch(actionCreator(GET_START_MONITOR_LEGALRIGHTS_SUCCESS, { monitorLegalrightsList: res.dataObject || [] }))
            })
        },
        // 平台统计
        getPlatformList: (data) => {
            Api.reportProdPlatformCount(data).then(res => {
                dispatch(actionCreator(GET_START_PLATFORM_SUCCESS, { platformList: res.dataObject || [] }))
            })
        },
        // 商品地址统计
        getProdAreaList: (data) => {
            Api.RepordProdArea(data).then(res => {
                let lTotalNum = 0;
                if (res.success && res.dataObject.length) {
                    for (let index = 0; index < res.dataObject.length; index++) {
                        const element = res.dataObject[index];
                        lTotalNum += element.yAxis;
                    }
                }
                dispatch(actionCreator(GET_START_PROD_AREA_SUCCESS, { prodAreaList: res.dataObject || [], lTotalNum: lTotalNum }))
            })
        },
        // 商品分类统计
        getProdCategoryList: (data) => {
            Api.RepordProdCategory(data).then(res => {
                dispatch(actionCreator(GET_START_PROD_CATEGORY_SUCCESS, { prodCategoryList: res.dataObject || [] }))
            })
        },
        // 用户举报、周统计
        getReportWeekList: (data) => {
            Api.ReportUserReportWeek(data).then(res => {
                let data = {
                    xAxisData: [],
                    legendData: [],
                    seriesData: [
                        {
                            data: []
                        }
                    ]
                }
                if (res.success) {
                    for (let i = 0; i < res.dataObject.length; i++) {
                        const element = res.dataObject[i];
                        data.xAxisData.push(element.weekStart)
                        data.seriesData[0].data.push(element.cTotalNum)
                    }
                }
                dispatch(actionCreator(GET_START_REPORT_WEEK_SUCCESS, { reportWeekList: data }))
            })
        },
        // 店铺统计
        getStoreTopList: (data) => {
            Api.PlatformStoreByTop(data).then(res => {
                let result = {
                    xAxisData: [],
                    seriesData: [],
                    title: ''
                };
                if (res.success) {
                    let series = {
                        link: [],
                        data: []
                    }
                    for (let i = 0; i < res.dataObject.length; i++) {
                        const element = res.dataObject[i];
                        result.xAxisData.push(element.storeName)
                        series.data.push(element.cNum)
                        series.link.push(element.storeLink)
                    }
                    result.seriesData.push(series)
                    dispatch(actionCreator(GET_START_STORE_TOP_SUCCESS, { storeTopList: { tableData: res.dataObject, data: result } }))
                } else {
                    dispatch(actionCreator(GET_START_STORE_TOP_SUCCESS, { storeTopList: {tableData: [], data: result} }))
                }
            }) 
        },
        // 侵权类型统计
        getTortsTypeList: (data) => {
            Api.reportProdTortsTypeCount(data).then(res => {
                dispatch(actionCreator(GET_START_TORTS_TYPE_SUCCESS, { tortsTypeList: res.dataObject || [] }))
            })
        },
        // 视频举报统计
        getVideoList: (data) => {
            Api.countReportVideo(data).then(res => {
                if (res.success && res.dataObject.module.length) {
                    dispatch(actionCreator(GET_START_VIDEO_SUCCESS, { videoList: res.dataObject.module || [], totalNum: res.dataObject.totalNum || 0 }))
                } else {
                    dispatch(actionCreator(GET_START_VIDEO_SUCCESS, { videoList: [], totalNum: 0 }))
                }
            })
        },
        // 微信举报统计
        getWechatList: (data) => {
            Api.countReportWechat(data).then(res => {
                if (res.success && res.dataObject.module.length) {
                    dispatch(actionCreator(GET_START_WECHAT_SUCCESS, { wechatList: res.dataObject.module || [], totalNums: res.dataObject.totalNum || 0 }))
                } else {
                    dispatch(actionCreator(GET_START_WECHAT_SUCCESS, { wechatList: [], totalNums: 0 }))
                }
            })
        },
        // 刷新
        getRefresh: (data, callback) => {
            Api.reportNew(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_START_REFRESH_SUCCESS, { refresh: res.dataObject }))
                    typeof callback === 'function' && callback()
                }
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OnlineComplaintOverview))
