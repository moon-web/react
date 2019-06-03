import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import ReportApplication from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_REPORT_APPLIVATION_SUCCESS, UPDATE_REPORT_APPLIVATION_SUCCESS, UPDATE_REPORT_APPLIVATION_ERROR } from '../../../contants/clue/reportApplicationTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { permissionList, reportTaskApplyType, reportTaskApplyStatus } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { isFetch, oldReportList, newReportList, searchData, pageNo, pageSize = 10, total } = state.reportApplicationReducer;
    const reportApplicationList = union(oldReportList, newReportList)
    return {
        permissionList,
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        reportApplicationList,
        userInfo,
        reportTaskApplyType,
        reportTaskApplyStatus
    }
}
function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getReportApplicationList: (data, oldReportList) => {
            dispatch(actionCreator(GET_REPORT_APPLIVATION_SUCCESS, { isFetch: true }))
                Api.reportApplication(data).then(res => {
                	dispatch(actionCreator(GET_REPORT_APPLIVATION_SUCCESS, { oldReportList, newReportList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
            })
		},
		toExamineData: (data,oldReportList,callback) => {
			Api.reportApplicationExamine(data).then(res => {
				if(res.success) {
                    let newReportList = []
                    for (let i = 0; i < oldReportList.length; i++) {
                        const element = oldReportList[i];
                        if (element.id === data.id) {
                            element.status = data.status
                            element.statusName = data.statusName
                            element.statusNameEn = data.statusNameEn
                        }
                        newReportList.push(element)
                    }  
                    typeof callback === 'function' && callback()
                    dispatch(actionCreator(UPDATE_REPORT_APPLIVATION_SUCCESS, { newReportList }))
                } else {
                    dispatch(actionCreator(UPDATE_REPORT_APPLIVATION_ERROR, { oldReportList }))
                }
			})
		}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ReportApplication))
