import { GET_EXCEL_EXPORT_SUCCESS, GET_EXCEL_EXPORT_ERROR, UPDATE_EXCEL_EXPORT_SUCCESS, UPDATE_EXCEL_EXPORT_ERROR } from '../../contants/system/excelExportTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_EXCEL_EXPORT_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldExcelExportList: action.oldExcelExportList,
                newExcelExportList: action.newExcelExportList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case GET_EXCEL_EXPORT_ERROR:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                newExcelExportList: action.oldExcelExportList,
                total: action.total
            })
        case UPDATE_EXCEL_EXPORT_SUCCESS:
            return Object.assign({}, state, {
                newExcelExportList: action.newExcelExportList,
            })
        case UPDATE_EXCEL_EXPORT_ERROR:
            return Object.assign({}, state, {
                oldExcelExportList: action.oldExcelExportList,
            })
        default:
            return state
    }
}