import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import TaskDeatils from './index'
import { actionCreator } from '../../../utils/util'
import API from '../../../api/index'
import { GET_REPORTTASK_DETAILS_SUCCESS } from '../../../contants/clue/reportTaskDetail'
import { message } from 'antd'

function mapStateToProps(state,props) {    
    const { reportTaskDetailsList } = state.reportTaskDetail;
    return {
        reportTaskDetailsList
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getReportTaskDetail: (data) => {
           API.reportTaskDetail(data).then(res=>{
            if (res.success) {
                dispatch(actionCreator(GET_REPORTTASK_DETAILS_SUCCESS, { reportTaskDetailsList: res.dataObject }))
            }else{
                message.error(res.msg)
            }
        })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TaskDeatils))
