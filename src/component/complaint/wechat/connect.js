import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import WeChartComplaint from './index'
import { GET_WECHAT_LIST_SUCCESS } from '../../../contants/complaint/wechatListTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import Api from '../../../api/index'
import { actionCreator } from '../../../utils/util'

function mapStateToProps(state, props) {
    const { brandList = [], complaintWechatStatusList, permissionList, exportExcelTitle } = state.commonReducer;
    const { isFetch, WechartcomplainList, pageNo, searchData, pageSize = 10, total } = state.complaintWechatReducer;
    // 属性 
    return {
        brandList,
        WechartcomplainList,
        complaintWechatStatusList,
        isFetch,
        pageNo,
        searchData,
        pageSize,
        total,
        permissionList,
        exportExcelTitle
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        // 获取列表
        getWeChartList: (data) => {
            dispatch(actionCreator(GET_WECHAT_LIST_SUCCESS, { isFetch: true }))
            Api.weChatListPage(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_WECHAT_LIST_SUCCESS, { WechartcomplainList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, searchData: data, total: res.records, isFetch: false }))
                }
            })
        },
        //微信投诉管理导出
        saveExcelData: (data) => {
            Api.createExportExcel(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                } else {
                    message.error(res.msg)
                }
            })
        },
        getExportExcelTitle: data => {
            Api.queryExcelTitle(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_EXPORT_EXCEL_TITLE_SUCCESS, { exportExcelTitle: res.dataObject }))
                } else {
                    dispatch(actionCreator(GET_EXPORT_EXCEL_TITLE_SUCCESS, { exportExcelTitle: [] }))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(WeChartComplaint))
