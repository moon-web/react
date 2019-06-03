import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import ComplaintOnlineList from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_ONLINE_LIST_SUCCESS } from '../../../contants/complaint/onlineListTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { onlineComplaintPlatformList, brandList, complaintSourceList, complaintStatusList, permissionList, autoComplaintStatus, exportExcelTitle, prodList } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { isFetch, oldOnlinList, newOnlinList, searchData, pageNo, pageSize = 10, total } = state.complaintOnlineReducer;
    const onlineList = union(oldOnlinList, newOnlinList)
    return {
        onlineComplaintPlatformList,
        brandList,
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        onlineList,
        userInfo,
        complaintStatusList,
        complaintSourceList,
        permissionList,
        autoComplaintStatus,
        exportExcelTitle,
        prodList
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getOnlineList: (data, oldOnlinList) => {
            dispatch(actionCreator(GET_ONLINE_LIST_SUCCESS, { isFetch: true }))
            Api.queryComplaintPages(data).then(res => {
                dispatch(actionCreator(GET_ONLINE_LIST_SUCCESS, { oldOnlinList, newOnlinList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
            })
        },
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ComplaintOnlineList))
