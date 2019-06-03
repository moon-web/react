import {
    GET_START_ACCURACY_R_SUCCESS,
    GET_START_COMPLAIN_SOURCE_SUCCESS,
    GET_START_HEADER_INFO_SUCCESS,
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
} from '../../contants/home/onlineComplaintOverviewTypes'
const initState = {
    accuracyRList: {
        xAxisData: [],
        legendData: [],
        seriesData: [
            {
                data: []
            }
        ]
    },
    complainSourceList: {
        xAxisData: [],
        legendData: [],
        seriesData: [
            {
                data: []
            }
        ]
    },
    headerInfoList: [],
    monitorLegalrightsDriftList: {
        xAxisData: [],
        legendData: [],
        seriesData: [
            {
                data: []
            }
        ]
    },
    monitorLegalrightsList: [],
    platformList: [],
    prodAreaList: [],
    lTotalNum: 0,
    prodCategoryList: [],
    reportWeekList: {
        xAxisData: [],
        legendData: [],
        seriesData: [
            {
                data: []
            }
        ]
    },
    storeTopList: {
        tableData: [],
        data: {
            xAxisData: [],
            seriesData: [],
            title: ''
        }
    },
    tortsTypeList: [],
    videoList: [],
    totalNum: 0,
    wechatList: [],
    totalNums: 0,
    refresh: true
}
export default function (state = initState, action) {
    switch (action.type) {
        case GET_START_ACCURACY_R_SUCCESS:
            return Object.assign({}, state, {
                accuracyRList: action.accuracyRList
            })
        case GET_START_COMPLAIN_SOURCE_SUCCESS:
            return Object.assign({}, state, {
                complainSourceList: action.complainSourceList
            })
        case GET_START_HEADER_INFO_SUCCESS:
            return Object.assign({}, state, {
                headerInfoList: action.headerInfoList
            })
        case GET_START_MONITOR_LEGALRIGHTS_DRIFT_SUCCESS:
            return Object.assign({}, state, {
                monitorLegalrightsDriftList: action.monitorLegalrightsDriftList
            })
        case GET_START_MONITOR_LEGALRIGHTS_SUCCESS:
            return Object.assign({}, state, {
                monitorLegalrightsList: action.monitorLegalrightsList
            })
        case GET_START_PLATFORM_SUCCESS:
            return Object.assign({}, state, {
                platformList: action.platformList
            })
        case GET_START_PROD_AREA_SUCCESS:
            return Object.assign({}, state, {
                prodAreaList: action.prodAreaList,
                lTotalNum: action.lTotalNum
            })
        case GET_START_PROD_CATEGORY_SUCCESS:
            return Object.assign({}, state, {
                prodCategoryList: action.prodCategoryList
            })
        case GET_START_REPORT_WEEK_SUCCESS:
            return Object.assign({}, state, {
                reportWeekList: action.reportWeekList
            })
        case GET_START_STORE_TOP_SUCCESS:
            return Object.assign({}, state, {
                storeTopList: action.storeTopList
            })
        case GET_START_TORTS_TYPE_SUCCESS:
            return Object.assign({}, state, {
                tortsTypeList: action.tortsTypeList
            })
        case GET_START_VIDEO_SUCCESS:
            return Object.assign({}, state, {
                videoList: action.videoList,
                totalNum: action.totalNum
            })
        case GET_START_WECHAT_SUCCESS:
            return Object.assign({}, state, {
                wechatList: action.wechatList,
                totalNums: action.totalNums
            })
        case GET_START_REFRESH_SUCCESS:
            return Object.assign({}, state, {
                refresh: action.refresh
            })
        default:
            return state
    }
}