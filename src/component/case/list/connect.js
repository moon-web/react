import CaseList from './index'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { message } from 'antd'
import Api from '../../../api/index'
import { actionCreator, union } from '../../../utils/util'
import {  GET_CASE_LIST_SUCCESS } from '../../../contants/case/caseListTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes';
function mapStateToProps(state,props) {
	const { permissionList=[],brandList = [], infringementList = [], typeListComplaint = [], listTypeTortSource = [], typeListCase = [], typeListWran = [], exportExcelTitle } = state.commonReducer;    
	const userInfo = state.loginReducer.userInfo || {};
	const { isFetch, oldCaseList, newCaseList, searchData, pageNo, pageSize = 10, total } = state.caseReducer
    const caseList = union(oldCaseList, newCaseList)
    
	return {
		brandList,
		userInfo,
		listTypeTort: infringementList,
		typeListComplaint,
		listTypeTortSource,
		typeListCase,
		typeListWran,
		isFetch,
        searchData,
		caseList,
        pageNo,
        pageSize,
        total,
        permissionList,
        exportExcelTitle
    }
}
function mapDispatchToProps(dispatch,props) {
	return {
		caseManagement: (data,oldCaseList) => {
            dispatch(actionCreator(GET_CASE_LIST_SUCCESS, { isFetch: true }))
			Api.caseList(data).then(res => {
                dispatch(actionCreator(GET_CASE_LIST_SUCCESS, { oldCaseList, newCaseList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
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
export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(CaseList))