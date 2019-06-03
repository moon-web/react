import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import InvestigationReportDetails from './index'
import { actionCreator, union } from '../../../../utils/util'
import { GET_INVESTIGATION_REPORT_DETAIL_SUCCESS,GET_INVESTIGATION_DETAIL_TASKLOG_SUCCESS ,GET_INVESTIGATION_DETAIL_USERINFO_SUCCESS} from '../../../../contants/investigationreport/details/investigationDetailTypes'
import { GET_DISTRIBUTION_LIST_SUCCESS ,GET_INVESTIGATIONREPORT_DISTRIBUTION_SUCCESS,GET_INVESTIGATIONREPORT_DISTRIBUTION_ERROR,GET_INVESTIGATIONREPORT_TOEXAMINE_SUCCESS,GET_INVESTIGATIONREPORT_TOEXAMINE_ERROR} from '../../../../contants/investigationreport/reportTypes'
import Api from '../../../../api/index'
import { message } from 'antd'

function mapStateToProps(state, props) {
    const userInfo = state.loginReducer.userInfo || {}
    const { permissionList=[]} = state.commonReducer
    const { investigationDetail, investigationDetailTaskLog,pageNo,pageSize,total,groupUserData } = state.investigationDetailReducer
    const { getDistributionList,minTotal,minPageNo } = state.investigationReportReducer
    const {oldInvestigationReportList,  newInvestigationReportList,} = state.investigationReportReducer
    const investigationReportList = union(oldInvestigationReportList, newInvestigationReportList)
    // 属性 
    return {
		userInfo,
        investigationDetail,
        getDistributionList,
        minTotal,
        minPageNo,
        investigationDetailTaskLog,
        pageNo,
        pageSize,
        total,
        groupUserData,
        investigationReportList,
        permissionList
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //查询详情
        getInvestigationDetail: (data,callback) => {
            Api.getInvestigationDetail(data).then(res=>{
                if(res.success){
                    dispatch(actionCreator(GET_INVESTIGATION_REPORT_DETAIL_SUCCESS, { investigationDetail: res.dataObject}))
                    callback()
                }else{
                    message.error(res.msg)
                }
            })
        },
        //编辑审核通过不通过修改详情
        updateInvestigationDetail:(data,oldinvestigationDetail) =>{
            Api.getInvestigationDetail(data).then(res=>{
                if (res.success) {
                    const element = oldinvestigationDetail;
                    if (element.id == data.id) {
                        element.status = data.status
                        element.createMoney = data.createMoney
                    }
                    dispatch(actionCreator(GET_INVESTIGATION_REPORT_DETAIL_SUCCESS, {investigationDetail: element}))
                } else {
                    dispatch(actionCreator(GET_INVESTIGATION_REPORT_DETAIL_SUCCESS, {investigationDetail: oldinvestigationDetail}))
                    message.error(res.msg)
                }
            })
        },
        //提交举报线索奖励金额
        getCueBonus:(data,callback) =>{
            Api.editInvestigationMoney(data).then((res)=>{
                if(res.success){
                    message.success('提交成功')
                    callback()
                }else{
                    message.error(res.msg)
                }
            })
        },
        //审核通过-审核不通过  80 90
        eidtCheckCompensable:(data,oldinvestigationReportList,callback) =>{
            Api.editInvestigationStatus(data).then((res)=>{
                if (res.success) {
                    let result = [];
                    for (let i = 0; i < oldinvestigationReportList.length; i++) {
                        const element = oldinvestigationReportList[i];
                        if (element.id == data.id) {
                            element.status = data.status
                        }
                        result.push(element)
                    }
                    dispatch(actionCreator(GET_INVESTIGATIONREPORT_TOEXAMINE_SUCCESS, {newInvestigationReportList: result}))
                    typeof callback === 'function' && callback()
                } else {
                    dispatch(actionCreator(GET_INVESTIGATIONREPORT_TOEXAMINE_ERROR, {oldInvestigationReportList: oldinvestigationReportList}))
                    message.error(res.msg)
                }
            })
        },
        //获取调查员数据信息 - distribution
        getDistributionData: (data) => {
            Api.getInvestigationByPage(data).then((res)=>{
                if(res.success){
                    dispatch(actionCreator(GET_DISTRIBUTION_LIST_SUCCESS,{getDistributionList:res.result || [],minPageNo: data.pageNo, minPageSize: data.pageSize, minTotal: res.records}))
                }else{
                    message.warning(res.msg)
                }
            })
        },
        //分配
        geteditInvestigationAllot:(data,oldinvestigationReportList,callback) =>{
            Api.editInvestigationAllot(data).then((res)=>{
                if (res.success) {
                    let result = [];
                    for (let i = 0; i < oldinvestigationReportList.length; i++) {
                        const element = oldinvestigationReportList[i];
                        if (element.id == data.compensableId) {
                            element.status = data.status
                        }
                        result.push(element)
                    }
                    dispatch(actionCreator(GET_INVESTIGATIONREPORT_DISTRIBUTION_SUCCESS, {newInvestigationReportList: result}))
                    typeof callback === 'function' && callback()
                } else {
                    dispatch(actionCreator(GET_INVESTIGATIONREPORT_DISTRIBUTION_ERROR, {oldInvestigationReportList: oldinvestigationReportList}))
                    message.error(res.msg)
                }
            })
        },
        //完结
        getFinishOperate:(data,callback)=>{
            Api.editfinishStatus(data).then((res)=>{
                if (res.success) {
                    typeof callback === 'function' && callback()
                } else {
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

        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(InvestigationReportDetails))
