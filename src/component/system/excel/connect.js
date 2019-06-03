import { connect } from 'react-redux'
import ExcelExport from './index'
import { message } from 'antd';
import { injectIntl } from 'react-intl'
import { actionCreator, union, getFormatDate } from '../../../utils/util'
import Api from '../../../api/index'
import { GET_EXCEL_EXPORT_SUCCESS, GET_EXCEL_EXPORT_ERROR, UPDATE_EXCEL_EXPORT_SUCCESS, UPDATE_EXCEL_EXPORT_ERROR } from '../../../contants/system/excelExportTypes'

function mapStateToProps(state, ownProps) {
    const { oldExcelExportList, newExcelExportList, searchData, pageNo, pageSize, total, isFetch } = state.excelExportReducer;
    const { excelExportExcelTypeList, excelExportTypeList, excelExportImportTypeList, excelExportStatusList, permissionList } = state.commonReducer;
    const excelExportList = union(oldExcelExportList, newExcelExportList);
    return {
        excelExportList,
        searchData,
        pageNo,
        pageSize,
        total,
        isFetch,
        excelExportExcelTypeList,
        excelExportImportTypeList,
        excelExportTypeList,
        excelExportStatusList,
        permissionList
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        getExcelExportPage: (data, oldList) => {
            // 获取列表
            dispatch(actionCreator(GET_EXCEL_EXPORT_SUCCESS, { isFetch: true }))
            Api.excelExport(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_EXCEL_EXPORT_SUCCESS, { oldExcelExportList: oldList, newExcelExportList: res.result || [], total: res.records, pageNo: data.pageNo, pageSize: data.pageSize, isFetch: false }))
                } else {
                    message.error('查询失败，请稍后再试！')
                    dispatch(actionCreator(GET_EXCEL_EXPORT_ERROR, { oldExcelExportList: oldList, total: 0, isFetch: false }))
                }
            })
        },
        downloadExcel: (data) => {
            // 下载
            Api.downloadExcel(data).then(blob => {
                let time = getFormatDate("yyyy-MM-dd");
                let filename = `投诉管理${time}.xls`
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, filename);
                }else {
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                }
            })
        },
        excelCount: (data, oldExcelExportList) => {
            Api.excelCount(data).then(res => {
                if (res.success) {
                    let newExcelExportList = []
                    for (let i = 0; i < oldExcelExportList.length; i++) {
                        const element = oldExcelExportList[i];
                        if (data.id == element.id) {
                            element.isDownload = 1
                            element.isDownloadStr = "已下载"
                        }
                        newExcelExportList.push(element)
                    }
                    dispatch(actionCreator(UPDATE_EXCEL_EXPORT_SUCCESS, { newExcelExportList }))                    
                    message.info(res.msg)
                } else {
                    dispatch(actionCreator(UPDATE_EXCEL_EXPORT_ERROR, {oldExcelExportList}))
                    message.error(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ExcelExport))
