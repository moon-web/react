import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import InvestigationTask from './index'
import { actionCreator ,union} from '../../../utils/util'
import { GET_INVESTIGATIONTASK_LIST_SUCCESS } from '../../../contants/investigationreport/taskTypes'
import Api from '../../../api/index'
import { message } from 'antd'

function mapStateToProps(state, props) {
    const { 
            oldInvestigationTaskList, 
            newInvestigationTaskList, 
            total, 
            isFetch, 
            pageNo, 
            pageSize,
            search
        } = state.taskReducer
    const userInfo = state.loginReducer.userInfo || {};
    const investigationType = state.commonReducer.investigationType || []
    const investigationTaskList = union(oldInvestigationTaskList, newInvestigationTaskList)
    const { permissionList=[]} = state.commonReducer
    // 属性 
    return {
        investigationTaskList,
        userInfo,
        total,
        isFetch,
        pageNo,
        pageSize,
        investigationType,
        search,
        permissionList
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //列表
         // 获取列表
         getInvestigationTask: (data,oldInvestigationTaskList) => {
            dispatch(actionCreator(GET_INVESTIGATIONTASK_LIST_SUCCESS, { isFetch: true }))         
            let search = {
                startTime:data.startTime,
                endTime:data.endTime,
                name:data.name,
                type:data.type,
                status:data.status,
                mobile:data.mobile,
                userName:data.userName
            }
            Api.getInvestigationTaskList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_INVESTIGATIONTASK_LIST_SUCCESS, { oldInvestigationTaskList, newInvestigationTaskList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records, isFetch: false ,search:search}))
                }else{
                    dispatch(actionCreator(GET_INVESTIGATIONTASK_LIST_SUCCESS, { isFetch: false }))
                }
            })
        },
        //举报任务中止
        getStopCompensable(data,callback) {
            Api.editStopCompensable(data).then((res)=>{
                if(res.success){
                    message.success('操作成功')
                    callback()
                }else{
                    message.error(res.msg) 
                }
            })
        },
        //任务完成
        getEditOverCompensable(data,callback) {
            Api.editOverCompensable(data).then((res)=>{
                if(res.success){
                    message.success('操作成功')
                    callback()
                }else{
                    message.error(res.msg) 
                }
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(InvestigationTask))
