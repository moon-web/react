import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import InvestigationTaskDetails from './index'
import { actionCreator } from '../../../../utils/util'
import { GET_INVESTIGATION_REPORT_DETAIL_SUCCESS,GET_INVESTIGATION_DETAIL_TASKLOG_SUCCESS ,GET_INVESTIGATION_DETAIL_USERINFO_SUCCESS} from '../../../../contants/investigationreport/details/investigationDetailTypes'
import Api from '../../../../api/index'
import { message } from 'antd'

function mapStateToProps(state, props) {
    const userInfo = state.loginReducer.userInfo || {}
    const { investigationDetail, investigationDetailTaskLog,pageNo,pageSize,total,groupUserData } = state.investigationDetailReducer
    const { getDistributionList,minTotal } = state.investigationReportReducer
    const { permissionList=[]} = state.commonReducer
    // 属性 
    return {
		userInfo,
        investigationDetail,
        getDistributionList,
        minTotal,
        investigationDetailTaskLog,
        pageNo,
        pageSize,
        total,
        groupUserData,
        permissionList
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //查询详情
        getInvestigationDetail: (data,callback) => {
            Api.getInvestigationTaskDetail(data).then(res=>{
                if(res.success){
                    dispatch(actionCreator(GET_INVESTIGATION_REPORT_DETAIL_SUCCESS, { investigationDetail: res.dataObject}))
                    callback()
                }else{
                    message.error(res.msg)
                }
            })
        },
        //获取日志
        getTaskLog:(data)=>{
            Api.investigationLog(data).then((res)=>{
                if(res.success){
                    dispatch(actionCreator(GET_INVESTIGATION_DETAIL_TASKLOG_SUCCESS, { investigationDetailTaskLog: res.result || [],pageNo:res.pageNo,total:res.records}))
                }else{
                    message.error(res.msg) 
                }
            })
        },
        //获取组团人员本人信息
        getUserGroupInfo(data,callback) {
            Api.userInfo(data).then((res)=>{
                if(res.success){
                    dispatch(actionCreator(GET_INVESTIGATION_DETAIL_USERINFO_SUCCESS, {groupUserData:res.dataObject}))
                    callback()
                }else{
                    // message.error(res.msg)
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
        //协商
        getEditCheckConsult(data,callback) {
            Api.editCheckConsult(data).then((res)=>{
                if(res.success){
                    message.success('操作成功')
                    callback()
                }else{
                    message.error(res.msg) 
                }
            })
        },
        //协商金额
        getCreateMoney(data,callback) {
            Api.createDetailMoney(data).then((res)=>{
                if(res.success){
                    message.success(res.msg)
                    callback()
                }else{
                    message.error(res.msg) 
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(InvestigationTaskDetails))
