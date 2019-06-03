import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import InvestigationReport from './index'
import { actionCreator ,union} from '../../../utils/util'
import { GET_INVESTIGATIONREPORT_LIST_SUCCESS, GET_DISTRIBUTION_LIST_SUCCESS } from '../../../contants/investigationreport/reportTypes'
import Api from '../../../api/index'
import { message } from 'antd'

function mapStateToProps(state, props) {
    const { getDistributionList,
            minPageNo,
            minPageSize,
            minTotal,
            oldInvestigationReportList, 
            newInvestigationReportList, 
            total, 
            isFetch, 
            pageNo, 
            pageSize, 
            ownerBrandList = [] ,
            search
        } = state.investigationReportReducer
    const userInfo = state.loginReducer.userInfo || {};
    const investigationType = state.commonReducer.investigationType || []
    const { permissionList=[] } = state.commonReducer
    const investigationReportList = union(oldInvestigationReportList, newInvestigationReportList)
    // 属性 
    return {
        investigationReportList,
        userInfo,
        total,
        isFetch,
        pageNo,
        pageSize,
        ownerBrandList,
        getDistributionList,
        minPageNo,
        minPageSize,
        minTotal,
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
         getInvestigationReport: (oldInvestigationReportList, data) => {
            let search = {
                startTime:data.startTime,
                endTime:data.endTime,
                name:data.name,
                type:data.type,
                status:data.status,
                mobile:data.mobile,
                userName:data.userName
            }
            dispatch(actionCreator(GET_INVESTIGATIONREPORT_LIST_SUCCESS, { isFetch: true }))
            Api.getInvestigationReportList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_INVESTIGATIONREPORT_LIST_SUCCESS, { oldInvestigationReportList, newInvestigationReportList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records, isFetch: false,search:search }))
                }else{
                    dispatch(actionCreator(GET_INVESTIGATIONREPORT_LIST_SUCCESS, { isFetch: false }))
                }
            })
        },
        //获取调查员数据信息 - distribution
        getDistributionData: (data) => {
            Api.getInvestigationByPage(data).then((res)=>{
                if(res.success){
                    dispatch(actionCreator(GET_DISTRIBUTION_LIST_SUCCESS,{ getDistributionList:res.result || [],minPageNo: data.pageNo, minPageSize: data.pageSize, minTotal: res.records}))
                }else{
                    message.warning(res.msg)
                }
            })
        },
        //分配操作
        geteditInvestigationAllot:(data, oldinvestigationReportList, callback) =>{
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
                    dispatch(actionCreator(GET_INVESTIGATIONREPORT_LIST_SUCCESS, { newInvestigationReportList: result }))
                    typeof callback === 'function' && callback()
                } else {
                    dispatch(actionCreator(GET_INVESTIGATIONREPORT_LIST_SUCCESS, { oldInvestigationReportList: oldinvestigationReportList }))
                    message.error(res.msg)
                }
            })
        },
        //完结
        getFinishOperate:(data,oldinvestigationReportList,callback)=>{
            Api.editfinishStatus(data).then((res)=>{
                if (res.success) {
                    let result = [];
                    for (let i = 0; i < oldinvestigationReportList.length; i++) {
                        const element = oldinvestigationReportList[i];
                        if (element.id == data.compensableId) {
                            element.status = data.status
                        }
                        result.push(element)
                    }
                    dispatch(actionCreator(GET_INVESTIGATIONREPORT_LIST_SUCCESS, { newInvestigationReportList: result }))
                    typeof callback === 'function' && callback()
                } else {
                    dispatch(actionCreator(GET_INVESTIGATIONREPORT_LIST_SUCCESS, { oldInvestigationReportList: oldinvestigationReportList }))
                    message.error(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(InvestigationReport))
