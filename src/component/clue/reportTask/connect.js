import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import ReportTask from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_REPORT_TASK_SUCCESS, UPDATE_REPORT_TASK_SUCCESS, UPDATE_REPORT_TASK_ERROR } from '../../../contants/clue/reportTaskTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { brandList, permissionList, reportTaskType, reportTaskStatus } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { isFetch, oldReportTaskList, newReportTaskList, searchData, pageNo, pageSize = 10, total } = state.reportTaskReducer;
    const reportTaskList = union(oldReportTaskList, newReportTaskList)
    return {
        brandList,
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        reportTaskList,
        userInfo,
        permissionList,
        reportTaskType,
        reportTaskStatus
    }
}
function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getReportTaskList: (data, oldReportTaskList) => {
            dispatch(actionCreator(GET_REPORT_TASK_SUCCESS, { isFetch: true }))
                Api.reportTaskList(data).then(res => {
                	dispatch(actionCreator(GET_REPORT_TASK_SUCCESS, { oldReportTaskList, newReportTaskList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false,searchData:data }))
            })
		},
		updateEndTask: (data,oldReportTaskList,callback) => {
			Api.reportEndTask(data).then(res => {
				if(res.success) {
                    let newReportTaskList = []
                    for (let i = 0; i < oldReportTaskList.length; i++) {
                        const element = oldReportTaskList[i];
                        if (element.id === data.id) {
                            element.status = data.status
                            element.statusName = data.statusName
                            element.statusNameEn = data.statusNameEn
                        }
                        newReportTaskList.push(element)
                    }  
                    typeof callback === 'function' && callback()
                    dispatch(actionCreator(UPDATE_REPORT_TASK_SUCCESS, { newReportTaskList }))
                } else {
                    dispatch(actionCreator(UPDATE_REPORT_TASK_ERROR, { oldReportTaskList }))
                }
			})
		}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ReportTask))
