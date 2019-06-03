import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import ReportOffLine from './index'
import { actionCreator, union } from '../../../utils/util'
import { message } from 'antd'
import { GET_OFFLINE_REPORT_SUCCESS, UPDATE_OFFLINE_REPORT_SUCCESS, UPDATE_OFFLINE_REPORT_ERROR } from '../../../contants/clue/reportOfflineTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { isFetch, oldReportoffLineList, newReportoffLineList, pageNo, pageSize = 10, total } = state.reportOfflineReducer;
    const reportOfflineList = union(oldReportoffLineList, newReportoffLineList)
    const { brandList = [], permissionList, reportTaskOfflineClueStatus, exportExcelTitle } = state.commonReducer;
    const userInfo = state.loginReducer.userInfo || {};
    return {
        isFetch,
        reportOfflineList,
        pageNo,
        pageSize,
        total,
        brandList,
        userInfo,
        permissionList,
        reportTaskOfflineClueStatus,
        exportExcelTitle
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        // 获取列表
        getReportOffLineList: (oldReportoffLineList, data) => {
            dispatch(actionCreator(GET_OFFLINE_REPORT_SUCCESS, { isFetch: true }))
            Api.offReportClue(data).then(res => {
                dispatch(actionCreator(GET_OFFLINE_REPORT_SUCCESS, { oldReportoffLineList, newReportoffLineList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
            })
        },
        // 更新列表数据
        updateOffLineItem: (data, oldReportoffLineList, callback) => {
            Api.offReportClueExamine(data).then(res => {
                if (res.success) {
                    let newReportoffLineList = [];
                    for (let i = 0; i < oldReportoffLineList.length; i++) {
                        const element = oldReportoffLineList[i];
                        if (element.id === data.id) {
                            if (data.status) {
                                element.status = data.status;
                                element.statusName = data.statusName;
                                element.statusNameEn = data.statusNameEn;
                            }
                        }
                        newReportoffLineList.push(element)
                    }
                    typeof callback === 'function' && callback()
                    dispatch(actionCreator(UPDATE_OFFLINE_REPORT_SUCCESS, { newReportoffLineList }))
                } else {
                    dispatch(actionCreator(UPDATE_OFFLINE_REPORT_ERROR, { oldReportoffLineList }))
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ReportOffLine))
